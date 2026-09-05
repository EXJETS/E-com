import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { CTABanner, PageHero, SectionHeading } from "@/components/ui";
import { areas, regions } from "@/lib/areas";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC Service Areas Across Dallas–Fort Worth",
  description:
    "Baker Brothers serves 35+ cities across Dallas, Collin, Tarrant, Denton, Rockwall and Kaufman counties from three DFW service centres.",
  path: "/service-areas",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Service Areas", path: "/service-areas" },
];

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Service areas"
        title={`Heating and cooling across ${areas.length} DFW cities`}
        intro="Three service centres — Dallas, Arlington and McKinney — keep drive times short, which is why same-day arrival windows are realistic here rather than aspirational."
        trail={trail}
      />

      {/* Service centres */}
      <section className="border-b border-line bg-surface-alt">
        <div className="container-page grid gap-6 py-10 md:grid-cols-3">
          {site.locations.map((l) => (
            <div key={l.id} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-tint text-cool-600">
                <MapPin size={18} />
              </span>
              <h2 className="h-card mt-4">{l.label} Service Centre</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-body">
                {l.street}
                <br />
                {l.city}, {l.state} {l.zip}
              </p>
              <a
                href={l.phone.href}
                className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-cool-600 hover:underline"
              >
                <Phone size={14} /> {l.phone.display}
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="section">
        <div className="container-page space-y-14">
          {regions.map((region) => {
            const list = areas.filter((a) => a.region === region);
            return (
              <section key={region} aria-labelledby={`region-${region}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                  <h2
                    id={`region-${region}`}
                    className="font-[family-name:var(--font-display)] text-[24px] font-bold"
                  >
                    {region}
                  </h2>
                  <span className="text-[13px] text-muted">{list.length} cities</span>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/service-areas/${a.slug}`}
                        className="card card-hover group flex items-center justify-between gap-3 px-5 py-4"
                      >
                        <span>
                          <span className="block text-[15.5px] font-bold text-ink transition-colors group-hover:text-cool-600">
                            {a.city}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-muted">{a.county}</span>
                        </span>
                        <span className="text-[12px] text-muted">{a.zips[0]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="Not on the list?"
            title="Call and ask — the boundary moves"
            intro="We add cities as our routes grow, and we will always tell you honestly if you are outside a range where we can give you a service window worth having."
            align="center"
          />
          <div className="mt-8 text-center">
            <a href={site.phone.href} className="btn btn-primary">
              <Phone size={17} /> {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
