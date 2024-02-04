// @generated by protoc-gen-es v1.4.1 with parameter "target=ts,import_extension=none"
// @generated from file documents/v1alpha/content_graph.proto (package com.mintter.documents.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message com.mintter.documents.v1alpha.ListCitationsRequest
 */
export class ListCitationsRequest extends Message<ListCitationsRequest> {
  /**
   * Required. Document ID for which citations need to be retrieved.
   *
   * @generated from field: string document_id = 1;
   */
  documentId = "";

  constructor(data?: PartialMessage<ListCitationsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListCitationsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "document_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListCitationsRequest {
    return new ListCitationsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListCitationsRequest {
    return new ListCitationsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListCitationsRequest {
    return new ListCitationsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListCitationsRequest | PlainMessage<ListCitationsRequest> | undefined, b: ListCitationsRequest | PlainMessage<ListCitationsRequest> | undefined): boolean {
    return proto3.util.equals(ListCitationsRequest, a, b);
  }
}

/**
 * Response with citations.
 *
 * @generated from message com.mintter.documents.v1alpha.ListCitationsResponse
 */
export class ListCitationsResponse extends Message<ListCitationsResponse> {
  /**
   * List of links that point to the requested document, recursively, according to the requested depth.
   *
   * @generated from field: repeated com.mintter.documents.v1alpha.Link links = 1;
   */
  links: Link[] = [];

  constructor(data?: PartialMessage<ListCitationsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.ListCitationsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "links", kind: "message", T: Link, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListCitationsResponse {
    return new ListCitationsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListCitationsResponse {
    return new ListCitationsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListCitationsResponse {
    return new ListCitationsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListCitationsResponse | PlainMessage<ListCitationsResponse> | undefined, b: ListCitationsResponse | PlainMessage<ListCitationsResponse> | undefined): boolean {
    return proto3.util.equals(ListCitationsResponse, a, b);
  }
}

/**
 * Description of a link inside a document.
 *
 * @generated from message com.mintter.documents.v1alpha.Link
 */
export class Link extends Message<Link> {
  /**
   * Required. Describes where link originates from.
   *
   * @generated from field: com.mintter.documents.v1alpha.LinkNode source = 1;
   */
  source?: LinkNode;

  /**
   * Required. Describes where link points to.
   * Here the block_id is optional, because the whole document can be linked.
   *
   * @generated from field: com.mintter.documents.v1alpha.LinkNode target = 2;
   */
  target?: LinkNode;

  /**
   * Indicates whether the link targets the latest version of the document.
   * Notice that the target link node might still have a version specified,
   * which has to be treated as a frame of reference, i.e. "this version or newer"
   * if is_latest is true.
   *
   * @generated from field: bool is_latest = 3;
   */
  isLatest = false;

  constructor(data?: PartialMessage<Link>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.Link";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "source", kind: "message", T: LinkNode },
    { no: 2, name: "target", kind: "message", T: LinkNode },
    { no: 3, name: "is_latest", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Link {
    return new Link().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Link {
    return new Link().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Link {
    return new Link().fromJsonString(jsonString, options);
  }

  static equals(a: Link | PlainMessage<Link> | undefined, b: Link | PlainMessage<Link> | undefined): boolean {
    return proto3.util.equals(Link, a, b);
  }
}

/**
 * Describes "sides" of a Link.
 *
 * @generated from message com.mintter.documents.v1alpha.LinkNode
 */
export class LinkNode extends Message<LinkNode> {
  /**
   * ID of the document on one side of a Link.
   *
   * @generated from field: string document_id = 1;
   */
  documentId = "";

  /**
   * Version of the document.
   *
   * @generated from field: string version = 2;
   */
  version = "";

  /**
   * ID of the block inside the document.
   *
   * @generated from field: string block_id = 3;
   */
  blockId = "";

  constructor(data?: PartialMessage<LinkNode>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.documents.v1alpha.LinkNode";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "document_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "block_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LinkNode {
    return new LinkNode().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LinkNode {
    return new LinkNode().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LinkNode {
    return new LinkNode().fromJsonString(jsonString, options);
  }

  static equals(a: LinkNode | PlainMessage<LinkNode> | undefined, b: LinkNode | PlainMessage<LinkNode> | undefined): boolean {
    return proto3.util.equals(LinkNode, a, b);
  }
}

