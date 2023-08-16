import {useDraftTitle, usePublication} from '@mintter/app/src/models/documents'
import {
  DraftRoute,
  PublicationRoute,
  useNavRoute,
} from '@mintter/app/src/utils/navigation'
import {hostnameStripProtocol} from '@mintter/app/src/utils/site-hostname'
import {AccountLinkAvatar} from '@mintter/app/src/components/account-link-avatar'
import {
  File,
  FontSizeTokens,
  Globe,
  Pencil,
  Spinner,
  TitleText,
  User,
  XStack,
} from '@mintter/ui'
import {Folder} from '@tamagui/lucide-icons'
import {getDocumentTitle} from '../publication-list-item'
import {useEffect} from 'react'
import {NavRoute} from '../../utils/navigation'
import {useGroup} from '../../models/groups'

export function TitleContent({size = '$4'}: {size?: FontSizeTokens}) {
  const route = useNavRoute()

  useEffect(() => {
    async function getTitleOfRoute(route: NavRoute): Promise<string> {
      if (route.key === 'home') return 'Publications'
      if (route.key === 'drafts') return 'Drafts'
      if (route.key === 'contacts') return 'Contacts'
      return '?'
    }
    getTitleOfRoute(route).then((title) => {
      // we set the window title so the window manager knows the title in the Window menu
      // @ts-ignore
      window.document.title = title
    })
  }, [route])

  if (route.key === 'home') {
    return (
      <>
        <Folder size={12} />
        <TitleText size={size} data-testid="titlebar-title">
          Publications
        </TitleText>
      </>
    )
  }
  if (route.key === 'global-publications') {
    return (
      <>
        <Globe size={12} />
        <TitleText data-testid="titlebar-title" size={size}>
          Global Publications
        </TitleText>
      </>
    )
  }
  if (route.key === 'contacts') {
    return (
      <>
        <User size={12} />
        <TitleText data-testid="titlebar-title" size={size}>
          Contacts
        </TitleText>
      </>
    )
  }
  if (route.key === 'groups') {
    return (
      <>
        <Folder size={12} />
        <TitleText size={size}>Groups</TitleText>
      </>
    )
  }
  if (route.key === 'group') {
    return (
      <>
        <Folder size={12} />
        <GroupTitle groupId={route.groupId} size={size} />
      </>
    )
  }
  if (route.key === 'drafts') {
    return (
      <>
        <Pencil size={12} />
        <TitleText data-testid="titlebar-title" size={size}>
          Drafts
        </TitleText>
      </>
    )
  }
  if (route.key === 'account') {
    return (
      <TitleText data-testid="titlebar-title" size={size}>
        Account Profile
      </TitleText>
    )
  }
  if (route.key === 'site') {
    return (
      <TitleText data-testid="titlebar-title" size={size}>
        {hostnameStripProtocol(route.hostname)}
      </TitleText>
    )
  }
  if (route.key === 'publication') {
    return <PublicationTitle route={route} />
  }
  if (route.key === 'draft') {
    return <DraftTitle route={route} />
  }
  return null
}

export function Title({size}: {size?: FontSizeTokens}) {
  return (
    <XStack
      gap="$2"
      alignItems="center"
      margin="auto"
      marginVertical={0}
      paddingHorizontal="$4"
      flex={1}
      justifyContent="center"
    >
      <TitleContent size={size} />
    </XStack>
  )
}

function GroupTitle({groupId, size}: {groupId: string; size?: FontSizeTokens}) {
  const group = useGroup(groupId)
  if (group.isLoading) return <Spinner />
  return <TitleText size={size}>{group.data?.title}</TitleText>
}

function PublicationTitle({
  route,
  size = '$4',
}: {
  route: PublicationRoute
  size?: FontSizeTokens
}) {
  let {data: pub} = usePublication({
    documentId: route.documentId,
    versionId: route.versionId,
    enabled: !!route.documentId,
  })
  return (
    <>
      <TitleText data-testid="titlebar-title" size={size}>
        {getDocumentTitle(pub?.document)}
      </TitleText>
      <XStack gap={0} data-tauri-drag-region>
        {pub?.document?.editors.length === 0 ? (
          <AccountLinkAvatar accountId={pub?.document?.author} />
        ) : (
          pub?.document?.editors.map((editor) => (
            <AccountLinkAvatar accountId={editor} key={editor} />
          ))
        )}
      </XStack>
    </>
  )
}

function DraftTitle({
  route,
  size = '$4',
}: {
  route: DraftRoute
  size?: FontSizeTokens
}) {
  const title = useDraftTitle({
    documentId: route.draftId,
  })
  const displayTitle = title ?? 'Untitled Draft'
  return (
    <>
      <Pencil size={12} />
      <TitleText data-testid="titlebar-title" size={size}>
        {displayTitle}
      </TitleText>
    </>
  )
}
