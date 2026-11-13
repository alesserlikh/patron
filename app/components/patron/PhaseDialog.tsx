"use client";
import { typography } from "@/app/lib/typography";

import { ui } from "@/content/patron/ui";
import { processCopy } from "@/content/patron/process";

import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function PhaseDialog() {
  const v = usePatron();
  return (
    <div className={"modal " + v.phModalCls} aria-hidden={v.phModalHidden}>
      <div className={"veil"} onClick={v.closePhase}></div>
      <div
        className={"sheet"}
        role={"dialog"}
        aria-modal={"true"}
        aria-labelledby={"ptitle"}
        tabIndex={-1}
        id={"phase-dialog"}
        onKeyDown={v.phaseKey}
        style={{ width: "min(860px, 100%)" } as CSSProperties}
      >
        <div
          style={
            {
              padding: "26px 28px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
            } as CSSProperties
          }
        >
          <div>
            <span
              className={"lbl num"}
              style={{ color: "#A1BAE4" } as CSSProperties}
            >
              {typography(
                processCopy.phasePrefix + v.ph.n + ui.metaSeparator + v.ph.time,
              )}
            </span>
            <h3
              id={"ptitle"}
              className={"ctitle"}
              style={
                {
                  marginTop: "14px",
                  fontSize: "52px",
                  fontWeight: "700",
                  lineHeight: "0.95",
                  letterSpacing: "-0.05em",
                } as CSSProperties
              }
            >
              {typography(v.ph.title)}
            </h3>
            <p
              style={
                {
                  marginTop: "14px",
                  maxWidth: "52ch",
                  fontSize: "17px",
                  lineHeight: "1.5",
                  color: "rgba(255,255,255,0.82)",
                } as CSSProperties
              }
            >
              {typography(v.ph.goal)}
            </p>
          </div>
          <button
            className={"rnd"}
            onClick={v.closePhase}
            aria-label={ui.close}
            tabIndex={Number(v.phModalTab)}
            style={
              { flex: "none", width: "44px", height: "44px" } as CSSProperties
            }
          >
            {typography(ui.closeSymbol)}
          </button>
        </div>
        <div
          className={"g12"}
          style={{ padding: "28px", rowGap: "26px" } as CSSProperties}
        >
          <div style={{ gridColumn: "1 / span 7" } as CSSProperties}>
            <p
              className={"lbl"}
              style={{ color: "rgba(255,255,255,0.6)" } as CSSProperties}
            >
              {typography(processCopy.itemsLabel)}
            </p>
            <ul
              style={
                {
                  marginTop: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                } as CSSProperties
              }
            >
              {v.ph.items.map((it, index) => (
                <Fragment key={index}>
                  <li className={"tick2"}>{typography(it)}</li>
                </Fragment>
              ))}
            </ul>
          </div>
          <div
            style={
              {
                gridColumn: "8 / span 5",
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              } as CSSProperties
            }
          >
            <div>
              <p
                className={"lbl"}
                style={{ color: "rgba(255,255,255,0.6)" } as CSSProperties}
              >
                {typography(processCopy.resultLabel)}
              </p>
              <p
                style={
                  {
                    marginTop: "10px",
                    fontSize: "15px",
                    lineHeight: "1.55",
                    color: "rgba(255,255,255,0.86)",
                  } as CSSProperties
                }
              >
                {typography(v.ph.result)}
              </p>
            </div>
            <div
              style={
                {
                  padding: "16px 18px",
                  borderRadius: "16px",
                  background: "rgba(161,186,228,0.08)",
                  border: "1px solid rgba(161,186,228,0.2)",
                } as CSSProperties
              }
            >
              <p
                className={"lbl"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(processCopy.communicationLabel)}
              </p>
              <p
                style={
                  {
                    marginTop: "8px",
                    fontSize: "14px",
                    lineHeight: "1.55",
                    color: "rgba(255,255,255,0.82)",
                  } as CSSProperties
                }
              >
                {typography(v.ph.sync)}
              </p>
            </div>
          </div>
          <div
            style={
              {
                gridColumn: "1 / -1",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              } as CSSProperties
            }
          >
            <div
              style={
                {
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                } as CSSProperties
              }
            >
              <button
                className={"rnd"}
                onClick={v.prevPhase}
                aria-label={processCopy.previous}
                tabIndex={Number(v.phModalTab)}
                style={{ width: "44px", height: "44px" } as CSSProperties}
              >
                {typography(ui.backArrow)}
              </button>
              <button
                className={"rnd"}
                onClick={v.nextPhase}
                aria-label={processCopy.next}
                tabIndex={Number(v.phModalTab)}
                style={{ width: "44px", height: "44px" } as CSSProperties}
              >
                {typography(ui.arrow)}
              </button>
              <span
                className={"lbl num"}
                style={
                  {
                    marginLeft: "6px",
                    color: "rgba(255,255,255,0.6)",
                  } as CSSProperties
                }
              >
                {typography(v.phPos)}
              </span>
            </div>
            <button
              className={"cta"}
              onClick={v.phaseToBrief}
              tabIndex={Number(v.phModalTab)}
            >
              {typography(ui.discussProjectSpaced)}
              <i aria-hidden={"true"}>{typography(ui.diagonalArrow)}</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
