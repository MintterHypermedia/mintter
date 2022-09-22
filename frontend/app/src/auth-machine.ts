import {
  Account,
  getAccount,
  listPeerAddrs,
  Profile,
  updateProfile,
} from '@app/client'
import {queryKeys} from '@app/hooks'
import {QueryClient} from '@tanstack/react-query'
import {assign, createMachine} from 'xstate'
import {getInfo, Info} from './client'

type AuthContext = {
  accountInfo?: Info
  retries: number
  account?: Account
  errorMessage: string
  peerAddrs: Array<string>
}

type AuthEvent =
  | {
      type: 'REPORT.DEVICE.INFO.PRESENT'
      accountInfo: Info
    }
  | {
      type: 'REPORT.DEVICE.INFO.MISSING'
    }
  | {
      type: 'UPDATE.PROFILE'
      profile: Profile
    }
  | {
      type: 'RETRY'
    }

type AuthService = {
  fetchAccount: {
    data: Account
  }
  updateProfile: {
    data: Account
  }
  fetchPeerData: {
    data: Array<string>
  }
}

export function createAuthService(client: QueryClient) {
  return createMachine(
    {
      id: 'authStateMachine',
      predictableActionArguments: true,
      tsTypes: {} as import('./auth-machine.typegen').Typegen0,
      schema: {
        context: {} as AuthContext,
        events: {} as AuthEvent,
        services: {} as AuthService,
      },
      context: {
        accountInfo: undefined,
        retries: 0,
        account: undefined,
        errorMessage: '',
        peerAddrs: [],
      },
      initial: 'checkingAccount',
      states: {
        checkingAccount: {
          invoke: {
            id: 'authMachine-fetch',
            src: 'fetchInfo',
            onError: {
              target: 'loggedOut',
            },
          },
          on: {
            'REPORT.DEVICE.INFO.PRESENT': {
              target: 'loggedIn',
              actions: ['assignAccountInfo', 'clearRetries', 'clearError'],
            },
            'REPORT.DEVICE.INFO.MISSING': [
              {
                cond: 'shouldRetry',
                target: 'retry',
              },
              {
                target: 'loggedOut',
                actions: [
                  'removeAccountInfo',
                  'clearRetries',
                  'assignRetryError',
                ],
              },
            ],
          },
        },
        retry: {
          entry: ['incrementRetry'],
          after: {
            RETRY_DELAY: {
              target: 'checkingAccount',
            },
          },
        },
        loggedIn: {
          invoke: [
            {
              src: 'fetchAccount',
              id: 'fetchAccount',
              onDone: {
                actions: ['assignAccount'],
              },
              onError: {
                actions: ['assignAccountError'],
              },
            },
            {
              id: 'fetchPeerData',
              src: 'fetchPeerData',
              onDone: {
                actions: ['assignPeerData'],
              },
              onError: {
                actions: ['assignPeerDataError'],
              },
            },
          ],
          initial: 'idle',
          states: {
            idle: {
              on: {
                'UPDATE.PROFILE': {
                  target: 'updating',
                },
              },
            },
            updating: {
              tags: ['pending'],
              invoke: {
                src: 'updateProfile',
                id: 'updateProfile',
                onDone: {
                  target: 'updateSuccess',
                  actions: ['assignAccount'],
                },
                onError: {
                  target: 'idle',
                  actions: ['assignErrorFromUpdate'],
                },
              },
            },
            updateSuccess: {
              tags: ['pending'],
              after: {
                1000: 'idle',
              },
            },
          },
        },
        loggedOut: {},
        errored: {
          on: {
            RETRY: {
              target: 'checkingAccount',
              actions: ['clearRetries', 'clearError'],
            },
          },
        },
      },
    },
    {
      services: {
        fetchInfo: () =>
          function fetchInfoService(sendBack) {
            client
              .fetchQuery([queryKeys.GET_ACCOUNT_INFO], () => getInfo())
              .then(function (accountInfo) {
                sendBack({type: 'REPORT.DEVICE.INFO.PRESENT', accountInfo})
              })
              .catch(function () {
                sendBack('REPORT.DEVICE.INFO.MISSING')
              })
          },
        fetchAccount: function fetchAccountService() {
          return client.fetchQuery(
            [queryKeys.GET_ACCOUNT, ''],
            function accountQuery({queryKey}) {
              return getAccount(queryKey[1])
            },
          )
        },
        updateProfile: function updateProfileService(_, event) {
          return updateProfile(event.profile)
        },
        fetchPeerData: function fetchPeerDataService(context: AuthContext) {
          return client.fetchQuery(
            [queryKeys.GET_PEER_ADDRS, context.accountInfo?.peerId],
            () => listPeerAddrs(context.accountInfo.peerId),
          )
        },
      },
      guards: {
        shouldRetry: (context) => context.retries > 5,
      },
      actions: {
        incrementRetry: assign({
          retries: (context) => context.retries + 1,
        }),
        assignAccountInfo: assign((_, event) => ({
          accountInfo: event.accountInfo,
        })),
        /* @ts-ignore */
        removeAccountInfo: assign({
          accountInfo: undefined,
        }),
        assignAccount: assign({
          account: (_, event) => {
            return event.data
          },
        }),
        assignAccountError: assign({
          errorMessage: (_, event) =>
            `[Auth]: Fetch Account Error: ${event.data}`,
        }),
        assignErrorFromUpdate: assign({
          errorMessage: (_, event) =>
            `[Auth]: Update Profile Error: ${event.data}`,
        }),
        assignPeerData: assign({
          peerAddrs: (_, event) => event.data,
        }),
        assignRetryError: assign({
          // eslint-disable-next-line
          errorMessage: (_) =>
            '[Auth]: Limit retries exceeded. Please check yout account',
        }),
        assignPeerDataError: assign({
          // eslint-disable-next-line
          errorMessage: (_) => '[Auth]: Error fetching Peer Address',
        }),
        clearError: assign({
          // eslint-disable-next-line
          errorMessage: (_) => '',
        }),
        clearRetries: assign({
          // eslint-disable-next-line
          retries: (_) => 0,
        }),
      },
      delays: {
        RETRY_DELAY: (context) => {
          const exponent = context.retries ** 2
          return exponent * 200
        },
      },
    },
  )
}
