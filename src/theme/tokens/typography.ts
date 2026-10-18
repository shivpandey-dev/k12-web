/** Inter is loaded with next/font in the root layout and exposed as this CSS variable. */
export const FONT_FAMILY =
  'var(--font-inter), "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const fontWeight = { regular: 400, medium: 500, semibold: 600 } as const;

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: string;
}

/** Sizes and line heights in px. Base text is 14px for dense admin screens. */
export const typeScale = {
  display: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.02em',
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.015em',
  },
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.01em',
  },
  heading3: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.semibold },
  title: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.semibold },
  body: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.regular },
  label: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.medium },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular },
  button: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium },
} as const satisfies Record<string, TypeStyle>;

export type TypeScaleName = keyof typeof typeScale;
