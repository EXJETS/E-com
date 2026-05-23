import Link from "next/link";
import { Gem, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { collections } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";

const trustItems = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: RotateCcw, title: "30-Day Returns", desc: "Hassle-free policy" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: Star, title: "4.8 / 5 Rated", desc: "200,000+ customers" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.84 4.84 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.84 0 3.08-2.37 3.08-5.17 0-2.14-1.44-3.63-3.5-3.63-2.39 0-3.78 1.79-3.78 3.64 0 .72.28 1.49.62 1.91.07.08.08.15.06.24l-.23.95c-.04.15-.13.18-.29.11-1.08-.5-1.76-2.09-1.76-3.37 0-2.74 2-5.26 5.76-5.26 3.02 0 5.37 2.15 5.37 5.03 0 3-1.89 5.41-4.51 5.41-.88 0-1.71-.46-1.99-1l-.54 2.03c-.2.75-.73 1.69-1.08 2.27.81.25 1.67.39 2.55.39 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      {/* Trust bar */}
      <div className="border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200 leading-tight">{title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Gem className="w-4 h-4 text-rose-400" />
            <span className="text-base font-bold text-stone-100 tracking-tight">
              Glow<span className="text-rose-400">Cart</span>
            </span>
          </Link>
          <p className="text-sm text-stone-500 leading-relaxed">
            Premium beauty devices and hygiene care packages. Clinic-quality results delivered to your door.
          </p>
          <div className="flex gap-3 mt-6">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center text-stone-400 hover:bg-rose-500 hover:text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-xs font-semibold text-stone-300 mb-5 uppercase tracking-widest">Collections</h4>
          <ul className="space-y-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collections/${c.id}`}
                  className="text-sm text-stone-500 hover:text-rose-400 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs font-semibold text-stone-300 mb-5 uppercase tracking-widest">Support</h4>
          <ul className="space-y-3">
            {["FAQ", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-stone-500 hover:text-rose-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-semibold text-stone-300 mb-5 uppercase tracking-widest">Join the Glow</h4>
          <p className="text-sm text-stone-500 mb-4 leading-relaxed">
            Exclusive deals and expert skincare tips, straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-stone-800/60 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <span>&copy; 2025 GlowCart. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
