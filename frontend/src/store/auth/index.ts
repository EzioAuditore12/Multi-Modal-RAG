import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthStore } from './type';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      setUserDetails(data) {
        set({ user: data });
      },

      logout: async () => {
        set({ user: null });
      },
    }),
    {
      name: 'ai-project-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
