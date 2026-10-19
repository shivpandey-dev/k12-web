import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { authTokenResponse } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import {
  nextNavigationMock,
  resetNavigationMock,
  routerMock,
  setLocation,
} from '@/test/next-navigation';
import { renderWithProviders } from '@/test/render';
import { useSignOut } from '../hooks/use-sign-out';
import { clearSession, resetSessionStoreForTests, sessionStore, startSession } from '../testing';
import { RequireSession } from './require-session';

vi.mock('next/navigation', () => nextNavigationMock);

afterEach(() => {
  resetSessionStoreForTests();
  resetNavigationMock();
});

describe('RequireSession', () => {
  it('sends signed-out visitors to sign in and back afterwards', async () => {
    clearSession();
    setLocation('/fees');
    renderWithProviders(<RequireSession>Secret</RequireSession>);

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/login?returnTo=%2Ffees'));
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('holds users with a temporary password on the change-password page', async () => {
    startSession(
      authTokenResponse({ credential: { loginId: '1', schoolId: 's', mustChangePassword: true } }),
    );
    setLocation('/home');
    renderWithProviders(<RequireSession>Secret</RequireSession>);

    await waitFor(() =>
      expect(routerMock.replace).toHaveBeenCalledWith('/change-password?returnTo=%2Fhome'),
    );
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders the page for a signed-in user', () => {
    startSession(authTokenResponse());
    renderWithProviders(<RequireSession>Secret</RequireSession>);
    expect(screen.getByText('Secret')).toBeInTheDocument();
    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});

function SignOutButtons() {
  const { signOut } = useSignOut();
  return (
    <>
      <button type="button" onClick={() => signOut()}>
        Sign out
      </button>
      <button type="button" onClick={() => signOut('all')}>
        Sign out everywhere
      </button>
    </>
  );
}

describe('useSignOut', () => {
  it('ends the session on the server, clears it locally and returns to sign in', async () => {
    startSession(authTokenResponse());
    const logout = vi.fn(() => new HttpResponse(null, { status: 204 }));
    server.use(http.post('*/api/v1/auth/logout', logout));
    const { user } = renderWithProviders(<SignOutButtons />);

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/login'));
    expect(logout).toHaveBeenCalledOnce();
    expect(sessionStore.getState().session.status).toBe('anonymous');
  });

  it('signs out locally even when the server call fails', async () => {
    startSession(authTokenResponse());
    server.use(http.post('*/api/v1/auth/logout-all', () => HttpResponse.json({}, { status: 500 })));
    const { user } = renderWithProviders(<SignOutButtons />);

    await user.click(screen.getByRole('button', { name: 'Sign out everywhere' }));

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/login'));
    expect(sessionStore.getState().session.status).toBe('anonymous');
  });
});
