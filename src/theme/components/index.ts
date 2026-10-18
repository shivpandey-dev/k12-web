import type { Components, Theme } from '@mui/material/styles';

/**
 * Per-component overrides. Each component gets its own file in this folder as it is designed
 * (button.ts, text-field.ts, ...) and is spread in here.
 */
export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        // Amounts, dates and IDs line up in tables and forms.
        fontVariantNumeric: 'tabular-nums',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: { display: 'p', title: 'p', label: 'span' },
    },
  },
};
