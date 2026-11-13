import { typography } from "@/app/lib/typography";
import { ui, contacts, sectionLabels } from "@/content/patron/ui";
import { ContactPhone } from "./ContactPhone";
import { VisitorSettings } from "./VisitorSettings";
import { LegalLink } from "./LegalLink";

import { LightField } from "./LightField";
import { type CSSProperties } from "react";

export function PatronFooter() {
  return (
    <footer
      id={"legal"}
      className={"snapEnd"}
      style={
        {
          position: "relative",
          zIndex: "2",
          background: "#000",
          paddingTop: "72px",
          overflow: "hidden",
          isolation: "isolate",
        } as CSSProperties
      }
    >
      <div
        aria-hidden={"true"}
        style={
          {
            position: "absolute",
            inset: "0",
            zIndex: "-1",
            overflow: "hidden",
          } as CSSProperties
        }
      >
        <LightField
          variant="d2"
          style={
            {
              left: "20%",
              bottom: "-50%",
              width: "66%",
              height: "100%",
              background:
                "radial-gradient(closest-side, rgba(161,186,228,0.3), rgba(0,55,94,0.55) 45%, rgba(0,25,72,0.25) 70%, transparent)",
              filter: "blur(70px)",
            } as CSSProperties
          }
        />
        <div className={"grain"}></div>
      </div>
      <div
        className={"wrap g12 fgrid"}
        style={
          {
            fontSize: "15px",
            lineHeight: "1.7",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "28px",
          } as CSSProperties
        }
      >
        <div
          style={
            {
              gridColumn: "1 / span 4",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            } as CSSProperties
          }
        >
          <span
            className={"lbl"}
            style={
              {
                marginBottom: "8px",
                color: "rgba(255,255,255,0.55)",
              } as CSSProperties
            }
          >
            {typography(ui.contactHeading)}
          </span>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={"mailto:" + contacts.email}
          >
            {typography(contacts.email)}
          </a>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={contacts.telegramUrl}
          >
            {typography(ui.telegramLabel)}
          </a>
          <ContactPhone
            className={"ln num"}
            style={{ minHeight: "30px" } as CSSProperties}
          />
        </div>
        <nav
          aria-label={ui.sectionsHeading}
          style={
            {
              gridColumn: "5 / span 3",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            } as CSSProperties
          }
        >
          <span
            className={"lbl"}
            style={
              {
                marginBottom: "8px",
                color: "rgba(255,255,255,0.55)",
              } as CSSProperties
            }
          >
            {typography(ui.sectionsHeading)}
          </span>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={"#agency"}
          >
            {typography(sectionLabels.agency)}
          </a>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={"#services"}
          >
            {typography(sectionLabels.services)}
          </a>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={"#cases"}
          >
            {typography(sectionLabels.cases)}
          </a>
          <a
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
            href={"#process"}
          >
            {typography(sectionLabels.process)}
          </a>
        </nav>
        <div
          style={
            {
              gridColumn: "8 / span 3",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            } as CSSProperties
          }
        >
          <span
            className={"lbl"}
            style={
              {
                marginBottom: "8px",
                color: "rgba(255,255,255,0.55)",
              } as CSSProperties
            }
          >
            {typography(ui.documentsHeading)}
          </span>
          <LegalLink
            document="privacy"
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
          >
            {typography(ui.privacy)}
          </LegalLink>
          <LegalLink
            document="consent"
            className={"ln"}
            style={{ minHeight: "30px" } as CSSProperties}
          >
            {typography(ui.consent)}
          </LegalLink>
        </div>
        <div
          className={"fup"}
          style={
            {
              gridColumn: "11 / span 2",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            } as CSSProperties
          }
        >
          <a className={"rnd"} href={"#top"} aria-label={ui.backToTop}>
            {typography(ui.upArrow)}
          </a>
        </div>
      </div>
      <div
        className={"wrap fword"}
        style={{ marginTop: "72px" } as CSSProperties}
      >
        <div className={"word"} role={"img"} aria-label={ui.brand}>
          {typography(ui.brand)}
        </div>
      </div>
      <div
        className={"wrap lbl"}
        style={
          {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "12px",
            paddingTop: "22px",
            paddingBottom: "26px",
            color: "rgba(255,255,255,0.55)",
          } as CSSProperties
        }
      >
        <span>{typography(ui.copyright)}</span>
        <span>{typography(ui.tagline)}</span>
        <VisitorSettings />
      </div>
    </footer>
  );
}
