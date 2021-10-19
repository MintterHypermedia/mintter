import {globalCss} from '@mintter/ui/stitches.config'
import type {FallbackProps} from 'react-error-boundary'
import {ErrorBoundary} from 'react-error-boundary'
import {attachConsole, error} from 'tauri-plugin-log-api'
import {AuthorNode} from './author-node'

if (!import.meta.env.SSR) {
  attachConsole()

  window.addEventListener('error', (e) => error(e.message))
}

const globalStyles = globalCss({
  body: {
    backgroundColor: '$background-alt',
    color: '$text-default',
  },
})

export function App() {
  globalStyles()

  return (
    <ErrorBoundary
      FallbackComponent={AppError}
      onReset={() => {
        location.reload()
      }}
    >
      <AuthorNode />
    </ErrorBoundary>
  )
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
