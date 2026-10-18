import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

interface ShellStore {
  /** Desktop sidebar shown as an icon rail. A per-device UI preference only. */
  isNavCollapsed: boolean;
  toggleNavCollapsed: () => void;
}

export const shellStore = createStore<ShellStore>()(
  persist(
    (set) => ({
      isNavCollapsed: false,
      toggleNavCollapsed: () => set((state) => ({ isNavCollapsed: !state.isNavCollapsed })),
    }),
    {
      name: 'kidzdiary.app-shell',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ isNavCollapsed }) => ({ isNavCollapsed }),
      // Rehydrated after mount so the server render and the first client render match.
      skipHydration: true,
    },
  ),
);

export function resetShellStoreForTests() {
  shellStore.setState({ isNavCollapsed: false });
}
