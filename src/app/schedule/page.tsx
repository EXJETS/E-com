import type { Metadata } from "next";
import { Clock, Phone, ShieldCheck, Truck } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book HVAC Service in Dallas–Fort Worth",
  description:
    "Request a service call online. Same-day arrival windows across DFW, flat-rate pricing and 24/7 emergency dispatch.",
  path: "/schedule",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Book Service", path: "/schedule" },
];

const steps = [
  { icon: Clock, title: "We call to confirm", body: "A dispatcher rings you back to lock in a two-hour arrival window that suits you." },
  { icon: Truck, title: "You get an en-route text", body: "With the technician's name and photo, so you know who is knocking." },
  { icon: ShieldCheck, title: "Price before work", body: "Full diagnosis first, then a written flat rate. Nothing starts until you approve it." },
];

export default function SchedulePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow="Book service"
        title="Request a service call"
        intro="Takes about a minute. For an active emergency — no cooling in a heat wave, no heat in a freeze, or any burning smell — please call instead; a dispatcher answers 24/7."
        trail={trail}
      />

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <BookingForm />
          </div>

          <aside className="space-y-6">
            <div className="card p-7">
              <p className="eyebrow mb-2">Faster than the form</p>
              <h2 className="h-card">Call a dispatcher</h2>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">
                A person answers, day or night. If you are without heating or cooling right now, this is
                always the quickest route.
              </p>
              <a href={site.phone.href} className="btn btn-cool mt-5 w-full">
                <Phone size={17} /> {site.phone.display}
              </a>
              <dl className="mt-6 space-y-2 border-t border-line-soft pt-5 text-[13.5px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Mon–Fri</dt>
                  <dd className="font-semibold text-ink">{site.hours.weekday}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Sat–Sun</dt>
                  <dd className="font-semibold text-ink">{site.hours.weekend}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Emergencies</dt>
                  <dd className="font-semibold text-ember-600">24 hours, every day</dd>
                </div>
              </dl>
            </div>

            <div className="card p-7">
              <p className="eyebrow mb-4">What happens next</p>
              <ol className="space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-tint text-cool-600">
                      <s.icon size={17} />
                    </span>
                    <span>
                      <span className="block text-[14.5px] font-bold text-ink">
                        {i + 1}. {s.title}
                      </span>
                      <span className="mt-1 block text-[13.5px] leading-relaxed text-body">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
