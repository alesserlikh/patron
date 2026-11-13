import { typography, typographyGroups } from "@/app/lib/typography";
import { ui, sectionLabels } from "@/content/patron/ui";
import { about } from "@/content/patron/about";
import { Fragment, type CSSProperties } from "react";

export function AgencySection() {
  const v = {
    manifesto: typographyGroups(
      about.manifesto.flatMap(([text, color]) =>
        text.split(" ").map((t) => ({ t, color })),
      ),
    ),
  };
  return (
    <section id={"agency"} data-sec={"agency"} className={"scr lift"}>
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
            {typography(about.number)}
          </span>
          <span>{typography(sectionLabels.agency)}</span>
          <span
            className={"hair"}
            style={{ flex: "1" } as CSSProperties}
          ></span>
        </div>
        <p
          className={"man"}
          style={
            {
              marginTop: "44px",
              maxWidth: "1280px",
              fontSize: "54px",
              fontWeight: "500",
              lineHeight: "1.08",
              letterSpacing: "-0.035em",
            } as CSSProperties
          }
        >
          {v.manifesto.map((group, index) => (
            <Fragment key={index}>
              <span
                className={"wd"}
                style={{ whiteSpace: "nowrap" } as CSSProperties}
              >
                {group.map((w, wordIndex) => (
                  <span key={wordIndex} style={{ color: w.color }}>
                    {typography(
                      w.t + (wordIndex < group.length - 1 ? "\u00a0" : ""),
                    )}
                  </span>
                ))}
              </span>
              {typography(ui.space)}
            </Fragment>
          ))}
        </p>
        <div
          className={"g12"}
          style={
            {
              marginTop: "80px",
              paddingTop: "28px",
              borderTop: "1px solid rgba(255,255,255,0.12)",
            } as CSSProperties
          }
        >
          <article
            className={"stair"}
            style={{ "--o": "0px", gridColumn: "1 / span 4" } as CSSProperties}
          >
            <span
              className={"lbl num"}
              style={{ color: "#A1BAE4" } as CSSProperties}
            >
              {typography(about.firstNumber)}
            </span>
            <h3
              style={
                {
                  marginTop: "14px",
                  fontSize: "28px",
                  fontWeight: "600",
                  letterSpacing: "-0.03em",
                } as CSSProperties
              }
            >
              {typography(about.firstTitle)}
            </h3>
            <p
              style={
                {
                  marginTop: "10px",
                  maxWidth: "34ch",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.74)",
                } as CSSProperties
              }
            >
              {typography(about.firstDescription)}
            </p>
          </article>
          <article
            className={"stair"}
            style={{ "--o": "70px", gridColumn: "5 / span 4" } as CSSProperties}
          >
            <span
              className={"lbl num"}
              style={{ color: "#A1BAE4" } as CSSProperties}
            >
              {typography(about.secondNumber)}
            </span>
            <h3
              style={
                {
                  marginTop: "14px",
                  fontSize: "28px",
                  fontWeight: "600",
                  letterSpacing: "-0.03em",
                } as CSSProperties
              }
            >
              {typography(about.secondTitle)}
            </h3>
            <p
              style={
                {
                  marginTop: "10px",
                  maxWidth: "34ch",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.74)",
                } as CSSProperties
              }
            >
              {typography(about.secondDescription)}
            </p>
          </article>
          <article
            className={"stair"}
            style={
              { "--o": "140px", gridColumn: "9 / span 4" } as CSSProperties
            }
          >
            <span
              className={"lbl num"}
              style={{ color: "#A1BAE4" } as CSSProperties}
            >
              {typography(about.thirdNumber)}
            </span>
            <h3
              style={
                {
                  marginTop: "14px",
                  fontSize: "28px",
                  fontWeight: "600",
                  letterSpacing: "-0.03em",
                } as CSSProperties
              }
            >
              {typography(about.thirdTitle)}
            </h3>
            <p
              style={
                {
                  marginTop: "10px",
                  maxWidth: "34ch",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.74)",
                } as CSSProperties
              }
            >
              {typography(about.thirdDescription)}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
