import {AppBanner, BannerText} from '@mintter/app/components/app-banner'
import Footer from '@mintter/app/components/footer'
import {useDraftEditor} from '@mintter/app/models/documents'
import {useDaemonReady} from '@mintter/app/node-status-context'
import {useNavRoute} from '@mintter/app/utils/navigation'
import {trpc} from '@mintter/desktop/src/trpc'
import {HMEditorContainer, HyperMediaEditorView} from '@mintter/editor'
import {
  StateStream,
  blockStyles,
  useHeadingTextStyles,
  usePublicationContentContext,
} from '@mintter/shared'
import {
  Button,
  Container,
  Input,
  MainWrapper,
  SizableText,
  Text,
  Theme,
  View,
  XStack,
  YStack,
  useStream,
} from '@mintter/ui'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {useDraftTitleInput} from '../models/documents'
import {useHasDevTools} from '../models/experiments'
import {useOpenDraft} from '../utils/open-draft'
import {DocumentPlaceholder} from './document-placeholder'
import {AppPublicationContentProvider} from './publication'
import {TextInput} from 'react-native'

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
  const {editor, query, editorState} = useDraftEditor(documentId)

  let isDaemonReady = useDaemonReady()

  if (editor && query.data) {
    return (
      <ErrorBoundary
        FallbackComponent={DraftError}
        onReset={() => window.location.reload()}
      >
        <MainWrapper>
          {!isDaemonReady ? <NotSavingBanner /> : null}
          <AppPublicationContentProvider disableEmbedClick onCopyBlock={null}>
            <YStack className="editor-title">
              <DraftTitleInput
                draftId={documentId}
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
            <DraftDevTools draftId={documentId} editorState={editorState} />
          ) : null}
        </MainWrapper>
        <Footer />
      </ErrorBoundary>
    )
  }

  if (editor && query.error) {
    return (
      <MainWrapper>
        <Container>
          <DraftError
            documentId={documentId}
            error={query.error}
            resetErrorBoundary={() => query.refetch()}
          />
        </Container>
      </MainWrapper>
    )
  }

  return <DocumentPlaceholder />
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
  useLayoutEffect(() => {
    const target = input.current
    if (!target) return

    // first, apply the title in case it doesn't match. this will hapepn if the user pastes a newline, for example
    if (target.value !== title) {
      // only set the title if it doesn't match. because this will jump the cursor to the end of the input
      target.value = title || ''
    }

    // without this, the scrollHeight doesn't shrink, so when the user deletes a long title it doesnt shrink back
    target.style.height = ''

    // here is the actual auto-resize
    target.style.height = `${target.scrollHeight}px`
  }, [title])
  return (
    <YStack
    // paddingHorizontal={layoutUnit / 2}
    // $gtMd={{paddingHorizontal: layoutUnit}}
    >
      <XStack
        {...blockStyles}
        marginBottom={layoutUnit}
        paddingBottom={layoutUnit / 2}
        borderBottomColor="$color6"
        borderBottomWidth={1}
        paddingHorizontal={54}
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
            // this is replicated in useLayoutEffect but we handle it here so that there is no layout thrashing when creating new lines
            const target: HTMLTextAreaElement | null = input.current
            if (!target) return
            target.style.height = '' // without this, the scrollHeight doesn't shrink, so when the user deletes a long title it doesnt shrink back
            target.style.height = `${target.scrollHeight}px`
          }}
          outlineColor="transparent"
          borderColor="transparent"
          paddingLeft={9.6}
          marginTop="$3"
          paddingVertical={'$4'}
          defaultValue={title?.trim() || ''} // this is still a controlled input because of the value comparison in useLayoutEffect
          onChangeText={onTitle}
          placeholder="Untitled Document"
          {...headingTextStyles}
        />
      </XStack>
    </YStack>
  )

  return (
    <Input
      multiline
      size="$9"
      borderRadius={0}
      borderWidth={0}
      backgroundColor="$color2"
      fontWeight="bold"
      fontFamily={'$body'}
      value={title || ''}
      outlineColor="transparent"
      borderColor="transparent"
      f={1}
      maxWidth={640}
      paddingLeft={9.6}
      marginLeft={54}
      marginRight={54}
      onChangeText={onTitle}
      placeholder="Untitled Document"
    />
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
