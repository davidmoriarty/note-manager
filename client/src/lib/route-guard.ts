// client/src/lib/route-guard.ts
import { redirect } from "@tanstack/react-router";
import { AuthLoader } from "./auth-loader";
import { useAuth } from "./auth";

export async function requireAuth(currentPath?: string) {
  await AuthLoader();

  const { token } = useAuth.getState();

  if (!token) {
    throw redirect({
      to: "/login",
      search: () => ({
        redirect: currentPath ?? "/notes",
      }),
    });
  }

  return true;
}
