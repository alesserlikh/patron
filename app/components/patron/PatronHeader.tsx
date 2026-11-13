"use client";
import { typography } from "@/app/lib/typography";

import { ui } from "@/content/patron/ui";

import { Fragment, type CSSProperties } from "react";
import { PatronMark } from "./PatronMark";

import { usePatron } from "./PatronProvider";

export function PatronHeader() {
  const v = usePatron();
  return (
    <header className={"hdr " + v.hdrCls}>
      <div
        className={"wrap"}
        style={
          {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            height: "68px",
          } as CSSProperties
        }
      >
        <a
          href={"#top"}
          aria-label={ui.homeLabel}
          style={
            {
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              fontFamily: "'Patron Bartle', sans-serif",
              fontSize: "17px",
              color: "#ffffff",
            } as CSSProperties
          }
        >
          <PatronMark />
          {typography(ui.logo)}
        </a>
        <nav
          className={"nav hidem"}
          aria-label={ui.navigationLabel}
          style={{ display: "flex", gap: "32px" } as CSSProperties}
        >
          {v.nav.map((n, index) => (
            <Fragment key={index}>
              <a href={n.href} className={n.cls} aria-current={n.current}>
                <small className={"num"}>{typography(n.i)}</small>
                {typography(n.label)}
              </a>
            </Fragment>
          ))}
        </nav>
        <div
          className={"hright"}
          style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "22px",
              minWidth: "260px",
            } as CSSProperties
          }
        >
          <button
            type="button"
            className={"lbl num hidem visitor-clock"}
            onClick={v.openLocation}
            aria-haspopup="dialog"
            style={
              {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.66)",
              } as CSSProperties
            }
          >
            <span
              aria-hidden={"true"}
              style={
                {
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#A1BAE4",
                  boxShadow: "0 0 10px #A1BAE4",
                } as CSSProperties
              }
            ></span>
            <span className="visitor-city">
              {typography(v.visitorLocation.city)}
            </span>
            <time className="visitor-time">{typography(v.clock)}</time>
          </button>
          <button
            className={"cta hcta"}
            onClick={v.openBrief}
            aria-haspopup={"dialog"}
            tabIndex={Number(v.hdrCtaTab)}
            aria-hidden={v.hdrCtaHidden}
            style={
              {
                minHeight: "44px",
                paddingLeft: "18px",
                paddingRight: "4px",
                fontSize: "14px",
              } as CSSProperties
            }
          >
            <span className={"tfull"}>{typography(ui.discussProject)}</span>
            <span className={"tshort"}>{typography(ui.discussShort)}</span>
            <i
              aria-hidden={"true"}
              style={{ width: "34px", height: "34px" } as CSSProperties}
            >
              {typography(ui.diagonalArrow)}
            </i>
          </button>
          <button
            className={"burger " + v.menuCls}
            onClick={v.toggleMenu}
            aria-expanded={v.menuExp}
            aria-controls={"mnav"}
            aria-label={v.menuLabel}
          >
            <i></i>
            <i></i>
          </button>
        </div>
      </div>
      <span
        className={"prog"}
        aria-hidden={"true"}
        style={{ transform: `scaleX(${v.progress})` }}
      ></span>
    </header>
  );
}
