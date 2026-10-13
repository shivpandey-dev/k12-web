'use client';

import { useStore } from 'zustand';
import { sessionStore, type SessionState } from '../session-store';

export function useSession(): SessionState {
  return useStore(sessionStore, (state) => state.session);
}
