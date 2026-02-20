// server/src/app.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { metaRoutes } from "./routes/meta";
import { notesRoutes } from "./routes/notes";

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean) as string[];

export const app = new Hono()
  .use("*", logger())
  .use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return origin;
        return allowedOrigins.includes(origin) ? origin : null;
      },
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  )
  .route("/", metaRoutes)
  .route("/auth", authRoutes)
  .route("/notes", notesRoutes);
