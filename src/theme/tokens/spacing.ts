/** One spacing unit. MUI's `theme.spacing(n)` and `sx` spacing props multiply by this. */
export const SPACING_UNIT = 4;

/** Allowed spacing steps (multiples of the unit) and their pixel values. */
export const spacingScale = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;
