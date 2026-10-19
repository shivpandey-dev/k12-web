'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { useSignOut } from '@/modules/auth';
import { membershipKeys } from '../hooks/use-my-memberships';

/** Shown when memberships can't be loaded, or the user has no active school access. */
export function MembershipProblem({ state }: { state: 'error' | 'none' }) {
  const queryClient = useQueryClient();
  const { signOut, isSigningOut } = useSignOut();

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', py: 10, px: 4 }}>
      <Typography variant="h1" sx={{ mb: 3 }}>
        {state === 'none' ? 'No school access yet' : 'We couldn’t load your schools'}
      </Typography>
      <Alert severity={state === 'none' ? 'info' : 'error'} sx={{ mb: 6 }}>
        {state === 'none'
          ? 'Your account isn’t linked to an active school or role. Ask your school administrator to add you.'
          : 'Check your connection and try again.'}
      </Alert>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {state === 'error' ? (
          <Button
            variant="contained"
            onClick={() => void queryClient.invalidateQueries({ queryKey: membershipKeys.all })}
          >
            Try again
          </Button>
        ) : null}
        <Button onClick={() => signOut()} disabled={isSigningOut}>
          Sign out
        </Button>
      </Box>
    </Box>
  );
}
