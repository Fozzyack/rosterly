import { SignupForm } from "./signup-form";
import { PageAnimations } from "../components/page-animations";
import { LogoMark, SiteHeader } from "../components/site-header";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <PageAnimations />
      <SiteHeader />

      <section className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-10 text-center sm:px-8" data-animate-hero>
        <div className="relative w-full max-w-[420px]">
          <div className="relative rounded-[26px] border border-[#d6d4c9] bg-white p-7 shadow-[0_40px_100px_rgba(39,48,44,0.14)] sm:p-9">
            <div className="flex justify-center">
              <LogoMark />
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl">
              Start your{" "}
              <span className="relative inline-block px-1 italic text-[#55715e]">
                free trial
                <svg className="absolute -bottom-1.5 left-1/2 w-[90%] -translate-x-1/2 text-[#b8dd3e]" viewBox="0 0 330 15" fill="none" aria-hidden="true">
                  <path d="M3 11C73 3 178 2 327 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#5a6662]">
              Build your first roster in minutes — free for 14 days.
            </p>

            <SignupForm />
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-xs font-medium text-[#6d7773]">
            <span className="flex items-center gap-1.5"><span className="text-[#6ba96f]">&#10003;</span> No credit card</span>
            <span className="size-1 rounded-full bg-[#b9bcb4]" />
            <span className="flex items-center gap-1.5"><span className="text-[#6ba96f]">&#10003;</span> Free for 14 days</span>
          </div>
        </div>
      </section>
    </main>
  );
}
