// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package p2p

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

// P2PClient is the client API for P2P service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type P2PClient interface {
	// Get basic information about the peer.
	GetPeerInfo(ctx context.Context, in *GetPeerInfoRequest, opts ...grpc.CallOption) (*PeerInfo, error)
	// Get version of a specific object.
	GetObjectVersion(ctx context.Context, in *GetObjectVersionRequest, opts ...grpc.CallOption) (*Version, error)
	// Exchange want lists upon initial connection.
	ExchangeWantList(ctx context.Context, in *WantList, opts ...grpc.CallOption) (*WantList, error)
	// Send delta updates of our own wants.
	UpdateWantList(ctx context.Context, in *WantList, opts ...grpc.CallOption) (*UpdateWantsResponse, error)
	// Notify remote peer about an updated object version.
	// Only updated PeerVersions can be included if desired.
	UpdateObjectVersion(ctx context.Context, in *Version, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// Request a peer to issue a lightning BOLT-11 invoice
	RequestInvoice(ctx context.Context, in *RequestInvoiceRequest, opts ...grpc.CallOption) (*RequestInvoiceResponse, error)
}

type p2PClient struct {
	cc grpc.ClientConnInterface
}

func NewP2PClient(cc grpc.ClientConnInterface) P2PClient {
	return &p2PClient{cc}
}

func (c *p2PClient) GetPeerInfo(ctx context.Context, in *GetPeerInfoRequest, opts ...grpc.CallOption) (*PeerInfo, error) {
	out := new(PeerInfo)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/GetPeerInfo", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) GetObjectVersion(ctx context.Context, in *GetObjectVersionRequest, opts ...grpc.CallOption) (*Version, error) {
	out := new(Version)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/GetObjectVersion", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) ExchangeWantList(ctx context.Context, in *WantList, opts ...grpc.CallOption) (*WantList, error) {
	out := new(WantList)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/ExchangeWantList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) UpdateWantList(ctx context.Context, in *WantList, opts ...grpc.CallOption) (*UpdateWantsResponse, error) {
	out := new(UpdateWantsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/UpdateWantList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) UpdateObjectVersion(ctx context.Context, in *Version, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/UpdateObjectVersion", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) RequestInvoice(ctx context.Context, in *RequestInvoiceRequest, opts ...grpc.CallOption) (*RequestInvoiceResponse, error) {
	out := new(RequestInvoiceResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/RequestInvoice", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// P2PServer is the server API for P2P service.
// All implementations should embed UnimplementedP2PServer
// for forward compatibility
type P2PServer interface {
	// Get basic information about the peer.
	GetPeerInfo(context.Context, *GetPeerInfoRequest) (*PeerInfo, error)
	// Get version of a specific object.
	GetObjectVersion(context.Context, *GetObjectVersionRequest) (*Version, error)
	// Exchange want lists upon initial connection.
	ExchangeWantList(context.Context, *WantList) (*WantList, error)
	// Send delta updates of our own wants.
	UpdateWantList(context.Context, *WantList) (*UpdateWantsResponse, error)
	// Notify remote peer about an updated object version.
	// Only updated PeerVersions can be included if desired.
	UpdateObjectVersion(context.Context, *Version) (*emptypb.Empty, error)
	// Request a peer to issue a lightning BOLT-11 invoice
	RequestInvoice(context.Context, *RequestInvoiceRequest) (*RequestInvoiceResponse, error)
}

// UnimplementedP2PServer should be embedded to have forward compatible implementations.
type UnimplementedP2PServer struct {
}

func (UnimplementedP2PServer) GetPeerInfo(context.Context, *GetPeerInfoRequest) (*PeerInfo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetPeerInfo not implemented")
}
func (UnimplementedP2PServer) GetObjectVersion(context.Context, *GetObjectVersionRequest) (*Version, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetObjectVersion not implemented")
}
func (UnimplementedP2PServer) ExchangeWantList(context.Context, *WantList) (*WantList, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ExchangeWantList not implemented")
}
func (UnimplementedP2PServer) UpdateWantList(context.Context, *WantList) (*UpdateWantsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateWantList not implemented")
}
func (UnimplementedP2PServer) UpdateObjectVersion(context.Context, *Version) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateObjectVersion not implemented")
}
func (UnimplementedP2PServer) RequestInvoice(context.Context, *RequestInvoiceRequest) (*RequestInvoiceResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestInvoice not implemented")
}

// UnsafeP2PServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to P2PServer will
// result in compilation errors.
type UnsafeP2PServer interface {
	mustEmbedUnimplementedP2PServer()
}

func RegisterP2PServer(s grpc.ServiceRegistrar, srv P2PServer) {
	s.RegisterService(&P2P_ServiceDesc, srv)
}

func _P2P_GetPeerInfo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetPeerInfoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).GetPeerInfo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/GetPeerInfo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).GetPeerInfo(ctx, req.(*GetPeerInfoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_GetObjectVersion_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetObjectVersionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).GetObjectVersion(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/GetObjectVersion",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).GetObjectVersion(ctx, req.(*GetObjectVersionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_ExchangeWantList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(WantList)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).ExchangeWantList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/ExchangeWantList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).ExchangeWantList(ctx, req.(*WantList))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_UpdateWantList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(WantList)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).UpdateWantList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/UpdateWantList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).UpdateWantList(ctx, req.(*WantList))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_UpdateObjectVersion_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Version)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).UpdateObjectVersion(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/UpdateObjectVersion",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).UpdateObjectVersion(ctx, req.(*Version))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_RequestInvoice_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestInvoiceRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).RequestInvoice(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/RequestInvoice",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).RequestInvoice(ctx, req.(*RequestInvoiceRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// P2P_ServiceDesc is the grpc.ServiceDesc for P2P service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var P2P_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.p2p.v1alpha.P2P",
	HandlerType: (*P2PServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetPeerInfo",
			Handler:    _P2P_GetPeerInfo_Handler,
		},
		{
			MethodName: "GetObjectVersion",
			Handler:    _P2P_GetObjectVersion_Handler,
		},
		{
			MethodName: "ExchangeWantList",
			Handler:    _P2P_ExchangeWantList_Handler,
		},
		{
			MethodName: "UpdateWantList",
			Handler:    _P2P_UpdateWantList_Handler,
		},
		{
			MethodName: "UpdateObjectVersion",
			Handler:    _P2P_UpdateObjectVersion_Handler,
		},
		{
			MethodName: "RequestInvoice",
			Handler:    _P2P_RequestInvoice_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "p2p/v1alpha/p2p.proto",
}
