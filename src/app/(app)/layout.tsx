import { Suspense } from 'react';
import { SignedInShell } from '@/components/signed-in-shell';
import { PageLoader } from '@/components/ui';
import { RequireSession } from '@/modules/auth';
import { RequireActiveMembership } from '@/modules/membership';

/** Every signed-in page: session and membership guards, then the app shell. */
export default function SignedInLayout({ children }: LayoutProps<'/'>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <RequireSession>
        <RequireActiveMembership>
          <SignedInShell>{children}</SignedInShell>
        </RequireActiveMembership>
      </RequireSession>
    </Suspense>
  );
}
