import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@/test/render';
import DesignSystemPage from './page';

const notFound = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NEXT_HTTP_ERROR_FALLBACK;404');
  }),
);
vi.mock('next/navigation', () => ({ notFound }));

afterEach(() => vi.unstubAllEnvs());

describe('design system page', () => {
  it('renders the token reference in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    renderWithTheme(<DesignSystemPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'KidzDiary design system' }),
    ).toBeVisible();
    for (const section of [
      'Colour',
      'Typography',
      'Spacing',
      'Radius',
      'Shadows',
      'Sizes',
      'Buttons',
      'Text fields and select',
      'Checkbox, radio, switch and slider',
      'Chips',
      'Cards and empty state',
      'Tabs',
      'Alert banners',
      'Modal, drawer and toasts',
      'Data table',
      'Charts',
    ]) {
      expect(screen.getByRole('region', { name: section })).toBeInTheDocument();
    }
    expect(screen.getByTitle('#614084')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('is not available in production builds', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => DesignSystemPage()).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    expect(notFound).toHaveBeenCalledOnce();
  });
});
