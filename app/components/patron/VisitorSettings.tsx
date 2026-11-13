"use client";
import { typography } from "@/app/lib/typography";

import { usePatron } from "./PatronProvider";
import { visitorCopy as text } from "@/content/patron/visitor";

export function VisitorSettings() {
  const v = usePatron();
  return (
    <div className="visitor-settings">
      <button
        className="ln"
        type="button"
        onClick={v.openLocation}
        aria-haspopup="dialog"
      >
        {typography(v.visitorLocation.city)}
        <span className="visitor-time">{typography(v.clock)}</span>
      </button>
      <button
        className="ln"
        type="button"
        onClick={v.openCookies}
        aria-haspopup="dialog"
      >
        {typography(text.settings)}
      </button>
    </div>
  );
}
