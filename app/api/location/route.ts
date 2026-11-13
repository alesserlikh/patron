import {
  resolveLocation,
  normalizeSavedLocation,
} from "@/app/lib/visitor-location";
import { defaultLocation } from "@/content/patron/visitor";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  // No coordinate-bearing query string, third-party request, persistence or logging.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "origin" }, { status: 403, headers });
  }
  if (Number(request.headers.get("content-length")) > 2048)
    return Response.json({ error: "size" }, { status: 413, headers });
  let data: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048)
      return Response.json({ error: "size" }, { status: 413, headers });
    data = JSON.parse(text);
  } catch {
    return Response.json({ error: "json" }, { status: 400, headers });
  }
  if (!data || typeof data !== "object")
    return Response.json({ error: "coordinates" }, { status: 422, headers });
  const { latitude, longitude, consent } = data as Record<string, unknown>;
  if (consent !== true)
    return Response.json({ error: "consent" }, { status: 403, headers });
  if ("action" in data && data.action === "normalize") {
    const saved = (data as Record<string, unknown>).location;
    if (!saved || typeof saved !== "object")
      return Response.json({ error: "location" }, { status: 422, headers });
    const value = saved as Record<string, unknown>;
    if (
      typeof value.city !== "string" ||
      !value.city.trim() ||
      value.city.length > 100 ||
      typeof value.timeZone !== "string" ||
      value.timeZone.length > 80 ||
      typeof value.country !== "string" ||
      !/^[A-Z]{2}$/.test(value.country)
    ) {
      return Response.json({ error: "location" }, { status: 422, headers });
    }
    const location = normalizeSavedLocation({
      city: value.city,
      timeZone: value.timeZone,
      country: value.country,
    });
    return Response.json(
      { location: location ?? defaultLocation, resolved: !!location },
      { headers },
    );
  }
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return Response.json({ error: "coordinates" }, { status: 422, headers });
  }
  const location = resolveLocation(latitude, longitude);
  return Response.json(
    { location: location ?? defaultLocation, resolved: !!location },
    { headers },
  );
}
