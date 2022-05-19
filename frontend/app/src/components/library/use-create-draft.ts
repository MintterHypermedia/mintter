import {createDraft as apiCreateDraft, Document} from '@app/client'
import {useMainPage} from '@app/main-page-context'

export function useCreateDraft() {
  const mainPageService = useMainPage()

  function createDraft(pubId?: string, callback?: () => void) {
    try {
      apiCreateDraft(pubId).then(function createDraftSuccess(
        newDraft: Document,
      ) {
        callback?.()
        mainPageService.send('RECONCILE')
        mainPageService.send({type: 'goToEditor', docId: newDraft.id})
      })
    } catch (err) {
      throw Error(`new Draft error: ${err}`)
    }
  }

  return {createDraft}
}
