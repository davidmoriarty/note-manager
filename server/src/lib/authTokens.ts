// server/src/lib/authTokens.ts
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "./prisma";

const ACCESS_SECRET = process.env.JWT_SECRET;
if (!ACCESS_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables.");
}
const ACCESS_SECRET_STRING: string = ACCESS_SECRET;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES_DAYS = 30;
const REFRESH_MS = REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;

export function signAccessToken(payload: object) {
  return sign(payload, ACCESS_SECRET_STRING, { expiresIn: ACCESS_EXPIRES });
}

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export async function createRefreshToken(userId: number) {
  const token = randomBytes(64).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
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

export async function verifyRefreshToken(token: string) {
  const lookupHash = sha256Hex(token);

  const row = await prisma.refreshToken.findUnique({
    where: { lookupHash },
  });

  if (!row || row.revoked || row.expiresAt <= new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  const ok = await bcrypt.compare(token, row.tokenHash);
  if (!ok) throw new Error("Invalid or expired refresh token");

  return row;
}

export async function revokeRefreshTokenById(id: number) {
  await prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
}
