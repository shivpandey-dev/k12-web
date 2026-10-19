import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiErrorBody, authTokenResponse } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import {
  nextNavigationMock,
  resetNavigationMock,
  routerMock,
  setLocation,
} from '@/test/next-navigation';
import { renderWithProviders } from '@/test/render';
import { clearSession, resetSessionStoreForTests, sessionStore, startSession } from '../testing';
import { ChangePasswordScreen } from './change-password-screen';

vi.mock('next/navigation', () => nextNavigationMock);

const CHANGE = '*/api/v1/auth/change-password';
const forced = authTokenResponse({
  credential: { loginId: '20260045', schoolId: 's', mustChangePassword: true },
});

beforeEach(() => setLocation('/change-password', 'returnTo=%2Ffees'));

afterEach(() => {
  resetSessionStoreForTests();
  resetNavigationMock();
});

type User = ReturnType<typeof renderWithProviders>['user'];

async function submit(user: User, current: string, next: string, confirm = next) {
  await user.type(screen.getByLabelText(/^(Current|Temporary) password/), current);
  await user.type(screen.getByLabelText(/^New password/), next);
  await user.type(screen.getByLabelText(/^Confirm new password/), confirm);
  await user.click(screen.getByRole('button', { name: 'Change password' }));
}

describe('ChangePasswordScreen', () => {
  it('asks for a new password after a temporary one, with sign out instead of cancel', () => {
    startSession(forced);
    renderWithProviders(<ChangePasswordScreen />);
    expect(screen.getByRole('heading', { name: 'Set a new password' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Temporary password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('ticks the requirements as the user types', async () => {
    startSession(authTokenResponse());
    const { user } = renderWithProviders(<ChangePasswordScreen />);
    const list = screen.getByRole('list', { name: 'Password requirements' });
    expect(list).toHaveTextContent('At least 8 characters (not yet)');

    await user.type(screen.getByLabelText(/^New password/), 'abcd1234');
    await user.type(screen.getByLabelText(/^Confirm new password/), 'abcd1234');
    expect(list).toHaveTextContent('At least 8 characters (done)');
    expect(list).toHaveTextContent('Matches the confirmation (done)');
  });

  it('shows a wrong current password on that field', async () => {
    startSession(authTokenResponse());
    server.use(
      http.post(CHANGE, () =>
        HttpResponse.json(apiErrorBody(401, 'Current password is incorrect'), { status: 401 }),
      ),
      // The API client treats any 401 as a possibly expired token: it refreshes once and retries.
      http.post('*/api/v1/auth/refresh', () =>
        HttpResponse.json(authTokenResponse({ accessToken: 'access-2' })),
      ),
    );
    const { user } = renderWithProviders(<ChangePasswordScreen />);
    await submit(user, 'wrong-pass', 'abcd1234');

    expect(await screen.findByText('Current password is incorrect')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Current password/)).toHaveAttribute('aria-invalid', 'true');
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it('changes the password, clears the forced flag and continues to returnTo', async () => {
    startSession(forced);
    let body: unknown;
    server.use(
      http.post(CHANGE, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      }),
      http.get('*/api/v1/auth/me', () =>
        HttpResponse.json({
          user: forced.user,
          credential: { ...forced.credential, mustChangePassword: false },
        }),
      ),
    );
    const { user } = renderWithProviders(<ChangePasswordScreen />);
    await submit(user, 'temp-pass-1', 'abcd1234');

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/fees'));
    expect(body).toEqual({ currentPassword: 'temp-pass-1', newPassword: 'abcd1234' });
    const { session } = sessionStore.getState();
    expect(session.status === 'authenticated' && session.credential.mustChangePassword).toBe(false);
  });

  it('sends signed-out visitors to sign in', async () => {
    clearSession();
    renderWithProviders(<ChangePasswordScreen />);
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/login'));
  });
});
