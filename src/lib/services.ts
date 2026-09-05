export type ServiceCategory = "cooling" | "heating" | "air-quality" | "whole-home";

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  navLabel: string;
  category: ServiceCategory;
  /** Used in <title> — keep under ~60 characters including the brand suffix. */
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  /** 2–3 sentence intro rendered under the H1. */
  intro: string;
  /** Long-form body copy. Each entry becomes an H2 section. */
  sections: { heading: string; body: string; bullets?: string[] }[];
  /** "Call us when you notice…" signals — strong long-tail SEO surface. */
  signals: string[];
  /** What every visit includes. */
  includes: string[];
  priceNote: string;
  faqs: Faq[];
  related: string[];
};

export const serviceCategories: { id: ServiceCategory; label: string; blurb: string }[] = [
  { id: "cooling", label: "Air Conditioning", blurb: "Repair, replacement and maintenance for every kind of Texas summer." },
  { id: "heating", label: "Heating", blurb: "Furnaces, heat pumps and the freeze-night calls nobody else answers." },
  { id: "air-quality", label: "Indoor Air Quality", blurb: "Cleaner air, balanced humidity and ductwork that actually delivers." },
  { id: "whole-home", label: "Whole-Home", blurb: "Plumbing and electrical from the same licensed team." },
];

export const services: Service[] = [
  {
    slug: "ac-repair",
    name: "Air Conditioning Repair",
    navLabel: "AC Repair",
    category: "cooling",
    metaTitle: "AC Repair in Dallas–Fort Worth | Same-Day Service",
    metaDescription:
      "Same-day air conditioning repair across Dallas–Fort Worth. Licensed HVAC technicians, upfront flat-rate pricing and 24/7 emergency dispatch. Call (214) 892-2225.",
    tagline: "Same-day diagnosis. Upfront price. No overtime charges.",
    intro:
      "When a DFW summer hits 105°F, a broken air conditioner stops being an inconvenience and starts being a safety problem. Our licensed technicians carry the parts that fail most often on North Texas systems, so the majority of repairs are finished on the first visit — and you approve the flat-rate price before any work begins.",
    sections: [
      {
        heading: "What a Baker Brothers repair visit looks like",
        body: "Every call follows the same sequence, whether it is a capacitor or a compressor. You are never billed by the hour, so a difficult diagnosis costs you nothing extra.",
        bullets: [
          "A licensed technician arrives in a stocked truck inside your two-hour arrival window.",
          "We run a full system diagnostic — refrigerant charge, electrical draw, airflow and drainage — not just the obvious symptom.",
          "You get a written flat-rate price for each repair option before we touch a tool.",
          "We complete the repair, retest the system under load, and show you the before-and-after readings.",
        ],
      },
      {
        heading: "The five failures we see most in North Texas",
        body: "Dallas–Fort Worth is unusually hard on cooling equipment: long run times, hard water, heavy pollen and attic air handlers that reach 140°F. Roughly four out of five of the repairs we run trace back to one of these.",
        bullets: [
          "Failed run capacitors — cheap, extremely common, and the reason a fan hums but will not spin.",
          "Contactor pitting from the constant cycling a Texas August demands.",
          "Refrigerant leaks at the evaporator coil or line-set flare fittings.",
          "Clogged condensate drains backing up into the emergency pan and tripping the float switch.",
          "Blower motors and control boards cooked by attic heat.",
        ],
      },
      {
        heading: "Repair or replace? An honest answer",
        body: "We use a simple rule and we will tell you when replacement is the better financial decision. If the repair costs more than a third of a new system, or the unit is past twelve years old and running R-22 refrigerant, replacing usually costs less over five years than repairing. If it is not, we fix it and we say so — the technician's pay does not change based on which you choose.",
      },
    ],
    signals: [
      "The system runs but the air from the vents is warm",
      "Rooms furthest from the unit never reach the thermostat setting",
      "Short cycling — the unit turns on and off every few minutes",
      "Ice forming on the copper line-set or indoor coil",
      "Grinding, screeching or a hard electrical click at start-up",
      "Water stains on the ceiling under an attic air handler",
      "A power bill that jumped without a change in habits",
    ],
    includes: [
      "Full 20-point system diagnostic",
      "Flat-rate pricing approved before work starts",
      "Refrigerant leak search with electronic detection",
      "Condensate drain clear and treat",
      "Post-repair performance test with printed readings",
      "One-year warranty on parts and labour we supply",
    ],
    priceNote: "Diagnostic fee waived when you approve the repair. No overtime charge for nights, weekends or holidays.",
    faqs: [
      { q: "How fast can you get here?", a: "Most Dallas–Fort Worth addresses get a same-day arrival window when you call before 2:00 PM, and we dispatch around the clock for no-cooling emergencies. Membership customers are moved to the front of the queue." },
      { q: "Do you charge extra for evenings or weekends?", a: "No. Our flat-rate price is the same at 2:00 PM on a Tuesday as it is at 2:00 AM on a Sunday. There is no overtime multiplier." },
      { q: "Will you work on my brand of system?", a: "Yes. Our technicians are trained and tooled for every major residential brand — Trane, Carrier, Lennox, Goodman, Rheem, American Standard, York and more — regardless of who installed it." },
      { q: "How much does AC repair usually cost?", a: "Most common repairs land between a capacitor replacement at the low end and a compressor or coil replacement at the high end. Because we price by the job rather than the hour, you will see the exact number before you commit to anything." },
      { q: "Is my repair covered by a warranty?", a: "Every part we supply and the labour to install it carry a one-year warranty. If the same failure returns inside that window, we come back at no charge." },
    ],
    related: ["ac-maintenance", "ac-installation", "emergency-hvac"],
  },
  {
    slug: "ac-installation",
    name: "AC Installation & Replacement",
    navLabel: "AC Installation",
    category: "cooling",
    metaTitle: "AC Installation & Replacement | Dallas–Fort Worth",
    metaDescription:
      "High-efficiency air conditioner installation across DFW. Free in-home estimate, Manual J load calculation, flexible financing and a 10-year parts warranty.",
    tagline: "Correctly sized, correctly installed, guaranteed in writing.",
    intro:
      "A new air conditioner is only as good as the installation behind it. We size every system with a room-by-room Manual J load calculation instead of matching whatever was there before, because an oversized unit short-cycles, never dehumidifies and dies early. The estimate is free and there is no commission-driven sales pitch attached to it.",
    sections: [
      {
        heading: "Sizing done with arithmetic, not habit",
        body: "The single most common installation mistake in North Texas is replacing a four-ton system with another four-ton system because that is what the sticker said. Insulation, window glazing, duct leakage, attic radiant barriers and additions all change the answer. We measure your home, run the load calculation and show you the result before recommending equipment.",
      },
      {
        heading: "What is included in every installation",
        body: "Our installation price is complete. There are no line items added on the day for things that were always going to be necessary.",
        bullets: [
          "Manual J load calculation and duct static-pressure test",
          "New line-set or full nitrogen purge and pressure test of the existing one",
          "New pad, whip, disconnect, float switch and condensate routing to code",
          "Plenum and transition fabrication where the new cabinet does not match the old",
          "Complete commissioning: superheat, subcool, static pressure and airflow verified and recorded",
          "Permit pulled and municipal inspection scheduled on your behalf",
        ],
      },
      {
        heading: "Efficiency that pays for itself in a Texas climate",
        body: "DFW runs its cooling equipment roughly 1,600 hours a year — around double the national average — so the payback window on a higher SEER2 system is unusually short here. A modern variable-speed system typically cuts summer cooling cost by 25–45% versus a fifteen-year-old single-stage unit, and it runs long, quiet, low-speed cycles that pull far more humidity out of the air.",
      },
    ],
    signals: [
      "Your system is more than 12 years old",
      "It still uses R-22 refrigerant, which is no longer produced",
      "You have paid for two or more repairs in the last two years",
      "Summer electricity bills climb every year with the same thermostat setting",
      "The house cools but always feels clammy",
      "Some rooms are permanently 6–8 degrees off the rest of the house",
    ],
    includes: [
      "Free in-home estimate with three clearly-priced options",
      "Manual J load calculation, not a guess",
      "Old equipment removed and recycled",
      "Permit and inspection handled for you",
      "10-year parts warranty and 2-year labour warranty",
      "First year of maintenance included",
    ],
    priceNote: "Financing available with approved credit, including 0% promotional terms on qualifying systems.",
    faqs: [
      { q: "How long does an installation take?", a: "A straight changeout of a matched system is typically one day. Jobs that involve ductwork modification, a new furnace or a zoning system usually run two days. We tell you which yours is at the estimate." },
      { q: "Do I need a permit?", a: "Yes — every DFW municipality requires a mechanical permit for equipment replacement. We pull it, schedule the inspection and meet the inspector. Installations done without a permit can void your manufacturer warranty and complicate a future home sale." },
      { q: "What SEER2 rating should I buy?", a: "For most DFW homes the sweet spot is a 15.2–17 SEER2 two-stage system. Going higher pays off if you have a large home, keep it cool, and plan to stay more than seven years. We will show you the modelled annual cost for each option rather than just quoting the number." },
      { q: "Can you finance the system?", a: "Yes. We offer monthly payment plans with approved credit, and we will show you the payment alongside the estimated energy savings so you can see the true net cost." },
      { q: "What happens to my old unit?", a: "We remove it, recover the refrigerant according to EPA rules and recycle the equipment. There is no disposal surcharge." },
    ],
    related: ["ac-repair", "ductwork", "ac-maintenance"],
  },
  {
    slug: "ac-maintenance",
    name: "AC Tune-Up & Maintenance",
    navLabel: "AC Maintenance",
    category: "cooling",
    metaTitle: "AC Tune-Up & Maintenance Plans | Dallas–Fort Worth",
    metaDescription:
      "Precision AC tune-ups across DFW. 26-point inspection, coil cleaning and refrigerant verification — the cheapest way to avoid a July breakdown.",
    tagline: "The visit that stops the emergency call in July.",
    intro:
      "Most no-cooling emergencies were visible months earlier as a weak capacitor, a dirty coil or a drain line halfway to blocked. A spring tune-up is the cheapest hour you will spend on your HVAC system all year: it restores lost efficiency, catches the parts that are about to fail, and keeps your manufacturer warranty valid.",
    sections: [
      {
        heading: "Our 26-point precision tune-up",
        body: "A real tune-up is measurement, not a filter change and a sticker. Our technicians record every reading so you can compare year over year.",
        bullets: [
          "Refrigerant charge verified by superheat and subcooling, not by gauge pressure alone",
          "Condenser coil washed and combed — the single biggest efficiency recovery on most DFW systems",
          "Capacitor microfarad reading logged against its rated value so we can see it drifting before it fails",
          "Contactor, relays and wiring inspected for pitting and heat damage",
          "Blower wheel, motor amp draw and static pressure measured",
          "Condensate drain cleared, flushed and treated; float switch tested",
          "Thermostat calibration and cycle test under load",
        ],
      },
      {
        heading: "Why it matters more here than almost anywhere",
        body: "A condenser coil coated in cottonwood and construction dust can push head pressure up enough to cost 20% in efficiency and shave years off a compressor. North Texas gives you pollen in spring, dust all summer and long run times to bake it on. Cleaning the coil once a year is not cosmetic maintenance — it is the difference between a twelve-year system and an eighteen-year one.",
      },
      {
        heading: "Keeping your warranty intact",
        body: "Nearly every manufacturer parts warranty requires documented annual professional maintenance. If a compressor fails in year seven and you cannot produce maintenance records, the claim can be denied. Membership customers get their visit history stored and available on request.",
      },
    ],
    signals: [
      "You have not had the system inspected in over a year",
      "The outdoor coil looks matted with dirt, grass or cottonwood",
      "You are hearing new noises at start-up",
      "Cooling bills are creeping up year over year",
      "You want to keep a manufacturer parts warranty valid",
    ],
    includes: [
      "26-point precision inspection with recorded readings",
      "Condenser coil wash",
      "Condensate drain clear and treatment tablet",
      "Capacitor and contactor testing",
      "Written report of every measurement",
      "Priority scheduling for the rest of the season",
    ],
    priceNote: "Included twice a year — heating and cooling — with a Comfort Club membership.",
    faqs: [
      { q: "When is the best time for an AC tune-up?", a: "March through early May. You want the system checked before the first stretch of 95°F days, while parts and appointments are still easy to get." },
      { q: "How often does it need doing?", a: "Cooling once a year and heating once a year. Homes with pets, heavy pollen exposure or a system over ten years old benefit from twice-yearly cooling checks." },
      { q: "Does a tune-up really save money?", a: "Yes, in two ways. Restoring correct charge and a clean coil typically recovers 5–15% of lost efficiency, and catching a weak capacitor in April costs a fraction of an emergency call in July." },
      { q: "Can I just change the filter myself?", a: "Please do — every one to three months. But a filter change does not clean the outdoor coil, verify refrigerant charge, measure static pressure or catch an electrical component drifting out of spec." },
    ],
    related: ["ac-repair", "indoor-air-quality", "heating-repair"],
  },
  {
    slug: "heating-repair",
    name: "Heating & Furnace Repair",
    navLabel: "Heating Repair",
    category: "heating",
    metaTitle: "Furnace & Heating Repair in Dallas–Fort Worth",
    metaDescription:
      "24/7 furnace and heat pump repair across DFW. Carbon monoxide testing on every gas call, flat-rate pricing and no overtime charges. Call (214) 892-2225.",
    tagline: "Answered on the freeze night, priced the same as any other night.",
    intro:
      "North Texas heating equipment sits idle for months and then gets asked to run flat out the moment an arctic front arrives — which is exactly why so many failures show up on the coldest night of the year. We staff for those nights, we test for carbon monoxide on every gas appliance call, and our price does not change because it is 3:00 AM.",
    sections: [
      {
        heading: "Safety first on every gas appliance",
        body: "A furnace that is not heating properly and a furnace that is unsafe often look identical from the thermostat. Cracked heat exchangers, blocked flues and failing draft inducers can put carbon monoxide into your living space. Every gas heating call we run includes a combustion analysis and a CO test — not as an upsell, as standard procedure. If we find an unsafe condition we will tell you plainly and show you the reading.",
      },
      {
        heading: "What usually goes wrong",
        body: "Gas furnaces and heat pumps fail in different ways, and we carry parts for both.",
        bullets: [
          "Igniters and flame sensors — the most common no-heat call on a gas furnace, and usually a same-visit fix",
          "Pressure switches tripped by a blocked or improperly sloped flue",
          "Draft inducer motors and limit switches",
          "Heat pump reversing valves and defrost boards that leave you in emergency heat",
          "Auxiliary heat strips and sequencers on electric systems",
          "Thermostats wired or configured incorrectly for a dual-fuel system",
        ],
      },
      {
        heading: "Heat pumps in a Texas winter",
        body: "Heat pumps are the most efficient heating you can run in this climate for most of the season, but they behave differently from a furnace and homeowners often call us about normal operation. Steam off the outdoor unit during a defrost cycle is expected. Air from the vents at 95°F rather than 120°F is expected. Auxiliary heat running constantly above 35°F outdoors is not — that one is worth a call.",
      },
    ],
    signals: [
      "The system blows air but it never feels warm",
      "The furnace lights and then shuts down after a few minutes",
      "A burning or metallic smell that does not clear after the first run of the season",
      "The carbon monoxide alarm has sounded, even once",
      "Yellow rather than crisp blue burner flames",
      "Emergency or auxiliary heat runs constantly in mild weather",
      "Loud booming at ignition",
    ],
    includes: [
      "Full heating system diagnostic",
      "Combustion analysis and carbon monoxide test on gas equipment",
      "Flue and venting inspection",
      "Flat-rate repair pricing approved in advance",
      "Safety shutdown and written report if an unsafe condition is found",
      "One-year warranty on parts and labour",
    ],
    priceNote: "No overtime rates. Freeze-event calls are triaged by safety risk, with no-heat households and vulnerable residents first.",
    faqs: [
      { q: "My heater smells like burning the first time I run it. Is that normal?", a: "A light dusty smell for the first 15–30 minutes of the season is normal — it is dust burning off the heat exchanger. A sharp electrical, plastic or persistent burning smell is not. Shut the system off and call us." },
      { q: "What do I do if the CO alarm goes off?", a: "Get everyone outside into fresh air first, then call 911 or your gas utility from outside. Once the property is cleared, call us and we will test the appliances and find the source before anything is put back into service." },
      { q: "Why is my heat pump blowing cool air?", a: "Heat pump supply air is genuinely cooler than furnace air — around 95°F versus 120°F — so it can feel cool against skin at 98.6°F even when working perfectly. If the house is not holding temperature, though, that is a fault worth diagnosing." },
      { q: "Do you service gas and electric heating?", a: "Both, plus heat pumps and dual-fuel systems. Our technicians hold gas licensing for the combustion side and are trained on heat pump controls and defrost logic." },
    ],
    related: ["heating-installation", "emergency-hvac", "ac-maintenance"],
  },
  {
    slug: "heating-installation",
    name: "Furnace & Heat Pump Installation",
    navLabel: "Heating Installation",
    category: "heating",
    metaTitle: "Furnace & Heat Pump Installation | Dallas–Fort Worth",
    metaDescription:
      "New furnace, heat pump and dual-fuel installation across DFW. Free estimate, correct sizing, permits handled and a 10-year parts warranty.",
    tagline: "Sized for a Texas winter, not a Minnesota one.",
    intro:
      "Heating equipment in North Texas is routinely oversized — a habit inherited from colder markets — which produces short, blasting cycles, uneven rooms and premature failure. We size to your actual heat loss, and we will walk you honestly through gas versus heat pump versus dual-fuel for your specific house and utility rates.",
    sections: [
      {
        heading: "Gas furnace, heat pump or dual-fuel?",
        body: "There is no single right answer, and anyone who gives you one without asking about your gas rates has not done the work.",
        bullets: [
          "Gas furnace — lowest cost to install, strongest heat on the rare hard-freeze night, and the best choice where natural gas is already at the house and rates are favourable.",
          "Heat pump — the most efficient option for the 90% of a DFW winter that sits above 40°F, and it doubles as your air conditioner, so you replace one machine instead of two.",
          "Dual-fuel — a heat pump paired with a gas furnace that hands over automatically at a set outdoor temperature. It is the best-performing option in this climate and the one we recommend most often for homes that already have gas.",
        ],
      },
      {
        heading: "Installation that will pass inspection the first time",
        body: "Combustion air, flue sizing, gas pressure, condensate neutralisation on high-efficiency units and correct return air sizing are where installations fail inspection — and where cheap quotes cut corners.",
        bullets: [
          "Manual J heat-loss calculation for the actual house",
          "Gas line and manifold pressure verified and adjusted to the nameplate",
          "Flue and combustion air brought to current code",
          "Return air sized to the new blower rather than inherited",
          "Full commissioning report: temperature rise, static pressure, gas pressure, CO in the flue",
          "Permit pulled and inspection scheduled for you",
        ],
      },
      {
        heading: "Replacing heating and cooling together",
        body: "If both halves of your system are near end of life, replacing them together costs meaningfully less than two separate jobs and guarantees the indoor coil, blower and outdoor unit are a matched, tested combination. A mismatched pairing can lose 10–20% of the efficiency you paid for and often voids the manufacturer's rating.",
      },
    ],
    signals: [
      "The furnace is more than 15 years old",
      "A technician has found a cracked heat exchanger",
      "Repairs are becoming annual",
      "Rooms are dramatically uneven in winter",
      "You are already replacing the air conditioner",
      "Your heating bills are rising faster than your rates",
    ],
    includes: [
      "Free in-home estimate with clearly priced options",
      "Manual J heat-loss calculation",
      "Old equipment removed and recycled",
      "Permit and municipal inspection handled",
      "10-year parts warranty, 2-year labour warranty",
      "Full written commissioning report",
    ],
    priceNote: "Financing available with approved credit. Utility and manufacturer rebates applied where they exist.",
    faqs: [
      { q: "Is a heat pump really enough for a DFW winter?", a: "For the overwhelming majority of hours, yes — modern cold-climate heat pumps hold full capacity well below anything typical here. For the handful of hard-freeze nights, a dual-fuel setup or properly sized auxiliary heat covers the gap." },
      { q: "How long will installation take?", a: "A furnace changeout is usually a single day. A full system, a dual-fuel conversion or a job involving flue or duct modification is typically two." },
      { q: "Should I replace heating and cooling at the same time?", a: "If both are within a couple of years of end of life, yes. You save on labour, you get a properly matched system, and you avoid pairing new equipment with an old coil that will bottleneck it." },
      { q: "Are there rebates available?", a: "Frequently — through manufacturers and occasionally through utilities and federal efficiency credits. We check what applies to the system you choose and factor it into the quote rather than leaving you to chase it." },
    ],
    related: ["heating-repair", "ac-installation", "ductwork"],
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor Air Quality",
    navLabel: "Air Quality",
    category: "air-quality",
    metaTitle: "Indoor Air Quality Services | Dallas–Fort Worth HVAC",
    metaDescription:
      "Whole-home air purification, media filtration, humidity control and UV treatment for DFW homes. Cleaner air without the guesswork.",
    tagline: "North Texas allergy season, filtered at the source.",
    intro:
      "Dallas–Fort Worth reliably lands on national worst-allergy lists, and the air inside a closed-up house is usually dirtier than the air outside it. Whole-home air quality equipment treats every cubic foot that passes through your system, which a portable unit in one bedroom cannot do.",
    sections: [
      {
        heading: "Start by finding out what is actually wrong",
        body: "Air quality gets sold as a bundle far too often. We would rather test first. Poor filtration, excess humidity, duct leakage pulling attic air into the return, and inadequate ventilation all produce similar complaints and need completely different fixes. We measure humidity, check static pressure and inspect the return side before recommending anything.",
      },
      {
        heading: "What we install",
        body: "Each of these solves a specific problem. You almost certainly do not need all of them.",
        bullets: [
          "Whole-home media filtration (MERV 11–16) — four-to-five inch cabinets that capture far more than a one-inch filter without strangling airflow",
          "Whole-home dehumidification — the most under-used upgrade in Texas, and the reason a house at 74°F can still feel clammy",
          "UV-C coil treatment — keeps biological growth off the evaporator coil and drain pan, where it otherwise thrives in a dark, wet, 55°F environment",
          "Steam or bypass humidification for the dry stretch of winter",
          "Fresh-air ventilation for tightly sealed newer homes",
          "Duct sealing — often the highest-impact air quality fix in the whole list",
        ],
      },
      {
        heading: "The filter mistake almost everyone makes",
        body: "A high-MERV one-inch filter is usually a downgrade, not an upgrade. One-inch cabinets do not have the surface area to support dense media, so static pressure climbs, airflow drops, the coil freezes and the blower motor works itself to death. If you want serious filtration, the correct answer is a deeper cabinet with more media area — not a denser filter in the same slot.",
      },
    ],
    signals: [
      "Allergy or asthma symptoms that are worse indoors",
      "Visible dust settling within a day of cleaning",
      "A musty smell when the system starts",
      "Humidity above 55% indoors during summer",
      "Static shocks and dry skin all winter",
      "A recent renovation, or a new pet in the house",
    ],
    includes: [
      "Indoor humidity and static-pressure measurement",
      "Return-side and duct leakage inspection",
      "Coil and drain pan condition check",
      "Written recommendation with the reasoning, not just a product list",
      "Professional installation and system rebalance afterwards",
    ],
    priceNote: "Filter replacements are included with a Comfort Club membership.",
    faqs: [
      { q: "Do air purifiers actually work?", a: "Whole-home media filtration and properly applied UV-C on the coil have solid evidence behind them. Standalone ozone generators do not, and we do not sell them. We will tell you which category any product falls into." },
      { q: "How often should I change my filter?", a: "A one-inch filter every 30–60 days in a DFW home, sooner with pets. A four or five-inch media cabinet typically runs six to twelve months." },
      { q: "What indoor humidity should I aim for?", a: "40–50% is the target range. Above 55% you get that clammy feeling and the conditions for mould; below 30% you get static, dry skin and shrinking woodwork." },
      { q: "Will better filtration hurt my airflow?", a: "It will if it is a dense filter in a one-inch slot. It will not if the media area is sized to your system, which is exactly why we measure static pressure before recommending anything." },
    ],
    related: ["ductwork", "ac-maintenance", "smart-thermostats"],
  },
  {
    slug: "ductwork",
    name: "Ductwork Repair & Replacement",
    navLabel: "Ductwork",
    category: "air-quality",
    metaTitle: "Duct Repair, Sealing & Replacement | DFW HVAC",
    metaDescription:
      "Leaky ducts waste 20–30% of the air you pay to condition. Duct testing, sealing, redesign and replacement across Dallas–Fort Worth.",
    tagline: "The 30% of your energy bill nobody inspects.",
    intro:
      "You can install the most efficient air conditioner on the market and still lose a third of its output into a 140°F attic. Duct leakage is the most common and least visible problem in North Texas homes, and it is usually cheaper to fix than the equipment upgrade people buy instead.",
    sections: [
      {
        heading: "Why DFW ducts fail",
        body: "Most homes here run flex duct through an unconditioned attic that swings from freezing to 140°F. Over fifteen to twenty years, mastic dries and cracks, tape gives up, insulation compresses at every joist crossing, and boots pull away from ceiling drywall. The result is conditioned air dumped into the attic and hot attic air pulled into the return.",
      },
      {
        heading: "We test before we sell",
        body: "Duct work is easy to sell badly, so we start with measurement.",
        bullets: [
          "Static pressure readings at the air handler to find restriction",
          "Room-by-room airflow measurement to locate the rooms actually being starved",
          "Visual and pressure-based leakage inspection through the attic",
          "Return air sizing checked against the equipment's requirement — undersized returns are extremely common",
          "A written plan that separates 'must fix' from 'would be nice'",
        ],
      },
      {
        heading: "Sealing, repair or full replacement",
        body: "Sealing joints and boots with mastic solves most leakage problems for a fraction of the cost of replacement. Replacement is the right call when the duct board plenum has degraded, when runs are crushed or badly undersized, or when the layout was wrong to begin with — a redesign is the only fix for a room that has never been comfortable in twenty years.",
      },
    ],
    signals: [
      "One or two rooms are always hotter or colder than the rest",
      "Rooms furthest from the air handler get weak airflow",
      "Excessive dust no matter how often you clean",
      "Energy bills that do not match the age and rating of your equipment",
      "Visible gaps, disconnected runs or crushed flex in the attic",
      "The system runs constantly and still cannot hold set point",
    ],
    includes: [
      "Static pressure and airflow testing",
      "Full attic duct inspection with photos",
      "Mastic sealing at plenums, joints and boots",
      "Return air sizing evaluation",
      "Post-repair airflow verification",
    ],
    priceNote: "Duct evaluation is included free with any system replacement estimate.",
    faqs: [
      { q: "How much energy do leaky ducts waste?", a: "Industry testing consistently puts typical duct losses at 20–30% of conditioned air in homes with attic ductwork. In older North Texas homes we regularly measure the high end of that." },
      { q: "Is duct cleaning the same as duct sealing?", a: "No, and they solve different problems. Cleaning removes debris from inside the ducts. Sealing stops conditioned air escaping and attic air being drawn in. Sealing almost always delivers the larger, more durable benefit." },
      { q: "Can you fix one hot room without replacing everything?", a: "Very often, yes. The cause is usually a crushed run, a disconnected boot, an undersized branch or a poorly balanced system — all fixable in isolation. We measure first so we can tell you which it is." },
      { q: "How long does duct sealing take?", a: "Most homes are a one-day job. A full replacement of an attic duct system typically runs two to three days." },
    ],
    related: ["indoor-air-quality", "ac-installation", "ac-maintenance"],
  },
  {
    slug: "smart-thermostats",
    name: "Smart Thermostat Installation",
    navLabel: "Thermostats",
    category: "air-quality",
    metaTitle: "Smart Thermostat Installation | Dallas–Fort Worth",
    metaDescription:
      "Professional smart thermostat installation and configuration across DFW — including the C-wire, dual-fuel and zoning setups that DIY installs get wrong.",
    tagline: "Installed, wired and actually configured for your system.",
    intro:
      "A smart thermostat is a genuinely good upgrade and a genuinely common source of service calls. Missing C-wires, incorrect heat pump configuration and mis-set auxiliary heat lockouts can turn a savings device into a system that runs expensive backup heat all winter. We handle the wiring and, more importantly, the configuration.",
    sections: [
      {
        heading: "The C-wire problem",
        body: "Most thermostats made before about 2010 ran on four wires and had no common wire to power a modern display. Smart thermostats need constant power. The right fix is running a proper C-wire or fitting a manufacturer-approved adapter at the air handler — not the power-stealing workarounds that cause intermittent reboots and, in some cases, damaged control boards.",
      },
      {
        heading: "Configuration is where the savings live",
        body: "Hardware installation takes twenty minutes. Setting it up correctly takes judgement.",
        bullets: [
          "Correct equipment type: conventional, heat pump, or dual-fuel with a balance point",
          "Auxiliary heat lockout so expensive strip heat only engages when it is genuinely needed",
          "Compressor minimum off-time to protect the equipment from short cycling",
          "Staging and cycle rate matched to your home's thermal mass",
          "Schedules built around your actual routine, and Texas summer peak pricing if your plan has it",
        ],
      },
      {
        heading: "Zoning for houses that will never balance",
        body: "If your upstairs runs eight degrees hotter than downstairs, no thermostat will fix it — the system is being asked to satisfy two very different loads from one sensor. Zoning with motorised dampers and separate thermostats treats them as the separate problems they are, and pairs especially well with variable-speed equipment.",
      },
    ],
    signals: [
      "Your thermostat is a mercury or basic digital model",
      "You have no C-wire and a smart thermostat keeps rebooting",
      "Upstairs and downstairs never agree",
      "You want remote control while travelling",
      "Auxiliary heat is running in mild weather",
      "You are on a time-of-use electricity plan",
    ],
    includes: [
      "C-wire installation or approved adapter",
      "Full equipment-type configuration",
      "Auxiliary heat lockout and balance point setup",
      "Wi-Fi setup and app walkthrough",
      "System test through every heating and cooling stage",
    ],
    priceNote: "We install customer-supplied thermostats as well as models we carry.",
    faqs: [
      { q: "Can I just install one myself?", a: "Often yes, on a simple conventional system with a C-wire present. The installs that go wrong — and become our service calls — are heat pumps, dual-fuel systems, zoned systems and anything missing a C-wire." },
      { q: "Do smart thermostats actually save money?", a: "They save when the schedule and setback are used, and in a dual-fuel or heat pump home the auxiliary heat lockout setting alone can be worth more than everything else combined. Configured badly, they can cost you money." },
      { q: "Will it work with my older system?", a: "Almost always. We verify equipment type and wiring on site and tell you before we start if your system needs anything additional." },
      { q: "Can you add zoning later?", a: "Yes. Zoning can be retrofitted to most existing duct systems, though it works best with two-stage or variable-speed equipment that can throttle down when only one zone is calling." },
    ],
    related: ["indoor-air-quality", "ac-installation", "ductwork"],
  },
  {
    slug: "emergency-hvac",
    name: "24/7 Emergency HVAC",
    navLabel: "Emergency Service",
    category: "cooling",
    metaTitle: "24/7 Emergency HVAC Repair in Dallas–Fort Worth",
    metaDescription:
      "No cooling or no heat? Live dispatch around the clock across Dallas–Fort Worth, with no overtime charges — nights, weekends and holidays.",
    tagline: "A person answers. The price does not change.",
    intro:
      "A 105°F afternoon with no cooling or a hard-freeze night with no heat is a health issue before it is a comfort issue, particularly for infants, older adults and anyone with a respiratory condition. We keep technicians on call every night of the year, a real person answers the phone, and there is no overtime multiplier waiting on the invoice.",
    sections: [
      {
        heading: "What counts as an emergency",
        body: "Call us right away — do not wait for business hours — if any of these apply.",
        bullets: [
          "No cooling with an indoor temperature above 85°F, or any vulnerable resident in the home",
          "No heat with outdoor temperatures near or below freezing",
          "Any burning smell, smoke, or a carbon monoxide alarm",
          "Water actively leaking from an attic air handler into the ceiling",
          "Repeatedly tripping breakers or a scorched smell at the disconnect",
          "Ice covering the outdoor unit or refrigerant lines",
        ],
      },
      {
        heading: "Before we arrive",
        body: "A few things that are safe to do and can occasionally solve the problem outright.",
        bullets: [
          "Turn the system off at the thermostat if it is frozen over — leave the fan on to thaw the coil",
          "Check the breaker panel and the disconnect box beside the outdoor unit",
          "Replace a filter that is visibly loaded; a blocked filter freezes coils",
          "Check the emergency float switch near the attic drain pan; a full pan will shut the system down deliberately",
          "If you smell gas, leave the house first and call your gas utility from outside",
        ],
      },
      {
        heading: "How we triage",
        body: "During a regional freeze or a multi-day heat event, call volume can exceed anyone's capacity. We prioritise by risk: no heat in freezing conditions, homes with infants, elderly or medically vulnerable residents, and any suspected gas or carbon monoxide issue go first. Membership customers get priority within their tier. We will always tell you honestly when we can be there rather than promising a window we cannot hold.",
      },
    ],
    signals: [
      "No cooling and the house is above 85°F",
      "No heat and it is at or below freezing outside",
      "The carbon monoxide detector has sounded",
      "Burning smells or smoke from the system",
      "Water pouring from the attic unit",
      "The outdoor unit is a block of ice",
    ],
    includes: [
      "Live dispatch 24 hours a day, 365 days a year",
      "No overtime, weekend or holiday premium",
      "Fully stocked trucks for first-visit repairs",
      "Temporary safety measures if a part must be ordered",
      "Same flat-rate price list as any daytime call",
    ],
    priceNote: "Comfort Club members go to the front of the emergency queue.",
    faqs: [
      { q: "Do you really answer at 3:00 AM?", a: "Yes — a live dispatcher, not a voicemail box. During major weather events hold times get long, so stay on the line rather than hanging up and losing your place." },
      { q: "Is emergency service more expensive?", a: "No. Our flat-rate pricing is identical regardless of the hour or the day. There is no overtime multiplier." },
      { q: "What if the part is not available overnight?", a: "We stabilise the situation — safe temporary heat or cooling where possible, and a safe shutdown where not — then get the part on the first supply run and return as a priority job." },
      { q: "Should I call for a frozen unit?", a: "Turn the cooling off and the fan on to thaw it, then call. Running a frozen system risks liquid refrigerant reaching the compressor, which turns a small repair into a very large one." },
    ],
    related: ["ac-repair", "heating-repair", "ac-maintenance"],
  },
  {
    slug: "commercial-hvac",
    name: "Commercial HVAC",
    navLabel: "Commercial",
    category: "whole-home",
    metaTitle: "Commercial HVAC Service in Dallas–Fort Worth",
    metaDescription:
      "Rooftop units, split systems and planned maintenance for DFW offices, retail, restaurants and light industrial. After-hours work available.",
    tagline: "Scheduled around your business, not ours.",
    intro:
      "Commercial equipment fails differently and costs differently — downtime, not discomfort, is the expense. We maintain and repair rooftop package units, split systems, make-up air and exhaust for offices, retail, restaurants, clinics and light industrial properties across Dallas–Fort Worth, and we do the disruptive work outside your trading hours.",
    sections: [
      {
        heading: "What we cover",
        body: "Single-site and small-portfolio commercial properties, with planned maintenance agreements that spread cost and prevent the failures that close a business for a day.",
        bullets: [
          "Rooftop package units (RTUs) — repair, replacement and crane coordination",
          "Split and mini-split systems for offices and server rooms",
          "Restaurant make-up air and exhaust balance",
          "Economiser operation and outside-air compliance",
          "Planned maintenance agreements with quarterly or semi-annual visits",
          "Refrigerant compliance and leak-rate documentation",
        ],
      },
      {
        heading: "Planned maintenance beats emergency callouts",
        body: "For commercial equipment the arithmetic is not close: an unplanned RTU failure on a July Friday costs a multiple of a year of scheduled maintenance once you add lost trading. Our agreements include filter and belt programmes, coil cleaning, refrigerant logging and a documented condition report per unit, so you can budget replacements rather than absorb them as emergencies.",
      },
      {
        heading: "Work scheduled around trading hours",
        body: "Rooftop replacements, crane lifts and anything noisy or disruptive get scheduled overnight or before opening at no premium under a maintenance agreement. We coordinate with property managers and landlords directly where that is easier for you.",
      },
    ],
    signals: [
      "Rooftop units past ten years old with no maintenance history",
      "Repeated callbacks on the same unit",
      "Tenant or staff complaints about uneven comfort",
      "Kitchen exhaust pulling doors shut or smoke lingering",
      "Utility costs out of line with comparable properties",
      "You need documented refrigerant compliance",
    ],
    includes: [
      "Per-unit condition survey and asset list",
      "Planned maintenance agreement options",
      "Priority commercial dispatch",
      "After-hours scheduling at no premium under agreement",
      "Documented reports for property managers",
    ],
    priceNote: "Maintenance agreements are priced per unit. Ask for a portfolio survey.",
    faqs: [
      { q: "Do you work with property managers?", a: "Regularly. We can bill and report directly to a management company, hold an asset register per site and provide the documentation portfolios usually need at renewal." },
      { q: "Can you work outside business hours?", a: "Yes, and under a maintenance agreement there is no after-hours premium for planned work." },
      { q: "Do you handle rooftop unit replacement?", a: "Yes, including crane coordination, curb adaptation, permits and inspection." },
      { q: "What size properties do you serve?", a: "Single-site businesses through small portfolios — offices, retail, restaurants, clinics, salons and light industrial. For very large industrial plant we will tell you honestly if a specialist is a better fit." },
    ],
    related: ["ac-maintenance", "ductwork", "emergency-hvac"],
  },
];

export const serviceMap = new Map(services.map((s) => [s.slug, s]));

export function getService(slug: string) {
  return serviceMap.get(slug);
}

export function servicesByCategory(category: ServiceCategory) {
  return services.filter((s) => s.category === category);
}
