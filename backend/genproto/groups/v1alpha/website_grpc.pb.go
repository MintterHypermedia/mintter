// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: groups/v1alpha/website.proto

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

// WebsiteClient is the client API for Website service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type WebsiteClient interface {
	// Gets the public information about the website.
	// This information is also available as JSON over HTTP on `/.well-known/hypermedia-site`.
	GetSiteInfo(ctx context.Context, in *GetSiteInfoRequest, opts ...grpc.CallOption) (*PublicSiteInfo, error)
	// Initializes the server to become a website for a specific group.
	InitializeServer(ctx context.Context, in *InitializeServerRequest, opts ...grpc.CallOption) (*InitializeServerResponse, error)
}

type websiteClient struct {
	cc grpc.ClientConnInterface
}

func NewWebsiteClient(cc grpc.ClientConnInterface) WebsiteClient {
	return &websiteClient{cc}
}

func (c *websiteClient) GetSiteInfo(ctx context.Context, in *GetSiteInfoRequest, opts ...grpc.CallOption) (*PublicSiteInfo, error) {
	out := new(PublicSiteInfo)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Website/GetSiteInfo", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *websiteClient) InitializeServer(ctx context.Context, in *InitializeServerRequest, opts ...grpc.CallOption) (*InitializeServerResponse, error) {
	out := new(InitializeServerResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.groups.v1alpha.Website/InitializeServer", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// WebsiteServer is the server API for Website service.
// All implementations should embed UnimplementedWebsiteServer
// for forward compatibility
type WebsiteServer interface {
	// Gets the public information about the website.
	// This information is also available as JSON over HTTP on `/.well-known/hypermedia-site`.
	GetSiteInfo(context.Context, *GetSiteInfoRequest) (*PublicSiteInfo, error)
	// Initializes the server to become a website for a specific group.
	InitializeServer(context.Context, *InitializeServerRequest) (*InitializeServerResponse, error)
}

// UnimplementedWebsiteServer should be embedded to have forward compatible implementations.
type UnimplementedWebsiteServer struct {
}

func (UnimplementedWebsiteServer) GetSiteInfo(context.Context, *GetSiteInfoRequest) (*PublicSiteInfo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetSiteInfo not implemented")
}
func (UnimplementedWebsiteServer) InitializeServer(context.Context, *InitializeServerRequest) (*InitializeServerResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method InitializeServer not implemented")
}

// UnsafeWebsiteServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to WebsiteServer will
// result in compilation errors.
type UnsafeWebsiteServer interface {
	mustEmbedUnimplementedWebsiteServer()
}

func RegisterWebsiteServer(s grpc.ServiceRegistrar, srv WebsiteServer) {
	s.RegisterService(&Website_ServiceDesc, srv)
}

func _Website_GetSiteInfo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetSiteInfoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(WebsiteServer).GetSiteInfo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Website/GetSiteInfo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(WebsiteServer).GetSiteInfo(ctx, req.(*GetSiteInfoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Website_InitializeServer_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(InitializeServerRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(WebsiteServer).InitializeServer(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.groups.v1alpha.Website/InitializeServer",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(WebsiteServer).InitializeServer(ctx, req.(*InitializeServerRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Website_ServiceDesc is the grpc.ServiceDesc for Website service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Website_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.groups.v1alpha.Website",
	HandlerType: (*WebsiteServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetSiteInfo",
			Handler:    _Website_GetSiteInfo_Handler,
		},
		{
			MethodName: "InitializeServer",
			Handler:    _Website_InitializeServer_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "groups/v1alpha/website.proto",
}
