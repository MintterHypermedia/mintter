package accounts

import (
	"bytes"
	"context"
	"fmt"
	"strings"

	"mintter/backend/core"
	accounts "mintter/backend/genproto/accounts/v1alpha"
	"mintter/backend/hyper"
	"mintter/backend/hyper/hypersql"
	"mintter/backend/pkg/future"

	"crawshaw.io/sqlite"
	"github.com/ipfs/go-cid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Profile is exposed for convenience.
type Profile = accounts.Profile

// Server implement the accounts gRPC server.
type Server struct {
	me    *future.ReadOnly[core.Identity]
	blobs *hyper.Storage
}

// NewServer creates a new Server.
func NewServer(id *future.ReadOnly[core.Identity], blobs *hyper.Storage) *Server {
	return &Server{
		me:    id,
		blobs: blobs,
	}
}

// GetAccount implements the corresponding gRPC method.
func (srv *Server) GetAccount(ctx context.Context, in *accounts.GetAccountRequest) (*accounts.Account, error) {
	if srv == nil {
		return nil, status.Errorf(codes.FailedPrecondition, "account is not initialized yet")
	}

	var aid core.Principal
	wantMe := in.Id == ""
	if wantMe {
		me, err := srv.getMe()
		if err != nil {
			return nil, err
		}
		aid = me.Account().Principal()
	} else {
		p, err := core.DecodePrincipal(in.Id)
		if err != nil {
			return nil, status.Errorf(codes.InvalidArgument, "can't decode Account ID: %v", err)
		}
		aid = p
	}

	aids := aid.String()

	acc := &accounts.Account{
		Id:      aids,
		Profile: &accounts.Profile{},
		Devices: make(map[string]*accounts.Device),
	}

	entity, err := srv.blobs.LoadEntity(ctx, hyper.NewEntityID("mintter:account", aids))
	if err != nil {
		return nil, err
	}
	if entity == nil && !wantMe {
		return nil, status.Errorf(codes.NotFound, "account %s not found", aids)
	}

	if entity != nil {
		v, ok := entity.Get("alias")
		if ok {
			acc.Profile.Alias = v.(string)
		}

		v, ok = entity.Get("bio")
		if ok {
			acc.Profile.Bio = v.(string)
		}

		v, ok = entity.Get("avatar")
		if ok {
			acc.Profile.Avatar = v.(cid.Cid).String()
		}
	}

	// Now load known key delegations from this account.
	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		list, err := hypersql.KeyDelegationsList(conn, aid)
		if err != nil {
			return err
		}

		for _, res := range list {
			del := core.Principal(res.KeyDelegationsViewDelegate)
			pid, err := del.PeerID()
			if err != nil {
				return err
			}
			pids := pid.String()
			acc.Devices[pids] = &accounts.Device{
				DeviceId: pids,
			}
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return acc, nil
}

func getDelegation(ctx context.Context, me core.Identity, blobs *hyper.Storage) (cid.Cid, error) {
	var out cid.Cid

	// TODO(burdiyan): need to cache this. Makes no sense to always do this.
	if err := blobs.Query(ctx, func(conn *sqlite.Conn) error {
		acc := me.Account().Principal()
		dev := me.DeviceKey().Principal()

		list, err := hypersql.KeyDelegationsList(conn, acc)
		if err != nil {
			return err
		}

		for _, res := range list {
			if bytes.Equal(dev, res.KeyDelegationsViewDelegate) {
				out = cid.NewCidV1(uint64(res.KeyDelegationsViewBlobCodec), res.KeyDelegationsViewBlobMultihash)
				return nil
			}
		}

		return nil
	}); err != nil {
		return cid.Undef, err
	}

	if !out.Defined() {
		return out, fmt.Errorf("BUG: failed to find our own key delegation")
	}

	return out, nil
}

func (srv *Server) getDelegation(ctx context.Context) (cid.Cid, error) {
	me, err := srv.getMe()
	if err != nil {
		return cid.Undef, err
	}

	return getDelegation(ctx, me, srv.blobs)
}

// UpdateProfile implements the corresponding gRPC method.
func (srv *Server) UpdateProfile(ctx context.Context, in *accounts.Profile) (*accounts.Account, error) {
	me, err := srv.getMe()
	if err != nil {
		return nil, err
	}

	if err := UpdateProfile(ctx, me, srv.blobs, in); err != nil {
		return nil, err
	}

	return srv.GetAccount(ctx, &accounts.GetAccountRequest{})
}

func UpdateProfile(ctx context.Context, me core.Identity, blobs *hyper.Storage, in *accounts.Profile) error {
	eid := hyper.NewEntityID("mintter:account", me.Account().Principal().String())

	e, err := blobs.LoadEntity(ctx, eid)
	if err != nil {
		return err
	}
	// The first profile update won't have any changes yet for the entity.
	if e == nil {
		e = hyper.NewEntity(eid)
	}

	patch := map[string]any{}

	v, ok := e.Get("alias")
	if !ok || v.(string) != in.Alias {
		patch["alias"] = in.Alias
	}

	v, ok = e.Get("bio")
	if !ok || v.(string) != in.Bio {
		patch["bio"] = in.Bio
	}

	if in.Avatar != "" {
		avatar, err := cid.Decode(in.Avatar)
		if err != nil {
			return fmt.Errorf("failed to decode avatar %s as CID: %w", in.Avatar, err)
		}

		v, ok := e.Get("avatar")
		if !ok || !v.(cid.Cid).Equals(avatar) {
			patch["avatar"] = avatar
		}
	}

	del, err := getDelegation(ctx, me, blobs)
	if err != nil {
		return err
	}

	change, err := e.CreateChange(e.NextTimestamp(), me.DeviceKey(), del, patch)
	if err != nil {
		return err
	}

	if err := blobs.SaveBlob(ctx, change); err != nil {
		return fmt.Errorf("failed to save account update change: %w", err)
	}

	return nil
}

// ListAccounts implements the corresponding gRPC method.
func (srv *Server) ListAccounts(ctx context.Context, in *accounts.ListAccountsRequest) (*accounts.ListAccountsResponse, error) {
	me, err := srv.me.Await(ctx)
	if err != nil {
		return nil, err
	}

	entities, err := srv.blobs.ListEntities(ctx, "mintter:account:")
	if err != nil {
		return nil, err
	}

	mine := me.Account().String()

	resp := &accounts.ListAccountsResponse{
		Accounts: make([]*accounts.Account, 0, len(entities)-1), // all except our own account.
	}

	for _, e := range entities {
		aid := strings.TrimPrefix(string(e), "mintter:account:")
		if aid == mine {
			continue
		}

		draft, err := srv.GetAccount(ctx, &accounts.GetAccountRequest{
			Id: aid,
		})
		if err != nil {
			continue
		}
		resp.Accounts = append(resp.Accounts, draft)
	}

	return resp, nil
}

func (srv *Server) getMe() (core.Identity, error) {
	me, ok := srv.me.Get()
	if !ok {
		return core.Identity{}, status.Errorf(codes.FailedPrecondition, "account is not initialized yet")
	}
	return me, nil
}
