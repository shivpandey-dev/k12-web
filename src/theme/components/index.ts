import type { Components, Theme } from '@mui/material/styles';
import { buttonOverrides } from './button';
import { chipOverrides } from './chip';
import { inputOverrides } from './input';
import { selectionOverrides } from './selection';
import { sliderOverrides } from './slider';

const baseOverrides: Components<Theme> = {
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

/** Per-component overrides, one file per component family. */
export const components: Components<Theme> = {
  ...baseOverrides,
  ...buttonOverrides,
  ...inputOverrides,
  ...selectionOverrides,
  ...sliderOverrides,
  ...chipOverrides,
};
