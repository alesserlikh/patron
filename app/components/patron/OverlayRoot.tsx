"use client";

import { createPortal } from "react-dom";
import { usePatron } from "./PatronProvider";
import { BriefDialog } from "./BriefDialog";
import { CaseDialog } from "./CaseDialog";
import { PhaseDialog } from "./PhaseDialog";
import { MobileMenu } from "./MobileMenu";
import { VisitorDialog } from "./VisitorDialog";
import { CookieBanner } from "./CookieBanner";

export function OverlayRoot() {
  const v = usePatron();
  if (!v.overlay || typeof document === "undefined") return null;
  return createPortal(
    <div
      className={`pt patron-overlay${v.overlay.type === "cookies" ? " cookie-banner-layer" : ""}`}
      data-overlay-root
      tabIndex={-1}
    >
      {v.overlay.type === "brief" && <BriefDialog />}
      {v.overlay.type === "case" && <CaseDialog />}
      {v.overlay.type === "phase" && <PhaseDialog />}
      {v.overlay.type === "menu" && <MobileMenu />}
      {v.overlay.type === "cookies" && <CookieBanner />}
      {v.overlay.type === "location" && <VisitorDialog />}
    </div>,
    document.body,
  );
}
