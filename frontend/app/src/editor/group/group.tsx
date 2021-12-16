import {isFlowContent, isGroup, isGroupContent} from '@mintter/mttast'
import {createId, statement} from '@mintter/mttast-builder'
import {css, styled} from '@mintter/ui/stitches.config'
import {forwardRef, PropsWithChildren} from 'react'
import {Editor, Element, Node, NodeEntry, Transforms} from 'slate'
import {RenderElementProps} from 'slate-react'
import {EditorMode} from '../plugin-utils'
import type {EditorPlugin} from '../types'
import {resetGroupingContent} from '../utils'

export const ELEMENT_GROUP = 'group'

export const groupStyle = css({
  paddingLeft: '$8',
  [`&[data-element-type="orderedList"], &[data-element-type="unorderedList"]`]: {
    marginLeft: 0,
  },
})

export const GroupUI = styled('ul', groupStyle)

export const createGroupPlugin = (): EditorPlugin => ({
  name: ELEMENT_GROUP,
  renderElement:
    (editor) =>
    ({attributes, children, element}) => {
      if (isGroup(element)) {
        return (
          <Group mode={editor.mode} data-element-type={element.type} {...attributes} css={{listStyleType: 'none'}}>
            {children}
          </Group>
        )
      }
    },
  configureEditor(editor) {
    if (editor.readOnly) return
    const {normalizeNode, deleteBackward} = editor

    editor.deleteBackward = (unit) => {
      if (resetGroupingContent(editor)) return
      deleteBackward(unit)
    }

    editor.normalizeNode = (entry) => {
      const [node, path] = entry
      if (Element.isElement(node) && isGroupContent(node)) {
        if (removeEmptyGroup(editor, entry)) return

        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && !isFlowContent(child)) {
            // inside group and not a flowcontent
            Transforms.wrapNodes(editor, statement({id: createId()}), {at: childPath})
            return
          }
        }
      }

      normalizeNode(entry)
    }

    return editor
  },
})

/**
 *
 * @param editor Editor
 * @param entry NodeEntry<GroupingContent>
 * @returns boolean | undefined
 *
 * when deleting statements we sometimes endup with empty groups. this methos removes them.
 */
export function removeEmptyGroup(editor: Editor, entry: NodeEntry<Node>): boolean | undefined {
  const [node, path] = entry
  if (isGroupContent(node)) {
    if (node.children.length == 1) {
      const children = Editor.node(editor, path.concat(0))
      if (!isFlowContent(children[0])) {
        Transforms.removeNodes(editor, {
          at: path,
        })
        return true
      }
    }
  }
}

export type GroupProps = PropsWithChildren<{
  mode: EditorMode
}> &
  Omit<RenderElementProps['attributes'], 'ref'>

export const Group = forwardRef<GroupProps, any>(({mode, ...props}: GroupProps, ref) => {
  if (mode == EditorMode.Embed || mode == EditorMode.Mention) {
    return null
  }

  return <GroupUI ref={ref as any} {...props} />
})
