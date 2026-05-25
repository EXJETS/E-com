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
  return { title: `${collection.name} | NexHome`, description: collection.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getCollectionById(id);
  if (!collection) notFound();

  const products = getProductsByCollection(id);

  return (
    <div className="bg-white pt-[var(--nav-h)]">

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[var(--dark)]" style={{ minHeight: 280 }}>
        <div className="absolute inset-0">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-25"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark)]/90 to-[var(--dark)]/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">{collection.name}</span>
          </nav>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
            Category
          </p>
          <h1
            className="font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {collection.name}
          </h1>
          <p className="text-white/50 max-w-lg leading-relaxed text-[15px]">{collection.description}</p>
          <p className="text-white/30 text-sm mt-3 font-medium">{products.length} products</p>
        </div>
      </div>

      {/* ── Category nav tabs ────────────────────────────────────────── */}
      <div className="border-b border-[var(--border)] bg-white sticky top-[var(--nav-h)] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded text-xs font-semibold tracking-wide transition-all duration-200 ${
                  c.id === id
                    ? "bg-[var(--dark)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-[var(--light)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products grid ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
