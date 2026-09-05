import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone } from "lucide-react";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { CTABanner, PageHero, SectionHeading } from "@/components/ui";
import { plans } from "@/lib/offers";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Comfort Club Membership | HVAC Maintenance Plans DFW",
  description:
    "Two precision tune-ups a year, priority scheduling and 15–20% off every repair. HVAC maintenance plans for Dallas–Fort Worth homes from $16 a month.",
  path: "/membership",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Membership", path: "/membership" },
];

const membershipFaqs = [
  {
    q: "What exactly does a membership tune-up cover?",
    a: "The full 26-point precision inspection: refrigerant charge verified by superheat and subcooling, condenser coil wash, capacitor and contactor testing, blower amp draw and static pressure, condensate drain clear and treat, and a thermostat cycle test — with every reading recorded so you can compare year to year.",
  },
  {
    q: "Does the membership pay for itself?",
    a: "For most households, yes, on the first repair. Two tune-ups a year at member rates plus a 15–20% repair discount typically exceeds the annual cost the first time anything needs fixing — and the tune-ups themselves reduce how often that happens.",
  },
  {
    q: "What does priority scheduling actually mean?",
    a: "Members are placed ahead of non-members in the dispatch queue, including during heat waves and freeze events when everyone is calling at once. It does not create technicians out of thin air, but it does decide who gets the next available one.",
  },
  {
    q: "Can I cancel?",
    a: "Any time, with no cancellation fee. If you have already had a tune-up in the current membership year we simply stop the billing going forward.",
  },
  {
    q: "What if I sell the house?",
    a: "The membership transfers to the new owner at no cost, which is a genuine selling point at closing — along with the documented maintenance history we keep on file for your equipment.",
  },
  {
    q: "Does it keep my manufacturer warranty valid?",
    a: "It gives you the documentation to defend it. Nearly every manufacturer parts warranty requires annual professional maintenance, and claims do get denied when a homeowner cannot produce records. We keep yours.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(trail), faqJsonLd(membershipFaqs)]} />
      <PageHero
        eyebrow="Comfort Club"
        title="Maintenance that costs less than the breakdown"
        intro="Almost every no-cooling emergency we attend in July was visible in March as a weak capacitor, a fouled coil or a drain line halfway to blocked. Membership is how you find those in March."
        trail={trail}
      />

      <div className="section">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card relative flex flex-col p-7 ${
                  plan.featured ? "border-cool-500 shadow-[0_20px_50px_-30px_rgba(13,143,212,0.9)] lg:-mt-4 lg:pb-10" : ""
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-cool-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    Most popular
                  </span>
                )}
                <h2 className="font-[family-name:var(--font-display)] text-[22px] font-bold">{plan.name}</h2>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-none text-ink">
                    {plan.price}
                  </span>
                  <span className="text-[14px] text-muted">{plan.cadence}</span>
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-body">{plan.summary}</p>

                <ul className="mt-6 flex-1 space-y-3 border-t border-line-soft pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-body">
                      <Check size={16} className="mt-0.5 shrink-0 text-cool-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={site.phone.href}
                  className={`btn mt-7 w-full ${plan.featured ? "btn-primary" : "btn-outline"}`}
                >
                  {plan.id === "commercial" ? "Request a survey" : "Join by phone"}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-muted">
            Prices shown are per household for residential plans, billed monthly. Additional systems at the
            same address are discounted — ask when you join.
          </p>
        </div>
      </div>

      <section className="section bg-surface-alt">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Questions" title="What members actually ask" />
            <p className="mt-6 text-[15px] leading-relaxed text-body">
              Joining takes about three minutes on the phone and there is no contract term.
            </p>
            <a href={site.phone.href} className="btn btn-cool mt-5">
              <Phone size={16} /> {site.phone.display}
            </a>
            <Link href="/services/ac-maintenance" className="mt-3 block text-[14px] font-semibold text-cool-600 hover:underline">
              See what a precision tune-up covers →
            </Link>
          </div>
          <Accordion items={membershipFaqs} />
        </div>
      </section>

      <CTABanner
        title="Join before the first 100° week."
        body="Spring appointments fill fast, and a tune-up booked in March is worth considerably more than one booked in July."
      />
    </>
  );
}
