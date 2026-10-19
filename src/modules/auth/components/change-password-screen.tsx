'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader, toast } from '@/components/ui';
import { useSession } from '../hooks/use-session';
import { useSignOut } from '../hooks/use-sign-out';
import { LOGIN_PATH, RETURN_TO_PARAM, safeReturnTo } from '../return-to';
import { ChangePasswordForm } from './change-password-form';

/**
 * The /change-password page. Forced after signing in with a temporary password; otherwise
 * reached from the profile menu.
 */
export function ChangePasswordScreen() {
  const router = useRouter();
  const session = useSession();
  const { signOut, isSigningOut } = useSignOut();
  const returnTo = safeReturnTo(useSearchParams().get(RETURN_TO_PARAM));

  useEffect(() => {
    if (session.status === 'anonymous' && !isSigningOut) router.replace(LOGIN_PATH);
  }, [session.status, isSigningOut, router]);

  if (session.status !== 'authenticated') return <PageLoader />;

  const isForced = session.credential.mustChangePassword;

  const handleChanged = () => {
    toast.success('Password changed. You’re signed out on your other devices.');
    router.replace(returnTo);
  };

  return (
    <>
      <Typography variant="h1" sx={{ mb: 1 }}>
        {isForced ? 'Set a new password' : 'Change password'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        {isForced
          ? `Hi ${session.user.firstName}, you signed in with a temporary password. Choose your own to continue.`
          : 'Changing your password signs you out on your other devices.'}
      </Typography>
      <ChangePasswordForm
        onChanged={handleChanged}
        currentPasswordLabel={isForced ? 'Temporary password' : 'Current password'}
        secondaryAction={
          isForced ? (
            <Button variant="text" onClick={() => signOut()} disabled={isSigningOut}>
              Sign out
            </Button>
          ) : (
            <Button onClick={() => router.replace(returnTo)}>Cancel</Button>
          )
        }
      />
    </>
  );
}
