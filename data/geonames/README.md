# Offline visitor-city lookup

Source: GeoNames, https://download.geonames.org/export/dump/cities15000.zip
Russian names: https://download.geonames.org/export/dump/alternatenames/RU.zip
Downloaded 2026-11-13. License: Creative Commons Attribution 4.0,
https://creativecommons.org/licenses/by/4.0/ ; attribution: https://www.geonames.org/
Original dataset documentation: GeoNames-readme.txt.

Transformation: retain name, latitude, longitude, IANA timezone and country.
Use non-historic, non-colloquial Russian alternate names where available, preferring
the preferred-name flag; otherwise preserve the original GeoNames name.
Source: 34,215 records. The city list now contains 31,711 eligible settlements.
2,394 PPLX sections are stored separately with an internal parent-city index and
never returned as the displayed location. Historical, abandoned, destroyed and
other non-city feature types are excluded. Classification counts and whitelist
are in classification.json. No user's coordinates are in these files.

Parent mapping uses an eligible city in the same country, at least as populous
as the section where available, with a 100 km bound. Moscow (RU.48) and Saint
Petersburg (RU.66) city-regions map their sections directly to the corresponding
source city record. Independent settlements remain independent. This is a city
lookup heuristic, not a global administrative-boundary/polygon service.

Rebuild: `node scripts/build-city-locations.cjs <cities15000.txt> <RU-alternates.txt>`.
The script preserves Russian alternate names and the source snapshot's names.

The backend finds the nearest eligible city or internally mapped section within
100 km and always returns the canonical city. This is an
approximate city lookup, not an exact address or timezone-boundary service.
For sparse areas/ocean or invalid results, the UI retains Moscow/Europe/Moscow.
The dataset is bundled server-side only; no external geocoder request or API key
is needed. Refresh the snapshot when maintaining the site's location data.
