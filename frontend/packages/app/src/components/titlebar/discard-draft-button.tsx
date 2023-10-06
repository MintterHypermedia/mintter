import {useDeleteDraftDialog} from '@mintter/app/src/components/delete-draft-dialog'
import {useNavRoute} from '@mintter/app/src/utils/navigation'
import {useNavigate} from '@mintter/app/src/utils/useNavigate'
import {Button, Tooltip} from '@mintter/ui'
import {Trash} from '@tamagui/lucide-icons'

export default function DiscardDraftButton() {
  const route = useNavRoute()
  const backplace = useNavigate('backplace')
  const draftId = route.key == 'draft' ? route.draftId : null

  const contextRoute = route.key == 'draft' ? route.contextRoute : null
  const deleteDialog = useDeleteDraftDialog()

  if (route.key != 'draft' || !draftId) return null

  return (
    <>
      {deleteDialog.content}
      <Tooltip content="Discard Draft">
        <Button
          size="$2"
          theme="orange"
          onPress={() =>
            deleteDialog.open({
              draftId,
              onSuccess: () => {
                if (contextRoute) {
                  backplace(contextRoute)
                } else {
                  backplace({key: 'drafts'})
                }
              },
            })
          }
          icon={Trash}
        />
      </Tooltip>
    </>
  )
}
