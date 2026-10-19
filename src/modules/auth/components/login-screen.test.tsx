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
import {
  clearSession,
  resetSchoolCodeStoreForTests,
  resetSessionStoreForTests,
  schoolCodeStore,
} from '../testing';
import { LoginScreen } from './login-screen';

vi.mock('next/navigation', () => nextNavigationMock);

const LOGIN = '*/api/v1/auth/login';

beforeEach(() => {
  clearSession();
  setLocation('/login');
});

afterEach(() => {
  resetSessionStoreForTests();
  resetSchoolCodeStoreForTests();
  resetNavigationMock();
  localStorage.clear();
});

async function fillAndSubmit(
  user: ReturnType<typeof renderWithProviders>['user'],
  password = 'secret-pass',
) {
  await user.type(screen.getByLabelText(/School code/), 'dpss');
  await user.type(screen.getByLabelText(/Login ID/), '20260045');
  await user.type(screen.getByLabelText(/^Password/), password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('LoginScreen', () => {
  it('shows what is missing before calling the API', async () => {
    const { user } = renderWithProviders(<LoginScreen />);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter your school code')).toBeInTheDocument();
    expect(screen.getByText('Enter your login ID')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
  });

  it('signs in with normalised input, remembers the school code and goes to returnTo', async () => {
    setLocation('/login', 'returnTo=%2Ffees');
    let body: unknown;
    server.use(
      http.post(LOGIN, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(authTokenResponse());
      }),
    );
    const { user } = renderWithProviders(<LoginScreen />);
    await fillAndSubmit(user);

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith('/fees'));
    expect(body).toEqual({ schoolCode: 'DPSS', loginId: '20260045', password: 'secret-pass' });
    expect(schoolCodeStore.getState().rememberedSchoolCode).toBe('DPSS');
  });

  it('sends users with a temporary password to change it first', async () => {
    server.use(
      http.post(LOGIN, () =>
        HttpResponse.json(
          authTokenResponse({
            credential: { loginId: '20260045', schoolId: 's', mustChangePassword: true },
          }),
        ),
      ),
    );
    const { user } = renderWithProviders(<LoginScreen />);
    await fillAndSubmit(user);

    await waitFor(() =>
      expect(routerMock.replace).toHaveBeenCalledWith('/change-password?returnTo=%2Fhome'),
    );
  });

  it('shows one generic message on wrong credentials and clears the password', async () => {
    server.use(
      http.post(LOGIN, () =>
        HttpResponse.json(apiErrorBody(401, 'Invalid credentials'), { status: 401 }),
      ),
    );
    const { user } = renderWithProviders(<LoginScreen />);
    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'School code, login ID or password is incorrect.',
    );
    expect(screen.getByLabelText(/^Password/)).toHaveValue('');
    expect(screen.getByLabelText(/Login ID/)).toHaveValue('20260045');
  });

  it('pre-fills a remembered school code', async () => {
    localStorage.setItem(
      'kidzdiary.school-code',
      JSON.stringify({ state: { rememberedSchoolCode: 'DPSS' }, version: 1 }),
    );
    renderWithProviders(<LoginScreen />);
    await waitFor(() => expect(screen.getByLabelText(/School code/)).toHaveValue('DPSS'));
  });

  it('toggles password visibility', async () => {
    const { user } = renderWithProviders(<LoginScreen />);
    const password = screen.getByLabelText(/^Password/);
    expect(password).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
  });
});
