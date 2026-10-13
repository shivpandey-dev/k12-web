import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

interface ActiveMembershipStore {
  /** Last membership the user chose on this device. Only an opaque ID; never personal data. */
  selectedMembershipId: string | null;
  select: (membershipId: string) => void;
}

export const activeMembershipStore = createStore<ActiveMembershipStore>()(
  persist(
    (set) => ({
      selectedMembershipId: null,
      select: (membershipId) => set({ selectedMembershipId: membershipId }),
    }),
    {
      name: 'kidzdiary.active-membership',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ selectedMembershipId }) => ({ selectedMembershipId }),
      // Hydrated on the client after mount so server and first client render match.
      skipHydration: true,
    },
  ),
);
