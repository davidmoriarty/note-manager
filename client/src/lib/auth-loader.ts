// client/src/lib/auth-loader.ts
import { setAuthToken, useAuth } from "./auth";

let refreshing: Promise<void> | null = null;

export async function AuthLoader() {
  if (useAuth.getState().token) return;
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const setToken = useAuth.getState().setToken;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.token);
      setToken(data.token);
    } else {
      setToken(null);
    }
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}
