import {AppBanner, BannerText} from '@mintter/app/components/app-banner'
import {AppError} from '@mintter/app/components/app-error'
import {CitationsAccessory} from '@mintter/app/components/citations'
import {CitationsProvider} from '@mintter/app/components/citations-context'
import Footer, {FooterButton} from '@mintter/app/components/footer'
import {useDocChanges} from '@mintter/app/models/changes'
import {useDocCitations} from '@mintter/app/models/content-graph'
import {useNavRoute} from '@mintter/app/utils/navigation'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {MttLink, StaticPublication, pluralS, unpackDocId} from '@mintter/shared'
import {
  Button,
  Comment,
  Link,
  MainWrapper,
  Text,
  XStack,
  YStack,
} from '@mintter/ui'
import {History} from '@tamagui/lucide-icons'
import {Allotment} from 'allotment'
import 'allotment/dist/style.css'
import {ErrorBoundary} from 'react-error-boundary'
import {EntityVersionsAccessory} from '../components/changes-list'
import {VersionChangesInfo} from '../components/version-changes-info'
import {usePublication} from '../models/documents'
import {usePublicationInContext} from '../models/publication'
import {DocumentPlaceholder} from './document-placeholder'

export default function PublicationPage() {
  return <PublicationPageEditor />
}

export function PublicationPageEditor() {
  const route = useNavRoute()
  if (route.key !== 'publication')
    throw new Error('Publication page expects publication actor')

  const docId = route?.documentId
  const version = route?.versionId
  const accessory = route?.accessory
  const accessoryKey = accessory?.key
  const replace = useNavigate('replace')
  if (!docId)
    throw new Error(
      `Publication route does not contain docId: ${JSON.stringify(route)}`,
    )
  const publication = usePublication({id: docId, version})

  const {data: changes} = useDocChanges(
    publication.status == 'success' ? docId : undefined,
  )
  const {data: citations} = useDocCitations(
    publication.status == 'success' ? docId : undefined,
  )

  if (publication.data) {
    return (
      <ErrorBoundary
        FallbackComponent={AppError}
        onReset={() => publication.refetch()}
      >
        <CitationsProvider
          documentId={docId}
          onCitationsOpen={(citations: Array<MttLink>) => {
            // todo, pass active citations into route
            replace({...route, accessory: {key: 'citations'}})
          }}
        >
          <Allotment
            key={`${accessory}`}
            defaultSizes={accessory ? [65, 35] : [100]}
          >
            <Allotment.Pane>
              <YStack height="100%">
                <MainWrapper>
                  <StaticPublication publication={publication.data} />
                  {version && (
                    <OutOfDateBanner docId={docId} version={version} />
                  )}
                </MainWrapper>
              </YStack>
            </Allotment.Pane>
            {accessoryKey &&
              (accessoryKey == 'versions' ? (
                <EntityVersionsAccessory
                  id={unpackDocId(docId)}
                  activeVersion={publication.data.version}
                />
              ) : (
                <CitationsAccessory docId={docId} version={version} />
              ))}
          </Allotment>
          <Footer>
            <XStack gap="$3" marginHorizontal="$3">
              {publication.data?.version && (
                <VersionChangesInfo version={publication.data?.version} />
              )}
            </XStack>

            <FooterButton
              active={accessoryKey === 'versions'}
              label={`${changes?.changes?.length} ${pluralS(
                changes?.changes?.length,
                'Version',
              )}`}
              icon={History}
              onPress={() => {
                if (route.accessory?.key === 'versions')
                  return replace({...route, accessory: null})
                replace({...route, accessory: {key: 'versions'}})
              }}
            />

            {citations?.links?.length ? (
              <FooterButton
                active={accessoryKey === 'citations'}
                label={`${citations?.links?.length} ${pluralS(
                  citations?.links?.length,
                  'Citation',
                )}`}
                icon={Link}
                onPress={() => {
                  if (route.accessory?.key === 'citations')
                    return replace({...route, accessory: null})
                  replace({...route, accessory: {key: 'citations'}})
                }}
              />
            ) : null}
            {false ? (
              <FooterButton
                active={accessoryKey === 'comments'}
                label={`Conversations`}
                icon={Comment}
                onPress={() => {
                  if (route.accessory?.key === 'comments')
                    return replace({...route, accessory: null})
                  replace({...route, accessory: {key: 'comments'}})
                }}
              />
            ) : null}
          </Footer>
        </CitationsProvider>
      </ErrorBoundary>
    )
  }

  if (publication.error) {
    return (
      <YStack>
        <YStack gap="$3" alignItems="flex-start" maxWidth={500} padding="$8">
          <Text fontFamily="$body" fontWeight="700" fontSize="$6">
            Publication ERROR
          </Text>
          <Text fontFamily="$body" fontSize="$4">
            {JSON.stringify(publication.error)}
          </Text>
          <Button theme="yellow" onPress={() => publication.refetch()}>
            try again
          </Button>
        </YStack>
      </YStack>
    )
  }

  return <DocumentPlaceholder />
}

function OutOfDateBanner({docId, version}: {docId: string; version: string}) {
  const route = useNavRoute()
  const pubContext = route.key === 'publication' ? route.pubContext : undefined
  const pub = usePublicationInContext({documentId: docId, pubContext})
  // const {data: pub, isLoading} = useLatestPublication({
  //   trustedVersionsOnly: pubContext?.key === 'trusted',
  //   documentId: docId,
  //   enabled: !!docId,
  // })

  const navigate = useNavigate()
  const pubAccessory = route.key === 'publication' ? route.accessory : undefined
  if (pub.isLoading) return null
  if (version === pub?.data?.version) return null
  if (pub?.data?.version) return null
  return (
    <AppBanner
      onPress={() => {
        navigate({
          key: 'publication',
          documentId: docId,
          accessory: pubAccessory,
          pubContext,
        })
      }}
    >
      <BannerText>
        There is a newer{' '}
        {pubContext?.key === 'trusted' ? 'trusted version' : 'version'} of this
        Publication{pubContext?.key === 'group' ? ' in this group' : ''}. Click
        here to go to latest →
      </BannerText>
    </AppBanner>
  )
}