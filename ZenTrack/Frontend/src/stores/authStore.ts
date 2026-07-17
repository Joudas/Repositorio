import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  type AuthUser,
} from "@/services/auth";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        const user = await loginUser(email, password);
        set({ user });
      },

      register: async (email: string, password: string, name?: string) => {
        const user = await registerUser(email, password, name);
        set({ user });
      },

      logout: async () => {
        await logoutUser();
        set({ user: null });
      },

      checkSession: async () => {
        try {
          const user = await getMe();
          set({ user, isLoading: false });
        } catch {
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "zentrack-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().user !== null;
};
