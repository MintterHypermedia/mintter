import {useDeleteDraft} from '@app/models/documents'
import {usePopoverState} from '@app/use-popover-state'
import {DeleteDialog} from '@components/delete-dialog'
import {Button, XStack} from '@mintter/ui'
import {ReactNode} from 'react'

export function useDeleteDraftDialog({
  id = null,
  trigger,
  onSuccess,
}: {
  id: string | null
  trigger?: (props: {onPress: () => void}) => JSX.Element
  onSuccess?: () => void
}) {
  const dialogState = usePopoverState()
  const deleteDraft = useDeleteDraft({
    onSuccess: () => {
      dialogState.onOpenChange(false)
      onSuccess?.()
    },
  })

  return {
    ...dialogState,
    deleteDialog: !id ? null : (
      <DeleteDialog
        {...dialogState}
        trigger={trigger}
        title="Discard Draft"
        description="Permanently delete this draft document?"
        cancelButton={
          <Button
            onPress={() => {
              dialogState.onOpenChange(false)
            }}
            chromeless
          >
            Cancel
          </Button>
        }
        actionButton={
          <Button
            theme="red"
            onPress={() => {
              deleteDraft.mutate(id)
              dialogState.onOpenChange(false)
            }}
          >
            Delete
          </Button>
        }
      />
    ),
  }
}
