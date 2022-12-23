import {useQuery} from '@tanstack/react-query'
import {useMachine} from '@xstate/react'
import {getPublication} from '../../client'
import Footer from '../../footer'
import {SiteHead} from '../../site-head'
import {publicationMachine} from '../../machines/publication-machine'
import {SlateReactPresentation} from '../../slate-react-presentation'
import {useRenderElement} from '../../slate-react-presentation/render-element'
import {useRenderLeaf} from '../../slate-react-presentation/render-leaf'
import {PublicationMetadata} from '../../author'
import {useRouter} from 'next/router'
import Head from 'next/head'

export default function PublicationPage() {
  const router = useRouter()
  let [docId, version] = router.query.ids || []

  let [state, send] = useMachine(() => publicationMachine)
  let renderElement = useRenderElement()
  let renderLeaf = useRenderLeaf()

  useQuery({
    queryKey: ['PUBLICATION', docId, version],
    queryFn: ({queryKey}) => getPublication(queryKey[1], queryKey[2]),
    onSettled: (publication, error) => {
      if (publication) {
        send({type: 'PUBLICATION.FETCH.SUCCESS', publication})
      } else {
        send({
          type: 'PUBLICATION.FETCH.ERROR',
          errorMessage: `fetch error: ${error}`,
        })
      }
    },
  })

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`https://mintter.com/api/og?title=${
            state.context.publication?.document.title || 'Untitled Document'
          }`}
        />
      </Head>
      <SiteHead />
      <main
        id="main-content"
        tabIndex={-1}
        className="main-content wrapper text-size-100"
      >
        <article className="sidebar">
          <div>
            <PublicationMetadata publication={state.context.publication} />
          </div>
          <div>
            {state.context.editorValue ? (
              <SlateReactPresentation
                value={[state.context.editorValue]}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            ) : null}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
