import {getDocumentTitle} from '@app/utils/get-document-title'
import {useSelector} from '@xstate/react'
import {InterpreterFrom} from 'xstate'
import {createMainPageMachine} from './main-page-machine'
import {createInterpreterContext} from './utils/machine-utils'
const [MainPageProvider, useMainPage, createMainPageSelector] =
  createInterpreterContext<
    InterpreterFrom<ReturnType<typeof createMainPageMachine>>
  >('MainPage')

export {MainPageProvider, useMainPage}

export const useLibrary = createMainPageSelector(
  (state) => state.context.library,
)

export var usePageTitle = createMainPageSelector(function pageTitleSelector(
  state,
) {
  var result = ''

  if (state.matches('routes.draftList')) {
    result = 'Drafts'
  }

  if (state.matches('routes.publicationList')) {
    result = 'Publications'
  }

  if (
    state.matches('routes.editor.valid') ||
    state.matches('routes.publication.valid')
  ) {
    let value = getDocumentTitle(state.context.document)
    result = value
  }

  return result
  // }, [state.changed])
})

export function useIsLibraryOpen() {
  let ref = createMainPageSelector((state) => state.context.library)()
  return useSelector(ref, (state) => state.matches('opened'))
}

export let useParams = createMainPageSelector((state) => state.context.params)

export function getRefFromParams(
  type: 'pub' | 'doc',
  docId: string,
  version: string | null,
): string {
  if (type == 'doc') {
    return `draft-${docId}`
  } else if (type == 'pub') {
    return `pub-${docId}-${version}`
  }

  return ''
}

export let useRecents = createMainPageSelector((state) => state.context.recents)
