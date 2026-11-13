import { lead } from "@/content/patron/lead";
import type { BriefFormValues } from "@/content/patron/types";

export function validContact(value: string) {
  const v = value.trim();
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ||
    /^@[A-Za-z0-9_]{4,}$/.test(v) ||
    /^(https?:\/\/)?t\.me\/[A-Za-z0-9_]{4,}$/.test(v)
  );
}

export async function sendBrief(values: BriefFormValues, signal: AbortSignal) {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      name: values.name,
      contact: values.contact,
      company: values.company,
      task: [values.ctx && `${lead.caseContext}${values.ctx}`, values.comment]
        .filter(Boolean)
        .join("\n"),
      format: values.formats,
      scale: values.scale,
      consent: values.consent,
      website: values.website,
      requireDelivery: true,
    }),
  });
  const result: { ok?: boolean; id?: string; delivered?: boolean } =
    await response.json();
  if (!response.ok || !result.ok || !result.id || result.delivered !== true)
    throw new Error("delivery_unconfirmed");
}
