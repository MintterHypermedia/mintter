import {useHover} from '@app/editor/hover-context'
import {Box} from '@components/box'
import {ChildrenOf, Document, FlowContent} from '@mintter/mttast'
import {PropsWithChildren, Suspense, useMemo} from 'react'
import type {Descendant, Editor as EditorType} from 'slate'
import {Editable, Slate} from 'slate-react'
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
import type {EditorPlugin} from './types'

interface EditorProps {
  mode?: EditorMode
  value: ChildrenOf<Document> | Array<FlowContent>
  onChange?: (value: Descendant[]) => void
  editor?: EditorType
  plugins?: Array<EditorPlugin>
  as?: any
}

export function Editor({
  value,
  onChange,
  children,
  mode = EditorMode.Draft,
  editor,
  plugins = defaultPlugins,
  as = 'div',
}: PropsWithChildren<EditorProps>) {
  const _editor = useMemo(() => editor ?? buildEditorHook(plugins, mode), [editor, plugins, mode])
  const renderElement = useMemo(() => buildRenderElementHook(plugins, _editor), [plugins, _editor])
  const renderLeaf = useMemo(() => buildRenderLeafHook(plugins, _editor), [plugins, _editor])
  const decorate = useMemo(() => buildDecorateHook(plugins, _editor), [plugins, _editor])
  const eventHandlers = useMemo(() => buildEventHandlerHooks(plugins, _editor), [plugins, _editor])
  const hoverService = useHover()

  if (mode == EditorMode.Embed || mode == EditorMode.Mention) {
    return (
      <Suspense fallback={'loading'}>
        <span onMouseLeave={() => hoverService.send('MOUSE_LEAVE')}>
          <Slate editor={_editor} value={value as Array<Descendant>} onChange={onChange as any}>
            <Editable
              as={as}
              style={{display: 'inline'}}
              readOnly={_editor.readOnly}
              data-testid="editor"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              decorate={decorate}
              {...eventHandlers}
            />
          </Slate>
        </span>
      </Suspense>
    )
  }

  if (mode == EditorMode.Publication || mode == EditorMode.Discussion) {
    return (
      <Suspense fallback={'loading'}>
        <Box
          css={{
            position: 'relative',
          }}
          onMouseLeave={() => hoverService.send('MOUSE_LEAVE')}
        >
          <Slate editor={_editor} value={value as Array<Descendant>} onChange={onChange as any}>
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
        }}
        onMouseLeave={() => hoverService.send('MOUSE_LEAVE')}
      >
        <Slate editor={_editor} value={value as Array<Descendant>} onChange={onChange as any}>
          <HoveringToolbar />
          <Editable
            readOnly={_editor.readOnly}
            data-testid="editor"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            decorate={decorate}
            placeholder="Start typing here..."
            {...eventHandlers}
          />
          {children}
        </Slate>
      </Box>
    </Suspense>
  )
}
