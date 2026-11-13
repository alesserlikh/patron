"use client";
import { typography } from "@/app/lib/typography";

import { sectionLabels } from "@/content/patron/ui";
import { processCopy } from "@/content/patron/process";

import { LightField } from "./LightField";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function ProcessSection() {
  const v = usePatron();
  return (
    <section
      id={"process"}
      data-sec={"process"}
      className={"pin"}
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
          variant="d2"
          style={
            {
              left: "20%",
              top: "30%",
              width: "70%",
              height: "60%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.6), transparent)",
              filter: "blur(70px)",
            } as CSSProperties
          }
        />
      </div>
      <div className={"pinin"}>
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
              {typography(processCopy.number)}
            </span>
            <span>{typography(sectionLabels.process)}</span>
            <span
              className={"hair"}
              style={{ flex: "1" } as CSSProperties}
            ></span>
          </div>
          <div
            className={"g12 fx"}
            style={{ marginTop: "40px", alignItems: "end" } as CSSProperties}
          >
            <h2
              className={"h2"}
              style={
                {
                  gridColumn: "1 / span 7",
                  fontSize: "50px",
                  fontWeight: "600",
                  lineHeight: "1.02",
                  letterSpacing: "-0.045em",
                } as CSSProperties
              }
            >
              {typography(processCopy.title)}
            </h2>
            <p
              style={
                {
                  gridColumn: "9 / span 4",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.7)",
                } as CSSProperties
              }
            >
              {typography(processCopy.description)}
            </p>
          </div>
          <div className={"tl"} style={{ marginTop: "80px" } as CSSProperties}>
            <div
              aria-hidden={"true"}
              style={{ position: "absolute", inset: "0" } as CSSProperties}
            >
              {v.ticks.map((t, index) => (
                <Fragment key={index}>
                  <span
                    className={"tick"}
                    style={{ left: t.left } as CSSProperties}
                  >
                    <span>{typography(t.label)}</span>
                  </span>
                </Fragment>
              ))}
              <span className={"playhead"}></span>
            </div>
            <ol style={{ position: "relative" } as CSSProperties}>
              {v.phases.map((p, index) => (
                <Fragment key={index}>
                  <li>
                    <button
                      className={"ph"}
                      onClick={p.open}
                      aria-haspopup={"dialog"}
                      aria-label={p.aria}
                    >
                      <span className={"cap"} style={p.capStyle}>
                        <span
                          className={"lbl num"}
                          style={{ color: "#A1BAE4" } as CSSProperties}
                        >
                          {typography(p.n)}
                        </span>
                        <span
                          style={
                            {
                              fontSize: "20px",
                              fontWeight: "600",
                              letterSpacing: "-0.02em",
                            } as CSSProperties
                          }
                        >
                          {typography(p.title)}
                        </span>
                        <span
                          className={"lbl num"}
                          style={
                            { color: "rgba(255,255,255,0.6)" } as CSSProperties
                          }
                        >
                          {typography(p.time)}
                        </span>
                        <span className={"more"} aria-hidden={"true"}>
                          {typography(processCopy.plus)}
                        </span>
                      </span>
                      <span
                        className={"trk"}
                        aria-hidden={"true"}
                        style={
                          {
                            left: p.left,
                            width: p.width,
                            background: p.bg,
                            animationRange: p.range,
                          } as CSSProperties
                        }
                      ></span>
                    </button>
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>
          <ol
            className={"mph"}
            style={
              {
                marginTop: "32px",
                borderTop: "1px solid rgba(255,255,255,0.12)",
              } as CSSProperties
            }
          >
            {v.phases.map((p, index) => (
              <Fragment key={index}>
                <li>
                  <button onClick={p.open} aria-haspopup={"dialog"}>
                    <span
                      className={"lbl num"}
                      style={{ color: "#A1BAE4" } as CSSProperties}
                    >
                      {typography(p.n)}
                    </span>
                    <span
                      style={
                        {
                          fontSize: "20px",
                          fontWeight: "600",
                          letterSpacing: "-0.02em",
                        } as CSSProperties
                      }
                    >
                      {typography(p.title)}
                    </span>
                    <span
                      className={"lbl num"}
                      style={
                        { color: "rgba(255,255,255,0.6)" } as CSSProperties
                      }
                    >
                      {typography(p.time + processCopy.parallelSuffix)}
                    </span>
                  </button>
                </li>
              </Fragment>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
