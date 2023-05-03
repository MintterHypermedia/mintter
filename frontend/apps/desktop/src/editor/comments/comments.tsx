import {useConversations} from '@app/editor/comments/conversations-context'
import {EditorMode} from '@app/editor/plugin-utils'
import {EditorPlugin} from '@app/editor/types'
import {windowSend} from '@app/ipc'
import {isParagraph} from '@mintter/shared'
import {MouseEventHandler, useEffect, useMemo, useRef} from 'react'
import {Range, SetNodeOperation} from 'slate'
import {ReactEditor} from 'slate-react'

const MARK_CONVERSATIONS = 'conversations'

export function createCommentsPlugin(): EditorPlugin {
  return {
    name: MARK_CONVERSATIONS,
    apply: EditorMode.Publication,
    renderLeaf:
      () =>
      ({attributes, children, leaf}) => {
        let {highlights} = useConversations()
        let ref = useRef<HTMLSpanElement>(null)
        const emitSelectorClick: MouseEventHandler = (e) => {
          e.preventDefault()
          windowSend('selector_click', {
            conversations: leaf.conversations,
          })
        }
        let highlight = useMemo(
          () => highlights.some((c) => leaf.conversations?.includes(c)),
          [highlights],
        )

        useEffect(() => {
          if (highlight && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'})
          }
        }, [highlights])

        if (typeof leaf.conversations !== 'undefined' && leaf.text) {
          let spanStyle = null
          if (highlight) {
            spanStyle = {
              backgroundColor: 'var(--highlight-surface3)',
              borderBottom: '2px solid var(--highlight-surface3)',
            }
          } else if (leaf.conversations.length >= 3) {
            spanStyle = {
              backgroundColor: 'var(--highlight-surface3)',
              borderBottom: '2px solid var(--highlight-surface3)',
            }
          } else if (leaf.conversations.length >= 2) {
            spanStyle = {
              backgroundColor: 'var(--highlight-surface2)',
              borderBottom: '2px solid var(--highlight-surface3)',
            }
          } else {
            spanStyle = {
              backgroundColor: 'var(--highlight-surface1)',
              borderBottom: '2px solid var(--highlight-surface2)',
            }
          }
          return (
            <span
              ref={ref}
              onClick={emitSelectorClick}
              style={spanStyle}
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
            if (
              //@ts-ignore
              (op.newProperties?.conversations as Array<string>)?.includes(
                'current',
              )
            ) {
              // need to add the current conversation
              //@ts-ignore
              if ((op.properties?.conversations as Array<string>)?.length) {
                // check if current properties have conversations in it
                apply({
                  ...op,
                  newProperties: {
                    //@ts-ignore
                    conversations: op.properties.conversations.concat(
                      //@ts-ignore
                      op.newProperties.conversations,
                    ),
                  },
                } as SetNodeOperation)
                return
              } else {
                apply(op)
              }
            }

            // if newProperties is empty AND current properties have the current conversation, just remove the current from the text
            else if (
              isObjectEmpty(op.newProperties) &&
              //@ts-ignore
              (op.properties?.conversations as Array<string>)?.includes(
                'current',
              )
            ) {
              // remove current conversation from text
              //@ts-ignore
              let convs = op.properties?.conversations as Array<string>
              apply({
                ...op,
                newProperties:
                  convs?.length == 1
                    ? {}
                    : {
                        conversations: convs.filter((c) => c != 'current'),
                      },
              })
            }
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

function isObjectEmpty(obj: unknown) {
  return (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}
