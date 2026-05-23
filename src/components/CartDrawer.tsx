"use client";

import { useCart } from "@/lib/cart";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const progressPct = Math.min((totalPrice / 50) * 100, 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--charcoal)]/50 z-50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[var(--cream)] z-50 flex flex-col shadow-2xl border-l border-[var(--border)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 w-[18px] h-[18px] text-[var(--accent)]" />
            <span className="font-semibold text-[var(--charcoal)] text-sm tracking-wide">
              Your Bag {totalItems > 0 && <span className="text-[var(--muted)]">({totalItems})</span>}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--sand)] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shipping progress */}
        {totalItems > 0 && (
          <div className="px-6 py-3.5 bg-[var(--sand)] border-b border-[var(--border)]">
            {shipping === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs font-semibold">You qualify for free shipping</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--body)] mb-2">
                  Add <span className="font-semibold text-[var(--charcoal)]">${(50 - totalPrice).toFixed(2)}</span> more for free shipping
                </p>
                <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--sand)] flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-[var(--border-dark)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--charcoal)]">Your bag is empty</p>
                <p className="text-sm text-[var(--muted)] mt-1">Add some glow-up essentials to get started.</p>
              </div>
              <button
                onClick={closeCart}
                className="text-sm text-[var(--accent)] underline underline-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="px-6 py-5 flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <Link href={`/products/${item.product.slug}`} onClick={closeCart}
                    className="relative w-[76px] h-[76px] rounded-xl overflow-hidden bg-[var(--sand)] flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="76px"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                      <p className="text-sm font-medium text-[var(--charcoal)] line-clamp-2 leading-snug hover:text-[var(--accent)] transition-colors">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-sm font-bold text-[var(--accent)] mt-1">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Qty + remove */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sand)] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-semibold text-[var(--charcoal)] border-x border-[var(--border)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="w-8 h-7 flex items-center justify-center hover:bg-[var(--sand)] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="px-6 py-5 border-t border-[var(--border)] bg-white">
            <div className="flex justify-between text-sm text-[var(--body)] mb-1.5">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--charcoal)]">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mb-5">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white rounded-full py-3.5 text-sm font-semibold tracking-wide transition-all duration-300"
            >
              Checkout &mdash; ${(totalPrice + shipping).toFixed(2)}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-xs text-[var(--muted)] hover:text-[var(--body)] mt-3 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
