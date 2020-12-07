import {ReactEditor} from 'slate-react'
import {
  Editor,
  //  Element,
  Node,
  Path,
  Transforms,
} from 'slate'
import {
  isBlockAboveEmpty,
  isFirstChild,
  isSelectionAtBlockStart,
  onKeyDownResetBlockType,
} from '@udecode/slate-plugins'
import {insertBlockItem} from './insertBlockItem'
import {moveBlockItemUp} from './moveBlockItemUp'
import {
  isSelectionInBlockItem,
  isSelectionInTransclusion,
} from './isSelectionInBlockItem'
import {unwrapBlockList} from './unwrapBlockList'
import {avoidMultipleRootChilds} from './utils/avoidMultipleRootChilds'
import {avoidMultipleBlockChilds} from './utils/avoidMultipleBlockChilds'
import {ELEMENT_TRANSCLUSION} from '../TransclusionPlugin'

export const withMintter = options => <T extends ReactEditor>(editor: T) => {
  const {p, block} = options
  const {insertBreak, deleteBackward, normalizeNode} = editor

  const resetBlockTypesListRule = {
    types: [block.type],
    defaultType: p.type,
    onReset: (_editor: Editor) => unwrapBlockList(_editor, options),
  }

  editor.insertBreak = () => {
    console.log('withMintter => insertBreak')
    let res = isSelectionInBlockItem(editor, options)

    let moved: boolean | undefined
    if (res && isBlockAboveEmpty(editor)) {
      const {blockListNode, blockListPath, blockPath} = res
      moved = moveBlockItemUp(
        editor,
        blockListNode,
        blockListPath,
        blockPath,
        options,
      )

      if (moved) return

      if (blockListPath.length === 1) return
    }

    const didReset = onKeyDownResetBlockType({
      rules: [
        {
          ...resetBlockTypesListRule,
          predicate: () => !moved && isBlockAboveEmpty(editor),
        },
      ],
    })(null, editor)
    if (didReset) return

    /**
     * Add a new list item if selection is in a LIST_ITEM > p.type.
     */
    if (!moved) {
      const inserted = insertBlockItem(editor, options)
      if (inserted) return
    }

    insertBreak()
  }

  editor.deleteBackward = unit => {
    let res = isSelectionInBlockItem(editor, options)

    if (!res) {
      res = isSelectionInTransclusion(editor, options)
    }

    let moved: boolean | undefined
    if (res && isSelectionAtBlockStart(editor)) {
      const {blockListNode, blockListPath, blockNode, blockPath} = res

      moved = moveBlockItemUp(
        editor,
        blockListNode,
        blockListPath,
        blockPath,
        options,
      )
      if (moved) return

      // if blockList is length 1
      if (blockListPath.length === 1) {
        // blockListPath is first level

        if (blockNode.children.length > 1) {
          // block has a blockList as child
          // move childs to the outer list
          Transforms.moveNodes(editor, {at: blockPath.concat(1), to: blockPath})
          Transforms.unwrapNodes(editor, {at: blockPath})

          Transforms.select(editor, Editor.start(editor, blockPath))
        } else {
          // block has no childs, delete!!
          if (blockListNode.children.length > 1) {
            // block is not the only Child

            if (Node.string(blockNode)) {
              console.log('remove: TIENE contenido!')
              if (!isFirstChild(blockPath)) {
                console.log('remove: NO es el primer hijo!')
                const previousEntry = Editor.previous(editor, {
                  at: blockPath,
                })
                if (previousEntry) {
                  const [prevNode, prevPath] = previousEntry
                  if (prevNode.type === ELEMENT_TRANSCLUSION) {
                    console.log('PREVIOUS IS TRANSCLUSION')
                    Transforms.select(editor, prevPath)
                    return
                  }
                }
                moveContentToAboveBlock(editor, blockPath)
              }
            } else {
              console.log('remove: NO tiene contenido!')
              Transforms.removeNodes(editor, {at: blockPath})
            }
          }
        }

        return
      }
    }

    const didReset = onKeyDownResetBlockType({
      rules: [
        {
          ...resetBlockTypesListRule,
          predicate: () => !moved && isSelectionAtBlockStart(editor),
        },
      ],
    })(null, editor)
    if (didReset) return

    deleteBackward(unit)
  }

  editor.normalizeNode = entry => {
    if (avoidMultipleRootChilds(editor)) return
    if (avoidMultipleBlockChilds(editor, entry)) return

    return normalizeNode(entry)
  }

  return editor
}

function moveContentToAboveBlock(editor, path) {
  let blockPathAbove = Path.previous(path)
  let pPathDestination = blockPathAbove.concat(1)

  // TODO: check if both children are the same type to really merge it.

  Transforms.mergeNodes(editor, {at: path})
  Transforms.mergeNodes(editor, {at: pPathDestination})
}
