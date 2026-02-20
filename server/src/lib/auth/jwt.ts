// server/src/lib/auth/jwt.ts

const ACCESS_SECRET = process.env.JWT_SECRET;
if (!ACCESS_SECRET)
  throw new Error("JWT_SECRET is missing in environment variables.");

export const JWT_SECRET = ACCESS_SECRET;

export type AccessTokenPayload = { userId: number };
