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
  TitleText,
  User,
  XStack,
} from '@mintter/ui'
import {Folder} from '@tamagui/lucide-icons'

export function TitleContent({size = '$4'}: {size?: FontSizeTokens}) {
  const route = useNavRoute()
  if (route.key === 'home') {
    return (
      <>
        <Folder size={12} />
        <TitleText data-tauri-drag-region size={size}>
          Publications
        </TitleText>
      </>
    )
  }
  if (route.key === 'global-publications') {
    return (
      <>
        <Globe size={12} />
        <TitleText data-tauri-drag-region size={size}>
          Global Publications
        </TitleText>
      </>
    )
  }
  if (route.key === 'contacts') {
    return (
      <>
        <User size={12} />
        <TitleText data-tauri-drag-region size={size}>
          Contacts
        </TitleText>
      </>
    )
  }
  if (route.key === 'drafts') {
    return (
      <>
        <Pencil size={12} />
        <TitleText data-tauri-drag-region size={size}>
          Drafts
        </TitleText>
      </>
    )
  }
  if (route.key === 'account') {
    return (
      <TitleText data-tauri-drag-region size={size}>
        Account Profile
      </TitleText>
    )
  }
  if (route.key === 'site') {
    return (
      <TitleText data-tauri-drag-region size={size}>
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
      data-tauri-drag-region
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
      <TitleText data-tauri-drag-region size={size}>
        {pub?.document?.title || '...'}
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
      <TitleText data-tauri-drag-region size={size}>
        {displayTitle}
      </TitleText>
    </>
  )
}
