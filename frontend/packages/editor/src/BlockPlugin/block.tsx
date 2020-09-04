import React from 'react'
import {RenderElementProps, ReactEditor, useEditor} from 'slate-react'
import {Editor} from '../editor'
import {Draggable} from 'react-beautiful-dnd'
import {mergeRefs} from '../mergeRefs'
import {useBlockTools} from './blockToolsContext'
import {BlockControls} from '../components/blockControls'

function Block({className = '', ...props}) {
  return <div className={`relative pl-4 pr-0 py-2 ${className}`} {...props} />
}

export function EditableBlockElement(
  {children, element, attributes}: RenderElementProps,
  ref: React.RefObject<HTMLDivElement>,
) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)
  const blockChars = Editor.charCount(editor, path)
  const {id: blockId, setBlockId} = useBlockTools()

  const formatter = new Intl.NumberFormat('en-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumSignificantDigits: 3,
  })

  const price = formatter.format(blockChars * 0.0001)

  return (
    <Draggable
      key={element.id}
      draggableId={element.id}
      index={path[path.length - 1]}
    >
      {provided => {
        return (
          <div
            ref={mergeRefs(provided.innerRef, ref, attributes.ref)}
            {...provided.draggableProps}
            data-slate-type={element.type}
            data-slate-node={attributes['data-slate-node']}
            onMouseLeave={() => setBlockId(null)}
            onMouseEnter={() => setBlockId(element.id)}
          >
            <Block>
              <BlockControls
                isHovered={blockId === element.id}
                path={path}
                dragHandleProps={provided.dragHandleProps}
              />
              <div contentEditable={false} className="theme-invert">
                <div
                  className={`absolute top-0 right-0 select-none -mt-6 -mr-4 rounded shadow-md transition duration-200 flex items-center pl-2 text-xs leading-none text-body bg-black py-2 pointer-events-none ${
                    blockId === element.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className={`text-body-muted border-r px-2 text-xs`}>
                    <span>Characters:</span>{' '}
                    {/* TODO: FIX avoid characters to jump when change chars number */}
                    <span className={`inline-block text-right text-body-muted`}>
                      {blockChars}
                    </span>
                  </p>
                  <p className="px-2 text-body-muted text-xs">
                    Royalties: {price}
                  </p>
                </div>
              </div>
              {children}
            </Block>
          </div>
        )
      }}
    </Draggable>
  )
}

export function ReadonlyBlock(
  {children, element, ...rest}: RenderElementProps,
  ref: React.RefObject<HTMLDivElement>,
) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)

  return (
    <Block
      path={path}
      data-slate-type={element.type}
      innerRef={ref as any}
      {...rest}
    >
      {children}
    </Block>
  )
}

// TODO: (Horacio) Fixme types
export const EditableBlock = React.forwardRef(EditableBlockElement as any)
export const ReadOnlyBlock = React.forwardRef(ReadonlyBlock as any)
