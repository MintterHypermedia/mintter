import {
  Document,
  BlockRefList,
  BlockRef,
  Block,
  Paragraph,
  InlineElement,
} from '@mintter/proto/v2/documents_pb'
import {toDocument} from '../transformers'
import {makeProto} from '../makeProto'

test('toDocument', () => {
  const expected = {
    document: makeProto(new Document(), {
      id: 'document-test',
      version: 'document-version',
      title: 'Demo Test Document',
      subtitle: '',
      author: 'horacio',
      blockRefList: makeProto(new BlockRefList(), {
        style: BlockRefList.Style.NONE,
        refs: [
          makeProto(new BlockRef(), {
            ref: 'test-id',
          }),
        ],
      }),
    }),
    blocks: [
      makeProto(new Block(), {
        id: 'test-id',
        paragraph: makeProto(new Paragraph(), {
          inlineElements: [
            makeProto(new InlineElement(), {
              text: 'Test block',
            }),
          ],
        }),
      }),
    ],
  }

  const result = toDocument({
    editorDocument: {
      id: 'document-test',
      version: 'document-version',
      title: 'Demo Test Document',
      blocks: [
        {
          type: 'block_list',
          listType: BlockRefList.Style.NONE,
          children: [
            {
              type: 'block',
              id: 'test-id',
              children: [
                {
                  type: 'p',
                  children: [
                    {
                      text: 'Test block',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    blockList: [
      {
        type: 'block',
        id: 'test-id',
        children: [
          {
            type: 'p',
            children: [
              {
                text: 'Test block',
              },
            ],
          },
        ],
      },
    ],
    author: 'horacio',
  })

  expect(result).toEqual(expected)
})
