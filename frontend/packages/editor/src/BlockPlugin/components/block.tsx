import React from 'react'
import {DragDrop} from './DragDrop'
import {css} from 'emotion'

export function BlockBase(
  {attributes, element, className = '', children},
  ref,
) {
  let quoters = element.quotersList?.length
  return (
    <DragDrop attributes={attributes} element={element} componentRef={ref}>
      <div className={`relative ${className}`}>
        {quoters !== 0 && (
          <div
            contentEditable={false}
            style={{userSelect: 'none'}}
            className={`absolute right-0 transform translate-x-full pl-1 ${css`
              top: -2px;
            `}`}
          >
            <button className="text-xs text-info hover:text-info-hover">
              {quoters}
            </button>
          </div>
        )}
        {children}
      </div>
    </DragDrop>
  )
}

export const Block = React.forwardRef(BlockBase)
