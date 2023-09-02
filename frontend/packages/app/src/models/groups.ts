import {HYPERDOCS_DOCUMENT_PREFIX, Role} from '@mintter/shared'
import {UseMutationOptions, useMutation, useQuery} from '@tanstack/react-query'
import {useGRPCClient, useQueryInvalidator} from '../app-context'
import {queryKeys} from './query-keys'

export function useGroups() {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_GROUPS],
    queryFn: async () => {
      return await grpcClient.groups.listGroups({})
    },
  })
}

export function useGroup(groupId: string | undefined) {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_GROUP, groupId],
    queryFn: async () => {
      const group = await grpcClient.groups.getGroup({id: groupId})
      console.log('group', group)
      return group
    },
    enabled: !!groupId,
  })
}

export function useCreateGroup(
  opts?: UseMutationOptions<
    string,
    unknown,
    {
      description: string
      title: string
    }
  >,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      description,
      title,
    }: {
      description: string
      title: string
    }) => {
      const group = await grpcClient.groups.createGroup({description, title})
      return group.id
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUPS])
    },
  })
}

type UpdateGroupMutationInput = {
  id: string
  title: string
  description: string
}

export function useUpdateGroup(
  opts?: UseMutationOptions<void, unknown, UpdateGroupMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({description, title, id}: UpdateGroupMutationInput) => {
      await grpcClient.groups.updateGroup({id, description, title})
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUPS])
      invalidate([queryKeys.GET_GROUP, input.id])
    },
  })
}

type PublishGroupToSiteMutationInput = {groupId: string; setupUrl: string}

export function usePublishGroupToSite(
  opts?: UseMutationOptions<void, unknown, PublishGroupToSiteMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      setupUrl,
    }: PublishGroupToSiteMutationInput) => {
      await grpcClient.groups.convertToSite({
        link: setupUrl,
        groupId,
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUPS])
      invalidate([queryKeys.GET_GROUP, input.groupId])
    },
  })
}

type PublishDocToGroupMutationInput = {
  groupId: string
  docId: string
  version: string
  pathName: string
}
export function usePublishDocToGroup(
  opts?: UseMutationOptions<void, unknown, PublishDocToGroupMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      pathName,
      docId,
      version,
    }: PublishDocToGroupMutationInput) => {
      await grpcClient.groups.updateGroup({
        id: groupId,
        updatedContent: {[pathName]: `hd://d/${docId}?v=${version}`},
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUP_CONTENT, input.groupId])
    },
  })
}

type RemoveDocFromGroupMutationInput = {
  groupId: string
  pathName: string
}

export function useRemoveDocFromGroup(
  opts?: UseMutationOptions<void, unknown, RemoveDocFromGroupMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      pathName,
    }: RemoveDocFromGroupMutationInput) => {
      await grpcClient.groups.updateGroup({
        id: groupId,
        updatedContent: {[pathName]: ''},
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUP_CONTENT, input.groupId])
    },
  })
}

type RenameGroupDocMutationInput = {
  groupId: string
  pathName: string
  newPathName: string
}

export function useRenameGroupDoc(
  opts?: UseMutationOptions<void, unknown, RenameGroupDocMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      pathName,
      newPathName,
    }: RenameGroupDocMutationInput) => {
      const listed = await grpcClient.groups.listContent({
        id: groupId,
      })
      const prevPathValue = listed.content[pathName]
      if (!prevPathValue)
        throw new Error('Could not find previous path at ' + pathName)
      await grpcClient.groups.updateGroup({
        id: groupId,
        updatedContent: {[pathName]: '', [newPathName]: prevPathValue},
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUP_CONTENT, input.groupId])
    },
  })
}

export function useGroupContent(groupId: string) {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_GROUP_CONTENT, groupId],
    queryFn: async () => {
      return await grpcClient.groups.listContent({id: groupId})
    },
  })
}

export function useGroupMembers(groupId: string) {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_GROUP_MEMBERS, groupId],
    queryFn: async () => {
      return await grpcClient.groups.listMembers({id: groupId})
    },
  })
}

export function useDocumentGroups(documentId?: string) {
  const grpcClient = useGRPCClient()
  return useQuery({
    enabled: !!documentId,
    queryKey: [queryKeys.GET_GROUPS_FOR_DOCUMENT, documentId],
    queryFn: () => {
      return grpcClient.groups.listDocumentGroups({
        documentId: `${HYPERDOCS_DOCUMENT_PREFIX}${documentId}`,
      })
    },
  })
}

export function useAccountGroups(accountId?: string) {
  const grpcClient = useGRPCClient()
  return useQuery({
    enabled: !!accountId,
    queryKey: [queryKeys.GET_GROUPS_FOR_ACCOUNT, accountId],
    queryFn: () => {
      return grpcClient.groups.listAccountGroups({
        accountId,
      })
    },
  })
}

export function useGroupSite(groupId: string) {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_GROUP_SITE, groupId],
    queryFn: async () => {
      // return await grpcClient.groups.getSiteInfo({})
    },
  })
}

type AddGroupMemberMutationInput = {
  groupId: string
  newMemberAccount: string
}

export function useAddGroupMember(
  opts?: UseMutationOptions<void, unknown, AddGroupMemberMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      newMemberAccount,
    }: AddGroupMemberMutationInput) => {
      await grpcClient.groups.updateGroup({
        id: groupId,
        updatedMembers: {[newMemberAccount]: Role.EDITOR},
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUP_MEMBERS, input.groupId])
    },
  })
}

type RemoveGroupMemberMutationInput = {
  groupId: string
  newMemberAccount: string
}

export function useRemoveGroupMember(
  opts?: UseMutationOptions<void, unknown, RemoveGroupMemberMutationInput>,
) {
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    mutationFn: async ({
      groupId,
      newMemberAccount,
    }: RemoveGroupMemberMutationInput) => {
      await grpcClient.groups.updateGroup({
        id: groupId,
        updatedMembers: {[newMemberAccount]: Role.ROLE_UNSPECIFIED},
      })
    },
    onSuccess: (result, input, context) => {
      opts?.onSuccess?.(result, input, context)
      invalidate([queryKeys.GET_GROUP_MEMBERS, input.groupId])
    },
  })
}
