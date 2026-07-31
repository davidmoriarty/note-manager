// client/src/lib/route-guard.ts

import { redirect } from "@tanstack/react-router";
import { AuthLoader } from "./auth-loader";
import { useAuth } from "./auth";

export async function requireAuth(currentPath?: string) {
  let { token } = useAuth.getState();

  if (!token) {
    await AuthLoader();
    token = useAuth.getState().token;
  }

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
