import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts, getCollectionById } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Shield, Truck, RotateCcw, Check, BadgeCheck } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | GlowCart`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const collection = getCollectionById(product.collection);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-7">
        <nav className="flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <span>/</span>
          {collection && (
            <>
              <Link href={`/collections/${collection.id}`} className="hover:text-rose-500 transition-colors">
                {collection.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-stone-700 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-14 lg:gap-20">
        {/* Image */}
        <div className="relative">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
              {product.badge}
            </span>
          )}
          <span className="absolute top-4 right-4 z-10 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-50 shadow-xl border border-stone-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-snug tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-stone-700">{product.rating}</span>
            <span className="text-sm text-stone-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>
          <p className="text-xs text-stone-400 mt-1">{product.sold.toLocaleString()}+ units sold</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-stone-100">
            <span className="text-4xl font-bold text-stone-900">${product.price.toFixed(2)}</span>
            <span className="text-lg text-stone-400 line-through">${product.originalPrice.toFixed(2)}</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-semibold tracking-wide">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-5 text-stone-500 leading-relaxed text-sm">{product.description}</p>

          {/* Features */}
          <div className="mt-5 space-y-2.5">
            {product.features.map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-stone-600">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over $50" },
              { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free" },
              { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center bg-stone-50 border border-stone-100 rounded-xl p-3 gap-1.5">
                <Icon className="w-4 h-4 text-rose-500" />
                <p className="text-xs font-semibold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* Verified badge */}
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            Dermatologist tested &mdash; verified authentic
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-stone-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">You May Also Like</p>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">Related Products</h2>
            </div>
            {collection && (
              <Link
                href={`/collections/${collection.id}`}
                className="text-sm text-stone-400 hover:text-rose-500 flex items-center gap-1.5 font-medium transition-colors"
              >
                View collection <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
