'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui';
import { RETURN_TO_PARAM, safeReturnTo, useSession, useSignOut } from '@/modules/auth';
import { useActiveMembership } from '../hooks/use-active-membership';
import { ROLE_LABELS } from '../role-labels';
import { MembershipProblem } from './membership-problem';

/** The /select-membership page for users who belong to several schools or roles. */
export function MembershipPickerScreen() {
  const router = useRouter();
  const session = useSession();
  const membership = useActiveMembership();
  const { signOut, isSigningOut } = useSignOut();
  const returnTo = safeReturnTo(useSearchParams().get(RETURN_TO_PARAM));

  // A single membership is chosen automatically; nothing to pick.
  useEffect(() => {
    if (membership.status === 'active' && membership.memberships.length === 1)
      router.replace(returnTo);
  }, [membership, returnTo, router]);

  if (membership.status === 'loading') return <PageLoader />;
  if (membership.status === 'error' || membership.status === 'none') {
    return <MembershipProblem state={membership.status} />;
  }
  const list = membership.memberships;
  if (list.length === 1) return <PageLoader />;

  const handleSelect = (membershipId: string) => {
    membership.select(membershipId);
    router.replace(returnTo);
  };

  const firstName = session.status === 'authenticated' ? session.user.firstName : '';

  return (
    <>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Choose where to continue
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
        {firstName ? `${firstName}, you` : 'You'} have access to more than one school or role. You
        can switch any time from the top bar.
      </Typography>
      <Stack component="ul" spacing={2} sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {list.map((item) => (
          <li key={item.id}>
            <ButtonBase
              onClick={() => handleSelect(item.id)}
              sx={(theme) => ({
                width: '100%',
                justifyContent: 'flex-start',
                gap: 3,
                p: 3,
                textAlign: 'left',
                borderRadius: theme.radius.lg,
                border: `1px solid ${theme.vars.palette.border.default}`,
                bgcolor: 'background.paper',
                '&:hover': { borderColor: theme.vars.palette.primary.main },
                '&.Mui-focusVisible': { boxShadow: theme.tokenShadows.focusRing },
              })}
            >
              <Avatar
                variant="rounded"
                src={item.school.logoUrl ?? undefined}
                alt=""
                sx={{ width: 40, height: 40 }}
              >
                {item.school.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="title" component="span" sx={{ display: 'block' }}>
                  {item.school.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ROLE_LABELS[item.role]} · {item.school.code}
                </Typography>
              </Box>
              <ChevronRight size={18} aria-hidden />
            </ButtonBase>
          </li>
        ))}
      </Stack>
      <Button variant="text" onClick={() => signOut()} disabled={isSigningOut} sx={{ mt: 6 }}>
        Sign out
      </Button>
    </>
  );
}
