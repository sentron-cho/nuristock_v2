import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, theme, createTheme, config } = createStitches({
  theme: {
    colors: {
      primary: '#745af2',
      secondary: '#545b62',
      info: '#398bf7',
      danger: '#ef5350',
      success: '#06d79c',
      warning: '#ffb22b',
      error: '#ef5350',
      dark: '#242a33',
      light: '#eaf2fb',
      white: '#fff',
      black: '#000',

      gray100: '#f8f9fa',
      gray200: '#f2f7f8',
      gray300: '#dee2e6',
      gray400: '#ced4da',
      gray500: '#adb5bd',
      gray600: '#99abb4',
      gray700: '#495057',
      gray800: '#343a40',
      gray900: '#1e2a35',
    },
    space: {
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
      10: '10px',
      12: '12px',
      16: '16px',
      20: '20px',
      24: '24px',
      28: '28px',
      32: '32px',
      40: '40px',
      64: '64px',
    },
    fonts: {
      body: 'system-ui, sans-serif',
    },
    fontSizes: {
      xxs: '10px',
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      xxl: '32px',
    },
    radii: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
  },
  media: {
    sm: '(max-width: 640px)',
    md: '(max-width: 768px)',
    lg: '(max-width: 1024px)',
  },
  utils: {
    // margin x 축 (mx)
    mx: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    // padding y 축 (py)
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    // shorthand bg
    bg: (value: string) => ({
      backgroundColor: value,
    }),
  },
});
