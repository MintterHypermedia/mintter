import {Timestamp} from '@bufbuild/protobuf'
import {useAppContext, useQueryInvalidator} from '@mintter/app/app-context'
import {useOpenUrl} from '@mintter/app/open-url'
import {slashMenuItems} from '@mintter/app/src/slash-menu-items'
import {trpc} from '@mintter/desktop/src/trpc'
import {
  BlockNoteEditor,
  Block as EditorBlock,
  createHypermediaDocLinkPlugin,
  hmBlockSchema,
  useBlockNote,
} from '@mintter/editor'
import {
  DocumentChange,
  GRPCClient,
  GroupVariant,
  HMAccount,
  HMBlock,
  HMBlockNode,
  HMDocument,
  HMGroup,
  HMPublication,
  ListPublicationsResponse,
  Publication,
  UnpackedHypermediaId,
  fromHMBlock,
  hmDocument,
  hmPublication,
  toHMBlock,
  unpackDocId,
  unpackHmId,
  writeableStateStream,
} from '@mintter/shared'
import {UpdateDraftResponse} from '@mintter/shared/src/client/.generated/documents/v1alpha/documents_pb'
import {
  FetchQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
} from '@tanstack/react-query'
import {Extension, findParentNode} from '@tiptap/core'
import {NodeSelection} from '@tiptap/pm/state'
import {useMachine} from '@xstate/react'
import _ from 'lodash'
import {useEffect, useMemo, useRef, useState} from 'react'
import {ContextFrom, fromPromise} from 'xstate'
import {useGRPCClient} from '../app-context'
import {useNavRoute} from '../utils/navigation'
import {pathNameify} from '../utils/path'
import {NavRoute} from '../utils/routes'
import {useNavigate} from '../utils/useNavigate'
import {useAccounts, useAllAccounts, useMyAccount} from './accounts'
import {DraftStatusContext, draftMachine} from './draft-machine'
import {getBlockGroup, setGroupTypes} from './editor-utils'
import {useGatewayUrl, useGatewayUrlStream} from './gateway-settings'
import {useGroupContent, useGroups} from './groups'
import {queryKeys} from './query-keys'
import {useInlineMentions} from './search'

export function usePublicationList(
  opts?: UseInfiniteQueryOptions<ListPublicationsResponse> & {
    trustedOnly: boolean
  },
) {
  const {trustedOnly, ...queryOpts} = opts || {}
  const grpcClient = useGRPCClient()
  const pubListQuery = useInfiniteQuery({
    ...queryOpts,
    queryKey: [
      queryKeys.GET_PUBLICATION_LIST,
      trustedOnly ? 'trusted' : 'global',
    ],
    refetchOnMount: true,
    queryFn: async (context) => {
      const result = await grpcClient.publications.listPublications({
        trustedOnly: trustedOnly,
        pageSize: 50,
        pageToken: context.pageParam,
      })
      const publications = result.publications || []

      return {
        ...result,
        publications,
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageToken
    },
  })

  const allPublications =
    pubListQuery.data?.pages.flatMap((page) => page.publications) || []
  console.log(`== ~ allPublications:`, allPublications)
  return {
    ...pubListQuery,
    data: {
      ...pubListQuery.data,
      publications: allPublications,
    },
  }
}

export function usePublicationFullList(
  opts?: UseInfiniteQueryOptions<ListPublicationsResponse> & {
    trustedOnly: boolean
  },
) {
  const pubList = usePublicationList(opts)
  const accounts = useAllAccounts()
  const data = useMemo(() => {
    function lookupAccount(accountId: string | undefined) {
      if (!accountId) return undefined
      return accounts.data?.accounts.find((acc) => acc.id === accountId)
    }
    return pubList.data?.publications.map((pub) => {
      return {
        publication: pub,
        author: lookupAccount(pub?.document?.author),
        editors: pub?.document?.editors?.map(lookupAccount) || [],
      }
    })
  }, [pubList.data, accounts.data])
  return {...pubList, data}
}

export function useDraftList(
  opts: UseQueryOptions<unknown, unknown, HMDocument[]> = {},
) {
  const grpcClient = useGRPCClient()
  const draftListQuery = useInfiniteQuery({
    queryKey: [queryKeys.GET_DRAFT_LIST],
    refetchOnMount: true,
    queryFn: async (context) => {
      const result = await grpcClient.drafts.listDrafts({
        pageToken: context.pageParam,
        pageSize: 2000000, // temp large page size because we do not paginate drafts from the frontend
      })

      const documents =
        result.documents.sort((a, b) =>
          sortDocuments(a.updateTime, b.updateTime),
        ) || []
      return {
        ...result,
        documents: documents.map(hmDocument),
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageToken || undefined
    },
    ...opts,
  })

  const allDrafts =
    draftListQuery.data?.pages.flatMap((page) => page.documents) || []

  return {
    ...draftListQuery,
    data: {
      ...draftListQuery.data,
      documents: allDrafts,
    },
  }
}

export function useDeleteDraft(
  opts: UseMutationOptions<void, unknown, string>,
) {
  const {queryClient} = useAppContext()
  const grpcClient = useGRPCClient()
  const invalidate = useQueryInvalidator()
  return useMutation({
    ...opts,
    mutationFn: async (documentId) => {
      await grpcClient.drafts.deleteDraft({documentId})
    },
    onSuccess: (response, documentId, context) => {
      setTimeout(() => {
        invalidate([queryKeys.GET_DRAFT_LIST])
        invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])
        invalidate([queryKeys.ENTITY_TIMELINE, documentId])
        invalidate([queryKeys.EDITOR_DRAFT, documentId])
        queryClient.client.removeQueries([queryKeys.EDITOR_DRAFT, documentId])
      }, 200)
      opts?.onSuccess?.(response, documentId, context)
    },
  })
}

export function usePublication(
  {
    id,
    version,
  }: {
    id?: string
    version?: string
  },
  options?: UseQueryOptions<HMPublication>,
) {
  const grpcClient = useGRPCClient()
  return useQuery({
    ...queryPublication(grpcClient, id, version),
    ...(options || {}),
  })
}

export function usePublications(
  pubs: {
    id?: string
    version?: string | null
  }[],
  options?: UseQueryOptions<HMPublication>,
) {
  const grpcClient = useGRPCClient()
  return useQueries({
    queries: pubs.map((pub) =>
      queryPublication(grpcClient, pub.id, pub.version || undefined),
    ),
    ...(options || {}),
  })
}

export function queryPublication(
  grpcClient: GRPCClient,
  documentId?: string,
  versionId?: string,
): UseQueryOptions<HMPublication> | FetchQueryOptions<HMPublication> {
  return {
    queryKey: [queryKeys.GET_PUBLICATION, documentId, versionId],
    enabled: !!documentId,
    // retry: false, // to test error handling faster
    // default is 5. the backend waits ~1s for discovery, so we retry for a little while in case document is on its way.
    retry: 10,
    // about 15 seconds total right now
    queryFn: async () => {
      const pub = await grpcClient.publications.getPublication({
        documentId,
        version: versionId,
      })
      const hmPub = hmPublication(pub)
      if (!hmPub) throw new Error('Failed to produce HMPublication')
      return hmPub
    },
  }
}

type ListedEmbed = {
  blockId: string
  ref: string
  refId: UnpackedHypermediaId
}

function extractRefs(
  children: HMBlockNode[],
  skipCards?: boolean,
): ListedEmbed[] {
  let refs: ListedEmbed[] = []
  function extractRefsFromBlock(block: HMBlockNode) {
    if (block.block?.type === 'embed' && block.block.ref) {
      if (block.block.attributes?.view === 'card' && skipCards) return
      const refId = unpackHmId(block.block.ref)
      if (refId)
        refs.push({
          blockId: block.block.id,
          ref: block.block.ref,
          refId,
        })
    }
    if (block.children) {
      block.children.forEach(extractRefsFromBlock)
    }
  }
  children.forEach(extractRefsFromBlock)
  // console.log('extractRefs', children, refs)
  return refs
}

export type EmbedsContent = Record<
  string,
  | {
      type: 'd'
      data: HMPublication
      query: {refId: UnpackedHypermediaId; blockId: string}
    }
  | {
      type: 'a'
      data: HMAccount
      query: {refId: UnpackedHypermediaId; blockId: string}
    }
  | {
      type: 'g'
      data: HMGroup
      query: {refId: UnpackedHypermediaId; blockId: string}
    }
  | undefined
>

export function useDocumentEmbeds(
  doc: HMDocument | undefined,
  enabled?: boolean,
  opts?: {skipCards: boolean},
): EmbedsContent {
  const {queryPublications, queryGroups, queryAccounts} = useMemo(() => {
    if (!enabled)
      return {queryPublications: [], queryGroups: [], queryAccounts: []}
    const queryPublications: {
      blockId: string
      refId: UnpackedHypermediaId
    }[] = []
    const queryAccounts: {blockId: string; refId: UnpackedHypermediaId}[] = []
    const queryGroups: {
      blockId: string
      refId: UnpackedHypermediaId
    }[] = []
    extractRefs(doc?.children || [], opts?.skipCards).forEach(
      ({refId, blockId}) => {
        if (refId.type === 'a') {
          queryAccounts.push({blockId, refId})
        } else if (refId.type === 'g') {
          queryGroups.push({blockId, refId})
        } else if (refId.type === 'd') {
          queryPublications.push({blockId, refId})
        }
      },
    )
    return {
      queryPublications,
      queryGroups,
      queryAccounts,
    }
  }, [doc, enabled])
  const pubs = usePublications(
    queryPublications.map((q) => ({id: q.refId.qid, version: q.refId.version})),
  )
  const groups = useGroups(
    queryGroups.map((q) => ({id: q.refId.qid, version: q.refId.version})),
  )
  const accounts = useAccounts(queryAccounts.map((q) => q.refId.eid))
  const embeds = Object.fromEntries([
    ...pubs.map((pub, idx) => [
      queryPublications[idx].blockId,
      {type: 'd', query: queryPublications[idx], data: pub.data},
    ]),
    ...groups.map((group, idx) => [
      queryGroups[idx].blockId,
      {type: 'g', query: queryGroups[idx], data: group.data},
    ]),
    ...accounts.map((account, idx) => [
      queryAccounts[idx].blockId,
      {type: 'a', query: queryAccounts[idx], data: account.data},
    ]),
  ]) as EmbedsContent
  return embeds
}

export function useDocumentVersions(
  documentId: string | undefined,
  versions: string[],
) {
  const grpcClient = useGRPCClient()
  return useQueries({
    queries: versions.map((version) =>
      queryPublication(grpcClient, documentId, version),
    ),
  })
}
// TODO: Duplicate (apps/site/server/routers/_app.ts#~187)
export function sortDocuments(a?: Timestamp, b?: Timestamp) {
  let dateA = a ? a.toDate() : 0
  let dateB = b ? b.toDate() : 1

  // @ts-ignore
  return dateB - dateA
}

export function getDefaultShortname(
  docTitle: string | undefined,
  docId: string,
) {
  const unpackedId = unpackDocId(docId)
  const idShortname = unpackedId ? unpackedId.eid.slice(0, 5).toLowerCase() : ''
  const kebabName = docTitle ? pathNameify(docTitle) : idShortname
  const shortName =
    kebabName.length > 40 ? kebabName.substring(0, 40) : kebabName
  return shortName
}

function useDraftDiagnosis() {
  const appendDraft = trpc.diagnosis.appendDraftLog.useMutation()
  const completeDraft = trpc.diagnosis.completeDraftLog.useMutation()
  return {
    append(draftId, event) {
      return appendDraft.mutateAsync({draftId, event})
    },
    complete(draftId, event) {
      return completeDraft.mutateAsync({draftId, event})
    },
  }
}

function changesToJSON(changes: DocumentChange[]) {
  return changes.map((change) => {
    if (change.op.case === 'replaceBlock') {
      return {...change.op}
    }
    return change.op
  })
}

export function usePublishDraft(
  opts?: UseMutationOptions<
    {
      pub: Publication
      groupVariant?: GroupVariant | null | undefined
      isFirstPublish: boolean
      isProfileDocument: boolean
    },
    unknown,
    {
      draftId: string
    }
  >,
) {
  const queryClient = useAppContext().queryClient
  const markDocPublish = trpc.welcoming.markDocPublish.useMutation()
  const grpcClient = useGRPCClient()
  const route = useNavRoute()
  const draftRoute = route.key === 'draft' ? route : undefined
  const groupVariant = draftRoute?.variant
  const myAccount = useMyAccount()
  const isProfileDocument =
    draftRoute?.isProfileDocument ||
    myAccount.data?.profile?.rootDocument === draftRoute?.draftId
  const groupVariantContent = useGroupContent(
    groupVariant?.key === 'group' ? groupVariant.groupId : undefined,
  )
  const prevGroupVariantUrl =
    groupVariant && groupVariant.pathName
      ? groupVariantContent.data?.content?.[groupVariant.pathName]
      : undefined
  const prevGroupVariantId = prevGroupVariantUrl
    ? unpackDocId(prevGroupVariantUrl)
    : undefined
  const {client, invalidate} = queryClient
  const diagnosis = useDraftDiagnosis()
  return useMutation({
    ...opts,
    mutationFn: async ({
      draftId,
    }: {
      draftId: string
    }): Promise<{
      pub: Publication
      groupVariant?: GroupVariant | null | undefined
      isFirstPublish: boolean
      isProfileDocument: boolean
    }> => {
      const pub = await grpcClient.drafts.publishDraft({documentId: draftId})
      await diagnosis.complete(draftId, {
        key: 'did.publishDraft',
        value: hmPublication(pub),
      })
      const isFirstPublish = await markDocPublish.mutateAsync(draftId)
      const publishedId = pub.document?.id
      if (!publishedId)
        throw new Error('Could not get ID of published document')
      const groupVariantChanged =
        publishedId !== prevGroupVariantId?.docId ||
        pub.version !== prevGroupVariantId?.version
      const publishedDocId = `${publishedId}?v=${pub.version}`
      if (isProfileDocument) {
        if (myAccount.data?.profile?.rootDocument !== publishedId) {
          await grpcClient.accounts.updateProfile({
            ...myAccount.data?.profile,
            rootDocument: publishedId,
          })
        }
      } else if (groupVariant && groupVariantChanged) {
        let docTitle: string | undefined = (
          queryClient.client.getQueryData([
            queryKeys.EDITOR_DRAFT,
            draftId,
          ]) as any
        )?.title
        const publishPathName = groupVariant.pathName
          ? groupVariant.pathName
          : getDefaultShortname(docTitle, publishedId)
        if (publishPathName) {
          await grpcClient.groups.updateGroup({
            id: groupVariant.groupId,
            updatedContent: {
              [publishPathName]: publishedDocId,
            },
          })
          return {
            isFirstPublish,
            pub,
            groupVariant: {
              key: 'group',
              groupId: groupVariant.groupId,
              pathName: publishPathName,
            },
            isProfileDocument,
          }
        }
      }
      return {isFirstPublish, pub, groupVariant, isProfileDocument}
    },
    onSuccess: (result, variables, context) => {
      const documentId = result.pub.document?.id
      const {groupVariant} = result
      opts?.onSuccess?.(result, variables, context)
      invalidate([queryKeys.FEED_LATEST_EVENT])
      invalidate([queryKeys.RESOURCE_FEED_LATEST_EVENT])
      invalidate([queryKeys.GET_PUBLICATION_LIST])
      invalidate([queryKeys.GET_DRAFT_LIST])
      invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])
      invalidate([queryKeys.GET_PUBLICATION, documentId])
      invalidate([queryKeys.ENTITY_TIMELINE, documentId])
      invalidate([queryKeys.GET_ALL_ACCOUNTS]) // accounts invalidate because profile doc may be updated
      invalidate([queryKeys.GET_ACCOUNT, myAccount.data?.id])
      invalidate([queryKeys.ENTITY_CITATIONS])
      if (groupVariant) {
        invalidate([queryKeys.GET_GROUP, groupVariant.groupId])
        invalidate([queryKeys.GET_GROUP_CONTENT, groupVariant.groupId])
        invalidate([queryKeys.ENTITY_TIMELINE, groupVariant.groupId])
        invalidate([queryKeys.GET_GROUPS_FOR_DOCUMENT, documentId])
      }

      setTimeout(() => {
        client.removeQueries([queryKeys.EDITOR_DRAFT, documentId])
        // otherwise it will re-query for a draft that no longer exists and an error happens
      }, 250)
    },
  })
}

export type EditorDraftState = {
  id: string
  children: Array<HMBlock>
  title: string
  changes: DraftChangesState
  webUrl: string
  updatedAt: any
}

export function useDraftTitle(
  input: UseQueryOptions<EditorDraftState> & {documentId?: string | undefined},
) {
  const draft = useDraft({documentId: input.documentId})
  return draft.data?.title || undefined
}

type DraftChangesState = {
  moves: MoveBlockAction[]
  changed: Set<string>
  deleted: Set<string>
  webUrl?: string
}

type MoveBlockAction = {
  blockId: string
  leftSibling: string
  parent: string
}

export function useDraft({
  documentId,
  ...options
}: UseQueryOptions<HMDocument | null> & {
  documentId?: string
}) {
  const grpcClient = useGRPCClient()
  const diagnosis = useDraftDiagnosis()
  return useQuery(queryDraft({documentId, grpcClient, diagnosis, ...options}))
}

export function useDrafts(
  ids: string[],
  options?: UseQueryOptions<HMDocument | null>,
) {
  const grpcClient = useGRPCClient()
  return useQueries({
    queries: ids.map((draftId) =>
      queryDraft({documentId: draftId, grpcClient}),
    ),
    ...(options || {}),
  })
}

export function queryDraft({
  documentId,
  grpcClient,
  diagnosis,
  ...options
}: {
  documentId?: string
  grpcClient: GRPCClient
  diagnosis?: ReturnType<typeof useDraftDiagnosis>
} & UseQueryOptions<HMDocument | null>): UseQueryOptions<HMDocument | null> {
  return {
    enabled: !!documentId,
    queryKey: [queryKeys.EDITOR_DRAFT, documentId],
    useErrorBoundary: false,
    queryFn: async () => {
      try {
        let serverDraft = await grpcClient.drafts.getDraft({
          documentId,
        })

        // const doc = serverDraft
        const doc = serverDraft ? hmDocument(serverDraft) : null

        diagnosis?.append(documentId!, {
          key: 'getDraft',
          value: doc,
        })

        return doc
      } catch (error) {
        diagnosis?.append(documentId!, {
          key: 'getDraftError',
          value: JSON.stringify(error),
        })
        return null
      }
    },
    ...options,
  }
}

/**
 *
 * Draft Machine logic
 *
 * - initialize machine with all the context data:
 *    - draft: Document
 *    -
 * - fetch draft
 *    - Error: show draft error (maybe retry or do extra checks before showing the error)
 *    - OK:
 */

export function useDraftEditor({
  documentId,
  route,
}: {
  documentId?: string
  route: NavRoute
}) {
  const grpcClient = useGRPCClient()
  const openUrl = useOpenUrl()
  const replace = useNavigate('replace')
  const queryClient = useAppContext().queryClient
  const {invalidate, client} = queryClient
  const diagnosis = useDraftDiagnosis()
  const gotEdited = useRef(false)
  const {inlineMentionsData, inlineMentionsQuery} = useInlineMentions()
  const [writeEditorStream, editorStream] = useRef(
    writeableStateStream<any>(null),
  ).current

  // fetch draft
  const backendDraft = useDraft({
    documentId,
    onError: (error) => {
      send({type: 'GET.DRAFT.ERROR', error})
    },
  })

  const draftStatusActor = DraftStatusContext.useActorRef()

  const [state, send, actor] = useMachine(
    draftMachine.provide({
      actions: {
        populateEditor: ({event}) => {
          if (
            event.type == 'GET.DRAFT.SUCCESS' &&
            event.draft.children?.length
          ) {
            let editorBlocks = toHMBlock(event.draft.children)
            const tiptap = editor?._tiptapEditor
            // editor.removeBlocks(editor.topLevelBlocks)
            editor.replaceBlocks(editor.topLevelBlocks, editorBlocks)
            // this is a hack to set the current blockGroups in the editor to the correct type, because from the BN API we don't have access to those nodes.
            setGroupTypes(tiptap, editorBlocks)
          }
        },
        focusEditor: () => {
          const tiptap = editor?._tiptapEditor
          if (tiptap && !tiptap.isFocused) {
            editor._tiptapEditor.commands.focus()
          }
        },
        onSaveSuccess: ({event}) => {
          // because this action is called as a result of a promised actor, that's why there are errors and is not well typed
          // @ts-expect-error
          if (event.output) {
            invalidate([queryKeys.GET_DRAFT_LIST])
            invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])
            invalidate([queryKeys.EDITOR_DRAFT, documentId])
          }
        },
        indicatorChange: () =>
          draftStatusActor.send({type: 'INDICATOR.CHANGE'}),
        indicatorSaving: () =>
          draftStatusActor.send({type: 'INDICATOR.SAVING'}),
        indicatorSaved: () => draftStatusActor.send({type: 'INDICATOR.SAVED'}),
        indicatorError: () => draftStatusActor.send({type: 'INDICATOR.ERROR'}),
        indicatorIdle: () => draftStatusActor.send({type: 'INDICATOR.IDLE'}),
        resetDraftAndRedirectToDraftList: () => {
          try {
            grpcClient.drafts
              .deleteDraft({documentId})
              .catch((error) => {
                diagnosis?.append(documentId!, {
                  key: 'deleteDraft',
                  value: `Error deleting draft ${documentId}: ${error.message}`,
                })
              })
              .then(() => {
                diagnosis?.append(documentId!, {
                  key: 'deleteDraft',
                  value: `Delete draft ${documentId} success`,
                })
                invalidate([queryKeys.GET_DRAFT_LIST])
                invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])
              })
          } catch (error) {
            diagnosis?.append(documentId!, {
              key: 'deleteDraft',
              value: `Error deleting draft ${documentId}: ${error.message}`,
            })
          }

          replace({key: 'feed', tab: 'trusted'})
        },
      },
      actors: {
        updateDraft: fromPromise<
          UpdateDraftResponse | string,
          ContextFrom<typeof draftMachine>
        >(async ({input}) => {
          // delay the time we save to the backend to force editor changes.
          // await delay(0)
          return updateDraft({
            editor,
            blocksMap: input.blocksMap,
            title: input.title,
            draft: input.draft,
          })
        }),
        restoreDraft: fromPromise<
          UpdateDraftResponse | string,
          ContextFrom<typeof draftMachine>
        >(async ({input}) => {
          const prevDraft = input.draft ? hmDocument(input.draft) : null
          if (!prevDraft) throw new Error('Expecting previous draft to restore')
          if (!prevDraft.children)
            throw new Error('Expecting previous draft with children to restore')
          const prevBlocksMap = input.blocksMap
          try {
            // delete draft
            await grpcClient.drafts.deleteDraft({documentId})
            // create new draft
            const newDraftRaw = await grpcClient.drafts.createDraft({
              existingDocumentId: documentId,
            })
            const newDraft = newDraftRaw ? hmDocument(newDraftRaw) : null

            const newBlocksMap = newDraft?.children
              ? createBlocksMap(newDraft.children, '')
              : {}
            // prevDraft is the final result I want

            let {changes, touchedBlocks} = compareDraftWithMap(
              newBlocksMap,
              prevDraft?.children,
              '',
            )

            let deletedBlocks = extractDeletes(newBlocksMap, touchedBlocks)

            // TODO: update title too

            let capturedChanges = [...changes, ...deletedBlocks]

            if (capturedChanges.length) {
              // capturedChanges = capturedChanges.map((i) => i.toJson())
              diagnosis.append(documentId, {
                key: 'will.restoreDraft',
                // note: 'regular updateDraft',
                value: {
                  changes: changesToJSON(capturedChanges),
                  newBlocksMap,
                  // prevDraft,
                },
              })

              return await grpcClient.drafts
                .updateDraft({
                  documentId,
                  changes: capturedChanges,
                })
                .then((res) => {
                  if (res.updatedDocument) {
                    client.setQueryData(
                      [queryKeys.EDITOR_DRAFT, documentId],
                      res.updatedDocument,
                    )
                  }

                  diagnosis.append(documentId, {
                    key: 'did.restoredDraft',
                    // note: 'regular updateDraft',
                    value: JSON.stringify(res),
                  })

                  invalidate([queryKeys.GET_DRAFT_LIST])
                  invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])

                  return res
                })
            }
          } catch (error) {
            return Promise.reject(`Error restoring: ${JSON.stringify(error)}`)
          }
        }),
        resetDraft: fromPromise<
          UpdateDraftResponse | string,
          ContextFrom<typeof draftMachine>
        >(async () => {
          try {
            // delete draft
            await grpcClient.drafts.deleteDraft({documentId})
            // create new draft
            const newDraft = await grpcClient.drafts.createDraft({
              existingDocumentId: documentId,
            })

            invalidate([queryKeys.GET_DRAFT_LIST])
            invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])

            return newDraft
          } catch (error) {
            throw new Error(`Error resetting: ${JSON.stringify(error)}`)
          }
        }),
      },
      delays: {
        // This is the time the machine waits after the last keystroke event before starting to save.
        autosaveTimeout: 500,
      },
    }),
  )

  const gwUrl = useGatewayUrlStream()

  // create editor
  const editor = useBlockNote<typeof hmBlockSchema>({
    onEditorContentChange(editor: BlockNoteEditor<typeof hmBlockSchema>) {
      if (!gotEdited.current) {
        gotEdited.current = true
      }

      writeEditorStream(editor.topLevelBlocks)
      observeBlocks(
        editor,
        editor.topLevelBlocks,
        () => {},
        // send({type: 'CHANGE'}),
      )
      send({type: 'CHANGE'})
    },
    onTextCursorPositionChange(editor: BlockNoteEditor<typeof hmBlockSchema>) {
      const {view} = editor._tiptapEditor
      const {selection} = view.state
      if (
        selection.from !== selection.to &&
        !(selection instanceof NodeSelection)
      )
        return
      const domAtPos = view.domAtPos(selection.from)
      try {
        const rect: DOMRect = domAtPos.node.getBoundingClientRect()
        // Check if the cursor is off screen
        if ((rect && rect.top < 0) || rect.bottom > window.innerHeight) {
          // Scroll the cursor into view
          domAtPos.node.scrollIntoView({block: 'center'})
        }
      } catch {}
      return
    },

    linkExtensionOptions: {
      openOnClick: false,
      queryClient,
      grpcClient,
      gwUrl,
      openUrl,
    },
    onMentionsQuery: (query: string) => {
      inlineMentionsQuery(query)
    },

    // onEditorReady: (e) => {
    //   readyThings.current[0] = e
    //   handleMaybeReady()
    // },
    blockSchema: hmBlockSchema,
    slashMenuItems,
    _tiptapOptions: {
      extensions: [
        Extension.create({
          name: 'hypermedia-link',
          addProseMirrorPlugins() {
            return [
              createHypermediaDocLinkPlugin({
                queryClient,
              }).plugin,
            ]
          },
        }),
      ],
    },
  })

  useEffect(() => {
    if (state.matches('fetching')) {
      if (backendDraft.status == 'success' && backendDraft.data) {
        send({type: 'GET.DRAFT.SUCCESS', draft: backendDraft.data})
      } else if (backendDraft.status == 'error') {
        send({type: 'GET.DRAFT.ERROR', error: backendDraft.error})
      }
    }

    return () => {
      if (state.matches({ready: 'changed'})) {
        updateDraft({
          editor,
          draft: state.context.draft,
          blocksMap: state.context.blocksMap,
          title: state.context.title,
        }).then(() => {
          invalidate([queryKeys.GET_DRAFT_LIST])
          invalidate([queryKeys.GET_PUBLICATION_DRAFTS, documentId])
          invalidate([queryKeys.EDITOR_DRAFT, documentId])
        })
      }
    }
  }, [backendDraft.status])

  useEffect(() => {
    if (inlineMentionsData) {
      editor?.setInlineEmbedOptions(inlineMentionsData)
    }
  }, [inlineMentionsData])

  useEffect(() => {
    function handleSelectAll(event: KeyboardEvent) {
      if (event.key == 'a' && event.metaKey) {
        if (editor) {
          event.preventDefault()
          editor._tiptapEditor.commands.focus()
          editor._tiptapEditor.commands.selectAll()
        }
      }
    }

    window.addEventListener('keydown', handleSelectAll)

    return () => {
      window.removeEventListener('keydown', handleSelectAll)
    }
  }, [])

  function handleFocusAtMousePos(event) {
    let ttEditor = (editor as BlockNoteEditor)._tiptapEditor
    let editorView = ttEditor.view
    let editorRect = editorView.dom.getBoundingClientRect()
    let centerEditor = editorRect.left + editorRect.width / 2

    const pos = editorView.posAtCoords({
      left: editorRect.left + 1,
      top: event.clientY + editorView.dom.offsetTop,
    })

    if (pos) {
      let node = editorView.state.doc.nodeAt(pos.pos)

      let sel = Selection.near(
        editorView.state.doc.resolve(
          event.clientX < centerEditor ? pos.pos : pos.pos + node.nodeSize - 1,
        ),
      )

      ttEditor.commands.focus()
      ttEditor.commands.setTextSelection(sel)
    } else {
      if (event.clientY > editorRect.top) {
        // this is needed because if the user clicks on one of the sides of the title we don't want to jump to the bottom of the document to focus the document.
        // if the window is scrolled and the title is not visible this will not matter because a block will be at its place so the normal focus should work.
        ttEditor.commands.focus()
        ttEditor.commands.setTextSelection(ttEditor.state.doc.nodeSize)
      }
    }
  }

  async function updateDraft({editor, blocksMap, draft, title}) {
    let currentEditorBlocks = [...editor.topLevelBlocks]
    let {changes, touchedBlocks} = compareBlocksWithMap(
      editor,
      blocksMap,
      currentEditorBlocks,
      '',
    )

    let deletedBlocks = extractDeletes(blocksMap, touchedBlocks)

    if (draft?.title != title) {
      changes = [
        new DocumentChange({
          op: {
            case: 'setTitle',
            value: title,
          },
        }),
        ...changes,
      ]
    }

    let capturedChanges = [...changes, ...deletedBlocks]

    if (capturedChanges.length) {
      // capturedChanges = capturedChanges.map((i) => i.toJson())
      diagnosis.append(documentId, {
        key: 'will.updateDraft',
        // note: 'regular updateDraft',
        value: {
          changes: changesToJSON(capturedChanges),
          blocksMap,
          editorState: currentEditorBlocks,
        },
      })
      try {
        let mutation = await grpcClient.drafts.updateDraft({
          documentId,
          changes: [...capturedChanges],
        })
        if (mutation.updatedDocument) {
          client.setQueryData(
            [queryKeys.EDITOR_DRAFT, documentId],
            mutation.updatedDocument,
          )
        }

        diagnosis.append(documentId, {
          key: 'did.updateDraft',
          // note: 'regular updateDraft',
          value: JSON.stringify(mutation),
        })

        return mutation
      } catch (error) {
        return Promise.reject(JSON.stringify(error))
      }
    }

    return Promise.resolve('No changes applied.')
  }

  return {
    state,
    send,
    actor,
    draft: backendDraft.data,
    editor,
    editorStream,
    draftStatusActor,
    handleFocusAtMousePos,
  }
}

export type HyperDocsEditor = Exclude<
  ReturnType<typeof useDraftEditor>['editor'],
  null
>

export const findBlock = findParentNode(
  (node) => node.type.name === 'blockContainer',
)

export function useDocTextContent(pub?: HMPublication) {
  return useMemo(() => {
    let res = ''
    function extractContent(blocks: Array<HMBlockNode>) {
      blocks.forEach((bn) => {
        if (res.length < 300) {
          res += extractBlockText(bn)
        }
      })

      return res
    }

    function extractBlockText({block, children}: HMBlockNode) {
      let content = ''
      if (!block) return content
      if (block.text) content += block.text

      if (children?.length) {
        let nc = extractContent(children)
        content += nc
      }

      return content
    }

    if (pub?.document?.children?.length) {
      res = extractContent(pub.document.children)
    }

    return res
  }, [pub])
}

export type BlocksMap = Record<string, BlocksMapItem>

export type BlocksMapItem = {
  parent: string
  left: string
  block: HMBlock
}

export function createBlocksMap(
  blockNodes: Array<HMBlockNode> = [],
  parentId: string,
) {
  let result: BlocksMap = {}
  blockNodes.forEach((bn, idx) => {
    if (bn.block?.id) {
      let prevBlockNode = idx > 0 ? blockNodes[idx - 1] : undefined

      if (bn.block) {
        result[bn.block.id] = {
          parent: parentId,
          left:
            prevBlockNode && prevBlockNode.block ? prevBlockNode.block.id : '',
          block: bn.block,
        }
      }

      if (bn.children?.length) {
        // recursively call the block children and append to the result
        result = {...result, ...createBlocksMap(bn.children, bn.block.id)}
      }
    }
  })

  return result
}

export function usePushPublication() {
  const gatewayUrl = useGatewayUrl()
  const grpcClient = useGRPCClient()
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!gatewayUrl.data) throw new Error('Cannot determine Gateway URL')
      await grpcClient.publications.pushPublication({
        documentId: docId,
        url: gatewayUrl.data,
      })
    },
  })
}

export function compareBlocksWithMap(
  editor: BlockNoteEditor,
  blocksMap: BlocksMap,
  blocks: Array<EditorBlock>,
  parentId: string,
) {
  let changes: Array<DocumentChange> = []
  let touchedBlocks: Array<string> = []

  // iterate over editor blocks
  blocks.forEach((block, idx) => {
    // add blockid to the touchedBlocks list to capture deletes later
    touchedBlocks.push(block.id)

    // compare replace
    let prevBlockState = blocksMap[block.id]

    const childGroup = getBlockGroup(editor, block.id)

    if (childGroup) {
      // @ts-expect-error
      block.props.childrenType = childGroup.type ? childGroup.type : 'group'
      // @ts-expect-error
      block.props.listLevel = childGroup.listLevel
      // @ts-expect-error
      if (childGroup.start) block.props.start = childGroup.start.toString()
    }
    let currentBlockState = fromHMBlock(block)

    if (
      !prevBlockState ||
      prevBlockState.block.attributes?.listLevel !==
        currentBlockState.attributes.listLevel
    ) {
      const serverBlock = fromHMBlock(block)

      // add moveBlock change by default to all blocks
      changes.push(
        new DocumentChange({
          op: {
            case: 'moveBlock',
            value: {
              blockId: block.id,
              leftSibling: idx > 0 && blocks[idx - 1] ? blocks[idx - 1].id : '',
              parent: parentId,
            },
          },
        }),
        new DocumentChange({
          op: {
            case: 'replaceBlock',
            value: serverBlock,
          },
        }),
      )
    } else {
      let left = idx > 0 && blocks[idx - 1] ? blocks[idx - 1].id : ''
      if (prevBlockState.left !== left || prevBlockState.parent !== parentId) {
        changes.push(
          new DocumentChange({
            op: {
              case: 'moveBlock',
              value: {
                blockId: block.id,
                leftSibling: left,
                parent: parentId,
              },
            },
          }),
        )
      }

      if (!isBlocksEqual(prevBlockState.block, currentBlockState)) {
        // this means is a new block and we need to also add a replaceBlock change
        changes.push(
          new DocumentChange({
            op: {
              case: 'replaceBlock',
              value: currentBlockState,
            },
          }),
        )
      }
    }

    if (block.children.length) {
      let nestedResults = compareBlocksWithMap(
        editor,
        blocksMap,
        block.children,
        block.id,
      )
      changes = [...changes, ...nestedResults.changes]
      touchedBlocks = [...touchedBlocks, ...nestedResults.touchedBlocks]
    }
  })

  return {
    changes,
    touchedBlocks,
  }
}

export function compareDraftWithMap(
  blocksMap: BlocksMap,
  blockNodes: HMBlockNode[],
  parentId: string,
) {
  let changes: Array<DocumentChange> = []
  let touchedBlocks: Array<string> = []

  // iterate over editor blocks
  blockNodes.forEach((bn, idx) => {
    if (bn.block) {
      // add blockid to the touchedBlocks list to capture deletes later
      touchedBlocks.push(bn.block.id)

      // compare replace
      let prevBlockState = blocksMap[bn.block.id]

      // TODO: get block group

      let currentBlockState = bn.block

      if (!prevBlockState) {
        const serverBlock = currentBlockState

        // add moveBlock change by default to all blocks
        changes.push(
          new DocumentChange({
            op: {
              case: 'moveBlock',
              value: {
                blockId: bn.block.id,
                leftSibling:
                  idx > 0 && blockNodes[idx - 1]
                    ? blockNodes[idx - 1].block!.id
                    : '',
                parent: parentId,
              },
            },
          }),
          new DocumentChange({
            op: {
              case: 'replaceBlock',
              value: serverBlock,
            },
          }),
        )
      } else {
        let left =
          idx > 0 && blockNodes[idx - 1] ? blockNodes[idx - 1].block!.id : ''
        if (
          prevBlockState.left !== left ||
          prevBlockState.parent !== parentId
        ) {
          changes.push(
            new DocumentChange({
              op: {
                case: 'moveBlock',
                value: {
                  blockId: bn.block.id,
                  leftSibling: left,
                  parent: parentId,
                },
              },
            }),
          )
        }

        if (!isBlocksEqual(prevBlockState.block, currentBlockState)) {
          // this means is a new block and we need to also add a replaceBlock change
          changes.push(
            new DocumentChange({
              op: {
                case: 'replaceBlock',
                value: currentBlockState,
              },
            }),
          )
        }
      }

      if (bn.children?.length) {
        let nestedResults = compareDraftWithMap(
          blocksMap,
          bn.children,
          bn.block.id,
        )
        changes = [...changes, ...nestedResults.changes]
        touchedBlocks = [...touchedBlocks, ...nestedResults.touchedBlocks]
      }
    }
  })

  return {
    changes,
    touchedBlocks,
  }
}

export function extractDeletes(
  blocksMap: BlocksMap,
  touchedBlocks: Array<string>,
) {
  let deletedIds = Object.keys(blocksMap).filter(
    (id) => !touchedBlocks.includes(id),
  )

  return deletedIds.map(
    (dId) =>
      new DocumentChange({
        op: {
          case: 'deleteBlock',
          value: dId,
        },
      }),
  )
}

export function isBlocksEqual(b1: HMBlock, b2: HMBlock): boolean {
  let result =
    // b1.id == b2.id &&
    b1.text == b2.text &&
    b1.ref == b2.ref &&
    _.isEqual(b1.annotations, b2.annotations) &&
    // TODO: how to correctly compare attributes???
    isBlockAttributesEqual(b1, b2) &&
    b1.type == b2.type
  return result
}

function isBlockAttributesEqual(b1: HMBlock, b2: HMBlock): boolean {
  let a1 = b1.attributes
  let a2 = b2.attributes
  if (!a1 && !a2) return true
  if (!a1 || !a2) return false
  return (
    a1.childrenType == a2.childrenType &&
    a1.start == a2.start &&
    a1.level == a2.level &&
    a1.url == a2.url &&
    a1.size == a2.size &&
    a1.ref == a2.ref &&
    a1.language == a2.language &&
    a1.view == a2.view &&
    a1.width == a2.width
  )
}

function observeBlocks(
  editor: BlockNoteEditor,
  blocks: Array<EditorBlock<typeof hmBlockSchema>>,
  onChange: () => void,
) {
  blocks.forEach((block, index) => {
    if (block.type == 'imagePlaceholder' && block.props.src) {
      editor.updateBlock(block, {
        type: 'image',
        props: {
          src: block.props.src,
          name: block.props.name,
        },
      })
      onChange()
    }

    if (block.children) {
      observeBlocks(editor, block.children, onChange)
    }

    // TODO: this code was making impossible to remove a paragraph above a media element when it was nested. This was in place because it was also impossible to add a selection above a media element when this media element was the last one in the draft. Now it seems to both cases be fixed when this code is removed. 🤷‍♂️
    // if (
    //   index === blocks.length - 1 &&
    //   ['image', 'video', 'file', 'embed'].includes(block.type)
    // ) {
    //   editor.insertBlocks(
    //     [
    //       {
    //         type: 'paragraph',
    //       },
    //     ],
    //     block.id,
    //     'after',
    //   )
    //   if (editor.getTextCursorPosition().nextBlock) {
    //     editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock)
    //   }
    // }
  })
}

export function useAccountPublicationFullList(
  accountId: string | undefined,
  opts?: UseQueryOptions<ListPublicationsResponse>,
) {
  const pubList = useAccountPublications(accountId)
  const accounts = useAllAccounts()
  const data = useMemo(() => {
    function lookupAccount(accountId: string | undefined) {
      if (!accountId) return undefined
      return accounts.data?.accounts.find((acc) => acc.id === accountId)
    }
    return pubList.data?.publications.map((pub) => {
      return {
        publication: pub,
        author: lookupAccount(pub?.document?.author),
        editors: pub?.document?.editors?.map(lookupAccount) || [],
      }
    })
  }, [pubList.data, accounts.data])
  return {...pubList, data}
}

export function useAccountPublications(accountId?: string | undefined) {
  const grpcClient = useGRPCClient()
  return useQuery({
    queryKey: [queryKeys.GET_ACCOUNT_PUBLICATIONS, accountId],
    enabled: !!accountId,
    queryFn: async () => {
      const result = await grpcClient.publications.listAccountPublications({
        accountId,
      })
      const publications: HMPublication[] = (result.publications
        .map((pub) => hmPublication(pub))
        .filter(Boolean)
        .sort((a, b) => {
          const aTime = a?.document?.updateTime
            ? new Date(a.document.updateTime)
            : 0
          const bTime = b?.document?.updateTime
            ? new Date(b.document.updateTime)
            : 0
          if (!aTime || !bTime) return 0
          return bTime.getTime() - aTime.getTime()
        }) || []) as HMPublication[]
      return {
        publications,
      }
    },
  })
}

export function useDraftRebase({
  shouldCheck,
  draft,
}: {
  shouldCheck: boolean
  draft: HMDocument | null | undefined
}) {
  const grpcClient = useGRPCClient()
  const [rebase, setRebase] = useState<boolean>(false)
  const [newVersion, selectNewVersion] = useState<string>('')

  useEffect(() => {
    const INTERVAL = 10000
    var interval
    if (draft && shouldCheck) {
      interval = setInterval(checkForRebase, INTERVAL)
      checkForRebase()
    }

    async function checkForRebase() {
      if (!draft?.previousVersion) {
        return
      }

      const latestDoc = await grpcClient.publications.getPublication({
        documentId: draft!.id,
      })

      const prevVersion = draft.previousVersion.split('.')
      const latestVersion = latestDoc.version.split('.')
      /**
       * When I ask the backend for a publication without a version, it will respond
       * with the latest version for that particular owner and also combined with my latest changes if those are not deps from the owner.
       * this means that I need to check the latest version of the document with the previowVersion that my draft have
       */
      if (latestVersion && !_.isEqual(latestVersion, prevVersion)) {
        setRebase(true)
        selectNewVersion(
          latestVersion.length > 1 ? latestVersion.join('.') : latestVersion[0],
        )
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [shouldCheck])

  return {
    shouldRebase: rebase,
    newVersion,
  }
}
