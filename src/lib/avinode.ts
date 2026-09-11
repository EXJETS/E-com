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
const PRODUCT = process.env.AVINODE_PRODUCT ?? "exjet-charter-landing/1.0";
const API_VERSION = process.env.AVINODE_API_VERSION ?? "v1";
const TIMEOUT_MS = 12_000;
const DEBUG = process.env.AVINODE_DEBUG === "1";

export type TripSearchInput = {
  from: string;
  to: string;
  date: string;
  time: string;
  pax: number;
  /** Set for a round trip; adds a second, reversed segment to the search. */
  returnDate?: string;
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

/**
 * Avinode documents this header to the minute — `2010-01-01T00:00Z` — not with
 * the milliseconds `toISOString()` emits. Omitting or malforming it is the
 * documented most common cause of authentication errors.
 */
function sentTimestamp(): string {
  return `${new Date().toISOString().slice(0, 16)}Z`;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "X-Avinode-ApiToken": API_TOKEN ?? "",
    "X-Avinode-ApiVersion": API_VERSION,
    "X-Avinode-Product": PRODUCT,
    "X-Avinode-SentTimestamp": sentTimestamp(),
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
        "aircraftType",
        "aircraftTail.aircraftType.displayName",
        "aircraftTail.aircraftType.name",
        "aircraftType.displayName",
        "aircraftType.name",
      ) ?? "Aircraft",
    category:
      firstString(
        lift,
        "aircraftCategory",
        "aircraftTail.aircraftType.category.displayName",
        "aircraftTail.aircraftType.category",
        "aircraftCategory.displayName",
      ) ?? "Private jet",
    tailNumber: firstString(
      lift,
      "aircraftTail",
      "aircraftTail.tailNumber",
      "aircraftTail.displayName",
      "tailNumber",
    ),
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
      "totalPrice",
      "sellerPrice.totalPrice",
    ),
    priceCurrency: firstString(
      lift,
      "sellerPrice.price.currency",
      "buyerPrice.price.currency",
      "price.currency",
      "sellerPrice.convertedPrice.currency",
      "currencyCode",
      "sellerPrice.currencyCode",
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

  const startIcao = from?.icao ?? input.from.toUpperCase();
  const endIcao = to?.icao ?? input.to.toUpperCase();

  // Avinode takes an array of segments, so a round trip is the outbound plus a
  // reversed leg on the return date — not a separate request.
  const segments = [
    {
      startAirport: { icao: startIcao },
      endAirport: { icao: endIcao },
      dateTime: { date: input.date, time: input.time, departure: true, local: true },
      paxCount: input.pax,
    },
  ];

  if (input.returnDate) {
    segments.push({
      startAirport: { icao: endIcao },
      endAirport: { icao: startIcao },
      dateTime: { date: input.returnDate, time: input.time, departure: true, local: true },
      paxCount: input.pax,
    });
  }

  const requestBody = { segments };

  // Never log headers() — it carries both tokens.
  if (DEBUG) console.log("[avinode] POST /searches", JSON.stringify(requestBody));

  try {
    const response = await fetch(`${BASE_URL}/searches`, {
      method: "POST",
      headers: headers(),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const body = (await response.text()).slice(0, 400);
      if (DEBUG) console.log(`[avinode] ${response.status}`, body);
      return {
        ...sampleQuotes(input, route),
        notice: `Avinode sandbox returned ${response.status}. ${
          body.slice(0, 200) || "No response body."
        }`,
      };
    }

    const payload: unknown = await response.json();
    if (DEBUG) console.log("[avinode] response", JSON.stringify(payload).slice(0, 8000));

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

/* ── Diagnostics ─────────────────────────────────────────────────────────
   Powers /api/avinode/health. Reports exactly what the integration is
   sending and exactly what Avinode says back, so a failing setup can be
   read off one URL instead of inferred from the fallback banner. */

export type AvinodeDiagnosis = {
  ok: boolean;
  summary: string;
  baseUrl: string;
  /** Presence and length only — token values are never reported. */
  credentials: Record<string, string>;
  sentHeaders: Record<string, string>;
  sentBody: unknown;
  httpStatus?: number;
  responseBody?: unknown;
  error?: string;
};

/** Redact the two secret headers, keep everything else verbatim. */
function redactedHeaders(): Record<string, string> {
  const sent = headers() as Record<string, string>;
  return Object.fromEntries(
    Object.entries(sent).map(([key, value]) =>
      key === "Authorization" || key === "X-Avinode-ApiToken"
        ? [key, `<redacted, ${value.length} chars>`]
        : [key, value],
    ),
  );
}

function describe(name: string, value: string | undefined): string {
  return value ? `set (${value.length} chars)` : "MISSING";
}

/** Run one real search against Avinode and report the unvarnished result. */
export async function diagnoseAvinode(): Promise<AvinodeDiagnosis> {
  const credentials = {
    AVINODE_API_TOKEN: describe("AVINODE_API_TOKEN", API_TOKEN),
    AVINODE_AUTH_TOKEN: describe("AVINODE_AUTH_TOKEN", AUTH_TOKEN),
    AVINODE_API_VERSION: API_VERSION,
    AVINODE_PRODUCT: PRODUCT,
  };

  const sentBody = {
    segments: [
      {
        startAirport: { icao: "EGGW" },
        endAirport: { icao: "LFMN" },
        dateTime: { date: "2026-12-01", time: "10:00", departure: true, local: true },
        paxCount: 4,
      },
    ],
  };

  const base = {
    baseUrl: BASE_URL,
    credentials,
    sentHeaders: redactedHeaders(),
    sentBody,
  };

  if (!isAvinodeConfigured()) {
    return {
      ...base,
      ok: false,
      summary:
        "Credentials are missing from this process. Set them in .env.local (local) " +
        "or your host's project settings (deployed), then restart or redeploy.",
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/searches`, {
      method: "POST",
      headers: headers(),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify(sentBody),
    });

    const raw = await response.text();
    let parsed: unknown = raw.slice(0, 20_000);
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Not JSON — the truncated text above is more useful than an error.
    }

    const liftCount = firstArray(parsed, "data.lifts", "lifts", "data.searchResults").length;

    return {
      ...base,
      ok: response.ok,
      httpStatus: response.status,
      responseBody: parsed,
      summary: response.ok
        ? `Avinode answered ${response.status} with ${liftCount} lift(s). ` +
          (liftCount
            ? "The integration is working."
            : "Authentication is fine, but this routing returned no lifts.")
        : `Avinode rejected the call with HTTP ${response.status}. See responseBody.`,
    };
  } catch (error) {
    return {
      ...base,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      summary: `Could not reach ${BASE_URL}. The host may be blocked by a network policy.`,
    };
  }
}
