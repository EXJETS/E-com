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
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{collection.name}</h1>
          <p className="text-gray-500 mt-2 max-w-xl">{collection.description}</p>
          <p className="text-sm text-pink-500 font-medium mt-1">{products.length} products</p>
        </div>
      </div>

      {/* Browse other collections */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-2 overflow-x-auto">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.id}`}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              c.id === id
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-600"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
