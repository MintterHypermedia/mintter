import {Button, Dialog, TextArea, XStack} from '@mintter/ui'
import {ComponentProps, useState} from 'react'
import {toast} from 'react-hot-toast'
import {useGRPCClient} from '../app-context'
import {AppDialog, DialogTitle, DialogDescription} from './dialog'
import {UserPlus} from '@tamagui/lucide-icons'
import {AccessURLRow} from './url'
import {useDaemonInfo} from '../models/daemon'
import {HYPERMEDIA_PUBLIC_WEB_GATEWAY} from '@mintter/shared'

function AddConnectionButton(props: ComponentProps<typeof Button>) {
  return (
    <Button size="$2" {...props} icon={UserPlus}>
      Add Connection
    </Button>
  )
}
function AddConnectionForm(props: {onClose: () => void}) {
  const [peer, setPeer] = useState('')
  const grpcClient = useGRPCClient()
  const daemonInfo = useDaemonInfo()
  const deviceId = daemonInfo.data?.deviceId
  async function handleConnect() {
    props.onClose()
    if (peer) {
      const connectionRegexp = /connect-peer\/([\w\d]+)/
      const parsedConnectUrl = peer.match(connectionRegexp)
      const connectionDeviceId = parsedConnectUrl ? parsedConnectUrl[1] : null
      const addrs = connectionDeviceId
        ? [connectionDeviceId]
        : peer.trim().split(',')

      grpcClient.networking
        .connect({addrs})
        .then(() => {
          toast.success('Connection Added')
        })
        .catch((err) => {
          console.error('Connect Error:', err)
          toast.error('Connection Error : ' + err.rawMessage)
        })
      setPeer('')
    }
  }
  return (
    <>
      <DialogTitle>Add Connection</DialogTitle>
      <DialogDescription>
        Share your device connection URL with your friends:
      </DialogDescription>
      {deviceId && (
        <AccessURLRow
          url={`${HYPERMEDIA_PUBLIC_WEB_GATEWAY}/connect-peer/${deviceId}`}
        />
      )}
      <DialogDescription>
        Paste other people&apos;s connection URL here:
      </DialogDescription>
      <TextArea
        value={peer}
        onChangeText={setPeer}
        multiline
        numberOfLines={4}
        data-testid="add-contact-input"
      />
      <DialogDescription size={'$1'}>
        You can also paste the full peer address here.
      </DialogDescription>
      <XStack>
        <Button onPress={handleConnect} disabled={!peer} icon={UserPlus}>
          Connect
        </Button>
      </XStack>
    </>
  )
}
export function useAddConnection() {
  return null
}

export function ContactsPrompt() {
  return (
    <AppDialog
      TriggerComponent={AddConnectionButton}
      ContentComponent={AddConnectionForm}
    />
  )
}
