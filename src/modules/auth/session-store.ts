import { createStore } from 'zustand/vanilla';
import { configureApiAuth } from '@/lib/api';
import { authApi, type AuthMe, type AuthTokenResponse } from './api/auth-api';

export type SessionState =
  { status: 'loading' } | { status: 'anonymous' } | ({ status: 'authenticated' } & AuthMe);

interface SessionStore {
  session: SessionState;
  /** Memory only — never persisted. The HttpOnly refresh cookie restores it after a reload. */
  accessToken: string | null;
}

/** Renew this many seconds before the access token expires. */
const REFRESH_LEEWAY_SECONDS = 60;
const MIN_REFRESH_DELAY_SECONDS = 10;

export const sessionStore = createStore<SessionStore>(() => ({
  session: { status: 'loading' },
  accessToken: null,
}));

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let inFlightRefresh: Promise<string | null> | null = null;
let bootstrapped = false;

function scheduleRefresh(expiresInSeconds: number): void {
  clearTimeout(refreshTimer);
  const delay = Math.max(expiresInSeconds - REFRESH_LEEWAY_SECONDS, MIN_REFRESH_DELAY_SECONDS);
  refreshTimer = setTimeout(() => void refreshSession(), delay * 1_000);
}

export function startSession(response: AuthTokenResponse): void {
  scheduleRefresh(response.expiresIn);
  sessionStore.setState({
    accessToken: response.accessToken,
    session: { status: 'authenticated', user: response.user, credential: response.credential },
  });
}

/** Replaces the identity after a profile or password change, keeping the token. */
export function updateIdentity(me: AuthMe): void {
  if (sessionStore.getState().session.status !== 'authenticated') return;
  sessionStore.setState({ session: { status: 'authenticated', ...me } });
}

/** Clears the forced-password-change flag locally when the identity can't be re-read. */
export function markPasswordChanged(): void {
  const { session } = sessionStore.getState();
  if (session.status !== 'authenticated') return;
  sessionStore.setState({
    session: { ...session, credential: { ...session.credential, mustChangePassword: false } },
  });
}

export function clearSession(): void {
  clearTimeout(refreshTimer);
  sessionStore.setState({ accessToken: null, session: { status: 'anonymous' } });
}

/**
 * Rotates the refresh cookie. Concurrent callers share one request because k12-api treats
 * reuse of a rotated refresh token as theft and revokes the whole session.
 */
export function refreshSession(): Promise<string | null> {
  inFlightRefresh ??= authApi
    .refresh()
    .then((response) => {
      startSession(response);
      return response.accessToken;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      inFlightRefresh = null;
    });
  return inFlightRefresh;
}

/** Restores the session from the refresh cookie, once per page load. */
export function bootstrapSession(): Promise<string | null> | null {
  if (bootstrapped) return null;
  bootstrapped = true;
  return refreshSession();
}

configureApiAuth({
  getAccessToken: () => sessionStore.getState().accessToken,
  // Only a live session is renewed after a 401; an anonymous visitor stays anonymous.
  refresh: () =>
    sessionStore.getState().session.status === 'authenticated'
      ? refreshSession()
      : Promise.resolve(null),
});

/** Test-only: restores the initial state. */
export function resetSessionStoreForTests(): void {
  clearTimeout(refreshTimer);
  inFlightRefresh = null;
  bootstrapped = false;
  sessionStore.setState({ accessToken: null, session: { status: 'loading' } });
}
