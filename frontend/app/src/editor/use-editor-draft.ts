// TODO
/**
 * remove custom hook
 * implement fetch inside the service
 */
import {FlowContent, getDraft, GroupingContent, u} from '@mintter/client'
import {useMachine} from '@xstate/react'
import {assign, createMachine} from 'xstate'
import type {Descendant} from 'mixtape'
import {nanoid} from 'nanoid'
import {useEffect, useMemo, useReducer} from 'react'

type Document = {
  id: string
  title: string
  subtitle: string
  children: [GroupingContent]
}

type DRAFT_FETCH_EVENT = {
  type: 'FETCH'
  documentId: string
}

type DRAFT_UPDATE_EVENT = {
  type: 'UPDATE'
  payload: Partial<Document>
}

type DRAFT_RECEIVE_DATA_EVENT = {
  type: 'RECEIVE_DATA'
  data: Document
}

type DraftEditorMachineEvent =
  | DRAFT_FETCH_EVENT
  | DRAFT_RECEIVE_DATA_EVENT
  | DRAFT_UPDATE_EVENT
  | {
      type: 'CANCEL'
    }
  | {
      type: 'PUBLISH'
    }

type DraftEditorMachineContext = {
  retries: number
  prevDraft: Document | null
  localDraft: Document | null
  errorMessage?: string
}

const draftEditorMachine = ({actions}) =>
  createMachine<DraftEditorMachineContext, DraftEditorMachineEvent>(
    {
      id: 'editor',
      initial: 'idle',
      context: {
        retries: 0,
        prevDraft: null,
        localDraft: null,
        errorMessage: '',
      },
      states: {
        idle: {
          on: {
            FETCH: {
              target: 'fetching',
            },
          },
          initial: 'noError',
          states: {
            noError: {
              entry: ['clearErrorMessage'],
            },
            errored: {
              on: {
                FETCH: {
                  target: '#fetching',
                  actions: assign({
                    retries: (context, event) => context.retries + 1,
                  }),
                },
              },
            },
          },
        },
        fetching: {
          id: 'fetching',
          on: {
            FETCH: 'fetching',
            CANCEL: {
              target: 'idle',
            },
            RECEIVE_DATA: {
              target: 'editing',
              actions: 'assignDataToContext',
            },
          },
          invoke: {
            src: 'fetchData',
            onError: {
              target: 'idle.errored',
              actions: 'assignErrorToContext',
            },
            onDone: {
              target: '#editing',
              actions: ['assignDataToContext'],
            },
          },
        },
        editing: {
          id: 'editing',
          initial: 'idle',
          states: {
            idle: {
              on: {
                UPDATE: {
                  actions: 'updateValueToContext',
                  target: 'debouncing',
                },
                PUBLISH: {
                  target: '#published',
                },
              },
            },
            debouncing: {
              on: {
                UPDATE: {
                  actions: 'updateValueToContext',
                  target: 'debouncing',
                },
              },
              after: {
                1000: {
                  target: 'idle',
                  actions: 'saveDraft',
                },
              },
            },
          },
        },
        published: {
          id: 'published',
          type: 'final',
        },
      },
    },
    {
      services: {
        fetchData: (context, event) => () => getDraft(event.documentId),
      },
      actions: {
        updateValueToContext: assign({
          localDraft: (context, event) => {
            return {
              ...context.localDraft,
              ...(event as DRAFT_UPDATE_EVENT).payload,
            }
          },
        }),
        assignDataToContext: assign((context, event) => {
          console.log('assignDataToContext', event.type)
          // if (event.type !== 'RECEIVE_DATA') return {}
          return {
            prevDraft: (event as DRAFT_RECEIVE_DATA_EVENT).data,
            localDraft: (event as DRAFT_RECEIVE_DATA_EVENT).data,
          }
        }),
        clearErrorMessage: assign({
          errorMessage: undefined,
        }),
        assignErrorToContext: assign((context, event) => {
          console.log('assignErrorToContext', {context, event})
          return {
            errorMessage: event.data?.message || 'An unknown error occurred',
          }
        }),
        ...actions,
      },
    },
  )

export function useEditorDraft(documentId: string, options) {
  const [state, send] = useMachine(draftEditorMachine(options))
  useEffect(() => {
    if (documentId) {
      send({type: 'FETCH', documentId})
    }
  }, [])
  return [state, send]
}
