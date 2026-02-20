// server/src/routes/auth.ts
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
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

      return c.json({ id: user.id, email: user.email, name: user.name }, 201);
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

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = await createRefreshToken(user.id);

    setCookie(c, "refresh", refreshToken, getRefreshCookieOptions());

    return c.json(
      { id: user.id, email: user.email, name: user.name, token: accessToken },
      200,
    );
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
