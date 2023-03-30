import { useMainActor } from '@app/hooks/main-actor'
import { classnames } from '@app/utils/classnames'
import { Box } from '@components/box'
import { Button } from '@components/button'
import { Heading } from '@components/heading'
import { TitleBar } from '@components/titlebar'
import { lazy, useEffect, useState } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Redirect, useLocation } from 'wouter'
import { Route, useRoute } from '../components/router'
import { Main as TMain } from '@mintter/ui'
import '../styles/main.scss'
import './polyfills'

var PublicationList = lazy(() => import('@app/pages/publication-list-page'))
var Site = lazy(() => import('@app/pages/site-page'))
var DraftList = lazy(() => import('@app/pages/draft-list-page'))
var Publication = lazy(() => import('@app/pages/publication'))
var Draft = lazy(() => import('@app/pages/draft'))
var Settings = lazy(() => import('@app/pages/settings'))
var QuickSwitcher = lazy(() => import('@components/quick-switcher'))
import { listen as tauriListen } from '@tauri-apps/api/event'
import ConnectionsPage from './connections-page'
import AccountPage from './account-page'
import { FindContextProvider } from '@app/editor/find'
import { TooltipProvider } from '@components/tooltip'

export default function Main() {
  const [, setLocation] = useLocation()
  const [isSettings] = useRoute('/settings')
  const mainActor = useMainActor()
  const [search, setSearch] = useState('')

  useEffect(() => {
    let unlisten: () => void
    tauriListen('open_connections', () => {
      setLocation('/connections')
    }).then((a) => {
      unlisten = a
    })
    return () => {
      unlisten?.()
    }
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={MainBoundary}
      onReset={() => {
        window.location.reload()
      }}
    >
      <FindContextProvider value={{ search, setSearch }}>
        <TooltipProvider>
          <div className={classnames('main-root', { settings: isSettings })}>
            <TMain>
              <Route path="/inbox">
                <PublicationList />
              </Route>
              <Route path="/drafts">
                <DraftList />
              </Route>
              <Route path="/sites/:hostname">
                <Site />
              </Route>
              <Route path="/connections">
                <ConnectionsPage />
              </Route>
              <Route path="/account/:id">
                <AccountPage />
              </Route>
              <Route path="/p/:id/:version/:block?">
                {mainActor?.type === 'publication' ? (
                  <Publication
                    // key={window.location.href}
                    publicationActor={mainActor.actor}
                  />
                ) : null}
              </Route>
              <Route path="/d/:id/:tag?">
                {mainActor?.type === 'draft' ? (
                  <Draft
                    key={window.location.href}
                    draftActor={mainActor.actor}
                    editor={mainActor.editor}
                  />
                ) : null}
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route>{() => <Redirect to="/inbox" />}</Route>
            </TMain>
            <TitleBar clean={isSettings} mainActor={mainActor} />
            {!isSettings ? <QuickSwitcher /> : null}
          </div>
        </TooltipProvider>
      </FindContextProvider>
    </ErrorBoundary>
  )
}

function MainBoundary({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      css={{
        background: '$base-background-normal',
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        css={{
          background: '$base-background-subtle',
          boxShadow: '$menu',
          padding: '$4',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '50vw',
        }}
      >
        <Heading color="danger">App Error!</Heading>
        <pre>{error.message}</pre>
        <Button onClick={resetErrorBoundary} css={{ alignSelf: 'flex-end' }}>
          Reload
        </Button>
      </Box>
    </Box>
  )
}
