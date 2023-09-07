// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.30.0
// 	protoc        v3.21.12
// source: groups/v1alpha/website.proto

package groups

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

// Request for getting the public site information.
type GetSiteInfoRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *GetSiteInfoRequest) Reset() {
	*x = GetSiteInfoRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetSiteInfoRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetSiteInfoRequest) ProtoMessage() {}

func (x *GetSiteInfoRequest) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetSiteInfoRequest.ProtoReflect.Descriptor instead.
func (*GetSiteInfoRequest) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{0}
}

// Request for initializing the site.
type InitializeServerRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Required. The secret provided during the site deployment process.
	// It's a trust-on-first-use, one-time-use secret that is used for the initial site setup,
	// during which the site remembers the groups that it must serve, and who is the owner of the site.
	Secret string `protobuf:"bytes,1,opt,name=secret,proto3" json:"secret,omitempty"`
	// Required. ID of the group that should be served on this site.
	GroupId string `protobuf:"bytes,2,opt,name=group_id,json=groupId,proto3" json:"group_id,omitempty"`
}

func (x *InitializeServerRequest) Reset() {
	*x = InitializeServerRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *InitializeServerRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InitializeServerRequest) ProtoMessage() {}

func (x *InitializeServerRequest) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InitializeServerRequest.ProtoReflect.Descriptor instead.
func (*InitializeServerRequest) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{1}
}

func (x *InitializeServerRequest) GetSecret() string {
	if x != nil {
		return x.Secret
	}
	return ""
}

func (x *InitializeServerRequest) GetGroupId() string {
	if x != nil {
		return x.GroupId
	}
	return ""
}

// Response for initializing the site.
type InitializeServerResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *InitializeServerResponse) Reset() {
	*x = InitializeServerResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *InitializeServerResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*InitializeServerResponse) ProtoMessage() {}

func (x *InitializeServerResponse) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use InitializeServerResponse.ProtoReflect.Descriptor instead.
func (*InitializeServerResponse) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{2}
}

// Request for publishing blobs.
type PublishBlobsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// List of blob CIDs that we expect to be available on the site.
	Blobs []string `protobuf:"bytes,1,rep,name=blobs,proto3" json:"blobs,omitempty"`
}

func (x *PublishBlobsRequest) Reset() {
	*x = PublishBlobsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PublishBlobsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PublishBlobsRequest) ProtoMessage() {}

func (x *PublishBlobsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PublishBlobsRequest.ProtoReflect.Descriptor instead.
func (*PublishBlobsRequest) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{3}
}

func (x *PublishBlobsRequest) GetBlobs() []string {
	if x != nil {
		return x.Blobs
	}
	return nil
}

// Response for publishing blobs.
type PublishBlobsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields
}

func (x *PublishBlobsResponse) Reset() {
	*x = PublishBlobsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PublishBlobsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PublishBlobsResponse) ProtoMessage() {}

func (x *PublishBlobsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PublishBlobsResponse.ProtoReflect.Descriptor instead.
func (*PublishBlobsResponse) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{4}
}

// Publicly available information about the website.
type PublicSiteInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// P2P information for the website.
	PeerInfo *PeerInfo `protobuf:"bytes,1,opt,name=peer_info,json=peerInfo,proto3" json:"peer_info,omitempty"`
	// Group ID being served on the site.
	// Can be empty if site is not initialized yet.
	GroupId string `protobuf:"bytes,2,opt,name=group_id,json=groupId,proto3" json:"group_id,omitempty"`
	// Version of the group according to the website server.
	GroupVersion string `protobuf:"bytes,3,opt,name=group_version,json=groupVersion,proto3" json:"group_version,omitempty"`
}

func (x *PublicSiteInfo) Reset() {
	*x = PublicSiteInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PublicSiteInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PublicSiteInfo) ProtoMessage() {}

func (x *PublicSiteInfo) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PublicSiteInfo.ProtoReflect.Descriptor instead.
func (*PublicSiteInfo) Descriptor() ([]byte, []int) {
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{5}
}

func (x *PublicSiteInfo) GetPeerInfo() *PeerInfo {
	if x != nil {
		return x.PeerInfo
	}
	return nil
}

func (x *PublicSiteInfo) GetGroupId() string {
	if x != nil {
		return x.GroupId
	}
	return ""
}

func (x *PublicSiteInfo) GetGroupVersion() string {
	if x != nil {
		return x.GroupVersion
	}
	return ""
}

// Peer information for P2P network.
type PeerInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Libp2p peer ID.
	PeerId string `protobuf:"bytes,1,opt,name=peer_id,json=peerId,proto3" json:"peer_id,omitempty"`
	// Multiaddrs for the peer,
	// without the peer ID,
	// in order to use it with libp2p AddrInfo API.
	Addrs []string `protobuf:"bytes,2,rep,name=addrs,proto3" json:"addrs,omitempty"`
	// Mintter Account ID of the site.
	AccountId string `protobuf:"bytes,3,opt,name=account_id,json=accountId,proto3" json:"account_id,omitempty"`
}

func (x *PeerInfo) Reset() {
	*x = PeerInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_groups_v1alpha_website_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PeerInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PeerInfo) ProtoMessage() {}

func (x *PeerInfo) ProtoReflect() protoreflect.Message {
	mi := &file_groups_v1alpha_website_proto_msgTypes[6]
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
	return file_groups_v1alpha_website_proto_rawDescGZIP(), []int{6}
}

func (x *PeerInfo) GetPeerId() string {
	if x != nil {
		return x.PeerId
	}
	return ""
}

func (x *PeerInfo) GetAddrs() []string {
	if x != nil {
		return x.Addrs
	}
	return nil
}

func (x *PeerInfo) GetAccountId() string {
	if x != nil {
		return x.AccountId
	}
	return ""
}

var File_groups_v1alpha_website_proto protoreflect.FileDescriptor

var file_groups_v1alpha_website_proto_rawDesc = []byte{
	0x0a, 0x1c, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x2f, 0x77, 0x65, 0x62, 0x73, 0x69, 0x74, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x1a,
	0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75,
	0x70, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x22, 0x14, 0x0a, 0x12, 0x47, 0x65,
	0x74, 0x53, 0x69, 0x74, 0x65, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x22, 0x4c, 0x0a, 0x17, 0x49, 0x6e, 0x69, 0x74, 0x69, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x53, 0x65,
	0x72, 0x76, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x16, 0x0a, 0x06, 0x73,
	0x65, 0x63, 0x72, 0x65, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x73, 0x65, 0x63,
	0x72, 0x65, 0x74, 0x12, 0x19, 0x0a, 0x08, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x5f, 0x69, 0x64, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x49, 0x64, 0x22, 0x1a,
	0x0a, 0x18, 0x49, 0x6e, 0x69, 0x74, 0x69, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x53, 0x65, 0x72, 0x76,
	0x65, 0x72, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x2b, 0x0a, 0x13, 0x50, 0x75,
	0x62, 0x6c, 0x69, 0x73, 0x68, 0x42, 0x6c, 0x6f, 0x62, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x12, 0x14, 0x0a, 0x05, 0x62, 0x6c, 0x6f, 0x62, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x09,
	0x52, 0x05, 0x62, 0x6c, 0x6f, 0x62, 0x73, 0x22, 0x16, 0x0a, 0x14, 0x50, 0x75, 0x62, 0x6c, 0x69,
	0x73, 0x68, 0x42, 0x6c, 0x6f, 0x62, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22,
	0x93, 0x01, 0x0a, 0x0e, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x53, 0x69, 0x74, 0x65, 0x49, 0x6e,
	0x66, 0x6f, 0x12, 0x41, 0x0a, 0x09, 0x70, 0x65, 0x65, 0x72, 0x5f, 0x69, 0x6e, 0x66, 0x6f, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x24, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x50, 0x65, 0x65, 0x72, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x08, 0x70, 0x65, 0x65,
	0x72, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x19, 0x0a, 0x08, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x5f, 0x69,
	0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x49, 0x64,
	0x12, 0x23, 0x0a, 0x0d, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x5f, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f,
	0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0c, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x56, 0x65,
	0x72, 0x73, 0x69, 0x6f, 0x6e, 0x22, 0x58, 0x0a, 0x08, 0x50, 0x65, 0x65, 0x72, 0x49, 0x6e, 0x66,
	0x6f, 0x12, 0x17, 0x0a, 0x07, 0x70, 0x65, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x06, 0x70, 0x65, 0x65, 0x72, 0x49, 0x64, 0x12, 0x14, 0x0a, 0x05, 0x61, 0x64,
	0x64, 0x72, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x09, 0x52, 0x05, 0x61, 0x64, 0x64, 0x72, 0x73,
	0x12, 0x1d, 0x0a, 0x0a, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x03,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x49, 0x64, 0x32,
	0xe6, 0x02, 0x0a, 0x07, 0x57, 0x65, 0x62, 0x73, 0x69, 0x74, 0x65, 0x12, 0x69, 0x0a, 0x0b, 0x47,
	0x65, 0x74, 0x53, 0x69, 0x74, 0x65, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x2e, 0x2e, 0x63, 0x6f, 0x6d,
	0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x47, 0x65, 0x74, 0x53, 0x69, 0x74, 0x65, 0x49,
	0x6e, 0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2a, 0x2e, 0x63, 0x6f, 0x6d,
	0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x53, 0x69,
	0x74, 0x65, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x7d, 0x0a, 0x10, 0x49, 0x6e, 0x69, 0x74, 0x69, 0x61,
	0x6c, 0x69, 0x7a, 0x65, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x12, 0x33, 0x2e, 0x63, 0x6f, 0x6d,
	0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x49, 0x6e, 0x69, 0x74, 0x69, 0x61, 0x6c, 0x69,
	0x7a, 0x65, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x34, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72,
	0x6f, 0x75, 0x70, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x49, 0x6e, 0x69,
	0x74, 0x69, 0x61, 0x6c, 0x69, 0x7a, 0x65, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x71, 0x0a, 0x0c, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x73, 0x68,
	0x42, 0x6c, 0x6f, 0x62, 0x73, 0x12, 0x2f, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x73, 0x68, 0x42, 0x6c, 0x6f, 0x62, 0x73, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x30, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e,
	0x74, 0x74, 0x65, 0x72, 0x2e, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x2e, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x73, 0x68, 0x42, 0x6c, 0x6f, 0x62, 0x73,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x30, 0x5a, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x67, 0x65, 0x6e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x3b, 0x67, 0x72, 0x6f, 0x75, 0x70, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x33,
}

var (
	file_groups_v1alpha_website_proto_rawDescOnce sync.Once
	file_groups_v1alpha_website_proto_rawDescData = file_groups_v1alpha_website_proto_rawDesc
)

func file_groups_v1alpha_website_proto_rawDescGZIP() []byte {
	file_groups_v1alpha_website_proto_rawDescOnce.Do(func() {
		file_groups_v1alpha_website_proto_rawDescData = protoimpl.X.CompressGZIP(file_groups_v1alpha_website_proto_rawDescData)
	})
	return file_groups_v1alpha_website_proto_rawDescData
}

var file_groups_v1alpha_website_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_groups_v1alpha_website_proto_goTypes = []interface{}{
	(*GetSiteInfoRequest)(nil),       // 0: com.mintter.groups.v1alpha.GetSiteInfoRequest
	(*InitializeServerRequest)(nil),  // 1: com.mintter.groups.v1alpha.InitializeServerRequest
	(*InitializeServerResponse)(nil), // 2: com.mintter.groups.v1alpha.InitializeServerResponse
	(*PublishBlobsRequest)(nil),      // 3: com.mintter.groups.v1alpha.PublishBlobsRequest
	(*PublishBlobsResponse)(nil),     // 4: com.mintter.groups.v1alpha.PublishBlobsResponse
	(*PublicSiteInfo)(nil),           // 5: com.mintter.groups.v1alpha.PublicSiteInfo
	(*PeerInfo)(nil),                 // 6: com.mintter.groups.v1alpha.PeerInfo
}
var file_groups_v1alpha_website_proto_depIdxs = []int32{
	6, // 0: com.mintter.groups.v1alpha.PublicSiteInfo.peer_info:type_name -> com.mintter.groups.v1alpha.PeerInfo
	0, // 1: com.mintter.groups.v1alpha.Website.GetSiteInfo:input_type -> com.mintter.groups.v1alpha.GetSiteInfoRequest
	1, // 2: com.mintter.groups.v1alpha.Website.InitializeServer:input_type -> com.mintter.groups.v1alpha.InitializeServerRequest
	3, // 3: com.mintter.groups.v1alpha.Website.PublishBlobs:input_type -> com.mintter.groups.v1alpha.PublishBlobsRequest
	5, // 4: com.mintter.groups.v1alpha.Website.GetSiteInfo:output_type -> com.mintter.groups.v1alpha.PublicSiteInfo
	2, // 5: com.mintter.groups.v1alpha.Website.InitializeServer:output_type -> com.mintter.groups.v1alpha.InitializeServerResponse
	4, // 6: com.mintter.groups.v1alpha.Website.PublishBlobs:output_type -> com.mintter.groups.v1alpha.PublishBlobsResponse
	4, // [4:7] is the sub-list for method output_type
	1, // [1:4] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_groups_v1alpha_website_proto_init() }
func file_groups_v1alpha_website_proto_init() {
	if File_groups_v1alpha_website_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_groups_v1alpha_website_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetSiteInfoRequest); i {
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
		file_groups_v1alpha_website_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*InitializeServerRequest); i {
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
		file_groups_v1alpha_website_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*InitializeServerResponse); i {
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
		file_groups_v1alpha_website_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PublishBlobsRequest); i {
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
		file_groups_v1alpha_website_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PublishBlobsResponse); i {
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
		file_groups_v1alpha_website_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*PublicSiteInfo); i {
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
		file_groups_v1alpha_website_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
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
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_groups_v1alpha_website_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_groups_v1alpha_website_proto_goTypes,
		DependencyIndexes: file_groups_v1alpha_website_proto_depIdxs,
		MessageInfos:      file_groups_v1alpha_website_proto_msgTypes,
	}.Build()
	File_groups_v1alpha_website_proto = out.File
	file_groups_v1alpha_website_proto_rawDesc = nil
	file_groups_v1alpha_website_proto_goTypes = nil
	file_groups_v1alpha_website_proto_depIdxs = nil
}
