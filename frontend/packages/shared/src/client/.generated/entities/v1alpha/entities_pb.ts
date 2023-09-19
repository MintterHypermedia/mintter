// @generated by protoc-gen-es v1.3.1 with parameter "target=ts,import_extension=none"
// @generated from file entities/v1alpha/entities.proto (package com.mintter.entities.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, Timestamp, proto3 } from "@bufbuild/protobuf";

/**
 * Request to get a change by ID.
 *
 * @generated from message com.mintter.entities.v1alpha.GetChangeRequest
 */
export class GetChangeRequest extends Message<GetChangeRequest> {
  /**
   * ID of the change.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<GetChangeRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.GetChangeRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetChangeRequest {
    return new GetChangeRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetChangeRequest {
    return new GetChangeRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetChangeRequest {
    return new GetChangeRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetChangeRequest | PlainMessage<GetChangeRequest> | undefined, b: GetChangeRequest | PlainMessage<GetChangeRequest> | undefined): boolean {
    return proto3.util.equals(GetChangeRequest, a, b);
  }
}

/**
 * Request to get the timeline of an entity.
 *
 * @generated from message com.mintter.entities.v1alpha.GetEntityTimelineRequest
 */
export class GetEntityTimelineRequest extends Message<GetEntityTimelineRequest> {
  /**
   * The entity ID to get the timeline for.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<GetEntityTimelineRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.GetEntityTimelineRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetEntityTimelineRequest {
    return new GetEntityTimelineRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetEntityTimelineRequest {
    return new GetEntityTimelineRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetEntityTimelineRequest {
    return new GetEntityTimelineRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetEntityTimelineRequest | PlainMessage<GetEntityTimelineRequest> | undefined, b: GetEntityTimelineRequest | PlainMessage<GetEntityTimelineRequest> | undefined): boolean {
    return proto3.util.equals(GetEntityTimelineRequest, a, b);
  }
}

/**
 * Request to discover an entity.
 *
 * @generated from message com.mintter.entities.v1alpha.DiscoverEntityRequest
 */
export class DiscoverEntityRequest extends Message<DiscoverEntityRequest> {
  /**
   * Required. The entity ID to discover.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Optional. Version of the entity to discover.
   *
   * @generated from field: string version = 2;
   */
  version = "";

  constructor(data?: PartialMessage<DiscoverEntityRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.DiscoverEntityRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DiscoverEntityRequest {
    return new DiscoverEntityRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DiscoverEntityRequest {
    return new DiscoverEntityRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DiscoverEntityRequest {
    return new DiscoverEntityRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DiscoverEntityRequest | PlainMessage<DiscoverEntityRequest> | undefined, b: DiscoverEntityRequest | PlainMessage<DiscoverEntityRequest> | undefined): boolean {
    return proto3.util.equals(DiscoverEntityRequest, a, b);
  }
}

/**
 * Response to discover an entity.
 *
 * TODO(burdiyan): add summary of the discovery process.
 * Or maybe even make this call streaming?
 *
 * @generated from message com.mintter.entities.v1alpha.DiscoverEntityResponse
 */
export class DiscoverEntityResponse extends Message<DiscoverEntityResponse> {
  constructor(data?: PartialMessage<DiscoverEntityResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.DiscoverEntityResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DiscoverEntityResponse {
    return new DiscoverEntityResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DiscoverEntityResponse {
    return new DiscoverEntityResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DiscoverEntityResponse {
    return new DiscoverEntityResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DiscoverEntityResponse | PlainMessage<DiscoverEntityResponse> | undefined, b: DiscoverEntityResponse | PlainMessage<DiscoverEntityResponse> | undefined): boolean {
    return proto3.util.equals(DiscoverEntityResponse, a, b);
  }
}

/**
 * A change to an entity.
 *
 * @generated from message com.mintter.entities.v1alpha.Change
 */
export class Change extends Message<Change> {
  /**
   * ID of the change.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Author of the change.
   *
   * @generated from field: string author = 2;
   */
  author = "";

  /**
   * Timestamp when the change was created.
   *
   * @generated from field: google.protobuf.Timestamp create_time = 3;
   */
  createTime?: Timestamp;

  /**
   * IDs of other changes this change depends on.
   *
   * @generated from field: repeated string deps = 4;
   */
  deps: string[] = [];

  /**
   * Indicates whether this changes comes from a trusted peer of ours.
   *
   * @generated from field: bool is_trusted = 5;
   */
  isTrusted = false;

  constructor(data?: PartialMessage<Change>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.Change";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "create_time", kind: "message", T: Timestamp },
    { no: 4, name: "deps", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "is_trusted", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Change {
    return new Change().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Change {
    return new Change().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Change {
    return new Change().fromJsonString(jsonString, options);
  }

  static equals(a: Change | PlainMessage<Change> | undefined, b: Change | PlainMessage<Change> | undefined): boolean {
    return proto3.util.equals(Change, a, b);
  }
}

/**
 * The timeline of an entity.
 *
 * @generated from message com.mintter.entities.v1alpha.EntityTimeline
 */
export class EntityTimeline extends Message<EntityTimeline> {
  /**
   * The ID of the entity.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * The set of changes for the entity keyed by change ID.
   *
   * @generated from field: map<string, com.mintter.entities.v1alpha.Change> changes = 2;
   */
  changes: { [key: string]: Change } = {};

  /**
   * The sorted list of change IDs by time.
   *
   * @generated from field: repeated string changes_by_time = 3;
   */
  changesByTime: string[] = [];

  /**
   * The latest version of the entity we know about.
   *
   * @generated from field: string latest_public_version = 4;
   */
  latestPublicVersion = "";

  /**
   * The latest version of the entity from our trusted peers.
   *
   * @generated from field: string latest_trusted_version = 5;
   */
  latestTrustedVersion = "";

  constructor(data?: PartialMessage<EntityTimeline>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.EntityTimeline";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "changes", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Change} },
    { no: 3, name: "changes_by_time", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 4, name: "latest_public_version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "latest_trusted_version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EntityTimeline {
    return new EntityTimeline().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EntityTimeline {
    return new EntityTimeline().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EntityTimeline {
    return new EntityTimeline().fromJsonString(jsonString, options);
  }

  static equals(a: EntityTimeline | PlainMessage<EntityTimeline> | undefined, b: EntityTimeline | PlainMessage<EntityTimeline> | undefined): boolean {
    return proto3.util.equals(EntityTimeline, a, b);
  }
}

