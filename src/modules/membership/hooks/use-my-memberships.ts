'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/modules/auth';
import { membershipApi } from '../api/membership-api';

export const membershipKeys = {
  all: ['memberships'] as const,
  mineActive: (userId: string) => [...membershipKeys.all, 'mine', 'active', userId] as const,
};

/** Active memberships of the signed-in user; idle while signed out. */
export function useMyMemberships() {
  const session = useSession();
  const userId = session.status === 'authenticated' ? session.user.id : null;
  return useQuery({
    queryKey: membershipKeys.mineActive(userId ?? 'anonymous'),
    queryFn: ({ signal }) => membershipApi.listMineActive(signal),
    enabled: userId !== null,
  });
}
