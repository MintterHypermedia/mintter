import {toBlockRefList, makeProto} from '../transformers'
import {BlockRefList, BlockRef} from '@mintter/proto/v2/documents_pb'

test('toBlockRefList: simple text block', () => {
  const slateTree = {
    type: 'block_list',
    listType: BlockRefList.Style.NONE,
    children: [
      {
        type: 'block',
        id: 'block-test-id',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'Hello ',
              },
              {
                text: 'World!',
                bold: true,
              },
            ],
          },
        ],
      },
    ],
  }

  const expected = makeProto(new BlockRefList(), {
    style: BlockRefList.Style.NONE,
    blocks: [
      makeProto(new BlockRef(), {
        id: 'block-test-id',
      }),
    ],
  })

  expect(toBlockRefList(slateTree)).toEqual(expected)
})

test('toBlockRefList: nested blocks', () => {
  const slateTree = {
    type: 'block_list',
    listType: BlockRefList.Style.NONE,
    children: [
      {
        type: 'block',
        id: 'block-test-id',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'Hello ',
              },
              {
                text: 'World!',
                bold: true,
              },
            ],
          },
          {
            type: 'block_list',
            listType: BlockRefList.Style.BULLET,
            children: [
              {
                type: 'block',
                id: 'nested-block-test-id',
                children: [
                  {
                    type: 'p',
                    children: [
                      {
                        text: 'Nested block',
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

  const expected = makeProto(new BlockRefList(), {
    style: BlockRefList.Style.NONE,
    blocks: [
      makeProto(new BlockRef(), {
        id: 'block-test-id',
        blockRefList: makeProto(new BlockRefList(), {
          style: BlockRefList.Style.BULLET,
          blocks: [
            makeProto(new BlockRef(), {
              id: 'nested-block-test-id',
            }),
          ],
        }),
      }),
    ],
  })

  expect(toBlockRefList(slateTree)).toEqual(expected)
})
