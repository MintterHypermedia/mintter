// Deprecated. Use Entities API instead.

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.30.0
// 	protoc        v3.21.12
// source: documents/v1alpha/changes.proto

package documents

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

// Request for getting change info.
type GetChangeInfoRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// ID of the Change.
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *GetChangeInfoRequest) Reset() {
	*x = GetChangeInfoRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_documents_v1alpha_changes_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetChangeInfoRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetChangeInfoRequest) ProtoMessage() {}

func (x *GetChangeInfoRequest) ProtoReflect() protoreflect.Message {
	mi := &file_documents_v1alpha_changes_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetChangeInfoRequest.ProtoReflect.Descriptor instead.
func (*GetChangeInfoRequest) Descriptor() ([]byte, []int) {
	return file_documents_v1alpha_changes_proto_rawDescGZIP(), []int{0}
}

func (x *GetChangeInfoRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

// Request to list changes.
type ListChangesRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Required. ID of the Mintter object to list changes for.
	DocumentId string `protobuf:"bytes,1,opt,name=document_id,json=documentId,proto3" json:"document_id,omitempty"`
	// Optional. Number of results per page.
	PageSize int32 `protobuf:"varint,2,opt,name=page_size,json=pageSize,proto3" json:"page_size,omitempty"`
	// Optional. Token for the page to return.
	PageToken string `protobuf:"bytes,3,opt,name=page_token,json=pageToken,proto3" json:"page_token,omitempty"`
}

func (x *ListChangesRequest) Reset() {
	*x = ListChangesRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_documents_v1alpha_changes_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListChangesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListChangesRequest) ProtoMessage() {}

func (x *ListChangesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_documents_v1alpha_changes_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListChangesRequest.ProtoReflect.Descriptor instead.
func (*ListChangesRequest) Descriptor() ([]byte, []int) {
	return file_documents_v1alpha_changes_proto_rawDescGZIP(), []int{1}
}

func (x *ListChangesRequest) GetDocumentId() string {
	if x != nil {
		return x.DocumentId
	}
	return ""
}

func (x *ListChangesRequest) GetPageSize() int32 {
	if x != nil {
		return x.PageSize
	}
	return 0
}

func (x *ListChangesRequest) GetPageToken() string {
	if x != nil {
		return x.PageToken
	}
	return ""
}

// Response with a list of changes.
type ListChangesResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// List of changes matching the request.
	Changes []*ChangeInfo `protobuf:"bytes,1,rep,name=changes,proto3" json:"changes,omitempty"`
	// Token for the next page if there's any.
	NextPageToken string `protobuf:"bytes,2,opt,name=next_page_token,json=nextPageToken,proto3" json:"next_page_token,omitempty"`
}

func (x *ListChangesResponse) Reset() {
	*x = ListChangesResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_documents_v1alpha_changes_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ListChangesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ListChangesResponse) ProtoMessage() {}

func (x *ListChangesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_documents_v1alpha_changes_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ListChangesResponse.ProtoReflect.Descriptor instead.
func (*ListChangesResponse) Descriptor() ([]byte, []int) {
	return file_documents_v1alpha_changes_proto_rawDescGZIP(), []int{2}
}

func (x *ListChangesResponse) GetChanges() []*ChangeInfo {
	if x != nil {
		return x.Changes
	}
	return nil
}

func (x *ListChangesResponse) GetNextPageToken() string {
	if x != nil {
		return x.NextPageToken
	}
	return ""
}

// Metadata about a single Change.
type ChangeInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// ID of the Change.
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	// Author of the Change.
	Author string `protobuf:"bytes,2,opt,name=author,proto3" json:"author,omitempty"`
	// Time when this change was recorded by the author.
	CreateTime *timestamppb.Timestamp `protobuf:"bytes,3,opt,name=create_time,json=createTime,proto3" json:"create_time,omitempty"`
	// The document version ID corresponding to this changes.
	//
	// TODO(burdiyan): after the breaking change the change ID can be used directly as version.
	Version string `protobuf:"bytes,4,opt,name=version,proto3" json:"version,omitempty"`
	// IDs of other Changes that are dependencies of this Change.
	Deps []string `protobuf:"bytes,5,rep,name=deps,proto3" json:"deps,omitempty"`
}

func (x *ChangeInfo) Reset() {
	*x = ChangeInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_documents_v1alpha_changes_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ChangeInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ChangeInfo) ProtoMessage() {}

func (x *ChangeInfo) ProtoReflect() protoreflect.Message {
	mi := &file_documents_v1alpha_changes_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ChangeInfo.ProtoReflect.Descriptor instead.
func (*ChangeInfo) Descriptor() ([]byte, []int) {
	return file_documents_v1alpha_changes_proto_rawDescGZIP(), []int{3}
}

func (x *ChangeInfo) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *ChangeInfo) GetAuthor() string {
	if x != nil {
		return x.Author
	}
	return ""
}

func (x *ChangeInfo) GetCreateTime() *timestamppb.Timestamp {
	if x != nil {
		return x.CreateTime
	}
	return nil
}

func (x *ChangeInfo) GetVersion() string {
	if x != nil {
		return x.Version
	}
	return ""
}

func (x *ChangeInfo) GetDeps() []string {
	if x != nil {
		return x.Deps
	}
	return nil
}

var File_documents_v1alpha_changes_proto protoreflect.FileDescriptor

var file_documents_v1alpha_changes_proto_rawDesc = []byte{
	0x0a, 0x1f, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x2f, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x12, 0x1d, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64,
	0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x1a, 0x1f, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2f, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x22, 0x26, 0x0a, 0x14, 0x47, 0x65, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e,
	0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x71, 0x0a, 0x12, 0x4c, 0x69, 0x73,
	0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12,
	0x1f, 0x0a, 0x0b, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x49, 0x64,
	0x12, 0x1b, 0x0a, 0x09, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x73, 0x69, 0x7a, 0x65, 0x18, 0x02, 0x20,
	0x01, 0x28, 0x05, 0x52, 0x08, 0x70, 0x61, 0x67, 0x65, 0x53, 0x69, 0x7a, 0x65, 0x12, 0x1d, 0x0a,
	0x0a, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x09, 0x70, 0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65, 0x6e, 0x22, 0x82, 0x01, 0x0a,
	0x13, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x43, 0x0a, 0x07, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x18,
	0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x29, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31,
	0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e, 0x66, 0x6f,
	0x52, 0x07, 0x63, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x12, 0x26, 0x0a, 0x0f, 0x6e, 0x65, 0x78,
	0x74, 0x5f, 0x70, 0x61, 0x67, 0x65, 0x5f, 0x74, 0x6f, 0x6b, 0x65, 0x6e, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0d, 0x6e, 0x65, 0x78, 0x74, 0x50, 0x61, 0x67, 0x65, 0x54, 0x6f, 0x6b, 0x65,
	0x6e, 0x22, 0x9f, 0x01, 0x0a, 0x0a, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e, 0x66, 0x6f,
	0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64,
	0x12, 0x16, 0x0a, 0x06, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x06, 0x61, 0x75, 0x74, 0x68, 0x6f, 0x72, 0x12, 0x3b, 0x0a, 0x0b, 0x63, 0x72, 0x65, 0x61,
	0x74, 0x65, 0x5f, 0x74, 0x69, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e,
	0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e,
	0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74,
	0x65, 0x54, 0x69, 0x6d, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x12,
	0x12, 0x0a, 0x04, 0x64, 0x65, 0x70, 0x73, 0x18, 0x05, 0x20, 0x03, 0x28, 0x09, 0x52, 0x04, 0x64,
	0x65, 0x70, 0x73, 0x32, 0xf0, 0x01, 0x0a, 0x07, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x12,
	0x6f, 0x0a, 0x0d, 0x47, 0x65, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e, 0x66, 0x6f,
	0x12, 0x33, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64,
	0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61,
	0x2e, 0x47, 0x65, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x29, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74,
	0x74, 0x65, 0x72, 0x2e, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31,
	0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x49, 0x6e, 0x66, 0x6f,
	0x12, 0x74, 0x0a, 0x0b, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x12,
	0x31, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72, 0x2e, 0x64, 0x6f,
	0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x2e,
	0x4c, 0x69, 0x73, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x32, 0x2e, 0x63, 0x6f, 0x6d, 0x2e, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65, 0x72,
	0x2e, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x43, 0x68, 0x61, 0x6e, 0x67, 0x65, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x36, 0x5a, 0x34, 0x6d, 0x69, 0x6e, 0x74, 0x74, 0x65,
	0x72, 0x2f, 0x62, 0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x67, 0x65, 0x6e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x2f, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x2f, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x3b, 0x64, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x62, 0x06,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_documents_v1alpha_changes_proto_rawDescOnce sync.Once
	file_documents_v1alpha_changes_proto_rawDescData = file_documents_v1alpha_changes_proto_rawDesc
)

func file_documents_v1alpha_changes_proto_rawDescGZIP() []byte {
	file_documents_v1alpha_changes_proto_rawDescOnce.Do(func() {
		file_documents_v1alpha_changes_proto_rawDescData = protoimpl.X.CompressGZIP(file_documents_v1alpha_changes_proto_rawDescData)
	})
	return file_documents_v1alpha_changes_proto_rawDescData
}

var file_documents_v1alpha_changes_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_documents_v1alpha_changes_proto_goTypes = []interface{}{
	(*GetChangeInfoRequest)(nil),  // 0: com.mintter.documents.v1alpha.GetChangeInfoRequest
	(*ListChangesRequest)(nil),    // 1: com.mintter.documents.v1alpha.ListChangesRequest
	(*ListChangesResponse)(nil),   // 2: com.mintter.documents.v1alpha.ListChangesResponse
	(*ChangeInfo)(nil),            // 3: com.mintter.documents.v1alpha.ChangeInfo
	(*timestamppb.Timestamp)(nil), // 4: google.protobuf.Timestamp
}
var file_documents_v1alpha_changes_proto_depIdxs = []int32{
	3, // 0: com.mintter.documents.v1alpha.ListChangesResponse.changes:type_name -> com.mintter.documents.v1alpha.ChangeInfo
	4, // 1: com.mintter.documents.v1alpha.ChangeInfo.create_time:type_name -> google.protobuf.Timestamp
	0, // 2: com.mintter.documents.v1alpha.Changes.GetChangeInfo:input_type -> com.mintter.documents.v1alpha.GetChangeInfoRequest
	1, // 3: com.mintter.documents.v1alpha.Changes.ListChanges:input_type -> com.mintter.documents.v1alpha.ListChangesRequest
	3, // 4: com.mintter.documents.v1alpha.Changes.GetChangeInfo:output_type -> com.mintter.documents.v1alpha.ChangeInfo
	2, // 5: com.mintter.documents.v1alpha.Changes.ListChanges:output_type -> com.mintter.documents.v1alpha.ListChangesResponse
	4, // [4:6] is the sub-list for method output_type
	2, // [2:4] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_documents_v1alpha_changes_proto_init() }
func file_documents_v1alpha_changes_proto_init() {
	if File_documents_v1alpha_changes_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_documents_v1alpha_changes_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetChangeInfoRequest); i {
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
		file_documents_v1alpha_changes_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListChangesRequest); i {
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
		file_documents_v1alpha_changes_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ListChangesResponse); i {
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
		file_documents_v1alpha_changes_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ChangeInfo); i {
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
			RawDescriptor: file_documents_v1alpha_changes_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_documents_v1alpha_changes_proto_goTypes,
		DependencyIndexes: file_documents_v1alpha_changes_proto_depIdxs,
		MessageInfos:      file_documents_v1alpha_changes_proto_msgTypes,
	}.Build()
	File_documents_v1alpha_changes_proto = out.File
	file_documents_v1alpha_changes_proto_rawDesc = nil
	file_documents_v1alpha_changes_proto_goTypes = nil
	file_documents_v1alpha_changes_proto_depIdxs = nil
}
