// @generated by protoc-gen-es v1.0.0 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/changes.proto (package com.mintter.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * Request for getting change info.
 *
 * @generated from message com.mintter.documents.v1alpha.GetChangeInfoRequest
 */
export class GetChangeInfoRequest extends Message<GetChangeInfoRequest> {
  /**
   * ID of the Change.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<GetChangeInfoRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.GetChangeInfoRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetChangeInfoRequest {
    return new GetChangeInfoRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetChangeInfoRequest {
    return new GetChangeInfoRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetChangeInfoRequest {
    return new GetChangeInfoRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetChangeInfoRequest | PlainMessage<GetChangeInfoRequest> | undefined, b: GetChangeInfoRequest | PlainMessage<GetChangeInfoRequest> | undefined): boolean {
    return proto3.util.equals(GetChangeInfoRequest, a, b);
  }
}

/**
 * Request to list changes.
 *
 * @generated from message com.mintter.documents.v1alpha.ListChangesRequest
 */
export class ListChangesRequest extends Message<ListChangesRequest> {
  /**
   * Required. ID of the Mintter object to list changes for.
   *
   * @generated from field: string object_id = 1;
   */
  objectId = "";

  /**
   * Optional. Number of results per page.
   *
   * @generated from field: int32 page_size = 2;
   */
  pageSize = 0;

  /**
   * Optional. Token for the page to return.
   *
   * @generated from field: string page_token = 3;
   */
  pageToken = "";

  constructor(data?: PartialMessage<ListChangesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListChangesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "object_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListChangesRequest {
    return new ListChangesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListChangesRequest {
    return new ListChangesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListChangesRequest {
    return new ListChangesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListChangesRequest | PlainMessage<ListChangesRequest> | undefined, b: ListChangesRequest | PlainMessage<ListChangesRequest> | undefined): boolean {
    return proto3.util.equals(ListChangesRequest, a, b);
  }
}

/**
 * Response with a list of changes.
 *
 * @generated from message com.mintter.documents.v1alpha.ListChangesResponse
 */
export class ListChangesResponse extends Message<ListChangesResponse> {
  /**
   * List of changes matching the request.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.ChangeInfo changes = 1;
   */
  changes: ChangeInfo[] = [];

  /**
   * Token for the next page if there's any.
   *
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<ListChangesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListChangesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "changes", kind: "message", T: ChangeInfo, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListChangesResponse {
    return new ListChangesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListChangesResponse {
    return new ListChangesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListChangesResponse {
    return new ListChangesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListChangesResponse | PlainMessage<ListChangesResponse> | undefined, b: ListChangesResponse | PlainMessage<ListChangesResponse> | undefined): boolean {
    return proto3.util.equals(ListChangesResponse, a, b);
  }
}

/**
 * Metadata about a single Change.
 *
 * @generated from message com.mintter.documents.v1alpha.ChangeInfo
 */
export class ChangeInfo extends Message<ChangeInfo> {
  /**
   * ID of the Change.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Author of the Change.
   *
   * @generated from field: string author = 2;
   */
  author = "";

  /**
   * Time when this change was recorded by the author.
   *
   * @generated from field: google.protobuf.Timestamp create_time = 3;
   */
  createTime?: Timestamp;

  /**
   * The document version ID corresponding to this changes.
   *
   * TODO(burdiyan): after the breaking change the change ID can be used directly as version.
   *
   * @generated from field: string version = 4;
   */
  version = "";

  /**
   * IDs of other Changes that are dependencies of this Change.
   *
   * @generated from field: repeated string deps = 5;
   */
  deps: string[] = [];

  constructor(data?: PartialMessage<ChangeInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ChangeInfo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "create_time", kind: "message", T: Timestamp },
    { no: 4, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "deps", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ChangeInfo {
    return new ChangeInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ChangeInfo {
    return new ChangeInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ChangeInfo {
    return new ChangeInfo().fromJsonString(jsonString, options);
  }

  static equals(a: ChangeInfo | PlainMessage<ChangeInfo> | undefined, b: ChangeInfo | PlainMessage<ChangeInfo> | undefined): boolean {
    return proto3.util.equals(ChangeInfo, a, b);
  }
}
