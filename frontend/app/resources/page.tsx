import type { Metadata } from "next";
import Link from "next/link";
import { PageAnimations } from "../components/page-animations";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Resources | Rosterly",
  description: "Guides, templates, and playbooks to help small teams build fair, fully covered rosters.",
};

const categories = ["Getting started", "Rules & fairness", "Templates", "Product updates"];

const resources = [
  {
    tag: "Guide",
    title: "The first roster: a ten-minute setup guide",
    copy: "Add your team, set the non-negotiables, and publish a week you can trust.",
    length: "8 min read",
    tone: "bg-[#d8e7fa]",
    tagTone: "text-[#62758d]",
  },
  {
    tag: "Playbook",
    title: "Writing hour rules staff actually agree with",
    copy: "Turn fairness and compliance into rules Rosterly can enforce every week.",
    length: "6 min read",
    tone: "bg-[#f8d9b7]",
    tagTone: "text-[#826849]",
  },
  {
    tag: "Guide",
    title: "Covering the holidays without the group-chat scramble",
    copy: "Collect time off early, plan cover, and keep the busy weeks balanced.",
    length: "5 min read",
    tone: "bg-[#d8efe2]",
    tagTone: "text-[#577361]",
  },
  {
    tag: "Insights",
    title: "Fairness, measured: spotting an unbalanced week",
    copy: "The few numbers worth watching so no one quietly carries the team.",
    length: "7 min read",
    tone: "bg-[#eadcf5]",
    tagTone: "text-[#6f5a86]",
  },
  {
    tag: "Template",
    title: "Availability request message",
    copy: "A short, friendly prompt that gets your team to reply on time.",
    length: "Ready to send",
    tone: "bg-[#d8e7fa]",
    tagTone: "text-[#62758d]",
  },
  {
    tag: "Template",
    title: "Shift-swap policy template",
    copy: "Set clear expectations for swaps before the busy season starts.",
    length: "Ready to edit",
    tone: "bg-[#d8efe2]",
    tagTone: "text-[#577361]",
  },
];

const quickLinks = [
  { label: "Help centre", copy: "Step-by-step answers to common questions." },
  { label: "Contact support", copy: "Talk to a human, usually within a day." },
  { label: "Changelog", copy: "See what shipped in Rosterly each week." },
  { label: "Status", copy: "Live availability for every workspace." },
];

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <PageAnimations />
      <SiteHeader current="resources" />

      <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24" data-animate-hero>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66726d]">Resources</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-[clamp(3.2rem,7.6vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
          Everything for a calmer week.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-[#5e6965] sm:text-lg">
          Guides, playbooks, and ready-to-use templates to help small teams plan fair rosters without the guesswork.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category, index) => (
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold ${index === 0 ? "bg-[#17211e] text-white" : "border border-[#dcdcd2] bg-white/70 text-[#5a6662]"}`}
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-24" data-scroll-reveal>
        <article className="overflow-hidden rounded-[28px] border border-[#17211e] bg-[#17211e] p-2 text-white shadow-[0_32px_80px_rgba(37,45,42,0.18)] sm:rounded-[36px] sm:p-3">
          <div className="grid gap-6 rounded-[21px] bg-[#fbfbf8] p-6 text-[#17211e] sm:rounded-[27px] sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#d9ff57] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#17211e]">
                Featured guide
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                The small-team manager&apos;s guide to a fully covered week.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-[#5e6965] sm:text-base">
                The complete walkthrough: collecting availability, setting rules that hold, and reviewing the handful of exceptions that actually matter.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link className="inline-flex items-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="/how-it-works">
                  Read the guide <Arrow />
                </Link>
                <span className="text-xs font-medium text-[#8a928e]">12 min read</span>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#e2e3dc] bg-[#f2f2ec] p-4 sm:p-6">
              <div className="rounded-2xl border border-[#e0e1da] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a928e]">In this guide</p>
                  <span className="grid size-7 place-items-center rounded-full bg-[#d8efe2] text-[10px] text-[#49775a]">&#10003;</span>
                </div>
                <div className="mt-4 space-y-2">
                  {["Set up your team once", "Write rules that hold", "Review exceptions only", "Publish and notify"].map((item, index) => (
                    <div className="flex items-center gap-3 rounded-xl bg-[#f7f6f0] px-3 py-2.5" key={item}>
                      <span className="font-mono text-[10px] text-[#9aa19d]">0{index + 1}</span>
                      <span className="text-xs font-medium sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="bg-white py-20 sm:py-28" data-scroll-reveal>
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#68736f]">Library</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Pick a place to start.</h2>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#17211e] hover:underline" href="/how-it-works">
              Browse the workflow <Arrow />
            </Link>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-scroll-stagger>
            {resources.map((resource) => (
              <article className={`${resource.tone} flex min-h-64 flex-col justify-between rounded-[24px] p-6 transition-transform hover:-translate-y-1 sm:p-7`} key={resource.title} data-scroll-item>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.13em] ${resource.tagTone}`}>{resource.tag}</span>
                  <span className="grid size-9 place-items-center rounded-full bg-white/70"><Arrow /></span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-snug tracking-[-0.03em]">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#53605b]">{resource.copy}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6d7773]">{resource.length}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17211e] py-20 text-white sm:py-28" data-scroll-reveal>
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d9ff57]">Need a hand?</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Quick links to the humans.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">Can&apos;t find what you need? Support is real people who know small teams, not a maze of tickets.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <div className="rounded-[20px] border border-white/15 bg-[#222e2a] p-5 transition-colors hover:bg-[#273630]" key={link.label}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{link.label}</h3>
                  <Arrow />
                </div>
                <p className="mt-2 text-xs leading-5 text-white/55">{link.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d9ff57] px-5 py-16 sm:px-8 sm:py-20" data-scroll-reveal>
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-8 rounded-[28px] border border-[#17211e]/15 p-6 text-center sm:p-10 lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h2 className="text-3xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl">One useful email a week.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#506038] sm:text-base">Roster tips and new templates, written for small teams. No noise, unsubscribe anytime.</p>
          </div>
          <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="resources-email">Work email</label>
            <input
              className="h-12 flex-1 rounded-full border border-[#17211e]/20 bg-white px-5 text-sm font-medium text-[#17211e] outline-none placeholder:text-[#9aa19d] focus:border-[#17211e]"
              id="resources-email"
              name="email"
              placeholder="you@company.com"
              type="email"
            />
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#17211e] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" type="submit">
              Subscribe <Arrow />
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
