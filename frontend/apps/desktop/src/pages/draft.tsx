// import 'show-keys'
import {AppBanner, BannerText} from '@app/app-banner'
import {DragProvider} from '@app/drag-context'
import {createDragMachine} from '@app/drag-machine'
import {BlockHighLighter} from '@app/editor/block-highlighter'
import {Editor} from '@app/editor/editor'
import {buildEditorHook, EditorMode} from '@app/editor/plugin-utils'
import {plugins} from '@app/editor/plugins'
import {useEditorDraft, useSaveDraft} from '@app/models/documents'
import {MouseProvider} from '@app/mouse-context'
import {mouseMachine} from '@app/mouse-machine'
import {useDaemonReady} from '@app/node-status-context'
import {AppError} from '@app/root'
import {useNavRoute} from '@app/utils/navigation'
import {Box} from '@components/box'
import Footer from '@components/footer'
import {Placeholder} from '@components/placeholder-box'
import {
  group,
  GroupingContent,
  paragraph,
  statement,
  text,
} from '@mintter/shared'
import {Button, MainWrapper, SizableText, XStack, YStack} from '@mintter/ui'
import {useInterpret} from '@xstate/react'
import {useEffect, useMemo, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {Editor as SlateEditor, Transforms} from 'slate'
import {ReactEditor} from 'slate-react'

let emptyEditorValue = group({data: {parent: ''}}, [
  statement([paragraph([text('')])]),
])

export default function DraftPage() {
  let route = useNavRoute()
  if (route.key != 'draft')
    throw new Error('Draft actor must be passed to DraftPage')

  const [debugValue, setDebugValue] = useState(false)
  const docId = route.documentId
  const editor = useMemo(() => buildEditorHook(plugins, EditorMode.Draft), [])

  const {
    data: draftState,
    status,
    error,
    refetch,
  } = useEditorDraft({
    documentId: docId,
  })
  console.log('🚀 ~ file: draft.tsx:53 ~ DraftPage ~ draftState:', draftState)

  let mouseService = useInterpret(() => mouseMachine)
  let dragService = useInterpret(() => createDragMachine(editor))
  let isDaemonReady = useDaemonReady()

  /**
   * autosave
   * - when the user stops typing (after 500ms)
   * - transform all the changes from editor.__mtt-changes to DocumentChanges
   * -
   */

  useInitialFocus(editor)

  // TODO: safe when loading the first time a new draft: this is to load the epty block generated when start inside the `editorValue` useMemo
  const saveDraft = useSaveDraft(docId)

  return status == 'success' ? (
    <ErrorBoundary
      FallbackComponent={AppError}
      onReset={() => window.location.reload()}
    >
      <MouseProvider value={mouseService}>
        <DragProvider value={dragService}>
          <BlockHighLighter>
            <MainWrapper>
              <YStack
                onScroll={() => {
                  mouseService.send('DISABLE.SCROLL')

                  // if (!canEdit) {
                  //   mainService.send('NOT.EDITING')
                  // }
                }}
                // @ts-ignore
                onMouseMove={(event) => {
                  mouseService.send({
                    type: 'MOUSE.MOVE',
                    position: event.clientY,
                  })
                }}
                onMouseLeave={() => {
                  mouseService.send('DISABLE.CHANGE')
                }}
                onMouseUp={() => {
                  dragService.send('DROPPED')
                  mouseService.send('DISABLE.DRAG.END')
                }}
              >
                {!isDaemonReady ? <NotSavingBanner /> : null}
                {draftState.children.length ? (
                  <>
                    <Editor
                      editor={editor}
                      value={draftState.children}
                      //@ts-ignore
                      onChange={(content: GroupingContent[]) => {
                        // TODO: need to check when content can be a string
                        if (
                          (!content && typeof content == 'string') ||
                          !isDaemonReady
                        )
                          return

                        saveDraft.mutate({editor, content})
                        mouseService.send('DISABLE.CHANGE')
                      }}
                    />
                    {import.meta.env.DEV && (
                      <YStack maxWidth="500px" marginHorizontal="auto">
                        <Button
                          size="$1"
                          theme="gray"
                          width="100%"
                          onPress={() => setDebugValue((v) => !v)}
                        >
                          toggle value
                        </Button>
                        {debugValue && (
                          <XStack
                            tag="pre"
                            {...{
                              whiteSpace: 'wrap',
                            }}
                          >
                            <SizableText tag="code" size="$1">
                              {JSON.stringify(draftState?.children, null, 3)}
                            </SizableText>
                          </XStack>
                        )}
                      </YStack>
                    )}
                  </>
                ) : null}
              </YStack>
            </MainWrapper>
            <Footer />
          </BlockHighLighter>
        </DragProvider>
      </MouseProvider>
    </ErrorBoundary>
  ) : (
    <DraftShell />
  )
}

function useInitialFocus(editor: SlateEditor) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (editor.children.length == 0) return

      ReactEditor.focus(editor)
      Transforms.select(editor, SlateEditor.end(editor, []))

      if (ReactEditor.isFocused(editor)) {
        clearInterval(intervalId)
      }
    }, 10)
  }, [editor])
}

function DraftShell() {
  // TODO: update shell
  return (
    <Box
      css={{
        marginTop: '60px',
        width: '$full',
        maxWidth: '$prose-width',
        display: 'flex',
        flexDirection: 'column',
        gap: '$7',
        marginInline: 'auto',
      }}
    >
      <BlockPlaceholder />
      <BlockPlaceholder />
      <BlockPlaceholder />
      <BlockPlaceholder />
      <BlockPlaceholder />
    </Box>
  )
}

function BlockPlaceholder() {
  return (
    <Box
      css={{
        width: '$prose-width',
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
      }}
    >
      <Placeholder css={{height: 16, width: '$full'}} />
      <Placeholder css={{height: 16, width: '92%'}} />
      <Placeholder css={{height: 16, width: '84%'}} />
      <Placeholder css={{height: 16, width: '90%'}} />
    </Box>
  )
}

function NotSavingBanner() {
  return (
    <AppBanner>
      <BannerText>The Draft is not being saved right now.</BannerText>
    </AppBanner>
  )
}
