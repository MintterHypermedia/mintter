import createCss, {defaultThemeMap, StitchesCss} from '@stitches/react'

const stitches = createCss({
  prefix: 'mtt-',
  theme: {
    borderStyles: {},
    borderWidths: {},
    colors: {
      // Color palette.
      'palette-common-black': '#000000',
      'palette-common-white': '#ffffff',
      'palette-blue-100': '#ffffff',
      'palette-blue-200': '#e0e3ff',
      'palette-blue-300': '#ffffff',
      'palette-blue-400': '#808aff',
      'palette-blue-500': '#4c5bff',
      'palette-blue-600': '#0015ff',
      'palette-blue-700': '#000fb2',
      'palette-blue-800': '#000b80',
      'palette-blue-900': '#ffffff',
      'palette-blue-1000': '#00004c',
      'palette-gold-100': '#ffffff',
      'palette-gold-200': '#f9e9d2',
      'palette-gold-300': '#ffffff',
      'palette-gold-400': '#ecbc79',
      'palette-gold-500': '#e5a64d',
      'palette-gold-600': '#df8f20',
      'palette-gold-700': '#82731a',
      'palette-gold-800': '#865613',
      'palette-gold-900': '#ffffff',
      'palette-gold-1000': '#432b0a',
      'palette-gray-100': '#f2f2f2',
      'palette-gray-200': '#e5e5e5',
      'palette-gray-300': '#d9d9d9',
      'palette-gray-400': '#bfbfbf',
      'palette-gray-500': '#ffffff',
      'palette-gray-600': '#ffffff',
      'palette-gray-700': '#737373',
      'palette-gray-800': '#4c4c4c',
      'palette-gray-900': '#333333',
      'palette-gray-1000': '#1a1a1a',
      'palette-green-100': '#ffffff',
      'palette-green-200': '#dfefdc',
      'palette-green-300': '#ffffff',
      'palette-green-400': '#a0cf96',
      'palette-green-500': '#80bf73',
      'palette-green-600': '#60af50',
      'palette-green-700': '#4d8c40',
      'palette-green-800': '#3a6930',
      'palette-green-900': '#ffffff',
      'palette-green-1000': '#1d3418',
      'palette-pink-100': '#ffffff',
      'palette-pink-200': '#fbdae5',
      'palette-pink-300': '#ffffff',
      'palette-pink-400': '#f48bae',
      'palette-pink-500': '#f05c8d',
      'palette-pink-600': '#e9165c',
      'palette-pink-700': '#ba124a',
      'palette-pink-800': '#740b2e',
      'palette-pink-900': '#ffffff',
      'palette-pink-1000': '#46071c',
      'palette-red-100': '#ffffff',
      'palette-red-200': '#f4d7d7',
      'palette-red-300': '#ffffff',
      'palette-red-400': '#dd8888',
      'palette-red-500': '#d16161',
      'palette-red-600': '#c63939',
      'palette-red-700': '#9e2e2e',
      'palette-red-800': '#772222',
      'palette-red-900': '#ffffff',
      'palette-red-1000': '#3b1111',
      'palette-yellow-100': '#ffffff',
      'palette-yellow-200': '#ffe8ad',
      'palette-yellow-300': '#ffffff',
      'palette-yellow-400': '#ffdb80',
      'palette-yellow-500': '#ffcc4c',
      'palette-yellow-600': '#ffbb10',
      'palette-yellow-700': '#cc9200',
      'palette-yellow-800': '#996e00',
      'palette-yellow-900': '#ffffff',
      'palette-yellow-1000': '#4d3400',

      // Semantic colors.
      'text-default': '$palette-gray-1000',
      'text-alt': '$palette-gray-800',
      'text-mutted': '$palette-gray-700',
      'text-opposite': '$palette-common-white',
      'text-contrast': '$palette-gray-400',
      'background-opposite': '$palette-gray-1000',
      'background-contrast-strong': '$palette-gray-900',
      'background-contrast': '$palette-gray-800',
      'background-contrast-soft': '$palette-gray-700',
      'background-neutral-strong': '$palette-gray-400',
      'background-neutral': '$palette-gray-300',
      'background-neutral-soft': '$palette-gray-200',
      'background-default': '$palette-gray-100',
      'background-alt': '$common-white',
    },
    fonts: {
      default: "'Basier Circle', apple-system, sans-serif",
      alt: 'Lora, serif',
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    letterSpacings: {},
    lineHeights: {},
    radii: {},
    shadows: {},
    sizes: {},
    space: {
      none: '0px',
      xxxs: '2px',
      xxs: '4px',
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '32px',
      xxl: '64px',
    },
    transitions: {},
    zIndices: {},
  },
  conditions: {},
  utils: {
    marginHorizontal: () => value => ({marginLeft: value, marginRight: value}),
  },
  themeMap: {
    ...defaultThemeMap,
    marginHorizontal: 'space' as const,
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
  ],
})

export const generateVariantsForScale = <
  TScale extends keyof Theme,
  TCSSProperty extends keyof {
    [CSSProperty in keyof typeof config.themeMap as typeof config.themeMap[CSSProperty] extends TScale
      ? CSSProperty
      : never]: typeof config.themeMap[CSSProperty]
  }
>(
  scaleName: TScale,
  cssProperty: TCSSProperty,
) => {
  return Object.entries(theme[scaleName]).reduce(
    (acc, [tokenName, token]) => ({
      ...acc,
      [tokenName]: {[cssProperty]: token},
    }),
    {},
  ) as {
    [key in keyof Theme[TScale]]: {
      [key in TCSSProperty]: Theme[TScale][keyof Theme[TScale]]
    }
  }
}

export const darkTheme = theme('dark-theme', {
  colors: {
    'text-default': '$palette-common-white',
    'text-alt': '$palette-gray-200',
    'text-mutted': '$palette-gray-400',
    'text-opposite': '$palette-gray-1000',
    'text-contrast': '$palette-gray-700',
    'background-opposite': '$palette-common-white',
    'background-contrast-strong': '$palette-gray-200',
    'background-contrast': '$palette-gray-300',
    'background-contrast-soft': '$palette-gray-400',
    'background-neutral-strong': '$palette-gray-700',
    'background-neutral': '$palette-gray-800',
    'background-neutral-soft': '$palette-gray-900',
    'background-default': '$palette-gray-1000',
    'background-alt': '$palette-common-black',
  },
})
