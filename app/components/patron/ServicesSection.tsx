"use client";
import { typography } from "@/app/lib/typography";

import { ui, sectionLabels } from "@/content/patron/ui";
import { servicesCopy } from "@/content/patron/servises";

import { LightField } from "./LightField";
import { AnimatedLens } from "./AnimatedLens";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function ServicesSection() {
  const v = usePatron();
  return (
    <section
      id={"services"}
      data-sec={"services"}
      className={"scr"}
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
              left: "-16%",
              top: "10%",
              width: "54%",
              height: "70%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.7), rgba(0,25,72,0.3) 60%, transparent)",
              filter: "blur(60px)",
            } as CSSProperties
          }
        />
      </div>
      <div className={"wrap"}>
        <div
          style={
            {
              display: "flex",
              alignItems: "center",
              gap: "16px",
            } as CSSProperties
          }
        >
          <div
            className={"lbl num"}
            style={
              {
                flex: "1",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                color: "rgba(255,255,255,0.66)",
              } as CSSProperties
            }
          >
            <span style={{ color: "#A1BAE4" } as CSSProperties}>
              {typography(servicesCopy.number)}
            </span>
            <span>{typography(sectionLabels.services)}</span>
            <span
              className={"hair"}
              style={{ flex: "1" } as CSSProperties}
            ></span>
          </div>
          <span
            className={"lbl hidesm"}
            aria-live={"polite"}
            style={{ color: "rgba(255,255,255,0.7)" } as CSSProperties}
          >
            {typography(v.svHint)}
          </span>
          <button
            className={"rnd"}
            onClick={v.svLeft}
            disabled={v.svLeftDis}
            aria-label={servicesCopy.backToOverview}
          >
            {typography(ui.backArrow)}
          </button>
          <button
            className={"rnd"}
            onClick={v.svRight}
            disabled={v.svRightDis}
            aria-label={v.svRightLabel}
          >
            {typography(ui.arrow)}
          </button>
        </div>
        <div
          className={"svp " + v.svpCls}
          onPointerDown={v.pDown}
          onPointerMove={v.pMove}
          onPointerUp={v.pUp}
          onPointerCancel={v.pCancel}
          style={{ marginTop: "40px" } as CSSProperties}
        >
          <div className={"svtrack " + v.svCls} style={v.svTrackStyle}>
            <div
              className={"svview sv0 g12"}
              style={{ alignItems: "center" } as CSSProperties}
              aria-hidden={v.sv0Hidden}
              inert={v.sv0Hidden}
            >
              <div
                style={
                  {
                    gridColumn: "1 / span 5",
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                  } as CSSProperties
                }
              >
                <h2
                  className={"h2"}
                  style={
                    {
                      fontSize: "50px",
                      fontWeight: "600",
                      lineHeight: "1.02",
                      letterSpacing: "-0.045em",
                    } as CSSProperties
                  }
                >
                  {typography(servicesCopy.title)}
                </h2>
                <div
                  className={"lens hidem"}
                  aria-hidden={"true"}
                  style={{ width: "88%", gap: "5%" } as CSSProperties}
                >
                  <AnimatedLens
                    image={"/patron/new/18f1d1d4a3e0375513ea54207d867afc.jpg"}
                  />
                </div>
              </div>
              <div style={{ gridColumn: "7 / span 6" } as CSSProperties}>
                <p
                  style={
                    {
                      fontSize: "17px",
                      lineHeight: "1.55",
                      color: "rgba(255,255,255,0.74)",
                    } as CSSProperties
                  }
                >
                  {typography(servicesCopy.description)}
                </p>
                <div
                  style={
                    {
                      marginTop: "20px",
                      borderTop: "1px solid rgba(255,255,255,0.14)",
                    } as CSSProperties
                  }
                >
                  {v.services.map((s, index) => (
                    <Fragment key={index}>
                      <button
                        className={"srow"}
                        onClick={s.go}
                        tabIndex={Number(v.sv0Tab)}
                      >
                        <span
                          style={
                            {
                              display: "flex",
                              alignItems: "baseline",
                              gap: "18px",
                            } as CSSProperties
                          }
                        >
                          <span
                            className={"lbl num"}
                            style={{ color: "#A1BAE4" } as CSSProperties}
                          >
                            {typography(s.n)}
                          </span>
                          <span className={"nm"}>{typography(s.title)}</span>
                        </span>
                        <span className={"ar"} aria-hidden={"true"}>
                          {typography(ui.diagonalArrow)}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={"svview sv1"}
              aria-hidden={v.sv1Hidden}
              inert={v.sv1Hidden}
            >
              <div className={"stk"}>
                {v.services.map((s, index) => (
                  <Fragment key={index}>
                    <article
                      className={"g12 " + s.dcls}
                      role={"region"}
                      aria-label={s.title}
                      style={{ alignItems: "center" } as CSSProperties}
                      inert={s.dcls !== "on"}
                      aria-hidden={s.dcls !== "on"}
                    >
                      <div
                        style={{ gridColumn: "1 / span 7" } as CSSProperties}
                      >
                        <span
                          className={"lbl num"}
                          style={{ color: "#A1BAE4" } as CSSProperties}
                        >
                          {typography(s.n + servicesCopy.totalSuffix)}
                        </span>
                        <h3
                          className={"huge"}
                          style={
                            {
                              marginTop: "18px",
                              fontSize: "104px",
                              fontWeight: "700",
                              lineHeight: "0.88",
                              letterSpacing: "-0.06em",
                            } as CSSProperties
                          }
                        >
                          {typography(s.title)}
                        </h3>
                        <p
                          style={
                            {
                              marginTop: "26px",
                              maxWidth: "100%",
                              fontSize: "26px",
                              fontWeight: "500",
                              lineHeight: "1.25",
                              letterSpacing: "-0.02em",
                            } as CSSProperties
                          }
                        >
                          {typography(s.lead)}
                        </p>
                        <ul
                          className={"slist"}
                          style={
                            {
                              marginTop: "32px",
                              display: "grid",
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                              gap: "14px 32px",
                              maxWidth: "760px",
                            } as CSSProperties
                          }
                        >
                          {s.items.map((it, index) => (
                            <Fragment key={index}>
                              <li className={"tick2"}>{typography(it)}</li>
                            </Fragment>
                          ))}
                        </ul>
                        <button
                          className={"ln"}
                          onClick={v.openBrief}
                          aria-haspopup={"dialog"}
                          tabIndex={Number(s.dtab)}
                          style={
                            {
                              marginTop: "26px",
                              color: "#ffffff",
                            } as CSSProperties
                          }
                        >
                          {s.ctaLabel ? (
                            <span>{typography(s.ctaLabel)}</span>
                          ) : (
                            <>
                              {typography(servicesCopy.discussPrefix)}
                              <span>{typography(s.cta)}</span>
                            </>
                          )}
                          {typography(ui.space)}
                          <b aria-hidden={"true"}>{typography(ui.arrow)}</b>
                        </button>
                      </div>
                      <div
                        className={"hidem"}
                        style={{ gridColumn: "9 / span 4" } as CSSProperties}
                      >
                        <div
                          className={"lens"}
                          aria-hidden={"true"}
                          style={{ width: "100%", gap: "5%" } as CSSProperties}
                        >
                          <AnimatedLens image={s.img} position={s.pos} />
                        </div>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
              <div
                className={"seg5 " + v.segCls}
                role={"tablist"}
                aria-label={servicesCopy.swipeLabel}
                onPointerDown={v.segDown}
                onPointerMove={v.segMove}
                onPointerUp={v.segUp}
                onPointerCancel={v.segUp}
                onKeyDown={v.segKey}
              >
                <span className={"rail"} aria-hidden={"true"}></span>
                <span
                  className={"thumb"}
                  aria-hidden={"true"}
                  style={{ left: v.thumbLeft } as CSSProperties}
                ></span>
                {v.services.map((s, index) => (
                  <Fragment key={index}>
                    <button
                      role={"tab"}
                      aria-selected={s.sel}
                      tabIndex={Number(s.dtab)}
                      className={"pick2 " + s.dcls}
                      onClick={s.go}
                    >
                      <span
                        className={"lbl num"}
                        style={{ color: "#A1BAE4" } as CSSProperties}
                      >
                        {typography(s.n)}
                      </span>
                      <span className={"hidesm"}>{typography(s.title)}</span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
