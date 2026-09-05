export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: "Cooling" | "Heating" | "Air Quality" | "Costs & Efficiency";
  date: string;
  updated?: string;
  readingMinutes: number;
  /** Markdown-lite: "## " for headings, "- " for bullets, blank line separates blocks. */
  body: string;
};

export const posts: Post[] = [
  {
    slug: "why-is-my-ac-not-cooling",
    title: "Why Your AC Is Running But Not Cooling — 7 Causes, Ranked",
    metaTitle: "Why Is My AC Running But Not Cooling? 7 Causes",
    description:
      "The system hums, the fan spins, and the air is warm. Here are the seven causes we actually find on DFW service calls, in the order we find them.",
    category: "Cooling",
    date: "2026-06-11",
    readingMinutes: 7,
    body: `An air conditioner that runs but does not cool is the single most common call we take between May and September. The good news is that the cause is usually one of a short list, and two of them you can check yourself in under five minutes.

## 1. A blocked air filter
This is first on the list because it is first in reality. A loaded filter starves the evaporator coil of airflow. The coil gets too cold, condensation on it freezes, and the ice blocks what airflow was left. The system runs continuously and delivers almost nothing.

If you pull the filter and cannot see light through it, that is your answer. Turn the cooling off, set the fan to ON to thaw the coil — this takes two to four hours — then fit a clean filter before restarting.

## 2. A failed run capacitor
The capacitor gives the compressor and fan motor the kick they need to start. When it weakens, you get the signature symptom: an outdoor unit that hums but whose fan does not spin, or that trips the breaker on start-up.

Capacitors are inexpensive parts and among our fastest repairs. They are also not a DIY job — they hold a charge capable of seriously hurting you well after the power is off.

## 3. Low refrigerant from a leak
Refrigerant is not consumed. If the charge is low, there is a leak — at the evaporator coil, a line-set flare, or a Schrader valve. "Topping it up" without finding the leak means paying for the same refrigerant twice, and running a system undercharged puts the compressor at risk.

The tell is ice on the copper suction line at the outdoor unit alongside weak, barely-cool air.

## 4. A dirty condenser coil
The outdoor coil rejects heat. When it is packed with cottonwood, grass clippings and construction dust — which happens fast in North Texas — head pressure rises and cooling capacity falls. We regularly measure double-digit efficiency losses from this alone, and it is entirely preventable with an annual wash.

## 5. A tripped float switch
Attic air handlers have a safety switch in the drain pan. If the condensate drain blocks, the pan fills, the switch trips and the system shuts the compressor off deliberately — to avoid putting water through your ceiling. Often the fan keeps running, which is why it feels like "running but not cooling."

Check the drain pan near the attic unit. Standing water means a blocked drain.

## 6. A failing compressor
The expensive one. A compressor that has lost the ability to pump will leave you with a system that runs, moves air, and produces almost no temperature drop. On a unit past twelve years old, compressor replacement rarely makes financial sense against a new system.

## 7. The system is simply undersized — or the ducts are
If your AC has never held temperature on the hottest afternoons, it may not be broken at all. Undersized equipment, or ductwork leaking 25% of its output into a 140°F attic, produce exactly this complaint. This is why we measure airflow and static pressure rather than just checking refrigerant.

## What to check before you call
- Thermostat set to COOL, and the setpoint below room temperature
- Filter clean, and the return grille unobstructed
- Breaker on, both at the panel and at the outdoor disconnect
- No ice on the refrigerant lines — if there is, shut cooling off and run the fan
- Drain pan under the attic unit dry

If all five check out and the air is still warm, it is a diagnostic call. Running a frozen or undercharged system does real, expensive damage to the compressor, so it is worth switching it off while you wait.`,
  },
  {
    slug: "ac-repair-or-replace",
    title: "Repair or Replace? The Numbers That Actually Decide It",
    metaTitle: "Should I Repair or Replace My AC? A Clear Framework",
    description:
      "A simple, honest framework for deciding whether to fix your air conditioner or replace it — including the three situations where replacement is not a close call.",
    category: "Costs & Efficiency",
    date: "2026-05-02",
    readingMinutes: 6,
    body: `Every homeowner facing a large HVAC repair asks the same question, and most of the advice online is written by people who profit from one of the two answers. Here is the framework we use, including where it says "repair" against our own commercial interest.

## Start with the one-third rule
If the repair costs more than about a third of a new system, replacement is usually the better financial decision. Below that threshold, repairing is almost always right.

This is a starting point, not a verdict — age and refrigerant type can override it in both directions.

## Age changes the maths
- **Under 8 years.** Repair. The equipment has most of its life ahead of it and is probably still under a parts warranty.
- **8 to 12 years.** Judgement call. Apply the one-third rule and think about how long you plan to stay.
- **Over 12 years.** Lean toward replacement for anything beyond a minor repair. You are spending money on a system that will present you with the next failure soon.
- **Over 15 years.** Replace, unless the fix is genuinely trivial.

## Three situations where it is not close
**Your system uses R-22.** Production ended in 2020. Remaining stock is expensive and getting more so. Any repair involving refrigerant on an R-22 system is money spent on equipment with a hard expiry date.

**The compressor has failed and you are out of warranty.** Compressor replacement is the single largest repair in residential HVAC. On anything over ten years old it rarely beats putting that money toward a new system.

**A cracked heat exchanger on the furnace side.** This is a carbon monoxide risk, not a comfort issue. The furnace should not run again until it is replaced.

## The number people forget
Compare five-year total cost, not today's invoice. A fifteen-year-old single-stage system running through a DFW summer costs meaningfully more to operate every month than a modern variable-speed one. In this climate we run cooling roughly 1,600 hours a year — about double the national average — so efficiency differences show up on the bill far faster here than the national payback estimates suggest.

Add the operating difference to the likely repairs over five years, then compare that against a new system with a ten-year parts warranty. Replacement wins more often than the sticker price implies.

## When repair is clearly right
- The system is under twelve and the failure is a capacitor, contactor, sensor or motor
- You are moving within a couple of years
- It is still under manufacturer parts warranty
- It has held temperature well and the ducts test tight

## Getting a straight answer
Ask any contractor for the diagnostic readings — superheat, subcooling, static pressure, capacitor microfarads. A technician who has genuinely diagnosed the system can produce those numbers immediately. One who leads with a replacement quote before measuring anything is selling, not diagnosing.`,
  },
  {
    slug: "hvac-maintenance-checklist-texas",
    title: "The North Texas HVAC Maintenance Calendar",
    metaTitle: "HVAC Maintenance Checklist for North Texas Homes",
    description:
      "What to do and when — a season-by-season maintenance calendar built for the DFW climate, including the tasks worth doing yourself.",
    category: "Cooling",
    date: "2026-03-18",
    readingMinutes: 5,
    body: `North Texas asks more of HVAC equipment than most of the country: long cooling seasons, high pollen, hard water and attics that hit 140°F. Here is the calendar we would follow if it were our own house.

## February–March: before cooling season
This is the highest-value month of the year for HVAC work, and the easiest time to get an appointment.

- Book a professional cooling tune-up now, not in June
- Wash the condenser coil, or have it done — cottonwood season is coming
- Clear two feet of space around the outdoor unit
- Replace the filter and note the size somewhere you will find it again
- Test the system on a warm afternoon so you find problems on your schedule

## April–May: pollen management
DFW pollen counts are among the worst in the country in spring.

- Check the filter monthly rather than quarterly during these months
- Rinse the condenser coil gently with a hose — fins bend easily, so no pressure washer
- Pour a cup of distilled vinegar down the condensate drain line to keep growth down
- Confirm the attic drain pan is dry and the float switch is free

## June–September: survival mode
- Filter every 30–60 days, without exception
- Keep the thermostat within about 20 degrees of the outdoor temperature; setting it to 65°F when it is 105°F outside does not cool faster, it just runs the system flat out
- Watch for ice on the refrigerant lines and shut cooling off immediately if you see it
- Keep supply and return vents unblocked by furniture and rugs

## October–November: before heating season
- Book the heating tune-up, including a combustion analysis and carbon monoxide test
- Run the heat for fifteen minutes on a mild day so the dust burns off before you need it
- Test every smoke and CO detector and change the batteries
- Check the flue for nests and obstructions

## December–February: freeze readiness
North Texas freezes are infrequent and severe, which is a bad combination.

- Know where your breaker panel and outdoor disconnect are before you need them
- Keep filters in stock — supply runs during a freeze event are difficult
- If you have a heat pump, learn what a normal defrost cycle looks like so steam off the outdoor unit does not send you into a panic
- Do not set the thermostat back overnight during a hard freeze; recovering costs more in strip heat than the setback saved

## What is worth paying a professional for
Filters, coil rinsing, drain treatment and clearance are genuinely DIY. Refrigerant charge verification, electrical component testing, static pressure measurement and combustion analysis require instruments and licensing. The professional visit is not the filter change — it is the measurements that tell you what is about to fail.`,
  },
  {
    slug: "what-size-air-conditioner-do-i-need",
    title: "Bigger Is Not Better: How AC Sizing Actually Works",
    metaTitle: "What Size Air Conditioner Do I Need? | DFW Sizing Guide",
    description:
      "Why an oversized air conditioner cools worse than a correctly sized one, and what a real Manual J load calculation involves.",
    category: "Costs & Efficiency",
    date: "2026-04-22",
    readingMinutes: 6,
    body: `The most expensive mistake in residential HVAC is not buying the wrong brand. It is buying the wrong size — and in North Texas, wrong almost always means too big.

## What oversizing actually does
An oversized air conditioner hits the thermostat setpoint quickly and shuts off. That sounds good. It is not.

Removing humidity takes *time*. Moisture condenses on a cold evaporator coil over the course of a long cycle, and a system that runs for seven minutes and stops never gets there. The result is a house that is technically at 72°F and feels clammy and unpleasant.

Short cycling also wears out the parts that fail most: compressors and contactors are stressed most at start-up, and an oversized system starts far more often. It leaves rooms further from the air handler under-served, because the system never runs long enough to move air out to them.

## The old sizing rule is wrong
The rule of thumb — one ton per 500 to 600 square feet — dates from an era of leaky, poorly insulated homes and takes no account of anything that actually determines your cooling load.

Two identical 2,400 square foot homes on the same street can have loads that differ by more than a ton, depending on:

- Insulation depth in the attic and whether there is a radiant barrier
- Window area, orientation and glazing — west-facing glass is a very large load in Texas
- How leaky the building envelope is
- How leaky the ductwork is, and whether it runs through a hot attic
- Shade from mature trees
- How many people live there and how the house is used

## What a real load calculation involves
A Manual J calculation is a room-by-room heat gain model. A technician measures the house, records window sizes and orientations, notes insulation levels, and factors in duct location and leakage. The output is a number in BTUs per hour, per room — which also tells you how much air each room needs, and therefore whether your existing ducts can deliver it.

It takes 45 minutes to an hour on site. Any contractor who quotes a tonnage from the driveway, or from the sticker on your old unit, has not done it.

## Why replacing "like for like" repeats the mistake
If the original system was oversized — and in homes built before about 2005 it very often was — matching it just inherits the error. Meanwhile, homes that have added attic insulation, replaced windows or sealed ductwork genuinely need *less* capacity than they did fifteen years ago. We routinely install systems a half ton to a full ton smaller than what came out, and the houses are more comfortable for it.

## What to ask for
Ask to see the load calculation. Ask which rooms came out highest and whether the existing ducts can carry the airflow those rooms need. A contractor who has done the work will be glad to walk you through it; the answer to that question is the single best test of whether you are getting an engineer or a salesperson.`,
  },
  {
    slug: "indoor-air-quality-dfw-allergies",
    title: "Allergy Season in DFW: What Actually Helps Indoors",
    metaTitle: "Indoor Air Quality & Allergies in Dallas–Fort Worth",
    description:
      "Dallas–Fort Worth is one of the toughest allergy climates in the US. Here is what genuinely improves indoor air — and what is marketing.",
    category: "Air Quality",
    date: "2026-02-27",
    readingMinutes: 6,
    body: `Dallas–Fort Worth reliably lands near the top of national allergy rankings, and we get three distinct seasons of it: cedar and elm in winter, oak and grass in spring, ragweed in autumn. Indoor air is where you can actually do something about it.

## Fix the leaks before you buy a purifier
The most common cause of dusty, allergen-heavy indoor air in North Texas is not inadequate filtration. It is a return-side duct system pulling unfiltered attic air straight into the airstream.

If the return plenum leaks, your system is drawing 140°F attic air full of insulation fibres, dust and whatever else is up there — and delivering it to your bedrooms through a filter that never sees it. No purifier fixes that. Sealing the return does, and it usually costs less.

## Get the filter right, not just dense
This is where most homeowners are steered wrong. A MERV 13 filter in a one-inch slot is usually worse than a MERV 8 in the same slot.

Filtration works by surface area. A one-inch cabinet does not have enough of it to support dense media without a large pressure drop, so airflow falls, the coil ices, and the blower motor overheats. The correct upgrade is a deeper cabinet — four or five inches — which gives you MERV 11–16 filtration across enough media area that static pressure stays where the equipment wants it.

If you cannot fit a deeper cabinet, stay at MERV 8–11 in the one-inch slot and change it monthly.

## Humidity is half the problem
Target 40–50% relative humidity indoors. Above 55%, dust mites and mould thrive and the air feels heavy. Below 30%, airways dry out and irritation gets worse.

An oversized air conditioner is one of the leading causes of high indoor humidity in Texas, because it short-cycles and never dehumidifies properly. In a house that is cool but clammy, a whole-home dehumidifier — or correctly sized two-stage equipment — will do more for symptoms than any filter.

## UV-C where it belongs
UV-C lamps aimed at the evaporator coil and drain pan do a specific, well-evidenced job: they stop biological growth in the one place in your house that is permanently dark, wet and 55°F. That is worth doing, particularly if you get a musty smell when the system starts.

UV-C marketed as "air sterilisation" in the airstream is a much weaker claim — contact time at duct velocity is very short. Buy it for the coil, not for the air.

## What we do not recommend
Ozone generators. Ozone is a lung irritant, the concentrations needed to affect odours exceed safe exposure limits, and there are better tools for every problem they claim to solve. We do not sell them.

## A realistic order of operations
1. Seal return-side duct leakage
2. Fit a properly sized media filter cabinet
3. Get indoor humidity into the 40–50% band
4. Add UV-C at the coil if you have a musty smell or visible growth
5. Consider fresh-air ventilation if the home is newer and tightly sealed`,
  },
  {
    slug: "lower-summer-energy-bill-texas",
    title: "Cutting a Texas Summer Energy Bill Without Being Uncomfortable",
    metaTitle: "How to Lower Your Summer Energy Bill in Texas",
    description:
      "Practical, measured ways to reduce cooling costs in a DFW summer — ordered by how much they actually save.",
    category: "Costs & Efficiency",
    date: "2026-06-30",
    readingMinutes: 6,
    body: `Cooling is the largest single line on a North Texas summer electricity bill, often more than half of it. Here is what actually moves the number, roughly in order of impact.

## 1. Seal the ducts
Typical attic duct systems lose 20–30% of the air they carry. That is a fifth to a third of everything you pay to cool, dumped into a 140°F attic — and worse, the pressure imbalance pulls that attic air back in through return leaks.

This is the highest-return fix in most DFW homes and it is nowhere near the most expensive one. It is also invisible, which is why it goes unaddressed for decades.

## 2. Wash the condenser coil
An outdoor coil matted with cottonwood and dust raises head pressure and can cost double-digit percentages in efficiency. Rinsing it gently with a hose once a year — fins bend easily, so never a pressure washer — is free and takes fifteen minutes.

## 3. Set the thermostat with the grain of the equipment
Two things are worth knowing:

- Setting 65°F when it is 105°F outside does not cool the house faster. The system has one speed. All you do is guarantee it never shuts off.
- A modest setback while the house is empty genuinely saves money — but on a heat pump in winter, an aggressive setback can cost more than it saves by triggering expensive strip heat on recovery.

78°F while home and 82–83°F while out is the range where most households find the balance.

## 4. Use ceiling fans correctly
A ceiling fan cools people, not rooms. Moving air makes 78°F feel like about 75°F, which lets you raise the thermostat several degrees for the same comfort. But a fan running in an empty room is just a small heater with a light attached — turn them off when you leave.

## 5. Handle the west-facing glass
West-facing windows in Texas are a very large afternoon load. Cellular shades, exterior screens or low-E film on those windows specifically deliver more than treating the whole house. This is the one place where a targeted fix beats a general one.

## 6. Attic insulation
If your attic insulation is below about R-30, adding depth is one of the better returns available on an older DFW home — and it helps in January as much as in July.

## 7. Right-size the next system, and stage it
When replacement time comes, a correctly sized two-stage or variable-speed system typically cuts cooling cost by 25–45% against a fifteen-year-old single-stage unit. It also runs long, low-speed cycles that dehumidify properly, which means the house feels comfortable at a higher setpoint — a compounding saving.

## What barely helps
- Closing vents in unused rooms. This raises static pressure, strains the blower and can freeze the coil. It does not save money.
- Cranking the temperature down for a "faster" cool-down. It does not exist.
- Running the fan in ON constantly during humid weather. It re-evaporates moisture off the coil and puts it back into the house between cycles.`,
  },
];

export const postMap = new Map(posts.map((p) => [p.slug, p]));

export function getPost(slug: string) {
  return postMap.get(slug);
}

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
