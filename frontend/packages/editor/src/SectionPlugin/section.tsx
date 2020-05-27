import React, {RefObject} from 'react'
import {Transforms} from 'slate'
import {RenderElementProps, ReactEditor, useEditor} from 'slate-react'
import {Icons} from '../components/icons'
import {Editor} from '../editor'
import {css} from 'emotion'
import Tippy from '@tippyjs/react'

// interface SectionElementProps extends Omit<RenderElementProps, 'element'> {
//   element?: SlateSection
// }

export function Section(
  {children, element, ...rest}: RenderElementProps,
  ref: RefObject<HTMLDivElement>,
) {
  const editor = useEditor()
  const path = ReactEditor.findPath(editor, element)
  const sectionChars = Editor.charCount(editor, path)
  const [isHover, setHover] = React.useState<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(true)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  function handleMouseEnter() {
    setHover(true)
  }

  function handleMouseLeave() {
    setHover(false)
    hide()
  }

  return (
    <div
      {...rest}
      data-slate-type={element.type}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-8 pt-12 pb-16 group transition duration-200 ${
        element.active ? 'bg-background-muted' : ''
      } ${css`
        &:after {
          display: ${path[0] === 0 ? 'none' : 'block'};
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          z-index: 100;
          background-image: linear-gradient(
            to right,
            black 33%,
            rgba(255, 255, 255, 0) 0%
          );
          background-position: bottom;
          background-size: 10px 2px;
          background-repeat: repeat-x;
        }

        &:first {
          &:after {
            display: none;
          }
        }
      `}`}
    >
      <div
        contentEditable={false}
        className={`absolute top-0 right-0 select-none mt-4 mr-4 bg-background-toolbar rounded shadows-md transition duration-200 theme-dark flex items-center pl-2 text-xs leading-none text-body ${
          isHover
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="font-bold border-r px-2">Section text</p>
        <p className={`text-body border-r px-2`}>
          <span>Characters:</span>{' '}
          {/* TODO: FIX avoid characters to jump when change chars number */}
          <span className={`inline-block text-right`}>{sectionChars}</span>
        </p>
        <p className=" border-r px-2">Royalties $0.02</p>
        <SettingsButton
          section={element}
          path={path}
          visible={visible}
          show={show}
          hide={hide}
        />
      </div>
      {children}
    </div>
  )
}

// TODO: (Horacio) Fixme types
export default React.forwardRef(Section as any)

function SettingsButton({section, path, visible, show, hide}) {
  const {title, description} = section
  const titleRef = React.useRef<HTMLInputElement>(null)
  const editor = useEditor()
  const [innterTitle, setTitle] = React.useState<string>(() => title || '')
  const [innterDescription, setDescription] = React.useState<string>(
    () => description || '',
  )

  function toggleFormMetadata() {
    if (visible) {
      hide()
    } else {
      show()
      titleRef.current?.focus()
    }
  }

  return (
    <Tippy
      visible={visible}
      placement="bottom-end"
      interactive
      onClickOutside={hide}
      content={
        <div
          contentEditable={false}
          className={`theme-light select-none transition duration-200 p-2 rounded bg-gray-300`}
        >
          <div>
            <label
              className="block text-sm text-heading mb-2"
              htmlFor="section-title"
            >
              title:
            </label>
            <input
              className="block w-full px-2 py-1 bg-white rounded-sm border-muted-hover text-body"
              name="title"
              ref={titleRef}
              onClick={e => e.stopPropagation()}
              type="text"
              placeholder="title"
              value={innterTitle}
              onChange={e => {
                setTitle(e.target.value)
                Transforms.setNodes(editor, {title: e.target.value}, {at: path})
              }}
            />
          </div>
          <div className="mt-2">
            <label
              className="block text-sm text-heading mb-2"
              htmlFor="section-title"
            >
              description:
            </label>
            <textarea
              className="block w-full px-2 py-1 bg-white rounded-sm border-muted-hover text-body"
              name="description"
              onClick={e => e.stopPropagation()}
              placeholder="section description"
              value={innterDescription}
              onChange={e => {
                setDescription(e.target.value)
                Transforms.setNodes(
                  editor,
                  {description: e.target.value},
                  {at: path},
                )
              }}
            />
          </div>
        </div>
      }
    >
      <button className="px-3 py-2" onClick={toggleFormMetadata}>
        <Icons.Settings
          // fill="currentColor"
          className="text-white"
          size={16}
          color="currentColor"
          strokeWidth="1"
        />
      </button>
    </Tippy>
  )
}
