// client/src/components/auth/SessionExpiryListener.tsx

import { useEffect } from "react";
import { router } from "@/router";
import {
  SESSION_EXPIRED_EVENT,
  type SessionExpiryReason,
} from "@/lib/session-expiry";

export function SessionExpiryListener() {
  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const { detail: reason } = event as CustomEvent<SessionExpiryReason>;
      const redirect = `${window.location.pathname}${window.location.search}`;

      void router.navigate({
        to: "/login",
        search: {
          redirect,
          reason,
        },
        replace: true,
      });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  return null;
}
