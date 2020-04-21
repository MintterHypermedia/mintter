// Code generated by protoc-gen-go. DO NOT EDIT.
// source: p2p.proto

package internal

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

type HandshakeRequest struct {
	// Profile of the request initiator.
	Profile              *Profile `protobuf:"bytes,1,opt,name=profile,proto3" json:"profile,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *HandshakeRequest) Reset()         { *m = HandshakeRequest{} }
func (m *HandshakeRequest) String() string { return proto.CompactTextString(m) }
func (*HandshakeRequest) ProtoMessage()    {}
func (*HandshakeRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{0}
}

func (m *HandshakeRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_HandshakeRequest.Unmarshal(m, b)
}
func (m *HandshakeRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_HandshakeRequest.Marshal(b, m, deterministic)
}
func (m *HandshakeRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_HandshakeRequest.Merge(m, src)
}
func (m *HandshakeRequest) XXX_Size() int {
	return xxx_messageInfo_HandshakeRequest.Size(m)
}
func (m *HandshakeRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_HandshakeRequest.DiscardUnknown(m)
}

var xxx_messageInfo_HandshakeRequest proto.InternalMessageInfo

func (m *HandshakeRequest) GetProfile() *Profile {
	if m != nil {
		return m.Profile
	}
	return nil
}

type HandshakeResponse struct {
	// Profile of the responding peer.
	Profile              *Profile `protobuf:"bytes,2,opt,name=profile,proto3" json:"profile,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *HandshakeResponse) Reset()         { *m = HandshakeResponse{} }
func (m *HandshakeResponse) String() string { return proto.CompactTextString(m) }
func (*HandshakeResponse) ProtoMessage()    {}
func (*HandshakeResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{1}
}

func (m *HandshakeResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_HandshakeResponse.Unmarshal(m, b)
}
func (m *HandshakeResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_HandshakeResponse.Marshal(b, m, deterministic)
}
func (m *HandshakeResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_HandshakeResponse.Merge(m, src)
}
func (m *HandshakeResponse) XXX_Size() int {
	return xxx_messageInfo_HandshakeResponse.Size(m)
}
func (m *HandshakeResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_HandshakeResponse.DiscardUnknown(m)
}

var xxx_messageInfo_HandshakeResponse proto.InternalMessageInfo

func (m *HandshakeResponse) GetProfile() *Profile {
	if m != nil {
		return m.Profile
	}
	return nil
}

type PingRequest struct {
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PingRequest) Reset()         { *m = PingRequest{} }
func (m *PingRequest) String() string { return proto.CompactTextString(m) }
func (*PingRequest) ProtoMessage()    {}
func (*PingRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{2}
}

func (m *PingRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PingRequest.Unmarshal(m, b)
}
func (m *PingRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PingRequest.Marshal(b, m, deterministic)
}
func (m *PingRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PingRequest.Merge(m, src)
}
func (m *PingRequest) XXX_Size() int {
	return xxx_messageInfo_PingRequest.Size(m)
}
func (m *PingRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_PingRequest.DiscardUnknown(m)
}

var xxx_messageInfo_PingRequest proto.InternalMessageInfo

type PingResponse struct {
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PingResponse) Reset()         { *m = PingResponse{} }
func (m *PingResponse) String() string { return proto.CompactTextString(m) }
func (*PingResponse) ProtoMessage()    {}
func (*PingResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{3}
}

func (m *PingResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PingResponse.Unmarshal(m, b)
}
func (m *PingResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PingResponse.Marshal(b, m, deterministic)
}
func (m *PingResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PingResponse.Merge(m, src)
}
func (m *PingResponse) XXX_Size() int {
	return xxx_messageInfo_PingResponse.Size(m)
}
func (m *PingResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_PingResponse.DiscardUnknown(m)
}

var xxx_messageInfo_PingResponse proto.InternalMessageInfo

type GetProfileRequest struct {
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetProfileRequest) Reset()         { *m = GetProfileRequest{} }
func (m *GetProfileRequest) String() string { return proto.CompactTextString(m) }
func (*GetProfileRequest) ProtoMessage()    {}
func (*GetProfileRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{4}
}

func (m *GetProfileRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetProfileRequest.Unmarshal(m, b)
}
func (m *GetProfileRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetProfileRequest.Marshal(b, m, deterministic)
}
func (m *GetProfileRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetProfileRequest.Merge(m, src)
}
func (m *GetProfileRequest) XXX_Size() int {
	return xxx_messageInfo_GetProfileRequest.Size(m)
}
func (m *GetProfileRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetProfileRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetProfileRequest proto.InternalMessageInfo

type GetLogRecordsRequest struct {
	// Log name in form of <account-id>/<log-name>
	LogName string `protobuf:"bytes,1,opt,name=log_name,json=logName,proto3" json:"log_name,omitempty"`
	// Only return records that starts from this sequence number (inclusive).
	StartSeq int64 `protobuf:"varint,2,opt,name=start_seq,json=startSeq,proto3" json:"start_seq,omitempty"`
	// Limit number of records to return.
	Limit                int64    `protobuf:"varint,3,opt,name=limit,proto3" json:"limit,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetLogRecordsRequest) Reset()         { *m = GetLogRecordsRequest{} }
func (m *GetLogRecordsRequest) String() string { return proto.CompactTextString(m) }
func (*GetLogRecordsRequest) ProtoMessage()    {}
func (*GetLogRecordsRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{5}
}

func (m *GetLogRecordsRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetLogRecordsRequest.Unmarshal(m, b)
}
func (m *GetLogRecordsRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetLogRecordsRequest.Marshal(b, m, deterministic)
}
func (m *GetLogRecordsRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetLogRecordsRequest.Merge(m, src)
}
func (m *GetLogRecordsRequest) XXX_Size() int {
	return xxx_messageInfo_GetLogRecordsRequest.Size(m)
}
func (m *GetLogRecordsRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetLogRecordsRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetLogRecordsRequest proto.InternalMessageInfo

func (m *GetLogRecordsRequest) GetLogName() string {
	if m != nil {
		return m.LogName
	}
	return ""
}

func (m *GetLogRecordsRequest) GetStartSeq() int64 {
	if m != nil {
		return m.StartSeq
	}
	return 0
}

func (m *GetLogRecordsRequest) GetLimit() int64 {
	if m != nil {
		return m.Limit
	}
	return 0
}

type GetLogRecordsResponse struct {
	LogName              string       `protobuf:"bytes,1,opt,name=log_name,json=logName,proto3" json:"log_name,omitempty"`
	Records              []*LogRecord `protobuf:"bytes,2,rep,name=records,proto3" json:"records,omitempty"`
	XXX_NoUnkeyedLiteral struct{}     `json:"-"`
	XXX_unrecognized     []byte       `json:"-"`
	XXX_sizecache        int32        `json:"-"`
}

func (m *GetLogRecordsResponse) Reset()         { *m = GetLogRecordsResponse{} }
func (m *GetLogRecordsResponse) String() string { return proto.CompactTextString(m) }
func (*GetLogRecordsResponse) ProtoMessage()    {}
func (*GetLogRecordsResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{6}
}

func (m *GetLogRecordsResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetLogRecordsResponse.Unmarshal(m, b)
}
func (m *GetLogRecordsResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetLogRecordsResponse.Marshal(b, m, deterministic)
}
func (m *GetLogRecordsResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetLogRecordsResponse.Merge(m, src)
}
func (m *GetLogRecordsResponse) XXX_Size() int {
	return xxx_messageInfo_GetLogRecordsResponse.Size(m)
}
func (m *GetLogRecordsResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_GetLogRecordsResponse.DiscardUnknown(m)
}

var xxx_messageInfo_GetLogRecordsResponse proto.InternalMessageInfo

func (m *GetLogRecordsResponse) GetLogName() string {
	if m != nil {
		return m.LogName
	}
	return ""
}

func (m *GetLogRecordsResponse) GetRecords() []*LogRecord {
	if m != nil {
		return m.Records
	}
	return nil
}

type LogRecord struct {
	Seq                  int64    `protobuf:"varint,1,opt,name=seq,proto3" json:"seq,omitempty"`
	Data                 []byte   `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *LogRecord) Reset()         { *m = LogRecord{} }
func (m *LogRecord) String() string { return proto.CompactTextString(m) }
func (*LogRecord) ProtoMessage()    {}
func (*LogRecord) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{7}
}

func (m *LogRecord) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_LogRecord.Unmarshal(m, b)
}
func (m *LogRecord) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_LogRecord.Marshal(b, m, deterministic)
}
func (m *LogRecord) XXX_Merge(src proto.Message) {
	xxx_messageInfo_LogRecord.Merge(m, src)
}
func (m *LogRecord) XXX_Size() int {
	return xxx_messageInfo_LogRecord.Size(m)
}
func (m *LogRecord) XXX_DiscardUnknown() {
	xxx_messageInfo_LogRecord.DiscardUnknown(m)
}

var xxx_messageInfo_LogRecord proto.InternalMessageInfo

func (m *LogRecord) GetSeq() int64 {
	if m != nil {
		return m.Seq
	}
	return 0
}

func (m *LogRecord) GetData() []byte {
	if m != nil {
		return m.Data
	}
	return nil
}

type Profile struct {
	// ID of the libp2p peer.
	PeerId string `protobuf:"bytes,1,opt,name=peer_id,json=peerId,proto3" json:"peer_id,omitempty"`
	// ID of the Mintter account.
	AccountId string `protobuf:"bytes,2,opt,name=account_id,json=accountId,proto3" json:"account_id,omitempty"`
	// Human readable username.
	Username string `protobuf:"bytes,3,opt,name=username,proto3" json:"username,omitempty"`
	// Optional. Public email.
	Email string `protobuf:"bytes,4,opt,name=email,proto3" json:"email,omitempty"`
	// Optional. Public bio.
	Bio                  string   `protobuf:"bytes,5,opt,name=bio,proto3" json:"bio,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Profile) Reset()         { *m = Profile{} }
func (m *Profile) String() string { return proto.CompactTextString(m) }
func (*Profile) ProtoMessage()    {}
func (*Profile) Descriptor() ([]byte, []int) {
	return fileDescriptor_e7fdddb109e6467a, []int{8}
}

func (m *Profile) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Profile.Unmarshal(m, b)
}
func (m *Profile) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Profile.Marshal(b, m, deterministic)
}
func (m *Profile) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Profile.Merge(m, src)
}
func (m *Profile) XXX_Size() int {
	return xxx_messageInfo_Profile.Size(m)
}
func (m *Profile) XXX_DiscardUnknown() {
	xxx_messageInfo_Profile.DiscardUnknown(m)
}

var xxx_messageInfo_Profile proto.InternalMessageInfo

func (m *Profile) GetPeerId() string {
	if m != nil {
		return m.PeerId
	}
	return ""
}

func (m *Profile) GetAccountId() string {
	if m != nil {
		return m.AccountId
	}
	return ""
}

func (m *Profile) GetUsername() string {
	if m != nil {
		return m.Username
	}
	return ""
}

func (m *Profile) GetEmail() string {
	if m != nil {
		return m.Email
	}
	return ""
}

func (m *Profile) GetBio() string {
	if m != nil {
		return m.Bio
	}
	return ""
}

func init() {
	proto.RegisterType((*HandshakeRequest)(nil), "mintter.p2p.HandshakeRequest")
	proto.RegisterType((*HandshakeResponse)(nil), "mintter.p2p.HandshakeResponse")
	proto.RegisterType((*PingRequest)(nil), "mintter.p2p.PingRequest")
	proto.RegisterType((*PingResponse)(nil), "mintter.p2p.PingResponse")
	proto.RegisterType((*GetProfileRequest)(nil), "mintter.p2p.GetProfileRequest")
	proto.RegisterType((*GetLogRecordsRequest)(nil), "mintter.p2p.GetLogRecordsRequest")
	proto.RegisterType((*GetLogRecordsResponse)(nil), "mintter.p2p.GetLogRecordsResponse")
	proto.RegisterType((*LogRecord)(nil), "mintter.p2p.LogRecord")
	proto.RegisterType((*Profile)(nil), "mintter.p2p.Profile")
}

func init() {
	proto.RegisterFile("p2p.proto", fileDescriptor_e7fdddb109e6467a)
}

var fileDescriptor_e7fdddb109e6467a = []byte{
	// 444 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x53, 0x4d, 0x6f, 0xd3, 0x40,
	0x10, 0x6d, 0xe2, 0xb4, 0x8e, 0xc7, 0x2d, 0x6a, 0x87, 0x00, 0xae, 0x51, 0x51, 0xd9, 0x53, 0x4f,
	0x16, 0x98, 0x33, 0x97, 0x82, 0x54, 0x2a, 0x55, 0x28, 0x72, 0x2f, 0x88, 0x4b, 0xb4, 0x8d, 0x07,
	0xb3, 0xc2, 0xf6, 0x3a, 0xeb, 0x0d, 0xff, 0x80, 0x3f, 0xc5, 0xaf, 0x43, 0xbb, 0xfe, 0x68, 0x9c,
	0x96, 0xa8, 0xb7, 0x9d, 0x79, 0xb3, 0x6f, 0xdf, 0x1b, 0x3f, 0x83, 0x57, 0xc5, 0x55, 0x54, 0x29,
	0xa9, 0x25, 0xfa, 0x85, 0x28, 0xb5, 0x26, 0x15, 0x55, 0x71, 0xc5, 0x2e, 0xe1, 0xf8, 0x0b, 0x2f,
	0xd3, 0xfa, 0x27, 0xff, 0x45, 0x09, 0xad, 0xd6, 0x54, 0x6b, 0x8c, 0xc0, 0xad, 0x94, 0xfc, 0x21,
	0x72, 0x0a, 0x46, 0xe7, 0xa3, 0x0b, 0x3f, 0x9e, 0x45, 0x1b, 0x57, 0xa2, 0x79, 0x83, 0x25, 0xdd,
	0x10, 0xfb, 0x04, 0x27, 0x1b, 0x1c, 0x75, 0x25, 0xcb, 0x9a, 0x36, 0x49, 0xc6, 0x4f, 0x21, 0x39,
	0x02, 0x7f, 0x2e, 0xca, 0xac, 0xd5, 0xc0, 0x9e, 0xc1, 0x61, 0x53, 0x36, 0x74, 0xec, 0x39, 0x9c,
	0x5c, 0x91, 0xee, 0x6e, 0xb5, 0x43, 0x29, 0xcc, 0xae, 0x48, 0xdf, 0xc8, 0x2c, 0xa1, 0xa5, 0x54,
	0x69, 0xdd, 0x19, 0x38, 0x85, 0x69, 0x2e, 0xb3, 0x45, 0xc9, 0x8b, 0xc6, 0x81, 0x97, 0xb8, 0xb9,
	0xcc, 0xbe, 0xf2, 0x82, 0xf0, 0x35, 0x78, 0xb5, 0xe6, 0x4a, 0x2f, 0x6a, 0x5a, 0x59, 0x61, 0x4e,
	0x32, 0xb5, 0x8d, 0x5b, 0x5a, 0xe1, 0x0c, 0xf6, 0x73, 0x51, 0x08, 0x1d, 0x38, 0x16, 0x68, 0x0a,
	0x96, 0xc2, 0x8b, 0xad, 0x57, 0x5a, 0x8b, 0x3b, 0x9e, 0x79, 0x07, 0xae, 0x6a, 0xa6, 0x83, 0xf1,
	0xb9, 0x73, 0xe1, 0xc7, 0x2f, 0x07, 0xee, 0x7b, 0xb2, 0xa4, 0x1b, 0x63, 0xef, 0xc1, 0xeb, 0xbb,
	0x78, 0x0c, 0x8e, 0xd1, 0x37, 0xb2, 0x32, 0xcc, 0x11, 0x11, 0x26, 0x29, 0xd7, 0xdc, 0x4a, 0x3e,
	0x4c, 0xec, 0x99, 0xfd, 0x19, 0x81, 0xdb, 0x6e, 0x04, 0x5f, 0x81, 0x5b, 0x11, 0xa9, 0x85, 0x48,
	0x5b, 0x29, 0x07, 0xa6, 0xbc, 0x4e, 0xf1, 0x0c, 0x80, 0x2f, 0x97, 0x72, 0x5d, 0x6a, 0x83, 0x8d,
	0x2d, 0xe6, 0xb5, 0x9d, 0xeb, 0x14, 0x43, 0x98, 0xae, 0x6b, 0x52, 0xd6, 0x83, 0x63, 0xc1, 0xbe,
	0x36, 0xeb, 0xa0, 0x82, 0x8b, 0x3c, 0x98, 0x58, 0xa0, 0x29, 0x8c, 0xb6, 0x3b, 0x21, 0x83, 0x7d,
	0xdb, 0x33, 0xc7, 0xf8, 0xef, 0x18, 0xfc, 0x39, 0x91, 0xba, 0x25, 0xf5, 0x5b, 0x2c, 0x09, 0x6f,
	0xc0, 0xeb, 0xf3, 0x80, 0x67, 0x03, 0xe3, 0xdb, 0x59, 0x0b, 0xdf, 0xfc, 0x0f, 0x6e, 0xbf, 0xfb,
	0x1e, 0x7e, 0x84, 0x89, 0x49, 0x02, 0x06, 0xc3, 0xfc, 0xdc, 0x67, 0x25, 0x3c, 0x7d, 0x04, 0xe9,
	0xaf, 0x7f, 0x06, 0xb8, 0x0f, 0x0e, 0x0e, 0x9f, 0x7b, 0x90, 0xa8, 0xf0, 0xd1, 0x90, 0xb2, 0x3d,
	0xfc, 0x06, 0x47, 0x83, 0x0c, 0xe0, 0xdb, 0x6d, 0xa2, 0x07, 0x29, 0x0c, 0xd9, 0xae, 0x91, 0x4e,
	0xdf, 0x25, 0x7c, 0x9f, 0x8a, 0x52, 0x9b, 0x8d, 0xe7, 0x77, 0x07, 0xf6, 0x07, 0xfd, 0xf0, 0x2f,
	0x00, 0x00, 0xff, 0xff, 0x1b, 0x6b, 0xe7, 0xad, 0xad, 0x03, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConnInterface

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// PeerServiceClient is the client API for PeerService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type PeerServiceClient interface {
	// Handshake performs profile exchange for the first time between peers.
	// This should ideally only happen once between a given pair of peers.
	Handshake(ctx context.Context, in *HandshakeRequest, opts ...grpc.CallOption) (*HandshakeResponse, error)
	Ping(ctx context.Context, in *PingRequest, opts ...grpc.CallOption) (*PingResponse, error)
	GetProfile(ctx context.Context, in *GetProfileRequest, opts ...grpc.CallOption) (*Profile, error)
	GetLogRecords(ctx context.Context, in *GetLogRecordsRequest, opts ...grpc.CallOption) (*GetLogRecordsResponse, error)
}

type peerServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewPeerServiceClient(cc grpc.ClientConnInterface) PeerServiceClient {
	return &peerServiceClient{cc}
}

func (c *peerServiceClient) Handshake(ctx context.Context, in *HandshakeRequest, opts ...grpc.CallOption) (*HandshakeResponse, error) {
	out := new(HandshakeResponse)
	err := c.cc.Invoke(ctx, "/mintter.p2p.PeerService/Handshake", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *peerServiceClient) Ping(ctx context.Context, in *PingRequest, opts ...grpc.CallOption) (*PingResponse, error) {
	out := new(PingResponse)
	err := c.cc.Invoke(ctx, "/mintter.p2p.PeerService/Ping", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *peerServiceClient) GetProfile(ctx context.Context, in *GetProfileRequest, opts ...grpc.CallOption) (*Profile, error) {
	out := new(Profile)
	err := c.cc.Invoke(ctx, "/mintter.p2p.PeerService/GetProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *peerServiceClient) GetLogRecords(ctx context.Context, in *GetLogRecordsRequest, opts ...grpc.CallOption) (*GetLogRecordsResponse, error) {
	out := new(GetLogRecordsResponse)
	err := c.cc.Invoke(ctx, "/mintter.p2p.PeerService/GetLogRecords", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PeerServiceServer is the server API for PeerService service.
type PeerServiceServer interface {
	// Handshake performs profile exchange for the first time between peers.
	// This should ideally only happen once between a given pair of peers.
	Handshake(context.Context, *HandshakeRequest) (*HandshakeResponse, error)
	Ping(context.Context, *PingRequest) (*PingResponse, error)
	GetProfile(context.Context, *GetProfileRequest) (*Profile, error)
	GetLogRecords(context.Context, *GetLogRecordsRequest) (*GetLogRecordsResponse, error)
}

// UnimplementedPeerServiceServer can be embedded to have forward compatible implementations.
type UnimplementedPeerServiceServer struct {
}

func (*UnimplementedPeerServiceServer) Handshake(ctx context.Context, req *HandshakeRequest) (*HandshakeResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Handshake not implemented")
}
func (*UnimplementedPeerServiceServer) Ping(ctx context.Context, req *PingRequest) (*PingResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Ping not implemented")
}
func (*UnimplementedPeerServiceServer) GetProfile(ctx context.Context, req *GetProfileRequest) (*Profile, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetProfile not implemented")
}
func (*UnimplementedPeerServiceServer) GetLogRecords(ctx context.Context, req *GetLogRecordsRequest) (*GetLogRecordsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetLogRecords not implemented")
}

func RegisterPeerServiceServer(s *grpc.Server, srv PeerServiceServer) {
	s.RegisterService(&_PeerService_serviceDesc, srv)
}

func _PeerService_Handshake_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(HandshakeRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PeerServiceServer).Handshake(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/mintter.p2p.PeerService/Handshake",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PeerServiceServer).Handshake(ctx, req.(*HandshakeRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PeerService_Ping_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PingRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PeerServiceServer).Ping(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/mintter.p2p.PeerService/Ping",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PeerServiceServer).Ping(ctx, req.(*PingRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PeerService_GetProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetProfileRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PeerServiceServer).GetProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/mintter.p2p.PeerService/GetProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PeerServiceServer).GetProfile(ctx, req.(*GetProfileRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PeerService_GetLogRecords_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetLogRecordsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PeerServiceServer).GetLogRecords(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/mintter.p2p.PeerService/GetLogRecords",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PeerServiceServer).GetLogRecords(ctx, req.(*GetLogRecordsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _PeerService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "mintter.p2p.PeerService",
	HandlerType: (*PeerServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Handshake",
			Handler:    _PeerService_Handshake_Handler,
		},
		{
			MethodName: "Ping",
			Handler:    _PeerService_Ping_Handler,
		},
		{
			MethodName: "GetProfile",
			Handler:    _PeerService_GetProfile_Handler,
		},
		{
			MethodName: "GetLogRecords",
			Handler:    _PeerService_GetLogRecords_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "p2p.proto",
}
