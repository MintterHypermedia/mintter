import {Timestamp} from '@bufbuild/protobuf'
import {
  API_FILE_URL,
  ActivityEvent,
  PublicationContent,
  UnpackedHypermediaId,
  formattedDateLong,
  hmId,
  unpackHmId,
} from '@mintter/shared'
import {
  ButtonText,
  Globe,
  PageContainer,
  RadioButtons,
  SizableText,
  UIAvatar,
  XStack,
  YStack,
  styled,
  toast,
} from '@mintter/ui'
import {Verified} from '@tamagui/lucide-icons'
import {ReactNode} from 'react'
import Footer from '../components/footer'
import {MainWrapper} from '../components/main-wrapper'
import {useAccount} from '../models/accounts'
import {usePublication} from '../models/documents'
import {useFeed} from '../models/feed'
import {useGroup} from '../models/groups'
import {appRouteOfId, useNavRoute} from '../utils/navigation'
import {useNavigate} from '../utils/useNavigate'
import {AppPublicationContentProvider} from './publication-content-provider'

const feedTabsOptions = [
  {key: 'trusted', label: 'Trusted Content', icon: Verified},
  {key: 'all', label: 'All Content', icon: Globe},
] as const

export default function FeedPage() {
  const route = useNavRoute()
  if (route.key !== 'feed') throw new Error('invalid route')
  const replace = useNavigate('replace')
  return (
    <>
      <MainWrapper>
        <YStack f={1}>
          <PageContainer marginVertical="$6">
            <XStack>
              <RadioButtons
                value={route.tab}
                options={feedTabsOptions}
                onValue={(tab) => {
                  replace({...route, tab})
                }}
              />
            </XStack>
          </PageContainer>
          <Feed tab={route.tab} />
        </YStack>
      </MainWrapper>
      <Footer />
    </>
  )
}

function getEventKey(event: ActivityEvent) {
  if (event.data.case === 'newBlob') {
    return event.data.value.cid
  }
  return 'unknown event type'
}

const FeedItemInnerContainer = styled(YStack, {
  gap: '$2',
  backgroundColor: '$color1',
  padding: '$3',
  borderRadius: '$2',
  overflow: 'hidden',
})

function FeedItemContainer({children}: {children: ReactNode}) {
  return (
    <PageContainer>
      <FeedItemInnerContainer>{children}</FeedItemInnerContainer>
    </PageContainer>
  )
}

type ChangeFeedItemProps = {
  id: UnpackedHypermediaId
  eventTime: Timestamp | undefined
  cid: string
  author: string
}

function EntityLink({
  id,
  children,
}: {
  id: UnpackedHypermediaId
  children: ReactNode
}) {
  const navigate = useNavigate('push')
  return (
    <ButtonText
      fontWeight={'bold'}
      onPress={() => {
        const route = appRouteOfId(id)
        if (route) {
          navigate(route)
        } else {
          toast.error('Failed to resolve a route for this')
        }
      }}
      numberOfLines={1}
      textOverflow="ellipsis" // not working. long titles don't look great
    >
      {children}
    </ButtonText>
  )
}

function FeedItemHeader({
  author,
  eventTime,
  message,
}: {
  author: string
  eventTime?: Timestamp
  message: ReactNode
}) {
  const navigate = useNavigate('push')
  const account = useAccount(author)
  return (
    <XStack gap="$3" ai="center" f={1}>
      <UIAvatar
        id={account.data?.id || ''}
        size={30}
        url={
          account.data?.profile?.avatar &&
          `${API_FILE_URL}/${account.data?.profile?.avatar}`
        }
        label={account.data?.profile?.alias || account.data?.id}
        onPress={() => {
          navigate({key: 'account', accountId: author})
        }}
      />
      <YStack f={1}>
        <SizableText size="$3">
          <EntityLink id={hmId('a', author)}>
            {account.data?.profile?.alias || 'Unknown'}
          </EntityLink>{' '}
          {message}
        </SizableText>
        <SizableText size="$3" color="$color10">
          {formattedDateLong(eventTime)}
        </SizableText>
      </YStack>
    </XStack>
  )
}

function DocChangeFeedItem({id, eventTime, cid, author}: ChangeFeedItemProps) {
  const pub = usePublication({id: id.qid, version: cid})
  return (
    <FeedItemContainer>
      <FeedItemHeader
        author={author}
        eventTime={eventTime}
        message={
          <>
            updated{' '}
            <EntityLink id={hmId('d', id.eid, {version: cid})}>
              {pub.data?.document?.title || 'Untitled Document'}
            </EntityLink>
          </>
        }
      />
      {pub.data && (
        <>
          <AppPublicationContentProvider>
            <PublicationContent publication={pub.data} />
          </AppPublicationContentProvider>
        </>
      )}
    </FeedItemContainer>
  )
}

function GroupChangeFeedItem({
  id,
  eventTime,
  cid,
  author,
}: ChangeFeedItemProps) {
  const group = useGroup(id.qid, cid)
  return (
    <FeedItemContainer>
      <FeedItemHeader
        author={author}
        eventTime={eventTime}
        message={
          <>
            updated{' '}
            <EntityLink id={hmId('g', id.eid, {version: cid})}>
              {group.data?.title || 'Untitled Group'}
            </EntityLink>
          </>
        }
      />
    </FeedItemContainer>
  )
}

function AccountChangeFeedItem({
  id,
  eventTime,
  cid,
  author,
}: ChangeFeedItemProps) {
  return (
    <FeedItemContainer>
      <FeedItemHeader
        author={author}
        eventTime={eventTime}
        message="updated their profile"
      />
    </FeedItemContainer>
  )
}

function ErrorFeedItem({message}: {message: string}) {
  return (
    <FeedItemContainer>
      <SizableText color="$red10" fontWeight="bold">
        Failed to present this feed item.
      </SizableText>
      <SizableText color="$red10">{message}</SizableText>
    </FeedItemContainer>
  )
}

function FeedItem({event}: {event: ActivityEvent}) {
  const {data, eventTime} = event
  if (data.case === 'newBlob') {
    const {cid, author, resource, blobType} = data.value
    let hmId: UnpackedHypermediaId | null = null
    if (resource) {
      hmId = unpackHmId(resource)
    }
    const genericEvent = {id: hmId, eventTime, cid, author}
    if (hmId?.type === 'g' && blobType === 'Change') {
      return <GroupChangeFeedItem {...genericEvent} id={hmId} />
    }
    if (hmId?.type === 'd' && blobType === 'Change') {
      return <DocChangeFeedItem {...genericEvent} id={hmId} />
    }
    if (hmId?.type === 'a' && blobType === 'Change') {
      return <AccountChangeFeedItem {...genericEvent} id={hmId} />
    }
    if (blobType === 'Change') {
      return <ErrorFeedItem message={`Unknown change type for ${hmId?.type}`} />
    }
    return <ErrorFeedItem message={`Unknown blob type: ${blobType}`} />
  }
  return <ErrorFeedItem message={`Unknown event type: ${event.data.case}`} />
}

function Feed({tab}: {tab: 'trusted' | 'all'}) {
  const feed = useFeed(tab === 'trusted')
  console.log(feed.data?.events)
  return (
    <YStack f={1} gap="$3">
      {feed.data?.events.map((event) => (
        <FeedItem key={getEventKey(event)} event={event} />
      ))}
    </YStack>
  )
}
