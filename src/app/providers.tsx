'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { createQueryClient } from '@/lib/query-client';
import { SessionBootstrap } from '@/modules/auth';
import { ActiveMembershipHydrator } from '@/modules/membership';

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session; useState keeps it stable across re-renders.
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      <ActiveMembershipHydrator />
      {children}
    </QueryClientProvider>
  );
}
