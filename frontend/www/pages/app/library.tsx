import {Fragment} from 'react'
import {useRouter} from 'next/router'
import Container from '../../components/container'
import Seo from '../../components/seo'
import Sidebar from '../../components/sidebar'
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined'
import DocumentList from '../../components/documentList'
import Layout from '../../components/layout'
import Content from '../../components/content'
import {useDraftsList, createDraft} from '../../shared/drafts'

export default function Library() {
  const router = useRouter()
  const data = useDraftsList()

  async function handleCreateDraft() {
    await createDraft(async newDraft => {
      const value = newDraft.toObject()
      router.push({
        pathname: `/app/editor/${value.documentId}`,
      })
    })
  }

  return (
    <Layout className="flex">
      <Seo title="Library | Mintter" />
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-8 py-10 lg:px-10 lg:py-12">
        <Container>
          <div className="p-5 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-heading">Library</h1>
            {data.status === 'success' &&
              data.resolvedData.toObject().draftsList.length > 0 && (
                <button
                  className="bg-info-hover hover:bg-info text-white font-bold py-2 px-4 rounded rounded-full flex items-centerjustify-center"
                  onClick={handleCreateDraft}
                >
                  New Draft
                </button>
              )}
          </div>
          <Content>
            {/* show/hide depending on the desired criteria (TBD) */}
            {data.status === 'success' &&
              data.resolvedData.toObject().draftsList.length === 0 && (
                <Fragment>
                  <div className="bg-background-muted border-muted border-solid border-2 rounded px-8 pt-6 pb-8 mb-4 text-center flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-info">
                      Welcome to Mintter!
                    </h2>
                    <p className="text-body font-light mt-5">
                      Some clain sentence that's fun, welcomes user to the
                      community and tells how it works and encourages to get
                      started
                    </p>
                    <button
                      onClick={handleCreateDraft}
                      className="bg-info hover:bg-info-hover text-white font-bold py-3 px-4 rounded rounded-full flex items-center mt-5 justify-center"
                    >
                      <NoteAddOutlinedIcon />
                      <span className="ml-2">Create your first document</span>
                    </button>
                  </div>
                  <hr className="border-t-2 border-muted border-solid my-8" />
                </Fragment>
              )}

            <DocumentList data={data} />
          </Content>
        </Container>
      </div>
    </Layout>
  )
}
