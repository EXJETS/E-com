# Baker Brothers — HVAC Website

A modernised, SEO-first marketing site for **Baker Brothers Plumbing, Air & Electric**
(Dallas–Fort Worth), built with Next.js 16 (App Router), React 19 and Tailwind CSS v4.

The site is fully statically prerendered — 71 routes at the time of writing — so every
page is served as static HTML and client navigation is instant.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
```

## Route map

| Route | Purpose |
| --- | --- |
| `/` | Landing page — hero, trust bar, services, process, offers, reviews, membership, areas, FAQ, blog, CTA |
| `/services` | Service hub, grouped by category |
| `/services/[slug]` | 10 long-form service pages (AC repair, installation, maintenance, heating, IAQ, ductwork, thermostats, emergency, commercial) |
| `/service-areas` | Service-area directory grouped by metro region |
| `/service-areas/[city]` | 37 local landing pages with city-specific copy, ZIPs, county and nearest depot |
| `/blog`, `/blog/[slug]` | 6 long-form editorial articles |
| `/specials` | Current offers with printed terms |
| `/membership` | Comfort Club maintenance plans |
| `/financing` | Payment plans and financing FAQ |
| `/reviews` | Customer feedback |
| `/about`, `/contact`, `/faq`, `/schedule` | Company, contact, FAQ hub, booking |
| `/sitemap.xml`, `/robots.txt` | Generated from the content model |

Adding a service or a city is a data edit, not a page: append to `src/lib/services.ts`
or `src/lib/areas.ts` and the route, sitemap entry, nav item, footer link and internal
links all follow.

## SEO implementation

- **Metadata** — every route builds its own title, description, canonical URL and
  OpenGraph/Twitter tags through `pageMetadata()` in `src/lib/seo.ts`.
- **Structured data** — `HVACBusiness` + `WebSite` on every page (root layout), plus
  per-page `Service`, `BreadcrumbList`, `FAQPage` and `Article` graphs.
- **Sitemap & robots** — generated from the content model with per-section priorities.
- **OG image** — generated at build time from `src/app/opengraph-image.tsx`.
- **Internal linking** — service ⇄ city ⇄ article cross-links plus a footer city index.

`aggregateRating` markup is deliberately **not** emitted. See "Before launch" below.

## Project layout

```
src/
  app/                 routes, sitemap, robots, OG image, 404
  components/          Header, Footer, BookingForm, Accordion, cards, shared UI
  lib/
    site.ts            NAP data, hours, licences, locations
    services.ts        service catalogue + page copy + FAQs
    areas.ts           service-area directory
    posts.ts           blog content
    reviews.ts         testimonials (placeholder — see below)
    offers.ts          specials, membership plans, general FAQs
    seo.ts             metadata + JSON-LD builders
    actions.ts         booking Server Action
```

## Configuration

Set the canonical origin in production:

```
NEXT_PUBLIC_SITE_URL=https://www.bakerbrothersplumbing.com
```

It falls back to `site.url` in `src/lib/site.ts`.

## Before launch

These are deliberate stubs, each marked with a comment in the source:

1. **Booking form delivery** — `src/lib/actions.ts` validates submissions but does not
   deliver them. Wire it to the dispatch system (ServiceTitan / Housecall Pro / CRM
   webhook) plus a transactional email provider, and add a spam control (Turnstile or
   reCAPTCHA) and rate limiting.
2. **Reviews** — `src/lib/reviews.ts` contains placeholder quotes attributed to an
   anonymous "Verified customer". Replace with verified reviews, then enable
   `aggregateRating` in `src/lib/seo.ts`. Publishing review markup for reviews you
   cannot evidence violates Google's structured-data policy.
3. **Business data** — verify every value in `src/lib/site.ts` (addresses, phone
   numbers, licence numbers, hours) and in `src/lib/areas.ts` (counties, ZIPs).
   Inconsistent NAP data across the web hurts local ranking.
4. **Offer pricing** — figures in `src/lib/offers.ts` are illustrative. Advertised
   prices and expiry terms are a legal exposure, not just a copy decision.
5. **Photography** — the design is intentionally photo-free (gradients, SVG, Lucide
   icons) so it ships without stock imagery. Real job-site and team photography would
   be the highest-impact visual upgrade.
6. **Analytics** — no analytics or call tracking is wired up yet.
