import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { CTABanner, PageHero } from "@/components/ui";
import { generalFaqs } from "@/lib/offers";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC FAQ | Pricing, Scheduling & Warranties in DFW",
  description:
    "Answers to the questions Dallas–Fort Worth homeowners ask most: how fast we can arrive, how we price, warranty cover, permits and financing.",
  path: "/faq",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  // Two representative questions per service, so the page is a genuine hub
  // rather than a duplicate of the service pages.
  const serviceFaqs = services.map((s) => ({ service: s, faqs: s.faqs.slice(0, 2) }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(trail),
          faqJsonLd([...generalFaqs, ...serviceFaqs.flatMap((g) => g.faqs)]),
        ]}
      />
      <PageHero
        eyebrow="FAQ"
        title="Questions we answer several times a day"
        intro="If yours is not here, a dispatcher can usually settle it in under two minutes on the phone."
        trail={trail}
      />

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="eyebrow mb-3">Jump to</p>
              <ul className="space-y-1.5 text-[14px]">
                <li>
                  <a href="#general" className="text-body transition-colors hover:text-cool-600">
                    General questions
                  </a>
                </li>
                {serviceFaqs.map((g) => (
                  <li key={g.service.slug}>
                    <a href={`#${g.service.slug}`} className="text-body transition-colors hover:text-cool-600">
                      {g.service.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={site.phone.href} className="btn btn-cool mt-6 w-full !py-3 !text-sm">
                <Phone size={15} /> {site.phone.display}
              </a>
            </div>
          </aside>

          <div className="space-y-14">
            <section id="general" className="scroll-mt-28">
              <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold">
                General questions
              </h2>
              <div className="mt-6">
                <Accordion items={generalFaqs} />
              </div>
            </section>

            {serviceFaqs.map((g) => (
              <section key={g.service.slug} id={g.service.slug} className="scroll-mt-28">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold">
                    {g.service.name}
                  </h2>
                  <Link
                    href={`/services/${g.service.slug}`}
                    className="text-[13.5px] font-semibold text-cool-600 hover:underline"
                  >
                    Full service details →
                  </Link>
                </div>
                <div className="mt-6">
                  <Accordion items={g.faqs} defaultOpen={null} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <CTABanner />
    </>
  );
}
