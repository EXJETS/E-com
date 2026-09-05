import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";

/** Brand marks are not part of the Lucide set, so they are inlined here. */
const socialIcons = {
  facebook: {
    label: "Facebook",
    path: "M14 8.5V7c0-.7.5-.9.9-.9H16V3.6l-2-.1c-2.3 0-3.4 1.4-3.4 3.3v1.7H8.7V11h1.9v9.4h3.1V11h2.1l.4-2.5H14Z",
  },
  instagram: {
    label: "Instagram",
    path: "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 7.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Zm5.6-7.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8.4 3.2h7.2A5.2 5.2 0 0 1 20.8 8.4v7.2a5.2 5.2 0 0 1-5.2 5.2H8.4a5.2 5.2 0 0 1-5.2-5.2V8.4a5.2 5.2 0 0 1 5.2-5.2Zm0 1.7A3.5 3.5 0 0 0 4.9 8.4v7.2a3.5 3.5 0 0 0 3.5 3.5h7.2a3.5 3.5 0 0 0 3.5-3.5V8.4a3.5 3.5 0 0 0-3.5-3.5H8.4Z",
  },
  youtube: {
    label: "YouTube",
    path: "M21.3 8.1a2.4 2.4 0 0 0-1.7-1.7C18.1 6 12 6 12 6s-6.1 0-7.6.4A2.4 2.4 0 0 0 2.7 8.1 25 25 0 0 0 2.3 12c0 1.3.1 2.6.4 3.9a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.6.4 7.6.4s6.1 0 7.6-.4a2.4 2.4 0 0 0 1.7-1.7c.3-1.3.4-2.6.4-3.9 0-1.3-.1-2.6-.4-3.9ZM10.1 14.9V9.1l5.1 2.9-5.1 2.9Z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M6.9 20.4H3.6V9.7h3.3v10.7ZM5.2 8.2A1.9 1.9 0 1 1 5.2 4.4a1.9 1.9 0 0 1 0 3.8Zm15.2 12.2h-3.3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.4-2 2.7v5.3H10V9.7h3.2v1.5h.1c.5-.9 1.6-1.7 3.2-1.7 3.4 0 4 2.2 4 5.1v5.8Z",
  },
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  // pb-16 clears the fixed mobile call bar on small screens
  return (
    <footer className="ground-navy mt-auto pb-16 text-white/70 sm:pb-0">
      <div className="rule-gradient" />

      <div className="container-page py-14 lg:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          {/* Brand + contact */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-[22px] font-bold text-white">
              Baker Brothers
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.17em] text-cool-300">
              Plumbing · Air · Electric
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Licensed heating, cooling, plumbing and electrical service across the Dallas–Fort Worth
              metroplex since {site.founded}.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a href={site.phone.href} className="flex items-center gap-2.5 text-white transition-colors hover:text-cool-300">
                <Phone size={16} className="shrink-0 text-cool-400" />
                <span className="font-semibold">{site.phone.display}</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail size={16} className="shrink-0 text-cool-400" />
                {site.email}
              </a>
              <p className="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-cool-400" />
                <span>
                  Mon–Fri {site.hours.weekday}
                  <br />
                  Sat–Sun {site.hours.weekend}
                  <br />
                  <span className="text-ember-400">24/7 emergency dispatch</span>
                </span>
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              {(Object.keys(socialIcons) as (keyof typeof socialIcons)[]).map((key) => {
                const icon = socialIcons[key];
                return (
                  <a
                    key={key}
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={icon.label}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 transition-colors hover:border-cool-400 hover:text-white"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={icon.path} />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="transition-colors hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="font-semibold text-cool-300 transition-colors hover:text-white">
                  All services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Reviews", href: "/reviews" },
                { label: "Current Specials", href: "/specials" },
                { label: "Comfort Club", href: "/membership" },
                { label: "Financing", href: "/financing" },
                { label: "HVAC Advice", href: "/blog" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Book Service", href: "/schedule" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white">Service Centres</h3>
            <ul className="space-y-4 text-sm">
              {site.locations.map((l) => (
                <li key={l.id} className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-cool-400" />
                  <span>
                    <span className="block font-semibold text-white">{l.label}</span>
                    {l.street}
                    <br />
                    {l.city}, {l.state} {l.zip}
                    <br />
                    <a href={l.phone.href} className="text-cool-300 hover:text-white">
                      {l.phone.display}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service-area link farm — genuine internal linking for local SEO */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            HVAC Service Across Dallas–Fort Worth
          </h3>
          <ul className="flex flex-wrap gap-x-1 gap-y-1.5 text-[13px]">
            {areas.map((a, i) => (
              <li key={a.slug} className="flex items-center gap-1">
                <Link href={`/service-areas/${a.slug}`} className="transition-colors hover:text-white">
                  {a.city}
                </Link>
                {i < areas.length - 1 && <span className="text-white/20">·</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-[12.5px] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            {site.licenses.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
