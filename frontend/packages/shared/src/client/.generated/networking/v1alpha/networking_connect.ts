// @generated by protoc-gen-connect-es v0.13.0 with parameter "target=ts,import_extension=none"
// @generated from file networking/v1alpha/networking.proto (package com.mintter.networking.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { ConnectRequest, ConnectResponse, GetPeerInfoRequest, ListPeersRequest, ListPeersResponse, PeerInfo } from "./networking_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Networking API service of the Mintter daemon.
 *
 * @generated from service com.mintter.networking.v1alpha.Networking
 */
export const Networking = {
  typeName: "com.mintter.networking.v1alpha.Networking",
  methods: {
    /**
     * Lookup details about a known peer.
     *
     * @generated from rpc com.mintter.networking.v1alpha.Networking.GetPeerInfo
     */
    getPeerInfo: {
      name: "GetPeerInfo",
      I: GetPeerInfoRequest,
      O: PeerInfo,
      kind: MethodKind.Unary,
    },
    /**
     * List peers by status.
     *
     * @generated from rpc com.mintter.networking.v1alpha.Networking.ListPeers
     */
    listPeers: {
      name: "ListPeers",
      I: ListPeersRequest,
      O: ListPeersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Establishes a direct connection with a given peer explicitly.
     *
     * @generated from rpc com.mintter.networking.v1alpha.Networking.Connect
     */
    connect: {
      name: "Connect",
      I: ConnectRequest,
      O: ConnectResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

