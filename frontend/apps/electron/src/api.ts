import z from 'zod'
import {initTRPC} from '@trpc/server'
import {observable} from '@trpc/server/observable'
// import {EventEmitter} from 'events'
import superjson from 'superjson'
import {BrowserWindow, Menu, MenuItem, ipcMain} from 'electron'
import {createIPCHandler} from 'electron-trpc/main'
import path from 'path'
import Store from 'electron-store'
import {NavRoute} from '@mintter/app/src/utils/navigation'

const t = initTRPC.create({isServer: true, transformer: superjson})

let windowIdCount = 1

const allWindows = new Map<string, BrowserWindow>()

let focusedWindow: string | null = null

function getFocusedWindow(): BrowserWindow | null {
  return focusedWindow ? allWindows[focusedWindow] : null
}

function windowFocused(windowId: string) {
  focusedWindow = windowId
}
function windowBlurred(windowId: string) {
  if (focusedWindow === windowId) {
    focusedWindow = null
  }
}

const invalidationHandlers = new Set<(queryKey: any) => void>()

ipcMain.on('invalidate_queries', (_event, info) => {
  invalidationHandlers.forEach((handler) => handler(info))
})

ipcMain.on('open_quick_switcher', (_event, info) => {
  getFocusedWindow()?.webContents.send('open_quick_switcher')
})

export const mainMenu = new Menu()

type ReadyState = {t: 'ready'}
type ErrorState = {t: 'error'; message: string}
type StartupState = {t: 'startup'}
export type GoDaemonState = ReadyState | ErrorState | StartupState

let goDaemonState: GoDaemonState = {t: 'startup'}

export function updateGoDaemonState(state: GoDaemonState) {
  goDaemonState = state
  allWindows.forEach((window) => {
    window.webContents.send('goDaemonState', goDaemonState)
  })
}

const store = new Store()

type AppWindow = {
  route: NavRoute
  bounds: any
}

let windowsState: Record<string, AppWindow> = store.get('windows') || {}

console.log('init windowsState', windowsState)

export function openInitialWindows() {
  console.log('openInitialWindows', windowsState)
  if (!Object.keys(windowsState).length) {
    trpc.createAppWindow({route: {key: 'home'}})
    return
  }
  Object.entries(windowsState).forEach(([windowId, window]) => {
    trpc.createAppWindow({route: window.route, bounds: window.bounds})
  })
}

function setWindowsState(newWindows: Record<string, AppWindow>) {
  windowsState = newWindows
  store.set('windows', newWindows)
  console.log('windows did update', newWindows)
}

function deleteWindowState(windowId: string) {
  const newWindows = {...windowsState}
  delete newWindows[windowId]
  setWindowsState(newWindows)
}
function setWindowState(windowId: string, window: AppWindow) {
  const newWindows = {...windowsState}
  newWindows[windowId] = window
  setWindowsState(newWindows)
}
function updateWindowState(
  windowId: string,
  updater: (window: AppWindow) => AppWindow,
) {
  const newWindows = {...windowsState}
  newWindows[windowId] = updater(newWindows[windowId])
  setWindowsState(newWindows)
}

mainMenu.append(
  new MenuItem({
    role: 'appMenu',
    label: 'Mintter',
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          trpc.createAppWindow({route: {key: 'settings'}})
        },
      },
      {
        label: 'Search / Open',
        accelerator: 'CmdOrCtrl+k',
        click: () => {
          getFocusedWindow()?.webContents.send('open_quick_switcher')
        },
      },
      {type: 'separator'},
      {role: 'services'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideOthers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'},
    ],
  }),
)
mainMenu.append(new MenuItem({role: 'editMenu'}))

function openRoute(route: NavRoute) {
  const focusedWindow = getFocusedWindow()
  if (focusedWindow) {
    focusedWindow.webContents.send('open_route', route)
  } else {
    trpc.createAppWindow({route})
  }
}

mainMenu.append(
  new MenuItem({
    id: 'viewMenu',
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forceReload'},
      {role: 'toggleDevTools'},
      {type: 'separator'},
      {
        id: 'route_pubs',
        label: 'Publications',
        accelerator: 'CmdOrCtrl+1',
        click: () => {
          openRoute({key: 'home'})
        },
      },
      {
        id: 'route_drafts',
        label: 'Drafts',
        accelerator: 'CmdOrCtrl+8',
        click: () => {
          getFocusedWindow()?.webContents.send('open_route', {key: 'drafts'})
        },
      },
      {
        id: 'route_connections',
        label: 'Connections',
        accelerator: 'CmdOrCtrl+9',
        click: () => {
          getFocusedWindow()?.webContents.send('open_route', {
            key: 'connections',
          })
        },
      },
      {type: 'separator'},
      {role: 'resetZoom'},
      {role: 'zoomIn'},
      {role: 'zoomOut'},
      {type: 'separator'},
      {role: 'togglefullscreen'},
    ],
  }),
)
// mainMenu.getMenuItemById('route_pubs').enabled = false

mainMenu.append(
  new MenuItem({
    role: 'windowMenu',
    submenu: [
      {
        role: 'close',
      },
      {
        role: 'minimize',
      },
    ],
  }),
)

export const router = t.router({
  createAppWindow: t.procedure
    .input(
      z.object({
        route: z.any(),
        bounds: z
          .object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
          })
          .optional(),
      }),
    )
    .mutation(async ({input}) => {
      const windowId = `Window${windowIdCount++}`
      const bounds = input.bounds
        ? input.bounds
        : {
            width: 1200,
            height: 800,
          }
      const browserWindow = new BrowserWindow({
        show: false,
        // width: 1200,
        // height: 800,
        ...bounds,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
        },
        icon: import.meta.env.RELEASE_NIGHTLY
          ? path.resolve(__dirname, '../assets/icons-nightly/icon.png')
          : path.resolve(__dirname, '../assets/icons/icon.png'),
        titleBarStyle: 'hidden',
        trafficLightPosition: {
          x: 12,
          y: 12,
        },
      })
      function saveWindowPosition() {
        console.log('saving window position')
        const bounds = browserWindow.getBounds()
        updateWindowState(windowId, (window) => ({...window, bounds}))
      }
      let windowPositionSaveTimeout: null | NodeJS.Timeout = null
      function saveWindowPositionDebounced() {
        if (windowPositionSaveTimeout) {
          clearTimeout(windowPositionSaveTimeout)
        }
        windowPositionSaveTimeout = setTimeout(() => {
          saveWindowPosition()
        }, 200)
      }
      browserWindow.on('resize', (e, a) => {
        console.log('resized', e, a)
        saveWindowPositionDebounced()
      })
      browserWindow.on('moved', (e, a) => {
        console.log('moved', a)
        saveWindowPositionDebounced()
      })
      allWindows.set(windowId, browserWindow)
      trpcHandlers.attachWindow(browserWindow)

      const initRoute = input?.route || {key: 'home'}
      setWindowState(windowId, {route: initRoute, bounds: null})

      browserWindow.webContents.send('initWindow', {
        route: initRoute,

        daemonState: goDaemonState,
        windowId,
      })
      browserWindow.webContents.ipc.addListener(
        'windowRoute',
        (info, route) => {
          console.log('did window route', route)
          updateWindowState(windowId, (window) => ({...window, route}))
        },
      )

      browserWindow.webContents.on('did-finish-load', () => {
        const route = windowsState[windowId].route
        browserWindow.webContents.send('initWindow', {
          route,
          daemonState: goDaemonState,
          windowId,
        })
      })

      // First render trick: https://getlotus.app/21-making-electron-apps-feel-native-on-mac
      browserWindow.on('ready-to-show', () => {
        browserWindow.show()
      })

      browserWindow.on('close', () => {
        deleteWindowState(windowId)
        trpcHandlers.detachWindow(browserWindow)
        allWindows.delete(windowId)
      })

      browserWindow.on('focus', () => {
        windowFocused(windowId)
      })
      browserWindow.on('blur', () => {
        windowBlurred(windowId)
      })

      // and load the index.html of the app.
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
      } else {
        browserWindow.loadFile(
          path.join(
            __dirname,
            `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
          ),
        )
      }

      // if (!import.meta.env.PROD) browserWindow.webContents.openDevTools()
    }),

  queryInvalidation: t.procedure.subscription(() => {
    return observable((emit) => {
      function handler(value: any[]) {
        emit.next(value)
      }
      invalidationHandlers.add(handler)
      return () => {
        invalidationHandlers.delete(handler)
      }
    })
  }),
})

export const trpc = router.createCaller({})

const trpcHandlers = createIPCHandler({router, windows: []})

export type AppRouter = typeof router
