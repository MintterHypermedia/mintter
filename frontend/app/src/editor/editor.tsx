import {FlowContent, MttastContent} from '@mintter/mttast'
import {Box} from '@mintter/ui/box'
import {useActor} from '@xstate/react'
import {PropsWithChildren, Suspense, useMemo} from 'react'
import type {Descendant, Editor as EditorType} from 'slate'
import {Editable, Slate} from 'slate-react'
import {EditorPlugin} from '.'
import {useHover} from './hover-context'
import {HoveringToolbar} from './hovering-toolbar'
import {
  buildDecorateHook,
  buildEditorHook,
  buildEventHandlerHooks,
  buildRenderElementHook,
  buildRenderLeafHook,
  EditorMode,
} from './plugin-utils'
import {plugins as defaultPlugins} from './plugins'

export type {EditorPlugin} from './types'

interface EditorProps {
  mode?: EditorMode
  value: Array<MttastContent> | Array<FlowContent>
  onChange?: (value: Descendant[]) => void
  editor?: EditorType
  plugins?: Array<EditorPlugin>
}

export function Editor({
  value,
  onChange,
  children,
  mode = EditorMode.Draft,
  editor,
  plugins = defaultPlugins,
}: PropsWithChildren<EditorProps>) {
  const _editor = useMemo(() => editor ?? buildEditorHook(plugins, mode), [editor, plugins, mode])
  const renderElement = useMemo(() => buildRenderElementHook(plugins, _editor), [plugins, _editor])
  const renderLeaf = useMemo(() => buildRenderLeafHook(plugins, _editor), [plugins, _editor])
  const decorate = useMemo(() => buildDecorateHook(plugins, _editor), [plugins, _editor])
  const eventHandlers = useMemo(() => buildEventHandlerHooks(plugins, _editor), [plugins, _editor])
  const hoverService = useHover()
  const [, hoverSend] = useActor(hoverService)

  if (mode == EditorMode.Embed || mode == EditorMode.Mention) {
    return (
      <Suspense fallback={'loading'}>
        <Slate editor={_editor} value={value} onChange={onChange}>
          <Editable
            style={{display: 'inline'}}
            readOnly={_editor.readOnly}
            data-testid="editor-embed-mode"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            decorate={decorate}
            {...eventHandlers}
          />
        </Slate>
      </Suspense>
    )
  }

  if (mode == EditorMode.Publication || mode == EditorMode.Discussion) {
    return (
      <Suspense fallback={'loading'}>
        <Box
          css={{
            position: 'relative',
            marginLeft: '-$8',
          }}
        >
          <Slate editor={_editor} value={value} onChange={onChange}>
            <Editable
              readOnly={true}
              data-testid="editor"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              decorate={decorate}
              {...eventHandlers}
            />
            {children}
          </Slate>
        </Box>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={'loading'}>
      <Box
        css={{
          position: 'relative',
          marginLeft: '-$8',
        }}
        onMouseLeave={() => hoverSend('MOUSE_LEAVE')}
      >
        <Slate editor={_editor} value={value} onChange={onChange}>
          <HoveringToolbar />
          <Editable
            readOnly={_editor.readOnly}
            data-testid="editor"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            decorate={decorate}
            {...eventHandlers}
          />
          {children}
        </Slate>
      </Box>
    </Suspense>
  )
}
