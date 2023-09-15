import {EmptyList} from '@mintter/app/src/components/empty-list'
import Footer from '@mintter/app/src/components/footer'
import {PublicationListItem} from '@mintter/app/src/components/publication-list-item'
import {
  useDraftList,
  usePublicationList,
} from '@mintter/app/src/models/documents'
import {useOpenDraft} from '@mintter/app/src/utils/open-draft'
import {
  Button,
  Container,
  Delete,
  MainWrapper,
  SizableText,
  Spinner,
  YStack,
} from '@mintter/ui'

import {useAppContext} from '../app-context'
import {DeleteDocumentDialog} from '../components/delete-dialog'
import {useAppDialog} from '../components/dialog'
import {queryPublication} from '../models/documents'
import './publication-list-page.css'

export function PublicationListPage({trustedOnly}: {trustedOnly: boolean}) {
  let publications = usePublicationList({trustedOnly})
  let drafts = useDraftList()
  let {queryClient, grpcClient} = useAppContext()
  let openDraft = useOpenDraft('push')
  const pubs = publications.data?.publications

  const deleteDialog = useAppDialog(DeleteDocumentDialog, {isAlert: true})

  if (pubs) {
    if (pubs.length) {
      return (
        <>
          <MainWrapper>
            <Container>
              {pubs.map((publication) => {
                const docId = publication.document?.id
                if (!docId) return null
                return (
                  <PublicationListItem
                    pubContext={trustedOnly ? {key: 'trusted'} : null}
                    openRoute={{
                      key: 'publication',
                      documentId: docId,
                      versionId: publication.version,
                      pubContext: trustedOnly ? {key: 'trusted'} : null,
                    }}
                    key={publication.document?.id}
                    hasDraft={drafts.data?.documents.find(
                      (d) => d.id == publication.document?.id,
                    )}
                    onPointerEnter={() => {
                      if (publication.document?.id) {
                        queryClient.client.prefetchQuery(
                          queryPublication(
                            grpcClient,
                            publication.document.id,
                            publication.version,
                          ),
                        )
                      }
                    }}
                    publication={publication}
                    menuItems={[
                      {
                        key: 'delete',
                        label: 'Delete Publication',
                        icon: Delete,
                        onPress: () => {
                          deleteDialog.open(docId)
                        },
                      },
                    ]}
                  />
                )
              })}
            </Container>
            {deleteDialog.content}
          </MainWrapper>
          <Footer />
        </>
      )
    } else {
      return (
        <>
          <MainWrapper>
            <Container>
              <EmptyList
                description="You have no Publications yet."
                action={() => {
                  openDraft()
                }}
              />
            </Container>
          </MainWrapper>
          <Footer />
        </>
      )
    }
  }

  if (publications.error) {
    return (
      <MainWrapper>
        <Container>
          <YStack gap="$3" alignItems="flex-start" maxWidth={500} padding="$8">
            <SizableText fontFamily="$body" fontWeight="700" fontSize="$6">
              Publication List Error
            </SizableText>
            <SizableText fontFamily="$body" fontSize="$4">
              {JSON.stringify(publications.error)}
            </SizableText>
            <Button theme="yellow" onPress={() => publications.refetch()}>
              try again
            </Button>
          </YStack>
        </Container>
      </MainWrapper>
    )
  }

  return (
    <>
      <MainWrapper>
        <Container>
          <Spinner />
        </Container>
      </MainWrapper>
      <Footer />
    </>
  )
}

export default function TrustedPublicationList() {
  return <PublicationListPage trustedOnly={true} />
}
