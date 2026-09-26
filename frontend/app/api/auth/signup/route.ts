import { NextResponse } from "next/server";

import { getServerApiUrl } from "@/lib/api";
import type { SignupRequest } from "@/types/auth";

function isSignupRequest(value: unknown): value is SignupRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const { name, email, password } = value as Record<string, unknown>;

  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof password === "string" &&
    password.length >= 8
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid account details." }, { status: 400 });
  }

  if (!isSignupRequest(body)) {
    return NextResponse.json({ error: "Enter valid account details." }, { status: 400 });
  }

  const signupRequest: SignupRequest = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };

  try {
    const response = await fetch(`${getServerApiUrl()}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupRequest),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Couldn't create your account. Please try again." },
        { status: response.status === 400 ? 400 : 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Couldn't create your account. Please try again." },
      { status: 502 },
    );
  }
}
