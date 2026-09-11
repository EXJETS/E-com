# Exjet

A private jet charter landing page built on [Next.js](https://nextjs.org), backed by the
[Avinode Marketplace API](https://sandbox.avinode.com/api). Visitors enter a routing and
get live aircraft availability and operator-backed pricing back in one step.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Avinode credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| --- | --- |
| `AVINODE_API_BASE_URL` | Sandbox by default; point at `https://services.avinode.com/api` for production. |
| `AVINODE_API_TOKEN` | Sent as `X-Avinode-ApiToken` — identifies the integration. |
| `AVINODE_AUTH_TOKEN` | Sent as `Authorization: Bearer …` — identifies the Avinode user. |
| `AVINODE_API_VERSION` | Sent as `X-Avinode-ApiVersion`, defaults to `v1`. Required on every request. |
| `AVINODE_PRODUCT` | Your application's name and version, sent as `X-Avinode-Product`. |
| `AVINODE_DEBUG` | `1` logs the outgoing search body and raw response to the server console. |

`.env.local` is gitignored. Credentials are only ever read in `src/lib/avinode.ts`, which
runs on the server, so they never reach the browser bundle. When deploying, set the same
variables in your hosting provider's environment settings — `.env.local` is not deployed.

## Structure

```
src/
├── app/
│   ├── layout.tsx      Root layout: fonts, header, footer
│   ├── page.tsx        The landing page and its sections
│   └── globals.css     Design tokens and the .jet-* component classes
├── components/
│   ├── SearchForm.tsx  Routing form (client)
│   └── QuoteResults.tsx Quote cards, streamed in on the server
└── lib/
    ├── avinode.ts          Marketplace API client
    ├── charter-fallback.ts Locally estimated quotes
    └── airports.ts         Curated airports and distance maths
```

## How the search works

1. The form submits a plain `GET` to `/`, so every search is a shareable URL and the
   back button works; with JavaScript it adds a pending state and jumps to the results.
2. `searchCharterQuotes()` posts the routing to `POST /searches` and normalizes the
   returned lifts into `CharterQuote` objects.
3. Results stream in behind a `<Suspense>` boundary with a skeleton fallback. Streaming
   is why the results need JavaScript to appear: the initial HTML already carries them,
   but React performs the swap from skeleton to content. Drop the boundary in
   `src/app/page.tsx` if you would rather block the whole page on the Avinode call and
   have results land in the server-rendered HTML.

### Fallback behaviour

When the sandbox is unconfigured, unreachable, or returns no lifts, the page renders
locally estimated quotes from `src/lib/charter-fallback.ts` instead of failing. The result
carries a `source` of `sample` rather than `avinode`, and the UI switches its badge to
"Estimated pricing" and prints the reason — the state is never silent.

### Request format

Avinode requires four headers on every call — `X-Avinode-ApiToken`,
`Authorization: Bearer`, `X-Avinode-ApiVersion` and `X-Avinode-SentTimestamp`. The
timestamp is documented to the minute (`2010-01-01T00:00Z`), not with the milliseconds
`Date.toISOString()` emits, and a missing or malformed one is the documented most common
cause of authentication errors — so `sentTimestamp()` truncates deliberately. Don't
"fix" it back to a full ISO string.

`POST /searches` is the **End Client Trip Search** operation: Avinode restricts it to
business-to-end-client integrations, which is exactly what this page is. If the sandbox
rejects the call with an authorization error even though the tokens are right, check that
the token is provisioned for an end-client application rather than a B2B one.

### Is it actually working? — `npm run avinode:check`

The fastest check, needing no dev server and no deployment:

```bash
npm run avinode:check
```

It reads `.env.local`, makes one real `POST /searches`, and prints the HTTP status
and response body. Token values are never printed — only whether they were found and
how long they are. It distinguishes the three failure modes that look alike: missing
credentials, a network/proxy block (the request never left your network), and Avinode
itself refusing or rejecting the call.

### The same check from the running app — `/api/avinode/health`

Set `AVINODE_DEBUG=1` and open `/api/avinode/health`. It performs one real search
against Avinode and reports the unvarnished result as JSON: which credentials the
process can see (presence and length only — values are never included), the exact
headers and body being sent with the two secret headers redacted, the HTTP status
Avinode returned, and the raw response.

```jsonc
{
  "ok": true,
  "summary": "Avinode answered 200 with 6 lift(s). The integration is working.",
  "credentials": { "AVINODE_API_TOKEN": "set (36 chars)", "...": "..." },
  "sentHeaders": { "Authorization": "<redacted, 674 chars>", "...": "..." },
  "httpStatus": 200,
  "responseBody": { "...": "the real payload, for correcting field paths" }
}
```

Without `AVINODE_DEBUG=1` the route returns 404, so it stays inert in a normal
production deploy. This is the fastest way to tell a credential problem from a
network problem from a response-shape problem.

### Verifying against the live sandbox

The response normalizer in `src/lib/avinode.ts` reads each field from several candidate
paths, because lift payloads nest differently across Marketplace API endpoints and
versions — it accepts both the nested form and the plain-string form
(`aircraftType: "Challenger 350"`) that Avinode's own examples show. Once you can reach the
sandbox, run a search with `AVINODE_DEBUG=1` and confirm the badge reads "Live Avinode
sandbox"; the raw payload is printed to the server console, so if a field comes back blank
you can read the real path off it and add it to the matching `first*()` call. Aircraft photos are deliberately not rendered yet —
`CharterQuote.imageUrl` is captured but unused, since Avinode's image hosts still need
adding to `images.remotePatterns` in `next.config.ts`.

## Wiring this into the exjet.com app

`exjet.com` (GitHub `EXJETS/exjet`) is a complete charter front-end — search, booking
flow, customer dashboard, operator portal, admin — served entirely from static JSON in
`src/data/`. It makes no network calls at all. This repo is the opposite: a working
Avinode data layer behind a single page. `src/lib/exjet-adapter.ts` is the seam between
them.

### The model mismatch

The two apps describe different things, and the adapter is explicit about it rather than
pretending otherwise:

| | exjet's `Jet` | Avinode lift |
| --- | --- | --- |
| Represents | an aircraft **model** in a catalogue | one **tail**, one operator, one routing |
| Price | `hourlyRate` on the model | total for the searched trip |
| Category | 5-value enum | free text ("Super midsize jet") |
| Specs, photos, rating | present | absent |

`toQuotedJet()` maps what the marketplace genuinely provides, derives `hourlyRate` from
the quoted total over billable flight time (comparable across results on one routing),
and fills `range`/`speed` from published per-type figures so the spec line isn't zeros.

`UNAVAILABLE_FIELDS` lists what it deliberately will not invent. **`rating` and
`reviewCount` are the ones that matter**: these are real operators, and manufacturing a
trust score for them would be misleading rather than cosmetic. Hide those elements on
quote-backed cards instead of filling them.

### The change in the exjet app

Copy `src/lib/avinode.ts`, `charter-fallback.ts`, `airports.ts` and `exjet-adapter.ts`
across, add the environment variables, then in `src/app/search/page.tsx` replace the
static import:

```diff
- import jetsData from "@/data/jets.json";
+ import { searchCharterQuotes } from "@/lib/avinode";
+ import { toQuotedJets } from "@/lib/exjet-adapter";
```

`searchCharterQuotes()` is server-only — the credentials must never reach the browser —
so the search page needs to become a Server Component that awaits it and passes results
down, with its current client-side filtering either kept below that boundary or moved
into the query. The existing `FilterSidebar` and `JetGrid` work unchanged, since the
adapter satisfies every field they read (`category`, `hourlyRate`, `passengers`, plus
`name`, `manufacturer`, `range`, `speed` for display).

### Caveat

The category mapping order is load-bearing — `super midsize` must be tested before
`midsize`, and `ultra long`/`long range` before `light`, or aircraft land in the wrong
filter bucket. There is no test runner in this repo to guard that; adding one is worth
doing before this mapping grows.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
