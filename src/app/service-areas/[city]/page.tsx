import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, Route } from "lucide-react";
import Accordion from "@/components/Accordion";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import ReviewCard from "@/components/ReviewCard";
import ServiceCard from "@/components/ServiceCard";
import { CheckList, PageHero, SectionHeading } from "@/components/ui";
import { areas, getArea } from "@/lib/areas";
import { services } from "@/lib/services";
import { reviews } from "@/lib/reviews";
import { site } from "@/lib/site";
import { SITE_URL, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return pageMetadata({ title: "Area not found", description: "", path: "/service-areas", noIndex: true });

  return pageMetadata({
    title: `HVAC Repair & AC Service in ${area.city}, TX`,
    description: `Same-day air conditioning and heating service in ${area.city}, ${area.county}. Licensed technicians, flat-rate pricing, no overtime charges. Call ${site.phone.display}.`,
    path: `/service-areas/${area.slug}`,
    brandSuffix: false,
  });
}

export default async function AreaPage({ params }: Props) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();

  const office = site.locations.find((l) => l.id === area.nearestOffice) ?? site.locations[0];

  const trail = [
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/service-areas" },
    { name: area.city, path: `/service-areas/${area.slug}` },
  ];

  const localFaqs = [
    {
      q: `How fast can you get to ${area.city}?`,
      a: `${area.city} is dispatched from our ${office.label} service centre. Calls placed before 2:00 PM usually get a same-day arrival window, and we run 24/7 emergency dispatch for no-cooling and no-heat calls.`,
    },
    {
      q: `Do you charge more for service in ${area.city}?`,
      a: `No. Our flat-rate pricing is identical across every city we serve, and there is no trip charge or distance surcharge inside our service area.`,
    },
    {
      q: `Which ZIP codes in ${area.city} do you cover?`,
      a: `We cover all of ${area.city}, including ${area.zips.join(", ")}. If your ZIP is not listed, call us — the list is representative, not exhaustive.`,
    },
    {
      q: `Are you licensed to work in ${area.county}?`,
      a: `Yes. We hold Texas state HVAC, plumbing and electrical licences (${site.licenses.join(", ")}) and pull local permits for every municipality in ${area.county} that requires one.`,
    },
  ];

  const nearby = areas.filter((a) => a.region === area.region && a.slug !== area.slug).slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(trail),
          faqJsonLd(localFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `HVAC Repair and Installation in ${area.city}, TX`,
            serviceType: "HVAC Service",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: { "@type": "City", name: `${area.city}, TX`, containedInPlace: { "@type": "AdministrativeArea", name: area.county } },
            url: `${SITE_URL}/service-areas/${area.slug}`,
          },
        ]}
      />

      <PageHero
        eyebrow={`${area.county} · Texas`}
        title={`HVAC Repair & AC Service in ${area.city}, TX`}
        intro={area.blurb}
        trail={trail}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phone.href} className="btn btn-primary !py-4 !text-base">
            <Phone size={18} /> {site.phone.display}
          </a>
          <Link href="/schedule" className="btn btn-ghost-light !py-4 !text-base">
            Book online
          </Link>
        </div>

        <dl className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div>
            <dt className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              <MapPin size={13} /> Dispatched from
            </dt>
            <dd className="mt-2 text-[15px] font-semibold text-white">{office.label} service centre</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              <Clock size={13} /> Availability
            </dt>
            <dd className="mt-2 text-[15px] font-semibold text-white">Same-day · 24/7 emergency</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              <Route size={13} /> ZIP codes
            </dt>
            <dd className="mt-2 text-[15px] font-semibold text-white">{area.zips.join(" · ")}</dd>
          </div>
        </dl>
      </PageHero>

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <article>
            <div className="prose-body">
              <h2>What we see in {area.city} homes</h2>
              <p>{area.housing}</p>
              <p>
                That matters because the right fix depends on the house, not just the equipment. A
                technician who arrives already knowing what {area.city} construction tends to do wrong
                spends the visit measuring the things that are likely to be the problem, rather than
                working through a generic checklist.
              </p>

              <h2>Same-day service from our {office.label} centre</h2>
              <p>
                {area.city} is covered by our {office.label} service centre at {office.street},{" "}
                {office.city}. Short drive times are the reason we can offer genuine same-day arrival
                windows rather than a vague promise of &ldquo;sometime this week&rdquo;. You get a
                two-hour window, a text when the technician is en route, and their name and photo before
                they knock.
              </p>
              <p>
                Emergency dispatch runs 24 hours a day, every day of the year — and the price does not
                change because it is a Sunday night. There is no overtime multiplier on our rate card.
              </p>

              <h2>Pricing in {area.city}</h2>
              <p>
                Flat rate, quoted per job, approved before any work starts. There is no trip charge and no
                distance surcharge anywhere in our service area, so a call from {area.city} costs the same
                as one from our own street. If a difficult diagnosis takes an extra hour, that is our
                problem, not your invoice.
              </p>
            </div>

            <section className="mt-12 rounded-2xl border border-line bg-surface-alt p-6 sm:p-8">
              <h2 className="text-[19px] font-bold text-ink">Every {area.city} visit includes</h2>
              <div className="mt-6">
                <CheckList
                  items={[
                    "A licensed, background-checked technician in a marked vehicle",
                    "A two-hour arrival window and an en-route text",
                    "Full system diagnosis before any price is quoted",
                    "Written flat-rate pricing you approve in advance",
                    `Local permits pulled for ${area.county} where the work requires them`,
                    "One-year warranty on parts and labour we supply",
                  ]}
                />
              </div>
            </section>

            <section className="mt-14">
              <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold">
                {area.city} HVAC questions
              </h2>
              <div className="mt-6">
                <Accordion items={localFaqs} />
              </div>
            </section>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingForm compact />

            <div className="card mt-5 p-6">
              <p className="eyebrow mb-3">Nearby cities</p>
              <ul className="flex flex-wrap gap-1.5">
                {nearby.map((a) => (
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
              <Link href="/service-areas" className="mt-4 inline-block text-[13px] font-semibold text-cool-600 hover:underline">
                All service areas →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow={`Services in ${area.city}`}
            title="What we can do at your address"
            intro="Every service below is available across the whole metroplex, at the same flat rate."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/services" className="btn btn-outline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-page">
          <SectionHeading eyebrow="Nearby feedback" title="What DFW homeowners say" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(1, 4).map((r) => (
              <ReviewCard key={r.quote} review={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
