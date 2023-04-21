import {draftsClient, publicationsClient} from '@app/api-clients'
import {appInvalidateQueries, appQueryClient} from '@app/query-client'
import {Timestamp} from '@bufbuild/protobuf'
import {
  Document,
  group,
  Publication,
  statement,
  text,
  paragraph,
  blockNodeToSlate,
  GroupingContent,
  DocumentChange,
} from '@mintter/shared'
import {
  FetchQueryOptions,
  MutationOptions,
  QueryClient,
  QueryOptions,
  useMutation,
  useQueries,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import {queryKeys} from './query-keys'
import {useMemo, useRef} from 'react'
import {MintterEditor} from '@app/editor/mintter-changes/plugin'
import {Editor, Node} from 'slate'
import {NavRoute} from '@app/utils/navigation'

export function usePublicationList() {
  return useQuery({
    queryKey: [queryKeys.GET_PUBLICATION_LIST],
    refetchOnMount: true,
    queryFn: async () => {
      const result = await publicationsClient.listPublications({})
      const publications =
        result.publications.sort((a, b) =>
          sortDocuments(a.document?.updateTime, b.document?.updateTime),
        ) || []
      return {
        ...result,
        publications,
      }
    },
  })
}

export function useDraftList() {
  return useQuery({
    queryKey: [queryKeys.GET_DRAFT_LIST],
    refetchOnMount: true,
    queryFn: async () => {
      const result = await draftsClient.listDrafts({
        pageSize: undefined,
        pageToken: undefined,
      })
      const documents =
        result.documents.sort((a, b) =>
          sortDocuments(a.updateTime, b.updateTime),
        ) || []
      return {
        ...result,
        documents,
      }
    },
    onError: (err) => {
      console.log(`useDraftList error: ${err}`)
    },
  })
}

export function useDeleteDraft(opts: MutationOptions<void, unknown, string>) {
  return useMutation({
    ...opts,
    mutationFn: async (documentId) => {
      await draftsClient.deleteDraft({documentId})
    },
    onSuccess: (...args) => {
      appInvalidateQueries([queryKeys.GET_DRAFT_LIST])
      opts?.onSuccess?.(...args)
    },
  })
}

export function useDeletePublication(
  opts: MutationOptions<void, unknown, string>,
) {
  return useMutation({
    ...opts,
    mutationFn: async (documentId) => {
      await publicationsClient.deletePublication({documentId})
    },
    onSuccess: (...args) => {
      appInvalidateQueries([queryKeys.GET_PUBLICATION_LIST])
      opts?.onSuccess?.(...args)
    },
  })
}

export function useDraft({
  documentId,
  routeKey,
  ...options
}: UseQueryOptions<Document> & {
  documentId: string
  routeKey: NavRoute['key']
}) {
  return useQuery({
    queryKey: [queryKeys.GET_DRAFT, documentId],
    enabled: routeKey == 'draft' && !!documentId,
    queryFn: () => {
      return draftsClient.getDraft({documentId: documentId})
    },
    ...options,
  })
}

function queryPublication(
  documentId?: string,
  versionId?: string,
): UseQueryOptions<Publication> | FetchQueryOptions<Publication> {
  return {
    queryKey: [queryKeys.GET_PUBLICATION, documentId, versionId],
    enabled: !!documentId,
    queryFn: () =>
      publicationsClient.getPublication({
        documentId,
        version: versionId,
      }),
  }
}
export function usePublication({
  documentId,
  versionId,
  ...options
}: UseQueryOptions<Publication> & {
  documentId?: string
  versionId?: string
}) {
  return useQuery({
    ...queryPublication(documentId, versionId),
    ...options,
  })
}

export function prefetchPublication(documentId: string, versionId?: string) {
  appQueryClient.prefetchQuery(queryPublication(documentId, versionId))
}

export function fetchPublication(documentId: string, versionId?: string) {
  return appQueryClient.fetchQuery(queryPublication(documentId, versionId))
}

export function useDocumentVersions(
  documentId: string | undefined,
  versions: string[],
) {
  return useQueries({
    queries: versions.map((version) => queryPublication(documentId, version)),
  })
}

export function prefetchDraft(client: QueryClient, draft: Document) {
  client.prefetchQuery({
    queryKey: [queryKeys.GET_DRAFT, draft.id],
    queryFn: () => draftsClient.getDraft({documentId: draft.id}),
  })
}

function sortDocuments(a?: Timestamp, b?: Timestamp) {
  let dateA = a ? a.toDate() : 0
  let dateB = b ? b.toDate() : 1

  // @ts-ignore
  return dateB - dateA
}

export function usePublishDraft(
  opts?: MutationOptions<Publication, unknown, string>,
) {
  return useMutation({
    ...opts,
    mutationFn: (documentId) => draftsClient.publishDraft({documentId}),
    onSuccess: (...args) => {
      appInvalidateQueries([])
      opts?.onSuccess?.(...args)
    },
  })
}

let emptyEditorValue = group({data: {parent: ''}}, [
  statement([paragraph([text('')])]),
])

type EditorDraft = {
  children: GroupingContent[]
  id: string
}

export function useEditorDraft({
  documentId,
  ...options
}: UseQueryOptions<EditorDraft> & {documentId: string}) {
  return useQuery({
    queryKey: [queryKeys.GET_EDITOR_DRAFT, documentId],
    enabled: !!documentId,
    queryFn: async () => {
      const backendDraft = await draftsClient.getDraft({documentId: documentId})

      return {
        // backendDraft,
        id: backendDraft.id,
        children: backendDraft.children.length
          ? [blockNodeToSlate(backendDraft.children)]
          : [emptyEditorValue],
      }
    },
    ...options,
  })
}

export function useDraftTitle(
  input: UseQueryOptions<EditorDraft> & {documentId: string},
) {
  const draft = useEditorDraft(input)

  return useMemo(() => getDocumentTitle(draft.data), [draft.data?.children])
}

export function getTitleFromContent(children: Array<GroupingContent>): string {
  // @ts-ignore
  return Node.string(Node.get({children}, [0, 0, 0])) || ''
}

export function getDocumentTitle(doc?: EditorDraft) {
  let titleText = doc?.children.length ? getTitleFromContent(doc?.children) : ''

  return titleText
    ? titleText.length < 50
      ? titleText
      : `${titleText.substring(0, 49)}...`
    : 'Untitled Document'
}

type SaveDraftInput = {
  content: GroupingContent[]
  editor: Editor
}

export function useSaveDraft(documentId: string) {
  const saveDraftMutation = useMutation({
    onMutate: ({content, editor}: SaveDraftInput) => {
      appQueryClient.setQueryData(
        [queryKeys.GET_EDITOR_DRAFT, documentId],
        (editorDraft: any) => {
          if (!editorDraft) return null
          return {
            ...editorDraft,
            children: content,
          }
        },
      )
    },
    mutationFn: async ({content, editor}: SaveDraftInput) => {
      let contentChanges =
        MintterEditor.transformChanges(editor).filter(Boolean)

      const newTitle = getTitleFromContent(content)
      let changes: Array<DocumentChange> = newTitle
        ? [
            ...contentChanges,
            new DocumentChange({
              op: {
                case: 'setTitle',
                value: newTitle,
              },
            }),
          ]
        : contentChanges

      if (changes.length == 0) return null

      await draftsClient.updateDraftV2({
        documentId,
        changes,
      })

      // const updatedDraft = await draftsClient.getDraft({
      //   documentId,
      // })
      return null
    },
  })

  let debounceTimeout = useRef<number | null | undefined>(null)

  return {
    ...saveDraftMutation,
    mutate: (input: SaveDraftInput) => {
      appQueryClient.setQueryData(
        [queryKeys.GET_EDITOR_DRAFT, documentId],
        (editorDraft: any) => {
          if (!editorDraft) return null
          return {
            ...editorDraft,
            children: input.content,
          }
        },
      )
      clearTimeout(debounceTimeout.current as any)
      //@ts-ignore
      debounceTimeout.current = setTimeout(() => {
        saveDraftMutation.mutate(input)
      }, 500)
    },
  }
}