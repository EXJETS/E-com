/**
 * A small curated set of business-aviation airports.
 *
 * It powers the search form's datalist and the great-circle distance estimates
 * used when the Avinode sandbox is unreachable. Avinode itself is the source of
 * truth for airports in production — see `lookupAirport()` in `src/lib/avinode.ts`.
 */
export type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export const airports: Airport[] = [
  { icao: "EGGW", iata: "LTN", name: "London Luton", city: "London", country: "United Kingdom", lat: 51.8747, lon: -0.3683 },
  { icao: "EGLF", iata: "FAB", name: "Farnborough", city: "London", country: "United Kingdom", lat: 51.2758, lon: -0.7763 },
  { icao: "EGKB", iata: "BQH", name: "London Biggin Hill", city: "London", country: "United Kingdom", lat: 51.3308, lon: 0.0325 },
  { icao: "LFPB", iata: "LBG", name: "Paris Le Bourget", city: "Paris", country: "France", lat: 48.9694, lon: 2.4414 },
  { icao: "LFMN", iata: "NCE", name: "Nice Côte d'Azur", city: "Nice", country: "France", lat: 43.6584, lon: 7.2159 },
  { icao: "LSGG", iata: "GVA", name: "Geneva", city: "Geneva", country: "Switzerland", lat: 46.2381, lon: 6.1089 },
  { icao: "LSZH", iata: "ZRH", name: "Zurich", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492 },
  { icao: "LIML", iata: "LIN", name: "Milan Linate", city: "Milan", country: "Italy", lat: 45.4451, lon: 9.2767 },
  { icao: "LIRA", iata: "CIA", name: "Rome Ciampino", city: "Rome", country: "Italy", lat: 41.7994, lon: 12.5949 },
  { icao: "LEPA", iata: "PMI", name: "Palma de Mallorca", city: "Palma", country: "Spain", lat: 39.5517, lon: 2.7388 },
  { icao: "LEMD", iata: "MAD", name: "Madrid Barajas", city: "Madrid", country: "Spain", lat: 40.4719, lon: -3.5626 },
  { icao: "LEBL", iata: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "Spain", lat: 41.2971, lon: 2.0785 },
  { icao: "EDDM", iata: "MUC", name: "Munich", city: "Munich", country: "Germany", lat: 48.3538, lon: 11.7861 },
  { icao: "EDDB", iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", lat: 52.3667, lon: 13.5033 },
  { icao: "EHAM", iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3086, lon: 4.7639 },
  { icao: "EBBR", iata: "BRU", name: "Brussels", city: "Brussels", country: "Belgium", lat: 50.9014, lon: 4.4844 },
  { icao: "ESSB", iata: "BMA", name: "Stockholm Bromma", city: "Stockholm", country: "Sweden", lat: 59.3544, lon: 17.9417 },
  { icao: "EKCH", iata: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark", lat: 55.6180, lon: 12.6560 },
  { icao: "LOWW", iata: "VIE", name: "Vienna", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697 },
  { icao: "LGAV", iata: "ATH", name: "Athens", city: "Athens", country: "Greece", lat: 37.9364, lon: 23.9445 },
  { icao: "LTFM", iata: "IST", name: "Istanbul", city: "Istanbul", country: "Türkiye", lat: 41.2753, lon: 28.7519 },
  { icao: "LPPT", iata: "LIS", name: "Lisbon", city: "Lisbon", country: "Portugal", lat: 38.7742, lon: -9.1342 },
  { icao: "OMDW", iata: "DWC", name: "Dubai Al Maktoum", city: "Dubai", country: "United Arab Emirates", lat: 24.8967, lon: 55.1614 },
  { icao: "OTHH", iata: "DOH", name: "Doha Hamad", city: "Doha", country: "Qatar", lat: 25.2731, lon: 51.6081 },
  { icao: "GMMN", iata: "CMN", name: "Casablanca Mohammed V", city: "Casablanca", country: "Morocco", lat: 33.3675, lon: -7.5900 },
  { icao: "GMMX", iata: "RAK", name: "Marrakesh Menara", city: "Marrakesh", country: "Morocco", lat: 31.6069, lon: -8.0363 },
  { icao: "KTEB", iata: "TEB", name: "Teterboro", city: "New York", country: "United States", lat: 40.8501, lon: -74.0608 },
  { icao: "KHPN", iata: "HPN", name: "Westchester County", city: "New York", country: "United States", lat: 41.0670, lon: -73.7076 },
  { icao: "KVNY", iata: "VNY", name: "Van Nuys", city: "Los Angeles", country: "United States", lat: 34.2098, lon: -118.4899 },
  { icao: "KOPF", iata: "OPF", name: "Miami Opa-locka", city: "Miami", country: "United States", lat: 25.9070, lon: -80.2784 },
  { icao: "KLAS", iata: "LAS", name: "Harry Reid", city: "Las Vegas", country: "United States", lat: 36.0840, lon: -115.1537 },
  { icao: "KASE", iata: "ASE", name: "Aspen/Pitkin County", city: "Aspen", country: "United States", lat: 39.2232, lon: -106.8687 },
];

const byCode = new Map<string, Airport>();
for (const airport of airports) {
  byCode.set(airport.icao, airport);
  byCode.set(airport.iata, airport);
}

/** Resolve a free-text entry ("LTN", "eggw", "London Luton") to a known airport. */
export function findAirport(query: string | undefined): Airport | undefined {
  if (!query) return undefined;
  const normalized = query.trim().toUpperCase();
  if (!normalized) return undefined;

  const exact = byCode.get(normalized);
  if (exact) return exact;

  const lower = normalized.toLowerCase();
  return airports.find(
    (airport) =>
      airport.city.toLowerCase() === lower ||
      airport.name.toLowerCase().includes(lower) ||
      `${airport.city} ${airport.name}`.toLowerCase().includes(lower),
  );
}

/** Great-circle distance in nautical miles. */
export function distanceNm(from: Airport, to: Airport): number {
  const R_NM = 3440.065;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R_NM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
