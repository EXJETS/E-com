"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Truck, Heart } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 1400);
  };

  const savePct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group flex flex-col">
      {/* ── Image ──────────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-lg bg-[var(--light)] aspect-[4/3]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-[var(--dark)] text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-wider">
              {product.badge}
            </span>
          )}
          {product.shipsFrom === "US" && (
            <span className="bg-white text-[var(--text)] text-[9px] font-semibold px-2 py-0.5 rounded-sm border border-[var(--border)] tracking-wide">
              US Stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          />
        </button>

        {/* Quick-add hover overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--dark)]/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-end justify-center pb-4">
          <button
            onClick={handleAdd}
            className="text-white text-xs font-semibold tracking-[0.14em] uppercase px-5 py-2 border border-white/40 rounded-sm bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            {adding ? "Added ✓" : "Quick Add"}
          </button>
        </div>
      </Link>

      {/* ── Details ────────────────────────────────────────────────── */}
      <div className="mt-4 text-center flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          {product.category}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[15px] font-semibold text-[var(--dark)] hover:text-[var(--accent)] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-center gap-1.5">
          <div className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-[var(--border)] text-[var(--border)]"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[var(--muted)]">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-[var(--dark)]">${product.price.toFixed(2)}</span>
          <span className="text-xs text-[var(--muted)] line-through">${product.originalPrice.toFixed(2)}</span>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
            -{savePct}%
          </span>
        </div>

        <div className={`flex items-center justify-center gap-1 ${
          product.shipsFrom === "US" ? "text-emerald-600" : "text-[var(--muted)]"
        }`}>
          <Truck className="w-3 h-3 flex-shrink-0" />
          <span className="text-[10px] font-medium">Ships in {product.deliveryDays} days</span>
        </div>

        {/* Tesla-style CTA links */}
        <div className="flex items-center justify-center gap-3 mt-1">
          <button
            onClick={(e) => { e.preventDefault(); if (!adding) { addItem(product); setAdding(true); setTimeout(() => setAdding(false), 1400); } }}
            className="text-xs text-[var(--dark)] underline underline-offset-2 hover:text-[var(--accent)] transition-colors font-medium"
          >
            {adding ? "Added ✓" : "Order"}
          </button>
          <span className="text-[var(--border)]">·</span>
          <Link href={`/products/${product.slug}`}
            className="text-xs text-[var(--dark)] underline underline-offset-2 hover:text-[var(--accent)] transition-colors font-medium">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
