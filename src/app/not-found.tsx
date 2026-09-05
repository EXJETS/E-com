import Link from "next/link";
import { Phone } from "lucide-react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="ground-navy relative overflow-hidden">
      <div className="ground-grid absolute inset-0" aria-hidden="true" />
      <div className="container-page relative py-24 text-center lg:py-32">
        <p className="eyebrow eyebrow-light justify-center">Error 404</p>
        <h1 className="h-display mx-auto mt-4 max-w-2xl !text-white">
          That page has moved on to a cooler climate.
        </h1>
        <p className="lede mx-auto mt-5 max-w-lg !text-white/70">
          The link is broken or the page no longer exists. Here is the quickest way back to something
          useful.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={site.phone.href} className="btn btn-primary">
            <Phone size={17} /> {site.phone.display}
          </a>
          <Link href="/" className="btn btn-ghost-light">
            Back to the homepage
          </Link>
        </div>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/70 transition-colors hover:border-cool-400 hover:text-white"
              >
                {s.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
