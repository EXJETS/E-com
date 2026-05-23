import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { getBestSellers, collections } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const bestSellers = getBestSellers(8);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-rose-50/30 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full mb-7 tracking-widest uppercase">
              <BadgeCheck className="w-3.5 h-3.5" />
              Dermatologist Approved
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.05] tracking-tight">
              Clinic-Grade
              <br />
              <span className="text-rose-500">Beauty</span>
              <br />
              at Home
            </h1>
            <p className="mt-6 text-lg text-stone-500 leading-relaxed max-w-md">
              Premium beauty devices and hygiene care packages curated for visible results. Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link
                href="/collections/facial-devices"
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-rose-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 tracking-wide"
              >
                Shop Devices <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections/hygiene-kits"
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors tracking-wide"
              >
                Care Packages
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-stone-100">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80",
                  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&q=80",
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden relative shadow-sm">
                    <Image src={src} alt="Customer" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">Trusted by 200,000+ customers</p>
              </div>
            </div>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80"
                  alt="Facial devices"
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80"
                  alt="Oral care"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </div>
            <div className="space-y-4 pt-10">
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80"
                  alt="Skincare kits"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80"
                  alt="Body care"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="border-y border-stone-100 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-x-12 gap-y-3">
          {[
            { icon: ShieldCheck, text: "Dermatologist Tested" },
            { icon: RotateCcw, text: "30-Day Money Back" },
            { icon: Truck, text: "Free Shipping Over $50" },
            { icon: Star, text: "4.8 / 5 Average Rating" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-rose-500" />
              <span className="text-sm text-stone-600 font-medium tracking-wide">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">Browse By</p>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Shop Collections</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <p className="text-white text-xs font-semibold leading-tight tracking-wide">{c.name}</p>
                <div className="flex items-center gap-1 mt-1 text-stone-300 group-hover:text-rose-300 transition-colors">
                  <span className="text-xs">{c.productCount} products</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">Most Popular</p>
              <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Best Sellers</h2>
            </div>
            <Link
              href="/collections/facial-devices"
              className="text-sm text-stone-500 hover:text-rose-500 font-medium flex items-center gap-1.5 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Banner ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-transparent to-stone-900/80" />
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=60"
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative px-8 py-14 sm:px-14 sm:py-20 grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-3">Complete Routine</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                Your Full<br />Glow-Up Package
              </h2>
              <p className="text-stone-400 mt-4 text-sm leading-relaxed max-w-xs">
                Every essential from facial devices to oral care, bundled at up to 60% off. Build your complete routine in one cart.
              </p>
              <Link
                href="/collections/hygiene-kits"
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white px-7 py-3.5 rounded-xl text-sm font-semibold mt-8 transition-colors tracking-wide"
              >
                Shop Care Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=240&q=80",
                "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=240&q=80",
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=240&q=80",
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=240&q=80",
              ].map((src, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                  <div className="absolute inset-0 bg-stone-900/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">What Customers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sophia M.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
                rating: 5,
                text: "The LED mask completely transformed my skin. I had stubborn acne for years and after 3 weeks it&apos;s clearer than ever. I wish I had found this sooner.",
                product: "7-Color LED Light Therapy Face Mask",
              },
              {
                name: "Jessica L.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
                rating: 5,
                text: "The skincare routine kit is incredible value. Twelve full-size products and everything works beautifully together. My skin has never looked better.",
                product: "Complete AM/PM Skincare Routine Kit",
              },
              {
                name: "Aisha K.",
                avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&q=80",
                rating: 5,
                text: "My dentist noticed the improvement at my last checkup. The water flosser and whitening kit are genuine game-changers. Results in under a week.",
                product: "Cordless Water Flosser",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 shadow-sm border border-stone-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs text-rose-500 mt-3 font-medium">{t.product}</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-stone-50">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
                  </div>
                  <span className="text-sm font-semibold text-stone-900">{t.name}</span>
                  <div className="ml-auto flex items-center gap-1 text-emerald-500">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
