import { HMAccount, UnpackedHypermediaId } from '@shm/shared'
import { List } from '@shm/ui'
import { useCopyGatewayReference } from '../components/copy-gateway-reference'
import Footer from '../components/footer'
import { copyLinkMenuItem } from '../components/list-item'
import { MainWrapperNoScroll } from '../components/main-wrapper'
import { PublicationListItem } from '../components/publication-list-item'
import { useAllAccounts } from '../models/accounts'
import { FavoriteItem, useFavorites } from '../models/favorites'
import { usePublicationVariant } from '../models/publication'
import { ContactItem } from './contacts-page'

export default function FavoritesPage() {
  const favorites = useFavorites()
  const allAccounts = useAllAccounts()
  const [copyContent, onCopy, host] = useCopyGatewayReference()

  return (
    <>
      <MainWrapperNoScroll>
        <List
          items={favorites}
          //   header={header}
          fixedItemHeight={52}
          onEndReached={() => {
            // publications.fetchNextPage()
          }}
          renderItem={({ item }) => {
            return (
              <FavoriteListItem
                key={item.url}
                item={item}
                onCopy={() => {
                  onCopy(item.id)
                }}
                allAccounts={allAccounts.data?.accounts}
              />
            )
          }}
        />
        {copyContent}
      </MainWrapperNoScroll>
      <Footer />
    </>
  )
}

function DocumentFavoriteItem({
  url,
  id,
  onCopy,
  allAccounts,
}: {
  url: string
  id: UnpackedHypermediaId
  onCopy: () => void
  allAccounts?: HMAccount[]
}) {
  if (id.type !== 'd') throw new Error('Not a document')
  const doc = usePublicationVariant({
    documentId: id.qid,
    versionId: id.version || undefined,
  })
  if (!doc.data?.publication) return null
  function findAccount(id?: string) {
    return allAccounts?.find((a) => a.id === id)
  }
  return (
    <PublicationListItem
      key={id.qid}
      publication={doc.data?.publication}
      hasDraft={undefined}
      author={findAccount(doc.data.publication?.document?.author)}
      editors={
        doc.data.publication?.document?.editors?.map((accountId) =>
          findAccount(accountId),
        ) || []
      }
      menuItems={() => [copyLinkMenuItem(onCopy, 'Document')]}
      openRoute={{
        key: 'document',
        documentId: id.qid,
        versionId: id.version || undefined,
      }}
    />
  )
}

function FavoriteListItem({
  item,
  onCopy,
  allAccounts,
}: {
  item: FavoriteItem
  onCopy: () => void
  allAccounts?: HMAccount[]
}) {
  if (item.key === 'account') {
    return <ContactItem account={item.account} onCopy={onCopy} />
  }
  if (item.key === 'document') {
    return (
      <DocumentFavoriteItem
        url={item.url}
        id={item.id}
        allAccounts={allAccounts}
        onCopy={onCopy}
      />
    )
  }
  return null
}
