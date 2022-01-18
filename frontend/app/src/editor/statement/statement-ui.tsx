import {css, styled} from '@app/stitches.config'

export const statementStyle = css({
  marginTop: '$6',
  padding: 0,

  wordBreak: 'break-word',
  position: 'relative',
  '&::marker': {
    color: '$text-muted',
  },
  [`[data-element-type="orderedList"] > &::marker`]: {
    fontSize: '0.8em',
  },
  [`[data-element-type="unorderedList"] > &::marker`]: {
    fontSize: '1.2em',
  },
})

export const StatementUI = styled('li', statementStyle)
