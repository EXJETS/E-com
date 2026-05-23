"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Search, Menu, X, Gem, ArrowRight, Home, Layers, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { collections, getBestSellers } from "@/lib/products";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [megaOpen, setMegaOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const featured = getBestSellers(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Promo bar */}
      <div className="bg-[var(--charcoal)] text-white text-center text-[11px] py-2.5 tracking-[0.12em] uppercase font-medium">
        Complimentary shipping on orders over $50&ensp;&mdash;&ensp;
        Code <span className="text-rose-300 font-bold">GLOW15</span> for 15% off your first order
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm"
            : "bg-[var(--cream)]"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Gem className="w-4 h-4 text-[var(--accent)] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display text-[19px] font-semibold tracking-tight text-[var(--charcoal)]">
              Glow<span className="text-[var(--accent)]">Cart</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            <Link href="/" className="nav-link">Home</Link>

            {/* Collections mega trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="nav-link flex items-center gap-1">
                Collections
                <svg className={`w-3 h-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega menu */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[720px] bg-white border border-[var(--border)] rounded-2xl shadow-2xl transition-all duration-200 ${megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                {/* invisible bridge to prevent gap */}
                <div className="absolute -top-1 left-0 right-0 h-2" />

                <div className="grid grid-cols-[1fr_240px] gap-0 overflow-hidden rounded-2xl">
                  {/* Left: collection links */}
                  <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-1">
                    <p className="col-span-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] mb-3">
                      Browse Collections
                    </p>
                    {collections.map((c) => (
                      <Link
                        key={c.id}
                        href={`/collections/${c.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="group/item px-3 py-2.5 rounded-xl hover:bg-[var(--accent-bg)] transition-colors"
                      >
                        <p className="text-sm font-medium text-[var(--charcoal)] group-hover/item:text-[var(--accent)] transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{c.productCount} products</p>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-3 pt-3 border-t border-[var(--border)]">
                      <Link
                        href="/collections/facial-devices"
                        onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:gap-2.5 transition-all"
                      >
                        View all collections <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: featured products */}
                  <div className="bg-[var(--sand)] p-5 flex flex-col gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                      Best Sellers
                    </p>
                    {featured.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 group/feat hover:opacity-80 transition-opacity"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--charcoal)] line-clamp-2 leading-snug">{p.name}</p>
                          <p className="text-xs text-[var(--accent)] font-bold mt-1">${p.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/collections/hygiene-kits" className="nav-link">Care Packages</Link>
            <Link href="/collections/facial-devices" className="nav-link">Devices</Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button
              className="icon-btn hidden sm:flex"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button onClick={toggleCart} className="icon-btn relative" aria-label="Open bag">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              className="icon-btn md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — full-screen slide-in panel */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[55] bg-[var(--charcoal)]/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-[55] flex flex-col transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <Gem className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-display text-[17px] font-semibold tracking-tight text-[var(--charcoal)]">
              Glow<span className="text-[var(--accent)]">Cart</span>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--sand)] text-[var(--muted)] hover:text-[var(--charcoal)] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-1">
          {/* Nav links */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--sand)] text-sm font-medium text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors"
          >
            <Home className="w-4 h-4 text-[var(--muted)]" />
            Home
          </Link>
          <Link
            href="/collections/facial-devices"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--sand)] text-sm font-medium text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors"
          >
            <Layers className="w-4 h-4 text-[var(--muted)]" />
            Devices
          </Link>
          <Link
            href="/collections/hygiene-kits"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--sand)] text-sm font-medium text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors"
          >
            <Package className="w-4 h-4 text-[var(--muted)]" />
            Care Packages
          </Link>

          {/* Collections list */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] px-3 mb-2">
              Collections
            </p>
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--sand)] text-sm text-[var(--body)] hover:text-[var(--accent)] transition-colors"
              >
                <span>{c.name}</span>
                <span className="text-xs text-[var(--muted)]">{c.productCount}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Shop All CTA */}
        <div className="px-5 py-4 border-t border-[var(--border)]">
          <Link
            href="/collections/best-sellers"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white rounded-full py-3 text-sm font-semibold tracking-wide transition-all duration-300"
          >
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
