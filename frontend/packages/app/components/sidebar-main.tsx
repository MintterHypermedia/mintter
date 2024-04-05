import {AuthorVariant, GroupVariant} from '@mintter/shared'
import {Home, Separator, Tooltip, View, YGroup} from '@mintter/ui'
import {Contact, FileText, Library, Sparkles, Star} from '@tamagui/lucide-icons'
import {useMyAccount} from '../models/accounts'
import {usePublication, usePublicationEmbeds} from '../models/documents'
import {useNavRoute} from '../utils/navigation'
import {useNavigate} from '../utils/useNavigate'
import {CreateGroupButton} from './new-group'
import {
  activeDocOutline,
  GenericSidebarContainer,
  getDocOutline,
  MyAccountItem,
  NewDocumentButton,
  SidebarItem,
} from './sidebar-base'

export function MainAppSidebar({
  onSelectGroupId,
  onSelectAccountId,
}: {
  onSelectGroupId: null | ((groupId: string) => void)
  onSelectAccountId: null | ((accountId: string) => void)
}) {
  const route = useNavRoute()
  const navigate = useNavigate()
  const replace = useNavigate('replace')
  const account = useMyAccount()

  const pubRoute = route.key === 'publication' ? route : null
  const pubAuthorVariants = pubRoute?.variants?.filter(
    (variant) => variant.key === 'author',
  ) as AuthorVariant[] | undefined
  const pubGroupVariants = pubRoute?.variants?.filter(
    (variant) => variant.key === 'group',
  ) as GroupVariant[] | undefined
  if (pubGroupVariants && pubGroupVariants.length > 1) {
    throw new Error('Multiple group variants not currently supported')
  }
  if (
    pubAuthorVariants &&
    pubAuthorVariants.length > 1 &&
    pubGroupVariants &&
    pubGroupVariants.length > 1
  ) {
    throw new Error(
      'Combined author and group variants not currently supported',
    )
  }
  const myAccount = useMyAccount()
  const accountRoute = route.key === 'account' ? route : null
  const activeBlock = accountRoute?.blockId
  const myProfileDoc = usePublication(
    {
      id: myAccount.data?.profile?.rootDocument,
    },
    {
      keepPreviousData: false,
    },
  )
  const myProfileDocEmbeds = usePublicationEmbeds(
    myProfileDoc.data,
    !!myProfileDoc.data,
    {skipCards: true},
  )
  const frontDocOutline = getDocOutline(
    myProfileDoc?.data?.document?.children || [],
    myProfileDocEmbeds,
  )
  const {outlineContent, isBlockActive} = activeDocOutline(
    frontDocOutline,
    activeBlock,
    myProfileDocEmbeds,
    (blockId) => {
      const myAccountId = myAccount.data?.id
      if (!myAccountId) return
      const accountRoute =
        route.key == 'account' && myAccountId === route.accountId ? route : null
      if (!accountRoute) {
        navigate({
          key: 'account',
          accountId: myAccountId,
          blockId,
        })
      } else {
        replace({
          ...accountRoute,
          blockId,
        })
      }
    },
    navigate,
  )
  return (
    <GenericSidebarContainer>
      <YGroup
        separator={<Separator />}
        borderRadius={0}
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        {account.data && (
          <YGroup.Item>
            <MyAccountItem
              active={
                route.key == 'account' &&
                route.accountId == myAccount.data?.id &&
                !isBlockActive
              }
              account={account.data}
              onRoute={navigate}
            />
          </YGroup.Item>
        )}
        <YGroup borderRadius={0}>{outlineContent}</YGroup>
        <YGroup.Item>
          <SidebarItem
            active={route.key == 'feed'}
            onPress={() => {
              navigate({key: 'feed', tab: 'trusted'})
            }}
            title="Home Feed"
            bold
            icon={Home}
          />
        </YGroup.Item>
        <YGroup.Item>
          <SidebarItem
            active={route.key == 'documents'}
            data-testid="menu-item-global"
            onPress={() => {
              navigate({key: 'documents', tab: 'mine'})
            }}
            title="Documents"
            bold
            icon={FileText}
            rightHover={[<NewDocumentButton key="newDoc" />]}
          />
        </YGroup.Item>

        <YGroup.Item>
          <SidebarItem
            active={route.key == 'groups'}
            onPress={() => {
              navigate({key: 'groups'})
            }}
            title="Groups"
            bold
            icon={Library}
            rightHover={[
              <Tooltip content="New Group" key="newGroup">
                {/* Tooltip broken without this extra child View */}
                <View>
                  <CreateGroupButton chromeless />
                </View>
              </Tooltip>,
            ]}
          />
        </YGroup.Item>

        <YGroup.Item>
          <SidebarItem
            active={route.key == 'explore'}
            onPress={() => {
              navigate({key: 'explore', tab: 'docs'})
            }}
            title="Explore Content"
            bold
            icon={Sparkles}
            rightHover={[]}
          />
        </YGroup.Item>
        <YGroup.Item>
          <SidebarItem
            active={route.key == 'favorites'}
            onPress={() => {
              navigate({key: 'favorites'})
            }}
            title="Favorites"
            bold
            icon={Star}
            rightHover={[]}
          />
        </YGroup.Item>

        <YGroup.Item>
          <SidebarItem
            active={route.key == 'contacts'}
            onPress={() => {
              navigate({key: 'contacts'})
            }}
            icon={Contact}
            title="Contacts"
            bold
          />
        </YGroup.Item>
      </YGroup>
    </GenericSidebarContainer>
  )
}
