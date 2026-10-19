export const HOME_PATH = '/home';
export const LOGIN_PATH = '/login';
export const CHANGE_PASSWORD_PATH = '/change-password';
export const RETURN_TO_PARAM = 'returnTo';

const AUTH_PATHS = new Set([LOGIN_PATH, CHANGE_PASSWORD_PATH]);

/**
 * Accepts only a same-origin relative path (e.g. `/fees?class=5`) to avoid open redirects.
 * Anything else, including the auth pages themselves, falls back to home.
 */
export function safeReturnTo(value: string | null | undefined, fallback = HOME_PATH): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return fallback;
  }
  const base = 'http://kidzdiary.invalid';
  let url: URL;
  try {
    url = new URL(value, base);
  } catch {
    return fallback;
  }
  if (url.origin !== base || AUTH_PATHS.has(url.pathname)) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}

/** `/login?returnTo=…` for the page the user was trying to open. */
export function loginPathFor(currentPath: string): string {
  const returnTo = safeReturnTo(currentPath, '');
  return returnTo ? `${LOGIN_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(returnTo)}` : LOGIN_PATH;
}
