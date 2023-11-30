import {copyUrlToClipboardWithFeedback} from '@mintter/app/copy-to-clipboard'
import {usePublicationInContext} from '@mintter/app/models/publication'
import {useGRPCClient} from '@mintter/app/app-context'
import {Avatar} from '@mintter/app/components/avatar'
import {ContactsPrompt} from '@mintter/app/components/contacts-prompt'
import appError from '@mintter/app/errors'
import {useMyAccount} from '@mintter/app/models/accounts'
import {useDraftList} from '@mintter/app/models/documents'
import {useDaemonReady} from '@mintter/app/node-status-context'
import {usePopoverState} from '@mintter/app/use-popover-state'
import {
  NavRoute,
  useNavRoute,
  useNavigationDispatch,
  useNavigationState,
} from '@mintter/app/utils/navigation'
import {useOpenDraft} from '@mintter/app/utils/open-draft'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {getAvatarUrl} from '@mintter/app/utils/account-url'
import {NavMode, PublicationRouteContext} from '@mintter/app/utils/navigation'
import {Account, createPublicWebHmUrl, unpackHmId} from '@mintter/shared'
import {
  Back,
  Button,
  Draft,
  Forward,
  ListItem,
  Menu,
  Popover,
  Separator,
  Settings,
  SizableText,
  TitlebarSection,
  Tooltip,
  XGroup,
  XStack,
  YGroup,
  YStack,
  useStream,
} from '@mintter/ui'
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Bookmark,
  Contact,
  Copy,
  ExternalLink,
  FilePlus2,
  Globe,
  Library,
  Link,
  Pencil,
  Search,
  Send,
} from '@tamagui/lucide-icons'
import {memo, useState} from 'react'
import toast from 'react-hot-toast'
import {TitleBarProps} from './titlebar'
import {useGroup, useInvertedGroupContent} from '../models/groups'
import {useEditGroupInfoDialog} from './edit-group-info'
import {AddGroupButton} from './new-group'
import {usePublishGroupDialog} from './publish-group'
import {DraftPublicationButtons, PageContextButton} from './publish-share'
import {useTriggerWindowEvent} from '../utils/window-events'
import {MenuItemType, OptionsDropdown} from './options-dropdown'
import {MenuItem} from './dropdown'
import {useAppDialog} from './dialog'
import {CloneGroupDialog} from './clone-group'
import {useEntityTimeline} from '../models/changes'
import {useAppContext} from '../app-context'
import copyTextToClipboard from 'copy-text-to-clipboard'
import {useSidebarContext} from '../src/sidebar-context'

function getRoutePubContext(
  route: NavRoute,
): PublicationRouteContext | undefined {
  if (route.key === 'publication') return route.pubContext
  if (route.key === 'draft') return route.pubContext
  if (route.key === 'group')
    return {key: 'group', groupId: route.groupId, pathName: ''}

  return null
}

function NewDocumentButton() {
  const route = useNavRoute()
  const openDraft = useOpenDraft()
  const isDaemonReady = useDaemonReady()
  return (
    <Tooltip content="New Hypermedia Document – &#8984; N">
      <Button
        size="$2"
        chromeless
        disabled={!isDaemonReady}
        iconAfter={FilePlus2}
        onPress={(e) => {
          e.preventDefault()
          const pubContext = getRoutePubContext(route)
          openDraft(pubContext)
        }}
      />
    </Tooltip>
  )
}

export function GroupOptionsButton() {
  const route = useNavRoute()
  const groupRoute = route.key === 'group' ? route : null
  const groupRouteVersion = groupRoute?.version
  const groupId = groupRoute?.groupId
  if (!groupId)
    throw new Error('GroupOptionsButton not supported in this route')
  const publish = usePublishGroupDialog()
  const myAccount = useMyAccount()
  const group = useGroup(groupId)
  const editInfo = useEditGroupInfoDialog()
  const isGroupOwner =
    myAccount.data?.id && group.data?.ownerAccountId === myAccount.data?.id
  const cloneGroup = useAppDialog(CloneGroupDialog)
  const menuItems: MenuItemType[] = [
    {
      key: 'clone',
      label: 'Clone Group',
      icon: Copy,
      onPress: () => {
        cloneGroup.open(groupId)
      },
    },
    {
      key: 'link',
      label: 'Copy Public Group URL',
      icon: Link,
      onPress: () => {
        const id = unpackHmId(groupId)
        if (!id) return
        copyTextToClipboard(
          createPublicWebHmUrl('g', id.eid, {version: groupRouteVersion}),
        )
        toast.success('Copied Public Group URL')
      },
    },
  ]
  // if (!isGroupOwner) return null // for now, this menu contains stuff for owners only. enable it for other people one day when it contains functionality for them
  if (isGroupOwner) {
    menuItems.push({
      key: 'publishSite',
      label: 'Publish Group to Site',
      icon: Send,
      onPress: () => {
        publish.open({
          groupId,
          publishedBaseUrl: group.data?.siteInfo?.baseUrl,
        })
      },
    })
    menuItems.push({
      key: 'editGroupInfo',
      label: 'Edit Group Info',
      icon: Pencil,
      onPress: () => {
        editInfo.open(groupId)
      },
    })
  }
  return (
    <>
      <OptionsDropdown menuItems={menuItems} />
      {publish.content}
      {editInfo.content}
      {cloneGroup.content}
    </>
  )
}

export function useFullReferenceUrl(
  route: NavRoute,
): {label: string; url: string} | null {
  const pubRoute = route.key === 'publication' ? route : null
  const groupRoute = route.key === 'group' ? route : null
  const pub = usePublicationInContext({
    documentId: pubRoute?.documentId,
    versionId: pubRoute?.versionId,
    pubContext: pubRoute?.pubContext,
    enabled: !!pubRoute?.documentId,
  })
  const contextGroupId =
    pubRoute?.pubContext?.key === 'group'
      ? pubRoute.pubContext.groupId
      : undefined
  const contextGroup = useGroup(contextGroupId)
  const routeGroupId = groupRoute?.groupId
  const pubRouteDocId = pubRoute?.documentId
  const group = useGroup(contextGroupId || routeGroupId)
  const entityTimeline = useEntityTimeline(routeGroupId || pubRouteDocId)
  const invertedGroupContent = useInvertedGroupContent(contextGroupId)

  // let redirectedContext: undefined | PublicationRouteContext = undefined

  // const navigateReplace = useNavigate('replace')

  if (groupRoute) {
    const groupExactVersion = groupRoute?.version || group?.data?.version
    const baseUrl = group.data?.siteInfo?.baseUrl
    if (baseUrl) {
      return {
        label: 'Site',
        url: groupExactVersion ? `${baseUrl}/?v=${groupExactVersion}` : baseUrl,
      }
    }
    return getReferenceUrlOfRoute(
      route,
      undefined,
      groupExactVersion || group.data?.version,
    )
  }

  if (pubRoute) {
    const docId = unpackHmId(pubRoute.documentId)
    if (!docId) return null

    let hostname = contextGroupId ? group.data?.siteInfo?.baseUrl : undefined

    if (hostname && pub.data?.version && contextGroupId) {
      const matchedPrettyPath =
        invertedGroupContent.data?.[docId.eid]?.[pub.data?.version]
      if (matchedPrettyPath && !pubRoute.versionId) {
        const displayPrettyPath =
          matchedPrettyPath === '/' ? '' : matchedPrettyPath
        const groupVersion = contextGroup.data?.version
        let sitePrettyUrl = `${hostname}/${displayPrettyPath}`
        if (groupVersion) {
          sitePrettyUrl += `?v=${groupVersion}`
        }
        return {
          url: sitePrettyUrl,
          label: 'Site Document',
        }
      }
      if (hostname && entityTimeline.data) {
        const linkVersion = pub.data?.version
        const linkChangeIds = linkVersion.split('.')
        const allChanges = entityTimeline.data.allChanges
        const explicitlyHostedChangeIds = new Set(
          Object.keys(invertedGroupContent.data?.[docId.eid] || {})
            .map((version) => version.split('.'))
            .flat(),
        )
        const allHostedChangeIds = new Set<string>()
        let walkingHostedChangeIds = [...explicitlyHostedChangeIds]
        while (walkingHostedChangeIds.length) {
          walkingHostedChangeIds = walkingHostedChangeIds
            .map((changeId) => {
              allHostedChangeIds.add(changeId)
              const change = allChanges[changeId]
              if (!change) return []
              return change.deps
            })
            .flat()
        }

        if (
          linkChangeIds.find((changeId) => !allHostedChangeIds.has(changeId))
        ) {
          // this is the main purpose for all this code!
          // if the version is not hosted on this site, we should link to hyper.media by setting hostname to undefined
          hostname = undefined
          // also we want to clear the publication context from the route:
          // redirectedContext = null
        }
      }
      // if (redirectedContext !== undefined) {
      // this is causing buggy behavior. maybe we should show a visual indicator that this version doesn't actually appear in the group, rather than redirecting
      // navigateReplace({
      //   ...pubRoute,
      //   pubContext: redirectedContext,
      // })
      // }
    }
    return {
      url: createPublicWebHmUrl('d', docId.eid, {
        version: pub.data?.version,
        hostname,
      }),
      label: hostname ? 'Site Version' : 'Doc Version',
    }
  }

  const reference = getReferenceUrlOfRoute(route)
  return reference
}

function getReferenceUrlOfRoute(
  route: NavRoute,
  hostname?: string | undefined,
  exactVersion?: string | undefined,
) {
  if (route.key === 'group') {
    const groupId = unpackHmId(route.groupId)
    if (!groupId || groupId.type !== 'g') return null
    const url = createPublicWebHmUrl('g', groupId.eid, {
      hostname,
      version: exactVersion,
    })
    return {
      label: 'Group',
      url,
    }
  }
  if (route.key === 'publication') {
    const docId = unpackHmId(route.documentId)
    if (!docId || docId.type !== 'd') return null
    const url = createPublicWebHmUrl('d', docId.eid, {
      version: exactVersion || route.versionId,
      hostname,
    })
    if (!url) return null
    return {
      label: 'Doc',
      url,
    }
  }
  if (route.key === 'account') {
    const url = createPublicWebHmUrl('a', route.accountId, {
      hostname,
      version: exactVersion,
    })
    if (!url) return null
    return {
      label: 'Account',
      url,
    }
  }
  return null
}

function CopyReferenceButton() {
  const [shouldOpen, setShouldOpen] = useState(false)
  const route = useNavRoute()
  const reference = useFullReferenceUrl(route)
  const {externalOpen} = useAppContext()
  if (!reference) return null
  return (
    <Tooltip
      content={
        shouldOpen ? `Open ${reference.label}` : `Copy ${reference.label} Link`
      }
    >
      <Button
        onHoverOut={() => {
          setShouldOpen(false)
        }}
        aria-label={`${shouldOpen ? 'Open' : 'Copy'} ${reference.label} Link`}
        chromeless
        size="$2"
        icon={shouldOpen ? ExternalLink : Link}
        onPress={() => {
          if (shouldOpen) {
            setShouldOpen(false)
            console.log('open url', reference.url)
            externalOpen(reference.url)
          } else {
            setShouldOpen(true)
            // in theory we should save this timeout in a ref and deal with it upon unmount. in practice it doesn't matter
            setTimeout(() => {
              setShouldOpen(false)
            }, 5000)
            copyUrlToClipboardWithFeedback(reference.url, reference.label)
          }
        }}
      ></Button>
    </Tooltip>
  )
}

export function PageActionButtons(props: TitleBarProps) {
  const route = useNavRoute()

  const commonButtons = [<NewDocumentButton key="newDoc" />]
  let buttonGroup = commonButtons
  if (route.key === 'draft') {
    buttonGroup = [<DraftPublicationButtons key="draftPublication" />]
  } else if (route.key === 'contacts') {
    buttonGroup = [<ContactsPrompt key="addContact" />, ...commonButtons]
  } else if (route.key === 'groups') {
    buttonGroup = [<AddGroupButton key="addGroup" />, ...commonButtons]
  } else if (route.key === 'group') {
    buttonGroup = [
      <GroupOptionsButton key="groupOptions" />,
      <CopyReferenceButton key="copyRef" />,
      ...commonButtons,
    ]
  } else if (route.key === 'publication') {
    buttonGroup = [
      <EditDocActions
        key="editActions"
        contextRoute={route}
        pubContext={route.pubContext || null}
        docId={route.documentId}
        baseVersion={route.versionId}
      />,
      <CopyReferenceButton key="copyRef" />,
      ...commonButtons,
    ]
  } else if (route.key === 'account') {
    buttonGroup = [<CopyReferenceButton key="copyRef" />, ...commonButtons]
  }
  return <TitlebarSection>{buttonGroup}</TitlebarSection>
}

export function PageContextControl(props: TitleBarProps) {
  return (
    <XStack className="no-window-drag">
      <PageContextButton />
    </XStack>
  )
}

export function NavigationButtons() {
  const state = useNavigationState()
  const dispatch = useNavigationDispatch()
  return (
    <XStack className="no-window-drag">
      <XGroup>
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
    </XStack>
  )
}

export function AccountDropdownItem({
  account,
  onRoute,
}: {
  account?: Account
  onRoute: (route: NavRoute) => void
}) {
  const route = useNavRoute()
  const disabled = route.key == 'account' && route.accountId == account?.id
  return (
    <ListItem
      hoverTheme
      pressTheme
      focusTheme
      paddingVertical="$2"
      minHeight={70}
      paddingHorizontal="$4"
      textAlign="left"
      outlineColor="transparent"
      space="$2"
      userSelect="none"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      title={
        <YStack>
          <SizableText
            fontSize="$2"
            fontWeight={'bold'}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            userSelect="none"
          >
            {account?.profile?.alias || 'My Profile'}
          </SizableText>
          <SizableText size="$1" color="$9">
            My Profile
          </SizableText>
        </YStack>
      }
      disabled={disabled}
      onPress={() => {
        if (!account?.id) {
          appError('Account has not loaded.')
          return
        }
        onRoute({key: 'account', accountId: account?.id})
      }}
      icon={
        <Avatar
          size={36}
          label={account?.profile?.alias}
          id={account?.id}
          url={getAvatarUrl(account?.profile?.avatar)}
        />
      }
    ></ListItem>
  )
}

function NavMenuContentUnpure({
  onClose,
  onRoute,
}: {
  onClose: () => void
  onRoute: (route: NavRoute) => void
}) {
  const route = useNavRoute()
  const {data: account} = useMyAccount()
  const triggerFocusedWindow = useTriggerWindowEvent()

  return (
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
      <YGroup separator={<Separator />} elevation="$4">
        <YGroup.Item>
          <AccountDropdownItem account={account} onRoute={onRoute} />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            disabled={route.key == 'home'}
            data-testid="menu-item-pubs"
            onPress={() => {
              onRoute({key: 'home'})
            }}
            title="Trusted Publications"
            icon={Bookmark}
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; 1
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            disabled={route.key == 'all-publications'}
            data-testid="menu-item-global"
            onPress={() => {
              onRoute({key: 'all-publications'})
            }}
            title="All Publications"
            icon={Globe}
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; 2
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            onPress={() => {
              onRoute({key: 'groups'})
            }}
            title="Groups"
            icon={Library}
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; 3
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            disabled={route.key == 'drafts'}
            data-testid="menu-item-drafts"
            onPress={() => {
              onRoute({key: 'drafts'})
            }}
            icon={Draft}
            title="Drafts"
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; 8
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            disabled={route.key == 'contacts'}
            onPress={() => {
              onRoute({key: 'contacts'})
            }}
            icon={Contact}
            title="Contacts"
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; 9
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            onPress={() => {
              triggerFocusedWindow('openQuickSwitcher')
              onClose()
            }}
            title="Search / Open"
            icon={Search}
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; K
              </SizableText>
            }
          />
        </YGroup.Item>
        <YGroup.Item>
          <MenuItem
            onPress={() => {
              onRoute({key: 'settings'})
            }}
            icon={Settings}
            title="Settings"
            iconAfter={
              <SizableText size="$1" color="$color9">
                &#8984; ,
              </SizableText>
            }
          />
        </YGroup.Item>
      </YGroup>
    </Popover.Content>
  )
}

export function NavMenuButton() {
  const ctx = useSidebarContext()
  const isLocked = useStream(ctx.isLocked)
  const isHoverVisible = useStream(ctx.isHoverVisible)
  let icon = Menu
  let tooltip = 'Lock Sidebar Open'
  if (isLocked) {
    icon = ArrowLeftFromLine
    tooltip = 'Close Sidebar'
  }
  if (!isLocked && isHoverVisible) {
    icon = ArrowRightFromLine
  }
  return (
    <XStack position="relative" zIndex={1000} className="no-window-drag">
      <Button
        size="$2"
        icon={icon}
        onMouseEnter={ctx.onMenuHover}
        onMouseLeave={ctx.onMenuHoverLeave}
        onPress={() => {
          ctx.onToggleMenuLock()
        }}
      />
    </XStack>
  )
}

export function EditDocActions({
  docId,
  contextRoute,
  navMode = 'replace',
  pubContext,
  baseVersion,
}: {
  docId: string
  navMode?: NavMode
  contextRoute: NavRoute
  pubContext: PublicationRouteContext
  baseVersion?: string
}) {
  const pub = usePublicationInContext({
    documentId: docId,
    versionId: baseVersion,
    pubContext,
    enabled: !!docId,
  })
  const pubVersion = pub.data?.version
  const draftList = useDraftList()
  const navigate = useNavigate(navMode)

  const hasExistingDraft = draftList.data?.documents.some(
    (draft) => draft.id == docId,
  )
  const grpcClient = useGRPCClient()

  async function handleEdit() {
    try {
      if (hasExistingDraft) {
        // todo, careful! this only works because draftId is docId right now
        navigate({
          key: 'draft',
          draftId: docId,
          contextRoute,
          pubContext,
        })
        return
      }
      let draft = await grpcClient.drafts.createDraft({
        existingDocumentId: docId,
        version: baseVersion || pubVersion,
      })
      navigate({
        key: 'draft',
        draftId: draft.id,
        contextRoute,
        pubContext,
      })
    } catch (error: any) {
      if (
        error?.message.match('[failed_precondition]') &&
        error?.message.match('already exists')
      ) {
        toast('A draft already exists for this document. Please review.')
        navigate({
          key: 'draft',
          draftId: docId, // because docId and draftId are the same right now
          contextRoute,
          pubContext,
        })
        return
      }

      toast.error(`Draft Error: ${error?.message}`)
    }
  }

  return (
    <>
      <Tooltip content={hasExistingDraft ? 'Resume Editing' : 'Edit Document'}>
        <Button
          size="$2"
          theme={hasExistingDraft ? 'yellow' : undefined}
          onPress={() => handleEdit()}
          iconAfter={Pencil}
        />
      </Tooltip>
    </>
  )
}
