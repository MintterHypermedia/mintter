import {getDocumentTitle} from '@app/utils/get-document-title'
import {debug} from '@app/utils/logger'
import {useSelector} from '@xstate/react'
import {InterpreterFrom} from 'xstate'
import {createMainPageMachine} from './main-page-machine'
import {createInterpreterContext} from './utils/machine-utils'
const [MainPageProvider, useMainPage, createMainPageSelector] =
  createInterpreterContext<
    InterpreterFrom<ReturnType<typeof createMainPageMachine>>
  >('MainPage')

export {MainPageProvider, useMainPage}

export function useFiles() {
  let ref = createMainPageSelector((state) => state.context.files)()
  return useSelector(ref, (state) => state.context.data)
}

export let useFilesService = createMainPageSelector(
  (state) => state.context.files,
)

export function useDrafts() {
  let ref = createMainPageSelector((state) => state.context.drafts)()
  return useSelector(ref, (state) => state.context.data)
}

export let useDraftsService = createMainPageSelector(
  (state) => state.context.drafts,
)

export const useLibrary = createMainPageSelector(
  (state) => state.context.library,
)

export var usePageTitle = createMainPageSelector(function pageTitleSelector(
  state,
) {
  var result = ''
  console.log('enters usePageTitle', state.value)

  if (state.matches('routes.draftList')) {
    console.log('enters in DraftList')

    result = 'Drafts'
  }

  if (state.matches('routes.publicationList')) {
    console.log('enters in publicationList')
    result = 'Publications'
  }

  if (
    state.matches('routes.editor.valid') ||
    state.matches('routes.publication.valid')
  ) {
    console.log('enters in editor or publication', state.value)
    let value = getDocumentTitle(state.context.document)
    console.log('🚀 ~ file: main-page-context.tsx ~ line 58 ~ value', value)
    debug('🚀 ~ file: main-page-context.tsx ~ line 53 ~ value', value)
    result = value
  }

  return result
})

export function useIsLibraryOpen() {
  let ref = createMainPageSelector((state) => state.context.library)()
  return useSelector(ref, (state) => state.matches('opened'))
}

export let useParams = createMainPageSelector((state) => state.context.params)

export let useRecents = createMainPageSelector((state) => state.context.recents)
