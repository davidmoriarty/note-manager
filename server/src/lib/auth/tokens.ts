// server/src/lib/auth/tokens.ts
import { createHash, randomBytes } from "node:crypto";
import { sign } from "jsonwebtoken";
import { prisma } from "../prisma";
import { REFRESH_EXPIRES_SECONDS } from "./cookie";
import { type AccessTokenPayload, JWT_SECRET } from "./jwt";
import { hashRefreshToken, verifySecret } from "./password";

const ACCESS_EXPIRES = "15m";
const REFRESH_MS = REFRESH_EXPIRES_SECONDS * 1000;

export function signAccessToken(payload: AccessTokenPayload) {
  return sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export async function createRefreshToken(userId: number) {
  const token = randomBytes(64).toString("hex");
  const tokenHash = await hashRefreshToken(token);
  const lookupHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + REFRESH_MS);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      lookupHash,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyRefreshToken(rawToken: string) {
  const lookupHash = sha256Hex(rawToken);

  const row = await prisma.refreshToken.findUnique({
    where: { lookupHash },
  });

  if (!row || row.revoked || row.expiresAt <= new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  const ok = await verifySecret(rawToken, row.tokenHash);
  if (!ok) throw new Error("Invalid or expired refresh token");

  return row;
}

export async function revokeRefreshTokenById(id: number) {
  await prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
}
