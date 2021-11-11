// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package documents

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// DraftsClient is the client API for Drafts service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type DraftsClient interface {
	// Creates a new draft with a new permanent document ID.
	CreateDraft(ctx context.Context, in *CreateDraftRequest, opts ...grpc.CallOption) (*Document, error)
	// Deletes a draft by its document ID.
	DeleteDraft(ctx context.Context, in *DeleteDraftRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// Gets a single draft if exists.
	GetDraft(ctx context.Context, in *GetDraftRequest, opts ...grpc.CallOption) (*Document, error)
	// Updates a draft instance. Supports partial updates.
	UpdateDraft(ctx context.Context, in *UpdateDraftRequest, opts ...grpc.CallOption) (*Document, error)
	// List currently stored drafts.
	ListDrafts(ctx context.Context, in *ListDraftsRequest, opts ...grpc.CallOption) (*ListDraftsResponse, error)
	// Publishes a draft. I.e. draft will become a publication, and will no longer appear in drafts section.
	PublishDraft(ctx context.Context, in *PublishDraftRequest, opts ...grpc.CallOption) (*Publication, error)
}

type draftsClient struct {
	cc grpc.ClientConnInterface
}

func NewDraftsClient(cc grpc.ClientConnInterface) DraftsClient {
	return &draftsClient{cc}
}

func (c *draftsClient) CreateDraft(ctx context.Context, in *CreateDraftRequest, opts ...grpc.CallOption) (*Document, error) {
	out := new(Document)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/CreateDraft", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *draftsClient) DeleteDraft(ctx context.Context, in *DeleteDraftRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/DeleteDraft", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *draftsClient) GetDraft(ctx context.Context, in *GetDraftRequest, opts ...grpc.CallOption) (*Document, error) {
	out := new(Document)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/GetDraft", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *draftsClient) UpdateDraft(ctx context.Context, in *UpdateDraftRequest, opts ...grpc.CallOption) (*Document, error) {
	out := new(Document)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/UpdateDraft", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *draftsClient) ListDrafts(ctx context.Context, in *ListDraftsRequest, opts ...grpc.CallOption) (*ListDraftsResponse, error) {
	out := new(ListDraftsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/ListDrafts", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *draftsClient) PublishDraft(ctx context.Context, in *PublishDraftRequest, opts ...grpc.CallOption) (*Publication, error) {
	out := new(Publication)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/PublishDraft", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// DraftsServer is the server API for Drafts service.
// All implementations should embed UnimplementedDraftsServer
// for forward compatibility
type DraftsServer interface {
	// Creates a new draft with a new permanent document ID.
	CreateDraft(context.Context, *CreateDraftRequest) (*Document, error)
	// Deletes a draft by its document ID.
	DeleteDraft(context.Context, *DeleteDraftRequest) (*emptypb.Empty, error)
	// Gets a single draft if exists.
	GetDraft(context.Context, *GetDraftRequest) (*Document, error)
	// Updates a draft instance. Supports partial updates.
	UpdateDraft(context.Context, *UpdateDraftRequest) (*Document, error)
	// List currently stored drafts.
	ListDrafts(context.Context, *ListDraftsRequest) (*ListDraftsResponse, error)
	// Publishes a draft. I.e. draft will become a publication, and will no longer appear in drafts section.
	PublishDraft(context.Context, *PublishDraftRequest) (*Publication, error)
}

// UnimplementedDraftsServer should be embedded to have forward compatible implementations.
type UnimplementedDraftsServer struct {
}

func (UnimplementedDraftsServer) CreateDraft(context.Context, *CreateDraftRequest) (*Document, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateDraft not implemented")
}
func (UnimplementedDraftsServer) DeleteDraft(context.Context, *DeleteDraftRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteDraft not implemented")
}
func (UnimplementedDraftsServer) GetDraft(context.Context, *GetDraftRequest) (*Document, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetDraft not implemented")
}
func (UnimplementedDraftsServer) UpdateDraft(context.Context, *UpdateDraftRequest) (*Document, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateDraft not implemented")
}
func (UnimplementedDraftsServer) ListDrafts(context.Context, *ListDraftsRequest) (*ListDraftsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListDrafts not implemented")
}
func (UnimplementedDraftsServer) PublishDraft(context.Context, *PublishDraftRequest) (*Publication, error) {
	return nil, status.Errorf(codes.Unimplemented, "method PublishDraft not implemented")
}

// UnsafeDraftsServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to DraftsServer will
// result in compilation errors.
type UnsafeDraftsServer interface {
	mustEmbedUnimplementedDraftsServer()
}

func RegisterDraftsServer(s grpc.ServiceRegistrar, srv DraftsServer) {
	s.RegisterService(&Drafts_ServiceDesc, srv)
}

func _Drafts_CreateDraft_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateDraftRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).CreateDraft(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/CreateDraft",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).CreateDraft(ctx, req.(*CreateDraftRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Drafts_DeleteDraft_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteDraftRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).DeleteDraft(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/DeleteDraft",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).DeleteDraft(ctx, req.(*DeleteDraftRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Drafts_GetDraft_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetDraftRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).GetDraft(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/GetDraft",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).GetDraft(ctx, req.(*GetDraftRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Drafts_UpdateDraft_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateDraftRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).UpdateDraft(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/UpdateDraft",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).UpdateDraft(ctx, req.(*UpdateDraftRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Drafts_ListDrafts_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListDraftsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).ListDrafts(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/ListDrafts",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).ListDrafts(ctx, req.(*ListDraftsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Drafts_PublishDraft_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PublishDraftRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).PublishDraft(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/PublishDraft",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).PublishDraft(ctx, req.(*PublishDraftRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Drafts_ServiceDesc is the grpc.ServiceDesc for Drafts service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Drafts_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.documents.v1alpha.Drafts",
	HandlerType: (*DraftsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateDraft",
			Handler:    _Drafts_CreateDraft_Handler,
		},
		{
			MethodName: "DeleteDraft",
			Handler:    _Drafts_DeleteDraft_Handler,
		},
		{
			MethodName: "GetDraft",
			Handler:    _Drafts_GetDraft_Handler,
		},
		{
			MethodName: "UpdateDraft",
			Handler:    _Drafts_UpdateDraft_Handler,
		},
		{
			MethodName: "ListDrafts",
			Handler:    _Drafts_ListDrafts_Handler,
		},
		{
			MethodName: "PublishDraft",
			Handler:    _Drafts_PublishDraft_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/documents.proto",
}

// PublicationsClient is the client API for Publications service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type PublicationsClient interface {
	// Gets a single publication.
	GetPublication(ctx context.Context, in *GetPublicationRequest, opts ...grpc.CallOption) (*Publication, error)
	// Deletes a publication from the local node. It removes all the patches corresponding to a document.
	DeletePublication(ctx context.Context, in *DeletePublicationRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// Lists stored publications. Only the most recent versions show up.
	ListPublications(ctx context.Context, in *ListPublicationsRequest, opts ...grpc.CallOption) (*ListPublicationsResponse, error)
}

type publicationsClient struct {
	cc grpc.ClientConnInterface
}

func NewPublicationsClient(cc grpc.ClientConnInterface) PublicationsClient {
	return &publicationsClient{cc}
}

func (c *publicationsClient) GetPublication(ctx context.Context, in *GetPublicationRequest, opts ...grpc.CallOption) (*Publication, error) {
	out := new(Publication)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Publications/GetPublication", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicationsClient) DeletePublication(ctx context.Context, in *DeletePublicationRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Publications/DeletePublication", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicationsClient) ListPublications(ctx context.Context, in *ListPublicationsRequest, opts ...grpc.CallOption) (*ListPublicationsResponse, error) {
	out := new(ListPublicationsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Publications/ListPublications", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PublicationsServer is the server API for Publications service.
// All implementations should embed UnimplementedPublicationsServer
// for forward compatibility
type PublicationsServer interface {
	// Gets a single publication.
	GetPublication(context.Context, *GetPublicationRequest) (*Publication, error)
	// Deletes a publication from the local node. It removes all the patches corresponding to a document.
	DeletePublication(context.Context, *DeletePublicationRequest) (*emptypb.Empty, error)
	// Lists stored publications. Only the most recent versions show up.
	ListPublications(context.Context, *ListPublicationsRequest) (*ListPublicationsResponse, error)
}

// UnimplementedPublicationsServer should be embedded to have forward compatible implementations.
type UnimplementedPublicationsServer struct {
}

func (UnimplementedPublicationsServer) GetPublication(context.Context, *GetPublicationRequest) (*Publication, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetPublication not implemented")
}
func (UnimplementedPublicationsServer) DeletePublication(context.Context, *DeletePublicationRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeletePublication not implemented")
}
func (UnimplementedPublicationsServer) ListPublications(context.Context, *ListPublicationsRequest) (*ListPublicationsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListPublications not implemented")
}

// UnsafePublicationsServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PublicationsServer will
// result in compilation errors.
type UnsafePublicationsServer interface {
	mustEmbedUnimplementedPublicationsServer()
}

func RegisterPublicationsServer(s grpc.ServiceRegistrar, srv PublicationsServer) {
	s.RegisterService(&Publications_ServiceDesc, srv)
}

func _Publications_GetPublication_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetPublicationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicationsServer).GetPublication(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Publications/GetPublication",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicationsServer).GetPublication(ctx, req.(*GetPublicationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Publications_DeletePublication_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeletePublicationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicationsServer).DeletePublication(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Publications/DeletePublication",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicationsServer).DeletePublication(ctx, req.(*DeletePublicationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Publications_ListPublications_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListPublicationsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicationsServer).ListPublications(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Publications/ListPublications",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicationsServer).ListPublications(ctx, req.(*ListPublicationsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Publications_ServiceDesc is the grpc.ServiceDesc for Publications service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Publications_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.documents.v1alpha.Publications",
	HandlerType: (*PublicationsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetPublication",
			Handler:    _Publications_GetPublication_Handler,
		},
		{
			MethodName: "DeletePublication",
			Handler:    _Publications_DeletePublication_Handler,
		},
		{
			MethodName: "ListPublications",
			Handler:    _Publications_ListPublications_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/documents.proto",
}

// ContentGraphClient is the client API for ContentGraph service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ContentGraphClient interface {
	ListCitations(ctx context.Context, in *ListCitationsRequest, opts ...grpc.CallOption) (*ListCitationsResponse, error)
}

type contentGraphClient struct {
	cc grpc.ClientConnInterface
}

func NewContentGraphClient(cc grpc.ClientConnInterface) ContentGraphClient {
	return &contentGraphClient{cc}
}

func (c *contentGraphClient) ListCitations(ctx context.Context, in *ListCitationsRequest, opts ...grpc.CallOption) (*ListCitationsResponse, error) {
	out := new(ListCitationsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.ContentGraph/ListCitations", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ContentGraphServer is the server API for ContentGraph service.
// All implementations should embed UnimplementedContentGraphServer
// for forward compatibility
type ContentGraphServer interface {
	ListCitations(context.Context, *ListCitationsRequest) (*ListCitationsResponse, error)
}

// UnimplementedContentGraphServer should be embedded to have forward compatible implementations.
type UnimplementedContentGraphServer struct {
}

func (UnimplementedContentGraphServer) ListCitations(context.Context, *ListCitationsRequest) (*ListCitationsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListCitations not implemented")
}

// UnsafeContentGraphServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ContentGraphServer will
// result in compilation errors.
type UnsafeContentGraphServer interface {
	mustEmbedUnimplementedContentGraphServer()
}

func RegisterContentGraphServer(s grpc.ServiceRegistrar, srv ContentGraphServer) {
	s.RegisterService(&ContentGraph_ServiceDesc, srv)
}

func _ContentGraph_ListCitations_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListCitationsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentGraphServer).ListCitations(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.ContentGraph/ListCitations",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentGraphServer).ListCitations(ctx, req.(*ListCitationsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// ContentGraph_ServiceDesc is the grpc.ServiceDesc for ContentGraph service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ContentGraph_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.documents.v1alpha.ContentGraph",
	HandlerType: (*ContentGraphServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ListCitations",
			Handler:    _ContentGraph_ListCitations_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/documents.proto",
}
