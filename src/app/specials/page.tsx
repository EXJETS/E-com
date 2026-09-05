import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Tag } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { CTABanner, PageHero, SectionHeading } from "@/components/ui";
import { offers } from "@/lib/offers";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Current HVAC Specials & Coupons | Dallas–Fort Worth",
  description:
    "Seasonal savings on AC tune-ups, repairs, system installation, ductwork and indoor air quality across DFW. Short terms, printed on the page.",
  path: "/specials",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Specials", path: "/specials" },
];

export default function SpecialsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Current specials"
        title="Savings on the work DFW homes actually need"
        intro="We would rather run a handful of genuine offers than a permanent sale. Every term is printed below — mention the offer when you call or note it on the booking form."
        trail={trail}
      />

      <div className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div key={offer.id} className="card flex flex-col overflow-hidden">
                <div className="ground-navy relative px-6 py-7">
                  <div className="ground-grid absolute inset-0" aria-hidden="true" />
                  <div className="relative">
                    <span className="chip chip-light">
                      <Tag size={12} /> {offer.service}
                    </span>
                    <p className="mt-4 font-[family-name:var(--font-display)] text-[38px] font-bold leading-none text-white">
                      {offer.value}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="h-card">{offer.headline}</h2>
                  <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-body">{offer.detail}</p>
                  <p className="mt-5 border-t border-line-soft pt-4 text-[12px] leading-relaxed text-muted">
                    {offer.terms}
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Link href="/schedule" className="btn btn-primary flex-1 !py-3 !text-sm">
                      Claim it
                    </Link>
                    <Link href={offer.href} className="btn btn-outline !py-3 !text-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-line bg-surface-alt p-7">
            <h2 className="text-[18px] font-bold text-ink">The small print, in plain language</h2>
            <ul className="mt-4 grid gap-2.5 text-[14px] leading-relaxed text-body sm:grid-cols-2">
              <li>One offer per visit — they do not stack with each other.</li>
              <li>Mention the offer when booking; we cannot apply it after an invoice is settled.</li>
              <li>Offers apply to residential work at a single address unless stated otherwise.</li>
              <li>Financing offers are subject to credit approval and the lender&rsquo;s terms.</li>
              <li>Equipment offers depend on availability of the qualifying models.</li>
              <li>We will always tell you if a standard price beats an offer for your situation.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="Better than a coupon"
            title="Membership beats a one-off discount"
            intro="The Comfort Club includes two tune-ups a year and takes 15–20% off every repair — which for most households is worth more over a year than any single offer on this page."
            align="center"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/membership" className="btn btn-cool">
              Compare membership plans
            </Link>
            <a href={site.phone.href} className="btn btn-outline">
              <Phone size={16} /> {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
