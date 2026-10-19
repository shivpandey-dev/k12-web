'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui';
import { useSession } from '../hooks/use-session';
import { HOME_PATH, LOGIN_PATH } from '../return-to';

/** `/` sends signed-in users home and everyone else to sign in. */
export function RootRedirect() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') router.replace(HOME_PATH);
    if (session.status === 'anonymous') router.replace(LOGIN_PATH);
  }, [session.status, router]);

  return <PageLoader />;
}
