import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BadgeCheck, ChevronRight } from "lucide-react";
import { getBestSellers, collections } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const bestSellers = getBestSellers(12);

  const marqueeItems = [
    "Dermatologist Tested",
    "200,000+ Customers",
    "30-Day Money-Back Guarantee",
    "Free Shipping Over $50",
    "4.8 / 5 Stars",
    "Cruelty-Free Formulas",
    "Clinic-Grade Technology",
    "Award-Winning Products",
  ];

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-[var(--cream)] min-h-[92vh] flex items-center overflow-hidden">
        {/* Subtle background gradient blob */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-50/60 via-stone-50/20 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-16 grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-6">
              The New Standard in Beauty Care
            </p>
            <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-semibold italic leading-[1.05] tracking-tight text-[var(--charcoal)]">
              Beauty That<br />
              <span className="not-italic font-normal text-[var(--accent)]">Actually</span><br />
              Works.
            </h1>
            <p className="mt-6 text-[var(--body)] leading-relaxed max-w-sm text-[15px]">
              Clinic-quality devices and complete hygiene care packages, curated by dermatologists for visible results at home.
            </p>

            <div className="flex flex-wrap gap-3 mt-9">
              <Link
                href="/collections/facial-devices"
                className="inline-flex items-center gap-2 bg-[var(--charcoal)] hover:bg-[var(--accent)] text-white px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300"
              >
                Shop Devices <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections/hygiene-kits"
                className="inline-flex items-center gap-2 bg-transparent border border-[var(--border-dark)] hover:border-[var(--accent)] text-[var(--charcoal)] hover:text-[var(--accent)] px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300"
              >
                Care Packages
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-12">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
                  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&q=80",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80",
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--cream)] overflow-hidden relative shadow">
                    <Image src={src} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5">Trusted by 200,000+ customers</p>
              </div>
            </div>
          </div>

          {/* Right: Image mosaic */}
          <div className="order-1 lg:order-2 grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4">
            {/* Large top-left */}
            <div className="row-span-2 relative rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=85"
                alt="Facial devices"
                fill
                className="object-cover"
                sizes="360px"
                priority
              />
              {/* Floating card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs font-semibold text-[var(--charcoal)] leading-snug">
                  &ldquo;My skin improved in 2 weeks&rdquo;
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">Sophia M. &mdash; Verified Buyer</p>
              </div>
            </div>

            {/* Top-right */}
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80"
                alt="Oral care"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Bottom-right */}
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80"
                alt="Skincare"
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Pill badge */}
              <div className="absolute top-3 left-3 bg-[var(--accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                #1 Seller
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TRUST BAR ─────────────────────────────────────────── */}
      <div className="bg-[var(--charcoal)] text-white py-4 overflow-hidden border-y border-stone-800">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-xs font-medium tracking-[0.12em] uppercase">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] inline-block flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── COLLECTIONS ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="section-label">Browse By Category</p>
            <h2 className="section-heading">Our Collections</h2>
          </div>
          <Link href="/collections/best-sellers" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 font-medium">
            View all collections <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric grid: Best Sellers (index 0) is the hero card */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
          {collections.map((c, i) => (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 ${i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)]/85 via-[var(--charcoal)]/20 to-transparent" />
              {i === 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-semibold text-sm tracking-wide">{c.name}</p>
                <div className="flex items-center gap-1 mt-1 text-stone-300 group-hover:text-rose-300 transition-colors text-xs">
                  <span>{c.productCount} products</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────────────────────────── */}
      <section className="bg-[var(--sand)] py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="section-label">Most Loved</p>
              <h2 className="section-heading">Best Sellers</h2>
            </div>
            <Link href="/collections/best-sellers" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5 font-medium">
              View all best sellers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
                alt="Body care"
                fill
                className="object-cover"
                sizes="600px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--charcoal)]/30 to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-5 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[180px]">
              <p className="text-3xl font-display font-bold text-[var(--charcoal)]">96%</p>
              <p className="text-xs text-[var(--body)] mt-1 leading-snug">of customers saw visible improvement within 14 days</p>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:pl-6">
            <p className="section-label">The GlowCart Standard</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold italic leading-tight tracking-tight text-[var(--charcoal)] mt-3">
              Designed for<br />Real Results.
            </h2>
            <p className="text-[var(--body)] leading-relaxed mt-5 text-[15px] max-w-md">
              Every device we carry is tested against clinical benchmarks. Every care package is formulated with clean, dermatologist-approved ingredients. We&apos;re raising the bar on what beauty tools can do.
            </p>

            <div className="grid grid-cols-2 gap-5 mt-8">
              {[
                { number: "200K+", label: "Happy customers" },
                { number: "4.8★", label: "Average rating" },
                { number: "27", label: "Curated products" },
                { number: "60%", label: "Avg. discount off retail" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-[var(--accent)] pl-4">
                  <p className="font-display text-2xl font-semibold text-[var(--charcoal)]">{s.number}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/collections/hygiene-kits"
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-colors mt-10"
            >
              Shop Care Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AS FEATURED IN ────────────────────────────────────────────── */}
      <div className="border-y border-[var(--border)] bg-[var(--cream)] py-7">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] font-semibold mr-4">As featured in</p>
            {["Vogue", "Allure", "Byrdie", "Glamour", "Refinery29"].map((brand) => (
              <span key={brand} className="font-display text-lg font-semibold italic text-stone-300 hover:text-[var(--accent)] transition-colors cursor-default select-none tracking-wide">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="bg-[var(--sand)] py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="section-label">Reviews</p>
            <h2 className="section-heading">Real People. Real Results.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sophia M.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
                rating: 5,
                text: "The LED mask completely transformed my skin. I had stubborn acne for years — after 3 weeks of nightly use it&apos;s clearer than it&apos;s ever been.",
                product: "7-Color LED Light Therapy Face Mask",
                ago: "2 weeks ago",
              },
              {
                name: "Jessica L.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
                rating: 5,
                text: "Twelve full-size products and they all work beautifully together. My skin has genuinely never looked better. The Vitamin C serum alone is worth it.",
                product: "Complete AM/PM Skincare Routine Kit",
                ago: "1 month ago",
              },
              {
                name: "Aisha K.",
                avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&q=80",
                rating: 5,
                text: "My dentist noticed the improvement at my last checkup without me saying anything. The water flosser and whitening kit are genuinely life-changing.",
                product: "Cordless Water Flosser",
                ago: "3 weeks ago",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--border)] flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Large serif quote mark */}
                <p className="font-display text-6xl leading-none text-[var(--accent)]/20 mt-2 select-none">&ldquo;</p>

                <p className="text-[var(--body)] text-sm leading-relaxed -mt-4 flex-1">
                  {t.text}
                </p>

                <p className="text-xs text-[var(--accent)] font-medium mt-4">{t.product}</p>

                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[var(--border)]">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0 ring-2 ring-[var(--border)]">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--charcoal)]">{t.name}</p>
                    <p className="text-[10px] text-[var(--muted)]">{t.ago}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-emerald-500">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold">Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="relative bg-[var(--charcoal)] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&q=50"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative px-8 sm:px-16 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300 font-semibold mb-3">Limited Time</p>
              <h2 className="font-display text-3xl sm:text-4xl italic font-semibold text-white leading-tight">
                Get 15% Off<br />Your First Order
              </h2>
              <p className="text-stone-400 text-sm mt-3 max-w-xs">
                Use code <span className="text-rose-300 font-bold tracking-wider">GLOW15</span> at checkout. Valid on all products.
              </p>
            </div>
            <Link
              href="/collections/facial-devices"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-[var(--charcoal)] px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-colors"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
