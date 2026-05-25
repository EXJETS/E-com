"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { useState } from "react";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  const wishlisted = products.filter((p) => items.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--dark)]">Wishlist</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {wishlisted.length} item{wishlisted.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {wishlisted.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] py-20 flex flex-col items-center gap-5 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center">
            <Heart className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--dark)]">Nothing saved yet</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Browse our products and heart the ones you love.
            </p>
          </div>
          <Link
            href="/"
            className="bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlisted.map((product) => {
            const savePct = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );
            return (
              <WishlistCard
                key={product.id}
                product={product}
                savePct={savePct}
                onAddToCart={() => addItem(product)}
                onRemove={() => toggle(product.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function WishlistCard({
  product,
  savePct,
  onAddToCart,
  onRemove,
}: {
  product: ReturnType<typeof products.find> & object;
  savePct: number;
  onAddToCart: () => void;
  onRemove: () => void;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    onAddToCart();
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  };

  if (!product) return null;

  return (
    <div className="group bg-white rounded-xl border border-[var(--border)] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[var(--light)] aspect-[4/3]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-[var(--dark)] text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm tracking-wider">
              {product.badge}
            </span>
          </div>
        )}
        {/* Remove from wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
          aria-label="Remove from wishlist"
        >
          <Heart className="w-4 h-4 fill-rose-500" />
        </button>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          {product.category}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--dark)] hover:text-[var(--accent)] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
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

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--dark)]">${product.price.toFixed(2)}</span>
          <span className="text-xs text-[var(--muted)] line-through">${product.originalPrice.toFixed(2)}</span>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
            -{savePct}%
          </span>
        </div>

        {/* Shipping */}
        <div className={`flex items-center gap-1 ${product.shipsFrom === "US" ? "text-emerald-600" : "text-[var(--muted)]"}`}>
          <Truck className="w-3 h-3 flex-shrink-0" />
          <span className="text-[10px] font-medium">Ships in {product.deliveryDays} days</span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className="mt-auto flex items-center justify-center gap-2 w-full bg-[var(--dark)] text-white rounded py-2.5 text-xs font-medium hover:bg-[var(--accent)] transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {adding ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
