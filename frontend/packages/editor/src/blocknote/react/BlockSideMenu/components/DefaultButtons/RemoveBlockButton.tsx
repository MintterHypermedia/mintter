import {ReactNode} from 'react'
import {BlockSchema} from '@mintter/app/src/blocknote-core'

import {DragHandleMenuProps} from '../DragHandleMenu'
import {DragHandleMenuItem} from '../DragHandleMenuItem'

export const RemoveBlockButton = <BSchema extends BlockSchema>(
  props: DragHandleMenuProps<BSchema> & {children: ReactNode},
) => {
  return (
    <DragHandleMenuItem
      closeMenu={props.closeMenu}
      onMouseDown={() => {
        props.closeMenu()
        props.editor.removeBlocks([props.block])
      }}
    >
      {props.children}
    </DragHandleMenuItem>
  )
}
