// server/src/index.ts
import type { ApiResponse } from "@shared";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { hashPassword, verifyPassword } from "./lib/auth";
import {
  createRefreshToken,
  revokeRefreshTokenById,
  signAccessToken,
  verifyRefreshToken,
} from "./lib/authTokens";
import { authMiddleware } from "./lib/middleware/auth";
import { prisma } from "./lib/prisma";

const startedAtMs = Date.now();

const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: (isProd ? "None" : "Lax") as "None" | "Lax",
  secure: isProd,
  maxAge: 60 * 60 * 24 * 30,
};

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN, // e.g. https://note-manager.davidmoriarty.dev
].filter(Boolean) as string[];

export const app = new Hono()
  .use("*", logger())
  .use(
    "*",
    cors({
      origin: (origin) => {
        // Allow non-browser / same-origin / curl where Origin is missing
        if (!origin) return origin;

        return allowedOrigins.includes(origin) ? origin : null;
      },
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  )

  .get("/__info", (c) => {
    const uptimeSeconds = Math.floor((Date.now() - startedAtMs) / 1000);
    return c.json({
      name: "note-manager-api",
      nodeEnv: process.env.NODE_ENV ?? "development",
      uptimeSeconds,
      clientOrigin: process.env.CLIENT_ORIGIN ?? null,
    });
  })

  // Test Routes
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .get("/hello", async (c) => {
    const data: ApiResponse = { message: "Hello BHVR!", success: true };
    return c.json(data, { status: 200 });
  })

  // Authentication routes

  // REGISTER a new user
  .post("/auth/register", async (c) => {
    const { email, password, name } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, { status: 400 });
    }

    try {
      const hashed = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
        },
      });

      return c.json(
        { id: user.id, email: user.email, name: user.name },
        { status: 201 },
      );
    } catch {
      return c.json(
        { error: "User already exists or failed to create" },
        { status: 400 },
      );
    }
  })

  // LOGIN an existing user
  .post("/auth/login", async (c) => {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await verifyPassword(password, user.password);
    if (!valid)
      return c.json({ error: "Invalid credentials" }, { status: 401 });

    // Generate access token and refresh token
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = await createRefreshToken(user.id);

    // set HttpOnly cookie
    setCookie(c, "refresh", refreshToken, refreshCookieOptions);

    return c.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        token: accessToken,
      },
      { status: 200 },
    );
  })

  // REFRESH token
  .post("/auth/refresh", async (c) => {
    const refreshCookie = getCookie(c, "refresh");
    if (!refreshCookie) {
      return c.json({ error: "No refresh token provided" }, { status: 401 });
    }

    try {
      const validToken = await verifyRefreshToken(refreshCookie);

      const accessToken = signAccessToken({ userId: validToken.userId });

      // Rotate refresh token
      const newRefreshToken = await createRefreshToken(validToken.userId);
      await revokeRefreshTokenById(validToken.id);

      setCookie(c, "refresh", newRefreshToken, refreshCookieOptions);

      return c.json({ token: accessToken }, { status: 200 });
    } catch (err) {
      console.error("Refresh token error:", err);
      return c.json({ error: "Unauthorized" }, { status: 401 });
    }
  })

  // LOGOUT a user
  .post("/auth/logout", async (c) => {
    const refreshCookie = getCookie(c, "refresh");

    if (refreshCookie) {
      try {
        const row = await verifyRefreshToken(refreshCookie);
        await revokeRefreshTokenById(row.id);
      } catch {
        // Ignore invalid token
      }
    }

    setCookie(c, "refresh", "", { ...refreshCookieOptions, maxAge: 0 });

    return c.json({ success: true });
  })

  // Notes routes

  // GET all notes for logged-in user
  .get("/notes", authMiddleware, async (c) => {
    const userId = c.get("userId");
    console.time("fetch-notes");
    const notes = await prisma.note.findMany({
      where: { authorId: userId },
      include: { author: true },
    });

    console.timeEnd("fetch-notes");
    return c.json(notes, { status: 200 });
  })

  // GET a single note by ID
  .get("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json({ error: "Note not found" }, { status: 404 });
    }

    return c.json(note, { status: 200 });
  })

  // CREATE a new note
  .post("/notes", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const { title, content } = await c.req.json();
    if (!title || !content) {
      return c.json({ error: "Missing fields" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
      },
    });

    return c.json(note, { status: 201 });
  })

  // UPDATE a note
  .put("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));
    const { title, content, published } = await c.req.json();

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json(
        { error: "Note not found or update failed" },
        { status: 404 },
      );
    }

    const data: { title?: string; content?: string; published?: boolean } = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (published !== undefined) data.published = published;

    const updated = await prisma.note.update({
      where: { id },
      data,
    });

    return c.json(updated, { status: 200 });
  })

  // DELETE a note
  .delete("/notes/:id", authMiddleware, async (c) => {
    const userId = c.get("userId");
    const id = Number(c.req.param("id"));

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.authorId !== userId) {
      return c.json(
        { error: "Note not found or delete failed" },
        { status: 404 },
      );
    }

    await prisma.note.delete({ where: { id } });
    return c.json({ success: true }, { status: 200 });
  });
