import type { Metadata } from "next";
import Link from "next/link";
import { Award, BadgeCheck, HardHat, Handshake, MapPin, Users } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { CTABanner, CheckList, PageHero, SectionHeading, Stat } from "@/components/ui";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Baker Brothers — DFW HVAC Since 1945",
  description:
    "Three generations of licensed heating, cooling, plumbing and electrical service across Dallas–Fort Worth. How we hire, how we price and why we diagnose before we quote.",
  path: "/about",
  brandSuffix: false,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const values = [
  {
    icon: HardHat,
    title: "Diagnose, then price",
    body: "No technician quotes a replacement before measuring the system. If the readings say repair, we say repair — the technician's pay does not change either way.",
  },
  {
    icon: Handshake,
    title: "One price, printed",
    body: "Flat rate per job, approved before we start. A hard diagnosis is our problem, not a line on your invoice, and there is no overtime multiplier.",
  },
  {
    icon: BadgeCheck,
    title: "Licensed for the whole job",
    body: "HVAC, plumbing and electrical licences under one roof, so a job that crosses trades does not become three companies and three appointments.",
  },
  {
    icon: Users,
    title: "Hired for the long run",
    body: "Background checked, drug tested, and trained continuously. We would rather grow slowly than staff up with people we would not send to our own parents' house.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <PageHero
        eyebrow={`Serving DFW since ${site.founded}`}
        title="Eighty years of North Texas houses"
        intro="Baker Brothers started as a family plumbing outfit in Dallas and grew into a whole-home service company because customers kept asking us to look at the rest of the house. The trades changed. The way we quote a job did not."
        trail={trail}
      >
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-8">
          {site.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} light />
          ))}
        </div>
      </PageHero>

      <div className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="prose-body">
            <h2>Where we came from</h2>
            <p>
              We opened in {site.founded}, when Dallas was a fraction of its current size and most of the
              houses we now service had not been built. Three generations later we run out of three service
              centres — Dallas, Arlington and McKinney — covering more than 35 cities across six counties.
            </p>
            <p>
              What has kept the business here through eight decades is not marketing. It is that a
              homeowner in Richardson tells a neighbour in Plano, and that has compounded for a very long
              time. It also means we cannot afford a bad job, because in this business word travels
              further than any advertisement.
            </p>

            <h2>What we actually do differently</h2>
            <p>
              Most HVAC work looks identical from the outside. The differences are in the parts of the job
              nobody watches: whether the technician measured superheat and subcooling before deciding the
              charge was low, whether the load calculation was run or the old sticker was copied, whether
              the install was commissioned or just switched on.
            </p>
            <p>
              We do those things because they are the difference between a system that lasts twelve years
              and one that lasts twenty. They cost us time on every visit. That is the trade we have chosen
              to make.
            </p>

            <h2>How our technicians are paid</h2>
            <p>
              This is the question we would ask if we were hiring a contractor, and it is rarely answered
              honestly. Our technicians are not paid a percentage of what they sell. A recommendation to
              replace a system earns the same as a recommendation to repair one, which removes the single
              largest source of bad advice in this industry.
            </p>

            <h2>Licensing and accountability</h2>
            <p>
              We hold Texas state licences in all three trades, we pull permits for work that requires them,
              and we meet the inspector. Unpermitted equipment replacement can void a manufacturer warranty
              and turn up as a problem years later during a home sale — a shortcut that costs the customer,
              not the contractor.
            </p>
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <p className="eyebrow mb-4">Licences</p>
              <ul className="space-y-2.5">
                {site.licenses.map((l) => (
                  <li key={l} className="flex items-start gap-2.5 text-[14px] text-body">
                    <Award size={16} className="mt-0.5 shrink-0 text-cool-500" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <p className="eyebrow mb-4">Service centres</p>
              <ul className="space-y-4">
                {site.locations.map((l) => (
                  <li key={l.id} className="flex items-start gap-2.5 text-[14px] text-body">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-cool-500" />
                    <span>
                      <span className="block font-semibold text-ink">{l.label}</span>
                      {l.street}, {l.city}, {l.state} {l.zip}
                      <br />
                      <a href={l.phone.href} className="text-cool-600 hover:underline">
                        {l.phone.display}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ground-navy relative overflow-hidden rounded-2xl p-6">
              <div className="ground-grid absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <p className="eyebrow eyebrow-light mb-4">What you can expect</p>
                <CheckList
                  light
                  items={[
                    "Two-hour arrival windows",
                    "Technician name and photo before arrival",
                    "Shoe covers and drop cloths, every visit",
                    "Written price before work starts",
                    "The area left cleaner than we found it",
                  ]}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="section bg-surface-alt">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we work"
            title="Four commitments we will not trade away"
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface-tint text-cool-600">
                  <v.icon size={20} />
                </span>
                <h3 className="h-card mt-5">{v.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-body">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/reviews" className="btn btn-outline">
              See what customers say
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
