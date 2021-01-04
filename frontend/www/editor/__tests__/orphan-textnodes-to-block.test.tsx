/** @jsx jsx */
import {jsx} from 'test/jsx'
import {cleanNode} from 'test/hyperscript/clean-node'
import {Editor} from 'slate'
import {orphanTextNodesToBlock} from '../../shared/use-editor'
import {createPlugins} from '../plugins'
import {options} from '../options'
import {deserializeHTMLToDocumentFragment} from '@udecode/slate-plugins'

test('should wrap texts with paragraphs', () => {
  const plugins = createPlugins(options)
  const input = deserializeHTMLToDocumentFragment({
    plugins,
    element: `<h1>heading 1</h1><h2>heading 2</h2><h3>heading 3</h3><p>paragraph</p><ul><li>unordered list item</li></ul><ol><li>ordered list item</li></ol><blockquote>blockquote</blockquote><a href="https://mintter.com">link</a>`,
  })
  // console.log(
  //   '🚀 ~ file: orphan-textnodes-to-block.test.tsx ~ line 15 ~ test ~ input',
  //   input,
  // )

  const output = ((
    <editor>
      <hp>
        <htext>heading 1</htext>
      </hp>
      <hp>
        <htext>heading 2</htext>
      </hp>
      <hp>
        <htext>heading 3</htext>
      </hp>
      <hp>
        <htext>paragraph</htext>
      </hp>
      <blockList>
        <hp>
          <htext>unordered list item</htext>
        </hp>
      </blockList>
      <blockList>
        <hp>
          <htext>ordered list item</htext>
        </hp>
      </blockList>
      <hp>
        <htext>blockquote</htext>
      </hp>
      <hp>
        <htext underline={true}>link</htext>
      </hp>
    </editor>
  ) as any) as Editor

  const result = output.children.map(cleanNode)
  expect(input.map(orphanTextNodesToBlock())).toEqual(result)
})
