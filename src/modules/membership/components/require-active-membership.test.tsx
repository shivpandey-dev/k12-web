import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSessionStoreForTests, startSession } from '@/modules/auth/testing';
import { authTokenResponse, myMembership, page } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import {
  nextNavigationMock,
  resetNavigationMock,
  routerMock,
  setLocation,
} from '@/test/next-navigation';
import { renderWithProviders } from '@/test/render';
import { activeMembershipStore } from '../active-membership-store';
import { MembershipPickerScreen } from './membership-picker-screen';
import { RequireActiveMembership } from './require-active-membership';

vi.mock('next/navigation', () => nextNavigationMock);

function serveMemberships(memberships: ReturnType<typeof myMembership>[]) {
  server.use(http.get('*/api/v1/auth/me/memberships', () => HttpResponse.json(page(memberships))));
}

const teacher = myMembership({ id: 'm-teacher', role: 'TEACHER' });
const parent = myMembership({
  id: 'm-parent',
  role: 'PARENT',
  school: { id: 's2', code: 'GVS', name: 'Green Valley School', logoUrl: null },
});

beforeEach(() => startSession(authTokenResponse()));

afterEach(() => {
  resetSessionStoreForTests();
  resetNavigationMock();
  activeMembershipStore.setState({ selectedMembershipId: null });
  localStorage.clear();
});

describe('RequireActiveMembership', () => {
  it('renders the page once the only membership is active', async () => {
    serveMemberships([teacher]);
    renderWithProviders(<RequireActiveMembership>Dashboard</RequireActiveMembership>);
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  it('asks users with several memberships to choose first', async () => {
    serveMemberships([teacher, parent]);
    setLocation('/home');
    renderWithProviders(<RequireActiveMembership>Dashboard</RequireActiveMembership>);
    await waitFor(() =>
      expect(routerMock.replace).toHaveBeenCalledWith('/select-membership?returnTo=%2Fhome'),
    );
  });

  it('explains when the user has no active school access', async () => {
    serveMemberships([]);
    renderWithProviders(<RequireActiveMembership>Dashboard</RequireActiveMembership>);
    expect(
      await screen.findByRole('heading', { name: 'No school access yet' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });
});

describe('MembershipPickerScreen', () => {
  it('activates the chosen membership and continues', async () => {
    serveMemberships([teacher, parent]);
    setLocation('/select-membership', 'returnTo=%2Ffees');
    const { user } = renderWithProviders(<MembershipPickerScreen />);

    await user.click(await screen.findByRole('button', { name: /Green Valley School/ }));

    expect(activeMembershipStore.getState().selectedMembershipId).toBe('m-parent');
    expect(routerMock.replace).toHaveBeenCalledWith('/fees');
  });
});
