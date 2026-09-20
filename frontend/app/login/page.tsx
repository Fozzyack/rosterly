import { LoginForm } from "./login-form";
import { PageAnimations } from "../components/page-animations";
import { LogoMark, SiteHeader } from "../components/site-header";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <PageAnimations />
      <SiteHeader />

      <section className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-10 text-center sm:px-8" data-animate-hero>
        <div className="relative w-full max-w-[420px]">
          <div className="absolute -right-4 -top-8 z-10 hidden rotate-2 rounded-2xl bg-[#d9ff57] p-3.5 text-left shadow-xl sm:block">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#17211e] text-white">
                <svg className="size-3" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10.5 8 14l8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div><p className="text-[10px] font-bold">Roster ready</p><p className="text-[9px] text-[#4d5d39]">Built in 12 seconds</p></div>
            </div>
          </div>

          <div className="relative rounded-[26px] border border-[#d6d4c9] bg-white p-7 shadow-[0_40px_100px_rgba(39,48,44,0.14)] sm:p-9">
            <div className="flex justify-center">
              <LogoMark />
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl">
              Welcome{" "}
              <span className="relative inline-block px-1 italic text-[#55715e]">
                back
                <svg className="absolute -bottom-1.5 left-1/2 w-[90%] -translate-x-1/2 text-[#b8dd3e]" viewBox="0 0 330 15" fill="none" aria-hidden="true">
                  <path d="M3 11C73 3 178 2 327 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#5a6662]">
              Log in to see this week&apos;s roster.
            </p>

            <LoginForm />
          </div>

          <p className="mt-5 text-[11px] text-[#89918e]">
            By logging in, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
