import { cookies } from "next/headers";

import { getServerApiUrl } from "@/lib/api";

export const SESSION_COOKIE = "session_token";
export const SESSION_MAX_AGE = 60 * 60 * 24;

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getSessionToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${getServerApiUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
