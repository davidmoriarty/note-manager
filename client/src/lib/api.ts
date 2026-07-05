// client/src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { setAuthToken, useAuth } from "./auth";
import type { UserDto, UserBaseDto, MeStatsDto, NoteDto } from "@shared";

type AuthLoginDto = UserBaseDto & {
  token: string;
  isDemoUser?: boolean;
};

let refreshingToken: Promise<string | null> | null = null;

type RefreshJson = { token: string };
function isRefreshJson(v: unknown): v is RefreshJson {
  return (
    typeof v === "object" &&
    v !== null &&
    "token" in v &&
    typeof (v as Record<string, unknown>).token === "string"
  );
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) {
    // Silent on initial boot: no cookie / expired cookie is normal
    useAuth.getState().setToken(null);
    return null;
  }

  let data: unknown;
  try {
    data = await refreshRes.json();
  } catch {
    useAuth.getState().setToken(null);
    return null;
  }

  if (!isRefreshJson(data)) {
    useAuth.getState().setToken(null);
    return null;
  }

  const newToken = data.token;
  if (!newToken) {
    useAuth.getState().setToken(null);
    return null;
  }

  setAuthToken(newToken);
  return newToken;
}

/** Basic helper that automatically sends JSON and optional auth token */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { token } = useAuth.getState();

  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge in any headers from options if they are a plain object
  if (options.headers && !(options.headers instanceof Headers)) {
    Object.assign(headersObj, options.headers);
  }

  // Add Authorization if we have a token
  if (token) headersObj.Authorization = `Bearer ${token}`;

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: headersObj,
    credentials: "include",
  });

  if (res.status === 401 && path !== "/auth/refresh") {
    // Deduplicate multiple refreshes
    if (!refreshingToken) {
      refreshingToken = (async () => {
        const newToken = await tryRefreshToken();
        refreshingToken = null;
        return newToken;
      })();
    }

    const newToken = await refreshingToken;

    // If refresh failed, propagate the original 401 as a normal app-level unauthorized
    if (!newToken) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Unauthorized");
    }

    headersObj.Authorization = `Bearer ${newToken}`;

    // Retry original request with new token
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: headersObj,
      credentials: "include",
    });
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

/** Auth API */
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    request<UserBaseDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthLoginDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  demo: () =>
    request<AuthLoginDto>("/auth/demo", {
      method: "POST",
    }),

  me: () => request<UserDto>("/auth/me"),

  meStats: () => request<MeStatsDto>("/auth/me/stats"),
};

/** Notes API */
export const notesApi = {
  getAll: (order: "asc" | "desc" = "desc") =>
    request<NoteDto[]>(`/notes?order=${order}`),
  getOne: (id: number) => request<NoteDto>(`/notes/${id}`),
  create: (data: { title: string; content: string }) =>
    request<NoteDto>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: { title?: string; content?: string; published?: boolean },
  ) =>
    request<NoteDto>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/notes/${id}`, { method: "DELETE" }),
};
