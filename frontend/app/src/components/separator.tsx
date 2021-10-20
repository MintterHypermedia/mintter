import {styled} from '@mintter/ui/stitches.config'
import * as RadixSeparator from '@radix-ui/react-separator'

export const Separator = styled(RadixSeparator.Root, {
  backgroundColor: '$background-neutral',
  '&[data-orientation=horizontal]': {height: 1, width: '100%'},
  '&[data-orientation=vertical]': {height: '100%', width: 1},
  margin: '20px 0',
})
