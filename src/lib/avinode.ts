/**
 * Server-side client for the Avinode Marketplace API (sandbox).
 *
 * Credentials are read from the process environment (`.env.local` in local
 * development, the host's project settings once deployed) and are never exposed
 * to the browser — every function here is only ever awaited from Server Components.
 *
 * Sandbox base URL: https://sandbox.avinode.com/api
 * Auth: an API token identifies the integration, a bearer token the Avinode user.
 */
import { distanceNm, findAirport, type Airport } from "@/lib/airports";
import { buildSampleQuotes } from "@/lib/charter-fallback";

const BASE_URL = process.env.AVINODE_API_BASE_URL ?? "https://sandbox.avinode.com/api";
const API_TOKEN = process.env.AVINODE_API_TOKEN;
const AUTH_TOKEN = process.env.AVINODE_AUTH_TOKEN;
const PRODUCT = process.env.AVINODE_PRODUCT ?? "exjet-charter-landing";
const TIMEOUT_MS = 12_000;

export type TripSearchInput = {
  from: string;
  to: string;
  date: string;
  time: string;
  pax: number;
};

export type CharterQuote = {
  id: string;
  aircraftType: string;
  category: string;
  tailNumber?: string;
  operator: string;
  maxPax?: number;
  yearOfManufacture?: number;
  flightTimeMinutes?: number;
  priceAmount?: number;
  priceCurrency?: string;
  imageUrl?: string;
  amenities: string[];
};

export type QuoteResult = {
  /** `avinode` when the quotes came off the wire, `sample` when they are estimated locally. */
  source: "avinode" | "sample";
  /** Why we fell back, when we did. Rendered in the UI so the state is never silent. */
  notice?: string;
  searchId?: string;
  route: { from?: Airport; to?: Airport; distanceNm?: number };
  quotes: CharterQuote[];
};

export function isAvinodeConfigured(): boolean {
  return Boolean(API_TOKEN && AUTH_TOKEN);
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "X-Avinode-ApiToken": API_TOKEN ?? "",
    "X-Avinode-Product": PRODUCT,
    "X-Avinode-SentTimestamp": new Date().toISOString(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/* ── Tolerant response readers ───────────────────────────────────────────
   The Marketplace API nests lift data a few levels deep and the exact shape
   differs between endpoints and API versions, so we read defensively rather
   than casting a hand-written interface over the payload. */

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Walk a dotted path, returning `undefined` at the first missing hop. */
function at(source: unknown, path: string): unknown {
  let current: unknown = source;
  for (const key of path.split(".")) {
    const record = asRecord(current);
    if (!record) return undefined;
    current = record[key];
  }
  return current;
}

function firstString(source: unknown, ...paths: string[]): string | undefined {
  for (const path of paths) {
    const value = at(source, path);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function firstNumber(source: unknown, ...paths: string[]): number | undefined {
  for (const path of paths) {
    const value = at(source, path);
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function firstArray(source: unknown, ...paths: string[]): unknown[] {
  for (const path of paths) {
    const value = at(source, path);
    if (Array.isArray(value)) return value;
  }
  return [];
}

function normalizeLift(lift: unknown, index: number): CharterQuote {
  const amenities = firstArray(lift, "aircraftTail.amenities", "amenities")
    .map((item) =>
      typeof item === "string" ? item : firstString(item, "displayName", "name", "type"),
    )
    .filter((item): item is string => Boolean(item));

  return {
    id:
      firstString(lift, "id", "liftId", "tripId", "aircraftTail.id") ?? `lift-${index}`,
    aircraftType:
      firstString(
        lift,
        "aircraftTail.aircraftType.displayName",
        "aircraftTail.aircraftType.name",
        "aircraftType.displayName",
        "aircraftType.name",
      ) ?? "Aircraft",
    category:
      firstString(
        lift,
        "aircraftTail.aircraftType.category.displayName",
        "aircraftTail.aircraftType.category",
        "aircraftCategory.displayName",
        "aircraftCategory",
      ) ?? "Private jet",
    tailNumber: firstString(lift, "aircraftTail.tailNumber", "aircraftTail.displayName", "tailNumber"),
    operator:
      firstString(
        lift,
        "sellerCompany.displayName",
        "sellerCompany.name",
        "company.displayName",
        "operator.name",
      ) ?? "Avinode operator",
    maxPax: firstNumber(
      lift,
      "aircraftTail.maxPax",
      "aircraftTail.aircraftType.maxPax",
      "maxPax",
    ),
    yearOfManufacture: firstNumber(
      lift,
      "aircraftTail.yearOfManufacture",
      "aircraftTail.yearOfMake",
      "yearOfManufacture",
    ),
    flightTimeMinutes: firstNumber(
      lift,
      "totalFlightTime",
      "flightTime",
      "segments.0.flightTime",
    ),
    priceAmount: firstNumber(
      lift,
      "sellerPrice.price.amount",
      "buyerPrice.price.amount",
      "price.amount",
      "sellerPrice.convertedPrice.amount",
    ),
    priceCurrency: firstString(
      lift,
      "sellerPrice.price.currency",
      "buyerPrice.price.currency",
      "price.currency",
      "sellerPrice.convertedPrice.currency",
    ),
    imageUrl: firstString(
      lift,
      "aircraftTail.images.0.url",
      "aircraftTail.photos.0.url",
      "images.0.url",
    ),
    amenities,
  };
}

/**
 * Create a trip search in the Avinode Marketplace and return the matching lifts.
 *
 * Falls back to locally estimated quotes whenever the sandbox is not configured
 * or not reachable, so the landing page always renders something useful. The
 * `source` field on the result says which of the two you are looking at.
 */
export async function searchCharterQuotes(input: TripSearchInput): Promise<QuoteResult> {
  const from = findAirport(input.from);
  const to = findAirport(input.to);
  const route = {
    from,
    to,
    distanceNm: from && to ? distanceNm(from, to) : undefined,
  };

  if (!isAvinodeConfigured()) {
    return {
      ...sampleQuotes(input, route),
      notice:
        "Set AVINODE_API_TOKEN and AVINODE_AUTH_TOKEN in your environment — .env.local " +
        "when running locally, or your host's project settings when deployed.",
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/searches`, {
      method: "POST",
      headers: headers(),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        segments: [
          {
            startAirport: { icao: from?.icao ?? input.from.toUpperCase() },
            endAirport: { icao: to?.icao ?? input.to.toUpperCase() },
            dateTime: {
              date: input.date,
              time: input.time,
              departure: true,
              local: true,
            },
            paxCount: input.pax,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = (await response.text()).slice(0, 200);
      return {
        ...sampleQuotes(input, route),
        notice: `Avinode sandbox returned ${response.status}. ${body || "No response body."}`,
      };
    }

    const payload: unknown = await response.json();
    const lifts = firstArray(
      payload,
      "data.lifts",
      "lifts",
      "data.searchResults",
      "data.0.lifts",
    );

    if (lifts.length === 0) {
      return {
        ...sampleQuotes(input, route),
        notice: "The Avinode sandbox returned no lifts for this routing.",
      };
    }

    return {
      source: "avinode",
      searchId: firstString(payload, "data.id", "id"),
      route,
      quotes: lifts.map(normalizeLift),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return {
      ...sampleQuotes(input, route),
      notice: `Could not reach the Avinode sandbox (${reason}).`,
    };
  }
}

/** Locally estimated quotes, shaped exactly like live ones. */
function sampleQuotes(
  input: TripSearchInput,
  route: QuoteResult["route"],
): QuoteResult {
  return {
    source: "sample",
    route,
    quotes: buildSampleQuotes(input.pax, route.from, route.to),
  };
}
