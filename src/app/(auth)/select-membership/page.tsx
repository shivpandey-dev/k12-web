import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui';
import { RequireSession } from '@/modules/auth';
import { MembershipPickerScreen } from '@/modules/membership';

export const metadata: Metadata = { title: 'Choose school' };

export default function SelectMembershipPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RequireSession>
        <MembershipPickerScreen />
      </RequireSession>
    </Suspense>
  );
}
