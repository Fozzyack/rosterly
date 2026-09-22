import Link from "next/link";
import { LogoMark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8d7cd] bg-[#f5f3ea]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Rosterly home">
          <LogoMark small />
          <span className="font-semibold tracking-[-0.03em]">rosterly</span>
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#68736f]">
          <Link className="hover:text-[#17211e]" href="/product">Product</Link>
          <Link className="hover:text-[#17211e]" href="/how-it-works">How it works</Link>
          <Link className="hover:text-[#17211e]" href="/pricing">Pricing</Link>
          <Link className="hover:text-[#17211e]" href="/resources">Resources</Link>
          <Link className="hover:text-[#17211e]" href="/login">Log in</Link>
        </div>
        <p className="text-xs text-[#89918e]">Built for small teams with big weeks.</p>
      </div>
    </footer>
  );
}
