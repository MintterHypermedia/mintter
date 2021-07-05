//@ts-nocheck
/* eslint-disable */
import {util, configure, Writer, Reader} from 'protobufjs/minimal'
import * as Long from 'long'
import {grpc} from '@improbable-eng/grpc-web'
import {BrowserHeaders} from 'browser-headers'

/**
 * Indicates connection status of our node with a remote peer.
 * Mimics libp2p connectedness.
 */
export enum ConnectionStatus {
  /** NOT_CONNECTED - NotConnected means no connection to peer, and no extra information (default). */
  NOT_CONNECTED = 0,
  /** CONNECTED - Connected means has an open, live connection to peer. */
  CONNECTED = 1,
  /** CAN_CONNECT - CanConnect means recently connected to peer, terminated gracefully. */
  CAN_CONNECT = 2,
  /**
   * CANNOT_CONNECT - CannotConnect means recently attempted connecting but failed to connect.
   * (should signal "made effort, failed").
   */
  CANNOT_CONNECT = 3,
  UNRECOGNIZED = -1,
}

export function connectionStatusFromJSON(object: any): ConnectionStatus {
  switch (object) {
    case 0:
    case 'NOT_CONNECTED':
      return ConnectionStatus.NOT_CONNECTED
    case 1:
    case 'CONNECTED':
      return ConnectionStatus.CONNECTED
    case 2:
    case 'CAN_CONNECT':
      return ConnectionStatus.CAN_CONNECT
    case 3:
    case 'CANNOT_CONNECT':
      return ConnectionStatus.CANNOT_CONNECT
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ConnectionStatus.UNRECOGNIZED
  }
}

export function connectionStatusToJSON(object: ConnectionStatus): string {
  switch (object) {
    case ConnectionStatus.NOT_CONNECTED:
      return 'NOT_CONNECTED'
    case ConnectionStatus.CONNECTED:
      return 'CONNECTED'
    case ConnectionStatus.CAN_CONNECT:
      return 'CAN_CONNECT'
    case ConnectionStatus.CANNOT_CONNECT:
      return 'CANNOT_CONNECT'
    default:
      return 'UNKNOWN'
  }
}

/** Request to start object discovery. */
export interface StartObjectDiscoveryRequest {
  /** ID of the object to be discovered. */
  objectId: string
}

/** Response for starting object discovery. */
export interface StartObjectDiscoveryResponse {}

/** Request to stop object discovery. */
export interface StopObjectDiscoveryRequest {
  /** ID of the object for which discovery must be stopped. */
  objectId: string
}

/** Response for stopping object discovery. */
export interface StopObjectDiscoveryResponse {}

/** Request to get object discovery status. */
export interface GetObjectDiscoveryStatusRequest {
  /** ID of the object for which we want to get discovery status. */
  objectId: string
}

/** Request to get peer's addresses. */
export interface GetPeerInfoRequest {
  /** Required. CID-encoded Peer ID. */
  peerId: string
}

/** Request for connecting to a peer explicitly. */
export interface ConnectRequest {
  /**
   * A list of multiaddrs for the same peer ID to attempt p2p connection.
   * For example `/ip4/10.0.0.1/tcp/55000/p2p/QmDeadBeef`.
   */
  addrs: string[]
}

/** Response for conneting to a peer. */
export interface ConnectResponse {}

/** Various details about a known peer. */
export interface PeerInfo {
  /** List of known multiaddrs of the request peer. */
  addrs: string[]
  /** Connection status of our node with a remote peer. */
  connectionStatus: ConnectionStatus
  /** Account ID that this peer is bound to. */
  accountId: string
}

/** Status of the object discovery. */
export interface ObjectDiscoveryStatus {
  /** List of known peers that provide this object. */
  peers: string[]
}

const baseStartObjectDiscoveryRequest: object = {objectId: ''}

export const StartObjectDiscoveryRequest = {
  encode(message: StartObjectDiscoveryRequest, writer: Writer = Writer.create()): Writer {
    if (message.objectId !== '') {
      writer.uint32(10).string(message.objectId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): StartObjectDiscoveryRequest {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseStartObjectDiscoveryRequest} as StartObjectDiscoveryRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.objectId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): StartObjectDiscoveryRequest {
    const message = {...baseStartObjectDiscoveryRequest} as StartObjectDiscoveryRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = String(object.objectId)
    } else {
      message.objectId = ''
    }
    return message
  },

  toJSON(message: StartObjectDiscoveryRequest): unknown {
    const obj: any = {}
    message.objectId !== undefined && (obj.objectId = message.objectId)
    return obj
  },

  fromPartial(object: DeepPartial<StartObjectDiscoveryRequest>): StartObjectDiscoveryRequest {
    const message = {...baseStartObjectDiscoveryRequest} as StartObjectDiscoveryRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = object.objectId
    } else {
      message.objectId = ''
    }
    return message
  },
}

const baseStartObjectDiscoveryResponse: object = {}

export const StartObjectDiscoveryResponse = {
  encode(_: StartObjectDiscoveryResponse, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): StartObjectDiscoveryResponse {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseStartObjectDiscoveryResponse} as StartObjectDiscoveryResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): StartObjectDiscoveryResponse {
    const message = {...baseStartObjectDiscoveryResponse} as StartObjectDiscoveryResponse
    return message
  },

  toJSON(_: StartObjectDiscoveryResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<StartObjectDiscoveryResponse>): StartObjectDiscoveryResponse {
    const message = {...baseStartObjectDiscoveryResponse} as StartObjectDiscoveryResponse
    return message
  },
}

const baseStopObjectDiscoveryRequest: object = {objectId: ''}

export const StopObjectDiscoveryRequest = {
  encode(message: StopObjectDiscoveryRequest, writer: Writer = Writer.create()): Writer {
    if (message.objectId !== '') {
      writer.uint32(10).string(message.objectId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): StopObjectDiscoveryRequest {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseStopObjectDiscoveryRequest} as StopObjectDiscoveryRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.objectId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): StopObjectDiscoveryRequest {
    const message = {...baseStopObjectDiscoveryRequest} as StopObjectDiscoveryRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = String(object.objectId)
    } else {
      message.objectId = ''
    }
    return message
  },

  toJSON(message: StopObjectDiscoveryRequest): unknown {
    const obj: any = {}
    message.objectId !== undefined && (obj.objectId = message.objectId)
    return obj
  },

  fromPartial(object: DeepPartial<StopObjectDiscoveryRequest>): StopObjectDiscoveryRequest {
    const message = {...baseStopObjectDiscoveryRequest} as StopObjectDiscoveryRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = object.objectId
    } else {
      message.objectId = ''
    }
    return message
  },
}

const baseStopObjectDiscoveryResponse: object = {}

export const StopObjectDiscoveryResponse = {
  encode(_: StopObjectDiscoveryResponse, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): StopObjectDiscoveryResponse {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseStopObjectDiscoveryResponse} as StopObjectDiscoveryResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): StopObjectDiscoveryResponse {
    const message = {...baseStopObjectDiscoveryResponse} as StopObjectDiscoveryResponse
    return message
  },

  toJSON(_: StopObjectDiscoveryResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<StopObjectDiscoveryResponse>): StopObjectDiscoveryResponse {
    const message = {...baseStopObjectDiscoveryResponse} as StopObjectDiscoveryResponse
    return message
  },
}

const baseGetObjectDiscoveryStatusRequest: object = {objectId: ''}

export const GetObjectDiscoveryStatusRequest = {
  encode(message: GetObjectDiscoveryStatusRequest, writer: Writer = Writer.create()): Writer {
    if (message.objectId !== '') {
      writer.uint32(10).string(message.objectId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): GetObjectDiscoveryStatusRequest {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseGetObjectDiscoveryStatusRequest} as GetObjectDiscoveryStatusRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.objectId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetObjectDiscoveryStatusRequest {
    const message = {...baseGetObjectDiscoveryStatusRequest} as GetObjectDiscoveryStatusRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = String(object.objectId)
    } else {
      message.objectId = ''
    }
    return message
  },

  toJSON(message: GetObjectDiscoveryStatusRequest): unknown {
    const obj: any = {}
    message.objectId !== undefined && (obj.objectId = message.objectId)
    return obj
  },

  fromPartial(object: DeepPartial<GetObjectDiscoveryStatusRequest>): GetObjectDiscoveryStatusRequest {
    const message = {...baseGetObjectDiscoveryStatusRequest} as GetObjectDiscoveryStatusRequest
    if (object.objectId !== undefined && object.objectId !== null) {
      message.objectId = object.objectId
    } else {
      message.objectId = ''
    }
    return message
  },
}

const baseGetPeerInfoRequest: object = {peerId: ''}

export const GetPeerInfoRequest = {
  encode(message: GetPeerInfoRequest, writer: Writer = Writer.create()): Writer {
    if (message.peerId !== '') {
      writer.uint32(10).string(message.peerId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): GetPeerInfoRequest {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseGetPeerInfoRequest} as GetPeerInfoRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.peerId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetPeerInfoRequest {
    const message = {...baseGetPeerInfoRequest} as GetPeerInfoRequest
    if (object.peerId !== undefined && object.peerId !== null) {
      message.peerId = String(object.peerId)
    } else {
      message.peerId = ''
    }
    return message
  },

  toJSON(message: GetPeerInfoRequest): unknown {
    const obj: any = {}
    message.peerId !== undefined && (obj.peerId = message.peerId)
    return obj
  },

  fromPartial(object: DeepPartial<GetPeerInfoRequest>): GetPeerInfoRequest {
    const message = {...baseGetPeerInfoRequest} as GetPeerInfoRequest
    if (object.peerId !== undefined && object.peerId !== null) {
      message.peerId = object.peerId
    } else {
      message.peerId = ''
    }
    return message
  },
}

const baseConnectRequest: object = {addrs: ''}

export const ConnectRequest = {
  encode(message: ConnectRequest, writer: Writer = Writer.create()): Writer {
    for (const v of message.addrs) {
      writer.uint32(10).string(v!)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): ConnectRequest {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseConnectRequest} as ConnectRequest
    message.addrs = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.addrs.push(reader.string())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ConnectRequest {
    const message = {...baseConnectRequest} as ConnectRequest
    message.addrs = []
    if (object.addrs !== undefined && object.addrs !== null) {
      for (const e of object.addrs) {
        message.addrs.push(String(e))
      }
    }
    return message
  },

  toJSON(message: ConnectRequest): unknown {
    const obj: any = {}
    if (message.addrs) {
      obj.addrs = message.addrs.map((e) => e)
    } else {
      obj.addrs = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<ConnectRequest>): ConnectRequest {
    const message = {...baseConnectRequest} as ConnectRequest
    message.addrs = []
    if (object.addrs !== undefined && object.addrs !== null) {
      for (const e of object.addrs) {
        message.addrs.push(e)
      }
    }
    return message
  },
}

const baseConnectResponse: object = {}

export const ConnectResponse = {
  encode(_: ConnectResponse, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): ConnectResponse {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseConnectResponse} as ConnectResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): ConnectResponse {
    const message = {...baseConnectResponse} as ConnectResponse
    return message
  },

  toJSON(_: ConnectResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<ConnectResponse>): ConnectResponse {
    const message = {...baseConnectResponse} as ConnectResponse
    return message
  },
}

const basePeerInfo: object = {addrs: '', connectionStatus: 0, accountId: ''}

export const PeerInfo = {
  encode(message: PeerInfo, writer: Writer = Writer.create()): Writer {
    for (const v of message.addrs) {
      writer.uint32(10).string(v!)
    }
    if (message.connectionStatus !== 0) {
      writer.uint32(16).int32(message.connectionStatus)
    }
    if (message.accountId !== '') {
      writer.uint32(26).string(message.accountId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): PeerInfo {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...basePeerInfo} as PeerInfo
    message.addrs = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.addrs.push(reader.string())
          break
        case 2:
          message.connectionStatus = reader.int32() as any
          break
        case 3:
          message.accountId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PeerInfo {
    const message = {...basePeerInfo} as PeerInfo
    message.addrs = []
    if (object.addrs !== undefined && object.addrs !== null) {
      for (const e of object.addrs) {
        message.addrs.push(String(e))
      }
    }
    if (object.connectionStatus !== undefined && object.connectionStatus !== null) {
      message.connectionStatus = connectionStatusFromJSON(object.connectionStatus)
    } else {
      message.connectionStatus = 0
    }
    if (object.accountId !== undefined && object.accountId !== null) {
      message.accountId = String(object.accountId)
    } else {
      message.accountId = ''
    }
    return message
  },

  toJSON(message: PeerInfo): unknown {
    const obj: any = {}
    if (message.addrs) {
      obj.addrs = message.addrs.map((e) => e)
    } else {
      obj.addrs = []
    }
    message.connectionStatus !== undefined && (obj.connectionStatus = connectionStatusToJSON(message.connectionStatus))
    message.accountId !== undefined && (obj.accountId = message.accountId)
    return obj
  },

  fromPartial(object: DeepPartial<PeerInfo>): PeerInfo {
    const message = {...basePeerInfo} as PeerInfo
    message.addrs = []
    if (object.addrs !== undefined && object.addrs !== null) {
      for (const e of object.addrs) {
        message.addrs.push(e)
      }
    }
    if (object.connectionStatus !== undefined && object.connectionStatus !== null) {
      message.connectionStatus = object.connectionStatus
    } else {
      message.connectionStatus = 0
    }
    if (object.accountId !== undefined && object.accountId !== null) {
      message.accountId = object.accountId
    } else {
      message.accountId = ''
    }
    return message
  },
}

const baseObjectDiscoveryStatus: object = {peers: ''}

export const ObjectDiscoveryStatus = {
  encode(message: ObjectDiscoveryStatus, writer: Writer = Writer.create()): Writer {
    for (const v of message.peers) {
      writer.uint32(10).string(v!)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): ObjectDiscoveryStatus {
    const reader = input instanceof Reader ? input : new Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseObjectDiscoveryStatus} as ObjectDiscoveryStatus
    message.peers = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.peers.push(reader.string())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ObjectDiscoveryStatus {
    const message = {...baseObjectDiscoveryStatus} as ObjectDiscoveryStatus
    message.peers = []
    if (object.peers !== undefined && object.peers !== null) {
      for (const e of object.peers) {
        message.peers.push(String(e))
      }
    }
    return message
  },

  toJSON(message: ObjectDiscoveryStatus): unknown {
    const obj: any = {}
    if (message.peers) {
      obj.peers = message.peers.map((e) => e)
    } else {
      obj.peers = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<ObjectDiscoveryStatus>): ObjectDiscoveryStatus {
    const message = {...baseObjectDiscoveryStatus} as ObjectDiscoveryStatus
    message.peers = []
    if (object.peers !== undefined && object.peers !== null) {
      for (const e of object.peers) {
        message.peers.push(e)
      }
    }
    return message
  },
}

/** Networking API service of the Mintter daemon. */
export interface Networking {
  /**
   * Start discovery of a given object ID. Server will be instructed to actively looking for peers
   * that can provide information about the given object ID and will try to be in sync with them.
   */
  startObjectDiscovery(
    request: DeepPartial<StartObjectDiscoveryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<StartObjectDiscoveryResponse>
  /** Get status information about object discovery that was previously started. */
  getObjectDiscoveryStatus(
    request: DeepPartial<GetObjectDiscoveryStatusRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ObjectDiscoveryStatus>
  /** Stop object discovery that was previously started. */
  stopObjectDiscovery(
    request: DeepPartial<StopObjectDiscoveryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<StopObjectDiscoveryResponse>
  /** Lookup details about a known peer. */
  getPeerInfo(request: DeepPartial<GetPeerInfoRequest>, metadata?: grpc.Metadata): Promise<PeerInfo>
  /** Establishes a direct connection with a given peer explicitly. */
  connect(request: DeepPartial<ConnectRequest>, metadata?: grpc.Metadata): Promise<ConnectResponse>
}

export class NetworkingClientImpl implements Networking {
  private readonly rpc: Rpc

  constructor(rpc: Rpc) {
    this.rpc = rpc
    this.StartObjectDiscovery = this.StartObjectDiscovery.bind(this)
    this.GetObjectDiscoveryStatus = this.GetObjectDiscoveryStatus.bind(this)
    this.StopObjectDiscovery = this.StopObjectDiscovery.bind(this)
    this.GetPeerInfo = this.GetPeerInfo.bind(this)
    this.Connect = this.Connect.bind(this)
  }

  StartObjectDiscovery(
    request: DeepPartial<StartObjectDiscoveryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<StartObjectDiscoveryResponse> {
    return this.rpc.unary(
      NetworkingStartObjectDiscoveryDesc,
      StartObjectDiscoveryRequest.fromPartial(request),
      metadata,
    )
  }

  GetObjectDiscoveryStatus(
    request: DeepPartial<GetObjectDiscoveryStatusRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ObjectDiscoveryStatus> {
    return this.rpc.unary(
      NetworkingGetObjectDiscoveryStatusDesc,
      GetObjectDiscoveryStatusRequest.fromPartial(request),
      metadata,
    )
  }

  StopObjectDiscovery(
    request: DeepPartial<StopObjectDiscoveryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<StopObjectDiscoveryResponse> {
    return this.rpc.unary(NetworkingStopObjectDiscoveryDesc, StopObjectDiscoveryRequest.fromPartial(request), metadata)
  }

  GetPeerInfo(request: DeepPartial<GetPeerInfoRequest>, metadata?: grpc.Metadata): Promise<PeerInfo> {
    return this.rpc.unary(NetworkingGetPeerInfoDesc, GetPeerInfoRequest.fromPartial(request), metadata)
  }

  Connect(request: DeepPartial<ConnectRequest>, metadata?: grpc.Metadata): Promise<ConnectResponse> {
    return this.rpc.unary(NetworkingConnectDesc, ConnectRequest.fromPartial(request), metadata)
  }
}

export const NetworkingDesc = {
  serviceName: 'com.mintter.networking.v1alpha.Networking',
}

export const NetworkingStartObjectDiscoveryDesc: UnaryMethodDefinitionish = {
  methodName: 'StartObjectDiscovery',
  service: NetworkingDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return StartObjectDiscoveryRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...StartObjectDiscoveryResponse.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const NetworkingGetObjectDiscoveryStatusDesc: UnaryMethodDefinitionish = {
  methodName: 'GetObjectDiscoveryStatus',
  service: NetworkingDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetObjectDiscoveryStatusRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ObjectDiscoveryStatus.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const NetworkingStopObjectDiscoveryDesc: UnaryMethodDefinitionish = {
  methodName: 'StopObjectDiscovery',
  service: NetworkingDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return StopObjectDiscoveryRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...StopObjectDiscoveryResponse.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const NetworkingGetPeerInfoDesc: UnaryMethodDefinitionish = {
  methodName: 'GetPeerInfo',
  service: NetworkingDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetPeerInfoRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...PeerInfo.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const NetworkingConnectDesc: UnaryMethodDefinitionish = {
  methodName: 'Connect',
  service: NetworkingDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ConnectRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ConnectResponse.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any
  responseStream: any
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any>
}

export class GrpcWebImpl {
  private host: string
  private options: {
    transport?: grpc.TransportFactory

    debug?: boolean
    metadata?: grpc.Metadata
  }

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory

      debug?: boolean
      metadata?: grpc.Metadata
    },
  ) {
    this.host = host
    this.options = options
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = {..._request, ...methodDesc.requestType}
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({...this.options?.metadata.headersMap, ...metadata?.headersMap})
        : metadata || this.options.metadata
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message)
          } else {
            const err = new Error(response.statusMessage) as any
            err.code = response.status
            err.metadata = response.trailers
            reject(err)
          }
        },
      })
    })
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? {[K in keyof T]?: DeepPartial<T[K]>}
  : Partial<T>

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any
  configure()
}
