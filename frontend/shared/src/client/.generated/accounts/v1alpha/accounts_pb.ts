// @generated by protoc-gen-es v1.1.0 with parameter "target=ts,import_extension=none"
// @generated from file accounts/v1alpha/accounts.proto (package com.mintter.accounts.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message com.mintter.accounts.v1alpha.GetAccountRequest
 */
export class GetAccountRequest extends Message<GetAccountRequest> {
  /**
   * ID of the Account to be looked up. If empty - our own account will be returned.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<GetAccountRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.GetAccountRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAccountRequest {
    return new GetAccountRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAccountRequest {
    return new GetAccountRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAccountRequest {
    return new GetAccountRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetAccountRequest | PlainMessage<GetAccountRequest> | undefined, b: GetAccountRequest | PlainMessage<GetAccountRequest> | undefined): boolean {
    return proto3.util.equals(GetAccountRequest, a, b);
  }
}

/**
 * @generated from message com.mintter.accounts.v1alpha.ListAccountsRequest
 */
export class ListAccountsRequest extends Message<ListAccountsRequest> {
  /**
   * @generated from field: int32 page_size = 1;
   */
  pageSize = 0;

  /**
   * @generated from field: string page_token = 2;
   */
  pageToken = "";

  constructor(data?: PartialMessage<ListAccountsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.ListAccountsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAccountsRequest {
    return new ListAccountsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAccountsRequest {
    return new ListAccountsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAccountsRequest {
    return new ListAccountsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListAccountsRequest | PlainMessage<ListAccountsRequest> | undefined, b: ListAccountsRequest | PlainMessage<ListAccountsRequest> | undefined): boolean {
    return proto3.util.equals(ListAccountsRequest, a, b);
  }
}

/**
 * @generated from message com.mintter.accounts.v1alpha.ListAccountsResponse
 */
export class ListAccountsResponse extends Message<ListAccountsResponse> {
  /**
   * @generated from field: repeated com.mintter.accounts.v1alpha.Account accounts = 1;
   */
  accounts: Account[] = [];

  /**
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<ListAccountsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.ListAccountsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "accounts", kind: "message", T: Account, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListAccountsResponse {
    return new ListAccountsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListAccountsResponse {
    return new ListAccountsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListAccountsResponse {
    return new ListAccountsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListAccountsResponse | PlainMessage<ListAccountsResponse> | undefined, b: ListAccountsResponse | PlainMessage<ListAccountsResponse> | undefined): boolean {
    return proto3.util.equals(ListAccountsResponse, a, b);
  }
}

/**
 * @generated from message com.mintter.accounts.v1alpha.Account
 */
export class Account extends Message<Account> {
  /**
   * Mintter Account ID.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Profile information of this account.
   *
   * @generated from field: com.mintter.accounts.v1alpha.Profile profile = 2;
   */
  profile?: Profile;

  /**
   * List of known devices of this Account.
   *
   * @generated from field: map<string, com.mintter.accounts.v1alpha.Device> devices = 3;
   */
  devices: { [key: string]: Device } = {};

  constructor(data?: PartialMessage<Account>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.Account";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "profile", kind: "message", T: Profile },
    { no: 3, name: "devices", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Device} },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Account {
    return new Account().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Account {
    return new Account().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Account {
    return new Account().fromJsonString(jsonString, options);
  }

  static equals(a: Account | PlainMessage<Account> | undefined, b: Account | PlainMessage<Account> | undefined): boolean {
    return proto3.util.equals(Account, a, b);
  }
}

/**
 * @generated from message com.mintter.accounts.v1alpha.Profile
 */
export class Profile extends Message<Profile> {
  /**
   * @generated from field: string alias = 1;
   */
  alias = "";

  /**
   * @generated from field: string bio = 2;
   */
  bio = "";

  /**
   * @generated from field: string email = 3;
   */
  email = "";

  constructor(data?: PartialMessage<Profile>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.Profile";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "alias", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "bio", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Profile {
    return new Profile().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Profile {
    return new Profile().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Profile {
    return new Profile().fromJsonString(jsonString, options);
  }

  static equals(a: Profile | PlainMessage<Profile> | undefined, b: Profile | PlainMessage<Profile> | undefined): boolean {
    return proto3.util.equals(Profile, a, b);
  }
}

/**
 * @generated from message com.mintter.accounts.v1alpha.Device
 */
export class Device extends Message<Device> {
  /**
   * CID-encoded Peer ID of this device.
   *
   * @generated from field: string peer_id = 1;
   */
  peerId = "";

  constructor(data?: PartialMessage<Device>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.accounts.v1alpha.Device";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "peer_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Device {
    return new Device().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Device {
    return new Device().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Device {
    return new Device().fromJsonString(jsonString, options);
  }

  static equals(a: Device | PlainMessage<Device> | undefined, b: Device | PlainMessage<Device> | undefined): boolean {
    return proto3.util.equals(Device, a, b);
  }
}

