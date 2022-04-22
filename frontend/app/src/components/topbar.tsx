import {MINTTER_LINK_PREFIX} from '@app/constants'
import {useLibrary} from '@app/main-page-context'
import {css, styled} from '@app/stitches.config'
import {useRoute} from '@app/utils/use-route'
import {useCreateDraft} from '@components/library/use-create-draft'
import {invoke} from '@tauri-apps/api'
import {getCurrent} from '@tauri-apps/api/window'
import {FormEvent, useCallback, useEffect, useRef, useState} from 'react'
import {useLocation} from 'wouter'
import {Box} from './box'
import {Button} from './button'
import {Icon} from './icon'
import {useSidepanel} from './sidepanel'
import {TextField} from './text-field'
import {Tooltip} from './tooltip'

const draggableProps = {
  'data-tauri-drag-region': true,
}

export const TopbarStyled = styled(Box, {
  gridArea: 'topbar',
  width: '$full',
  height: 40,
  display: 'flex',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  background: '$background-alt',
})

export const topbarSection = css({
  height: '$full',
  display: 'flex',
  alignItems: 'center',
})

function maximize() {
  const win = getCurrent()
  win.maximize()
}

export function Topbar() {
  return (
    <TopbarStyled data-tauri-drag-region style={{userSelect: 'none', cursor: 'grab'}}>
      <SidenavBar />
      <MainBar />
      <TopbarActions />
    </TopbarStyled>
  )
}

function SidenavBar() {
  const libraryService = useLibrary()

  const toggle = useCallback(() => libraryService.send('LIBRARY.TOGGLE'), [libraryService])
  return (
    <Box
      {...draggableProps}
      className={topbarSection()}
      data-tauri-drag-region
      css={{
        width: 232,
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingLeft: '$5',
        paddingRight: '$3',
      }}
    >
      <span style={{display: 'block', flex: 'none', width: 60}} />
      <Box css={{display: 'flex', alignItems: 'center', gap: '$4'}}>
        <Button variant="ghost" size="0" color="muted" onClick={toggle}>
          <Icon name="Sidenav" size="2" />
        </Button>
        <TopbarNavigation />
      </Box>
    </Box>
  )
}

function MainBar() {
  const [routeLocation, setRouteLocation] = useLocation()
  let form = useRef(null)
  const [location, setLocation] = useState(() => routeLocation)

  useEffect(() => {
    setLocation(routeLocation)
  }, [routeLocation])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.current) {
      const data = new FormData(form.current)

      let search: string = data.get('search') as string

      if (search.includes('settings')) return

      let url = search.startsWith('/p/')
        ? search
        : search.startsWith(MINTTER_LINK_PREFIX)
        ? `/p/${search.replace(MINTTER_LINK_PREFIX, '')}`
        : `/p/${search}`
      setLocation(url)
      setRouteLocation(url)
    } else {
      console.error('Search Submit ERROR: not a form attached!')
    }
  }

  return (
    <Box
      {...draggableProps}
      className={topbarSection()}
      data-tauri-drag-region
      css={{
        paddingLeft: '$5',
        paddingRight: '$3',
        pointerEvents: 'all',
        flex: 1,
        display: 'flex',
        gap: '$5',
      }}
    >
      <Box ref={form} css={{width: '100%', maxWidth: '800px'}} as="form" onSubmit={handleSubmit}>
        <TextField size={1} name="search" value={location} onChange={(e) => setLocation(e.target.value)} />
      </Box>
    </Box>
  )
}

function TopbarNavigation() {
  return (
    <Box css={{display: 'flex'}} {...draggableProps}>
      <Button size="0" variant="ghost" color="muted" onClick={() => window.history.back()}>
        <Icon name="ArrowChevronLeft" color="muted" />
      </Button>
      <Button size="0" variant="ghost" color="muted" onClick={() => window.history.forward()}>
        <Icon name="ArrowChevronRight" color="muted" />
      </Button>
    </Box>
  )
}

function TopbarActions() {
  const service = useSidepanel()
  const {match: isDocumentOpen} = useRoute<{docId: string; version: string}>(['/p/:docId/:version', '/editor/:docId'])
  const {createDraft} = useCreateDraft()

  function toggleSidepanel() {
    service.send('SIDEPANEL.TOGGLE')
  }

  async function onCreateDraft() {
    await invoke('open_in_new_window', {url: '/new'})
  }
  return (
    <Box
      {...draggableProps}
      className={topbarSection()}
      data-tauri-drag-region
      css={{
        flex: 'none',
        paddingLeft: '$7',
        paddingRight: '$4',
        pointerEvents: 'all',
        display: 'flex',
        gap: '$4',
      }}
    >
      {isDocumentOpen && (
        <Tooltip content="Toogle Sidepanel">
          <Button size="0" variant="ghost" color="muted" onClick={toggleSidepanel}>
            <Icon name="Sidepanel" size="2" color="muted" />
          </Button>
        </Tooltip>
      )}
      <Button size="0" variant="ghost" color="muted" onClick={onCreateDraft}>
        <Icon name="Add" color="muted" />
      </Button>
    </Box>
  )
}
