import {Document} from '@mintter/shared'
import {ActorRefFrom, StateFrom, assign, createMachine} from 'xstate'
import {BlocksMap, BlocksMapIten, createBlocksMap} from './documents'
import {createActorContext} from '@xstate/react'

export type DraftMachineState = StateFrom<typeof draftMachine>

export const draftMachine = createMachine(
  {
    context: {
      blocksMap: {},
      hasChangedWhileSaving: false,
      draft: null,
    },
    id: 'Draft',
    initial: 'fetching',
    states: {
      fetching: {
        on: {
          'GET.DRAFT.ERROR': {
            target: 'error',
          },
          'GET.DRAFT.SUCCESS': {
            target: 'mountingEditor',
            actions: [
              {
                type: 'setCurrentDraft',
              },
            ],
          },
        },
      },
      mountingEditor: {
        entry: [
          {
            type: 'populateEditor',
          },
          {
            type: 'setCurrentBlocksmap',
          },
        ],
        after: {
          20: {
            target: 'ready',
          },
        },
      },
      error: {
        entry: [{type: 'indicatorError'}],
        on: {
          'GET.DRAFT.RETRY': {
            target: 'fetching',
            actions: assign({
              blocksMap: {},
              hasChangedWhileSaving: false,
              draft: null,
            }),
          },
        },
      },
      ready: {
        initial: 'idle',
        states: {
          idle: {
            entry: [
              {
                type: 'focusEditor',
              },
            ],
            on: {
              CHANGE: {
                target: 'changed',
              },
            },
          },
          changed: {
            entry: [
              {
                type: 'indicatorChange',
              },
            ],
            after: {
              autosaveTimeout: {
                target: '#Draft.ready.saving',
              },
            },
            on: {
              CHANGE: {
                target: 'changed',
                reenter: true,
              },
            },
          },
          saving: {
            entry: [
              {
                type: 'resetChangeWhileSaving',
              },
              {
                type: 'indicatorSaving',
              },
            ],
            invoke: {
              src: 'updateDraft',
              input: ({context}) => context.blocksMap,
              id: 'update-draft-actor',
              onDone: [
                {
                  target: 'saving',
                  guard: 'didChangeWhileSaving',
                  reenter: true,
                  actions: [
                    {type: 'onSaveSuccess'},
                    {type: 'indicatorSaved'},
                    {
                      type: 'updateContextAfterSave',
                    },
                  ],
                },
                {
                  target: 'idle',
                  actions: [
                    {type: 'onSaveSuccess'},
                    {type: 'indicatorSaved'},
                    {
                      type: 'updateContextAfterSave',
                    },
                  ],
                },
              ],
              onError: [
                {
                  target: 'saveError',
                },
              ],
            },
            on: {
              CHANGE: {
                target: 'saving',
                actions: [
                  {
                    type: 'setHasChangedWhileSaving',
                  },
                ],
                reenter: false,
              },
            },
          },
          saveError: {
            on: {
              'RESET.DRAFT': {
                target: '#Draft.fetching',
              },
            },
          },
        },
      },
    },
    types: {
      events: {} as
        | {type: 'CHANGE'}
        | {type: 'RESET.DRAFT'}
        | {type: 'GET.DRAFT.ERROR'; errorMessage: string}
        | {type: 'GET.DRAFT.RETRY'}
        | {type: 'GET.DRAFT.SUCCESS'; draft: Document},
      context: {} as {
        blocksMap: BlocksMap
        hasChangedWhileSaving: boolean
        draft: Document | null
      },
    },
  },
  {
    actions: {
      setHasChangedWhileSaving: assign({
        hasChangedWhileSaving: true,
      }),
      resetChangeWhileSaving: assign({
        hasChangedWhileSaving: false,
      }),
      setCurrentBlocksmap: assign({
        // @ts-expect-error
        blocksMap: ({context, event}) => {
          if (event.type == 'GET.DRAFT.SUCCESS') {
            let newBm = createBlocksMap(event.draft.children, '')
            return newBm
          }
        },
      }),
      updateContextAfterSave: assign(({context, event}) => {
        if (event.output && typeof event.output != 'string') {
          console.log(
            `== ~ updateContextAfterSave:assign ~ event.output:`,
            event.output,
          )
          return {
            blocksMap: createBlocksMap(
              event.output.updatedDocument.children,
              '',
            ),
            draft: event.output.updatedDocument,
            hasChangedWhileSaving: false,
          }
        }
      }),
      setCurrentDraft: assign({
        draft: ({event}) => event.draft,
      }),
    },
    guards: {
      didChangeWhileSaving: ({context}) => context.hasChangedWhileSaving,
    },
    delays: {
      autosaveTimeout: 500,
    },
  },
)

export const saveIndicator = createMachine(
  {
    id: 'saveIndicator',
    initial: 'idle',
    states: {
      idle: {},
      changed: {
        on: {
          'INDICATOR.SAVING': {
            target: 'saving',
          },
        },
      },
      saving: {
        on: {
          'INDICATOR.SAVED': {
            target: 'saved',
          },
        },
      },
      saved: {
        after: {
          '2000': {
            target: '#saveIndicator.idle',
            actions: [],
            meta: {},
          },
        },
      },
      error: {},
    },
    on: {
      'INDICATOR.CHANGE': {
        target: '.changed',
      },
      'INDICATOR.ERROR': {
        target: '.error',
      },
    },
    onDone: [{target: '.idle'}],
    types: {
      events: {} as
        | {type: 'INDICATOR.CHANGE'}
        | {type: 'INDICATOR.SAVING'}
        | {type: 'INDICATOR.SAVED'}
        | {type: 'INDICATOR.ERROR'},
    },
  },
  {
    actions: {},
    actors: {},
    guards: {},
    delays: {},
  },
)

export const DraftStatusContext = createActorContext(saveIndicator)