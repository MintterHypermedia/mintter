import {useDraftList, usePublicationList} from '@app/models/documents'
import {fetchWebLink} from '@app/models/web-links'
import {isMintterLink} from '@app/utils/is-mintter-link'
import {useNavigate} from '@app/utils/navigation'
import {getIdsfromUrl} from '@mintter/shared'
import {Spinner} from '@mintter/ui'
import {listen} from '@tauri-apps/api/event'
import {Command} from 'cmdk'
import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'
import '../styles/quick-switcher.scss'

export default function QuickSwitcher() {
  const {data: drafts} = useDraftList()
  const {data: publications} = usePublicationList()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    let unlisten: () => void | undefined

    listen('open_quick_switcher', () => {
      if (document.hasFocus()) {
        // FIXME: this is a *hack* until we just send this event to the current window from tauri
        setOpen(true)
      }
    }).then((f) => (unlisten = f))

    return () => unlisten?.()
  }, [])

  const [actionPromise, setActionPromise] = useState<Promise<void> | null>(null)

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setActionPromise(null)
      }}
      label="Quick Switcher"
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search Drafts and Publications..."
        disabled={!!actionPromise}
      />
      {actionPromise ? (
        <Spinner />
      ) : (
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {(isMintterLink(search) ||
            search.startsWith('http://') ||
            search.startsWith('https://')) && (
            <Command.Item
              key="mtt-link"
              value={search}
              onSelect={() => {
                if (isMintterLink(search)) {
                  setOpen(false)
                  let [docId, version, block] = getIdsfromUrl(search)
                  navigate({
                    key: 'publication',
                    documentId: docId,
                    versionId: version,
                    blockId: block,
                  })
                } else {
                  let [docId, version, block] = getIdsfromUrl(search)
                  if (docId) {
                    navigate({
                      key: 'publication',
                      documentId: docId,
                      versionId: version,
                      blockId: block,
                    })
                    setOpen(false)
                  } else {
                    setActionPromise(
                      fetchWebLink(search)
                        .then((result) => {
                          console.log('wtf2')
                          console.log(result)
                          if (result && result?.documentId) {
                            setOpen(false)
                            navigate({
                              key: 'publication',
                              documentId: result.documentId,
                              versionId: result.documentVersion || undefined,
                            })
                          }
                        })
                        .catch((e) => {
                          toast.error('Failed to open link.')
                        })
                        .finally(() => {
                          setActionPromise(null)
                          // setOpen(false)
                        }),
                    )
                  }
                }
              }}
            >
              Query {search}
            </Command.Item>
          )}

          {drafts?.documents.map((draft) => {
            return (
              <Command.Item
                key={draft.id}
                value={(draft.title || 'Untitled Draft') + draft.id}
                onSelect={() => {
                  setOpen(false)
                  navigate({
                    key: 'draft',
                    documentId: draft.id,
                  })
                }}
              >
                <span className="cmdk-mtt-text">
                  {draft.title || 'Untitled Draft'}
                </span>
                <span className="cmdk-mtt-type">Draft</span>
              </Command.Item>
            )
          })}

          {publications?.publications.map((publication) => {
            const docId = publication.document?.id
            const title = publication.document?.title || 'Untitled Publication'

            if (!docId || !title) return null

            return (
              <Command.Item
                key={docId}
                value={title + docId}
                onSelect={() => {
                  setOpen(false)
                  navigate({
                    key: 'publication',
                    documentId: docId,
                    versionId: publication.version,
                  })
                }}
              >
                <span className="cmdk-mtt-text">
                  {publication.document?.title}
                </span>
                <span className="cmdk-mtt-type">Publication</span>
              </Command.Item>
            )
          })}
        </Command.List>
      )}
    </Command.Dialog>
  )
}
