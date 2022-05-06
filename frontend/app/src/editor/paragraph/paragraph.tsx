import {css} from '@app/stitches.config'
import {Box} from '@components/box'
import {
  FlowContent,
  isBlockquote,
  isCode,
  isGroupContent,
  isParagraph,
  isPhrasingContent,
} from '@mintter/mttast'
import {useMemo} from 'react'
import {Editor, Element, Node, Path, Transforms} from 'slate'
import {RenderElementProps, useSlateStatic} from 'slate-react'
import {useHover} from '../hover-context'
import {EditorMode} from '../plugin-utils'
import type {EditorPlugin} from '../types'
import {findPath} from '../utils'

export const ELEMENT_PARAGRAPH = 'paragraph'

export const paragraphStyles = css({
  fontFamily: '$alt',
  margin: 0,
  padding: 0,
  lineHeight: '$3',
  '&[data-parent-type=blockquote]': {
    fontStyle: 'italic',
    color: '$text-alt',
  },
  '&[data-parent-type=code]': {
    fontFamily: 'monospace',
    margin: 0,
    padding: 0,
    backgroundColor: '$background-neutral-soft',
    paddingHorizontal: '$4',
  },
})
export const createParagraphPlugin = (): EditorPlugin => ({
  name: ELEMENT_PARAGRAPH,
  renderElement:
    (editor) =>
    ({element, children, attributes}) => {
      if (isParagraph(element)) {
        return (
          <Paragraph
            mode={editor.mode}
            element={element}
            attributes={attributes}
          >
            {children}
          </Paragraph>
        )
      }
    },
  configureEditor: (editor) => {
    if (editor.mode) return
    const {normalizeNode} = editor

    editor.normalizeNode = (entry) => {
      const [node, path] = entry
      if (Element.isElement(node) && isParagraph(node)) {
        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && !isPhrasingContent(child)) {
            Transforms.moveNodes(editor, {at: childPath, to: Path.next(path)})
            return
          }
        }
      }
      normalizeNode(entry)
    }

    return editor
  },
})

function Paragraph({
  children,
  element,
  attributes,
  mode,
}: RenderElementProps & {mode: EditorMode}) {
  const editor = useSlateStatic()
  const path = findPath(element)
  const parentNode = Node.parent(editor, path)
  const hoverService = useHover()
  const parentGroup = useParentGroup(editor, path)
  let as =
    mode == EditorMode.Embed || mode == EditorMode.Mention
      ? 'span'
      : isCode(parentNode)
      ? 'span'
      : isBlockquote(parentNode)
      ? 'blockquote'
      : parentGroup == 'orderedList' || parentGroup == 'unorderedList'
      ? 'li'
      : 'p'

  return (
    <Box
      className={paragraphStyles()}
      as={as}
      data-element-type={element.type}
      css={{
        userSelect: 'text',
        display:
          mode == EditorMode.Embed
            ? 'inline'
            : parentGroup == 'orderedList' || parentGroup == 'unorderedList'
            ? 'list-item'
            : 'inherit',
        marginLeft:
          mode == EditorMode.Embed
            ? 0
            : parentGroup == 'orderedList' || parentGroup == 'unorderedList'
            ? 16
            : 0,
        lineHeight: '$4',
        '&::marker': {
          color: '$text-muted',
          fontSize: '$2',
        },
      }}
      data-parent-type={(parentNode as FlowContent)?.type}
      onMouseEnter={() =>
        hoverService.send({
          type: 'MOUSE_ENTER',
          blockId: (parentNode as FlowContent).id,
        })
      }
      {...attributes}
    >
      {children}
    </Box>
  )
}

function useParentGroup(editor: Editor, path: Path) {
  return useMemo(() => {
    const entry = Editor.above(editor, {
      at: path,
      match: isGroupContent,
    })

    if (entry) {
      return entry[0].type || 'group'
    }
  }, [path])
}
