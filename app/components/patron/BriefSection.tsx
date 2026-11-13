import { typography } from "@/app/lib/typography";
import { ui, contacts } from "@/content/patron/ui";
import { lead } from "@/content/patron/lead";
import { ContactPhone } from "./ContactPhone";

import { LightField } from "./LightField";
import { type CSSProperties } from "react";

import { BriefForm } from "./BriefForm";

export function BriefSection() {
  return (
    <section
      id={"brief"}
      data-sec={"brief"}
      className={"scr scrBrief"}
      style={{ isolation: "isolate" } as CSSProperties}
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
          variant="d1"
          style={
            {
              right: "-10%",
              top: "0%",
              width: "60%",
              height: "90%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.8), rgba(0,25,72,0.35) 60%, transparent)",
              filter: "blur(60px)",
            } as CSSProperties
          }
        />
        <LightField
          variant="d2"
          style={
            {
              right: "14%",
              top: "30%",
              width: "30%",
              height: "40%",
              background:
                "radial-gradient(closest-side, rgba(161,186,228,0.2), transparent)",
              filter: "blur(50px)",
            } as CSSProperties
          }
        />
      </div>
      <div className={"wrap"}>
        <div
          className={"lbl num"}
          style={
            {
              display: "flex",
              alignItems: "center",
              gap: "20px",
              color: "rgba(255,255,255,0.66)",
            } as CSSProperties
          }
        >
          <span style={{ color: "#A1BAE4" } as CSSProperties}>
            {typography(lead.number)}
          </span>
          <span>{typography(lead.label)}</span>
          <span
            className={"hair"}
            style={{ flex: "1" } as CSSProperties}
          ></span>
        </div>
        <div
          className={"g12"}
          style={{ marginTop: "36px", alignItems: "center" } as CSSProperties}
        >
          <div
            className={"fx"}
            style={{ gridColumn: "1 / span 5" } as CSSProperties}
          >
            <h2
              className={"h2"}
              style={
                {
                  fontSize: "54px",
                  fontWeight: "600",
                  lineHeight: "1",
                  letterSpacing: "-0.045em",
                } as CSSProperties
              }
            >
              {typography(lead.title)}
            </h2>
            <p
              className={"bp"}
              style={
                {
                  marginTop: "18px",
                  maxWidth: "40ch",
                  fontSize: "17px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.78)",
                } as CSSProperties
              }
            >
              {typography(lead.description)}
            </p>
            <div
              className={"hidem"}
              style={
                {
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  fontSize: "15px",
                } as CSSProperties
              }
            >
              <a
                className={"ln"}
                href={"mailto:" + contacts.email}
                style={{ minHeight: "34px" } as CSSProperties}
              >
                {typography(contacts.email)}
              </a>
              <a
                className={"ln"}
                href={contacts.telegramUrl}
                style={{ minHeight: "34px" } as CSSProperties}
              >
                {typography(ui.telegramLabel)}
              </a>
              <ContactPhone
                className={"ln num"}
                style={{ minHeight: "34px" } as CSSProperties}
              />
            </div>
          </div>
          <div
            className={"fx"}
            style={{ gridColumn: "7 / span 6" } as CSSProperties}
          >
            <BriefForm />
          </div>
        </div>
      </div>
    </section>
  );
}
