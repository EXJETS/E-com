"use client";

export const dynamic = "force-dynamic";

import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard, CheckCircle, ShoppingBag, Package } from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Order Confirmed</h1>
          <p className="text-stone-500 mt-3 leading-relaxed">
            Thank you for your order. You&apos;ll receive a confirmation email shortly with your tracking details.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-rose-500 text-white px-7 py-3.5 rounded-xl font-semibold mt-7 transition-all duration-200 tracking-wide text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-stone-400" />
          </div>
          <p className="text-stone-500 text-lg">Your bag is empty.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-7 py-3.5 rounded-xl font-semibold mt-5 hover:bg-rose-500 transition-all duration-200 tracking-wide text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-rose-400 transition-colors placeholder:text-stone-400";

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shopping
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100">
              <h2 className="text-base font-bold text-stone-900 mb-6 tracking-wide">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", type: "text", placeholder: "Jane" },
                  { label: "Last Name", type: "text", placeholder: "Doe" },
                  { label: "Email Address", type: "email", placeholder: "jane@example.com" },
                  { label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                      {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder} required className={inputClass} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100">
              <h2 className="text-base font-bold text-stone-900 mb-6 tracking-wide">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                    Street Address
                  </label>
                  <input type="text" placeholder="123 Main Street" required className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "City", placeholder: "New York" },
                    { label: "State", placeholder: "NY" },
                    { label: "ZIP Code", placeholder: "10001" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                        {f.label}
                      </label>
                      <input type="text" placeholder={f.placeholder} required className={inputClass} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100">
              <h2 className="text-base font-bold text-stone-900 mb-6 flex items-center gap-2.5 tracking-wide">
                <CreditCard className="w-4 h-4 text-rose-500" />
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                    Card Number
                  </label>
                  <input type="text" placeholder="1234 5678 9012 3456" required maxLength={19} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                      Expiry Date
                    </label>
                    <input type="text" placeholder="MM / YY" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-widest">
                      CVV
                    </label>
                    <input type="text" placeholder="123" required maxLength={4} className={inputClass} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5 text-xs text-stone-400">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                Your payment information is encrypted and secure
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-rose-500 text-white py-4 rounded-2xl font-semibold text-sm transition-all duration-200 tracking-wide flex items-center justify-center gap-2.5"
            >
              <Lock className="w-4 h-4" />
              Place Order &mdash; ${total.toFixed(2)}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="text-base font-bold text-stone-900 mb-5 tracking-wide flex items-center gap-2">
                <Package className="w-4 h-4 text-rose-500" />
                Order Summary
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 line-clamp-2">{item.product.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-3 border-t border-stone-100 text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-widest">Promo Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GLOW15"
                  className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-colors placeholder:text-stone-400"
                />
                <button className="bg-stone-900 hover:bg-stone-700 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition-colors tracking-wide">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
