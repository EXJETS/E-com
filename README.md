This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Charter landing page (Avinode)

`/charter` is a private-jet charter landing page backed by the
[Avinode Marketplace API](https://sandbox.avinode.com/api) sandbox. It lives in the
`(charter)` route group with its own dark theme and chrome, separate from the
`(store)` route group that holds the GlowCart storefront.

### Setup

Copy `.env.example` to `.env.local` and fill in your sandbox credentials:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `AVINODE_API_BASE_URL` | Sandbox by default; point at `https://services.avinode.com/api` for production. |
| `AVINODE_API_TOKEN` | Sent as `X-Avinode-ApiToken` — identifies the integration. |
| `AVINODE_AUTH_TOKEN` | Sent as `Authorization: Bearer …` — identifies the Avinode user. |
| `AVINODE_PRODUCT` | Free-form integration name, sent as `X-Avinode-Product`. |

`.env.local` is gitignored. Credentials are only ever read in `src/lib/avinode.ts`,
which runs on the server, so they never reach the browser bundle.

### How it works

1. The search form submits a plain `GET` to `/charter`, so it works without JavaScript;
   with JavaScript it adds a pending state and jumps to the results.
2. `searchCharterQuotes()` posts the routing to `POST /searches` and normalizes the
   returned lifts into `CharterQuote` objects.
3. Results stream in behind a `<Suspense>` boundary with a skeleton fallback.

### Fallback behaviour

When the sandbox is unconfigured, unreachable, or returns no lifts, the page renders
locally estimated quotes from `src/lib/charter-fallback.ts` instead of failing. The
result carries a `source` of `sample` rather than `avinode`, and the UI switches its
badge to "Estimated pricing" and prints the reason — the state is never silent.

### Verifying against the live sandbox

The response normalizer in `src/lib/avinode.ts` reads each field from several candidate
paths, because lift payloads nest differently across Marketplace API endpoints and
versions. Once you can reach the sandbox, run a search and confirm the badge reads
"Live Avinode sandbox"; if fields come back blank, log the raw payload and add the
correct path to the matching `first*()` call. Aircraft photos are deliberately not
rendered yet — `CharterQuote.imageUrl` is captured but unused, since Avinode's image
hosts still need adding to `images.remotePatterns` in `next.config.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
