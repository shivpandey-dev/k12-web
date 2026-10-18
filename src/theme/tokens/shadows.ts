import { brand } from './colors';

/** Shadows are tinted with brand-900 (rgb 35 15 53) rather than pure black. */
const tint = (opacity: number) => `rgba(35, 15, 53, ${opacity})`;

export const shadows = {
  none: 'none',
  /** Card at rest. */
  xs: `0 1px 2px ${tint(0.06)}`,
  /** Hovered or raised card. */
  sm: `0 1px 3px ${tint(0.08)}, 0 1px 2px ${tint(0.04)}`,
  /** Menus, popovers, dropdowns. */
  md: `0 4px 12px ${tint(0.1)}, 0 2px 4px ${tint(0.05)}`,
  /** Modals and drawers. */
  lg: `0 12px 32px ${tint(0.14)}, 0 4px 8px ${tint(0.06)}`,
} as const;

export type ShadowName = keyof typeof shadows;

/** Keyboard focus ring, drawn outside the element's border. */
export const focusRing = `0 0 0 3px ${brand[200]}`;
