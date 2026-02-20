import type { ApiResponse } from "@shared";
import { Hono } from "hono";

const startedAtMs = Date.now();

export const metaRoutes = new Hono()
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
  .get("/", (c) => c.text("Hello Hono!"))

  .get("/hello", (c) => {
    const data: ApiResponse = { message: "Hello BHVR!", success: true };
    return c.json(data, { status: 200 });
  });
