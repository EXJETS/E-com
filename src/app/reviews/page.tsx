import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ReviewCard from "@/components/ReviewCard";
import { CTABanner, PageHero, SectionHeading } from "@/components/ui";
import { reviewPlatforms, reviews } from "@/lib/reviews";
import { areas } from "@/lib/areas";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Customer Reviews | Baker Brothers HVAC Dallas–Fort Worth",
  description:
    "What Dallas–Fort Worth homeowners say about our AC repair, heating service and system installation work.",
  path: "/reviews",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Reviews"
        title="Eight decades of word of mouth"
        intro="A trades business in a city this connected lives or dies on what neighbours tell each other. These are the things customers mention most often."
        trail={trail}
      >
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8">
          {reviewPlatforms.map((p) => (
            <div key={p.name}>
              <div className="flex items-center gap-2">
                <Star size={17} className="fill-ember-500 text-ember-500" />
                <span className="font-[family-name:var(--font-display)] text-[28px] font-bold leading-none text-white">
                  {p.score}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-white/55">
                {p.name} · {p.count}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <div className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.quote} review={r} />
            ))}
          </div>

          {/*
            Implementation note for launch: replace the array in lib/reviews.ts
            with a live feed (Google Business Profile API or a review widget) and
            only then add aggregateRating structured data — see lib/seo.ts.
          */}
          <p className="mx-auto mt-12 max-w-2xl rounded-xl border border-line bg-surface-alt p-5 text-center text-[13.5px] leading-relaxed text-muted">
            We publish reviews as customers leave them, unedited. If something went wrong on your visit, we
            would rather hear it from you first —{" "}
            <Link href="/contact" className="font-semibold text-cool-600 hover:underline">
              tell us directly
            </Link>{" "}
            and we will make it right.
          </p>
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="Across the metroplex"
            title="Serving neighbours in every corner of DFW"
            align="center"
          />
          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/service-areas/${a.slug}`}
                  className="inline-block rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-body transition-colors hover:border-cool-400 hover:text-cool-600"
                >
                  {a.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
