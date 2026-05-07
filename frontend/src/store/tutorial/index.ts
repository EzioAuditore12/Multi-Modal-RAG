'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      homeTutorialCompleted: false,
      projectTutorialCompleted: false,
      loginTutorialCompleted: false,
      setHomeTutorialCompleted: (completed) => set({ homeTutorialCompleted: completed }),
      setProjectTutorialCompleted: (completed) => set({ projectTutorialCompleted: completed }),
      setLoginTutorialCompleted: (completed) => set({ loginTutorialCompleted: completed }),
    }),
    {
      name: 'tutorial-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
