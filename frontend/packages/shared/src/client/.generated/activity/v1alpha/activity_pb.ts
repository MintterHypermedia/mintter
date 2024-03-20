// @generated by protoc-gen-es v1.4.1 with parameter "target=ts,import_extension=none"
// @generated from file activity/v1alpha/activity.proto (package com.mintter.activity.v1alpha, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * The request to list the events.
 *
 * @generated from message com.mintter.activity.v1alpha.ListEventsRequest
 */
export class ListEventsRequest extends Message<ListEventsRequest> {
  /**
   * Optional. The size of the page. The default is defined by the server.
   *
   * @generated from field: int32 page_size = 1;
   */
  pageSize = 0;

  /**
   * Optional. The page token for requesting next pages.
   *
   * @generated from field: string page_token = 2;
   */
  pageToken = "";

  /**
   * Optional. If we want events from trusted peers only. All peers by default.
   *
   * @generated from field: bool trusted_only = 3;
   */
  trustedOnly = false;

  /**
   * Optional. If we want events only from specific user accounts. Multiple 
   * accounts are filtered following OR logic.
   *
   * @generated from field: repeated string filter_users = 4;
   */
  filterUsers: string[] = [];

  /**
   * Optional. If we want certain types of events.
   * Some of the currently supported event types are:
   *   - KeyDelegation
   *   - Change
   *   - Comment
   *   - DagPB 
   * Multiple types are filtered following OR logic.
   *
   * @generated from field: repeated string filter_event_type = 5;
   */
  filterEventType: string[] = [];

  /**
   * Optional. If we want events only from specific resource IDs
   *
   *
   * @generated from field: repeated string filter_resource = 6;
   */
  filterResource: string[] = [];

  constructor(data?: PartialMessage<ListEventsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.activity.v1alpha.ListEventsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "page_size", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "trusted_only", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "filter_users", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 5, name: "filter_event_type", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "filter_resource", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEventsRequest {
    return new ListEventsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEventsRequest {
    return new ListEventsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEventsRequest {
    return new ListEventsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ListEventsRequest | PlainMessage<ListEventsRequest> | undefined, b: ListEventsRequest | PlainMessage<ListEventsRequest> | undefined): boolean {
    return proto3.util.equals(ListEventsRequest, a, b);
  }
}

/**
 * The response with the list of events.
 *
 * @generated from message com.mintter.activity.v1alpha.ListEventsResponse
 */
export class ListEventsResponse extends Message<ListEventsResponse> {
  /**
   * The list of events.
   *
   * @generated from field: repeated com.mintter.activity.v1alpha.Event events = 1;
   */
  events: Event[] = [];

  /**
   * The token to request the next page.
   *
   * @generated from field: string next_page_token = 2;
   */
  nextPageToken = "";

  constructor(data?: PartialMessage<ListEventsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.activity.v1alpha.ListEventsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "events", kind: "message", T: Event, repeated: true },
    { no: 2, name: "next_page_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ListEventsResponse {
    return new ListEventsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ListEventsResponse {
    return new ListEventsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ListEventsResponse {
    return new ListEventsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ListEventsResponse | PlainMessage<ListEventsResponse> | undefined, b: ListEventsResponse | PlainMessage<ListEventsResponse> | undefined): boolean {
    return proto3.util.equals(ListEventsResponse, a, b);
  }
}

/**
 * Description of the event occurred in the system.
 *
 * @generated from message com.mintter.activity.v1alpha.Event
 */
export class Event extends Message<Event> {
  /**
   * Union type of different event types.
   * Eventually we'll have more event types.
   *
   * @generated from oneof com.mintter.activity.v1alpha.Event.data
   */
  data: {
    /**
     * Event type describing the appearance of a new blob in the system.
     *
     * @generated from field: com.mintter.activity.v1alpha.NewBlobEvent new_blob = 1;
     */
    value: NewBlobEvent;
    case: "newBlob";
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * The ID of the user account that has caused the event.
   *
   * @generated from field: string account = 2;
   */
  account = "";

  /**
   * Timestamp of the event as per the event itself.
   *
   * @generated from field: google.protobuf.Timestamp event_time = 3;
   */
  eventTime?: Timestamp;

  /**
   * Locally perceived time of the event.
   * I.e. time when we have received the event on our machine.
   *
   * @generated from field: google.protobuf.Timestamp observe_time = 4;
   */
  observeTime?: Timestamp;

  constructor(data?: PartialMessage<Event>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.activity.v1alpha.Event";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "new_blob", kind: "message", T: NewBlobEvent, oneof: "data" },
    { no: 2, name: "account", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "event_time", kind: "message", T: Timestamp },
    { no: 4, name: "observe_time", kind: "message", T: Timestamp },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Event {
    return new Event().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Event {
    return new Event().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Event {
    return new Event().fromJsonString(jsonString, options);
  }

  static equals(a: Event | PlainMessage<Event> | undefined, b: Event | PlainMessage<Event> | undefined): boolean {
    return proto3.util.equals(Event, a, b);
  }
}

/**
 * The event describing the
 *
 * @generated from message com.mintter.activity.v1alpha.NewBlobEvent
 */
export class NewBlobEvent extends Message<NewBlobEvent> {
  /**
   * The CID of the blob that was created.
   *
   * @generated from field: string cid = 1;
   */
  cid = "";

  /**
   * The type of the blob that was created.
   * Defined as string for extensibility.
   * Some of the currently supported blob types are:
   *   - KeyDelegation
   *   - Change
   *   - Comment
   *   - DagPB
   *
   * @generated from field: string blob_type = 2;
   */
  blobType = "";

  /**
   * The user account ID that has created the blob.
   *
   * @generated from field: string author = 3;
   */
  author = "";

  /**
   * The resource ID that the blob is related to.
   *
   * @generated from field: string resource = 4;
   */
  resource = "";

  constructor(data?: PartialMessage<NewBlobEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "com.mintter.activity.v1alpha.NewBlobEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "cid", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "blob_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "resource", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NewBlobEvent {
    return new NewBlobEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NewBlobEvent {
    return new NewBlobEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NewBlobEvent {
    return new NewBlobEvent().fromJsonString(jsonString, options);
  }

  static equals(a: NewBlobEvent | PlainMessage<NewBlobEvent> | undefined, b: NewBlobEvent | PlainMessage<NewBlobEvent> | undefined): boolean {
    return proto3.util.equals(NewBlobEvent, a, b);
  }
}

