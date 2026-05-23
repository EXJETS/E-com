"use client";

export const dynamic = "force-dynamic";

import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard, CheckCircle, ShoppingBag, Package, ChevronDown } from "lucide-react";
import { useState } from "react";

const FIELD = "w-full bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";
const LABEL = "block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] mb-2";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax      = +(totalPrice * 0.08).toFixed(2);
  const total    = +(totalPrice + shipping + tax).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  /* ── Confirmed state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center max-w-md px-8 animate-fade-up">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl italic font-semibold text-[var(--charcoal)]">
            Order Confirmed
          </h1>
          <p className="text-[var(--body)] mt-3 leading-relaxed text-sm">
            Thank you for your order. A confirmation email with tracking details will be with you shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white px-8 py-3.5 rounded-full font-medium text-sm mt-8 transition-all duration-300 tracking-wide"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── Empty bag ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-16 h-16 bg-[var(--sand)] rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-[var(--border-dark)]" />
          </div>
          <p className="text-[var(--body)] text-base font-medium">Your bag is empty</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--charcoal)] text-white px-7 py-3.5 rounded-full text-sm font-medium mt-5 hover:bg-[var(--accent)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sand)]">
      {/* Progress bar */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <div className="h-3 w-px bg-[var(--border)] mx-2" />
          {["Bag", "Information", "Payment"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && <ChevronDown className="w-3 h-3 -rotate-90 text-[var(--border-dark)]" />}
              <span className={`text-xs font-semibold tracking-wide ${i === 1 ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Mobile order summary toggle */}
            <div className="lg:hidden bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[var(--charcoal)]"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                  Order Summary ({items.length} items)
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent)]">${total.toFixed(2)}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
              {summaryOpen && <MobileOrderItems items={items} totalPrice={totalPrice} shipping={shipping} tax={tax} total={total} />}
            </div>

            {/* Contact */}
            <FormSection title="Contact Information">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", type: "text", placeholder: "Jane" },
                  { label: "Last Name",  type: "text", placeholder: "Doe" },
                  { label: "Email Address", type: "email", placeholder: "jane@example.com" },
                  { label: "Phone Number", type: "tel",  placeholder: "+1 (555) 000-0000" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className={LABEL}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required className={FIELD} />
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Shipping */}
            <FormSection title="Shipping Address">
              <div>
                <label className={LABEL}>Street Address</label>
                <input type="text" placeholder="123 Main Street, Apt 4B" required className={FIELD} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {[
                  { label: "City",     placeholder: "New York" },
                  { label: "State",    placeholder: "NY" },
                  { label: "ZIP Code", placeholder: "10001" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className={LABEL}>{f.label}</label>
                    <input type="text" placeholder={f.placeholder} required className={FIELD} />
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Payment */}
            <FormSection title="Payment Details" icon={<CreditCard className="w-4 h-4 text-[var(--accent)]" />}>
              <div>
                <label className={LABEL}>Card Number</label>
                <input type="text" placeholder="1234  5678  9012  3456" required maxLength={19} className={FIELD} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={LABEL}>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" required className={FIELD} />
                </div>
                <div>
                  <label className={LABEL}>CVV</label>
                  <input type="text" placeholder="•••" required maxLength={4} className={FIELD} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-[var(--muted)]">
                <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                Your payment info is encrypted with 256-bit SSL
              </div>
            </FormSection>

            {/* Promo */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. GLOW15)"
                className={`${FIELD} flex-1`}
              />
              <button type="button" className="px-5 py-3 bg-[var(--charcoal)] text-white text-xs font-semibold rounded-xl hover:bg-[var(--accent)] transition-colors tracking-wide">
                Apply
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-4 rounded-full font-semibold text-sm transition-all duration-300 tracking-wide shadow-lg shadow-rose-900/10"
            >
              <Lock className="w-4 h-4" />
              Place Order &mdash; ${total.toFixed(2)}
            </button>

            <p className="text-center text-xs text-[var(--muted)]">
              By placing your order you agree to our{" "}
              <a href="#" className="underline hover:text-[var(--accent)]">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-[var(--accent)]">Privacy Policy</a>.
            </p>
          </form>

          {/* ── Desktop Order Summary ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                  <h2 className="text-sm font-bold text-[var(--charcoal)] tracking-wide">Order Summary</h2>
                </div>
                <MobileOrderItems items={items} totalPrice={totalPrice} shipping={shipping} tax={tax} total={total} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function FormSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 sm:p-7">
      <h2 className="text-sm font-bold text-[var(--charcoal)] mb-6 flex items-center gap-2 tracking-wide">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function MobileOrderItems({ items, totalPrice, shipping, tax, total }: {
  items: { product: { id: string; name: string; image: string; price: number; slug: string }; quantity: number }[];
  totalPrice: number; shipping: number; tax: number; total: number;
}) {
  return (
    <div className="px-6 py-5">
      <div className="space-y-5 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--sand)] flex-shrink-0">
              <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
              <span className="absolute -top-1.5 -right-1.5 w-4.5 w-[18px] h-[18px] bg-[var(--accent)] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {item.quantity}
              </span>
            </div>
            <p className="text-xs font-medium text-[var(--charcoal)] flex-1 line-clamp-2 leading-snug">{item.product.name}</p>
            <p className="text-sm font-bold text-[var(--charcoal)] flex-shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] mt-5 pt-4 space-y-2">
        {[
          { label: "Subtotal",    value: `$${totalPrice.toFixed(2)}`,     cls: "" },
          { label: "Shipping",    value: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`, cls: shipping === 0 ? "text-emerald-600 font-medium" : "" },
          { label: "Tax (8%)",    value: `$${tax.toFixed(2)}`,             cls: "" },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-xs text-[var(--body)]">
            <span>{r.label}</span>
            <span className={r.cls}>{r.value}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-[var(--charcoal)] pt-3 border-t border-[var(--border)] text-sm">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
