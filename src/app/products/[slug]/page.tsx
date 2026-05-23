import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts, getCollectionById } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Shield, Truck, RefreshCw, Check } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
          <span>/</span>
          {collection && (
            <>
              <Link href={`/collections/${collection.id}`} className="hover:text-pink-500 transition-colors">
                {collection.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image */}
        <div className="relative">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <span className="absolute top-4 right-4 z-10 bg-white text-pink-600 text-sm font-bold px-3 py-1 rounded-full border border-pink-100 shadow-sm">
            -{discount}%
          </span>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-lg">
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
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <p className="text-xs text-gray-400 mt-1">{product.sold.toLocaleString()}+ units sold</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            <span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-semibold">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-600 leading-relaxed text-sm">{product.description}</p>

          {/* Features */}
          <div className="mt-5 space-y-2">
            {product.features.map((f) => (
              <div key={f} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
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
              { icon: <Truck className="w-4 h-4" />, label: "Free Shipping", sub: "Orders over $50" },
              { icon: <RefreshCw className="w-4 h-4" />, label: "30-Day Returns", sub: "Hassle-free" },
              { icon: <Shield className="w-4 h-4" />, label: "Secure Pay", sub: "SSL encrypted" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-3 gap-1.5">
                <div className="text-pink-500">{b.icon}</div>
                <p className="text-xs font-semibold text-gray-800">{b.label}</p>
                <p className="text-xs text-gray-500">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
            {collection && (
              <Link
                href={`/collections/${collection.id}`}
                className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1 font-medium"
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
