import Link from "next/link";
import { Sparkles } from "lucide-react";
import { collections } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Trust bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
            { icon: "↩️", title: "30-Day Returns", desc: "Hassle-free policy" },
            { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption" },
            { icon: "⭐", title: "4.8★ Rated", desc: "200,000+ happy customers" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-lg font-bold text-white">
              Glow<span className="text-pink-400">Cart</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Premium beauty devices and hygiene care packages. Clinic-quality results at home.
          </p>
          <div className="flex gap-3 mt-5">
            {["IG", "TW", "FB"].map((label, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors text-xs font-bold text-gray-300"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Collections</h4>
          <ul className="space-y-2">
            {collections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.id}`} className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Help</h4>
          <ul className="space-y-2">
            {["FAQ", "Shipping Info", "Returns & Exchanges", "Track Your Order", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Join the Glow</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe for exclusive deals and skincare tips.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 px-6 text-center text-xs text-gray-600">
        © 2025 GlowCart. All rights reserved. &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Terms of Service
      </div>
    </footer>
  );
}
