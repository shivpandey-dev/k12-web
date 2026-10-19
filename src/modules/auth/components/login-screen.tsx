'use client';

import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui';
import type { AuthTokenResponse } from '../api/auth-api';
import { useSession } from '../hooks/use-session';
import { CHANGE_PASSWORD_PATH, RETURN_TO_PARAM, safeReturnTo } from '../return-to';
import { LoginForm } from './login-form';

function nextPathFor(mustChangePassword: boolean, returnTo: string): string {
  if (!mustChangePassword) return returnTo;
  return `${CHANGE_PASSWORD_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(returnTo)}`;
}

/** The /login page: sends signed-in users on, otherwise shows the form. */
export function LoginScreen() {
  const router = useRouter();
  const session = useSession();
  const returnTo = safeReturnTo(useSearchParams().get(RETURN_TO_PARAM));

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.replace(nextPathFor(session.credential.mustChangePassword, returnTo));
    }
  }, [session, returnTo, router]);

  if (session.status !== 'anonymous') return <PageLoader />;

  const handleSignedIn = (response: AuthTokenResponse) => {
    router.replace(nextPathFor(response.credential.mustChangePassword, returnTo));
  };

  return (
    <>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Sign in
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        Use the school code and login ID your school gave you.
      </Typography>
      <LoginForm onSignedIn={handleSignedIn} />
    </>
  );
}
