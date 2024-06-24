import {useListen} from '@shm/app/app-context'

import {AppErrorPage} from '@shm/app/components/app-error'
import {Launcher} from '@shm/app/components/launcher'
import {AppSidebar} from '@shm/app/components/sidebar'
import {TitleBar} from '@shm/app/components/titlebar'
import {DraftStatusContext} from '@shm/app/models/draft-machine'
import {BaseLoading, NotFoundPage} from '@shm/app/pages/base'
import {DocumentPlaceholder} from '@shm/app/pages/document-placeholder'
import '@shm/app/pages/polyfills'
import {SidebarContextProvider} from '@shm/app/src/sidebar-context'
import {getRouteKey, useNavRoute} from '@shm/app/utils/navigation'
import {NavRoute} from '@shm/app/utils/routes'
import {useNavigate} from '@shm/app/utils/useNavigate'
import {getWindowType} from '@shm/app/utils/window-types'
import {YStack} from '@shm/ui'
import {ReactElement, lazy, useMemo} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

var Feed = lazy(() => import('@shm/app/pages/feed'))
var Home = lazy(() => import('./home'))
var Account = lazy(() => import('@shm/app/pages/account-page'))
var Contacts = lazy(() => import('@shm/app/pages/contacts-page'))
var Document = lazy(() => import('@shm/app/pages/document'))
var Draft = lazy(() => import('@shm/app/pages/draft'))
var Settings = lazy(() => import('@shm/app/pages/settings'))
var Comment = lazy(() => import('@shm/app/pages/comment'))
var CommentDraft = lazy(() => import('@shm/app/pages/comment-draft'))
var Explore = lazy(() => import('@shm/app/pages/explore'))
var Favorites = lazy(() => import('@shm/app/pages/favorites'))
var DeletedContent = lazy(() => import('@shm/app/pages/deleted-content'))
var DraftRebase = lazy(() => import('@shm/app/pages/draft-rebase'))

export default function Main({className}: {className?: string}) {
  const navR = useNavRoute()
  const navigate = useNavigate()
  const {PageComponent, Fallback} = useMemo(
    () => getPageComponent(navR),
    [navR],
  )
  const routeKey = useMemo(() => getRouteKey(navR), [navR])
  useListen<NavRoute>(
    'open_route',
    (event) => {
      const route = event.payload
      navigate(route)
    },
    [navigate],
  )
  const windowType = getWindowType()
  let titlebar: ReactElement | null = null
  let sidebar: ReactElement | null = null
  let launcher: ReactElement | null = null
  if (windowType === 'main') {
    titlebar = <TitleBar />
    sidebar = <AppSidebar />
  } else if (windowType === 'settings') {
    titlebar = <TitleBar clean />
  } else if (windowType === 'deleted-content') {
    titlebar = <TitleBar clean cleanTitle="Review Deleted Content" />
  }

  if (windowType === 'main') {
    launcher = <Launcher />
  }

  return (
    <YStack fullscreen className={className}>
      <SidebarContextProvider>
        <ErrorBoundary
          key={routeKey}
          FallbackComponent={AppErrorPage}
          onReset={() => {
            window.location.reload()
          }}
        >
          <DraftStatusContext.Provider>
            {titlebar}
            <PageComponent />
            {launcher}
          </DraftStatusContext.Provider>
        </ErrorBoundary>
        {sidebar}
      </SidebarContextProvider>
    </YStack>
  )
}

function getPageComponent(navRoute: NavRoute) {
  switch (navRoute.key) {
    case 'home':
      return {
        PageComponent: Home,
        Fallback: BaseLoading,
      }
    case 'feed':
      return {
        PageComponent: Feed,
        Fallback: BaseLoading,
      }
    case 'explore':
      return {
        PageComponent: Explore,
        Fallback: BaseLoading,
      }
    case 'contacts':
      return {
        PageComponent: Contacts,
        Fallback: BaseLoading,
      }
    case 'account':
      return {
        PageComponent: Account,
        Fallback: BaseLoading,
      }
    case 'document':
      return {
        PageComponent: Document,
        Fallback: DocumentPlaceholder,
      }
    case 'draft':
      return {
        PageComponent: Draft,
        Fallback: DocumentPlaceholder,
      }
    case 'settings':
      return {
        PageComponent: Settings,
        Fallback: BaseLoading,
      }
    case 'deleted-content':
      return {
        PageComponent: DeletedContent,
        Fallback: BaseLoading,
      }
    case 'comment':
      return {
        PageComponent: Comment,
        Fallback: BaseLoading,
      }
    case 'comment-draft':
      return {
        PageComponent: CommentDraft,
        Fallback: BaseLoading,
      }
    case 'favorites':
      return {
        PageComponent: Favorites,
        Fallback: BaseLoading,
      }
    case 'draft-rebase':
      return {
        PageComponent: DraftRebase,
        Fallback: BaseLoading,
      }
    default:
      return {
        PageComponent: NotFoundPage,
        Fallback: BaseLoading,
      }
  }
}
