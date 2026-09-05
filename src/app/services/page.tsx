import type { Metadata } from "next";
import Link from "next/link";
import { CTABanner, PageHero, SectionHeading } from "@/components/ui";
import ServiceCard from "@/components/ServiceCard";
import JsonLd from "@/components/JsonLd";
import { serviceCategories, services, servicesByCategory } from "@/lib/services";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC Services in Dallas–Fort Worth",
  description:
    "Air conditioning repair and installation, heating service, indoor air quality, ductwork and 24/7 emergency HVAC across the DFW metroplex.",
  path: "/services",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Services"
        title="Everything that keeps a North Texas home comfortable"
        intro="Heating and cooling is the core of what we do. Because the same crew is licensed for plumbing and electrical, a job that crosses trades does not mean a second company and a second appointment."
        trail={trail}
      />

      <div className="section">
        <div className="container-page space-y-16">
          {serviceCategories.map((cat) => {
            const list = servicesByCategory(cat.id);
            if (list.length === 0) return null;
            return (
              <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <h2 id={`cat-${cat.id}`} className="font-[family-name:var(--font-display)] text-[26px] font-bold">
                      {cat.label}
                    </h2>
                    <p className="mt-1.5 text-[15px] text-body">{cat.blurb}</p>
                  </div>
                  <span className="text-[13px] text-muted">
                    {list.length} service{list.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s) => (
                    <ServiceCard key={s.slug} service={s} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="Not sure which one?"
            title="Describe the symptom and we'll work out the rest"
            intro="You do not need to diagnose your own system before calling. Tell a dispatcher what the house is doing and we will send the right technician with the right parts on the truck."
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/schedule" className="btn btn-primary">
              Book a service call
            </Link>
            <Link href="/faq" className="btn btn-outline">
              Read the FAQ
            </Link>
          </div>
          <p className="mt-10 text-center text-[13px] text-muted">
            Direct links:{" "}
            {services.map((s, i) => (
              <span key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-cool-600 hover:underline">
                  {s.navLabel}
                </Link>
                {i < services.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
