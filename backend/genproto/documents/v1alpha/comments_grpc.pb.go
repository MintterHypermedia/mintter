// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.19.4
// source: documents/v1alpha/comments.proto

package documents

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

// CommentsClient is the client API for Comments service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type CommentsClient interface {
	// Creates a new conversation about a particular selection in a document.
	CreateConversation(ctx context.Context, in *CreateConversationRequest, opts ...grpc.CallOption) (*Conversation, error)
	// Adds a comment to a previously existing conversation.
	AddComment(ctx context.Context, in *AddCommentRequest, opts ...grpc.CallOption) (*Block, error)
	// Deletes an existing conversation.
	DeleteConversation(ctx context.Context, in *DeleteConversationRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// Marks an existing conversation as resolved.
	ResolveConversation(ctx context.Context, in *ResolveConversationRequest, opts ...grpc.CallOption) (*ResolveConversationResponse, error)
	// Deletes a comment from a conversation.
	DeleteComment(ctx context.Context, in *DeleteCommentRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// Lists conversations of a particular document.
	ListConversations(ctx context.Context, in *ListConversationsRequest, opts ...grpc.CallOption) (*ListConversationsResponse, error)
}

type commentsClient struct {
	cc grpc.ClientConnInterface
}

func NewCommentsClient(cc grpc.ClientConnInterface) CommentsClient {
	return &commentsClient{cc}
}

func (c *commentsClient) CreateConversation(ctx context.Context, in *CreateConversationRequest, opts ...grpc.CallOption) (*Conversation, error) {
	out := new(Conversation)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/CreateConversation", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) AddComment(ctx context.Context, in *AddCommentRequest, opts ...grpc.CallOption) (*Block, error) {
	out := new(Block)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/AddComment", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) DeleteConversation(ctx context.Context, in *DeleteConversationRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/DeleteConversation", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) ResolveConversation(ctx context.Context, in *ResolveConversationRequest, opts ...grpc.CallOption) (*ResolveConversationResponse, error) {
	out := new(ResolveConversationResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/ResolveConversation", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) DeleteComment(ctx context.Context, in *DeleteCommentRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/DeleteComment", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) ListConversations(ctx context.Context, in *ListConversationsRequest, opts ...grpc.CallOption) (*ListConversationsResponse, error) {
	out := new(ListConversationsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/ListConversations", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// CommentsServer is the server API for Comments service.
// All implementations should embed UnimplementedCommentsServer
// for forward compatibility
type CommentsServer interface {
	// Creates a new conversation about a particular selection in a document.
	CreateConversation(context.Context, *CreateConversationRequest) (*Conversation, error)
	// Adds a comment to a previously existing conversation.
	AddComment(context.Context, *AddCommentRequest) (*Block, error)
	// Deletes an existing conversation.
	DeleteConversation(context.Context, *DeleteConversationRequest) (*emptypb.Empty, error)
	// Marks an existing conversation as resolved.
	ResolveConversation(context.Context, *ResolveConversationRequest) (*ResolveConversationResponse, error)
	// Deletes a comment from a conversation.
	DeleteComment(context.Context, *DeleteCommentRequest) (*emptypb.Empty, error)
	// Lists conversations of a particular document.
	ListConversations(context.Context, *ListConversationsRequest) (*ListConversationsResponse, error)
}

// UnimplementedCommentsServer should be embedded to have forward compatible implementations.
type UnimplementedCommentsServer struct {
}

func (UnimplementedCommentsServer) CreateConversation(context.Context, *CreateConversationRequest) (*Conversation, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateConversation not implemented")
}
func (UnimplementedCommentsServer) AddComment(context.Context, *AddCommentRequest) (*Block, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddComment not implemented")
}
func (UnimplementedCommentsServer) DeleteConversation(context.Context, *DeleteConversationRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteConversation not implemented")
}
func (UnimplementedCommentsServer) ResolveConversation(context.Context, *ResolveConversationRequest) (*ResolveConversationResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ResolveConversation not implemented")
}
func (UnimplementedCommentsServer) DeleteComment(context.Context, *DeleteCommentRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteComment not implemented")
}
func (UnimplementedCommentsServer) ListConversations(context.Context, *ListConversationsRequest) (*ListConversationsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListConversations not implemented")
}

// UnsafeCommentsServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to CommentsServer will
// result in compilation errors.
type UnsafeCommentsServer interface {
	mustEmbedUnimplementedCommentsServer()
}

func RegisterCommentsServer(s grpc.ServiceRegistrar, srv CommentsServer) {
	s.RegisterService(&Comments_ServiceDesc, srv)
}

func _Comments_CreateConversation_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateConversationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).CreateConversation(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/CreateConversation",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).CreateConversation(ctx, req.(*CreateConversationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_AddComment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddCommentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).AddComment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/AddComment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).AddComment(ctx, req.(*AddCommentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_DeleteConversation_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteConversationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).DeleteConversation(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/DeleteConversation",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).DeleteConversation(ctx, req.(*DeleteConversationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_ResolveConversation_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ResolveConversationRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).ResolveConversation(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/ResolveConversation",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).ResolveConversation(ctx, req.(*ResolveConversationRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_DeleteComment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteCommentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).DeleteComment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/DeleteComment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).DeleteComment(ctx, req.(*DeleteCommentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_ListConversations_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListConversationsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).ListConversations(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/ListConversations",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).ListConversations(ctx, req.(*ListConversationsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Comments_ServiceDesc is the grpc.ServiceDesc for Comments service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Comments_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "com.mintter.documents.v1alpha.Comments",
	HandlerType: (*CommentsServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateConversation",
			Handler:    _Comments_CreateConversation_Handler,
		},
		{
			MethodName: "AddComment",
			Handler:    _Comments_AddComment_Handler,
		},
		{
			MethodName: "DeleteConversation",
			Handler:    _Comments_DeleteConversation_Handler,
		},
		{
			MethodName: "ResolveConversation",
			Handler:    _Comments_ResolveConversation_Handler,
		},
		{
			MethodName: "DeleteComment",
			Handler:    _Comments_DeleteComment_Handler,
		},
		{
			MethodName: "ListConversations",
			Handler:    _Comments_ListConversations_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/comments.proto",
}
