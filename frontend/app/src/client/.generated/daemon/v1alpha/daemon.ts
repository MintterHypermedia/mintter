// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
//@ts-nocheck
/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";
import { Empty } from "../../google/protobuf/empty";
import { Timestamp } from "../../google/protobuf/timestamp";

export interface GenMnemonicRequest {
  /** Number of mnemonic words to encode the seed */
  mnemonicsLength: number;
}

export interface GenMnemonicResponse {
  /**
   * The list of human-friendly words that can be used to backup the seed. These
   * words must be stored in a secret place by the user.
   */
  mnemonic: string[];
}

export interface RegisterRequest {
  mnemonic: string[];
  passphrase: string;
}

export interface RegisterResponse {
  accountId: string;
}

export interface GetInfoRequest {
}

export interface ForceSyncRequest {
}

/** Info is a generic information about the running node. */
export interface Info {
  /** Account ID this node belongs to. */
  accountId: string;
  /** Peer ID assigned to this node. */
  peerId: string;
  /** Start time of the node. */
  startTime: Date | undefined;
}

function createBaseGenMnemonicRequest(): GenMnemonicRequest {
  return { mnemonicsLength: 0 };
}

export const GenMnemonicRequest = {
  encode(message: GenMnemonicRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mnemonicsLength !== 0) {
      writer.uint32(8).uint32(message.mnemonicsLength);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenMnemonicRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenMnemonicRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mnemonicsLength = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenMnemonicRequest {
    return { mnemonicsLength: isSet(object.mnemonicsLength) ? Number(object.mnemonicsLength) : 0 };
  },

  toJSON(message: GenMnemonicRequest): unknown {
    const obj: any = {};
    message.mnemonicsLength !== undefined && (obj.mnemonicsLength = Math.round(message.mnemonicsLength));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenMnemonicRequest>, I>>(object: I): GenMnemonicRequest {
    const message = createBaseGenMnemonicRequest();
    message.mnemonicsLength = object.mnemonicsLength ?? 0;
    return message;
  },
};

function createBaseGenMnemonicResponse(): GenMnemonicResponse {
  return { mnemonic: [] };
}

export const GenMnemonicResponse = {
  encode(message: GenMnemonicResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.mnemonic) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenMnemonicResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenMnemonicResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mnemonic.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenMnemonicResponse {
    return { mnemonic: Array.isArray(object?.mnemonic) ? object.mnemonic.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GenMnemonicResponse): unknown {
    const obj: any = {};
    if (message.mnemonic) {
      obj.mnemonic = message.mnemonic.map((e) => e);
    } else {
      obj.mnemonic = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenMnemonicResponse>, I>>(object: I): GenMnemonicResponse {
    const message = createBaseGenMnemonicResponse();
    message.mnemonic = object.mnemonic?.map((e) => e) || [];
    return message;
  },
};

function createBaseRegisterRequest(): RegisterRequest {
  return { mnemonic: [], passphrase: "" };
}

export const RegisterRequest = {
  encode(message: RegisterRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.mnemonic) {
      writer.uint32(10).string(v!);
    }
    if (message.passphrase !== "") {
      writer.uint32(18).string(message.passphrase);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mnemonic.push(reader.string());
          break;
        case 2:
          message.passphrase = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterRequest {
    return {
      mnemonic: Array.isArray(object?.mnemonic) ? object.mnemonic.map((e: any) => String(e)) : [],
      passphrase: isSet(object.passphrase) ? String(object.passphrase) : "",
    };
  },

  toJSON(message: RegisterRequest): unknown {
    const obj: any = {};
    if (message.mnemonic) {
      obj.mnemonic = message.mnemonic.map((e) => e);
    } else {
      obj.mnemonic = [];
    }
    message.passphrase !== undefined && (obj.passphrase = message.passphrase);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RegisterRequest>, I>>(object: I): RegisterRequest {
    const message = createBaseRegisterRequest();
    message.mnemonic = object.mnemonic?.map((e) => e) || [];
    message.passphrase = object.passphrase ?? "";
    return message;
  },
};

function createBaseRegisterResponse(): RegisterResponse {
  return { accountId: "" };
}

export const RegisterResponse = {
  encode(message: RegisterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterResponse {
    return { accountId: isSet(object.accountId) ? String(object.accountId) : "" };
  },

  toJSON(message: RegisterResponse): unknown {
    const obj: any = {};
    message.accountId !== undefined && (obj.accountId = message.accountId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RegisterResponse>, I>>(object: I): RegisterResponse {
    const message = createBaseRegisterResponse();
    message.accountId = object.accountId ?? "";
    return message;
  },
};

function createBaseGetInfoRequest(): GetInfoRequest {
  return {};
}

export const GetInfoRequest = {
  encode(_: GetInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInfoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetInfoRequest {
    return {};
  },

  toJSON(_: GetInfoRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInfoRequest>, I>>(_: I): GetInfoRequest {
    const message = createBaseGetInfoRequest();
    return message;
  },
};

function createBaseForceSyncRequest(): ForceSyncRequest {
  return {};
}

export const ForceSyncRequest = {
  encode(_: ForceSyncRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ForceSyncRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseForceSyncRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ForceSyncRequest {
    return {};
  },

  toJSON(_: ForceSyncRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ForceSyncRequest>, I>>(_: I): ForceSyncRequest {
    const message = createBaseForceSyncRequest();
    return message;
  },
};

function createBaseInfo(): Info {
  return { accountId: "", peerId: "", startTime: undefined };
}

export const Info = {
  encode(message: Info, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    if (message.peerId !== "") {
      writer.uint32(18).string(message.peerId);
    }
    if (message.startTime !== undefined) {
      Timestamp.encode(toTimestamp(message.startTime), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Info {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        case 2:
          message.peerId = reader.string();
          break;
        case 3:
          message.startTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Info {
    return {
      accountId: isSet(object.accountId) ? String(object.accountId) : "",
      peerId: isSet(object.peerId) ? String(object.peerId) : "",
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
    };
  },

  toJSON(message: Info): unknown {
    const obj: any = {};
    message.accountId !== undefined && (obj.accountId = message.accountId);
    message.peerId !== undefined && (obj.peerId = message.peerId);
    message.startTime !== undefined && (obj.startTime = message.startTime.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Info>, I>>(object: I): Info {
    const message = createBaseInfo();
    message.accountId = object.accountId ?? "";
    message.peerId = object.peerId ?? "";
    message.startTime = object.startTime ?? undefined;
    return message;
  },
};

/** Daemon API encapsulates main functionality of the Mintter daemon. */
export interface Daemon {
  /**
   * Generates a set of mnemonics words used to derive Mintter Account Key, and the underlying
   * mintter lndhub wallet. The cipher schema is BIP-39 and the entropy is encoded as a
   * mnemonic of 12-24 human-readable english words.
   * The seed could be reconstructed given these words and the passphrase.
   */
  genMnemonic(request: DeepPartial<GenMnemonicRequest>, metadata?: grpc.Metadata): Promise<GenMnemonicResponse>;
  /**
   * After generating the seed, this call is used to commit the seed and
   * create an account binding between the device and account.
   */
  register(request: DeepPartial<RegisterRequest>, metadata?: grpc.Metadata): Promise<RegisterResponse>;
  /** Get generic information about the running node. */
  getInfo(request: DeepPartial<GetInfoRequest>, metadata?: grpc.Metadata): Promise<Info>;
  /** Force-trigger periodic background sync of Mintter objects. */
  forceSync(request: DeepPartial<ForceSyncRequest>, metadata?: grpc.Metadata): Promise<Empty>;
}

export class DaemonClientImpl implements Daemon {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.genMnemonic = this.genMnemonic.bind(this);
    this.register = this.register.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.forceSync = this.forceSync.bind(this);
  }

  genMnemonic(request: DeepPartial<GenMnemonicRequest>, metadata?: grpc.Metadata): Promise<GenMnemonicResponse> {
    return this.rpc.unary(DaemonGenMnemonicDesc, GenMnemonicRequest.fromPartial(request), metadata);
  }

  register(request: DeepPartial<RegisterRequest>, metadata?: grpc.Metadata): Promise<RegisterResponse> {
    return this.rpc.unary(DaemonRegisterDesc, RegisterRequest.fromPartial(request), metadata);
  }

  getInfo(request: DeepPartial<GetInfoRequest>, metadata?: grpc.Metadata): Promise<Info> {
    return this.rpc.unary(DaemonGetInfoDesc, GetInfoRequest.fromPartial(request), metadata);
  }

  forceSync(request: DeepPartial<ForceSyncRequest>, metadata?: grpc.Metadata): Promise<Empty> {
    return this.rpc.unary(DaemonForceSyncDesc, ForceSyncRequest.fromPartial(request), metadata);
  }
}

export const DaemonDesc = { serviceName: "com.mintter.daemon.v1alpha.Daemon" };

export const DaemonGenMnemonicDesc: UnaryMethodDefinitionish = {
  methodName: "GenMnemonic",
  service: DaemonDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GenMnemonicRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GenMnemonicResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const DaemonRegisterDesc: UnaryMethodDefinitionish = {
  methodName: "Register",
  service: DaemonDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return RegisterRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...RegisterResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const DaemonGetInfoDesc: UnaryMethodDefinitionish = {
  methodName: "GetInfo",
  service: DaemonDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetInfoRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Info.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const DaemonForceSyncDesc: UnaryMethodDefinitionish = {
  methodName: "ForceSync",
  service: DaemonDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ForceSyncRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
      upStreamRetryCodes?: number[];
    },
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
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
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
