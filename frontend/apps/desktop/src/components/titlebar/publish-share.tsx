import {MINTTER_GATEWAY_URL} from '@app/constants'
import {useDraft, usePublication, usePublishDraft} from '@app/models/documents'
import {
  useDocPublications,
  useDocRepublish,
  useSiteList,
} from '@app/models/sites'
import {useDaemonReady} from '@app/node-status-context'
import {useNavigate, useNavRoute} from '@app/utils/navigation'
import {hostnameStripProtocol} from '@app/utils/site-hostname'
import {Box} from '@components/box'
import {AccessURLRow} from '@components/url'
import {Publication, WebPublicationRecord} from '@mintter/shared'
import {
  Button,
  Copy,
  ExternalLink,
  Globe,
  SizableText,
  Spinner,
} from '@mintter/ui'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {GestureReponderEvent} from '@tamagui/web'
import {UseQueryResult} from '@tanstack/react-query'
import {useMemo, useRef, useState} from 'react'
import toast from 'react-hot-toast'
import {usePublicationDialog} from './publication-dialog'
import {Tooltip} from '@components/tooltip'
import {copyTextToClipboard} from '@app/utils/copy-to-clipboard'

const forceProductionURL = true

function getMintterPublicURL(docId: string, version: string) {
  return `${
    import.meta.env.PROD || forceProductionURL
      ? MINTTER_GATEWAY_URL
      : 'http://localhost:3000'
  }/p/${docId}?v=${version}`
}

function MintterURLRow({doc}: {doc: Publication}) {
  const {url} = useMemo(
    () => ({
      url: doc.document
        ? getMintterPublicURL(doc.document.id, doc.version)
        : '',
    }),
    [doc],
  )

  return <AccessURLRow url={url} title={hostnameStripProtocol(url)} />
}

function PublishedURLs({
  publications,
  doc,
}: {
  publications: UseQueryResult<WebPublicationRecord[]>
  doc?: Publication
}) {
  if (!publications.data) {
    if (publications.isLoading) return <Spinner />
    if (publications.error)
      return <SizableText theme="red">Failed to load.</SizableText>
  }
  if (publications.data && publications.data?.length === 0 && doc?.document)
    //@ts-ignore
    return <MintterURLRow doc={doc} />
  return (
    <>
      <SizableText size="$3" fontWeight="700" theme="mint">
        Public on the Web:
      </SizableText>
      {publications.data?.map((pub) => {
        const shortHost = hostnameStripProtocol(pub.hostname)
        const displayURL = pub.path
          ? pub.path == '/'
            ? shortHost
            : `${shortHost}/${pub.path}`
          : `${shortHost}/p/${pub.documentId}`
        const fullURL = pub.path
          ? pub.path == '/'
            ? pub.hostname
            : `${pub.hostname}/${pub.path}?v=${pub.version}`
          : `${pub.hostname}/p/${pub.documentId}?v=${pub.version}`
        return (
          <AccessURLRow
            key={`${pub.documentId}/${pub.version}`}
            url={fullURL}
            title={displayURL}
          />
        )
      })}
    </>
  )
}

function PublishButtons({
  onPublish,
  publications,
}: {
  onPublish: (hostname: string) => void
  publications?: WebPublicationRecord[]
}) {
  const sites = useSiteList()
  const sitesList = sites.data?.filter(({hostname}) => {
    if (publications?.find((pub) => pub.hostname === hostname)) return false
    return true
  })
  if (sitesList?.length === 0) return null
  return (
    <>
      <SizableText size="$3" fontWeight="700" theme="mint">
        Publish to:
      </SizableText>
      {sitesList?.map((site) => {
        return (
          <Button
            size="$4"
            theme="mint"
            key={site.hostname}
            onPress={() => {
              onPublish(site.hostname)
            }}
            iconAfter={ExternalLink}
            textProps={{flex: 1}}
          >
            {hostnameStripProtocol(site.hostname)}
          </Button>
        )
      })}
    </>
  )
}

function PublishButton({
  webUrl,
  onPress,
  disabled,
  isDraft,
}: {
  webUrl?: null | string
  onPress: (e: GestureReponderEvent) => void
  disabled?: boolean
  isDraft?: boolean
}) {
  const draftActionLabel = webUrl
    ? `Publish to ${hostnameStripProtocol(webUrl)}`
    : 'Publish'
  return (
    <PopoverPrimitive.Trigger asChild disabled={disabled}>
      <Button
        size="$2"
        chromeless
        disabled={disabled}
        onPress={onPress}
        theme="green"
      >
        {isDraft ? null : <Globe size={16} />}
        {isDraft ? draftActionLabel : hostnameStripProtocol(webUrl) || null}
      </Button>
    </PopoverPrimitive.Trigger>
  )
}

function PublishShareContent({
  docId,
  publications,
  onPublish,
  publication,
}: {
  docId?: string
  publications: UseQueryResult<WebPublicationRecord[]>
  onPublish: (hostname: string) => void
  publication?: Publication
}) {
  return (
    <>
      {docId && <PublishedURLs publications={publications} doc={publication} />}
      <PublishButtons publications={publications.data} onPublish={onPublish} />
    </>
  )
}

export function PublishShareButton() {
  const route = useNavRoute()
  const isDraft = route.key == 'draft'
  const isPublication = route.key == 'publication'
  // I changed the otherwise return to an empty string because that way the useDraft hook will not complain
  const documentId =
    route.key == 'publication'
      ? route.documentId
      : route.key == 'draft'
      ? route.draftId
      : ''
  const versionId = route.key == 'publication' ? route.versionId : undefined
  const {data: loadedPub} = usePublication({
    documentId,
    versionId,
    enabled: route.key == 'publication',
  })
  const pub = route.key === 'publication' ? loadedPub : undefined
  const {data: draft} = useDraft({
    documentId,
    routeKey: route.key,
    enabled: route.key == 'draft' && !!documentId,
  })
  const draftId = route.key == 'draft' ? route.draftId : undefined
  const [isOpen, setIsOpen] = useState(false)
  const publicationDialog = usePublicationDialog()
  const isDaemonReady = useDaemonReady()
  const publications = useDocPublications(documentId)
  const publishedWebHost = pub?.document
    ? pub.document.webUrl || 'https://mintter.com'
    : null
  let isSaving = useRef(false)
  const republishDoc = useDocRepublish({
    onSuccess: (webPubs) => {
      if (!webPubs.length) return
      toast.success(
        `Document updated on ${webPubs
          .map((pub) => hostnameStripProtocol(pub.hostname))
          .join(', ')}`,
      )
    },
  })
  let navReplace = useNavigate('replace')
  const publish = usePublishDraft({
    onSuccess: (publishedDoc, doc) => {
      if (!publishedDoc) return

      navReplace({
        key: 'publication',
        documentId: doc,
        versionId: publishedDoc.version,
      })

      republishDoc.mutateAsync(publishedDoc)
      toast.success('Draft published Successfully!')
    },
  })

  let webUrl = useMemo(() => {
    return pub?.document?.webUrl || draft?.webUrl
  }, [route, pub, draft])

  let copyReferenceButton

  if (isPublication) {
    copyReferenceButton = (
      <Tooltip content="Copy document reference">
        <Button
          chromeless
          size="$2"
          onPress={() => {
            const {document, version} = pub || {}
            const {id, webUrl} = document || {}
            if (!id) throw new Error('No document id')
            if (!publishedWebHost) throw new Error('Document not loaded')
            let docUrl = `${publishedWebHost}/p/${id}?v=${version}`
            copyTextToClipboard(docUrl)
            toast.success('Copied document reference')
          }}
          icon={Copy}
        />
      </Tooltip>
    )
  }

  if (!isDraft && !isPublication) return null
  return (
    <>
      <PopoverPrimitive.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsOpen(true)
          } else {
            setIsOpen(false)
          }
        }}
      >
        <PublishButton
          webUrl={webUrl}
          disabled={!isDaemonReady || isSaving.current}
          isDraft={route.key === 'draft'}
          onPress={(e) => {
            e.preventDefault()
            if (isOpen) {
              setIsOpen(false)
              return
            }

            if (draftId) {
              publish.mutate(draftId)
            }

            setIsOpen(true)
          }}
        />

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="end"
            style={{
              zIndex: 200000,
            }}
          >
            <Box
              css={{
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                padding: '$4',
                margin: '$2',
                boxShadow: '$3',
                borderRadius: '$2',
                backgroundColor: '$primary-background-subtle',
                border: '1px solid blue',
                borderColor: '$primary-border-subtle',
                gap: '$4',
              }}
            >
              <PublishShareContent
                docId={pub?.document?.id}
                publications={publications}
                publication={pub}
                onPublish={(hostname) => {
                  setIsOpen(false)
                  publicationDialog.open(hostname)
                }}
              />
            </Box>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {copyReferenceButton}
      {publicationDialog.content}
    </>
  )
}
