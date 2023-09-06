// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: groups/v1alpha/groups.proto

package groups

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// GroupsClient is the client API for Groups service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type GroupsClient interface {
	// Creates a new group.
	CreateGroup(ctx context.Context, in *CreateGroupRequest, opts ...grpc.CallOption) (*Group, error)
	// Gets a group by ID.
	GetGroup(ctx context.Context, in *GetGroupRequest, opts ...grpc.CallOption) (*Group, error)
	// Updates a group.
	UpdateGroup(ctx context.Context, in *UpdateGroupRequest, opts ...grpc.CallOption) (*Group, error)
	// Lists members of a group.
	ListMembers(ctx context.Context, in *ListMembersRequest, opts ...grpc.CallOption) (*ListMembersResponse, error)
	// Lists content of a group.
	ListContent(ctx context.Context, in *ListContentRequest, opts ...grpc.CallOption) (*ListContentResponse, error)
	// Lists groups.
	ListGroups(ctx context.Context, in *ListGroupsRequest, opts ...grpc.CallOption) (*ListGroupsResponse, error)
	// Converts a group to a site. P2P group will continue to work.
	ConvertToSite(ctx context.Context, in *ConvertToSiteRequest, opts ...grpc.CallOption) (*ConvertToSiteResponse, error)
	// Lists groups that a document is published to.
	ListDocumentGroups(ctx context.Context, in *ListDocumentGroupsRequest, opts ...grpc.CallOption) (*ListDocumentGroupsResponse, error)
	// Lists groups that an account is a member of.
	ListAccountGroups(ctx context.Context, in *ListAccountGroupsRequest, opts ...grpc.CallOption) (*ListAccountGroupsResponse, error)
}

type groupsClient struct {
	cc grpc.ClientConnInterface
}

func NewGroupsClient(cc grpc.ClientConnInterface) GroupsClient {
	return &groupsClient{cc}
}

func (c *groupsClient) CreateGroup(ctx context.Context, in *CreateGroupRequest, opts ...grpc.CallOption) (*Group, error) {
	out := new(Group)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/CreateGroup", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) GetGroup(ctx context.Context, in *GetGroupRequest, opts ...grpc.CallOption) (*Group, error) {
	out := new(Group)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/GetGroup", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) UpdateGroup(ctx context.Context, in *UpdateGroupRequest, opts ...grpc.CallOption) (*Group, error) {
	out := new(Group)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/UpdateGroup", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ListMembers(ctx context.Context, in *ListMembersRequest, opts ...grpc.CallOption) (*ListMembersResponse, error) {
	out := new(ListMembersResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ListMembers", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ListContent(ctx context.Context, in *ListContentRequest, opts ...grpc.CallOption) (*ListContentResponse, error) {
	out := new(ListContentResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ListContent", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ListGroups(ctx context.Context, in *ListGroupsRequest, opts ...grpc.CallOption) (*ListGroupsResponse, error) {
	out := new(ListGroupsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ListGroups", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ConvertToSite(ctx context.Context, in *ConvertToSiteRequest, opts ...grpc.CallOption) (*ConvertToSiteResponse, error) {
	out := new(ConvertToSiteResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ConvertToSite", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ListDocumentGroups(ctx context.Context, in *ListDocumentGroupsRequest, opts ...grpc.CallOption) (*ListDocumentGroupsResponse, error) {
	out := new(ListDocumentGroupsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ListDocumentGroups", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *groupsClient) ListAccountGroups(ctx context.Context, in *ListAccountGroupsRequest, opts ...grpc.CallOption) (*ListAccountGroupsResponse, error) {
	out := new(ListAccountGroupsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Groups/ListAccountGroups", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// GroupsServer is the server API for Groups service.
// All implementations should embed UnimplementedGroupsServer
// for forward compatibility
type GroupsServer interface {
	// Creates a new group.
	CreateGroup(context.Context, *CreateGroupRequest) (*Group, error)
	// Gets a group by ID.
	GetGroup(context.Context, *GetGroupRequest) (*Group, error)
	// Updates a group.
	UpdateGroup(context.Context, *UpdateGroupRequest) (*Group, error)
	// Lists members of a group.
	ListMembers(context.Context, *ListMembersRequest) (*ListMembersResponse, error)
	// Lists content of a group.
	ListContent(context.Context, *ListContentRequest) (*ListContentResponse, error)
	// Lists groups.
	ListGroups(context.Context, *ListGroupsRequest) (*ListGroupsResponse, error)
	// Converts a group to a site. P2P group will continue to work.
	ConvertToSite(context.Context, *ConvertToSiteRequest) (*ConvertToSiteResponse, error)
	// Lists groups that a document is published to.
	ListDocumentGroups(context.Context, *ListDocumentGroupsRequest) (*ListDocumentGroupsResponse, error)
	// Lists groups that an account is a member of.
	ListAccountGroups(context.Context, *ListAccountGroupsRequest) (*ListAccountGroupsResponse, error)
}

// UnimplementedGroupsServer should be embedded to have forward compatible implementations.
type UnimplementedGroupsServer struct {
}

func (UnimplementedGroupsServer) CreateGroup(context.Context, *CreateGroupRequest) (*Group, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateGroup not implemented")
}
func (UnimplementedGroupsServer) GetGroup(context.Context, *GetGroupRequest) (*Group, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetGroup not implemented")
}
func (UnimplementedGroupsServer) UpdateGroup(context.Context, *UpdateGroupRequest) (*Group, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateGroup not implemented")
}
func (UnimplementedGroupsServer) ListMembers(context.Context, *ListMembersRequest) (*ListMembersResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMembers not implemented")
}
func (UnimplementedGroupsServer) ListContent(context.Context, *ListContentRequest) (*ListContentResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListContent not implemented")
}
func (UnimplementedGroupsServer) ListGroups(context.Context, *ListGroupsRequest) (*ListGroupsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListGroups not implemented")
}
func (UnimplementedGroupsServer) ConvertToSite(context.Context, *ConvertToSiteRequest) (*ConvertToSiteResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ConvertToSite not implemented")
}
func (UnimplementedGroupsServer) ListDocumentGroups(context.Context, *ListDocumentGroupsRequest) (*ListDocumentGroupsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListDocumentGroups not implemented")
}
func (UnimplementedGroupsServer) ListAccountGroups(context.Context, *ListAccountGroupsRequest) (*ListAccountGroupsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListAccountGroups not implemented")
}

// UnsafeGroupsServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to GroupsServer will
// result in compilation errors.
type UnsafeGroupsServer interface {
	mustEmbedUnimplementedGroupsServer()
}

func RegisterGroupsServer(s grpc.ServiceRegistrar, srv GroupsServer) {
	s.RegisterService(&Groups_ServiceDesc, srv)
}

func _Groups_CreateGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateGroupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).CreateGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/CreateGroup",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).CreateGroup(ctx, req.(*CreateGroupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_GetGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetGroupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).GetGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/GetGroup",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).GetGroup(ctx, req.(*GetGroupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_UpdateGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateGroupRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).UpdateGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/UpdateGroup",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).UpdateGroup(ctx, req.(*UpdateGroupRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ListMembers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMembersRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ListMembers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ListMembers",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ListMembers(ctx, req.(*ListMembersRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ListContent_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListContentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ListContent(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ListContent",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ListContent(ctx, req.(*ListContentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ListGroups_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListGroupsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ListGroups(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ListGroups",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ListGroups(ctx, req.(*ListGroupsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ConvertToSite_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ConvertToSiteRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ConvertToSite(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ConvertToSite",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ConvertToSite(ctx, req.(*ConvertToSiteRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ListDocumentGroups_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListDocumentGroupsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ListDocumentGroups(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ListDocumentGroups",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ListDocumentGroups(ctx, req.(*ListDocumentGroupsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Groups_ListAccountGroups_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListAccountGroupsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GroupsServer).ListAccountGroups(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Groups/ListAccountGroups",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GroupsServer).ListAccountGroups(ctx, req.(*ListAccountGroupsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Groups_ServiceDesc is the grpc.ServiceDesc for Groups service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Groups_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.groups.v1alpha.Groups",
	HandlerType: (*GroupsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateGroup",
			Handler:    _Groups_CreateGroup_Handler,
		},
		{
			MethodName: "GetGroup",
			Handler:    _Groups_GetGroup_Handler,
		},
		{
			MethodName: "UpdateGroup",
			Handler:    _Groups_UpdateGroup_Handler,
		},
		{
			MethodName: "ListMembers",
			Handler:    _Groups_ListMembers_Handler,
		},
		{
			MethodName: "ListContent",
			Handler:    _Groups_ListContent_Handler,
		},
		{
			MethodName: "ListGroups",
			Handler:    _Groups_ListGroups_Handler,
		},
		{
			MethodName: "ConvertToSite",
			Handler:    _Groups_ConvertToSite_Handler,
		},
		{
			MethodName: "ListDocumentGroups",
			Handler:    _Groups_ListDocumentGroups_Handler,
		},
		{
			MethodName: "ListAccountGroups",
			Handler:    _Groups_ListAccountGroups_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "groups/v1alpha/groups.proto",
}
