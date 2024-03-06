import {
  API_FILE_URL,
  BlockContentUnknown,
  BlockNodeContent,
  BlockNodeList,
  ContentEmbed,
  EmbedContentAccount,
  EmbedContentGroup,
  EntityComponentProps,
  InlineEmbedComponentProps,
  PublicationCardView,
  blockStyles,
  createHmId,
  formattedDateMedium,
  getBlockNodeById,
  usePublicationContentContext,
} from '@mintter/shared'
import {hmGroup} from '@mintter/shared/src/to-json-hm'
import {
  Button,
  SizableText,
  Spinner,
  UIAvatar,
  XStack,
  YStack,
} from '@mintter/ui'
import {ArrowUpRightSquare} from '@tamagui/lucide-icons'
import {ComponentProps, PropsWithChildren, useMemo, useState} from 'react'
import {useAccount} from '../models/accounts'
import {useComment} from '../models/comments'
import {useGroup} from '../models/groups'
import {usePublicationVariant} from '../models/publication'
import {useOpenUrl} from '../open-url'
import {getAvatarUrl} from '../utils/account-url'
import {useNavigate} from '../utils/useNavigate'
import {Avatar} from './avatar'

function EmbedWrapper({
  hmRef,
  children,
  ...props
}: PropsWithChildren<{hmRef: string} & ComponentProps<typeof YStack>>) {
  const {disableEmbedClick = false, layoutUnit} = usePublicationContentContext()
  const open = useOpenUrl()
  return (
    <YStack
      contentEditable={false}
      userSelect="none"
      {...blockStyles}
      className="block-embed"
      backgroundColor="$color4"
      hoverStyle={{
        cursor: 'pointer',
        backgroundColor: '$color5',
      }}
      margin={0}
      marginHorizontal={(-1 * layoutUnit) / 2}
      padding={layoutUnit / 2}
      overflow="hidden"
      borderRadius={layoutUnit / 4}
      onPress={
        !disableEmbedClick
          ? () => {
              open(hmRef, true)
            }
          : undefined
      }
      {...props}
    >
      {children}
    </YStack>
  )
}

export function EmbedPublicationContent(props: EntityComponentProps) {
  const docId = props.type == 'd' ? createHmId('d', props.eid) : undefined
  const [showReferenced, setShowReferenced] = useState(false)
  const pub = usePublicationVariant({
    documentId: docId,
    versionId:
      showReferenced && props.version
        ? props.version
        : props.latest
        ? undefined
        : props.version || undefined,
    variants: props.variants || undefined,
    enabled: !!docId,
  })
  const spawn = useNavigate('spawn')
  return (
    <ContentEmbed
      props={props}
      isLoading={pub.isInitialLoading}
      showReferenced={showReferenced}
      onShowReferenced={setShowReferenced}
      pub={pub.data?.publication}
      EmbedWrapper={EmbedWrapper}
      renderOpenButton={() =>
        docId && (
          <Button
            size="$2"
            icon={ArrowUpRightSquare}
            onPress={() => {
              if (!docId) return
              spawn({
                key: 'publication',
                documentId: docId,
                variants: props.variants || undefined,
                versionId: props.version || undefined,
              })
            }}
          >
            Open Document
          </Button>
        )
      }
    />
  )
}

export function EmbedPublicationCard(props: EntityComponentProps) {
  const docId = props.type == 'd' ? createHmId('d', props.eid) : undefined
  const pub = usePublicationVariant({
    documentId: docId,
    versionId: props.latest ? undefined : props.version || undefined,
    variants: props.variants || undefined,
    enabled: !!docId,
  })
  let textContent = useMemo(() => {
    if (pub.data?.publication?.document?.children) {
      let content = ''
      pub.data?.publication?.document?.children.forEach((bn) => {
        content += bn.block?.text + ' '
      })
      return content
    }
  }, [pub.data])

  return (
    <EmbedWrapper hmRef={props.id}>
      <PublicationCardView
        title={pub.data?.publication?.document?.title}
        textContent={textContent}
        editors={pub.data?.publication?.document?.editors || []}
        AvatarComponent={AvatarComponent}
        date={pub.data?.publication?.document?.updateTime}
      />
    </EmbedWrapper>
  )
}

export function EmbedComment(props: EntityComponentProps) {
  if (props?.type !== 'c')
    throw new Error('Invalid props as ref for EmbedComment')
  const comment = useComment(createHmId('c', props.eid), {
    enabled: !!props,
  })
  let embedBlocks = useMemo(() => {
    const selectedBlock =
      props.blockRef && comment.data?.content
        ? getBlockNodeById(comment.data.content, props.blockRef)
        : null

    const embedBlocks = selectedBlock ? [selectedBlock] : comment.data?.content

    return embedBlocks
  }, [props.blockRef, comment.data])
  const account = useAccount(comment.data?.author)
  if (comment.isLoading) return <Spinner />
  return (
    <EmbedWrapper hmRef={props.id}>
      <XStack flexWrap="wrap" jc="space-between">
        <XStack gap="$2">
          <UIAvatar
            label={account.data?.profile?.alias}
            id={account.data?.id}
            url={
              account.data?.profile?.avatar
                ? `${API_FILE_URL}/${account.data?.profile?.avatar}`
                : undefined
            }
          />
          <SizableText>{account.data?.profile?.alias}</SizableText>
        </XStack>
        {comment.data?.createTime ? (
          <SizableText fontSize="$2" color="$color10">
            {formattedDateMedium(comment.data.createTime)}
          </SizableText>
        ) : null}
      </XStack>
      {embedBlocks?.length ? (
        <BlockNodeList childrenType="group">
          {embedBlocks.map((bn, idx) => (
            <BlockNodeContent
              key={bn.block?.id}
              depth={1}
              blockNode={bn}
              childrenType="group"
              index={idx}
              embedDepth={1}
            />
          ))}
        </BlockNodeList>
      ) : (
        <BlockContentUnknown {...props} />
      )}
    </EmbedWrapper>
  )
}

function AvatarComponent({accountId}: {accountId: string}) {
  let {data: account} = useAccount(accountId)
  return (
    <Avatar
      label={account?.profile?.alias}
      id={accountId}
      url={getAvatarUrl(account?.profile?.avatar)}
    />
  )
}

export function EmbedGroup(props: EntityComponentProps) {
  const groupId = props.type == 'g' ? createHmId('g', props.eid) : undefined
  const groupQuery = useGroup(groupId, props.version || undefined)

  const group = hmGroup(groupQuery.data)
  return group && groupQuery.status == 'success' ? (
    <EmbedWrapper hmRef={props.id}>
      <EmbedContentGroup group={group} />
    </EmbedWrapper>
  ) : null
}

export function EmbedAccount(props: EntityComponentProps) {
  const accountId = props.type == 'a' ? props.eid : undefined
  const accountQuery = useAccount(accountId)

  return accountQuery.status == 'success' ? (
    <EmbedWrapper hmRef={props.id}>
      <EmbedContentAccount account={accountQuery.data!} />
    </EmbedWrapper>
  ) : null
}

export function AppInlineEmbed(props: InlineEmbedComponentProps) {
  const accountId = props?.type == 'a' ? props.eid : undefined
  if (!accountId) throw new Error('Invalid props at AppInlineEmbed (accountId)')
  const accountQuery = useAccount(accountId)
  const navigate = useNavigate()
  return (
    // pill style
    // <Button
    //   size="$2"
    //   m={2}
    //   p={2}
    //   chromeless
    //   theme="mint"
    //   onPress={() => navigate({key: 'account', accountId})}
    //   style={{display: 'inline-block', lineHeight: 1}}
    // >
    //   {(accountId &&
    //     accountQuery.status == 'success' &&
    //     `@${accountQuery.data?.profile?.alias}`) ||
    //     `@${accountId?.slice(0, 5) + '...' + accountId?.slice(-5)}`}
    // </Button>

    <Button
      m={0}
      p={0}
      chromeless
      className="hm-link"
      bg="$backgroundTransparent"
      hoverStyle={{
        bg: '$backgroundTransparent',
      }}
      onPress={() => navigate({key: 'account', accountId})}
      style={{display: 'inline-block', lineHeight: 1, fontSize: '1em'}}
    >
      {(accountId &&
        accountQuery.status == 'success' &&
        `@${accountQuery.data?.profile?.alias}`) ||
        `@${accountId?.slice(0, 5) + '...' + accountId?.slice(-5)}`}
    </Button>
  )
}
