// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: documents/v1alpha/comments.proto

package documents

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// CommentsClient is the client API for Comments service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type CommentsClient interface {
	// Creates a new comment.
	CreateComment(ctx context.Context, in *CreateCommentRequest, opts ...grpc.CallOption) (*Comment, error)
	// Lists comments for a given target.
	ListComments(ctx context.Context, in *ListCommentsRequest, opts ...grpc.CallOption) (*ListCommentsResponse, error)
}

type commentsClient struct {
	cc grpc.ClientConnInterface
}

func NewCommentsClient(cc grpc.ClientConnInterface) CommentsClient {
	return &commentsClient{cc}
}

func (c *commentsClient) CreateComment(ctx context.Context, in *CreateCommentRequest, opts ...grpc.CallOption) (*Comment, error) {
	out := new(Comment)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/CreateComment", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *commentsClient) ListComments(ctx context.Context, in *ListCommentsRequest, opts ...grpc.CallOption) (*ListCommentsResponse, error) {
	out := new(ListCommentsResponse)
	err := c.cc.Invoke(ctx, "/com.mintter.documents.v1alpha.Comments/ListComments", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// CommentsServer is the server API for Comments service.
// All implementations should embed UnimplementedCommentsServer
// for forward compatibility
type CommentsServer interface {
	// Creates a new comment.
	CreateComment(context.Context, *CreateCommentRequest) (*Comment, error)
	// Lists comments for a given target.
	ListComments(context.Context, *ListCommentsRequest) (*ListCommentsResponse, error)
}

// UnimplementedCommentsServer should be embedded to have forward compatible implementations.
type UnimplementedCommentsServer struct {
}

func (UnimplementedCommentsServer) CreateComment(context.Context, *CreateCommentRequest) (*Comment, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateComment not implemented")
}
func (UnimplementedCommentsServer) ListComments(context.Context, *ListCommentsRequest) (*ListCommentsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListComments not implemented")
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

func _Comments_CreateComment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateCommentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).CreateComment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/CreateComment",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).CreateComment(ctx, req.(*CreateCommentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Comments_ListComments_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListCommentsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CommentsServer).ListComments(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/com.mintter.documents.v1alpha.Comments/ListComments",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CommentsServer).ListComments(ctx, req.(*ListCommentsRequest))
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
			MethodName: "CreateComment",
			Handler:    _Comments_CreateComment_Handler,
		},
		{
			MethodName: "ListComments",
			Handler:    _Comments_ListComments_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "documents/v1alpha/comments.proto",
}
