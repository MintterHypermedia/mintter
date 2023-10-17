import {useAccountGroups} from '@mintter/app/models/groups'
import {Avatar} from '@mintter/app/components/avatar'
import Footer from '@mintter/app/components/footer'
import {OnlineIndicator} from '@mintter/app/components/indicator'
import {PublicationListItem} from '@mintter/app/components/publication-list-item'
import {copyTextToClipboard} from '@mintter/app/copy-to-clipboard'
import {useAccountPublicationList} from '@mintter/app/models/changes'
import {useAccountWithDevices} from '@mintter/app/models/contacts'
import {toast} from '@mintter/app/toast'
import {useNavRoute} from '@mintter/app/utils/navigation'
import {abbreviateCid, pluralizer} from '@mintter/shared'
import {idToUrl} from '@mintter/shared/src/utils/entity-id-url'
import {
  Button,
  ChevronDown,
  Container,
  ListItem,
  MainWrapper,
  Popover,
  SizableText,
  XStack,
  YGroup,
  YStack,
} from '@mintter/ui'
import {CheckCircle, PlusCircle, XCircle} from '@tamagui/lucide-icons'
import {ReactNode, useState} from 'react'
import {MenuItem} from '../components/dropdown'
import {copyLinkMenuItem} from '../components/list-item'
import {useSetTrusted} from '../models/accounts'
import {getAvatarUrl} from '../utils/account-url'
import {useNavigate} from '../utils/useNavigate'

function DeviceRow({
  isOnline,
  deviceId,
}: {
  isOnline: boolean
  deviceId: string
}) {
  return (
    <YGroup.Item>
      <ListItem
        onPress={() => {
          copyTextToClipboard(deviceId)
          toast.success('Copied Device ID to clipboard')
        }}
      >
        <OnlineIndicator online={isOnline} />
        {abbreviateCid(deviceId)}
      </ListItem>
    </YGroup.Item>
  )
}

function Section({children}: {children: ReactNode}) {
  return (
    <YStack
      borderBottomWidth={1}
      borderBottomColor="black"
      borderColor="$gray6"
      paddingVertical="$4"
      space
    >
      {children}
    </YStack>
  )
}

function AccountDocuments({
  accountId,
  isTrusted,
}: {
  accountId: string
  isTrusted?: boolean
}) {
  const list = useAccountPublicationList(accountId)
  return (
    <Section>
      {list.data?.map((pub) => {
        const docId = pub.document?.id
        if (!docId) return null
        return (
          <PublicationListItem
            pubContext={isTrusted ? {key: 'trusted'} : null}
            key={docId}
            publication={pub}
            hasDraft={undefined}
            menuItems={[
              copyLinkMenuItem(
                idToUrl(docId, undefined, pub.version),
                'Publication',
              ),
            ]}
            openRoute={{
              key: 'publication',
              documentId: pub.document?.id!,
              versionId: pub.version,
              pubContext: isTrusted ? {key: 'trusted'} : null,
            }}
          />
        )
      })}
    </Section>
  )
}

function AccountTrustButton({
  accountId,
  isTrusted,
}: {
  accountId: string
  isTrusted?: boolean
}) {
  const [hovering, setHovering] = useState(false)
  const setTrusted = useSetTrusted()
  if (!isTrusted) {
    return (
      <Button
        size="$2"
        icon={PlusCircle}
        onPress={() => {
          setTrusted.mutate({accountId, isTrusted: true})
        }}
      >
        Trust Account
      </Button>
    )
  }
  return (
    <Button
      size="$2"
      theme={hovering ? 'red' : 'green'}
      icon={hovering ? XCircle : CheckCircle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onPress={() => {
        setTrusted.mutate({accountId, isTrusted: false})
      }}
    >
      {hovering ? 'Untrust Account' : 'Trusted Account'}
    </Button>
  )
}

export default function AccountPage() {
  const route = useNavRoute()
  const nav = useNavigate('push')
  const accountId = route.key === 'account' && route.accountId
  if (!accountId) throw new Error('Invalid route, no account id')
  const account = useAccountWithDevices(accountId)
  const {data: groups} = useAccountGroups(accountId)
  const deviceCount = account.devices.length
  const connectedCount = account.devices?.filter((device) => device.isConnected)
    .length
  const isConnected = !!connectedCount
  return (
    <>
      <MainWrapper>
        <Container>
          <XStack gap="$4" alignItems="center" justifyContent="space-between">
            <XStack gap="$4" alignItems="center">
              <Avatar
                id={accountId}
                size={60}
                label={account.profile?.alias}
                url={getAvatarUrl(account.profile?.avatar)}
              />

              <SizableText
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                size="$5"
                fontWeight="700"
              >
                {account.profile?.alias || 'Untitled Account'}
              </SizableText>
            </XStack>

            <XStack space="$2">
              <Popover placement="bottom-end">
                <Popover.Trigger asChild>
                  <Button
                    icon={<OnlineIndicator online={isConnected} />}
                    iconAfter={ChevronDown}
                    size="$2"
                  >
                    {isConnected ? 'Connected' : 'Offline'}
                  </Button>
                </Popover.Trigger>
                <Popover.Content
                  padding={0}
                  elevation="$2"
                  enterStyle={{y: -10, opacity: 0}}
                  exitStyle={{y: -10, opacity: 0}}
                  elevate
                  animation={[
                    'quick',
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                >
                  <YGroup>
                    <YGroup.Item>
                      <XStack paddingHorizontal="$4">
                        <MenuItem
                          disabled
                          title={pluralizer(account.devices.length, 'Device')}
                          size="$1"
                          fontWeight="700"
                        />
                      </XStack>
                    </YGroup.Item>
                    {account.devices.map((device) => {
                      if (!device) return null
                      return (
                        <DeviceRow
                          key={device.deviceId}
                          isOnline={device.isConnected}
                          deviceId={device.deviceId}
                        />
                      )
                    })}
                  </YGroup>
                </Popover.Content>
              </Popover>
              <AccountTrustButton
                accountId={accountId}
                isTrusted={account.isTrusted}
              />
            </XStack>
          </XStack>
          <Section>
            <SizableText size="$4">{account.profile?.bio}</SizableText>
            {groups?.items.length ? (
              <XStack alignItems="center" space flexWrap="wrap">
                <SizableText size="$2" marginBottom="$2" fontWeight="bold">
                  Groups
                </SizableText>
                {groups.items.map((item) => (
                  <Button
                    size="$2"
                    marginBottom="$2"
                    key={item.group?.id}
                    theme="blue"
                    onPress={() =>
                      item.group
                        ? nav({key: 'group', groupId: item.group.id})
                        : null
                    }
                  >
                    {item.group?.title}
                  </Button>
                ))}
              </XStack>
            ) : null}
          </Section>

          <AccountDocuments
            isTrusted={account.isTrusted}
            accountId={accountId}
          />
        </Container>
      </MainWrapper>
      <Footer />
    </>
  )
}