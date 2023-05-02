import {MINTTER_LINK_PREFIX} from '@mintter/shared'
import {findPath} from '@app/editor/utils'
import {useNavRoute} from '@app/utils/navigation'
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
      blockPath: path,
      blockProps: {
        'data-element-type': element.type,
        'data-block-id': element.id,
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
  let route = useNavRoute()
  return useMemo(memoizeProps, [editor, route, element])

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

    // const version = route.key == 'publication' ? route.versionId : undefined
    // const draftId = route.key == 'draft' ? route.draftId : undefined
    // const docId = route.key == 'publication' ? route.documentId : undefined

    let elementProps = {
      'data-element-type': element.type,
      'data-parent-block': parentBlock?.[0].id,
      'data-parent-group': parentGroup?.[0].type,
    }

    return {
      elementProps,
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
  //       },
  //       parentNode: parentBlock?.[0],
  //       parentPath: parentBlock?.[1],
  //     }
  //   }, [element, path, docId, editor])
  // }
}
