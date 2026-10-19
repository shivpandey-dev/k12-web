import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui';
import { ChangePasswordScreen } from '@/modules/auth';

export const metadata: Metadata = { title: 'Change password' };

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ChangePasswordScreen />
    </Suspense>
  );
}
