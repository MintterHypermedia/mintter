// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: entities/v1alpha/entities.proto

package entities

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

// EntitiesClient is the client API for Entities service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type EntitiesClient interface {
	// Gets a change by ID.
	GetChange(ctx context.Context, in *GetChangeRequest, opts ...grpc.CallOption) (*Change, error)
	// Gets the DAG of changes for an entity.
	GetEntityTimeline(ctx context.Context, in *GetEntityTimelineRequest, opts ...grpc.CallOption) (*EntityTimeline, error)
	// Triggers a best-effort discovery of an entity.
	DiscoverEntity(ctx context.Context, in *DiscoverEntityRequest, opts ...grpc.CallOption) (*DiscoverEntityResponse, error)
	// Finds the list of local entities whose titles match the input string.
	// A fuzzy search is performed among documents, groups and accounts.
	// For groups and documents, we match the title, while we match alias in accounts.
	SearchEntities(ctx context.Context, in *SearchEntitiesRequest, opts ...grpc.CallOption) (*SearchEntitiesResponse, error)
}

type entitiesClient struct {
	cc grpc.ClientConnInterface
}

func NewEntitiesClient(cc grpc.ClientConnInterface) EntitiesClient {
	return &entitiesClient{cc}
}

func (c *entitiesClient) GetChange(ctx context.Context, in *GetChangeRequest, opts ...grpc.CallOption) (*Change, error) {
	out := new(Change)
	err := c.cc.Invoke(ctx, "/com.mintter.entities.v1alpha.Entities/GetChange", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *entitiesClient) GetEntityTimeline(ctx context.Context, in *GetEntityTimelineRequest, opts ...grpc.CallOption) (*EntityTimeline, error) {
	out := new(EntityTimeline)
	err := c.cc.Invoke(ctx, "/com.mintter.entities.v1alpha.Entities/GetEntityTimeline", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *entitiesClient) DiscoverEntity(ctx context.Context, in *DiscoverEntityRequest, opts ...grpc.CallOption) (*DiscoverEntityResponse, error) {
	out := new(DiscoverEntityResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.entities.v1alpha.Entities/DiscoverEntity", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *entitiesClient) SearchEntities(ctx context.Context, in *SearchEntitiesRequest, opts ...grpc.CallOption) (*SearchEntitiesResponse, error) {
	out := new(SearchEntitiesResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.entities.v1alpha.Entities/SearchEntities", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// EntitiesServer is the server API for Entities service.
// All implementations should embed UnimplementedEntitiesServer
// for forward compatibility
type EntitiesServer interface {
	// Gets a change by ID.
	GetChange(context.Context, *GetChangeRequest) (*Change, error)
	// Gets the DAG of changes for an entity.
	GetEntityTimeline(context.Context, *GetEntityTimelineRequest) (*EntityTimeline, error)
	// Triggers a best-effort discovery of an entity.
	DiscoverEntity(context.Context, *DiscoverEntityRequest) (*DiscoverEntityResponse, error)
	// Finds the list of local entities whose titles match the input string.
	// A fuzzy search is performed among documents, groups and accounts.
	// For groups and documents, we match the title, while we match alias in accounts.
	SearchEntities(context.Context, *SearchEntitiesRequest) (*SearchEntitiesResponse, error)
}

// UnimplementedEntitiesServer should be embedded to have forward compatible implementations.
type UnimplementedEntitiesServer struct {
}

func (UnimplementedEntitiesServer) GetChange(context.Context, *GetChangeRequest) (*Change, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetChange not implemented")
}
func (UnimplementedEntitiesServer) GetEntityTimeline(context.Context, *GetEntityTimelineRequest) (*EntityTimeline, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetEntityTimeline not implemented")
}
func (UnimplementedEntitiesServer) DiscoverEntity(context.Context, *DiscoverEntityRequest) (*DiscoverEntityResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DiscoverEntity not implemented")
}
func (UnimplementedEntitiesServer) SearchEntities(context.Context, *SearchEntitiesRequest) (*SearchEntitiesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SearchEntities not implemented")
}

// UnsafeEntitiesServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to EntitiesServer will
// result in compilation errors.
type UnsafeEntitiesServer interface {
	mustEmbedUnimplementedEntitiesServer()
}

func RegisterEntitiesServer(s grpc.ServiceRegistrar, srv EntitiesServer) {
	s.RegisterService(&Entities_ServiceDesc, srv)
}

func _Entities_GetChange_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetChangeRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EntitiesServer).GetChange(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.entities.v1alpha.Entities/GetChange",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EntitiesServer).GetChange(ctx, req.(*GetChangeRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Entities_GetEntityTimeline_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetEntityTimelineRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EntitiesServer).GetEntityTimeline(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.entities.v1alpha.Entities/GetEntityTimeline",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EntitiesServer).GetEntityTimeline(ctx, req.(*GetEntityTimelineRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Entities_DiscoverEntity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DiscoverEntityRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EntitiesServer).DiscoverEntity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.entities.v1alpha.Entities/DiscoverEntity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EntitiesServer).DiscoverEntity(ctx, req.(*DiscoverEntityRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Entities_SearchEntities_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SearchEntitiesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EntitiesServer).SearchEntities(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.entities.v1alpha.Entities/SearchEntities",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EntitiesServer).SearchEntities(ctx, req.(*SearchEntitiesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Entities_ServiceDesc is the grpc.ServiceDesc for Entities service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Entities_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.entities.v1alpha.Entities",
	HandlerType: (*EntitiesServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetChange",
			Handler:    _Entities_GetChange_Handler,
		},
		{
			MethodName: "GetEntityTimeline",
			Handler:    _Entities_GetEntityTimeline_Handler,
		},
		{
			MethodName: "DiscoverEntity",
			Handler:    _Entities_DiscoverEntity_Handler,
		},
		{
			MethodName: "SearchEntities",
			Handler:    _Entities_SearchEntities_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "entities/v1alpha/entities.proto",
}
