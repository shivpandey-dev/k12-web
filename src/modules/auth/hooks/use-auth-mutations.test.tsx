import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { createQueryClient } from '@/lib/query-client';
import { apiErrorBody, authTokenResponse } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { resetSessionStoreForTests, sessionStore, startSession } from '../session-store';
import { useChangePassword, useLogin, useLogout } from './use-auth-mutations';

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>;
}

afterEach(() => resetSessionStoreForTests());

describe('auth mutations', () => {
  it('starts a session after a successful login', async () => {
    server.use(http.post('*/api/v1/auth/login', () => HttpResponse.json(authTokenResponse())));
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate({ schoolCode: 'DPSS', loginId: '20260045', password: 'pw' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sessionStore.getState().accessToken).toBe('access-1');
  });

  it('exposes the API error when login is rejected', async () => {
    server.use(
      http.post('*/api/v1/auth/login', () =>
        HttpResponse.json(apiErrorBody(401, 'Invalid credentials'), { status: 401 }),
      ),
    );
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => result.current.mutate({ schoolCode: 'DPSS', loginId: '20260045', password: 'pw' }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ status: 401 });
    expect(sessionStore.getState().session.status).toBe('loading');
  });

  it('clears mustChangePassword after the password is changed', async () => {
    const forced = authTokenResponse();
    forced.credential.mustChangePassword = true;
    startSession(forced);
    const { user, credential } = authTokenResponse();
    server.use(
      http.post('*/api/v1/auth/change-password', () => new HttpResponse(null, { status: 204 })),
      http.get('*/api/v1/auth/me', () => HttpResponse.json({ user, credential })),
    );
    const { result } = renderHook(() => useChangePassword(), { wrapper });

    act(() =>
      result.current.mutate({ currentPassword: 'temporary-pw', newPassword: 'a-long-new-pass' }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sessionStore.getState().session).toMatchObject({
      status: 'authenticated',
      credential: { mustChangePassword: false },
    });
  });

  it('treats the password as changed even if re-reading the identity fails', async () => {
    const forced = authTokenResponse();
    forced.credential.mustChangePassword = true;
    startSession(forced);
    server.use(
      http.post('*/api/v1/auth/change-password', () => new HttpResponse(null, { status: 204 })),
      http.get('*/api/v1/auth/me', () =>
        HttpResponse.json(apiErrorBody(500, 'boom'), { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useChangePassword(), { wrapper });

    act(() =>
      result.current.mutate({ currentPassword: 'temporary-pw', newPassword: 'a-long-new-pass' }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(sessionStore.getState().session).toMatchObject({
      credential: { mustChangePassword: false },
    });
  });

  it('clears the local session even when logout fails on the server', async () => {
    startSession(authTokenResponse());
    server.use(
      http.post('*/api/v1/auth/logout', () =>
        HttpResponse.json(apiErrorBody(500, 'boom'), { status: 500 }),
      ),
    );
    const { result } = renderHook(() => useLogout(), { wrapper });

    act(() => result.current.mutate('current'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(sessionStore.getState()).toEqual({
      accessToken: null,
      session: { status: 'anonymous' },
    });
  });
});
