"use client";

import { useCart } from "@/lib/cart";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            <span className="font-semibold text-gray-900">Your Cart ({totalItems})</span>
          </div>
          <button onClick={closeCart} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-pink-300" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Add some glowing products!</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 text-sm text-pink-500 underline underline-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 py-3 border-b border-gray-50">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-pink-600 font-semibold mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:border-pink-400 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:border-pink-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-gray-400 hover:text-red-400 transition-colors"
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
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            {totalPrice < 50 && (
              <p className="text-xs text-gray-500 mb-3">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
            {totalPrice >= 50 && (
              <p className="text-xs text-green-600 font-medium mb-3">🎉 You qualify for free shipping!</p>
            )}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center py-3 rounded-xl font-semibold transition-colors text-sm"
            >
              Checkout · ${totalPrice.toFixed(2)}
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm text-gray-500 mt-2 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
