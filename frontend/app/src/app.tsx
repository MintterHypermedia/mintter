import {mainService as defaultMainService} from '@app/app-providers'
import {useAuthService} from '@app/auth-context'
import {MainPage} from '@app/pages/main-page'
import {LibraryShell} from '@components/library'
import {QuickSwitcher} from '@components/quick-switcher'
import {useActor} from '@xstate/react'
import {lazy} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {setLogger} from 'react-query'
import 'show-keys'
import {error, info, warn} from 'tauri-plugin-log-api'
import {MainPageShell, MainWindowShell} from './pages/window-components'
import {globalStyles} from './stitches.config'

setLogger({
  log: (...args) => info(args.toString()),
  warn: (...args) => warn(args.toString()),
  // ✅ no more errors on the console
  error: () => {
    // noop
  },
})

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

const OnboardingPage = lazy(() => import('./pages/onboarding'))

type AppProps = {
  mainService?: typeof defaultMainService
}

export function App({mainService = defaultMainService}: AppProps) {
  globalStyles()
  const service = useAuthService()
  const [state] = useActor(service)

  if (state.matches('checkingAccount')) {
    return <AppShell />
  }

  if (state.matches('loggedOut')) {
    return <OnboardingPage />
  }

  if (state.matches('loggedIn')) {
    return (
      <ErrorBoundary
        FallbackComponent={AppError}
        onReset={() => {
          location.reload()
        }}
      >
        <MainPage mainService={mainService} />
        <QuickSwitcher />
      </ErrorBoundary>
    )
  }

  error('ERROR: no state match on MainPage')

  return null
}

export function AppError({error, resetErrorBoundary}: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong loading the App:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function AppShell() {
  return (
    <MainPageShell>
      <LibraryShell />
      <MainWindowShell />
    </MainPageShell>
  )
}
