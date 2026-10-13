import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiErrorBody } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { ApiError } from './api-error';
import { api, configureApiAuth, unwrap } from './client';

const ME = '*/api/v1/auth/me';
const me = { user: { firstName: 'Priya' } };

afterEach(() => configureApiAuth(null));

describe('api client', () => {
  it('sends the current access token as a bearer token', async () => {
    configureApiAuth({ getAccessToken: () => 'token-a', refresh: vi.fn() });
    server.use(
      http.get(ME, ({ request }) =>
        request.headers.get('authorization') === 'Bearer token-a'
          ? HttpResponse.json(me)
          : HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 }),
      ),
    );

    await expect(unwrap(api.GET('/api/v1/auth/me'))).resolves.toEqual(me);
  });

  it('refreshes once after a 401 and retries with the new token', async () => {
    const refresh = vi.fn().mockResolvedValue('token-b');
    configureApiAuth({ getAccessToken: () => 'expired', refresh });
    server.use(
      http.get(ME, ({ request }) =>
        request.headers.get('authorization') === 'Bearer token-b'
          ? HttpResponse.json(me)
          : HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 }),
      ),
    );

    await expect(unwrap(api.GET('/api/v1/auth/me'))).resolves.toEqual(me);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('retries a request body after refreshing', async () => {
    configureApiAuth({ getAccessToken: () => 'expired', refresh: async () => 'token-b' });
    server.use(
      http.post('*/api/v1/auth/change-password', async ({ request }) => {
        if (request.headers.get('authorization') !== 'Bearer token-b') {
          return HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 });
        }
        const body = (await request.json()) as { newPassword: string };
        return body.newPassword === 'a-new-password!'
          ? new HttpResponse(null, { status: 204 })
          : HttpResponse.json(apiErrorBody(400, 'bad body'), { status: 400 });
      }),
    );

    await expect(
      unwrap(
        api.POST('/api/v1/auth/change-password', {
          body: { currentPassword: 'old-password', newPassword: 'a-new-password!' },
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('returns the original 401 when the session cannot be renewed', async () => {
    configureApiAuth({ getAccessToken: () => 'expired', refresh: async () => null });
    server.use(
      http.get(ME, () => HttpResponse.json(apiErrorBody(401, 'Unauthorized'), { status: 401 })),
    );

    await expect(unwrap(api.GET('/api/v1/auth/me'))).rejects.toMatchObject({ status: 401 });
  });

  it('never refreshes for the login and refresh endpoints', async () => {
    const refresh = vi.fn();
    configureApiAuth({ getAccessToken: () => null, refresh });
    server.use(
      http.post('*/api/v1/auth/login', () =>
        HttpResponse.json(apiErrorBody(401, 'Invalid credentials'), { status: 401 }),
      ),
    );

    await expect(
      unwrap(
        api.POST('/api/v1/auth/login', {
          body: { schoolCode: 'DPSS', loginId: '1', password: 'x' },
        }),
      ),
    ).rejects.toBeInstanceOf(ApiError);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('normalizes API errors with messages and request id', async () => {
    server.use(
      http.get(ME, () =>
        HttpResponse.json(apiErrorBody(400, ['loginId must be a string', 'password is short']), {
          status: 400,
          headers: { 'x-request-id': 'req-42' },
        }),
      ),
    );

    const error = await unwrap(api.GET('/api/v1/auth/me')).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      requestId: 'req-42',
      messages: ['loginId must be a string', 'password is short'],
    });
  });
});
