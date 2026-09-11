import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts, getCollectionById } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Shield, Truck, RotateCcw, Check, BadgeCheck, ChevronRight } from "lucide-react";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} | GlowCart`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related   = getRelatedProducts(product, 4);
  const collection = getCollectionById(product.collection);
  const discount   = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const savings    = (product.originalPrice - product.price).toFixed(2);

  return (
    <div className="bg-[var(--cream)]">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          {collection && (
            <>
              <Link href={`/collections/${collection.id}`} className="hover:text-[var(--accent)] transition-colors">
                {collection.name}
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
            </>
          )}
          <span className="text-[var(--body)] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ── Product detail ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid lg:grid-cols-2 gap-12 lg:gap-20">

        {/* ── Left: Image ── */}
        <div className="relative">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.badge && (
              <span className="bg-[var(--charcoal)] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase">
                {product.badge}
              </span>
            )}
          </div>
          <span className="absolute top-4 right-4 z-10 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>

          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--sand)] shadow-2xl ring-1 ring-[var(--border)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Savings pill below image */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full">
              <BadgeCheck className="w-3.5 h-3.5" />
              You save ${savings} off retail price
            </span>
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex flex-col">
          {/* Category */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
            {product.category}
          </p>

          {/* Name */}
          <h1 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold italic leading-snug tracking-tight text-[var(--charcoal)]">
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-[var(--charcoal)]">{product.rating}</span>
            <span className="text-sm text-[var(--muted)]">({product.reviews.toLocaleString()} reviews)</span>
            <span className="ml-auto text-xs text-[var(--muted)]">{product.sold.toLocaleString()}+ sold</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-[var(--border)]">
            <span className="text-4xl font-bold text-[var(--charcoal)]">${product.price.toFixed(2)}</span>
            <span className="text-xl text-[var(--muted)] line-through">${product.originalPrice.toFixed(2)}</span>
          </div>

          {/* Description */}
          <p className="mt-6 text-[var(--body)] leading-relaxed text-[14px]">{product.description}</p>

          {/* Features */}
          <div className="mt-6 space-y-3">
            {product.features.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-[var(--accent-bg)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-[var(--accent)]" />
                </div>
                <span className="text-sm text-[var(--body)]">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <ProductActions product={product} />
          </div>

          {/* Delivery info */}
          <div className={`mt-6 rounded-2xl border p-4 flex items-start gap-3 ${product.shipsFrom === "US" ? "bg-emerald-50 border-emerald-200" : "bg-[var(--sand)] border-[var(--border)]"}`}>
            <Truck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${product.shipsFrom === "US" ? "text-emerald-600" : "text-[var(--accent)]"}`} />
            <div>
              <p className={`text-xs font-bold ${product.shipsFrom === "US" ? "text-emerald-700" : "text-[var(--charcoal)]"}`}>
                {product.shipsFrom === "US" ? "🇺🇸 Ships from US Warehouse" : "Ships from Overseas Warehouse"}
              </p>
              <p className="text-xs text-[var(--body)] mt-0.5">
                Estimated delivery: <span className="font-semibold">{product.deliveryDays} business days</span>
                {" "}· Fulfilled by <span className="font-medium">{product.supplier}</span>
              </p>
              <p className="text-[11px] text-[var(--muted)] mt-1">
                Tracking number provided within 24–48hrs of dispatch
              </p>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Truck,      label: "Free Shipping",  sub: "Orders $50+" },
              { icon: RotateCcw,  label: "30-Day Returns", sub: "Hassle-free" },
              { icon: Shield,     label: "Secure Pay",     sub: "SSL encrypted" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center bg-[var(--sand)] border border-[var(--border)] rounded-xl py-4 px-2 gap-2">
                <Icon className="w-4 h-4 text-[var(--accent)]" />
                <p className="text-xs font-semibold text-[var(--charcoal)] leading-tight">{label}</p>
                <p className="text-[10px] text-[var(--muted)]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Verified */}
          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]">
            <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            Dermatologist tested &mdash; verified authentic ingredients
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--sand)] py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-2">
                  You May Also Like
                </p>
                <h2 className="font-display text-3xl italic font-semibold text-[var(--charcoal)]">
                  Related Products
                </h2>
              </div>
              {collection && (
                <Link href={`/collections/${collection.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] flex items-center gap-1.5 font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to {collection.name}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
