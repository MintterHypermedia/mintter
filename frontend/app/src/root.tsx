import {queryKeys} from '@app/hooks'
import {themeMachine, ThemeProvider} from '@app/theme'
import {
  dehydrate,
  Hydrate,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {onUpdaterEvent} from '@tauri-apps/api/updater'
import {useInterpret} from '@xstate/react'
import {Suspense, useEffect, useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {Toaster} from 'react-hot-toast'
import {attachConsole, debug} from 'tauri-plugin-log-api'
import {globalStyles} from './stitches.config'
import OnboardingPage from '@app/pages/onboarding'
import AppProvider from '@components/app-provider'
import Main from '@app/pages/main'
import {store} from '@app/app-store'

import './styles/root.scss'
import './styles/toaster.scss'
import {appQueryClient} from './query-client'
import {listen} from '@tauri-apps/api/event'
import {accountsClient, daemonClient, networkingClient} from '@app/api-clients'
import {Account} from '@mintter/shared'
import {ScrollArea} from '@radix-ui/react-scroll-area'
import {DaemonStatusProvider} from '@app/node-status-context'
import {NavigationProvider} from './utils/navigation'

import('./updater')

// TauriSentry.init({
//   integrations: [new BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// })

attachConsole()

onUpdaterEvent(({error, status}) => {
  debug(`Updater event. error: ${error} status: ${status}`)
})

export function Root() {
  const themeService = useInterpret(themeMachine)

  globalStyles()

  return (
    <QueryClientProvider client={appQueryClient}>
      <Suspense>
        <Hydrate state={dehydrateState}>
          <ErrorBoundary FallbackComponent={AppError}>
            <ThemeProvider value={themeService}>
              <NavigationProvider>
                <App />
              </NavigationProvider>
              <Toaster
                position="bottom-right"
                toastOptions={{className: 'toaster'}}
              />
            </ThemeProvider>
          </ErrorBoundary>
        </Hydrate>
      </Suspense>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

function App() {
  usePageZoom()

  return (
    <DaemonStatusProvider>
      <Main />
    </DaemonStatusProvider>
  )
}

/**
 * we need this to run tests without the `__TAURI_IPC__ not a function` error since we are not running tests inside Tauri (yet)
 */
//@ts-ignore
if (window.Cypress) {
  //@ts-ignore
  window.TAURI_IPC = function () {
    // noop
  }
  window.__TAURI_IPC__ = function TauriIPCMock() {
    // noop
  }
  window.__TAURI_METADATA__ = {
    __currentWindow: {
      label: 'test',
    },
    __windows: [
      {
        label: 'test',
      },
    ],
  }
}

var dehydrateState = dehydrate(appQueryClient)

export function AppError({error, resetErrorBoundary}: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong loading the App:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function usePageZoom() {
  useEffect(() => {
    store.get<number>('zoom').then((value) => {
      let val = value ?? 1
      document.body.style = `zoom: ${val};`
    })
  }, [])

  useEffect(() => {
    let unlisten: () => void | undefined

    listen('change_zoom', async (event: {payload: 'zoomIn' | 'zoomOut'}) => {
      let currentZoom = (await store.get<number>('zoom')) || 1
      let newVal =
        event.payload == 'zoomIn' ? (currentZoom += 0.1) : (currentZoom -= 0.1)

      document.body.style = `zoom: ${newVal};`
      store.set('zoom', currentZoom)
    }).then((f) => (unlisten = f))

    return () => unlisten?.()
  }, [])

  useEffect(() => {
    let unlisten: () => void | undefined

    listen('reset_zoom', async (event: {payload: 'zoomReset'}) => {
      console.log('RESET ZOOM!', event)
      document.body.style = `zoom: 1;`
      store.set('zoom', 1)
    }).then((f) => (unlisten = f))

    return () => unlisten?.()
  }, [])
}
