'use client';

import { useEffect } from 'react';
import { bootstrapSession } from '../session-store';

/** Restores the session from the refresh cookie when the app first loads in the browser. */
export function SessionBootstrap() {
  useEffect(() => {
    void bootstrapSession();
  }, []);
  return null;
}
