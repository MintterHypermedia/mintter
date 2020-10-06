import {useDndBlock} from '@udecode/slate-plugins'
import {mergeRefs} from '../../mergeRefs'
import React from 'react'
import {BlockControls} from '../../components/blockControls'
import {useBlockTools} from './blockToolsContext'
import {ReactEditor, useEditor} from 'slate-react'

export function DragDrop({element, componentRef, children}: any) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)
  const blockRef = React.useRef<HTMLDivElement>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const multiRef = mergeRefs(componentRef, rootRef)
  const {dropLine, dragRef} = useDndBlock({
    id: element.id,
    blockRef,
  })

  const dragWrapperRef = React.useRef(null)
  const multiDragRef = mergeRefs(dragRef, dragWrapperRef)

  const {id: blockId, setBlockId} = useBlockTools()

  return (
    <div ref={multiRef}>
      <div
        className="relative"
        ref={blockRef}
        onMouseLeave={() => setBlockId(null)}
        onMouseEnter={() => setBlockId(element.id)}
      >
        <BlockControls
          element={element}
          path={path}
          show={blockId === element.id}
          dragRef={multiDragRef}
        />
        {children}

        {!!dropLine && (
          <div
            className={`h-1 w-full bg-blue-300 absolute`}
            style={{
              top: dropLine === 'top' ? -1 : undefined,
              bottom: dropLine === 'bottom' ? -1 : undefined,
            }}
            contentEditable={false}
          />
        )}
      </div>
    </div>
  )
}
