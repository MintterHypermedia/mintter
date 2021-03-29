import {styled} from '../stitches.config'

export const Text = styled('span', {
  display: 'block',
  margin: 0,

  variants: {
    size: {
      1: {
        fontSize: '$1',
        fontWeight: '$medium',
        letterSpacing: '0.01em',
        lineHeight: '$1',
      },
      2: {
        fontSize: '$2',
        fontWeight: '$medium',
        letterSpacing: '0.01em',
        lineHeight: '$2',
      },
      3: {
        fontSize: '$3',
        fontWeight: '$medium',
        letterSpacing: '0.01em',
        lineHeight: '$2',
      },
      4: {
        fontSize: '$4',
        fontWeight: '$regular',
        letterSpacing: '0.02em',
        lineHeight: '$3',
      },
      5: {
        fontSize: '$3',
        fontWeight: '$medium',
        letterSpacing: '0.03em',
        lineHeight: '$2',
      },
      6: {
        fontSize: '$4',
        fontWeight: '$medium',
        letterSpacing: '0.02em',
        lineHeight: '$2',
      },
      7: {
        fontSize: '$5',
        fontWeight: '$medium',
        letterSpacing: '0.01em',
        lineHeight: '$1',
      },
      8: {
        fontSize: '$6',
        fontWeight: '$medium',
        letterSpacing: '0.01em',
        lineHeight: '$1',
      },
      9: {
        fontSize: '$7',
        fontWeight: '$bold',
        letterSpacing: '0.01em',
        lineHeight: '$1',
      },
    },
    alt: {
      true: {
        fontFamily: '$alt',
      },
    },
    color: {
      default: {
        color: '$text-default',
      },
      alt: {
        color: '$text-alt',
      },
      muted: {
        color: '$text-muted',
      },
      opposite: {
        color: '$text-opposite',
      },
      contrast: {
        color: '$text-contrast',
      },
    },
  },

  defaultVariants: {
    size: '3',
    color: 'default',
  },

  compoundVariants: [
    {
      alt: true,
      size: '9',
      css: {
        letterSpacing: '-0.01em',
      },
    },
    {
      alt: true,
      size: '8',
      css: {
        fontWeight: '$bold',
        letterSpacing: '-0.02em',
      },
    },
    {
      alt: true,
      size: '7',
      css: {
        fontWeight: '$bold',
        letterSpacing: '-0.02em',
      },
    },
    {
      alt: true,
      size: '6',
      css: {
        fontWeight: '$bold',
        letterSpacing: '-0.01em',
      },
    },
    {
      alt: true,
      size: '5',
      css: {
        fontWeight: '$bold',
        letterSpacing: '-0.01em',
      },
    },
  ],
})

export type TextProps = React.ComponentProps<typeof Text>
