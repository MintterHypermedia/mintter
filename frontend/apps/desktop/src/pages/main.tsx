import {useMainActor} from '@app/models/main-actor'
import {NavRoute, useNavigate, useNavRoute} from '@app/utils/navigation'
import {Box} from '@components/box'
import {TitleBar} from '@components/titlebar'
import {Heading, YStack, Button} from '@mintter/ui'
import {listen as tauriListen} from '@tauri-apps/api/event'
import {lazy, useEffect} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {NotFoundPage} from './base'
import './polyfills'

var PublicationList = lazy(() => import('@app/pages/publication-list-page'))
var DraftList = lazy(() => import('@app/pages/draft-list-page'))
var Account = lazy(() => import('@app/pages/account-page'))
var Connections = lazy(() => import('@app/pages/connections-page'))
var Site = lazy(() => import('@app/pages/site-page'))
var Publication = lazy(() => import('@app/pages/publication'))
var Draft = lazy(() => import('@app/pages/draft'))
var Settings = lazy(() => import('@app/pages/settings'))
var QuickSwitcher = lazy(() => import('@components/quick-switcher'))

function getPageComponent(navRoute: NavRoute) {
  switch (navRoute.key) {
    case 'home':
      return PublicationList
    case 'drafts':
      return DraftList
    case 'site':
      return Site
    case 'connections':
      return Connections
    case 'account':
      return Account
    case 'publication':
      return Publication
    case 'draft':
      return Draft
    case 'settings':
      return Settings
    default:
      return NotFoundPage
  }
}

export default function Main() {
  const mainActor = useMainActor()
  const navR = useNavRoute()
  const isSettings = navR.key === 'settings'
  const navigate = useNavigate()
  const PageComponent = getPageComponent(navR)
  useEffect(() => {
    let unlisten: () => void
    tauriListen<NavRoute>('open_route', (event) => {
      // we might fix this by using zod for routes and validating them
      const route = event.payload
      navigate(route)
    }).then((a) => {
      unlisten = a
    })
    return () => {
      unlisten?.()
    }
  }, [navigate])

  return (
    <YStack fullscreen>
      <ErrorBoundary
        FallbackComponent={MainBoundary}
        onReset={() => {
          window.location.reload()
        }}
      >
        <TitleBar clean={isSettings} mainActor={mainActor} />
        {/* @ts-ignore */}
        <PageComponent mainActor={mainActor} />
        {!isSettings ? <QuickSwitcher /> : null}
      </ErrorBoundary>
    </YStack>
  )
}

function MainBoundary({error, resetErrorBoundary}: FallbackProps) {
  return (
    <Box
      css={{
        background: '$base-background-normal',
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      data-tauri-drag-region
    >
      <Box
        css={{
          background: '$base-background-subtle',
          boxShadow: '$menu',
          padding: '$4',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '50vw',
          maxWidth: 565,
        }}
      >
        <Heading theme="red">App Error!</Heading>
        <Box
          css={{
            fontFamily: 'ui-monospace,monospace',
            padding: '$2',
            background: '$warning-background-normal',
            marginVertical: '$6',
          }}
        >
          {error.message}
        </Box>
        <Button onPress={resetErrorBoundary} alignSelf="flex-end">
          Reload
        </Button>
      </Box>
    </Box>
  )
}
