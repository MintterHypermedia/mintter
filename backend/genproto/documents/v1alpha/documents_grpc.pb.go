// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: documents/v1alpha/documents.proto

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
	// Updates a draft using granular update operations.
	UpdateDraftV2(ctx context.Context, in *UpdateDraftRequestV2, opts ...grpc.CallOption) (*emptypb.Empty, error)
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

func (c *draftsClient) UpdateDraftV2(ctx context.Context, in *UpdateDraftRequestV2, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Drafts/UpdateDraftV2", in, out, opts...)
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
	// Updates a draft using granular update operations.
	UpdateDraftV2(context.Context, *UpdateDraftRequestV2) (*emptypb.Empty, error)
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
func (UnimplementedDraftsServer) UpdateDraftV2(context.Context, *UpdateDraftRequestV2) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateDraftV2 not implemented")
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

func _Drafts_UpdateDraftV2_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateDraftRequestV2)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DraftsServer).UpdateDraftV2(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Drafts/UpdateDraftV2",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DraftsServer).UpdateDraftV2(ctx, req.(*UpdateDraftRequestV2))
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
			MethodName: "UpdateDraftV2",
			Handler:    _Drafts_UpdateDraftV2_Handler,
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
	// List authors that contributed to a given publication.
	ListAuthors(ctx context.Context, in *ListAuthorsRequest, opts ...grpc.CallOption) (*ListAuthorsResponse, error)
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

func (c *publicationsClient) ListAuthors(ctx context.Context, in *ListAuthorsRequest, opts ...grpc.CallOption) (*ListAuthorsResponse, error) {
	out := new(ListAuthorsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Publications/ListAuthors", in, out, opts...)
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
	// List authors that contributed to a given publication.
	ListAuthors(context.Context, *ListAuthorsRequest) (*ListAuthorsResponse, error)
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
func (UnimplementedPublicationsServer) ListAuthors(context.Context, *ListAuthorsRequest) (*ListAuthorsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListAuthors not implemented")
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

func _Publications_ListAuthors_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListAuthorsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicationsServer).ListAuthors(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Publications/ListAuthors",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicationsServer).ListAuthors(ctx, req.(*ListAuthorsRequest))
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
		{
			MethodName: "ListAuthors",
			Handler:    _Publications_ListAuthors_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/documents.proto",
}
