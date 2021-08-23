import {styled} from '@mintter/ui/stitches.config'
import type {EditorPlugin} from '../types'
import {Text} from '@mintter/ui/text'
import {Node, Path, Editor} from 'slate'
import {ReactEditor, useSlateStatic} from 'slate-react'
import {useMemo} from 'react'
import {Transforms} from 'slate'
import {isParagraph} from '@mintter/mttast'
import {createId, statement} from '@mintter/mttast-builder'

export const ELEMENT_PARAGRAPH = 'paragraph'

const Paragraph = styled(Text, {
  "&[data-parent='blockquote']": {
    backgroundColor: '$background-muted',
    padding: '$7',
    borderRadius: '$2',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '',
      position: 'absolute',
      left: 0,
      top: 0,
      width: 4,
      height: '$full',
      backgroundColor: '$secondary-soft',
    },
  },
})

export const createParagraphPlugin = (): EditorPlugin => ({
  name: ELEMENT_PARAGRAPH,
  renderElement({attributes, children, element}) {
    if (element.type === ELEMENT_PARAGRAPH) {
      const editor = useSlateStatic()
      const path = ReactEditor.findPath(editor, element)
      const parent = useMemo(() => Editor.parent(editor, path))
      return (
        <Paragraph
          as="p"
          alt
          size="4"
          css={{paddingLeft: '$2'}}
          data-parent={parent ? parent[0].type : null}
          {...attributes}
        >
          {children}
        </Paragraph>
      )
    }
  },
  configureEditor: (editor) => {
    const {normalizeNode, insertNode} = editor

    editor.normalizeNode = (entry) => {
      const [node, path] = entry
      if (isParagraph(node)) {
        if (Path.hasPrevious(path)) {
          const prevNode = Node.get(editor, Path.previous(path))
          /*
           * @todo if the selection is in the beginning, then wrap the first paragraph with a new statement
           * @body Issue Body
           */
          Transforms.wrapNodes(editor, statement({id: createId()}, []), {
            at: Editor.isEmpty(editor, prevNode) ? Path.previous(path) : path,
          })
          return
        }
      }
      normalizeNode(entry)
    }

    return editor
  },
})
