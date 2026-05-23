"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
        <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        You&apos;re on the list!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        placeholder="your@email.com"
        className="bg-stone-800/80 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:border-rose-400/70 placeholder:text-stone-600 transition-colors"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold py-2.5 px-5 rounded-full transition-colors tracking-[0.08em] uppercase"
      >
        Subscribe <ArrowRight className="w-3 h-3" />
      </button>
    </form>
  );
}
