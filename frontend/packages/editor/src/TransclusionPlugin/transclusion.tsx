import * as React from 'react'
import {getRenderElement} from '@udecode/slate-plugins'
import {Draggable} from 'react-beautiful-dnd'
import {useSelected, ReactEditor, useEditor} from 'slate-react'
import {useBlockTools} from '../BlockPlugin/blockToolsContext'
import {BlockControls} from '../components/blockControls'
import {mergeRefs} from '../mergeRefs'

export const ELEMENT_TRANSCLUSION = 'transclusion'

export const Transclusion = (
  {attributes, children, element, className},
  ref,
) => {
  const {id} = element
  const selected = useSelected()
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)
  const {id: blockId, setBlockId} = useBlockTools()
  return (
    <Draggable
      key={element.id}
      draggableId={element.id}
      index={path[path.length - 1]}
    >
      {provided => (
        <div
          {...attributes}
          {...provided.draggableProps}
          ref={mergeRefs(provided.innerRef, ref, attributes.ref)}
          className={`p-4 border-2 relative ${
            selected ? 'border-info' : 'border-transparent'
          }${className ? className : ''}`}
          onMouseLeave={() => setBlockId(null)}
          onMouseEnter={() => setBlockId(element.id)}
        >
          <BlockControls
            isHovered={blockId === element.id}
            path={path}
            dragHandleProps={provided.dragHandleProps}
          />
          <div contentEditable={false}>Transclusions: {id}</div>
          {children}
        </div>
      )}
    </Draggable>
  )
}

export const TransclusionElement = React.forwardRef(Transclusion)

export const TRANSCLUSION_OPTIONS = {
  transclusion: {
    component: TransclusionElement,
    type: ELEMENT_TRANSCLUSION,
    rootProps: {},
  },
}

export const renderElementTransclusion = (options?: any) => {
  const {transclusion} = options

  return getRenderElement(transclusion)
}
