'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { PageLoader } from '@/components/ui';
import { useSession } from '../hooks/use-session';
import { CHANGE_PASSWORD_PATH, loginPathFor, RETURN_TO_PARAM } from '../return-to';

/**
 * Renders children only for a signed-in user who doesn't owe a password change. UX only:
 * k12-api enforces access on every request.
 */
export function RequireSession({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mustChangePassword =
    session.status === 'authenticated' && session.credential.mustChangePassword;

  useEffect(() => {
    if (session.status === 'anonymous') router.replace(loginPathFor(pathname));
    else if (mustChangePassword) {
      router.replace(`${CHANGE_PASSWORD_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(pathname)}`);
    }
  }, [session.status, mustChangePassword, pathname, router]);

  if (session.status !== 'authenticated' || mustChangePassword) return <PageLoader />;
  return children;
}
