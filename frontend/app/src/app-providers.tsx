import {Theme} from '@mintter/ui/theme'
import {useInterpret} from '@xstate/react'
import {AuthProvider} from 'frontend/app/src/auth-context'
import {authStateMachine} from 'frontend/app/src/authstate-machine'
import {PropsWithChildren, Suspense} from 'react'
import {Toaster} from 'react-hot-toast'
import {dehydrate, Hydrate, QueryClient, QueryClientProvider} from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
    },
  },
})
console.log('🚀 ~ file: app-providers.tsx ~ line 13 ~ queryClient', queryClient)

const dehydrateState = dehydrate(queryClient)

export function AppProviders({children}: PropsWithChildren<unknown>) {
  const authService = useInterpret(authStateMachine)
  return (
    <AuthProvider value={authService}>
      <Theme>
        <Suspense fallback={<p>loading...</p>}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydrateState}>
              {children}
              <Toaster position="bottom-right" />
              {/** @TODO Uncommenting this causes an error with react-query. We should fix this */}
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </Hydrate>
          </QueryClientProvider>
        </Suspense>
      </Theme>
    </AuthProvider>
  )
}
