import {updateAccount} from '@mintter/client'
import {Box} from '@mintter/ui/box'
import {dialogContentStyles, DialogTitle, StyledOverlay} from '@mintter/ui/dialog'
import {Icon} from '@mintter/ui/icon'
import {styled} from '@mintter/ui/stitches.config'
import {Text} from '@mintter/ui/text'
import {TextField} from '@mintter/ui/text-field'
import {useTheme} from '@mintter/ui/theme'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import toast from 'react-hot-toast'
import {useMutation, useQueryClient} from 'react-query'
import {useAccount} from '../hooks'
import {Button} from './message-box'
import {PeerAddrs} from './peer-addrs'
import {ScrollArea} from './scroll-area'

type ProfileInformationDataType = {
  alias: string
  email: string
  bio: string
}

export function Settings() {
  return (
    <DialogPrimitive.Root>
      <StyledOverlay />
      <DialogPrimitive.Trigger asChild>
        <Button size="1" variant="ghost" color="muted">
          <Icon name="GearOutlined" color="muted" />
        </Button>
      </DialogPrimitive.Trigger>
      <Content>
        <DialogPrimitive.Title asChild>
          <DialogTitle
            css={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              paddingHorizontal: '$5',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              background: '$background-default',
              zIndex: '$max',
            }}
          >
            Settings
          </DialogTitle>
        </DialogPrimitive.Title>

        <StyledTabs defaultValue="profile" orientation="vertical">
          <StyledTabsList aria-label="Manage your node">
            <TabTrigger value="profile">Profile</TabTrigger>
            <TabTrigger value="account">Account Info</TabTrigger>
            <TabTrigger value="settings">Settings</TabTrigger>
          </StyledTabsList>
          <TabsContent value="profile">
            <ScrollArea>
              <ProfileForm />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="account">
            <ScrollArea>
              <AccountInfo />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="settings">
            <AppSettings />
          </TabsContent>
        </StyledTabs>
      </Content>
    </DialogPrimitive.Root>
  )
}

{
  /* 
              <Text as="h2" size="8">
                Account
              </Text>
              
              <Separator />
              <Text as="h2" size="8">
                Preferences
              </Text>
              <Box css={{alignItems: 'center', display: 'flex', gap: '$3'}}>
                <input id="darkMode" type="checkbox" checked={theme.currentTheme === 'dark'} onChange={theme.toggle} />
                <Text as="label" htmlFor="darkMode">
                  Dark Mode
                </Text>
              </Box>
              <Separator />
              <Text as="h2" size="8">
                Devices List
              </Text>
              <Box>
                {Object.entries(data!.devices).map(([id, device]: [string, Device], index: number) => (
                  <Text as="li" key={id}>
                    <Text as="span" color="muted" css={{display: 'inline-block', marginRight: '$4'}}>
                      {index + 1}.
                    </Text>
                    {device.peerId}
                  </Text>
                ))}
              </Box>
            </Box> */
}

var Content = styled(DialogPrimitive.Content, dialogContentStyles, {
  width: '100%',
  maxWidth: '70vw',
  maxHeight: '70vh',
  height: '100%',
  padding: 0,
})

var StyledTabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  width: '$full',
  height: 'calc(100% - 64px)',
  marginTop: 64,
})

var StyledTabsList = styled(TabsPrimitive.List, {
  borderRight: '1px solid rgba(0,0,0,0.1)',
  width: '232px',
})

var TabTrigger = styled(TabsPrimitive.Trigger, {
  all: 'unset',
  padding: '0 $6',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'center',
  fontSize: '$3',
  lineHeight: '1',
  color: '$text-default',
  '&:hover': {
    background: '$primary-muted',
  },
  '&[data-state="active"]': {
    color: '$primary-default',
    fontWeight: '$bold',
    // boxShadow: 'inset 0 -2px 0 0 currentColor, 0 2px 0 0 currentColor',
  },
  '&:focus': {position: 'relative', background: '$primary-muted'},
})

var TabsContent = styled(TabsPrimitive.Content, {
  flex: 1,
  position: 'relative',
  background: '$background-muted',
})

function ProfileForm() {
  const {data} = useAccount('', {
    useErrorBoundary: true,
  })
  const queryClient = useQueryClient()
  const updateProfile = useMutation(updateAccount)

  const form = useForm<ProfileInformationDataType>({
    mode: 'onChange',
    defaultValues: {
      alias: '',
      email: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (data?.profile) {
      const {alias = '', email = '', bio = ''} = data?.profile
      form.setValue('alias', alias)
      form.setValue('email', email)
      form.setValue('bio', bio)
    }
  }, [data, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await toast
      .promise(updateProfile.mutateAsync(data), {
        loading: 'Updating profile',
        success: 'Profile updated',
        error: 'Error updating profile',
      })
      .finally(() => {
        queryClient.invalidateQueries('Account')
      })

    console.log('edit complete!')
  })
  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$7',
        padding: '$5',
      }}
    >
      <TextField
        type="text"
        label="Username"
        id="alias"
        name="alias"
        ref={form.register}
        placeholder="Readable alias or alias. Doesn't have to be unique."
      />
      <TextField
        type="email"
        status={form.errors.email && 'danger'}
        label="Email"
        id="email"
        name="email"
        ref={form.register({
          // pattern: {
          //   // eslint-disable-next-line no-control-regex
          //   value: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
          //   message: 'Please type a valid email.',
          // },
        })}
        placeholder="Real email that could be publically shared"
        hint={form.errors.email?.message}
      />

      <TextField
        textarea
        id="bio"
        name="bio"
        label="Bio"
        ref={form.register}
        rows={4}
        placeholder="A little bit about yourself..."
      />
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || !form.formState.isValid}
        size="2"
        shape="pill"
        color="success"
        css={{alignSelf: 'flex-start'}}
      >
        Save
      </Button>
    </Box>
  )
}

function AccountInfo() {
  const {data = {devices: {}}} = useAccount()
  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$7',
        padding: '$5',
      }}
    >
      <Text
        size="2"
        color="primary"
        css={{
          paddingHorizontal: '$4',
          paddingVertical: '$3',
          borderRadius: '$2',
          display: 'block',
          background: '$primary-muted',
          border: '1px solid $colors$primary-softer',
        }}
      >
        All your Mintter content is located in <code>~/.mtt/</code>
      </Text>
      <TextField readOnly type="text" label="Account ID" name="accountId" value={data?.id} />
      <PeerAddrs />
      <Text as="h4" size="6">
        Devices List
      </Text>
      <Box>
        {Object.entries(data?.devices).map(([id, device]: [string, Device], index: number) => (
          <Text as="li" key={id}>
            <Text as="span" color="muted" css={{display: 'inline-block', marginRight: '$4'}}>
              {index + 1}.
            </Text>
            {device.peerId}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

function AppSettings() {
  const theme = useTheme()
  return (
    <Box css={{alignItems: 'center', display: 'flex', gap: '$3', padding: '$5'}}>
      <input id="darkMode" type="checkbox" checked={theme.currentTheme === 'dark'} onChange={theme.toggle} />
      <Text as="label" htmlFor="darkMode">
        Dark Mode
      </Text>
    </Box>
  )
}
