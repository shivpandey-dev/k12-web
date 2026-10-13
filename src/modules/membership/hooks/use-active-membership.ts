'use client';

import { useStore } from 'zustand';
import type { MyMembership } from '../api/membership-api';
import { resolveActiveMembership } from '../active-membership';
import { activeMembershipStore } from '../active-membership-store';
import { useMyMemberships } from './use-my-memberships';

export type ActiveMembershipState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'none' }
  | { status: 'needs-selection'; memberships: MyMembership[] }
  | { status: 'active'; membership: MyMembership; memberships: MyMembership[] };

/** The school and role the app currently acts in, plus a way to switch. */
export function useActiveMembership(): ActiveMembershipState & {
  select: (membershipId: string) => void;
} {
  const memberships = useMyMemberships();
  const selectedId = useStore(activeMembershipStore, (s) => s.selectedMembershipId);
  const select = useStore(activeMembershipStore, (s) => s.select);

  if (memberships.isError) return { status: 'error', error: memberships.error, select };
  if (!memberships.isSuccess) return { status: 'loading', select };

  const list = memberships.data;
  const resolution = resolveActiveMembership(list, selectedId);
  if (resolution.status === 'active') {
    return { status: 'active', membership: resolution.membership, memberships: list, select };
  }
  if (resolution.status === 'needs-selection') {
    return { status: 'needs-selection', memberships: list, select };
  }
  return { status: 'none', select };
}
