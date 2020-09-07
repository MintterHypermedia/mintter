import {toSlateBlock, makeProto} from '../transformers'
import {
  Block,
  Paragraph,
  InlineElement,
  Image,
} from '@mintter/proto/v2/documents_pb'
import {ELEMENT_PARAGRAPH} from '../../elements'
import {ELEMENT_IMAGE} from '../../ImagePlugin/defaults'
import {ELEMENT_BLOCK} from '../../BlockPlugin/defaults'

test('toSlateBlock: paragraph', () => {
  const block = makeProto(new Block(), {
    id: 'block-test-id',
    paragraph: makeProto(new Paragraph(), {
      inlineElements: [
        makeProto(new InlineElement(), {
          text: 'Test block',
        }),
      ],
    }),
  })

  const expected = {
    type: ELEMENT_BLOCK,
    id: 'block-test-id',
    children: [
      {
        type: ELEMENT_PARAGRAPH,
        children: [
          {
            text: 'Test block',
          },
        ],
      },
    ],
  }

  expect(toSlateBlock(block)).toEqual(expected)
})

test('toSlateBlock: image', () => {
  const block = makeProto(new Block(), {
    id: 'block-test-id',
    image: makeProto(new Image(), {
      url: 'some-url.jpg',
      altText: 'test alt text',
    }),
  })

  const expected = {
    type: ELEMENT_BLOCK,
    id: 'block-test-id',
    children: [
      {
        type: ELEMENT_IMAGE,
        url: 'some-url.jpg',
        alt: 'test alt text',
        children: [
          {
            text: '',
          },
        ],
      },
    ],
  }

  expect(toSlateBlock(block)).toEqual(expected)
})
