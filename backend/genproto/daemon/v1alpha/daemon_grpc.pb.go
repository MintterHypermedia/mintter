// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v4.24.4
// source: daemon/v1alpha/daemon.proto

package daemon

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

// DaemonClient is the client API for Daemon service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type DaemonClient interface {
	// Generates a set of mnemonic words used to derive Seed Account Key, and the underlying
	// seed lndhub wallet. The cipher schema is BIP-39 and the entropy is encoded as a
	// mnemonic of 12-24 human-readable english words.
	// The seed could be reconstructed given these words and the passphrase.
	GenMnemonic(ctx context.Context, in *GenMnemonicRequest, opts ...grpc.CallOption) (*GenMnemonicResponse, error)
	// After generating the seed, this call is used to commit the seed and
	// create an account binding between the device and account.
	Register(ctx context.Context, in *RegisterRequest, opts ...grpc.CallOption) (*RegisterResponse, error)
	// Get generic information about the running node.
	GetInfo(ctx context.Context, in *GetInfoRequest, opts ...grpc.CallOption) (*Info, error)
	// Force-trigger periodic background sync of Seed objects.
	ForceSync(ctx context.Context, in *ForceSyncRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
}

type daemonClient struct {
	cc grpc.ClientConnInterface
}

func NewDaemonClient(cc grpc.ClientConnInterface) DaemonClient {
	return &daemonClient{cc}
}

func (c *daemonClient) GenMnemonic(ctx context.Context, in *GenMnemonicRequest, opts ...grpc.CallOption) (*GenMnemonicResponse, error) {
	out := new(GenMnemonicResponse)
	err := c.cc.Invoke(ctx, "/com.seed.daemon.v1alpha.Daemon/GenMnemonic", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *daemonClient) Register(ctx context.Context, in *RegisterRequest, opts ...grpc.CallOption) (*RegisterResponse, error) {
	out := new(RegisterResponse)
	err := c.cc.Invoke(ctx, "/com.seed.daemon.v1alpha.Daemon/Register", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *daemonClient) GetInfo(ctx context.Context, in *GetInfoRequest, opts ...grpc.CallOption) (*Info, error) {
	out := new(Info)
	err := c.cc.Invoke(ctx, "/com.seed.daemon.v1alpha.Daemon/GetInfo", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *daemonClient) ForceSync(ctx context.Context, in *ForceSyncRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.seed.daemon.v1alpha.Daemon/ForceSync", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// DaemonServer is the server API for Daemon service.
// All implementations should embed UnimplementedDaemonServer
// for forward compatibility
type DaemonServer interface {
	// Generates a set of mnemonic words used to derive Seed Account Key, and the underlying
	// seed lndhub wallet. The cipher schema is BIP-39 and the entropy is encoded as a
	// mnemonic of 12-24 human-readable english words.
	// The seed could be reconstructed given these words and the passphrase.
	GenMnemonic(context.Context, *GenMnemonicRequest) (*GenMnemonicResponse, error)
	// After generating the seed, this call is used to commit the seed and
	// create an account binding between the device and account.
	Register(context.Context, *RegisterRequest) (*RegisterResponse, error)
	// Get generic information about the running node.
	GetInfo(context.Context, *GetInfoRequest) (*Info, error)
	// Force-trigger periodic background sync of Seed objects.
	ForceSync(context.Context, *ForceSyncRequest) (*emptypb.Empty, error)
}

// UnimplementedDaemonServer should be embedded to have forward compatible implementations.
type UnimplementedDaemonServer struct {
}

func (UnimplementedDaemonServer) GenMnemonic(context.Context, *GenMnemonicRequest) (*GenMnemonicResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GenMnemonic not implemented")
}
func (UnimplementedDaemonServer) Register(context.Context, *RegisterRequest) (*RegisterResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Register not implemented")
}
func (UnimplementedDaemonServer) GetInfo(context.Context, *GetInfoRequest) (*Info, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetInfo not implemented")
}
func (UnimplementedDaemonServer) ForceSync(context.Context, *ForceSyncRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ForceSync not implemented")
}

// UnsafeDaemonServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to DaemonServer will
// result in compilation errors.
type UnsafeDaemonServer interface {
	mustEmbedUnimplementedDaemonServer()
}

func RegisterDaemonServer(s grpc.ServiceRegistrar, srv DaemonServer) {
	s.RegisterService(&Daemon_ServiceDesc, srv)
}

func _Daemon_GenMnemonic_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GenMnemonicRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DaemonServer).GenMnemonic(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.seed.daemon.v1alpha.Daemon/GenMnemonic",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DaemonServer).GenMnemonic(ctx, req.(*GenMnemonicRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Daemon_Register_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RegisterRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DaemonServer).Register(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.seed.daemon.v1alpha.Daemon/Register",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DaemonServer).Register(ctx, req.(*RegisterRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Daemon_GetInfo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetInfoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DaemonServer).GetInfo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.seed.daemon.v1alpha.Daemon/GetInfo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DaemonServer).GetInfo(ctx, req.(*GetInfoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Daemon_ForceSync_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ForceSyncRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DaemonServer).ForceSync(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.seed.daemon.v1alpha.Daemon/ForceSync",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DaemonServer).ForceSync(ctx, req.(*ForceSyncRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Daemon_ServiceDesc is the grpc.ServiceDesc for Daemon service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Daemon_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.seed.daemon.v1alpha.Daemon",
	HandlerType: (*DaemonServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GenMnemonic",
			Handler:    _Daemon_GenMnemonic_Handler,
		},
		{
			MethodName: "Register",
			Handler:    _Daemon_Register_Handler,
		},
		{
			MethodName: "GetInfo",
			Handler:    _Daemon_GetInfo_Handler,
		},
		{
			MethodName: "ForceSync",
			Handler:    _Daemon_ForceSync_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "daemon/v1alpha/daemon.proto",
}
