'use client';

import { createTheme, type Shadows } from '@mui/material/styles';
import { components } from './components';
import { lightPalette } from './semantic';
import { controlHeight, focusRing, radius, rowHeight, shadows, SPACING_UNIT } from './tokens';
import { typography } from './typography';

const { xs, sm, md, lg } = shadows;

// MUI expects 25 elevation levels; ours has four. Menus use elevation 8 (md), dialogs 24 (lg).
const muiShadows: Shadows = [
  'none',
  xs,
  sm,
  sm,
  md,
  md,
  md,
  md,
  md,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
  lg,
];

export const theme = createTheme({
  cssVariables: { cssVarPrefix: 'kd', colorSchemeSelector: 'data' },
  // Dark mode is added later as a second entry with its own semantic mapping.
  colorSchemes: { light: { palette: lightPalette } },
  spacing: SPACING_UNIT,
  // Radius unit, like the spacing unit: sx={{ borderRadius: 2 }} = 8px (md), 3 = 12px (lg).
  // Components set their own radius (md for controls) in ./components.
  shape: { borderRadius: radius.xs },
  shadows: muiShadows,
  typography,
  components,
  radius,
  tokenShadows: { ...shadows, focusRing },
  sizes: { controlHeight, rowHeight },
});
