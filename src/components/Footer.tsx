import Link from "next/link";
import { Gem, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { collections } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";

const trust = [
  { icon: Truck,       title: "Free Shipping",    desc: "On orders over $50" },
  { icon: RotateCcw,   title: "30-Day Returns",    desc: "Hassle-free guarantee" },
  { icon: ShieldCheck, title: "Secure Checkout",   desc: "256-bit SSL" },
  { icon: Star,        title: "4.8 / 5 Rated",    desc: "200,000+ customers" },
];

const social = [
  {
    label: "Instagram",
    href: "#",
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
  },
  {
    label: "TikTok",
    href: "#",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.84 4.84 0 01-1.01-.07z"/></svg>,
  },
  {
    label: "Pinterest",
    href: "#",
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.84 0 3.08-2.37 3.08-5.17 0-2.14-1.44-3.63-3.5-3.63-2.39 0-3.78 1.79-3.78 3.64 0 .72.28 1.49.62 1.91.07.08.08.15.06.24l-.23.95c-.04.15-.13.18-.29.11-1.08-.5-1.76-2.09-1.76-3.37 0-2.74 2-5.26 5.76-5.26 3.02 0 5.37 2.15 5.37 5.03 0 3-1.89 5.41-4.51 5.41-.88 0-1.71-.46-1.99-1l-.54 2.03c-.2.75-.73 1.69-1.08 2.27.81.25 1.67.39 2.55.39 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-stone-400">

      {/* Trust bar */}
      <div className="border-b border-stone-800/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trust.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-300">
                <Icon className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">{title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
            <Gem className="w-4 h-4 text-rose-400" />
            <span className="font-display text-lg font-semibold italic text-stone-100">
              Glow<span className="text-rose-400 not-italic">Cart</span>
            </span>
          </Link>
          <p className="text-sm text-stone-500 leading-relaxed max-w-[220px]">
            Premium beauty devices and hygiene care packages for real, visible results.
          </p>
          <div className="flex gap-2.5 mt-6">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 bg-stone-800 rounded-full flex items-center justify-center text-stone-400 hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="footer-heading">Collections</h4>
          <ul className="space-y-2.5">
            {collections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.id}`} className="footer-link">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="footer-heading">Support</h4>
          <ul className="space-y-2.5">
            {["FAQ", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="footer-link">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="footer-heading">Stay in the Glow</h4>
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">
            Exclusive deals, skincare tips, and new arrivals — straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800/70 py-5 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <span>&copy; 2025 GlowCart. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
              <a key={l} href="#" className="hover:text-stone-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
