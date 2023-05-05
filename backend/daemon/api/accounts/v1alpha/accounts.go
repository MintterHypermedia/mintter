package accounts

import (
	"bytes"
	"context"
	"errors"
	"fmt"

	"mintter/backend/core"
	accounts "mintter/backend/genproto/accounts/v1alpha"
	"mintter/backend/hyper"
	"mintter/backend/hyper/hypersql"
	"mintter/backend/logging"
	"mintter/backend/pkg/future"
	"mintter/backend/vcs"
	"mintter/backend/vcs/hlc"
	vcsdb "mintter/backend/vcs/sqlitevcs"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/ipfs/go-cid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"
)

// Profile is exposed for convenience.
type Profile = accounts.Profile

// Server implement the accounts gRPC server.
type Server struct {
	me    *future.ReadOnly[core.Identity]
	blobs *hyper.Storage
	db    *sqlitex.Pool
}

// NewServer creates a new Server.
func NewServer(id *future.ReadOnly[core.Identity], vcs *vcsdb.DB) *Server {
	return &Server{
		me:    id,
		blobs: hyper.NewStorage(vcs.DB(), logging.New("mintter/hyper", "debug")),
		db:    vcs.DB(),
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

func (srv *Server) getDelegation(ctx context.Context) (cid.Cid, error) {
	me, err := srv.getMe()
	if err != nil {
		return cid.Undef, err
	}

	var out cid.Cid

	// TODO(burdiyan): need to cache this. Makes no sense to always do this.
	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		acc := me.Account().Principal()
		dev := me.DeviceKey().Principal()

		list, err := hypersql.KeyDelegationsList(conn, acc)
		if err != nil {
			return err
		}

		for _, res := range list {
			if bytes.Equal(dev, res.KeyDelegationsViewDelegate) {
				out = cid.NewCidV1(uint64(res.KeyDelegationsViewBlobCodec), res.KeyDelegationsViewBlobsMultihash)
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

// UpdateProfile implements the corresponding gRPC method.
func (srv *Server) UpdateProfile(ctx context.Context, in *accounts.Profile) (*accounts.Account, error) {
	me, err := srv.getMe()
	if err != nil {
		return nil, err
	}

	eid := hyper.NewEntityID("mintter:account", me.Account().Principal().String())

	e, err := srv.blobs.LoadEntity(ctx, eid)
	if err != nil {
		return nil, err
	}
	if e == nil {
		panic("BUG: can't load our own profile")
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
			return nil, fmt.Errorf("failed to decode avatar %s as CID: %w", in.Avatar, err)
		}

		v, ok := e.Get("avatar")
		if !ok || !v.(cid.Cid).Equals(avatar) {
			patch["avatar"] = avatar
		}
	}

	del, err := srv.getDelegation(ctx)
	if err != nil {
		return nil, err
	}

	change, err := e.Patch(e.NextTimestamp(), me.DeviceKey(), del, patch)
	if err != nil {
		return nil, err
	}

	if err := srv.blobs.SaveBlob(ctx, change); err != nil {
		return nil, fmt.Errorf("failed to save account update change: %w", err)
	}

	return srv.GetAccount(ctx, &accounts.GetAccountRequest{})
}

// ListAccounts implements the corresponding gRPC method.
func (srv *Server) ListAccounts(ctx context.Context, in *accounts.ListAccountsRequest) (*accounts.ListAccountsResponse, error) {
	panic("TODO list accounts")

	// me, err := srv.getMe()
	// if err != nil {
	// 	return nil, err
	// }

	// conn, release, err := srv.vcsdb.Conn(ctx)
	// if err != nil {
	// 	return nil, err
	// }
	// defer release()

	// resp := &accounts.ListAccountsResponse{}

	// perma, err := vcs.EncodePermanode(vcsdb.NewAccountPermanode(me.AccountID()))
	// if err != nil {
	// 	return nil, err
	// }

	// if err := conn.WithTx(false, func() error {
	// 	accs, err := vcssql.PermanodesListByType(conn.InternalConn(), string(vcsdb.AccountType))
	// 	if err != nil {
	// 		return err
	// 	}
	// 	myAcc := conn.LookupPermanode(perma.ID)

	// 	resp.Accounts = make([]*accounts.Account, 0, len(accs))

	// 	for _, a := range accs {
	// 		if vcsdb.LocalID(a.PermanodesID) == myAcc {
	// 			continue
	// 		}

	// 		obj := cid.NewCidV1(uint64(a.PermanodeCodec), a.PermanodeMultihash)

	// 		acc, err := srv.getAccount(conn, obj, vcsdb.LocalID(a.PermanodesID))
	// 		if err != nil {
	// 			return err
	// 		}
	// 		resp.Accounts = append(resp.Accounts, acc)
	// 	}

	// 	return nil
	// }); err != nil {
	// 	return nil, err
	// }

	// // This is a hack to make tests pass. When we first connect to a peer,
	// // we won't immediately sync their account object, but we want them in the list
	// // of accounts here. So we do the additional scan using another database table
	// // to stick those pending accounts into the response.
	// //
	// // TODO(burdiyan): this is ugly as hell. Remove this in build11.
	// res, err := vcssql.AccountDevicesList(conn.InternalConn())
	// if err != nil {
	// 	return nil, err
	// }

	// meacc := me.Account().CID().String()

	// for _, r := range res {
	// 	acc := cid.NewCidV1(core.CodecAccountKey, r.AccountsMultihash).String()
	// 	did := cid.NewCidV1(core.CodecDeviceKey, r.DevicesMultihash).String()

	// 	if acc == meacc {
	// 		continue
	// 	}

	// 	idx := -1
	// 	for i, ra := range resp.Accounts {
	// 		if ra.Id == acc {
	// 			idx = i
	// 			break
	// 		}
	// 	}

	// 	if idx == -1 {
	// 		resp.Accounts = append(resp.Accounts, &accounts.Account{
	// 			Id:      acc,
	// 			Profile: &accounts.Profile{},
	// 			Devices: map[string]*accounts.Device{
	// 				did: {
	// 					DeviceId: did,
	// 				},
	// 			},
	// 		})
	// 	} else {
	// 		ra := resp.Accounts[idx]
	// 		if _, ok := ra.Devices[did]; ok {
	// 			continue
	// 		}
	// 		ra.Devices[did] = &accounts.Device{
	// 			DeviceId: did,
	// 		}
	// 	}
	// }

	// sort.Slice(resp.Accounts, func(i, j int) bool {
	// 	return resp.Accounts[i].Id < resp.Accounts[j].Id
	// })

	// return resp, nil
}

func (srv *Server) getMe() (core.Identity, error) {
	me, ok := srv.me.Get()
	if !ok {
		return core.Identity{}, status.Errorf(codes.FailedPrecondition, "account is not initialized yet")
	}
	return me, nil
}

// UpdateProfile is exposed because it's needed to update the site info. This is very bad
// and should not be this way. TODO(burdiyan): get rid of this!
func UpdateProfile(ctx context.Context, me core.Identity, db *vcsdb.DB, in *accounts.Profile) error {
	aid := me.AccountID()

	perma, err := vcs.EncodePermanode(vcsdb.NewAccountPermanode(aid))
	if err != nil {
		return err
	}

	obj := perma.ID

	conn, release, err := db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	errNoUpdate := errors.New("nothing to update")

	old := &accounts.Profile{}

	clock := hlc.NewClock()
	var heads []cid.Cid
	if err := conn.WithTx(false, func() error {
		heads, err = conn.GetHeads(obj, true)
		if err != nil {
			return err
		}

		for _, h := range heads {
			ts, err := conn.GetChangeTimestamp(h)
			if err != nil {
				return err
			}
			clock.Track(hlc.Unpack(ts))
		}

		conn.IterateChanges(obj, false, nil, func(vc vcs.VerifiedChange) error {
			if vc.Decoded.Kind != vcsdb.KindProfile {
				return nil
			}
			if err := (proto.UnmarshalOptions{Merge: true}).Unmarshal(vc.Decoded.Body, old); err != nil {
				return fmt.Errorf("unable to unmarshal profile change %s: %w", vc.Cid(), err)
			}
			return nil
		})
		return nil
	}); err != nil && !errors.Is(err, errNoUpdate) {
		return err
	}

	// Nothing to update.
	if proto.Equal(old, in) {
		return nil
	}

	data, err := proto.Marshal(in)
	if err != nil {
		return fmt.Errorf("failed to marshal profile update: %w", err)
	}

	ch := vcs.NewChange(me, obj, heads, vcsdb.KindProfile, clock.Now(), data)
	newvc, err := ch.Block()
	if err != nil {
		return err
	}
	conn.StoreChange(newvc)
	if err := conn.Err(); err != nil {
		return fmt.Errorf("failed to store profile update change: %w", err)
	}

	return conn.Err()
}
