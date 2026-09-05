"use server";

import { services } from "./services";

export type BookingState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → error message. */
  errors?: Record<string, string>;
};

const VALID_SERVICES = new Set<string>([...services.map((s) => s.slug), "other"]);
const VALID_URGENCY = new Set(["emergency", "today", "this-week", "flexible"]);

function clean(value: FormDataEntryValue | null, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Handles a service request submission.
 *
 * ⚠️ INTEGRATION POINT: this validates the request and returns a confirmation,
 * but does not yet deliver it anywhere. Before launch, wire the marked section
 * below to the client's dispatch system (ServiceTitan / Housecall Pro / a CRM
 * webhook) and to a transactional email provider, and add a spam control
 * (Turnstile or reCAPTCHA) plus rate limiting — public forms on trades sites
 * attract heavy bot traffic.
 */
export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot: bots fill hidden fields, humans do not.
  if (clean(formData.get("company"))) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const name = clean(formData.get("name"), 120);
  const phone = clean(formData.get("phone"), 40);
  const email = clean(formData.get("email"), 160);
  const zip = clean(formData.get("zip"), 12);
  const service = clean(formData.get("service"), 60);
  const urgency = clean(formData.get("urgency"), 30);
  const details = clean(formData.get("details"), 2000);

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Please tell us your name.";

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Enter a 10-digit phone number so we can confirm your window.";

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (!/^\d{5}$/.test(zip)) errors.zip = "Enter your 5-digit ZIP code.";

  if (!VALID_SERVICES.has(service)) errors.service = "Choose the service you need.";

  if (!VALID_URGENCY.has(urgency)) errors.urgency = "Let us know how soon you need us.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  // ── INTEGRATION POINT ───────────────────────────────────────────────────
  // await dispatchToCrm({ name, phone, email, zip, service, urgency, details });
  // await sendConfirmationEmail(email);
  // ────────────────────────────────────────────────────────────────────────
  void details;

  return {
    status: "success",
    message:
      urgency === "emergency"
        ? "Request received. For an active emergency, please also call (214) 892-2225 — a dispatcher answers 24/7."
        : "Request received. A dispatcher will call you to confirm your arrival window.",
  };
}
