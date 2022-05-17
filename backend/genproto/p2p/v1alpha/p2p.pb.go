// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.0
// 	protoc        v3.19.3
// source: p2p/v1alpha/p2p.proto

package p2p

import (
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

type HandshakeInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Account ID this peer belongs to.
	AccountId string `protobuf:"bytes,1,opt,name=account_id,json=accountId,proto3" json:"account_id,omitempty"`
	// Account Mintter Object ID.
	AccountObjectId string `protobuf:"bytes,2,opt,name=account_object_id,json=accountObjectId,proto3" json:"account_object_id,omitempty"`
	// Version of the Account Object this peer belongs to.
	Version string `protobuf:"bytes,3,opt,name=version,proto3" json:"version,omitempty"`
}

func (x *HandshakeInfo) Reset() {
	*x = HandshakeInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *HandshakeInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*HandshakeInfo) ProtoMessage() {}

func (x *HandshakeInfo) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use HandshakeInfo.ProtoReflect.Descriptor instead.
func (*HandshakeInfo) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{0}
}

func (x *HandshakeInfo) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

func (x *HandshakeInfo) GetAccountObjectId() string {
	if x != nil {
		return x.AccountObjectId
	}
	return ""
}

func (x *HandshakeInfo) GetVersion() string {
	if x != nil {
		return x.Version
	}
	return ""
}

type ListObjectsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *ListObjectsRequest) Reset() {
	*x = ListObjectsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListObjectsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListObjectsRequest) ProtoMessage() {}

func (x *ListObjectsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListObjectsRequest.ProtoReflect.Descriptor instead.
func (*ListObjectsRequest) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{1}
}

type ListObjectsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Objects []*Object `protobuf:"bytes,1,rep,name=objects,proto3" json:"objects,omitempty"`
}

func (x *ListObjectsResponse) Reset() {
	*x = ListObjectsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListObjectsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListObjectsResponse) ProtoMessage() {}

func (x *ListObjectsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListObjectsResponse.ProtoReflect.Descriptor instead.
func (*ListObjectsResponse) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{2}
}

func (x *ListObjectsResponse) GetObjects() []*Object {
	if x != nil {
		return x.Objects
	}
	return nil
}

type Object struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id         string     `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	VersionSet []*Version `protobuf:"bytes,2,rep,name=version_set,json=versionSet,proto3" json:"version_set,omitempty"`
}

func (x *Object) Reset() {
	*x = Object{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Object) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Object) ProtoMessage() {}

func (x *Object) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Object.ProtoReflect.Descriptor instead.
func (*Object) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{3}
}

func (x *Object) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Object) GetVersionSet() []*Version {
	if x != nil {
		return x.VersionSet
	}
	return nil
}

type Version struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	AccountId string `protobuf:"bytes,1,opt,name=account_id,json=accountId,proto3" json:"account_id,omitempty"`
	DeviceId  string `protobuf:"bytes,2,opt,name=device_id,json=deviceId,proto3" json:"device_id,omitempty"`
	Version   string `protobuf:"bytes,3,opt,name=version,proto3" json:"version,omitempty"`
}

func (x *Version) Reset() {
	*x = Version{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Version) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Version) ProtoMessage() {}

func (x *Version) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Version.ProtoReflect.Descriptor instead.
func (*Version) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{4}
}

func (x *Version) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

func (x *Version) GetDeviceId() string {
	if x != nil {
		return x.DeviceId
	}
	return ""
}

func (x *Version) GetVersion() string {
	if x != nil {
		return x.Version
	}
	return ""
}

type GetPeerInfoRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *GetPeerInfoRequest) Reset() {
	*x = GetPeerInfoRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetPeerInfoRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetPeerInfoRequest) ProtoMessage() {}

func (x *GetPeerInfoRequest) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetPeerInfoRequest.ProtoReflect.Descriptor instead.
func (*GetPeerInfoRequest) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{5}
}

type PeerInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Account ID this peer belongs to.
	AccountId string `protobuf:"bytes,1,opt,name=account_id,json=accountId,proto3" json:"account_id,omitempty"`
}

func (x *PeerInfo) Reset() {
	*x = PeerInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PeerInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PeerInfo) ProtoMessage() {}

func (x *PeerInfo) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PeerInfo.ProtoReflect.Descriptor instead.
func (*PeerInfo) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{6}
}

func (x *PeerInfo) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

// List of wanted and unwanted object IDs. Can be used as a snapshot or deltas.
type RequestInvoiceRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// The invoice amount in satoshis
	AmountSats int64 `protobuf:"varint,1,opt,name=amount_sats,json=amountSats,proto3" json:"amount_sats,omitempty"`
	// Optional requested memo to be attached in the invoice
	Memo string `protobuf:"bytes,2,opt,name=memo,proto3" json:"memo,omitempty"`
	// True to request a hold invoice instead of a regular one. If true, then preimage_hash should be filled
	HoldInvoice bool `protobuf:"varint,3,opt,name=hold_invoice,json=holdInvoice,proto3" json:"hold_invoice,omitempty"`
	// Preimage hash of the requested hold invoice. If hold_invoice is set to false this field is skipped
	PreimageHash []byte `protobuf:"bytes,4,opt,name=preimage_hash,json=preimageHash,proto3" json:"preimage_hash,omitempty"`
}

func (x *RequestInvoiceRequest) Reset() {
	*x = RequestInvoiceRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *RequestInvoiceRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*RequestInvoiceRequest) ProtoMessage() {}

func (x *RequestInvoiceRequest) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use RequestInvoiceRequest.ProtoReflect.Descriptor instead.
func (*RequestInvoiceRequest) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{7}
}

func (x *RequestInvoiceRequest) GetAmountSats() int64 {
	if x != nil {
		return x.AmountSats
	}
	return 0
}

func (x *RequestInvoiceRequest) GetMemo() string {
	if x != nil {
		return x.Memo
	}
	return ""
}

func (x *RequestInvoiceRequest) GetHoldInvoice() bool {
	if x != nil {
		return x.HoldInvoice
	}
	return false
}

func (x *RequestInvoiceRequest) GetPreimageHash() []byte {
	if x != nil {
		return x.PreimageHash
	}
	return nil
}

type RequestInvoiceResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Text encoded BOLT-11 Invoice
	PayReq string `protobuf:"bytes,1,opt,name=pay_req,json=payReq,proto3" json:"pay_req,omitempty"`
}

func (x *RequestInvoiceResponse) Reset() {
	*x = RequestInvoiceResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_p2p_v1alpha_p2p_proto_msgTypes[8]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *RequestInvoiceResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*RequestInvoiceResponse) ProtoMessage() {}

func (x *RequestInvoiceResponse) ProtoReflect() protoreflect.Message {
	mi := &file_p2p_v1alpha_p2p_proto_msgTypes[8]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use RequestInvoiceResponse.ProtoReflect.Descriptor instead.
func (*RequestInvoiceResponse) Descriptor() ([]byte, []int) {
	return file_p2p_v1alpha_p2p_proto_rawDescGZIP(), []int{8}
}

func (x *RequestInvoiceResponse) GetPayReq() string {
	if x != nil {
		return x.PayReq
	}
	return ""
}

var File_p2p_v1alpha_p2p_proto protoreflect.FileDescriptor

var file_p2p_v1alpha_p2p_proto_rawDesc = []byte{
	0x0a, 0x15, 0x70, 0x32, 0x70, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2f, 0x70, 0x32,
	0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x17, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e,
	0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x22, 0x74, 0x0a, 0x0d, 0x48, 0x61, 0x6e, 0x64, 0x73, 0x68, 0x61, 0x6b, 0x65, 0x49, 0x6e, 0x66,
	0x6f, 0x12, 0x1d, 0x0a, 0x0a, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x69, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64,
	0x12, 0x2a, 0x0a, 0x11, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x6f, 0x62, 0x6a, 0x65,
	0x63, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0f, 0x61, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x49, 0x64, 0x12, 0x18, 0x0a, 0x07,
	0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x76,
	0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x14, 0x0a, 0x12, 0x4c, 0x69, 0x73, 0x74, 0x4f, 0x62,
	0x6a, 0x65, 0x63, 0x74, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x22, 0x50, 0x0a, 0x13,
	0x4c, 0x69, 0x73, 0x74, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f,
	0x6e, 0x73, 0x65, 0x12, 0x39, 0x0a, 0x07, 0x6f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x18, 0x01,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74,
	0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4f,
	0x62, 0x6a, 0x65, 0x63, 0x74, 0x52, 0x07, 0x6f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x22, 0x5b,
	0x0a, 0x06, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x41, 0x0a, 0x0b, 0x76, 0x65, 0x72, 0x73,
	0x69, 0x6f, 0x6e, 0x5f, 0x73, 0x65, 0x74, 0x18, 0x02, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x20, 0x2e,
	0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x52,
	0x0a, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x53, 0x65, 0x74, 0x22, 0x5f, 0x0a, 0x07, 0x56,
	0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x12, 0x1d, 0x0a, 0x0a, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x61, 0x63, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x49, 0x64, 0x12, 0x1b, 0x0a, 0x09, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x5f,
	0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65,
	0x49, 0x64, 0x12, 0x18, 0x0a, 0x07, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x18, 0x03, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x07, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x14, 0x0a, 0x12,
	0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x22, 0x29, 0x0a, 0x08, 0x50, 0x65, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x1d,
	0x0a, 0x0a, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64, 0x22, 0x94, 0x01,
	0x0a, 0x15, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x49, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x1f, 0x0a, 0x0b, 0x61, 0x6d, 0x6f, 0x75, 0x6e,
	0x74, 0x5f, 0x73, 0x61, 0x74, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x0a, 0x61, 0x6d,
	0x6f, 0x75, 0x6e, 0x74, 0x53, 0x61, 0x74, 0x73, 0x12, 0x12, 0x0a, 0x04, 0x6d, 0x65, 0x6d, 0x6f,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6d, 0x65, 0x6d, 0x6f, 0x12, 0x21, 0x0a, 0x0c,
	0x68, 0x6f, 0x6c, 0x64, 0x5f, 0x69, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x08, 0x52, 0x0b, 0x68, 0x6f, 0x6c, 0x64, 0x49, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65, 0x12,
	0x23, 0x0a, 0x0d, 0x70, 0x72, 0x65, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x5f, 0x68, 0x61, 0x73, 0x68,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x0c, 0x70, 0x72, 0x65, 0x69, 0x6d, 0x61, 0x67, 0x65,
	0x48, 0x61, 0x73, 0x68, 0x22, 0x31, 0x0a, 0x16, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x49,
	0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x17,
	0x0a, 0x07, 0x70, 0x61, 0x79, 0x5f, 0x72, 0x65, 0x71, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x06, 0x70, 0x61, 0x79, 0x52, 0x65, 0x71, 0x32, 0x9e, 0x03, 0x0a, 0x03, 0x50, 0x32, 0x50, 0x12,
	0x5b, 0x0a, 0x09, 0x48, 0x61, 0x6e, 0x64, 0x73, 0x68, 0x61, 0x6b, 0x65, 0x12, 0x26, 0x2e, 0x63,
	0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x48, 0x61, 0x6e, 0x64, 0x73, 0x68, 0x61, 0x6b, 0x65,
	0x49, 0x6e, 0x66, 0x6f, 0x1a, 0x26, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74,
	0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x48,
	0x61, 0x6e, 0x64, 0x73, 0x68, 0x61, 0x6b, 0x65, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x68, 0x0a, 0x0b,
	0x4c, 0x69, 0x73, 0x74, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x12, 0x2b, 0x2e, 0x63, 0x6f,
	0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31,
	0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74,
	0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2c, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d,
	0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x5d, 0x0a, 0x0b, 0x47, 0x65, 0x74, 0x50, 0x65, 0x65,
	0x72, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x2b, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e,
	0x47, 0x65, 0x74, 0x50, 0x65, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x21, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72,
	0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x65, 0x65,
	0x72, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x71, 0x0a, 0x0e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x49, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65, 0x12, 0x2e, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69,
	0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x2e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x49, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2f, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69,
	0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x70, 0x32, 0x70, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x2e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x49, 0x6e, 0x76, 0x6f, 0x69, 0x63, 0x65,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x2a, 0x5a, 0x28, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x67, 0x65, 0x6e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x70, 0x32, 0x70, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x3b, 0x70, 0x32, 0x70, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_p2p_v1alpha_p2p_proto_rawDescOnce sync.Once
	file_p2p_v1alpha_p2p_proto_rawDescData = file_p2p_v1alpha_p2p_proto_rawDesc
)

func file_p2p_v1alpha_p2p_proto_rawDescGZIP() []byte {
	file_p2p_v1alpha_p2p_proto_rawDescOnce.Do(func() {
		file_p2p_v1alpha_p2p_proto_rawDescData = protoimpl.X.CompressGZIP(file_p2p_v1alpha_p2p_proto_rawDescData)
	})
	return file_p2p_v1alpha_p2p_proto_rawDescData
}

var file_p2p_v1alpha_p2p_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_p2p_v1alpha_p2p_proto_goTypes = []interface{}{
	(*HandshakeInfo)(nil),          // 0: com.mintter.p2p.v1alpha.HandshakeInfo
	(*ListObjectsRequest)(nil),     // 1: com.mintter.p2p.v1alpha.ListObjectsRequest
	(*ListObjectsResponse)(nil),    // 2: com.mintter.p2p.v1alpha.ListObjectsResponse
	(*Object)(nil),                 // 3: com.mintter.p2p.v1alpha.Object
	(*Version)(nil),                // 4: com.mintter.p2p.v1alpha.Version
	(*GetPeerInfoRequest)(nil),     // 5: com.mintter.p2p.v1alpha.GetPeerInfoRequest
	(*PeerInfo)(nil),               // 6: com.mintter.p2p.v1alpha.PeerInfo
	(*RequestInvoiceRequest)(nil),  // 7: com.mintter.p2p.v1alpha.RequestInvoiceRequest
	(*RequestInvoiceResponse)(nil), // 8: com.mintter.p2p.v1alpha.RequestInvoiceResponse
}
var file_p2p_v1alpha_p2p_proto_depIdxs = []int32{
	3, // 0: com.mintter.p2p.v1alpha.ListObjectsResponse.objects:type_name -> com.mintter.p2p.v1alpha.Object
	4, // 1: com.mintter.p2p.v1alpha.Object.version_set:type_name -> com.mintter.p2p.v1alpha.Version
	0, // 2: com.mintter.p2p.v1alpha.P2P.Handshake:input_type -> com.mintter.p2p.v1alpha.HandshakeInfo
	1, // 3: com.mintter.p2p.v1alpha.P2P.ListObjects:input_type -> com.mintter.p2p.v1alpha.ListObjectsRequest
	5, // 4: com.mintter.p2p.v1alpha.P2P.GetPeerInfo:input_type -> com.mintter.p2p.v1alpha.GetPeerInfoRequest
	7, // 5: com.mintter.p2p.v1alpha.P2P.RequestInvoice:input_type -> com.mintter.p2p.v1alpha.RequestInvoiceRequest
	0, // 6: com.mintter.p2p.v1alpha.P2P.Handshake:output_type -> com.mintter.p2p.v1alpha.HandshakeInfo
	2, // 7: com.mintter.p2p.v1alpha.P2P.ListObjects:output_type -> com.mintter.p2p.v1alpha.ListObjectsResponse
	6, // 8: com.mintter.p2p.v1alpha.P2P.GetPeerInfo:output_type -> com.mintter.p2p.v1alpha.PeerInfo
	8, // 9: com.mintter.p2p.v1alpha.P2P.RequestInvoice:output_type -> com.mintter.p2p.v1alpha.RequestInvoiceResponse
	6, // [6:10] is the sub-list for method output_type
	2, // [2:6] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_p2p_v1alpha_p2p_proto_init() }
func file_p2p_v1alpha_p2p_proto_init() {
	if File_p2p_v1alpha_p2p_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_p2p_v1alpha_p2p_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*HandshakeInfo); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListObjectsRequest); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListObjectsResponse); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Object); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Version); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetPeerInfoRequest); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PeerInfo); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*RequestInvoiceRequest); i {
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
		file_p2p_v1alpha_p2p_proto_msgTypes[8].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*RequestInvoiceResponse); i {
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
			RawDescriptor: file_p2p_v1alpha_p2p_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_p2p_v1alpha_p2p_proto_goTypes,
		DependencyIndexes: file_p2p_v1alpha_p2p_proto_depIdxs,
		MessageInfos:      file_p2p_v1alpha_p2p_proto_msgTypes,
	}.Build()
	File_p2p_v1alpha_p2p_proto = out.File
	file_p2p_v1alpha_p2p_proto_rawDesc = nil
	file_p2p_v1alpha_p2p_proto_goTypes = nil
	file_p2p_v1alpha_p2p_proto_depIdxs = nil
}
