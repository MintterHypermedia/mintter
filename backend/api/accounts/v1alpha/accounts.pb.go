// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.27.1
// 	protoc        v3.17.3
// source: accounts/v1alpha/accounts.proto

package accounts

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type GetAccountRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// ID of the Account to be looked up. If empty - our own account will be returned.
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *GetAccountRequest) Reset() {
	*x = GetAccountRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetAccountRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetAccountRequest) ProtoMessage() {}

func (x *GetAccountRequest) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetAccountRequest.ProtoReflect.Descriptor instead.
func (*GetAccountRequest) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{0}
}

func (x *GetAccountRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type ListAccountsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	PageSize  int32  `protobuf:"varint,1,opt,name=page_size,json=pageSize,proto3" json:"page_size,omitempty"`
	PageToken string `protobuf:"bytes,2,opt,name=page_token,json=pageToken,proto3" json:"page_token,omitempty"`
}

func (x *ListAccountsRequest) Reset() {
	*x = ListAccountsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListAccountsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListAccountsRequest) ProtoMessage() {}

func (x *ListAccountsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListAccountsRequest.ProtoReflect.Descriptor instead.
func (*ListAccountsRequest) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{1}
}

func (x *ListAccountsRequest) GetPageSize() int32 {
	if x != nil {
		return x.PageSize
	}
	return 0
}

func (x *ListAccountsRequest) GetPageToken() string {
	if x != nil {
		return x.PageToken
	}
	return ""
}

type ListAccountsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Accounts      []*Account `protobuf:"bytes,1,rep,name=accounts,proto3" json:"accounts,omitempty"`
	NextPageToken string     `protobuf:"bytes,2,opt,name=next_page_token,json=nextPageToken,proto3" json:"next_page_token,omitempty"`
}

func (x *ListAccountsResponse) Reset() {
	*x = ListAccountsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListAccountsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListAccountsResponse) ProtoMessage() {}

func (x *ListAccountsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListAccountsResponse.ProtoReflect.Descriptor instead.
func (*ListAccountsResponse) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{2}
}

func (x *ListAccountsResponse) GetAccounts() []*Account {
	if x != nil {
		return x.Accounts
	}
	return nil
}

func (x *ListAccountsResponse) GetNextPageToken() string {
	if x != nil {
		return x.NextPageToken
	}
	return ""
}

type Account struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Mintter Account ID.
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	// Profile information of this account.
	Profile *Profile `protobuf:"bytes,2,opt,name=profile,proto3" json:"profile,omitempty"`
	// List of known devices of this Account.
	Devices map[string]*Device `protobuf:"bytes,3,rep,name=devices,proto3" json:"devices,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
}

func (x *Account) Reset() {
	*x = Account{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Account) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Account) ProtoMessage() {}

func (x *Account) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Account.ProtoReflect.Descriptor instead.
func (*Account) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{3}
}

func (x *Account) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Account) GetProfile() *Profile {
	if x != nil {
		return x.Profile
	}
	return nil
}

func (x *Account) GetDevices() map[string]*Device {
	if x != nil {
		return x.Devices
	}
	return nil
}

type Profile struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Alias string `protobuf:"bytes,1,opt,name=alias,proto3" json:"alias,omitempty"`
	Bio   string `protobuf:"bytes,2,opt,name=bio,proto3" json:"bio,omitempty"`
	Email string `protobuf:"bytes,3,opt,name=email,proto3" json:"email,omitempty"`
}

func (x *Profile) Reset() {
	*x = Profile{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Profile) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Profile) ProtoMessage() {}

func (x *Profile) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Profile.ProtoReflect.Descriptor instead.
func (*Profile) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{4}
}

func (x *Profile) GetAlias() string {
	if x != nil {
		return x.Alias
	}
	return ""
}

func (x *Profile) GetBio() string {
	if x != nil {
		return x.Bio
	}
	return ""
}

func (x *Profile) GetEmail() string {
	if x != nil {
		return x.Email
	}
	return ""
}

type Device struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// CID-encoded Peer ID of this device.
	PeerId string `protobuf:"bytes,1,opt,name=peer_id,json=peerId,proto3" json:"peer_id,omitempty"`
	// Time when this device was registered.
	RegisterTime *timestamppb.Timestamp `protobuf:"bytes,2,opt,name=register_time,json=registerTime,proto3" json:"register_time,omitempty"`
}

func (x *Device) Reset() {
	*x = Device{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Device) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Device) ProtoMessage() {}

func (x *Device) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Device.ProtoReflect.Descriptor instead.
func (*Device) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{5}
}

func (x *Device) GetPeerId() string {
	if x != nil {
		return x.PeerId
	}
	return ""
}

func (x *Device) GetRegisterTime() *timestamppb.Timestamp {
	if x != nil {
		return x.RegisterTime
	}
	return nil
}

type DeviceRegistered struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Proof []byte `protobuf:"bytes,1,opt,name=proof,proto3" json:"proof,omitempty"`
}

func (x *DeviceRegistered) Reset() {
	*x = DeviceRegistered{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DeviceRegistered) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeviceRegistered) ProtoMessage() {}

func (x *DeviceRegistered) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeviceRegistered.ProtoReflect.Descriptor instead.
func (*DeviceRegistered) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{6}
}

func (x *DeviceRegistered) GetProof() []byte {
	if x != nil {
		return x.Proof
	}
	return nil
}

type ProfileUpdated struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Profile *Profile `protobuf:"bytes,2,opt,name=profile,proto3" json:"profile,omitempty"`
}

func (x *ProfileUpdated) Reset() {
	*x = ProfileUpdated{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[7]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ProfileUpdated) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ProfileUpdated) ProtoMessage() {}

func (x *ProfileUpdated) ProtoReflect() protoreflect.Message {
	mi := &file_accounts_v1alpha_accounts_proto_msgTypes[7]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ProfileUpdated.ProtoReflect.Descriptor instead.
func (*ProfileUpdated) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{7}
}

func (x *ProfileUpdated) GetProfile() *Profile {
	if x != nil {
		return x.Profile
	}
	return nil
}

var File_accounts_v1alpha_accounts_proto protoreflect.FileDescriptor

var file_accounts_v1alpha_accounts_proto_rawDesc = []byte{
	0x0a, 0x1f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x12, 0x1c, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x1a,
	0x1f, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66,
	0x2f, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x22, 0x23, 0x0a, 0x11, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x51, 0x0a, 0x13, 0x4c, 0x69, 0x73, 0x74, 0x41, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x1b, 0x0a, 0x09,
	0x70, 0x61, 0x67, 0x65, 0x5f, 0x73, 0x69, 0x7a, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52,
	0x08, 0x70, 0x61, 0x67, 0x65, 0x53, 0x69, 0x7a, 0x65, 0x12, 0x1d, 0x0a, 0x0a, 0x70, 0x61, 0x67,
	0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x70,
	0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x22, 0x81, 0x01, 0x0a, 0x14, 0x4c, 0x69, 0x73,
	0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x12, 0x41, 0x0a, 0x08, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x18, 0x01, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x52, 0x08, 0x61, 0x63, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x73, 0x12, 0x26, 0x0a, 0x0f, 0x6e, 0x65, 0x78, 0x74, 0x5f, 0x70, 0x61, 0x67,
	0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0d, 0x6e,
	0x65, 0x78, 0x74, 0x50, 0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x22, 0x8a, 0x02, 0x0a,
	0x07, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x3f, 0x0a, 0x07, 0x70, 0x72, 0x6f, 0x66,
	0x69, 0x6c, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e,
	0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73,
	0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65,
	0x52, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x4c, 0x0a, 0x07, 0x64, 0x65, 0x76,
	0x69, 0x63, 0x65, 0x73, 0x18, 0x03, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x32, 0x2e, 0x63, 0x6f, 0x6d,
	0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x2e, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x07,
	0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x73, 0x1a, 0x60, 0x0a, 0x0c, 0x44, 0x65, 0x76, 0x69, 0x63,
	0x65, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x12, 0x10, 0x0a, 0x03, 0x6b, 0x65, 0x79, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6b, 0x65, 0x79, 0x12, 0x3a, 0x0a, 0x05, 0x76, 0x61, 0x6c,
	0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x24, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d,
	0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x52, 0x05,
	0x76, 0x61, 0x6c, 0x75, 0x65, 0x3a, 0x02, 0x38, 0x01, 0x22, 0x47, 0x0a, 0x07, 0x50, 0x72, 0x6f,
	0x66, 0x69, 0x6c, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x61, 0x6c, 0x69, 0x61, 0x73, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x05, 0x61, 0x6c, 0x69, 0x61, 0x73, 0x12, 0x10, 0x0a, 0x03, 0x62, 0x69,
	0x6f, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x62, 0x69, 0x6f, 0x12, 0x14, 0x0a, 0x05,
	0x65, 0x6d, 0x61, 0x69, 0x6c, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x65, 0x6d, 0x61,
	0x69, 0x6c, 0x22, 0x62, 0x0a, 0x06, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x12, 0x17, 0x0a, 0x07,
	0x70, 0x65, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x70,
	0x65, 0x65, 0x72, 0x49, 0x64, 0x12, 0x3f, 0x0a, 0x0d, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65,
	0x72, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67,
	0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54,
	0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0c, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74,
	0x65, 0x72, 0x54, 0x69, 0x6d, 0x65, 0x22, 0x28, 0x0a, 0x10, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
	0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x65, 0x64, 0x12, 0x14, 0x0a, 0x05, 0x70, 0x72,
	0x6f, 0x6f, 0x66, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x05, 0x70, 0x72, 0x6f, 0x6f, 0x66,
	0x22, 0x51, 0x0a, 0x0e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x55, 0x70, 0x64, 0x61, 0x74,
	0x65, 0x64, 0x12, 0x3f, 0x0a, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x07, 0x70, 0x72, 0x6f, 0x66,
	0x69, 0x6c, 0x65, 0x32, 0xc6, 0x02, 0x0a, 0x08, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73,
	0x12, 0x64, 0x0a, 0x0a, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x2f,
	0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x47, 0x65,
	0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x41,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x5d, 0x0a, 0x0d, 0x55, 0x70, 0x64, 0x61, 0x74, 0x65,
	0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69,
	0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x1a, 0x25,
	0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x41, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x75, 0x0a, 0x0c, 0x4c, 0x69, 0x73, 0x74, 0x41, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x73, 0x12, 0x31, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x32, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d,
	0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x41, 0x63, 0x63, 0x6f,
	0x75, 0x6e, 0x74, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x2f, 0x5a, 0x2d,
	0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f,
	0x61, 0x70, 0x69, 0x2f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2f, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x3b, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_accounts_v1alpha_accounts_proto_rawDescOnce sync.Once
	file_accounts_v1alpha_accounts_proto_rawDescData = file_accounts_v1alpha_accounts_proto_rawDesc
)

func file_accounts_v1alpha_accounts_proto_rawDescGZIP() []byte {
	file_accounts_v1alpha_accounts_proto_rawDescOnce.Do(func() {
		file_accounts_v1alpha_accounts_proto_rawDescData = protoimpl.X.CompressGZIP(file_accounts_v1alpha_accounts_proto_rawDescData)
	})
	return file_accounts_v1alpha_accounts_proto_rawDescData
}

var file_accounts_v1alpha_accounts_proto_msgTypes = make([]protoimpl.MessageInfo, 9)
var file_accounts_v1alpha_accounts_proto_goTypes = []interface{}{
	(*GetAccountRequest)(nil),     // 0: com.mintter.accounts.v1alpha.GetAccountRequest
	(*ListAccountsRequest)(nil),   // 1: com.mintter.accounts.v1alpha.ListAccountsRequest
	(*ListAccountsResponse)(nil),  // 2: com.mintter.accounts.v1alpha.ListAccountsResponse
	(*Account)(nil),               // 3: com.mintter.accounts.v1alpha.Account
	(*Profile)(nil),               // 4: com.mintter.accounts.v1alpha.Profile
	(*Device)(nil),                // 5: com.mintter.accounts.v1alpha.Device
	(*DeviceRegistered)(nil),      // 6: com.mintter.accounts.v1alpha.DeviceRegistered
	(*ProfileUpdated)(nil),        // 7: com.mintter.accounts.v1alpha.ProfileUpdated
	nil,                           // 8: com.mintter.accounts.v1alpha.Account.DevicesEntry
	(*timestamppb.Timestamp)(nil), // 9: google.protobuf.Timestamp
}
var file_accounts_v1alpha_accounts_proto_depIdxs = []int32{
	3, // 0: com.mintter.accounts.v1alpha.ListAccountsResponse.accounts:type_name -> com.mintter.accounts.v1alpha.Account
	4, // 1: com.mintter.accounts.v1alpha.Account.profile:type_name -> com.mintter.accounts.v1alpha.Profile
	8, // 2: com.mintter.accounts.v1alpha.Account.devices:type_name -> com.mintter.accounts.v1alpha.Account.DevicesEntry
	9, // 3: com.mintter.accounts.v1alpha.Device.register_time:type_name -> google.protobuf.Timestamp
	4, // 4: com.mintter.accounts.v1alpha.ProfileUpdated.profile:type_name -> com.mintter.accounts.v1alpha.Profile
	5, // 5: com.mintter.accounts.v1alpha.Account.DevicesEntry.value:type_name -> com.mintter.accounts.v1alpha.Device
	0, // 6: com.mintter.accounts.v1alpha.Accounts.GetAccount:input_type -> com.mintter.accounts.v1alpha.GetAccountRequest
	4, // 7: com.mintter.accounts.v1alpha.Accounts.UpdateProfile:input_type -> com.mintter.accounts.v1alpha.Profile
	1, // 8: com.mintter.accounts.v1alpha.Accounts.ListAccounts:input_type -> com.mintter.accounts.v1alpha.ListAccountsRequest
	3, // 9: com.mintter.accounts.v1alpha.Accounts.GetAccount:output_type -> com.mintter.accounts.v1alpha.Account
	3, // 10: com.mintter.accounts.v1alpha.Accounts.UpdateProfile:output_type -> com.mintter.accounts.v1alpha.Account
	2, // 11: com.mintter.accounts.v1alpha.Accounts.ListAccounts:output_type -> com.mintter.accounts.v1alpha.ListAccountsResponse
	9, // [9:12] is the sub-list for method output_type
	6, // [6:9] is the sub-list for method input_type
	6, // [6:6] is the sub-list for extension type_name
	6, // [6:6] is the sub-list for extension extendee
	0, // [0:6] is the sub-list for field type_name
}

func init() { file_accounts_v1alpha_accounts_proto_init() }
func file_accounts_v1alpha_accounts_proto_init() {
	if File_accounts_v1alpha_accounts_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_accounts_v1alpha_accounts_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetAccountRequest); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListAccountsRequest); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListAccountsResponse); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Account); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Profile); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Device); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*DeviceRegistered); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[7].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ProfileUpdated); i {
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
			RawDescriptor: file_accounts_v1alpha_accounts_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   9,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_accounts_v1alpha_accounts_proto_goTypes,
		DependencyIndexes: file_accounts_v1alpha_accounts_proto_depIdxs,
		MessageInfos:      file_accounts_v1alpha_accounts_proto_msgTypes,
	}.Build()
	File_accounts_v1alpha_accounts_proto = out.File
	file_accounts_v1alpha_accounts_proto_rawDesc = nil
	file_accounts_v1alpha_accounts_proto_goTypes = nil
	file_accounts_v1alpha_accounts_proto_depIdxs = nil
}
