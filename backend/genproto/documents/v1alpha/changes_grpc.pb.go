// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: documents/v1alpha/changes.proto

package documents

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

// ChangesClient is the client API for Changes service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ChangesClient interface {
	// Returns information about a single change.
	GetChangeInfo(ctx context.Context, in *GetChangeInfoRequest, opts ...grpc.CallOption) (*ChangeInfo, error)
	// List changes of a given object.
	ListChanges(ctx context.Context, in *ListChangesRequest, opts ...grpc.CallOption) (*ListChangesResponse, error)
}

type changesClient struct {
	cc grpc.ClientConnInterface
}

func NewChangesClient(cc grpc.ClientConnInterface) ChangesClient {
	return &changesClient{cc}
}

func (c *changesClient) GetChangeInfo(ctx context.Context, in *GetChangeInfoRequest, opts ...grpc.CallOption) (*ChangeInfo, error) {
	out := new(ChangeInfo)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Changes/GetChangeInfo", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *changesClient) ListChanges(ctx context.Context, in *ListChangesRequest, opts ...grpc.CallOption) (*ListChangesResponse, error) {
	out := new(ListChangesResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Changes/ListChanges", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ChangesServer is the server API for Changes service.
// All implementations should embed UnimplementedChangesServer
// for forward compatibility
type ChangesServer interface {
	// Returns information about a single change.
	GetChangeInfo(context.Context, *GetChangeInfoRequest) (*ChangeInfo, error)
	// List changes of a given object.
	ListChanges(context.Context, *ListChangesRequest) (*ListChangesResponse, error)
}

// UnimplementedChangesServer should be embedded to have forward compatible implementations.
type UnimplementedChangesServer struct {
}

func (UnimplementedChangesServer) GetChangeInfo(context.Context, *GetChangeInfoRequest) (*ChangeInfo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetChangeInfo not implemented")
}
func (UnimplementedChangesServer) ListChanges(context.Context, *ListChangesRequest) (*ListChangesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListChanges not implemented")
}

// UnsafeChangesServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ChangesServer will
// result in compilation errors.
type UnsafeChangesServer interface {
	mustEmbedUnimplementedChangesServer()
}

func RegisterChangesServer(s grpc.ServiceRegistrar, srv ChangesServer) {
	s.RegisterService(&Changes_ServiceDesc, srv)
}

func _Changes_GetChangeInfo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetChangeInfoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChangesServer).GetChangeInfo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Changes/GetChangeInfo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChangesServer).GetChangeInfo(ctx, req.(*GetChangeInfoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Changes_ListChanges_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListChangesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChangesServer).ListChanges(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Changes/ListChanges",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChangesServer).ListChanges(ctx, req.(*ListChangesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Changes_ServiceDesc is the grpc.ServiceDesc for Changes service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Changes_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.documents.v1alpha.Changes",
	HandlerType: (*ChangesServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetChangeInfo",
			Handler:    _Changes_GetChangeInfo_Handler,
		},
		{
			MethodName: "ListChanges",
			Handler:    _Changes_ListChanges_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/changes.proto",
}