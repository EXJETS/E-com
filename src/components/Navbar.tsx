"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Search, Menu, X, Gem } from "lucide-react";
import { useState } from "react";
import { collections } from "@/lib/products";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
      {/* Promo bar */}
      <div className="bg-stone-900 text-white text-center text-xs py-2.5 font-medium tracking-widest uppercase">
        Complimentary shipping on orders over $50 &nbsp;&mdash;&nbsp; Code{" "}
        <span className="font-bold text-rose-300">GLOW15</span> for 15% off your first order
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Gem className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-stone-900">
            Glow<span className="text-rose-500">Cart</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-stone-500 hover:text-rose-500 transition-colors font-medium tracking-wide">
            Home
          </Link>
          <div className="relative group">
            <button className="text-sm text-stone-500 hover:text-rose-500 transition-colors font-medium tracking-wide flex items-center gap-1">
              Collections
              <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              {collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.id}`}
                  className="block px-5 py-3 text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/collections/hygiene-kits" className="text-sm text-stone-500 hover:text-rose-500 transition-colors font-medium tracking-wide">
            Care Packages
          </Link>
          <Link href="/collections/facial-devices" className="text-sm text-stone-500 hover:text-rose-500 transition-colors font-medium tracking-wide">
            Facial Devices
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-stone-400 hover:text-rose-500 transition-colors hidden sm:block" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={toggleCart}
            className="relative p-2 text-stone-700 hover:text-rose-500 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 text-stone-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white py-5 px-6">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-stone-700 tracking-wide" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Collections</p>
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="text-sm text-stone-600 pl-2"
                onClick={() => setMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
