import {accountsClient, daemonClient} from '@app/api-clients'
import {createAuthService} from '@app/auth-machine'
import {Box} from '@app/components/box'
import {Text} from '@app/components/text'
import {TextField} from '@app/components/text-field'
import {useAccount} from '@app/hooks/accounts'
import {useDaemonInfo} from '@app/hooks/daemon'
import {usePeerInfo} from '@app/hooks/networking'
import {
  useAddSite,
  useInviteMember,
  useRemoveMember,
  useRemoveSite,
  useSiteInfo,
  useSiteList,
  useSiteMembers,
  useWriteSiteInfo,
} from '@app/hooks/sites'
import {TableList} from '@app/table-list'
import {ObjectKeys} from '@app/utils/object-keys'
import {hostnameStripProtocol} from '@app/utils/site-hostname'
import {Avatar} from '@components/avatar'
import {AccessURLRow} from '@components/url'
import {
  Member,
  Member_Role,
  Profile,
  SiteConfig,
  SiteInfo,
} from '@mintter/shared'
import {
  Add,
  Back,
  Button,
  Camera,
  Circle,
  Close,
  Copy,
  Dialog,
  Form,
  Forward,
  Heading,
  Input,
  Label,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  TabsContentProps,
  TextArea,
  Tooltip,
  UIAvatar,
  XGroup,
  XStack,
  YStack,
} from '@mintter/ui'
import {styled} from '@stitches/react'
import {useQueryClient} from '@tanstack/react-query'
import {useActor, useInterpret, useSelector} from '@xstate/react'
import copyTextToClipboard from 'copy-text-to-clipboard'
import {useEffect, useMemo, useRef, useState, ChangeEvent} from 'react'
import toast from 'react-hot-toast'
import {InterpreterFrom} from 'xstate'

export default function Settings({
  updateProfile = accountsClient.updateProfile,
}: {
  updateProfile?: typeof accountsClient.updateProfile
}) {
  const client = useQueryClient()
  const auth = useInterpret(() => createAuthService(client))

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
        disablePassBorderRadius="end"
        aria-label="Manage your account"
        separator={<Separator />}
        minWidth={200}
      >
        <Tabs.Tab value="account" data-testid="tab-account">
          <SizableText flex={1} textAlign="left">
            Account
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="settings" data-testid="tab-settings">
          <SizableText flex={1} textAlign="left">
            Settings
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="sites" data-testid="tab-sites">
          <SizableText flex={1} textAlign="left">
            Web Sites
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator vertical />
      <TabsContent value="account">
        <ProfileForm service={auth} updateProfile={updateProfile} />
        <DevicesInfo service={auth} />
      </TabsContent>
      <TabsContent value="settings" data-tauri-drag-region>
        <AppSettings />
      </TabsContent>
      <TabsContent value="sites" data-tauri-drag-region>
        <SitesSettings auth={auth} />
      </TabsContent>
    </Tabs>
  )
}

type SettingsTabProps = {
  service: InterpreterFrom<ReturnType<typeof createAuthService>>
  updateProfile?: typeof accountsClient.updateProfile
}

const __AVATAR__ = '__AVATAR__'

export function ProfileForm({service, updateProfile}: SettingsTabProps) {
  let [state, send] = useActor(service)
  let [alias, setAlias] = useState('')
  let [realBio, setRealBio] = useState('')
  let [visibleBio, setVisibleBio] = useState('')
  let [avatar, setAvatar] = useState('')

  async function onSubmit() {
    let newBio = avatar ? `${visibleBio}${__AVATAR__}${avatar}` : visibleBio
    let profile = new Profile({alias, bio: newBio})
    send({type: 'ACCOUNT.UPDATE.PROFILE', profile})
  }

  let isPending = useSelector(service, (state) =>
    state.matches('loggedIn.updating'),
  )
  let onSuccess = useSelector(service, (state) =>
    state.matches('loggedIn.onSuccess'),
  )

  function onCopy() {
    if (state.context?.account?.id) {
      copyTextToClipboard(state.context.account.id)
      toast.success('Account ID copied!')
    }
  }

  function handleAvatarPersist(cid: string) {
    let newBio = (visibleBio += `${__AVATAR__}${cid}`)
    let profile = new Profile({alias, bio: newBio})
    setAvatar(cid)
    send({type: 'ACCOUNT.UPDATE.PROFILE', profile})
  }

  useEffect(() => {
    if (state.context.account?.profile && state.matches('loggedIn')) {
      setRealBio(state.context.account?.profile?.bio)
      setAlias(state.context.account?.profile?.alias)
    }
  }, [state.context])

  useEffect(() => {
    if (!realBio) return
    let [bio, avatar] = realBio.split(__AVATAR__)

    setAvatar(avatar)
    setVisibleBio(bio)
  }, [realBio])

  if (state.context.account?.profile && state.matches('loggedIn')) {
    return (
      <>
        <Heading>Profile information</Heading>

        <XStack gap="$4">
          <YStack flex={0} alignItems="center" flexGrow={0}>
            <AvatarForm
              service={service}
              onUploadSuccess={handleAvatarPersist}
              url={avatar ? `http://localhost:55001/ipfs/${avatar}` : undefined}
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
                    value={state.context.account.id}
                    data-testid="account-id"
                    flex={1}
                    hoverStyle={{
                      cursor: 'default',
                    }}
                  />
                </XGroup.Item>
                <XGroup.Item>
                  <Tooltip placement="top-end">
                    <Tooltip.Trigger>
                      <Button size="$3" icon={Copy} onPress={onCopy} />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      margin={0}
                      padding={0}
                      paddingHorizontal="$2"
                      theme="inverse"
                    >
                      <Tooltip.Arrow />
                      <SizableText margin={0} padding={0} size="$1">
                        Copy your account id
                      </SizableText>
                    </Tooltip.Content>
                  </Tooltip>
                </XGroup.Item>
              </XGroup>
            </YStack>
            <Form onSubmit={() => onSubmit()}>
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                defaultValue={alias}
                onChangeText={(val) => setAlias(val)}
                data-testid="input-alias"
              />
              <Label htmlFor="bio">Bio</Label>
              <TextArea
                defaultValue={visibleBio}
                onChangeText={(val) => setVisibleBio(val)}
                id="bio"
                placeholder="A little bit about yourself..."
              />

              <XStack gap="$4" alignItems="center" paddingTop="$3">
                <Form.Trigger asChild>
                  <Button disabled={isPending}>Save</Button>
                </Form.Trigger>
                {onSuccess && (
                  <Text size="3" color="success">
                    update success!
                  </Text>
                )}
              </XStack>
            </Form>
          </YStack>
        </XStack>
      </>
    )
  }

  return null
}

function AvatarForm({
  service,
  onUploadSuccess,
  url,
}: {
  service: InterpreterFrom<ReturnType<typeof createAuthService>>
  onUploadSuccess?: (cid: string) => void
  url?: string
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const alias = useSelector(
    service,
    (state) => state.context.account?.profile?.alias || '',
  )
  const accountId = useSelector(
    service,
    (state) => state.context.account?.id || '',
  )
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      setSelectedFile(fileList[0])
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      try {
        const response = await fetch(
          'http://localhost:55001/ipfs/file-upload',
          {
            method: 'POST',
            body: formData,
          },
        )
        const data = await response.text()
        onUploadSuccess?.(data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Dialog modal>
      <Avatar
        alias={alias}
        accountId={accountId}
        size="$12"
        url={url}
        color="$blue12"
      />
      <Dialog.Trigger asChild>
        <Button
          size="$12"
          userSelect="auto"
          backgrounded
          circular
          icon={Camera}
          {...{
            opacity: 0,
            position: 'absolute',
            zIndex: 100,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          hoverTheme
          hoverStyle={{
            opacity: 0.6,
          }}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          backgroundColor="$background"
          animation="quick"
          opacity={0.5}
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />
        <Dialog.Content
          backgroundColor="$blue12"
          theme="blue"
          bordered
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
          exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
          space
        >
          <Dialog.Title>Upload Avatar</Dialog.Title>
          <input type="file" onChange={handleFileChange} />
          <Dialog.Close asChild>
            <Button onPress={handleUpload}>Send</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

function DevicesInfo({
  service,
}: {
  service: InterpreterFrom<ReturnType<typeof createAuthService>>
}) {
  const devices = useSelector(
    service,
    (state) => state.context.account?.devices || {},
  )

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

function DeviceItem({id}: {id: string}) {
  let {status, data} = usePeerInfo(id)
  let {data: current} = useDaemonInfo()

  let isCurrent = useMemo(() => {
    if (!current?.deviceId) return false

    return current.deviceId == id
  }, [id, current])

  return (
    <TableList>
      <TableList.Header>
        <SizableText fontWeight="700">
          {id.substring(id.length - 10)}
        </SizableText>
        <XStack flex={1} alignItems="center" justifyContent="flex-end">
          {isCurrent && (
            <Button size="$1" fontWeight="700" disabled>
              current device
            </Button>
          )}
        </XStack>
      </TableList.Header>
      <TableList.Item>
        <SizableText size="$1" flex={0} width={80}>
          Alias:
        </SizableText>
        <SizableText
          size="$1"
          flex={1}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {status == 'success' ? id.substring(id.length - 10) : '...'}
        </SizableText>
      </TableList.Item>

      <Separator />
      <TableList.Item>
        <SizableText size="$1" flex={0} width={80} flexShrink={0} flexGrow={0}>
          Id:
        </SizableText>
        <SizableText
          size="$1"
          flex={1}
          overflow="hidden"
          textOverflow="ellipsis"
          userSelect="text"
        >
          {id}
        </SizableText>
      </TableList.Item>

      <Separator />
      <TableList.Item>
        <SizableText size="$1" flex={0} width={80} flexShrink={0} flexGrow={0}>
          Addresses:
        </SizableText>
        <YStack flex={1} position="relative">
          <SizableText
            size="$1"
            width="100%"
            overflow="hidden"
            textOverflow="ellipsis"
            userSelect="text"
          >
            {status == 'success' ? data?.addrs.join(',') : '...'}
          </SizableText>
        </YStack>
      </TableList.Item>
    </TableList>
  )
}

function AppSettings() {
  async function onReloadSync() {
    await daemonClient.forceSync({})
    toast.success('reload sync successful!')
  }

  return (
    <YStack gap="$5">
      <Heading>Application Settings</Heading>
      <TableList>
        <TableList.Header>
          <SizableText fontWeight="700">Bundle Information</SizableText>
        </TableList.Header>
        <TableList.Item>
          <SizableText
            size="$1"
            flex={0}
            width={80}
            flexShrink={0}
            flexGrow={0}
          >
            Version:
          </SizableText>
          <SizableText
            size="$1"
            flex={1}
            overflow="hidden"
            textOverflow="ellipsis"
            userSelect="text"
          >
            VERSION_HERE
          </SizableText>
        </TableList.Item>
        <Separator />

        <TableList.Item>
          <SizableText
            size="$1"
            flex={0}
            width={80}
            flexShrink={0}
            flexGrow={0}
          >
            other
          </SizableText>
          <YStack flex={1} position="relative">
            <SizableText
              size="$1"
              width="100%"
              overflow="hidden"
              textOverflow="ellipsis"
              userSelect="text"
            >
              other data
            </SizableText>
          </YStack>
        </TableList.Item>
      </TableList>
      <Separator />
      <YStack>
        <Button onPress={onReloadSync}>Reload Database</Button>
      </YStack>
    </YStack>
  )
}

function SettingsNavBack({onDone, title}: {onDone: () => void; title: string}) {
  return (
    <Button size="$1" chromeless onPress={onDone} icon={Back}>
      {title}
    </Button>
  )
}
function InviteMemberDialog({url, onDone}: {url: string; onDone: () => void}) {
  return (
    <YStack gap="$3">
      <SizableText>Copy and send this secret editor invite URL</SizableText>
      {url && <AccessURLRow url={url} title={url} enableLink={false} />}
      <Button onPress={onDone}>Done</Button>
    </YStack>
  )
}
export function useInviteDialog(hostname: string) {
  const [isOpen, setIsOpen] = useState<null | string>(null)
  const invite = useInviteMember(hostname)

  function open() {
    invite.mutateAsync().then((inviteToken) => {
      setIsOpen(`${hostname}/invite/${inviteToken}`)
    })
  }
  return {
    content: (
      <Dialog open={!!isOpen} onOpenChange={() => setIsOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay
            animation="quick"
            opacity={0.5}
            enterStyle={{opacity: 0}}
            exitStyle={{opacity: 0}}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
            exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
            space
          >
            <Dialog.Title>Invite Code</Dialog.Title>
            {isOpen && (
              <InviteMemberDialog url={isOpen} onDone={() => setIsOpen(null)} />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    ),
    open,
  }
}

function getNameOfRole(role: Member_Role): string {
  if (role === Member_Role.OWNER) return 'Owner'
  if (role === Member_Role.EDITOR) return 'Editor'
  return 'Unauthorized'
}

function SiteMemberRow({
  member,
  hostname,
  isOwner,
}: {
  member: Member
  hostname: string
  isOwner: boolean
}) {
  const {data: account} = useAccount(member.accountId)
  const remove = useRemoveMember(hostname)
  const [hovering, setHover] = useState(false)

  let hoverProps = useMemo(() => {
    if (!isOwner && member.accountId == account?.id) return {}

    return {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    }
  }, [member.accountId, isOwner, account])

  return (
    <TableList.Item
      {...hoverProps}
      // onPressIn={() => setHover(true)}
      // onPressOut={() => setHover(false)}
    >
      <SizableText flex={1}>
        {account?.profile?.alias ||
          `...${member.accountId.substring(member.accountId.length - 16)}`}
      </SizableText>
      {member.role === Member_Role.OWNER && (
        <Button size="$1" disabled>
          owner
        </Button>
      )}
      {hovering && isOwner && member.accountId !== account?.id ? (
        <Button
          theme="red"
          size="$1"
          onPress={() => {
            remove.mutate(member.accountId)
          }}
        >
          Remove
        </Button>
      ) : null}
    </TableList.Item>
  )
}
function SiteMembers({
  hostname,
  accountId,
  isOwner,
}: {
  hostname: string
  accountId: string
  isOwner: boolean
}) {
  const {content, open} = useInviteDialog(hostname)

  const {data: members} = useSiteMembers(hostname)

  return (
    <TableList>
      <TableList.Header>
        <SizableText flex={1} fontWeight="700">
          Members
        </SizableText>
        {isOwner ? (
          <Button size="$2" onPress={open} icon={Add}>
            Invite Editor
          </Button>
        ) : null}
        {content}
      </TableList.Header>
      {members?.map((member) => (
        <SiteMemberRow
          key={member.accountId}
          member={member}
          isOwner={isOwner}
          hostname={hostname}
        />
      ))}
    </TableList>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <YStack gap="$3">
      <Heading>{title}</Heading>
      {children}
    </YStack>
  )
}

function SiteInfoForm({
  info,
  onSubmit,
  isOwner,
}: {
  info: SiteInfo
  onSubmit: (s: Partial<SiteInfo>) => void
  isOwner: boolean
}) {
  const [title, setTitle] = useState(info.title)
  const [description, setDescription] = useState(info.description)
  return (
    <YStack gap="$3">
      <YStack>
        <Label htmlFor="site-title">title</Label>
        <Input
          id="site-title"
          value={title}
          disabled={!isOwner}
          onChangeText={isOwner ? (val) => setTitle(val) : undefined}
        />
      </YStack>
      <YStack>
        <Label htmlFor="site-description">Description</Label>
        <TextArea
          id="site-title"
          value={description}
          disabled={!isOwner}
          onChangeText={isOwner ? (val) => setDescription(val) : undefined}
        />
      </YStack>
      {isOwner ? (
        <Button
          size="$2"
          onPress={() => {
            onSubmit({title, description})
          }}
        >
          Save
        </Button>
      ) : null}
    </YStack>
  )
}

function SiteSettings({
  hostname,
  onDone,
  accountId,
}: {
  hostname: string
  onDone: () => void
  accountId: string
}) {
  const {data: members, isLoading} = useSiteMembers(hostname)
  const isOwner = useMemo(
    () =>
      !!members?.find(
        (member) =>
          member.accountId === accountId && member.role === Member_Role.OWNER,
      ),
    [members, accountId],
  )

  const removeSite = useRemoveSite(hostname, {
    onSuccess: () => onDone(),
  })

  return (
    <>
      <XStack alignItems="center" gap="$4">
        <SettingsNavBack title="Sites" onDone={onDone} />
        <Heading flex={1}>{hostnameStripProtocol(hostname)}</Heading>
        <Button
          theme="red"
          size="$2"
          onPress={() => removeSite.mutate()}
          icon={Close}
        >
          Remove Site
        </Button>
      </XStack>

      {isLoading ? (
        <Spinner />
      ) : (
        <YStack gap="$5">
          <SiteInfoSection hostname={hostname} isOwner={isOwner} />
          <Separator />
          <SiteMembers
            hostname={hostname}
            accountId={accountId}
            isOwner={isOwner}
          />
        </YStack>
      )}
    </>
  )
}

function SiteInfoSection({
  hostname,
  isOwner,
}: {
  hostname: string
  isOwner: boolean
}) {
  const siteInfo = useSiteInfo(hostname)
  const writeSiteInfo = useWriteSiteInfo(hostname)
  return (
    <SettingsSection title="Public SEO Info">
      {siteInfo?.data ? (
        <SiteInfoForm
          info={siteInfo.data}
          onSubmit={(info) => writeSiteInfo.mutate(info)}
          isOwner={isOwner}
        />
      ) : null}
    </SettingsSection>
  )
}

const SettingsHeader = styled('div', {
  display: 'flex',
  gap: '1rem',
  position: 'relative',
  '>h2': {
    flexGrow: 1,
    margin: 0,
    fontSize: '1.5em',
  },
})

function NewSite({onDone}: {onDone: (activeSite: string | null) => void}) {
  const addSite = useAddSite({
    onSuccess: (result, input) => onDone(input.hostname),
  })
  const [siteUrl, setSiteUrl] = useState<string | null>(null)
  const hostRef = useRef<HTMLInputElement>(null)

  // focus input on first render
  useEffect(() => {
    if (hostRef.current) {
      hostRef.current.focus()
    }
  }, [])
  return (
    <>
      <SettingsHeader>
        <SettingsNavBack title="Cancel" onDone={() => onDone(null)} />
        <h2>Add Mintter Web Site</h2>
      </SettingsHeader>

      {addSite.error ? (
        //@ts-ignore
        <Text color={'danger'}>{addSite.error?.message}</Text>
      ) : null}
      {addSite.isLoading ? <Spinner /> : null}
      <p>Follow the self-hosting guide and copy the invite URL:</p>
      <Box
        as={'form'}
        onSubmit={(e) => {
          e.preventDefault()
          const matchedHostProtocol = siteUrl?.match(
            /^(https?:\/\/)?([^/]*)\/?/,
          )
          const matchedInviteURL = siteUrl?.match(
            /^(https?:\/\/)?([^/]*)(\/invite\/(.*))?$/,
          )
          const protocol = matchedHostProtocol?.[1] ?? 'https://'
          const hostname = matchedHostProtocol?.[2] || matchedInviteURL?.[2]
          const inviteToken = matchedInviteURL?.[4]
          const fullHostname = protocol + hostname
          console.log({fullHostname, matchedHostProtocol, siteUrl, hostname})
          if (hostname) addSite.mutate({hostname: fullHostname, inviteToken})
        }}
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
      >
        <TextField
          ref={hostRef}
          id="host"
          name="host"
          label="site domain or invite url"
          onChange={(e) => setSiteUrl(e.target.value)}
          value={siteUrl ?? undefined}
        />
        <Button disabled={!siteUrl} size="$2" color="green">
          Connect + Add Site
        </Button>
      </Box>
    </>
  )
}

const NewSitePage = Symbol('NewSitePage')
function SitesSettings({
  auth,
}: {
  auth: InterpreterFrom<ReturnType<typeof createAuthService>>
}) {
  let account = useSelector(auth, (state) => state.context.account)
  let [state] = useActor(auth)
  const accountId = state.matches('loggedIn') ? account?.id : undefined
  const [activeSitePage, setActiveSitePage] = useState<
    string | typeof NewSitePage | null
  >(null)
  if (!accountId) return null
  if (activeSitePage === NewSitePage) {
    return <NewSite onDone={(s: string | null) => setActiveSitePage(s)} />
  }
  if (typeof activeSitePage === 'string') {
    return (
      <SiteSettings
        hostname={activeSitePage}
        accountId={accountId}
        onDone={() => setActiveSitePage(null)}
      />
    )
  }
  return (
    <>
      <YStack gap="$5">
        <XStack alignItems="center" gap="$4">
          <Heading flex={1}>Sites</Heading>
          <Button
            size="$2"
            icon={Add}
            onPress={() => {
              setActiveSitePage(NewSitePage)
            }}
          >
            Add Site
          </Button>
        </XStack>

        <SitesList
          onSelectSite={(siteId: string) => setActiveSitePage(siteId)}
        />
      </YStack>
    </>
  )
}

function EmptySiteList() {
  return (
    <YStack padding="$4">
      <SizableText>no sites yet</SizableText>
    </YStack>
  )
}

function SiteItem({site, onSelect}: {site: SiteConfig; onSelect: () => void}) {
  return (
    <TableList.Item
      onPress={onSelect}
      iconAfter={Forward}
      hoverStyle={{cursor: 'pointer'}}
    >
      <SizableText hoverStyle={{cursor: 'pointer'}}>
        {hostnameStripProtocol(site.hostname)}
      </SizableText>
    </TableList.Item>
  )
}

function SitesList({onSelectSite}: {onSelectSite: (siteId: string) => void}) {
  const {data: sites, isLoading} = useSiteList()
  return (
    <TableList>
      {isLoading && <Spinner />}
      {sites && sites.length === 0 && <EmptySiteList />}
      {sites?.map((site) => (
        <SiteItem
          key={site.hostname}
          site={site}
          onSelect={() => {
            onSelectSite(site.hostname)
          }}
        />
      ))}
    </TableList>
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
