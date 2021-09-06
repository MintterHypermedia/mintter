import {Editor, Transforms, Path} from 'slate'
import type {Group} from '@mintter/mttast'
import {isGroupContent, isFlowContent} from '@mintter/mttast'
import type {EditorPlugin} from './types'

/**
 * This plugin handles the <Tab> interactions with the editor:
 * A. If the users cursor is at the start of a statement, the statement is moved up or down the hierarchy
 * B. Or if the cursor is somewhere else, the Tab character gets inserted
 */
export const createTabPlugin = (): EditorPlugin => {
  let editor: Editor
  return {
    name: 'tab',
    configureEditor: (e) => {
      editor = e
      return e
    },
    /*
     * @todo Fix the types for the event handlers
     * @body We need to add that the event functions accepts an extra parameter which is the editor. I dunno how to do it with the TS wizardry that is there lol (plugin-utils, line 60)
     */
    onKeyDown(e) {
      if (e.key === 'Tab' && editor.selection) {
        e.preventDefault()
        moveStatement(editor, e.shiftKey)
      }
    },
  }
}

function moveStatement(editor: Editor, up: boolean) {
  const [, statementPath] =
    Editor.above(editor, {
      at: editor.selection!,
      match: isFlowContent,
    }) || []

  if (!statementPath) throw new Error('found no parent statement')

  const [parentGroup, parentGroupPath] = Editor.parent(editor, statementPath)

  if (!up) {
    if (!Path.hasPrevious(statementPath)) return // there is no previous statement to move into

    const [previous, previousPath] =
      Editor.previous(editor, {
        at: statementPath,
      }) || []

    if (!isFlowContent(previous) || !previousPath) return
    const subGroup = previous.children[1] as Group

    // determine the correct path wether the previous statement already has a group of children or not
    const newPath = previousPath.concat(subGroup ? [1, subGroup.children.length] : [1])

    // if the previous statement doesn't have a group of children we need to create it first
    Editor.withoutNormalizing(editor, () => {
      if (!subGroup) {
        Transforms.wrapNodes(
          editor,
          {type: isGroupContent(parentGroup) ? parentGroup.type : 'group', children: []},
          {
            at: statementPath,
          },
        )
      }

      Transforms.moveNodes(editor, {
        at: statementPath,
        to: newPath,
      })
    })
  } else {
    // const [_, parentGroupPath] = Editor.parent(editor, statementPath)

    // find our parent groups parent group, this is where we want to move our statement into
    const [grandparentGroup, grandparentGroupPath] =
      Editor.above(editor, {
        at: parentGroupPath,
        match: isGroupContent,
      }) || []

    // if there is not grandparentGroup, it means were at the root level so do nothing
    if (!grandparentGroup || !grandparentGroupPath) return

    Transforms.moveNodes(editor, {
      at: statementPath,
      to: [...grandparentGroupPath, grandparentGroup.children.length],
    })
  }
}
