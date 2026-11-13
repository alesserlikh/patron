export interface Service {
  id: string;
  n: string;
  title: string;
  cta: string;
  ctaLabel?: string;
  lead: string;
  items: string[];
  img: string;
  pos: string;
}
export interface CaseStudy {
  id: string;
  client: string;
  title: string;
  place: string;
  year: string;
  big: string;
  bigLabel: string;
  dur: string;
  fmt: string;
  scale: string;
  l1: string;
  t1: string;
  l2: string;
  t2: string;
  task: string;
  solution: string;
  numbersLabel: string;
  numbers: string[][];
  measure: string;
  videoUrl?: string;
}
export interface ProcessPhase {
  id: string;
  n: string;
  title: string;
  time: string;
  a: number;
  b: number;
  bg: string;
  goal: string;
  items: string[];
  result: string;
  sync: string;
}
export interface SiteNavigationItem {
  id: string;
  label: string;
}
export interface ContactInfo {
  email: string;
  telegram: string;
  telegramUrl: string;
  phone: string | null;
  privacyUrl: string | null;
  consentUrl: string | null;
}
export interface BriefFormValues {
  name: string;
  contact: string;
  company: string;
  comment: string;
  consent: boolean;
  formats: string[];
  scale: string;
  ctx: string;
  website: string;
}
export type FormPhase = "idle" | "error" | "sending" | "success" | "network";
