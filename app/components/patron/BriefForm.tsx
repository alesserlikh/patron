"use client";
import { typography } from "@/app/lib/typography";

import { ui } from "@/content/patron/ui";
import { lead } from "@/content/patron/lead";

import { Fragment, useId, type CSSProperties } from "react";

import { usePatron } from "./PatronProvider";
import { LegalLink } from "./LegalLink";

export function BriefForm() {
  const v = usePatron();
  const hintId = useId();
  const nameErrorId = useId();
  const contactErrorId = useId();
  return (
    <div className={"panel"}>
      {v.isSuccess && (
        <>
          <div
            role={"status"}
            className={"open"}
            style={
              {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                padding: "44px 40px",
              } as CSSProperties
            }
          >
            <span
              aria-hidden={"true"}
              style={
                {
                  display: "inline-grid",
                  placeItems: "center",
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#A1BAE4",
                  color: "#001948",
                  fontSize: "20px",
                } as CSSProperties
              }
            >
              {typography(ui.check)}
            </span>
            <h3
              style={
                {
                  fontSize: "32px",
                  fontWeight: "600",
                  lineHeight: "1.1",
                  letterSpacing: "-0.035em",
                } as CSSProperties
              }
            >
              {typography(lead.thanksPrefix + v.nameShown + lead.thanksSuffix)}
            </h3>
            <p
              style={
                {
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "rgba(255,255,255,0.76)",
                } as CSSProperties
              }
            >
              {typography(lead.replyPrefix + v.contactShown + lead.replySuffix)}
            </p>
            <div
              style={
                v.overlay?.type === "brief"
                  ? {
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "24px",
                      marginTop: "8px",
                    }
                  : { display: "contents" }
              }
            >
              {v.overlay?.type === "brief" && (
                <button className="cta" onClick={v.closeBrief}>
                  {typography(lead.returnToSite)}
                  <i aria-hidden="true">{typography(ui.diagonalArrow)}</i>
                </button>
              )}
              <button className={"ln"} onClick={v.resetForm}>
                {typography(lead.sendAnother)}
                <b aria-hidden={"true"}>{typography(ui.arrow)}</b>
              </button>
            </div>
          </div>
        </>
      )}
      {v.showForm && (
        <>
          <form
            className={"fpad"}
            onSubmit={v.submit}
            noValidate
            style={
              {
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                padding: "32px 32px 28px",
              } as CSSProperties
            }
          >
            <fieldset
              disabled={v.isSending}
              style={{ display: "contents", border: 0 }}
            >
              {v.isNetwork && (
                <>
                  <div
                    role={"alert"}
                    style={
                      {
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        padding: "8px 8px 8px 16px",
                        borderRadius: "14px",
                        background: "rgba(255,156,156,0.12)",
                        fontSize: "14px",
                        color: "#FFD0D0",
                      } as CSSProperties
                    }
                  >
                    <span>{typography(lead.deliveryUnavailable)}</span>
                    <button
                      type={"submit"}
                      className={"glass"}
                      style={
                        {
                          minHeight: "38px",
                          padding: "0 16px",
                          fontSize: "14px",
                        } as CSSProperties
                      }
                    >
                      {typography(lead.retry)}
                    </button>
                  </div>
                </>
              )}
              {v.hasCtx && (
                <>
                  <div>
                    <span className={"ctx"}>
                      {typography(
                        lead.casePrefix + v.ctxTitle + lead.caseSuffix,
                      )}
                      <button
                        type={"button"}
                        onClick={v.clearCtx}
                        aria-label={lead.removeCase}
                      >
                        {typography(ui.closeSymbol)}
                      </button>
                    </span>
                  </div>
                </>
              )}
              <fieldset
                style={
                  { border: "0", margin: "0", padding: "0" } as CSSProperties
                }
              >
                <legend
                  style={
                    {
                      padding: "0 0 10px",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.66)",
                    } as CSSProperties
                  }
                >
                  {typography(lead.formatsLabel)}
                </legend>
                <div className={"chips"}>
                  {v.formats.map((o, index) => (
                    <Fragment key={index}>
                      <button
                        type={"button"}
                        className={"chip " + o.cls}
                        aria-pressed={o.on}
                        onClick={o.pick}
                      >
                        {typography(o.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </fieldset>
              <div
                className={"f2"}
                style={
                  {
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "10px",
                  } as CSSProperties
                }
              >
                <label className={"fl " + v.nameErrCls}>
                  <input
                    required
                    name={"name"}
                    autoComplete={"name"}
                    placeholder={lead.namePlaceholder}
                    value={v.name}
                    onChange={v.onName}
                    aria-invalid={v.nameInvalid}
                    aria-describedby={v.nameInvalid ? nameErrorId : hintId}
                  />
                  <span>{typography(lead.nameLabel)}</span>
                  {v.nameInvalid && (
                    <small className="field-error" id={nameErrorId}>
                      {typography(lead.nameError)}
                    </small>
                  )}
                </label>
                <label className={"fl " + v.contactErrCls}>
                  <input
                    required
                    name={"contact"}
                    autoComplete={"email"}
                    placeholder={lead.contactPlaceholder}
                    value={v.contact}
                    onChange={v.onContact}
                    aria-invalid={v.contactInvalid}
                    aria-describedby={
                      v.contactInvalid ? contactErrorId : hintId
                    }
                  />
                  <span>{typography(lead.contactLabel)}</span>
                  {v.contactInvalid && (
                    <small className="field-error" id={contactErrorId}>
                      {typography(lead.contactError)}
                    </small>
                  )}
                </label>
                <label className={"fl hidesm"}>
                  <input
                    name={"company"}
                    autoComplete={"organization"}
                    placeholder={lead.companyLabel}
                    value={v.company}
                    onChange={v.onCompany}
                  />
                  <span>{typography(lead.companyLabel)}</span>
                </label>
                <label className={"fl sel"}>
                  <select name={"scale"} value={v.scale} onChange={v.onScale}>
                    {v.scales.map((o, index) => (
                      <Fragment key={index}>
                        <option value={o}>{typography(o)}</option>
                      </Fragment>
                    ))}
                  </select>
                  <span>{typography(lead.guestsLabel)}</span>
                </label>
              </div>
              <label className={"fl"}>
                <input
                  name={"task"}
                  placeholder={lead.taskPlaceholder}
                  value={v.comment}
                  onChange={v.onComment}
                />
                <span>{typography(lead.taskLabel)}</span>
              </label>
              <div
                style={
                  {
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px 20px",
                  } as CSSProperties
                }
              >
                <label
                  className={"chk"}
                  style={{ flex: "1 1 240px" } as CSSProperties}
                >
                  <input
                    type={"checkbox"}
                    required
                    name={"consent"}
                    checked={v.consent}
                    onChange={v.onConsent}
                  />
                  <span>
                    {typography(lead.consentPrefix, true)}
                    <LegalLink
                      document="privacy"
                      style={{ textDecoration: "underline" }}
                    >
                      {typography(lead.policyLink)}
                    </LegalLink>
                  </span>
                </label>
                <button
                  className={"cta"}
                  type={"submit"}
                  disabled={v.cantSubmit}
                >
                  {typography(ui.space + v.submitLabel + ui.space)}
                  {v.isSending && (
                    <>
                      <i aria-hidden={"true"}>
                        <span className={"spin"}></span>
                      </i>
                    </>
                  )}
                  {v.notSending && (
                    <>
                      <i aria-hidden={"true"}>{typography(ui.diagonalArrow)}</i>
                    </>
                  )}
                </button>
              </div>
              <p
                id={hintId}
                className={"fhint"}
                role={v.hintRole}
                style={
                  {
                    fontSize: "13px",
                    lineHeight: "1.45",
                    color: v.hintColor,
                  } as CSSProperties
                }
              >
                {typography(v.hintText)}
              </p>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}
