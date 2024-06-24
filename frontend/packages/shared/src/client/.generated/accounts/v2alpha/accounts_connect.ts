// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts,import_extension=none"
// @generated from file accounts/v2alpha/accounts.proto (package com.seed.accounts.v2alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Account, GetAccountRequest, ListAccountsRequest, ListAccountsResponse } from "./accounts_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Accounts API service.
 *
 * @generated from service com.seed.accounts.v2alpha.Accounts
 */
export const Accounts = {
  typeName: "com.seed.accounts.v2alpha.Accounts",
  methods: {
    /**
     * Lookup an Account information across the already known accounts.
     * Can also be used to retrieve our own account.
     *
     * @generated from rpc com.seed.accounts.v2alpha.Accounts.GetAccount
     */
    getAccount: {
      name: "GetAccount",
      I: GetAccountRequest,
      O: Account,
      kind: MethodKind.Unary,
    },
    /**
     * List accounts known to the backend. New accounts can be discovered naturally by
     * interacting with the network, or users can ask to discover specific accounts using
     * the Networking API.
     *
     * @generated from rpc com.seed.accounts.v2alpha.Accounts.ListAccounts
     */
    listAccounts: {
      name: "ListAccounts",
      I: ListAccountsRequest,
      O: ListAccountsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;
