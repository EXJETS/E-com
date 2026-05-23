"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["LED Mask", "Microcurrent", "Water Flosser", "Gua Sha", "Hair Dryer", "Nail Drill"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim().length > 0
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }).slice(0, 6)
    : [];

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--charcoal)]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white shadow-2xl max-w-2xl mx-auto mt-0 sm:mt-16 sm:rounded-2xl overflow-hidden">
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm text-[var(--charcoal)] placeholder:text-[var(--muted)] outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--sand)] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--sand)] transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--sand)] flex-shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--charcoal)] line-clamp-1">{p.name}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{p.category}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-[var(--accent)]">${p.price.toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.length > 1 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[var(--muted)]">No products found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--body)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
