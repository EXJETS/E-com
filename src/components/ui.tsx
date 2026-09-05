import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className={`eyebrow mb-3 ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>}
      <h2 className={`h-section ${light ? "!text-white" : ""}`}>{title}</h2>
      {intro && <p className={`lede mt-4 ${light ? "!text-white/70" : ""}`}>{intro}</p>}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-white/55">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {last ? (
                <span className="text-white/85" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-white">
                    {item.name}
                  </Link>
                  <ChevronRight size={13} className="text-white/30" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  trail,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  trail?: { name: string; path: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="ground-navy relative overflow-hidden">
      <div className="ground-grid absolute inset-0" aria-hidden="true" />
      <div className="container-page relative py-14 lg:py-20">
        {trail && <Breadcrumbs trail={trail} />}
        {eyebrow && <p className="eyebrow eyebrow-light mb-3">{eyebrow}</p>}
        <h1 className="h-display max-w-3xl !text-white">{title}</h1>
        {intro && <p className="lede mt-5 max-w-2xl !text-white/72">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Stat({ value, label, light = false }: { value: string; label: string; light?: boolean }) {
  return (
    <div>
      <p
        className={`font-[family-name:var(--font-display)] text-[30px] font-bold leading-none lg:text-[36px] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className={`mt-2 text-[13px] ${light ? "text-white/60" : "text-muted"}`}>{label}</p>
    </div>
  );
}

export function CheckList({ items, light = false }: { items: readonly string[]; light?: boolean }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <svg
            width="19"
            height="19"
            viewBox="0 0 20 20"
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="10" fill={light ? "rgba(124,200,242,0.18)" : "var(--surface-tint)"} />
            <path
              d="M5.8 10.2l2.7 2.7 5.6-5.6"
              stroke="var(--cool-500)"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className={`text-[15px] leading-relaxed ${light ? "text-white/75" : "text-body"}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CTABanner({
  title = "Comfort problem? We can usually be there today.",
  body = "Licensed technicians, upfront flat-rate pricing and no overtime charges — nights, weekends and holidays included.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section-tight">
      <div className="container-page">
        <div className="ground-navy relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-12 lg:py-16">
          <div className="ground-grid absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="h-section !text-white">{title}</h2>
            <p className="lede mt-4 !text-white/70">{body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <PhoneCta />
              <Link href="/schedule" className="btn btn-ghost-light">
                Book online instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PhoneCta({ className = "" }: { className?: string }) {
  return (
    <a href="tel:+12148922225" className={`btn btn-primary ${className}`}>
      Call (214) 892-2225
    </a>
  );
}

export function LinkArrow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cool-600 transition-colors hover:text-cool-500"
    >
      {children}
      <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
