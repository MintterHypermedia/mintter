import {MainActor} from '@app/models/main-actor'
import {warn} from '@app/utils/logger'
import {lazy} from 'react'

var TitleBarMacos = lazy(() => import('./macos'))
var TitleBarWindows = lazy(() => import('./windows'))
var TitleBarLinux = lazy(() => import('./linux'))

export interface TitleBarProps {
  clean?: boolean
  mainActor?: MainActor
}

export function TitleBar(props: TitleBarProps) {
  if (import.meta.env.TAURI_PLATFORM == 'macos')
    return <TitleBarMacos {...props} />
  if (import.meta.env.TAURI_PLATFORM == 'windows')
    return <TitleBarWindows {...props} />
  if (import.meta.env.TAURI_PLATFORM == 'linux')
    return <TitleBarLinux {...props} />
  // throw new Error(`Titlebar: unsupported platform: ${import.meta.env.TAURI_PLATFORM}`)
  warn(`Titlebar: unsupported platform: ${import.meta.env.TAURI_PLATFORM}`)
  return <TitleBarMacos {...props} />
}
