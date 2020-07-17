import React from 'react'
import {
  createEditor,
  Editor,
  // Transforms, Node, Element, Path
} from 'slate'
import {withReact} from 'slate-react'
import {
  withResetBlockType,
  withAutoformat,
  withList,
  withImageUpload,
  withDeserializeHTML,
  withLink,
  withToggleType,
  withDeserializeMd,
  pipe,
  withInlineVoid,
  AutoformatRule,
  unwrapList,
  toggleList,
} from '@udecode/slate-plugins'
import {withSections} from './SectionPlugin'
import {nodeTypes} from './nodeTypes'
import {withHistory} from 'slate-history'
import {withImageBlock} from './ImageBlockPlugin'

// need this object because the plugin required it, I made an issue in the plugin's repo
const resetOptions = {
  types: [nodeTypes.typeBlockquote, nodeTypes.typeCodeBlock],
  defaultType: nodeTypes.typeBlock,
}

const preFormat = (editor: Editor) => unwrapList(editor, nodeTypes)

const autoformatRules: AutoformatRule[] = [
  {
    type: nodeTypes.typeH1,
    markup: '#',
    preFormat,
  },
  {
    type: nodeTypes.typeH2,
    markup: '##',
    preFormat,
  },
  {
    type: nodeTypes.typeH3,
    markup: '###',
    preFormat,
  },
  {
    type: nodeTypes.typeLi,
    markup: ['*', '-', '+'],
    preFormat,
    format: editor => {
      toggleList(editor, {...nodeTypes, typeList: nodeTypes.typeUl})
    },
  },
  {
    type: nodeTypes.typeLi,
    markup: ['1.', '1)'],
    preFormat,
    format: editor => {
      toggleList(editor, {...nodeTypes, typeList: nodeTypes.typeOl})
    },
  },
  {
    type: nodeTypes.typeBlockquote,
    markup: ['>'],
    preFormat,
  },
  {
    type: nodeTypes.typeBold,
    between: ['**', '**'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: nodeTypes.typeBold,
    between: ['__', '__'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: nodeTypes.typeItalic,
    between: ['*', '*'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: nodeTypes.typeItalic,
    between: ['_', '_'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: nodeTypes.typeCode,
    between: ['`', '`'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: nodeTypes.typeStrikethrough,
    between: ['~~', '~~'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    trigger: '`',
    type: nodeTypes.typeCodeBlock,
    markup: '``',
    mode: 'inline-block',
    preFormat: editor => unwrapList(editor, nodeTypes),
  },
]

export function useEditor(plugins: any[]): Editor {
  const withPlugins = [
    withReact,
    withHistory,
    withLink(),
    withToggleType({defaultType: nodeTypes.typeP}),
    withAutoformat({
      rules: autoformatRules,
    }),
    withDeserializeMd(plugins),
    withDeserializeHTML({plugins}),
    withImageUpload(),
    withSections(),
    withList(nodeTypes),
    withResetBlockType(resetOptions),
    withInlineVoid({plugins}),
    withImageBlock(),
  ] as const

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => pipe(createEditor(), ...withPlugins), [])
}
