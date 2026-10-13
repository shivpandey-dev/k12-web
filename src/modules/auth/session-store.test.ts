import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { api, unwrap } from '@/lib/api';
import { apiErrorBody, authTokenResponse } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import {
  bootstrapSession,
  clearSession,
  refreshSession,
  resetSessionStoreForTests,
  sessionStore,
  startSession,
} from './session-store';

const REFRESH = '*/api/v1/auth/refresh';

afterEach(() => resetSessionStoreForTests());

describe('session store', () => {
  it('restores an authenticated session from the refresh cookie on bootstrap', async () => {
    server.use(http.post(REFRESH, () => HttpResponse.json(authTokenResponse())));

    await bootstrapSession();

    const state = sessionStore.getState();
    expect(state.accessToken).toBe('access-1');
    expect(state.session).toMatchObject({ status: 'authenticated', user: { firstName: 'Priya' } });
  });

  it('becomes anonymous when there is no valid refresh cookie', async () => {
    server.use(
      http.post(REFRESH, () =>
        HttpResponse.json(apiErrorBody(401, 'Invalid refresh token'), { status: 401 }),
      ),
    );

    await bootstrapSession();

    expect(sessionStore.getState()).toEqual({
      accessToken: null,
      session: { status: 'anonymous' },
    });
  });

  it('shares one refresh request between concurrent callers', async () => {
    let calls = 0;
    server.use(
      http.post(REFRESH, () => {
        calls += 1;
        return HttpResponse.json(authTokenResponse({ accessToken: `access-${calls + 1}` }));
      }),
    );

    const tokens = await Promise.all([refreshSession(), refreshSession(), refreshSession()]);

    expect(calls).toBe(1);
    expect(tokens).toEqual(['access-2', 'access-2', 'access-2']);
  });

  it('renews an expired token once for parallel 401s and retries each request', async () => {
    startSession(authTokenResponse({ accessToken: 'expired' }));
    let refreshCalls = 0;
    server.use(
      http.post(REFRESH, () => {
        refreshCalls += 1;
        return HttpResponse.json(authTokenResponse({ accessToken: 'fresh' }));
      }),
      http.get('*/api/v1/auth/me', ({ request }) =>
        request.headers.get('authorization') === 'Bearer fresh'
          ? HttpResponse.json({ ok: true })
          : HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 }),
      ),
    );

    const results = await Promise.all([
      unwrap(api.GET('/api/v1/auth/me')),
      unwrap(api.GET('/api/v1/auth/me')),
    ]);

    expect(results).toEqual([{ ok: true }, { ok: true }]);
    expect(refreshCalls).toBe(1);
  });

  it('signs out when the refresh fails after a 401', async () => {
    startSession(authTokenResponse({ accessToken: 'expired' }));
    server.use(
      http.post(REFRESH, () => HttpResponse.json(apiErrorBody(401, 'revoked'), { status: 401 })),
      http.get('*/api/v1/auth/me', () =>
        HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 }),
      ),
    );

    await expect(unwrap(api.GET('/api/v1/auth/me'))).rejects.toMatchObject({ status: 401 });
    expect(sessionStore.getState().session).toEqual({ status: 'anonymous' });
  });

  it('does not try to refresh for anonymous visitors', async () => {
    clearSession();
    let refreshCalls = 0;
    server.use(
      http.post(REFRESH, () => {
        refreshCalls += 1;
        return HttpResponse.json(authTokenResponse());
      }),
      http.get('*/api/v1/auth/me', () =>
        HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 }),
      ),
    );

    await expect(unwrap(api.GET('/api/v1/auth/me'))).rejects.toMatchObject({ status: 401 });
    expect(refreshCalls).toBe(0);
  });
});
