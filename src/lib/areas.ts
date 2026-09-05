export type Area = {
  slug: string;
  city: string;
  county: string;
  /** Metro half, used to group the directory page. */
  region: "Dallas & East" | "Collin & North" | "Tarrant & West" | "Denton & Northwest";
  zips: string[];
  /** One or two sentences of genuinely local context used in the page intro. */
  blurb: string;
  /** Housing-stock note that drives the "what we see here" section. */
  housing: string;
  nearestOffice: "dallas" | "arlington" | "mckinney";
};

/**
 * Service-area directory. Each city gets its own indexable landing page at
 * /service-areas/[slug] — the standard local-SEO pattern for a trades business.
 * Facts here (county, ZIP ranges) should be verified before launch.
 */
export const areas: Area[] = [
  { slug: "dallas", city: "Dallas", county: "Dallas County", region: "Dallas & East", zips: ["75201", "75204", "75214", "75218", "75230", "75248"], nearestOffice: "dallas",
    blurb: "Our home city since 1945, from the pre-war bungalows of the M Streets to the new build stock north of LBJ.",
    housing: "Dallas housing stock spans nearly a century, so we see everything from 1940s homes with retrofitted ductwork in tight crawl spaces to 2020s builds with tightly sealed envelopes that need mechanical fresh air." },
  { slug: "plano", city: "Plano", county: "Collin County", region: "Collin & North", zips: ["75023", "75024", "75025", "75074", "75075", "75093"], nearestOffice: "mckinney",
    blurb: "Plano's enormous 1980s and 1990s housing boom means a huge number of homes are hitting their second or third system replacement at once.",
    housing: "Most Plano homes we service are two-storey with attic air handlers and a single system trying to condition both floors — the classic cause of an upstairs that runs six to eight degrees hot." },
  { slug: "garland", city: "Garland", county: "Dallas County", region: "Dallas & East", zips: ["75040", "75041", "75042", "75043", "75044"], nearestOffice: "dallas",
    blurb: "A large stock of mature single-storey homes where duct sealing frequently outperforms an equipment upgrade.",
    housing: "Garland's 1960s–1980s ranch homes usually run flex duct through a hot attic. Leakage testing regularly finds a fifth of the conditioned air never reaching a room." },
  { slug: "richardson", city: "Richardson", county: "Dallas County", region: "Dallas & East", zips: ["75080", "75081", "75082"], nearestOffice: "dallas",
    blurb: "Mid-century homes near the Telecom Corridor with mature tree cover — beautiful, and hard on outdoor coils every spring.",
    housing: "Heavy cottonwood and oak pollen means Richardson condensers need an annual coil wash more than most; matted coils here routinely cost 15% or more in efficiency." },
  { slug: "frisco", city: "Frisco", county: "Collin County", region: "Collin & North", zips: ["75033", "75034", "75035", "75036"], nearestOffice: "mckinney",
    blurb: "One of the fastest-growing cities in the country, with a housing stock that is mostly under 25 years old.",
    housing: "Frisco homes are large, tightly built and frequently two-system. Zoning and balanced fresh-air ventilation matter more here than raw tonnage." },
  { slug: "mckinney", city: "McKinney", county: "Collin County", region: "Collin & North", zips: ["75069", "75070", "75071", "75072"], nearestOffice: "mckinney",
    blurb: "Home to one of our three service centres, covering historic downtown McKinney through the newest developments north of 380.",
    housing: "A genuine split: century-old homes around the square with retrofitted systems and no return air to speak of, and new builds where the challenge is humidity control, not capacity." },
  { slug: "carrollton", city: "Carrollton", county: "Denton County", region: "Denton & Northwest", zips: ["75006", "75007", "75010"], nearestOffice: "dallas",
    blurb: "A mix of 1980s subdivisions and newer infill on both sides of the Dallas–Denton county line.",
    housing: "Two-storey homes with a single system are common, so we spend a lot of time on zoning, return air sizing and upstairs airflow." },
  { slug: "fort-worth", city: "Fort Worth", county: "Tarrant County", region: "Tarrant & West", zips: ["76102", "76107", "76109", "76116", "76132", "76137"], nearestOffice: "arlington",
    blurb: "From the historic homes of the Near Southside to the fast-growing far north, dispatched from our Arlington service centre.",
    housing: "Fort Worth's older neighbourhoods often have undersized returns and pier-and-beam construction with ductwork below the floor rather than above the ceiling — a different set of failure points entirely." },
  { slug: "mesquite", city: "Mesquite", county: "Dallas County", region: "Dallas & East", zips: ["75149", "75150", "75181", "75182"], nearestOffice: "dallas",
    blurb: "Minutes from our Big Town Boulevard service centre, so Mesquite gets some of our fastest arrival windows.",
    housing: "A large base of 1970s and 1980s single-storey homes, where a properly sized replacement plus duct sealing usually beats chasing repairs on ageing equipment." },
  { slug: "arlington", city: "Arlington", county: "Tarrant County", region: "Tarrant & West", zips: ["76001", "76006", "76013", "76015", "76017"], nearestOffice: "arlington",
    blurb: "Home to our Tarrant County service centre and a housing stock that spans five decades.",
    housing: "Arlington's mid-century homes often carry ductwork that has been extended piecemeal through additions, which is why room-by-room airflow measurement matters here." },
  { slug: "rockwall", city: "Rockwall", county: "Rockwall County", region: "Dallas & East", zips: ["75032", "75087"], nearestOffice: "dallas",
    blurb: "Lakeside homes east of Dallas where humidity control is a bigger factor than most homeowners expect.",
    housing: "Proximity to Lake Ray Hubbard raises the humidity load. Systems here benefit disproportionately from two-stage equipment that runs long, dehumidifying cycles." },
  { slug: "irving", city: "Irving", county: "Dallas County", region: "Dallas & East", zips: ["75038", "75039", "75060", "75061", "75063"], nearestOffice: "dallas",
    blurb: "From Las Colinas high-rises to established single-family neighbourhoods on the west side.",
    housing: "Irving's spread between dense multi-family and 1960s single-family means we work on everything from mini-splits to full attic system replacements." },
  { slug: "flower-mound", city: "Flower Mound", county: "Denton County", region: "Denton & Northwest", zips: ["75022", "75028"], nearestOffice: "mckinney",
    blurb: "Larger lots and larger homes, which usually means multi-system or zoned installations.",
    housing: "Two- and three-system homes are common. Getting the staging and thermostat balance points right matters more than in a single-system house." },
  { slug: "rowlett", city: "Rowlett", county: "Dallas County", region: "Dallas & East", zips: ["75088", "75089"], nearestOffice: "dallas",
    blurb: "A lakeside community east of Garland with a fast-growing base of newer construction.",
    housing: "Lake-adjacent humidity plus tight newer envelopes makes whole-home dehumidification a genuinely useful upgrade here rather than a luxury." },
  { slug: "parker", city: "Parker", county: "Collin County", region: "Collin & North", zips: ["75002", "75094"], nearestOffice: "mckinney",
    blurb: "Acreage properties north-east of Plano, often with long duct runs and multiple systems.",
    housing: "Larger homes on larger lots mean extended duct runs where static pressure and correct branch sizing decide whether the far bedrooms are ever comfortable." },
  { slug: "keller", city: "Keller", county: "Tarrant County", region: "Tarrant & West", zips: ["76248", "76262"], nearestOffice: "arlington",
    blurb: "North-east Tarrant County, mostly 1990s and 2000s homes now reaching their first full system replacement.",
    housing: "A large cohort of original equipment installed in the same few years is now failing in the same few years — planning a replacement beats an emergency one." },
  { slug: "grand-prairie", city: "Grand Prairie", county: "Tarrant County", region: "Tarrant & West", zips: ["75050", "75051", "75052", "75054"], nearestOffice: "arlington",
    blurb: "Stretching across the middle of the metroplex, covered from our Arlington centre.",
    housing: "Wide age range in the housing stock, with a lot of 1980s homes where the original ductwork has outlived two sets of equipment." },
  { slug: "allen", city: "Allen", county: "Collin County", region: "Collin & North", zips: ["75002", "75013"], nearestOffice: "mckinney",
    blurb: "Dense 1990s and 2000s development where systems are now in their replacement window.",
    housing: "Two-storey homes with attic air handlers dominate. Upstairs comfort complaints here are usually a return air and zoning problem, not a capacity problem." },
  { slug: "coppell", city: "Coppell", county: "Dallas County", region: "Denton & Northwest", zips: ["75019"], nearestOffice: "dallas",
    blurb: "A compact, established community between DFW Airport and Carrollton.",
    housing: "Mostly late 1980s through 1990s two-storey homes — prime candidates for zoning or a second system when the upstairs never cooperates." },
  { slug: "farmers-branch", city: "Farmers Branch", county: "Dallas County", region: "Dallas & East", zips: ["75234", "75244"], nearestOffice: "dallas",
    blurb: "An older inner-ring city with mature trees and a lot of original ductwork still in service.",
    housing: "Duct sealing and return air corrections often deliver more comfort per dollar here than a higher-SEER2 outdoor unit would." },
  { slug: "colleyville", city: "Colleyville", county: "Tarrant County", region: "Tarrant & West", zips: ["76034"], nearestOffice: "arlington",
    blurb: "Larger custom homes in north-east Tarrant County, frequently with multiple zoned systems.",
    housing: "Custom builds mean custom duct layouts. We measure rather than assume, because no two of these houses behave the same way." },
  { slug: "north-richland-hills", city: "North Richland Hills", county: "Tarrant County", region: "Tarrant & West", zips: ["76180", "76182"], nearestOffice: "arlington",
    blurb: "Established mid-cities neighbourhoods between Fort Worth and the airport.",
    housing: "A lot of 1970s–1990s single and two-storey homes where the returns were sized for equipment that has since been replaced twice." },
  { slug: "the-colony", city: "The Colony", county: "Denton County", region: "Denton & Northwest", zips: ["75056"], nearestOffice: "mckinney",
    blurb: "A lakeside city on the east shore of Lewisville Lake with a steadily growing housing stock.",
    housing: "Humidity from the lake plus newer tight construction makes correct dehumidification and fresh-air strategy unusually important." },
  { slug: "southlake", city: "Southlake", county: "Tarrant County", region: "Tarrant & West", zips: ["76092"], nearestOffice: "arlington",
    blurb: "Large custom homes where multi-zone, variable-speed systems are the norm rather than the exception.",
    housing: "Three- and four-zone systems are common. Correct commissioning and staging setup make a far bigger difference here than nominal equipment tonnage." },
  { slug: "highland-park", city: "Highland Park", county: "Dallas County", region: "Dallas & East", zips: ["75205", "75219"], nearestOffice: "dallas",
    blurb: "Historic homes where equipment has to be fitted into spaces never designed for modern systems.",
    housing: "Tight mechanical closets, original architecture worth protecting and frequent additions make these among the most demanding installations we do." },
  { slug: "grapevine", city: "Grapevine", county: "Tarrant County", region: "Tarrant & West", zips: ["76051"], nearestOffice: "arlington",
    blurb: "Historic downtown homes and newer lakeside development on the north-east edge of Tarrant County.",
    housing: "A wide spread of construction eras, so the right answer ranges from a straight changeout to a full duct redesign depending on the street." },
  { slug: "wylie", city: "Wylie", county: "Collin County", region: "Collin & North", zips: ["75098"], nearestOffice: "mckinney",
    blurb: "Fast-growing eastern Collin County with a mostly modern housing stock.",
    housing: "Newer, tighter homes where humidity and ventilation strategy matter as much as cooling capacity." },
  { slug: "bedford", city: "Bedford", county: "Tarrant County", region: "Tarrant & West", zips: ["76021", "76022"], nearestOffice: "arlington",
    blurb: "Central mid-cities location, minutes from our Arlington dispatch.",
    housing: "Established 1970s and 1980s homes where ageing ductwork is usually the limiting factor on comfort." },
  { slug: "euless", city: "Euless", county: "Tarrant County", region: "Tarrant & West", zips: ["76039", "76040"], nearestOffice: "arlington",
    blurb: "Between Fort Worth and the airport, with a broad mix of housing ages.",
    housing: "Airport-adjacent homes are often well insulated for sound, which changes the load calculation in ways a like-for-like replacement would miss." },
  { slug: "lewisville", city: "Lewisville", county: "Denton County", region: "Denton & Northwest", zips: ["75056", "75057", "75067", "75077"], nearestOffice: "mckinney",
    blurb: "A large Denton County city stretching from the lake down to the I-35E corridor.",
    housing: "Wide range of eras and sizes; lake-side properties carry a noticeably higher humidity load than those further east." },
  { slug: "forney", city: "Forney", county: "Kaufman County", region: "Dallas & East", zips: ["75126"], nearestOffice: "dallas",
    blurb: "Rapid growth east of Mesquite, largely new construction on former farmland.",
    housing: "Predominantly new builds. The common complaints here are humidity and builder-grade duct layouts rather than equipment failure." },
  { slug: "murphy", city: "Murphy", county: "Collin County", region: "Collin & North", zips: ["75094"], nearestOffice: "mckinney",
    blurb: "A compact Collin County city between Plano and Wylie with mostly 2000s housing.",
    housing: "Homes here are reaching the age where the original builder-grade system is due for its first replacement." },
  { slug: "sachse", city: "Sachse", county: "Dallas County", region: "Dallas & East", zips: ["75048"], nearestOffice: "dallas",
    blurb: "Between Garland and Wylie, straddling the Dallas–Collin county line.",
    housing: "A mix of 1990s and 2000s two-storey homes where zoning frequently solves what a bigger system will not." },
  { slug: "hurst", city: "Hurst", county: "Tarrant County", region: "Tarrant & West", zips: ["76053", "76054"], nearestOffice: "arlington",
    blurb: "Central mid-cities, with a mature and well-established housing stock.",
    housing: "Original ductwork from the 1970s is still common, and sealing it is usually the highest-return fix available." },
  { slug: "trophy-club", city: "Trophy Club", county: "Denton County", region: "Denton & Northwest", zips: ["76262"], nearestOffice: "arlington",
    blurb: "A planned community on the Denton–Tarrant line with larger, mostly modern homes.",
    housing: "Multi-system homes are normal here, which makes correct zoning and thermostat configuration the difference between comfortable and expensive." },
  { slug: "desoto", city: "DeSoto", county: "Dallas County", region: "Dallas & East", zips: ["75115"], nearestOffice: "dallas",
    blurb: "Southern Dallas County, with a large base of established single-family homes.",
    housing: "1970s–1990s homes where a planned replacement paired with duct sealing consistently outperforms repeated repair." },
  { slug: "duncanville", city: "Duncanville", county: "Dallas County", region: "Dallas & East", zips: ["75116", "75137"], nearestOffice: "dallas",
    blurb: "A long-established southern Dallas County city we have served for decades.",
    housing: "Mature housing stock with original returns that are frequently undersized for the equipment now attached to them." },
];

export const areaMap = new Map(areas.map((a) => [a.slug, a]));

export function getArea(slug: string) {
  return areaMap.get(slug);
}

export const regions = [
  "Dallas & East",
  "Collin & North",
  "Tarrant & West",
  "Denton & Northwest",
] as const;

/** Cities shown in footers and "we also serve" strips. */
export const featuredAreas = areas.filter((a) =>
  ["dallas", "plano", "fort-worth", "frisco", "arlington", "mckinney", "irving", "garland"].includes(a.slug),
);
