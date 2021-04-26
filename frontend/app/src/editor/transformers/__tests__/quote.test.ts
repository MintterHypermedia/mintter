import { expect } from '@esm-bundle/chai';
import faker from 'faker';
// import { Editor, Text, createEditor } from 'slate';

import documents from '@mintter/api/documents/v1alpha/documents_pb';

import { id as getId } from '../../id';
import { makeProto } from '../make-proto';
import {
  QuoteNode,
  quoteSerialize,
  // textRunSerialize,
  // inlineElementSerialize,
  // createTextRun,
  // PartialTextRun,
  // blockSerialize,
  // BlockNode,
  // linkSerialize,
  // LinkNode,
  // SlateDocument,
  // documentSerialize,
  quoteDeserialize,
} from '../transformers';

describe('Quote', () => {
  const url = `mintter://${faker.finance.bitcoinAddress()}`;
  const linkKey = getId();
  const slateQuote: QuoteNode = {
    id: linkKey,
    type: 'quote',
    url,
    startOffset: 0,
    endOffset: 0,
    children: [{ text: '' }],
  };

  const mintterQuote: documents.Quote = makeProto(new documents.Quote(), {
    linkKey,
    startOffset: 0,
    endOffset: 0,
  });
  const link: documents.Link = makeProto(new documents.Link(), {
    uri: url,
  } as documents.Link.AsObject);
  it('quoteSerialize()', () => {
    const result = quoteSerialize(slateQuote);
    expect(result).to.deep.equal(mintterQuote);
  });

  it('quoteDeserialize()', () => {
    const result = quoteDeserialize(mintterQuote, link);
    expect(result).to.deep.equal(slateQuote);
  });
});
