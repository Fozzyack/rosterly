import Link from "next/link";

type SiteHeaderProps = {
  current?: "product" | "how-it-works";
  inverse?: boolean;
};

export function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-[#d9ff57] text-[#17211e] ${small ? "size-7" : "size-9"}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className={small ? "size-4" : "size-5"}>
        <path d="M7 7.5h10M7 12h6M7 16.5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m15.5 10.5 1.5 1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function SiteHeader({ current, inverse = false }: SiteHeaderProps) {
  const text = inverse ? "text-white" : "text-[#17211e]";
  const muted = inverse ? "text-white/70 hover:text-white" : "text-[#43504c] hover:text-[#17211e]";

  return (
    <header className={text}>
      <nav className="mx-auto flex h-20 w-full max-w-[1240px] items-center justify-between px-5 sm:px-8" aria-label="Main navigation" data-animate-nav>
        <Link href="/" className="flex items-center gap-2.5" aria-label="Rosterly home">
          <LogoMark />
          <span className="text-xl font-semibold tracking-[-0.04em]">rosterly</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link className={`transition-colors ${current === "product" ? text : muted}`} href="/product">Product</Link>
          <Link className={`transition-colors ${current === "how-it-works" ? text : muted}`} href="/how-it-works">How it works</Link>
          <Link className={`transition-colors ${muted}`} href="/#pricing">Pricing</Link>
          <Link className={`transition-colors ${muted}`} href="/#resources">Resources</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link className="hidden px-3 py-2 text-sm font-semibold sm:block" href="/login">Log in</Link>
          <Link
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${inverse ? "bg-[#d9ff57] text-[#17211e]" : "bg-[#17211e] text-white"}`}
            href="/signup"
          >
            Start for free
          </Link>
        </div>
      </nav>
    </header>
  );
}
