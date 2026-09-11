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
| `AVINODE_PRODUCT` | Free-form integration name, sent as `X-Avinode-Product`. |

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

### Verifying against the live sandbox

The response normalizer in `src/lib/avinode.ts` reads each field from several candidate
paths, because lift payloads nest differently across Marketplace API endpoints and
versions. Once you can reach the sandbox, run a search and confirm the badge reads
"Live Avinode sandbox"; if fields come back blank, log the raw payload and add the correct
path to the matching `first*()` call. Aircraft photos are deliberately not rendered yet —
`CharterQuote.imageUrl` is captured but unused, since Avinode's image hosts still need
adding to `images.remotePatterns` in `next.config.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
