import {MINTTER_LINK_PREFIX} from '@app/constants'
import {useDrag} from '@app/drag-context'
import {findPath} from '@app/editor/utils'
import {useFileIds} from '@app/file-provider'
import {
  FlowContent,
  GroupingContent,
  isFlowContent,
  isGroupContent,
  Paragraph,
  StaticParagraph as StaticParagraphType,
} from '@mintter/shared'
import {useMemo} from 'react'
import {Editor, Path} from 'slate'
import {ReactEditor, useSlateStatic} from 'slate-react'

export function useBlockProps(element: FlowContent) {
  let editor = useSlateStatic()
  let path = findPath(element)
  let parentGroup = Editor.above<GroupingContent>(editor, {
    match: isGroupContent,
    mode: 'lowest',
    at: path,
  })

  return useMemo(memoizedProps, [element, parentGroup])

  function memoizedProps() {
    return {
      blockProps: {
        'data-element-type': element.type,
        'data-block-id': element.id,
        'data-parent-group': parentGroup?.[0].type,
        'data-revision': element.revision,
      },
      parentNode: parentGroup?.[0],
      parentPath: parentGroup?.[1],
    }
  }
}

export function usePhrasingProps(
  editor: Editor,
  element: Paragraph | StaticParagraphType,
) {
  let [docId, version] = useFileIds()
  let dragService = useDrag()
  return useMemo(memoizeProps, [editor, docId, version, element])

  function memoizeProps() {
    let path = ReactEditor.findPath(editor, element)

    let parentBlock = Editor.above<FlowContent>(editor, {
      match: isFlowContent,
      mode: 'lowest',
      at: path,
    })

    let parentGroup = Editor.above<GroupingContent>(editor, {
      match: isGroupContent,
      mode: 'lowest',
      at: path,
    })

    let elementProps = {
      'data-element-type': element.type,
      'data-parent-block': parentBlock?.[0].id,
      'data-parent-group': parentGroup?.[0].type,
      'data-highlight': `${docId}/${parentBlock?.[0].id}`,
      'data-reference': version
        ? `${MINTTER_LINK_PREFIX}${docId}/${version}/${parentBlock?.[0].id}`
        : undefined,
    }

    // let dragProps = {
    //   onDragOver: (e: React.DragEvent) => {
    //     e.preventDefault()
    //     const domNode = ReactEditor.toDOMNode(editor, element)
    //     console.log(parentBlock?.[1])
    //     dragService?.send({
    //       type: 'DRAG.OVER',
    //       toPath: parentBlock?.[1],
    //       element: domNode as HTMLLIElement,
    //     })
    //   },
    // }

    return {
      elementProps,
      // dragProps,
      parentNode: parentBlock?.[0],
      parentPath: parentBlock?.[1],
    }
  }

  // export function useEmbedProps(element: Embed, docId: string) {
  //   let editor = useSlateStatic()

  //   let path = findPath(element)
  //   return useMemo(() => {
  //     if (!path) return
  //     let parentBlock = Editor.above<FlowContent>(editor, {
  //       match: isFlowContent,
  //       mode: 'lowest',
  //       at: path,
  //     })

  //     return {
  //       elementProps: {
  //         'data-element-type': element.type,
  //         'data-reference': `${docId}/${parentBlock?.[0].id}`,
  //         'data-highlight':
  //       },
  //       parentNode: parentBlock?.[0],
  //       parentPath: parentBlock?.[1],
  //     }
  //   }, [element, path, docId, editor])
  // }
}
