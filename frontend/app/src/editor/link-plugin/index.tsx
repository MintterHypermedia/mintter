import {
  // LinkOptions,
  LinkKeyOption,
  LinkPluginOptionsValues,
  isUrl,
  SlatePlugin,
  setDefaults,
  getRenderElement,
  unwrapNodes,
  wrapLink,
  getRangeFromBlockStart,
  getText,
  isUrl as isUrlProtocol,
  RangeBeforeOptions,
  isCollapsed,
  getPreventDefaultHandler,
  getRangeBefore,
  getSelectionText,
  getAbove,
  upsertLinkAtSelection,
} from '@udecode/slate-plugins';
import isEqual from 'lodash.isequal';
import get from 'lodash/get';
import * as React from 'react';
// import {upsertLinkAtSelection} from './upsert-link-at-selection'
import { usePopoverState } from 'reakit/Popover';
import { Transforms, Editor } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

import { Box } from '@mintter/ui/box';
import { Button } from '@mintter/ui/button';
import { Icon } from '@mintter/ui/icon';
import { Text } from '@mintter/ui/text';
import { TextField } from '@mintter/ui/text-field';

// import { Tooltip } from '../../components/tooltip';
import { isNodeTypeIn } from '../mintter-plugin/is-node-type-in';
import { LinkElement } from './link-element';
import { Popover } from './popover';

export const ELEMENT_LINK = 'a';

/**
 * This is needed so the popover with a form works.
 * this prevents the editor to unset the selection
 * when the popover with an input opens
 */
Transforms.deselect = () => {
  // noop
};

// TODO: fix types
function renderLink(options?: any) {
  const { link } = setDefaults(options, {});
  return getRenderElement({
    ...link,
    component: LinkElement,
  });
}

export function LinkPlugin(options?: any): SlatePlugin {
  const { link } = setDefaults(options, {});
  return {
    renderElement: renderLink(options),
    inlineTypes: [link.type],
  };
}

export const DEFAULTS_LINK: Record<LinkKeyOption, LinkPluginOptionsValues> = {
  link: {
    component: LinkElement,
    isUrl,
    type: ELEMENT_LINK,
    rootProps: {
      as: 'a',
    },
  },
};

// TODO: fix types
const upsertLink = (editor: Editor, url: string, { at, ...options }: any) => {
  const { link } = setDefaults(options, DEFAULTS_LINK);

  unwrapNodes(editor, { at: at as any, match: (n) => n.type === link.type });

  // TODO: fix types
  const newSelection = editor.selection as any;

  // TODO: fix types
  wrapLink(editor, url, {
    link,
    at: {
      ...at,
      focus: newSelection.focus,
    } as any,
  });
};

function upsertLinkIfValid(
  editor: ReactEditor,
  { link, isUrl }: { link: any; isUrl: (text: string) => boolean },
) {
  const rangeFromBlockStart = getRangeFromBlockStart(editor);
  const textFromBlockStart = getText(editor, rangeFromBlockStart);
  // console.log({ rangeFromBlockStart, textFromBlockStart });
  if (rangeFromBlockStart && isUrl(textFromBlockStart)) {
    upsertLink(editor, textFromBlockStart, {
      at: rangeFromBlockStart,
      link,
    });
    return true;
  }
}

// TODO: fix types
export const withLinks = (options: any) => <T extends ReactEditor>(
  editor: T,
) => {
  const { link, isUrl } = setDefaults(options, {
    ...DEFAULTS_LINK,
    isUrl: isUrlProtocol,
  });

  const { insertText, insertData, normalizeNode } = editor;

  const DEFAULT_RANGE_BEFORE_OPTIONS: RangeBeforeOptions = {
    matchString: ' ',
    skipInvalid: true,
    afterMatch: true,
    multiPaths: true,
  };

  const rangeOptions: RangeBeforeOptions = {
    ...DEFAULT_RANGE_BEFORE_OPTIONS,
    ...get(options, 'rangeBeforeOptions', {}),
  };

  editor.insertText = (text) => {
    if (isUrl(text)) {
      console.log('link inserted => ', text);
    }
    if (text === ' ' && isCollapsed(editor.selection)) {
      const selection = editor.selection;

      if (upsertLinkIfValid(editor, { link, isUrl })) {
        return insertText(text);
      }

      // TODO: fix types
      const beforeWordRange: any = getRangeBefore(
        editor,
        selection as any,
        rangeOptions,
      );
      if (beforeWordRange) {
        const beforeWordText = getText(editor, beforeWordRange);
        if (isUrl(beforeWordText)) {
          upsertLink(editor, beforeWordText, {
            at: beforeWordRange,
            link,
          });
        }
      }
    }
    insertText(text);
  };

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    console.log('🚀 ~ file: index.tsx ~ line 168 ~ text', text);

    if (text) {
      if (isNodeTypeIn(editor, link.type)) {
        return insertText(text);
      }

      if (text.includes('mintter://')) {
        console.log('this is a mintter link => ', text, editor.selection);
        link.menu.show();
        console.log('window selection', window.getSelection());
        return upsertLinkAtSelection(editor, text, {
          link,
        });
      }

      if (isUrl(text)) {
        console.log('link inserted at => ', editor.selection);
        return upsertLinkAtSelection(editor, text, {
          link,
        });
      }
    }

    insertData(data);
  };

  return editor;
};

export function useLastEditorSelection(editor: ReactEditor, nullable = false) {
  const [selection, updateSelection] = React.useState(editor.selection);

  const setSelection = React.useCallback(
    (newSelection?: Range) => {
      if (nullable !== true && !newSelection) return;
      if (isEqual(selection, newSelection)) return;
      updateSelection(newSelection as any);
    },
    [updateSelection, nullable, selection],
  );

  React.useEffect(() => {
    setSelection(editor.selection as any);
  }, [editor.selection, setSelection]);

  return [selection, setSelection];
}

// TODO: fix types
export function ToolbarLink({ link: linkOptions }: any) {
  const options = setDefaults({ link: linkOptions }, DEFAULTS_LINK);
  const editor = useSlate();
  const popover = usePopoverState();
  const [selection] = useLastEditorSelection(editor);
  const [link, setLink] = React.useState<string>('');
  const [anchor, setAnchor] = React.useState<string>(() =>
    getSelectionText(editor),
  );
  const isLink = isNodeTypeIn(editor, options.link.type);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (link) {
      // convert to link
      Editor.withoutNormalizing(editor, () => {
        upsertLinkAtSelection(editor, link, { wrap: false, ...options });
        Transforms.setNodes(editor, { text: anchor }, { at: selection as any });
      });
      console.log('add link', link);
    }

    popover.hide();
    setLink('');
  }

  function handleRemove() {
    const linkNode = getAbove(editor, {
      match: (n) => n.type === options.link.type,
    });
    if (linkNode) {
      console.log('linkNode exists ', linkNode[0]);
      unwrapNodes(editor, {
        at: linkNode[1],
        match: (n) => n.type === options.link.type,
      });
    } else {
      console.log('linkNode DOES NOT exists ', linkNode);
    }
    popover.hide();
  }

  React.useEffect(() => {
    const linkNode = getAbove(editor, {
      match: (n) => n.type === options.link.type,
    });
    let link = '';
    if (linkNode) {
      link = linkNode[0].url as string;
    }
    setAnchor(getSelectionText(editor));
    setLink(link);
  }, [editor, editor.selection, options.link.type]);
  return (
    <Popover
      popover={popover}
      aria-label="Link Popover"
      onHide={() => {
        Transforms.select(editor, selection as any);
        Transforms.collapse(editor, {
          edge: 'end',
        });
      }}
      tooltip={{
        content: isLink ? 'modify Link' : 'Add Link',
      }}
      disclosure={
        <Button
          variant="ghost"
          size="1"
          css={{ '$$outlined-hovered-background-color': 'transparent' }}
        >
          <Icon name="Link" size="2" color="opposite" />
        </Button>
      }
    >
      <Box
        contentEditable={false}
        css={{
          padding: '$5',
          width: '300px',
          backgroundColor: '$background-muted',
          display: 'flex',
          flexDirection: 'column',
          gap: '$4',
          boxShadow: '$3',
        }}
      >
        <Box
          as="form"
          css={{
            width: '$full',
            display: 'flex',
            flexDirection: 'column',
            gap: '$5',
          }}
          onSubmit={handleSubmit}
        >
          <Text size="3">Link Information</Text>
          <TextField
            type="url"
            id="address"
            name="address"
            label="Link Address"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            size="1"
          />
          <TextField
            disabled
            type="text"
            id="anchor"
            name="anchor"
            label="Link Anchor"
            value={anchor}
            size="1"
          />
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button type="submit" color="primary" size="1">
              Save
            </Button>
            <Button
              type="button"
              onClick={getPreventDefaultHandler(handleRemove)}
              disabled={!isLink}
              variant="outlined"
              color="danger"
              size="1"
            >
              <span>remove link</span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
