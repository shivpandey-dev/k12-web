import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui';
import { LoginScreen } from '@/modules/auth';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginScreen />
    </Suspense>
  );
}
