import {mainService as defaultMainService} from '@app/app-providers'
import {DraftRef, PublicationRef} from '@app/main-machine'
import {PageError, rootPageStyle} from '@app/pages/window-components'
import {Box} from '@components/box'
import {Library} from '@components/library'
import {Settings} from '@components/settings'
import {Topbar} from '@components/topbar'
import {useActor} from '@xstate/react'
import {ErrorBoundary} from 'react-error-boundary'
import {DraftList} from './draft-list-page'
import EditorPage from './editor'
import Publication from './publication'
import {PublicationList} from './publication-list-page'

type MainPageProps = {
  mainService?: typeof defaultMainService
}

export function MainPage({mainService = defaultMainService}: MainPageProps) {
  const [state] = useActor(mainService)

  if (state.matches('routes.settings')) {
    return <Settings />
  }

  return (
    <Box className={rootPageStyle()}>
      {state.hasTag('topbar') ? (
        <Topbar currentFile={state.context.currentFile} />
      ) : null}
      {state.hasTag('library') ? <Library /> : null}

      <ErrorBoundary
        FallbackComponent={PageError}
        onReset={() => {
          window.location.reload()
        }}
      >
        {state.context.currentFile ? (
          state.hasTag('publication') ? (
            <Publication
              publicationRef={state.context.currentFile as PublicationRef}
              key={state.context.params.docId}
            />
          ) : state.hasTag('draft') ? (
            <EditorPage
              key={state.context.params.docId}
              draftRef={state.context.currentFile as DraftRef}
            />
          ) : null
        ) : null}
        {state.matches('routes.home') ? (
          <PublicationList mainService={mainService} />
        ) : null}
        {state.matches('routes.draftList') ? (
          <DraftList mainService={mainService} />
        ) : null}
        {state.matches('routes.publicationList') ? (
          <PublicationList mainService={mainService} />
        ) : null}
      </ErrorBoundary>
    </Box>
  )
}
