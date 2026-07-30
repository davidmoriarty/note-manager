// client/src/lib/auth-loader.ts

import { setAuthToken, useAuth } from "./auth";
import { dispatchSessionExpired } from "./session-expiry";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let refreshing: Promise<void> | null = null;

function expireCurrentSession(): void {
  const { isDemoUser, user } = useAuth.getState();

  useAuth.getState().clearSession();

  if (user) {
    dispatchSessionExpired(isDemoUser ? "demo-expired" : "session-expired");
  }
}

export async function AuthLoader() {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.status === 204) {
      expireCurrentSession();
      return;
    }

    if (!res.ok) {
      expireCurrentSession();
      return;
    }

    const { token } = (await res.json()) as { token: string };

    setAuthToken(token);
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}
