/*
  Warnings:

  - A unique constraint covering the columns `[lookupHash]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lookupHash` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN "lookupHash" TEXT;

UPDATE "RefreshToken"
SET "lookupHash" = encode(digest('rt:' || id::text || ':' || "tokenHash", 'sha256'), 'hex')
WHERE "lookupHash" IS NULL;

ALTER TABLE "RefreshToken" ALTER COLUMN "lookupHash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_lookupHash_key" ON "RefreshToken"("lookupHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revoked_expiresAt_idx"
ON "RefreshToken"("userId", "revoked", "expiresAt");
