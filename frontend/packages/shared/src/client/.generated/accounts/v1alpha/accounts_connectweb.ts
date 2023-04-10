// @generated by protoc-gen-connect-web v0.8.5 with parameter "target=ts,import_extension=none"
// @generated from file accounts/v1alpha/accounts.proto (package com.mintter.accounts.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Account, GetAccountRequest, ListAccountsRequest, ListAccountsResponse, Profile } from "./accounts_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Accounts API service.
 *
 * @generated from service com.mintter.accounts.v1alpha.Accounts
 */
export const Accounts = {
  typeName: "com.mintter.accounts.v1alpha.Accounts",
  methods: {
    /**
     * Lookup an Account information across the already known accounts.
     * Can also be used to retrieve our own account.
     *
     * @generated from rpc com.mintter.accounts.v1alpha.Accounts.GetAccount
     */
    getAccount: {
      name: "GetAccount",
      I: GetAccountRequest,
      O: Account,
      kind: MethodKind.Unary,
    },
    /**
     * Update Profile information of our own Account.
     *
     * @generated from rpc com.mintter.accounts.v1alpha.Accounts.UpdateProfile
     */
    updateProfile: {
      name: "UpdateProfile",
      I: Profile,
      O: Account,
      kind: MethodKind.Unary,
    },
    /**
     * List accounts known to the backend (excluding our own account). New accounts can be discovered naturally by
     * interacting with the network, or users can ask to discover specific accounts using
     * the Networking API.
     *
     * @generated from rpc com.mintter.accounts.v1alpha.Accounts.ListAccounts
     */
    listAccounts: {
      name: "ListAccounts",
      I: ListAccountsRequest,
      O: ListAccountsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

