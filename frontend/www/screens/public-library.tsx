import React from 'react'
import {css} from 'emotion'
import {Switch, useRouteMatch, Redirect} from 'react-router-dom'
import {PrivateRoute} from 'components/routes'
import {NavItem} from 'components/nav'
import {useHistory} from 'react-router-dom'
import {useMintter, useDocuments} from 'shared/mintterContext'
import Container from 'components/container'
import {useProfile} from 'shared/profileContext'
import Layout from 'components/layout'
import {Link} from 'components/link'
import {Page} from 'components/page'
import {MainColumn} from 'components/main-column'
import Logo from 'components/logo_square'
import Seo from 'components/seo'

const MyPublications = React.lazy(() =>
  import(/* webpackPrefetch: true */ './my-publications'),
)

// TODO: Think if there's a better way  to disable SSR, so that access to localStorage doesn't blow up the whole app.
export default function Library(props) {
  const match = useRouteMatch('/library')
  const history = useHistory()
  const {createDraft} = useMintter()

  async function handleCreateDocument() {
    const d = await createDraft()

    const value = d.toObject()
    history.push({
      pathname: `/editor/${value.version}`,
    })
  }

  return (
    <Layout>
      <Seo title="Homepage" />
      <Page>
        <MainColumn>
          <div className="text-primary my-4">
            <Logo width="42px" className="fill-current" />
          </div>
          <ProfileInfo />

          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-semibold text-heading">Articles</h3>
            <div className="flex-1" />
          </div>
          <div className="-mx-4">
            <MyPublications noSeo />
          </div>
        </MainColumn>
      </Page>
    </Layout>
  )
}

function ProfileInfo() {
  const {data: profile} = useProfile()

  return (
    profile && (
      <div className="text-left border-b mb-8 pb-8">
        <h1 className="font-bold text-4xl text-heading">{profile.username}</h1>
        <p className="text-body text-sm mt-2">{profile.bio}</p>
      </div>
    )
  )
}
