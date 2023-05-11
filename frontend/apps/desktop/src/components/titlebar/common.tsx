import {draftsClient} from '@app/api-clients'
import {Dropdown, MenuItem} from '@app/editor/dropdown'
import appError from '@app/errors'
import {send} from '@app/ipc'
import {useMyAccount} from '@app/models/accounts'
import {useDraftList} from '@app/models/documents'
import {useSiteList} from '@app/models/sites'
import {useDaemonReady} from '@app/node-status-context'
import {usePopoverState} from '@app/use-popover-state'
import {
  PublicationRoute,
  useNavigate,
  useNavigationDispatch,
  useNavigationState,
  useNavRoute,
} from '@app/utils/navigation'
import {useOpenDraft} from '@app/utils/open-draft'
import {hostnameStripProtocol} from '@app/utils/site-hostname'
import {Avatar} from '@components/avatar'
import {ContactsPrompt} from '@components/contacts-prompt'
import {MINTTER_LINK_PREFIX} from '@mintter/shared'
import {
  Add,
  Back,
  Button,
  Draft,
  File,
  Forward,
  Globe,
  ListItem,
  ListItemProps,
  Menu,
  Popover,
  Separator,
  Settings,
  SizableText,
  TitlebarSection,
  User,
  XGroup,
  XStack,
  YGroup,
} from '@mintter/ui'
import copyTextToClipboard from 'copy-text-to-clipboard'
import {useState} from 'react'
import toast from 'react-hot-toast'
import {TitleBarProps} from '.'
import {PublishShareButton} from './publish-share'

export function ActionButtons(props: TitleBarProps) {
  const openDraft = useOpenDraft()
  const route = useNavRoute()
  const isDaemonReady = useDaemonReady()

  const onCopy =
    route.key == 'publication'
      ? () => {
          let reference = `${MINTTER_LINK_PREFIX}${route.documentId}`
          if (route.versionId) reference += `?v=${route.versionId}`
          if (route.blockId) reference += `#${route.blockId}`
          copyTextToClipboard(reference)
          toast.success('Document reference copied!')
        }
      : undefined

  return (
    <TitlebarSection>
      {/* {onCopy && (
        <Tooltip content="Copy document reference">
          <Button chromeless size="$2" onPress={onCopy} icon={Copy} />
        </Tooltip>
      )} */}

      {route.key == 'publication' ? <WriteActions route={route} /> : null}

      <PublishShareButton />

      {route.key == 'draft' ? null : (
        <div className="button-group">
          {route.key == 'connections' ? (
            <ContactsPrompt />
          ) : (
            <Button
              size="$2"
              chromeless
              disabled={!isDaemonReady}
              iconAfter={Add}
              onPress={(e) => {
                e.preventDefault()
                // @ts-ignore
                openDraft(!e.shiftKey)
              }}
            >
              Write
            </Button>
          )}
        </div>
      )}
    </TitlebarSection>
  )
}

export function NavigationButtons() {
  const state = useNavigationState()
  const dispatch = useNavigationDispatch()
  return (
    <XGroup backgroundColor="transparent">
      <XGroup.Item>
        <Button
          size="$2"
          onPress={() => dispatch({type: 'pop'})}
          chromeless
          disabled={state.routeIndex <= 0}
          opacity={state.routeIndex <= 0 ? 0.5 : 1}
          icon={Back}
        />
      </XGroup.Item>
      <XGroup.Item>
        <Button
          size="$2"
          onPress={() => dispatch({type: 'forward'})}
          chromeless
          disabled={state.routeIndex >= state.routes.length - 1}
          opacity={state.routeIndex >= state.routes.length - 1 ? 0.5 : 1}
          icon={Forward}
        />
      </XGroup.Item>
    </XGroup>
  )
}

export function SitesNavDropdownItems() {
  const sites = useSiteList()
  const navigate = useNavigate()

  if (!sites.data) return null
  if (sites.data.length == 0) return null
  return (
    <>
      {sites.data.map((site) => (
        <YGroup.Item>
          <MenuItem
            key={site.hostname}
            onPress={() => navigate({key: 'site', hostname: site.hostname})}
            icon={Globe}
            title={hostnameStripProtocol(site.hostname)}
          />
        </YGroup.Item>
      ))}
    </>
  )
}

export function AccountDropdownItem() {
  const navigate = useNavigate()
  const route = useNavRoute()
  const {data: account} = useMyAccount()
  return (
    <MenuItem
      disabled={route.key == 'account' && route.accountId == account?.id}
      onPress={() => {
        if (!account?.id) {
          appError('Account has not loaded.')
          return
        }
        navigate({key: 'account', accountId: account?.id})
      }}
      icon={
        <Avatar
          size="$1"
          alias={account?.profile?.alias || '.'}
          accountId={account?.id}
        />
      }
      title={account?.profile?.alias || '<me>'}
    />
  )
}

export function NavMenu() {
  const route = useNavRoute()
  const navigate = useNavigate()
  const spawn = useNavigate('spawn')
  const popoverState = usePopoverState()
  return (
    <XStack paddingRight="$2">
      <Popover {...popoverState} placement="bottom-start">
        <Popover.Trigger asChild>
          <Button size="$2" icon={Menu} />
        </Popover.Trigger>
        <Popover.Content
          padding={0}
          size="$5"
          enterStyle={{x: 0, y: -1, opacity: 0}}
          exitStyle={{x: 0, y: -1, opacity: 0}}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YGroup separator={<Separator />} elevation="$4">
            <YGroup.Item>
              <AccountDropdownItem />
            </YGroup.Item>
            <YGroup.Item>
              <MenuItem
                disabled={route.key == 'home'}
                data-testid="menu-item-inbox"
                onPress={() => {
                  navigate({key: 'home'})
                  popoverState.onOpenChange(false)
                }}
                title="All Publications"
                icon={File}
                iconAfter={
                  <SizableText size="$1" color="$mint5">
                    &#8984; 1
                  </SizableText>
                }
              />
            </YGroup.Item>
            <YGroup.Item>
              <MenuItem
                disabled={route.key == 'drafts'}
                data-testid="menu-item-drafts"
                onPress={() => {
                  navigate({key: 'drafts'})
                  popoverState.onOpenChange(false)
                }}
                icon={Draft}
                title="Drafts"
                iconAfter={
                  <SizableText size="$1" color="$mint5">
                    &#8984; 8
                  </SizableText>
                }
              />
            </YGroup.Item>
            <YGroup.Item>
              <MenuItem
                disabled={route.key == 'connections'}
                onPress={() => {
                  navigate({key: 'connections'})
                  popoverState.onOpenChange(false)
                }}
                icon={User}
                title="Connections"
                iconAfter={
                  <SizableText size="$1" color="$mint5">
                    &#8984; 9
                  </SizableText>
                }
              />
            </YGroup.Item>
            <SitesNavDropdownItems />
            <YGroup.Item>
              <MenuItem
                onPress={() => {
                  send('open_quick_switcher')
                  popoverState.onOpenChange(false)
                }}
                title="Quick Switcher"
                iconAfter={
                  <SizableText size="$1" color="$mint5">
                    &#8984; K
                  </SizableText>
                }
              />
            </YGroup.Item>
            <YGroup.Item>
              <MenuItem
                onPress={() => {
                  spawn({key: 'settings'})
                  popoverState.onOpenChange(false)
                }}
                icon={Settings}
                title="Settings"
                iconAfter={
                  <SizableText size="$1" color="$mint5">
                    &#8984; ,
                  </SizableText>
                }
              />
            </YGroup.Item>
          </YGroup>
        </Popover.Content>
      </Popover>
    </XStack>
  )
}

function WriteActions({route}: {route: PublicationRoute}) {
  const draftList = useDraftList()
  const navigateReplace = useNavigate('replace')
  let [errorMessage, setError] = useState('')

  const hasExistingDraft = draftList.data?.documents.some(
    (draft) => draft.id == route.documentId,
  )

  async function handleEdit() {
    try {
      let draft = await draftsClient.createDraft({
        existingDocumentId: route.documentId,
      })
      navigateReplace({
        key: 'draft',
        draftId: draft.id,
        contextDocumentId: route.documentId,
      })
    } catch (error) {
      setError(JSON.stringify(error))
    }
  }

  return (
    <>
      {route.key == 'publication' && (
        <Button
          chromeless
          size="$2"
          theme={hasExistingDraft ? 'yellow' : undefined}
          onPress={() => handleEdit()}
        >
          {hasExistingDraft ? 'Resume Editing' : 'Edit'}
          {errorMessage ? ' (failed)' : null}
        </Button>
      )}
    </>
  )
}
