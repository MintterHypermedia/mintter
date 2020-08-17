import * as jspb from "google-protobuf"

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';

export class CreateDraftRequest extends jspb.Message {
  getParent(): string;
  setParent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateDraftRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateDraftRequest): CreateDraftRequest.AsObject;
  static serializeBinaryToWriter(message: CreateDraftRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateDraftRequest;
  static deserializeBinaryFromReader(message: CreateDraftRequest, reader: jspb.BinaryReader): CreateDraftRequest;
}

export namespace CreateDraftRequest {
  export type AsObject = {
    parent: string,
  }
}

export class GetDocumentRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDocumentRequest): GetDocumentRequest.AsObject;
  static serializeBinaryToWriter(message: GetDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDocumentRequest;
  static deserializeBinaryFromReader(message: GetDocumentRequest, reader: jspb.BinaryReader): GetDocumentRequest;
}

export namespace GetDocumentRequest {
  export type AsObject = {
    version: string,
    id: string,
  }
}

export class GetDocumentResponse extends jspb.Message {
  getDocument(): Document | undefined;
  setDocument(value?: Document): void;
  hasDocument(): boolean;
  clearDocument(): void;

  getBlocksMap(): jspb.Map<string, Block>;
  clearBlocksMap(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDocumentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDocumentResponse): GetDocumentResponse.AsObject;
  static serializeBinaryToWriter(message: GetDocumentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDocumentResponse;
  static deserializeBinaryFromReader(message: GetDocumentResponse, reader: jspb.BinaryReader): GetDocumentResponse;
}

export namespace GetDocumentResponse {
  export type AsObject = {
    document?: Document.AsObject,
    blocksMap: Array<[string, Block.AsObject]>,
  }
}

export class UpdateDocumentRequest extends jspb.Message {
  getDocument(): Document | undefined;
  setDocument(value?: Document): void;
  hasDocument(): boolean;
  clearDocument(): void;

  getBlocksList(): Array<Block>;
  setBlocksList(value: Array<Block>): void;
  clearBlocksList(): void;
  addBlocks(value?: Block, index?: number): Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateDocumentRequest): UpdateDocumentRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateDocumentRequest;
  static deserializeBinaryFromReader(message: UpdateDocumentRequest, reader: jspb.BinaryReader): UpdateDocumentRequest;
}

export namespace UpdateDocumentRequest {
  export type AsObject = {
    document?: Document.AsObject,
    blocksList: Array<Block.AsObject>,
  }
}

export class UpdateDocumentResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateDocumentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateDocumentResponse): UpdateDocumentResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateDocumentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateDocumentResponse;
  static deserializeBinaryFromReader(message: UpdateDocumentResponse, reader: jspb.BinaryReader): UpdateDocumentResponse;
}

export namespace UpdateDocumentResponse {
  export type AsObject = {
  }
}

export class ListDocumentsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageToken(): string;
  setPageToken(value: string): void;

  getPublishingState(): PublishingState;
  setPublishingState(value: PublishingState): void;

  getAuthor(): string;
  setAuthor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDocumentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListDocumentsRequest): ListDocumentsRequest.AsObject;
  static serializeBinaryToWriter(message: ListDocumentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDocumentsRequest;
  static deserializeBinaryFromReader(message: ListDocumentsRequest, reader: jspb.BinaryReader): ListDocumentsRequest;
}

export namespace ListDocumentsRequest {
  export type AsObject = {
    pageSize: number,
    pageToken: string,
    publishingState: PublishingState,
    author: string,
  }
}

export class ListDocumentsResponse extends jspb.Message {
  getDocumentsList(): Array<Document>;
  setDocumentsList(value: Array<Document>): void;
  clearDocumentsList(): void;
  addDocuments(value?: Document, index?: number): Document;

  getNextPageToken(): string;
  setNextPageToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDocumentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDocumentsResponse): ListDocumentsResponse.AsObject;
  static serializeBinaryToWriter(message: ListDocumentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDocumentsResponse;
  static deserializeBinaryFromReader(message: ListDocumentsResponse, reader: jspb.BinaryReader): ListDocumentsResponse;
}

export namespace ListDocumentsResponse {
  export type AsObject = {
    documentsList: Array<Document.AsObject>,
    nextPageToken: string,
  }
}

export class DeleteDocumentRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteDocumentRequest): DeleteDocumentRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteDocumentRequest;
  static deserializeBinaryFromReader(message: DeleteDocumentRequest, reader: jspb.BinaryReader): DeleteDocumentRequest;
}

export namespace DeleteDocumentRequest {
  export type AsObject = {
    version: string,
  }
}

export class PublishDocumentRequest extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublishDocumentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PublishDocumentRequest): PublishDocumentRequest.AsObject;
  static serializeBinaryToWriter(message: PublishDocumentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishDocumentRequest;
  static deserializeBinaryFromReader(message: PublishDocumentRequest, reader: jspb.BinaryReader): PublishDocumentRequest;
}

export namespace PublishDocumentRequest {
  export type AsObject = {
    version: string,
  }
}

export class PublishDocumentResponse extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublishDocumentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PublishDocumentResponse): PublishDocumentResponse.AsObject;
  static serializeBinaryToWriter(message: PublishDocumentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublishDocumentResponse;
  static deserializeBinaryFromReader(message: PublishDocumentResponse, reader: jspb.BinaryReader): PublishDocumentResponse;
}

export namespace PublishDocumentResponse {
  export type AsObject = {
    version: string,
  }
}

export class Document extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getSubtitle(): string;
  setSubtitle(value: string): void;

  getAuthor(): string;
  setAuthor(value: string): void;

  getVersion(): string;
  setVersion(value: string): void;

  getParent(): string;
  setParent(value: string): void;

  getPublishingState(): PublishingState;
  setPublishingState(value: PublishingState): void;

  getBlockRefList(): BlockRefList | undefined;
  setBlockRefList(value?: BlockRefList): void;
  hasBlockRefList(): boolean;
  clearBlockRefList(): void;

  getCreateTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreateTime(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasCreateTime(): boolean;
  clearCreateTime(): void;

  getUpdateTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdateTime(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasUpdateTime(): boolean;
  clearUpdateTime(): void;

  getPublishTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPublishTime(value?: google_protobuf_timestamp_pb.Timestamp): void;
  hasPublishTime(): boolean;
  clearPublishTime(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Document.AsObject;
  static toObject(includeInstance: boolean, msg: Document): Document.AsObject;
  static serializeBinaryToWriter(message: Document, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Document;
  static deserializeBinaryFromReader(message: Document, reader: jspb.BinaryReader): Document;
}

export namespace Document {
  export type AsObject = {
    id: string,
    title: string,
    subtitle: string,
    author: string,
    version: string,
    parent: string,
    publishingState: PublishingState,
    blockRefList?: BlockRefList.AsObject,
    createTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updateTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    publishTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class BlockRefList extends jspb.Message {
  getStyle(): BlockRefList.Style;
  setStyle(value: BlockRefList.Style): void;

  getBlocksList(): Array<BlockRef>;
  setBlocksList(value: Array<BlockRef>): void;
  clearBlocksList(): void;
  addBlocks(value?: BlockRef, index?: number): BlockRef;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockRefList.AsObject;
  static toObject(includeInstance: boolean, msg: BlockRefList): BlockRefList.AsObject;
  static serializeBinaryToWriter(message: BlockRefList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockRefList;
  static deserializeBinaryFromReader(message: BlockRefList, reader: jspb.BinaryReader): BlockRefList;
}

export namespace BlockRefList {
  export type AsObject = {
    style: BlockRefList.Style,
    blocksList: Array<BlockRef.AsObject>,
  }

  export enum Style { 
    NONE = 0,
    BULLET = 1,
    NUMBER = 2,
  }
}

export class BlockRef extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getBlockRefList(): BlockRefList | undefined;
  setBlockRefList(value?: BlockRefList): void;
  hasBlockRefList(): boolean;
  clearBlockRefList(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockRef.AsObject;
  static toObject(includeInstance: boolean, msg: BlockRef): BlockRef.AsObject;
  static serializeBinaryToWriter(message: BlockRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockRef;
  static deserializeBinaryFromReader(message: BlockRef, reader: jspb.BinaryReader): BlockRef;
}

export namespace BlockRef {
  export type AsObject = {
    id: string,
    blockRefList?: BlockRefList.AsObject,
  }
}

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getParagraph(): Paragraph | undefined;
  setParagraph(value?: Paragraph): void;
  hasParagraph(): boolean;
  clearParagraph(): void;

  getImage(): Image | undefined;
  setImage(value?: Image): void;
  hasImage(): boolean;
  clearImage(): void;

  getContentCase(): Block.ContentCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string,
    paragraph?: Paragraph.AsObject,
    image?: Image.AsObject,
  }

  export enum ContentCase { 
    CONTENT_NOT_SET = 0,
    PARAGRAPH = 3,
    IMAGE = 4,
  }
}

export class Paragraph extends jspb.Message {
  getInlineElementsList(): Array<InlineElement>;
  setInlineElementsList(value: Array<InlineElement>): void;
  clearInlineElementsList(): void;
  addInlineElements(value?: InlineElement, index?: number): InlineElement;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Paragraph.AsObject;
  static toObject(includeInstance: boolean, msg: Paragraph): Paragraph.AsObject;
  static serializeBinaryToWriter(message: Paragraph, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Paragraph;
  static deserializeBinaryFromReader(message: Paragraph, reader: jspb.BinaryReader): Paragraph;
}

export namespace Paragraph {
  export type AsObject = {
    inlineElementsList: Array<InlineElement.AsObject>,
  }
}

export class InlineElement extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getTextStyle(): TextStyle | undefined;
  setTextStyle(value?: TextStyle): void;
  hasTextStyle(): boolean;
  clearTextStyle(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InlineElement.AsObject;
  static toObject(includeInstance: boolean, msg: InlineElement): InlineElement.AsObject;
  static serializeBinaryToWriter(message: InlineElement, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InlineElement;
  static deserializeBinaryFromReader(message: InlineElement, reader: jspb.BinaryReader): InlineElement;
}

export namespace InlineElement {
  export type AsObject = {
    text: string,
    textStyle?: TextStyle.AsObject,
  }
}

export class TextStyle extends jspb.Message {
  getBold(): boolean;
  setBold(value: boolean): void;

  getItalic(): boolean;
  setItalic(value: boolean): void;

  getUnderline(): boolean;
  setUnderline(value: boolean): void;

  getCode(): boolean;
  setCode(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextStyle.AsObject;
  static toObject(includeInstance: boolean, msg: TextStyle): TextStyle.AsObject;
  static serializeBinaryToWriter(message: TextStyle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextStyle;
  static deserializeBinaryFromReader(message: TextStyle, reader: jspb.BinaryReader): TextStyle;
}

export namespace TextStyle {
  export type AsObject = {
    bold: boolean,
    italic: boolean,
    underline: boolean,
    code: boolean,
  }
}

export class Image extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): void;

  getAltText(): string;
  setAltText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Image.AsObject;
  static toObject(includeInstance: boolean, msg: Image): Image.AsObject;
  static serializeBinaryToWriter(message: Image, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Image;
  static deserializeBinaryFromReader(message: Image, reader: jspb.BinaryReader): Image;
}

export namespace Image {
  export type AsObject = {
    url: string,
    altText: string,
  }
}

export enum PublishingState { 
  UNSPECIFIED = 0,
  DRAFT = 1,
  PUBLISHED = 2,
}
