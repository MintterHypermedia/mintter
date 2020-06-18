import React from 'react'
import {
  BalloonToolbar,
  toggleMark,
  isMarkActive,
  insertLink,
  isNodeInSelection,
  toggleList,
} from '@udecode/slate-plugins'
import {nodeTypes} from '../nodeTypes'
import {Icons} from './icons'
import {useSlate} from 'slate-react'

export function ToolbarBoldMark() {
  return <ToolbarMark mark={nodeTypes.typeBold} icon="Bold" />
}

export function ToolbarCodeMark() {
  return <ToolbarMark mark={nodeTypes.typeCode} icon="Code" />
}

export function ToolbarMarkItalic() {
  return <ToolbarMark mark={nodeTypes.typeItalic} icon="Italic" />
}

export function ToolbarBlockLink() {
  const editor = useSlate()
  return (
    <ToolbarButton
      active={isNodeInSelection(editor, nodeTypes.typeLink)}
      onClick={() => {
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        insertLink(editor, url, {typeLink: nodeTypes.typeLink})
      }}
      icon="Link"
    />
  )
}

export function ToolbarBlockP() {
  return <ToolbarBlock type={nodeTypes.typeP} icon="P" />
}

export function ToolbarBlockH1() {
  return <ToolbarBlock type={nodeTypes.typeH1} icon="H1" />
}

export function ToolbarBlockH2() {
  return <ToolbarBlock type={nodeTypes.typeH2} icon="H2" />
}

export interface ToolbarButtonProps {
  onClick: () => void
  icon: string
  className?: string
  size?: number
  active: boolean
}

export function ToolbarButton({
  className = '',
  icon,
  onClick,
  active = false,
  size = 16,
}: ToolbarButtonProps) {
  const Icon = Icons[icon]

  function handleClick(e) {
    e.preventDefault()

    if (onClick) {
      onClick()
    }
  }

  return (
    <button
      onMouseDown={handleClick}
      className={`p-2 ${
        active ? 'text-toolbar-active' : 'text-toolbar'
      } ${className}`}
    >
      <Icon size={size} color="currentColor" />
    </button>
  )
}

export function ToolbarMark({icon, mark}) {
  const editor = useSlate()

  function handleClick() {
    toggleMark(editor, mark)
  }

  return (
    <ToolbarButton
      icon={icon}
      onClick={handleClick}
      active={isMarkActive(editor, mark)}
    />
  )
}

export function ToolbarBlock({icon, type}) {
  // TODO: (horacio) Fixme types
  const editor: any = useSlate()

  function handleClick() {
    editor.toggleBlock(type)
  }

  return (
    <ToolbarButton
      icon={icon}
      onClick={handleClick}
      active={isNodeInSelection(editor, type)}
    />
  )
}

export function Separator() {
  return <div className="w-px h-4 bg-toolbar" />
}

export function ToolbarList({
  typeList = nodeTypes.typeUl,
  icon = 'List',
  ...props
}) {
  const editor = useSlate()
  return (
    <ToolbarButton
      {...props}
      active={isNodeInSelection(editor, typeList)}
      onClick={() => toggleList(editor, {...props, typeList})}
      icon={icon}
    />
  )
}

export function ToolbarBlockUList() {
  return <ToolbarList typeList={nodeTypes.typeUl} {...nodeTypes} icon="List" />
}

export function ToolbarBlockOList() {
  return <ToolbarList typeList={nodeTypes.typeOl} {...nodeTypes} icon="OList" />
}

export function Toolbar() {
  // const editor = useSlate()
  return (
    <BalloonToolbar className="theme-dark m-0">
      <ToolbarBoldMark />
      <ToolbarCodeMark />
      <ToolbarMarkItalic />
      <ToolbarBlockUList />
      <ToolbarBlockOList />
      <ToolbarBlockLink />
      <Separator />
      <ToolbarBlockP />
      <ToolbarBlockH1 />
      <ToolbarBlockH2 />
    </BalloonToolbar>
  )
}
