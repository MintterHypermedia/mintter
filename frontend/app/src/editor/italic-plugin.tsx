import { css } from '@mintter/ui/stitches.config';
import { Box } from '@mintter/ui/box';
import type { AutoformatRule } from '@udecode/slate-plugins-autoformat';
import {
  DEFAULTS_ITALIC,
  MARK_ITALIC,
} from '@udecode/slate-plugins-basic-marks';
import type {
  SlatePluginComponent,
  SlatePluginOptions,
  SPRenderLeafProps,
} from '@udecode/slate-plugins-core';
import type { SlateTextRun } from './types';

export type ItalicOptions = {
  [MARK_ITALIC]: SlatePluginOptions;
};

export const italicOptions: ItalicOptions = {
  //@ts-ignore
  [MARK_ITALIC]: {
    ...DEFAULTS_ITALIC,
    component: ItalicLeaf as SlatePluginComponent,
  },
};

export const italicAutoformatRules: Array<AutoformatRule> = [
  {
    type: MARK_ITALIC,
    between: ['*', '*'],
    mode: 'inline',
    insertTrigger: true,
  },
  {
    type: MARK_ITALIC,
    between: ['_', '_'],
    mode: 'inline',
    insertTrigger: true,
  },
];

export function ItalicLeaf({
  attributes,
  children,
  leaf,
}: SPRenderLeafProps<SlateTextRun>) {
  if (leaf.italic) {
    return (
      <Box
        as="em"
        css={{
          fontStyle: 'italic',
        }}
        {...attributes}
      >
        {children}
      </Box>
    );
  }
}
