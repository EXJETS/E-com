/**
 * Adapter from Avinode lifts to the `Jet` shape used by the exjet.com app
 * (EXJETS/exjet, `src/types/index.ts`).
 *
 * The two models describe different things, which is the crux of wiring them
 * together. A `Jet` is a CATALOGUE entry: an aircraft model with specs, photos,
 * a rating and an hourly rate. An Avinode lift is an AVAILABILITY result: one
 * specific tail, from one operator, priced for one routing on one date.
 *
 * That mismatch is handled explicitly below rather than papered over — each
 * field is marked as coming from the marketplace, derived, or unavailable.
 */
import type { CharterQuote } from "@/lib/avinode";

export type JetCategory =
  | "light"
  | "midsize"
  | "super_midsize"
  | "heavy"
  | "ultra_long";

/**
 * The subset of exjet's `Jet` that a marketplace search can honestly populate.
 * `rating`, `reviewCount`, `description`, `images` and the cabin dimensions are
 * deliberately absent — see `UNAVAILABLE_FIELDS`.
 */
export type QuotedJet = {
  id: string;
  name: string;
  manufacturer: string;
  category: JetCategory;
  passengers: number;
  range: number;
  speed: number;
  hourlyRate: number;
  /** Total quoted price for the searched routing — the real marketplace number. */
  basePrice: number;
  amenities: string[];
  yearBuilt?: number;
  /** Marketplace provenance, absent from the catalogue model. */
  operator: string;
  tailNumber?: string;
  flightTimeMinutes?: number;
};

/**
 * Fields on `Jet` that Avinode lifts cannot supply. Listed so the consuming UI
 * can decide to hide them rather than render zeros or invented values.
 *
 * `rating`/`reviewCount` are the important ones: these are real operators, and
 * fabricating a trust score for them would be misleading, not cosmetic.
 */
export const UNAVAILABLE_FIELDS = [
  "rating",
  "reviewCount",
  "description",
  "images",
  "cabinLength",
  "cabinWidth",
  "cabinHeight",
  "baggageVolume",
  "crew",
  "featured",
] as const;

/* ── Category ──────────────────────────────────────────────────────────── */

/**
 * Avinode returns free text ("Super midsize jet", "Ultra long range"); exjet
 * uses a five-value enum. Order matters: "super midsize" must be tested before
 * "midsize", and "ultra long"/"long range" before "light".
 */
const CATEGORY_RULES: [RegExp, JetCategory][] = [
  [/super\s*-?\s*mid/i, "super_midsize"],
  [/ultra\s*-?\s*long|long\s*range|global/i, "ultra_long"],
  [/heavy|large/i, "heavy"],
  [/mid\s*-?\s*size|midsize/i, "midsize"],
  [/turbo\s*-?\s*prop|very\s*light|light|entry/i, "light"],
];

export function toJetCategory(avinodeCategory: string): JetCategory {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(avinodeCategory)) return category;
  }
  // Unrecognized categories land in the middle of the range rather than at an
  // extreme, so a mis-mapped aircraft is never wildly mis-filtered.
  return "midsize";
}

/* ── Manufacturer ──────────────────────────────────────────────────────── */

/** Avinode names the type ("Challenger 350"), not the maker. */
const MANUFACTURERS: [RegExp, string][] = [
  [/challenger|global|learjet/i, "Bombardier"],
  [/citation|latitude|longitude|sovereign/i, "Cessna"],
  [/gulfstream|^g\d/i, "Gulfstream"],
  [/phenom|praetor|legacy|lineage/i, "Embraer"],
  [/falcon/i, "Dassault"],
  [/king\s*air|premier/i, "Beechcraft"],
  [/hawker/i, "Hawker"],
  [/pilatus|pc-?\d/i, "Pilatus"],
  [/tbm|daher/i, "Daher"],
  [/honda/i, "Honda Aircraft"],
];

export function toManufacturer(aircraftType: string): string {
  for (const [pattern, maker] of MANUFACTURERS) {
    if (pattern.test(aircraftType)) return maker;
  }
  return "—";
}

/* ── Specs ─────────────────────────────────────────────────────────────── */

/**
 * Range and cruise speed are catalogue facts, not marketplace ones — a lift
 * doesn't carry them. These are published figures per type, used only to fill
 * the spec line on the card. A type we don't know falls back to its category's
 * typical figures rather than showing zeros.
 */
const TYPE_SPECS: [RegExp, { range: number; speed: number }][] = [
  [/king\s*air\s*350/i, { range: 1800, speed: 312 }],
  [/cj3/i, { range: 1900, speed: 405 }],
  [/cj4/i, { range: 2165, speed: 451 }],
  [/phenom\s*300/i, { range: 2010, speed: 453 }],
  [/citation\s*xls/i, { range: 1800, speed: 441 }],
  [/citation\s*latitude/i, { range: 2700, speed: 446 }],
  [/citation\s*longitude/i, { range: 3500, speed: 476 }],
  [/learjet\s*75/i, { range: 2040, speed: 465 }],
  [/challenger\s*350/i, { range: 3200, speed: 470 }],
  [/challenger\s*605|challenger\s*650/i, { range: 4000, speed: 470 }],
  [/g280/i, { range: 3600, speed: 482 }],
  [/falcon\s*2000/i, { range: 4000, speed: 470 }],
  [/falcon\s*7x|falcon\s*8x/i, { range: 5950, speed: 488 }],
  [/global\s*6000|global\s*6500/i, { range: 6000, speed: 488 }],
  [/global\s*7500/i, { range: 7700, speed: 516 }],
  [/g650/i, { range: 7500, speed: 516 }],
  [/praetor\s*600/i, { range: 4018, speed: 466 }],
];

const CATEGORY_SPECS: Record<JetCategory, { range: number; speed: number }> = {
  light: { range: 1900, speed: 420 },
  midsize: { range: 2800, speed: 445 },
  super_midsize: { range: 3500, speed: 475 },
  heavy: { range: 4500, speed: 480 },
  ultra_long: { range: 6500, speed: 500 },
};

function specsFor(aircraftType: string, category: JetCategory) {
  for (const [pattern, specs] of TYPE_SPECS) {
    if (pattern.test(aircraftType)) return specs;
  }
  return CATEGORY_SPECS[category];
}

/* ── Conversion ────────────────────────────────────────────────────────── */

const MIN_BILLABLE_HOURS = 1.5;

/**
 * Convert one Avinode lift into the shape exjet's jet cards and filters read.
 *
 * `hourlyRate` is derived: Avinode prices a whole trip, while the card shows a
 * rate. Dividing the quoted total by the billable flight time gives a figure
 * that is genuinely comparable between results on the same routing — which is
 * exactly what the card is used for. `basePrice` keeps the real total.
 */
export function toQuotedJet(quote: CharterQuote): QuotedJet {
  const category = toJetCategory(quote.category);
  const specs = specsFor(quote.aircraftType, category);

  const hours = Math.max(
    (quote.flightTimeMinutes ?? 0) / 60 || MIN_BILLABLE_HOURS,
    MIN_BILLABLE_HOURS,
  );
  const total = quote.priceAmount ?? 0;

  return {
    id: quote.id,
    name: quote.aircraftType,
    manufacturer: toManufacturer(quote.aircraftType),
    category,
    passengers: quote.maxPax ?? 0,
    range: specs.range,
    speed: specs.speed,
    hourlyRate: total ? Math.round(total / hours) : 0,
    basePrice: total,
    amenities: quote.amenities,
    yearBuilt: quote.yearOfManufacture,
    operator: quote.operator,
    tailNumber: quote.tailNumber,
    flightTimeMinutes: quote.flightTimeMinutes,
  };
}

export function toQuotedJets(quotes: CharterQuote[]): QuotedJet[] {
  return quotes.map(toQuotedJet);
}
