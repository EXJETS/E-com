"use client";
export const dynamic = "force-dynamic";

import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Lock, CreditCard, CheckCircle, ShoppingBag,
  Package, ChevronDown, MapPin, User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FIELD =
  "w-full bg-white border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--dark)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";
const LABEL =
  "block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] mb-2";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, saveOrder, getAddresses } = useAuth();
  const [submitted,       setSubmitted]       = useState(false);
  const [confirmedOrder,  setConfirmedOrder]  = useState<{ id: string; tracking?: string } | null>(null);
  const [summaryOpen,     setSummaryOpen]     = useState(false);
  const [selectedAddrId,  setSelectedAddrId]  = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const addresses    = user ? getAddresses() : [];
  const defaultAddr  = addresses.find((a) => a.isDefault) ?? addresses[0];
  const selectedAddr = addresses.find((a) => a.id === selectedAddrId) ?? defaultAddr;

  /* Pre-select default address */
  useEffect(() => {
    if (defaultAddr) setSelectedAddrId(defaultAddr.id);
  }, [defaultAddr?.id]);

  const shipping = totalPrice >= 75 ? 0 : 9.99;
  const tax      = +(totalPrice * 0.08).toFixed(2);
  const total    = +(totalPrice + shipping + tax).toFixed(2);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);

    const shippingAddress = selectedAddr
      ? selectedAddr
      : {
          id:        "checkout-temp",
          isDefault: false,
          firstName: fd.get("firstName") as string,
          lastName:  fd.get("lastName") as string,
          address1:  fd.get("address") as string,
          address2:  "",
          city:      fd.get("city") as string,
          state:     fd.get("state") as string,
          zip:       fd.get("zip") as string,
          country:   "United States",
        };

    const orderItems = items.map((item) => ({
      productId: item.product.id,
      slug:      item.product.slug,
      name:      item.product.name,
      image:     item.product.image,
      price:     item.product.price,
      quantity:  item.quantity,
    }));

    const order = saveOrder({ items: orderItems, subtotal: totalPrice, shipping, tax, total, shippingAddress });
    setConfirmedOrder({ id: order.id, tracking: order.trackingNumber });
    setSubmitted(true);
    clearCart();
  };

  /* ── Order confirmed ────────────────────────────────────────────── */
  if (submitted && confirmedOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-[var(--nav-h)]">
        <div className="text-center max-w-md px-8 animate-fade-up">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-2">Order Confirmed</p>
          <h1 className="text-3xl font-bold text-[var(--dark)] tracking-tight">{confirmedOrder.id}</h1>
          <p className="text-[var(--text)] mt-3 leading-relaxed text-sm">
            Thank you for your order! A confirmation email with tracking details will arrive shortly.
          </p>
          {confirmedOrder.tracking && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[var(--light)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm">
              <Package className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[var(--muted)]">Tracking:</span>
              <span className="font-semibold text-[var(--dark)]">{confirmedOrder.tracking}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {user && (
              <Link href="/account/orders"
                className="inline-flex items-center justify-center gap-2 bg-[var(--dark)] text-white px-6 py-3 rounded text-sm font-medium hover:bg-[var(--accent)] transition-colors">
                <Package className="w-4 h-4" /> View My Orders
              </Link>
            )}
            <Link href="/"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded text-sm font-medium hover:border-[var(--dark)] hover:text-[var(--dark)] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty cart ─────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-[var(--nav-h)]">
        <div className="text-center px-8">
          <div className="w-16 h-16 bg-[var(--light)] rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 text-[var(--border)]" />
          </div>
          <p className="text-[var(--text)] text-base font-medium">Your cart is empty</p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-[var(--dark)] text-white px-7 py-3 rounded text-sm font-medium mt-5 hover:bg-[var(--accent)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--light)] pt-[var(--nav-h)]">
      {/* Progress bar */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--dark)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <div className="h-3 w-px bg-[var(--border)] mx-2" />
          {["Cart", "Information", "Payment"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && <ChevronDown className="w-3 h-3 -rotate-90 text-[var(--border)]" />}
              <span className={`text-xs font-semibold tracking-wide ${i === 1 ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                {step}
              </span>
            </div>
          ))}
          {user && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <User className="w-3.5 h-3.5" />
              Signed in as <span className="font-semibold text-[var(--dark)]">{user.firstName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Form ────────────────────────────────────────────────── */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

            {/* Mobile summary toggle */}
            <div className="lg:hidden bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              <button type="button" onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[var(--dark)]">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                  Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent)]">${total.toFixed(2)}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
              {summaryOpen && <OrderSummaryItems items={items} totalPrice={totalPrice} shipping={shipping} tax={tax} total={total} />}
            </div>

            {/* Contact info */}
            <FormSection title="Contact Information" icon={<User className="w-4 h-4 text-[var(--accent)]" />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>First Name</label>
                  <input name="firstName" type="text" placeholder="Jane"
                    defaultValue={user?.firstName ?? ""} required className={FIELD} />
                </div>
                <div>
                  <label className={LABEL}>Last Name</label>
                  <input name="lastName" type="text" placeholder="Doe"
                    defaultValue={user?.lastName ?? ""} required className={FIELD} />
                </div>
                <div>
                  <label className={LABEL}>Email Address</label>
                  <input name="email" type="email" placeholder="jane@example.com"
                    defaultValue={user?.email ?? ""} required className={FIELD} />
                </div>
                <div>
                  <label className={LABEL}>Phone Number</label>
                  <input name="phone" type="tel" placeholder="+1 (555) 000-0000"
                    defaultValue={user?.phone ?? ""} className={FIELD} />
                </div>
              </div>
            </FormSection>

            {/* Shipping address */}
            <FormSection title="Shipping Address" icon={<MapPin className="w-4 h-4 text-[var(--accent)]" />}>
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--muted)] mb-3">Select a saved address or enter a new one.</p>
                  <div className="grid gap-3">
                    {addresses.map((addr) => (
                      <label key={addr.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedAddrId === addr.id
                            ? "border-[var(--accent)] bg-[var(--accent-light)]"
                            : "border-[var(--border)] bg-white hover:border-[var(--muted)]"
                        }`}>
                        <input type="radio" name="savedAddress" value={addr.id}
                          checked={selectedAddrId === addr.id}
                          onChange={() => setSelectedAddrId(addr.id)}
                          className="mt-1 accent-[var(--accent)]" />
                        <div className="text-sm">
                          <p className="font-semibold text-[var(--dark)]">{addr.firstName} {addr.lastName}
                            {addr.isDefault && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)] px-1.5 py-0.5 rounded-sm">Default</span>}
                          </p>
                          <p className="text-[var(--text)] mt-0.5">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</p>
                          <p className="text-[var(--muted)]">{addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <Link href="/account/addresses"
                    className="text-xs text-[var(--accent)] underline underline-offset-2 hover:opacity-75 transition-opacity">
                    + Add a new address
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={LABEL}>Street Address</label>
                    <input name="address" type="text" placeholder="123 Main Street, Apt 4B"
                      required className={FIELD} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { name: "city",  label: "City",     placeholder: "New York" },
                      { name: "state", label: "State",    placeholder: "NY" },
                      { name: "zip",   label: "ZIP Code", placeholder: "10001" },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className={LABEL}>{f.label}</label>
                        <input name={f.name} type="text" placeholder={f.placeholder} required className={FIELD} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              {/* Card brand icons */}
              <div className="flex items-center gap-2 mt-3">
                {["Visa", "MC", "Amex", "Discover"].map((b) => (
                  <span key={b} className="text-[10px] font-bold text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded">
                    {b}
                  </span>
                ))}
              </div>
            </FormSection>

            {/* Promo code */}
            <div className="flex gap-2">
              <input type="text" placeholder="Promo code (e.g. NEXHOME15)"
                className={`${FIELD} flex-1`} />
              <button type="button"
                className="px-5 py-3 bg-[var(--dark)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent)] transition-colors tracking-wide">
                Apply
              </button>
            </div>

            {/* Submit */}
            <button type="submit"
              className="w-full flex items-center justify-center gap-2.5 bg-[var(--dark)] hover:bg-[var(--accent)] text-white py-4 rounded text-sm font-semibold transition-colors duration-200">
              <Lock className="w-4 h-4" />
              Place Order — ${total.toFixed(2)}
            </button>

            <p className="text-center text-xs text-[var(--muted)]">
              By placing your order you agree to our{" "}
              <a href="#" className="underline hover:text-[var(--dark)]">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-[var(--dark)]">Privacy Policy</a>.
            </p>
          </form>

          {/* ── Desktop order summary ──────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-h)+1.5rem)] space-y-4">
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                  <h2 className="text-sm font-bold text-[var(--dark)] tracking-wide">Order Summary</h2>
                </div>
                <OrderSummaryItems items={items} totalPrice={totalPrice} shipping={shipping} tax={tax} total={total} />
              </div>

              {/* Secure badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-[var(--muted)]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  SSL Secured
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  30-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function FormSection({
  title, icon, children,
}: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <h2 className="text-sm font-bold text-[var(--dark)] mb-5 flex items-center gap-2 tracking-wide">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

type SummaryItem = { product: { id: string; name: string; image: string; price: number; slug: string }; quantity: number };

function OrderSummaryItems({
  items, totalPrice, shipping, tax, total,
}: { items: SummaryItem[]; totalPrice: number; shipping: number; tax: number; total: number }) {
  return (
    <div className="px-6 py-4 space-y-4">
      {items.map(({ product, quantity }) => (
        <div key={product.id} className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--light)] flex-shrink-0 ring-1 ring-[var(--border)]">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--muted)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--dark)] line-clamp-2">{product.name}</p>
          </div>
          <p className="text-sm font-bold text-[var(--dark)] flex-shrink-0">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>
      ))}

      <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
        <div className="flex justify-between text-[var(--text)]">
          <span>Subtotal</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[var(--text)]">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-[var(--text)]">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-[var(--dark)] text-base border-t border-[var(--border)] pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
