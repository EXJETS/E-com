import { notFound } from "next/navigation";
import { collections, getCollectionById, getProductsByCollection } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getCollectionById(id);
  if (!collection) return {};
  return { title: `${collection.name} | GlowCart`, description: collection.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params;
  const collection = getCollectionById(id);
  if (!collection) notFound();

  const products = getProductsByCollection(id);

  return (
    <div className="bg-[var(--cream)]">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden bg-[var(--charcoal)]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--charcoal)]/90 to-[var(--charcoal)]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-200">{collection.name}</span>
          </nav>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400 mb-3">Collection</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] italic font-semibold text-white leading-tight mb-4">
            {collection.name}
          </h1>
          <p className="text-stone-300 max-w-lg leading-relaxed text-[15px]">{collection.description}</p>
          <p className="text-stone-500 text-sm mt-3 font-medium">{products.length} products</p>
        </div>
      </div>

      {/* ── Collection tabs ── */}
      <div className="border-b border-[var(--border)] bg-white sticky top-[calc(var(--navbar-h,0px))] z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  c.id === id
                    ? "bg-[var(--charcoal)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--charcoal)] hover:bg-[var(--sand)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
