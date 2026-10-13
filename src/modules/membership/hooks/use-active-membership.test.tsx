import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createQueryClient } from '@/lib/query-client';
import { resetSessionStoreForTests, startSession } from '@/modules/auth/testing';
import { authTokenResponse, myMembership, page } from '@/test/msw/fixtures';
import { server } from '@/test/msw/server';
import { activeMembershipStore } from '../active-membership-store';
import { useActiveMembership } from './use-active-membership';

const STORAGE_KEY = 'kidzdiary.active-membership';
const teacher = myMembership({ id: 'm-teacher', role: 'TEACHER' });
const parent = myMembership({ id: 'm-parent', role: 'PARENT' });

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>;
}

function serveMemberships(memberships: ReturnType<typeof myMembership>[]) {
  server.use(http.get('*/api/v1/auth/me/memberships', () => HttpResponse.json(page(memberships))));
}

beforeEach(() => startSession(authTokenResponse()));

afterEach(() => {
  resetSessionStoreForTests();
  activeMembershipStore.setState({ selectedMembershipId: null });
  localStorage.clear();
});

describe('useActiveMembership', () => {
  it('stays idle and loading while signed out', () => {
    resetSessionStoreForTests();
    const { result } = renderHook(() => useActiveMembership(), { wrapper });
    expect(result.current.status).toBe('loading');
  });

  it('activates the only membership without asking', async () => {
    serveMemberships([teacher]);
    const { result } = renderHook(() => useActiveMembership(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('active'));
    expect(result.current).toMatchObject({ membership: { id: 'm-teacher' } });
  });

  it('asks to choose between several memberships and remembers the choice', async () => {
    serveMemberships([teacher, parent]);
    const { result } = renderHook(() => useActiveMembership(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('needs-selection'));

    act(() => result.current.select('m-parent'));

    expect(result.current).toMatchObject({ status: 'active', membership: { id: 'm-parent' } });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      state: { selectedMembershipId: 'm-parent' },
    });
  });

  it('restores the remembered choice after hydration', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { selectedMembershipId: 'm-parent' }, version: 1 }),
    );
    await activeMembershipStore.persist.rehydrate();
    serveMemberships([teacher, parent]);
    const { result } = renderHook(() => useActiveMembership(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('active'));
    expect(result.current).toMatchObject({ membership: { id: 'm-parent' } });
  });

  it('reports none when the user has no school role', async () => {
    serveMemberships([]);
    const { result } = renderHook(() => useActiveMembership(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('none'));
  });
});
