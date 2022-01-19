// import 'show-keys'
import {AppError} from '@app/app'
import {Editor} from '@app/editor/editor'
import {buildEditorHook, EditorMode} from '@app/editor/plugin-utils'
import {plugins} from '@app/editor/plugins'
import {draftEditorMachine, EditorDocument, editorModel, useEditorDraft} from '@app/editor/use-editor-draft'
import {getDateFormat} from '@app/utils/get-format-date'
import {Box} from '@components/box'
import {Button} from '@components/button'
import {sidepanelModel, useSidepanel} from '@components/sidepanel'
import {useEnableSidepanel} from '@components/sidepanel/sidepanel'
import {Text} from '@components/text'
import {TextField} from '@components/text-field'
import {ChildrenOf, Document} from '@mintter/mttast'
import {KeyboardEvent, useMemo, useRef, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import toastFactory from 'react-hot-toast'
import {useQueryClient} from 'react-query'
import {ReactEditor} from 'slate-react'
import {useLocation} from 'wouter'
import {ContextFrom, StateFrom} from 'xstate'
import {PageProps} from './types'

export default function EditorPage({params}: PageProps) {
  const client = useQueryClient()
  const [, setLocation] = useLocation()
  const toast = useRef('')
  const [visible, setVisible] = useState(false)
  const sidepanelService = useSidepanel()
  const editor = useMemo(() => buildEditorHook(plugins, EditorMode.Draft), [])
  const [state, send] = useEditorDraft({
    documentId: params!.docId,
    afterPublish: (context: ContextFrom<ReturnType<typeof draftEditorMachine>>) => {
      if (!toast.current) {
        toast.current = toastFactory.success('Draft Published!', {position: 'top-center', duration: 2000})
      } else {
        toastFactory.success('Draft Published!', {position: 'top-center', duration: 2000, id: toast.current})
      }

      setLocation(`/p/${context.localDraft?.id}/${context.publication?.version}`, {
        // we replace the history here because the draft url will not be available after publish.
        replace: true,
      })
    },
    loadAnnotations: (context: ContextFrom<ReturnType<typeof draftEditorMachine>>) => {
      if (!context.localDraft || typeof context.localDraft.content == 'string') return

      sidepanelService.send(
        sidepanelModel.events.SIDEPANEL_LOAD_ANNOTATIONS(context.localDraft.content as ChildrenOf<Document>),
      )
    },
    client,
  })

  const {context} = state

  // useLayoutEffect(() => {
  //   if (context.localDraft?.title) {
  //     // set the window title to reflect the documents title
  //     getCurrentWindow().setTitle(context.localDraft.title)
  //   } else {
  //     getCurrentWindow().setTitle('Untitled Document')
  //   }
  // }, [context.localDraft?.title])

  useEnableSidepanel()

  if (state.matches('fetching')) {
    return <Text>fetching...</Text>
  }

  if (state.matches('idle.errored')) {
    return <Text>ERROR: {context.errorMessage}</Text>
  }

  if (state.matches('editing') && context.localDraft?.content) {
    return (
      <ErrorBoundary FallbackComponent={AppError} onReset={() => window.location.reload()}>
        <Box
          css={{
            background: '$background-alt',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: '$max',
            padding: '$5',
            '@bp2': {
              paddingLeft: 80,
            },
            $$gap: '16px',
            display: 'flex',
            gap: '$$gap',
            alignItems: 'center',
            '& *': {
              position: 'relative',
            },
          }}
        >
          <Button size="1" variant="ghost" onClick={() => send('PUBLISH')}>
            Publish
          </Button>
          <TextField
            size={1}
            data-testid="editor_title"
            name="title"
            placeholder="Document title"
            value={context?.localDraft?.title}
            onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key == 'Enter') {
                event.preventDefault()
                ReactEditor.focus(editor)
              }
            }}
            onChange={(event) => {
              // update window title as the user types
              // getCurrentWindow().setTitle(event.currentTarget.value)
              send(editorModel.events.UPDATE({title: event.currentTarget.value} as EditorDocument))
            }}
          />
        </Box>
        <Box
          data-testid="editor-wrapper"
          css={{
            padding: '$5',
            paddingTop: '$8',
            marginHorizontal: '$4',
            paddingBottom: 300,
            height: '100%',
            '@bp2': {
              marginHorizontal: '$9',
            },
          }}
        >
          <Box css={{width: '$full', maxWidth: '64ch'}}>
            {/* <Textarea
              css={
                {
                  color: '$text-muted',
                  fontSize: '$4',
                } as CSS
              }
              data-testid="editor_subtitle"
              name="subtitle"
              placeholder="about this publication..."
              value={context.localDraft.subtitle}
              onChange={(event) =>
                send({
                  type: 'UPDATE',
                  payload: {
                    subtitle: event.currentTarget.value,
                  },
                })
              }
            /> */}
            {/* <Separator css={{margin: '10px 0'}} /> */}
            {context.localDraft?.content && (
              <>
                <Editor
                  editor={editor}
                  value={context.localDraft.content}
                  //@ts-ignore
                  onChange={(content: ChildrenOf<Document>) => {
                    if (!content && typeof content == 'string') return
                    send(editorModel.events.UPDATE({content}))
                    sidepanelService.send(sidepanelModel.events.SIDEPANEL_LOAD_ANNOTATIONS(content))
                  }}
                />

                <Box css={{marginTop: 40}}>
                  <button type="button" onClick={() => setVisible((v) => !v)}>
                    toggle Value
                  </button>
                  {visible && (
                    <Box
                      as="pre"
                      css={{
                        padding: 20,
                        backgroundColor: '$background-muted',
                        overflowX: 'scroll',
                      }}
                    >
                      {JSON.stringify(context.localDraft.content, null, 2)}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box
          css={{
            background: '$background-alt',
            width: '$full',
            position: 'absolute',
            bottom: 0,
            zIndex: '$max',
            padding: '$5',
            '@bp2': {
              paddingLeft: 80,
            },
            '&:after': {
              content: '',
              position: 'absolute',
              width: '$full',
              height: 20,
              background: 'linear-gradient(0deg, $colors$background-alt 0%, rgba(255,255,255,0) 100%)',
              top: -20,
              left: 0,
            },
            $$gap: '24px',
            display: 'flex',
            gap: '$$gap',
            alignItems: 'center',
            '& > span': {
              position: 'relative',
            },
            '& > span:before': {
              content: `"|"`,
              color: '$text-muted',
              position: 'absolute',
              right: -15,
              top: 0,
            },
          }}
        >
          <Text size="1" color="muted">
            Created on: {getDateFormat(context.localDraft, 'createTime')}
          </Text>
          <Text size="1" color="muted">
            Last modified: {getDateFormat(context.localDraft, 'updateTime')}
          </Text>
          <EditorStatus state={state} />
        </Box>
      </ErrorBoundary>
    )
  }

  return null
}

function EditorStatus({state}: {state: StateFrom<ReturnType<typeof draftEditorMachine>>}) {
  return (
    <Box
      css={{
        display: 'flex',
        gap: '$2',
        alignItems: 'center',
      }}
    >
      <Box
        css={{
          $$size: '$space$4',
          width: '$$size',
          height: '$$size',
          borderRadius: '$round',
          backgroundColor: state.matches('editing.idle')
            ? '$success-softer'
            : state.matches('editing.debouncing')
            ? '$background-muted'
            : state.matches('editing.saving')
            ? '$warning-soft'
            : '$danger-soft',
        }}
      />
      <Text color="muted" size="1">
        {state.matches('editing.idle')
          ? 'saved'
          : state.matches('editing.debouncing')
          ? 'unsaved'
          : state.matches('editing.saving')
          ? 'saving...'
          : ''}
      </Text>
    </Box>
  )
}
