import {
  deleteDraft as defaultDeleteDraft,
  deletePublication as defaultDeletePublication,
} from '@app/client'
import {MINTTER_LINK_PREFIX} from '@app/constants'
import {deleteFileMachine} from '@app/delete-machine'
import {DraftContext} from '@app/draft-machine'
import {Dropdown, ElementDropdown} from '@app/editor/dropdown'
import {findContext} from '@app/editor/find'
import {useMain, useParams} from '@app/main-context'
import {DraftRef, PublicationRef} from '@app/main-machine'
import {PublicationContext} from '@app/publication-machine'
import {css, styled} from '@app/stitches.config'
import {classnames} from '@app/utils/classnames'
import {copyTextToClipboard} from '@app/utils/copy-to-clipboard'
import {formattedDate} from '@app/utils/get-format-date'
import {DeleteDialog} from '@components/delete-dialog'
import {Icon} from '@components/icon'
import {Text} from '@components/text'
import {useActor, useInterpret} from '@xstate/react'
import {PropsWithChildren, useContext, useMemo} from 'react'
import Highlighter from 'react-highlight-words'
import toast from 'react-hot-toast'
import './library-item.scss'

export type LibraryItemProps = {
  fileRef: PublicationRef | DraftRef
  deleteDraft?: typeof defaultDeleteDraft
  deletePublication?: typeof defaultDeletePublication
  copy?: typeof copyTextToClipboard
  isNew: boolean
}

let hoverIconStyle = css({
  color: '$base-text-opposite !important',
})

export function LibraryItem({
  fileRef,
  copy = copyTextToClipboard,
  deleteDraft = defaultDeleteDraft,
  deletePublication = defaultDeletePublication,
  isNew = false,
}: PropsWithChildren<LibraryItemProps>) {
  const [state, send] = useActor(fileRef)
  let params = useParams()
  const mainService = useMain()
  let isPublication = useMemo(() => fileRef.id.startsWith('pub-'), [fileRef.id])

  let match = useMemo(() => {
    if (isPublication) {
      return (
        state.context.documentId == params.docId &&
        state.context.version == params.version
      )
    } else {
      return state.context.documentId == params.docId
    }
  }, [params.docId, params.version, isPublication, state.context])

  const deleteService = useInterpret(
    () =>
      deleteFileMachine.withContext({
        documentId: state.context.documentId,
        version: state.context.version,
        errorMessage: '',
      }),
    {
      services: {
        performDelete: (context) => {
          if (context.version) {
            return deletePublication(context.documentId)
          } else {
            return deleteDraft(context.documentId)
          }
        },
      },
      actions: {
        persistDelete: (context) => {
          mainService.send({
            type: 'COMMIT.DELETE.FILE',
            documentId: context.documentId,
            version: context.version,
          })
        },
      },
    },
  )
  const [deleteState] = useActor(deleteService)

  async function onCopy() {
    if (isPublication) {
      await copy(
        `${MINTTER_LINK_PREFIX}${state.context.documentId}/${state.context.version}`,
      )
      toast.success('Document ID copied successfully', {position: 'top-center'})
    }
  }

  function goToItem() {
    if (match) return

    if (isPublication) {
      mainService.send({
        type: 'GO.TO.PUBLICATION',
        docId: state.context.documentId,
        version: state.context.version as string,
        blockId: '',
      })
    } else {
      mainService.send({type: 'GO.TO.DRAFT', docId: state.context.documentId})
    }
  }

  async function onOpenInNewWindow() {
    mainService.send({
      type: 'COMMIT.OPEN.WINDOW',
      path: isPublication
        ? `/p/${state.context.documentId}/${state.context.version}`
        : `/editor/${state.context.documentId}`,
    })
  }

  let title = state.context.title || 'Untitled Document'

  const {search} = useContext(findContext)
  return (
    <div
      data-testid="library-item"
      className={classnames('list-item', {
        new: isNew,
      })}
      onMouseEnter={() => send('PREFETCH')}
    >
      <span className="item-title" onClick={goToItem}>
        <Highlighter
          highlightClassName="search-highlight"
          className="title"
          searchWords={[search]}
          autoEscape={true}
          textToHighlight={title}
        />
      </span>
      <span className="item-author" onClick={goToItem}>
        {state.context.author?.profile?.alias}
      </span>

      <span className="item-date" onClick={goToItem}>
        {isPublication
          ? formattedDate(
              (state.context as PublicationContext).publication?.document
                ?.updateTime as Date,
            )
          : formattedDate((state.context as DraftContext).draft?.updateTime)}
      </span>
      <span className="item-controls">
        <Dropdown.Root modal={false}>
          <Dropdown.Trigger asChild>
            <ElementDropdown
              data-trigger
              className="dropdown"
              css={{
                backgroundColor: 'transparent',
              }}
            >
              <Icon
                name="MoreHorizontal"
                size="1"
                color="muted"
                className={match ? hoverIconStyle() : ''}
              />
            </ElementDropdown>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content
              align="start"
              data-testid="library-item-dropdown-root"
              hidden={deleteState.matches('open')}
            >
              <Dropdown.Item
                data-testid="copy-item"
                disabled={!isPublication}
                onSelect={onCopy}
              >
                <Icon name="Copy" />
                <Text size="2">Copy Document ID</Text>
              </Dropdown.Item>
              <Dropdown.Item data-testid="mainpanel-item" onSelect={goToItem}>
                <Icon name="ArrowTopRight" />
                <Text size="2">Open in main panel</Text>
              </Dropdown.Item>
              <Dropdown.Item
                data-testid="new-window-item"
                onSelect={onOpenInNewWindow}
              >
                <Icon name="OpenInNewWindow" />
                <Text size="2">Open in new Window</Text>
              </Dropdown.Item>
              <DeleteDialog
                deleteRef={deleteService}
                title="Delete document"
                description="Are you sure you want to delete this document? This action is not reversible."
              >
                <Dropdown.Item
                  data-testid="delete-item"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Icon name="Close" />
                  <Text size="2">Delete Document</Text>
                </Dropdown.Item>
              </DeleteDialog>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </span>
    </div>
  )
}

export var StyledItem = styled(
  'li',
  {
    $$bg: 'transparent',
    $$bgHover: '$colors$base-component-bg-hover',
    $$foreground: '$colors$base-text-high',
    display: 'flex',
    minHeight: 28,
    gap: '1rem',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '$1',
    backgroundColor: '$$bg',
    paddingHorizontal: '$2',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '$$bgHover',
      '.dropdown': {
        opacity: 1,
      },
    },
    '.title': {
      userSelect: 'none',
      letterSpacing: '0.01em',
      lineHeight: '$2',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: '$$foreground',
      flex: 1,
      paddingHorizontal: '$3',
      paddingVertical: '$2',
    },
    '.dropdown': {
      opacity: 0,
    },
  },
  {
    defaultVariants: {
      active: false,
    },
    variants: {
      active: {
        true: {
          $$bg: '$colors$primary-normal',
          $$bgHover: '$colors$primary-active',
          $$foreground: '$colors$primary-text-opposite',
        },
      },
    },
  },
)
