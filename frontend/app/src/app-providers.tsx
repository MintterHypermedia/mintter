import {getInfo} from '@app/client'
import {queryKeys} from '@app/hooks'
import {useInterpret} from '@xstate/react'
import {PropsWithChildren, Suspense} from 'react'
import {Toaster} from 'react-hot-toast'
import {dehydrate, Hydrate, QueryClient, QueryClientProvider} from 'react-query'
import {assign} from 'xstate'
import {AuthProvider} from './auth-context'
import {authMachine} from './auth-machine'
import {themeMachine, ThemeProvider} from './theme'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
    },
  },
})

const dehydrateState = dehydrate(queryClient)

type AppProvidersProps = {
  client?: QueryClient
}

export function AppProviders({children, client = queryClient}: PropsWithChildren<AppProvidersProps>) {
  const authService = useInterpret(() => authMachine, {
    services: {
      fetchInfo: () => (sendBack) => {
        client
          .fetchQuery([queryKeys.GET_ACCOUNT_INFO], () => getInfo())
          .then(function (accountInfo) {
            sendBack({type: 'REPORT.DEVICE.INFO.PRESENT', accountInfo})
          })
          .catch(function (err) {
            sendBack('REPORT.DEVICE.INFO.MISSING')
          })
      },
    },
    actions: {
      assignAccountInfo: assign((_, event) => ({
        accountInfo: event.accountInfo,
      })),
      removeAccountInfo: assign({
        accountInfo: undefined,
      }),
    },
  })
  const themeService = useInterpret(() => themeMachine)
  return (
    <QueryClientProvider client={client}>
      <AuthProvider value={authService}>
        <ThemeProvider value={themeService}>
          <Suspense fallback={<p>loading...</p>}>
            <Hydrate state={dehydrateState}>
              {children}
              <Toaster position="bottom-right" />
            </Hydrate>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
