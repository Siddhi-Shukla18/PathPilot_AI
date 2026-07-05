import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, name: string) => UserProfile;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  setLoading: (val: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (email, name) => {
        const user: UserProfile = {
          id: uuidv4(),
          name,
          email,
          joinedAt: new Date(),
          experience: 'student',
          skills: [],
        };
        set({ user, isAuthenticated: true });
        return user;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...patch } });
      },

      setLoading: (val) => set({ isLoading: val }),
    }),
    {
      name: 'pathpilot-user',
      partialize: (state) => ({
        user: state.user
          ? {
              ...state.user,
              joinedAt: state.user.joinedAt.toISOString(),
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          const raw = state.user as unknown as Record<string, unknown>;
          state.user = {
            ...state.user,
            joinedAt: new Date(raw.joinedAt as string),
          };
        }
      },
    }
  )
);
