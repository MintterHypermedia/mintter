import {useAuth} from '@app/auth-context'
import {startLogger} from '@app/utils/logger'
import {Text} from '@components/text'
import {useActor} from '@xstate/react'
import {lazy} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {setLogger} from 'react-query'
import {MainPage} from './pages/main-page'
import {globalCss} from './stitches.config'

setLogger({
  log: console.log,
  warn: console.warn,
  // ✅ no more errors on the console
  error: () => {
    // noop
  },
})

const OnboardingPage = lazy(() => import('./pages/onboarding'))

startLogger()

const globalStyles = globalCss({
  body: {
    backgroundColor: '$background-alt',
    color: '$text-default',
  },
})

export function App() {
  globalStyles()
  const service = useAuth()
  const [state] = useActor(service)

  if (state.matches('checkingAccount')) {
    return <Text>Checking Account...</Text>
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
        <MainPage />
      </ErrorBoundary>
    )
  }

  console.error('ERROR: no state match on MainPage')

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
