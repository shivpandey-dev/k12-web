'use client';

import { useEffect } from 'react';
import { activeMembershipStore } from '../active-membership-store';

/** Restores the remembered membership choice from this device after the first render. */
export function ActiveMembershipHydrator() {
  useEffect(() => {
    void activeMembershipStore.persist.rehydrate();
  }, []);
  return null;
}
