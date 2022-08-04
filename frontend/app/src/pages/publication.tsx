import {AppError} from '@app/app'
import {mainService as defaultMainService} from '@app/app-providers'
import {BlockTools} from '@app/editor/block-tools'
import {BlockToolsProvider} from '@app/editor/block-tools-context'
import {blockToolsMachine} from '@app/editor/block-tools-machine'
import {Editor} from '@app/editor/editor'
import {EditorMode} from '@app/editor/plugin-utils'
import {FileProvider} from '@app/file-provider'
import {PublicationRef} from '@app/main-machine'
import {MainWindow} from '@app/pages/window-components'
import {Box} from '@components/box'
import {Button} from '@components/button'
import {Discussion} from '@components/discussion'
import {Placeholder} from '@components/placeholder-box'
import {Text} from '@components/text'
import {useActor, useInterpret} from '@xstate/react'
import {useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

type PublicationProps = {
  publicationRef: PublicationRef
  mainService?: typeof defaultMainService
}

function usePublication(ref: PublicationRef) {
  useEffect(() => {
    ref.send('LOAD')

    return () => {
      ref.send('UNLOAD')
    }
  }, [ref])

  return useActor(ref)
}

export default function Publication({
  publicationRef,
  mainService = defaultMainService,
}: PublicationProps) {
  let [state, send] = usePublication(publicationRef)
  const blockToolsService = useInterpret(() => blockToolsMachine)
  if (state.matches('publication.fetching')) {
    return <PublicationShell />
  }

  // start rendering
  if (state.matches('publication.errored')) {
    return (
      <Box
        css={{
          paddingTop: '$5',
          marginBottom: 200,
        }}
        data-testid="publication-wrapper"
      >
        <Text>Publication ERROR</Text>
        <Text>{state.context.errorMessage}</Text>
        <Button onClick={() => send('PUBLICATION.FETCH.DATA')} color="muted">
          try again
        </Button>
      </Box>
    )
  }

  if (state.matches('publication.ready')) {
    return (
      <ErrorBoundary
        FallbackComponent={AppError}
        onReset={() => window.location.reload()}
      >
        <MainWindow onScroll={() => blockToolsService.send('DISABLE')}>
          <FileProvider value={publicationRef}>
            <BlockToolsProvider value={blockToolsService}>
              <Box
                css={{
                  paddingBottom: 0,
                  marginBlockEnd: 50,
                  paddingInline: '3rem',
                }}
                data-testid="publication-wrapper"
              >
                {state.context.publication?.document?.content && (
                  <>
                    <BlockTools
                      mode={EditorMode.Publication}
                      service={blockToolsService}
                    />
                    <Editor
                      editor={state.context.editor}
                      mode={EditorMode.Publication}
                      value={state.context.publication?.document.content}
                      onChange={() => {
                        blockToolsService.send('DISABLE')
                        // noop
                      }}
                    />
                  </>
                )}
              </Box>
              <Box
                css={{
                  marginBottom: 200,
                  marginInline: '4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '$4',
                }}
              >
                <Button
                  variant="ghost"
                  color="primary"
                  size="1"
                  onClick={() => send('DISCUSSION.TOGGLE')}
                >
                  {state.matches('discussion.ready.hidden') ? 'Show ' : 'Hide '}
                  Discussion/Citations
                </Button>
                <Discussion
                  service={publicationRef}
                  mainService={mainService}
                />
              </Box>
            </BlockToolsProvider>
          </FileProvider>
        </MainWindow>
      </ErrorBoundary>
    )
  }

  return null
}

function PublicationShell() {
  return (
    <Box
      css={{
        width: '$full',
        padding: '$7',
        paddingTop: '$9',
        display: 'flex',
        flexDirection: 'column',
        gap: '$7',
      }}
    >
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
        gap: '$3',
      }}
    >
      <Placeholder css={{height: 24, width: '$full'}} />
      <Placeholder css={{height: 24, width: '92%'}} />
      <Placeholder css={{height: 24, width: '84%'}} />
      <Placeholder css={{height: 24, width: '90%'}} />
    </Box>
  )
}
