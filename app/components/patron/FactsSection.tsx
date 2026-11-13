import { typography } from "@/app/lib/typography";
import { stats } from "@/content/patron/stats";
import Image from "next/image";
import { type CSSProperties } from "react";

export function FactsSection() {
  return (
    <section
      className={"scr para factsScr"}
      aria-label={stats.label}
      style={
        {
          justifyContent: "flex-end",
          padding: "0",
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <Image
        src={"/patron/new/18f1d1d4a3e0375513ea54207d867afc.jpg"}
        alt={stats.imageAlt}
        style={
          {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 55%",
          } as CSSProperties
        }
        width={1751}
        height={984}
        unoptimized
        loading="lazy"
      />
      <div
        aria-hidden={"true"}
        style={
          {
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.92) 100%)",
          } as CSSProperties
        }
      ></div>
      <div
        className={"wrap"}
        style={
          {
            position: "relative",
            paddingTop: "64px",
            paddingBottom: "56px",
          } as CSSProperties
        }
      >
        <div
          className={"fx facts"}
          style={
            {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "28px 48px",
            } as CSSProperties
          }
        >
          <div>
            <strong
              className={"fact num"}
              style={
                {
                  display: "block",
                  fontSize: "96px",
                  fontWeight: "600",
                  lineHeight: "0.9",
                  letterSpacing: "-0.06em",
                } as CSSProperties
              }
            >
              {typography(stats.yearsValue)}
            </strong>
            <span
              className={"lbl"}
              style={
                {
                  display: "block",
                  marginTop: "14px",
                  color: "rgba(255,255,255,0.8)",
                } as CSSProperties
              }
            >
              {typography(stats.yearsLabel)}
            </span>
          </div>
          <div>
            <strong
              className={"fact num"}
              style={
                {
                  display: "block",
                  fontSize: "96px",
                  fontWeight: "600",
                  lineHeight: "0.9",
                  letterSpacing: "-0.06em",
                } as CSSProperties
              }
            >
              {typography(stats.countriesValue)}
            </strong>
            <span
              className={"lbl"}
              style={
                {
                  display: "block",
                  marginTop: "14px",
                  color: "rgba(255,255,255,0.8)",
                } as CSSProperties
              }
            >
              {typography(stats.countriesLabel)}
            </span>
          </div>
          <div>
            <strong
              className={"fact num"}
              style={
                {
                  display: "block",
                  fontSize: "96px",
                  fontWeight: "600",
                  lineHeight: "0.9",
                  letterSpacing: "-0.06em",
                } as CSSProperties
              }
            >
              {typography(stats.projectsValue)}
            </strong>
            <span
              className={"lbl"}
              style={
                {
                  display: "block",
                  marginTop: "14px",
                  color: "rgba(255,255,255,0.8)",
                } as CSSProperties
              }
            >
              {typography(stats.projectsLabel)}
            </span>
          </div>
          <div>
            <strong
              className={"fact num"}
              style={
                {
                  display: "block",
                  fontSize: "96px",
                  fontWeight: "600",
                  lineHeight: "0.9",
                  letterSpacing: "-0.06em",
                  color: "#A1BAE4",
                } as CSSProperties
              }
            >
              {typography(stats.guestsValue)}
            </strong>
            <span
              className={"lbl"}
              style={
                {
                  display: "block",
                  marginTop: "14px",
                  color: "rgba(255,255,255,0.8)",
                } as CSSProperties
              }
            >
              {typography(stats.guestsLabel)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
