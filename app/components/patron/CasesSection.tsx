"use client";
import { typography } from "@/app/lib/typography";

import { ui, sectionLabels } from "@/content/patron/ui";
import { casesCopy } from "@/content/patron/cases";

import { LightField } from "./LightField";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function CasesSection() {
  const v = usePatron();
  return (
    <section id={"cases"} data-sec={"cases"} className={"scr"}>
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
            {typography(casesCopy.number)}
          </span>
          <span>{typography(sectionLabels.cases)}</span>
          <span
            className={"hair"}
            style={{ flex: "1" } as CSSProperties}
          ></span>
        </div>
        <div
          className={"fx"}
          style={
            {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "20px",
              marginTop: "24px",
            } as CSSProperties
          }
        >
          <h2
            className={"huge"}
            style={
              {
                fontSize: "96px",
                fontWeight: "700",
                lineHeight: "0.86",
                letterSpacing: "-0.065em",
              } as CSSProperties
            }
          >
            {typography(casesCopy.projectsLabel)}
          </h2>
          <div
            style={
              {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              } as CSSProperties
            }
          >
            <span
              aria-live={"polite"}
              className={"num"}
              style={
                {
                  marginRight: "14px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.66)",
                } as CSSProperties
              }
            >
              <span style={{ color: "#ffffff" } as CSSProperties}>
                {typography(v.caseNum)}
              </span>
              {typography(ui.counterSeparator + v.caseTotal)}
            </span>
            <button
              className={"rnd"}
              onClick={v.prevCase}
              aria-label={casesCopy.previous}
            >
              {typography(ui.backArrow)}
            </button>
            <button
              className={"rnd"}
              onClick={v.nextCase}
              aria-label={casesCopy.next}
            >
              {typography(ui.arrow)}
            </button>
          </div>
        </div>
        <div
          className={"stk"}
          onTouchStart={v.tStart}
          onTouchEnd={v.tEnd}
          style={{ marginTop: "24px" } as CSSProperties}
        >
          {v.cases.map((c, index) => (
            <Fragment key={index}>
              <figure
                className={"cmedia " + c.cls}
                inert={c.cls !== "on"}
                aria-hidden={c.cls !== "on"}
              >
                <div className={"lay"} aria-hidden={"true"}>
                  <LightField
                    variant="d1"
                    style={
                      {
                        left: c.l1,
                        top: c.t1,
                        width: "70%",
                        height: "110%",
                        background:
                          "radial-gradient(closest-side, rgba(161,186,228,0.5), rgba(0,55,94,0.55) 50%, transparent)",
                        filter: "blur(60px)",
                      } as CSSProperties
                    }
                  />
                  <LightField
                    variant="d2"
                    style={
                      {
                        left: c.l2,
                        top: c.t2,
                        width: "50%",
                        height: "80%",
                        background:
                          "radial-gradient(closest-side, rgba(124,118,214,0.32), transparent)",
                        filter: "blur(70px)",
                      } as CSSProperties
                    }
                  />
                  <div
                    className={"beam d3"}
                    style={
                      {
                        left: "-20%",
                        top: "56%",
                        width: "150%",
                        height: "16%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(220,232,255,0.26) 50%, transparent)",
                        filter: "blur(34px)",
                      } as CSSProperties
                    }
                  ></div>
                  <div className={"grain"}></div>
                </div>
                <div
                  className={"cin"}
                  style={
                    {
                      position: "absolute",
                      inset: "0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "24px 28px 28px",
                    } as CSSProperties
                  }
                >
                  <div
                    className={"lbl num"}
                    style={
                      {
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "8px 16px",
                        color: "rgba(255,255,255,0.82)",
                      } as CSSProperties
                    }
                  >
                    <span>
                      {typography(
                        c.client +
                          ui.metaSeparator +
                          c.place +
                          ui.metaSeparator +
                          c.year,
                      )}
                    </span>
                    <span
                      className={"hidesm"}
                      style={
                        { color: "rgba(255,255,255,0.55)" } as CSSProperties
                      }
                    >
                      {typography(casesCopy.posterPlaceholder)}
                    </span>
                  </div>
                  <div
                    style={
                      {
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "20px",
                      } as CSSProperties
                    }
                  >
                    <div>
                      <span
                        className={"huge num"}
                        style={
                          {
                            display: "block",
                            fontSize: "120px",
                            fontWeight: "600",
                            lineHeight: "0.85",
                            letterSpacing: "-0.065em",
                          } as CSSProperties
                        }
                      >
                        {typography(c.big)}
                      </span>
                      <span
                        className={"clab"}
                        style={
                          {
                            display: "block",
                            marginTop: "12px",
                            fontSize: "18px",
                            color: "rgba(255,255,255,0.88)",
                          } as CSSProperties
                        }
                      >
                        {typography(c.title + ui.titleSeparator + c.bigLabel)}
                      </span>
                    </div>
                    <div
                      className={"cbtns"}
                      style={
                        {
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        } as CSSProperties
                      }
                    >
                      <button
                        className={"glass"}
                        aria-label={c.playLabel}
                        disabled
                        title={casesCopy.videoUnavailable}
                      >
                        <i aria-hidden={"true"}>{typography(ui.playSymbol)}</i>
                        {typography(casesCopy.video)}
                        <span
                          className={"num"}
                          style={
                            { color: "rgba(255,255,255,0.6)" } as CSSProperties
                          }
                        >
                          {typography(c.dur)}
                        </span>
                      </button>
                      <button
                        className={"cta"}
                        onClick={c.open}
                        aria-haspopup={"dialog"}
                      >
                        {typography(casesCopy.details)}
                        <i aria-hidden={"true"}>
                          {typography(ui.diagonalArrow)}
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
              </figure>
            </Fragment>
          ))}
        </div>
        <div
          role={"group"}
          className={"segs"}
          aria-label={casesCopy.selectionLabel}
          style={
            { display: "flex", gap: "20px", marginTop: "20px" } as CSSProperties
          }
        >
          {v.cases.map((c, index) => (
            <Fragment key={index}>
              <button
                className={"seg " + c.cls}
                aria-pressed={c.sel}
                onClick={c.pick}
              >
                <span className={"bar"}>
                  <i></i>
                </span>
                <span
                  className={"t"}
                  style={
                    {
                      display: "flex",
                      gap: "12px",
                      alignItems: "baseline",
                    } as CSSProperties
                  }
                >
                  <span
                    className={"lbl num"}
                    style={{ color: "#A1BAE4" } as CSSProperties}
                  >
                    {typography(c.num)}
                  </span>
                  <span
                    className={"segt"}
                    style={
                      { fontSize: "16px", fontWeight: "500" } as CSSProperties
                    }
                  >
                    {typography(c.title)}
                  </span>
                  <span
                    className={"num hidesm"}
                    style={
                      {
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.6)",
                      } as CSSProperties
                    }
                  >
                    {typography(c.year)}
                  </span>
                </span>
              </button>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
