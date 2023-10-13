import {
  Account,
  HMBlockFile,
  HMBlockNode,
  HMBlockVideo,
  HMGroup,
  HMPublication,
  Publication,
  UnpackedHypermediaId,
  createHmDocLink,
  formatBytes,
  getCIDFromIPFSUrl,
  groupDocUrl,
  unpackHmId,
  StaticBlockNode,
} from '@mintter/shared'
import {
  ArrowRight,
  Button,
  File,
  FontSizeTokens,
  PageSection,
  Share,
  SideSection,
  SideSectionTitle,
  SizableText,
  Tooltip,
  XStack,
  YStack,
  useMedia,
} from '@mintter/ui'
import {DehydratedState} from '@tanstack/react-query'
import {NextLink} from 'next-link'
import Head from 'next/head'
import {useMemo} from 'react'
import {WebTipping} from 'web-tipping'
import Footer from './footer'
import {PublicationMetadata} from './publication-metadata'
import {SiteHead} from './site-head'
import {trpc} from './trpc'

export type PublicationPageProps = {
  // documentId: string
  // version: string | null
  // metadata?: boolean
  trpcState: DehydratedState
}

export type PublicationPageData = {
  documentId: string
  version?: string
  publication?: Publication | null
  author?: Account | null
  editors: Array<Account | string | null> | null
}

let blockVerticalPadding: FontSizeTokens = '$4'
let blockHorizontalPadding: FontSizeTokens = '$4'
let blockBorderRadius = '$3'

function OpenInAppLink({url}: {url: string}) {
  return (
    <Button
      onPress={() => window.open(url, '_blank')}
      size="$2"
      chromeless
      icon={Share}
    >
      <XStack flex={1} alignItems="center">
        <SizableText size="$2">Open in Mintter app</SizableText>
      </XStack>
    </Button>
  )
}

export default function PublicationPage({
  pathName,
  documentId,
  version,
  contextGroup,
}: {
  pathName?: string
  documentId: string
  version?: string | null
  contextGroup?: HMGroup | null
}) {
  const media = useMedia()

  const publication = trpc.publication.get.useQuery({
    documentId: documentId,
    versionId: version || '',
  })

  const pub = publication.data?.publication
  return (
    <>
      <Head>
        <meta name="hypermedia-entity-id" content={pub?.document?.id} />
        <meta name="hypermedia-entity-version" content={pub?.version} />
        <meta name="hypermedia-entity-title" content={pub?.document?.title} />
      </Head>
      <SiteHead pageTitle={pub?.document?.title} />
      <PageSection.Root>
        <PublicationContextSidebar
          group={contextGroup}
          activePathName={pathName || ''}
          display={media.gtLg ? 'inherit' : 'none'}
        />

        <PageSection.Content>
          {pub ? (
            <PublicationContent publication={pub} />
          ) : publication.isLoading ? (
            <PublicationPlaceholder />
          ) : (
            <YStack
              padding="$4"
              borderRadius="$5"
              elevation="$1"
              borderColor="$color5"
              borderWidth={1}
              backgroundColor="$color3"
              gap="$3"
            >
              <SizableText size="$5" fontWeight="800" textAlign="center">
                Document not found.
              </SizableText>
              <SizableText color="$color9">
                Document Id: {documentId}
              </SizableText>
              <SizableText color="$color9">version: {version}</SizableText>
            </YStack>
          )}
        </PageSection.Content>
        <PageSection.Side paddingRight="$4">
          <YStack className="publication-sidenav-sticky">
            <PublicationMetadata publication={pub} pathName={pathName} />
            <WebTipping
              docId={documentId}
              editors={pub?.document?.editors || []}
            >
              <OpenInAppLink url={createHmDocLink(documentId, pub?.version)} />
            </WebTipping>
          </YStack>
        </PageSection.Side>

        <PublicationContextSidebar
          group={contextGroup}
          activePathName={pathName || ''}
          display={media.gtLg ? 'none' : 'inherit'}
        />
      </PageSection.Root>
      <Footer />
    </>
  )
}

function PublicationPlaceholder() {
  return (
    <YStack gap="$6">
      <BlockPlaceholder />
      <BlockPlaceholder />
      <BlockPlaceholder />
      <BlockPlaceholder />
    </YStack>
  )
}

function BlockPlaceholder() {
  return (
    <YStack gap="$3">
      <YStack width="90%" height={16} backgroundColor="$color6" />
      <YStack height={16} backgroundColor="$color6" />
      <YStack width="75%" height={16} backgroundColor="$color6" />
      <YStack width="60%" height={16} backgroundColor="$color6" />
    </YStack>
  )
}

export function PublicationContent({
  publication,
}: {
  publication: HMPublication | undefined
}) {
  // This removes the first block from the document content if it's not a media element (embed, image, video...)
  let blocks = useMemo(() => {
    let _b = publication?.document?.children

    if (
      !_b?.length ||
      (_b.length == 1 &&
        !['embed', 'image', 'video'].includes(_b[0].block?.type))
    )
      return []

    // check if the first block has content or not.
    if (
      _b[0].block?.type &&
      ['embed', 'image', 'video'].includes(_b[0].block?.type)
    )
      return _b

    let [_firstBlock, ...restBlocks] = _b

    if (_firstBlock.children?.length) {
      restBlocks = [..._firstBlock.children, ...restBlocks]
    }

    return restBlocks
  }, [publication?.document?.children])
  return (
    <YStack>
      {blocks.map((block, index) => (
        <StaticBlockNode
          block={block}
          key={block.block?.id || index}
          ctx={{
            enableBlockCopy: true,
            ref: {
              docId: publication?.document?.id,
              docVersion: publication?.version,
            },
          }}
        />
      ))}
    </YStack>
  )
}

export function useGroupContentUrl(
  groupEid: string | undefined,
  groupVersion?: string,
  pathName?: string,
) {
  const siteInfo = trpc.siteInfo.get.useQuery()
  if (!groupEid) return null
  const rootPathName = pathName === '/' ? '/' : pathName
  return siteInfo.data?.groupEid === groupEid
    ? rootPathName
    : groupDocUrl(groupEid, groupVersion, pathName || '/')
}

function GroupSidebarContentItem({
  item,
  groupVersion,
  groupId,
  activePathName,
}: {
  item: ContentItem
  groupVersion: string | undefined
  groupId: UnpackedHypermediaId
  activePathName: string
}) {
  const contentUrl = useGroupContentUrl(
    groupId.eid,
    groupVersion,
    item.pathName,
  )
  if (!contentUrl) return null
  return (
    <Button
      key={item.pathName}
      iconAfter={activePathName === item.pathName ? <ArrowRight /> : null}
      tag="a"
      href={contentUrl}
      size="$3"
      chromeless
      justifyContent="flex-start"
      backgroundColor={
        activePathName === item.pathName ? '$backgroundHover' : 'transparent'
      }
      hoverStyle={{
        backgroundColor: '$backgroundHover',
      }}
    >
      {item?.publication?.document?.title}
    </Button>
  )
}

type ContentItem = {
  publication: null | HMPublication
  pathName: string
  version: string
  docId: string
}

function GroupSidebarContent({
  group,
  activePathName,
  content,
}: {
  activePathName: string
  group?: HMGroup
  content?: Array<null | ContentItem>
}) {
  const groupId = group?.id ? unpackHmId(group?.id) : null
  return (
    <SideSection>
      {groupId?.eid ? (
        <XStack paddingHorizontal="$3">
          <SideSectionTitle>Site Content:</SideSectionTitle>
        </XStack>
      ) : null}
      {content?.map((item) => {
        if (!item || !groupId?.eid) return null
        return (
          <GroupSidebarContentItem
            key={item.docId}
            item={item}
            groupId={groupId}
            groupVersion={group?.version}
            activePathName={activePathName}
          />
        )
      })}
    </SideSection>
  )
}

function PublicationContextSidebar({
  group,
  activePathName,
  display,
  ...props
}: {
  group?: HMGroup | null
  activePathName: string
  display: any
}) {
  const groupContent = trpc.group.listContent.useQuery(
    {
      groupId: group?.id || '',
      version: group?.version || '',
    },
    {enabled: !!group?.id},
  )
  const groupSidebarContent = group ? (
    <GroupSidebarContent
      activePathName={activePathName}
      group={group}
      content={groupContent.data}
    />
  ) : null

  return display != 'none' ? (
    <PageSection.Side {...props}>{groupSidebarContent}</PageSection.Side>
  ) : null
}

export function StaticFileBlock({block}: {block: HMBlockFile}) {
  let cid = useMemo(() => getCIDFromIPFSUrl(block.ref), [block.ref])
  return (
    <NextLink
      href={`/ipfs/${cid}`}
      target="_blank"
      style={{textDecoration: 'none'}}
    >
      <Tooltip content={`Download ${block.attributes.name}`}>
        <YStack
          backgroundColor="$color3"
          borderColor="$color4"
          borderWidth={1}
          borderRadius={blockBorderRadius as any}
          // marginRight={blockHorizontalPadding}
          overflow="hidden"
          hoverStyle={{
            backgroundColor: '$color4',
          }}
        >
          <XStack
            borderWidth={0}
            outlineWidth={0}
            padding="$4"
            ai="center"
            space
          >
            <File size={18} />

            <SizableText
              size="$5"
              maxWidth="17em"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              userSelect="text"
            >
              {block.attributes.name}
            </SizableText>
            {block.attributes.size && (
              <SizableText
                paddingTop="$1"
                color="$color10"
                size="$2"
                minWidth="4.5em"
              >
                {formatBytes(parseInt(block.attributes.size))}
              </SizableText>
            )}
          </XStack>
        </YStack>
      </Tooltip>
    </NextLink>
  )
}

function StaticVideoBlock({
  block,
  isList,
}: {
  block: HMBlockVideo
  isList?: boolean
}) {
  const ref = block.ref || ''
  return ref ? (
    <YStack
      backgroundColor="$color3"
      borderColor="$color8"
      borderWidth={2}
      borderRadius="$2"
      overflow="hidden"
      hoverStyle={{
        backgroundColor: '$color4',
      }}
      paddingBottom="56.25%"
      position="relative"
      height={0}
    >
      {ref.startsWith('ipfs://') ? (
        <XStack
          tag="video"
          top={0}
          left={0}
          position="absolute"
          width="100%"
          height="100%"
          // @ts-expect-error
          contentEditable={false}
          playsInline
          controls
          preload="metadata"
        >
          <source
            src={`/ipfs/${block.ref.replace('ipfs://', '')}`}
            type={getSourceType(block.attributes.name)}
          />
          Something is wrong with the video file.
        </XStack>
      ) : (
        <XStack
          tag="iframe"
          top={0}
          left={0}
          position="absolute"
          width="100%"
          height="100%"
          // @ts-expect-error
          src={block.ref}
          frameBorder="0"
          allowFullScreen
        />
      )}
    </YStack>
  ) : null
}

function getSourceType(name?: string) {
  if (!name) return
  const nameArray = name.split('.')
  return `video/${nameArray[nameArray.length - 1]}`
}
