import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Exjet — Private Jet Charter, Quoted in Seconds",
  description:
    "Search live availability across the Avinode marketplace and get operator-backed charter quotes for any route, any aircraft category.",
  keywords:
    "private jet charter, air charter, empty legs, Avinode, business aviation, jet hire",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <header className="sticky top-0 z-40 border-b border-[var(--jet-line-soft)] bg-[rgba(8,13,22,0.82)] backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="jet-heading text-xl tracking-[0.02em] text-[var(--jet-text)]">
                Exjet
              </span>
              <span className="jet-eyebrow hidden sm:inline">Private Aviation</span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {[
                ["Fleet", "#fleet"],
                ["How it works", "#process"],
                ["Network", "#network"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="text-[13px] text-[var(--jet-muted)] transition-colors hover:text-[var(--jet-text)]"
                >
                  {label}
                </a>
              ))}
            </nav>

            <a href="#search" className="jet-cta px-4 py-2 text-[13px] sm:px-5">
              Request a quote
            </a>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--jet-line-soft)] bg-[var(--jet-ink)]">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="jet-heading text-lg">Exjet</p>
                <p className="mt-1 text-[13px] text-[var(--jet-dim)]">
                  Charter brokerage powered by the Avinode marketplace.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--jet-muted)]">
                <a href="tel:+3222345678" className="hover:text-[var(--jet-text)]">
                  +32 2 234 5678
                </a>
                <a href="mailto:charter@exjet.com" className="hover:text-[var(--jet-text)]">
                  charter@exjet.com
                </a>
              </div>
            </div>
            <div className="jet-rule my-7" />
            <p className="text-[11px] leading-relaxed text-[var(--jet-dim)]">
              Exjet arranges charter flights as an agent for its customers; all flights are
              operated by third-party air carriers holding the appropriate certification.
              Availability and pricing shown are indicative until confirmed by the operator.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
