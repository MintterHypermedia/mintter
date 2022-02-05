import {styled} from '@app/stitches.config'
import {statementStyle} from '../statement'

export const HeadingUI = styled('li', statementStyle, {
  // '& > ul, & > ol': {
  //   marginLeft: '-$8',
  //   boxShadow: 'none',
  // },
  '&:hover': {
    backgroundColor: '$block-hover',
  },
})
