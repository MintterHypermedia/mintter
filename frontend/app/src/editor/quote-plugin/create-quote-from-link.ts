import { getAbove } from '@udecode/slate-plugins-common'
import type { SPEditor } from '@udecode/slate-plugins-core'
import { Transforms, Path, Editor } from 'slate'
import type { ReactEditor } from 'slate-react'
import { ELEMENT_LINK } from '../link-plugin'
import type { EditorLink, EditorQuote } from '../types'
import { ELEMENT_QUOTE } from './create-quote-plugin'

export function createQuoteFromLink(editor: ReactEditor & SPEditor) {
  const link = getAbove<EditorLink>(editor, { match: { type: ELEMENT_LINK } })
  if (!link) return
  const [linkNode, linkPath] = link
  Editor.withoutNormalizing(editor, () => {
    Transforms.removeNodes(editor, { at: linkPath })
    Transforms.insertNodes<EditorQuote>(
      editor,
      {
        id: linkNode.id,
        url: linkNode.url,
        type: ELEMENT_QUOTE,
        children: [{ text: '' }],
      } as EditorQuote,
      { at: linkPath },
    )
    // hack to move the caret to the end of the quote after transforming it
    window.getSelection()?.removeAllRanges()
    Transforms.select(editor, Path.next(linkPath))
  })
}
