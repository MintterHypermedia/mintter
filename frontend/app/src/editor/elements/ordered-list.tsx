import {styled} from '@mintter/ui/stitches.config'
import type {EditorPlugin} from '../types'
import {groupStyle, removeEmptyGroup} from './group'

export const ELEMENT_ORDERED_LIST = 'orderedList'

export const OrderedList = styled('ol', groupStyle)

export const createOrderedListPlugin = (): EditorPlugin => ({
  name: ELEMENT_ORDERED_LIST,
  renderElement({attributes, children, element}) {
    if (element.type === ELEMENT_ORDERED_LIST) {
      return (
        <OrderedList
          type={element.type}
          data-grouping-type={element.type}
          start={element.start}
          /**
           * @todo proper handling of start property
           * @body OrderedLists now have a start property that indicates at which number the enumeration should start. The handling of this is quite hacky atm though. We should improve this.
           */
          style={{counterReset: `section ${element.start ? element.start - 1 : ''}`}}
          {...attributes}
        >
          {children}
        </OrderedList>
      )
    }
  },
  configureEditor(editor) {
    const {normalizeNode} = editor

    editor.normalizeNode = (entry) => {
      if (removeEmptyGroup(editor, entry)) return
      normalizeNode(entry)
    }

    return editor
  },
})
