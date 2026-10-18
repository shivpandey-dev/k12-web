import { describe, expect, it } from 'vitest';
import { theme } from './theme';
import { brand, danger, neutral, radius, shadows, typeScale, WHITE } from './tokens';

function luminance(hex: string) {
  const [r = 0, g = 0, b = 0] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

describe('app theme', () => {
  it('maps semantic colour roles to the design tokens', () => {
    const { palette } = theme;
    expect(palette.primary.main).toBe(brand[600]);
    expect(palette.error.main).toBe(danger[500]);
    expect(palette.text.primary).toBe(neutral[900]);
    expect(palette.text.secondary).toBe(neutral[600]);
    expect(palette.background.default).toBe(neutral[50]);
    expect(palette.border.default).toBe(neutral[200]);
  });

  it('keeps button text on every filled role at WCAG AA contrast', () => {
    const roles = ['primary', 'secondary', 'error', 'warning', 'success', 'info'] as const;
    for (const role of roles) {
      const { main, contrastText } = theme.palette[role];
      expect(contrast(main, contrastText), role).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(theme.palette.text.secondary, WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it('gives every status role a soft tint whose text passes WCAG AA', () => {
    const roles = ['primary', 'secondary', 'error', 'warning', 'success', 'info'] as const;
    for (const role of roles) {
      const { soft, onSoft } = theme.palette[role];
      expect(contrast(soft, onSoft), role).toBeGreaterThanOrEqual(4.5);
    }
    expect(theme.vars.palette.success.soft).toBe(
      `var(--kd-palette-success-soft, ${theme.palette.success.soft})`,
    );
  });

  it('uses a 4px spacing and radius unit', () => {
    // With CSS variables on, spacing resolves through --kd-spacing (4px).
    expect(theme.spacing(1)).toBe('var(--kd-spacing, 4px)');
    expect(theme.spacing(4)).toBe('calc(4 * var(--kd-spacing, 4px))');
    expect(theme.shape.borderRadius).toBe(radius.xs);
  });

  it('exposes colours as kd-prefixed CSS variables', () => {
    expect(theme.vars.palette.primary.main).toBe(`var(--kd-palette-primary-main, ${brand[600]})`);
  });

  it('maps the type scale onto MUI variants and disables off-scale ones', () => {
    const { typography } = theme;
    expect(typography.fontSize).toBe(typeScale.body.fontSize);
    expect(typography.h1.fontSize).toBe('1.5rem');
    expect(typography.body1.fontSize).toBe('0.875rem');
    expect(typography.display.fontSize).toBe('1.75rem');
    expect(typography.label.fontWeight).toBe(500);
    expect(typography.button.textTransform).toBe('none');
  });

  it('maps MUI elevations onto the four shadow levels', () => {
    expect(theme.shadows).toHaveLength(25);
    expect(theme.shadows[1]).toBe(shadows.xs);
    expect(theme.shadows[8]).toBe(shadows.md);
    expect(theme.shadows[24]).toBe(shadows.lg);
  });

  it('carries the extra token groups on the theme', () => {
    expect(theme.radius.md).toBe(8);
    expect(theme.sizes.controlHeight.medium).toBe(36);
    expect(theme.tokenShadows.focusRing).toContain(brand[200]);
  });
});
