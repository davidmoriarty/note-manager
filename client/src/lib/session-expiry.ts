// client/src/lib/session-expiry.ts

export type SessionExpiryReason = "session-expired" | "demo-expired";

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export function dispatchSessionExpired(reason: SessionExpiryReason): void {
  window.dispatchEvent(
    new CustomEvent<SessionExpiryReason>(SESSION_EXPIRED_EVENT, {
      detail: reason,
    }),
  );
}
