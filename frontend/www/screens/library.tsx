import React from 'react'
import {css} from 'emotion'
import {Switch, useRouteMatch, Redirect} from 'react-router-dom'

import {PrivateRoute} from 'components/routes'
import {NavItem} from 'components/nav'
import {Publications} from 'screens/publications'
import {MyPublications} from 'screens/my-publications'
import {useHistory} from 'react-router-dom'
import {useMintter} from 'shared/mintterContext'
import {Drafts} from './drafts'
import Container from 'components/container'
import {useProfile} from 'shared/profileContext'
import {Link} from 'components/link'
import {Connections} from 'components/connections'
import {SuggestedConnections} from 'components/suggested-connections'

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
    <div
      className={`${css`
        display: grid;
        grid-template-columns: minmax(250px, 25%) 1fr minmax(150px, 25%);
        grid-gap: 1rem;
      `}`}
    >
      <div>
        <ProfileInfo />
        <Connections />
        <SuggestedConnections />
      </div>
      <div>
        <div
          className={`my-0 mx-auto ${css`
            max-width: 80ch;
            width: 100%;
          `}`}
        >
          <div className="flex items-baseline justify-between">
            <h1 className="text-4xl font-bold text-heading">Library</h1>
            <div className="flex-1" />
            <button
              onClick={handleCreateDocument}
              className="bg-primary rounded-full px-4 py-2 text-white font-bold shadow transition duration-200 hover:shadow-lg ml-4"
            >
              Compose
            </button>
          </div>
          <div className="flex items-center mt-4 -mx-4">
            <NavItem to="/library/feed">Feed</NavItem>
            <NavItem to="/library/published">Published</NavItem>
            <NavItem to="/library/drafts">Drafts</NavItem>
            <div className="flex-1" />
          </div>
          <div className="-mx-4">
            <Switch>
              <PrivateRoute exact path={match.url}>
                <Redirect to={`${match.url}/feed`} />
              </PrivateRoute>
              <PrivateRoute path={`${match.url}/feed`}>
                <Publications />
              </PrivateRoute>
              <PrivateRoute path={`${match.url}/published`}>
                <MyPublications />
              </PrivateRoute>
              <PrivateRoute path={`${match.url}/drafts`}>
                <Drafts />
              </PrivateRoute>
            </Switch>
          </div>
        </div>
      </div>
      <div />
    </div>
  )
}

function ProfileInfo() {
  const {profile} = useProfile()

  const values = profile?.toObject()

  return (
    values && (
      <div className="text-left px-4">
        <h3 className="font-semibold text-2xl text-heading">
          {values.username}
        </h3>
        <p className="text-body text-sm mt-2">{values.bio}</p>
        <Link
          to="/settings"
          className="text-primary hover:text-primary-hover cursor-pointer text-sm mt-4 underline inline-block"
        >
          Edit profile
        </Link>
      </div>
    )
  )
}
