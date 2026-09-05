/**
 * ⚠️ PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
 *
 * These quotes are written to demonstrate layout and length only. They are
 * NOT real customer reviews and are deliberately attributed to an anonymous
 * "Verified customer" rather than a named person. Swap them for verified
 * reviews (Google, Yelp, BBB) before this site goes live, and only then
 * enable the aggregateRating structured data in `src/lib/seo.ts` — publishing
 * review markup for reviews you cannot evidence violates Google's policy.
 */

export type Review = {
  quote: string;
  attribution: string;
  city: string;
  service: string;
  rating: 5;
};

export const reviews: Review[] = [
  {
    quote:
      "Called at 8am on a Saturday when the house was already at 84 degrees. A technician was here before noon, showed me the failed capacitor reading on his meter, and gave me the price before he did anything. Cool air by 1pm.",
    attribution: "Verified customer",
    city: "Plano, TX",
    service: "AC Repair",
    rating: 5,
  },
  {
    quote:
      "Three companies quoted us on a new system. Baker Brothers was the only one who actually measured the house instead of just reading the sticker on the old unit — and they came back a half ton smaller than everyone else. Upstairs has never been this even.",
    attribution: "Verified customer",
    city: "Frisco, TX",
    service: "AC Installation",
    rating: 5,
  },
  {
    quote:
      "The tune-up caught a contactor that was pitting badly. It cost me a fraction of what a July breakdown would have, which I know because that is exactly what happened to us the year before.",
    attribution: "Verified customer",
    city: "Richardson, TX",
    service: "AC Maintenance",
    rating: 5,
  },
  {
    quote:
      "No heat during the freeze and we have a newborn. They were honest that it would be late, told us where we sat in the queue, and then actually turned up when they said they would. No holiday surcharge either.",
    attribution: "Verified customer",
    city: "Fort Worth, TX",
    service: "Emergency HVAC",
    rating: 5,
  },
  {
    quote:
      "They sealed the attic ducts instead of selling me a bigger unit like the last company tried to. Back bedroom finally gets air and my summer bill dropped noticeably.",
    attribution: "Verified customer",
    city: "Garland, TX",
    service: "Ductwork",
    rating: 5,
  },
  {
    quote:
      "The technician tested for carbon monoxide without me asking and walked me through the numbers. Everything was fine, but I appreciated that it was standard practice rather than something I had to request.",
    attribution: "Verified customer",
    city: "Arlington, TX",
    service: "Heating Repair",
    rating: 5,
  },
];

export const reviewPlatforms = [
  { name: "Google", score: "4.9", count: "6,200+" },
  { name: "Facebook", score: "4.8", count: "900+" },
  { name: "BBB", score: "A+", count: "Accredited" },
];
