"use client";

import { ShoppingBag, CheckCircle } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 tracking-wide ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-stone-900 hover:bg-rose-500 text-white"
      }`}
    >
      {added ? (
        <>
          <CheckCircle className="w-5 h-5" />
          Added to Bag
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Add to Bag
        </>
      )}
    </button>
  );
}
