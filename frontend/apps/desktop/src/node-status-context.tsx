import {Onboarding} from '@app/pages/onboarding'
import {ConnectionStatus, Info, PeerInfo} from '@mintter/shared'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {useDaemonInfo} from './models/daemon'
import {usePeerInfo} from './models/networking'

type PeerInfoValue = {
  addrs: Array<string>
  connectionStatus: ConnectionStatus
  accountId: string
  isReady: boolean
  netStatus: 'online' | 'offline'
}
let defaultValue: PeerInfoValue = {
  addrs: [],
  connectionStatus: ConnectionStatus.NOT_CONNECTED,
  accountId: '',
  isReady: false,
  netStatus: 'online',
}
let daemonContext = createContext<PeerInfoValue>(defaultValue)

let Provider = daemonContext.Provider

export function DaemonStatusProvider({children}: {children: ReactNode}) {
  let [netStatus, setNetStatus] = useState<'online' | 'offline'>('online')
  let infoQuery = useDaemonInfo()

  let peerInfoQuery = usePeerInfo(infoQuery.data?.deviceId)

  useEffect(() => {
    function handleOnline() {
      setNetStatus('online')
    }

    function handleOffline() {
      setNetStatus('offline')
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // return <Onboarding />

  if (infoQuery.data === null) {
    return <Onboarding />
  }

  if (infoQuery.status == 'success') {
    return (
      <Provider
        value={{
          ...defaultValue,
          ...peerInfoQuery.data,
          netStatus,
          isReady: !!peerInfoQuery.data?.addrs.length,
        }}
      >
        {children}
      </Provider>
    )
  }

  return null
}

export function useDaemonReady() {
  let context = useContext(daemonContext)
  return useMemo(() => (context ? context.isReady : false), [context])
}

export function useDaemonOnline() {
  let context = useContext(daemonContext)
  return useMemo(() => context?.netStatus == 'online', [context])
}
