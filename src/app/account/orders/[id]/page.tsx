"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Package, Truck, Home, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

const STATUS_STEPS = [
  { key: "processing", label: "Order Placed", icon: Package },
  { key: "processing_done", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
] as const;

function getStepIndex(status: string): number {
  switch (status) {
    case "processing": return 1;
    case "shipped": return 2;
    case "out_for_delivery": return 2;
    case "delivered": return 3;
    default: return 0;
  }
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    processing: { label: "Processing", cls: "bg-blue-100 text-blue-700" },
    shipped: { label: "Shipped", cls: "bg-amber-100 text-amber-700" },
    out_for_delivery: { label: "Out for Delivery", cls: "bg-orange-100 text-orange-700" },
    delivered: { label: "Delivered", cls: "bg-green-100 text-green-700" },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrders } = useAuth();

  const order = getOrders().find((o) => o.id === id);

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center space-y-4">
        <p className="text-base font-semibold text-[var(--dark)]">Order not found</p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const estimatedDate = new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stepIndex = getStepIndex(order.status);
  const timelineSteps = [
    { label: "Order Placed", icon: Package },
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--dark)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[var(--border)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold text-[var(--dark)]">{order.id}</h1>
            {statusBadge(order.status)}
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">Placed on {createdDate}</p>
          {order.trackingNumber && (
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Tracking: <span className="font-mono font-semibold text-[var(--dark)]">{order.trackingNumber}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">Estimated delivery</p>
          <p className="text-sm font-semibold text-[var(--dark)]">{estimatedDate}</p>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-white rounded-xl border border-[var(--border)] px-6 py-6">
        <h2 className="text-sm font-semibold text-[var(--dark)] mb-6">Order Progress</h2>
        <div className="relative flex items-start justify-between">
          {/* progress bar */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-[var(--border)]" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-[var(--dark)] transition-all duration-700"
            style={{ width: `${(stepIndex / (timelineSteps.length - 1)) * 100}%` }}
          />

          {timelineSteps.map(({ label, icon: Icon }, i) => {
            const done = i <= stepIndex;
            return (
              <div key={label} className="relative flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                    done
                      ? "bg-[var(--dark)] border-[var(--dark)] text-white"
                      : "bg-white border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className={`text-[10px] font-medium text-center leading-tight ${done ? "text-[var(--dark)]" : "text-[var(--muted)]"}`}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Items table */}
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--dark)]">
                Items ({order.items.length})
              </h2>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-16 h-16 rounded-lg bg-[var(--light)] overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-[var(--dark)] hover:text-[var(--accent)] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Qty: {item.quantity} &middot; ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[var(--dark)]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-[var(--border)] px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[var(--muted)]" />
              <h2 className="text-sm font-semibold text-[var(--dark)]">Shipping Address</h2>
            </div>
            <div className="text-sm text-[var(--text)] space-y-0.5">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order totals */}
        <div className="bg-white rounded-xl border border-[var(--border)] px-6 py-5 h-fit">
          <h2 className="text-sm font-semibold text-[var(--dark)] mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[var(--text)]">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--text)]">
              <span>Shipping</span>
              <span className={order.shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text)]">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--dark)] text-base border-t border-[var(--border)] pt-3 mt-1">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 w-full block text-center bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
