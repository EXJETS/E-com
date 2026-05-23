"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, CheckCircle, Plus, Minus } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "added">("idle");
  const [sticky, setSticky] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAdd = (quantity: number = qty) => {
    if (state === "added") return;
    addItem(product, quantity);
    setState("added");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <>
      {/* Quantity + Add to Bag */}
      <div ref={buttonRef} className="flex flex-col gap-4">
        {/* Quantity stepper */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Quantity</span>
            <span className="text-xs text-emerald-600 font-medium">In Stock</span>
          </div>
          <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-[var(--sand)] text-[var(--body)] hover:text-[var(--charcoal)] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[var(--charcoal)] border-x border-[var(--border)]">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-[var(--sand)] text-[var(--body)] hover:text-[var(--charcoal)] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Add to Bag button */}
        <button
          onClick={() => handleAdd(qty)}
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
            state === "added"
              ? "bg-emerald-600 text-white"
              : "bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white"
          }`}
        >
          {state === "added" ? (
            <>
              <CheckCircle className="w-5 h-5" /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" /> Add to Bag &mdash; ${(product.price * qty).toFixed(2)}
            </>
          )}
        </button>
      </div>

      {/* Sticky bottom CTA bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[var(--border)] shadow-2xl transition-transform duration-300 ${
          sticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-4">
          {/* Product image */}
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--sand)] flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--charcoal)] truncate">{product.name}</p>
            <p className="text-xs text-[var(--accent)] font-bold">${product.price.toFixed(2)}</p>
          </div>

          {/* Add to Bag pill */}
          <button
            onClick={() => handleAdd(qty)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
              state === "added"
                ? "bg-emerald-600 text-white"
                : "bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white"
            }`}
          >
            {state === "added" ? (
              <>
                <CheckCircle className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
