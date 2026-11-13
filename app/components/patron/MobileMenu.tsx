"use client";
import { typography } from "@/app/lib/typography";

import { ui, contacts } from "@/content/patron/ui";

import { ContactPhone } from "./ContactPhone";

import { LightField } from "./LightField";
import { Fragment, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";
import { PatronMark } from "./PatronMark";

export function MobileMenu() {
  const v = usePatron();
  return (
    <div
      id={"mnav"}
      className={"mmenu " + v.menuCls}
      aria-hidden={v.menuHidden}
      role="dialog"
      aria-modal="true"
      aria-label={ui.menu}
    >
      <div className="menu-heading">
        <a href="#top" onClick={v.closeMenu}>
          <PatronMark />
          {typography(ui.logo)}
        </a>
        <button
          className={"burger " + v.menuCls}
          aria-label={ui.menuClose}
          onClick={v.closeMenu}
        >
          <i />
          <i />
        </button>
      </div>
      <div
        aria-hidden={"true"}
        style={
          {
            position: "absolute",
            inset: "0",
            overflow: "hidden",
          } as CSSProperties
        }
      >
        <LightField
          variant="d1"
          style={
            {
              left: "-30%",
              bottom: "-20%",
              width: "110%",
              height: "70%",
              background:
                "radial-gradient(closest-side, rgba(0,55,94,0.9), rgba(0,25,72,0.4) 60%, transparent)",
              filter: "blur(50px)",
            } as CSSProperties
          }
        />
        <div className={"grain"}></div>
      </div>
      <nav
        aria-label={ui.menu}
        className={"wrap"}
        style={
          {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            paddingTop: "96px",
          } as CSSProperties
        }
      >
        {v.nav.map((n, index) => (
          <Fragment key={index}>
            <a
              href={n.href}
              className={"mlink " + n.cls}
              onClick={v.closeMenu}
              tabIndex={Number(v.menuTab)}
            >
              <small className={"lbl num"}>{typography(n.i)}</small>
              {typography(n.label)}
            </a>
          </Fragment>
        ))}
      </nav>
      <div
        className={"wrap"}
        style={
          {
            position: "relative",
            marginTop: "auto",
            paddingBottom: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          } as CSSProperties
        }
      >
        <button
          className={"cta"}
          onClick={v.openBrief}
          tabIndex={Number(v.menuTab)}
          style={{ alignSelf: "flex-start" } as CSSProperties}
        >
          {typography(ui.discussProjectSpaced)}
          <i aria-hidden={"true"}>{typography(ui.diagonalArrow)}</i>
        </button>
        <div
          style={
            {
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              fontSize: "15px",
              color: "rgba(255,255,255,0.8)",
            } as CSSProperties
          }
        >
          <a
            className={"ln"}
            style={{ minHeight: "36px" } as CSSProperties}
            href={"mailto:" + contacts.email}
            tabIndex={Number(v.menuTab)}
          >
            {typography(contacts.email)}
          </a>
          <a
            className={"ln"}
            style={{ minHeight: "36px" } as CSSProperties}
            href={contacts.telegramUrl}
            tabIndex={Number(v.menuTab)}
          >
            {typography(ui.telegramLabel)}
          </a>
          <ContactPhone
            className={"ln num"}
            style={{ minHeight: "36px" } as CSSProperties}
            tabIndex={Number(v.menuTab)}
          />
        </div>
      </div>
    </div>
  );
}
