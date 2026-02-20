// server/src/routes/meta.ts
import { Hono } from "hono";

const startedAtMs = Date.now();

export const metaRoutes = new Hono()
  .get("/", (c) => {
    return c.json({
      name: "note-manager-api",
      version: process.env.APP_VERSION ?? "dev",
      status: "ok",
      documentation: null,
    });
  })
  .get("/__info", (c) => {
    const uptimeSeconds = Math.floor((Date.now() - startedAtMs) / 1000);
    return c.json({
      name: "note-manager-api",
      nodeEnv: process.env.NODE_ENV ?? "development",
      uptimeSeconds,
      clientOrigin: process.env.CLIENT_ORIGIN ?? null,
    });
  });
