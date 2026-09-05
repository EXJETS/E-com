"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, Phone, ShieldCheck } from "lucide-react";
import { submitBooking, type BookingState } from "@/lib/actions";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const initialState: BookingState = { status: "idle" };

const urgencyOptions = [
  { value: "emergency", label: "Emergency — no heat or cooling now" },
  { value: "today", label: "Today if possible" },
  { value: "this-week", label: "Sometime this week" },
  { value: "flexible", label: "I'm flexible" },
];

export default function BookingForm({
  defaultService,
  compact = false,
}: {
  defaultService?: string;
  compact?: boolean;
}) {
  const [state, formAction] = useActionState(submitBooking, initialState);

  if (state.status === "success") {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-tint text-cool-500">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="h-card mt-5">Request received</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-body">{state.message}</p>
        <a href={site.phone.href} className="btn btn-cool mt-6">
          <Phone size={16} /> {site.phone.display}
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="card p-6 sm:p-8" noValidate>
      <div className="mb-6">
        <h3 className="h-card">Request a service call</h3>
        <p className="mt-1.5 text-sm text-body">
          Tell us what&rsquo;s wrong and a dispatcher will call to confirm your arrival window.
        </p>
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-ember-500/30 bg-ember-500/8 px-4 py-3 text-sm text-ember-600"
        >
          {state.message}
        </p>
      )}

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="Full name" name="name" error={state.errors?.name} autoComplete="name" required />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          error={state.errors?.phone}
          autoComplete="tel"
          placeholder="(214) 555-0100"
          required
        />
        <Field label="Email" name="email" type="email" error={state.errors?.email} autoComplete="email" optional />
        <Field
          label="ZIP code"
          name="zip"
          inputMode="numeric"
          error={state.errors?.zip}
          autoComplete="postal-code"
          placeholder="75201"
          required
        />

        <SelectField label="What do you need?" name="service" error={state.errors?.service} defaultValue={defaultService}>
          <option value="">Select a service…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
          <option value="other">Something else</option>
        </SelectField>

        <SelectField label="How soon?" name="urgency" error={state.errors?.urgency} defaultValue="today">
          <option value="">Select…</option>
          {urgencyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="details" className="mb-1.5 block text-[13px] font-semibold text-ink">
            What&rsquo;s happening? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="details"
            name="details"
            rows={3}
            placeholder="e.g. Upstairs unit is running but blowing warm air since last night."
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-cool-500"
          />
        </div>
      </div>

      {/* Honeypot — visually hidden, never shown to real users */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />

      <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-cool-500" />
        We use your details only to schedule and confirm your visit. No marketing lists, no third-party
        sharing. For an active emergency, calling is always faster than the form.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-70">
      {pending ? (
        <>
          <Loader2 size={17} className="animate-spin" /> Sending…
        </>
      ) : (
        "Request my service call"
      )}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-cool-500 ${
          error ? "border-ember-500" : "border-line"
        }`}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[12.5px] text-ember-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  error,
  children,
  defaultValue,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full appearance-none rounded-lg border bg-white bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-10 text-[15px] text-ink outline-none transition-colors focus:border-cool-500 ${
          error ? "border-ember-500" : "border-line"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%237f93a3'%3E%3Cpath d='M5.5 7.5L10 12l4.5-4.5' stroke='%237f93a3' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
        }}
      >
        {children}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[12.5px] text-ember-600">
          {error}
        </p>
      )}
    </div>
  );
}
