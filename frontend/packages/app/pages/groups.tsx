import Footer from '@mintter/app/components/footer'
import {Group, HMGroup, Role, unpackHmId} from '@mintter/shared'
import {
  ButtonText,
  Container,
  ExternalLink,
  List,
  Spinner,
  Text,
  XStack,
  YStack,
} from '@mintter/ui'
import {useMemo} from 'react'
import {AccountLinkAvatar} from '../components/account-link-avatar'
import {useCopyGatewayReference} from '../components/copy-gateway-reference'
import {FavoriteButton} from '../components/favoriting'
import {
  ListItem,
  TimeAccessory,
  copyLinkMenuItem,
} from '../components/list-item'
import {MainWrapperNoScroll} from '../components/main-wrapper'
import {useMyAccount} from '../models/accounts'
import {useFavorite} from '../models/favorites'
import {useGatewayUrl} from '../models/gateway-settings'
import {useAccountGroups, useGroupMembers} from '../models/groups'
import {useOpenUrl} from '../open-url'
import {GroupRoute} from '../utils/routes'
import {hostnameStripProtocol} from '../utils/site-hostname'
import {useClickNavigate, useNavigate} from '../utils/useNavigate'

function MemberAvatarLinks({
  ownerAccountId,
  groupMembers,
}: {
  groupMembers: Record<string, Role>
  ownerAccountId: string
}) {
  let totalEditors = useMemo(() => {
    return Object.keys(groupMembers).filter((m) => m != ownerAccountId)
  }, [groupMembers, ownerAccountId])

  let editors =
    totalEditors.length > 3 ? totalEditors.slice(0, 2) : totalEditors

  // let restEditors = totalEditors.length > 3 ? totalEditors.slice(2) : []
  return (
    <XStack>
      <XStack
        borderColor="$background"
        backgroundColor="$background"
        borderWidth={2}
        borderRadius={100}
        marginLeft={-8}
        animation="fast"
      >
        <AccountLinkAvatar accountId={ownerAccountId} />
      </XStack>
      {editors.map((accountId, idx) => {
        return (
          <XStack
            zIndex={idx + 1}
            key={accountId}
            borderColor="$background"
            backgroundColor="$background"
            borderWidth={2}
            borderRadius={100}
            marginLeft={-8}
            animation="fast"
          >
            <AccountLinkAvatar accountId={accountId} />
          </XStack>
        )
      })}
      {totalEditors.length > editors.length ? (
        <XStack
          zIndex={editors.length}
          borderColor="$background"
          backgroundColor="$background"
          borderWidth={2}
          borderRadius={100}
          marginLeft={-8}
          animation="fast"
          width={24}
          height={24}
          ai="center"
          jc="center"
        >
          <Text
            fontSize={10}
            fontFamily="$body"
            fontWeight="bold"
            color="$color10"
          >
            +{totalEditors.length - editors.length - 1}
          </Text>
        </XStack>
      ) : null}
    </XStack>
  )
}

function SiteUrlButton({group}: {group: Group}) {
  const siteBaseUrl = group.siteInfo?.baseUrl
  const openUrl = useOpenUrl()
  if (!siteBaseUrl) return null
  return (
    <ButtonText
      color="$blue10"
      size="$2"
      hoverStyle={{textDecorationLine: 'underline'}}
      fontFamily={'$mono'}
      onPress={(e) => {
        e.stopPropagation()
        openUrl(siteBaseUrl)
      }}
    >
      {hostnameStripProtocol(siteBaseUrl)}
    </ButtonText>
  )
}

export function GroupListItem({
  group,
  onCopy,
}: {
  group: HMGroup
  onCopy: () => void
}) {
  const navigate = useClickNavigate()
  const spawn = useNavigate('spawn')
  const groupMembers = useGroupMembers(group.id)
  const favorite = useFavorite(group.id)
  const groupRoute: GroupRoute = {key: 'group', groupId: group.id}
  const goToItem = (e: any) => {
    navigate(groupRoute, e)
  }
  const gwUrl = useGatewayUrl()

  return (
    <ListItem
      title={group.title}
      accessory={
        <XStack gap="$4" ai="center">
          {group.id && (
            <XStack
              opacity={favorite.isFavorited ? 1 : 0}
              $group-item-hover={
                favorite.isFavorited ? undefined : {opacity: 1}
              }
            >
              <FavoriteButton url={group.id} />
            </XStack>
          )}
          <SiteUrlButton group={group} />
          {groupMembers.data?.members ? (
            <MemberAvatarLinks
              ownerAccountId={group.ownerAccountId}
              groupMembers={groupMembers.data?.members}
            />
          ) : (
            <AccountLinkAvatar accountId={group.ownerAccountId} />
          )}
          <TimeAccessory
            tooltipLabel="Last update:"
            time={group.updateTime}
            onPress={goToItem}
          />
        </XStack>
      }
      onPress={goToItem}
      menuItems={[
        copyLinkMenuItem(onCopy, 'Group'),
        {
          label: 'Open in new Window',
          key: 'spawn',
          icon: ExternalLink,
          onPress: () => {
            spawn(groupRoute)
          },
        },
      ]}
    />
  )
}

export default function GroupsPage() {
  const myAccount = useMyAccount()
  const myGroups = useAccountGroups(myAccount.data?.id)
  const groups = myGroups.data?.items || []
  const [copyDialogContent, onCopyId] = useCopyGatewayReference()
  let content = myGroups.isLoading ? (
    <Container>
      <Spinner />
    </Container>
  ) : groups.length > 0 ? (
    <List
      fixedItemHeight={52}
      items={groups}
      renderItem={({item}) => {
        if (!item.group) return null
        return (
          <GroupListItem
            group={item.group}
            onCopy={() => {
              if (!item.group) return null
              const groupId = unpackHmId(item.group.id)
              if (!groupId) return
              onCopyId(groupId)
            }}
          />
        )
      }}
    />
  ) : (
    <Container>
      <YStack gap="$5" paddingVertical="$8">
        <Text fontFamily="$body" fontSize="$3">
          You have no Groups yet.
        </Text>
      </YStack>
    </Container>
  )
  return (
    <>
      <MainWrapperNoScroll>{content}</MainWrapperNoScroll>
      {copyDialogContent}
      <Footer />
    </>
  )
}
