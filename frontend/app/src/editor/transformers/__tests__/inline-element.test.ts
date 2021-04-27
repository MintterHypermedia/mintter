import { expect } from '@esm-bundle/chai';
import faker from 'faker';

import documents from '@mintter/api/documents/v1alpha/documents_pb';

import { id as getId } from '../../id';
import { makeProto } from '../make-proto';
import {
  QuoteNode,
  quoteSerialize,
  textRunSerialize,
  inlineElementSerialize,
  inlineElementDeserialize,
  createTextRun,
  PartialTextRun,
  LinkNode,
} from '../transformers';

describe('InlineElement', () => {
  it('inlineElementSerialize() > TextRun', () => {
    const node: PartialTextRun = {
      text: 'Hello World',
      bold: true,
    };

    const expected = makeProto(new documents.InlineElement(), {
      textRun: textRunSerialize(createTextRun(node)),
    });
    const result = inlineElementSerialize(node);
    expect(result).to.deep.equal(expected);
  });

  it('inlineElementDeserialize() > TextRun', () => {
    const node: PartialTextRun = {
      text: 'Hello World',
      bold: true,
    };

    const mintterNode = new documents.InlineElement();
    mintterNode.setTextRun(makeProto(new documents.TextRun(), node));

    const result = inlineElementDeserialize(mintterNode);
    expect(result).to.deep.equal(node);
  });

  it('inlineElementSerialize() > TextRun: empty', () => {
    const node: PartialTextRun = {
      text: '',
    };

    const result = inlineElementSerialize(node);

    expect(result).to.equal(undefined);
  });

  it('inlineElementSerialize() > TextRun: should be ignored if `text` is empty', () => {
    const node: PartialTextRun = {
      text: '',
      bold: true,
    };

    const result = inlineElementSerialize(node);

    // console.log({ result, expected });

    expect(result).to.equal(undefined);
  });

  it('inlineElementSerialize() > Quote', () => {
    const node: QuoteNode = {
      id: getId(),
      type: 'quote',
      url: `mintter://${faker.git.commitSha()}`,
      startOffset: 0,
      endOffset: 0,
      children: [{ text: '' }],
    };

    const result = inlineElementSerialize(node);
    const expected = makeProto(new documents.InlineElement(), {
      quote: quoteSerialize(node),
    });

    expect(result).to.deep.equal(expected);
  });

  it('inlineElementDeserialize() > Quote', () => {});

  it('inlineElementSerialize() > Link', () => {
    const node: LinkNode = {
      id: getId(),
      type: 'link',
      url: 'https://mintter.com',
      children: [
        {
          text: 'Hello ',
        },
        {
          text: 'World',
          bold: true,
        },
      ],
    };

    const result = inlineElementSerialize(node);
    const expected = [
      makeProto(new documents.InlineElement(), {
        textRun: textRunSerialize(
          createTextRun({
            text: 'Hello ',
            linkKey: node.id,
          }),
        ),
      }),
      makeProto(new documents.InlineElement(), {
        textRun: textRunSerialize(
          createTextRun({
            text: 'World',
            bold: true,
            linkKey: node.id,
          }),
        ),
      }),
    ];

    expect(result).to.deep.equal(expected);
  });

  it('inlineElementDeserialize() > Link', () => {});
});
