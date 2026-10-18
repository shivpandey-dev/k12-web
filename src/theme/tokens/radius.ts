/** Corner radii in px. `md` is the default for buttons and inputs. */
export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type RadiusName = keyof typeof radius;
