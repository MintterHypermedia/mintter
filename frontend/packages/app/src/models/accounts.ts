import {Account, ListAccountsResponse, Profile} from '@mintter/shared'
import {useMutation, UseMutationOptions, useQuery} from '@tanstack/react-query'
import {queryKeys} from '@mintter/app/src/models/query-keys'
import {useConnectedPeers} from './networking'
import {useDaemonReady} from '@mintter/app/src/node-status-context'
import {useDaemonInfo} from '@mintter/app/src/models/daemon'
import appError from '@mintter/app/src/errors'
import {ConnectError} from '@bufbuild/connect-web'
import {useGRPCClient, useQueryInvalidator} from '@mintter/app/src/app-context'

export function useAccount(accountId?: string) {
  const grpcClient = useGRPCClient()
  return useQuery<Account, ConnectError>({
    enabled: !!accountId,
    queryKey: [queryKeys.GET_ACCOUNT, accountId],
    queryFn: () => grpcClient.accounts.getAccount({id: accountId}),
    useErrorBoundary: () => false,
  })
}

export function useAllAccounts() {
  let isDaemonReady = useDaemonReady()
  const grpcClient = useGRPCClient()
  const contacts = useQuery<ListAccountsResponse, ConnectError>({
    enabled: !!isDaemonReady,
    queryKey: [queryKeys.GET_ALL_ACCOUNTS],
    queryFn: async () => {
      return await grpcClient.accounts.listAccounts({})
    },
    onError: (err) => {
      appError(`useAllAccounts Error ${err.code}: ${err.message}`, err.metadata)
    },
  })
  return contacts
}

export function useSetTrusted(
  opts?: UseMutationOptions<
    void,
    unknown,
    {accountId: string; isTrusted: boolean}
  >,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      accountId,
      isTrusted,
    }: {
      accountId: string
      isTrusted: boolean
    }) => {
      await grpcClient.accounts.setAccountTrust({id: accountId, isTrusted})
      return undefined
    },
    onSuccess: (result, input, ctx) => {
      invalidate([queryKeys.GET_ACCOUNT, input.accountId])
      opts?.onSuccess?.(result, input, ctx)
    },
    ...opts,
  })
}

export function useAccountIsConnected(account: Account) {
  const peers = useConnectedPeers()
  return !!peers.data?.find((peer) => peer.accountId == account.id)
}

export function useMyAccount() {
  const daemonInfo = useDaemonInfo()
  return useAccount(daemonInfo.data?.accountId)
}

export function useSetProfile(
  opts?: UseMutationOptions<string, unknown, Partial<Profile>>,
) {
  const invalidate = useQueryInvalidator()
  const grpcClient = useGRPCClient()
  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const daemonInfo = await grpcClient.daemon.getInfo({})
      const accountId = daemonInfo?.accountId
      await grpcClient.accounts.updateProfile(profile)
      return accountId || '' // empty string here is nonsense but we need to pass the account id to the invalidation fn if we have it
      // but accountId is empty during onboarding, so the invalidate will be nonsense but who cares
    },
    onSuccess: (accountId, ...rest) => {
      invalidate([queryKeys.GET_ACCOUNT, accountId])
      opts?.onSuccess?.(accountId, ...rest)
    },
    ...opts,
  })
}
