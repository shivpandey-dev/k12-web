'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { House } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import {
  AppShell,
  filterNavigation,
  MembershipSwitcher,
  NotificationsButton,
  ProfileMenu,
  SearchTrigger,
  type NavGroup,
} from '@/components/app-shell';
import { DialogHeader, EmptyState, toast } from '@/components/ui';
import { CHANGE_PASSWORD_PATH, RETURN_TO_PARAM, useSession, useSignOut } from '@/modules/auth';
import { ROLE_LABELS, useActiveMembership, type MembershipRole } from '@/modules/membership';

const PRODUCT_NAME = 'KidzDiary';
const SIGN_OUT_ALL_TITLE_ID = 'sign-out-all-title';

/**
 * Navigation for signed-in users. Only Home exists until we decide where each role lands;
 * feature modules add their entries here with the roles that may see them.
 */
const NAVIGATION: readonly NavGroup<MembershipRole>[] = [
  { id: 'home', items: [{ label: 'Home', href: '/home', icon: House }] },
];

/** AppShell wired to the real session, memberships and sign-out. */
export function SignedInShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const membership = useActiveMembership();
  const { signOut, isSigningOut } = useSignOut();
  const [isSignOutAllOpen, setIsSignOutAllOpen] = useState(false);

  const role = membership.status === 'active' ? membership.membership.role : null;
  const navigation = useMemo(() => (role ? filterNavigation(NAVIGATION, role) : []), [role]);

  const switcherMemberships = useMemo(
    () =>
      membership.status === 'active'
        ? membership.memberships.map((item) => ({
            id: item.id,
            schoolName: item.school.name,
            roleLabel: ROLE_LABELS[item.role],
          }))
        : [],
    [membership],
  );

  if (session.status !== 'authenticated' || membership.status !== 'active') return null;

  const handleSwitch = (membershipId: string) => {
    const next = membership.memberships.find((item) => item.id === membershipId);
    membership.select(membershipId);
    if (next) toast.success(`Switched to ${next.school.name} as ${ROLE_LABELS[next.role]}`);
  };

  return (
    <>
      <AppShell
        productName={PRODUCT_NAME}
        navigation={navigation}
        activeHref={pathname}
        topBar={
          <>
            <MembershipSwitcher
              memberships={switcherMemberships}
              activeId={membership.membership.id}
              onSelect={handleSwitch}
            />
            <SearchTrigger onOpen={() => toast.info('Search is coming soon')} />
            <Box sx={{ flex: 1 }} />
            <NotificationsButton unreadCount={0}>
              <EmptyState
                title="You’re all caught up"
                description="Notices and fee alerts will appear here."
                headingComponent="h2"
              />
            </NotificationsButton>
            <ProfileMenu
              name={`${session.user.firstName} ${session.user.lastName}`}
              detail={session.credential.loginId}
              onChangePassword={() =>
                router.push(
                  `${CHANGE_PASSWORD_PATH}?${RETURN_TO_PARAM}=${encodeURIComponent(pathname)}`,
                )
              }
              onSignOut={() => signOut()}
              onSignOutAll={() => setIsSignOutAllOpen(true)}
            />
          </>
        }
      >
        {children}
      </AppShell>
      <Dialog
        maxWidth="xs"
        open={isSignOutAllOpen}
        onClose={() => setIsSignOutAllOpen(false)}
        aria-labelledby={SIGN_OUT_ALL_TITLE_ID}
      >
        <DialogHeader id={SIGN_OUT_ALL_TITLE_ID} onClose={() => setIsSignOutAllOpen(false)}>
          Sign out of all devices?
        </DialogHeader>
        <DialogContent>
          <DialogContentText>
            This ends every session for your login, including this one. You’ll need to sign in again
            everywhere.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSignOutAllOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={isSigningOut}
            onClick={() => {
              setIsSignOutAllOpen(false);
              signOut('all');
            }}
          >
            Sign out everywhere
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
