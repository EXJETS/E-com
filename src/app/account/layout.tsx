"use client";

import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/profile", label: "Profile & Security", icon: User, exact: false },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/account/login");
    }
  }, [user, isLoading, router]);

  // Render nothing while loading or redirecting
  if (isLoading || !user) return null;

  const initials =
    (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="pt-[var(--nav-h)] min-h-screen bg-[var(--light)]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <aside>
            <div className="sticky top-[calc(var(--nav-h)+24px)] bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              {/* User info */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[var(--dark)] text-white flex items-center justify-center text-xl font-bold uppercase select-none">
                    {initials || <User className="w-6 h-6" />}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[var(--dark)] text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5 break-all">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="p-3 flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon, exact }) => {
                  const isActive = exact
                    ? pathname === href
                    : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--dark)] text-white"
                          : "text-[var(--text)] hover:bg-[var(--light)]"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Sign out */}
              <div className="p-3 border-t border-[var(--border)]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text)] hover:bg-[var(--light)] transition-colors"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────── */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
