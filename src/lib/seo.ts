import type { Metadata } from "next";
import { site } from "./site";
import { areas } from "./areas";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, "");

export const TITLE_SUFFIX = " | Baker Brothers Plumbing, Air & Electric";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Set false on pages where the title already contains the brand. */
  brandSuffix?: boolean;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  brandSuffix = true,
  noIndex = false,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const fullTitle = brandSuffix ? `${title}${TITLE_SUFFIX}` : title;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.legalName,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/* ── Structured data ──────────────────────────────────────────────────── */

/**
 * Primary entity: an HVACBusiness with three physical locations.
 * Rendered once in the root layout so every page carries it.
 *
 * NOTE: `aggregateRating` is intentionally omitted. Google requires review
 * markup to reflect reviews genuinely collected by the site owner and visible
 * on the page. Add it only once real reviews are wired in (see lib/reviews.ts).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: SITE_URL,
    telephone: site.phone.raw,
    email: site.email,
    foundingDate: String(site.founded),
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Financing",
    areaServed: areas.map((a) => ({
      "@type": "City",
      name: `${a.city}, TX`,
    })),
    address: site.locations.map((l) => ({
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: "US",
    })),
    location: site.locations.map((l) => ({
      "@type": "Place",
      name: `${site.name} — ${l.label}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: l.street,
        addressLocality: l.city,
        addressRegion: l.state,
        postalCode: l.zip,
        addressCountry: "US",
      },
      geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
      telephone: l.phone.href.replace("tel:", ""),
    })),
    openingHoursSpecification: site.hours.spec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
    sameAs: Object.values(site.social),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: site.legalName,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areas.map((a) => ({ "@type": "City", name: `${a.city}, TX` })),
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: site.phone.raw,
      serviceUrl: absoluteUrl("/schedule"),
    },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  date: string;
  updated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.updated ?? input.date,
    mainEntityOfPage: absoluteUrl(input.path),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
