import {
  AppProviders,
  mainService as defaultMainService,
} from '@app/app-providers'
import {
  Account,
  Document,
  Info,
  ListAccountsResponse,
  ListDraftsResponse,
  ListPublicationsResponse,
  Publication,
} from '@app/client'
import {queryKeys} from '@app/hooks'
import {createMainPageService} from '@app/main-page-machine'
import {mount} from '@cypress/react'
import {ReactNode} from 'react'
import {QueryClient} from 'react-query'
import {interpret} from 'xstate'
;(function mockTauriIpc() {
  if (window) {
    window.__TAURI_IPC__ = function mockTAURI_IPC() {
      // noob
    }
  }
})()

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
      },
    },
  })
}

type MountProvidersProps = {
  client?: QueryClient
  account?: Account
  accountList?: Array<Account>
  draftList?: Array<Document>
  draft?: Document
  publication?: Publication
  publicationList?: Array<Publication>
  initialRoute?: string
  mainService?: typeof defaultMainService
}

export function mountProviders({
  client,
  account,
  accountList,
  draft,
  draftList,
  publication,
  publicationList,
  initialRoute,
  mainService = defaultMainService,
}: MountProvidersProps = {}) {
  let peerId = 'testPeerId'

  client ||= createTestQueryClient()

  account ||= {
    id: 'testAccountId',
    profile: {
      alias: 'demo',
      email: 'test@demo.com',
      bio: 'demo bio',
    },
    devices: {
      [peerId]: {
        peerId,
      },
    },
  }

  client.setQueryData<Info>([queryKeys.GET_ACCOUNT_INFO], {
    peerId,
    accountId: account.id,
    startTime: undefined,
  })

  client.setQueryData<Account>([queryKeys.GET_ACCOUNT, ''], account)

  accountList ||= []

  client.setQueryData<ListAccountsResponse>([queryKeys.GET_ACCOUNT_LIST], {
    accounts: accountList,
    nextPageToken: '',
  })

  draftList ||= draft ? [draft] : []

  client.setQueryData<ListDraftsResponse>([queryKeys.GET_DRAFT_LIST], {
    documents: draftList,
    nextPageToken: '',
  })

  if (draft) {
    client.setQueryData<Document>([queryKeys.GET_DRAFT, draft.id], {
      ...draft,
      author: account.id,
    })
  }

  publicationList ||= publication ? [publication] : []

  client.setQueryData<ListPublicationsResponse>(
    [queryKeys.GET_PUBLICATION_LIST],
    {
      publications: publicationList,
      nextPageToken: '',
    },
  )

  if (publication) {
    client.setQueryData<Publication>(
      [
        queryKeys.GET_PUBLICATION,
        publication.document?.id,
        publication.version,
      ],
      {
        ...publication,
        document: {
          ...publication.document,
          author: account.id,
        },
      },
    )
  }

  client.invalidateQueries = cy.spy()

  if (typeof mainService == 'undefined') {
    console.log('MAIN SERVICE IS UNDEFINED')

    mainService = interpret(createMainPageService({client, initialRoute}))
  }

  console.log('MAIN SERVICE:', mainService, client.getQueryData())

  function render(ui: ReactNode) {
    return mount(
      <AppProviders
        client={client}
        initialRoute={initialRoute}
        mainService={mainService}
      >
        {ui}
      </AppProviders>,
    )
  }

  return {
    mainService,
    client,
    account,
    draftList,
    publicationList,
    draft,
    publication,
    render,
  }
}
