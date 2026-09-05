import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Baker Brothers | Dallas, Arlington & McKinney",
  description:
    "Reach Baker Brothers Plumbing, Air & Electric — phone, email and our three DFW service centres. 24/7 emergency dispatch.",
  path: "/contact",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Contact"
        title="Get hold of a real person"
        intro="Calls are answered by a dispatcher, not a menu tree. If it is an emergency, the phone will always be faster than a form."
        trail={trail}
      />

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="space-y-5">
            <div className="card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-tint text-cool-600">
                <Phone size={20} />
              </span>
              <h2 className="h-card mt-5">Call us</h2>
              <a
                href={site.phone.href}
                className="mt-2 block font-[family-name:var(--font-display)] text-[30px] font-bold text-ink hover:text-cool-600"
              >
                {site.phone.display}
              </a>
              <p className="mt-2 text-[14px] text-body">{site.hours.label}</p>
            </div>

            <div className="card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-tint text-cool-600">
                <Mail size={20} />
              </span>
              <h2 className="h-card mt-5">Email</h2>
              <a href={`mailto:${site.email}`} className="mt-2 block text-[16px] font-semibold text-cool-600 hover:underline">
                {site.email}
              </a>
              <p className="mt-2 text-[14px] text-body">
                Best for billing questions, documentation requests and anything that is not urgent. We reply
                within one business day.
              </p>
            </div>

            <div className="card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-tint text-cool-600">
                <Clock size={20} />
              </span>
              <h2 className="h-card mt-5">Opening hours</h2>
              <dl className="mt-3 space-y-2 text-[14.5px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Monday – Friday</dt>
                  <dd className="font-semibold text-ink">{site.hours.weekday}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Saturday – Sunday</dt>
                  <dd className="font-semibold text-ink">{site.hours.weekend}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line-soft pt-2">
                  <dt className="text-body">Emergency dispatch</dt>
                  <dd className="font-semibold text-ember-600">24/7/365</dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <BookingForm />
          </div>
        </div>
      </div>

      <section className="section-tight bg-surface-alt">
        <div className="container-page">
          <h2 className="h-section">Our service centres</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {site.locations.map((l) => (
              <div key={l.id} className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-cool-600">
                  <MapPin size={18} />
                </span>
                <h3 className="h-card mt-4">{l.label}</h3>
                <address className="mt-2 not-italic text-[14px] leading-relaxed text-body">
                  {l.street}
                  <br />
                  {l.city}, {l.state} {l.zip}
                </address>
                <a
                  href={l.phone.href}
                  className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-cool-600 hover:underline"
                >
                  <Phone size={14} /> {l.phone.display}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[14px] text-body">
            Not sure whether you are in our area?{" "}
            <Link href="/service-areas" className="font-semibold text-cool-600 hover:underline">
              Check the full service-area list
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
