'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '@/components/app-shell';
import { EmptyState } from '@/components/ui';
import { useSession } from '@/modules/auth';
import { ROLE_LABELS, useActiveMembership } from '@/modules/membership';

/** Placeholder landing page until per-role dashboards are decided. */
export function HomeScreen() {
  const session = useSession();
  const membership = useActiveMembership();
  if (session.status !== 'authenticated' || membership.status !== 'active') return null;

  const { school, role } = membership.membership;

  return (
    <>
      <PageHeader
        title={`Welcome, ${session.user.firstName}`}
        description={`You’re signed in to ${school.name} as ${ROLE_LABELS[role].toLowerCase()}.`}
      />
      <Box sx={{ px: { xs: 4, md: 6 }, pb: 6 }}>
        <Card>
          <EmptyState
            icon={<LayoutDashboard />}
            title="Your dashboard is on its way"
            description="We’re deciding what each role sees first. This page will show it."
          />
        </Card>
      </Box>
    </>
  );
}
