// @generated by protoc-gen-connect-web v0.8.5 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/comments.proto (package com.mintter.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { AddCommentRequest, Conversation, CreateConversationRequest, DeleteCommentRequest, DeleteConversationRequest, ListConversationsRequest, ListConversationsResponse, ResolveConversationRequest, ResolveConversationResponse } from "./comments_pb";
import { Empty, MethodKind } from "@bufbuild/protobuf";
import { Block } from "./documents_pb";

/**
 * Comments service provides the way to add comments to publications.
 *
 * @generated from service com.mintter.documents.v1alpha.Comments
 */
export const Comments = {
  typeName: "com.mintter.documents.v1alpha.Comments",
  methods: {
    /**
     * Creates a new conversation about a particular selection in a document.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.CreateConversation
     */
    createConversation: {
      name: "CreateConversation",
      I: CreateConversationRequest,
      O: Conversation,
      kind: MethodKind.Unary,
    },
    /**
     * Adds a comment to a previously existing conversation.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.AddComment
     */
    addComment: {
      name: "AddComment",
      I: AddCommentRequest,
      O: Block,
      kind: MethodKind.Unary,
    },
    /**
     * Deletes an existing conversation.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.DeleteConversation
     */
    deleteConversation: {
      name: "DeleteConversation",
      I: DeleteConversationRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Marks an existing conversation as resolved.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.ResolveConversation
     */
    resolveConversation: {
      name: "ResolveConversation",
      I: ResolveConversationRequest,
      O: ResolveConversationResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Deletes a comment from a conversation.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.DeleteComment
     */
    deleteComment: {
      name: "DeleteComment",
      I: DeleteCommentRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Lists conversations of a particular document.
     *
     * @generated from rpc com.mintter.documents.v1alpha.Comments.ListConversations
     */
    listConversations: {
      name: "ListConversations",
      I: ListConversationsRequest,
      O: ListConversationsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

