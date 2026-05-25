"use client";

import { ShoppingBag, CheckCircle } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [state, setState] = useState<"idle" | "added">("idle");

  const handleAdd = () => {
    if (state === "added") return;
    addItem(product);
    setState("added");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
        state === "added"
          ? "bg-emerald-600 text-white"
          : "bg-[var(--dark)] hover:bg-[var(--accent)] text-white"
      }`}
    >
      {state === "added" ? (
        <><CheckCircle className="w-5 h-5" /> Added to Bag</>
      ) : (
        <><ShoppingBag className="w-5 h-5" /> Add to Bag</>
      )}
    </button>
  );
}
