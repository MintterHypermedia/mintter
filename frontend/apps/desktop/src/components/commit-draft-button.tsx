import {DraftStatus, draftStatus} from '@/draft-status'
import {useNavRoute} from '@/utils/navigation'
import {DraftRoute} from '@/utils/routes'
import {HMDocument} from '@shm/shared'
import {
  AlertCircle,
  Button,
  Spinner,
  Tooltip,
  YStack,
  YStackProps,
  toast,
} from '@shm/ui'
import {Check} from '@tamagui/lucide-icons'
import {PropsWithChildren, useEffect, useState} from 'react'
import {createMachine} from 'xstate'
import {useGRPCClient} from '../app-context'
import {useMyAccount_deprecated, useProfile} from '../models/accounts'
import {
  useDraft,
  usePublishDraft,
  usePushPublication,
} from '../models/documents'
import {useGatewayHost, usePushOnPublish} from '../models/gateway-settings'
import {useMediaDialog} from './media-dialog'

export default function CommitDraftButton() {
  const route = useNavRoute()
  const grpcClient = useGRPCClient()
  const draftRoute: DraftRoute = route.key === 'draft' ? route : null
  if (!draftRoute)
    throw new Error('DraftPublicationButtons requires draft route')
  const previousDoc = useProfile(
    draftRoute.id && draftRoute.id.startsWith('hm://a')
      ? draftRoute.id.split('hm://a')[0]
      : draftRoute.id,
  )

  const draft = useDraft({draftId: draftRoute.id})
  const publish = usePublishDraft(grpcClient, draftRoute.id)
  // console.log(`== ~ CommitDraftButton ~ draft:`, draft)
  // console.log(`== ~ CommitDraftButton ~ previousDoc:`, {previousDoc, draft})

  return (
    <>
      <SaveIndicatorStatus />
      <Button
        size="$2"
        onPress={() =>
          publish.mutate({
            draft: draft.data,
            previous: previousDoc.data as HMDocument,
          })
        }
      >
        Publishh
      </Button>
    </>
  )
}

export function _CommitDraftButton() {
  const route = useNavRoute()
  const draftRoute = route.key === 'draft' ? route : null
  if (!draftRoute)
    throw new Error('DraftPublicationButtons requires draft route')
  const draftId = route.key == 'draft' ? route.id : null
  const grpcClient = useGRPCClient()
  const myAccount = useMyAccount_deprecated()
  const mediaDialog = useMediaDialog()
  const canPublish = false // TODO: change with stream
  const hasUpdateError = false // TODO: change with stream
  const pushOnPublish = usePushOnPublish()
  const push = usePushPublication()
  const gwHost = useGatewayHost()
  const publish = usePublishDraft({
    onSuccess: ({pub: publishedDoc}) => {
      if (!publishedDoc || !draftId) return
      if (pushOnPublish.data === 'always') {
        toast.promise(push.mutateAsync(draftId), {
          loading: `Document published. Pushing to ${gwHost}...`,
          success: `Document published to ${gwHost}`,
          error: (err) =>
            `Document published. Failed to push to ${gwHost}: ${err.message}`,
        })
      } else if (pushOnPublish.data === 'never') {
        toast.success('Document Committed.')
      } else {
        // ask
        toast.success('Document Committed...')
      }
    },
    onError: (e: any) => {
      toast.error('Failed to publish: ' + e.message)
    },
  })
  if (route.key != 'draft') return null

  const isProfileDoc = !!draftRoute?.isProfileDocument
  let publishMessage = 'Publish'
  if (isProfileDoc) {
    publishMessage = 'Publish to Profile'
  }
  return (
    <>
      {mediaDialog.content}
      <SaveIndicatorStatus />
      {hasUpdateError ? null : (
        <Button
          size="$2"
          disabled={!canPublish || hasUpdateError}
          opacity={!canPublish ? 0.5 : 1}
          onPress={() => {
            grpcClient.drafts.getDraft({draftId}).then((draft) => {
              const hasEmptyMedia = draft.document?.content.find((block) => {
                return (
                  block.block &&
                  ['image', 'video', 'file'].includes(block.block.type) &&
                  !block.block.ref
                )
              })
              if (hasEmptyMedia) {
                mediaDialog.open({
                  draftId,
                  publish,
                })
              } else {
                publish.mutate({draftId})
              }
            })
          }}
          theme="green"
        >
          {publishMessage}
        </Button>
      )}
    </>
  )
}

function StatusWrapper({children, ...props}: PropsWithChildren<YStackProps>) {
  return (
    <YStack space="$2" opacity={0.6}>
      {children}
    </YStack>
  )
}

const dummyMachine = createMachine({initial: 'demo', states: {demo: {}}})

function SaveIndicatorStatus() {
  const [status, setStatus] = useState('idle' as DraftStatus)

  useEffect(() => {
    draftStatus.subscribe((current) => {
      if (current == 'saved') {
        setTimeout(() => {
          setStatus('idle')
        }, 1000)
      }
      setStatus(current)
    })
  }, [])

  if (status == 'saving') {
    return (
      <StatusWrapper>
        <Button chromeless size="$1" icon={<Spinner />}>
          saving...
        </Button>
      </StatusWrapper>
    )
  }

  if (status == 'saved') {
    return (
      <StatusWrapper>
        <Button chromeless size="$1" icon={<Check />} disabled>
          saved
        </Button>
      </StatusWrapper>
    )
  }

  if (status == 'error') {
    return (
      <StatusWrapper alignItems="flex-end">
        <Tooltip content="An error ocurred while trying to save the latest changes.">
          <Button theme="red" size="$2" icon={<AlertCircle />} disabled>
            Error
          </Button>
        </Tooltip>
      </StatusWrapper>
    )
  }

  return null
}
