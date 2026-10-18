import type { PaletteOptions } from '@mui/material/styles';
import { brand, danger, info, neutral, rose, success, warning, WHITE } from './tokens';

/**
 * What each colour is for. Components read these roles (via `theme.vars.palette.*` or `sx`
 * strings like `'text.secondary'`), never raw scale values, so a dark scheme only needs a second
 * mapping here.
 */
export const lightPalette = {
  primary: { light: brand[500], main: brand[600], dark: brand[700], contrastText: WHITE },
  secondary: { light: rose[500], main: rose[600], dark: rose[700], contrastText: WHITE },
  error: { light: danger[400], main: danger[500], dark: danger[600], contrastText: WHITE },
  warning: {
    light: warning[400],
    main: warning[500],
    dark: warning[600],
    contrastText: neutral[900],
  },
  success: { light: success[500], main: success[600], dark: success[700], contrastText: WHITE },
  info: { light: info[500], main: info[600], dark: info[700], contrastText: WHITE },
  grey: neutral,
  text: { primary: neutral[900], secondary: neutral[600], disabled: neutral[400] },
  background: { default: neutral[50], paper: WHITE },
  divider: neutral[200],
  border: { subtle: neutral[100], default: neutral[200], strong: neutral[300], focus: brand[600] },
  action: { active: neutral[600], disabled: neutral[400], disabledBackground: neutral[100] },
} satisfies PaletteOptions;
