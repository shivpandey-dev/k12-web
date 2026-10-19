import { vi } from 'vitest';

/**
 * Shared stand-in for `next/navigation` in component tests:
 * `vi.mock('next/navigation', () => nextNavigationMock)`.
 */
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const location = { pathname: '/', search: '' };

export const nextNavigationMock = {
  useRouter: () => routerMock,
  usePathname: () => location.pathname,
  useSearchParams: () => new URLSearchParams(location.search),
};

/** Sets what usePathname/useSearchParams return, e.g. `setLocation('/login', 'returnTo=%2Ffees')`. */
export function setLocation(pathname: string, search = ''): void {
  location.pathname = pathname;
  location.search = search;
}

export function resetNavigationMock(): void {
  setLocation('/');
  for (const fn of Object.values(routerMock)) fn.mockReset();
}
