// client/src/lib/auth-loader.ts
import { setAuthToken, useAuth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let refreshing: Promise<void> | null = null;

export async function AuthLoader() {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.status === 204) {
      useAuth.getState().clearSession();
      return;
    }

    if (!res.ok) {
      useAuth.getState().clearSession();
      return;
    }

    const { token } = (await res.json()) as { token: string };

    setAuthToken(token);
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}
