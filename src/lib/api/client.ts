import createClient from 'openapi-fetch';
import { toApiError } from './api-error';
import type { paths } from './schema';

/**
 * Connects the client to session state without the client depending on the auth module.
 * Registered once by the auth module.
 */
export interface ApiAuthBridge {
  getAccessToken: () => string | null;
  /** Returns a fresh access token, or null when the session cannot be renewed. */
  refresh: () => Promise<string | null>;
}

let authBridge: ApiAuthBridge | null = null;

export function configureApiAuth(bridge: ApiAuthBridge | null): void {
  authBridge = bridge;
}

/** Endpoints that authenticate on their own and must never trigger a refresh-and-retry. */
const NO_REFRESH_PATHS = [
  '/api/v1/auth/login',
  '/api/v1/auth/tenant-login',
  '/api/v1/auth/refresh',
  '/api/v1/platform-admin/',
];

function shouldRefresh(request: Request): boolean {
  const { pathname } = new URL(request.url);
  return !NO_REFRESH_PATHS.some((path) => pathname.startsWith(path));
}

function withToken(request: Request, token: string | null): Request {
  const next = new Request(request);
  if (token !== null) next.headers.set('Authorization', `Bearer ${token}`);
  return next;
}

/** Adds the bearer token and, after a 401, refreshes once and retries the request once. */
async function authFetch(request: Request): Promise<Response> {
  const bridge = authBridge;
  const retryable = request.clone();
  const response = await fetch(withToken(request, bridge?.getAccessToken() ?? null));

  if (response.status !== 401 || bridge === null || !shouldRefresh(request)) return response;

  const token = await bridge.refresh();
  if (token === null) return response;
  return fetch(withToken(retryable, token));
}

function defaultBaseUrl(): string {
  // Spec paths already include /api/v1. Browsers call the same-origin proxy (next.config rewrites).
  return typeof window === 'undefined' ? '' : window.location.origin;
}

export function createApiClient(baseUrl = defaultBaseUrl()) {
  return createClient<paths>({ baseUrl, fetch: authFetch, credentials: 'include' });
}

export const api = createApiClient();

/** Unwraps an openapi-fetch result: returns data or throws an ApiError. */
export async function unwrap<T>(
  call: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  const { data, error, response } = await call;
  if (!response.ok) throw toApiError(error, response);
  return data as T;
}
