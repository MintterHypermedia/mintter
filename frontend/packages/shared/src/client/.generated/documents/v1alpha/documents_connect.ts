// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/documents.proto (package com.seed.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Branch, ChangeDocumentRequest, ChangeProfileDocumentRequest, CreateBranchDraftRequest, CreateDraftRequest, CreateIndexDraftRequest, CreateProfileDraftRequest, DeleteDraftRequest, Document, Draft, GetDocumentIndexRequest, GetDocumentIndexResponse, GetDocumentRequest, GetDraftRequest, GetProfileDocumentRequest, GetProfileDraftRequest, ListAccountDocumentsRequest, ListDocumentBranchesRequest, ListDocumentBranchesResponse, ListDocumentDraftsRequest, ListDocumentDraftsResponse, ListDocumentsRequest, ListDocumentsResponse, ListDraftsRequest, ListDraftsResponse, MergeChangesRequest, PublishDraftRequest, PushDocumentRequest, RebaseChangesRequest, UpdateDraftRequest, UpdateDraftResponse } from "./documents_pb";
import { Empty, MethodKind } from "@bufbuild/protobuf";

/**
 * Drafts service exposes the functionality
 *
 * @generated from service com.seed.documents.v1alpha.Drafts
 */
export const Drafts = {
  typeName: "com.seed.documents.v1alpha.Drafts",
  methods: {
    /**
     * Creates a new draft of an existing standalone branch
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.CreateDraft
     */
    createDraft: {
      name: "CreateDraft",
      I: CreateDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Creates a draft for a new branch. 
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.CreateBranchDraft
     */
    createBranchDraft: {
      name: "CreateBranchDraft",
      I: CreateBranchDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Creates a draft for an index branch. Thows if a draft already exists for this index.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.CreateIndexDraft
     */
    createIndexDraft: {
      name: "CreateIndexDraft",
      I: CreateIndexDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Create a draft for a profile document. Thows if a draft already exists for this profile.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.CreateProfileDraft
     */
    createProfileDraft: {
      name: "CreateProfileDraft",
      I: CreateProfileDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Deletes a draft by its document ID.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.DeleteDraft
     */
    deleteDraft: {
      name: "DeleteDraft",
      I: DeleteDraftRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Gets a single draft if exists.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.GetDraft
     */
    getDraft: {
      name: "GetDraft",
      I: GetDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Gets a draft for a profile document.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.GetProfileDraft
     */
    getProfileDraft: {
      name: "GetProfileDraft",
      I: GetProfileDraftRequest,
      O: Draft,
      kind: MethodKind.Unary,
    },
    /**
     * Updates a draft using granular update operations.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.UpdateDraft
     */
    updateDraft: {
      name: "UpdateDraft",
      I: UpdateDraftRequest,
      O: UpdateDraftResponse,
      kind: MethodKind.Unary,
    },
    /**
     * List currently stored drafts.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.ListDrafts
     */
    listDrafts: {
      name: "ListDrafts",
      I: ListDraftsRequest,
      O: ListDraftsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists drafts for a given document.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.ListDocumentDrafts
     */
    listDocumentDrafts: {
      name: "ListDocumentDrafts",
      I: ListDocumentDraftsRequest,
      O: ListDocumentDraftsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Publishes a draft. Returns the branch that was published.
     *
     * @generated from rpc com.seed.documents.v1alpha.Drafts.PublishDraft
     */
    publishDraft: {
      name: "PublishDraft",
      I: PublishDraftRequest,
      O: Branch,
      kind: MethodKind.Unary,
    },
  }
} as const;

/**
 * Documents service provides access to documents.
 *
 * @generated from service com.seed.documents.v1alpha.Documents
 */
export const Documents = {
  typeName: "com.seed.documents.v1alpha.Documents",
  methods: {
    /**
     * Gets a single document.
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.GetDocument
     */
    getDocument: {
      name: "GetDocument",
      I: GetDocumentRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
    /**
     * Gets an account's profile document.
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.GetProfileDocument
     */
    getProfileDocument: {
      name: "GetProfileDocument",
      I: GetProfileDocumentRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
    /**
     * Gets a document within the index(es) of other documents
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.GetDocumentIndex
     */
    getDocumentIndex: {
      name: "GetDocumentIndex",
      I: GetDocumentIndexRequest,
      O: GetDocumentIndexResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Immediately changes a document
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.ChangeDocument
     */
    changeDocument: {
      name: "ChangeDocument",
      I: ChangeDocumentRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
    /**
     * Immediately changes an account's profile document
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.ChangeProfileDocument
     */
    changeProfileDocument: {
      name: "ChangeProfileDocument",
      I: ChangeProfileDocumentRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
    /**
     * Lists all documents. Only the most recent versions show up.
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.ListDocuments
     */
    listDocuments: {
      name: "ListDocuments",
      I: ListDocumentsRequest,
      O: ListDocumentsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Lists branches of a document. Includes standalone and index branches, and any drafts for these branches
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.ListDocumentBranches
     */
    listDocumentBranches: {
      name: "ListDocumentBranches",
      I: ListDocumentBranchesRequest,
      O: ListDocumentBranchesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Push Local document to the gateway.
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.PushDocument
     */
    pushDocument: {
      name: "PushDocument",
      I: PushDocumentRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Lists documents owned by a given account.
     *
     * @generated from rpc com.seed.documents.v1alpha.Documents.ListAccountDocuments
     */
    listAccountDocuments: {
      name: "ListAccountDocuments",
      I: ListAccountDocumentsRequest,
      O: ListDocumentsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

/**
 * Merge service provides access to merge documents.
 *
 * @generated from service com.seed.documents.v1alpha.Merge
 */
export const Merge = {
  typeName: "com.seed.documents.v1alpha.Merge",
  methods: {
    /**
     * Merge changes and publishes.
     *
     * @generated from rpc com.seed.documents.v1alpha.Merge.MergeChanges
     */
    mergeChanges: {
      name: "MergeChanges",
      I: MergeChangesRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
    /**
     * Rebase changes
     *
     * @generated from rpc com.seed.documents.v1alpha.Merge.RebaseChanges
     */
    rebaseChanges: {
      name: "RebaseChanges",
      I: RebaseChangesRequest,
      O: Document,
      kind: MethodKind.Unary,
    },
  }
} as const;

