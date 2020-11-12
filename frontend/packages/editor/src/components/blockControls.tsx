import {SlateBlock} from '../editor'
import React from 'react'
import {
  MenuButton,
  MenuItem as ReakitMenuItem,
  Menu,
  useMenuState,
  MenuSeparator,
} from 'reakit/Menu'
import {useBlockMenu} from '../BlockPlugin/components/blockMenuContext'
import {Icons} from './icons'
import {isTransclusion} from '../TransclusionPlugin/utils/isTransclusion'
import {Document} from '@mintter/api/v2/documents_pb'

export const BlockControls = ({element}: any) => {
  const menu = useMenuState({loop: true})
  const {
    state: {onInteractionPanel, onQuote},
  } = useBlockMenu()
  const isQuote = React.useMemo(() => isTransclusion(element), [element])
  const handleItemClick = React.useCallback(
    (destination?: Document.AsObject) => {
      menu.hide()
      onQuote?.({block: element, destination})
    },
    [onQuote, element, menu],
  )
  return (
    <>
      <MenuButton {...menu} className="rounded bg-white shadow-sm p-1">
        <Icons.MoreHorizontal size={16} />
      </MenuButton>
      <Menu
        {...menu}
        aria-label="Block Menu"
        style={{width: 320, zIndex: 100, backgroundColor: 'white'}}
      >
        <MenuItem
          {...menu}
          onClick={() => onInteractionPanel?.(element)}
          disabled={!isQuote}
        >
          <Icons.ArrowUpRight size={16} color="currentColor" />
          <span className="flex-1 mx-2">Open in Interaction Panel</span>
        </MenuItem>
        <MenuItem
          {...menu}
          as={DraftsMenu}
          label="Quote this Block"
          icon={Icons.CornerDownLeft}
          onClick={handleItemClick}
        />
        <MenuItem {...menu} disabled={isQuote}>
          <Icons.CornerDownLeft size={16} color="currentColor" />
          <span className="flex-1 mx-2">Write About this Block</span>
        </MenuItem>
      </Menu>
    </>
  )
}

const MenuItem = React.memo(({className = '', ...props}: any) => {
  return (
    <ReakitMenuItem
      {...props}
      className={`w-full px-2 py-2 focus:bg-info text-sm text-left disabled:opacity-50 flex items-center ${className}`}
    />
  )
})

const DraftsMenu = React.forwardRef<
  HTMLButtonElement,
  {
    element: SlateBlock
    label: string
    icon: any
    onClick: (destination?: Document.AsObject) => void
  }
>(({onClick, element, label, icon, ...props}, ref) => {
  const menu = useMenuState({loop: true})
  const LeftIcon = icon ? icon : null
  const {
    state: {drafts = []},
  } = useBlockMenu()
  return (
    <>
      <MenuButton
        ref={ref}
        {...menu}
        {...props}
        className="w-full px-2 py-2 focus:bg-teal-200 text-sm text-left disabled:opacity-50 flex items-center"
      >
        {icon && <LeftIcon color="currentColor" size={16} />}
        <span className="flex-1 mx-2">{label}</span>
        <Icons.ChevronRight
          size={14}
          color="currentColor"
          className="opacity-75"
        />
      </MenuButton>
      <Menu
        {...menu}
        aria-label="Drafts List selection"
        style={{width: 320, zIndex: 101, backgroundColor: 'white'}}
      >
        <MenuItem {...menu} onClick={() => onClick?.()}>
          <Icons.PlusCircle size={16} color="currentColor" />
          <span className="flex-1 mx-2">Quote in New Draft</span>
        </MenuItem>
        <MenuSeparator {...menu} style={{margin: 0, padding: 0}} />
        {drafts.map(item => {
          return (
            <MenuItem
              key={item.version}
              {...menu}
              onClick={() => onClick?.(item)}
            >
              <span className="flex-1 w-full text-left text-primary mx-2">
                {item.title || 'Untitled Document'}
              </span>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
})
