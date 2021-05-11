// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.11.4
// source: networking/v1alpha/networking.proto

package networking

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type GetPeerAddrsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// CID-encoded Peer ID.
	PeerId string `protobuf:"bytes,1,opt,name=peer_id,json=peerId,proto3" json:"peer_id,omitempty"`
}

func (x *GetPeerAddrsRequest) Reset() {
	*x = GetPeerAddrsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_networking_v1alpha_networking_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPeerAddrsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPeerAddrsRequest) ProtoMessage() {}

func (x *GetPeerAddrsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_networking_v1alpha_networking_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPeerAddrsRequest.ProtoReflect.Descriptor instead.
func (*GetPeerAddrsRequest) Descriptor() ([]byte, []int) {
	return file_networking_v1alpha_networking_proto_rawDescGZIP(), []int{0}
}

func (x *GetPeerAddrsRequest) GetPeerId() string {
	if x != nil {
		return x.PeerId
	}
	return ""
}

type GetPeerAddrsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// List of known multiaddrs of the request peer.
	Addrs []string `protobuf:"bytes,1,rep,name=addrs,proto3" json:"addrs,omitempty"`
}

func (x *GetPeerAddrsResponse) Reset() {
	*x = GetPeerAddrsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_networking_v1alpha_networking_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPeerAddrsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPeerAddrsResponse) ProtoMessage() {}

func (x *GetPeerAddrsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_networking_v1alpha_networking_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPeerAddrsResponse.ProtoReflect.Descriptor instead.
func (*GetPeerAddrsResponse) Descriptor() ([]byte, []int) {
	return file_networking_v1alpha_networking_proto_rawDescGZIP(), []int{1}
}

func (x *GetPeerAddrsResponse) GetAddrs() []string {
	if x != nil {
		return x.Addrs
	}
	return nil
}

var File_networking_v1alpha_networking_proto protoreflect.FileDescriptor

var file_networking_v1alpha_networking_proto_rawDesc = []byte{
	0x0a, 0x23, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x2f, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x2f, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x1e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74,
	0x65, 0x72, 0x2e, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x2e, 0x76, 0x31,
	0x61, 0x6c, 0x70, 0x68, 0x61, 0x22, 0x2e, 0x0a, 0x13, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72,
	0x41, 0x64, 0x64, 0x72, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x17, 0x0a, 0x07,
	0x70, 0x65, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x70,
	0x65, 0x65, 0x72, 0x49, 0x64, 0x22, 0x2c, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72,
	0x41, 0x64, 0x64, 0x72, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x14, 0x0a,
	0x05, 0x61, 0x64, 0x64, 0x72, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x09, 0x52, 0x05, 0x61, 0x64,
	0x64, 0x72, 0x73, 0x32, 0x87, 0x01, 0x0a, 0x0a, 0x4e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69,
	0x6e, 0x67, 0x12, 0x79, 0x0a, 0x0c, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72, 0x41, 0x64, 0x64,
	0x72, 0x73, 0x12, 0x33, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72,
	0x2e, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x2e, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x2e, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72, 0x41, 0x64, 0x64, 0x72, 0x73,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x34, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69,
	0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67,
	0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72,
	0x41, 0x64, 0x64, 0x72, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x2e, 0x5a,
	0x2c, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x67, 0x6f, 0x2f,
	0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x3b, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x69, 0x6e, 0x67, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_networking_v1alpha_networking_proto_rawDescOnce sync.Once
	file_networking_v1alpha_networking_proto_rawDescData = file_networking_v1alpha_networking_proto_rawDesc
)

func file_networking_v1alpha_networking_proto_rawDescGZIP() []byte {
	file_networking_v1alpha_networking_proto_rawDescOnce.Do(func() {
		file_networking_v1alpha_networking_proto_rawDescData = protoimpl.X.CompressGZIP(file_networking_v1alpha_networking_proto_rawDescData)
	})
	return file_networking_v1alpha_networking_proto_rawDescData
}

var file_networking_v1alpha_networking_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_networking_v1alpha_networking_proto_goTypes = []interface{}{
	(*GetPeerAddrsRequest)(nil),  // 0: com.mintter.networking.v1alpha.GetPeerAddrsRequest
	(*GetPeerAddrsResponse)(nil), // 1: com.mintter.networking.v1alpha.GetPeerAddrsResponse
}
var file_networking_v1alpha_networking_proto_depIdxs = []int32{
	0, // 0: com.mintter.networking.v1alpha.Networking.GetPeerAddrs:input_type -> com.mintter.networking.v1alpha.GetPeerAddrsRequest
	1, // 1: com.mintter.networking.v1alpha.Networking.GetPeerAddrs:output_type -> com.mintter.networking.v1alpha.GetPeerAddrsResponse
	1, // [1:2] is the sub-list for method output_type
	0, // [0:1] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_networking_v1alpha_networking_proto_init() }
func file_networking_v1alpha_networking_proto_init() {
	if File_networking_v1alpha_networking_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_networking_v1alpha_networking_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPeerAddrsRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_networking_v1alpha_networking_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPeerAddrsResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_networking_v1alpha_networking_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_networking_v1alpha_networking_proto_goTypes,
		DependencyIndexes: file_networking_v1alpha_networking_proto_depIdxs,
		MessageInfos:      file_networking_v1alpha_networking_proto_msgTypes,
	}.Build()
	File_networking_v1alpha_networking_proto = out.File
	file_networking_v1alpha_networking_proto_rawDesc = nil
	file_networking_v1alpha_networking_proto_goTypes = nil
	file_networking_v1alpha_networking_proto_depIdxs = nil
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConnInterface

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// NetworkingClient is the client API for Networking service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type NetworkingClient interface {
	GetPeerAddrs(ctx context.Context, in *GetPeerAddrsRequest, opts ...grpc.CallOption) (*GetPeerAddrsResponse, error)
}

type networkingClient struct {
	cc grpc.ClientConnInterface
}

func NewNetworkingClient(cc grpc.ClientConnInterface) NetworkingClient {
	return &networkingClient{cc}
}

func (c *networkingClient) GetPeerAddrs(ctx context.Context, in *GetPeerAddrsRequest, opts ...grpc.CallOption) (*GetPeerAddrsResponse, error) {
	out := new(GetPeerAddrsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.networking.v1alpha.Networking/GetPeerAddrs", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// NetworkingServer is the server API for Networking service.
type NetworkingServer interface {
	GetPeerAddrs(context.Context, *GetPeerAddrsRequest) (*GetPeerAddrsResponse, error)
}

// UnimplementedNetworkingServer can be embedded to have forward compatible implementations.
type UnimplementedNetworkingServer struct {
}

func (*UnimplementedNetworkingServer) GetPeerAddrs(context.Context, *GetPeerAddrsRequest) (*GetPeerAddrsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetPeerAddrs not implemented")
}

func RegisterNetworkingServer(s *grpc.Server, srv NetworkingServer) {
	s.RegisterService(&_Networking_serviceDesc, srv)
}

func _Networking_GetPeerAddrs_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetPeerAddrsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(NetworkingServer).GetPeerAddrs(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.networking.v1alpha.Networking/GetPeerAddrs",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(NetworkingServer).GetPeerAddrs(ctx, req.(*GetPeerAddrsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Networking_serviceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.networking.v1alpha.Networking",
	HandlerType: (*NetworkingServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetPeerAddrs",
			Handler:    _Networking_GetPeerAddrs_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "networking/v1alpha/networking.proto",
}
