// client/src/lib/rpc.ts
import { hcWithType } from "../../../server/src/client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined");
}

export const rpc = hcWithType(BASE_URL, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});
