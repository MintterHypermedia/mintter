import {styled, XStack} from 'tamagui'

export const ResizeHandle = styled(XStack, {
  position: 'absolute',
  width: '8px',
  height: '32px',
  top: 'calc(50% - 16px)',
  zIndex: 99999,
  bg: '$color',
  borderColor: '$background',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: '5px',
  cursor: 'ew-resize',
})
