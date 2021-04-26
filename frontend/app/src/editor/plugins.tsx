// import React from 'react'
import {
  BoldPlugin,
  ItalicPlugin,
  ParagraphPlugin,
  UnderlinePlugin,
  CodePlugin,
  StrikethroughPlugin,
} from '@udecode/slate-plugins';

import { BlockPlugin } from './block-plugin/block-plugin';
import { HeadingPlugin } from './heading-plugin/heading-plugin';
import { HierarchyPlugin } from './hierarchy-plugin/hierarchy-plugin';
import { LinkPlugin } from './link-plugin';
import { ListPlugin } from './list-plugin/list-plugin';
import { options } from './options';
import { ReadOnlyPlugin } from './readonly-plugin/readonly-plugin';

export const plugins = [
  ParagraphPlugin(options),
  HeadingPlugin(options),
  BlockPlugin(options),
  HierarchyPlugin(options),
  ReadOnlyPlugin(options),
  ListPlugin(options),
  LinkPlugin(options),
  BoldPlugin(options),
  ItalicPlugin(options),
  CodePlugin(options),
  UnderlinePlugin(options),
  StrikethroughPlugin(options),
];
// TODO: fix types
export function createPlugins(options: any) {
  return [
    ParagraphPlugin(options),
    HeadingPlugin(options),
    BlockPlugin(options),
    HierarchyPlugin(options),
    ReadOnlyPlugin(options),
    ListPlugin(options),
    LinkPlugin(options),
    BoldPlugin(options),
    ItalicPlugin(options),
    CodePlugin(options),
    UnderlinePlugin(options),
    StrikethroughPlugin(options),
  ];
}
