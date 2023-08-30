// Package groups implements the groups service.
package groups

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"mintter/backend/core"
	groups "mintter/backend/genproto/groups/v1alpha"
	p2p "mintter/backend/genproto/p2p/v1alpha"
	"mintter/backend/hlc"
	"mintter/backend/hyper"
	"mintter/backend/hyper/hypersql"
	"mintter/backend/mttnet"
	"mintter/backend/mttnet/sitesql"
	"mintter/backend/pkg/errutil"
	"mintter/backend/pkg/future"
	"mintter/backend/pkg/maputil"
	"strings"
	"time"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/ipfs/go-cid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Server is the implementation of the groups service.
type Server struct {
	me    *future.ReadOnly[core.Identity]
	blobs *hyper.Storage
	node  *future.ReadOnly[*mttnet.Node]
}

// NewServer creates a new groups server.
func NewServer(me *future.ReadOnly[core.Identity], blobs *hyper.Storage, node *future.ReadOnly[*mttnet.Node]) *Server {
	return &Server{
		me:    me,
		blobs: blobs,
		node:  node,
	}
}

// CreateGroup creates a new group.
func (srv *Server) CreateGroup(ctx context.Context, in *groups.CreateGroupRequest) (*groups.Group, error) {
	if in.Title == "" {
		return nil, errutil.MissingArgument("title")
	}

	me, err := srv.getMe()
	if err != nil {
		return nil, err
	}

	clock := hlc.NewClock()
	ts := clock.Now()
	createTime := ts.Time().Unix()

	id, nonce := hyper.NewUnforgeableID(me.Account().Principal(), nil, createTime)
	eid := hyper.EntityID("hd://g/" + id)
	e := hyper.NewEntityWithClock(eid, clock)

	patch := map[string]any{
		"nonce":      nonce,
		"title":      in.Title,
		"createTime": int(createTime),
		"owner":      []byte(me.Account().Principal()),
	}
	if in.Description != "" {
		patch["description"] = in.Description
	}

	if in.Members != nil {
		return nil, status.Errorf(codes.Unimplemented, "adding members when creating a group is not implemented yet")
	}

	del, err := srv.getDelegation(ctx)
	if err != nil {
		return nil, err
	}
	hb, err := e.CreateChange(ts, me.DeviceKey(), del, patch, hyper.WithAction("Create"))
	if err != nil {
		return nil, err
	}

	if err := srv.blobs.SaveBlob(ctx, hb); err != nil {
		return nil, err
	}

	return groupToProto(srv.blobs, e)
}

// GetGroup gets a group.
func (srv *Server) GetGroup(ctx context.Context, in *groups.GetGroupRequest) (*groups.Group, error) {
	if in.Id == "" {
		return nil, errutil.MissingArgument("id")
	}

	eid := hyper.EntityID(in.Id)

	var e *hyper.Entity
	if in.Version == "" {
		v, err := srv.blobs.LoadEntity(ctx, eid)
		if err != nil {
			return nil, err
		}
		e = v
	} else {
		heads, err := hyper.Version(in.Version).Parse()
		if err != nil {
			return nil, err
		}

		v, err := srv.blobs.LoadEntityFromHeads(ctx, eid, heads...)
		if err != nil {
			return nil, err
		}
		e = v
	}

	return groupToProto(srv.blobs, e)
}

// UpdateGroup updates a group.
func (srv *Server) UpdateGroup(ctx context.Context, in *groups.UpdateGroupRequest) (*groups.Group, error) {
	if in.Id == "" {
		return nil, errutil.MissingArgument("id")
	}

	me, err := srv.getMe()
	if err != nil {
		return nil, err
	}

	eid := hyper.EntityID(in.Id)
	e, err := srv.blobs.LoadEntity(ctx, eid)
	if err != nil {
		return nil, err
	}

	patch := map[string]any{}

	if in.Title != "" {
		v, ok := e.Get("title")
		if !ok {
			return nil, fmt.Errorf("all groups must have title")
		}

		if v.(string) != in.Title {
			patch["title"] = in.Title
		}
	}

	{
		old, ok := e.Get("description")
		if !ok || old.(string) != in.Description {
			patch["description"] = in.Description
		}
	}

	for k, v := range in.UpdatedContent {
		oldv, ok := e.Get("content", k)
		if !ok || oldv.(string) != v {
			maputil.Set(patch, []string{"content", k}, v)
		}
	}

	for k, v := range in.UpdatedMembers {
		if v == groups.Role_ROLE_UNSPECIFIED {
			return nil, status.Errorf(codes.Unimplemented, "removing members is not implemented yet")
		}
		maputil.Set(patch, []string{"members", k}, int64(v))
	}

	del, err := srv.getDelegation(ctx)
	if err != nil {
		return nil, err
	}

	hb, err := e.CreateChange(e.NextTimestamp(), me.DeviceKey(), del, patch, hyper.WithAction("Update"))
	if err != nil {
		return nil, err
	}

	if err := srv.blobs.SaveBlob(ctx, hb); err != nil {
		return nil, err
	}

	return groupToProto(srv.blobs, e)
}

// ListGroups lists groups.
func (srv *Server) ListGroups(ctx context.Context, in *groups.ListGroupsRequest) (*groups.ListGroupsResponse, error) {
	entities, err := srv.blobs.ListEntities(ctx, "hd://g/")
	if err != nil {
		return nil, err
	}

	resp := &groups.ListGroupsResponse{
		Groups: make([]*groups.Group, 0, len(entities)),
	}

	for _, e := range entities {
		pub, err := srv.GetGroup(ctx, &groups.GetGroupRequest{
			Id: string(e),
		})
		if err != nil {
			continue
		}
		resp.Groups = append(resp.Groups, pub)
	}

	return resp, nil
}

// ListContent lists content of a group.
func (srv *Server) ListContent(ctx context.Context, in *groups.ListContentRequest) (*groups.ListContentResponse, error) {
	if in.Id == "" {
		return nil, errutil.MissingArgument("id")
	}

	eid := hyper.EntityID(in.Id)

	var e *hyper.Entity
	if in.Version == "" {
		v, err := srv.blobs.LoadEntity(ctx, eid)
		if err != nil {
			return nil, err
		}
		e = v
	} else {
		heads, err := hyper.Version(in.Version).Parse()
		if err != nil {
			return nil, err
		}

		v, err := srv.blobs.LoadEntityFromHeads(ctx, eid, heads...)
		if err != nil {
			return nil, err
		}
		e = v
	}

	paths := e.State().Keys("content")

	out := &groups.ListContentResponse{
		Content: make(map[string]string, len(paths)),
	}

	for _, p := range paths {
		v, ok := e.Get("content", p)
		if !ok {
			panic("BUG: no content for key " + p)
		}

		out.Content[p] = v.(string)
	}

	return out, nil
}

// ListMembers lists members of a group.
func (srv *Server) ListMembers(ctx context.Context, in *groups.ListMembersRequest) (*groups.ListMembersResponse, error) {
	if in.Id == "" {
		return nil, errutil.MissingArgument("id")
	}

	if in.Version != "" {
		return nil, status.Errorf(codes.Unimplemented, "listing members for groups at a specific version is not implemented yet")
	}

	resp := &groups.ListMembersResponse{}

	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		edb, err := hypersql.EntitiesLookupID(conn, in.Id)
		if err != nil {
			return err
		}
		if edb.EntitiesID == 0 {
			return fmt.Errorf("group %q not found", in.Id)
		}

		owner, err := hypersql.ResourceGetOwner(conn, edb.EntitiesID)
		if err != nil {
			return err
		}

		ownerPub, err := hypersql.PublicKeysLookupPrincipal(conn, owner)
		if err != nil {
			return err
		}

		resp.OwnerAccountId = core.Principal(ownerPub.PublicKeysPrincipal).String()

		return hypersql.GroupListMembers(conn, edb.EntitiesID, owner, func(principal []byte, role int64) error {
			if resp.Members == nil {
				resp.Members = make(map[string]groups.Role)
			}

			p, r := core.Principal(principal).String(), groups.Role(role)
			if r == groups.Role_ROLE_UNSPECIFIED {
				delete(resp.Members, p)
			} else {
				resp.Members[p] = r
			}

			return nil
		})
	}); err != nil {
		return nil, err
	}

	return resp, nil
}

// GetSiteInfo gets information of a local site.
func (srv *Server) GetSiteInfo(ctx context.Context, in *groups.GetSiteInfoRequest) (*groups.GetSiteInfoResponse, error) {
	ret := &groups.GetSiteInfoResponse{}
	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		res, err := sitesql.GetSiteInfo(conn, in.Hostname)
		if err != nil {
			return fmt.Errorf("No site info available: %w", err)
		}
		ret.GroupId = res.EntitiesEID
		if res.ServedSitesVersion != "" {
			ret.Version = res.ServedSitesVersion
		} else {
			entity, err := srv.blobs.LoadEntity(ctx, hyper.EntityID(res.EntitiesEID))
			if err != nil {
				return fmt.Errorf("could not get entity [%s]: %w", res.EntitiesEID, err)
			}
			ret.Version = entity.Version().String()
		}

		ret.OwnerId = core.Principal(res.PublicKeysPrincipal).String()
		return nil
	}); err != nil {
		return nil, err
	}
	return ret, nil
}

// ConvertToSite converts a group into a site. P2P group will still work as usual after this call.
func (srv *Server) ConvertToSite(ctx context.Context, in *groups.ConvertToSiteRequest) (*groups.ConvertToSiteResponse, error) {
	n, ok := srv.node.Get()
	if !ok {
		return nil, fmt.Errorf("node not ready yet")
	}

	remoteHostname := strings.Split(in.Link, "/secret-invite/")[0]

	info, err := mttnet.GetSiteAddressFromHeaders(remoteHostname)
	if err != nil {
		return nil, fmt.Errorf("Could not get site [%s] info via http: %w", remoteHostname, err)
	}

	if err := n.Connect(ctx, info); err != nil {
		return nil, fmt.Errorf("failed to connect to site [%s] with peer info [%s]: %w", remoteHostname, info.String(), err)
	}
	client, err := n.Client(ctx, info.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get a p2p client with node [%s]: %w", info.ID.String(), err)
	}
	res, err := client.CreateSite(ctx, &p2p.CreateSiteRequest{
		Link:    in.Link,
		GroupId: in.GroupId,
		Version: in.Version,
	})
	if err != nil {
		return nil, fmt.Errorf("Failed to create a remote site: %w", err)
	}

	return &groups.ConvertToSiteResponse{
		OwnerId:  res.OwnerId,
		Hostname: remoteHostname,
	}, nil
}

// ListDocumentGroups lists groups that a document belongs to.
func (srv *Server) ListDocumentGroups(ctx context.Context, in *groups.ListDocumentGroupsRequest) (*groups.ListDocumentGroupsResponse, error) {
	if in.DocumentId == "" {
		return nil, errutil.MissingArgument("documentId")
	}

	resp := &groups.ListDocumentGroupsResponse{}

	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		const q = `
			SELECT
				lookup.value AS entity,
				blobs.codec AS codec,
				blobs.multihash AS hash,
				blob_attrs.anchor AS anchor,
				blob_attrs.extra AS extra,
				blob_attrs.ts AS ts
			FROM blob_attrs
			JOIN changes ON changes.blob = blob_attrs.blob
			JOIN lookup ON lookup.id = changes.entity
			JOIN blobs ON blob_attrs.blob = blobs.id
			WHERE blob_attrs.key = 'group/content'
			AND blob_attrs.value_ptr IS NOT NULL
			AND blob_attrs.value_ptr = :document
		`

		edb, err := hypersql.EntitiesLookupID(conn, in.DocumentId)
		if err != nil {
			return err
		}
		if edb.EntitiesID == 0 {
			return fmt.Errorf("document %q not found: make sure to specify fully-qualified entity ID", in.DocumentId)
		}

		if err := sqlitex.Exec(conn, q, func(stmt *sqlite.Stmt) error {
			var (
				entity string
				codec  int64
				hash   []byte
				anchor string
				extra  []byte
				ts     int64
			)
			stmt.Scan(&entity, &codec, &hash, &anchor, &extra, &ts)

			var ld hyper.LinkData
			if err := json.Unmarshal(extra, &ld); err != nil {
				return err
			}

			var sb strings.Builder
			sb.WriteString(in.DocumentId)

			if ld.TargetVersion != "" {
				sb.WriteString("?v=")
				sb.WriteString(ld.TargetVersion)
			}

			if ld.TargetFragment != "" {
				sb.WriteString("#")
				sb.WriteString(ld.TargetFragment)
			}

			rawURL := sb.String()

			item := &groups.ListDocumentGroupsResponse_Item{
				GroupId:     entity,
				GroupChange: cid.NewCidV1(uint64(codec), hash).String(),
				ChangeTime:  timestamppb.New(time.UnixMicro(ts)),
				Path:        anchor,
				RawUrl:      rawURL,
			}

			resp.Items = append(resp.Items, item)
			return nil
		}, edb.EntitiesID); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return resp, nil
}

// ListAccountGroups lists groups that an account belongs to.
func (srv *Server) ListAccountGroups(ctx context.Context, in *groups.ListAccountGroupsRequest) (*groups.ListAccountGroupsResponse, error) {
	if in.AccountId == "" {
		return nil, errutil.MissingArgument("accountId")
	}

	acc, err := core.DecodePrincipal(in.AccountId)
	if err != nil {
		return nil, err
	}

	resp := &groups.ListAccountGroupsResponse{}

	if err := srv.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		accdb, err := hypersql.PublicKeysLookupID(conn, acc)
		if err != nil {
			return err
		}

		if accdb.PublicKeysID == 0 {
			return fmt.Errorf("account %q not found", in.AccountId)
		}

		// This query assumes that we've indexed only valid changes,
		// i.e. group members are only mutated by the owner.
		// TODO(burdiyan): support member removals and make sure to query
		// only valid changes.
		const q = `
			SELECT
				lookup.value AS entity,
				blob_attrs.extra AS role,
				MAX(blob_attrs.ts) AS ts
			FROM blob_attrs
			JOIN changes ON changes.blob = blob_attrs.blob
			JOIN lookup ON lookup.id = changes.entity
			WHERE blob_attrs.key = 'group/member'
			AND blob_attrs.value_ptr IS NOT NULL
			AND blob_attrs.value_ptr = :member
			GROUP BY changes.entity
		`

		if err := sqlitex.Exec(conn, q, func(stmt *sqlite.Stmt) error {
			var (
				group string
				role  int64
			)

			stmt.Scan(&group, &role)

			// TODO(burdiyan): this is really bad. Just use the database to get this info.
			g, err := srv.GetGroup(ctx, &groups.GetGroupRequest{
				Id: group,
			})
			if err != nil {
				return err
			}

			resp.Items = append(resp.Items, &groups.ListAccountGroupsResponse_Item{
				Group: g,
				Role:  groups.Role(role),
			})

			return nil
		}, accdb.PublicKeysID); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return resp, nil
}

func groupToProto(blobs *hyper.Storage, e *hyper.Entity) (*groups.Group, error) {
	createTime, ok := e.AppliedChanges()[0].Data.Patch["createTime"].(int)
	if !ok {
		return nil, fmt.Errorf("group entity doesn't have createTime field")
	}

	owner, ok := e.AppliedChanges()[0].Data.Patch["owner"].([]byte)
	if !ok {
		return nil, fmt.Errorf("group entity doesn't have owner field")
	}

	gpb := &groups.Group{
		Id:             string(e.ID()),
		CreateTime:     timestamppb.New(time.Unix(int64(createTime), 0)),
		OwnerAccountId: core.Principal(owner).String(),
		Version:        e.Version().String(),
		UpdateTime:     timestamppb.New(e.LastChangeTime().Time()),
	}

	{
		v, ok := e.Get("title")
		if !ok {
			return nil, fmt.Errorf("group entity must have title")
		}
		gpb.Title = v.(string)
	}

	{
		v, ok := e.Get("description")
		if ok {
			gpb.Description = v.(string)
		}
	}

	return gpb, nil
}

func (srv *Server) getMe() (core.Identity, error) {
	me, ok := srv.me.Get()
	if !ok {
		return core.Identity{}, status.Errorf(codes.FailedPrecondition, "account is not initialized yet")
	}
	return me, nil
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
