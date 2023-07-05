import {Block} from '@mintter/shared'
import {describe, expect, test} from 'vitest'
import {editorBlockToServerBlock, extractContent} from '../editor-to-server'

describe('Editor to Server: ', () => {
  describe('Extract Content: ', () => {
    test('overlapping annotation', () => {
      const extracted = extractContent([
        {type: 'text', text: 'A', styles: {}},
        {type: 'text', text: 'B', styles: {bold: true}},
        {type: 'text', text: 'C', styles: {bold: true, italic: true}},
        {type: 'text', text: 'D', styles: {italic: true}},
        {type: 'text', text: 'E', styles: {}},
      ])
      expect(extracted).toEqual({
        text: 'ABCDE',
        annotations: [
          {
            type: 'strong',
            starts: [1],
            ends: [3],
          },
          {
            type: 'emphasis',
            starts: [2],
            ends: [4],
          },
        ],
      })
    })

    test('single annotation', () => {
      const extracted = extractContent([
        {type: 'text', text: 'Hello ', styles: {}},
        {type: 'text', text: 'world', styles: {bold: true}},
        {type: 'text', text: '!', styles: {}},
      ])
      expect(extracted).toEqual({
        text: 'Hello world!',
        annotations: [
          {
            type: 'strong',
            starts: [6],
            ends: [11],
          },
        ],
      })
    })
    test('simple marks kitchen sink', () => {
      const extracted = extractContent([
        {text: '0', type: 'text', styles: {bold: true}},
        {text: '1', type: 'text', styles: {italic: true}},
        {text: '2', type: 'text', styles: {underline: true}},
        {text: '3', type: 'text', styles: {strike: true}},
        {text: '4', type: 'text', styles: {code: true}},
      ])
      expect(extracted).toEqual({
        text: '01234',
        annotations: [
          {type: 'strong', starts: [0], ends: [1]},
          {type: 'emphasis', starts: [1], ends: [2]},
          {type: 'underline', starts: [2], ends: [3]},
          {type: 'strike', starts: [3], ends: [4]},
          {type: 'code', starts: [4], ends: [5]},
        ],
      })
    })
  })
  describe('Extract Links content: ', () => {
    test('single link', () => {
      const extracted = extractContent([
        {type: 'text', text: 'a', styles: {}},
        {
          type: 'link',
          content: [
            {type: 'text', text: 'good', styles: {bold: true}},
            {type: 'text', text: 'link', styles: {}},
          ],
          href: 'https://example.com',
        },
      ])
      expect(extracted).toEqual({
        text: 'agoodlink',
        annotations: [
          {
            type: 'strong',
            starts: [1],
            ends: [5],
          },
          {
            type: 'link',
            starts: [1],
            ends: [9],
            ref: 'https://example.com',
          },
        ],
      })
    })
  })

  // describe('Extract embed content', () => {
  //   test('single embed', () => {
  //     const extracted = extractContent([
  //       {type: 'text', text: 'Hello', styles: {}},
  //       {type: 'embed', ref: 'hd://foobar'},
  //     ])

  //     expect(extracted).toEqual({
  //       text: 'Hello ',
  //       annotations: [
  //         {
  //           type: 'embed',
  //           ref: 'hd://foobar',
  //           starts: [5],
  //           ends: [6],
  //           attributes: {},
  //         },
  //       ],
  //     })
  //   })
  // })
})
describe('editorBlockToServerBlock', () => {
  describe('Image block: ', () => {
    test('a image', () => {
      const eBlock = editorBlockToServerBlock({
        id: 'abc',
        type: 'image',
        children: [],
        content: [
          {
            type: 'text',
            text: 'alt',
            styles: {},
          },
        ],
        props: {
          url: '123',
          // why is this garbage required for image props??:
          backgroundColor: 'default',
          textColor: 'default',
          textAlignment: 'left',
        },
      })
      expect(eBlock).toEqual(
        new Block({
          id: 'abc',
          type: 'image',
          attributes: {},
          text: 'alt',
          annotations: [],
          ref: 'ipfs://123',
        }),
      )
    })

    describe('Embed block: ', () => {
      test('a embed', () => {
        const eBlock = editorBlockToServerBlock({
          id: 'abc',
          type: 'embed',
          children: [],
          content: [],
          props: {
            ref: 'hd://foo',
            // why is this garbage required for embed props??:
            backgroundColor: 'default',
            textColor: 'default',
            textAlignment: 'left',
          },
        })
        expect(eBlock).toEqual(
          new Block({
            id: 'abc',
            type: 'embed',
            attributes: {},
            ref: 'hd://foo',
          }),
        )
      })
    })
  })

  // describe('Embed block: ', () => {
  //   test('a embed', () => {
  //     const eBlock = editorBlockToServerBlock({
  //       id: 'abc',
  //       type: 'embed',
  //       children: [],
  //       content: [],
  //       props: {
  //         ref: 'hd://foobar',
  //         // TODO: remove this garbage for image props
  //         backgroundColor: 'default',
  //         textColor: 'default',
  //         textAlignment: 'left',
  //       },
  //     })
  //     expect(eBlock).toEqual(
  //       new Block({
  //         id: 'abc',
  //         type: 'embed',
  //         attributes: {},
  //         ref: 'hd://foobar',
  //       }),
  //     )
  //   })
  // })
})

describe('blockGroup types', () => {
  test('Default list', () => {
    const eBlock = editorBlockToServerBlock({
      id: 'abc',
      type: 'paragraph',
      content: [],
      props: {
        ref: 'hd://foo',
        // why is this garbage required for embed props??:
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left',
        childrenType: 'group',
      },
      children: [],
    })
    expect(eBlock).toEqual(
      new Block({
        id: 'abc',
        type: 'paragraph',
        attributes: {
          childrenType: 'group',
        },
      }),
    )
  })

  test('Unordered list', () => {
    const eBlock = editorBlockToServerBlock({
      id: 'abc',
      type: 'paragraph',

      content: [],
      props: {
        ref: 'hd://foo',
        // why is this garbage required for embed props??:
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left',
        childrenType: 'ul',
      },
      children: [],
    })
    expect(eBlock).toEqual(
      new Block({
        id: 'abc',
        type: 'paragraph',
        attributes: {
          childrenType: 'ul',
        },
      }),
    )
  })

  test('Ordered list', () => {
    const eBlock = editorBlockToServerBlock({
      id: 'abc',
      type: 'paragraph',

      content: [],
      props: {
        ref: 'hd://foo',
        // why is this garbage required for embed props??:
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left',
        childrenType: 'ol',
        start: '2',
      },
      children: [],
    })
    expect(eBlock).toEqual(
      new Block({
        id: 'abc',
        type: 'paragraph',
        attributes: {
          childrenType: 'ol',
          start: '2',
        },
      }),
    )
  })
  test('Blockquote list', () => {
    const eBlock = editorBlockToServerBlock({
      id: 'abc',
      type: 'paragraph',

      content: [],
      props: {
        ref: 'hd://foo',
        // why is this garbage required for embed props??:
        backgroundColor: 'default',
        textColor: 'default',
        textAlignment: 'left',
        childrenType: 'blockquote',
      },
      children: [],
    })
    expect(eBlock).toEqual(
      new Block({
        id: 'abc',
        type: 'paragraph',
        attributes: {
          childrenType: 'blockquote',
        },
      }),
    )
  })
})
