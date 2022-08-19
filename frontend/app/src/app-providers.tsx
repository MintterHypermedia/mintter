import {HoverProvider} from '@app/editor/hover-context'
import {createHoverService} from '@app/editor/hover-machine'
import {createMainPageService} from '@app/main-machine'
import {
  BookmarksProvider,
  createBookmarkListMachine,
} from '@components/bookmarks'
import {useInterpret} from '@xstate/react'
import {PropsWithChildren, Suspense, useState} from 'react'
import {dehydrate, Hydrate, QueryClient, QueryClientProvider} from 'react-query'
import {interpret} from 'xstate'
import {AuthProvider} from './auth-context'
import {createAuthService} from './auth-machine'
import {FindContextProvider} from './editor/find'
import {createThemeService, ThemeProvider} from './theme'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
    },
  },
})

const dehydrateState = dehydrate(queryClient)

const initMainService = interpret(
  createMainPageService({client: queryClient}),
).start()

export const mainService = initMainService

type AppProvidersProps = {
  client?: QueryClient
  initialRoute?: string
  mainService?: typeof initMainService
}

export function AppProviders({
  children,
  client = queryClient,
}: PropsWithChildren<AppProvidersProps>) {
  const themeService = useInterpret(() => createThemeService())
  const authService = useInterpret(() => createAuthService(client))
  const bookmarksService = useInterpret(() => createBookmarkListMachine(client))
  const hoverService = useInterpret(() => createHoverService())
  const [search, setSearch] = useState('')

  return (
    <QueryClientProvider client={client}>
      <AuthProvider value={authService}>
        <ThemeProvider value={themeService}>
          <Suspense fallback={<p>loading...</p>}>
            <Hydrate state={dehydrateState}>
              <HoverProvider value={hoverService}>
                <BookmarksProvider value={bookmarksService}>
                  {
                    // TODO: @jonas check types on SearchTearmProvider
                  }
                  <FindContextProvider value={{search, setSearch}}>
                    {children}
                  </FindContextProvider>
                </BookmarksProvider>
              </HoverProvider>
            </Hydrate>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
