/**
 * Central business profile (NAP data, hours, offers).
 *
 * NOTE FOR LAUNCH: every value below is used to build the site copy, the
 * click-to-call links and the LocalBusiness structured data. Verify each
 * field with the client before going live — Google penalises inconsistent
 * NAP (Name / Address / Phone) data across the web.
 */

export const site = {
  name: "Baker Brothers",
  legalName: "Baker Brothers Plumbing, Air & Electric",
  shortName: "Baker Brothers Plumbing, Air & Electric",
  tagline: "Dallas–Fort Worth heating & air conditioning, done right the first time.",
  description:
    "Licensed HVAC, plumbing and electrical experts serving Dallas–Fort Worth since 1945. Same-day AC repair, upfront flat-rate pricing and 24/7 emergency service.",
  founded: 1945,
  url: "https://www.bakerbrothersplumbing.com",
  email: "service@bakerbrothersplumbing.com",

  phone: {
    display: "(214) 892-2225",
    href: "tel:+12148922225",
    raw: "+1-214-892-2225",
  },

  hours: {
    label: "Open 7 days a week · 24/7 emergency dispatch",
    weekday: "7:00 AM – 8:00 PM",
    weekend: "8:00 AM – 6:00 PM",
    // schema.org openingHours format
    spec: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "20:00" },
      { days: ["Saturday", "Sunday"], opens: "08:00", closes: "18:00" },
    ],
  },

  locations: [
    {
      id: "dallas",
      label: "Dallas",
      street: "2615 Big Town Blvd",
      city: "Dallas",
      state: "TX",
      zip: "75150",
      phone: { display: "(214) 892-2225", href: "tel:+12148922225" },
      geo: { lat: 32.8123, lng: -96.6289 },
    },
    {
      id: "arlington",
      label: "Arlington",
      street: "7315 E Commercial Blvd",
      city: "Arlington",
      state: "TX",
      zip: "76001",
      phone: { display: "(817) 595-0116", href: "tel:+18175950116" },
      geo: { lat: 32.6448, lng: -97.1305 },
    },
    {
      id: "mckinney",
      label: "McKinney",
      street: "7300 State Highway 121, Suite 300",
      city: "McKinney",
      state: "TX",
      zip: "75070",
      phone: { display: "(972) 486-9882", href: "tel:+19724869882" },
      geo: { lat: 33.1, lng: -96.7 },
    },
  ],

  licenses: [
    "TACLA #18497C (Texas HVAC)",
    "M-16773 (Texas Master Plumber)",
    "TECL #24951 (Texas Electrical)",
  ],

  social: {
    facebook: "https://www.facebook.com/bakerbrothersplumbing",
    instagram: "https://www.instagram.com/bakerbrothersplumbing",
    youtube: "https://www.youtube.com/@bakerbrothersplumbing",
    linkedin: "https://www.linkedin.com/company/baker-brothers-plumbing",
  },

  stats: [
    { value: "80+", label: "Years serving DFW" },
    { value: "250k+", label: "Homes serviced" },
    { value: "4.9★", label: "Average review score" },
    { value: "24/7", label: "Emergency dispatch" },
  ],
} as const;

export const primaryPhone = site.phone;
