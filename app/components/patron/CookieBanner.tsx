"use client";
import { typography } from "@/app/lib/typography";

import { useEffect, useRef } from "react";
import { usePatron } from "./PatronProvider";
import { visitorCopy as text } from "@/content/patron/visitor";

export function CookieBanner() {
  const v = usePatron();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const banner = ref.current;
    if (!banner) return;
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--patron-cookie-space");
    const measure = () =>
      root.style.setProperty(
        "--patron-cookie-space",
        `${Math.ceil(banner.getBoundingClientRect().height) + 24}px`,
      );
    root.classList.add("patron-cookies-visible");
    const observer = new ResizeObserver(measure);
    observer.observe(banner);
    measure();
    return () => {
      observer.disconnect();
      root.classList.remove("patron-cookies-visible");
      if (previous) root.style.setProperty("--patron-cookie-space", previous);
      else root.style.removeProperty("--patron-cookie-space");
    };
  }, []);
  return (
    <aside
      ref={ref}
      className={`cookie-banner ${v.bfCls}`}
      role="region"
      aria-label={text.cookiesLabel}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          v.close();
        }
      }}
    >
      <div className="cookie-banner-copy">
        <span className="lbl">{typography(text.cookiesLabel)}</span>
        <p className="cookie-banner-lead">{typography(text.cookiesLead)}</p>
        <p className="cookie-banner-detail">{typography(text.cookiesDetail)}</p>
      </div>
      <div className="cookie-banner-actions">
        <button
          className="cta"
          type="button"
          onClick={() => v.chooseCookies(true)}
        >
          {typography(text.cookiesAllow)}
          <i aria-hidden="true">↗</i>
        </button>
        <button
          className="glass"
          type="button"
          onClick={() => v.chooseCookies(false)}
        >
          {typography(text.cookiesNecessary)}
        </button>
      </div>
      <button
        className="rnd cookie-banner-close"
        type="button"
        onClick={v.close}
        aria-label={text.cookiesDismiss}
      >
        ✕
      </button>
    </aside>
  );
}
