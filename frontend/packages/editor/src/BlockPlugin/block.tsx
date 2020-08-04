import React, {RefObject} from 'react'
// import {Path, Transforms} from 'slate'
// import {Transforms} from 'slate'
import {RenderElementProps, ReactEditor, useEditor} from 'slate-react'
// import {Icons} from '../components/icons'
import {Editor} from '../editor'
import {Draggable} from 'react-beautiful-dnd'
import {css} from 'emotion'
import Tippy from '@tippyjs/react'
import {useHelper} from '../HelperPlugin'
// import Tippy from '@tippyjs/react'

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean)
  if (!filteredRefs.length) return null
  if (filteredRefs.length === 0) return filteredRefs[0]
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst)
      } else if (ref) {
        ref.current = inst
      }
    }
  }
}

function Block({path, className = '', ...props}) {
  return (
    <div
      className={`relative px-8 py-2 hover:bg-background-muted transition duration-200 rounded ${className}`}
      {...props}
    />
  )
}

export function EditableBlockElement(
  {children, element, attributes}: RenderElementProps,
  ref: RefObject<HTMLDivElement>,
) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)
  const blockChars = Editor.charCount(editor, path)
  const [isHover, setHover] = React.useState<boolean>(false)
  const [, setVisible] = React.useState<boolean>(true)
  // const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const {setTarget} = useHelper()

  function handleMouseEnter() {
    setHover(true)
  }

  function handleMouseLeave() {
    setHover(false)
    hide()
  }

  function onAddClicked(e) {
    console.log('onAddClicked -> e', e.target)
    e.preventDefault()
    setTarget()
  }

  const formatter = new Intl.NumberFormat('en-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumSignificantDigits: 3,
  })

  const price = formatter.format(blockChars * 0.0001)

  /*

  - click button
  - set target range (btn or path??)
  - listen to keydown events
  - 
  */

  return (
    <Draggable key={element.id} draggableId={element.id} index={path[0]}>
      {(provided, snapshot) => {
        console.log('BLOCK: provided', {provided, snapshot})

        return (
          <div
            ref={mergeRefs(provided.innerRef, ref, attributes.ref)}
            {...provided.draggableProps}
            className="group first:mt-8"
            data-slate-type={element.type}
            data-slate-node={attributes['data-slate-node']}
          >
            <Block
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              path={path}
            >
              <div
                className={`absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center mt-3 ${css`
                  transform: translateX(-4.5rem);
                `}`}
                contentEditable={false}
              >
                <Tippy
                  delay={300}
                  content={
                    <span
                      className={`px-2 py-1 text-xs font-light transition duration-200 rounded bg-muted-hover ${css`
                        background-color: #3f3f3f;
                        color: #ccc;
                      `}`}
                    >
                      Add or edit block
                    </span>
                  }
                >
                  <button
                    onClick={onAddClicked}
                    className="rounded-sm bg-transparent hover:bg-background-muted w-8 h-8 p-1 mr-2"
                  >
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M12.667 8.667h-4v4H7.334v-4h-4V7.334h4v-4h1.333v4h4v1.333z"
                        fill="#3F3F3F"
                      />
                    </svg>
                  </button>
                </Tippy>
                <Tippy
                  delay={300}
                  content={
                    <span
                      className={`px-2 py-1 text-xs font-light transition duration-200 rounded bg-muted-hover ${css`
                        background-color: #3f3f3f;
                        color: #ccc;
                      `}`}
                    >
                      Drag to move
                    </span>
                  }
                >
                  <div
                    className="rounded-sm bg-transparent hover:bg-background-muted w-6 h-8 p-1"
                    {...provided.dragHandleProps}
                  >
                    <svg
                      width="1em"
                      height="1.5em"
                      viewBox="0 0 16 24"
                      fill="none"
                    >
                      <path
                        d="M3.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        fill="#3F3F3F"
                      />
                    </svg>
                  </div>
                </Tippy>
              </div>
              <div contentEditable={false} className="theme-invert">
                <div
                  className={`absolute top-0 right-0 select-none -mt-6 -mr-4 rounded shadow-md transition duration-200 flex items-center pl-2 text-xs leading-none text-body bg-black py-2 ${
                    isHover
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
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
  ref: RefObject<HTMLDivElement>,
) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)

  return (
    <Block path={path} data-slate-type={element.type} ref={ref} {...rest}>
      {children}
    </Block>
  )
}

// TODO: (Horacio) Fixme types
export const EditableBlock = React.forwardRef(EditableBlockElement as any)
export const ReadOnlyBlock = React.forwardRef(ReadonlyBlock as any)
