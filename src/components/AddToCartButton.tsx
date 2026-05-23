"use client";

import { ShoppingCart } from "lucide-react";
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
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-md ${
        added
          ? "bg-green-500 text-white shadow-green-200"
          : "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200"
      }`}
    >
      <ShoppingCart className="w-5 h-5" />
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
