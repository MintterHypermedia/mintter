import type {Document, Publication} from '@mintter/client'
import {useAccount} from '@mintter/client/hooks'
import {Box} from '@mintter/ui/box'
import {Alert} from '@mintter/ui/dialog'
import {styled} from '@mintter/ui/stitches.config'
import {Text} from '@mintter/ui/text'
import {useMachine} from '@xstate/react'
import {useMemo} from 'react'
import {toast} from 'react-hot-toast'
import {useQueryClient} from 'react-query'
import {useLocation} from 'react-router-dom'
import {Avatar} from './components/avatar'
import {Link} from './components/link'
import {deleteConfirmationDialogMachine} from './delete-confirmation-dialog'
import {getDateFormat} from './utils/get-format-date'

type ListItemType = {document: Document} & Partial<Publication>

export type DocumentListData = Array<ListItemType>

type DocumentListProps = {
  data: DocumentListData
}

export function DocumentList({data}: DocumentListProps) {
  const location = useLocation()
  const isDraft = useMemo(() => location.pathname.includes('drafts'), [location.pathname])
  const toPrefix = useMemo(() => (isDraft ? '/editor' : '/p'), [isDraft])

  return (
    <Box as="ul" css={{padding: 0}}>
      {data.map((item) => (
        <ListItem key={item.document?.id} isDraft={isDraft} item={item} toPrefix={toPrefix} />
      ))}
    </Box>
  )
}

const StyledLink = styled(Link, {
  $$spacing: '$space$5',
  padding: '$$spacing',
  borderRadius: '$2',
  display: 'flex',
  marginHorizontal: '-$$spacing',
  gap: '$5',
  textDecoration: 'none',
  transition: 'background 0.25s ease-in-out',
  '&:hover': {
    backgroundColor: '$background-muted',
  },
})
export type ListItemProps = {
  item: ListItemType
  toPrefix: string
  isDraft: boolean
}

function ListItem({item, toPrefix, isDraft}: ListItemProps) {
  const queryClient = useQueryClient()
  const [state, send] = useMachine(
    deleteConfirmationDialogMachine({
      onSuccess: () => {
        toast.success(`${isDraft ? 'Draft' : 'Publication'} deleted successfully`)
        queryClient.invalidateQueries(isDraft ? 'DraftList' : 'PublicationList')
      },
    }),
  )

  let {id, title, subtitle, author: itemAuthor} = item.document

  const {data: author} = useAccount(itemAuthor, {
    enabled: !!itemAuthor,
  })
  title ||= 'Untitled Document'

  return (
    <Box as="li" css={{position: 'relative', listStyle: 'none'}}>
      <StyledLink to={`${toPrefix}/${id}`}>
        <Box
          css={{
            flex: 'none',
            background: '$primary-muted',
            width: 220,
            height: 140,
            display: 'none',
            '@initial': {
              display: 'none',
            },
          }}
        />
        <Box
          css={{
            flex: 1,
            display: 'grid',
            gridTemplateAreas: isDraft
              ? `"content content price"
            "footer footer action"`
              : `"avatar author price"
        "content content action"
        "footer footer footer"`,
            gridTemplateColumns: isDraft ? '1fr auto' : '24px 1fr auto',
            gridTemplateRows: isDraft ? 'auto' : '24px auto auto',
            gap: '$3',
          }}
        >
          {!isDraft && location.pathname != '/library/my-publications' && (
            <>
              <Avatar css={{gridArea: 'avatar'}} />
              <Text size="1" css={{gridArea: 'author', alignSelf: 'center'}}>
                {author?.profile?.alias}
              </Text>
            </>
          )}
          <Box css={{gridArea: 'price'}}>
            <Text
              size="1"
              css={{
                background: '$background-contrast-strong',
                paddingVertical: '$2',
                paddingHorizontal: '$3',
                borderRadius: '$1',
                display: 'inline-block',
              }}
              color="opposite"
            >
              0.09$
            </Text>
          </Box>
          <Box css={{gridArea: 'content', display: 'flex', flexDirection: 'column', gap: '$3'}}>
            <Text
              size="7"
              color="default"
              css={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text size="5" color="muted">
                {subtitle}
              </Text>
            )}
          </Box>
          <Box css={{gridArea: 'footer'}}>
            <Text size="1" color="muted">
              {getDateFormat(item.document, 'createTime')}
            </Text>
          </Box>

          <Box
            css={{
              gridArea: 'action',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Alert.Root
              id={item.document.id}
              open={state.matches('open')}
              onOpenChange={(value: boolean) =>
                value ? send({type: 'OPEN_DIALOG', payload: {entryId: item.document.id, isDraft}}) : send('CANCEL')
              }
            >
              <Alert.Trigger
                data-testid="delete-button"
                size="1"
                color="danger"
                onClick={(e) => {
                  e.preventDefault()
                  send({type: 'OPEN_DIALOG', payload: {entryId: item.document.id, isDraft}})
                }}
              >
                trash
              </Alert.Trigger>
              <Alert.Content onClick={(e) => e.stopPropagation()}>
                <Alert.Title color="danger">Delete document</Alert.Title>
                <Alert.Description>
                  Are you sure you want to delete this document? This action is not reversible.
                </Alert.Description>
                <Alert.Actions>
                  <Alert.Cancel>Cancel</Alert.Cancel>
                  <Alert.Action
                    color="danger"
                    onClick={() => {
                      send('CONFIRM')
                    }}
                  >
                    Delete
                  </Alert.Action>
                </Alert.Actions>
              </Alert.Content>
            </Alert.Root>
          </Box>
        </Box>
      </StyledLink>
    </Box>
  )
}
