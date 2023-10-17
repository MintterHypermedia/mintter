import {
  Account,
  DefaultStaticBlockUnknown,
  Group,
  StaticBlockNode,
  StaticEmbedProps,
  StaticGroup,
  blockStyles,
  createHmId,
  getBlockNodeById,
} from '@mintter/shared'
import {SizableText, UIAvatar, XStack, YStack} from '@mintter/ui'
import {Book} from '@tamagui/lucide-icons'
import {useMemo, PropsWithChildren} from 'react'
import {useAccount} from '../models/accounts'
import {usePublication} from '../models/documents'
import {useGroup} from '../models/groups'
import {getAvatarUrl} from '../utils/account-url'
import {NavRoute, unpackHmIdWithAppRoute} from '../utils/navigation'
import {useNavigate} from '../utils/useNavigate'
import {useOpenUrl} from '../open-url'

function EmbedWrapper(props: PropsWithChildren<{hmRef: string}>) {
  let spawn = useNavigate('spawn')
  return (
    <YStack
      {...blockStyles}
      className="block-static block-embed"
      hoverStyle={{
        cursor: 'pointer',
        backgroundColor: '$color5',
      }}
      overflow="hidden"
      borderRadius="$3"
      borderWidth={1}
      borderColor="$color5"
      onPress={() => {
        const unpacked = unpackHmIdWithAppRoute(props.hmRef)

        console.log(`== ~ EmbedWrapper ~ unpacked:`, unpacked)
        if (unpacked?.navRoute && unpacked?.scheme === 'hm') {
          spawn(unpacked?.navRoute)
        }
      }}
    >
      {props.children}
    </YStack>
  )
}

export function StaticBlockPublication(props: StaticEmbedProps) {
  const docId = props.type == 'd' ? createHmId('d', props.eid) : undefined
  const pub = usePublication({
    id: docId,
    version: props.version || undefined,
    enabled: !!docId,
  })
  const openUrl = useOpenUrl()
  let embedData = useMemo(() => {
    const {data} = pub

    const selectedBlock =
      props.blockRef && data?.document?.children
        ? getBlockNodeById(data.document.children, props.blockRef)
        : null

    const embedBlocks = selectedBlock
      ? [selectedBlock]
      : data?.document?.children

    return {
      ...pub,
      data: {
        publication: pub.data,
        embedBlocks,
      },
    }
  }, [props.blockRef, pub])

  return (
    <EmbedWrapper hmRef={props.id}>
      {embedData.data.embedBlocks?.length ? (
        <StaticGroup childrenType="group" marginLeft="-1.5em">
          {embedData.data.embedBlocks.map((bn, idx) => (
            <StaticBlockNode
              key={bn.block?.id}
              depth={1}
              blockNode={bn}
              childrenType="group"
              index={idx}
              embedDepth={1}
            />
          ))}
        </StaticGroup>
      ) : (
        <DefaultStaticBlockUnknown {...props} />
      )}
    </EmbedWrapper>
  )
}

export function StaticBlockGroup(props: StaticEmbedProps) {
  const groupId = props.type == 'g' ? createHmId('g', props.eid) : undefined
  const groupQuery = useGroup(groupId, props.version || undefined)
  const openUrl = useOpenUrl()

  return groupQuery.status == 'success' ? (
    <EmbedWrapper hmRef={props.id}>
      <XStack gap="$3" padding="$4" alignItems="flex-start">
        <XStack paddingVertical="$3">
          <Book size={36} />
        </XStack>
        <YStack justifyContent="center" flex={1}>
          <SizableText size="$1" opacity={0.5} flex={0}>
            Group
          </SizableText>
          <YStack gap="$2">
            <SizableText size="$6" fontWeight="bold">
              {groupQuery.data?.title}
            </SizableText>
            <SizableText size="$2">
              Some random group description...
            </SizableText>
          </YStack>
        </YStack>
      </XStack>
    </EmbedWrapper>
  ) : null
}

export function StaticBlockAccount(props: StaticEmbedProps) {
  const accountId = props.type == 'a' ? props.eid : undefined
  const accountHMId = props.type == 'a' ? createHmId('a', props.eid) : undefined
  const openUrl = useOpenUrl()
  const accountQuery = useAccount(accountId)

  return accountQuery.status == 'success' ? (
    <EmbedWrapper hmRef={props.id}>
      <XStack gap="$3" padding="$4" alignItems="flex-start">
        <XStack paddingVertical="$3">
          <UIAvatar
            id={accountQuery.data.id}
            size={36}
            label={accountQuery.data.profile?.alias}
            url={getAvatarUrl(accountQuery.data.profile?.avatar)}
          />
        </XStack>
        <YStack justifyContent="center" flex={1}>
          <SizableText size="$1" opacity={0.5} flex={0}>
            Account
          </SizableText>
          <YStack gap="$2">
            <SizableText size="$6" fontWeight="bold">
              {accountQuery.data?.profile?.alias}
            </SizableText>
            <SizableText size="$2">
              {accountQuery.data.profile?.bio}
            </SizableText>
          </YStack>
        </YStack>
      </XStack>
    </EmbedWrapper>
  ) : null
}
