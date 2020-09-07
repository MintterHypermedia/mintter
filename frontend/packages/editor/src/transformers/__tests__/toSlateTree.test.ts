import {toSlateTree, makeProto} from '../transformers'
import {
  BlockRefList,
  Block,
  Paragraph,
  InlineElement,
} from '@mintter/proto/v2/documents_pb'
import {ELEMENT_PARAGRAPH} from '../../elements'
import {ELEMENT_BLOCK_LIST} from '../../HierarchyPlugin/defaults'
import {ELEMENT_BLOCK} from '../../BlockPlugin/defaults'

test('toSlateTree: one level', () => {
  const blocks = [
    makeProto(new Block(), {
      id: 'block-test-id',
      paragraph: makeProto(new Paragraph(), {
        inlineElements: [
          makeProto(new InlineElement(), {
            text: 'Test block',
          }),
        ],
      }),
    }),
  ]

  const blockRefList: BlockRefList.AsObject = {
    style: BlockRefList.Style.NONE,
    refsList: [
      {
        ref: 'block-test-id',
      },
    ],
  }

  const expected = {
    type: ELEMENT_BLOCK_LIST,
    listType: BlockRefList.Style.NONE,
    children: [
      {
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
      },
    ],
  }

  const result = toSlateTree({blockRefList, blocks})

  expect(result).toEqual(expected)
})

test('toSlateTree: two levels', () => {
  const blocks = [
    makeProto(new Block(), {
      id: 'block-test-id',
      paragraph: makeProto(new Paragraph(), {
        inlineElements: [
          makeProto(new InlineElement(), {
            text: 'Test block',
          }),
        ],
      }),
    }),
    makeProto(new Block(), {
      id: 'nested-block-test-id',
      paragraph: makeProto(new Paragraph(), {
        inlineElements: [
          makeProto(new InlineElement(), {
            text: 'Nested Test block',
          }),
        ],
      }),
    }),
  ]

  const blockRefList: BlockRefList.AsObject = {
    style: BlockRefList.Style.NONE,
    refsList: [
      {
        ref: 'block-test-id',
        blockRefList: {
          style: BlockRefList.Style.NONE,
          refsList: [
            {
              ref: 'nested-block-test-id',
            },
          ],
        },
      },
    ],
  }

  const expected = {
    type: ELEMENT_BLOCK_LIST,
    listType: BlockRefList.Style.NONE,
    children: [
      {
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
          {
            type: ELEMENT_BLOCK_LIST,
            listType: BlockRefList.Style.NONE,
            children: [
              {
                type: ELEMENT_BLOCK,
                id: 'nested-block-test-id',
                children: [
                  {
                    type: ELEMENT_PARAGRAPH,
                    children: [
                      {
                        text: 'Nested Test block',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  const result = toSlateTree({blockRefList, blocks})

  expect(result).toEqual(expected)
})
