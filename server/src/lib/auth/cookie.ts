// server/src/lib/auth/cookie.ts

export const REFRESH_EXPIRES_SECONDS = 60 * 60 * 24 * 30;

function baseOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? ("None" as const) : ("Lax" as const),
    secure: isProduction,
  };
}

export function getRefreshCookieOptions() {
  return {
    ...baseOptions(),
    maxAge: REFRESH_EXPIRES_SECONDS,
    expires: new Date(Date.now() + REFRESH_EXPIRES_SECONDS * 1000),
  };
}

export function getExpiredRefreshCookieOptions() {
  return {
    ...baseOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}
