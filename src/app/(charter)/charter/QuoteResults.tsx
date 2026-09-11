import { Clock, Users, Calendar, Radio, TriangleAlert } from "lucide-react";
import { searchCharterQuotes, type CharterQuote, type TripSearchInput } from "@/lib/avinode";

function formatPrice(amount: number | undefined, currency: string | undefined) {
  if (amount === undefined) return "On request";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency ?? "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(minutes: number | undefined) {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`;
}

/** Category-tinted aircraft tile — drawn, not photographed, so nothing can 404. */
function AircraftTile({ category, index }: { category: string; index: number }) {
  const hue = [212, 196, 226, 204, 188, 232][index % 6];
  return (
    <div
      className="relative flex h-28 items-center justify-center overflow-hidden rounded-t-[11px]"
      style={{
        background: `linear-gradient(140deg, hsl(${hue} 32% 19%), hsl(${hue} 26% 11%))`,
      }}
      aria-hidden="true"
    >
      <div className="jet-grid absolute inset-0 opacity-50" />
      {/* Business jet planform, nose to the right. */}
      <svg viewBox="0 0 200 90" className="relative w-44 opacity-85" fill={`hsl(${hue} 24% 82%)`}>
        <ellipse cx="100" cy="45" rx="86" ry="7" />
        <path d="M122 41 L88 9 L74 9 L100 43 Z" />
        <path d="M122 49 L88 81 L74 81 L100 47 Z" />
        <path d="M46 42 L28 24 L18 24 L32 44 Z" />
        <path d="M46 48 L28 66 L18 66 L32 46 Z" />
        <rect x="52" y="29" width="26" height="8" rx="4" />
        <rect x="52" y="53" width="26" height="8" rx="4" />
      </svg>
      <span className="jet-eyebrow absolute bottom-2 left-3">{category}</span>
    </div>
  );
}

function QuoteCard({ quote, index }: { quote: CharterQuote; index: number }) {
  return (
    <article className="jet-card jet-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
      <AircraftTile category={quote.category} index={index} />

      <div className="p-5">
        <h3 className="jet-heading text-[19px]">{quote.aircraftType}</h3>
        <p className="mt-1 text-[13px] text-[var(--jet-muted)]">
          {quote.operator}
          {quote.tailNumber ? ` · ${quote.tailNumber}` : ""}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-[12px] text-[var(--jet-muted)]">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-[var(--jet-gold)]" />
            <dt className="sr-only">Seats</dt>
            <dd>{quote.maxPax ?? "—"} seats</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[var(--jet-gold)]" />
            <dt className="sr-only">Flight time</dt>
            <dd>{formatDuration(quote.flightTimeMinutes)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[var(--jet-gold)]" />
            <dt className="sr-only">Year of manufacture</dt>
            <dd>{quote.yearOfManufacture ?? "—"}</dd>
          </div>
        </dl>

        {quote.amenities.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {quote.amenities.slice(0, 3).map((amenity) => (
              <li key={amenity} className="jet-chip">
                {amenity}
              </li>
            ))}
          </ul>
        )}

        <div className="jet-rule my-4" />

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="jet-heading text-[22px] text-[var(--jet-gold-bright)]">
              {formatPrice(quote.priceAmount, quote.priceCurrency)}
            </p>
            <p className="text-[11px] text-[var(--jet-dim)]">All-in, one way</p>
          </div>
          <a
            href={`mailto:charter@exjet.com?subject=${encodeURIComponent(
              `Charter request — ${quote.aircraftType} (${quote.tailNumber ?? quote.id})`,
            )}`}
            className="jet-cta px-4 py-2 text-[13px]"
          >
            Hold this jet
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function QuoteResults({ search }: { search: TripSearchInput }) {
  const result = await searchCharterQuotes(search);
  const { from, to, distanceNm: legNm } = result.route;

  const routeLabel = `${from?.iata ?? search.from.toUpperCase()} → ${
    to?.iata ?? search.to.toUpperCase()
  }`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="jet-eyebrow">Availability</p>
          <h2 className="jet-heading mt-2 text-[clamp(1.6rem,3vw,2.25rem)]">
            {result.quotes.length} aircraft for {routeLabel}
          </h2>
          <p className="mt-2 text-[13px] text-[var(--jet-muted)]">
            {from?.name ?? search.from} to {to?.name ?? search.to}
            {legNm ? ` · ${legNm.toLocaleString("en-GB")} nm` : ""} · {search.pax}{" "}
            {search.pax === 1 ? "guest" : "guests"} · {search.date} at {search.time}
          </p>
        </div>

        <span
          className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px]"
          style={
            result.source === "avinode"
              ? { borderColor: "rgba(120,200,150,0.3)", color: "#8FD8AC" }
              : { borderColor: "rgba(201,169,97,0.3)", color: "var(--jet-gold)" }
          }
        >
          <Radio size={12} />
          {result.source === "avinode" ? "Live Avinode sandbox" : "Estimated pricing"}
        </span>
      </div>

      {result.notice && (
        <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-[var(--jet-line)] bg-[var(--jet-gold-wash)] p-3.5 text-[12.5px] leading-relaxed text-[var(--jet-muted)]">
          <TriangleAlert size={15} className="mt-px shrink-0 text-[var(--jet-gold)]" />
          <span>{result.notice}</span>
        </p>
      )}

      {result.quotes.length === 0 ? (
        <p className="mt-8 rounded-lg border border-[var(--jet-line-soft)] p-6 text-[14px] text-[var(--jet-muted)]">
          No aircraft matched this routing. Try a nearby airport, a later slot, or fewer
          guests — or call us and we will source it manually.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.quotes.map((quote, index) => (
            <QuoteCard key={quote.id} quote={quote} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export function QuoteResultsSkeleton() {
  return (
    <div>
      <div className="h-5 w-28 rounded bg-[var(--jet-elevated)]" />
      <div className="mt-3 h-9 w-72 max-w-full rounded bg-[var(--jet-elevated)]" />
      <p className="mt-3 text-[13px] text-[var(--jet-muted)]">
        Searching operators across the Avinode marketplace…
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl border border-[var(--jet-line-soft)] bg-[var(--jet-surface)]"
          />
        ))}
      </div>
    </div>
  );
}
