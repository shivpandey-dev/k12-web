'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { PageLoader } from '@/components/ui';
import { RETURN_TO_PARAM } from '@/modules/auth';
import { useActiveMembership } from '../hooks/use-active-membership';
import { MembershipProblem } from './membership-problem';

export const SELECT_MEMBERSHIP_PATH = '/select-membership';

/** Renders children once the app knows which school and role the user is acting in. */
export function RequireActiveMembership({ children }: { children: ReactNode }) {
  const membership = useActiveMembership();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (membership.status === 'needs-selection') {
      router.replace(
        `${SELECT_MEMBERSHIP_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(pathname)}`,
      );
    }
  }, [membership.status, pathname, router]);

  if (membership.status === 'error' || membership.status === 'none') {
    return <MembershipProblem state={membership.status} />;
  }
  if (membership.status !== 'active') return <PageLoader />;
  return children;
}
