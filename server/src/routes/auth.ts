// server/src/routes/auth.ts
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createDemoSession } from "../lib/demo";
import {
  getExpiredRefreshCookieOptions,
  getRefreshCookieOptions,
} from "../lib/auth/cookie";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import {
  createRefreshToken,
  revokeRefreshTokenById,
  signAccessToken,
  verifyRefreshToken,
} from "../lib/auth/tokens";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../lib/middleware/auth";
import type { UserBaseDto, UserDto, MeStatsDto } from "@shared";
type AuthLoginDto = UserBaseDto & { token: string };

export const authRoutes = new Hono()
  // REGISTER
  .post("/register", async (c) => {
    const { email, password, name } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    try {
      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: { email, password: hashed, name },
      });

      const dto: UserBaseDto = {
        id: user.id,
        email: user.email,
        name: user.name ?? "",
      };

      return c.json(dto, 201);
    } catch {
      return c.json({ error: "User already exists or failed to create" }, 400);
    }
  })

  // LOGIN
  .post("/login", async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 401);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const valid = await verifyPassword(password, user.password);
    if (!valid) return c.json({ error: "Invalid credentials" }, 401);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = await createRefreshToken(user.id);

    setCookie(c, "refresh", refreshToken, getRefreshCookieOptions());

    const dto: AuthLoginDto = {
      id: user.id,
      email: user.email,
      name: user.name ?? "",
      token: accessToken,
    };

    return c.json(dto, 200);
  })

  // Demo Login
  .post("/demo", async (c) => {
    const { user, accessToken, refreshToken } = await createDemoSession();

    setCookie(c, "refresh", refreshToken, getRefreshCookieOptions());

    const dto = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: accessToken,
      isDemoUser: true,
    };

    return c.json(dto, 200);
  })

  // REFRESH
  .post("/refresh", async (c) => {
    const refreshCookie = getCookie(c, "refresh");

    // Silent "not logged in" path
    if (!refreshCookie) {
      return c.body(null, 204);
    }

    try {
      const validToken = await verifyRefreshToken(refreshCookie);
      const accessToken = signAccessToken({ userId: validToken.userId });

      const newRefreshToken = await createRefreshToken(validToken.userId);
      await revokeRefreshTokenById(validToken.id);

      setCookie(c, "refresh", newRefreshToken, getRefreshCookieOptions());

      return c.json({ token: accessToken }, 200);
    } catch {
      // Invalid / expired token: also treat as "no session"
      return c.body(null, 204);
    }
  })

  // ME
  .get("/me", authMiddleware, async (c) => {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const dto: UserDto = {
      id: user.id,
      email: user.email,
      name: user.name ?? "",
      emailVerified: user.emailVerifiedAt !== null,
      memberSince: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    };

    return c.json(dto, 200);
  })

  // ME STATS
  .get("/me/stats", authMiddleware, async (c) => {
    const userId = c.get("userId");

    const totalNotes = await prisma.note.count({
      where: { authorId: userId },
    });

    const dto: MeStatsDto = {
      totalNotes,
    };

    return c.json(dto, 200);
  })

  // LOGOUT
  .post("/logout", async (c) => {
    const refreshCookie = getCookie(c, "refresh");

    if (refreshCookie) {
      try {
        const row = await verifyRefreshToken(refreshCookie);
        await revokeRefreshTokenById(row.id);
      } catch {
        // ignore
      }
    }

    setCookie(c, "refresh", "", getExpiredRefreshCookieOptions());
    return c.json({ success: true }, 200);
  });
