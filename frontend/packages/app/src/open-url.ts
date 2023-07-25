import {getIdsfromUrl, HYPERDOCS_LINK_PREFIX} from '@mintter/shared'
import {NavRoute, useNavigate} from '@mintter/app/src/utils/navigation'
import {useMemo} from 'react'
import {useAppContext} from '@mintter/app/src/app-context'

export function useOpenUrl() {
  const {externalOpen} = useAppContext()
  const spawn = useNavigate('spawn')
  const push = useNavigate('push')
  return useMemo(() => {
    return (url?: string, newWindow?: boolean) => {
      if (!url) return

      if (url.startsWith(HYPERDOCS_LINK_PREFIX)) {
        const hdIds = getIdsfromUrl(url)
        if (!hdIds[0]) {
          throw new Error('Cannot parse Hyperdocs URL without document ID')
        }
        const pubRoute: NavRoute = {
          key: 'publication',
          documentId: hdIds[0],
          versionId: hdIds[1],
          blockId: hdIds[2],
        }
        if (newWindow) {
          spawn(pubRoute)
        } else {
          push(pubRoute)
        }
        return
      } else {
        externalOpen(url)
      }
    }
  }, [])
}