import { Suspense } from "react";
import { Search, ShieldCheck, PlaneTakeoff, Headset, Globe2 } from "lucide-react";
import type { TripSearchInput } from "@/lib/avinode";
import SearchForm, { type SearchDefaults } from "./SearchForm";
import QuoteResults, { QuoteResultsSkeleton } from "./QuoteResults";

type PageSearchParams = { [key: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function defaultDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

const FLEET = [
  { name: "Turboprop", pax: "6–8 guests", range: "1,500 nm", note: "Short sectors and unpaved or short runways." },
  { name: "Light Jet", pax: "6–8 guests", range: "2,000 nm", note: "The city-pair workhorse — London to Nice, nonstop." },
  { name: "Midsize Jet", pax: "8–9 guests", range: "2,800 nm", note: "Stand-up cabin, full lavatory, transcontinental Europe." },
  { name: "Super Midsize", pax: "9–10 guests", range: "3,600 nm", note: "Cabin crew, full galley, Europe to the Gulf." },
  { name: "Heavy Jet", pax: "10–14 guests", range: "4,500 nm", note: "Sleeping configuration and hot catering on board." },
  { name: "Ultra Long Range", pax: "13–19 guests", range: "7,500 nm", note: "Nonstop intercontinental with a private stateroom." },
];

const PROCESS = [
  {
    icon: Search,
    title: "Search live availability",
    body: "Your routing is sent straight into the Avinode marketplace, where operators publish real aircraft positions and pricing.",
  },
  {
    icon: ShieldCheck,
    title: "We vet the operator",
    body: "Every quote is checked for AOC validity, insurance cover and third-party safety ratings before it reaches you.",
  },
  {
    icon: PlaneTakeoff,
    title: "Confirm and fly",
    body: "One contract, one all-in price. Catering, ground transfers and crew briefing handled by your dedicated agent.",
  },
];

export default async function CharterLandingPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const params = await searchParams;

  const defaults: SearchDefaults = {
    from: first(params.from) ?? "LTN",
    to: first(params.to) ?? "NCE",
    date: first(params.date) ?? defaultDate(),
    time: first(params.time) ?? "10:00",
    pax: first(params.pax) ?? "4",
  };

  const hasSearched = first(params.searched) === "1";
  const search: TripSearchInput = {
    from: defaults.from,
    to: defaults.to,
    date: defaults.date,
    time: defaults.time,
    pax: Math.min(Math.max(Number(defaults.pax) || 1, 1), 16),
  };

  return (
    <>
      {/* ── HERO + SEARCH ───────────────────────────────────────────────── */}
      <section className="jet-horizon relative overflow-hidden">
        <div className="jet-grid absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
          <p className="jet-eyebrow">Connected to the Avinode marketplace</p>
          <h1 className="jet-heading mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.25rem)]">
            Anywhere you need to be,
            <br />
            <span className="italic text-[var(--jet-gold-bright)]">on your schedule.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--jet-muted)]">
            Search live aircraft availability across thousands of vetted operators, compare
            all-in pricing side by side, and hold your jet in minutes — not days of phone
            calls.
          </p>

          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["7,000+", "Aircraft in the network"],
              ["190+", "Countries served"],
              ["< 30 min", "Median quote turnaround"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="jet-heading text-[26px] text-[var(--jet-text)]">{value}</dt>
                <dd className="mt-0.5 text-[12px] text-[var(--jet-dim)]">{label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-11">
            <SearchForm defaults={defaults} />
          </div>
        </div>
      </section>

      {/* ── RESULTS ─────────────────────────────────────────────────────── */}
      {hasSearched && (
        <section id="quotes" className="scroll-mt-20 border-t border-[var(--jet-line-soft)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <Suspense
              key={`${search.from}-${search.to}-${search.date}-${search.time}-${search.pax}`}
              fallback={<QuoteResultsSkeleton />}
            >
              <QuoteResults search={search} />
            </Suspense>
          </div>
        </section>
      )}

      {/* ── PROCESS ─────────────────────────────────────────────────────── */}
      <section id="process" className="scroll-mt-20 border-t border-[var(--jet-line-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="jet-eyebrow">How it works</p>
          <h2 className="jet-heading mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Three steps from routing to wheels up.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PROCESS.map((step, index) => (
              <div key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--jet-line)] bg-[var(--jet-gold-wash)]">
                    <step.icon size={16} className="text-[var(--jet-gold)]" />
                  </span>
                  <span className="jet-eyebrow">Step {index + 1}</span>
                </div>
                <h3 className="jet-heading mt-4 text-[19px]">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--jet-muted)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET ───────────────────────────────────────────────────────── */}
      <section id="fleet" className="scroll-mt-20 border-t border-[var(--jet-line-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="jet-eyebrow">The fleet</p>
          <h2 className="jet-heading mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
            Every category, matched to the mission.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FLEET.map((category) => (
              <div key={category.name} className="jet-card p-5">
                <h3 className="jet-heading text-[18px]">{category.name}</h3>
                <div className="mt-3 flex gap-2">
                  <span className="jet-chip">{category.pax}</span>
                  <span className="jet-chip">{category.range}</span>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--jet-muted)]">
                  {category.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NETWORK ─────────────────────────────────────────────────────── */}
      <section id="network" className="scroll-mt-20 border-t border-[var(--jet-line-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <p className="jet-eyebrow">The network</p>
              <h2 className="jet-heading mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
                Built on the marketplace the industry already runs on.
              </h2>
              <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--jet-muted)]">
                Avinode is where charter operators publish their fleets and brokers source
                lift. We query it directly, so what you see is what operators are actually
                offering right now — including empty legs and repositioning flights that
                never make it onto a public price list.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Globe2, title: "Global reach", body: "Operators on six continents, quoted in your currency." },
                { icon: ShieldCheck, title: "Safety first", body: "ARGUS, Wyvern and IS-BAO credentials checked on every lift." },
                { icon: Headset, title: "24/7 desk", body: "A named agent from first enquiry through to landing." },
                { icon: PlaneTakeoff, title: "No hidden fees", body: "Handling, catering and crew costs included in the quote." },
              ].map((item) => (
                <div key={item.title} className="border-t border-[var(--jet-line-soft)] pt-5">
                  <item.icon size={18} className="text-[var(--jet-gold)]" />
                  <h3 className="mt-3 text-[15px] font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--jet-muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--jet-line-soft)]">
        <div className="jet-horizon">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
            <h2 className="jet-heading text-[clamp(1.75rem,4vw,2.75rem)]">
              Tell us where you are going.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-[var(--jet-muted)]">
              Live availability in seconds, a firm operator quote in under half an hour.
            </p>
            <a href="#search" className="jet-cta mt-8 inline-block px-7 py-3 text-[14px]">
              Search availability
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
