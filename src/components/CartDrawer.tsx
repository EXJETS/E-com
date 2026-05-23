"use client";

import { useCart } from "@/lib/cart";
import { X, ShoppingBag, Trash2, Plus, Minus, Package, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const freeShippingProgress = Math.min((totalPrice / 50) * 100, 100);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <span className="font-semibold text-stone-900 tracking-wide">Your Bag ({totalItems})</span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
            {shipping === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide">You qualify for free shipping</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-stone-500 mb-1.5">
                  Add <span className="font-semibold text-stone-700">${(50 - totalPrice).toFixed(2)}</span> more for free shipping
                </p>
                <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-rose-300" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 tracking-wide">Your bag is empty</p>
                <p className="text-sm text-stone-400 mt-1">Add some glow-up essentials</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 text-sm text-rose-500 underline underline-offset-2 hover:text-rose-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-18 h-18 w-[72px] h-[72px] rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-rose-500 font-semibold mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 border border-stone-200 rounded-lg flex items-center justify-center hover:border-rose-400 hover:bg-rose-50 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-stone-500" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-stone-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 border border-stone-200 rounded-lg flex items-center justify-center hover:border-rose-400 hover:bg-rose-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-stone-500" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-stone-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-stone-500 tracking-wide">Subtotal</span>
              <span className="font-bold text-stone-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-stone-500 tracking-wide">Shipping</span>
              <span className={`text-sm font-medium ${shipping === 0 ? "text-emerald-600" : "text-stone-700"}`}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors tracking-wide"
            >
              <Package className="w-4 h-4" />
              Proceed to Checkout &mdash; ${(totalPrice + shipping).toFixed(2)}
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-stone-400 hover:text-stone-600 mt-3 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
