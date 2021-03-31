import {styled} from '../stitches.config'

export const Button = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  cursor: 'pointer',
  fontFamily: '$default',
  fontWeight: '$medium',
  textAlign: 'center',

  '&:disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },

  variants: {
    variant: {
      solid: {
        backgroundColor: '$$solid-background-color',
        color: '$$solid-text-color',
        '&:hover': {
          backgroundColor: '$$solid-hovered-background-color',
        },
        '&:active': {
          backgroundColor: '$$solid-active-background-color',
        },
      },
      outlined: {
        backgroundColor: 'transparent',
        boxShadow:
          'inset 0px 0px 0px $$outlined-border-size $$outlined-border-color',
        color: '$$outlined-text-color',
        '&:hover': {
          backgroundColor: '$$outlined-hovered-background-color',
        },
        '&:active': {
          backgroundColor: '$$outlined-active-background-color',
        },
      },
    },
    size: {
      1: {
        '$$outlined-border-size': '1px',
        fontSize: '$2',
        lineHeight: '$1',
        paddingHorizontal: '$3',
        paddingVertical: '$2',
      },
      2: {
        '$$outlined-border-size': '1.5px',
        fontSize: '$3',
        lineHeight: '$2',
        paddingHorizontal: '$5',
        paddingVertical: '$3',
      },
      3: {
        '$$outlined-border-size': '2px',
        fontSize: '$4',
        fontWeight: '$bold',
        lineHeight: '$2',
        paddingHorizontal: '$6',
        paddingVertical: '$4',
      },
    },
    color: {
      primary: {
        '$$solid-background-color': '$colors$primary-default',
        '$$solid-text-color': '$colors$primary-contrast',
        '$$solid-hovered-background-color': '$colors$primary-strong',
        '$$solid-active-background-color': '$colors$primary-stronger',
        '$$outlined-border-color': '$colors$primary-default',
        '$$outlined-text-color': '$colors$primary-default',
        '$$outlined-hovered-background-color': '$colors$primary-muted',
        '$$outlined-active-background-color': '$colors$primary-softer',
      },
      secondary: {
        '$$solid-background-color': '$colors$secondary-default',
        '$$solid-text-color': '$colors$secondary-contrast',
        '$$solid-hovered-background-color': '$colors$secondary-strong',
        '$$solid-active-background-color': '$colors$secondary-stronger',
        '$$outlined-border-color': '$colors$secondary-default',
        '$$outlined-text-color': '$colors$secondary-default',
        '$$outlined-hovered-background-color': '$colors$secondary-muted',
        '$$outlined-active-background-color': '$colors$secondary-softer',
      },
      terciary: {
        '$$solid-background-color': '$colors$terciary-default',
        '$$solid-text-color': '$colors$terciary-contrast',
        '$$solid-hovered-background-color': '$colors$terciary-strong',
        '$$solid-active-background-color': '$colors$terciary-stronger',
        '$$outlined-border-color': '$colors$terciary-default',
        '$$outlined-text-color': '$colors$terciary-default',
        '$$outlined-hovered-background-color': '$colors$terciary-muted',
        '$$outlined-active-background-color': '$colors$terciary-softer',
      },
      success: {
        '$$solid-background-color': '$colors$success-default',
        '$$solid-text-color': '$colors$success-contrast',
        '$$solid-hovered-background-color': '$colors$success-strong',
        '$$solid-active-background-color': '$colors$success-stronger',
        '$$outlined-border-color': '$colors$success-default',
        '$$outlined-text-color': '$colors$success-default',
        '$$outlined-hovered-background-color': '$colors$success-muted',
        '$$outlined-active-background-color': '$colors$success-softer',
      },
      warning: {
        '$$solid-background-color': '$colors$warning-default',
        '$$solid-text-color': '$colors$warning-contrast',
        '$$solid-hovered-background-color': '$colors$warning-strong',
        '$$solid-active-background-color': '$colors$warning-stronger',
        '$$outlined-border-color': '$colors$warning-default',
        '$$outlined-text-color': '$colors$warning-default',
        '$$outlined-hovered-background-color': '$colors$warning-muted',
        '$$outlined-active-background-color': '$colors$warning-softer',
      },
      danger: {
        '$$solid-background-color': '$colors$danger-default',
        '$$solid-text-color': '$colors$danger-contrast',
        '$$solid-hovered-background-color': '$colors$danger-strong',
        '$$solid-active-background-color': '$colors$danger-stronger',
        '$$outlined-border-color': '$colors$danger-default',
        '$$outlined-text-color': '$colors$danger-default',
        '$$outlined-hovered-background-color': '$colors$danger-muted',
        '$$outlined-active-background-color': '$colors$danger-softer',
      },
      transparent: {
        '$$solid-background-color': 'transparent',
        '$$solid-text-color': 'currentColor',
        '$$solid-hovered-background-color': 'transparent',
        '$$solid-active-background-color': 'transparent',
        '$$outlined-border-color': 'transparent',
        '$$outlined-text-color': 'currentColor',
        '$$outlined-hovered-background-color': 'transparent',
        '$$outlined-active-background-color': 'transparent',
      },
    },
    appearance: {
      pill: {
        borderRadius: '$pill',
      },
      rounded: {
        borderRadius: '$1',
      },
      square: {
        borderRadius: '0',
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: '2',
    color: 'primary',
    appearance: 'pill',
  },
})

// TODO: when passing `as` to component it complains
export type ButtonProps = React.ComponentProps<typeof Button>
