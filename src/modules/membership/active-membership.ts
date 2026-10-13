import type { MyMembership } from './api/membership-api';

export type ActiveMembershipResolution =
  | { status: 'none' }
  | { status: 'needs-selection' }
  | { status: 'active'; membership: MyMembership };

/**
 * Chooses the membership the app acts in: the remembered one if it is still valid,
 * otherwise the only one; with several and no valid choice the user must pick.
 */
export function resolveActiveMembership(
  memberships: readonly MyMembership[],
  selectedId: string | null,
): ActiveMembershipResolution {
  const selected = memberships.find((m) => m.id === selectedId);
  if (selected !== undefined) return { status: 'active', membership: selected };
  const [only, ...rest] = memberships;
  if (only === undefined) return { status: 'none' };
  if (rest.length === 0) return { status: 'active', membership: only };
  return { status: 'needs-selection' };
}
