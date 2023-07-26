import {useAccount} from '@mintter/app/src/models/accounts'
import {useDaemonReady} from '@mintter/app/src/node-status-context'
import {GetProps, UIAvatar} from '@mintter/ui'
import {useMemo} from 'react'
import {BACKEND_FILE_URL} from '../constants'

export function Avatar({url: urlProp, ...props}: GetProps<typeof UIAvatar>) {
  const {data: account} = useAccount(props.accountId)
  let isDaemonReady = useDaemonReady()
  let url = useMemo(() => {
    if (urlProp) return urlProp
    if (!isDaemonReady) return
    if (account?.profile?.avatar) {
      return `${BACKEND_FILE_URL}/${account?.profile?.avatar}`
    }
  }, [account, props.accountId, urlProp, isDaemonReady])

  return <UIAvatar url={url} {...props} />
}
