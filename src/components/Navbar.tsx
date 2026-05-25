"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, ArrowRight, User, LogOut, Package, Heart, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";
import { collections, getBestSellers } from "@/lib/products";
import SearchModal from "@/components/SearchModal";

const navLinks = [
  { label: "Products",   href: "/collections/best-sellers" },
  { label: "Security",   href: "/collections/security" },
  { label: "Climate",    href: "/collections/climate" },
  { label: "Lighting",   href: "/collections/lighting" },
  { label: "Automation", href: "/collections/automation" },
];

const accountLinks = [
  { label: "Dashboard",  href: "/account",           icon: LayoutDashboard },
  { label: "My Orders",  href: "/account/orders",    icon: Package },
  { label: "Wishlist",   href: "/account/wishlist",  icon: Heart },
  { label: "Profile",    href: "/account/profile",   icon: User },
];

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [megaOpen,    setMegaOpen]    = useState(false);
  const [acctOpen,    setAcctOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);
  const featured = getBestSellers(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close account dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) {
        setAcctOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navBg     = scrolled ? "bg-white/96 backdrop-blur-md border-b border-[var(--border)] shadow-sm" : "bg-transparent";
  const linkColor = scrolled ? "text-[var(--text)] hover:text-[var(--dark)]" : "text-white hover:text-white/80";
  const iconColor = scrolled ? "text-[var(--text)]" : "text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        style={{ height: "var(--nav-h)" }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className={`text-lg font-bold tracking-tight flex-shrink-0 transition-colors duration-300 ${iconColor}`}>
            NexHome
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`nav-link transition-colors duration-300 ${linkColor}`}>
                {link.label}
              </Link>
            ))}

            {/* Collections mega-menu */}
            <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <button className={`nav-link flex items-center gap-1 transition-colors duration-300 ${linkColor}`}>
                All Categories
                <svg className={`w-3 h-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[660px] bg-white border border-[var(--border)] rounded-xl shadow-2xl transition-all duration-200 ${
                megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                <div className="absolute -top-2 left-0 right-0 h-2" />
                <div className="grid grid-cols-[1fr_220px] overflow-hidden rounded-xl">
                  <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-1">
                    <p className="col-span-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
                      Browse Categories
                    </p>
                    {collections.map((c) => (
                      <Link key={c.id} href={`/collections/${c.id}`} onClick={() => setMegaOpen(false)}
                        className="group/item px-3 py-2.5 rounded-lg hover:bg-[var(--light)] transition-colors">
                        <p className="text-sm font-medium text-[var(--dark)] group-hover/item:text-[var(--accent)] transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{c.productCount} products</p>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-3 pt-3 border-t border-[var(--border)]">
                      <Link href="/collections/best-sellers" onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:gap-2.5 transition-all">
                        View all products <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[var(--light)] p-5 flex flex-col gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Top Sellers</p>
                    {featured.map((p) => (
                      <Link key={p.id} href={`/products/${p.slug}`} onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 hover:opacity-75 transition-opacity">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--dark)] line-clamp-2 leading-snug">{p.name}</p>
                          <p className="text-xs text-[var(--accent)] font-bold mt-0.5">${p.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)}
              className={`icon-btn transition-colors duration-300 ${iconColor} hover:bg-white/10`} aria-label="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist */}
            <Link href="/account/wishlist"
              className={`icon-btn relative transition-colors duration-300 ${iconColor} hover:bg-white/10`} aria-label="Wishlist">
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={toggleCart}
              className={`icon-btn relative transition-colors duration-300 ${iconColor} hover:bg-white/10`} aria-label="Open cart">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Account */}
            {user ? (
              <div ref={acctRef} className="relative hidden md:block">
                <button
                  onClick={() => setAcctOpen((o) => !o)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-300 ${
                    scrolled ? "hover:bg-[var(--light)]" : "hover:bg-white/10"
                  }`}
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--dark)] border-2 border-[var(--accent)] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className={`text-[13px] font-medium hidden lg:block transition-colors duration-300 ${iconColor}`}>
                    {user.firstName}
                  </span>
                </button>

                {/* Account dropdown */}
                <div className={`absolute right-0 top-full mt-2 w-52 bg-white border border-[var(--border)] rounded-xl shadow-2xl transition-all duration-200 overflow-hidden ${
                  acctOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-sm font-semibold text-[var(--dark)]">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    {accountLinks.map(({ label, href, icon: Icon }) => (
                      <Link key={href} href={href} onClick={() => setAcctOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--light)] hover:text-[var(--dark)] transition-colors">
                        <Icon className="w-4 h-4 text-[var(--muted)]" />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-[var(--border)] mt-1.5 pt-1.5">
                      <button
                        onClick={() => { logout(); setAcctOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/account/login"
                className={`hidden md:flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  scrolled
                    ? "text-[var(--text)] hover:bg-[var(--light)]"
                    : "text-white hover:bg-white/10"
                }`}>
                <User className="w-[15px] h-[15px]" />
                Sign In
              </Link>
            )}

            {/* Mobile burger */}
            <button
              className={`icon-btn md:hidden transition-colors duration-300 ${iconColor} hover:bg-white/10`}
              onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[55] bg-[var(--dark)]/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile slide panel ── */}
      <div className={`fixed right-0 top-0 h-full w-[300px] bg-white shadow-2xl z-[60] flex flex-col transition-transform duration-300 md:hidden ${
        menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <Link href="/" className="text-lg font-bold text-[var(--dark)]" onClick={() => setMenuOpen(false)}>NexHome</Link>
          <button onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--light)] text-[var(--muted)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-[var(--light)] rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--dark)] truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[var(--muted)] truncate">{user.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-lg text-sm font-medium text-[var(--text)] hover:bg-[var(--light)] hover:text-[var(--dark)] transition-colors">
              {link.label}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] px-3 mb-2">Categories</p>
            {collections.map((c) => (
              <Link key={c.id} href={`/collections/${c.id}`} onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--light)] transition-colors">
                <span>{c.name}</span>
                <span className="text-xs text-[var(--muted)]">{c.productCount}</span>
              </Link>
            ))}
          </div>

          {user ? (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] px-3 mb-2">Account</p>
              {accountLinks.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--light)] transition-colors">
                  <Icon className="w-4 h-4 text-[var(--muted)]" />
                  {label}
                </Link>
              ))}
              <button onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors mt-1">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <Link href="/account/login" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--dark)] hover:bg-[var(--light)] transition-colors">
                <User className="w-4 h-4 text-[var(--muted)]" />
                Sign In
              </Link>
              <Link href="/account/register" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors">
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)]">
          <Link href="/collections/best-sellers" onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-[var(--dark)] hover:bg-[var(--accent)] text-white rounded py-3 text-sm font-medium transition-colors duration-200">
            Shop All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
