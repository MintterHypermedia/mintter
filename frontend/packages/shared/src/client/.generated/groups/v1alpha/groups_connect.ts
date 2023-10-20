// @generated by protoc-gen-connect-es v1.1.2 with parameter "target=ts,import_extension=none"
// @generated from file groups/v1alpha/groups.proto (package com.mintter.groups.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CreateGroupRequest, GetGroupRequest, Group, ListAccountGroupsRequest, ListAccountGroupsResponse, ListContentRequest, ListContentResponse, ListDocumentGroupsRequest, ListDocumentGroupsResponse, ListGroupsRequest, ListGroupsResponse, ListMembersRequest, ListMembersResponse, UpdateGroupRequest } from "./groups_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Groups service exposes the functionality for managing group entities.
 * This API uses fully-qualified EID as group IDs in all the requests.
 *
 * @generated from service com.mintter.groups.v1alpha.Groups
 */
export const Groups = {
  typeName: "com.mintter.groups.v1alpha.Groups",
  methods: {
    /**
     * Creates a new group.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.CreateGroup
     */
    createGroup: {
      name: "CreateGroup",
      I: CreateGroupRequest,
      O: Group,
      kind: MethodKind.Unary,
    },
    /**
     * Gets a group by ID.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.GetGroup
     */
    getGroup: {
      name: "GetGroup",
      I: GetGroupRequest,
      O: Group,
      kind: MethodKind.Unary,
    },
    /**
     * Updates a group.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.UpdateGroup
     */
    updateGroup: {
      name: "UpdateGroup",
      I: UpdateGroupRequest,
      O: Group,
      kind: MethodKind.Unary,
    },
    /**
     * Lists members of a group.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.ListMembers
     */
    listMembers: {
      name: "ListMembers",
      I: ListMembersRequest,
      O: ListMembersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists content of a group.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.ListContent
     */
    listContent: {
      name: "ListContent",
      I: ListContentRequest,
      O: ListContentResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists groups.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.ListGroups
     */
    listGroups: {
      name: "ListGroups",
      I: ListGroupsRequest,
      O: ListGroupsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists groups that a document is published to.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.ListDocumentGroups
     */
    listDocumentGroups: {
      name: "ListDocumentGroups",
      I: ListDocumentGroupsRequest,
      O: ListDocumentGroupsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists groups that an account is a member of.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Groups.ListAccountGroups
     */
    listAccountGroups: {
      name: "ListAccountGroups",
      I: ListAccountGroupsRequest,
      O: ListAccountGroupsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

