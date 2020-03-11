// Code generated by protoc-gen-go. DO NOT EDIT.
// source: mintter.proto

package proto

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

// Request for generating Aezeed seed.
type GenSeedRequest struct {
	// Passphrase that will be used to encipher the seed.
	AezeedPassphrase     []byte   `protobuf:"bytes,1,opt,name=aezeed_passphrase,json=aezeedPassphrase,proto3" json:"aezeed_passphrase,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GenSeedRequest) Reset()         { *m = GenSeedRequest{} }
func (m *GenSeedRequest) String() string { return proto.CompactTextString(m) }
func (*GenSeedRequest) ProtoMessage()    {}
func (*GenSeedRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_459271e8c06255ea, []int{0}
}

func (m *GenSeedRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GenSeedRequest.Unmarshal(m, b)
}
func (m *GenSeedRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GenSeedRequest.Marshal(b, m, deterministic)
}
func (m *GenSeedRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GenSeedRequest.Merge(m, src)
}
func (m *GenSeedRequest) XXX_Size() int {
	return xxx_messageInfo_GenSeedRequest.Size(m)
}
func (m *GenSeedRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GenSeedRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GenSeedRequest proto.InternalMessageInfo

func (m *GenSeedRequest) GetAezeedPassphrase() []byte {
	if m != nil {
		return m.AezeedPassphrase
	}
	return nil
}

// Response with the seed and mnemonic.
type GenSeedResponse struct {
	// The list of human-friendly words that can be used to backup the seed. These
	// words must be stored in a secret place by the user.
	Mnemonic []string `protobuf:"bytes,1,rep,name=mnemonic,proto3" json:"mnemonic,omitempty"`
	// Raw bytes of the seed encrypted with the passphraze.
	EncipheredSeed       []byte   `protobuf:"bytes,2,opt,name=enciphered_seed,json=encipheredSeed,proto3" json:"enciphered_seed,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GenSeedResponse) Reset()         { *m = GenSeedResponse{} }
func (m *GenSeedResponse) String() string { return proto.CompactTextString(m) }
func (*GenSeedResponse) ProtoMessage()    {}
func (*GenSeedResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_459271e8c06255ea, []int{1}
}

func (m *GenSeedResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GenSeedResponse.Unmarshal(m, b)
}
func (m *GenSeedResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GenSeedResponse.Marshal(b, m, deterministic)
}
func (m *GenSeedResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GenSeedResponse.Merge(m, src)
}
func (m *GenSeedResponse) XXX_Size() int {
	return xxx_messageInfo_GenSeedResponse.Size(m)
}
func (m *GenSeedResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_GenSeedResponse.DiscardUnknown(m)
}

var xxx_messageInfo_GenSeedResponse proto.InternalMessageInfo

func (m *GenSeedResponse) GetMnemonic() []string {
	if m != nil {
		return m.Mnemonic
	}
	return nil
}

func (m *GenSeedResponse) GetEncipheredSeed() []byte {
	if m != nil {
		return m.EncipheredSeed
	}
	return nil
}

func init() {
	proto.RegisterType((*GenSeedRequest)(nil), "com.mintter.GenSeedRequest")
	proto.RegisterType((*GenSeedResponse)(nil), "com.mintter.GenSeedResponse")
}

func init() {
	proto.RegisterFile("mintter.proto", fileDescriptor_459271e8c06255ea)
}

var fileDescriptor_459271e8c06255ea = []byte{
	// 206 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xe2, 0xcd, 0xcd, 0xcc, 0x2b,
	0x29, 0x49, 0x2d, 0xd2, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0xe2, 0x4e, 0xce, 0xcf, 0xd5, 0x83,
	0x0a, 0x29, 0xd9, 0x72, 0xf1, 0xb9, 0xa7, 0xe6, 0x05, 0xa7, 0xa6, 0xa6, 0x04, 0xa5, 0x16, 0x96,
	0xa6, 0x16, 0x97, 0x08, 0x69, 0x73, 0x09, 0x26, 0xa6, 0x56, 0xa5, 0xa6, 0xa6, 0xc4, 0x17, 0x24,
	0x16, 0x17, 0x17, 0x64, 0x14, 0x25, 0x16, 0xa7, 0x4a, 0x30, 0x2a, 0x30, 0x6a, 0xf0, 0x04, 0x09,
	0x40, 0x24, 0x02, 0xe0, 0xe2, 0x4a, 0x61, 0x5c, 0xfc, 0x70, 0xed, 0xc5, 0x05, 0xf9, 0x79, 0xc5,
	0xa9, 0x42, 0x52, 0x5c, 0x1c, 0xb9, 0x79, 0xa9, 0xb9, 0xf9, 0x79, 0x99, 0xc9, 0x12, 0x8c, 0x0a,
	0xcc, 0x1a, 0x9c, 0x41, 0x70, 0xbe, 0x90, 0x3a, 0x17, 0x7f, 0x6a, 0x5e, 0x72, 0x66, 0x41, 0x46,
	0x6a, 0x51, 0x6a, 0x4a, 0x7c, 0x71, 0x6a, 0x6a, 0x8a, 0x04, 0x13, 0xd8, 0x64, 0x3e, 0x84, 0x30,
	0xc8, 0x30, 0xa3, 0x20, 0x2e, 0x0e, 0xc7, 0xe4, 0xe4, 0xfc, 0xd2, 0xbc, 0x92, 0x62, 0x21, 0x37,
	0x2e, 0x76, 0xa8, 0x1d, 0x42, 0xd2, 0x7a, 0x48, 0x6e, 0xd7, 0x43, 0x75, 0xb8, 0x94, 0x0c, 0x76,
	0x49, 0x88, 0xb3, 0x94, 0x18, 0x9c, 0xd8, 0xa3, 0x58, 0xc1, 0x01, 0x90, 0xc4, 0x06, 0xa6, 0x8c,
	0x01, 0x01, 0x00, 0x00, 0xff, 0xff, 0x5b, 0x4c, 0xa0, 0x6d, 0x18, 0x01, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConnInterface

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// AccountsClient is the client API for Accounts service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type AccountsClient interface {
	// Generate cryptographic seed that is used to derive all the cryptographic
	// keys necessary for Mintter to work. It's currenly supposed to be using
	// LND's Aezeed implementation, that solves some of the issues with BIP-39.
	// The seed is encoded as a mnemonic of N human readable words. The seed could
	// be reconstructed given these words and the passphrase.
	//
	// See: https://github.com/lightningnetwork/lnd/tree/master/aezeed.
	GenSeed(ctx context.Context, in *GenSeedRequest, opts ...grpc.CallOption) (*GenSeedResponse, error)
}

type accountsClient struct {
	cc grpc.ClientConnInterface
}

func NewAccountsClient(cc grpc.ClientConnInterface) AccountsClient {
	return &accountsClient{cc}
}

func (c *accountsClient) GenSeed(ctx context.Context, in *GenSeedRequest, opts ...grpc.CallOption) (*GenSeedResponse, error) {
	out := new(GenSeedResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.Accounts/GenSeed", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AccountsServer is the server API for Accounts service.
type AccountsServer interface {
	// Generate cryptographic seed that is used to derive all the cryptographic
	// keys necessary for Mintter to work. It's currenly supposed to be using
	// LND's Aezeed implementation, that solves some of the issues with BIP-39.
	// The seed is encoded as a mnemonic of N human readable words. The seed could
	// be reconstructed given these words and the passphrase.
	//
	// See: https://github.com/lightningnetwork/lnd/tree/master/aezeed.
	GenSeed(context.Context, *GenSeedRequest) (*GenSeedResponse, error)
}

// UnimplementedAccountsServer can be embedded to have forward compatible implementations.
type UnimplementedAccountsServer struct {
}

func (*UnimplementedAccountsServer) GenSeed(ctx context.Context, req *GenSeedRequest) (*GenSeedResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GenSeed not implemented")
}

func RegisterAccountsServer(s *grpc.Server, srv AccountsServer) {
	s.RegisterService(&_Accounts_serviceDesc, srv)
}

func _Accounts_GenSeed_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GenSeedRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AccountsServer).GenSeed(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.Accounts/GenSeed",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AccountsServer).GenSeed(ctx, req.(*GenSeedRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Accounts_serviceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.Accounts",
	HandlerType: (*AccountsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GenSeed",
			Handler:    _Accounts_GenSeed_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "mintter.proto",
}
