// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.23.0
// 	protoc        v3.11.4
// source: accounts/v1alpha/accounts.proto

package accounts

import (
	context "context"
	proto "github.com/golang/protobuf/proto"
	timestamp "github.com/golang/protobuf/ptypes/timestamp"
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

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

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
	// List of known peer IDs that provide information about this account.
	// Account information can be retrieved even without being connect directly.
	Peers []string `protobuf:"bytes,4,rep,name=peers,proto3" json:"peers,omitempty"`
	// Time where we started following this account.
	FollowTime *timestamp.Timestamp `protobuf:"bytes,5,opt,name=follow_time,json=followTime,proto3" json:"follow_time,omitempty"`
	// Last time this account was updated.
	UpdateTime *timestamp.Timestamp `protobuf:"bytes,6,opt,name=update_time,json=updateTime,proto3" json:"update_time,omitempty"`
}

func (x *Account) Reset() {
	*x = Account{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Account) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Account) ProtoMessage() {}

func (x *Account) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use Account.ProtoReflect.Descriptor instead.
func (*Account) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{1}
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

func (x *Account) GetPeers() []string {
	if x != nil {
		return x.Peers
	}
	return nil
}

func (x *Account) GetFollowTime() *timestamp.Timestamp {
	if x != nil {
		return x.FollowTime
	}
	return nil
}

func (x *Account) GetUpdateTime() *timestamp.Timestamp {
	if x != nil {
		return x.UpdateTime
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
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Profile) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Profile) ProtoMessage() {}

func (x *Profile) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use Profile.ProtoReflect.Descriptor instead.
func (*Profile) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{2}
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

	PeerId string   `protobuf:"bytes,1,opt,name=peer_id,json=peerId,proto3" json:"peer_id,omitempty"`
	Addrs  []string `protobuf:"bytes,2,rep,name=addrs,proto3" json:"addrs,omitempty"`
}

func (x *Device) Reset() {
	*x = Device{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Device) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Device) ProtoMessage() {}

func (x *Device) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use Device.ProtoReflect.Descriptor instead.
func (*Device) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{3}
}

func (x *Device) GetPeerId() string {
	if x != nil {
		return x.PeerId
	}
	return ""
}

func (x *Device) GetAddrs() []string {
	if x != nil {
		return x.Addrs
	}
	return nil
}

type AccountEvent struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Types that are assignable to Data:
	//	*AccountEvent_DeviceRegistered
	//	*AccountEvent_ProfiledUpdated
	Data isAccountEvent_Data `protobuf_oneof:"data"`
}

func (x *AccountEvent) Reset() {
	*x = AccountEvent{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AccountEvent) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AccountEvent) ProtoMessage() {}

func (x *AccountEvent) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use AccountEvent.ProtoReflect.Descriptor instead.
func (*AccountEvent) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{4}
}

func (m *AccountEvent) GetData() isAccountEvent_Data {
	if m != nil {
		return m.Data
	}
	return nil
}

func (x *AccountEvent) GetDeviceRegistered() *DeviceRegistered {
	if x, ok := x.GetData().(*AccountEvent_DeviceRegistered); ok {
		return x.DeviceRegistered
	}
	return nil
}

func (x *AccountEvent) GetProfiledUpdated() *ProfileUpdated {
	if x, ok := x.GetData().(*AccountEvent_ProfiledUpdated); ok {
		return x.ProfiledUpdated
	}
	return nil
}

type isAccountEvent_Data interface {
	isAccountEvent_Data()
}

type AccountEvent_DeviceRegistered struct {
	DeviceRegistered *DeviceRegistered `protobuf:"bytes,4,opt,name=device_registered,json=deviceRegistered,proto3,oneof"`
}

type AccountEvent_ProfiledUpdated struct {
	ProfiledUpdated *ProfileUpdated `protobuf:"bytes,5,opt,name=profiled_updated,json=profiledUpdated,proto3,oneof"`
}

func (*AccountEvent_DeviceRegistered) isAccountEvent_Data() {}

func (*AccountEvent_ProfiledUpdated) isAccountEvent_Data() {}

type DeviceRegistered struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Proof []byte `protobuf:"bytes,1,opt,name=proof,proto3" json:"proof,omitempty"`
}

func (x *DeviceRegistered) Reset() {
	*x = DeviceRegistered{}
	if protoimpl.UnsafeEnabled {
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DeviceRegistered) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeviceRegistered) ProtoMessage() {}

func (x *DeviceRegistered) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use DeviceRegistered.ProtoReflect.Descriptor instead.
func (*DeviceRegistered) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{5}
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
		mi := &file_accounts_v1alpha_accounts_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ProfileUpdated) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ProfileUpdated) ProtoMessage() {}

func (x *ProfileUpdated) ProtoReflect() protoreflect.Message {
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

// Deprecated: Use ProfileUpdated.ProtoReflect.Descriptor instead.
func (*ProfileUpdated) Descriptor() ([]byte, []int) {
	return file_accounts_v1alpha_accounts_proto_rawDescGZIP(), []int{6}
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
	0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x9a, 0x03, 0x0a, 0x07, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69,
	0x64, 0x12, 0x3f, 0x0a, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72,
	0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69,
	0x6c, 0x65, 0x12, 0x4c, 0x0a, 0x07, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x73, 0x18, 0x03, 0x20,
	0x03, 0x28, 0x0b, 0x32, 0x32, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x2e, 0x44, 0x65, 0x76, 0x69, 0x63,
	0x65, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x07, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x73,
	0x12, 0x14, 0x0a, 0x05, 0x70, 0x65, 0x65, 0x72, 0x73, 0x18, 0x04, 0x20, 0x03, 0x28, 0x09, 0x52,
	0x05, 0x70, 0x65, 0x65, 0x72, 0x73, 0x12, 0x3b, 0x0a, 0x0b, 0x66, 0x6f, 0x6c, 0x6c, 0x6f, 0x77,
	0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69,
	0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a, 0x66, 0x6f, 0x6c, 0x6c, 0x6f, 0x77, 0x54,
	0x69, 0x6d, 0x65, 0x12, 0x3b, 0x0a, 0x0b, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x5f, 0x74, 0x69,
	0x6d, 0x65, 0x18, 0x06, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73,
	0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x54, 0x69, 0x6d, 0x65,
	0x1a, 0x60, 0x0a, 0x0c, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79,
	0x12, 0x10, 0x0a, 0x03, 0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x6b,
	0x65, 0x79, 0x12, 0x3a, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x0b, 0x32, 0x24, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e,
	0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x2e, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x3a, 0x02,
	0x38, 0x01, 0x22, 0x47, 0x0a, 0x07, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x14, 0x0a,
	0x05, 0x61, 0x6c, 0x69, 0x61, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x61, 0x6c,
	0x69, 0x61, 0x73, 0x12, 0x10, 0x0a, 0x03, 0x62, 0x69, 0x6f, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x03, 0x62, 0x69, 0x6f, 0x12, 0x14, 0x0a, 0x05, 0x65, 0x6d, 0x61, 0x69, 0x6c, 0x18, 0x03,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x65, 0x6d, 0x61, 0x69, 0x6c, 0x22, 0x37, 0x0a, 0x06, 0x44,
	0x65, 0x76, 0x69, 0x63, 0x65, 0x12, 0x17, 0x0a, 0x07, 0x70, 0x65, 0x65, 0x72, 0x5f, 0x69, 0x64,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x70, 0x65, 0x65, 0x72, 0x49, 0x64, 0x12, 0x14,
	0x0a, 0x05, 0x61, 0x64, 0x64, 0x72, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x09, 0x52, 0x05, 0x61,
	0x64, 0x64, 0x72, 0x73, 0x22, 0xd0, 0x01, 0x0a, 0x0c, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x45, 0x76, 0x65, 0x6e, 0x74, 0x12, 0x5d, 0x0a, 0x11, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x5f,
	0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x65, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x2e, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e,
	0x44, 0x65, 0x76, 0x69, 0x63, 0x65, 0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x65, 0x64,
	0x48, 0x00, 0x52, 0x10, 0x64, 0x65, 0x76, 0x69, 0x63, 0x65, 0x52, 0x65, 0x67, 0x69, 0x73, 0x74,
	0x65, 0x72, 0x65, 0x64, 0x12, 0x59, 0x0a, 0x10, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x64,
	0x5f, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x2c,
	0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63,
	0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x72,
	0x6f, 0x66, 0x69, 0x6c, 0x65, 0x55, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x48, 0x00, 0x52, 0x0f,
	0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x64, 0x55, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x42,
	0x06, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x22, 0x28, 0x0a, 0x10, 0x44, 0x65, 0x76, 0x69, 0x63,
	0x65, 0x52, 0x65, 0x67, 0x69, 0x73, 0x74, 0x65, 0x72, 0x65, 0x64, 0x12, 0x14, 0x0a, 0x05, 0x70,
	0x72, 0x6f, 0x6f, 0x66, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x05, 0x70, 0x72, 0x6f, 0x6f,
	0x66, 0x22, 0x51, 0x0a, 0x0e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x55, 0x70, 0x64, 0x61,
	0x74, 0x65, 0x64, 0x12, 0x3f, 0x0a, 0x07, 0x70, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74,
	0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x52, 0x07, 0x70, 0x72, 0x6f,
	0x66, 0x69, 0x6c, 0x65, 0x32, 0xcf, 0x01, 0x0a, 0x08, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x73, 0x12, 0x64, 0x0a, 0x0a, 0x47, 0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12,
	0x2f, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x47,
	0x65, 0x74, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e,
	0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x5d, 0x0a, 0x0d, 0x55, 0x70, 0x64, 0x61, 0x74,
	0x65, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x12, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d,
	0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x72, 0x6f, 0x66, 0x69, 0x6c, 0x65, 0x1a,
	0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x61, 0x63,
	0x63, 0x6f, 0x75, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x41,
	0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x42, 0x2a, 0x5a, 0x28, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x67, 0x6f, 0x2f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x3b, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
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

var file_accounts_v1alpha_accounts_proto_msgTypes = make([]protoimpl.MessageInfo, 8)
var file_accounts_v1alpha_accounts_proto_goTypes = []interface{}{
	(*GetAccountRequest)(nil),   // 0: com.mintter.accounts.v1alpha.GetAccountRequest
	(*Account)(nil),             // 1: com.mintter.accounts.v1alpha.Account
	(*Profile)(nil),             // 2: com.mintter.accounts.v1alpha.Profile
	(*Device)(nil),              // 3: com.mintter.accounts.v1alpha.Device
	(*AccountEvent)(nil),        // 4: com.mintter.accounts.v1alpha.AccountEvent
	(*DeviceRegistered)(nil),    // 5: com.mintter.accounts.v1alpha.DeviceRegistered
	(*ProfileUpdated)(nil),      // 6: com.mintter.accounts.v1alpha.ProfileUpdated
	nil,                         // 7: com.mintter.accounts.v1alpha.Account.DevicesEntry
	(*timestamp.Timestamp)(nil), // 8: google.protobuf.Timestamp
}
var file_accounts_v1alpha_accounts_proto_depIdxs = []int32{
	2,  // 0: com.mintter.accounts.v1alpha.Account.profile:type_name -> com.mintter.accounts.v1alpha.Profile
	7,  // 1: com.mintter.accounts.v1alpha.Account.devices:type_name -> com.mintter.accounts.v1alpha.Account.DevicesEntry
	8,  // 2: com.mintter.accounts.v1alpha.Account.follow_time:type_name -> google.protobuf.Timestamp
	8,  // 3: com.mintter.accounts.v1alpha.Account.update_time:type_name -> google.protobuf.Timestamp
	5,  // 4: com.mintter.accounts.v1alpha.AccountEvent.device_registered:type_name -> com.mintter.accounts.v1alpha.DeviceRegistered
	6,  // 5: com.mintter.accounts.v1alpha.AccountEvent.profiled_updated:type_name -> com.mintter.accounts.v1alpha.ProfileUpdated
	2,  // 6: com.mintter.accounts.v1alpha.ProfileUpdated.profile:type_name -> com.mintter.accounts.v1alpha.Profile
	3,  // 7: com.mintter.accounts.v1alpha.Account.DevicesEntry.value:type_name -> com.mintter.accounts.v1alpha.Device
	0,  // 8: com.mintter.accounts.v1alpha.Accounts.GetAccount:input_type -> com.mintter.accounts.v1alpha.GetAccountRequest
	2,  // 9: com.mintter.accounts.v1alpha.Accounts.UpdateProfile:input_type -> com.mintter.accounts.v1alpha.Profile
	1,  // 10: com.mintter.accounts.v1alpha.Accounts.GetAccount:output_type -> com.mintter.accounts.v1alpha.Account
	1,  // 11: com.mintter.accounts.v1alpha.Accounts.UpdateProfile:output_type -> com.mintter.accounts.v1alpha.Account
	10, // [10:12] is the sub-list for method output_type
	8,  // [8:10] is the sub-list for method input_type
	8,  // [8:8] is the sub-list for extension type_name
	8,  // [8:8] is the sub-list for extension extendee
	0,  // [0:8] is the sub-list for field type_name
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
		file_accounts_v1alpha_accounts_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AccountEvent); i {
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
		file_accounts_v1alpha_accounts_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
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
	file_accounts_v1alpha_accounts_proto_msgTypes[4].OneofWrappers = []interface{}{
		(*AccountEvent_DeviceRegistered)(nil),
		(*AccountEvent_ProfiledUpdated)(nil),
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_accounts_v1alpha_accounts_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   8,
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
	// Lookup an Account information across the already known accounts.
	// Can also be used to retrieve our own account.
	GetAccount(ctx context.Context, in *GetAccountRequest, opts ...grpc.CallOption) (*Account, error)
	// Update Profile information of our own Account.
	UpdateProfile(ctx context.Context, in *Profile, opts ...grpc.CallOption) (*Account, error)
}

type accountsClient struct {
	cc grpc.ClientConnInterface
}

func NewAccountsClient(cc grpc.ClientConnInterface) AccountsClient {
	return &accountsClient{cc}
}

func (c *accountsClient) GetAccount(ctx context.Context, in *GetAccountRequest, opts ...grpc.CallOption) (*Account, error) {
	out := new(Account)
	err := c.cc.Invoke(ctx, "/com.mintter.accounts.v1alpha.Accounts/GetAccount", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *accountsClient) UpdateProfile(ctx context.Context, in *Profile, opts ...grpc.CallOption) (*Account, error) {
	out := new(Account)
	err := c.cc.Invoke(ctx, "/com.mintter.accounts.v1alpha.Accounts/UpdateProfile", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AccountsServer is the server API for Accounts service.
type AccountsServer interface {
	// Lookup an Account information across the already known accounts.
	// Can also be used to retrieve our own account.
	GetAccount(context.Context, *GetAccountRequest) (*Account, error)
	// Update Profile information of our own Account.
	UpdateProfile(context.Context, *Profile) (*Account, error)
}

// UnimplementedAccountsServer can be embedded to have forward compatible implementations.
type UnimplementedAccountsServer struct {
}

func (*UnimplementedAccountsServer) GetAccount(context.Context, *GetAccountRequest) (*Account, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAccount not implemented")
}
func (*UnimplementedAccountsServer) UpdateProfile(context.Context, *Profile) (*Account, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateProfile not implemented")
}

func RegisterAccountsServer(s *grpc.Server, srv AccountsServer) {
	s.RegisterService(&_Accounts_serviceDesc, srv)
}

func _Accounts_GetAccount_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAccountRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AccountsServer).GetAccount(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.accounts.v1alpha.Accounts/GetAccount",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AccountsServer).GetAccount(ctx, req.(*GetAccountRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Accounts_UpdateProfile_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Profile)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AccountsServer).UpdateProfile(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.accounts.v1alpha.Accounts/UpdateProfile",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AccountsServer).UpdateProfile(ctx, req.(*Profile))
	}
	return interceptor(ctx, in, info, handler)
}

var _Accounts_serviceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.accounts.v1alpha.Accounts",
	HandlerType: (*AccountsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAccount",
			Handler:    _Accounts_GetAccount_Handler,
		},
		{
			MethodName: "UpdateProfile",
			Handler:    _Accounts_UpdateProfile_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "accounts/v1alpha/accounts.proto",
}
