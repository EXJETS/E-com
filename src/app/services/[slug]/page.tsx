import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Phone } from "lucide-react";
import Accordion from "@/components/Accordion";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import ServiceCard from "@/components/ServiceCard";
import ServiceIcon from "@/components/ServiceIcon";
import ReviewCard from "@/components/ReviewCard";
import { CheckList, PageHero, SectionHeading } from "@/components/ui";
import { getService, services } from "@/lib/services";
import { featuredAreas } from "@/lib/areas";
import { reviews } from "@/lib/reviews";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return pageMetadata({ title: "Service not found", description: "", path: "/services", noIndex: true });

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    brandSuffix: false,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  const related = service.related
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(trail),
          serviceJsonLd({
            name: service.name,
            description: service.metaDescription,
            path: `/services/${service.slug}`,
            serviceType: service.name,
          }),
          faqJsonLd(service.faqs),
        ]}
      />

      <PageHero eyebrow={service.tagline} title={service.name} intro={service.intro} trail={trail}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phone.href} className="btn btn-primary !py-4 !text-base">
            <Phone size={18} /> {site.phone.display}
          </a>
          <Link href="/schedule" className="btn btn-ghost-light !py-4 !text-base">
            Book this service
          </Link>
        </div>
      </PageHero>

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          {/* Main column */}
          <article>
            {/* Signals */}
            <section className="card border-cool-400/40 bg-surface-tint/40 p-6 sm:p-8">
              <h2 className="flex items-center gap-2.5 text-[19px] font-bold text-ink">
                <AlertTriangle size={19} className="text-ember-500" />
                Call us when you notice
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {service.signals.map((sig) => (
                  <li key={sig} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-body">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                    {sig}
                  </li>
                ))}
              </ul>
            </section>

            {/* Long-form sections */}
            <div className="prose-body mt-12">
              {service.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Includes */}
            <section className="mt-12 rounded-2xl border border-line bg-surface-alt p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-cool-600">
                  <ServiceIcon slug={service.slug} />
                </span>
                <h2 className="text-[19px] font-bold text-ink">What every visit includes</h2>
              </div>
              <div className="mt-6">
                <CheckList items={service.includes} />
              </div>
              <p className="mt-6 border-t border-line pt-5 text-[14px] leading-relaxed text-body">
                <strong className="font-semibold text-ink">Pricing:</strong> {service.priceNote}
              </p>
            </section>

            {/* FAQ */}
            <section className="mt-14">
              <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold">
                {service.name}: common questions
              </h2>
              <div className="mt-6">
                <Accordion items={service.faqs} />
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingForm defaultService={service.slug} compact />

            <div className="card mt-5 p-6">
              <p className="eyebrow mb-3">Where we work</p>
              <p className="text-[14px] leading-relaxed text-body">
                {service.name} across {featuredAreas.length}+ DFW cities, dispatched from Dallas, Arlington
                and McKinney.
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {featuredAreas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/service-areas/${a.slug}`}
                      className="inline-block rounded-full border border-line px-2.5 py-1 text-[12.5px] text-body transition-colors hover:border-cool-400 hover:text-cool-600"
                    >
                      {a.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Reviews */}
      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading eyebrow="Recent feedback" title="What customers say about this work" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.quote} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-tight">
          <div className="container-page">
            <SectionHeading eyebrow="Related" title="You may also need" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ServiceCard key={r.slug} service={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
