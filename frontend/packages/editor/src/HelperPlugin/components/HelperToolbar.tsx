import React, {useEffect, useRef} from 'react'
import {Portal} from '../../components/portal'
import {useSlate, ReactEditor} from 'slate-react'
import {css} from 'emotion'
import {Icons} from '../../components/icons'

/**
 * Prevent default and call a handler if defined
 */
export const getPreventDefaultHandler = <T extends (...args: any) => any>(
  cb?: T,
  ...args: Parameters<T>
) => (event: any) => {
  event.preventDefault()
  cb?.(...(args as any))
}

export function HelperToolbar({
  at,
  options,
  valueIndex,
  onClickSelection,
  setValueIndex,
  theme = 'theme-light',
  ...props
}) {
  console.log('HELPER: at', at)
  const ref: any = useRef(null)
  const editor = useSlate()

  useEffect(() => {
    if (at && options.length > 0) {
      console.log('enter the useEffect')
      const el = ref.current
      const domRange = ReactEditor.toDOMRange(editor, at)
      const rect = domRange.getBoundingClientRect()
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`
        el.style.left = `${rect.left + window.pageXOffset}px`
      }
    }
  }, [options.length, editor, at])

  if (!at || !options.length) {
    return null
  }

  return (
    <Portal>
      <div
        ref={ref}
        className={`${theme} overflow-hidden rounded shadow-md absolute z-20 ${css`
          width: 400px;
        `}`}
        {...props}
      >
        <ul>
          {options.map((option, i) => (
            <li key={`${i}${option.type}`}>
              <button
                className={`block text-left w-full px-4 py-2 ${
                  i === valueIndex ? 'bg-blue-100' : 'bg-background'
                }`}
                onMouseEnter={() => setValueIndex(i)}
                onMouseDown={getPreventDefaultHandler(
                  onClickSelection,
                  editor,
                  option,
                )}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="bg-background py-4">
          <p className="px-4 uppercase text-body-muted text-xs font-bold">
            Actions
          </p>
          <ul>
            <li>
              <button className="w-full px-4 py-1 flex items-center justify-start text-body hover:bg-blue-100 bg-background">
                <Icons.Trash size={16} color="currentColor" />
                <span className="text-body text-sm px-2">Delete</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Portal>
  )
}
