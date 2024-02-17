import {useNavRoute} from '@mintter/app/utils/navigation'
import {useClickNavigate} from '@mintter/app/utils/useNavigate'
import {
  Account,
  Document,
  GroupVariant,
  HMPublication,
  PublicationVariant,
  getDocumentTitle,
} from '@mintter/shared'
import {
  ArrowUpRight,
  Button,
  ButtonText,
  XStack,
  copyTextToClipboard,
} from '@mintter/ui'
import {NavRoute} from '../utils/routes'
import {useNavigate} from '../utils/useNavigate'
import {BaseAccountLinkAvatar} from './account-link-avatar'
import {ListItem, TimeAccessory} from './list-item'
import {MenuItemType} from './options-dropdown'

export function PublicationListItem({
  publication,
  hasDraft,
  variants,
  menuItems = () => [],
  onPointerEnter,
  pathName,
  openRoute,
  onPathNamePress,
  author,
  editors,
}: {
  publication: HMPublication
  copy?: typeof copyTextToClipboard
  hasDraft: Document | undefined
  variants?: PublicationVariant[]
  menuItems?: () => (MenuItemType | null)[]
  pathName?: string
  onPointerEnter?: () => void
  openRoute: NavRoute
  onPathNamePress?: () => void
  author: Account | string | undefined
  editors: (string | Account | undefined)[]
}) {
  const spawn = useNavigate('spawn')
  const title = getDocumentTitle(publication.document)
  const docId = publication.document?.id
  const route = useNavRoute()

  if (!docId) throw new Error('PublicationListItem requires id')

  const navigate = useClickNavigate()

  const groupVariant = variants?.find((v) => v.key === 'group') as
    | GroupVariant
    | undefined
  return (
    <ListItem
      onPress={() => {
        navigate(openRoute, event)
      }}
      title={title}
      onPointerEnter={onPointerEnter}
      accessory={
        <XStack gap="$3" ai="center">
          {hasDraft && (
            <Button
              theme="yellow"
              zIndex="$zIndex.5"
              onPress={(e) => {
                navigate(
                  {
                    key: 'draft',
                    draftId: hasDraft.id,
                    contextRoute: route,
                    variant: groupVariant,
                  },
                  e,
                )
              }}
              size="$1"
            >
              Resume Editing
            </Button>
          )}
          {pathName && (
            <ButtonText
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              flex={1}
              size="$2"
              color="$color9"
              onPress={(e) => {
                if (onPathNamePress) {
                  e.stopPropagation()
                  onPathNamePress()
                }
              }}
              hoverStyle={
                onPathNamePress
                  ? {
                      textDecorationLine: 'underline',
                    }
                  : undefined
              }
            >
              {pathName}
            </ButtonText>
          )}
          <XStack>
            {editors && editors.length
              ? editors.map((editor, idx) => {
                  const editorId =
                    typeof editor === 'string' ? editor : editor?.id
                  if (!editorId) return null
                  const account =
                    typeof editor === 'string' ? undefined : editor
                  return (
                    <XStack
                      zIndex={idx + 1}
                      key={editorId}
                      borderColor="$background"
                      backgroundColor="$background"
                      borderWidth={2}
                      borderRadius={100}
                      marginLeft={-8}
                      animation="fast"
                    >
                      <BaseAccountLinkAvatar
                        accountId={editorId}
                        account={account}
                      />
                    </XStack>
                  )
                })
              : null}
          </XStack>
          <TimeAccessory
            time={publication.document?.updateTime}
            onPress={() => {
              navigate(openRoute, event)
            }}
          />
        </XStack>
      }
      menuItems={() => [
        ...(menuItems?.() || []),
        {
          key: 'spawn',
          label: 'Open in New Window',
          icon: ArrowUpRight,
          onPress: () => {
            spawn(openRoute)
          },
        },
      ]}
    />
  )
}
