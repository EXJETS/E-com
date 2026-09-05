import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Percent, Phone, TrendingDown } from "lucide-react";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { CTABanner, CheckList, PageHero, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC Financing in Dallas–Fort Worth | Payment Plans",
  description:
    "Monthly payment plans and 0% promotional financing on qualifying HVAC system replacements across DFW, with approved credit.",
  path: "/financing",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Financing", path: "/financing" },
];

const financingFaqs = [
  {
    q: "Does applying affect my credit score?",
    a: "Pre-qualification uses a soft credit check that does not affect your score. A full application, once you decide to proceed, involves a hard inquiry like any other credit product.",
  },
  {
    q: "How quickly do I get a decision?",
    a: "Usually within a few minutes, from your kitchen table during the estimate. If a replacement is urgent — no cooling in August, no heat in a freeze — that speed is the point.",
  },
  {
    q: "What can I finance?",
    a: "System replacements and larger repairs, plus associated work in the same job such as ductwork, indoor air quality equipment or a thermostat. Routine repairs below the lender minimum are not eligible.",
  },
  {
    q: "Is 0% APR genuinely 0%?",
    a: "On qualifying promotional terms, yes, provided the balance is cleared within the promotional period. If it is not, deferred interest can be charged from the original date — so we will show you the payment needed to clear it in time before you sign anything.",
  },
  {
    q: "Can I pay it off early?",
    a: "Yes. The plans we work with have no prepayment penalty, and clearing a promotional balance early is the safest way to keep 0% at 0%.",
  },
  {
    q: "What if I do not qualify?",
    a: "We will still show you the full range of options, including repairing rather than replacing, and phasing the work so the urgent part happens now and the rest later.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(trail), faqJsonLd(financingFaqs)]} />
      <PageHero
        eyebrow="Financing"
        title="A new system without emptying the account"
        intro="Air conditioners rarely fail at a convenient moment. Monthly payment plans — including 0% promotional terms on qualifying systems — let you fix it properly now rather than patching something that will fail again."
        trail={trail}
      />

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="Applied for at the kitchen table, answered in minutes"
            />
            <div className="prose-body mt-8">
              <p>
                During your in-home estimate we pre-qualify you with a soft credit check that leaves your
                score untouched. You see the monthly payment for each system option alongside its estimated
                energy saving, so you are comparing the real net cost rather than just the sticker.
              </p>
              <p>
                If you proceed, the full application takes a few minutes and the decision is usually
                immediate. Approved work can generally be scheduled the same week.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                { icon: Percent, title: "0% promotional terms", body: "On qualifying system replacements, with approved credit." },
                { icon: CreditCard, title: "Soft pre-qualification", body: "Check your options without touching your score." },
                { icon: TrendingDown, title: "Payment vs. savings", body: "We show both numbers side by side, not just the payment." },
              ].map((c) => (
                <div key={c.title} className="card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-tint text-cool-600">
                    <c.icon size={18} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-[family-name:var(--font-display)] text-[24px] font-bold">
                Financing questions
              </h2>
              <div className="mt-6">
                <Accordion items={financingFaqs} />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="ground-navy relative overflow-hidden rounded-2xl p-7">
              <div className="ground-grid absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <p className="eyebrow eyebrow-light mb-5">What we bring to the estimate</p>
                <CheckList
                  light
                  items={[
                    "A Manual J load calculation, not a guess at tonnage",
                    "Three clearly priced options — good, better, best",
                    "Monthly payment shown for each option",
                    "Estimated annual energy cost for each option",
                    "Rebates and credits already factored in",
                    "No commission on the technician's side of the table",
                  ]}
                />
                <a href={site.phone.href} className="btn btn-primary mt-8 w-full">
                  <Phone size={17} /> {site.phone.display}
                </a>
                <Link href="/schedule" className="btn btn-ghost-light mt-3 w-full">
                  Book a free estimate
                </Link>
              </div>
            </div>

            <p className="mt-5 rounded-xl border border-line bg-surface-alt p-5 text-[12.5px] leading-relaxed text-muted">
              All financing is subject to credit approval and the terms of the lender. Promotional rates,
              terms and eligibility vary by amount financed and equipment. Nothing on this page is a
              commitment to lend — you will receive the lender&rsquo;s full disclosures before signing.
            </p>
          </aside>
        </div>
      </div>

      <CTABanner
        title="Get a free replacement estimate."
        body="No commission, no pressure, and three clearly priced options with the monthly payment shown next to the energy saving."
      />
    </>
  );
}
