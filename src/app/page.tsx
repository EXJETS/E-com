import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Zap, Shield, RefreshCw } from "lucide-react";
import { getBestSellers, collections } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const bestSellers = getBestSellers(8);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Zap className="w-3 h-3" /> Trending in 2025
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Glow Like a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                Pro
              </span>
              <br />
              From Home
            </h1>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-md">
              Clinic-quality beauty devices and complete hygiene care packages — curated for real results, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/collections/facial-devices"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-pink-200"
              >
                Shop Devices <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/collections/hygiene-kits"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Care Packages
              </Link>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&q=80",
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80",
                ].map((src, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={src} alt="Customer" fill className="object-cover" sizes="32px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">200,000+ happy customers</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80"
                  alt="Facial devices"
                  fill
                  className="object-cover"
                  sizes="250px"
                  priority
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80"
                  alt="Oral care"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80"
                  alt="Skincare kits"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80"
                  alt="Body care"
                  fill
                  className="object-cover"
                  sizes="250px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            { icon: <Shield className="w-4 h-4 text-pink-500" />, text: "Dermatologist Tested" },
            { icon: <RefreshCw className="w-4 h-4 text-pink-500" />, text: "30-Day Money Back" },
            { icon: <Zap className="w-4 h-4 text-pink-500" />, text: "Fast 3–5 Day Shipping" },
            { icon: <Star className="w-4 h-4 text-pink-500" />, text: "4.8/5 Average Rating" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2">
              {b.icon}
              <span className="text-sm text-gray-600 font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-1">Browse By</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Collections</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-shadow"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-semibold leading-tight">{c.name}</p>
                <p className="text-pink-200 text-xs">{c.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="bg-gradient-to-b from-pink-50/50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-1">Most Popular</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Sellers</h2>
            </div>
            <Link
              href="/collections/facial-devices"
              className="text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
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
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-4 left-10 w-56 h-56 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative px-8 py-12 sm:px-12 sm:py-16 grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-pink-100 text-sm font-medium mb-2">Complete Routine</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Get Your Full<br />Glow-Up Package
              </h2>
              <p className="text-pink-100 mt-3 text-sm leading-relaxed">
                Everything from facial devices to oral care — bundled at up to 60% off. Build your complete beauty routine in one cart.
              </p>
              <Link
                href="/collections/hygiene-kits"
                className="inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-xl text-sm font-bold mt-6 transition-colors"
              >
                Shop Care Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&q=80",
                "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200&q=80",
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80",
              ].map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square shadow-md">
                  <Image src={src} alt="" fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-1">Reviews</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Customers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sophia M.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
                rating: 5,
                text: "The LED mask changed my skin completely. I had stubborn acne for years and after 3 weeks my skin is clearer than ever!",
                product: "7-Color LED Light Therapy Face Mask",
              },
              {
                name: "Jessica L.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
                rating: 5,
                text: "The skincare routine kit is incredible value. 12 full-size products and everything works beautifully together.",
                product: "Complete AM/PM Skincare Routine Kit",
              },
              {
                name: "Aisha K.",
                avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&q=80",
                rating: 5,
                text: "Water flosser is a game changer. My dentist noticed the improvement! Teeth whitening kit gave results in under a week.",
                product: "Cordless Water Flosser",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs text-pink-500 mt-2 font-medium">{t.product}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                  <span className="ml-auto text-xs text-green-500 font-medium">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
