import { BlockSchema } from '@shm/desktop/src/editor/blocknote/core'

import { AddBlockButton } from './DefaultButtons/AddBlockButton'
import { DragHandle } from './DefaultButtons/DragHandle'
import { SideMenu } from './SideMenu'
import { SideMenuProps } from './SideMenuPositioner'

export const DefaultSideMenu = <BSchema extends BlockSchema>(
  props: SideMenuProps<BSchema>,
) => (
  <SideMenu>
    <AddBlockButton {...props} />
    <DragHandle {...props} />
  </SideMenu>
)
