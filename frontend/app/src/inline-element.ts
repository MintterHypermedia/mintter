import * as documents from '@mintter/api/documents/v1alpha/documents_pb';
import { makeProto } from '@utils/make-proto';
import type {
  SlateInlineElement,
  EditorTextRun,
  SlateImage,
  SlateQuote,
  SlateLink,
} from './editor/types';

export type EntryInlineElementTextRun = {
  textRun: documents.TextRun;
};

export type EntryInlineElementQuote = {
  quote: documents.Quote;
};

export type EntryInlineElementImage = {
  image: documents.Image;
};

export function toInlineElement(
  entry:
    | EntryInlineElementTextRun
    | EntryInlineElementQuote
    | EntryInlineElementImage,
) {
  if (Object.keys(entry).length > 1) {
    throw Error(
      `toInlineElement Error: invalid entry. you should send just oneOf the content type`,
    );
  }

  const element = new documents.InlineElement();
  if ('textRun' in entry) {
    element.setTextRun(entry.textRun);
    return element;
  } else if ('quote' in entry) {
    element.setQuote(entry.quote);
    return element;
  } else if ('image' in entry) {
    throw Error(`toInlineElement Error: image not supported (yet)`);
  } else {
    throw Error(
      `toInlineElement Error: invalid entry. attribute nor "textRun" or "quote"`,
    );
  }

  return element;
}

export function toTextRun(entry: EditorTextRun): documents.TextRun {
  return makeProto<documents.TextRun, documents.TextRun.AsObject>(
    new documents.TextRun(),
    entry,
  );
}

// quote InlineElement

export function toInlineQuote(entry: documents.Quote): documents.InlineElement {
  const element = new documents.InlineElement();
  element.setQuote(entry);

  return element;
}

export type ToQuoteResult = {
  id: string;
  quote: documents.Quote;
  link: documents.Link;
};

export function toQuote(entry: SlateQuote): documents.Quote {
  return makeProto<documents.Quote, documents.Quote.AsObject>(
    new documents.Quote(),
    {
      linkKey: entry.id,
      startOffset: 0,
      endOffset: 0,
    },
  );
}

export function toLink(entry: SlateLink): documents.Link {
  if (!entry.id) {
    throw Error(`toLink error: "id" cannot be undefined`);
  }

  if (!entry.url) {
    throw Error(`toLink error: "url" cannot be undefined`);
  }
  const newLink = new documents.Link();
  newLink.setUri(entry.url);

  return newLink;
}
