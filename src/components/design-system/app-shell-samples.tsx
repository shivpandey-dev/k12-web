'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  BookOpen,
  CalendarCheck,
  CircleHelp,
  LayoutDashboard,
  Megaphone,
  Plus,
  Receipt,
  Settings,
  UserRoundCog,
  Users,
  Wallet,
} from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import {
  AppShell,
  filterNavigation,
  MembershipSwitcher,
  NotificationsButton,
  PageHeader,
  ProfileMenu,
  SearchTrigger,
  type NavGroup,
  type SwitcherMembership,
} from '@/components/app-shell';
import { EmptyState, toast } from '@/components/ui';
import { PreviewRow } from './preview-row';
import { PreviewSection } from './preview-section';

type Role = 'OWNER' | 'ADMIN' | 'TEACHER' | 'STAFF' | 'PARENT' | 'STUDENT';

const ROLE_LABELS: Record<Role, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STAFF: 'Staff',
  PARENT: 'Parent',
  STUDENT: 'Student',
};

const ROLES: readonly Role[] = ['OWNER', 'ADMIN', 'TEACHER', 'STAFF', 'PARENT', 'STUDENT'];
const MANAGEMENT: readonly Role[] = ['OWNER', 'ADMIN'];

/** Sample navigation; the real one lives with the (app) layout once routes exist. */
const NAVIGATION: readonly NavGroup<Role>[] = [
  { id: 'home', items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] },
  {
    id: 'academics',
    label: 'Academics',
    items: [
      {
        label: 'Students',
        href: '/students',
        icon: Users,
        roles: [...MANAGEMENT, 'TEACHER', 'STAFF'],
      },
      { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
      { label: 'Classes', href: '/classes', icon: BookOpen, roles: [...MANAGEMENT, 'TEACHER'] },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    items: [
      { label: 'Fees', href: '/fees', icon: Receipt },
      { label: 'Expenses', href: '/expenses', icon: Wallet, roles: [...MANAGEMENT, 'STAFF'] },
    ],
  },
  {
    id: 'school',
    label: 'School',
    items: [
      { label: 'Notices', href: '/notices', icon: Megaphone },
      { label: 'Staff', href: '/staff', icon: UserRoundCog, roles: MANAGEMENT },
      { label: 'Settings', href: '/settings', icon: Settings, roles: MANAGEMENT },
    ],
  },
];

const MEMBERSHIPS: readonly SwitcherMembership[] = [
  { id: 'm1', schoolName: 'DPS Noida', roleLabel: 'Admin' },
  { id: 'm2', schoolName: 'DPS Noida', roleLabel: 'Parent' },
  { id: 'm3', schoolName: 'Green Valley School', roleLabel: 'Teacher' },
];

const titleFor = (href: string) =>
  NAVIGATION.flatMap((group) => group.items).find((item) => item.href === href)?.label ??
  'Dashboard';

export function AppShellSamples() {
  const [role, setRole] = useState<Role>('ADMIN');
  const [activeHref, setActiveHref] = useState('/students');
  const [membershipId, setMembershipId] = useState('m1');

  const navigation = useMemo(() => filterNavigation(NAVIGATION, role), [role]);
  const groupLabel = NAVIGATION.find((group) =>
    group.items.some((item) => item.href === activeHref),
  )?.label;
  const title = titleFor(activeHref);

  const handleNavigate = (event: MouseEvent<HTMLElement>, href: string) => {
    // The preview has no real routes, so stay on this page.
    event.preventDefault();
    setActiveHref(href);
  };

  return (
    <PreviewSection
      title="App shell"
      description="Dark sidebar (collapses to an icon rail; a drawer on mobile), top bar and page header."
    >
      <PreviewRow label="Navigation for role">
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(_event, next: Role | null) => next && setRole(next)}
          aria-label="Preview role"
          sx={{ flexWrap: 'wrap' }}
        >
          {ROLES.map((value) => (
            <ToggleButton key={value} value={value}>
              {ROLE_LABELS[value]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </PreviewRow>
      <Box sx={{ border: 1, borderColor: 'border.default', borderRadius: 3, overflow: 'hidden' }}>
        <AppShell
          productName="KidzDiary"
          navigation={navigation}
          activeHref={activeHref}
          onNavigate={handleNavigate}
          height={560}
          topBar={
            <>
              <MembershipSwitcher
                memberships={MEMBERSHIPS}
                activeId={membershipId}
                onSelect={setMembershipId}
              />
              <SearchTrigger onOpen={() => toast.info('Global search opens here')} />
              <Box sx={{ flex: 1 }} />
              <NotificationsButton unreadCount={3}>
                <EmptyState
                  title="You're all caught up"
                  description="New notices and fee alerts appear here."
                  headingComponent="h4"
                />
              </NotificationsButton>
              <IconButton aria-label="Help" component="a" href="#help">
                <CircleHelp />
              </IconButton>
              <ProfileMenu
                name="Shiv Pandey"
                detail="admin@dps.edu"
                onProfile={() => toast.info('Profile')}
                onChangePassword={() => toast.info('Change password')}
                onSignOut={() => toast.info('Signed out')}
              />
            </>
          }
        >
          <PageHeader
            titleComponent="h2"
            title={title}
            breadcrumbs={
              groupLabel ? [{ label: groupLabel, href: '#' }, { label: title }] : [{ label: title }]
            }
            description={`What a ${ROLE_LABELS[role].toLowerCase()} sees on the ${title.toLowerCase()} page.`}
            actions={
              <>
                <Button>Import</Button>
                <Button variant="contained" startIcon={<Plus />}>
                  Add
                </Button>
              </>
            }
          />
          <Box sx={{ px: { xs: 4, md: 6 }, pb: 6 }}>
            <Card sx={{ height: 220 }} />
          </Box>
        </AppShell>
      </Box>
    </PreviewSection>
  );
}
