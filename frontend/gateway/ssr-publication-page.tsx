import {Account, blockNodeToSlate, Publication, SiteInfo} from '@mintter/shared'
import {PublicationMetadata} from './author'
import {Container} from './container'
import Footer from './footer'
import {GatewayHead} from './gateway-head'
import {ArticleContainer, MainContainer, SideContainer} from './page-components'
import {SiteHead} from './site-head'
import {SlateReactPresentation} from './slate-react-presentation'
import {useRenderElement} from './slate-react-presentation/render-element'
import {useRenderLeaf} from './slate-react-presentation/render-leaf'

export default function PublicationPage({
  publication,
  metadata = true,
  author,
  siteInfo = null,
}: {
  publication?: Publication
  author?: Account | null
  metadata?: boolean
  siteInfo: SiteInfo | null
}) {
  const renderElement = useRenderElement()
  const renderLeaf = useRenderLeaf()
  const blockChildren = publication?.document?.children
  const slateChildren = blockChildren
    ? blockNodeToSlate(blockChildren, 'group')
    : undefined

  return (
    <>
      {siteInfo ? (
        <SiteHead siteInfo={siteInfo} title={publication?.document?.title} />
      ) : (
        <GatewayHead title={publication?.document?.title} />
      )}

      <Container tag="main" id="main-content" tabIndex={-1}>
        <ArticleContainer>
          <MainContainer>
            {slateChildren ? (
              <SlateReactPresentation
                value={[slateChildren]}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            ) : (
              <p>Empty document.</p>
            )}
          </MainContainer>
          <SideContainer>
            {metadata ? (
              <PublicationMetadata publication={publication} author={author} />
            ) : null}
          </SideContainer>
        </ArticleContainer>
      </Container>
      {siteInfo ? null : <Footer />}
    </>
  )
}
