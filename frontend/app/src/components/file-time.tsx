import {Document} from '@app/client'
import {FileTimeContext, fileTimeMachine} from '@app/filetime-machine'
import {formattedDate} from '@app/utils/get-format-date'
import {Box} from '@components/box'
import {Text} from '@components/text'
import {useMachine} from '@xstate/react'

type FileTimeProps = {
  type: Pick<FileTimeContext, 'type'>[0]
  document: Document
}

export function FileTime({type, document}: FileTimeProps) {
  const [state, send] = useMachine(() =>
    fileTimeMachine.withContext({
      type,
      current: document.createTime,
      createTime: document.createTime,
      updateTime: document.updateTime,
      publishTime: document.publishTime,
      showLabel: false,
    }),
  )

  return state.context.current ? (
    <Box
      onClick={() => send('CLICK')}
      css={{
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          cursor: 'default',
          userSelect: 'none',
          gap: '$2',
        },
      }}
    >
      <Text
        size="1"
        color="muted"
        css={{
          opacity: state.context.showLabel ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {state.matches('showCreateTime')
          ? 'Created'
          : state.matches('showUpdateTime')
          ? 'Updated'
          : 'Published'}
        {' at:'}
      </Text>
      <Text size="1" color="muted">
        {formattedDate(state.context.current)}
      </Text>
    </Box>
  ) : null
}
