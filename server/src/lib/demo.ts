// server/src/lib/demo.ts

import { hashPassword } from "./auth/password";
import { createRefreshToken, signAccessToken } from "./auth/tokens";
import { prisma } from "./prisma";

const DEMO_USER_TTL_MS = 24 * 60 * 60 * 1000;

export async function cleanupExpiredDemoUsers() {
  const cutoff = new Date(Date.now() - DEMO_USER_TTL_MS);

  await prisma.user.deleteMany({
    where: {
      isDemoUser: true,
      createdAt: {
        lt: cutoff,
      },
    },
  });
}

export async function createDemoSession() {
  await cleanupExpiredDemoUsers();

  const user = await prisma.user.create({
    data: {
      email: `demo-${crypto.randomUUID()}@example.com`,
      name: "Demo User",
      password: await hashPassword(crypto.randomUUID()),
      isDemoUser: true,

      notes: {
        create: [
          {
            title: "Welcome to Note Manager",
            content:
              "# Welcome to Note Manager\n\nThis demo workspace includes a few sample notes so you can explore the app without creating an account.",
          },
          {
            title: "Project Ideas",
            content:
              "# Project Ideas\n\n- Build a reusable BHVR starter template\n- Add demo mode to portfolio apps\n- Improve shared UI components",
          },
          {
            title: "Markdown Notes",
            content:
              "# Markdown Notes\n\nNote Manager supports markdown-style writing for structured notes, drafts, and project documentation.",
          },
        ],
      },
    },
  });

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = await createRefreshToken(user.id);

  return {
    user,
    accessToken,
    refreshToken,
  };
}
