import type { Metadata } from "next";
import Link from "next/link";
import { PageAnimations } from "../components/page-animations";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Pricing | Rosterly",
  description: "Simple, per-team pricing that scales with your roster. Start free, upgrade when you are ready.",
};

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "free forever",
    copy: "For small teams putting their first roster together.",
    tone: "bg-white",
    ring: "border-[#dcdcd2]",
    cta: "Start for free",
    ctaTone: "border border-[#c9cbc3] bg-white hover:bg-[#fafaf7]",
    features: ["Up to 5 teammates", "One weekly roster", "Availability collection", "Coverage checks"],
  },
  {
    name: "Team",
    price: "$29",
    cadence: "per month",
    copy: "For growing teams that need every week covered.",
    tone: "bg-[#17211e] text-white",
    ring: "border-[#17211e]",
    cta: "Start 14-day trial",
    ctaTone: "bg-[#d9ff57] text-[#17211e] hover:-translate-y-0.5",
    popular: true,
    features: [
      "Up to 30 teammates",
      "Unlimited rosters",
      "Skills, roles & hour rules",
      "Time-off requests",
      "Publish & notify in one click",
    ],
  },
  {
    name: "Business",
    price: "$79",
    cadence: "per month",
    copy: "For multi-site teams with more moving parts.",
    tone: "bg-white",
    ring: "border-[#dcdcd2]",
    cta: "Talk to us",
    ctaTone: "border border-[#c9cbc3] bg-white hover:bg-[#fafaf7]",
    features: ["Unlimited teammates", "Multiple locations", "Budget & wage estimates", "Priority support"],
  },
];

const comparison = [
  { feature: "Teammates", starter: "Up to 5", team: "Up to 30", business: "Unlimited" },
  { feature: "Weekly rosters", starter: "1", team: "Unlimited", business: "Unlimited" },
  { feature: "Availability collection", starter: true, team: true, business: true },
  { feature: "Skills & hour rules", starter: false, team: true, business: true },
  { feature: "Time-off requests", starter: false, team: true, business: true },
  { feature: "Multiple locations", starter: false, team: false, business: true },
  { feature: "Budget estimates", starter: false, team: false, business: true },
];

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer: "No. The Starter plan is free forever, and every trial starts without a credit card.",
  },
  {
    question: "What happens when my trial ends?",
    answer: "You keep your rosters and data. Choose a plan to keep publishing, or stay on Starter within its limits.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. Upgrade, downgrade, or cancel at any time. Changes take effect from your next billing cycle.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Annual billing saves you two months on Team and Business. Get in touch and we will switch you over.",
  },
];

function Arrow() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <span className="grid size-5 place-items-center rounded-full bg-[#d8efe2] text-[10px] text-[#49775a]">&#10003;</span>
  );
}

function Cell({ value, dark = false }: { value: string | boolean; dark?: boolean }) {
  if (typeof value === "string") {
    return <span className={`text-xs font-semibold sm:text-sm ${dark ? "text-white" : "text-[#17211e]"}`}>{value}</span>;
  }

  return value ? <Check /> : <span className={`text-sm ${dark ? "text-white/30" : "text-[#c2c5bd]"}`}>&mdash;</span>;
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ea] font-sans text-[#17211e] selection:bg-[#d9ff57] selection:text-[#17211e]">
      <PageAnimations />
      <SiteHeader current="pricing" />

      <section className="mx-auto max-w-[1240px] px-5 pb-8 pt-16 text-center sm:px-8 sm:pb-12 sm:pt-24" data-animate-hero>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#66726d]">Pricing</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-[clamp(3.2rem,7.6vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em]">
          Fair pricing for fair weeks.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-[#5e6965] sm:text-lg">
          Start free, then pay only when your roster grows. Every plan includes the checks that keep a week covered.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#dcdcd2] bg-white/70 px-4 py-2 text-xs font-semibold text-[#5a6662]">
          <span className="rounded-full bg-[#d9ff57] px-2.5 py-1 text-[#17211e]">Annual</span>
          <span>Save two months on every paid plan</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-24" data-scroll-stagger>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={`relative flex flex-col rounded-[26px] border p-6 shadow-[0_20px_60px_rgba(39,48,44,0.08)] sm:p-8 ${plan.tone} ${plan.ring}`}
              key={plan.name}
              data-scroll-item
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-[#d9ff57] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#17211e]">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{plan.name}</h2>
              <p className={`mt-1 text-sm leading-6 ${plan.popular ? "text-white/65" : "text-[#68736f]"}`}>{plan.copy}</p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.06em]">{plan.price}</span>
                <span className={`pb-1.5 text-xs font-medium ${plan.popular ? "text-white/55" : "text-[#8a928e]"}`}>{plan.cadence}</span>
              </div>

              <Link
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform ${plan.ctaTone}`}
                href="/signup"
              >
                {plan.cta} <Arrow />
              </Link>

              <ul className={`mt-7 space-y-3 border-t pt-6 text-sm ${plan.popular ? "border-white/15" : "border-[#e6e7e0]"}`}>
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-2.5" key={feature}>
                    <Check />
                    <span className={plan.popular ? "text-white/80" : "text-[#4f5b57]"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" data-scroll-reveal>
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#68736f]">Compare plans</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Everything, side by side.</h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-[24px] border border-[#e1e2dc]">
            <div className="grid grid-cols-4 bg-[#f7f6f0] text-left">
              <div className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a928e] sm:px-6">Feature</div>
              {plans.map((plan) => (
                <div className={`px-4 py-4 text-xs font-bold sm:px-6 sm:text-sm ${plan.popular ? "bg-[#17211e] text-white" : ""}`} key={plan.name}>
                  {plan.name}
                </div>
              ))}
            </div>
            {comparison.map((row, index) => (
              <div className={`grid grid-cols-4 items-center border-t border-[#ecece6] ${index % 2 === 1 ? "bg-[#fbfbf8]" : "bg-white"}`} key={row.feature}>
                <div className="px-4 py-4 text-xs font-semibold sm:px-6 sm:text-sm">{row.feature}</div>
                <div className="px-4 py-4 sm:px-6">
                  <Cell value={row.starter} />
                </div>
                <div className="bg-[#17211e] px-4 py-4 sm:px-6">
                  <Cell value={row.team} dark />
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <Cell value={row.business} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17211e] py-20 text-white sm:py-28" data-scroll-reveal>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d9ff57]">Questions</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Before you get started.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/65">Still unsure which plan fits? Start on Starter and move up the moment your team does.</p>
          </div>
          <div className="border-t border-white/15" data-scroll-stagger>
            {faqs.map((faq) => (
              <div className="border-b border-white/15 py-6 sm:py-8" key={faq.question} data-scroll-item>
                <h3 className="text-lg font-semibold sm:text-xl">{faq.question}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d9ff57] px-5 py-16 text-center sm:px-8 sm:py-20" data-scroll-reveal>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-none tracking-[-0.055em] sm:text-6xl">Try every check free for 14 days.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#506038] sm:text-base">No credit card, no lock-in. Keep the Starter plan for as long as you like.</p>
        <Link className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17211e] px-6 py-3.5 text-sm font-semibold text-white" href="/signup">
          Start for free <Arrow />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
