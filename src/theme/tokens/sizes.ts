/** Heights in px for buttons, inputs and selects. `medium` is the default (dense layout). */
export const controlHeight = {
  small: 28,
  medium: 36,
  large: 44,
} as const;

/** Table and list row heights per density. Admin screens use compact; parent and student screens can use comfortable. */
export const rowHeight = {
  compact: 36,
  comfortable: 48,
} as const;

export type Density = keyof typeof rowHeight;
