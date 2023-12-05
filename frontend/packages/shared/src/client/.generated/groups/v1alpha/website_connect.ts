// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts,import_extension=none"
// @generated from file groups/v1alpha/website.proto (package com.mintter.groups.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { GetSiteInfoRequest, InitializeServerRequest, InitializeServerResponse, PublicSiteInfo, PublishBlobsRequest, PublishBlobsResponse } from "./website_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * API service exposed by the website server.
 * It's exposed as gRPC over Libp2p.
 *
 * @generated from service com.mintter.groups.v1alpha.Website
 */
export const Website = {
  typeName: "com.mintter.groups.v1alpha.Website",
  methods: {
    /**
     * Gets the public information about the website.
     * This information is also available as JSON over HTTP on `/.well-known/hypermedia-site`.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Website.GetSiteInfo
     */
    getSiteInfo: {
      name: "GetSiteInfo",
      I: GetSiteInfoRequest,
      O: PublicSiteInfo,
      kind: MethodKind.Unary,
    },
    /**
     * Initializes the server to become a website for a specific group.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Website.InitializeServer
     */
    initializeServer: {
      name: "InitializeServer",
      I: InitializeServerRequest,
      O: InitializeServerResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Publishes blobs to the website.
     *
     * @generated from rpc com.mintter.groups.v1alpha.Website.PublishBlobs
     */
    publishBlobs: {
      name: "PublishBlobs",
      I: PublishBlobsRequest,
      O: PublishBlobsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

