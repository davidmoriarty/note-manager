// client/src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { setAuthToken, useAuth } from "./auth";

let refreshingToken: Promise<string> | null = null;

export type Note = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  created_at?: number;
};

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
  if (token) {
    headersObj.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: headersObj,
    credentials: "include",
  });

  if (res.status === 401 && path !== "/auth/refresh") {
    // Deduplicate multiple refreshes
    if (!refreshingToken) {
      refreshingToken = (async () => {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          refreshingToken = null;
          useAuth.getState().setToken(null);
          throw new Error("Unauthorized");
        }

        const { token: newToken } = await refreshRes.json();
        setAuthToken(newToken);
        refreshingToken = null;
        return newToken;
      })();
    }

    const newToken = await refreshingToken;
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

  return (await res.json()) as Promise<T>;
}

/** Auth API */
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ id: number; email: string; name?: string; token?: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
};

/** Notes API */
export const notesApi = {
  getAll: () => request<Note[]>("/notes"),
  getOne: (id: number) => request<Note>(`/notes/${id}`),
  create: (data: { title: string; content: string }) =>
    request<Note>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: { title?: string; content?: string; published?: boolean },
  ) =>
    request<Note>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/notes/${id}`, { method: "DELETE" }),
};
