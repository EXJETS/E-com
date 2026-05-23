"use client";

import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className="bg-stone-800 border border-stone-700 text-stone-200 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-rose-400 placeholder:text-stone-600 transition-colors"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm py-2.5 px-4 rounded-xl font-semibold transition-colors tracking-wide"
      >
        Subscribe <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
