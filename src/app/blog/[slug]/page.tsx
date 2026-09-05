import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import PostBody from "@/components/PostBody";
import { Breadcrumbs, SectionHeading } from "@/components/ui";
import { getPost, posts, sortedPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return pageMetadata({ title: "Article not found", description: "", path: "/blog", noIndex: true });

  return pageMetadata({
    title: post.metaTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    brandSuffix: false,
    type: "article",
    publishedTime: post.date,
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "HVAC Advice", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const more = sortedPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(trail),
          articleJsonLd({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            date: post.date,
            updated: post.updated,
          }),
        ]}
      />

      <section className="ground-navy relative overflow-hidden">
        <div className="ground-grid absolute inset-0" aria-hidden="true" />
        <div className="container-page relative py-12 lg:py-16">
          <Breadcrumbs trail={trail} />
          <span className="chip chip-light">{post.category}</span>
          <h1 className="h-display mt-5 max-w-3xl !text-white">{post.title}</h1>
          <p className="mt-5 text-[13px] text-white/50">
            Published {dateFormat.format(new Date(post.date))} · {post.readingMinutes} min read · by{" "}
            {site.legalName}
          </p>
        </div>
      </section>

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <article>
            <p className="lede border-l-2 border-cool-500 pl-5 text-ink">{post.description}</p>
            <div className="mt-10">
              <PostBody body={post.body} />
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-surface-alt p-7">
              <h2 className="text-[19px] font-bold text-ink">Want a technician to look at it?</h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-body">
                We diagnose before we price, and you approve the flat rate before anything starts. Same-day
                windows across Dallas–Fort Worth.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={site.phone.href} className="btn btn-primary">
                  <Phone size={16} /> {site.phone.display}
                </a>
                <Link href="/schedule" className="btn btn-outline">
                  Book online
                </Link>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="eyebrow mb-4">Keep reading</p>
              <ul className="space-y-4">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group block">
                      <span className="block text-[14.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-cool-600">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-[12.5px] text-muted">
                        {p.category} · {p.readingMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading eyebrow="More advice" title="Other articles worth your time" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover group flex flex-col p-6">
                <span className="chip">{p.category}</span>
                <h3 className="h-card mt-4 transition-colors group-hover:text-cool-600">{p.title}</h3>
                <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-body">{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
