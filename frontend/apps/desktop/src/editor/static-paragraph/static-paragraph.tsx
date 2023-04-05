import {useDrag} from '@app/drag-context'
import {usePhrasingProps} from '@app/editor/editor-node-props'
import {EditorMode} from '@app/editor/plugin-utils'
import {useBlockObserve, useMouse} from '@app/mouse-context'
import {css} from '@app/stitches.config'
import {mergeRefs} from '@app/utils/mege-refs'
import {Box} from '@components/box'
import {
  isStaticParagraph,
  StaticParagraph as StaticParagraphType,
} from '@mintter/shared'
import {MouseEvent, useMemo, useRef} from 'react'
import {RenderElementProps, useSlate} from 'slate-react'
import type {EditorPlugin} from '../types'
import {Path} from 'slate'

export const ELEMENT_STATIC_PARAGRAPH = 'staticParagraph'

export const staticphrasingStyles = css({
  fontWeight: '$medium',
  marginTop: '.5em',
})

export const createStaticParagraphPlugin = (): EditorPlugin => ({
  name: ELEMENT_STATIC_PARAGRAPH,
  renderElement:
    (editor) =>
    ({element, children, attributes}) => {
      if (isStaticParagraph(element)) {
        return (
          <StaticParagraph
            mode={editor.mode}
            element={element}
            attributes={attributes}
          >
            {children}
          </StaticParagraph>
        )
      }
    },
})

function StaticParagraph({
  children,
  element,
  attributes,
  mode,
}: RenderElementProps & {mode: EditorMode; element: StaticParagraphType}) {
  let editor = useSlate()
  let dragService = useDrag()
  let {elementProps, parentPath} = usePhrasingProps(editor, element)

  let pRef = useRef<HTMLElement | undefined>()
  let otherProps = {
    ref: mergeRefs([attributes.ref, pRef]),
  }
  useBlockObserve(mode, pRef)

  let mouseService = useMouse()

  let dragProps = {
    onMouseOver: (e: MouseEvent) => {
      if (Path.isPath(parentPath)) {
        dragService?.send({
          type: 'DRAG.OVER',
          toPath: parentPath,
          element: null,
          currentPosX: e.clientX,
          currentPosY: e.clientY,
        })
      }
    },
  }

  let mouseProps =
    mode != EditorMode.Discussion
      ? {
          onMouseEnter: () => {
            mouseService.send({
              type: 'HIGHLIGHT.ENTER',
              ref: elementProps['data-highlight'] as string,
            })
          },
          onMouseLeave: () => {
            mouseService.send('HIGHLIGHT.LEAVE')
          },
        }
      : {}

  let as = useMemo(() => {
    const headingMap: {[key: number]: string} = {
      2: 'h2',
      4: 'h3',
      6: 'h4',
      8: 'h5',
      10: 'h6',
    }
    if (parentPath) {
      return headingMap[parentPath.length] || 'p'
    }

    return 'p'
  }, [parentPath])

  if (mode == EditorMode.Embed) {
    return (
      <Box as="span" {...attributes} {...otherProps}>
        {children}
      </Box>
    )
  }

  return (
    <Box
      as={as}
      {...attributes}
      {...elementProps}
      {...mouseProps}
      {...otherProps}
      {...dragProps}
    >
      {children}
    </Box>
  )
}