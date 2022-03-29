import { CitationsProvider, createCitationsMachine } from '@app/editor/citations'
import { HoverProvider } from '@app/editor/hover-context'
import { hoverMachine } from '@app/editor/hover-machine'
import { MainPageProvider } from '@app/main-page-context'
import { createMainPageMachine } from '@app/main-page-machine'
import { css } from '@app/stitches.config'
import { BookmarksProvider, createBookmarksMachine } from '@components/bookmarks'
import { Box } from '@components/box'
import { Library } from '@components/library'
import { ScrollArea } from '@components/scroll-area'
import { createSidepanelMachine, Sidepanel, SidepanelProvider } from '@components/sidepanel'
import { Text } from '@components/text'
import { Topbar } from '@components/topbar'
import { useInterpret } from '@xstate/react'
import { ReactNode } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { QueryClient, useQueryClient } from 'react-query'
import { Route } from 'wouter'
import EditorPage from './editor'
import Publication from './publication'
export function MainPage({ client: propClient }: { client?: QueryClient }) {
  // eslint-disable-line
  const localClient = useQueryClient()
  const client = propClient ?? localClient
  const sidepanelService = useInterpret(() => createSidepanelMachine(client))
  const bookmarksService = useInterpret(() => createBookmarksMachine(client))
  const hoverService = useInterpret(() => hoverMachine)
  const citationsService = useInterpret(() => createCitationsMachine(client))
  const mainPageService = useInterpret(() => createMainPageMachine(client), {
    actions: {
      reconcileLibrary: (context) => {
        context.files.send('RECONCILE')
        context.drafts.send('RECONCILE')
      },
    },
  })

  return (
    <MainPageProvider value={mainPageService}>
      <CitationsProvider value={citationsService}>
        <HoverProvider value={hoverService}>
          <BookmarksProvider value={bookmarksService}>
            <SidepanelProvider value={sidepanelService}>
              <Box className={rootPageStyle()}>
                <Topbar />
                <Library />
                <MainWindow>
                  <ErrorBoundary
                    FallbackComponent={PageError}
                    onReset={() => {
                      window.location.reload()
                    }}
                  >
                    <Route path="/p/:docId/:version/:blockId?" component={Publication} />
                    <Route path="/editor/:docId" component={EditorPage} />
                    {/* <Route path="/" component={Placeholder} /> */}
                  </ErrorBoundary>
                </MainWindow>
                <Sidepanel />
              </Box>
            </SidepanelProvider>
          </BookmarksProvider>
        </HoverProvider>
      </CitationsProvider>
    </MainPageProvider>
  )
}

export var rootPageStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  display: 'grid',
  overflow: 'hidden',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gridTemplateRows: '48px 1fr',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 0,
  gridTemplateAreas: `"topbar topbar topbar"
  "library main sidepanel"`,
  background: '$background-default',
})

function MainWindow({ children }: { children: ReactNode }) {
  return (
    <Box
      css={{
        gridArea: 'main',
        overflow: 'scroll',
        backgroundColor: '$background-alt',
      }}
    >
      <ScrollArea>{children}</ScrollArea>
    </Box>
  )
}

function Placeholder() {
  return (
    <Box
      aria-hidden
      css={{
        width: '$full',
        height: '$full',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Text
        alt
        fontWeight="bold"
        css={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          fontSize: 100,
          opacity: 0.5,
          color: 'transparent',
          textShadow: '2px 2px 3px rgba(255,255,255,0.5)',
          backgroundClip: 'text',
          backgroundColor: '$background-neutral-strong',
        }}
      >
        Mintter
      </Text>
    </Box>
  )
}

function PageError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Publication Error</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>reload page</button>
    </div>
  )
}
