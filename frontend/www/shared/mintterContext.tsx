import {createContext, useContext, useMemo, useCallback} from 'react'
import * as apiClient from './mintterClient'
import {Publication, Draft} from '@mintter/proto/documents_pb'

// TODO: (Horacio) Fixme Types
export interface MintterClient {
  allPublications: (d: any) => Promise<string>
  getPublication: (p: any) => Promise<Publication>
  connectToPeerById: (peerIds: string[]) => any
  getSections: (sections: any[]) => any
  createDraft: () => Draft
}

const MintterClientContext = createContext<MintterClient>(null)

export function MintterProvider(props) {
  const allPublications = useCallback(
    form =>
      apiClient.allPublications(form).then(res => {
        console.log('ress => ', res)
        return res
      }),
    [],
  )

  const getPublication = useCallback(
    (key, id) => apiClient.getPublication(id).catch(err => console.error(err)),
    [],
  )

  const getSections = useCallback(
    sections =>
      apiClient.getSections(sections).catch(err => console.error(err)),
    [],
  )

  const createDraft = useCallback(
    () => apiClient.createDraft().catch(err => console.error(err)),
    [],
  )

  const connectToPeerById = useCallback(
    peerId =>
      apiClient.connectToPeerById(peerId).catch(err => console.error(err)),
    [],
  )

  const value = useMemo(
    () => ({
      allPublications,
      getPublication,
      connectToPeerById,
      getSections,
      createDraft,
    }),
    [
      allPublications,
      getPublication,
      connectToPeerById,
      getSections,
      createDraft,
    ],
  )

  return <MintterClientContext.Provider value={value} {...props} />
}

export function useMintter() {
  const context = useContext(MintterClientContext)

  if (context === undefined) {
    throw new Error(`useMintter must be used within a MintterProvider`)
  }

  return context
}
