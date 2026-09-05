/**
 * Promotional offers and membership tiers.
 *
 * ⚠️ Pricing and offer terms are illustrative placeholders for the redesign.
 * Confirm every figure with the client before launch — advertised prices and
 * expiry dates are a legal exposure, not just a copy decision.
 */

export type Offer = {
  id: string;
  headline: string;
  value: string;
  detail: string;
  terms: string;
  service: string;
  href: string;
};

export const offers: Offer[] = [
  {
    id: "tuneup",
    headline: "Precision AC Tune-Up",
    value: "$89",
    detail: "Our full 26-point cooling inspection, coil wash and condensate treatment — booked before the first 100° week.",
    terms: "One system. Additional systems discounted. Cannot be combined with other offers.",
    service: "AC Maintenance",
    href: "/services/ac-maintenance",
  },
  {
    id: "diagnostic",
    headline: "Repair Diagnostic Fee Waived",
    value: "$0",
    detail: "Approve the repair and the diagnostic fee comes off the invoice. Nights, weekends and holidays included.",
    terms: "Applies when a quoted repair is approved on the same visit.",
    service: "AC Repair",
    href: "/services/ac-repair",
  },
  {
    id: "system",
    headline: "New System Installation",
    value: "Up to $1,500 off",
    detail: "Manufacturer and seasonal savings on qualifying high-efficiency systems, plus a free first year of maintenance.",
    terms: "On qualifying complete system installations. Subject to equipment availability.",
    service: "AC Installation",
    href: "/services/ac-installation",
  },
  {
    id: "financing",
    headline: "Financing From 0% APR",
    value: "0% APR",
    detail: "Promotional terms on qualifying system replacements, with a decision usually inside a few minutes.",
    terms: "With approved credit. Terms and conditions apply.",
    service: "Financing",
    href: "/financing",
  },
  {
    id: "duct",
    headline: "Free Duct Evaluation",
    value: "Free",
    detail: "Static pressure and airflow testing with photographs of every problem we find, included with any replacement estimate.",
    terms: "Included with an in-home system replacement estimate.",
    service: "Ductwork",
    href: "/services/ductwork",
  },
  {
    id: "iaq",
    headline: "Whole-Home Air Quality",
    value: "$100 off",
    detail: "Media filtration cabinets, UV-C coil treatment and whole-home dehumidification.",
    terms: "On qualifying indoor air quality equipment installations.",
    service: "Indoor Air Quality",
    href: "/services/indoor-air-quality",
  },
];

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "comfort",
    name: "Comfort Club",
    price: "$16",
    cadence: "per month",
    summary: "The maintenance baseline. Two precision tune-ups a year and priority when something goes wrong.",
    features: [
      "Two precision tune-ups a year — cooling and heating",
      "Priority scheduling ahead of non-members",
      "15% off all repairs",
      "No overtime charges, ever",
      "Maintenance records kept for your warranty claims",
      "Transferable if you sell the house",
    ],
  },
  {
    id: "comfort-plus",
    name: "Comfort Club Plus",
    price: "$29",
    cadence: "per month",
    summary: "Everything in Comfort Club plus whole-home coverage — HVAC, plumbing and electrical safety inspections.",
    features: [
      "Everything in Comfort Club",
      "20% off all repairs",
      "Annual whole-home plumbing inspection",
      "Annual electrical safety inspection",
      "Free standard filter replacements",
      "Front-of-queue emergency dispatch",
      "$50 loyalty credit accrued each year toward a future system",
    ],
    featured: true,
  },
  {
    id: "commercial",
    name: "Commercial Agreement",
    price: "Custom",
    cadence: "per unit",
    summary: "Planned maintenance for rooftop units and light commercial systems, scheduled outside your trading hours.",
    features: [
      "Quarterly or semi-annual visits per unit",
      "Filter and belt programme included",
      "Refrigerant logging and compliance documentation",
      "Written per-unit condition reports",
      "Priority commercial dispatch",
      "No after-hours premium on planned work",
    ],
  },
];

export const generalFaqs = [
  {
    q: "How quickly can you get to me?",
    a: "Most Dallas–Fort Worth addresses get a same-day arrival window when you call before 2:00 PM. We dispatch 24 hours a day for no-cooling and no-heat emergencies, and Comfort Club members are moved ahead of the general queue.",
  },
  {
    q: "Do you charge by the hour?",
    a: "No. Every repair is quoted at a flat rate for the job, and you approve that price before any work starts. A difficult diagnosis never costs you more than a simple one.",
  },
  {
    q: "Do you charge extra for nights, weekends or holidays?",
    a: "No. There is no overtime multiplier on our pricing. A 2:00 AM Sunday call is priced exactly like a Tuesday afternoon.",
  },
  {
    q: "Are your technicians licensed and background checked?",
    a: "Every technician is licensed for the trade they perform, background checked and drug tested. They arrive in a marked vehicle, in uniform, and wear shoe covers indoors.",
  },
  {
    q: "What areas do you serve?",
    a: "We cover the Dallas–Fort Worth metroplex from three service centres in Dallas, Arlington and McKinney — more than 35 cities across Dallas, Collin, Tarrant, Denton, Rockwall and Kaufman counties.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes, on system replacements and larger repairs, with promotional 0% terms available on qualifying equipment with approved credit. We show you the monthly payment alongside the estimated energy savings.",
  },
  {
    q: "Is there a warranty on your work?",
    a: "Parts and labour we supply on a repair carry a one-year warranty. New system installations carry a 10-year manufacturer parts warranty and a 2-year labour warranty from us.",
  },
  {
    q: "Do you handle permits?",
    a: "Yes. Equipment replacement requires a mechanical permit in every DFW municipality. We pull it, schedule the inspection and meet the inspector — it is included, not an extra.",
  },
];
