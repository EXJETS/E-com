"use client";

import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

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

export default function OrdersPage() {
  const { getOrders } = useAuth();
  const orders = getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--dark)]">My Orders</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] py-20 flex flex-col items-center gap-5 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-[var(--light)] flex items-center justify-center">
            <Package className="w-7 h-7 text-[var(--muted)]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--dark)]">No orders yet</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              When you place an order, it will appear here.
            </p>
          </div>
          <Link
            href="/"
            className="bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            const firstThree = order.items.slice(0, 3);
            const extra = order.items.length - 3;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
              >
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--light)]/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-[var(--dark)]">{order.id}</span>
                    {statusBadge(order.status)}
                  </div>
                  <span className="text-xs text-[var(--muted)]">{date}</span>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <p className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wider mb-2">
                    Items
                  </p>
                  <ul className="space-y-0.5">
                    {firstThree.map((item) => (
                      <li key={item.productId} className="text-sm text-[var(--text)]">
                        {item.name}{" "}
                        <span className="text-[var(--muted)]">&times; {item.quantity}</span>
                      </li>
                    ))}
                    {extra > 0 && (
                      <li className="text-sm text-[var(--muted)]">+{extra} more item{extra !== 1 ? "s" : ""}</li>
                    )}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Order total</p>
                    <p className="text-base font-bold text-[var(--dark)]">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-1.5 bg-[var(--dark)] text-white rounded px-5 py-2.5 text-xs font-medium hover:bg-[var(--accent)] transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
