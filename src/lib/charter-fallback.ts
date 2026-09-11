/**
 * Locally estimated charter quotes.
 *
 * Used when the Avinode sandbox is unreachable or not configured, so the landing
 * page still demonstrates the full flow. Everything here is deterministic —
 * same route in, same numbers out — and the UI always labels it as estimated.
 */
import { distanceNm, type Airport } from "@/lib/airports";

type FleetEntry = {
  aircraftType: string;
  category: string;
  tailNumber: string;
  operator: string;
  maxPax: number;
  yearOfManufacture: number;
  rangeNm: number;
  cruiseKts: number;
  hourlyRate: number;
  amenities: string[];
};

const FLEET: FleetEntry[] = [
  {
    aircraftType: "King Air 350i",
    category: "Turboprop",
    tailNumber: "OY-JEB",
    operator: "Baltic Wings",
    maxPax: 8,
    yearOfManufacture: 2017,
    rangeNm: 1800,
    cruiseKts: 312,
    hourlyRate: 2900,
    amenities: ["Refreshment centre", "Short-runway capable"],
  },
  {
    aircraftType: "Citation CJ3+",
    category: "Light Jet",
    tailNumber: "G-CJKL",
    operator: "Meridian Air Charter",
    maxPax: 6,
    yearOfManufacture: 2019,
    rangeNm: 1900,
    cruiseKts: 405,
    hourlyRate: 3900,
    amenities: ["Wi-Fi", "Enclosed lavatory"],
  },
  {
    aircraftType: "Phenom 300E",
    category: "Light Jet",
    tailNumber: "CS-PHE",
    operator: "Atlantic Executive",
    maxPax: 8,
    yearOfManufacture: 2021,
    rangeNm: 2010,
    cruiseKts: 450,
    hourlyRate: 4400,
    amenities: ["Wi-Fi", "Baggage 74 cu ft", "Flat floor"],
  },
  {
    aircraftType: "Citation XLS+",
    category: "Midsize Jet",
    tailNumber: "D-CXLS",
    operator: "Rhine Jet Services",
    maxPax: 8,
    yearOfManufacture: 2018,
    rangeNm: 1800,
    cruiseKts: 430,
    hourlyRate: 5200,
    amenities: ["Wi-Fi", "Stand-up cabin", "Cabin attendant optional"],
  },
  {
    aircraftType: "Challenger 350",
    category: "Super Midsize Jet",
    tailNumber: "9H-CLR",
    operator: "Valletta Aviation",
    maxPax: 9,
    yearOfManufacture: 2020,
    rangeNm: 3200,
    cruiseKts: 470,
    hourlyRate: 7600,
    amenities: ["Wi-Fi", "Cabin attendant", "Full galley"],
  },
  {
    aircraftType: "Gulfstream G280",
    category: "Super Midsize Jet",
    tailNumber: "N280XG",
    operator: "Harbor Point Jets",
    maxPax: 10,
    yearOfManufacture: 2019,
    rangeNm: 3600,
    cruiseKts: 482,
    hourlyRate: 8200,
    amenities: ["Wi-Fi", "Cabin attendant", "Sleeps 5"],
  },
  {
    aircraftType: "Falcon 2000LXS",
    category: "Heavy Jet",
    tailNumber: "F-HLXS",
    operator: "Côte Aviation",
    maxPax: 10,
    yearOfManufacture: 2018,
    rangeNm: 4000,
    cruiseKts: 470,
    hourlyRate: 9400,
    amenities: ["Wi-Fi", "Cabin attendant", "Hot galley", "Sleeps 6"],
  },
  {
    aircraftType: "Global 6000",
    category: "Ultra Long Range",
    tailNumber: "M-GLBL",
    operator: "Isle Executive Air",
    maxPax: 13,
    yearOfManufacture: 2017,
    rangeNm: 6000,
    cruiseKts: 488,
    hourlyRate: 14800,
    amenities: ["Wi-Fi", "Two cabin crew", "Private stateroom", "Sleeps 8"],
  },
  {
    aircraftType: "Gulfstream G650ER",
    category: "Ultra Long Range",
    tailNumber: "N650ER",
    operator: "Summit Global Aviation",
    maxPax: 14,
    yearOfManufacture: 2022,
    rangeNm: 7500,
    cruiseKts: 516,
    hourlyRate: 16500,
    amenities: ["Wi-Fi", "Two cabin crew", "Private stateroom", "Shower"],
  },
];

/** Fixed per-aircraft market adjustment, so quotes vary without being random. */
const MARKET_FACTOR = [0.94, 1.0, 1.06, 0.98, 1.03, 1.09, 0.96, 1.02, 1.07];

const TAXI_MINUTES = 20;
const MIN_BILLABLE_HOURS = 1.5;
const HANDLING_FEE = 1850;

export type SampleQuote = {
  id: string;
  aircraftType: string;
  category: string;
  tailNumber: string;
  operator: string;
  maxPax: number;
  yearOfManufacture: number;
  flightTimeMinutes: number;
  priceAmount: number;
  priceCurrency: string;
  amenities: string[];
};

export function buildSampleQuotes(
  pax: number,
  from: Airport | undefined,
  to: Airport | undefined,
): SampleQuote[] {
  // Without a resolvable pair, assume a typical regional sector.
  const legNm = from && to ? distanceNm(from, to) : 620;

  return FLEET.filter((entry) => entry.maxPax >= pax && entry.rangeNm >= legNm)
    .slice(0, 6)
    .map((entry, index) => {
      const airborneMinutes = Math.round((legNm / entry.cruiseKts) * 60);
      const flightTimeMinutes = airborneMinutes + TAXI_MINUTES;
      const billableHours = Math.max(flightTimeMinutes / 60, MIN_BILLABLE_HOURS);
      const factor = MARKET_FACTOR[index % MARKET_FACTOR.length];
      const priceAmount = Math.round(
        (entry.hourlyRate * billableHours * factor + HANDLING_FEE) / 50,
      ) * 50;

      return {
        id: `sample-${entry.tailNumber}`,
        aircraftType: entry.aircraftType,
        category: entry.category,
        tailNumber: entry.tailNumber,
        operator: entry.operator,
        maxPax: entry.maxPax,
        yearOfManufacture: entry.yearOfManufacture,
        flightTimeMinutes,
        priceAmount,
        priceCurrency: "EUR",
        amenities: entry.amenities,
      };
    });
}
