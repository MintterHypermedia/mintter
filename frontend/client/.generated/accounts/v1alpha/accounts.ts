// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
//@ts-nocheck
/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export interface GetAccountRequest {
  /** ID of the Account to be looked up. If empty - our own account will be returned. */
  id: string;
}

export interface ListAccountsRequest {
  pageSize: number;
  pageToken: string;
}

export interface ListAccountsResponse {
  accounts: Account[];
  nextPageToken: string;
}

export interface Account {
  /** Mintter Account ID. */
  id: string;
  /** Profile information of this account. */
  profile: Profile | undefined;
  /** List of known devices of this Account. */
  devices: { [key: string]: Device };
}

export interface Account_DevicesEntry {
  key: string;
  value: Device | undefined;
}

export interface Profile {
  alias: string;
  bio: string;
  email: string;
}

export interface Device {
  /** CID-encoded Peer ID of this device. */
  peerId: string;
}

const baseGetAccountRequest: object = { id: "" };

export const GetAccountRequest = {
  encode(
    message: GetAccountRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAccountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetAccountRequest } as GetAccountRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAccountRequest {
    const message = { ...baseGetAccountRequest } as GetAccountRequest;
    message.id =
      object.id !== undefined && object.id !== null ? String(object.id) : "";
    return message;
  },

  toJSON(message: GetAccountRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAccountRequest>, I>>(
    object: I
  ): GetAccountRequest {
    const message = { ...baseGetAccountRequest } as GetAccountRequest;
    message.id = object.id ?? "";
    return message;
  },
};

const baseListAccountsRequest: object = { pageSize: 0, pageToken: "" };

export const ListAccountsRequest = {
  encode(
    message: ListAccountsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pageSize !== 0) {
      writer.uint32(8).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(18).string(message.pageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListAccountsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pageSize = reader.int32();
          break;
        case 2:
          message.pageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListAccountsRequest {
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    message.pageSize =
      object.pageSize !== undefined && object.pageSize !== null
        ? Number(object.pageSize)
        : 0;
    message.pageToken =
      object.pageToken !== undefined && object.pageToken !== null
        ? String(object.pageToken)
        : "";
    return message;
  },

  toJSON(message: ListAccountsRequest): unknown {
    const obj: any = {};
    message.pageSize !== undefined && (obj.pageSize = message.pageSize);
    message.pageToken !== undefined && (obj.pageToken = message.pageToken);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListAccountsRequest>, I>>(
    object: I
  ): ListAccountsRequest {
    const message = { ...baseListAccountsRequest } as ListAccountsRequest;
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

const baseListAccountsResponse: object = { nextPageToken: "" };

export const ListAccountsResponse = {
  encode(
    message: ListAccountsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.accounts) {
      Account.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ListAccountsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accounts.push(Account.decode(reader, reader.uint32()));
          break;
        case 2:
          message.nextPageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListAccountsResponse {
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts = (object.accounts ?? []).map((e: any) =>
      Account.fromJSON(e)
    );
    message.nextPageToken =
      object.nextPageToken !== undefined && object.nextPageToken !== null
        ? String(object.nextPageToken)
        : "";
    return message;
  },

  toJSON(message: ListAccountsResponse): unknown {
    const obj: any = {};
    if (message.accounts) {
      obj.accounts = message.accounts.map((e) =>
        e ? Account.toJSON(e) : undefined
      );
    } else {
      obj.accounts = [];
    }
    message.nextPageToken !== undefined &&
      (obj.nextPageToken = message.nextPageToken);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListAccountsResponse>, I>>(
    object: I
  ): ListAccountsResponse {
    const message = { ...baseListAccountsResponse } as ListAccountsResponse;
    message.accounts =
      object.accounts?.map((e) => Account.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

const baseAccount: object = { id: "" };

export const Account = {
  encode(
    message: Account,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.profile !== undefined) {
      Profile.encode(message.profile, writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.devices).forEach(([key, value]) => {
      Account_DevicesEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Account {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAccount } as Account;
    message.devices = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.profile = Profile.decode(reader, reader.uint32());
          break;
        case 3:
          const entry3 = Account_DevicesEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.devices[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Account {
    const message = { ...baseAccount } as Account;
    message.id =
      object.id !== undefined && object.id !== null ? String(object.id) : "";
    message.profile =
      object.profile !== undefined && object.profile !== null
        ? Profile.fromJSON(object.profile)
        : undefined;
    message.devices = Object.entries(object.devices ?? {}).reduce<{
      [key: string]: Device;
    }>((acc, [key, value]) => {
      acc[key] = Device.fromJSON(value);
      return acc;
    }, {});
    return message;
  },

  toJSON(message: Account): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.profile !== undefined &&
      (obj.profile = message.profile
        ? Profile.toJSON(message.profile)
        : undefined);
    obj.devices = {};
    if (message.devices) {
      Object.entries(message.devices).forEach(([k, v]) => {
        obj.devices[k] = Device.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Account>, I>>(object: I): Account {
    const message = { ...baseAccount } as Account;
    message.id = object.id ?? "";
    message.profile =
      object.profile !== undefined && object.profile !== null
        ? Profile.fromPartial(object.profile)
        : undefined;
    message.devices = Object.entries(object.devices ?? {}).reduce<{
      [key: string]: Device;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Device.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

const baseAccount_DevicesEntry: object = { key: "" };

export const Account_DevicesEntry = {
  encode(
    message: Account_DevicesEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Device.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): Account_DevicesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAccount_DevicesEntry } as Account_DevicesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = Device.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Account_DevicesEntry {
    const message = { ...baseAccount_DevicesEntry } as Account_DevicesEntry;
    message.key =
      object.key !== undefined && object.key !== null ? String(object.key) : "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Device.fromJSON(object.value)
        : undefined;
    return message;
  },

  toJSON(message: Account_DevicesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Device.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Account_DevicesEntry>, I>>(
    object: I
  ): Account_DevicesEntry {
    const message = { ...baseAccount_DevicesEntry } as Account_DevicesEntry;
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? Device.fromPartial(object.value)
        : undefined;
    return message;
  },
};

const baseProfile: object = { alias: "", bio: "", email: "" };

export const Profile = {
  encode(
    message: Profile,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.alias !== "") {
      writer.uint32(10).string(message.alias);
    }
    if (message.bio !== "") {
      writer.uint32(18).string(message.bio);
    }
    if (message.email !== "") {
      writer.uint32(26).string(message.email);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Profile {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProfile } as Profile;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.alias = reader.string();
          break;
        case 2:
          message.bio = reader.string();
          break;
        case 3:
          message.email = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Profile {
    const message = { ...baseProfile } as Profile;
    message.alias =
      object.alias !== undefined && object.alias !== null
        ? String(object.alias)
        : "";
    message.bio =
      object.bio !== undefined && object.bio !== null ? String(object.bio) : "";
    message.email =
      object.email !== undefined && object.email !== null
        ? String(object.email)
        : "";
    return message;
  },

  toJSON(message: Profile): unknown {
    const obj: any = {};
    message.alias !== undefined && (obj.alias = message.alias);
    message.bio !== undefined && (obj.bio = message.bio);
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Profile>, I>>(object: I): Profile {
    const message = { ...baseProfile } as Profile;
    message.alias = object.alias ?? "";
    message.bio = object.bio ?? "";
    message.email = object.email ?? "";
    return message;
  },
};

const baseDevice: object = { peerId: "" };

export const Device = {
  encode(
    message: Device,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.peerId !== "") {
      writer.uint32(10).string(message.peerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Device {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDevice } as Device;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.peerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Device {
    const message = { ...baseDevice } as Device;
    message.peerId =
      object.peerId !== undefined && object.peerId !== null
        ? String(object.peerId)
        : "";
    return message;
  },

  toJSON(message: Device): unknown {
    const obj: any = {};
    message.peerId !== undefined && (obj.peerId = message.peerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Device>, I>>(object: I): Device {
    const message = { ...baseDevice } as Device;
    message.peerId = object.peerId ?? "";
    return message;
  },
};

/** Accounts API service. */
export interface Accounts {
  /**
   * Lookup an Account information across the already known accounts.
   * Can also be used to retrieve our own account.
   */
  getAccount(
    request: DeepPartial<GetAccountRequest>,
    metadata?: grpc.Metadata
  ): Promise<Account>;
  /** Update Profile information of our own Account. */
  updateProfile(
    request: DeepPartial<Profile>,
    metadata?: grpc.Metadata
  ): Promise<Account>;
  /**
   * List accounts known to the backend (excluding our own account). New accounts can be discovered naturally by
   * interacting with the network, or users can ask to discover specific accounts using
   * the Networking API.
   */
  listAccounts(
    request: DeepPartial<ListAccountsRequest>,
    metadata?: grpc.Metadata
  ): Promise<ListAccountsResponse>;
}

export class AccountsClientImpl implements Accounts {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.getAccount = this.getAccount.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.listAccounts = this.listAccounts.bind(this);
  }

  getAccount(
    request: DeepPartial<GetAccountRequest>,
    metadata?: grpc.Metadata
  ): Promise<Account> {
    return this.rpc.unary(
      AccountsGetAccountDesc,
      GetAccountRequest.fromPartial(request),
      metadata
    );
  }

  updateProfile(
    request: DeepPartial<Profile>,
    metadata?: grpc.Metadata
  ): Promise<Account> {
    return this.rpc.unary(
      AccountsUpdateProfileDesc,
      Profile.fromPartial(request),
      metadata
    );
  }

  listAccounts(
    request: DeepPartial<ListAccountsRequest>,
    metadata?: grpc.Metadata
  ): Promise<ListAccountsResponse> {
    return this.rpc.unary(
      AccountsListAccountsDesc,
      ListAccountsRequest.fromPartial(request),
      metadata
    );
  }
}

export const AccountsDesc = {
  serviceName: "com.mintter.accounts.v1alpha.Accounts",
};

export const AccountsGetAccountDesc: UnaryMethodDefinitionish = {
  methodName: "GetAccount",
  service: AccountsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAccountRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Account.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const AccountsUpdateProfileDesc: UnaryMethodDefinitionish = {
  methodName: "UpdateProfile",
  service: AccountsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return Profile.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Account.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const AccountsListAccountsDesc: UnaryMethodDefinitionish = {
  methodName: "ListAccounts",
  service: AccountsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ListAccountsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ListAccountsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
          ...this.options?.metadata.headersMap,
          ...metadata?.headersMap,
        })
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
    Exclude<keyof I, KeysOfUnion<P>>,
    never
  >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
