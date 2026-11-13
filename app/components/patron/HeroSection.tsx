"use client";
import { typography } from "@/app/lib/typography";

import { ui } from "@/content/patron/ui";
import { hero } from "@/content/patron/hero";

import { LightField } from "./LightField";
import { AnimatedLens } from "./AnimatedLens";
import Image from "next/image";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";

export function HeroSection() {
  const v = usePatron();
  return (
    <section
      className={"hero " + v.heroCls}
      style={{ marginTop: "-68px" } as CSSProperties}
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
              left: "-20%",
              top: "-30%",
              width: "70%",
              height: "90%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.9), rgba(0,25,72,0.45) 55%, transparent)",
              filter: "blur(40px)",
            } as CSSProperties
          }
        />
        <LightField
          variant="sweep"
          style={
            {
              left: "34%",
              top: "2%",
              width: "60%",
              height: "64%",
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.4), rgba(161,186,228,0.38) 30%, rgba(124,118,214,0.18) 58%, transparent)",
              filter: "blur(60px)",
            } as CSSProperties
          }
        />
        <div
          className={"beam d3"}
          style={
            {
              left: "10%",
              top: "70%",
              width: "130%",
              height: "22%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(161,186,228,0.1) 25%, rgba(220,232,255,0.34) 52%, rgba(124,118,214,0.14) 72%, transparent 100%)",
              filter: "blur(46px)",
            } as CSSProperties
          }
        ></div>
        <div className={"grain"}></div>
      </div>
      <div
        className={"hmedia"}
        onClick={v.collapseHero}
        aria-hidden={v.mediaHidden}
      >
        <Image
          src={"/patron/new/028484740663e9f594f00d4e2a70bcf9.jpg"}
          alt={hero.imageAlt}
          width={2000}
          height={1125}
          unoptimized
          loading="eager"
        />
        <div
          aria-hidden={"true"}
          style={
            {
              position: "absolute",
              inset: "0",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 28%, transparent 50%, rgba(0,0,0,0.88) 100%)",
            } as CSSProperties
          }
        ></div>
      </div>
      <div className={"hin hdepth"}>
        <div
          className={"wrap lbl"}
          style={
            {
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
              color: "rgba(255,255,255,0.72)",
            } as CSSProperties
          }
        >
          <span
            className={"fade"}
            style={{ animationDelay: "1.2s" } as CSSProperties}
          >
            {typography(hero.eyebrow)}
          </span>
          <span
            className={"fade hidesm"}
            style={{ animationDelay: "1.3s" } as CSSProperties}
          >
            {typography(ui.tagline)}
          </span>
        </div>
        <div className={"wrap"}>
          <div className={"hhead"}>
            <h1
              className={"h1"}
              style={
                {
                  fontSize: "clamp(56px, 10.6vw, 170px)",
                  fontWeight: "700",
                  lineHeight: "0.9",
                  letterSpacing: "-0.06em",
                } as CSSProperties
              }
            >
              <span
                className={"hl1"}
                style={
                  {
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0 0.18em",
                  } as CSSProperties
                }
              >
                <span
                  className={"fw"}
                  style={{ animationDelay: ".1s" } as CSSProperties}
                >
                  {typography(hero.event)}
                </span>
                <button
                  className={"lens hlens lensin"}
                  onClick={v.expandHero}
                  aria-label={hero.expandLabel}
                  aria-expanded={v.heroExpanded}
                  style={
                    {
                      width: "1.5em",
                      flex: "none",
                      gap: "0.07em",
                      transformOrigin: "center",
                    } as CSSProperties
                  }
                >
                  <AnimatedLens
                    image={"/patron/new/028484740663e9f594f00d4e2a70bcf9.jpg"}
                    eager
                  />
                  <span className={"tip"}>{typography(hero.watch)}</span>
                </button>
                <span
                  className={"fw"}
                  style={{ animationDelay: ".4s" } as CSSProperties}
                >
                  {typography(ui.dash)}
                </span>
              </span>
              <span
                className={"hl2"}
                style={
                  { display: "block", paddingLeft: "0.6em" } as CSSProperties
                }
              >
                <span
                  className={"fw"}
                  style={{ animationDelay: ".55s" } as CSSProperties}
                >
                  {typography(hero.part)}
                </span>
                {typography(" ")}
                <span className={"sr"}>{typography(hero.word)}</span>
                <span
                  aria-hidden={"true"}
                  style={{ whiteSpace: "nowrap" } as CSSProperties}
                >
                  {v.word.map((c, index) => (
                    <Fragment key={index}>
                      <span
                        className={"ch"}
                        style={
                          {
                            animationDelay: c.delay,
                            animationDuration: c.dur,
                          } as CSSProperties
                        }
                      >
                        {typography(c.ch)}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </span>
            </h1>
            <button
              className={"hback"}
              onClick={v.collapseHero}
              tabIndex={-1}
              aria-hidden={"true"}
            ></button>
          </div>
        </div>
        <div
          style={{ position: "relative", minHeight: "120px" } as CSSProperties}
        >
          <div
            className={"wrap g12 hfoot"}
            style={{ alignItems: "end" } as CSSProperties}
          >
            <ol
              aria-label={hero.pipelineLabel}
              className={"lbl num hidem fade"}
              style={
                {
                  gridColumn: "1 / span 7",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "14px",
                  color: "rgba(255,255,255,0.7)",
                  animationDelay: "1.6s",
                } as CSSProperties
              }
            >
              <li>{typography(hero.task)}</li>
              <li
                aria-hidden={"true"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(ui.arrow)}
              </li>
              <li>{typography(hero.strategy)}</li>
              <li
                aria-hidden={"true"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(ui.arrow)}
              </li>
              <li>{typography(hero.event)}</li>
              <li
                aria-hidden={"true"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(ui.arrow)}
              </li>
              <li>{typography(hero.production)}</li>
              <li
                aria-hidden={"true"}
                style={{ color: "#A1BAE4" } as CSSProperties}
              >
                {typography(ui.arrow)}
              </li>
              <li style={{ color: "#ffffff" } as CSSProperties}>
                {typography(hero.metrics)}
              </li>
            </ol>
            <div
              className={"fade"}
              style={
                {
                  gridColumn: "8 / span 5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  animationDelay: "1.7s",
                } as CSSProperties
              }
            >
              <p
                style={
                  {
                    fontSize: "19px",
                    lineHeight: "1.5",
                    color: "rgba(255,255,255,0.84)",
                  } as CSSProperties
                }
              >
                {typography(hero.description)}
              </p>
              <div
                style={
                  {
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "28px",
                  } as CSSProperties
                }
              >
                <button
                  className={"cta"}
                  onClick={v.openBrief}
                  aria-haspopup={"dialog"}
                >
                  {typography(ui.discussProjectSpaced)}
                  <i aria-hidden={"true"}>{typography(ui.diagonalArrow)}</i>
                </button>
                <a className={"ln"} href={"#cases"}>
                  {typography(hero.viewCases)}
                  <b aria-hidden={"true"}>{typography(ui.arrow)}</b>
                </a>
              </div>
            </div>
          </div>
          <div
            className={"wrap hctl"}
            style={
              {
                position: "absolute",
                left: "0",
                right: "0",
                bottom: "0",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              } as CSSProperties
            }
          >
            <button
              className={"glass"}
              onClick={v.collapseHero}
              tabIndex={Number(v.ctlTab)}
            >
              <i aria-hidden={"true"}>{typography(ui.closeSymbol)}</i>
              {typography(hero.collapse)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
