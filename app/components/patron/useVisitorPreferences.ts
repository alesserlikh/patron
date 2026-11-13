"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  defaultLocation,
  locationCityVersion,
  type VisitorLocation,
} from "@/content/patron/visitor";

type CookieChoice = "essential" | "functional" | null;
type LocationStatus =
  | "unknown"
  | "idle"
  | "loading"
  | "found"
  | "denied"
  | "error"
  | "timeout"
  | "unsupported";
const choiceKey = "patron_cookie_choice";
const locationKey = "patron_location";
const sessionKey = "patron_geo_decision";
function readCookie(key: string) {
  try {
    return decodeURIComponent(
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(key + "="))
        ?.slice(key.length + 1) || "",
    );
  } catch {
    return "";
  }
}
function writeCookie(key: string, value: string, days: number) {
  try {
    document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${days * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  } catch {}
}
function rememberDecision() {
  try {
    sessionStorage.setItem(sessionKey, "decided");
  } catch {}
}
function storeLocation(value: VisitorLocation) {
  writeCookie(
    locationKey,
    JSON.stringify({
      city: value.city,
      country: value.country,
      timeZone: value.timeZone,
      cityVersion: locationCityVersion,
    }),
    30,
  );
}
function validLocation(value: unknown): value is VisitorLocation {
  if (!value || typeof value !== "object") return false;
  const v = value as VisitorLocation;
  if (
    typeof v.city !== "string" ||
    !v.city.trim() ||
    v.city.length > 100 ||
    typeof v.country !== "string" ||
    !/^[A-Z]{2}$/.test(v.country) ||
    typeof v.timeZone !== "string" ||
    v.timeZone.length > 80
  )
    return false;
  try {
    new Intl.DateTimeFormat("ru-RU", { timeZone: v.timeZone });
    return true;
  } catch {
    return false;
  }
}

export function useVisitorPreferences(
  activeOverlay: string | null,
  open: (type: "cookies" | "location") => void,
  close: () => void,
) {
  const [hydrated, setHydrated] = useState(false);
  const [cookieChoice, setCookieChoice] = useState<CookieChoice>(null);
  const [visitorLocation, setVisitorLocation] =
    useState<VisitorLocation>(defaultLocation);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("unknown");
  const request = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const cancelRequest = useCallback(() => {
    request.current++;
    abort.current?.abort();
  }, []);
  const show = useEffectEvent(open);
  useEffect(() => {
    let active = true;
    const migration = new AbortController();
    const timer = setTimeout(async () => {
      const generation = request.current;
      const choice = readCookie(choiceKey);
      const functional = choice === "functional";
      setCookieChoice(
        functional ? "functional" : choice === "essential" ? "essential" : null,
      );
      let restored = false;
      if (functional) {
        try {
          const saved: unknown = JSON.parse(readCookie(locationKey));
          if (validLocation(saved)) {
            let normalized: VisitorLocation | null = null;
            if (
              (saved as VisitorLocation & { cityVersion?: number })
                .cityVersion === locationCityVersion
            ) {
              normalized = {
                city: saved.city,
                country: saved.country,
                timeZone: saved.timeZone,
              };
            } else {
              // Old cookies may contain a district. Normalize the stored name
              // without obtaining or sending any new browser coordinates.
              let denied = false;
              try {
                denied =
                  (await navigator.permissions?.query({ name: "geolocation" }))
                    ?.state === "denied";
              } catch {}
              if (!active) return;
              if (denied) {
                writeCookie(locationKey, "", 0);
                setLocationStatus("denied");
                rememberDecision();
                setHydrated(true);
                return;
              }
              const timeout = setTimeout(() => migration.abort(), 8000);
              try {
                const response = await fetch("/api/location", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  signal: migration.signal,
                  body: JSON.stringify({
                    action: "normalize",
                    consent: true,
                    location: {
                      city: saved.city,
                      country: saved.country,
                      timeZone: saved.timeZone,
                    },
                  }),
                });
                const result: { location?: unknown; resolved?: boolean } =
                  await response.json();
                if (
                  response.ok &&
                  result.resolved &&
                  validLocation(result.location)
                )
                  normalized = result.location;
              } finally {
                clearTimeout(timeout);
              }
            }
            if (!active) return;
            if (generation !== request.current) {
              setHydrated(true);
              return;
            }
            if (normalized) {
              setVisitorLocation(normalized);
              setLocationStatus("found");
              restored = true;
              storeLocation(normalized);
            } else {
              writeCookie(locationKey, "", 0);
            }
          }
        } catch {
          if (active && generation === request.current)
            writeCookie(locationKey, "", 0);
        }
      } else {
        writeCookie(locationKey, "", 0);
      }
      if (!active) return;
      if (generation !== request.current) {
        setHydrated(true);
        return;
      }
      try {
        if (!restored && sessionStorage.getItem(sessionKey))
          setLocationStatus("idle");
      } catch {}
      setHydrated(true);
    }, 0);
    return () => {
      active = false;
      migration.abort();
      clearTimeout(timer);
      cancelRequest();
    };
  }, [cancelRequest]);
  useEffect(() => {
    if (!hydrated || activeOverlay) return;
    const next =
      cookieChoice === null
        ? "cookies"
        : locationStatus === "unknown"
          ? "location"
          : null;
    if (!next) return;
    const timer = setTimeout(() => show(next), 1200);
    return () => clearTimeout(timer);
  }, [hydrated, activeOverlay, cookieChoice, locationStatus]);
  useEffect(() => {
    if (!hydrated) return;
    let permission: PermissionStatus | undefined;
    let cancelled = false;
    const update = () => {
      if (permission?.state === "denied") {
        request.current++;
        abort.current?.abort();
        setVisitorLocation(defaultLocation);
        setLocationStatus("denied");
        writeCookie(locationKey, "", 0);
        rememberDecision();
      }
    };
    if (navigator.permissions)
      navigator.permissions
        .query({ name: "geolocation" })
        .then((value) => {
          if (cancelled) return;
          permission = value;
          permission.addEventListener("change", update);
          update();
        })
        .catch(() => {});
    return () => {
      cancelled = true;
      permission?.removeEventListener("change", update);
    };
  }, [hydrated]);

  const chooseCookies = (functional: boolean) => {
    setCookieChoice(functional ? "functional" : "essential");
    writeCookie(choiceKey, functional ? "functional" : "essential", 365);
    if (!functional) writeCookie(locationKey, "", 0);
    else if (locationStatus === "found") storeLocation(visitorLocation);
    close();
  };
  const dismissLocation = (reset = false) => {
    if (!reset && locationStatus === "found") return;
    request.current++;
    abort.current?.abort();
    rememberDecision();
    setVisitorLocation(defaultLocation);
    setLocationStatus("idle");
    writeCookie(locationKey, "", 0);
  };
  const locate = () => {
    if (locationStatus === "loading") return;
    request.current++;
    const id = request.current;
    abort.current?.abort();
    setVisitorLocation(defaultLocation);
    writeCookie(locationKey, "", 0);
    rememberDecision();
    if (!navigator.geolocation || !window.isSecureContext) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (id !== request.current) return;
        const controller = new AbortController();
        abort.current = controller;
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              consent: true,
            }),
          });
          const result: { location?: unknown; resolved?: boolean } =
            await response.json();
          if (id !== request.current) return;
          if (
            !response.ok ||
            !result.resolved ||
            !validLocation(result.location)
          )
            throw new Error("location");
          setVisitorLocation(result.location);
          setLocationStatus("found");
          if (cookieChoice === "functional") storeLocation(result.location);
        } catch {
          if (id === request.current) {
            setVisitorLocation(defaultLocation);
            setLocationStatus("error");
          }
        } finally {
          clearTimeout(timeout);
        }
      },
      (error) => {
        if (id !== request.current) return;
        setVisitorLocation(defaultLocation);
        setLocationStatus(
          error.code === 1 ? "denied" : error.code === 3 ? "timeout" : "error",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };
  return {
    visitorLocation,
    locationStatus,
    cookieChoice,
    chooseCookies,
    dismissLocation,
    locate,
  };
}
