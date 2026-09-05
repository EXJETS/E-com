import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  Phone,
  Route,
  Star,
  ThermometerSun,
  Truck,
  Wrench,
} from "lucide-react";
import BookingForm from "@/components/BookingForm";
import ReviewCard, { Stars } from "@/components/ReviewCard";
import ServiceCard from "@/components/ServiceCard";
import TrustBar from "@/components/TrustBar";
import JsonLd from "@/components/JsonLd";
import Accordion from "@/components/Accordion";
import { CheckList, LinkArrow, SectionHeading, Stat } from "@/components/ui";
import { services } from "@/lib/services";
import { areas, featuredAreas } from "@/lib/areas";
import { reviews, reviewPlatforms } from "@/lib/reviews";
import { generalFaqs, offers, plans } from "@/lib/offers";
import { sortedPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HVAC, Plumbing & Electric in Dallas–Fort Worth",
  description:
    "Same-day AC repair, heating service and system installation across Dallas–Fort Worth. Licensed technicians, upfront flat-rate pricing and no overtime charges. Call (214) 892-2225.",
  path: "/",
});

const process = [
  { icon: Phone, title: "Tell us what's wrong", body: "Call a live dispatcher or book online in about a minute. We ask enough to send the right technician with the right parts." },
  { icon: Truck, title: "We arrive in your window", body: "You get a two-hour arrival window and a text when the technician is on the way — with their name and photo." },
  { icon: ClipboardCheck, title: "Diagnose, then price", body: "A full system diagnostic first, then a written flat-rate price for every option. Nothing starts until you say yes." },
  { icon: Wrench, title: "Fix it and prove it", body: "We complete the work, retest the system under load, and show you the before-and-after readings." },
];

export default function HomePage() {
  const featured = services.filter((s) =>
    ["ac-repair", "ac-installation", "ac-maintenance", "heating-repair", "indoor-air-quality", "emergency-hvac"].includes(s.slug),
  );

  return (
    <>
      <JsonLd data={faqJsonLd(generalFaqs)} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="ground-navy relative overflow-hidden">
        <div className="ground-grid absolute inset-0" aria-hidden="true" />
        <div className="container-page relative grid gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-20">
          <div>
            <span className="chip chip-light">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
              </span>
              Dispatching now · 24/7 emergency service
            </span>

            <h1 className="h-display mt-6 !text-white">
              Dallas–Fort Worth heating &amp; air conditioning,{" "}
              <span className="bg-gradient-to-r from-cool-300 via-white to-ember-400 bg-clip-text text-transparent">
                done right the first time.
              </span>
            </h1>

            <p className="lede mt-6 max-w-xl !text-white/72">
              Eighty years of North Texas summers have taught us what fails here and why. Licensed
              technicians, a flat price you approve before we start, and no overtime charges — ever.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.phone.href} className="btn btn-primary !py-4 !text-base">
                <Phone size={18} /> {site.phone.display}
              </a>
              <Link href="/schedule" className="btn btn-ghost-light !py-4 !text-base">
                Book online <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
              {site.stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} light />
              ))}
            </div>
          </div>

          <div className="lg:pt-2">
            <BookingForm compact />
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="What we do"
              title="Whole-home comfort, one licensed team"
              intro="Heating, cooling and air quality are the core of what we do — with plumbing and electrical from the same crew when a job crosses trades."
            />
            <LinkArrow href="/services">View all services</LinkArrow>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────────────── */}
      <section className="section bg-surface-alt">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={`Since ${site.founded}`}
              title="Built on the parts of this job that are easy to skip"
              intro="Anyone can swap a capacitor. The difference shows up in whether the system was diagnosed properly, sized correctly and commissioned to spec — the work you cannot see from the driveway."
            />
            <div className="mt-8">
              <CheckList
                items={[
                  "Diagnosis before pricing, on every single call — never a quote from the driveway",
                  "Manual J load calculations on replacements instead of matching the old sticker",
                  "Full commissioning on installs: superheat, subcool, static pressure and airflow recorded",
                  "Carbon monoxide testing standard on every gas appliance visit",
                  "Permits pulled and inspections met, so your warranty and your resale stay intact",
                  "Technicians paid for the work, not for the size of the sale",
                ]}
              />
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-outline">
                About Baker Brothers
              </Link>
              <Link href="/membership" className="btn btn-cool">
                See the Comfort Club
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {process.map((step, i) => (
              <div key={step.title} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-cool-300">
                    <step.icon size={17} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[16px] font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offers ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Current specials"
              title="Straightforward savings, no fine-print gymnastics"
              intro="Seasonal offers on the work most DFW homes actually need. Terms are short and printed on the page."
            />
            <LinkArrow href="/specials">All current offers</LinkArrow>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <Link key={offer.id} href={offer.href} className="card card-hover group relative overflow-hidden p-6">
                <span className="absolute right-0 top-0 h-24 w-24 rounded-bl-[64px] bg-surface-tint transition-colors group-hover:bg-cool-500/12" />
                <p className="relative font-[family-name:var(--font-display)] text-[34px] font-bold leading-none text-cool-600">
                  {offer.value}
                </p>
                <h3 className="h-card relative mt-3">{offer.headline}</h3>
                <p className="relative mt-2.5 text-[14.5px] leading-relaxed text-body">{offer.detail}</p>
                <p className="relative mt-4 border-t border-line-soft pt-3 text-[12px] leading-relaxed text-muted">
                  {offer.terms}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section className="section bg-surface-alt">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="What neighbours say"
              title="Eight decades of North Texas word of mouth"
            />
            <div className="flex flex-wrap gap-6">
              {reviewPlatforms.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="fill-ember-500 text-ember-500" />
                    <span className="text-[17px] font-bold text-ink">{p.score}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    {p.name} · {p.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <ReviewCard key={r.quote} review={r} />
            ))}
          </div>

          <div className="mt-8">
            <LinkArrow href="/reviews">Read more reviews</LinkArrow>
          </div>
        </div>
      </section>

      {/* ── Membership ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Comfort Club"
              title="The membership that stops the July emergency"
              intro="Two precision tune-ups a year, priority scheduling, and a discount on every repair. Most members save more than the membership costs on the first repair they need."
            />
            <div className="mt-8">
              <CheckList items={plans[1].features.slice(0, 5)} />
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/membership" className="btn btn-cool">
                Compare plans
              </Link>
              <Link href="/services/ac-maintenance" className="btn btn-outline">
                What&rsquo;s in a tune-up?
              </Link>
            </div>
          </div>

          <div className="ground-navy relative overflow-hidden rounded-2xl p-8 lg:p-10">
            <div className="ground-grid absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <p className="eyebrow eyebrow-light">Most popular</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-[26px] font-bold text-white">
                {plans[1].name}
              </h3>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-[46px] font-bold leading-none text-white">
                  {plans[1].price}
                </span>
                <span className="text-sm text-white/60">{plans[1].cadence}</span>
              </p>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">{plans[1].summary}</p>
              <Link href="/membership" className="btn btn-primary mt-8 w-full sm:w-auto">
                Join the Comfort Club
              </Link>
              <p className="mt-4 text-[12.5px] text-white/45">
                Cancel any time. Transfers to the new owner if you sell the house.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service areas ────────────────────────────────────────────── */}
      <section className="section bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="Where we work"
            title={`${areas.length} cities across the metroplex`}
            intro="Three service centres — Dallas, Arlington and McKinney — so a technician is rarely far from your driveway."
            align="center"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAreas.map((a) => (
              <Link key={a.slug} href={`/service-areas/${a.slug}`} className="card card-hover group p-5">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <Route size={13} className="text-cool-500" /> {a.county}
                </span>
                <h3 className="mt-3 text-[17px] font-bold text-ink">HVAC in {a.city}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">
                  {a.blurb.length > 96 ? `${a.blurb.slice(0, 96).trimEnd()}…` : a.blurb}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/service-areas" className="btn btn-outline">
              See every city we serve
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Common questions"
              title="The things people ask before they call"
            />
            <p className="mt-6 text-[15px] leading-relaxed text-body">
              Still unsure? A dispatcher can usually answer in under two minutes.
            </p>
            <a href={site.phone.href} className="btn btn-cool mt-5">
              <Phone size={16} /> {site.phone.display}
            </a>
          </div>
          <Accordion items={generalFaqs} />
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────── */}
      <section className="section bg-surface-alt">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="HVAC advice"
              title="Straight answers, written by people who do the work"
            />
            <LinkArrow href="/blog">All articles</LinkArrow>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {sortedPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover group flex flex-col p-6">
                <span className="chip">{post.category}</span>
                <h3 className="h-card mt-4 transition-colors group-hover:text-cool-600">{post.title}</h3>
                <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-body">{post.description}</p>
                <span className="mt-5 text-[12.5px] text-muted">{post.readingMinutes} min read</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="ground-navy relative overflow-hidden">
        <div className="ground-grid absolute inset-0" aria-hidden="true" />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-20">
          <div className="self-center">
            <span className="chip chip-light">
              <ThermometerSun size={14} /> No overtime charges, ever
            </span>
            <h2 className="h-display mt-6 !text-white">Let&rsquo;s get your house comfortable again.</h2>
            <p className="lede mt-5 max-w-lg !text-white/70">
              Call and speak to a real dispatcher, or send the form and we&rsquo;ll ring you back to confirm your
              arrival window.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.phone.href} className="btn btn-primary !py-4 !text-base">
                <Phone size={18} /> {site.phone.display}
              </a>
              <Link href="/contact" className="btn btn-ghost-light !py-4 !text-base">
                Other ways to reach us
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <Stars />
              <p className="text-sm text-white/60">Rated 4.9 across 6,200+ reviews</p>
            </div>
          </div>
          <BookingForm compact />
        </div>
      </section>
    </>
  );
}
