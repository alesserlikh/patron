/* eslint-disable @typescript-eslint/no-require-imports */
// Rebuild from the original GeoNames snapshots; never use user coordinates.
const fs = require("node:fs");
const [source, russianNames] = process.argv.slice(2);
if (!source || !russianNames)
  throw new Error(
    "Usage: node scripts/build-city-locations.cjs cities15000.txt RU-alternates.txt",
  );
const rows = fs
  .readFileSync(source, "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split("\t"));
const ids = new Set(rows.map((r) => r[0]));
const names = new Map();
for (const line of fs.readFileSync(russianNames, "utf8").split("\n")) {
  const c = line.split("\t");
  if (
    ids.has(c[1]) &&
    c[2] === "ru" &&
    c[7] !== "1" &&
    c[6] !== "1" &&
    (!names.has(c[1]) || c[4] === "1")
  )
    names.set(c[1], c[3]);
}
const cityCodes = new Set([
  "PPL",
  "PPLA",
  "PPLA2",
  "PPLA3",
  "PPLA4",
  "PPLA5",
  "PPLC",
  "PPLG",
  "STLMT",
]);
const cityRows = rows.filter((r) => r[6] === "P" && cityCodes.has(r[7]));
const project = (r) => [
  names.get(r[0]) || r[1],
  Number(r[4]),
  Number(r[5]),
  r[17],
  r[8],
];
const cities = cityRows.map(project);
const distance = (a, b) => {
  const rad = Math.PI / 180,
    lat1 = Number(a[4]) * rad,
    lat2 = Number(b[4]) * rad;
  return (
    6371 *
    2 *
    Math.asin(
      Math.sqrt(
        Math.min(
          1,
          Math.sin((lat2 - lat1) / 2) ** 2 +
            Math.cos(lat1) *
              Math.cos(lat2) *
              Math.sin(((Number(b[5]) - Number(a[5])) * rad) / 2) ** 2,
        ),
      ),
    )
  );
};
const districts = [];
// These first-order regions in the source are cities themselves. A section of
// either city must not be replaced by a closer suburban settlement.
const cityRegions = new Map(
  [
    ["RU:66", "498817"],
    ["RU:48", "524901"],
  ].map(([key, id]) => [key, cityRows.findIndex((r) => r[0] === id)]),
);
for (const district of rows.filter((r) => r[7] === "PPLX")) {
  // A parent cannot be smaller than its section. Keep the same country;
  // incomplete or older population data falls back to the nearest eligible city.
  const cityRegion = cityRegions.get(`${district[8]}:${district[10]}`);
  if (
    cityRegion !== undefined &&
    cityRegion >= 0 &&
    distance(district, cityRows[cityRegion]) <= 100
  ) {
    districts.push([...project(district), cityRegion]);
    continue;
  }
  let candidates = cityRows
    .map((city, index) => ({ city, index }))
    .filter(({ city }) => city[8] === district[8]);
  const larger = candidates.filter(
    ({ city }) => Number(city[14]) >= Number(district[14]),
  );
  if (larger.some(({ city }) => distance(district, city) <= 100))
    candidates = larger;
  let parent = -1,
    km = Infinity;
  for (const { city, index } of candidates) {
    const d = distance(district, city);
    if (d < km) {
      km = d;
      parent = index;
    }
  }
  if (parent >= 0 && km <= 100) districts.push([...project(district), parent]);
}
fs.writeFileSync("data/geonames/cities.json", JSON.stringify(cities));
fs.writeFileSync("data/geonames/districts.json", JSON.stringify(districts));
fs.writeFileSync(
  "data/geonames/classification.json",
  JSON.stringify(
    {
      version: 2,
      cityCodes: [...cityCodes],
      cities: cities.length,
      mappedDistricts: districts.length,
      excludedDistricts: rows.filter((r) => r[7] === "PPLX").length,
    },
    null,
    2,
  ),
);
console.log({ cities: cities.length, districts: districts.length });
