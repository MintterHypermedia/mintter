// import React from 'react'
import {
  BoldPlugin,
  ItalicPlugin,
  ParagraphPlugin,
  UnderlinePlugin,
  CodePlugin,
  StrikethroughPlugin,
} from '@udecode/slate-plugins'
import {options} from './options'
import {HelperPlugin} from './HelperPlugin'
import {HierarchyPlugin} from './HierarchyPlugin'
import {TransclusionPlugin} from './TransclusionPlugin'
import {BlockPlugin} from './block-plugin'
import {ReadOnlyPlugin} from './ReadOnlyPlugin'
import {HeadingPlugin} from './HeadingPlugin/heading-plugin'
import {LinkPlugin} from './LinkPlugin/link-plugin'
import {ListPlugin} from './ListPlugin/list-plugin'

export const plugins = [
  ParagraphPlugin(options),
  LinkPlugin(),
  BoldPlugin(options),
  CodePlugin(options),
  ItalicPlugin(options),
  UnderlinePlugin(options),
  StrikethroughPlugin(options),
  HelperPlugin(),
  HierarchyPlugin(options),
  TransclusionPlugin(options),
  BlockPlugin(options),
  ReadOnlyPlugin(options),
  HeadingPlugin(options),
  ListPlugin(options),
]

export function createPlugins(options) {
  return [
    ParagraphPlugin(options),
    BoldPlugin(options),
    CodePlugin(options),
    ItalicPlugin(options),
    UnderlinePlugin(options),
    StrikethroughPlugin(options),
    HelperPlugin(),
    HierarchyPlugin(options),
    TransclusionPlugin(options),
    BlockPlugin(options),
    ReadOnlyPlugin(options),
    HeadingPlugin(options),
    ListPlugin(options),
    LinkPlugin(),
  ]
}
