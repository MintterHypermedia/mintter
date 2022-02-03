import {Alert} from '@components/alert'
import {overlayStyles} from '@components/dialog-styles'
import {useMachine} from '@xstate/react'
import {MouseEvent, PropsWithChildren} from 'react'
import {createModel} from 'xstate/lib/model'

export type DeleteDialogProps = PropsWithChildren<{
  entryId?: string
  handleDelete: any // Promise that deletes entry
  onSuccess: any // execute this after delete is successful;
}>

export function DeleteDialog({children, entryId, handleDelete, onSuccess}: DeleteDialogProps) {
  const [state, send] = useMachine(
    deleteDialogMachine.withConfig({
      services: {
        deleteEntry: () => handleDelete(entryId),
      },
      actions: {
        onSuccess,
      },
    }),
  )
  return (
    <Alert.Root
      id={entryId}
      open={state.matches('opened')}
      onOpenChange={(value: boolean) => {
        if (value) {
          send('DELETE.DIALOG.OPEN')
        } else {
          send('DELETE.DIALOG.CANCEL')
        }
      }}
    >
      <Alert.Trigger asChild>{children}</Alert.Trigger>
      <Alert.Portal>
        <Alert.Overlay className={overlayStyles()}>
          <Alert.Content>
            <Alert.Title color="danger" data-testid="delete-dialog-title">
              Delete document
            </Alert.Title>
            <Alert.Description>
              Are you sure you want to delete this document? This action is not reversible.
            </Alert.Description>
            {state.matches('opened.errored') && (
              <Alert.Description data-testid="delete-dialog-error" color="danger">
                Something went wrong on deletion
              </Alert.Description>
            )}
            <Alert.Actions>
              <Alert.Cancel data-testid="delete-dialog-cancel" disabled={state.hasTag('pending')}>
                Cancel
              </Alert.Cancel>
              <Alert.Action
                color="danger"
                data-testid="delete-dialog-confirm"
                disabled={state.hasTag('pending')}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  e.preventDefault()
                  send('DELETE.DIALOG.CONFIRM')
                }}
              >
                Delete
              </Alert.Action>
            </Alert.Actions>
          </Alert.Content>
        </Alert.Overlay>
      </Alert.Portal>
    </Alert.Root>
  )
}

const deleteDialogModel = createModel(
  {
    entryId: '',
    errorMessage: '',
  },
  {
    events: {
      'DELETE.DIALOG.OPEN': () => ({}),
      'DELETE.DIALOG.CANCEL': () => ({}),
      'DELETE.DIALOG.CONFIRM': () => ({}),
    },
  },
)

/** @xstate-layout N4IgpgJg5mDOIC5QTAGzAFzAEQJYENUB7KAWXwGMALXAOzADoLjZIBibAUQBlOAVTg2wBJAILcA8gHEGEgAqcAcolAAHIrFwZcRWipAAPRAEYA7AA4Gx4wE4LxgKwAmAGwAGC2+MAaEAE8TBwcGGwcAZmMXcIAWMxdIsIBfRN8UdCw8QhJyajpGIlUweggGXAh0Dh5+QRFxaQYAYQlFADFhACVSfXVNbV19IwQnB0touzDzcyi3Fxsx3wCEUzDoq3Mw0zc3KZcnFaSUkDTMHAJiMkoaegYCoshS8rBK3gEhMUkZBtFFBp5ujS0Oj0SEMiGGo3Gk2ms3m-kQ5j2DHMDhc63M0VMZjm5mSqTQJ0y5xyV3yhWKDGO2loUDYEF0jDoADciABrRiUsCcWgYABOizUAL6wNAg1MiNmTk2pmiYTcNg85gWiGmDDFMXl6wiYScuKO+IyZ2ylzyNzJ90pdBpYB5PKIPIYqlQ+AwADM7QBbCn6zncvn-XpAgaIWWWVxOGw2KJasbGMJKhAjYJObbRaKzMVy5G6jmEo25a63cnW2089hcF41d71JqtDpdEE9QH9EGDcEMMbLKEOGZzGzxlybJHmRzohymUxRGzZ725i750l3ErFu1lqqvWofRrfX7cf1N4WgoYjduQqbdmF9uEJpzGEIzMKy1FhZwP6fpU5ZOck02L2n0hiwBgzrsjOhpfiahaQHuQpBggZiWNYdjDs47ieD4V42E4DBRMYbhjG44TGFM0TJIctBECg8AgjmYHEiazAaFBDaCoGLaINETjxrht7bN2GpprERFTocNGfnRBZmiUZToNBrEiiYz6qhObgbKmOwRPG0phO2Di4aYDgRpKNgRG+BK0caEmLl66SWrJzbyQmBEMBMDixNEUxEY4LguP2YwMARnaTJKw5yqZBpiRZC5FjaK4QHZB6DHpzkuQRdjSnK0rxuELjYamuxRC40S6TKYUfkSkU-uSFD4LQFD4nFzEBvZh52PGw6rLhN7DHhBmmKEpWzuJUXmrgsDuqNVECk1CWIJh2kIk4kw2B5i3LP20oMMmmKeaEz7PgN5nzpVTFTfusFrVeqamJtQSLQkKlhKipgHRF87xbBRFcddEY-b9v1TKRiRAA */
const deleteDialogMachine = deleteDialogModel.createMachine({
  id: 'deleteDialogMachine',
  initial: 'closed',
  states: {
    closed: {
      on: {
        'DELETE.DIALOG.OPEN': {
          target: 'opened',
        },
      },
    },
    opened: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            'DELETE.DIALOG.CONFIRM': {
              target: 'deleting',
            },
            'DELETE.DIALOG.CANCEL': {
              target: 'dismiss',
            },
          },
        },
        deleting: {
          invoke: {
            id: 'deleteEntry',
            src: 'deleteEntry',
            onDone: [
              {
                actions: 'onSuccess',
                target: 'dismiss',
              },
            ],
            onError: [
              {
                target: 'errored',
              },
            ],
          },
        },
        errored: {
          on: {
            'DELETE.DIALOG.CONFIRM': {
              target: 'deleting',
            },
            'DELETE.DIALOG.CANCEL': {
              target: 'dismiss',
            },
          },
        },
        canceled: {
          type: 'final',
        },
        dismiss: {
          type: 'final',
        },
      },
      onDone: {
        target: 'closed',
      },
    },
  },
})
