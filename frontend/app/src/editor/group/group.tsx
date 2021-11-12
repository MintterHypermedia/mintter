import {isFlowContent, isGroup, isGroupContent} from '@mintter/mttast'
import {css, styled} from '@mintter/ui/stitches.config'
import {forwardRef, PropsWithChildren} from 'react'
import type {Node, NodeEntry} from 'slate'
import {Editor, Transforms} from 'slate'
import {RenderElementProps} from 'slate-react'
import {EditorMode} from '../plugin-utils'
import type {EditorPlugin} from '../types'

export const ELEMENT_GROUP = 'group'

export const groupStyle = css({
  // margin: 0,
  // padding: 0,
  // position: 'relative',
  paddingLeft: '$8',
  // marginLeft: '-$8',
  [`&[data-element-type="orderedList"], &[data-element-type="unorderedList"]`]: {
    marginLeft: 0,
  },
  // boxShadow: '-0.1px 0 0 0 $colors$background-neutral-soft',
  // variants: {
  //   type: {
  //     group: {},
  //     orderedList: {
  //       counterReset: 'section',
  //     },
  //     unorderedList: {},
  //   },
  // },
})

export const GroupUI = styled('ul', groupStyle)

export const createGroupPlugin = (): EditorPlugin => ({
  name: ELEMENT_GROUP,
  renderElement:
    (editor) =>
    ({attributes, children, element}) => {
      if (isGroup(element)) {
        return (
          <Group mode={editor.mode} data-element-type={element.type} {...attributes}>
            {children}
          </Group>
        )
      }
    },
  configureEditor(editor) {
    if (editor.readOnly) return
    const {normalizeNode} = editor

    editor.normalizeNode = (entry) => {
      const [node, path] = entry
      if (isGroupContent(node)) {
        if (removeEmptyGroup(editor, entry)) return
        const parent = Editor.parent(editor, path)
        if (parent) {
          const [parentNode] = parent
          if (isGroupContent(parentNode)) {
            Transforms.unwrapNodes(editor, {at: path})
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
