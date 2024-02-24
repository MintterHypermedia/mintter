// @generated by protoc-gen-es v1.4.1 with parameter "target=ts,import_extension=none"
// @generated from file entities/v1alpha/entities.proto (package com.mintter.entities.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

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
   * IDs of other changes that depend on this change.
   *
   * @generated from field: repeated string children = 6;
   */
  children: string[] = [];

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
    { no: 6, name: "children", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
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
   * Account ID of the owner of the entity.
   *
   * @generated from field: string owner = 2;
   */
  owner = "";

  /**
   * The set of changes for the entity keyed by change ID.
   *
   * @generated from field: map<string, com.mintter.entities.v1alpha.Change> changes = 3;
   */
  changes: { [key: string]: Change } = {};

  /**
   * The sorted list of change IDs by time.
   *
   * @generated from field: repeated string changes_by_time = 4;
   */
  changesByTime: string[] = [];

  /**
   * The set of changes that has no dependencies.
   * Normally there should only be one root,
   * but just in case it's defined as a list.
   *
   * @generated from field: repeated string roots = 5;
   */
  roots: string[] = [];

  /**
   * The set of leaf changes considering the entire DAG.
   *
   * @generated from field: repeated string heads = 6;
   */
  heads: string[] = [];

  /**
   * The set of author versions/variants sorted by timestamp.
   *
   * @generated from field: repeated com.mintter.entities.v1alpha.AuthorVersion author_versions = 7;
   */
  authorVersions: AuthorVersion[] = [];

  constructor(data?: PartialMessage<EntityTimeline>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.EntityTimeline";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "owner", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "changes", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: Change} },
    { no: 4, name: "changes_by_time", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "roots", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "heads", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 7, name: "author_versions", kind: "message", T: AuthorVersion, repeated: true },
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

/**
 * Set of heads from a given author.
 *
 * @generated from message com.mintter.entities.v1alpha.AuthorVersion
 */
export class AuthorVersion extends Message<AuthorVersion> {
  /**
   * Account ID of the author.
   *
   * @generated from field: string author = 1;
   */
  author = "";

  /**
   * The set of leaf changes from that author.
   *
   * @generated from field: repeated string heads = 2;
   */
  heads: string[] = [];

  /**
   * The version string corresponding to the author's variant.
   * I.e. same as heads but concatenated with a '.' delimiter.
   *
   * @generated from field: string version = 3;
   */
  version = "";

  /**
   * The timestamp of the author's version.
   * For compound versions the greatest timestamp is used.
   *
   * @generated from field: google.protobuf.Timestamp version_time = 4;
   */
  versionTime?: Timestamp;

  constructor(data?: PartialMessage<AuthorVersion>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.AuthorVersion";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "heads", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 3, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "version_time", kind: "message", T: Timestamp },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AuthorVersion {
    return new AuthorVersion().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AuthorVersion {
    return new AuthorVersion().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AuthorVersion {
    return new AuthorVersion().fromJsonString(jsonString, options);
  }

  static equals(a: AuthorVersion | PlainMessage<AuthorVersion> | undefined, b: AuthorVersion | PlainMessage<AuthorVersion> | undefined): boolean {
    return proto3.util.equals(AuthorVersion, a, b);
  }
}

/**
 * A change to an entity.
 *
 * @generated from message com.mintter.entities.v1alpha.Entity
 */
export class Entity extends Message<Entity> {
  /**
   * EID of the entity.
   *
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * Title of the entity, depending on the type:
   * Alias in the case of account. 
   * Title in the case of groups and documents 
   * Empty in the case of comments.
   *
   * @generated from field: string title = 2;
   */
  title = "";

  /**
   * The owner of the entity
   *
   * @generated from field: string owner = 3;
   */
  owner = "";

  constructor(data?: PartialMessage<Entity>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.Entity";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "owner", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Entity {
    return new Entity().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Entity {
    return new Entity().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Entity {
    return new Entity().fromJsonString(jsonString, options);
  }

  static equals(a: Entity | PlainMessage<Entity> | undefined, b: Entity | PlainMessage<Entity> | undefined): boolean {
    return proto3.util.equals(Entity, a, b);
  }
}

/**
 * Request to 
 *
 * @generated from message com.mintter.entities.v1alpha.SearchEntitiesRequest
 */
export class SearchEntitiesRequest extends Message<SearchEntitiesRequest> {
  /**
   * Query to find. Since we use 
   * Fuzzy search, a single query may return multiple 
   * entities.
   *
   * @generated from field: string query = 1;
   */
  query = "";

  constructor(data?: PartialMessage<SearchEntitiesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.SearchEntitiesRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "query", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchEntitiesRequest {
    return new SearchEntitiesRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchEntitiesRequest {
    return new SearchEntitiesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchEntitiesRequest {
    return new SearchEntitiesRequest().fromJsonString(jsonString, options);
  }

  static equals(a: SearchEntitiesRequest | PlainMessage<SearchEntitiesRequest> | undefined, b: SearchEntitiesRequest | PlainMessage<SearchEntitiesRequest> | undefined): boolean {
    return proto3.util.equals(SearchEntitiesRequest, a, b);
  }
}

/**
 * A list of entities matching the request. 
 *
 * @generated from message com.mintter.entities.v1alpha.SearchEntitiesResponse
 */
export class SearchEntitiesResponse extends Message<SearchEntitiesResponse> {
  /**
   * Entities matching the input title
   *
   * @generated from field: repeated com.mintter.entities.v1alpha.Entity entities = 1;
   */
  entities: Entity[] = [];

  /**
   * Token for the next page if there's any.
   *
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<SearchEntitiesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.entities.v1alpha.SearchEntitiesResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "entities", kind: "message", T: Entity, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SearchEntitiesResponse {
    return new SearchEntitiesResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SearchEntitiesResponse {
    return new SearchEntitiesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SearchEntitiesResponse {
    return new SearchEntitiesResponse().fromJsonString(jsonString, options);
  }

  static equals(a: SearchEntitiesResponse | PlainMessage<SearchEntitiesResponse> | undefined, b: SearchEntitiesResponse | PlainMessage<SearchEntitiesResponse> | undefined): boolean {
    return proto3.util.equals(SearchEntitiesResponse, a, b);
  }
}

