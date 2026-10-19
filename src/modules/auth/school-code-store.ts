import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

interface SchoolCodeStore {
  /** Last school code the user chose to remember on this device. Not sensitive. */
  rememberedSchoolCode: string | null;
  remember: (schoolCode: string) => void;
  forget: () => void;
}

export const schoolCodeStore = createStore<SchoolCodeStore>()(
  persist(
    (set) => ({
      rememberedSchoolCode: null,
      remember: (schoolCode) => set({ rememberedSchoolCode: schoolCode }),
      forget: () => set({ rememberedSchoolCode: null }),
    }),
    {
      name: 'kidzdiary.school-code',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ rememberedSchoolCode }) => ({ rememberedSchoolCode }),
      skipHydration: true,
    },
  ),
);

export function resetSchoolCodeStoreForTests() {
  schoolCodeStore.setState({ rememberedSchoolCode: null });
}
