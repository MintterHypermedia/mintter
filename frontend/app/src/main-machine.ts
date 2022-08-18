import {activityMachine} from '@app/activity-machine'
import type {Document} from '@app/client'
import {
  createDraft,
  listDrafts,
  listPublications,
  Publication,
} from '@app/client'
import {createDraftMachine} from '@app/draft-machine'
import {buildEditorHook, EditorMode} from '@app/editor/plugin-utils'
import {plugins} from '@app/editor/plugins'
import {queryKeys} from '@app/hooks'
import {createPublicationMachine} from '@app/publication-machine'
import {debug} from '@app/utils/logger'
import {getRefFromParams} from '@app/utils/machine-utils'
import {libraryMachine} from '@components/library/library-machine'
import {invoke as tauriInvoke} from '@tauri-apps/api'
import isEqual from 'fast-deep-equal'
import Navaid from 'navaid'
import {QueryClient} from 'react-query'
import {ActorRefFrom, assign, createMachine, send, spawn} from 'xstate'

export type PublicationRef = ActorRefFrom<
  ReturnType<typeof createPublicationMachine>
>
export type PublicationWithRef = Publication & {ref: PublicationRef}
export type DraftRef = ActorRefFrom<ReturnType<typeof createDraftMachine>>
export type DraftWithRef = Document & {ref: DraftRef}
export type CurrentFile = PublicationRef | DraftRef

export type MainPageContext = {
  params: {
    docId: string
    version: string | null
    blockId: string | null
    replace: boolean
  }
  recents: Array<CurrentFile>
  library: ActorRefFrom<typeof libraryMachine> | null
  activity: ActorRefFrom<typeof activityMachine> | null
  publicationList: Array<PublicationWithRef>
  draftList: Array<DraftWithRef>
  errorMessage: string
  currentFile: CurrentFile | null
}

type MainPageEvent =
  | {
      type: 'ROUTE.NOT.FOUND'
    }
  | {
      type: 'GO.TO.DRAFT'
      docId: string
      replace?: boolean
    }
  | {
      type: 'GO.TO.PUBLICATION'
      docId: string
      version: string
      blockId?: string
      replace?: boolean
    }
  | {
      type: 'GO.TO.SETTINGS'
    }
  | {
      type: 'GO.TO.HOME'
    }
  | {
      type: 'GO.TO.PUBLICATIONLIST'
    }
  | {
      type: 'GO.TO.DRAFTLIST'
    }
  | {
      type: 'GO.BACK'
    }
  | {
      type: 'GO.FORWARD'
    }
  | {
      type: 'listenRoute'
    }
  | {
      type: 'CREATE.NEW.DRAFT'
    }
  | {
      type: 'COMMIT.OPEN.WINDOW'
      path?: string
    }
  | {
      type: 'COMMIT.EDIT.PUBLICATION'
      docId: string
    }
  | {
      type: 'REPORT.FILES.SUCCESS'
      publicationList: Array<Publication>
      draftList: Array<Document>
    }
  | {type: 'REPORT.FILES.ERROR'; errorMessage: string}
  | {type: 'COMMIT.PUBLISH'; publication: Publication; documentId: string}
  | {type: 'COMMIT.DELETE.FILE'; documentId: string; version: string | null}

type RouterEvent =
  | {
      type: 'pushHome'
    }
  | {
      type: 'pushPublication'
      docId: string
      version: string
      blockId?: string
      replace?: boolean
    }
  | {
      type: 'pushDraft'
      docId: string
      replace?: boolean
    }
  | {
      type: 'pushSettings'
    }
  | {
      type: 'pushPublicationList'
    }
  | {
      type: 'pushDraftList'
    }
  | {
      type: 'listen'
    }

export type CreateMainPageServiceParams = {
  client: QueryClient
  initialRoute?: string
}

type MainServices = {
  createNewDraft: {
    data: Document
  }
}

export function createMainPageService({
  client,
  initialRoute,
}: CreateMainPageServiceParams) {
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBLAdgWgA6pgDoAbAe1QiygDF1i4BiAJQFEAFAeSYBVDqBJADIsAyoREBVAMJTRIxKFylY6AC7pSmBSAAeiAMwAmAIyF9AFnOGAbDYCs+gBwB2WwBoQAT0Q3Tju3bOxobOAAyhhibGdgC+MR5oWHgEYCTklJg0dIysnDx8QqKELExMXNpKKuqa2noIRqYWVrbWDi7uXgbmzoT+gcFhEVGx8SCJOPhEAE6kAK6qcIQAFqTIYAxSHACyW-y8ACIswtwsBcIVymoaWki6iN2GhMYuzo7G1gCc5vofH6HWHm8CGMVlMr1Cjj+zgC1mhIwSGAmKUIM3mi0galIU0IADdUMR0BBUOpMgwLlVrrVEMZ9M5HoYPkEIv5Xl9nIDEB87OZCEFzI5Qs5vq4BfCxojktM5gtYIQMaosbj8YSGABxDiEbga-ZMACC1G45KuNVudRBgt6AxCLMh3Q5CCFH15IIFQtp1lFcQRSUmqVRMsIuFmACMCQBjYnXJUEokkqBk26VY03UB1N5O6yZkzmD7+YzGD6Ge0F5xOyHGf7OfTPOzPZxe8U+5H+xZB0PoCPVTDRlXqzUatgSABCgn4Ul13H4HAAckau1SEH0nm9HD9c7Xnh9i299L0PhXYdW8y4G+NJX7pa2Q+HI5oexA1RqtYQdfrDYnLvPTdTuaFCAzq0sBw-hce1Ikif9LFsZw6Rpat61GM9fRRS9ZTbG8u0EdBYFUQhCXoDZtl2A4jhYE4zhYOdKW-epDF3UJugrQwbS+cwAU6RchWdflBWFD1Qn0U8JWQltZQgKZUAAM1ULCcLwiACM2HY9hfUjyIEc4PwpE1Ux8Ol-wE-Q7GYwJbTYsDYUePkXEZaFrG+ISmylNFZTDKYwGJMB9gk6SGAgTRUiwHFSAAa1SNyPIWacwAAd28qTVConS7gQawjN5QzjJY8w7GLODuNdPiBUExDhObVDmA4CRyOnDheGoKrp32JKUxSuwnWieyYOy8yOIZEwCtLGC7Hs-RrEcpFnJlR9+0IAAJbZKK05MF3ap4Ru6V5TNY9igWiD5rDMN5unMCtvm6CbzxQlyZufEQyMnadVXkZav10hA1s6zaet2xBuSdPl93aqDDDYy6RIqvtn0HEcxwnKdp1HER30UT9qPez6Nu67aoPtRxPn-F1rHefdokMMUkPKm6oe1PUDSRlGQCTN62o6rGttZXG+taKyXW+ax-izcGqemmmXzpxnmfR1n1q6jmzN+4F9AiQmeLdEUBOFqbGDFmHR3HScZxa1a2bln6wNOnlrN491HC1i8bqkVgJ1OacWAAdXFt9jZozGzZx3q9rJgqbY1krvUmh3pqU4jCA4NgWGnQh3f4JqOHdn33ppBl1v8WkLDsRxHEie1-sIASDpy7lay5Cmyu12BCOU3gWH2FS9bhw3Z1e6W6n3HpLKcVw2mH+19HHv8+lsSIYJFe3rujoj2+HJG5szmWvuxznA58BkAZdUOPXtmah11KQAGl177nLeSsQZoiH1p7VO3oYS+YnAmVhxj77BqmHd3UTBmo92Sn3dKHwnChGCK0R+uUOLYEsE8SwX8nDNDZHEUYmBSAQDgNoSmRAyAUCoLQeg8AQGtTqMxXozE0rD0fnRCyh0jL9BCOESI+Y65OVSGAKYMx3IQCvvcXcxd8buhHrYfQY8rA8inuBWeR9SpcIXosfCYBBEIHJnYcuEDbLmz6pCP81khp2X5vPUSyxVhqPIQuTRZgKzvFCMZMIQp8bFleKYCBgpGT7i5CeRRkdlGynlIqPEMZIyZHUcEG+VgTDMhxuyDixcyzHSFGdCwVYzGoTlJQBU2JQmEkifZRoIEsrxOLIZEO6t+KcICeY4J2IeF8MiaDHo4QhjyzZPaVwk8UmnQYuk8OjZalZPqc0gaMSmLZQSUCWEPRrLRFLBCVJmSXKBmvB2W83Z8mxioOoz4Vl9zZnXPmLcfUISHTpJYcIrQayGBWQGdCGyuz3kiRCRwvJ2qV2OQWSRZyqxmH3JWI8tY-ERyuuYx5nYoyNKxHsr4ZhPjj1+HmAsYEnCPHLECmsdZ7lXnbFC5KUtQGIEzO80swQQTfNOXtVJe5ghvAcLYb4dz-HgqybAMAqg4xkNRtpChPgxqEDYpCLeCtn7F24kDHaoN7K4rQusglmBZK4VUeoy2-5C4MQEgHRWTFdzWyqcVOVaz8WbOVeove5dGJxO3orWE+9+TQlLAEIwLKwUQ1WeJBKyr5L0HUQXMw3xdE6rAqWXmjrbIbUGfgqOiwvXSXNdYmioN3mGEyiZW1FsYLOlrMBXMERxqso9QGCKnl4rSQtQLQgrR-aZo4vmAaBqiqayLSLXBSb3rpU3h0rmQIfhkspaDBk7ji7mHtmq6hoi6HtEiI4YsThX6BEiIWc04EMExCAA */
  return createMachine(
    {
      context: {
        params: {
          docId: '',
          version: null,
          blockId: null,
          replace: false,
        },
        recents: [],
        library: null,
        currentFile: null,
        publicationList: [],
        draftList: [],
        errorMessage: '',
        activity: null,
      },
      entry: ['spawnUIMachines'],
      tsTypes: {} as import('./main-machine.typegen').Typegen0,
      schema: {
        context: {} as MainPageContext,
        events: {} as MainPageEvent,
        services: {} as MainServices,
      },
      invoke: {
        src: 'router',
        id: 'router',
      },
      id: 'main-page',
      initial: 'loadingFiles',
      states: {
        loadingFiles: {
          invoke: {
            src: 'fetchFiles',
            id: 'fetchFiles',
          },
          on: {
            'REPORT.FILES.SUCCESS': {
              actions: 'assignFiles',
              target: 'routes',
            },
            'REPORT.FILES.ERROR': {
              target: 'errored',
            },
          },
        },
        errored: {},
        routes: {
          initial: 'idle',
          states: {
            idle: {
              entry: send('listen', {to: 'router'}),
            },
            home: {
              entry: ['clearCurrentFile', 'clearParams'],
              tags: ['topbar', 'library'],
              on: {
                'COMMIT.DELETE.FILE': {
                  actions: [
                    'removePublicationFromCitations',
                    'removeFileFromRecentList',
                    'updatePublicationList',
                  ],
                },
              },
            },
            editor: {
              tags: ['topbar', 'library'],
              initial: 'validating',
              states: {
                validating: {
                  always: [
                    {
                      actions: [
                        'pushToRecents',
                        'setDraftParams',
                        'setDraftAsCurrent',
                      ],
                      cond: 'isMetaEventDifferent',
                      target: 'valid',
                    },
                    {
                      target: 'error',
                    },
                  ],
                },
                valid: {
                  entry: 'pushDraftRoute',
                  tags: ['documentView', 'draft'],
                  on: {
                    'GO.TO.DRAFT': [
                      {
                        actions: 'pushToRecents',
                        cond: 'isEventDifferent',
                        target: 'validating',
                      },
                      {},
                    ],
                  },
                },
                error: {
                  type: 'final',
                },
              },
            },
            publication: {
              tags: ['topbar', 'library'],
              initial: 'validating',
              states: {
                validating: {
                  always: [
                    {
                      actions: [
                        'pushToRecents',
                        'pushToActivity',
                        'setPublicationParams',
                        'setPublicationAsCurrent',
                      ],
                      cond: 'isMetaEventDifferent',
                      target: 'valid',
                    },
                    {
                      target: 'error',
                    },
                  ],
                },
                valid: {
                  entry: 'pushPublicationRoute',
                  tags: ['documentView', 'publication'],
                  on: {
                    'GO.TO.PUBLICATION': [
                      {
                        cond: 'isEventDifferent',
                        target: 'validating',
                      },
                      {},
                    ],
                    'GO.TO.DRAFT': {
                      target: '#main-page.routes.editor',
                    },
                  },
                },
                error: {
                  type: 'final',
                },
              },
            },
            settings: {
              entry: ['clearCurrentFile', 'clearParams', 'pushSettings'],
              tags: 'settings',
            },
            publicationList: {
              entry: [
                'clearCurrentFile',
                'clearParams',
                'pushPublicationListRoute',
              ],
              tags: ['topbar', 'library'],
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    'COMMIT.DELETE.FILE': {
                      actions: [
                        'removePublicationFromCitations',
                        'removeFileFromRecentList',
                        'updatePublicationList',
                      ],
                    },
                  },
                },
              },
            },
            draftList: {
              entry: ['clearCurrentFile', 'clearParams', 'pushDraftListRoute'],
              tags: ['topbar', 'library'],
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    'COMMIT.DELETE.FILE': {
                      actions: ['removeFileFromRecentList', 'updateDraftList'],
                    },
                  },
                },
              },
            },
            createDraft: {
              invoke: {
                src: 'createNewDraft',
                id: 'createNewDraft',
                onDone: [
                  {
                    actions: 'assignNewDraftValues',
                    target: '#main-page.routes.editor.valid',
                  },
                ],
              },
            },
          },
          on: {
            'ROUTE.NOT.FOUND': {
              target: '.idle',
            },
            'GO.TO.HOME': {
              target: '.home',
            },
            'GO.TO.SETTINGS': {
              target: '.settings',
            },
            'GO.TO.PUBLICATIONLIST': {
              target: '.publicationList',
            },
            'GO.TO.DRAFTLIST': {
              target: '.draftList',
            },
            'GO.TO.DRAFT': {
              target: '.editor',
            },
            'GO.TO.PUBLICATION': {
              target: '.publication',
            },
            'CREATE.NEW.DRAFT': {
              target: '.createDraft',
            },
            'COMMIT.OPEN.WINDOW': {
              actions: 'openWindow',
            },
            'COMMIT.EDIT.PUBLICATION': {
              actions: 'editPublication',
            },
            'COMMIT.PUBLISH': {
              actions: ['removeDraftFromList', 'asssignNewPublicationValues'],
              target: '.publication.valid',
            },
          },
        },
      },
      on: {
        'GO.BACK': {
          actions: 'navigateBack',
        },
        'GO.FORWARD': {
          actions: 'navigateForward',
        },
      },
    },
    {
      guards: {
        isMetaEventDifferent: (context, _, meta) => {
          // eslint-disable-next-line
          let {type, ...eventParams} = meta.state.event
          return !isEqual(context.params, eventParams)
        },
        isEventDifferent: (context, event) => {
          // eslint-disable-next-line
          let {type, ...eventParams} = event
          let result = !isEqual(context.params, eventParams)
          return result
        },
      },
      actions: {
        // @ts-ignore
        spawnUIMachines: assign({
          library: () => spawn(libraryMachine, 'library'),
          activity: () => spawn(activityMachine, 'activity'),
        }),
        removePublicationFromCitations: () => {
          // TODO.
        },
        // assignError: (_, event) => {},
        assignFiles: assign(function assignFilesPredicate(_, event) {
          let draftList = event.draftList.map(function draftListMapper(draft) {
            let editor = buildEditorHook(plugins, EditorMode.Draft)
            return {
              ...draft,
              ref: spawn(
                createDraftMachine({client, draft, editor}),
                getRefFromParams('draft', draft.id, null),
              ),
            }
          })
          let publicationList = event.publicationList.map(
            function publicationListMapper(publication) {
              let editor = buildEditorHook(plugins, EditorMode.Publication)
              return {
                ...publication,
                ref: spawn(
                  createPublicationMachine({client, publication, editor}),
                  getRefFromParams(
                    'pub',
                    publication.document.id,
                    publication.version,
                  ),
                ),
              }
            },
          )
          return {
            publicationList,
            draftList,
          }
        }),

        setDraftAsCurrent: assign({
          currentFile: (context) => {
            let draft = context.draftList.find(
              (d) =>
                d.ref.id ==
                getRefFromParams('draft', context.params.docId, null),
            )
            return draft?.ref ?? null
          },
        }),
        setPublicationAsCurrent: assign({
          currentFile: (context) => {
            let publication = context.publicationList.find(
              (p) =>
                p.ref.id ==
                getRefFromParams(
                  'pub',
                  context.params.docId,
                  context.params.version,
                ),
            )
            return publication?.ref ?? null
          },
        }),
        openWindow: async (context, event) => {
          openWindow(event.path)
        },
        pushToActivity: (context, e, meta) => {
          let {event} = meta.state

          context.activity?.send({
            type: 'VISIT.PUBLICATION',
            url: `${event.docId}/${event.version}`,
          })
        },
        pushToRecents: assign(({currentFile, recents}) => {
          if (currentFile) {
            let _set = new Set<typeof currentFile>(recents)
            if (_set.has(currentFile)) _set.delete(currentFile)
            _set.add(currentFile)
            return {
              recents: [..._set].reverse(),
            }
          } else {
            return {}
          }
        }),
        // @ts-ignore
        clearCurrentFile: assign({
          currentFile: null,
        }),
        setDraftParams: assign({
          params: (context, e, meta) => {
            // @ts-ignore
            let {event} = meta.state
            return {
              ...context.params,
              docId: event.docId,
              replace: event.replace,
            }
          },
        }),
        setPublicationParams: assign({
          params: (c, e, meta) => {
            let {event} = meta.state
            return {
              docId: event.docId,
              version: event.version,
              blockId: event.blockId,
              replace: event.replace,
            }
          },
        }),
        pushPublicationRoute: send(
          (context) => {
            return {
              type: 'pushPublication',
              docId: context.params.docId,
              version: context.params.version,
              blockId: context.params.blockId,
              replace: context.params.replace,
            }
          },
          {to: 'router'},
        ),
        pushDraftRoute: send(
          (context) => {
            return {
              type: 'pushDraft',
              docId: context.params.docId,
              blockId: context.params.blockId,
              replace: context.params.replace,
            }
          },
          {to: 'router'},
        ),
        pushSettings: send(
          {
            type: 'pushSettings',
          },
          {to: 'router'},
        ),
        clearParams: assign(() => ({
          params: {
            docId: '',
            version: null,
            blockId: null,
            replace: false,
          },
        })),
        navigateBack: () => {
          if (!window.history) return
          window.history.back()
        },
        navigateForward: () => {
          if (!window.history) return
          window.history.forward()
        },
        pushDraftListRoute: send(
          {
            type: 'pushDraftList',
          },
          {to: 'router'},
        ),
        pushPublicationListRoute: send(
          {
            type: 'pushPublicationList',
          },
          {to: 'router'},
        ),
        editPublication: (_, event) => {
          createDraft(event.docId).then((doc) => {
            openWindow(`/editor/${doc.id}`)
          })
        },
        updateDraftList: assign((context, event) => {
          let draftId = getRefFromParams('draft', event.documentId, null)
          debug('UPDATE DRAFTLIST', draftId)
          return {
            draftList: context.draftList.filter((d) => d.ref.id != draftId),
          }
        }),
        updatePublicationList: assign((context, event) => {
          let pubId = getRefFromParams('pub', event.documentId, event.version)
          debug('UPDATE PUBLIST', pubId)
          return {
            publicationList: context.publicationList.filter(
              (p) => p.ref.id != pubId,
            ),
          }
        }),
        removeFileFromRecentList: assign({
          recents: (context, event) =>
            context.recents.filter((ref) => !ref.id.includes(event.documentId)),
        }),
        assignNewDraftValues: assign((context, event) => {
          let editor = buildEditorHook(plugins, EditorMode.Draft)
          let draftRef = spawn(
            createDraftMachine({client, editor, draft: event.data}),
            getRefFromParams('draft', event.data.id, null),
          )
          return {
            params: {
              docId: event.data.id,
              replace: true,
              version: null,
              blockId: null,
            },
            currentFile: draftRef,
            draftList: [
              ...context.draftList,
              {
                ...event.data,
                ref: draftRef,
              },
            ],
          }
        }),
        // eslint-disable-next-line
        asssignNewPublicationValues: assign((context, event) => {
          let editor = buildEditorHook(plugins, EditorMode.Publication)
          let publicationRef = spawn(
            createPublicationMachine({
              client,
              publication: event.publication,
              editor,
            }),
            getRefFromParams(
              'pub',
              event.publication.document.id,
              event.publication.version,
            ),
          )

          return {
            params: {
              docId: event.publication.document?.id,
              version: event.publication.version,
              blockId: null,
              replace: true,
            },
            currentFile: publicationRef,
            publicationList: [
              ...context.publicationList,
              {
                ...event.publication,
                ref: publicationRef,
              },
            ],
          }
        }),
        removeDraftFromList: assign({
          draftList: (context, event) => {
            let ref = getRefFromParams('draft', event.documentId, null)
            debug('REMOVE DRAFT:', ref)
            return context.draftList.filter((d) => d.ref.id != ref)
          },
        }),
      },
      services: {
        fetchFiles: () => (sendBack) => {
          Promise.all([
            client.fetchQuery([queryKeys.GET_PUBLICATION_LIST], () =>
              listPublications(),
            ),
            client.fetchQuery([queryKeys.GET_DRAFT_LIST], () => listDrafts()),
          ])
            .then(function filesResponse([pubList, draftList]) {
              sendBack({
                type: 'REPORT.FILES.SUCCESS',
                publicationList: pubList.publications.sort((a, b) => {
                  if (a.document?.updateTime && b.document?.updateTime) {
                    return (
                      b.document?.updateTime.getSeconds() -
                      a.document?.updateTime.getSeconds()
                    )
                  } else {
                    return (
                      b?.document?.createTime?.getSeconds() -
                      a?.document?.createTime?.getSeconds()
                    )
                  }
                }),
                draftList: draftList.documents.sort((a, b) => {
                  return b.createTime.getSeconds() - a.createTime.getSeconds()
                }),
              })
            })
            .catch((error) => {
              sendBack({
                type: 'REPORT.FILES.ERROR',
                errorMessage: JSON.stringify(error),
              })
            })
        },
        // router reference: https://gist.github.com/ChrisShank/369aa8cbd4002244d7769bd1ba3e232a
        router: () => (sendBack, receive) => {
          let navRouter = Navaid('/', () => sendBack('GO.TO.HOME'))
          // Deserialize events from the URL
          navRouter
            .on('/', () => {
              sendBack('GO.TO.HOME')
            })
            .on('/settings', () => {
              sendBack('GO.TO.SETTINGS')
            })
            .on('/publications', () => {
              sendBack('GO.TO.PUBLICATIONLIST')
            })
            .on('/drafts', () => {
              sendBack('GO.TO.DRAFTLIST')
            })
            .on<{docId: string}>('/editor/:docId', (params) => {
              return params
                ? sendBack({type: 'GO.TO.DRAFT', ...params})
                : sendBack('ROUTE.NOT.FOUND')
            })
            .on<{
              docId: string
              version?: string
              blockId?: string
            }>('/p/:docId/:version?/:blockId?', (params) => {
              return params
                ? sendBack({
                    type: 'GO.TO.PUBLICATION',
                    docId: params.docId,
                    version: params.version,
                    blockId: params.blockId,
                  })
                : sendBack('ROUTE.NOT.FOUND')
            })

          receive((event: RouterEvent) => {
            if (event.type == 'listen') {
              /**
               * we initialize the app in a particular route based for testing purposes, that's why we can pass a `initialRoute` prop to `<App />`
               */
              navRouter.listen(initialRoute)
            }
            if (event.type == 'pushHome') {
              navRouter.route('/')
            } else if (event.type == 'pushPublication') {
              let {pathname} = window.location
              let newRoute = `/p/${event.docId}${
                event.version
                  ? `/${event.version}${
                      event.blockId ? `/${event.blockId}` : ''
                    }`
                  : ''
              }`
              if (pathname != newRoute) {
                navRouter.route(newRoute, event.replace)
              }
            } else if (event.type == 'pushDraft') {
              let {pathname} = window.location
              let newRoute = `/editor/${event.docId}`
              if (pathname != newRoute) {
                navRouter.route(newRoute, event.replace)
              }
            } else if (event.type == 'pushPublicationList') {
              navRouter.route('/publications')
            } else if (event.type == 'pushDraftList') {
              navRouter.route('/drafts')
            } else if (event.type == 'pushSettings') {
              navRouter.route('/settings')
            } else {
              navRouter.route('/')
            }
          })

          return () => navRouter?.unlisten?.()
        },
        createNewDraft: async () => {
          let doc = await createDraft()
          return doc
        },
      },
    },
  )
}

function openWindow(path?: string) {
  if (path) {
    // Open window with path
    tauriInvoke('plugin:window|open', {path})
  } else {
    createDraft().then((doc) => {
      let path = `/editor/${doc.id}`
      // open window with new path
      tauriInvoke('plugin:window|open', {path})
    })
  }
}
