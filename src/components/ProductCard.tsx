"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 1400);
  };

  return (
    <div className="group flex flex-col">
      {/* ── Image ── */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-[var(--sand)] aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Hover overlay with quick-add */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)]/60 via-transparent to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
        <button
          onClick={handleAdd}
          className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 py-4 text-white text-xs font-semibold tracking-[0.12em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {adding ? "Added" : "Quick Add"}
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-[var(--charcoal)] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-stone-400"}`}
          />
        </button>
      </Link>

      {/* ── Details ── */}
      <div className="mt-3.5 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] font-medium">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-[var(--charcoal)] line-clamp-1 hover:text-[var(--accent)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-0.5">
          {/* Stars */}
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-[var(--muted)]">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[var(--charcoal)]">${product.price.toFixed(2)}</span>
            <span className="text-xs text-[var(--muted)] line-through">${product.originalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
