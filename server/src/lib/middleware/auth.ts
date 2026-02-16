// server/src/lib/middleware/auth.ts
import type { Context, Next } from "hono";
import { verify } from "jsonwebtoken";

declare module "hono" {
  interface ContextVariableMap {
    userId: number;
  }
}

const ACCESS_SECRET = process.env.JWT_SECRET;
if (!ACCESS_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables.");
}
const ACCESS_SECRET_STRING: string = ACCESS_SECRET;

export async function authMiddleware(c: Context, next: Next) {
  if (c.req.path === "/auth/refresh") {
    return next();
  }

  const auth = c.req.header("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);

  try {
    const payload = verify(token, ACCESS_SECRET_STRING) as { userId: number };
    c.set("userId", payload.userId);
    return next();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return c.json({ error: "Access token expired" }, { status: 401 });
    }

    return c.json({ error: "Invalid token" }, { status: 401 });
  }
}
