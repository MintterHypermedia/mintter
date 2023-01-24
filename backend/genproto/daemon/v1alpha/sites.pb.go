// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.19.4
// source: daemon/v1alpha/sites.proto

package daemon

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	v1alpha "mintter/backend/genproto/site/v1alpha"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// Request to add a site.
type AddSiteRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Required. Site hostname.
	Hostname string `protobuf:"bytes,1,opt,name=hostname,proto3" json:"hostname,omitempty"`
	// Optional. Invite token for the site. Not needed
	// if the site already knows our Account ID.
	InviteToken string `protobuf:"bytes,2,opt,name=invite_token,json=inviteToken,proto3" json:"invite_token,omitempty"`
}

func (x *AddSiteRequest) Reset() {
	*x = AddSiteRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_v1alpha_sites_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *AddSiteRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*AddSiteRequest) ProtoMessage() {}

func (x *AddSiteRequest) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_v1alpha_sites_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use AddSiteRequest.ProtoReflect.Descriptor instead.
func (*AddSiteRequest) Descriptor() ([]byte, []int) {
	return file_daemon_v1alpha_sites_proto_rawDescGZIP(), []int{0}
}

func (x *AddSiteRequest) GetHostname() string {
	if x != nil {
		return x.Hostname
	}
	return ""
}

func (x *AddSiteRequest) GetInviteToken() string {
	if x != nil {
		return x.InviteToken
	}
	return ""
}

// Request to delete a site from local server
type DeleteSiteRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Required. Site hostname.
	Hostname string `protobuf:"bytes,1,opt,name=hostname,proto3" json:"hostname,omitempty"`
}

func (x *DeleteSiteRequest) Reset() {
	*x = DeleteSiteRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_v1alpha_sites_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DeleteSiteRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteSiteRequest) ProtoMessage() {}

func (x *DeleteSiteRequest) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_v1alpha_sites_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteSiteRequest.ProtoReflect.Descriptor instead.
func (*DeleteSiteRequest) Descriptor() ([]byte, []int) {
	return file_daemon_v1alpha_sites_proto_rawDescGZIP(), []int{1}
}

func (x *DeleteSiteRequest) GetHostname() string {
	if x != nil {
		return x.Hostname
	}
	return ""
}

// Request to list configures sites.
type ListSitesRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Optional. Number of items per page.
	PageSize int32 `protobuf:"varint,1,opt,name=page_size,json=pageSize,proto3" json:"page_size,omitempty"`
	// Optional. Token for a specific page.
	PageToken string `protobuf:"bytes,2,opt,name=page_token,json=pageToken,proto3" json:"page_token,omitempty"`
}

func (x *ListSitesRequest) Reset() {
	*x = ListSitesRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_v1alpha_sites_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListSitesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListSitesRequest) ProtoMessage() {}

func (x *ListSitesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_v1alpha_sites_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListSitesRequest.ProtoReflect.Descriptor instead.
func (*ListSitesRequest) Descriptor() ([]byte, []int) {
	return file_daemon_v1alpha_sites_proto_rawDescGZIP(), []int{2}
}

func (x *ListSitesRequest) GetPageSize() int32 {
	if x != nil {
		return x.PageSize
	}
	return 0
}

func (x *ListSitesRequest) GetPageToken() string {
	if x != nil {
		return x.PageToken
	}
	return ""
}

// Response with a list of sites.
type ListSitesResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// List of sites.
	Sites []*SiteConfig `protobuf:"bytes,1,rep,name=sites,proto3" json:"sites,omitempty"`
	// Token for the next page if any.
	NextPageToken string `protobuf:"bytes,2,opt,name=next_page_token,json=nextPageToken,proto3" json:"next_page_token,omitempty"`
}

func (x *ListSitesResponse) Reset() {
	*x = ListSitesResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_v1alpha_sites_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListSitesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListSitesResponse) ProtoMessage() {}

func (x *ListSitesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_v1alpha_sites_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListSitesResponse.ProtoReflect.Descriptor instead.
func (*ListSitesResponse) Descriptor() ([]byte, []int) {
	return file_daemon_v1alpha_sites_proto_rawDescGZIP(), []int{3}
}

func (x *ListSitesResponse) GetSites() []*SiteConfig {
	if x != nil {
		return x.Sites
	}
	return nil
}

func (x *ListSitesResponse) GetNextPageToken() string {
	if x != nil {
		return x.NextPageToken
	}
	return ""
}

// Local site configuration.
type SiteConfig struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Hostname of the site.
	Hostname string `protobuf:"bytes,1,opt,name=hostname,proto3" json:"hostname,omitempty"`
	// Our role on this site.
	Role v1alpha.Member_Role `protobuf:"varint,2,opt,name=role,proto3,enum=com.mintter.site.v1alpha.Member_Role" json:"role,omitempty"`
}

func (x *SiteConfig) Reset() {
	*x = SiteConfig{}
	if protoimpl.UnsafeEnabled {
		mi := &file_daemon_v1alpha_sites_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SiteConfig) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SiteConfig) ProtoMessage() {}

func (x *SiteConfig) ProtoReflect() protoreflect.Message {
	mi := &file_daemon_v1alpha_sites_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SiteConfig.ProtoReflect.Descriptor instead.
func (*SiteConfig) Descriptor() ([]byte, []int) {
	return file_daemon_v1alpha_sites_proto_rawDescGZIP(), []int{4}
}

func (x *SiteConfig) GetHostname() string {
	if x != nil {
		return x.Hostname
	}
	return ""
}

func (x *SiteConfig) GetRole() v1alpha.Member_Role {
	if x != nil {
		return x.Role
	}
	return v1alpha.Member_Role(0)
}

var File_daemon_v1alpha_sites_proto protoreflect.FileDescriptor

var file_daemon_v1alpha_sites_proto_rawDesc = []byte{
	0x0a, 0x1a, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x2f, 0x73, 0x69, 0x74, 0x65, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x1a, 0x63, 0x6f,
	0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e,
	0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x1a, 0x17, 0x73, 0x69, 0x74, 0x65, 0x2f, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2f, 0x73, 0x69, 0x74, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x1a, 0x1b, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62,
	0x75, 0x66, 0x2f, 0x65, 0x6d, 0x70, 0x74, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x4f,
	0x0a, 0x0e, 0x41, 0x64, 0x64, 0x53, 0x69, 0x74, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x12, 0x1a, 0x0a, 0x08, 0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x08, 0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x21, 0x0a, 0x0c,
	0x69, 0x6e, 0x76, 0x69, 0x74, 0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0b, 0x69, 0x6e, 0x76, 0x69, 0x74, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x22,
	0x2f, 0x0a, 0x11, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x53, 0x69, 0x74, 0x65, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x1a, 0x0a, 0x08, 0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65,
	0x22, 0x4e, 0x0a, 0x10, 0x4c, 0x69, 0x73, 0x74, 0x53, 0x69, 0x74, 0x65, 0x73, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x1b, 0x0a, 0x09, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x73, 0x69, 0x7a,
	0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x08, 0x70, 0x61, 0x67, 0x65, 0x53, 0x69, 0x7a,
	0x65, 0x12, 0x1d, 0x0a, 0x0a, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18,
	0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x70, 0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e,
	0x22, 0x79, 0x0a, 0x11, 0x4c, 0x69, 0x73, 0x74, 0x53, 0x69, 0x74, 0x65, 0x73, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x3c, 0x0a, 0x05, 0x73, 0x69, 0x74, 0x65, 0x73, 0x18, 0x01,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x26, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74,
	0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x2e, 0x53, 0x69, 0x74, 0x65, 0x43, 0x6f, 0x6e, 0x66, 0x69, 0x67, 0x52, 0x05, 0x73, 0x69,
	0x74, 0x65, 0x73, 0x12, 0x26, 0x0a, 0x0f, 0x6e, 0x65, 0x78, 0x74, 0x5f, 0x70, 0x61, 0x67, 0x65,
	0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0d, 0x6e, 0x65,
	0x78, 0x74, 0x50, 0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x22, 0x63, 0x0a, 0x0a, 0x53,
	0x69, 0x74, 0x65, 0x43, 0x6f, 0x6e, 0x66, 0x69, 0x67, 0x12, 0x1a, 0x0a, 0x08, 0x68, 0x6f, 0x73,
	0x74, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x68, 0x6f, 0x73,
	0x74, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x39, 0x0a, 0x04, 0x72, 0x6f, 0x6c, 0x65, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x0e, 0x32, 0x25, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2e, 0x73, 0x69, 0x74, 0x65, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4d,
	0x65, 0x6d, 0x62, 0x65, 0x72, 0x2e, 0x52, 0x6f, 0x6c, 0x65, 0x52, 0x04, 0x72, 0x6f, 0x6c, 0x65,
	0x32, 0xa5, 0x02, 0x0a, 0x05, 0x53, 0x69, 0x74, 0x65, 0x73, 0x12, 0x5d, 0x0a, 0x07, 0x41, 0x64,
	0x64, 0x53, 0x69, 0x74, 0x65, 0x12, 0x2a, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x41, 0x64, 0x64, 0x53, 0x69, 0x74, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x26, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e,
	0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x53,
	0x69, 0x74, 0x65, 0x43, 0x6f, 0x6e, 0x66, 0x69, 0x67, 0x12, 0x53, 0x0a, 0x0a, 0x44, 0x65, 0x6c,
	0x65, 0x74, 0x65, 0x53, 0x69, 0x74, 0x65, 0x12, 0x2d, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69,
	0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x53, 0x69, 0x74, 0x65, 0x52,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x16, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79, 0x12, 0x68,
	0x0a, 0x09, 0x4c, 0x69, 0x73, 0x74, 0x53, 0x69, 0x74, 0x65, 0x73, 0x12, 0x2c, 0x2e, 0x63, 0x6f,
	0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e,
	0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x53, 0x69, 0x74,
	0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2d, 0x2e, 0x63, 0x6f, 0x6d, 0x2e,
	0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2e, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x53, 0x69, 0x74, 0x65, 0x73,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x30, 0x5a, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x67, 0x65, 0x6e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x2f, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x3b, 0x64, 0x61, 0x65, 0x6d, 0x6f, 0x6e, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x33,
}

var (
	file_daemon_v1alpha_sites_proto_rawDescOnce sync.Once
	file_daemon_v1alpha_sites_proto_rawDescData = file_daemon_v1alpha_sites_proto_rawDesc
)

func file_daemon_v1alpha_sites_proto_rawDescGZIP() []byte {
	file_daemon_v1alpha_sites_proto_rawDescOnce.Do(func() {
		file_daemon_v1alpha_sites_proto_rawDescData = protoimpl.X.CompressGZIP(file_daemon_v1alpha_sites_proto_rawDescData)
	})
	return file_daemon_v1alpha_sites_proto_rawDescData
}

var file_daemon_v1alpha_sites_proto_msgTypes = make([]protoimpl.MessageInfo, 5)
var file_daemon_v1alpha_sites_proto_goTypes = []interface{}{
	(*AddSiteRequest)(nil),    // 0: com.mintter.daemon.v1alpha.AddSiteRequest
	(*DeleteSiteRequest)(nil), // 1: com.mintter.daemon.v1alpha.DeleteSiteRequest
	(*ListSitesRequest)(nil),  // 2: com.mintter.daemon.v1alpha.ListSitesRequest
	(*ListSitesResponse)(nil), // 3: com.mintter.daemon.v1alpha.ListSitesResponse
	(*SiteConfig)(nil),        // 4: com.mintter.daemon.v1alpha.SiteConfig
	(v1alpha.Member_Role)(0),  // 5: com.mintter.site.v1alpha.Member.Role
	(*emptypb.Empty)(nil),     // 6: google.protobuf.Empty
}
var file_daemon_v1alpha_sites_proto_depIdxs = []int32{
	4, // 0: com.mintter.daemon.v1alpha.ListSitesResponse.sites:type_name -> com.mintter.daemon.v1alpha.SiteConfig
	5, // 1: com.mintter.daemon.v1alpha.SiteConfig.role:type_name -> com.mintter.site.v1alpha.Member.Role
	0, // 2: com.mintter.daemon.v1alpha.Sites.AddSite:input_type -> com.mintter.daemon.v1alpha.AddSiteRequest
	1, // 3: com.mintter.daemon.v1alpha.Sites.DeleteSite:input_type -> com.mintter.daemon.v1alpha.DeleteSiteRequest
	2, // 4: com.mintter.daemon.v1alpha.Sites.ListSites:input_type -> com.mintter.daemon.v1alpha.ListSitesRequest
	4, // 5: com.mintter.daemon.v1alpha.Sites.AddSite:output_type -> com.mintter.daemon.v1alpha.SiteConfig
	6, // 6: com.mintter.daemon.v1alpha.Sites.DeleteSite:output_type -> google.protobuf.Empty
	3, // 7: com.mintter.daemon.v1alpha.Sites.ListSites:output_type -> com.mintter.daemon.v1alpha.ListSitesResponse
	5, // [5:8] is the sub-list for method output_type
	2, // [2:5] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_daemon_v1alpha_sites_proto_init() }
func file_daemon_v1alpha_sites_proto_init() {
	if File_daemon_v1alpha_sites_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_daemon_v1alpha_sites_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*AddSiteRequest); i {
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
		file_daemon_v1alpha_sites_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*DeleteSiteRequest); i {
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
		file_daemon_v1alpha_sites_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListSitesRequest); i {
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
		file_daemon_v1alpha_sites_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListSitesResponse); i {
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
		file_daemon_v1alpha_sites_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SiteConfig); i {
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
			RawDescriptor: file_daemon_v1alpha_sites_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   5,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_daemon_v1alpha_sites_proto_goTypes,
		DependencyIndexes: file_daemon_v1alpha_sites_proto_depIdxs,
		MessageInfos:      file_daemon_v1alpha_sites_proto_msgTypes,
	}.Build()
	File_daemon_v1alpha_sites_proto = out.File
	file_daemon_v1alpha_sites_proto_rawDesc = nil
	file_daemon_v1alpha_sites_proto_goTypes = nil
	file_daemon_v1alpha_sites_proto_depIdxs = nil
}
