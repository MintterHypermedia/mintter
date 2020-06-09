import {Switch, Route, useRouteMatch, Redirect} from 'react-router-dom'
import {LibraryHeader} from 'components/library-header'
import Content from 'components/content'
import {PrivateRoute} from 'components/routes'
import {NavItem} from 'components/nav'
import {Publications} from 'screens/publications'
import {MyPublications} from 'screens/my-publications'
import {Drafts} from './drafts'
import Container from 'components/container'

// TODO: Think if there's a better way  to disable SSR, so that access to localStorage doesn't blow up the whole app.
export default function Library(props) {
  const match = useRouteMatch('/library')
  return (
    <Container>
      <Content>
        {/* <LibraryHeader /> */}
        <div className="flex items-center -mx-2">
          <NavItem to="/library/feed">Your Feed</NavItem>
          <NavItem to="/library/published">Published</NavItem>
          <NavItem to="/library/drafts">Drafts</NavItem>
          <div className="flex-1" />
        </div>
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
      </Content>
    </Container>
  )
}
