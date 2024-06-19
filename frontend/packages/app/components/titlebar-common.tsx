import { ContactsPrompt } from '@shm/app/components/contacts-prompt'
import { useMyAccount } from '@shm/app/models/accounts'
import { usePublicationVariant } from '@shm/app/models/publication'
import {
  useNavRoute,
  useNavigationDispatch,
  useNavigationState,
} from '@shm/app/utils/navigation'
import {
  BlockRange,
  ExpandedBlockRange,
  createHmId,
  createPublicWebHmUrl,
  hmId,
  unpackHmId
} from '@shm/shared'
import {
  Back,
  Button,
  ColorProp,
  Forward,
  Menu,
  TitlebarSection,
  Tooltip,
  View,
  XGroup,
  XStack,
  copyUrlToClipboardWithFeedback,
  toast,
  useStream,
} from '@shm/ui'
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpRight,
  ExternalLink,
  FilePlus2,
  Link,
  Pencil,
  Trash,
  UploadCloud,
  X
} from '@tamagui/lucide-icons'
import { ReactNode, useState } from 'react'
import { useAppContext } from '../app-context'
import { useAccount } from '../models/accounts'
import { usePushPublication } from '../models/documents'
import { useGatewayHost, useGatewayUrl } from '../models/gateway-settings'
import { RemoveProfileDocDialog } from '../pages/account-page'
import { SidebarWidth, useSidebarContext } from '../src/sidebar-context'
import { useOpenDraft } from '../utils/open-draft'
import { NavRoute } from '../utils/routes'
import { useNavigate } from '../utils/useNavigate'
import { useCopyGatewayReference } from './copy-gateway-reference'
import { useDeleteDialog } from './delete-dialog'
import { useAppDialog } from './dialog'
import { EditDocButton } from './edit-doc-button'
import { useEditProfileDialog } from './edit-profile-dialog'
import { useFavoriteMenuItem } from './favoriting'
import { MenuItemType, OptionsDropdown } from './options-dropdown'
import { TitleBarProps } from './titlebar'
import {
  DraftPublicationButtons,
  PublicationVariants,
  VersionContext,
} from './variants'

export function DocOptionsButton() {
  const route = useNavRoute()
  const dispatch = useNavigationDispatch()
  if (route.key !== 'publication')
    throw new Error(
      'DocOptionsButton can only be rendered on publication route',
    )
  const docId = route.documentId
  const gwHost = useGatewayHost()
  const push = usePushPublication()
  const deleteEntity = useDeleteDialog()
  const [copyContent, onCopy, host] = useCopyGatewayReference()
  const pub = usePublicationVariant({
    documentId: route.documentId,
    versionId: route.versionId,
    variants: route.variants,
  })
  const menuItems: MenuItemType[] = [
    {
      key: 'link',
      label: `Copy ${host} URL`,
      icon: Link,
      onPress: () => {
        const id = unpackHmId(route.documentId)
        if (!id) {
          toast.error('Failed to identify document URL')
          return
        }
        onCopy({
          ...id,
          variants: route.variants,
        })
      },
    },
    {
      key: 'push',
      label: 'Push to Gateway',
      icon: UploadCloud,
      onPress: () => {
        toast.promise(push.mutateAsync(route.documentId), {
          loading: 'Pushing...',
          success: `Pushed to ${gwHost}`,
          error: (err) => `Could not push to ${gwHost}: ${err.message}`,
        })
      },
    },
    {
      key: 'delete',
      label: 'Delete Publication',
      icon: Trash,
      onPress: () => {
        deleteEntity.open({
          id: route.documentId,
          title: pub.data?.publication?.document?.title,
          onSuccess: () => {
            // dispatch({type: 'backplace', route: {key: 'feed', tab: 'trusted'}})
            dispatch({ type: 'pop' })
          },
        })
      },
    },
  ]
  const id = unpackHmId(docId)
  const docUrl = id
    ? createHmId('d', id.eid, {
      version: route.versionId,
      variants: route.variants,
    })
    : null
  menuItems.push(useFavoriteMenuItem(docUrl))

  return (
    <>
      {copyContent}
      {deleteEntity.content}
      <OptionsDropdown menuItems={menuItems} />
    </>
  )
}

export function AccountOptionsButton() {
  const route = useNavRoute()
  if (route.key !== 'account')
    throw new Error(
      'AccountOptionsButton can only be rendered on account route',
    )
  const menuItems: MenuItemType[] = []
  const accountUrl = createHmId('a', route.accountId)
  menuItems.push(useFavoriteMenuItem(accountUrl))
  const account = useAccount(route.accountId)
  const dispatch = useNavigationDispatch()
  const deleteEntity = useDeleteDialog()
  const myAccount = useMyAccount()
  const spawn = useNavigate('spawn')
  const editProfileDialog = useEditProfileDialog()
  const removeProfileDoc = useAppDialog(RemoveProfileDocDialog, { isAlert: true })
  const isMyAccount = myAccount.data?.id === route.accountId
  if (isMyAccount) {
    menuItems.push({
      key: 'edit-account',
      label: 'Edit Account Info',
      icon: Pencil,
      onPress: () => {
        editProfileDialog.open(true)
      },
    })
  }
  const accountId = account.data?.id
  const rootDocument = account.data?.profile?.rootDocument
  if (isMyAccount && rootDocument) {
    menuItems.push({
      key: 'rm-profile',
      label: 'Remove Profile Document',
      icon: X,
      onPress: () => {
        removeProfileDoc.open({})
      },
    })
  }
  if (accountId && rootDocument) {
    menuItems.push({
      key: 'profile-new-window',
      label: 'Open Profile in New Window',
      icon: ArrowUpRight,
      onPress: () => {
        spawn({
          key: 'publication',
          documentId: rootDocument,
          variants: [
            {
              key: 'author',
              author: accountId,
            },
          ],
        })
      },
    })
  }
  menuItems.push({
    key: 'delete',
    label: 'Delete Account',
    icon: Trash,

    onPress: () => {
      deleteEntity.open({
        id: createHmId('a', route.accountId),
        title: account.data?.profile?.alias,
        onSuccess: () => {
          dispatch({ type: 'pop' })
        },
      })
    },
  })
  return (
    <>
      <OptionsDropdown menuItems={menuItems} />
      {deleteEntity.content}
      {editProfileDialog.content}
      {removeProfileDoc.content}
    </>
  )
}

function EditAccountButton() {
  const route = useNavRoute()
  if (route.key !== 'account')
    throw new Error(
      'AccountOptionsButton can only be rendered on account route',
    )
  const myAccount = useMyAccount()
  if (myAccount.data?.id !== route.accountId) {
    return null
  }
  if (route.tab !== 'profile' && route.tab) return null
  return (
    <EditDocButton
      docId={myAccount.data?.profile?.rootDocument || undefined}
      isProfileDocument
      baseVersion={undefined}
      navMode="push"
      contextRoute={route}
    />
  )
}


export function useFullReferenceUrl(route: NavRoute): {
  label: string
  url: string
  onCopy: (
    blockId?: string | undefined,
    blockRange?: BlockRange | ExpandedBlockRange,
  ) => void
  content: ReactNode
} | null {
  const pubRoute = route.key === 'publication' ? route : null
  const pub = usePublicationVariant({
    documentId: pubRoute?.documentId,
    versionId: pubRoute?.versionId,
    variants: pubRoute?.variants,
    enabled: !!pubRoute?.documentId,
  })
  const gwUrl = useGatewayUrl()
  const [copyDialogContent, onCopyPublic] =
    useCopyGatewayReference()

  if (pubRoute) {
    const docId = unpackHmId(pubRoute.documentId)
    if (!docId) return null
    let hostname = gwUrl.data
    return {
      url: createPublicWebHmUrl('d', docId.eid, {
        version: pub.data?.publication?.version,
        hostname,
      }),
      label: hostname ? 'Site Version' : 'Doc Version',
      content: copyDialogContent,
      onCopy: (
        blockId: string | undefined,
        blockRange?: BlockRange | ExpandedBlockRange | null,
      ) => {
        const focusBlockId = pubRoute.isBlockFocused ? pubRoute.blockId : null
        onCopyPublic({
          ...docId,
          hostname: hostname || null,
          version: pub.data?.publication?.version || null,
          blockRef: blockId || focusBlockId || null,
          blockRange,
          variants: pubRoute.variants,
        })
      },
    }
  }

  if (route.key === 'account') {
    const accountId = hmId('a', route.accountId)
    const focusBlockId = route.isBlockFocused ? route.blockId : null
    return {
      label: 'Account',
      url: createPublicWebHmUrl('a', route.accountId, {
        hostname: gwUrl.data,
      }),
      content: copyDialogContent,
      onCopy: () => {
        onCopyPublic({
          ...accountId,
          hostname: gwUrl.data || null,
          blockRef: focusBlockId || null,
        })
      },
    }
  }

  const reference = getReferenceUrlOfRoute(route, gwUrl.data)
  if (!reference) return null
  return {
    ...reference,
    content: null,
    onCopy: () => {
      copyUrlToClipboardWithFeedback(reference.url, reference.label)
    },
  }
}

function getReferenceUrlOfRoute(
  route: NavRoute,
  hostname?: string | undefined,
  exactVersion?: string | undefined,
) {
  if (route.key === 'publication') {
    const docId = unpackHmId(route.documentId)
    if (!docId || docId.type !== 'd') return null
    const url = createPublicWebHmUrl('d', docId.eid, {
      version: exactVersion || route.versionId,
      hostname,
      variants: route.variants,
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

export function CopyReferenceButton() {
  const [shouldOpen, setShouldOpen] = useState(false)
  const route = useNavRoute()
  const reference = useFullReferenceUrl(route)
  const { externalOpen } = useAppContext()
  if (!reference) return null
  return (
    <>
      <Tooltip
        content={
          shouldOpen
            ? `Open ${reference.label}`
            : `Copy ${reference.label} Link`
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
              externalOpen(reference.url)
            } else {
              setShouldOpen(true)
              // in theory we should save this timeout in a ref and deal with it upon unmount. in practice it doesn't matter
              setTimeout(() => {
                setShouldOpen(false)
              }, 5000)
              reference.onCopy()
            }
          }}
        />
      </Tooltip>
      {reference.content}
    </>
  )
}

function CreateDropdown({ }: {}) {
  const openDraft = useOpenDraft('push')
  return (
    <Button size="$2" icon={FilePlus2} onPress={() => {
      openDraft()
    }}
    >
      Create
    </Button>
  )
}

export function PageActionButtons(props: TitleBarProps) {
  const route = useNavRoute()

  let buttonGroup: ReactNode[] = [<CreateDropdown key="create" />]
  if (route.key === 'draft') {
    buttonGroup = [<DraftPublicationButtons key="draftPublication" />]
  } else if (route.key == 'contacts') {
    buttonGroup = [
      <ContactsPrompt key="addContact" />,
      <CreateDropdown key="create" />,
    ]
  } else if (route.key == 'account' && route.tab === 'groups') {
    buttonGroup = [<CreateDropdown key="create" />]
  } else if (route.key === 'publication') {
    buttonGroup = [
      <VersionContext key="versionContext" route={route} />,
      <PublicationVariants key="variants" route={route} />,
      <CreateDropdown key="create" />,
      <DocOptionsButton key="options" />,
    ]
  } else if (route.key === 'account') {
    buttonGroup = [
      <EditAccountButton key="editAccount" />,
      <CreateDropdown key="create" />,
      <AccountOptionsButton key="accountOptions" />,
    ]
  }
  return <TitlebarSection>{buttonGroup}</TitlebarSection>
}

export function NavigationButtons() {
  const state = useNavigationState()
  const dispatch = useNavigationDispatch()
  if (!state) return null
  return (
    <XStack className="no-window-drag">
      <XGroup>
        <XGroup.Item>
          <Button
            size="$2"
            onPress={() => dispatch({ type: 'pop' })}
            chromeless
            cursor={state.routeIndex <= 0 ? 'default' : 'pointer'}
            disabled={state.routeIndex <= 0}
            opacity={state.routeIndex <= 0 ? 0.5 : 1}
            icon={Back}
          />
        </XGroup.Item>
        <XGroup.Item>
          <Button
            size="$2"
            onPress={() => dispatch({ type: 'forward' })}
            chromeless
            cursor={
              state.routeIndex >= state.routes.length - 1
                ? 'default'
                : 'pointer'
            }
            disabled={state.routeIndex >= state.routes.length - 1}
            opacity={state.routeIndex >= state.routes.length - 1 ? 0.5 : 1}
            icon={Forward}
          />
        </XGroup.Item>
      </XGroup>
    </XStack>
  )
}

export function NavMenuButton({ left }: { left?: ReactNode }) {
  const ctx = useSidebarContext()
  const isLocked = useStream(ctx.isLocked)
  const isHoverVisible = useStream(ctx.isHoverVisible)
  let icon = Menu
  let tooltip = 'Lock Sidebar Open'
  let onPress = ctx.onLockSidebarOpen
  let key = 'lock'
  let color: undefined | ColorProp = undefined
  if (isLocked) {
    icon = ArrowLeftFromLine
    tooltip = 'Close Sidebar'
    onPress = ctx.onCloseSidebar
    key = 'close'
    color = '$color9'
  }
  if (!isLocked && isHoverVisible) {
    icon = ArrowRightFromLine
  }

  return (
    <XStack
      marginLeft="$2"
      // intention here is to hide the "close sidebar" button when the sidebar is locked, but the group="item" causes layout issues
      // group="item"
      justifyContent="space-between"
      width={
        isLocked
          ? SidebarWidth - 9 // not sure why this -9 is needed, but it makes the "close sidebar" button properly aligned with the sidebar width
          : 'auto'
      }
    >
      {left || <View />}
      <XStack position="relative" zIndex={1000} className="no-window-drag">
        <Tooltip
          content={tooltip}
          key={key} // use this key to make sure the component is unmounted when changes, to blur the button and make tooltip disappear
        >
          <Button
            backgroundColor="$colorTransparent"
            size="$2"
            key={key}
            icon={icon}
            color={color}
            // intention here is to hide the button when the sidebar is locked, but the group="item" causes layout issues
            // {...(key === 'close'
            //   ? {opacity: 0, '$group-item-hover': {opacity: 1}}
            //   : {})}
            chromeless={isLocked}
            onMouseEnter={ctx.onMenuHover}
            onMouseLeave={ctx.onMenuHoverLeave}
            onPress={onPress}
          />
        </Tooltip>
      </XStack>
    </XStack>
  )
}
