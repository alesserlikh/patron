import cities from "@/data/geonames/cities.json";
import districts from "@/data/geonames/districts.json";
import {
  defaultLocation,
  type VisitorLocation,
} from "@/content/patron/visitor";

// Eligible settlements only; PPLX sections are mapped internally to parent cities.
// Imported only by the route handler, never sent to the browser.
export function resolveLocation(
  latitude: number,
  longitude: number,
): VisitorLocation | null {
  const radians = Math.PI / 180;
  let nearest: (typeof cities)[number] | undefined;
  let best = Infinity;
  for (const city of [...cities, ...districts]) {
    const lat = Number(city[1]),
      lon = Number(city[2]);
    const a =
      Math.sin(((lat - latitude) * radians) / 2) ** 2 +
      Math.cos(latitude * radians) *
        Math.cos(lat * radians) *
        Math.sin(((lon - longitude) * radians) / 2) ** 2;
    if (a < best) {
      best = a;
      nearest = city;
    }
  }
  const km = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, best)));
  if (!nearest || km > 100) return null;
  const canonical = nearest.length > 5 ? cities[Number(nearest[5])] : nearest;
  const location = {
    city: String(canonical[0]),
    timeZone: String(canonical[3]),
    country: String(canonical[4]),
  };
  try {
    new Intl.DateTimeFormat("ru-RU", { timeZone: location.timeZone });
  } catch {
    return null;
  }
  return location.city === "Moscow" ? defaultLocation : location;
}

export function normalizeSavedLocation(
  saved: VisitorLocation,
): VisitorLocation | null {
  const matches = (row: (string | number)[]) =>
    row[0] === saved.city &&
    row[3] === saved.timeZone &&
    row[4] === saved.country;
  const candidates = [
    ...cities.filter(matches),
    ...districts.filter(matches).map((row) => cities[Number(row[5])]),
  ];
  const parents = new Map(
    candidates.map((row) => [JSON.stringify([row[0], row[3], row[4]]), row]),
  );
  // Legacy cookies have no coordinates: never guess if the same district name
  // refers to different cities in the same country/timezone.
  if (parents.size !== 1) return null;
  const parent = [...parents.values()][0];
  return {
    city: String(parent[0]),
    timeZone: String(parent[3]),
    country: String(parent[4]),
  };
}
