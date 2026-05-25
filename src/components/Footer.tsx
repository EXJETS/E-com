import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Cpu } from "lucide-react";
import { collections } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";

const trust = [
  { icon: Truck,       title: "Free Shipping",     desc: "On orders over $75" },
  { icon: RotateCcw,   title: "30-Day Returns",     desc: "Hassle-free guarantee" },
  { icon: ShieldCheck, title: "Secure Checkout",    desc: "256-bit SSL encryption" },
  { icon: Cpu,         title: "Matter Certified",   desc: "Works with all ecosystems" },
];

const social = [
  {
    label: "X",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] text-white">

      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trust.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--accent)] transition-colors duration-300">
                <Icon className="w-4 h-4 text-white/60 group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-white/40 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="text-lg font-bold text-white mb-5 block">
            NexHome
          </Link>
          <p className="text-sm text-white/40 leading-relaxed max-w-[220px]">
            Premium smart home devices for the future of connected living.
          </p>
          <div className="flex gap-2.5 mt-6">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/50 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="footer-heading">Products</h4>
          <ul className="space-y-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.id}`} className="footer-link">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="footer-heading">Support</h4>
          <ul className="space-y-3">
            {["FAQ", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Contact Us", "Community Forum"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="footer-link">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="footer-heading">Stay Updated</h4>
          <p className="text-sm text-white/40 mb-4 leading-relaxed">
            New releases, smart home tips, and exclusive deals straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>&copy; 2026 NexHome. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
              <a key={l} href="#" className="hover:text-white/60 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
