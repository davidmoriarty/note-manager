// client/src/lib/auth.ts

import { create } from "zustand";
import { authApi } from "./api";
import type { UserBaseDto, UserDto } from "@shared";

type AuthState = {
  user: UserBaseDto | null;
  token: string | null;
  isDemoUser: boolean;
  isAuthTransitioning: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  setAuthTransitioning: (isAuthTransitioning: boolean) => void;
  clearSession: () => void;
};

// Initialize store with localStorage persistence
export const useAuth = create<AuthState>((set) => {
  const stored = localStorage.getItem("auth");
  const parsed = stored ? JSON.parse(stored) : null;

  return {
    user: parsed?.user ?? null,
    token: parsed?.token ?? null,
    isAuthTransitioning: false,
    isDemoUser: parsed?.isDemoUser ?? false,

    setToken(token) {
      set({ token });
      const current = localStorage.getItem("auth");
      const parsed = current ? JSON.parse(current) : {};
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...parsed,
          token,
        }),
      );
    },

    setAuthTransitioning(isAuthTransitioning) {
      set({ isAuthTransitioning });
    },

    clearSession() {
      set({
        user: null,
        token: null,
        isDemoUser: false,
        isAuthTransitioning: false,
      });

      localStorage.removeItem("auth");
    },

    async login(email: string, password: string) {
      const res = await authApi.login({ email, password });
      const token = res.token ?? null;
      if (token) setAuthToken(token);

      // Store user only
      set({
        user: {
          id: res.id,
          email: res.email,
          name: res.name,
        },
        token,
        isDemoUser: false,
      });

      // Persist user only
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: {
            id: res.id,
            email: res.email,
            name: res.name,
          },
          token,
          isDemoUser: false,
        }),
      );
    },

    async logout() {
      // clear client state immediately
      set({
        user: null,
        token: null,
        isDemoUser: false,
        isAuthTransitioning: false,
      });
      localStorage.removeItem("auth");

      // best-effort server logout (don’t block UI)
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      ).catch(() => {
        console.warn("Failed to clear server refresh token");
      });
    },
  };
});

// Optional helper for direct token access
export function setAuthToken(token: string | null) {
  useAuth.setState({ token });
}

export async function syncCurrentUser(): Promise<UserDto | null> {
  try {
    const user = await authApi.me();

    useAuth.setState({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    return user;
  } catch {
    useAuth.getState().clearSession();
    return null;
  }
}
