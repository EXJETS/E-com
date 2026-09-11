"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  ArrowLeftRight,
  Search,
  Loader2,
} from "lucide-react";
import { airports } from "@/lib/airports";

export type SearchDefaults = {
  from: string;
  to: string;
  date: string;
  time: string;
  pax: string;
  returnDate: string;
  trip: "oneway" | "roundtrip";
};

/**
 * Ported from the exjet.com booking widget
 * (EXJETS/exjet `src/components/booking/flight-booking-widget.tsx`), restyled
 * for this page's dark theme and wired to the Avinode search.
 */
export default function SearchForm({ defaults }: { defaults: SearchDefaults }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(defaults);

  function update<K extends keyof SearchDefaults>(field: K, value: SearchDefaults[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function swap() {
    setValues((current) => ({ ...current, from: current.to, to: current.from }));
  }

  function setPax(next: number) {
    update("pax", String(Math.min(19, Math.max(1, next))));
  }

  // A plain GET keeps every search linkable and the back button honest; this
  // handler only adds the pending state and the jump down to the results.
  // (The results themselves stream in behind Suspense, so they do need JS.)
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams({
      from: values.from,
      to: values.to,
      date: values.date,
      time: values.time,
      pax: values.pax,
      trip: values.trip,
      searched: "1",
    });
    if (values.trip === "roundtrip" && values.returnDate) {
      query.set("returnDate", values.returnDate);
    }
    startTransition(() => {
      router.push(`/?${query.toString()}#quotes`);
    });
  }

  const isRoundTrip = values.trip === "roundtrip";

  return (
    <form
      id="search"
      action="/"
      method="get"
      onSubmit={onSubmit}
      className="jet-card scroll-mt-24 overflow-hidden"
    >
      <input type="hidden" name="searched" value="1" />
      <input type="hidden" name="trip" value={values.trip} />

      {/* Trip type */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--jet-line-soft)] px-4 py-3 sm:px-5">
        <p className="jet-eyebrow">Charter · book the whole aircraft</p>
        <div className="flex items-center rounded-full border border-[var(--jet-line-soft)] p-0.5 text-[12px]">
          {(["oneway", "roundtrip"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update("trip", option)}
              aria-pressed={values.trip === option}
              className={
                values.trip === option
                  ? "rounded-full bg-[var(--jet-gold)] px-3 py-1 font-medium text-[#17120A]"
                  : "rounded-full px-3 py-1 text-[var(--jet-muted)] transition-colors hover:text-[var(--jet-text)]"
              }
            >
              {option === "oneway" ? "One-way" : "Round-trip"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div
          className={
            isRoundTrip
              ? "grid gap-2 md:grid-cols-[1fr_auto_1fr_1fr_0.8fr_1fr_auto]"
              : "grid gap-2 md:grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto]"
          }
        >
          <Field
            icon={PlaneTakeoff}
            id="from"
            label="From"
            placeholder="LTN — London Luton"
            value={values.from}
            onChange={(v) => update("from", v)}
            list="airport-options"
          />

          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="mb-1 hidden h-10 w-10 items-center justify-center self-end rounded-full border border-[var(--jet-line-soft)] text-[var(--jet-muted)] transition-colors hover:border-[var(--jet-gold)] hover:text-[var(--jet-text)] md:flex"
          >
            <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <Field
            icon={PlaneLanding}
            id="to"
            label="To"
            placeholder="NCE — Nice"
            value={values.to}
            onChange={(v) => update("to", v)}
            list="airport-options"
          />

          <Field
            icon={Calendar}
            id="date"
            label="Depart"
            type="date"
            value={values.date}
            onChange={(v) => update("date", v)}
          />

          <Field
            icon={Clock}
            id="time"
            label="Time"
            type="time"
            value={values.time}
            onChange={(v) => update("time", v)}
          />

          {isRoundTrip && (
            <Field
              icon={Calendar}
              id="returnDate"
              label="Return"
              type="date"
              value={values.returnDate}
              onChange={(v) => update("returnDate", v)}
            />
          )}

          <button
            type="submit"
            disabled={isPending}
            className="jet-cta group mt-2 inline-flex h-[58px] items-center justify-center gap-2 self-end px-6 text-[13px] md:mt-0"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching
              </>
            ) : (
              <>
                <Search className="h-4 w-4" strokeWidth={2.25} />
                Search
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </>
            )}
          </button>
        </div>

        <div className="mt-2 grid gap-2 md:max-w-xs">
          <PaxField value={Number(values.pax) || 1} onChange={setPax} />
        </div>

        <datalist id="airport-options">
          {airports.map((airport) => (
            <option key={airport.icao} value={airport.iata}>
              {airport.name} — {airport.city}, {airport.country} ({airport.icao})
            </option>
          ))}
        </datalist>

        <p className="mt-4 text-[11px] text-[var(--jet-dim)]">
          No account required to quote. IATA or ICAO codes, or start typing a city.
        </p>
      </div>
    </form>
  );
}

function Field({
  icon: Icon,
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  list,
}: {
  icon: typeof Users;
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  list?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="group flex h-[58px] flex-col justify-center rounded-xl border border-[var(--jet-line-soft)] bg-[rgba(8,13,22,0.6)] px-3 py-1 transition-colors focus-within:border-[var(--jet-gold)] focus-within:bg-[rgba(8,13,22,0.9)]"
    >
      <span className="jet-label mb-0">{label}</span>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-[var(--jet-gold)]" strokeWidth={1.75} />
        <input
          id={id}
          name={id}
          type={type}
          required
          list={list}
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 bg-transparent text-[14px] text-[var(--jet-text)] outline-none placeholder:text-[var(--jet-dim)]"
        />
      </div>
    </label>
  );
}

function PaxField({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex h-[58px] flex-col justify-center rounded-xl border border-[var(--jet-line-soft)] bg-[rgba(8,13,22,0.6)] px-3 py-1">
      <span className="jet-label mb-0">Passengers</span>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 shrink-0 text-[var(--jet-gold)]" strokeWidth={1.75} />
        <div className="flex flex-1 items-center justify-between">
          <span className="text-[14px] text-[var(--jet-text)]">
            {value} {value === 1 ? "Guest" : "Guests"}
          </span>
          <input type="hidden" name="pax" value={value} />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onChange(value - 1)}
              disabled={value <= 1}
              aria-label="Decrease passengers"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jet-line-soft)] text-[var(--jet-muted)] transition-colors hover:border-[var(--jet-gold)] hover:text-[var(--jet-text)] disabled:opacity-40"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => onChange(value + 1)}
              disabled={value >= 19}
              aria-label="Increase passengers"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--jet-line-soft)] text-[var(--jet-muted)] transition-colors hover:border-[var(--jet-gold)] hover:text-[var(--jet-text)] disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
