//@ts-nocheck
/* eslint-disable */
import Long from 'long'
import {grpc} from '@improbable-eng/grpc-web'
import _m0 from 'protobufjs/minimal'
import {Empty} from '../../google/protobuf/empty'
import {BrowserHeaders} from 'browser-headers'
import {Timestamp} from '../../google/protobuf/timestamp'

/** Request to create a new draft. */
export interface CreateDraftRequest {
  /**
   * Optional. Existing Document ID can be specified to update
   * previously published document. A draft will be created
   * with the content of the most recent known version.
   */
  existingDocumentId: string
}

/** Request to delete an existing draft. */
export interface DeleteDraftRequest {
  /** ID of the document whose draft needs to be deleted. Only one */
  documentId: string
}

/** Request to get a single draft. */
export interface GetDraftRequest {
  /** ID of the document for which draft was previously created. */
  documentId: string
}

/** Request to update an existing draft. */
export interface UpdateDraftRequest {
  /** Instance of the document to be updated. */
  document: Document | undefined
}

/** Request to list stored drafts. */
export interface ListDraftsRequest {
  /** Optional. Number of results per page. */
  pageSize: number
  /** Optional. Token for the page to return. */
  pageToken: string
}

/** Response for listing drafts. */
export interface ListDraftsResponse {
  /**
   * Drafts matching the list request.
   * Content is omitted.
   */
  documents: Document[]
  /** Token for the next page if there're any. */
  nextPageToken: string
}

/** Request to publish a draft. */
export interface PublishDraftRequest {
  /** ID of the document which current draft needs to be published. */
  documentId: string
}

/** Request for getting a single publication. */
export interface GetPublicationRequest {
  /** Required. ID of the published document. */
  documentId: string
  /** Optional. Specific version of the published document. If empty, the latest one is returned. */
  version: string
}

/** Request for deleting a publication. */
export interface DeletePublicationRequest {
  /**
   * Document ID of the publication to be removed.
   * All versions will also be removed.
   */
  documentId: string
}

/** Request for listing publications. */
export interface ListPublicationsRequest {
  /** Optional. Number of results per page. Default is defined by the server. */
  pageSize: number
  /** Optional. Value from next_page_token obtains from a previous response. */
  pageToken: string
}

/** Response with list of publications. */
export interface ListPublicationsResponse {
  /**
   * List of publications matching the request.
   * Only most recent versions are returned.
   * Content is omitted, only metadata is present.
   */
  publications: Publication[]
  /** Token for the next page if there're more results. */
  nextPageToken: string
}

/** State of the document after publication. */
export interface Publication {
  /**
   * Version points to the state of the publication at some point in time.
   * It is represented as a string, although it can be a list of CIDs.
   * The order of hashes must be deterministic, which is tricky because
   * CIDs can have different base encoding when represented as a string.
   * So same hash, can have different string representations.
   * We should either define a canonical base encoding, or sort binary
   * representation of the hash portion of the CID.
   * Anyway, all these details should be opaque for consumers of this API.
   * On the other hand, if API consumers never compare versions as plain strings
   * it doesn't really matter if different version strings point to the same document.
   */
  version: string
  /** Document metadata. */
  document: Document | undefined
}

/** Document represents metadata and content of a draft or publication. */
export interface Document {
  /** Permanent ID of the document. */
  id: string
  /** Title of the document. */
  title: string
  /** Subtitle of the document. */
  subtitle: string
  /** Output only. Author of the document. */
  author: string
  /**
   * JSON-serialized Mintter AST.
   * It's expected to be the first child of the document root,
   * which must be of type GroupingContent.
   */
  content: string
  /** Output only. Time when document was created. */
  createTime: Date | undefined
  /** Output only. Time when document was updated. */
  updateTime: Date | undefined
  /** Output only. Time when this version was published. Not present in drafts. */
  publishTime: Date | undefined
}

/** Message that gets published to documents feed of the Mintter author. */
export interface DocumentPublished {
  documentId: string
  title: string
  subtitle: string
}

const baseCreateDraftRequest: object = {existingDocumentId: ''}

export const CreateDraftRequest = {
  encode(message: CreateDraftRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.existingDocumentId !== '') {
      writer.uint32(10).string(message.existingDocumentId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateDraftRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseCreateDraftRequest} as CreateDraftRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.existingDocumentId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CreateDraftRequest {
    const message = {...baseCreateDraftRequest} as CreateDraftRequest
    if (object.existingDocumentId !== undefined && object.existingDocumentId !== null) {
      message.existingDocumentId = String(object.existingDocumentId)
    } else {
      message.existingDocumentId = ''
    }
    return message
  },

  toJSON(message: CreateDraftRequest): unknown {
    const obj: any = {}
    message.existingDocumentId !== undefined && (obj.existingDocumentId = message.existingDocumentId)
    return obj
  },

  fromPartial(object: DeepPartial<CreateDraftRequest>): CreateDraftRequest {
    const message = {...baseCreateDraftRequest} as CreateDraftRequest
    if (object.existingDocumentId !== undefined && object.existingDocumentId !== null) {
      message.existingDocumentId = object.existingDocumentId
    } else {
      message.existingDocumentId = ''
    }
    return message
  },
}

const baseDeleteDraftRequest: object = {documentId: ''}

export const DeleteDraftRequest = {
  encode(message: DeleteDraftRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteDraftRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseDeleteDraftRequest} as DeleteDraftRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DeleteDraftRequest {
    const message = {...baseDeleteDraftRequest} as DeleteDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    return message
  },

  toJSON(message: DeleteDraftRequest): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    return obj
  },

  fromPartial(object: DeepPartial<DeleteDraftRequest>): DeleteDraftRequest {
    const message = {...baseDeleteDraftRequest} as DeleteDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    return message
  },
}

const baseGetDraftRequest: object = {documentId: ''}

export const GetDraftRequest = {
  encode(message: GetDraftRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDraftRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseGetDraftRequest} as GetDraftRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetDraftRequest {
    const message = {...baseGetDraftRequest} as GetDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    return message
  },

  toJSON(message: GetDraftRequest): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    return obj
  },

  fromPartial(object: DeepPartial<GetDraftRequest>): GetDraftRequest {
    const message = {...baseGetDraftRequest} as GetDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    return message
  },
}

const baseUpdateDraftRequest: object = {}

export const UpdateDraftRequest = {
  encode(message: UpdateDraftRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.document !== undefined) {
      Document.encode(message.document, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateDraftRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseUpdateDraftRequest} as UpdateDraftRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.document = Document.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): UpdateDraftRequest {
    const message = {...baseUpdateDraftRequest} as UpdateDraftRequest
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromJSON(object.document)
    } else {
      message.document = undefined
    }
    return message
  },

  toJSON(message: UpdateDraftRequest): unknown {
    const obj: any = {}
    message.document !== undefined && (obj.document = message.document ? Document.toJSON(message.document) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<UpdateDraftRequest>): UpdateDraftRequest {
    const message = {...baseUpdateDraftRequest} as UpdateDraftRequest
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromPartial(object.document)
    } else {
      message.document = undefined
    }
    return message
  },
}

const baseListDraftsRequest: object = {pageSize: 0, pageToken: ''}

export const ListDraftsRequest = {
  encode(message: ListDraftsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pageSize !== 0) {
      writer.uint32(8).int32(message.pageSize)
    }
    if (message.pageToken !== '') {
      writer.uint32(18).string(message.pageToken)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDraftsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseListDraftsRequest} as ListDraftsRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.pageSize = reader.int32()
          break
        case 2:
          message.pageToken = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ListDraftsRequest {
    const message = {...baseListDraftsRequest} as ListDraftsRequest
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = Number(object.pageSize)
    } else {
      message.pageSize = 0
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = String(object.pageToken)
    } else {
      message.pageToken = ''
    }
    return message
  },

  toJSON(message: ListDraftsRequest): unknown {
    const obj: any = {}
    message.pageSize !== undefined && (obj.pageSize = message.pageSize)
    message.pageToken !== undefined && (obj.pageToken = message.pageToken)
    return obj
  },

  fromPartial(object: DeepPartial<ListDraftsRequest>): ListDraftsRequest {
    const message = {...baseListDraftsRequest} as ListDraftsRequest
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = object.pageSize
    } else {
      message.pageSize = 0
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = object.pageToken
    } else {
      message.pageToken = ''
    }
    return message
  },
}

const baseListDraftsResponse: object = {nextPageToken: ''}

export const ListDraftsResponse = {
  encode(message: ListDraftsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.documents) {
      Document.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    if (message.nextPageToken !== '') {
      writer.uint32(18).string(message.nextPageToken)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListDraftsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseListDraftsResponse} as ListDraftsResponse
    message.documents = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documents.push(Document.decode(reader, reader.uint32()))
          break
        case 2:
          message.nextPageToken = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ListDraftsResponse {
    const message = {...baseListDraftsResponse} as ListDraftsResponse
    message.documents = []
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(Document.fromJSON(e))
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = String(object.nextPageToken)
    } else {
      message.nextPageToken = ''
    }
    return message
  },

  toJSON(message: ListDraftsResponse): unknown {
    const obj: any = {}
    if (message.documents) {
      obj.documents = message.documents.map((e) => (e ? Document.toJSON(e) : undefined))
    } else {
      obj.documents = []
    }
    message.nextPageToken !== undefined && (obj.nextPageToken = message.nextPageToken)
    return obj
  },

  fromPartial(object: DeepPartial<ListDraftsResponse>): ListDraftsResponse {
    const message = {...baseListDraftsResponse} as ListDraftsResponse
    message.documents = []
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(Document.fromPartial(e))
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = object.nextPageToken
    } else {
      message.nextPageToken = ''
    }
    return message
  },
}

const basePublishDraftRequest: object = {documentId: ''}

export const PublishDraftRequest = {
  encode(message: PublishDraftRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublishDraftRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...basePublishDraftRequest} as PublishDraftRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PublishDraftRequest {
    const message = {...basePublishDraftRequest} as PublishDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    return message
  },

  toJSON(message: PublishDraftRequest): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    return obj
  },

  fromPartial(object: DeepPartial<PublishDraftRequest>): PublishDraftRequest {
    const message = {...basePublishDraftRequest} as PublishDraftRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    return message
  },
}

const baseGetPublicationRequest: object = {documentId: '', version: ''}

export const GetPublicationRequest = {
  encode(message: GetPublicationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    if (message.version !== '') {
      writer.uint32(18).string(message.version)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPublicationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseGetPublicationRequest} as GetPublicationRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        case 2:
          message.version = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GetPublicationRequest {
    const message = {...baseGetPublicationRequest} as GetPublicationRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = String(object.version)
    } else {
      message.version = ''
    }
    return message
  },

  toJSON(message: GetPublicationRequest): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    message.version !== undefined && (obj.version = message.version)
    return obj
  },

  fromPartial(object: DeepPartial<GetPublicationRequest>): GetPublicationRequest {
    const message = {...baseGetPublicationRequest} as GetPublicationRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version
    } else {
      message.version = ''
    }
    return message
  },
}

const baseDeletePublicationRequest: object = {documentId: ''}

export const DeletePublicationRequest = {
  encode(message: DeletePublicationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeletePublicationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseDeletePublicationRequest} as DeletePublicationRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DeletePublicationRequest {
    const message = {...baseDeletePublicationRequest} as DeletePublicationRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    return message
  },

  toJSON(message: DeletePublicationRequest): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    return obj
  },

  fromPartial(object: DeepPartial<DeletePublicationRequest>): DeletePublicationRequest {
    const message = {...baseDeletePublicationRequest} as DeletePublicationRequest
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    return message
  },
}

const baseListPublicationsRequest: object = {pageSize: 0, pageToken: ''}

export const ListPublicationsRequest = {
  encode(message: ListPublicationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pageSize !== 0) {
      writer.uint32(8).int32(message.pageSize)
    }
    if (message.pageToken !== '') {
      writer.uint32(18).string(message.pageToken)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPublicationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseListPublicationsRequest} as ListPublicationsRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.pageSize = reader.int32()
          break
        case 2:
          message.pageToken = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ListPublicationsRequest {
    const message = {...baseListPublicationsRequest} as ListPublicationsRequest
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = Number(object.pageSize)
    } else {
      message.pageSize = 0
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = String(object.pageToken)
    } else {
      message.pageToken = ''
    }
    return message
  },

  toJSON(message: ListPublicationsRequest): unknown {
    const obj: any = {}
    message.pageSize !== undefined && (obj.pageSize = message.pageSize)
    message.pageToken !== undefined && (obj.pageToken = message.pageToken)
    return obj
  },

  fromPartial(object: DeepPartial<ListPublicationsRequest>): ListPublicationsRequest {
    const message = {...baseListPublicationsRequest} as ListPublicationsRequest
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = object.pageSize
    } else {
      message.pageSize = 0
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = object.pageToken
    } else {
      message.pageToken = ''
    }
    return message
  },
}

const baseListPublicationsResponse: object = {nextPageToken: ''}

export const ListPublicationsResponse = {
  encode(message: ListPublicationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.publications) {
      Publication.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    if (message.nextPageToken !== '') {
      writer.uint32(18).string(message.nextPageToken)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPublicationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseListPublicationsResponse} as ListPublicationsResponse
    message.publications = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.publications.push(Publication.decode(reader, reader.uint32()))
          break
        case 2:
          message.nextPageToken = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ListPublicationsResponse {
    const message = {...baseListPublicationsResponse} as ListPublicationsResponse
    message.publications = []
    if (object.publications !== undefined && object.publications !== null) {
      for (const e of object.publications) {
        message.publications.push(Publication.fromJSON(e))
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = String(object.nextPageToken)
    } else {
      message.nextPageToken = ''
    }
    return message
  },

  toJSON(message: ListPublicationsResponse): unknown {
    const obj: any = {}
    if (message.publications) {
      obj.publications = message.publications.map((e) => (e ? Publication.toJSON(e) : undefined))
    } else {
      obj.publications = []
    }
    message.nextPageToken !== undefined && (obj.nextPageToken = message.nextPageToken)
    return obj
  },

  fromPartial(object: DeepPartial<ListPublicationsResponse>): ListPublicationsResponse {
    const message = {...baseListPublicationsResponse} as ListPublicationsResponse
    message.publications = []
    if (object.publications !== undefined && object.publications !== null) {
      for (const e of object.publications) {
        message.publications.push(Publication.fromPartial(e))
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = object.nextPageToken
    } else {
      message.nextPageToken = ''
    }
    return message
  },
}

const basePublication: object = {version: ''}

export const Publication = {
  encode(message: Publication, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.version !== '') {
      writer.uint32(10).string(message.version)
    }
    if (message.document !== undefined) {
      Document.encode(message.document, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Publication {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...basePublication} as Publication
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.version = reader.string()
          break
        case 2:
          message.document = Document.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Publication {
    const message = {...basePublication} as Publication
    if (object.version !== undefined && object.version !== null) {
      message.version = String(object.version)
    } else {
      message.version = ''
    }
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromJSON(object.document)
    } else {
      message.document = undefined
    }
    return message
  },

  toJSON(message: Publication): unknown {
    const obj: any = {}
    message.version !== undefined && (obj.version = message.version)
    message.document !== undefined && (obj.document = message.document ? Document.toJSON(message.document) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Publication>): Publication {
    const message = {...basePublication} as Publication
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version
    } else {
      message.version = ''
    }
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromPartial(object.document)
    } else {
      message.document = undefined
    }
    return message
  },
}

const baseDocument: object = {id: '', title: '', subtitle: '', author: '', content: ''}

export const Document = {
  encode(message: Document, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.title !== '') {
      writer.uint32(18).string(message.title)
    }
    if (message.subtitle !== '') {
      writer.uint32(26).string(message.subtitle)
    }
    if (message.author !== '') {
      writer.uint32(34).string(message.author)
    }
    if (message.content !== '') {
      writer.uint32(42).string(message.content)
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(toTimestamp(message.createTime), writer.uint32(50).fork()).ldelim()
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(toTimestamp(message.updateTime), writer.uint32(58).fork()).ldelim()
    }
    if (message.publishTime !== undefined) {
      Timestamp.encode(toTimestamp(message.publishTime), writer.uint32(66).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Document {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseDocument} as Document
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.title = reader.string()
          break
        case 3:
          message.subtitle = reader.string()
          break
        case 4:
          message.author = reader.string()
          break
        case 5:
          message.content = reader.string()
          break
        case 6:
          message.createTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()))
          break
        case 7:
          message.updateTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()))
          break
        case 8:
          message.publishTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Document {
    const message = {...baseDocument} as Document
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id)
    } else {
      message.id = ''
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = String(object.title)
    } else {
      message.title = ''
    }
    if (object.subtitle !== undefined && object.subtitle !== null) {
      message.subtitle = String(object.subtitle)
    } else {
      message.subtitle = ''
    }
    if (object.author !== undefined && object.author !== null) {
      message.author = String(object.author)
    } else {
      message.author = ''
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = String(object.content)
    } else {
      message.content = ''
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime)
    } else {
      message.createTime = undefined
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime)
    } else {
      message.updateTime = undefined
    }
    if (object.publishTime !== undefined && object.publishTime !== null) {
      message.publishTime = fromJsonTimestamp(object.publishTime)
    } else {
      message.publishTime = undefined
    }
    return message
  },

  toJSON(message: Document): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.title !== undefined && (obj.title = message.title)
    message.subtitle !== undefined && (obj.subtitle = message.subtitle)
    message.author !== undefined && (obj.author = message.author)
    message.content !== undefined && (obj.content = message.content)
    message.createTime !== undefined && (obj.createTime = message.createTime.toISOString())
    message.updateTime !== undefined && (obj.updateTime = message.updateTime.toISOString())
    message.publishTime !== undefined && (obj.publishTime = message.publishTime.toISOString())
    return obj
  },

  fromPartial(object: DeepPartial<Document>): Document {
    const message = {...baseDocument} as Document
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id
    } else {
      message.id = ''
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title
    } else {
      message.title = ''
    }
    if (object.subtitle !== undefined && object.subtitle !== null) {
      message.subtitle = object.subtitle
    } else {
      message.subtitle = ''
    }
    if (object.author !== undefined && object.author !== null) {
      message.author = object.author
    } else {
      message.author = ''
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = object.content
    } else {
      message.content = ''
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime
    } else {
      message.createTime = undefined
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime
    } else {
      message.updateTime = undefined
    }
    if (object.publishTime !== undefined && object.publishTime !== null) {
      message.publishTime = object.publishTime
    } else {
      message.publishTime = undefined
    }
    return message
  },
}

const baseDocumentPublished: object = {documentId: '', title: '', subtitle: ''}

export const DocumentPublished = {
  encode(message: DocumentPublished, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.documentId !== '') {
      writer.uint32(10).string(message.documentId)
    }
    if (message.title !== '') {
      writer.uint32(18).string(message.title)
    }
    if (message.subtitle !== '') {
      writer.uint32(26).string(message.subtitle)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DocumentPublished {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {...baseDocumentPublished} as DocumentPublished
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.documentId = reader.string()
          break
        case 2:
          message.title = reader.string()
          break
        case 3:
          message.subtitle = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DocumentPublished {
    const message = {...baseDocumentPublished} as DocumentPublished
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = String(object.documentId)
    } else {
      message.documentId = ''
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = String(object.title)
    } else {
      message.title = ''
    }
    if (object.subtitle !== undefined && object.subtitle !== null) {
      message.subtitle = String(object.subtitle)
    } else {
      message.subtitle = ''
    }
    return message
  },

  toJSON(message: DocumentPublished): unknown {
    const obj: any = {}
    message.documentId !== undefined && (obj.documentId = message.documentId)
    message.title !== undefined && (obj.title = message.title)
    message.subtitle !== undefined && (obj.subtitle = message.subtitle)
    return obj
  },

  fromPartial(object: DeepPartial<DocumentPublished>): DocumentPublished {
    const message = {...baseDocumentPublished} as DocumentPublished
    if (object.documentId !== undefined && object.documentId !== null) {
      message.documentId = object.documentId
    } else {
      message.documentId = ''
    }
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title
    } else {
      message.title = ''
    }
    if (object.subtitle !== undefined && object.subtitle !== null) {
      message.subtitle = object.subtitle
    } else {
      message.subtitle = ''
    }
    return message
  },
}

/** Drafts service exposes the functionality */
export interface Drafts {
  /** Creates a new draft with a new permanent document ID. */
  createDraft(request: DeepPartial<CreateDraftRequest>, metadata?: grpc.Metadata): Promise<Document>
  /** Deletes a draft by its document ID. */
  deleteDraft(request: DeepPartial<DeleteDraftRequest>, metadata?: grpc.Metadata): Promise<Empty>
  /** Gets a single draft if exists. */
  getDraft(request: DeepPartial<GetDraftRequest>, metadata?: grpc.Metadata): Promise<Document>
  /** Updates a draft instance. Supports partial updates. */
  updateDraft(request: DeepPartial<UpdateDraftRequest>, metadata?: grpc.Metadata): Promise<Document>
  /** List currently stored drafts. */
  listDrafts(request: DeepPartial<ListDraftsRequest>, metadata?: grpc.Metadata): Promise<ListDraftsResponse>
  /** Publishes a draft. I.e. draft will become a publication, and will no longer appear in drafts section. */
  publishDraft(request: DeepPartial<PublishDraftRequest>, metadata?: grpc.Metadata): Promise<Publication>
}

export class DraftsClientImpl implements Drafts {
  private readonly rpc: Rpc

  constructor(rpc: Rpc) {
    this.rpc = rpc
    this.createDraft = this.createDraft.bind(this)
    this.deleteDraft = this.deleteDraft.bind(this)
    this.getDraft = this.getDraft.bind(this)
    this.updateDraft = this.updateDraft.bind(this)
    this.listDrafts = this.listDrafts.bind(this)
    this.publishDraft = this.publishDraft.bind(this)
  }

  createDraft(request: DeepPartial<CreateDraftRequest>, metadata?: grpc.Metadata): Promise<Document> {
    return this.rpc.unary(DraftsCreateDraftDesc, CreateDraftRequest.fromPartial(request), metadata)
  }

  deleteDraft(request: DeepPartial<DeleteDraftRequest>, metadata?: grpc.Metadata): Promise<Empty> {
    return this.rpc.unary(DraftsDeleteDraftDesc, DeleteDraftRequest.fromPartial(request), metadata)
  }

  getDraft(request: DeepPartial<GetDraftRequest>, metadata?: grpc.Metadata): Promise<Document> {
    return this.rpc.unary(DraftsGetDraftDesc, GetDraftRequest.fromPartial(request), metadata)
  }

  updateDraft(request: DeepPartial<UpdateDraftRequest>, metadata?: grpc.Metadata): Promise<Document> {
    return this.rpc.unary(DraftsUpdateDraftDesc, UpdateDraftRequest.fromPartial(request), metadata)
  }

  listDrafts(request: DeepPartial<ListDraftsRequest>, metadata?: grpc.Metadata): Promise<ListDraftsResponse> {
    return this.rpc.unary(DraftsListDraftsDesc, ListDraftsRequest.fromPartial(request), metadata)
  }

  publishDraft(request: DeepPartial<PublishDraftRequest>, metadata?: grpc.Metadata): Promise<Publication> {
    return this.rpc.unary(DraftsPublishDraftDesc, PublishDraftRequest.fromPartial(request), metadata)
  }
}

export const DraftsDesc = {
  serviceName: 'com.mintter.documents.v1alpha.Drafts',
}

export const DraftsCreateDraftDesc: UnaryMethodDefinitionish = {
  methodName: 'CreateDraft',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CreateDraftRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Document.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const DraftsDeleteDraftDesc: UnaryMethodDefinitionish = {
  methodName: 'DeleteDraft',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DeleteDraftRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const DraftsGetDraftDesc: UnaryMethodDefinitionish = {
  methodName: 'GetDraft',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetDraftRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Document.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const DraftsUpdateDraftDesc: UnaryMethodDefinitionish = {
  methodName: 'UpdateDraft',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UpdateDraftRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Document.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const DraftsListDraftsDesc: UnaryMethodDefinitionish = {
  methodName: 'ListDrafts',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ListDraftsRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ListDraftsResponse.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const DraftsPublishDraftDesc: UnaryMethodDefinitionish = {
  methodName: 'PublishDraft',
  service: DraftsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return PublishDraftRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Publication.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

/** Publications service provides access to published documents. */
export interface Publications {
  /** Gets a single publication. */
  getPublication(request: DeepPartial<GetPublicationRequest>, metadata?: grpc.Metadata): Promise<Publication>
  /** Deletes a publication from the local node. It removes all the patches corresponding to a document. */
  deletePublication(request: DeepPartial<DeletePublicationRequest>, metadata?: grpc.Metadata): Promise<Empty>
  /** Lists stored publications. Only the most recent versions show up. */
  listPublications(
    request: DeepPartial<ListPublicationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ListPublicationsResponse>
}

export class PublicationsClientImpl implements Publications {
  private readonly rpc: Rpc

  constructor(rpc: Rpc) {
    this.rpc = rpc
    this.getPublication = this.getPublication.bind(this)
    this.deletePublication = this.deletePublication.bind(this)
    this.listPublications = this.listPublications.bind(this)
  }

  getPublication(request: DeepPartial<GetPublicationRequest>, metadata?: grpc.Metadata): Promise<Publication> {
    return this.rpc.unary(PublicationsGetPublicationDesc, GetPublicationRequest.fromPartial(request), metadata)
  }

  deletePublication(request: DeepPartial<DeletePublicationRequest>, metadata?: grpc.Metadata): Promise<Empty> {
    return this.rpc.unary(PublicationsDeletePublicationDesc, DeletePublicationRequest.fromPartial(request), metadata)
  }

  listPublications(
    request: DeepPartial<ListPublicationsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<ListPublicationsResponse> {
    return this.rpc.unary(PublicationsListPublicationsDesc, ListPublicationsRequest.fromPartial(request), metadata)
  }
}

export const PublicationsDesc = {
  serviceName: 'com.mintter.documents.v1alpha.Publications',
}

export const PublicationsGetPublicationDesc: UnaryMethodDefinitionish = {
  methodName: 'GetPublication',
  service: PublicationsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetPublicationRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Publication.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const PublicationsDeletePublicationDesc: UnaryMethodDefinitionish = {
  methodName: 'DeletePublication',
  service: PublicationsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DeletePublicationRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this
        },
      }
    },
  } as any,
}

export const PublicationsListPublicationsDesc: UnaryMethodDefinitionish = {
  methodName: 'ListPublications',
  service: PublicationsDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ListPublicationsRequest.encode(this).finish()
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ListPublicationsResponse.decode(data),
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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000
  const nanos = (date.getTime() % 1_000) * 1_000_000
  return {seconds, nanos}
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000
  millis += t.nanos / 1_000_000
  return new Date(millis)
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o
  } else if (typeof o === 'string') {
    return new Date(o)
  } else {
    return fromTimestamp(Timestamp.fromJSON(o))
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
