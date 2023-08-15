import {QueryCache, QueryClient, QueryKey} from '@tanstack/react-query'
import {toast} from '@mintter/app/src/toast'
// import {labelOfQueryKey, queryKeys} from './models/query-keys'
import {JsonValue} from '@bufbuild/protobuf'
import {copyTextToClipboard} from '@mintter/app/src/copy-to-clipboard'
import {AppIPC} from '@mintter/app/src/app-ipc'

function copyDetails(randomDetails: JsonValue) {
  const detailString = JSON.stringify(randomDetails, null, 2)
  copyTextToClipboard(detailString)
  toast.success(`📋 Copied details to clipboard`)
}

export type AppInvalidateQueries = (queryKey: QueryKey) => void
export type AppQueryClient = {
  client: QueryClient
  invalidate: AppInvalidateQueries
}
export function getQueryClient(ipc: AppIPC): AppQueryClient {
  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (err, query) => {
        const queryKey = query.queryKey as string[]
        const errorMessage = ((err as any)?.message || null) as string | null // todo: repent for my sins
        // toast.error(`Failed to Load ${labelOfQueryKey(queryKey)}`, {
        toast.error(`Failed to Load`, {
          onClick: () => {
            copyDetails({queryKey, errorMessage})
          },
        })
      },
    }),
    defaultOptions: {
      queries: {
        networkMode: 'offlineFirst',
        useErrorBoundary: true,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnReconnect: false,
        onError: (err) => {
          console.log(`Query error: ${JSON.stringify(err)}`)
        },
        retry: 4,
        retryDelay: (attempt) =>
          Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
        keepPreviousData: true,
      },
    },
  })

  ipc
    .listen('invalidate_queries', (event: any) => {
      const queryKey = event.payload as QueryKey
      client.invalidateQueries(queryKey)
    })
    .then((unlisten) => {
      // noop
    })

  function appInvalidateQueries(queryKey: QueryKey) {
    ipc.send?.('invalidate_queries', queryKey)
  }

  return {
    client,
    invalidate: appInvalidateQueries,
  }
}
