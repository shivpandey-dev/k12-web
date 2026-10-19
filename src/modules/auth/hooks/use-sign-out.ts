'use client';

import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui';
import { LOGIN_PATH } from '../return-to';
import { useLogout } from './use-auth-mutations';

/** Signs out (this device or every device) and returns to the login page. */
export function useSignOut() {
  const router = useRouter();
  const logout = useLogout();

  const signOut = (scope: 'current' | 'all' = 'current') => {
    // mutateAsync: clearing the session unmounts the signed-in screens, and per-call mutate
    // callbacks would never run. Local state is cleared even if the server call fails.
    void logout
      .mutateAsync(scope)
      .catch(() => undefined)
      .then(() => {
        router.replace(LOGIN_PATH);
        toast.info(scope === 'all' ? 'Signed out on all devices' : 'Signed out');
      });
  };

  return { signOut, isSigningOut: logout.isPending };
}
