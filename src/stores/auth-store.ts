import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (data) => {
        const { accessToken, refreshToken, ...user } = data;
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
      updateTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
