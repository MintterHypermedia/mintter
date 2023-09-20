// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: p2p/v1alpha/p2p.proto

package p2p

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

// P2PClient is the client API for P2P service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type P2PClient interface {
	// Handshake gets called whenever two Mintter peers connect to each other.
	// No matter who initiates the connect, this will make sure both peers exchange their information.
	Handshake(ctx context.Context, in *HandshakeInfo, opts ...grpc.CallOption) (*HandshakeInfo, error)
	// Returns list of all the objects authored by the account this peer belongs to.
	// Used for syncing objects between peers. Clients are expected to periodically
	// use this call to pull the latest objects from the remote peer.
	//
	// This is a very naive syncing protocol, it returns all the objects and all the changes
	// every time. Eventually this will be improved and made more efficient.
	ListObjects(ctx context.Context, in *ListObjectsRequest, opts ...grpc.CallOption) (*ListObjectsResponse, error)
	ListBlobs(ctx context.Context, in *ListBlobsRequest, opts ...grpc.CallOption) (P2P_ListBlobsClient, error)
	// Request a peer to issue a lightning BOLT-11 invoice
	RequestInvoice(ctx context.Context, in *RequestInvoiceRequest, opts ...grpc.CallOption) (*RequestInvoiceResponse, error)
}

type p2PClient struct {
	cc grpc.ClientConnInterface
}

func NewP2PClient(cc grpc.ClientConnInterface) P2PClient {
	return &p2PClient{cc}
}

func (c *p2PClient) Handshake(ctx context.Context, in *HandshakeInfo, opts ...grpc.CallOption) (*HandshakeInfo, error) {
	out := new(HandshakeInfo)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/Handshake", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) ListObjects(ctx context.Context, in *ListObjectsRequest, opts ...grpc.CallOption) (*ListObjectsResponse, error) {
	out := new(ListObjectsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.p2p.v1alpha.P2P/ListObjects", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *p2PClient) ListBlobs(ctx context.Context, in *ListBlobsRequest, opts ...grpc.CallOption) (P2P_ListBlobsClient, error) {
	stream, err := c.cc.NewStream(ctx, &P2P_ServiceDesc.Streams[0], "/com.mintter.p2p.v1alpha.P2P/ListBlobs", opts...)
	if err != nil {
		return nil, err
	}
	x := &p2PListBlobsClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type P2P_ListBlobsClient interface {
	Recv() (*Blob, error)
	grpc.ClientStream
}

type p2PListBlobsClient struct {
	grpc.ClientStream
}

func (x *p2PListBlobsClient) Recv() (*Blob, error) {
	m := new(Blob)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
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
	// Handshake gets called whenever two Mintter peers connect to each other.
	// No matter who initiates the connect, this will make sure both peers exchange their information.
	Handshake(context.Context, *HandshakeInfo) (*HandshakeInfo, error)
	// Returns list of all the objects authored by the account this peer belongs to.
	// Used for syncing objects between peers. Clients are expected to periodically
	// use this call to pull the latest objects from the remote peer.
	//
	// This is a very naive syncing protocol, it returns all the objects and all the changes
	// every time. Eventually this will be improved and made more efficient.
	ListObjects(context.Context, *ListObjectsRequest) (*ListObjectsResponse, error)
	ListBlobs(*ListBlobsRequest, P2P_ListBlobsServer) error
	// Request a peer to issue a lightning BOLT-11 invoice
	RequestInvoice(context.Context, *RequestInvoiceRequest) (*RequestInvoiceResponse, error)
}

// UnimplementedP2PServer should be embedded to have forward compatible implementations.
type UnimplementedP2PServer struct {
}

func (UnimplementedP2PServer) Handshake(context.Context, *HandshakeInfo) (*HandshakeInfo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Handshake not implemented")
}
func (UnimplementedP2PServer) ListObjects(context.Context, *ListObjectsRequest) (*ListObjectsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListObjects not implemented")
}
func (UnimplementedP2PServer) ListBlobs(*ListBlobsRequest, P2P_ListBlobsServer) error {
	return status.Errorf(codes.Unimplemented, "method ListBlobs not implemented")
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

func _P2P_Handshake_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(HandshakeInfo)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).Handshake(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/Handshake",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).Handshake(ctx, req.(*HandshakeInfo))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_ListObjects_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListObjectsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(P2PServer).ListObjects(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.p2p.v1alpha.P2P/ListObjects",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(P2PServer).ListObjects(ctx, req.(*ListObjectsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _P2P_ListBlobs_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(ListBlobsRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(P2PServer).ListBlobs(m, &p2PListBlobsServer{stream})
}

type P2P_ListBlobsServer interface {
	Send(*Blob) error
	grpc.ServerStream
}

type p2PListBlobsServer struct {
	grpc.ServerStream
}

func (x *p2PListBlobsServer) Send(m *Blob) error {
	return x.ServerStream.SendMsg(m)
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
			MethodName: "Handshake",
			Handler:    _P2P_Handshake_Handler,
		},
		{
			MethodName: "ListObjects",
			Handler:    _P2P_ListObjects_Handler,
		},
		{
			MethodName: "RequestInvoice",
			Handler:    _P2P_RequestInvoice_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "ListBlobs",
			Handler:       _P2P_ListBlobs_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "p2p/v1alpha/p2p.proto",
}
