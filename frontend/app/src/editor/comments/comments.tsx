import {EditorMode} from '@app/editor/plugin-utils'
import {EditorPlugin} from '@app/editor/types'
import {isParagraph} from '@mintter/shared'
import {Range} from 'slate'
import {ReactEditor} from 'slate-react'

const MARK_CONVERSATIONS = 'conversations'

export function createCommentsPlugin(): EditorPlugin {
  return {
    name: MARK_CONVERSATIONS,
    apply: EditorMode.Publication,
    renderLeaf:
      () =>
      ({attributes, children, leaf}) => {
        if (typeof leaf.conversations !== 'undefined' && leaf.text) {
          return (
            <span
              style={
                leaf.conversations.length >= 3
                  ? {
                      backgroundColor: 'var(--highlight-surface4)',
                      borderBottom: '2px solid var(--highlight-surface4)',
                    }
                  : leaf.conversations?.length == 2
                  ? {
                      backgroundColor: 'var(--highlight-surface3)',
                      borderBottom: '2px solid var(--highlight-surface3)',
                    }
                  : {
                      backgroundColor: 'var(--highlight-surface1)',
                      borderBottom: '2px solid var(--highlight-surface2)',
                    }
              }
              {...attributes}
            >
              {children}
            </span>
          )
        }
      },
    configureEditor(editor) {
      const {apply} = editor

      editor.apply = (op) => {
        /**
         * In order to receive just one particular type of event in the editor (set_selection), we need to override the `apply` hook in the editor
         */
        if (op.type == 'set_selection') {
          // check if the new Selection is a Range or not. If it is, that generally says that the selection has no offset, which means is collapsed. It jumps from one Point to another.

          if (Range.isRange(op.newProperties)) {
            // we are just being 100% sure the selection is not collapsed before we really apply the operation into the editor.
            if (!Range.isCollapsed(op.newProperties)) {
              apply(op)
            } else {
              // here we are blurring the editor since we don't want to show the cursor (caret) in this mode. this is just a "selection mode".
              ReactEditor.blur(editor)
            }
          } else {
            // apply the operation for any `newProperties` that are not ranges (usually this is changing the offset of the selection)
            apply(op)
          }
        } else if (op.type == 'set_node') {
          if (
            'conversations' in op.newProperties ||
            'conversations' in op.properties
          ) {
            apply(op)
          }
        } else if (op.type == 'split_node') {
          apply(op)
        } else if (op.type == 'insert_node' || op.type == 'remove_node') {
          if (isParagraph(op.node)) {
            apply(op)
          }
        } else {
          ReactEditor.blur(editor)
        }
      }
    },
  }
}
