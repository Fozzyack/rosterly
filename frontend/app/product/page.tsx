import type { Metadata } from "next";
import Link from "next/link";
import { PageAnimations } from "../components/page-animations";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Product | Rosterly",
  description: "Build fair, fully covered staff rosters automatically with Rosterly.",
};

const people = [
  { name: "Jamie M.", role: "Manager", hours: "38h", tone: "bg-[#d8efe2]" },
  { name: "Alex K.", role: "Front desk", hours: "32h", tone: "bg-[#f8d9b7]" },
  { name: "Mia S.", role: "Sales", hours: "28h", tone: "bg-[#d8e7fa]" },
  { name: "Theo K.", role: "Support", hours: "30h", tone: "bg-[#eadcf5]" },
];

const features = [
  {
    number: "01",
    title: "Availability, collected",
    copy: "Your team updates when they can work. Rosterly keeps every preference and time-off request in one place.",
    tone: "bg-[#d8e7fa]",
  },
  {
    number: "02",
    title: "Rules, remembered",
    copy: "Set coverage, skills, maximum hours, and break rules once. Every roster follows them automatically.",
    tone: "bg-[#f8d9b7]",
  },
  {
    number: "03",
    title: "Conflicts, caught",
    copy: "See overtime, coverage gaps, and clashing shifts before the roster ever reaches your team.",
    tone: "bg-[#eadcf5]",
  },
  {
    number: "04",
    title: "Changes, handled",
    copy: "When plans change, rebuild only the affected shifts and notify the right people straight away.",
    tone: "bg-[#d8efe2]",
  },
];

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <PageAnimations />
      <SiteHeader current="product" />

      <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24" data-animate-hero>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66726d]">Automated roster builder</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-[clamp(3.2rem,7.6vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
          A better roster before your coffee gets cold.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-[#5e6965] sm:text-lg">
          Give Rosterly your team, availability, and business rules. Get a fair, fully covered week in seconds, ready to review and publish.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="/#signup">
            Build a roster <Arrow />
          </Link>
          <Link className="inline-flex items-center justify-center rounded-full border border-[#c9cbc3] bg-white px-6 py-3.5 text-sm font-semibold hover:bg-[#fafaf7]" href="/how-it-works">
            See how it works
          </Link>
        </div>

        <div className="mt-16 overflow-hidden rounded-[28px] border border-[#d2d2c9] bg-[#17211e] p-2 text-left shadow-[0_32px_80px_rgba(37,45,42,0.18)] sm:mt-20 sm:rounded-[36px] sm:p-3">
          <div className="overflow-hidden rounded-[21px] bg-[#fbfbf8] sm:rounded-[27px]">
            <div className="flex items-center justify-between border-b border-[#e5e5df] px-4 py-3 sm:px-7 sm:py-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8b938f] sm:text-[10px]">North Street Studio</p>
                <p className="mt-1 text-sm font-semibold sm:text-lg">Roster builder</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-medium text-[#74807b] sm:block">All changes saved</span>
                <span className="grid size-8 place-items-center rounded-full bg-[#d9ff57] text-xs font-bold sm:size-10">SA</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[300px_1fr]">
              <aside className="border-b border-[#e5e5df] bg-[#f1f1eb] p-4 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7d8682]">Team &amp; hours</p>
                  <span className="rounded-md bg-white px-2 py-1 text-[9px] font-semibold">8 people</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {people.map((person) => (
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#dedfd7] bg-white p-2.5" key={person.name}>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[9px] font-bold ${person.tone}`}>{person.name.split(" ").map((part) => part[0]).join("")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-semibold sm:text-xs">{person.name}</p>
                        <p className="hidden text-[9px] text-[#7a8580] sm:block">{person.role}</p>
                      </div>
                      <span className="text-[9px] font-bold text-[#61706a] sm:text-[10px]">{person.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-[#17211e] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">Coverage</p>
                    <span className="text-xs text-[#d9ff57]">100%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-full rounded-full bg-[#d9ff57]" /></div>
                  <p className="mt-3 text-[10px] leading-4 text-white/65">No open shifts or rule conflicts.</p>
                </div>
              </aside>

              <div className="min-w-0 p-3 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#88918d]">This week</p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] sm:text-2xl">A balanced week, ready to go</h2>
                  </div>
                  <span className="hidden rounded-lg bg-[#d9ff57] px-3 py-2 text-xs font-bold sm:block">Publish roster</span>
                </div>

                <div className="mt-5 grid grid-cols-5 overflow-hidden rounded-t-xl border border-[#e1e2dc] bg-[#f3f3ee] text-center">
                  {["MON 14", "TUE 15", "WED 16", "THU 17", "FRI 18"].map((day) => (
                    <div className="border-r border-[#e1e2dc] py-2 text-[8px] font-bold last:border-r-0 sm:py-3 sm:text-[10px]" key={day}>{day}</div>
                  ))}
                </div>
                <div className="grid h-56 grid-cols-5 grid-rows-3 overflow-hidden rounded-b-xl border border-t-0 border-[#e1e2dc] bg-white sm:h-72">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <div className="relative border-b border-r border-[#ecece6] p-1.5 last:border-r-0 sm:p-2" key={index}>
                      {![7, 11, 13].includes(index) && (
                        <div className={`h-full rounded-md border p-1.5 sm:rounded-lg sm:p-2 ${index % 4 === 0 ? "border-[#abd5bb] bg-[#d8efe2]" : index % 4 === 1 ? "border-[#e8b87e] bg-[#f8d9b7]" : index % 4 === 2 ? "border-[#adc8ea] bg-[#d8e7fa]" : "border-[#ccb5e0] bg-[#eadcf5]"}`}>
                          <p className="truncate text-[7px] font-bold sm:text-[10px]">{people[index % people.length].name}</p>
                          <p className="mt-1 hidden text-[8px] text-[#68736f] sm:block">{8 + (index % 3)}:00 - {3 + (index % 4)}:00</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-[#dfe1da] bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-[#d8efe2] text-[#49775a]">&#10003;</span>
                    <span className="text-[10px] font-semibold sm:text-xs">Every rule passed</span>
                  </div>
                  <span className="text-[9px] font-semibold text-[#707b76] sm:text-xs">164 hrs &middot; $4,920</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" data-scroll-reveal>
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#68736f]">One calm source of truth</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Everything the week needs. Nothing it doesn&apos;t.</h2>
              <p className="mt-6 max-w-md text-base leading-7 text-[#68736f]">Rosterly focuses on the decisions that cost managers time: who can work, where they are needed, and whether the week is fair.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2" data-scroll-stagger>
              {features.map((feature) => (
                <article className={`${feature.tone} flex min-h-64 flex-col justify-between rounded-[24px] p-6 sm:p-7`} key={feature.number} data-scroll-item>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.13em]">{feature.number}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-white/70"><Arrow /></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#53605b]">{feature.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#17211e] py-20 text-white sm:py-28" data-scroll-reveal>
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d9ff57]">Built around your business</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Your rules stay in charge.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">Automation should not mean losing control. Pin critical shifts, protect preferred hours, and adjust any decision before publishing.</p>
            <Link className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d9ff57] px-6 py-3.5 text-sm font-semibold text-[#17211e]" href="/how-it-works">See the workflow <Arrow /></Link>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-[#222e2a] p-4 sm:p-6">
            <div className="rounded-2xl bg-[#f7f6f0] p-4 text-[#17211e] sm:p-6">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">Roster rules</p><span className="text-[10px] font-bold text-[#66806f]">8 active</span></div>
              <div className="mt-4 space-y-2">
                {["At least 2 keyholders on site", "Maximum 38 hours per person", "12 hours between closing and opening", "Match required role skills"].map((rule, index) => (
                  <div className="flex items-center gap-3 rounded-xl border border-[#e0e1da] bg-white p-3" key={rule}>
                    <span className={`grid size-7 place-items-center rounded-lg ${index === 2 ? "bg-[#f8d9b7]" : "bg-[#d8efe2]"}`}>
                      <svg className="size-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10.5 3.5 3.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <p className="flex-1 text-xs font-medium sm:text-sm">{rule}</p>
                    <span className="h-5 w-9 rounded-full bg-[#17211e] p-0.5"><span className="ml-auto block size-4 rounded-full bg-[#d9ff57]" /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d9ff57] px-5 py-16 text-center sm:px-8 sm:py-20" data-scroll-reveal>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-none tracking-[-0.055em] sm:text-6xl">Put next week on autopilot.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#506038] sm:text-base">Create your first roster free. No credit card, no complicated setup.</p>
        <Link className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white" href="/#signup">Start building <Arrow /></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
