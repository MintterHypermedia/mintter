import {publicationsClient} from '@app/api-clients'
import {deleteFileMachine} from '@app/delete-machine'
import {Dropdown} from '@app/editor/dropdown'
import {prefetchPublication} from '@app/models/documents'
import {queryKeys} from '@app/models/query-keys'
import {copyTextToClipboard} from '@app/utils/copy-to-clipboard'
import {PublicationRoute, useNavigate} from '@app/utils/navigation'
import {
  Document,
  formattedDate,
  MINTTER_LINK_PREFIX,
  Publication,
} from '@mintter/shared'
import {useQueryClient} from '@tanstack/react-query'
import {useActor, useInterpret} from '@xstate/react'
import Highlighter from 'react-highlight-words'
import {toast} from 'react-hot-toast'
import {DeleteDialog} from './delete-dialog'
import {MouseEvent} from 'react'
import {
  XStack,
  Text,
  Button,
  ButtonText,
  MoreHorizontal,
  ListItem,
  Copy,
  ExternalLink,
  Delete,
  Separator,
} from '@mintter/ui'
import {AccountLinkAvatar} from './account-link-avatar'

export function PublicationListItem({
  publication,
  hasDraft,
  copy = copyTextToClipboard,
}: {
  publication: Publication
  copy?: typeof copyTextToClipboard
  hasDraft: Document | undefined
}) {
  const navigate = useNavigate()
  const spawn = useNavigate('spawn')
  const client = useQueryClient()
  const title = publication.document?.title || 'Untitled Document'
  const docId = publication.document?.id
  if (!docId) throw new Error('PublicationListItem requires id')

  const deleteService = useInterpret(
    () =>
      deleteFileMachine.withContext({
        documentId: publication.document!.id,
        version: publication.version,
        errorMessage: '',
      }),
    {
      services: {
        performDelete: (context) => {
          return publicationsClient.deletePublication({
            documentId: context.documentId,
          })
        },
      },
      actions: {
        persistDelete: () => {
          client.invalidateQueries([queryKeys.GET_PUBLICATION_LIST])
        },
      },
    },
  )
  const [deleteState] = useActor(deleteService)

  function goToItem(event: MouseEvent) {
    event.preventDefault()
    const route: PublicationRoute = {
      key: 'publication',
      documentId: docId!,
      versionId: publication.version,
    }
    if (event.metaKey || event.shiftKey) {
      spawn(route)
    } else {
      navigate(route)
    }
  }

  function onCopy() {
    copy(
      `${MINTTER_LINK_PREFIX}${publication.document?.id}/${publication.version}`,
    )
    toast.success('Document ID copied successfully')
  }
  return (
    <Button
      chromeless
      theme="gray"
      tag="li"
      onMouseEnter={() => {
        if (publication.document)
          prefetchPublication(publication.document.id, publication.version)
      }}
    >
      {/* @ts-ignore */}
      <ButtonText onPress={goToItem} fontWeight="700" flex={1}>
        {title}
      </ButtonText>

      {hasDraft && (
        <Button
          theme="yellow"
          onPress={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate({key: 'draft', documentId: hasDraft.id})
          }}
          size="$1"
        >
          Resume Editing
        </Button>
      )}
      <XStack>
        {publication.document?.editors.length ? (
          publication.document?.editors.map((editor) => (
            <AccountLinkAvatar accountId={editor} key={editor} />
          ))
        ) : publication.document?.author ? (
          <AccountLinkAvatar accountId={publication.document?.author} />
        ) : null}
      </XStack>
      <Text
        fontFamily="$body"
        fontSize="$2"
        data-testid="list-item-date"
        minWidth="10ch"
        textAlign="right"
      >
        {publication.document?.updateTime
          ? formattedDate(publication.document?.updateTime)
          : '...'}
      </Text>
      <XStack>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button size="$1" circular data-trigger>
              <MoreHorizontal size={12} />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content
              align="end"
              data-testid="library-item-dropdown-root"
              hidden={deleteState.matches('open')}
            >
              <Dropdown.Item data-testid="copy-item" onSelect={onCopy} asChild>
                <ListItem
                  icon={Copy}
                  size="$2"
                  hoverTheme
                  pressTheme
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  textAlign="left"
                  space="$0"
                >
                  Copy Document ID
                </ListItem>
              </Dropdown.Item>
              <Dropdown.Item
                data-testid="new-window-item"
                onSelect={() =>
                  spawn({
                    key: 'publication',
                    documentId: docId,
                    versionId: publication.version,
                  })
                }
                asChild
              >
                <ListItem
                  icon={ExternalLink}
                  size="$2"
                  hoverTheme
                  pressTheme
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  textAlign="left"
                  space="$0"
                >
                  Open in new Window
                </ListItem>
              </Dropdown.Item>
              <Separator />
              <DeleteDialog
                deleteRef={deleteService}
                title="Delete document"
                description="Are you sure you want to delete this document? This action is not reversible."
              >
                <Dropdown.Item
                  data-testid="delete-item"
                  onSelect={(e) => e.preventDefault()}
                  asChild
                >
                  <ListItem
                    icon={Delete}
                    size="$2"
                    hoverTheme
                    pressTheme
                    paddingVertical="$2"
                    paddingHorizontal="$4"
                    textAlign="left"
                    space="$0"
                  >
                    Delete Document
                  </ListItem>
                </Dropdown.Item>
              </DeleteDialog>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </XStack>
    </Button>
  )
}
