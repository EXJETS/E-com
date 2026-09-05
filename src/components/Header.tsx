"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { featuredAreas } from "@/lib/areas";

const primaryNav = [
  { label: "Services", href: "/services", mega: "services" as const },
  { label: "Service Areas", href: "/service-areas", mega: "areas" as const },
  { label: "Specials", href: "/specials" },
  { label: "Membership", href: "/membership" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [openMega, setOpenMega] = useState<"services" | "areas" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every overlay when the route changes. Adjusting state during render
  // (rather than in an effect) avoids a cascading second render on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMega(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMega(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Utility strip */}
      <div className="hidden bg-navy-950 text-white/70 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12.5px]">
          <p>{site.hours.label}</p>
          <div className="flex items-center gap-5">
            <span>Licensed &amp; insured · TACLA #18497C</span>
            <Link href="/financing" className="transition-colors hover:text-white">
              Financing available
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "border-line bg-white/92 shadow-[0_6px_28px_-24px_rgba(11,26,41,0.7)] backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="container-page flex h-[74px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} home`}>
            <Logo />
            <span className="leading-none">
              <span className="block font-[family-name:var(--font-display)] text-[19px] font-bold tracking-tight text-ink">
                Baker Brothers
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.17em] text-muted">
                Plumbing · Air · Electric
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {primaryNav.map((item) =>
              item.mega ? (
                <div key={item.href} className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setOpenMega(item.mega!)}
                    onClick={() => setOpenMega(openMega === item.mega ? null : item.mega!)}
                    aria-expanded={openMega === item.mega}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[14.5px] font-medium transition-colors ${
                      isActive(item.href) ? "text-cool-600" : "text-body hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${openMega === item.mega ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setOpenMega(null)}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-[14.5px] font-medium transition-colors ${
                    isActive(item.href) ? "text-cool-600" : "text-body hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <a href={site.phone.href} className="hidden shrink-0 items-center gap-2.5 md:flex" data-cta="header-phone">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-tint text-cool-600">
                <Phone size={16} />
              </span>
              <span className="leading-none">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Call 24/7
                </span>
                <span className="mt-1 block whitespace-nowrap text-[15px] font-bold text-ink">{site.phone.display}</span>
              </span>
            </a>
            <Link href="/schedule" className="btn btn-primary hidden !px-5 !py-3 text-sm sm:inline-flex">
              Book Service
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink xl:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mega menus */}
        {openMega === "services" && (
          <div className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_50px_-30px_rgba(11,26,41,0.6)] xl:block">
            <div className="container-page grid grid-cols-4 gap-8 py-8">
              {(["cooling", "heating", "air-quality", "whole-home"] as const).map((cat) => (
                <div key={cat}>
                  <p className="eyebrow mb-3">
                    {cat === "cooling"
                      ? "Air Conditioning"
                      : cat === "heating"
                        ? "Heating"
                        : cat === "air-quality"
                          ? "Air Quality"
                          : "More"}
                  </p>
                  <ul className="space-y-1">
                    {services
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="block rounded-lg px-2 py-1.5 text-[14px] text-body transition-colors hover:bg-surface-alt hover:text-cool-600"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-line-soft bg-surface-alt">
              <div className="container-page flex items-center justify-between py-3.5 text-sm">
                <span className="text-body">Not sure what you need? We diagnose first and quote after.</span>
                <Link href="/services" className="font-semibold text-cool-600 hover:underline">
                  View all services →
                </Link>
              </div>
            </div>
          </div>
        )}

        {openMega === "areas" && (
          <div className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_50px_-30px_rgba(11,26,41,0.6)] xl:block">
            <div className="container-page py-8">
              <p className="eyebrow mb-4">Serving 35+ DFW cities</p>
              <ul className="grid grid-cols-4 gap-x-8 gap-y-1">
                {featuredAreas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/service-areas/${a.slug}`}
                      className="block rounded-lg px-2 py-1.5 text-[14px] text-body transition-colors hover:bg-surface-alt hover:text-cool-600"
                    >
                      HVAC in {a.city}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/service-areas"
                className="mt-5 inline-block text-sm font-semibold text-cool-600 hover:underline"
              >
                See every city we serve →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-950/55 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(400px,90vw)] flex-col overflow-y-auto bg-white">
            <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-line px-5">
              <span className="font-[family-name:var(--font-display)] text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-line"
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 px-5 py-6">
              <p className="eyebrow mb-3">Services</p>
              <ul className="mb-7 space-y-0.5">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="block rounded-lg px-2 py-2.5 text-[15px] text-body hover:bg-surface-alt"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="eyebrow mb-3">Company</p>
              <ul className="space-y-0.5">
                {primaryNav
                  .filter((n) => n.href !== "/services")
                  .concat([{ label: "Financing", href: "/financing" }, { label: "Blog", href: "/blog" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }])
                  .map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className="block rounded-lg px-2 py-2.5 text-[15px] text-body hover:bg-surface-alt"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="sticky bottom-0 space-y-2.5 border-t border-line bg-white p-5">
              <a href={site.phone.href} className="btn btn-cool w-full">
                <Phone size={17} /> {site.phone.display}
              </a>
              <Link href="/schedule" className="btn btn-outline w-full">
                Book Online
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Logo() {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 shadow-[0_6px_18px_-8px_rgba(7,27,46,0.9)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {/* snowflake half — cooling */}
        <path
          d="M8 3v18M2.9 6.5l10.2 5.5M2.9 17.5l10.2-5.5"
          stroke="var(--cool-400)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        {/* flame half — heating */}
        <path
          d="M17.6 21c2.4 0 4-1.7 4-4 0-2.9-2.8-4.3-2.8-7-1.9 1.2-3 3-3 5 0 .9.3 1.6.3 2 0 .8-.5 1.2-1 1.2-.4 0-.8-.2-1-.6-.3.8-.5 1.6-.5 2.4 0 .1 0 .2 0 .3.2 1.4 1.9 2.7 4 2.7Z"
          fill="var(--ember-500)"
        />
      </svg>
    </span>
  );
}
