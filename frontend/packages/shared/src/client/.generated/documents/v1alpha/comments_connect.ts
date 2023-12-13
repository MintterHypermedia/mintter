// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/comments.proto (package com.mintter.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Comment, CreateCommentRequest, GetCommentRequest, ListCommentsRequest, ListCommentsResponse } from "./comments_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Comments service allows users to add comments to documents.
 *
 * @generated from service com.mintter.documents.v1alpha.Comments
 */
export const Comments = {
  typeName: "com.mintter.documents.v1alpha.Comments",
  methods: {
    /**
     * Creates a new comment.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.CreateComment
     */
    createComment: {
      name: "CreateComment",
      I: CreateCommentRequest,
      O: Comment,
      kind: MethodKind.Unary,
    },
    /**
     * Gets a single comment by ID.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.GetComment
     */
    getComment: {
      name: "GetComment",
      I: GetCommentRequest,
      O: Comment,
      kind: MethodKind.Unary,
    },
    /**
     * Lists comments for a given target.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.ListComments
     */
    listComments: {
      name: "ListComments",
      I: ListCommentsRequest,
      O: ListCommentsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

