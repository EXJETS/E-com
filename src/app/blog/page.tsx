import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { CTABanner, PageHero } from "@/components/ui";
import { sortedPosts } from "@/lib/posts";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC Advice for North Texas Homeowners",
  description:
    "Practical heating and cooling guidance written for the DFW climate — troubleshooting, sizing, maintenance calendars and honest cost breakdowns.",
  path: "/blog",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "HVAC Advice", path: "/blog" },
];

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function BlogIndex() {
  const [lead, ...rest] = sortedPosts;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="HVAC advice"
        title="Straight answers about heating and cooling in North Texas"
        intro="Written by the people who run the service calls. No affiliate links, no manufacturer talking points — just what we actually find in DFW homes and what to do about it."
        trail={trail}
      />

      <div className="section">
        <div className="container-page">
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="card card-hover group mb-10 grid gap-8 p-7 lg:grid-cols-[1fr_0.8fr] lg:p-10"
            >
              <div>
                <span className="chip">{lead.category}</span>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[28px] font-bold leading-tight transition-colors group-hover:text-cool-600 lg:text-[34px]">
                  {lead.title}
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-body">{lead.description}</p>
                <p className="mt-5 text-[13px] text-muted">
                  {dateFormat.format(new Date(lead.date))} · {lead.readingMinutes} min read
                </p>
              </div>
              <div className="hidden items-center justify-center rounded-xl bg-surface-tint lg:flex">
                <span className="font-[family-name:var(--font-display)] text-[13px] font-bold uppercase tracking-[0.2em] text-cool-600">
                  Latest
                </span>
              </div>
            </Link>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover group flex flex-col p-6">
                <span className="chip">{post.category}</span>
                <h2 className="h-card mt-4 transition-colors group-hover:text-cool-600">{post.title}</h2>
                <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-body">{post.description}</p>
                <p className="mt-5 text-[12.5px] text-muted">
                  {dateFormat.format(new Date(post.date))} · {post.readingMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CTABanner />
    </>
  );
}
