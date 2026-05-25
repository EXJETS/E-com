"use client";

import Link from "next/link";
import {
  Package,
  DollarSign,
  Heart,
  Shield,
  Thermometer,
  Lightbulb,
  Cpu,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";

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

const quickLinks = [
  { label: "Security", href: "/collections/security", icon: Shield },
  { label: "Climate", href: "/collections/climate", icon: Thermometer },
  { label: "Lighting", href: "/collections/lighting", icon: Lightbulb },
  { label: "Automation", href: "/collections/automation", icon: Cpu },
];

export default function AccountDashboardPage() {
  const { user, getOrders } = useAuth();
  const { count: wishlistCount } = useWishlist();

  if (!user) return null;

  const orders = getOrders();
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--dark)]">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Here&apos;s an overview of your NexHome account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
            <Package className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--dark)]">{orders.length}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Total Orders</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--dark)]">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Total Spent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--dark)]">{wishlistCount}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Wishlist Items</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--dark)]">Recent Orders</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-xs text-[var(--accent)] hover:underline font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-[var(--light)] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[var(--muted)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--dark)]">No orders yet</p>
              <p className="text-xs text-[var(--muted)] mt-1">
                Your orders will appear here once you shop.
              </p>
            </div>
            <Link
              href="/"
              className="bg-[var(--dark)] text-white rounded px-6 py-2.5 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {recentOrders.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <li key={order.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-[var(--dark)]">{order.id}</span>
                      {statusBadge(order.status)}
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      {date} &middot; {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[var(--dark)]">
                      ${order.total.toFixed(2)}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-xs text-[var(--accent)] hover:underline font-medium"
                    >
                      Details
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-semibold text-[var(--dark)] mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-[var(--border)] p-5 flex flex-col items-center gap-3 hover:border-[var(--accent)] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--light)] flex items-center justify-center group-hover:bg-[var(--accent-light)] transition-colors">
                <Icon className="w-5 h-5 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[var(--dark)]">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
