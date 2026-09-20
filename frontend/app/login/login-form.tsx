"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getApiUrl } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${getApiUrl()}/auth/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as { token: string };
      localStorage.setItem("session_token", data.token);

      router.push("/");
    } catch {
      setError("Couldn't sign you in. Check your email and password, then try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-8 space-y-4 text-left" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6d7773]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourteam.com"
          className="w-full rounded-xl border border-[#c8cbc2] bg-white px-4 py-3 text-sm font-medium text-[#17211e] outline-none transition-colors placeholder:text-[#a4aba7] focus:border-[#17211e] focus:ring-2 focus:ring-[#d9ff57]"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6d7773]">
            Password
          </label>
          <a href="#forgot" className="text-xs font-semibold text-[#43504c] underline-offset-2 hover:text-[#17211e] hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="w-full rounded-xl border border-[#c8cbc2] bg-white px-4 py-3 pr-11 text-sm font-medium text-[#17211e] outline-none transition-colors placeholder:text-[#a4aba7] focus:border-[#17211e] focus:ring-2 focus:ring-[#d9ff57]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[#8b948f] transition-colors hover:bg-[#f0f0eb] hover:text-[#17211e]"
          >
            {showPassword ? (
              <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2.5 10s2.8-4.5 7.5-4.5S17.5 10 17.5 10s-2.8 4.5-7.5 4.5S2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="m4 16 12-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2.5 10s2.8-4.5 7.5-4.5S17.5 10 17.5 10s-2.8 4.5-7.5 4.5S2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-[#e8b87e] bg-[#f8d9b7]/60 px-4 py-2.5 text-xs font-semibold text-[#7a4a12]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(23,33,30,0.16)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Signing in..." : "Log in"}
      </button>

      <div className="flex items-center gap-3 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#969d99]">
        <span className="h-px flex-1 bg-[#e0e1da]" />
        or continue with
        <span className="h-px flex-1 bg-[#e0e1da]" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#c8cbc2] bg-white/60 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white"
      >
        <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M18.5 10.2c0-.7-.1-1.3-.2-2H10v3.9h4.8a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z" fill="#4285F4" />
          <path d="M10 19c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H1v2.6A9.5 9.5 0 0 0 10 19Z" fill="#34A853" />
          <path d="M4.3 11.9a5.7 5.7 0 0 1 0-3.7V5.6H1a9.5 9.5 0 0 0 0 8.5l3.3-2.2Z" fill="#FBBC05" />
          <path d="M10 4.6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.5 9.5 0 0 0 1 5.6l3.3 2.6C5.1 6.4 7.3 4.6 10 4.6Z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <p className="pt-1 text-center text-xs text-[#6d7773]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#17211e] underline decoration-[#b8dd3e] decoration-2 underline-offset-2 hover:decoration-[#d9ff57]">
          Start for free
        </Link>
      </p>
    </form>
  );
}
