import {useMyAccount} from '@mintter/app/models/accounts'
import {
  useDraftTitle,
  usePublication,
  usePublishDraft,
} from '@mintter/app/models/documents'
import {
  useAccountGroups,
  useDocumentGroups,
  useGroup,
  useGroups,
  useMyGroups,
  usePublishDocToGroup,
} from '@mintter/app/models/groups'
import {useDaemonReady} from '@mintter/app/node-status-context'
import {usePopoverState} from '@mintter/app/use-popover-state'
import {
  DraftRoute,
  GroupPublicationRouteContext,
  GroupRoute,
  NavContextProvider,
  NavRoute,
  PublicationRoute,
  useNavRoute,
  useNavigate,
  useNavigation,
} from '@mintter/app/utils/navigation'
import {
  Button,
  ButtonText,
  Check,
  Dialog,
  DialogProps,
  DialogTitle,
  Fieldset,
  Form,
  Globe,
  Input,
  Label,
  Popover,
  PopoverTrigger,
  Select,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
  styled,
} from '@mintter/ui'
import {
  Album,
  Book,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
} from '@tamagui/lucide-icons'
import {useEffect, useMemo, useState} from 'react'
import toast from 'react-hot-toast'
import DiscardDraftButton from './discard-draft-button'
import {pathNameify} from '@mintter/app/utils/path'
import {useAppDialog} from '../dialog'
import {RenamePubDialog} from '@mintter/app/pages/group'
import {usePublicationInContext} from '@mintter/app/models/publication'

// function DraftPublicationDialog({
//   draft,
// }: {
//   draft?: EditorDraftState | undefined
// }) {
//   const sites = useSiteList()
//   const sitesList = sites.data || []
//   const foundSiteHostname = sitesList.find(
//     (site) => site.hostname === draft?.webUrl,
//   )
//   const writeSiteUrl = useWriteDraftWebUrl(draft?.id)

//   return (
//     <>
//       <SizableText size="$3" fontWeight="700" theme="mint">
//         Publish to:
//       </SizableText>
//       <Button
//         size="$4"
//         onPress={() => {
//           writeSiteUrl.mutate('')
//         }}
//         textProps={{flex: 1}}
//         icon={Globe}
//         iconAfter={foundSiteHostname == null ? Check : undefined}
//       >
//         Public Network
//       </Button>
//       {sitesList?.map((site) => {
//         return (
//           <Button
//             size="$4"
//             key={site.hostname}
//             onPress={() => {
//               writeSiteUrl.mutate(site.hostname)
//             }}
//             textProps={{flex: 1}}
//             icon={Globe}
//             iconAfter={
//               foundSiteHostname?.hostname === site.hostname ? Check : undefined
//             }
//           >
//             {hostnameStripProtocol(site.hostname)}
//           </Button>
//         )
//       })}
//     </>
//   )
// }

function GroupPublishDialog({
  input,
  dialogState,
}: {
  input: {
    docId: string
    version: string | undefined
    editDraftId?: string | undefined
    docTitle: string | undefined
  }
  dialogState: DialogProps
}) {
  const groupQuery = useGroups()
  const groups = groupQuery.data?.groups
  const account = useMyAccount()
  const accountId = account.data?.id
  const myGroups = useMemo(() => {
    if (!groups || !accountId) return undefined
    return groups.filter((group) => group.ownerAccountId === accountId)
  }, [groups, accountId])
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()
  useEffect(() => {
    if (myGroups?.length && !selectedGroupId)
      setSelectedGroupId(myGroups[0]?.id)
  }, [myGroups, selectedGroupId])
  const defaultPathName = pathNameify(input.docTitle || '')
  const [pathName, setPathName] = useState(defaultPathName)
  const route = useNavRoute()
  const navigate = useNavigate('replace')
  const draftRoute = route.key === 'draft' ? route : null
  const pubRoute = route.key === 'publication' ? route : null
  const publishToGroup = usePublishDocToGroup()
  if (!myGroups) return <Spinner />
  return (
    <Form
      onSubmit={() => {
        console.log('submit ' + selectedGroupId)
        if (!selectedGroupId) {
          toast.error('Please select a group')
          return
        }
        if (pubRoute && input.version && !input.editDraftId) {
          // we are in a publication and we are expected to immediately put this in the group
          toast
            .promise(
              publishToGroup
                .mutateAsync({
                  groupId: selectedGroupId,
                  docId: input.docId,
                  version: input.version,
                  pathName,
                })
                .then(() => {
                  navigate({
                    ...pubRoute,
                    pubContext: {
                      key: 'group',
                      groupId: selectedGroupId,
                      pathName,
                    },
                  })
                }),
              {
                loading: 'Publishing...',
                success: 'Published to Group',
                error: 'Failed to Publish!',
              },
            )
            .finally(() => {
              dialogState.onOpenChange?.(false)
            })
        } else if (draftRoute) {
          // we are in a draft and we are only setting the group ID and pathName in the route
          navigate({
            ...draftRoute,
            pubContext: {
              key: 'group',
              groupId: selectedGroupId,
              pathName,
            },
          })
          dialogState.onOpenChange?.(false)
        }
      }}
    >
      <DialogTitle>Publish to Group</DialogTitle>

      <Fieldset gap="$2" horizontal borderColor="transparent">
        <Label htmlFor="group">Group</Label>
        <Select
          id="group-id"
          value={selectedGroupId}
          onValueChange={setSelectedGroupId}
        >
          <Select.Trigger width={265}>
            <Select.Value placeholder="Select Group.." />
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
            </Select.ScrollUpButton>
            <Select.Viewport
              // to do animations:
              animation="quick"
              animateOnly={['transform', 'opacity']}
              enterStyle={{opacity: 0, y: -10}}
              exitStyle={{opacity: 0, y: 10}}
              minWidth={200}
            >
              {myGroups?.map((group, index) => (
                <Select.Item index={index} value={group.id} key={group.id}>
                  <Select.ItemText>{group.title}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3"
            >
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </Fieldset>

      <Fieldset gap="$4" horizontal borderColor="transparent">
        <Label htmlFor="path">Path / Shortname</Label>
        <Input id="path" value={pathName} onChangeText={setPathName} />
      </Fieldset>

      <Form.Trigger asChild>
        <Button>Submit</Button>
      </Form.Trigger>
    </Form>
  )
}

const ContextPopover = styled(Popover, {
  name: 'ContextPopover',
  size: '$5',
  allowFlip: true,
  placement: 'bottom-start',
  keepChildrenMounted: true,
})

const ContextPopoverContent = styled(Popover.Content, {
  padding: '$2',
  name: 'ContextPopoverContent',
  borderWidth: 1,
  borderColor: '$borderColor',
  elevation: '$2',
  enterStyle: {y: -10, opacity: 0},
  exitStyle: {y: -10, opacity: 0},
  elevate: true,
  animation: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})

const ContextPopoverArrow = styled(Popover.Arrow, {
  name: 'ContextPopoverArrow',
  borderWidth: 1,
  borderColor: '$borderColor',
})

function GroupContextButton({route}: {route: GroupRoute}) {
  const group = useGroup(route.groupId)
  if (!group.data) return null
  return (
    <Button size="$2" icon={Book} disabled>
      {group.data.title}
    </Button>
  )
}

function DraftContextButton({route}: {route: DraftRoute}) {
  const dialogState = usePopoverState(false)
  const account = useMyAccount()
  const nav = useNavigate('replace')
  const groups = useAccountGroups(account?.data?.id)
  const draftTitle = useDraftTitle({documentId: route.draftId})
  const groupPubContext =
    route.pubContext?.key === 'group' ? route.pubContext : null
  const selectedGroup = groupPubContext
    ? groups.data?.items?.find(
        (item) => item.group?.id === groupPubContext.groupId,
      )
    : undefined
  let icon = Globe
  let title = ''
  if (route.pubContext?.key === 'trusted') {
    icon = Album
  } else if (route.pubContext?.key === 'group' && selectedGroup) {
    icon = Book
    title = selectedGroup.group?.title || ''
  }
  const [isListingGroups, setIsListingGroups] = useState(false)
  let displayPathName =
    route.pubContext?.key === 'group' ? route.pubContext?.pathName : undefined
  if (!displayPathName && draftTitle) {
    displayPathName = pathNameify(draftTitle)
  }
  return (
    <ContextPopover>
      <PopoverTrigger asChild>
        <Button size="$2" icon={icon}>
          {title}
        </Button>
      </PopoverTrigger>
      <ContextPopoverContent>
        <ContextPopoverArrow />
        <YStack space="$2">
          {route.pubContext?.key === 'group' ? (
            <>
              <SizableText size="$2">Committing to Group:</SizableText>
              <GroupContextItem
                groupId={route.pubContext.groupId}
                path={displayPathName || null}
                onPathPress={() => {}}
                route={route}
              />
            </>
          ) : null}

          <ContextButton
            icon={Globe}
            name="Publish Independently"
            route={{...route, pubContext: null}}
            isActive={route.pubContext?.key !== 'group'}
          />
          <Button
            size="$3"
            icon={Book}
            onPress={() => {
              nav({...route, pubContext: null})
              setIsListingGroups((is) => !is)
            }}
            justifyContent="flex-start"
            color={'$color11'}
            chromeless
            iconAfter={isListingGroups ? ChevronUp : ChevronDown}
          >
            Publish to Group...
          </Button>
          {isListingGroups &&
            (groups.data?.items?.length === 0 ? (
              <Text>You have no groups yet</Text>
            ) : (
              groups.data?.items?.map((item) => {
                const groupId = item.group?.id
                if (!groupId) return null
                const isActive =
                  groupPubContext?.key === 'group' &&
                  groupId === groupPubContext.groupId
                return (
                  <Button
                    key={groupId}
                    size="$2"
                    marginHorizontal="$2"
                    justifyContent="flex-start"
                    icon={Book}
                    onPress={() => {
                      setIsListingGroups(false)
                      nav({
                        ...route,
                        pubContext: {key: 'group', groupId, pathName: ''},
                      })
                    }}
                    iconAfter={isActive ? CheckCheck : undefined}
                  >
                    {item.group?.title}
                  </Button>
                )
              })
            ))}
        </YStack>
      </ContextPopoverContent>
    </ContextPopover>
  )
}

function GroupContextItem({
  groupId,
  groupVersion,
  path,
  route,
  onPathPress,
}: {
  groupId: string
  groupVersion?: string | undefined
  path: string | null
  route: PublicationRoute | DraftRoute
  onPathPress?: (() => void) | undefined
}) {
  const replaceRoute = useNavigate('replace')
  const group = useGroup(groupId)
  const isActive =
    route.pubContext?.key === 'group' &&
    groupId === route.pubContext.groupId &&
    path === route.pubContext.pathName
  const myGroups = useMyGroups()
  const isGroupMember = myGroups.data?.items?.find((groupAccount) => {
    return groupAccount.group?.id === groupId
  })
  const isPathPressable = isActive && isGroupMember && onPathPress
  return (
    <XStack alignItems="center" gap="$2">
      <Button
        size="$3"
        justifyContent="flex-start"
        icon={Book}
        flex={1}
        color={isActive ? undefined : '$color11'}
        onPress={() => {
          replaceRoute({
            ...route,
            ...(route.key === 'publication'
              ? {
                  versionId: undefined,
                }
              : {}),
            pubContext: {
              key: 'group',
              groupId: groupId,
              groupVersion,
              pathName: path,
            },
          })
        }}
      >
        <YStack alignItems="flex-start">
          <Text fontSize={10} color={isActive ? undefined : '$color9'}>
            {group.data?.title}
          </Text>
          <ButtonText
            fontSize={10}
            color="$color9"
            marginVertical={0}
            disabled={!isPathPressable}
            onPress={
              isPathPressable
                ? (e) => {
                    e.stopPropagation()
                    onPathPress()
                  }
                : undefined
            }
            hoverStyle={
              isPathPressable
                ? {
                    textDecorationLine: 'underline',
                  }
                : {}
            }
          >
            {path}
          </ButtonText>
        </YStack>
      </Button>
    </XStack>
  )
}

function ContextButton({
  name,
  route,
  icon,
  isActive,
}: {
  name: string
  icon: typeof Globe
  isActive: boolean
  route: NavRoute
}) {
  const replaceRoute = useNavigate('replace')
  return (
    <Button
      size="$3"
      icon={icon}
      onPress={() => {
        replaceRoute(route)
      }}
      justifyContent="flex-start"
      color={isActive ? undefined : '$color11'}
      chromeless
      aria-selected={isActive}
    >
      {name}
    </Button>
  )
}

function PublicationContextButton({route}: {route: PublicationRoute}) {
  const publication = usePublicationInContext({
    documentId: route.documentId,
    versionId: route.versionId,
    pubContext: route.pubContext,
  })
  const {pubContext} = route
  const contextGroup = useGroup(
    pubContext?.key === 'group' ? pubContext.groupId : undefined,
  )
  let icon = Globe
  let title = ''
  if (pubContext?.key === 'trusted') {
    icon = Album
  } else if (pubContext?.key === 'group') {
    icon = Book
    title = contextGroup.data?.title || ''
  }
  const docId = route.documentId
  const docVersion = route.versionId || publication.data?.version
  const docGroups = useDocumentGroups(route.documentId)
  const popoverState = usePopoverState(false)
  const publishDialogState = usePopoverState(false, (isOpen) => {
    isOpen && popoverState.onOpenChange(false)
  })
  const renameDialog = useAppDialog(RenamePubDialog)

  return (
    <>
      <ContextPopover {...popoverState}>
        <PopoverTrigger asChild>
          <Button size="$2" icon={icon}>
            {title}
          </Button>
        </PopoverTrigger>
        <ContextPopoverContent>
          <ContextPopoverArrow />
          <YStack space="$2">
            <ContextButton
              icon={Globe}
              name="All Authors"
              route={{...route, pubContext: null}}
              isActive={!route.pubContext?.key}
            />
            <ContextButton
              icon={Album}
              name="Trusted Authors"
              route={{...route, pubContext: {key: 'trusted'}}}
              isActive={route.pubContext?.key === 'trusted'}
            />
            {docGroups.data?.length ? (
              <>
                <SizableText size="$2">Appears in:</SizableText>
                <YStack gap="$2">
                  {docGroups.data?.map((docGroup) => {
                    return (
                      <GroupContextItem
                        groupId={docGroup.groupId}
                        groupVersion={docGroup.changeId}
                        path={docGroup.path}
                        route={route}
                        onPathPress={() => {
                          renameDialog.open({
                            groupId: docGroup.groupId,
                            pathName: docGroup.path,
                            docTitle: publication.data?.document?.title || '',
                          })
                        }}
                        key={`${docGroup.groupId}-${docGroup.path}`}
                      />
                    )
                  })}
                </YStack>
              </>
            ) : null}
            <PublishDialogInstance
              docId={docId}
              version={docVersion}
              docTitle={publication.data?.document?.title}
              groupPubContext={
                route.pubContext?.key === 'group' ? route.pubContext : null
              }
              {...publishDialogState}
            />
          </YStack>
        </ContextPopoverContent>
      </ContextPopover>
      {renameDialog.content}
    </>
  )
}

export function PageContextButton({}: {}) {
  const route = useNavRoute()
  if (route.key === 'draft') {
    return <DraftContextButton route={route} />
  }
  if (route.key === 'publication') {
    return <PublicationContextButton route={route} />
  }
  if (route.key === 'group') {
    return <GroupContextButton route={route} />
  }
  return null
}

function PublishDialogInstance({
  closePopover,
  docId,
  version,
  editDraftId,
  groupPubContext,
  docTitle,
  ...props
}: DialogProps & {
  closePopover?: () => void
  docId: string
  version: string | undefined
  editDraftId?: string | undefined
  docTitle?: string | undefined
  groupPubContext: GroupPublicationRouteContext | null
}) {
  const nav = useNavigation()
  return (
    <Dialog
      modal
      {...props}
      onOpenChange={(open) => {
        props.onOpenChange?.(open)
        if (open) {
          closePopover?.()
        }
      }}
    >
      <Dialog.Trigger asChild>
        <ButtonText size="$2" color="$blue10">
          Publish to Group...
        </ButtonText>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
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
          gap
        >
          <NavContextProvider value={nav}>
            <GroupPublishDialog
              input={{docId, version, editDraftId, docTitle}}
              dialogState={props}
            />
          </NavContextProvider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

export function DraftPublicationButtons() {
  const route = useNavRoute()
  if (route.key !== 'draft')
    throw new Error('DraftPublicationButtons requires draft route')
  const draftId = route.draftId
  const groupRouteContext =
    route.pubContext?.key === 'group' ? route.pubContext : null
  let navReplace = useNavigate('replace')
  const isDaemonReady = useDaemonReady()
  const publish = usePublishDraft({
    onSuccess: (publishedDoc) => {
      if (!publishedDoc || !draftId) return
      navReplace({
        key: 'publication',
        documentId: draftId,
        versionId: publishedDoc.version,
        pubContext: route.pubContext,
      })
      toast.success('Document saved and set to public')
    },
    onError: (e: any) => {
      toast.error('Failed to publish: ' + e.message)
    },
  })
  return (
    <>
      <Button
        size="$2"
        disabled={!isDaemonReady}
        onPress={() => {
          publish.mutate({draftId})
        }}
        theme="green"
        icon={Check}
      >
        {groupRouteContext ? 'Commit to Group' : 'Commit'}
      </Button>
      <DiscardDraftButton />
    </>
  )
}
