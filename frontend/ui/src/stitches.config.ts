import createCss, {defaultThemeMap, StitchesCss} from '@stitches/react'

export * from '@stitches/core'

const stitches = createCss({
  prefix: 'mtt-',
  theme: {
    borderStyles: {},
    borderWidths: {},
    colors: {
      'background-opposite': '',
      'background-contrast-strong': '',
      'background-contrast': '',
      'background-contrast-soft': '',
      'background-neutral-strong': '',
      'background-neutral': '',
      'background-neutral-soft': '',
      'background-default': '',
      'background-alt': '',
      'background-muted': '',
      'text-default': '',
      'text-alt': '',
      'text-muted': '',
      'text-opposite': '',
      'text-contrast': '',
      'primary-opposite': '',
      'primary-stronger': '',
      'primary-strong': '',
      'primary-default': '',
      'primary-soft': '',
      'primary-softer': '',
      'primary-muted': '',
      'primary-contrast': '',
      'secondary-opposite': '',
      'secondary-stronger': '',
      'secondary-strong': '',
      'secondary-default': '',
      'secondary-soft': '',
      'secondary-softer': '',
      'secondary-muted': '',
      'secondary-contrast': '',
      'terciary-opposite': '',
      'terciary-stronger': '',
      'terciary-strong': '',
      'terciary-default': '',
      'terciary-soft': '',
      'terciary-softer': '',
      'terciary-muted': '',
      'terciary-contrast': '',
      'success-opposite': '',
      'success-stronger': '',
      'success-strong': '',
      'success-default': '',
      'success-soft': '',
      'success-softer': '',
      'success-muted': '',
      'success-contrast': '',
      'warning-opposite': '',
      'warning-stronger': '',
      'warning-strong': '',
      'warning-default': '',
      'warning-soft': '',
      'warning-softer': '',
      'warning-muted': '',
      'warning-contrast': '',
      'danger-opposite': '',
      'danger-stronger': '',
      'danger-strong': '',
      'danger-default': '',
      'danger-soft': '',
      'danger-softer': '',
      'danger-muted': '',
      'danger-contrast': '',
    },
    fonts: {
      default: '"Basier Circle", apple-system, sans-serif',
      alt: '"Lora", serif',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '20px',
      5: '24px',
      6: '32px',
      7: '48px',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    letterSpacings: {},
    lineHeights: {
      1: '1.2',
      2: '1.4',
      3: '1.6',
    },
    radii: {
      1: '3px',
      2: '5px',
      3: '7px',
      round: '50%',
      pill: '9999px',
    },
    shadows: {
      3: '0px 4px 8px rgba(0, 0, 0, 0.15);',
    },
    sizes: {
      none: '0px',
      'one-quarter': '25%',
      'one-third': '33.333%',
      half: '50%',
      'two-thirds': '66.6666%',
      'three-quarters': '75%',
      full: '100%',
    },
    space: {
      1: '2px',
      2: '4px',
      3: '8px',
      4: '12px',
      5: '16px',
      6: '20px',
      7: '32px',
      8: '64px',
    },
    zIndices: {
      1: '100',
      2: '200',
      3: '300',
      4: '400',
      max: '999',
    },
  },
  // TODO: Fix types
  // @ts-ignore
  media: {},
  utils: {
    marginHorizontal: () => val => ({marginLeft: val, marginRight: val}),
    marginVertical: () => val => ({marginTop: val, marginBottom: val}),
    paddingHorizontal: () => val => ({paddingLeft: val, paddingRight: val}),
    paddingVertical: () => val => ({paddingTop: val, paddingBottom: val}),
  },
  themeMap: {
    ...defaultThemeMap,
    marginHorizontal: 'space' as const,
    marginVertical: 'space' as const,
    paddingHorizontal: 'space' as const,
    paddingVertical: 'space' as const,
  },
})

export const {
  styled,
  css,
  theme,
  getCssString,
  global,
  keyframes,
  config,
} = stitches
export type Theme = typeof theme
export type CSS = StitchesCss<typeof stitches>

export const lightTheme = theme('light-theme', {
  colors: {
    'background-opposite': '#1A1A1A',
    'background-contrast-strong': '#333333',
    'background-contrast': '#4C4C4C',
    'background-contrast-soft': '#737373',
    'background-neutral-strong': '#BFBFBF',
    'background-neutral': '#D9D9D9',
    'background-neutral-soft': '#E5E5E5',
    'background-default': '#F2F2F2',
    'background-alt': '#FFFFFF',
    'background-muted': '#f5f5f5',
    'text-default': '#1A1A1A',
    'text-alt': '#4C4C4C',
    'text-muted': '#737373',
    'text-opposite': '#FFFFFF',
    'text-contrast': '#BFBFBF',
    'primary-opposite': '#00004C',
    'primary-stronger': '#000B80',
    'primary-strong': '#000FB2',
    'primary-default': '#0015FF',
    'primary-soft': '#4C5BFF',
    'primary-softer': '#808AFF',
    'primary-muted': '#E0E3FF',
    'primary-contrast': '#FFFFFF',
    'secondary-opposite': '#4D3700',
    'secondary-stronger': '#996E00',
    'secondary-strong': '#CC9200',
    'secondary-default': '#FFBB10',
    'secondary-soft': '#FFCC4C',
    'secondary-softer': '#FFDB80',
    'secondary-muted': '#FFE8AD',
    'secondary-contrast': '#FFFFFF',
    'terciary-opposite': '#46071C',
    'terciary-stronger': '#740B2E',
    'terciary-strong': '#BA124A',
    'terciary-default': '#E9165C',
    'terciary-soft': '#F05C8D',
    'terciary-softer': '#F48BAE',
    'terciary-muted': '#FBDAE5',
    'terciary-contrast': '#FFFFFF',
    'success-opposite': '#1D3418',
    'success-stronger': '#3A6930',
    'success-strong': '#4D8C40',
    'success-default': '#60AF50',
    'success-soft': '#80BF73',
    'success-softer': '#A0CF96',
    'success-muted': '#DFEFDC',
    'success-contrast': '#FFFFFF',
    'warning-opposite': '#432B0A',
    'warning-stronger': '#865613',
    'warning-strong': '#B2731A',
    'warning-default': '#DF8F20',
    'warning-soft': '#E5A64D',
    'warning-softer': '#ECBC79',
    'warning-muted': '#F9E9D2',
    'warning-contrast': '#FFFFFF',
    'danger-opposite': '#3B1111',
    'danger-stronger': '#772222',
    'danger-strong': '#9E2E2E',
    'danger-default': '#C63939',
    'danger-soft': '#D16161',
    'danger-softer': '#DD8888',
    'danger-muted': '#F4D7D7',
    'danger-contrast': '#FFFFFF',
  },
})

export const darkTheme = theme('dark-theme', {
  colors: {
    'background-opposite': '#FFFFFF',
    'background-contrast-strong': '#E5E5E5',
    'background-contrast': '#D9D9D9',
    'background-contrast-soft': '#BFBFBF',
    'background-neutral-strong': '#737373',
    'background-neutral': '#4C4C4C',
    'background-neutral-soft': '#333333',
    'background-default': '#1A1A1A',
    'background-alt': '#000000',
    'background-muted': '#1D1D1D',
    'text-default': '#FFFFFF',
    'text-alt': '#E5E5E5',
    'text-muted': '#E5E5E5',
    'text-opposite': '#1A1A1A',
    'text-contrast': '#737373',
    'primary-opposite': '#00004C',
    'primary-stronger': '#000B80',
    'primary-strong': '#000FB2',
    'primary-default': '#0015FF',
    'primary-soft': '#4C5BFF',
    'primary-softer': '#808AFF',
    'primary-muted': '#E0E3FF',
    'primary-contrast': '#FFFFFF',
    'secondary-opposite': '#4D3700',
    'secondary-stronger': '#996E00',
    'secondary-strong': '#CC9200',
    'secondary-default': '#FFBB10',
    'secondary-soft': '#FFCC4C',
    'secondary-softer': '#FFDB80',
    'secondary-muted': '#FFE8AD',
    'secondary-contrast': '#FFFFFF',
    'terciary-opposite': '#46071C',
    'terciary-stronger': '#740B2E',
    'terciary-strong': '#BA124A',
    'terciary-default': '#E9165C',
    'terciary-soft': '#F05C8D',
    'terciary-softer': '#F48BAE',
    'terciary-muted': '#FBDAE5',
    'terciary-contrast': '#FFFFFF',
    'success-opposite': '#1D3418',
    'success-stronger': '#3A6930',
    'success-strong': '#4D8C40',
    'success-default': '#60AF50',
    'success-soft': '#80BF73',
    'success-softer': '#A0CF96',
    'success-muted': '#DFEFDC',
    'success-contrast': '#FFFFFF',
    'warning-opposite': '#432B0A',
    'warning-stronger': '#865613',
    'warning-strong': '#B2731A',
    'warning-default': '#DF8F20',
    'warning-soft': '#E5A64D',
    'warning-softer': '#ECBC79',
    'warning-muted': '#F9E9D2',
    'warning-contrast': '#FFFFFF',
    'danger-opposite': '#3B1111',
    'danger-stronger': '#772222',
    'danger-strong': '#9E2E2E',
    'danger-default': '#C63939',
    'danger-soft': '#D16161',
    'danger-softer': '#DD8888',
    'danger-muted': '#F4D7D7',
    'danger-contrast': '#FFFFFF',
  },
})

export const globalStyles = global({
  '@font-face': [
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/regular.eot'), url('/fonts/basier-circle/regular.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/regular.woff2') format('woff2'), url('/fonts/basier-circle/regular.woff') format('woff'), url('/fonts/basier-circle/regular.ttf') format('truetype')",
      fontWeight: '400',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/regular-italic.eot'), url('/fonts/basier-circle/regular-italic.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/regular-italic.woff2') format('woff2'), url('/fonts/basier-circle/regular-italic.woff') format('woff'), url('/fonts/basier-circle/regular-italic.ttf') format('truetype')",
      fontWeight: '400',
      fontStyle: 'italic',
    },
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/medium.eot'), url('/fonts/basier-circle/medium.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/medium.woff2') format('woff2'), url('/fonts/basier-circle/medium.woff') format('woff'), url('/fonts/basier-circle/medium.ttf') format('truetype')",
      fontWeight: '500',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/medium-italic.eot'), url('/fonts/basier-circle/medium-italic.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/medium-italic.woff2') format('woff2'), url('/fonts/basier-circle/medium-italic.woff') format('woff'), url('/fonts/basier-circle/medium-italic.ttf') format('truetype')",
      fontWeight: '500',
      fontStyle: 'italic',
    },
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/bold.eot'), url('/fonts/basier-circle/bold.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/bold.woff2') format('woff2'), url('/fonts/basier-circle/bold.woff') format('woff'), url('/fonts/basier-circle/bold.ttf') format('truetype')",
      fontWeight: '700',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Basier Circle',
      src:
        "url('/fonts/basier-circle/bold-italic.eot'), url('/fonts/basier-circle/bold-italic.eot?#iefix') format('embedded-opentype'), url('/fonts/basier-circle/bold-italic.woff2') format('woff2'), url('/fonts/basier-circle/bold-italic.woff') format('woff'), url('/fonts/basier-circle/bold-italic.ttf') format('truetype')",
      fontWeight: '700',
      fontStyle: 'italic',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/regular.ttf') format('truetype')",
      fontWeight: '400',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/regular-italic.ttf') format('truetype')",
      fontWeight: '400',
      fontStyle: 'italic',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/medium.ttf') format('truetype')",
      fontWeight: '500',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/medium-italic.ttf') format('truetype')",
      fontWeight: '500',
      fontStyle: 'italic',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/bold.ttf') format('truetype')",
      fontWeight: '700',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Lora',
      src: "url('/fonts/lora/bold-italic.ttf') format('truetype')",
      fontWeight: '700',
      fontStyle: 'italic',
    },
  ],
  body: {
    backgroundColor: '$background-alt',
    color: '$text-default',
    fontFamily: '$default',
    fontSize: '$3',
    margin: 0,
    transition: 'background-color color 0.25s ease',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
})
