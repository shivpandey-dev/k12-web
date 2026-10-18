import type { controlHeight, focusRing, radius, rowHeight, shadows } from './tokens';

interface BorderPalette {
  subtle: string;
  default: string;
  strong: string;
  focus: string;
}

interface ThemeSizes {
  controlHeight: typeof controlHeight;
  rowHeight: typeof rowHeight;
}

type ThemeShadowTokens = typeof shadows & { focusRing: typeof focusRing };

declare module '@mui/material/styles' {
  interface Palette {
    border: BorderPalette;
  }
  interface PaletteOptions {
    border?: BorderPalette;
  }

  interface TypographyVariants {
    display: TypographyStyle;
    title: TypographyStyle;
    label: TypographyStyle;
  }
  interface TypographyVariantsOptions {
    display?: TypographyStyle;
    title?: TypographyStyle;
    label?: TypographyStyle;
  }

  interface Theme {
    radius: typeof radius;
    tokenShadows: ThemeShadowTokens;
    sizes: ThemeSizes;
  }
  interface ThemeOptions {
    radius?: typeof radius;
    tokenShadows?: ThemeShadowTokens;
    sizes?: ThemeSizes;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true;
    title: true;
    label: true;
    // Off-scale MUI defaults are disabled so text stays on the design-system scale.
    h4: false;
    h5: false;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    overline: false;
  }
}
