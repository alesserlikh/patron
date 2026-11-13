import { ui, contacts } from "@/content/patron/ui";
import type { ComponentPropsWithoutRef } from "react";

export function LegalLink({
  document,
  ...props
}: ComponentPropsWithoutRef<"a"> & { document: "privacy" | "consent" }) {
  const href =
    document === "privacy" ? contacts.privacyUrl : contacts.consentUrl;
  return href ? (
    <a {...props} href={href} />
  ) : (
    <span
      className={props.className}
      style={props.style}
      aria-disabled="true"
      title={ui.privacyUnavailable}
    >
      {props.children}
    </span>
  );
}
