"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-2xl border border-stone-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-stone-50 aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discount}%
        </span>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-stone-200 fill-stone-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-stone-400">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-stone-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-stone-400 line-through">${product.originalPrice.toFixed(2)}</span>
        </div>

        <p className="text-xs text-stone-400 mt-0.5">{product.sold.toLocaleString()}+ sold</p>

        {/* CTA */}
        <button
          onClick={() => addItem(product)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 tracking-wide"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
