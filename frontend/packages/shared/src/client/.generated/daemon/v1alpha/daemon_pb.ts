// @generated by protoc-gen-es v1.4.1 with parameter "target=ts,import_extension=none"
// @generated from file daemon/v1alpha/daemon.proto (package com.mintter.daemon.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from message com.mintter.daemon.v1alpha.GenMnemonicRequest
 */
export class GenMnemonicRequest extends Message<GenMnemonicRequest> {
  /**
   * Number of mnemonic words to encode the seed
   *
   * @generated from field: uint32 mnemonics_length = 1;
   */
  mnemonicsLength = 0;

  constructor(data?: PartialMessage<GenMnemonicRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.GenMnemonicRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "mnemonics_length", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenMnemonicRequest {
    return new GenMnemonicRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenMnemonicRequest {
    return new GenMnemonicRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenMnemonicRequest {
    return new GenMnemonicRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GenMnemonicRequest | PlainMessage<GenMnemonicRequest> | undefined, b: GenMnemonicRequest | PlainMessage<GenMnemonicRequest> | undefined): boolean {
    return proto3.util.equals(GenMnemonicRequest, a, b);
  }
}

/**
 * @generated from message com.mintter.daemon.v1alpha.GenMnemonicResponse
 */
export class GenMnemonicResponse extends Message<GenMnemonicResponse> {
  /**
   * The list of human-friendly words that can be used to backup the seed. These
   * words must be stored in a secret place by the user.
   *
   * @generated from field: repeated string mnemonic = 1;
   */
  mnemonic: string[] = [];

  constructor(data?: PartialMessage<GenMnemonicResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.GenMnemonicResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "mnemonic", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenMnemonicResponse {
    return new GenMnemonicResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenMnemonicResponse {
    return new GenMnemonicResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenMnemonicResponse {
    return new GenMnemonicResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GenMnemonicResponse | PlainMessage<GenMnemonicResponse> | undefined, b: GenMnemonicResponse | PlainMessage<GenMnemonicResponse> | undefined): boolean {
    return proto3.util.equals(GenMnemonicResponse, a, b);
  }
}

/**
 * @generated from message com.mintter.daemon.v1alpha.RegisterRequest
 */
export class RegisterRequest extends Message<RegisterRequest> {
  /**
   * @generated from field: repeated string mnemonic = 1;
   */
  mnemonic: string[] = [];

  /**
   * @generated from field: string passphrase = 2;
   */
  passphrase = "";

  constructor(data?: PartialMessage<RegisterRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.RegisterRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "mnemonic", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "passphrase", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegisterRequest {
    return new RegisterRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegisterRequest {
    return new RegisterRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegisterRequest {
    return new RegisterRequest().fromJsonString(jsonString, options);
  }

  static equals(a: RegisterRequest | PlainMessage<RegisterRequest> | undefined, b: RegisterRequest | PlainMessage<RegisterRequest> | undefined): boolean {
    return proto3.util.equals(RegisterRequest, a, b);
  }
}

/**
 * @generated from message com.mintter.daemon.v1alpha.RegisterResponse
 */
export class RegisterResponse extends Message<RegisterResponse> {
  /**
   * @generated from field: string account_id = 1;
   */
  accountId = "";

  constructor(data?: PartialMessage<RegisterResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.RegisterResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RegisterResponse {
    return new RegisterResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RegisterResponse {
    return new RegisterResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RegisterResponse {
    return new RegisterResponse().fromJsonString(jsonString, options);
  }

  static equals(a: RegisterResponse | PlainMessage<RegisterResponse> | undefined, b: RegisterResponse | PlainMessage<RegisterResponse> | undefined): boolean {
    return proto3.util.equals(RegisterResponse, a, b);
  }
}

/**
 * @generated from message com.mintter.daemon.v1alpha.GetInfoRequest
 */
export class GetInfoRequest extends Message<GetInfoRequest> {
  constructor(data?: PartialMessage<GetInfoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.GetInfoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetInfoRequest {
    return new GetInfoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetInfoRequest {
    return new GetInfoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetInfoRequest {
    return new GetInfoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetInfoRequest | PlainMessage<GetInfoRequest> | undefined, b: GetInfoRequest | PlainMessage<GetInfoRequest> | undefined): boolean {
    return proto3.util.equals(GetInfoRequest, a, b);
  }
}

/**
 * @generated from message com.mintter.daemon.v1alpha.ForceSyncRequest
 */
export class ForceSyncRequest extends Message<ForceSyncRequest> {
  constructor(data?: PartialMessage<ForceSyncRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.ForceSyncRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ForceSyncRequest {
    return new ForceSyncRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ForceSyncRequest {
    return new ForceSyncRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ForceSyncRequest {
    return new ForceSyncRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ForceSyncRequest | PlainMessage<ForceSyncRequest> | undefined, b: ForceSyncRequest | PlainMessage<ForceSyncRequest> | undefined): boolean {
    return proto3.util.equals(ForceSyncRequest, a, b);
  }
}

/**
 * Info is a generic information about the running node.
 *
 * @generated from message com.mintter.daemon.v1alpha.Info
 */
export class Info extends Message<Info> {
  /**
   * Account ID this node belongs to.
   *
   * @generated from field: string account_id = 1;
   */
  accountId = "";

  /**
   * Libp2p Peer ID in CID form (a.k.a. Device ID) assigned to this node.
   *
   * @generated from field: string device_id = 2;
   */
  deviceId = "";

  /**
   * Start time of the node.
   *
   * @generated from field: google.protobuf.Timestamp start_time = 3;
   */
  startTime?: Timestamp;

  constructor(data?: PartialMessage<Info>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.daemon.v1alpha.Info";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "account_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "device_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "start_time", kind: "message", T: Timestamp },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Info {
    return new Info().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Info {
    return new Info().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Info {
    return new Info().fromJsonString(jsonString, options);
  }

  static equals(a: Info | PlainMessage<Info> | undefined, b: Info | PlainMessage<Info> | undefined): boolean {
    return proto3.util.equals(Info, a, b);
  }
}

