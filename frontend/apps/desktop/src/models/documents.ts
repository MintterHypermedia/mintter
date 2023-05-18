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
  UseMutationOptions,
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import {queryKeys} from './query-keys'
import {useEffect, useMemo, useRef, useState} from 'react'
import {MintterEditor} from '@app/editor/mintter-changes/plugin'
import {Editor, Node} from 'slate'
import {NavRoute} from '@app/utils/navigation'
import {toast} from 'react-hot-toast'

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
  })
}

export function useDeleteDraft(
  opts: UseMutationOptions<void, unknown, string>,
) {
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
  opts: UseMutationOptions<void, unknown, string>,
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
  documentId?: string
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
  opts?: UseMutationOptions<Publication, unknown, string>,
) {
  return useMutation({
    ...opts,
    mutationFn: (documentId) => draftsClient.publishDraft({documentId}),
    onSuccess: (pub, variables, ...rest) => {
      appInvalidateQueries([queryKeys.GET_PUBLICATION_LIST])
      appInvalidateQueries([queryKeys.PUBLICATION_CITATIONS])
      appInvalidateQueries([queryKeys.GET_DRAFT_LIST])
      appInvalidateQueries([queryKeys.GET_PUBLICATION, pub.document?.id])
      appInvalidateQueries([queryKeys.PUBLICATION_CHANGES, pub.document?.id])
      appInvalidateQueries([queryKeys.PUBLICATION_CITATIONS])
      opts?.onSuccess?.(pub, variables, ...rest)

      setTimeout(() => {
        // do this later to wait for the draft component to unmount
        appInvalidateQueries([queryKeys.GET_DRAFT, pub.document?.id])
        // otherwise it will re-query for a draft that no longer exists and an error happens
      }, 250)
    },
  })
}

let emptyEditorValue = group({data: {parent: ''}}, [
  statement([paragraph([text('')])]),
])

type EditorDraft = {
  children: GroupingContent[]
  editor: any
  webUrl: string
  id: string
  changes: DocumentChange[]
}

export function useEditorDraft({
  editor,
  documentId,
  initWebUrl,
  ...options
}: UseQueryOptions<EditorDraft> & {
  documentId: string
  editor: Editor
  initWebUrl?: string
}) {
  return useQuery({
    queryKey: [queryKeys.EDITOR_DRAFT, documentId],
    enabled: !!documentId,
    queryFn: async () => {
      const backendDraft = await draftsClient.getDraft({documentId: documentId})
      let children

      if (backendDraft.children.length) {
        children = [blockNodeToSlate(backendDraft.children)]
      } else {
        children = [emptyEditorValue]
        if (editor) {
          let block = emptyEditorValue.children[0]

          MintterEditor.addChange(editor, ['setWebUrl', initWebUrl || ''])
          MintterEditor.addChange(editor, ['moveBlock', block.id])
          MintterEditor.addChange(editor, ['replaceBlock', block.id])
        }
      }

      return {
        editor,
        changes: MintterEditor.transformChanges(editor).filter(Boolean),
        webUrl: backendDraft.webUrl,
        id: backendDraft.id,
        children,
      }
    },
    ...options,
  })
}

export function useDraftTitle(
  input: UseQueryOptions<EditorDraft> & {documentId: string},
) {
  let data = useCacheListener<EditorDraft>([
    queryKeys.EDITOR_DRAFT,
    input.documentId,
  ])
  // let {data} = useEditorDraft({documentId: input.documentId})
  return useMemo(() => getDocumentTitle(data), [data])
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

export type SaveDraftInput = {
  content: GroupingContent[]
}

export function useSaveDraft(documentId?: string) {
  const saveDraftMutation = useMutation({
    onMutate: ({content}: SaveDraftInput) => {
      let title: string
      appQueryClient.setQueryData(
        [queryKeys.EDITOR_DRAFT, documentId],
        (editorDraft: EditorDraft | undefined) => {
          if (!editorDraft) return undefined
          let contentChanges = MintterEditor.transformChanges(
            editorDraft.editor,
          ).filter(Boolean)

          title = getTitleFromContent(content)
          let changes: Array<DocumentChange> = title
            ? [
                ...contentChanges,
                new DocumentChange({
                  op: {
                    case: 'setTitle',
                    value: title,
                  },
                }),
              ]
            : contentChanges
          return {
            ...editorDraft,
            children: content,
            changes,
          }
        },
      )
      appQueryClient.setQueryData(
        [queryKeys.GET_DRAFT, documentId],
        (draft: Document | undefined) => {
          if (!draft) return undefined
          return new Document({
            ...draft,
            title: title || draft.title,
          })
        },
      )
    },
    mutationFn: async ({}: SaveDraftInput) => {
      const draftData: EditorDraft | undefined = appQueryClient.getQueryData([
        queryKeys.EDITOR_DRAFT,
        documentId,
      ])
      if (!draftData) {
        throw new Error('failed to access editor from saveDraft mutation')
      }

      if (draftData.changes.length == 0) return null

      await draftsClient.updateDraftV2({
        documentId,
        changes: draftData.changes,
      })

      appInvalidateQueries([documentId])
      appInvalidateQueries([queryKeys.GET_DRAFT_LIST])
      return null
    },
  })

  let debounceTimeout = useRef<number | null | undefined>(null)

  return {
    ...saveDraftMutation,
    mutate: (input: SaveDraftInput) => {
      appQueryClient.setQueryData(
        [queryKeys.EDITOR_DRAFT, documentId],
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

export function useWriteDraftWebUrl(draftId?: string) {
  return useMutation({
    onMutate: (webUrl: string) => {
      let title: string
      appQueryClient.setQueryData(
        [queryKeys.EDITOR_DRAFT, draftId],
        (editorDraft: EditorDraft | undefined) => {
          if (!editorDraft) return undefined
          let changes: DocumentChange[] = [
            ...editorDraft.changes,
            new DocumentChange({
              op: {
                case: 'setWebUrl',
                value: webUrl,
              },
            }),
          ]
          return {
            ...editorDraft,
            webUrl,
            changes,
          }
        },
      )
      appQueryClient.setQueryData(
        [queryKeys.GET_DRAFT, draftId],
        (draft: Document | undefined) => {
          if (!draft) return undefined
          return new Document({
            ...draft,
            webUrl,
          })
        },
      )
    },
    mutationFn: async (webUrl: string) => {
      const draftData: EditorDraft | undefined = appQueryClient.getQueryData([
        queryKeys.EDITOR_DRAFT,
        draftId,
      ])
      if (!draftData) {
        throw new Error(
          'failed to access editor from useWriteDraftWebUrl mutation',
        )
      }
      await draftsClient.updateDraftV2({
        documentId: draftId,
        changes: draftData.changes,
      })

      appInvalidateQueries([draftId])
      appInvalidateQueries([queryKeys.GET_DRAFT_LIST])
      return null
    },
  })
}

function useCacheListener<T = unknown>(queryKey: string[]) {
  const [data, setData] = useState<T | undefined>(undefined)

  useEffect(() => {
    let unsubscribe = appQueryClient.getQueryCache().subscribe((event) => {
      if (
        event.type == 'updated' &&
        event.action.type == 'success' &&
        compareArrays(queryKey, event.query.queryKey)
      ) {
        setData(event.action.data)
      }
    })

    return () => {
      unsubscribe?.()
    }
  }, [queryKey])

  return data
}

function compareArrays(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  return arr1.every((value, index) => value === arr2[index])
}
