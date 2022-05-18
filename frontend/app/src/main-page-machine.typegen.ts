// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    assignData: 'REPORT.DATA.SUCCESS'
    clearCache: 'RECONCILE'
  }
  internalEvents: {
    'xstate.init': {type: 'xstate.init'}
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {}
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'ready'
  tags: never
}
export interface Typegen1 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    assignData: 'REPORT.DATA.SUCCESS'
    clearCache: 'RECONCILE'
  }
  internalEvents: {
    'xstate.init': {type: 'xstate.init'}
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {}
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'ready'
  tags: never
}
export interface Typegen2 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    navigateBack: 'goBack'
    navigateForward: 'goForward'
    updateLibrary: 'RECONCILE'
    setCurrentDocument: 'SET.CURRENT.DOCUMENT'
    setDraftParams: ''
    setPublicationParams: ''
    clearCurrentDocument:
      | 'goToHome'
      | 'goToSettings'
      | 'goToPublicationList'
      | 'goToDraftList'
    clearParams:
      | 'goToHome'
      | 'goToSettings'
      | 'goToPublicationList'
      | 'goToDraftList'
    pushToRecents: 'xstate.init'
    pushDraftRoute: ''
    pushPublicationRoute: ''
    pushPublicationListRoute: 'goToPublicationList'
    pushDraftListRoute: 'goToDraftList'
  }
  internalEvents: {
    '': {type: ''}
    'xstate.init': {type: 'xstate.init'}
    'done.invoke.router': {
      type: 'done.invoke.router'
      data: unknown
      __tip: 'See the XState TS docs to learn how to strongly type this.'
    }
    'error.platform.router': {type: 'error.platform.router'; data: unknown}
  }
  invokeSrcNameMap: {
    router: 'done.invoke.router'
    createNewDraft: 'done.invoke.(machine).routes.createDraft:invocation[0]'
  }
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {
    router: 'xstate.init'
    createNewDraft: 'goToNew' | 'toNewDraft'
  }
  eventsCausingGuards: {
    isPublication: 'goToNew'
    isDraft: 'goToNew'
    isMetaEventDifferent: ''
    isEventDifferent: 'goToEditor' | 'goToPublication'
  }
  eventsCausingDelays: {}
  matchesStates:
    | 'routes'
    | 'routes.idle'
    | 'routes.home'
    | 'routes.editor'
    | 'routes.editor.validating'
    | 'routes.editor.valid'
    | 'routes.editor.error'
    | 'routes.publication'
    | 'routes.publication.validating'
    | 'routes.publication.valid'
    | 'routes.publication.error'
    | 'routes.settings'
    | 'routes.publicationList'
    | 'routes.draftList'
    | 'routes.createDraft'
    | {
        routes?:
          | 'idle'
          | 'home'
          | 'editor'
          | 'publication'
          | 'settings'
          | 'publicationList'
          | 'draftList'
          | 'createDraft'
          | {
              editor?: 'validating' | 'valid' | 'error'
              publication?: 'validating' | 'valid' | 'error'
            }
      }
  tags:
    | 'topbar'
    | 'library'
    | 'documentView'
    | 'draft'
    | 'publication'
    | 'settings'
}
