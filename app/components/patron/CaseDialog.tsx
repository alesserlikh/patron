"use client";
import { typography } from "@/app/lib/typography";

import { ui } from "@/content/patron/ui";
import { casesCopy } from "@/content/patron/cases";

import { LightField } from "./LightField";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function CaseDialog() {
  const v = usePatron();
  return (
    <div className={"modal " + v.caseModalCls} aria-hidden={v.caseModalHidden}>
      <div className={"veil"} onClick={v.closeModal}></div>
      <div
        className={"sheet"}
        role={"dialog"}
        aria-modal={"true"}
        aria-labelledby={"mtitle"}
        tabIndex={-1}
        id={"case-dialog"}
        onKeyDown={v.modalKey}
      >
        <div
          style={
            {
              position: "relative",
              height: "200px",
              overflow: "hidden",
              borderRadius: "28px 28px 0 0",
              isolation: "isolate",
            } as CSSProperties
          }
        >
          <LightField
            variant="d1"
            style={
              {
                left: v.m.l1,
                top: "-60%",
                width: "70%",
                height: "200%",
                background:
                  "radial-gradient(closest-side, rgba(161,186,228,0.5), rgba(0,55,94,0.6) 50%, transparent)",
                filter: "blur(50px)",
              } as CSSProperties
            }
          />
          <div className={"grain"} aria-hidden={"true"}></div>
          <div
            style={
              {
                position: "absolute",
                inset: "0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "22px 26px",
              } as CSSProperties
            }
          >
            <div
              style={
                {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                } as CSSProperties
              }
            >
              <span
                className={"lbl num"}
                style={{ color: "rgba(255,255,255,0.82)" } as CSSProperties}
              >
                {typography(
                  v.m.client +
                    ui.metaSeparator +
                    v.m.place +
                    ui.metaSeparator +
                    v.m.year,
                )}
              </span>
              <button
                className={"rnd"}
                onClick={v.closeModal}
                aria-label={ui.close}
                tabIndex={Number(v.caseModalTab)}
                style={
                  {
                    width: "44px",
                    height: "44px",
                    background: "rgba(0,0,0,0.4)",
                  } as CSSProperties
                }
              >
                {typography(ui.closeSymbol)}
              </button>
            </div>
            <h3
              id={"mtitle"}
              className={"ctitle"}
              style={
                {
                  fontSize: "60px",
                  fontWeight: "700",
                  lineHeight: "0.92",
                  letterSpacing: "-0.055em",
                } as CSSProperties
              }
            >
              {typography(v.m.title)}
            </h3>
          </div>
        </div>
        <div
          className={"g12"}
          style={{ padding: "28px 28px 32px", rowGap: "26px" } as CSSProperties}
        >
          <dl
            style={
              {
                gridColumn: "1 / span 7",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              } as CSSProperties
            }
          >
            <div>
              <dt
                className={"lbl"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(casesCopy.taskLabel)}
              </dt>
              <dd
                style={
                  {
                    marginTop: "8px",
                    fontSize: "16px",
                    lineHeight: "1.55",
                    color: "rgba(255,255,255,0.88)",
                  } as CSSProperties
                }
              >
                {typography(v.m.task)}
              </dd>
            </div>
            <div>
              <dt
                className={"lbl"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(casesCopy.solutionLabel)}
              </dt>
              <dd
                style={
                  {
                    marginTop: "8px",
                    fontSize: "16px",
                    lineHeight: "1.55",
                    color: "rgba(255,255,255,0.88)",
                  } as CSSProperties
                }
              >
                {typography(v.m.solution)}
              </dd>
            </div>
          </dl>
          <div style={{ gridColumn: "8 / span 5" } as CSSProperties}>
            <p
              className={"lbl"}
              style={
                {
                  paddingBottom: "6px",
                  color: "rgba(255,255,255,0.62)",
                } as CSSProperties
              }
            >
              {typography(v.m.numbersLabel)}
            </p>
            {v.m.numbers.map((n, index) => (
              <Fragment key={index}>
                <div className={"spec"}>
                  <span className={"k"}>{typography(n.l)}</span>
                  <span className={"dots"} aria-hidden={"true"}></span>
                  <span className={"v"}>{typography(n.v)}</span>
                </div>
              </Fragment>
            ))}
            <p
              style={
                {
                  marginTop: "14px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "rgba(255,255,255,0.6)",
                } as CSSProperties
              }
            >
              {typography(v.m.measure)}
            </p>
          </div>
          <div
            style={
              {
                gridColumn: "1 / -1",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                paddingTop: "22px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              } as CSSProperties
            }
          >
            <p
              style={
                {
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.7)",
                } as CSSProperties
              }
            >
              {typography(casesCopy.similarPrompt)}
            </p>
            <button
              className={"cta"}
              onClick={v.similar}
              tabIndex={Number(v.caseModalTab)}
            >
              {typography(casesCopy.similarAction)}
              <i aria-hidden={"true"}>{typography(ui.diagonalArrow)}</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
