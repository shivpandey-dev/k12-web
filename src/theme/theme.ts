'use client';

import { createTheme } from '@mui/material/styles';

// Placeholder theme: brand palette, typography and component overrides
// will be defined in the dedicated theme step.
export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});
