import {useGRPCClient} from '@mintter/app/app-context'
import {useDraftList} from '@mintter/app/models/documents'
import {usePublicationVariant} from '@mintter/app/models/publication'
import {NavMode, NavRoute} from '@mintter/app/utils/navigation'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {Button, Tooltip} from '@mintter/ui'
import {Pencil} from '@tamagui/lucide-icons'
import toast from 'react-hot-toast'
import appError from '../errors'
import {PublicationVariant} from '../utils/navigation'

export function EditDocButton({
  docId,
  contextRoute,
  navMode = 'replace',
  variant,
  baseVersion,
  editLabel,
}: {
  docId: string
  navMode?: NavMode
  contextRoute: NavRoute
  variant: PublicationVariant
  baseVersion?: string
  editLabel?: string
}) {
  const pub = usePublicationVariant({
    documentId: docId,
    versionId: baseVersion,
    variant,
    enabled: !!docId,
  })
  const pubVersion = pub.data?.publication?.version
  const draftList = useDraftList()
  const navigate = useNavigate(navMode)

  const hasExistingDraft = draftList.data?.documents.some(
    (draft) => draft.id == docId,
  )
  const grpcClient = useGRPCClient()

  async function handleEdit() {
    try {
      if (hasExistingDraft) {
        // todo, careful! this only works because draftId is docId right now
        navigate({
          key: 'draft',
          draftId: docId,
          contextRoute,
          variant: variant?.key === 'group' ? variant : undefined,
        })
        return
      }
      let draft = await grpcClient.drafts.createDraft({
        existingDocumentId: docId,
        version: baseVersion || pubVersion,
      })
      navigate({
        key: 'draft',
        draftId: draft.id,
        contextRoute,
        variant: variant?.key === 'group' ? variant : undefined,
      })
    } catch (error: any) {
      if (
        error?.message.match('[failed_precondition]') &&
        error?.message.match('already exists')
      ) {
        toast('A draft already exists for this document. Please review.')
        navigate({
          key: 'draft',
          draftId: docId, // because docId and draftId are the same right now
          contextRoute,
          variant: variant?.key === 'group' ? variant : undefined,
        })
        return
      }

      appError(`Draft Error: ${error?.message}`, {error})
    }
  }

  return (
    <>
      <Tooltip content={hasExistingDraft ? 'Resume Editing' : 'Edit Document'}>
        <Button
          size="$2"
          theme={hasExistingDraft ? 'yellow' : undefined}
          onPress={() => handleEdit()}
          icon={Pencil}
        >
          {hasExistingDraft ? 'Resume Editing' : 'Edit'}
        </Button>
      </Tooltip>
    </>
  )
}
