import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getServerApiUrl } from "@/lib/api";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}

export async function POST(request: Request) {
  let email: unknown;
  let password: unknown;

  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${getServerApiUrl()}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Couldn't sign you in. Check your email and password, then try again.",
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as { token?: string };

    if (!data.token) {
      return NextResponse.json(
        { error: "The server did not return a session token." },
        { status: 502 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, data.token, {
      httpOnly: true,
      // Compose runs a production Next server at http://localhost, where browsers reject Secure cookies.
      secure: isSecureRequest(request),
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "The authentication service is unavailable." },
      { status: 502 },
    );
  }
}
