import React from 'react'
import {
  ParagraphKeyOption,
  ParagraphPluginOptionsValues,
} from '@udecode/slate-plugins'
import {ELEMENT_PARAGRAPH} from './defaults'
// import {Editor} from 'slate'
// import {ReactEditor, useEditor} from 'slate-react'

export const paragraphOption = {}

export const DEFAULTS_PARAGRAPH: Record<
  ParagraphKeyOption,
  ParagraphPluginOptionsValues
> = {
  p: {
    component: Paragraph,
    type: ELEMENT_PARAGRAPH,
    rootProps: {
      as: 'p',
      className: 'FOO',
    },
  },
}

export function Paragraph({
  as: Component = 'p',
  className = '',
  element,
  attributes,
  ...rest
}) {
  // const editor = useEditor()
  // const path = ReactEditor.findPath(editor, element)
  // console.log(Editor.parent(editor, path))
  return (
    <Component
      className={`hover:bg-background-muted pt-2 px-2 md:px-3 mx-0 md:-mx-3 text-body rounded ${className}`}
      {...attributes}
      {...rest}
    />
  )
}
