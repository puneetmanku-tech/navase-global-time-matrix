/**
 * Curated IANA time-zone catalogue.
 *
 * The authoritative offset / DST maths comes from the host's bundled
 * IANA tz database (via `Intl` / Luxon) — see engine/tz.ts. This table
 * only supplies the *catalogue*: a friendly city label, the country,
 * and an approximate lat/lon (from the tz project's zone1970.tab) so
 * the grid can draw a real day / night indicator without any network
 * call.
 *
 * Zones present on the host but missing here still work — they fall
 * back to a name derived from the zone id and a neutral day/night dot.
 */

export interface ZoneMeta {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  /** lowercased haystack for search — built once at module load */
  q?: string;
}

const RAW: Omit<ZoneMeta, "q">[] = [
  // ---- North America ----
  { id: "America/New_York", city: "New York", country: "United States", lat: 40.71, lon: -74.01 },
  { id: "America/Detroit", city: "Detroit", country: "United States", lat: 42.33, lon: -83.05 },
  { id: "America/Toronto", city: "Toronto", country: "Canada", lat: 43.65, lon: -79.38 },
  { id: "America/Chicago", city: "Chicago", country: "United States", lat: 41.85, lon: -87.65 },
  { id: "America/Winnipeg", city: "Winnipeg", country: "Canada", lat: 49.9, lon: -97.14 },
  { id: "America/Mexico_City", city: "Mexico City", country: "Mexico", lat: 19.43, lon: -99.13 },
  { id: "America/Denver", city: "Denver", country: "United States", lat: 39.74, lon: -104.98 },
  { id: "America/Phoenix", city: "Phoenix (no DST)", country: "United States", lat: 33.45, lon: -112.07 },
  { id: "America/Edmonton", city: "Edmonton", country: "Canada", lat: 53.55, lon: -113.47 },
  { id: "America/Los_Angeles", city: "Los Angeles", country: "United States", lat: 34.05, lon: -118.24 },
  { id: "America/Vancouver", city: "Vancouver", country: "Canada", lat: 49.27, lon: -123.12 },
  { id: "America/Tijuana", city: "Tijuana", country: "Mexico", lat: 32.53, lon: -117.02 },
  { id: "America/Anchorage", city: "Anchorage", country: "United States", lat: 61.22, lon: -149.9 },
  { id: "Pacific/Honolulu", city: "Honolulu (no DST)", country: "United States", lat: 21.31, lon: -157.86 },
  { id: "America/Halifax", city: "Halifax", country: "Canada", lat: 44.65, lon: -63.6 },
  { id: "America/St_Johns", city: "St. John's", country: "Canada", lat: 47.56, lon: -52.71 },

  // ---- Central & South America ----
  { id: "America/Bogota", city: "Bogotá", country: "Colombia", lat: 4.71, lon: -74.07 },
  { id: "America/Lima", city: "Lima", country: "Peru", lat: -12.05, lon: -77.05 },
  { id: "America/Guayaquil", city: "Quito", country: "Ecuador", lat: -0.21, lon: -78.5 },
  { id: "America/Panama", city: "Panama City", country: "Panama", lat: 8.97, lon: -79.53 },
  { id: "America/Santiago", city: "Santiago", country: "Chile", lat: -33.45, lon: -70.67 },
  { id: "America/Caracas", city: "Caracas", country: "Venezuela", lat: 10.5, lon: -66.93 },
  { id: "America/La_Paz", city: "La Paz", country: "Bolivia", lat: -16.5, lon: -68.15 },
  { id: "America/Sao_Paulo", city: "São Paulo", country: "Brazil", lat: -23.55, lon: -46.64 },
  { id: "America/Argentina/Buenos_Aires", city: "Buenos Aires", country: "Argentina", lat: -34.61, lon: -58.38 },
  { id: "America/Montevideo", city: "Montevideo", country: "Uruguay", lat: -34.91, lon: -56.19 },
  { id: "America/Asuncion", city: "Asunción", country: "Paraguay", lat: -25.28, lon: -57.63 },
  { id: "Atlantic/Reykjavik", city: "Reykjavík (UTC)", country: "Iceland", lat: 64.15, lon: -21.95 },

  // ---- Europe ----
  { id: "Europe/London", city: "London", country: "United Kingdom", lat: 51.51, lon: -0.13 },
  { id: "Europe/Dublin", city: "Dublin", country: "Ireland", lat: 53.33, lon: -6.25 },
  { id: "Europe/Lisbon", city: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14 },
  { id: "Europe/Paris", city: "Paris", country: "France", lat: 48.85, lon: 2.35 },
  { id: "Europe/Madrid", city: "Madrid", country: "Spain", lat: 40.42, lon: -3.7 },
  { id: "Europe/Berlin", city: "Berlin", country: "Germany", lat: 52.52, lon: 13.4 },
  { id: "Europe/Amsterdam", city: "Amsterdam", country: "Netherlands", lat: 52.37, lon: 4.89 },
  { id: "Europe/Brussels", city: "Brussels", country: "Belgium", lat: 50.85, lon: 4.35 },
  { id: "Europe/Zurich", city: "Zürich", country: "Switzerland", lat: 47.38, lon: 8.54 },
  { id: "Europe/Rome", city: "Rome", country: "Italy", lat: 41.9, lon: 12.5 },
  { id: "Europe/Vienna", city: "Vienna", country: "Austria", lat: 48.21, lon: 16.37 },
  { id: "Europe/Prague", city: "Prague", country: "Czechia", lat: 50.09, lon: 14.42 },
  { id: "Europe/Warsaw", city: "Warsaw", country: "Poland", lat: 52.23, lon: 21.01 },
  { id: "Europe/Stockholm", city: "Stockholm", country: "Sweden", lat: 59.33, lon: 18.06 },
  { id: "Europe/Oslo", city: "Oslo", country: "Norway", lat: 59.91, lon: 10.75 },
  { id: "Europe/Copenhagen", city: "Copenhagen", country: "Denmark", lat: 55.68, lon: 12.57 },
  { id: "Europe/Helsinki", city: "Helsinki", country: "Finland", lat: 60.17, lon: 24.94 },
  { id: "Europe/Athens", city: "Athens", country: "Greece", lat: 37.98, lon: 23.73 },
  { id: "Europe/Bucharest", city: "Bucharest", country: "Romania", lat: 44.43, lon: 26.1 },
  { id: "Europe/Kyiv", city: "Kyiv", country: "Ukraine", lat: 50.45, lon: 30.52 },
  { id: "Europe/Istanbul", city: "Istanbul", country: "Türkiye", lat: 41.01, lon: 28.98 },
  { id: "Europe/Moscow", city: "Moscow", country: "Russia", lat: 55.76, lon: 37.62 },

  // ---- Africa & Middle East ----
  { id: "Africa/Casablanca", city: "Casablanca", country: "Morocco", lat: 33.57, lon: -7.59 },
  { id: "Africa/Lagos", city: "Lagos", country: "Nigeria", lat: 6.45, lon: 3.39 },
  { id: "Africa/Algiers", city: "Algiers", country: "Algeria", lat: 36.75, lon: 3.06 },
  { id: "Africa/Cairo", city: "Cairo", country: "Egypt", lat: 30.05, lon: 31.25 },
  { id: "Africa/Johannesburg", city: "Johannesburg", country: "South Africa", lat: -26.2, lon: 28.05 },
  { id: "Africa/Nairobi", city: "Nairobi", country: "Kenya", lat: -1.28, lon: 36.82 },
  { id: "Africa/Addis_Ababa", city: "Addis Ababa", country: "Ethiopia", lat: 9.03, lon: 38.74 },
  { id: "Africa/Accra", city: "Accra", country: "Ghana", lat: 5.55, lon: -0.22 },
  { id: "Asia/Jerusalem", city: "Jerusalem", country: "Israel", lat: 31.78, lon: 35.22 },
  { id: "Asia/Beirut", city: "Beirut", country: "Lebanon", lat: 33.89, lon: 35.5 },
  { id: "Asia/Riyadh", city: "Riyadh", country: "Saudi Arabia", lat: 24.64, lon: 46.77 },
  { id: "Asia/Dubai", city: "Dubai", country: "United Arab Emirates", lat: 25.3, lon: 55.3 },
  { id: "Asia/Qatar", city: "Doha", country: "Qatar", lat: 25.29, lon: 51.53 },
  { id: "Asia/Kuwait", city: "Kuwait City", country: "Kuwait", lat: 29.34, lon: 47.98 },
  { id: "Asia/Tehran", city: "Tehran", country: "Iran", lat: 35.67, lon: 51.42 },
  { id: "Asia/Baghdad", city: "Baghdad", country: "Iraq", lat: 33.34, lon: 44.4 },

  // ---- South & Central Asia ----
  { id: "Asia/Karachi", city: "Karachi", country: "Pakistan", lat: 24.86, lon: 67.01 },
  { id: "Asia/Kolkata", city: "India (IST)", country: "India", lat: 22.53, lon: 88.33 },
  { id: "Asia/Colombo", city: "Colombo", country: "Sri Lanka", lat: 6.93, lon: 79.85 },
  { id: "Asia/Kathmandu", city: "Kathmandu", country: "Nepal", lat: 27.72, lon: 85.32 },
  { id: "Asia/Dhaka", city: "Dhaka", country: "Bangladesh", lat: 23.72, lon: 90.41 },
  { id: "Asia/Tashkent", city: "Tashkent", country: "Uzbekistan", lat: 41.31, lon: 69.29 },
  { id: "Asia/Almaty", city: "Almaty", country: "Kazakhstan", lat: 43.25, lon: 76.95 },
  { id: "Asia/Yekaterinburg", city: "Yekaterinburg", country: "Russia", lat: 56.85, lon: 60.6 },

  // ---- East & Southeast Asia ----
  { id: "Asia/Yangon", city: "Yangon", country: "Myanmar", lat: 16.78, lon: 96.16 },
  { id: "Asia/Bangkok", city: "Bangkok", country: "Thailand", lat: 13.75, lon: 100.52 },
  { id: "Asia/Jakarta", city: "Jakarta", country: "Indonesia", lat: -6.18, lon: 106.83 },
  { id: "Asia/Ho_Chi_Minh", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.75, lon: 106.67 },
  { id: "Asia/Singapore", city: "Singapore", country: "Singapore", lat: 1.29, lon: 103.85 },
  { id: "Asia/Kuala_Lumpur", city: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lon: 101.69 },
  { id: "Asia/Manila", city: "Manila", country: "Philippines", lat: 14.6, lon: 120.98 },
  { id: "Asia/Hong_Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.28, lon: 114.16 },
  { id: "Asia/Shanghai", city: "Shanghai", country: "China", lat: 31.23, lon: 121.47 },
  { id: "Asia/Taipei", city: "Taipei", country: "Taiwan", lat: 25.05, lon: 121.5 },
  { id: "Asia/Seoul", city: "Seoul", country: "South Korea", lat: 37.57, lon: 126.98 },
  { id: "Asia/Tokyo", city: "Tokyo", country: "Japan", lat: 35.65, lon: 139.75 },

  // ---- Oceania ----
  { id: "Australia/Perth", city: "Perth", country: "Australia", lat: -31.96, lon: 115.86 },
  { id: "Australia/Adelaide", city: "Adelaide", country: "Australia", lat: -34.93, lon: 138.6 },
  { id: "Australia/Darwin", city: "Darwin (no DST)", country: "Australia", lat: -12.46, lon: 130.84 },
  { id: "Australia/Brisbane", city: "Brisbane (no DST)", country: "Australia", lat: -27.47, lon: 153.03 },
  { id: "Australia/Sydney", city: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  { id: "Australia/Melbourne", city: "Melbourne", country: "Australia", lat: -37.81, lon: 144.96 },
  { id: "Pacific/Auckland", city: "Auckland", country: "New Zealand", lat: -36.85, lon: 174.76 },
  { id: "Pacific/Fiji", city: "Suva", country: "Fiji", lat: -18.14, lon: 178.42 },
  { id: "Pacific/Guam", city: "Hagåtña", country: "Guam", lat: 13.47, lon: 144.75 },
  { id: "Pacific/Port_Moresby", city: "Port Moresby", country: "Papua New Guinea", lat: -9.5, lon: 147.17 },
  { id: "Pacific/Tongatapu", city: "Nukuʻalofa", country: "Tonga", lat: -21.13, lon: -175.2 },
  { id: "Pacific/Pago_Pago", city: "Pago Pago", country: "American Samoa", lat: -14.28, lon: -170.7 },
  { id: "Pacific/Kiritimati", city: "Kiritimati", country: "Kiribati", lat: 1.87, lon: -157.43 },

  // ---- Reference ----
  { id: "UTC", city: "UTC", country: "Coordinated Universal Time", lat: 0, lon: 0 },

  // ---- Legacy IANA aliases some operating systems still report ----
  { id: "Asia/Calcutta", city: "India (IST)", country: "India", lat: 22.53, lon: 88.33 },
  { id: "Asia/Katmandu", city: "Kathmandu", country: "Nepal", lat: 27.72, lon: 85.32 },
  { id: "Asia/Rangoon", city: "Yangon", country: "Myanmar", lat: 16.78, lon: 96.16 },
  { id: "Asia/Saigon", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.75, lon: 106.67 },
  { id: "America/Buenos_Aires", city: "Buenos Aires", country: "Argentina", lat: -34.61, lon: -58.38 },
  { id: "Europe/Kiev", city: "Kyiv", country: "Ukraine", lat: 50.45, lon: 30.52 },
  { id: "US/Eastern", city: "US Eastern", country: "United States", lat: 40.71, lon: -74.01 },
  { id: "US/Central", city: "US Central", country: "United States", lat: 41.85, lon: -87.65 },
  { id: "US/Mountain", city: "US Mountain", country: "United States", lat: 39.74, lon: -104.98 },
  { id: "US/Pacific", city: "US Pacific", country: "United States", lat: 34.05, lon: -118.24 },
  { id: "GMT", city: "GMT", country: "Greenwich Mean Time", lat: 51.48, lon: 0 },
];

export const ZONES: ZoneMeta[] = RAW.map((z) => ({
  ...z,
  q: `${z.city} ${z.country} ${z.id.replace(/[_/]/g, " ")}`.toLowerCase(),
}));

const BY_ID = new Map(ZONES.map((z) => [z.id, z]));

/** Every zone the host actually supports, catalogue-enriched where we can. */
export function allHostZones(): ZoneMeta[] {
  let ids: string[];
  try {
    ids = (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf(
      "timeZone",
    );
  } catch {
    ids = ZONES.map((z) => z.id);
  }
  return ids.map((id) => BY_ID.get(id) ?? deriveMeta(id));
}

export function metaFor(id: string): ZoneMeta {
  return BY_ID.get(id) ?? deriveMeta(id);
}

function deriveMeta(id: string): ZoneMeta {
  const parts = id.split("/");
  const city = (parts[parts.length - 1] ?? id).replace(/_/g, " ");
  const country = (parts[0] ?? "").replace(/_/g, " ");
  return { id, city, country, lat: NaN, lon: NaN, q: `${city} ${country} ${id}`.toLowerCase() };
}
