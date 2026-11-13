"use client";
import { typography } from "@/app/lib/typography";

import { usePatron } from "./PatronProvider";
import { visitorCopy as text } from "@/content/patron/visitor";
import { LightField } from "./LightField";

export function VisitorDialog() {
  const v = usePatron();
  const status = v.locationStatus;
  const error =
    status === "denied"
      ? text.denied
      : status === "timeout"
        ? text.timeout
        : status === "unsupported"
          ? text.unsupported
          : status === "error"
            ? text.unavailable
            : "";
  return (
    <div className={`modal visitor-modal ${v.bfCls}`}>
      <div className="veil" onClick={v.close} aria-hidden="true" />
      <section
        className="sheet visitor-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visitor-title"
        aria-describedby="visitor-description"
        tabIndex={-1}
      >
        <LightField
          variant="d2"
          style={{
            right: "-30%",
            top: "-35%",
            width: "110%",
            height: "100%",
            filter: "blur(60px)",
            background:
              "radial-gradient(closest-side,rgba(161,186,228,.22),transparent)",
          }}
        />
        <div className="visitor-dialog-top">
          <span className="lbl">{typography(text.settings)}</span>
          <button
            type="button"
            className="rnd"
            aria-label={text.close}
            onClick={v.close}
          >
            ✕
          </button>
        </div>
        <h2 id="visitor-title">{typography(text.locationTitle)}</h2>
        <p id="visitor-description">{typography(text.locationLead)}</p>
        <p className="visitor-detail">{typography(text.locationPrivacy)}</p>
        <div className="visitor-current">
          <span className="lbl">{typography(text.currentCity)}</span>
          <strong>{typography(v.visitorLocation.city)}</strong>
          <time>{typography(v.clock)}</time>
        </div>
        <p
          role={error ? "alert" : "status"}
          className={error ? "visitor-error" : "visitor-detail"}
          aria-live="polite"
        >
          {typography(
            error ||
              (status === "found"
                ? text.found
                : status === "loading"
                  ? text.locating
                  : text.locationFallback),
          )}
        </p>

        <div className="visitor-actions">
          {status !== "found" && (
            <button
              type="button"
              className="cta"
              disabled={status === "loading"}
              onClick={v.locate}
            >
              {typography(
                status === "loading"
                  ? text.locating
                  : error
                    ? text.retry
                    : text.locate,
              )}
              <i aria-hidden="true">
                {status === "loading" ? <span className="spin" /> : "↗"}
              </i>
            </button>
          )}
          <button
            type="button"
            className="glass"
            onClick={v.useDefaultLocation}
          >
            {typography(text.useMoscow)}
          </button>
          {status === "found" && (
            <button type="button" className="cta" onClick={v.close}>
              {typography(text.close)}
              <i aria-hidden="true">↗</i>
            </button>
          )}
        </div>
        <p className="visitor-footnote">
          {
            <a
              href="https://www.geonames.org/"
              target="_blank"
              rel="noreferrer"
            >
              {typography(text.attribution)}
            </a>
          }
        </p>
      </section>
    </div>
  );
}
