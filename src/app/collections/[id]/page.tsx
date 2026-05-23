import { notFound } from "next/navigation";
import { collections, getCollectionById, getProductsByCollection } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getCollectionById(id);
  if (!collection) return {};
  return {
    title: `${collection.name} | GlowCart`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = getCollectionById(id);
  if (!collection) notFound();

  const products = getProductsByCollection(id);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500 transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-2">{collection.name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">{collection.description}</h1>
          <p className="text-sm text-stone-400 font-medium mt-2">{products.length} products</p>
        </div>
      </div>

      {/* Collection filter tabs */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex gap-2 overflow-x-auto border-b border-stone-100">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.id}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors border tracking-wide ${
              c.id === id
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
