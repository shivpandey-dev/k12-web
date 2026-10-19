import { describe, expect, it } from 'vitest';
import { loginPathFor, safeReturnTo } from './return-to';

describe('safeReturnTo', () => {
  it('keeps same-origin relative paths with query and hash', () => {
    expect(safeReturnTo('/fees?class=5#due')).toBe('/fees?class=5#due');
  });

  it.each([
    null,
    '',
    'fees',
    'https://evil.example/home',
    '//evil.example/home',
    '/\\evil.example',
    'javascript:alert(1)',
  ])('falls back to home for %s', (value) => {
    expect(safeReturnTo(value)).toBe('/home');
  });

  it('never returns to the sign-in or change-password pages', () => {
    expect(safeReturnTo('/login?returnTo=/fees')).toBe('/home');
    expect(safeReturnTo('/change-password')).toBe('/home');
  });
});

describe('loginPathFor', () => {
  it('carries the current page as returnTo', () => {
    expect(loginPathFor('/fees')).toBe('/login?returnTo=%2Ffees');
  });

  it('drops a returnTo that would be unsafe', () => {
    expect(loginPathFor('//evil.example')).toBe('/login');
  });
});
