import { BadgeCheck, Clock, CircleDollarSign, ShieldCheck } from "lucide-react";

const points = [
  { icon: Clock, title: "Same-day service", body: "Call before 2pm and we aim to be there today." },
  { icon: CircleDollarSign, title: "Flat-rate pricing", body: "You approve the price before we start. No hourly meter." },
  { icon: ShieldCheck, title: "No overtime charges", body: "Nights, weekends and holidays cost the same." },
  { icon: BadgeCheck, title: "Licensed & background checked", body: "Every technician, on every visit." },
];

export default function TrustBar() {
  return (
    <section className="border-b border-line bg-surface-alt">
      <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-9">
        {points.map((p) => (
          <div key={p.title} className="flex items-start gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-cool-600 shadow-[0_2px_8px_-4px_rgba(11,26,41,0.3)]">
              <p.icon size={19} />
            </span>
            <div>
              <p className="text-[14.5px] font-bold text-ink">{p.title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-body">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
