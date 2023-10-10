import {AvatarForm} from '@mintter/app/src/components/avatar-form'
import {TableList} from '@mintter/app/src/components/table-list'
import {useMyAccount, useSetProfile} from '@mintter/app/src/models/accounts'
import {useDaemonInfo} from '@mintter/app/src/models/daemon'
import {usePeerInfo} from '@mintter/app/src/models/networking'
import {useInvoicesBywallet, useWallets} from '@mintter/app/src/models/payments'
import {ObjectKeys} from '@mintter/app/src/utils/object-keys'
import {APP_VERSION, LightningWallet, Profile} from '@mintter/shared'
import {
  Back,
  Button,
  Card,
  CardProps,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Form,
  H3,
  Heading,
  Input,
  Label,
  ScrollView,
  Select,
  Separator,
  SizableText,
  Star,
  Tabs,
  TabsContentProps,
  TextArea,
  Tooltip,
  XGroup,
  XStack,
  YStack,
  Share,
  ArrowDownRight,
  ExternalLink,
  View,
} from '@mintter/ui'
import copyTextToClipboard from 'copy-text-to-clipboard'
import {ComponentProps, ReactNode, useMemo, useState} from 'react'
import toast from 'react-hot-toast'
import {useGRPCClient, useIPC} from '../app-context'
import {getAvatarUrl} from '../utils/account-url'
import {useExportWallet} from '../models/payments'
import {trpc} from '@mintter/desktop/src/trpc'
import {useOpenUrl} from '../open-url'

export default function Settings() {
  return (
    <Tabs
      flex={1}
      defaultValue="account"
      flexDirection="row"
      orientation="vertical"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List
        aria-label="Manage your account"
        separator={<Separator />}
        minWidth={200}
      >
        <Tabs.Tab value="account" data-testid="tab-account" borderRadius={0}>
          <SizableText flex={1} textAlign="left">
            Account
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="settings" data-testid="tab-settings" borderRadius={0}>
          <SizableText flex={1} textAlign="left">
            Settings
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="wallets" data-testid="tab-wallets" borderRadius={0}>
          <SizableText flex={1} textAlign="left">
            Wallets
          </SizableText>

          <SizableText
            size="$0.5"
            fontSize={10}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$1"
            overflow="hidden"
            backgroundColor="$color8"
            color="$color1"
            theme="yellow"
          >
            NEW
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator vertical />
      <TabsContent value="account">
        <ProfileInfo />
        <DevicesInfo />
      </TabsContent>
      <TabsContent value="settings">
        <AppSettings />
      </TabsContent>
      <TabsContent value="wallets">
        <WalletsSettings />
      </TabsContent>
    </Tabs>
  )
}

export function ProfileForm({
  profile,
  accountId,
}: {
  profile: Profile
  accountId: string
}) {
  const setProfile = useSetProfile()
  const [alias, setAlias] = useState(profile.alias)
  const [bio, setBio] = useState(profile.bio)
  function onCopy() {
    copyTextToClipboard(accountId)
    toast.success('Account ID copied!')
  }

  return (
    <XStack gap="$4">
      <YStack flex={0} alignItems="center" flexGrow={0}>
        <AvatarForm
          onAvatarUpload={async (avatar) => {
            await setProfile.mutateAsync({...profile, avatar})
            toast.success('Avatar changed')
          }}
          url={getAvatarUrl(profile?.avatar)}
        />
      </YStack>
      <YStack flex={1}>
        <YStack>
          <Label size="$3" htmlFor="accountid">
            Account Id
          </Label>
          <XGroup>
            <XGroup.Item>
              <Input
                size="$3"
                id="accountid"
                userSelect="none"
                disabled
                value={accountId}
                data-testid="account-id"
                flex={1}
                hoverStyle={{
                  cursor: 'default',
                }}
              />
            </XGroup.Item>
            <XGroup.Item>
              <Tooltip content="Copy your account id">
                <Button size="$3" icon={Copy} onPress={onCopy} />
              </Tooltip>
            </XGroup.Item>
          </XGroup>
        </YStack>
        <Form
          onSubmit={() => {
            setProfile.mutate({alias, bio})
          }}
        >
          <Label htmlFor="alias">Alias</Label>
          <Input id="alias" value={alias} onChangeText={setAlias} />
          <Label htmlFor="bio">Bio</Label>
          <TextArea
            id="bio"
            value={bio}
            onChangeText={setBio}
            placeholder="A little bit about yourself..."
          />

          <XStack gap="$4" alignItems="center" paddingTop="$3">
            <Form.Trigger asChild>
              <Button disabled={setProfile.isLoading}>Save</Button>
            </Form.Trigger>
            {setProfile.data && (
              <SizableText theme="green">update success!</SizableText>
            )}
          </XStack>
        </Form>
      </YStack>
    </XStack>
  )
}

export function ProfileInfo() {
  const account = useMyAccount()
  const profile = account.data?.profile
  const accountId = account.data?.id

  if (profile && accountId) {
    return (
      <>
        <Heading>Profile information</Heading>
        <ProfileForm profile={profile} accountId={accountId} />
      </>
    )
  }

  return null
}

function DevicesInfo({}: {}) {
  const account = useMyAccount()
  const devices = account.data?.devices
  return (
    <YStack data-testid="account-device-list" gap="$3">
      <Heading>Devices</Heading>
      {devices && ObjectKeys(devices).length
        ? Object.keys(devices).map((deviceId) => (
            <DeviceItem key={deviceId} id={deviceId} />
          ))
        : null}
    </YStack>
  )
}

function InfoListHeader({title, right}: {title: string; right?: ReactNode}) {
  return (
    <TableList.Header>
      <SizableText fontWeight="700">{title}</SizableText>
      <XStack flex={1} alignItems="center" justifyContent="flex-end">
        {right}
      </XStack>
    </TableList.Header>
  )
}

function InfoListItem({
  label,
  value,
  copyable,
  openable,
}: {
  label: string
  value?: string | string[]
  copyable?: boolean
  openable?: boolean
}) {
  const openUrl = useOpenUrl()
  const values = Array.isArray(value) ? value : [value]
  return (
    <TableList.Item>
      <SizableText size="$1" flex={0} minWidth={140} width={140}>
        {label}:
      </SizableText>
      <YStack flex={1}>
        {values.map((value, index) => (
          <SizableText
            flex={1}
            key={index}
            fontFamily="$mono"
            size="$1"
            width="100%"
            overflow="hidden"
            textOverflow="ellipsis"
            userSelect="text"
          >
            {value}
          </SizableText>
        ))}
      </YStack>
      {!!value && copyable ? (
        <Tooltip content={`Copy ${label}`}>
          <Button
            size="$2"
            marginLeft="$2"
            icon={Copy}
            onPress={() => {
              copyTextToClipboard(value)
              toast.success(`${label} copied!`)
            }}
          />
        </Tooltip>
      ) : null}
      {!!value && openable ? (
        <Tooltip content={`Open ${label}`}>
          <Button
            size="$2"
            marginLeft="$2"
            icon={ExternalLink}
            onPress={() => {
              openUrl(`file://${value}`)
            }}
          />
        </Tooltip>
      ) : null}
    </TableList.Item>
  )
}

function DeviceItem({id}: {id: string}) {
  let {status, data} = usePeerInfo(id)
  let {data: current} = useDaemonInfo()

  let isCurrent = useMemo(() => {
    if (!current?.deviceId) return false

    return current.deviceId == id
  }, [id, current])

  return (
    <TableList>
      <InfoListHeader
        title={id.substring(id.length - 10)}
        right={
          isCurrent && (
            <Button size="$1" fontWeight="700" disabled>
              current device
            </Button>
          )
        }
      />
      <InfoListItem
        label="Alias"
        value={status == 'success' ? id.substring(id.length - 10) : '...'}
      />

      <Separator />

      <InfoListItem label="Peer ID" value={id} copyable />

      <Separator />

      <InfoListItem
        label="Device Address"
        value={data?.addrs.join(',')}
        copyable
      />
    </TableList>
  )
}

function AppSettings() {
  const grpcClient = useGRPCClient()
  const ipc = useIPC()
  const versions = useMemo(() => ipc.versions(), [ipc])
  const appInfo = trpc.getAppInfo.useQuery().data
  const daemonInfo = trpc.getDaemonInfo.useQuery().data
  return (
    <YStack gap="$5">
      <Heading>Application Settings</Heading>
      <TableList>
        <InfoListHeader title="User Data" />
        <InfoListItem
          label="Data Directory"
          value={appInfo?.dataDir}
          copyable
          openable
        />
        <Separator />
        <InfoListItem
          label="Log File"
          value={appInfo?.logFilePath}
          copyable
          openable
        />
      </TableList>
      <TableList>
        <InfoListHeader
          title="Bundle Information"
          right={
            <Tooltip content="Copy App Info for Developers">
              <Button
                size="$2"
                icon={Copy}
                onPress={() => {
                  copyTextToClipboard(`App Version: ${APP_VERSION}
Electron Version: ${versions.electron}
Chrome Version: ${versions.chrome}
Node Version: ${versions.node}
Go Build Info:
    ${daemonInfo?.replace(/\n/g, '\n    ')}`)
                }}
              >
                Copy Debug Info
              </Button>
            </Tooltip>
          }
        />
        <InfoListItem label="App Version" value={APP_VERSION} />
        <Separator />
        <InfoListItem label="Electron Version" value={versions.electron} />
        <Separator />
        <InfoListItem label="Chrome Version" value={versions.chrome} />
        <Separator />
        <InfoListItem label="Node Version" value={versions.node} />
        <Separator />
        <InfoListItem label="Go Build Info" value={daemonInfo?.split('\n')} />
      </TableList>
    </YStack>
  )
}

function SettingsNavBack({
  onDone,
  title,
  icon,
}: {
  onDone: () => void
  title: string
  icon?: ComponentProps<typeof Button>['icon']
}) {
  return (
    <Button size="$2" onPress={onDone} icon={icon || Back}>
      {title}
    </Button>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      gap="$3"
      flex={1}
      {...props}
    >
      <ScrollView>
        <YStack gap="$4" padding="$4" paddingBottom="$7">
          {props.children}
        </YStack>
      </ScrollView>
    </Tabs.Content>
  )
}

function WalletsSettings() {
  const {data: wallets} = useWallets()
  const [wallet, setWallet] = useState<string | undefined>(undefined)
  const {data: invoices} = useInvoicesBywallet(wallet)

  return (
    <YStack gap="$5">
      <Heading>Wallets</Heading>
      <ScrollView horizontal>
        <XStack gap="$6" overflow="visible">
          {wallets?.map((cw) => (
            <WalletCard
              key={cw.id}
              wallet={cw}
              active={wallet && wallet == cw.id ? true : false}
            />
          ))}
        </XStack>
      </ScrollView>
      <Separator />
      <TableList>
        <TableList.Header paddingRight="$2">
          <SizableText fontWeight="700">Invoices</SizableText>
          <XStack flex={1} alignItems="center" justifyContent="flex-end">
            {wallets?.length && (
              <Select
                size="$3"
                id="wallet-payments"
                value={wallet}
                onValueChange={setWallet}
              >
                <Select.Trigger width={280} iconAfter={ChevronDown}>
                  <Select.Value placeholder="Wallet" />
                </Select.Trigger>
                <Select.Content zIndex={200000}>
                  <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                  >
                    <YStack zIndex={10}>
                      <ChevronUp size={20} />
                    </YStack>
                    {/* <LinearGradient
                        start={[0, 0]}
                        end={[0, 1]}
                        fullscreen
                        colors={['$background', '$backgroundTransparent']}
                        borderRadius="$4"
                      /> */}
                  </Select.ScrollUpButton>
                  <Select.Viewport minWidth={280}>
                    {wallets?.map((wallet, i) => (
                      <Select.Item index={i} key={wallet.id} value={wallet.id}>
                        <Select.ItemText>
                          <SizableText size="$2">{wallet.name}</SizableText>{' '}
                          <SizableText size="$2">
                            ({wallet.balanceSats} sats)
                          </SizableText>
                        </Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select>
            )}
          </XStack>
        </TableList.Header>
        {invoices?.received?.map((invoice) => (
          <>
            <Separator />
            <TableList.Item>
              <XStack gap="$4" alignItems="center" flex={1}>
                <ArrowDownRight color="$color10" size={24} />
                <SizableText
                  size="$3"
                  flex={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {invoice?.PaymentHash}
                </SizableText>
                <SizableText size="$1" flex={1} fontWeight="600">
                  {invoice?.IsPaid ? 'PAID' : 'NOT PAID'}
                </SizableText>
                <SizableText
                  size="$2"
                  fontWeight="700"
                  flex={0}
                  flexShrink={0}
                  color="$blue8"
                >
                  {invoice?.Amount ? `${invoice.Amount} sats` : 'No amount'}
                </SizableText>
              </XStack>
            </TableList.Item>
          </>
        ))}
      </TableList>
    </YStack>
  )
}

function WalletCard({
  wallet,
  active = false,
  ...props
}: CardProps & {wallet: LightningWallet; active?: boolean}) {
  const mutation = useExportWallet()

  async function handleExport() {
    try {
      let res = await mutation.mutateAsync({id: wallet.id})
      if (!res) {
        toast.error('Error: ExportWallet error')
        console.error('Error: ExportWallet error')
      } else {
        copyTextToClipboard(res.credentials)
        toast.success('Wallet Exported and copied to your clipboard', {
          duration: 5000,
        })
      }
    } catch (error) {
      toast.error(`Error: ExportWallet error: ${JSON.stringify(error)}`)
      console.error('Error: ExportWallet error', error)
    }
  }

  return (
    <Card
      animation="bouncy"
      size="$4"
      theme="green"
      width={260}
      // height={120}
      scale={0.975}
      hoverStyle={{scale: 1}}
      pressStyle={{scale: 0.95}}
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      elevation="$2"
      {...props}
    >
      <Card.Header>
        <XStack>
          <YStack flex={1}>
            <SizableText color="$color10">{wallet.name}</SizableText>
            <H3 color="$color12">{wallet.balanceSats} sats</H3>
          </YStack>
          {/* <Tooltip content="default wallet">
            <Button
              size="$3"
              chromeless
              icon={
                <Star color={wallet.isDefault ? 'yellow' : 'transparent'} />
              }
              scaleIcon={2}
              padding="$1"
            />
          </Tooltip> */}
        </XStack>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button
          disabled={mutation.isLoading}
          size="$2"
          onPress={handleExport}
          icon={<Share />}
        >
          Export
        </Button>
      </Card.Footer>
    </Card>
  )
}
