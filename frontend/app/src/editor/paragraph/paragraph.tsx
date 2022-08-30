import {useBlockTools} from '@app/editor/block-tools-context'
import {usePhrasingProps} from '@app/editor/editor-node-props'
import {useHover} from '@app/editor/hover-context'
import {phrasingStyles} from '@app/editor/styles'
import {
  isBlockquote,
  isCode,
  isParagraph,
  isPhrasingContent,
  Paragraph as ParagraphType,
} from '@app/mttast'
import {CSS} from '@app/stitches.config'
import {Box} from '@components/box'
import {useEffect} from 'react'
import {Node, Path, Transforms} from 'slate'
import {RenderElementProps} from 'slate-react'
import {EditorMode} from '../plugin-utils'
import type {EditorPlugin} from '../types'

export const ELEMENT_PARAGRAPH = 'paragraph'

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
    const {normalizeNode} = editor

    editor.normalizeNode = (entry) => {
      const [node, path] = entry

      if (isParagraph(node)) {
        for (const [child, childPath] of Node.children(editor, path)) {
          if (!isPhrasingContent(child)) {
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

function hoverStyles(id: string): CSS {
  return {
    [`[data-hover-block="${id}"] &:after`]: {
      backgroundColor: '$primary-component-bg-normal',
      opacity: 1,
    },
  }
}

function Paragraph({
  children,
  element,
  attributes,
  mode,
}: RenderElementProps & {mode: EditorMode; element: ParagraphType}) {
  let btService = useBlockTools()
  const hoverService = useHover()
  let {elementProps, parentNode} = usePhrasingProps(element)

  useEffect(() => {
    if (mode != EditorMode.Embed && mode != EditorMode.Mention) {
      if (attributes.ref.current) {
        btService.send({type: 'ENTRY.OBSERVE', entry: attributes.ref.current})
      }
    }
  }, [attributes.ref, btService, mode])

  if (mode == EditorMode.Embed || mode == EditorMode.Mention) {
    return (
      <Box
        as="span"
        {...attributes}
        // {...elementProps}
        css={hoverStyles(parentNode?.id)}
      >
        {children}
      </Box>
    )
  }

  if (isCode(parentNode)) {
    return (
      <Box
        as="pre"
        className={phrasingStyles({
          blockType: 'code',
          type: 'paragraph',
        })}
        css={hoverStyles(parentNode?.id)}
        {...attributes}
        {...elementProps}
        onMouseEnter={() => {
          hoverService.send({type: 'MOUSE_ENTER', blockId: parentNode?.id})
        }}
        onMouseLeave={() => {
          hoverService.send({type: 'MOUSE_LEAVE', blockId: parentNode?.id})
        }}
      >
        <code>{children}</code>
      </Box>
    )
  }

  if (isBlockquote(parentNode)) {
    return (
      <Box
        as="blockquote"
        {...attributes}
        {...elementProps}
        className={phrasingStyles({
          mode,
          type: 'paragraph',
          blockType: 'blockquote',
        })}
        css={hoverStyles(parentNode?.id)}
        onMouseEnter={() => {
          hoverService.send({type: 'MOUSE_ENTER', blockId: parentNode?.id})
        }}
        onMouseLeave={() => {
          hoverService.send({type: 'MOUSE_LEAVE', blockId: parentNode?.id})
        }}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      as="p"
      className={phrasingStyles({
        type: 'paragraph',
        blockType: parentNode?.type,
      })}
      css={hoverStyles(parentNode?.id)}
      {...attributes}
      {...elementProps}
      onMouseEnter={() => {
        hoverService.send({type: 'MOUSE_ENTER', blockId: parentNode?.id})
      }}
      onMouseLeave={() => {
        hoverService.send({type: 'MOUSE_LEAVE', blockId: parentNode?.id})
      }}
    >
      {children}
    </Box>
  )
}
