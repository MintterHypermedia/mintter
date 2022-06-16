import {mainService as defaultMainService} from '@app/app-providers'
import {MINTTER_LINK_PREFIX} from '@app/constants'
import {Dropdown} from '@app/editor/dropdown'
import {CurrentFile, DraftRef, PublicationRef} from '@app/main-machine'
import {css, styled} from '@app/stitches.config'
import {copyTextToClipboard} from '@app/utils/copy-to-clipboard'
import {useBookmarksService} from '@components/bookmarks'
import {Text} from '@components/text'
import {useActor} from '@xstate/react'
import toast from 'react-hot-toast'
import {Box} from './box'
import {Icon} from './icon'

const draggableProps = {
  'data-tauri-drag-region': true,
}

export const TopbarStyled = styled(Box, {
  gridArea: 'topbar',
  width: '$full',
  height: 40,
  display: 'flex',
  borderBottom: '1px solid $colors$base-border-subtle',
  background: '$base-background-subtle',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingHorizontal: '$2',
  gap: '$4',
})

let TopbarButton = styled('button', {
  all: 'unset',
  padding: '$1',
  width: '$8',
  height: '$8',
  borderRadius: '$2',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: '$base-component-bg-hover',
  },
})

export const topbarSection = css({
  height: '$full',
  display: 'flex',
  alignItems: 'center',
})

type TopbarProps = {
  copy?: typeof copyTextToClipboard
  currentFile?: CurrentFile | null
  mainService?: typeof defaultMainService
}

export function Topbar({
  copy = copyTextToClipboard,
  currentFile,
  mainService = defaultMainService,
}: TopbarProps) {
  let [mainState, mainSend] = useActor(mainService)
  function toggleLibrary() {
    mainState.context.library.send('LIBRARY.TOGGLE')
  }

  return (
    <TopbarStyled {...draggableProps}>
      <span style={{display: 'block', flex: 'none', width: 60}} />
      {currentFile ? (
        <FilesData
          copy={copy}
          fileRef={currentFile}
          isPublication={mainState.hasTag('publication')}
        />
      ) : (
        <Text
          size="3"
          fontWeight="medium"
          aria-label="Document Title"
          data-testid="topbar-title"
          {...draggableProps}
          css={{
            flex: 'none',
            '&:hover': {
              cursor: 'default',
            },
          }}
        >
          {mainState.matches('routes.draftList')
            ? 'Drafts'
            : mainState.matches('routes.publicationList')
            ? 'Publications'
            : mainState.matches('routes.home')
            ? 'Publications'
            : ''}
        </Text>
      )}
      <Box css={{flex: 1}} {...draggableProps} />
      <Box
        css={{
          width: 'auto',
          '@bp1': {
            width: '$library-width',
          },
          flex: 'none',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        {...draggableProps}
      >
        <Box
          css={{display: 'flex', paddingHorizontal: '$4'}}
          {...draggableProps}
        >
          <TopbarButton
            color="muted"
            data-testid="history-back"
            onClick={(e) => {
              e.preventDefault()
              mainSend('GO.BACK')
            }}
          >
            <Icon name="ArrowChevronLeft" color="muted" size="2" />
          </TopbarButton>
          <TopbarButton
            color="muted"
            data-testid="history-forward"
            onClick={(e) => {
              e.preventDefault()
              mainSend('GO.FORWARD')
            }}
          >
            <Icon name="ArrowChevronRight" color="muted" size="2" />
          </TopbarButton>
        </Box>

        <TopbarButton
          css={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '$2',
            height: '$full',
          }}
          onClick={toggleLibrary}
          data-tauri-drag-region
        >
          <Text size="2">Local Node</Text>
          <Icon name="Sidenav" size="2" />
        </TopbarButton>
      </Box>
    </TopbarStyled>
  )
}

function FilesData({
  fileRef,
  isPublication = false,
  copy = copyTextToClipboard,
}: {
  copy: typeof copyTextToClipboard
  fileRef: PublicationRef | DraftRef
  isPublication: boolean
}) {
  let bookmarkService = useBookmarksService()
  const [state] = useActor(fileRef)

  async function onCopyReference() {
    if (isPublication) {
      await copy(
        `${MINTTER_LINK_PREFIX}${state.context.publication.document.id}/${state.context.publication.version}`,
      )
      toast.success('Document Reference copied successfully', {
        position: 'top-center',
      })
    }
  }

  function onBookmark() {
    if (isPublication) {
      bookmarkService.send({
        type: 'BOOKMARK.ADD',
        url: `${MINTTER_LINK_PREFIX}${state.context.publication.document.id}/${state.context.publication.version}`,
      })
    }
  }

  return (
    <>
      <Box
        css={{
          // flex: 'none',
          overflow: 'hidden',
          width: '$full',
          maxWidth: 448,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'flex-start',
          gap: '$2',
          '&:hover': {
            cursor: 'default',
          },
        }}
        {...draggableProps}
      >
        <Box
          css={{
            display: 'flex',
            flex: '0 1 1',
            overflow: 'hidden',
            marginRight: '$2',
          }}
          {...draggableProps}
        >
          <Text
            size={{
              '@initial': 2,
              '@bp2': 3,
            }}
            fontWeight="medium"
            aria-label="Document Title"
            data-testid="topbar-title"
            data-tauri-drag-region
            css={{
              flex: 'none',
              '&:hover': {
                cursor: 'default',
              },
            }}
            {...draggableProps}
          >
            {state.context.title.length > 50
              ? `${state.context.title.substring(0, 50)}...`
              : state.context.title || 'Untitled Draft'}
          </Text>
        </Box>
        <Text
          size="1"
          color="muted"
          css={{
            '&:hover': {
              cursor: 'default',
            },
          }}
          {...draggableProps}
        >
          by
        </Text>

        <Text
          size="1"
          color="muted"
          css={{
            textDecoration: 'underline',
            '&:hover': {
              cursor: 'default',
            },
          }}
          data-testid="topbar-author"
          {...draggableProps}
        >
          {state.context?.author?.profile?.alias || 'AUTHOR'}
        </Text>
      </Box>
      {isPublication ? (
        <Box {...draggableProps}>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <TopbarButton>
                <Icon size="1" name="MoreHorizontal" />
              </TopbarButton>
            </Dropdown.Trigger>
            <Dropdown.Content alignOffset={-5} align="end">
              <Dropdown.Item onSelect={onCopyReference}>
                <Icon size="1" name="Copy" />
                Copy Document Reference
              </Dropdown.Item>
              <Dropdown.Item onSelect={onBookmark}>
                <Icon size="1" name="ArrowBottomRight" />
                Add to Bookmarks
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Box>
      ) : null}
    </>
  )
}
