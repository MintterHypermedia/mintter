import {AppBanner, BannerText} from '@mintter/app/components/app-banner'
import Footer from '@mintter/app/components/footer'
import {useNavRoute} from '@mintter/app/utils/navigation'
import {trpc} from '@mintter/desktop/src/trpc'
import {HMEditorContainer, HyperMediaEditorView} from '@mintter/editor'
import {
  StateStream,
  blockStyles,
  formattedDate,
  formattedDateMedium,
  useHeadingMarginStyles,
  useHeadingTextStyles,
  usePublicationContentContext,
} from '@mintter/shared'
import {
  Button,
  Input,
  MainWrapper,
  SizableText,
  Theme,
  Tooltip,
  XStack,
  YStack,
  useStream,
} from '@mintter/ui'
import {useEffect, useRef, useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {useDraftEditor, useDraftTitleInput} from '../models/documents'
import {useHasDevTools} from '../models/experiments'
import {useOpenDraft} from '../utils/open-draft'
import {DocumentPlaceholder} from './document-placeholder'
import {AppPublicationContentProvider} from './publication'

export default function DraftPage() {
  let route = useNavRoute()
  if (route.key != 'draft')
    throw new Error('Draft actor must be passed to DraftPage')

  const openDraft = useOpenDraft('replace')
  const documentId = route.draftId! // TODO, clean this up when draftId != docId
  useEffect(() => {
    if (route.key === 'draft' && route.draftId === undefined) {
      openDraft()
    }
  }, [route])

  let {state, editorStream, draft, editor, handleDrop} = useDraftEditor({
    documentId: route.draftId,
    route,
  })

  if (state.matches('ready')) {
    return (
      <ErrorBoundary
        FallbackComponent={DraftError}
        onReset={() => window.location.reload()}
      >
        <MainWrapper
          backgroundColor="red"
          onDrop={(e) => {
            handleDrop(e)
          }}
        >
          <AppPublicationContentProvider disableEmbedClick onCopyBlock={null}>
            <YStack id="editor-title">
              <DraftTitleInput
                draftId={draft?.id}
                onEnter={() => {
                  editor?._tiptapEditor?.commands?.focus?.('start')
                }}
              />
            </YStack>

            <HMEditorContainer>
              {editor && <HyperMediaEditorView editor={editor} />}
            </HMEditorContainer>
          </AppPublicationContentProvider>
          {documentId ? (
            <DraftDevTools draftId={documentId} editorState={editorStream} />
          ) : null}
        </MainWrapper>
        <Footer>
          <XStack gap="$3" marginHorizontal="$3">
            {draft?.updateTime && (
              <SizableText size="$1" color="$color9">
                Last update: {formattedDateMedium(draft.updateTime)}
              </SizableText>
            )}
          </XStack>
        </Footer>
      </ErrorBoundary>
    )
  }
  return <DocumentPlaceholder />
}

function applyTitleResize(target: HTMLTextAreaElement) {
  // without this, the scrollHeight doesn't shrink, so when the user deletes a long title it doesnt shrink back
  target.style.height = ''

  // here is the actual auto-resize
  target.style.height = `${target.scrollHeight}px`
}

function DraftTitleInput({
  draftId,
  onEnter,
}: {
  draftId: string
  onEnter: () => void
}) {
  const {textUnit, layoutUnit} = usePublicationContentContext()
  let headingTextStyles = useHeadingTextStyles(1, textUnit)
  const {title, onTitle} = useDraftTitleInput(draftId)
  const input = useRef<HTMLTextAreaElement | null>(null)
  const headingMarginStyles = useHeadingMarginStyles(2, layoutUnit)

  useEffect(() => {
    // handle the initial size of the title
    const target = input.current
    if (!target) return
    applyTitleResize(target)
  }, [])

  useEffect(() => {
    const target = input.current
    if (!target) return
    if (target.value !== title) {
      // handle cases where the model has a different title. this happens when pasting multiline text into the title
      target.value = title || ''
      applyTitleResize(target)
    }
  }, [title])

  useEffect(() => {
    function handleResize() {
      // handle the resize size of the title, responsive size may be changed
      const target = input.current
      if (!target) return
      applyTitleResize(target)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <XStack
      {...blockStyles}
      marginBottom={layoutUnit}
      paddingBottom={layoutUnit / 2}
      borderBottomColor="$color6"
      borderBottomWidth={1}
      paddingHorizontal={54}
      {...headingMarginStyles}
    >
      <Input
        // we use multiline so that we can avoid horizontal scrolling for long titles
        multiline
        // @ts-expect-error this will only work on web, where multiline TextInput is a HTMLTextAreaElement
        ref={input}
        onKeyPress={(e) => {
          if (e.nativeEvent.key == 'Enter') {
            e.preventDefault()
            onEnter()
          }
        }}
        size="$9"
        borderRadius="$1"
        borderWidth={0}
        overflow="hidden" // trying to hide extra content that flashes when pasting multi-line text into the title
        flex={1}
        backgroundColor="$color2"
        fontWeight="bold"
        fontFamily="$body"
        onChange={(e) => {
          // @ts-expect-error
          applyTitleResize(e.target as HTMLTextAreaElement)
        }}
        outlineColor="transparent"
        borderColor="transparent"
        paddingLeft={9.6}
        defaultValue={title?.trim() || ''} // this is still a controlled input because of the value comparison in useLayoutEffect
        // value={title}
        onChangeText={onTitle}
        placeholder="Untitled Document"
        {...headingTextStyles}
        padding={0}
      />
    </XStack>
  )
}

function DraftDevTools({
  draftId,
  editorState,
}: {
  draftId: string
  editorState: StateStream<any>
}) {
  const hasDevTools = useHasDevTools()
  const openDraft = trpc.diagnosis.openDraftLog.useMutation()
  const [debugValue, setShowValue] = useState(false)
  const editorValue = useStream(editorState)
  if (!hasDevTools) return null
  return (
    <YStack alignSelf="stretch">
      <XStack space="$4" margin="$4">
        <Button
          size="$2"
          theme="orange"
          onPress={() => {
            openDraft.mutate(draftId)
          }}
        >
          Open Draft Log
        </Button>
        <Button
          theme="orange"
          size="$2"
          onPress={() => setShowValue((v) => !v)}
        >
          {debugValue ? 'Hide Draft Value' : 'Show Draft Value'}
        </Button>
      </XStack>
      {debugValue && (
        <code style={{whiteSpace: 'pre-wrap'}}>
          {JSON.stringify(editorValue, null, 2)}
        </code>
      )}
    </YStack>
  )
}

function NotSavingBanner() {
  return (
    <AppBanner>
      <BannerText>
        The Draft might not be saved because your Local peer is not ready (yet!)
      </BannerText>
    </AppBanner>
  )
}

function DraftError({
  documentId,
  error,
  resetErrorBoundary,
}: FallbackProps & {documentId: string}) {
  return (
    <Theme name="red">
      <YStack
        marginVertical="$8"
        padding="$4"
        borderRadius="$5"
        borderColor="$color5"
        borderWidth={1}
        backgroundColor="$color3"
        gap="$3"
        alignItems="center"
      >
        <SizableText size="$4" textAlign="center" color="$color9">
          Error loading Draft (Document Id: {documentId})
        </SizableText>
        <SizableText color="$color8" size="$2" fontFamily="$mono">
          {JSON.stringify(error)}
        </SizableText>
        <Button size="$3" onPress={() => resetErrorBoundary()}>
          Retry
        </Button>
      </YStack>
    </Theme>
  )
}
