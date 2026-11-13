"use client";
import { typography } from "@/app/lib/typography";

import { ui, contacts } from "@/content/patron/ui";
import { lead } from "@/content/patron/lead";

import { LightField } from "./LightField";
import { type CSSProperties } from "react";
import { PatronMark } from "./PatronMark";

import { usePatron } from "./PatronProvider";
import { BriefForm } from "./BriefForm";

export function BriefDialog() {
  const v = usePatron();
  return (
    <div
      className={"fsm " + v.bfCls}
      aria-hidden={v.bfHidden}
      style={{ "--ox": v.bfOx, "--oy": v.bfOy } as CSSProperties}
    >
      <div className={"fbg"} aria-hidden={"true"}>
        <LightField
          variant="d1"
          style={
            {
              left: "-18%",
              bottom: "-30%",
              width: "70%",
              height: "100%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.9), rgba(0,25,72,0.4) 60%, transparent)",
              filter: "blur(60px)",
            } as CSSProperties
          }
        />
        <LightField
          variant="d2"
          style={
            {
              right: "-10%",
              top: "-20%",
              width: "55%",
              height: "80%",
              background:
                "radial-gradient(closest-side, rgba(161,186,228,0.22), rgba(124,118,214,0.1) 55%, transparent)",
              filter: "blur(60px)",
            } as CSSProperties
          }
        />
        <div
          className={"beam d3"}
          style={
            {
              left: "-10%",
              top: "62%",
              width: "130%",
              height: "18%",
              background:
                "linear-gradient(90deg, transparent, rgba(161,186,228,0.12) 40%, rgba(220,232,255,0.2) 55%, transparent)",
              filter: "blur(46px)",
            } as CSSProperties
          }
        ></div>
        <div className={"grain"}></div>
      </div>
      <div
        className={"fbody"}
        role={"dialog"}
        aria-modal={"true"}
        aria-labelledby={"bftitle"}
        tabIndex={-1}
        id={"brief-dialog"}
        onKeyDown={v.bfKey}
      >
        <div
          className={"wrap"}
          style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              height: "68px",
              flex: "none",
            } as CSSProperties
          }
        >
          <span
            style={
              {
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                fontFamily: "'Patron Bartle', sans-serif",
                fontSize: "17px",
              } as CSSProperties
            }
          >
            <PatronMark />
            {typography(ui.logo)}
          </span>
          <button
            className={"glass"}
            onClick={v.closeBrief}
            tabIndex={Number(v.bfTab)}
            style={
              {
                minHeight: "44px",
                paddingRight: "18px",
                fontSize: "14px",
              } as CSSProperties
            }
          >
            <i
              aria-hidden={"true"}
              style={{ width: "32px", height: "32px" } as CSSProperties}
            >
              {typography(ui.closeSymbol)}
            </i>
            {typography(ui.close)}
          </button>
        </div>
        <div
          className={"wrap fscroll"}
          style={
            {
              flex: "1",
              display: "flex",
              alignItems: "center",
              paddingTop: "24px",
              paddingBottom: "40px",
            } as CSSProperties
          }
        >
          <div
            className={"g12"}
            style={{ width: "100%", alignItems: "center" } as CSSProperties}
          >
            <div
              className={"fin"}
              style={{ gridColumn: "1 / span 5" } as CSSProperties}
            >
              <span
                className={"lbl"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(lead.label)}
              </span>
              <h2
                id={"bftitle"}
                className={"h2"}
                style={
                  {
                    marginTop: "18px",
                    fontSize: "64px",
                    fontWeight: "600",
                    lineHeight: "1",
                    letterSpacing: "-0.05em",
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
              <ol
                className={"hidesm"}
                style={
                  {
                    marginTop: "32px",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  } as CSSProperties
                }
              >
                <li
                  style={
                    {
                      display: "flex",
                      gap: "16px",
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "15px",
                    } as CSSProperties
                  }
                >
                  <span
                    className={"lbl num"}
                    style={
                      { paddingTop: "2px", color: "#A1BAE4" } as CSSProperties
                    }
                  >
                    {typography(lead.responseNumber)}
                  </span>
                  <span>
                    <b style={{ fontWeight: "600" } as CSSProperties}>
                      {typography(lead.responseTitle)}
                    </b>
                    {typography(" ")}
                    <span
                      style={
                        { color: "rgba(255,255,255,0.62)" } as CSSProperties
                      }
                    >
                      {typography(lead.responseDescription)}
                    </span>
                  </span>
                </li>
                <li
                  style={
                    {
                      display: "flex",
                      gap: "16px",
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "15px",
                    } as CSSProperties
                  }
                >
                  <span
                    className={"lbl num"}
                    style={
                      { paddingTop: "2px", color: "#A1BAE4" } as CSSProperties
                    }
                  >
                    {typography(lead.callNumber)}
                  </span>
                  <span>
                    <b style={{ fontWeight: "600" } as CSSProperties}>
                      {typography(lead.callTitle)}
                    </b>
                    {typography(" ")}
                    <span
                      style={
                        { color: "rgba(255,255,255,0.62)" } as CSSProperties
                      }
                    >
                      {typography(lead.callDescription)}
                    </span>
                  </span>
                </li>
                <li
                  style={
                    {
                      display: "flex",
                      gap: "16px",
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "15px",
                    } as CSSProperties
                  }
                >
                  <span
                    className={"lbl num"}
                    style={
                      { paddingTop: "2px", color: "#A1BAE4" } as CSSProperties
                    }
                  >
                    {typography(lead.proposalNumber)}
                  </span>
                  <span>
                    <b style={{ fontWeight: "600" } as CSSProperties}>
                      {typography(lead.proposalTitle)}
                    </b>
                    {typography(" ")}
                    <span
                      style={
                        { color: "rgba(255,255,255,0.62)" } as CSSProperties
                      }
                    >
                      {typography(lead.proposalDescription)}
                    </span>
                  </span>
                </li>
              </ol>
              <div
                className={"hidem"}
                style={
                  {
                    marginTop: "24px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 24px",
                    fontSize: "15px",
                  } as CSSProperties
                }
              >
                <a
                  className={"ln"}
                  href={"mailto:" + contacts.email}
                  tabIndex={Number(v.bfTab)}
                >
                  {typography(contacts.email)}
                </a>
                <a
                  className={"ln"}
                  href={contacts.telegramUrl}
                  tabIndex={Number(v.bfTab)}
                >
                  {typography(ui.telegramLabel)}
                </a>
              </div>
            </div>
            <div
              className={"fin"}
              style={{ gridColumn: "7 / span 6" } as CSSProperties}
            >
              <BriefForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
