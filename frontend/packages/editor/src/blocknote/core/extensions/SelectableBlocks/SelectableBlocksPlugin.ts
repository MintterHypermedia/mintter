import {Node} from 'prosemirror-model'
import {
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

export const createSelectableBlocksPlugin = () => {
  return new Plugin({
    key: new PluginKey('SelectableBlocksPlugin'),
    props: {
      handleClickOn: (
        view: EditorView,
        _,
        node: Node,
        nodePos: number,
        event: MouseEvent,
      ) => {
        if (!view.editable) return false
        if (
          // @ts-ignore
          (node.type.name === 'image' && event.target?.nodeName === 'IMG') ||
          ['file', 'embed', 'video'].includes(node.type.name)
        ) {
          let tr = view.state.tr
          const selection = NodeSelection.create(view.state.doc, nodePos)
          tr = tr.setSelection(selection)
          view.dispatch(tr)
          return true
        }
        return false
      },
    },
  })
}
