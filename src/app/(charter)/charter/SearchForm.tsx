"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { airports } from "@/lib/airports";

export type SearchDefaults = {
  from: string;
  to: string;
  date: string;
  time: string;
  pax: string;
};

export default function SearchForm({ defaults }: { defaults: SearchDefaults }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState(defaults);

  function update(field: keyof SearchDefaults, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // The form also works without JavaScript — this handler only adds the
  // pending state and the jump down to the results.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams({ ...values, searched: "1" });
    startTransition(() => {
      router.push(`/charter?${query.toString()}#quotes`);
    });
  }

  return (
    <form
      id="search"
      action="/charter"
      method="get"
      onSubmit={onSubmit}
      className="jet-card scroll-mt-24 p-5 sm:p-6"
    >
      <input type="hidden" name="searched" value="1" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.25fr)_minmax(0,0.95fr)_minmax(0,0.7fr)_84px_minmax(140px,auto)] lg:items-end">
        <div className="col-span-2 lg:col-span-1">
          <Field
            label="Departure"
            name="from"
            value={values.from}
            onChange={(value) => update("from", value)}
            placeholder="LTN — London Luton"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <Field
            label="Arrival"
            name="to"
            value={values.to}
            onChange={(value) => update("to", value)}
            placeholder="NCE — Nice"
          />
        </div>

        <div>
          <label className="jet-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="jet-field"
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
          />
        </div>

        <div>
          <label className="jet-label" htmlFor="time">
            Time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className="jet-field"
            value={values.time}
            onChange={(event) => update("time", event.target.value)}
          />
        </div>

        <div>
          <label className="jet-label" htmlFor="pax">
            Guests
          </label>
          <input
            id="pax"
            name="pax"
            type="number"
            min={1}
            max={16}
            required
            className="jet-field"
            value={values.pax}
            onChange={(event) => update("pax", event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="jet-cta col-span-2 flex h-[43px] items-center justify-center gap-2 px-5 text-[14px] lg:col-span-1"
        >
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Searching
            </>
          ) : (
            <>
              Search
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <datalist id="airport-options">
        {airports.map((airport) => (
          <option key={airport.icao} value={airport.iata}>
            {airport.name} — {airport.city}, {airport.country} ({airport.icao})
          </option>
        ))}
      </datalist>

      <p className="mt-4 text-[12px] text-[var(--jet-dim)]">
        Enter an IATA or ICAO code, or start typing a city. One-way pricing, all-in.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="jet-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        required
        autoComplete="off"
        list="airport-options"
        className="jet-field"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
