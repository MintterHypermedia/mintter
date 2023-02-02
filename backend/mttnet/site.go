// Package mttnet exposes the site functions to be exposed over p2p.
package mttnet

import (
	"context"
	"fmt"
	"math/rand"
	site "mintter/backend/genproto/documents/v1alpha"
	"time"

	"github.com/ipfs/go-cid"
	"github.com/libp2p/go-libp2p/core/peer"
	rpcpeer "google.golang.org/grpc/peer"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// CreateInviteToken creates a new invite token for registering a new member.
func (n *rpcHandler) CreateInviteToken(ctx context.Context, in *site.CreateInviteTokenRequest) (*site.InviteToken, error) {
	// generate random number string for the token. Substitute for proper signed jwt
	randomStr := randStr(6)
	var newToken = n.hostname + ":" + randomStr
	/*
		if in.Role == site.Member_EDITOR {
			newToken += "_editor"
		} else if in.Role == site.Member_OWNER {
			newToken += "_owner"
		} else {
			newToken += "_unspecified"
		}
	*/
	if in.ExpireTime != nil && in.ExpireTime.AsTime().Before(time.Now()) {
		return &site.InviteToken{}, fmt.Errorf("expiration time must be in the future")
	}
	expirationTime := time.Now().Add(n.InviteTokenExpirationDelay)
	if in.ExpireTime != nil {
		expirationTime = in.ExpireTime.AsTime()
	}
	n.tokensDB[newToken] = tokenInfo{
		role:           in.Role,
		expirationTime: expirationTime,
	}
	return &site.InviteToken{
		Token:      newToken,
		ExpireTime: &timestamppb.Timestamp{Seconds: expirationTime.UnixNano(), Nanos: int32(expirationTime.Unix())},
	}, nil
}

// RedeemInviteToken redeems a previously created invite token to register a new member.
func (n *rpcHandler) RedeemInviteToken(ctx context.Context, in *site.RedeemInviteTokenRequest) (*site.RedeemInviteTokenResponse, error) {
	remoteDeviceID, err := getRemoteID(ctx)
	if err != nil {
		return &site.RedeemInviteTokenResponse{}, err
	}
	acc, err := n.Node.AccountForDevice(ctx, remoteDeviceID)
	if err != nil {
		return &site.RedeemInviteTokenResponse{}, err
	}
	if in.AccountId != "" && acc.String() != in.AccountId {
		return &site.RedeemInviteTokenResponse{}, fmt.Errorf("provided account ID does not match with observed p2p accountID")
	}
	if in.Token == "" { //TODO substitute with proper regexp match
		return &site.RedeemInviteTokenResponse{}, fmt.Errorf("invalid token format")
	}

	tokenInfo, valid := n.tokensDB[in.Token]
	if !valid {
		return &site.RedeemInviteTokenResponse{}, fmt.Errorf("token not valid (nonexisting, already redeemed or expired)")
	}
	if tokenInfo.expirationTime.Before(time.Now()) {
		delete(n.tokensDB, in.Token)
		return &site.RedeemInviteTokenResponse{}, fmt.Errorf("expired token")
	}
	// redeem the token
	delete(n.tokensDB, in.Token)

	// We upsert the new role
	n.accountsDB[acc.String()] = tokenInfo.role
	return &site.RedeemInviteTokenResponse{}, nil
}

// GetSiteInfo Gets public-facing site information.
func (n *rpcHandler) GetSiteInfo(ctx context.Context, in *site.GetSiteInfoRequest) (*site.SiteInfo, error) {
	return &site.SiteInfo{}, fmt.Errorf("Endpoint not implemented yet")
}

// UpdateSiteInfo updates public-facing site information. Doesn't support partial updates, hence all the fields must be provided.
func (n *rpcHandler) UpdateSiteInfo(ctx context.Context, in *site.UpdateSiteInfoRequest) (*site.SiteInfo, error) {
	return &site.SiteInfo{}, fmt.Errorf("Endpoint not implemented yet")
}

// ListMembers lists registered members on the site.
func (n *rpcHandler) ListMembers(ctx context.Context, in *site.ListMembersRequest) (*site.ListMembersResponse, error) {
	return &site.ListMembersResponse{}, fmt.Errorf("Endpoint not implemented yet")
}

// GetMember gets information about a specific member.
func (n *rpcHandler) GetMember(ctx context.Context, in *site.GetMemberRequest) (*site.Member, error) {
	return &site.Member{}, fmt.Errorf("Endpoint not implemented yet")
}

// DeleteMember deletes an existing member.
func (n *rpcHandler) DeleteMember(ctx context.Context, in *site.DeleteMemberRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, fmt.Errorf("Endpoint not implemented yet")
}

// PublishDocument publishes and lists the document to the public web site.
func (n *rpcHandler) PublishDocument(ctx context.Context, in *site.PublishDocumentRequest) (*site.PublishDocumentResponse, error) {
	device, err := getRemoteID(ctx)
	if err != nil {
		return nil, err
	}
	role, err := n.getDeviceRole(ctx, device)
	if err != nil {
		return &site.PublishDocumentResponse{}, err
	}
	if role == site.Member_ROLE_UNSPECIFIED {
		return &site.PublishDocumentResponse{}, fmt.Errorf("Your current role does not allow to publish")
	}
	return &site.PublishDocumentResponse{}, nil
}

// UnpublishDocument un-publishes (un-lists) a given document.
func (n *rpcHandler) UnpublishDocument(ctx context.Context, in *site.UnpublishDocumentRequest) (*site.UnpublishDocumentResponse, error) {
	return &site.UnpublishDocumentResponse{}, fmt.Errorf("Endpoint not implemented yet")
}

// ListWebPublications lists all the published documents.
func (n *rpcHandler) ListWebPublications(ctx context.Context, in *site.ListWebPublicationsRequest) (*site.ListWebPublicationsResponse, error) {
	return &site.ListWebPublicationsResponse{}, fmt.Errorf("Endpoint not implemented yet")
}

// getRemoteID gets the remote peer id if there is an opened p2p connection between them with context ctx.
func getRemoteID(ctx context.Context) (cid.Cid, error) {
	info, ok := rpcpeer.FromContext(ctx)
	if !ok {
		return cid.Cid{}, fmt.Errorf("BUG: no peer info in context for grpc")
	}

	pid, err := peer.Decode(info.Addr.String())
	if err != nil {
		return cid.Cid{}, err
	}

	return peer.ToCid(pid), nil
}

func (n *rpcHandler) getDeviceRole(ctx context.Context, remoteDeviceID cid.Cid) (site.Member_Role, error) {
	acc, err := n.Node.AccountForDevice(ctx, remoteDeviceID)
	if err != nil {
		return site.Member_ROLE_UNSPECIFIED, err
	}
	role, ok := n.accountsDB[acc.String()]
	if !ok {
		return site.Member_ROLE_UNSPECIFIED, nil
	}
	return role, nil
}

func randStr(nchar int) string {
	rand.Seed(time.Now().UnixNano())
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, nchar)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
