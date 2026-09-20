import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "How It Works | Rosterly",
  description: "Turn team availability and business rules into a publish-ready roster in three simple steps.",
};

const availability = [
  { day: "Mon", value: "8am - 5pm", active: true },
  { day: "Tue", value: "Unavailable", active: false },
  { day: "Wed", value: "8am - 5pm", active: true },
  { day: "Thu", value: "12pm - 6pm", active: true },
];

const checks = [
  "Availability matched",
  "Required skills covered",
  "Hour limits respected",
  "Opening and closing covered",
];

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepNumber({ children }: { children: string }) {
  return <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#17211e] text-xs font-bold text-[#d9ff57]">{children}</span>;
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <SiteHeader current="how-it-works" />

      <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66726d]">How Rosterly works</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-[clamp(3.2rem,7.5vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
          From messy availability to a ready roster.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-[#5e6965] sm:text-lg">
          Set up your team once. Each week, Rosterly gathers what changed, balances every requirement, and gives you the final say.
        </p>
        <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="/#signup">
          Make my first roster <Arrow />
        </Link>

        <div className="mt-16 grid gap-3 text-left md:grid-cols-3 sm:mt-20">
          <article className="flex min-h-[420px] flex-col rounded-[26px] bg-[#d8e7fa] p-5 sm:p-7">
            <div className="flex items-start justify-between"><StepNumber>01</StepNumber><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#62758d]">Collect</span></div>
            <div className="my-8 rounded-2xl bg-white p-4 shadow-[0_14px_35px_rgba(63,79,98,0.12)]">
              <div className="flex items-center gap-2.5 border-b border-[#e8e9e3] pb-3">
                <span className="grid size-8 place-items-center rounded-full bg-[#f8d9b7] text-[9px] font-bold">AK</span>
                <div><p className="text-xs font-semibold">Alex&apos;s availability</p><p className="text-[9px] text-[#7d8783]">Week of September 14</p></div>
              </div>
              <div className="mt-3 space-y-2">
                {availability.map((item) => (
                  <div className="flex items-center justify-between rounded-lg bg-[#f5f5f1] px-3 py-2" key={item.day}>
                    <span className="text-[10px] font-semibold">{item.day}</span>
                    <span className={`text-[9px] font-medium ${item.active ? "text-[#4b7558]" : "text-[#9a6960]"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto"><h2 className="text-2xl font-semibold tracking-[-0.04em]">Your team shares what changed.</h2><p className="mt-2 text-sm leading-6 text-[#52677c]">A simple weekly prompt collects availability and time off without spreadsheets or group-chat chasing.</p></div>
          </article>

          <article className="flex min-h-[420px] flex-col rounded-[26px] bg-[#f8d9b7] p-5 sm:p-7">
            <div className="flex items-start justify-between"><StepNumber>02</StepNumber><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#826849]">Set rules</span></div>
            <div className="my-8 rounded-2xl bg-white p-4 shadow-[0_14px_35px_rgba(98,74,43,0.1)]">
              <p className="text-xs font-semibold">Monday coverage</p>
              <div className="mt-4 space-y-3">
                <div><div className="flex justify-between text-[9px] font-medium"><span>Open</span><span>2 people</span></div><div className="mt-1.5 flex gap-1"><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#e5e6df]"/></div></div>
                <div><div className="flex justify-between text-[9px] font-medium"><span>Lunch rush</span><span>4 people</span></div><div className="mt-1.5 flex gap-1"><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#17211e]"/></div></div>
                <div><div className="flex justify-between text-[9px] font-medium"><span>Close</span><span>2 people</span></div><div className="mt-1.5 flex gap-1"><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#17211e]"/><span className="h-2 flex-1 rounded-full bg-[#e5e6df]"/></div></div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#eef4ef] p-2.5"><span className="grid size-5 place-items-center rounded-full bg-[#d8efe2] text-[10px]">&#10003;</span><span className="text-[9px] font-semibold">Keyholder required at open and close</span></div>
            </div>
            <div className="mt-auto"><h2 className="text-2xl font-semibold tracking-[-0.04em]">You define a good week.</h2><p className="mt-2 text-sm leading-6 text-[#725d43]">Tell Rosterly your coverage, roles, budgets, hour limits, and non-negotiables. Set them once, adjust anytime.</p></div>
          </article>

          <article className="flex min-h-[420px] flex-col rounded-[26px] bg-[#d8efe2] p-5 sm:p-7">
            <div className="flex items-start justify-between"><StepNumber>03</StepNumber><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#577361]">Generate</span></div>
            <div className="my-8 rounded-2xl bg-white p-4 shadow-[0_14px_35px_rgba(57,91,68,0.1)]">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold">Roster ready</p><p className="mt-0.5 text-[9px] text-[#7d8783]">Generated in 12 seconds</p></div><span className="grid size-8 place-items-center rounded-full bg-[#d9ff57]">&#10003;</span></div>
              <div className="mt-4 grid grid-cols-5 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <span className={`h-10 rounded-md ${item % 4 === 0 ? "bg-[#d8efe2]" : item % 4 === 1 ? "bg-[#f8d9b7]" : item % 4 === 2 ? "bg-[#d8e7fa]" : "bg-[#eadcf5]"}`} key={item} />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#e8e9e3] pt-3"><span className="text-[9px] font-medium text-[#68736f]">164 scheduled hours</span><span className="rounded-md bg-[#17211e] px-2.5 py-1.5 text-[9px] font-bold text-white">Review roster</span></div>
            </div>
            <div className="mt-auto"><h2 className="text-2xl font-semibold tracking-[-0.04em]">Rosterly finds the best fit.</h2><p className="mt-2 text-sm leading-6 text-[#506b59]">Review one balanced option, make any human adjustments, then publish to everyone in one click.</p></div>
          </article>
        </div>
      </section>

      <section className="bg-[#17211e] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-24">
            <div className="lg:sticky lg:top-10">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d9ff57]">Inside the 12 seconds</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Fast doesn&apos;t mean careless.</h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/65">Rosterly checks every possible assignment against the details that make your business work.</p>
            </div>
            <div className="border-t border-white/15">
              {checks.map((check, index) => (
                <div className="grid grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-white/15 py-6 sm:grid-cols-[72px_1fr_auto] sm:py-8" key={check}>
                  <span className="font-mono text-xs text-white/35">0{index + 1}</span>
                  <div><h3 className="text-lg font-semibold sm:text-2xl">{check}</h3><p className="mt-1 text-xs leading-5 text-white/50 sm:text-sm">{index === 0 ? "No one is placed outside the times they offered." : index === 1 ? "Every shift has the right experience on hand." : index === 2 ? "Hours stay fair, compliant, and within budget." : "The day starts and finishes with enough people."}</p></div>
                  <span className="grid size-8 place-items-center rounded-full bg-[#d9ff57] text-[#17211e]">&#10003;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#68736f]">You stay in control</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Review the exceptions, not every cell.</h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#68736f]">Rosterly surfaces the handful of decisions that need a manager and handles the repetitive checking in the background.</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl rounded-[28px] border border-[#dfe0d8] bg-[#f5f3ea] p-4 sm:p-8">
            <div className="rounded-2xl border border-[#dfe0d8] bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-[#e6e7e0] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#f8d9b7] text-xs font-bold">AK</span><div><p className="text-sm font-semibold">Alex requested Tuesday off</p><p className="mt-0.5 text-[10px] text-[#7b8581]">This affects one scheduled shift</p></div></div>
                <span className="self-start rounded-lg bg-[#eadcf5] px-3 py-2 text-[10px] font-bold sm:self-auto">Needs review</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#e2e3dc] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a928e]">Suggested cover</p><div className="mt-3 flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-full bg-[#d8e7fa] text-[9px] font-bold">MS</span><div><p className="text-xs font-semibold">Mia S.</p><p className="text-[9px] text-[#7a8580]">Available &middot; 26 hours this week</p></div></div></div>
                <div className="rounded-xl border border-[#e2e3dc] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a928e]">Impact</p><div className="mt-3 flex items-center justify-between"><div><p className="text-xs font-semibold">All checks still pass</p><p className="text-[9px] text-[#7a8580]">Coverage and budget unchanged</p></div><span className="grid size-7 place-items-center rounded-full bg-[#d8efe2]">&#10003;</span></div></div>
              </div>
              <div className="mt-4 flex justify-end gap-2"><span className="rounded-lg border border-[#d8dad2] px-3 py-2 text-[10px] font-bold">Choose someone else</span><span className="rounded-lg bg-[#17211e] px-3 py-2 text-[10px] font-bold text-white">Approve change</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d9ff57] px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-none tracking-[-0.055em] sm:text-6xl">Next week could already be sorted.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#506038] sm:text-base">Start with your team and let Rosterly do the checking.</p>
        <Link className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white" href="/#signup">Try Rosterly free <Arrow /></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
