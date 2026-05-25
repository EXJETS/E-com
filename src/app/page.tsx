import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Shield, Cpu, Clock, Wifi } from "lucide-react";
import { getBestSellers, collections } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const heroSections = [
  {
    id: "nexhub",
    tag: "New · Smart Control",
    title: "NexHub Pro 3",
    subtitle: "Command your entire home from one intelligent hub",
    price: "299",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90",
    dark: true,
    orderHref: "/products/nexhub-pro-3",
    learnHref: "/collections/smart-hub",
  },
  {
    id: "nexcam",
    tag: "Security",
    title: "NexCam 4K",
    subtitle: "Always watching. Always learning.",
    price: "149",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&q=90",
    dark: false,
    orderHref: "/products/nexcam-4k-outdoor",
    learnHref: "/collections/security",
  },
  {
    id: "nextherm",
    tag: "Climate & Energy",
    title: "NexTherm",
    subtitle: "The thermostat that thinks like you do",
    price: "199",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=90",
    dark: false,
    orderHref: "/products/nextherm",
    learnHref: "/collections/climate",
  },
  {
    id: "nexglow",
    tag: "Smart Lighting",
    title: "NexGlow Strip",
    subtitle: "Set the mood for every moment",
    price: "79",
    image: "https://images.unsplash.com/photo-1565014781890-e6d40e4d5af8?w=1920&q=90",
    dark: true,
    orderHref: "/products/nexglow-strip-16ft",
    learnHref: "/collections/lighting",
  },
];

export default function HomePage() {
  const bestSellers = getBestSellers(9);
  const shopCollections = collections.filter((c) => c.id !== "best-sellers");

  return (
    <div>
      {/* ── HERO SECTIONS (Tesla-style 100vh full-bleed) ─────────────── */}
      {heroSections.map((s, i) => (
        <section
          key={s.id}
          className={`relative h-screen flex flex-col items-center justify-between overflow-hidden ${
            i === 0 ? "-mt-[var(--nav-h)]" : ""
          }`}
        >
          {/* Full-bleed background */}
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />

          {/* Gradient overlay */}
          {s.dark ? (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/50" />
          )}

          {/* Content — upper area */}
          <div
            className={`relative z-10 flex flex-col items-center text-center px-6 pt-[calc(var(--nav-h)+10vh)] ${
              s.dark ? "text-white" : "text-[var(--dark)]"
            }`}
          >
            <p
              className={`text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 ${
                s.dark ? "text-white/65" : "text-[var(--muted)]"
              }`}
            >
              {s.tag}
            </p>
            <h2
              className="font-bold tracking-tight leading-none"
              style={{ fontSize: "clamp(2.25rem, 6vw, 4.75rem)" }}
            >
              {s.title}
            </h2>
            <p
              className={`mt-4 text-base leading-relaxed max-w-sm ${
                s.dark ? "text-white/75" : "text-[var(--text)]"
              }`}
            >
              {s.subtitle}
            </p>
            <p
              className={`mt-2 text-sm ${
                s.dark ? "text-white/50" : "text-[var(--muted)]"
              }`}
            >
              Starting at ${s.price}
            </p>
          </div>

          {/* CTAs — bottom */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto px-6 sm:px-0 pb-[max(7vh,48px)]">
            <Link href={s.orderHref} className="btn-hero-dark">
              Order Now
            </Link>
            <Link href={s.learnHref} className="btn-hero-light">
              Learn More
            </Link>
          </div>

          {/* Scroll cue on first section only */}
          {i === 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <ChevronDown className="w-6 h-6 text-white/50" />
            </div>
          )}
        </section>
      ))}

      {/* ── EXPLORE ALL PRODUCTS (Tesla "Explore All Models" style) ──── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-bold text-[var(--dark)] text-center tracking-tight mb-3"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Explore Products
          </h2>
          <p className="text-center text-[var(--muted)] text-sm mb-14">
            Build your perfect smart home, one device at a time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/collections/best-sellers"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dark)] border border-[var(--dark)] px-8 py-3.5 rounded hover:bg-[var(--dark)] hover:text-white transition-all duration-200"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────── */}
      <section className="bg-[var(--light)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-bold text-[var(--dark)] text-center tracking-tight mb-3"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Shop by Category
          </h2>
          <p className="text-center text-[var(--muted)] text-sm mb-14">
            Complete smart home solutions for every room and every need.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shopCollections.map((c, i) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className={`group relative overflow-hidden rounded-lg bg-white ${
                  i === 0 ? "col-span-2 md:col-span-1 row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "auto" : "4/3" }}
              >
                <div className={`relative w-full ${i === 0 ? "h-full min-h-[320px]" : "h-full"}`}>
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)]/80 via-[var(--dark)]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-semibold text-sm tracking-wide">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-white/60 text-xs">{c.productCount} products</span>
                      <ArrowRight className="w-3 h-3 text-white/60 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NEXHOME ──────────────────────────────────────────────── */}
      <section className="bg-[var(--dark)] text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-bold text-center tracking-tight mb-16"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Built Different
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Cpu,
                title: "Matter Certified",
                desc: "Every hub works natively with Apple, Google, and Amazon — no compromises.",
              },
              {
                icon: Wifi,
                title: "Local Processing",
                desc: "Automations run on-device. No internet, no latency, no privacy concerns.",
              },
              {
                icon: Shield,
                title: "End-to-End Encrypted",
                desc: "Military-grade encryption protects your home network and camera feeds.",
              },
              {
                icon: Clock,
                title: "10-Year Support",
                desc: "We commit to software updates and hardware support for a full decade.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/80" />
                </div>
                <h3 className="font-semibold text-sm tracking-wide">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE TRUST BAR ────────────────────────────────────────── */}
      <div className="bg-[var(--light)] border-y border-[var(--border)] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "Matter Certified",
            "50,000+ Homes Connected",
            "Local Processing — No Cloud Required",
            "Free Shipping Over $75",
            "4.8 / 5 Stars",
            "Ships from US Warehouse",
            "10-Year Software Support",
            "End-to-End Encrypted",
            "30-Day Free Returns",
          ]
            .flatMap((item) => [item, item])
            .map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-8 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--muted)]"
              >
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] inline-block flex-shrink-0" />
                {item}
              </span>
            ))}
        </div>
      </div>

      {/* ── STARTER KIT CTA ──────────────────────────────────────────── */}
      <section className="bg-white py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="section-tag text-[var(--muted)]">Limited Offer</p>
          <h2
            className="font-bold text-[var(--dark)] tracking-tight mt-2 mb-5"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            Start Smart for Less
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Bundle the NexHub Pro 3 with any three devices and save 15% automatically
            at checkout. No code needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/collections/smart-hub"
              className="inline-flex items-center justify-center gap-2 bg-[var(--dark)] text-white px-10 py-4 rounded text-sm font-medium hover:bg-[var(--accent)] transition-colors duration-200"
            >
              Build Your Kit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/collections/best-sellers"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text)] px-10 py-4 rounded text-sm font-medium hover:border-[var(--dark)] hover:text-[var(--dark)] transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
