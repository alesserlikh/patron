import { typography } from "@/app/lib/typography";
import { ui, contacts } from "@/content/patron/ui";
import type { ComponentPropsWithoutRef } from "react";

export function ContactPhone(props: ComponentPropsWithoutRef<"a">) {
  const phone = contacts.phone;
  return phone ? (
    <a {...props} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
      {typography(phone)}
    </a>
  ) : (
    <span className={props.className} style={props.style} aria-disabled="true">
      {typography(ui.phoneUnavailable)}
    </span>
  );
}
