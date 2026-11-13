"use client";
import { ui, navigation } from "@/content/patron/ui";
import { hero } from "@/content/patron/hero";
import { lead } from "@/content/patron/lead";
import {
  servicesCopy,
  services as serviceData,
} from "@/content/patron/servises";
import { casesCopy, cases as caseData } from "@/content/patron/cases";
import { processCopy, phases as phaseData } from "@/content/patron/process";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  TouchEvent,
} from "react";

import type { BriefFormValues, FormPhase } from "@/content/patron/types";

import { sendBrief, validContact } from "./brief-transport";
import { useVisitorPreferences } from "./useVisitorPreferences";
import {
  useDialogFocus,
  useMoscowClock,
  useScrollProgress,
  useSectionObserver,
  useSwipe,
  useOverlayState,
} from "./hooks";

type Overlay =
  | { type: "brief" | "menu" | "cookies" | "location" }
  | { type: "case" | "phase"; index: number }
  | null;
const emptyForm = (): BriefFormValues => ({
  name: "",
  contact: "",
  company: "",
  comment: "",
  consent: false,
  formats: [],
  scale: lead.scales[0],
  ctx: "",
  website: "",
});

function usePatronController() {
  const active = useSectionObserver();
  const [heroExp, setHeroExp] = useState(false);
  const { heroOut, progress } = useScrollProgress(() => setHeroExp(false));
  const {
    overlay,
    open: setOverlay,
    close: closeOverlay,
    closing,
  } = useOverlayState<NonNullable<Overlay>>();
  const visitor = useVisitorPreferences(
    overlay?.type ?? null,
    (type) => setOverlay({ type }),
    closeOverlay,
  );
  const clock = useMoscowClock(visitor.visitorLocation.timeZone);
  const close = () => {
    if (overlay?.type === "cookies") visitor.chooseCookies(false);
    else {
      if (overlay?.type === "location") visitor.dismissLocation();
      closeOverlay();
    }
  };
  const [origin, setOrigin] = useState({ x: "88%", y: "5%" });
  const [sv, setSv] = useState(-1);
  const [caseIdx, setCaseIdx] = useState(0);
  const [values, setValues] = useState<BriefFormValues>(emptyForm);
  const [fphase, setFormPhase] = useState<FormPhase>("idle");
  const inFlight = useRef(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useDialogFocus(
    overlay?.type === "cookies" ? null : overlay?.type || null,
    close,
  );
  const menu = overlay?.type === "menu";
  const briefOpen = overlay?.type === "brief";
  const modalIndex = overlay?.type === "case" ? overlay.index : caseIdx;
  const phaseIndex = overlay?.type === "phase" ? overlay.index : 0;
  const stepPhase = (d: number) =>
    setOverlay({
      type: "phase",
      index: (phaseIndex + d + phaseData.length) % phaseData.length,
    });
  const changeCase = (d: number) =>
    setCaseIdx((i) => (i + d + caseData.length) % caseData.length);
  const openBrief = (e?: MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    if (e) {
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: `${((r.left + r.width / 2) / window.innerWidth) * 100}%`,
        y: `${((r.top + r.height / 2) / window.innerHeight) * 100}%`,
      });
    }
    setHeroExp(false);
    setOverlay({ type: "brief" });
  };
  const serviceSwipe = useSwipe((d) =>
    setSv((i) => (d > 0 ? Math.min(i + 1, serviceData.length - 1) : -1)),
  );
  const caseTouch = useRef<{ x: number; y: number } | null>(null);
  const segment = useRef(false);
  const [segDrag, setSegDrag] = useState(false);
  const segmentAt = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setSv(
      Math.max(
        0,
        Math.min(4, Math.floor(((e.clientX - r.left) / r.width) * 5)),
      ),
    );
  };
  const field =
    (key: "name" | "contact" | "company" | "comment" | "scale" | "website") =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [key]: value }));
      if (fphase === "error" || fphase === "network") setFormPhase("idle");
    };
  const nameErr = fphase === "error" && !values.name.trim();
  const contactErr = fphase === "error" && !validContact(values.contact);
  const consentErr = fphase === "error" && !values.consent;
  const sending = fphase === "sending";
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    if (
      !values.name.trim() ||
      !validContact(values.contact) ||
      !values.consent
    ) {
      setFormPhase("error");
      return;
    }
    inFlight.current = true;
    setFormPhase("sending");
    abort.current = new AbortController();
    const timer = setTimeout(() => abort.current?.abort(), 20000);
    try {
      await sendBrief(values, abort.current.signal);
      setFormPhase("success");
    } catch {
      setFormPhase("network");
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  };
  const similar = (e: MouseEvent<HTMLElement>) => {
    const c = caseData[modalIndex];
    setValues((v) => ({
      ...v,
      ctx: c.title,
      formats: v.formats.includes(c.fmt) ? v.formats : [...v.formats, c.fmt],
      scale: v.scale === lead.scales[0] ? c.scale : v.scale,
    }));
    if (fphase !== "sending") setFormPhase("idle");
    openBrief(e);
  };
  const keyClose = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") close();
  };
  const services = serviceData.map((s, index) => ({
    ...s,
    dcls: sv === index ? "on" : "off",
    sel: sv === index,
    dtab: sv === index ? 0 : -1,
    go: () => {
      if (!serviceSwipe.suppressClick.current) setSv(index);
    },
  }));
  const cases = caseData.map((c, index) => ({
    ...c,
    cls: index === caseIdx ? "on" : "off",
    sel: index === caseIdx,
    num: String(index + 1).padStart(2, "0"),
    playLabel: casesCopy.play + c.title,
    pick: () => setCaseIdx(index),
    open: () => setOverlay({ type: "case", index }),
  }));
  const phases = phaseData.map((ph, index) => ({
    ...ph,
    left: `${(ph.a / 26) * 100}%`,
    width: `${((ph.b - ph.a) / 26) * 100}%`,
    capStyle: (ph.a >= 17
      ? { right: `${100 - (ph.b / 26) * 100}%`, flexDirection: "row-reverse" }
      : { left: `${(ph.a / 26) * 100}%` }) as CSSProperties,
    range: `contain ${((ph.a / 26) * 92).toFixed(1)}% contain ${Math.min((ph.b / 26) * 92 + 3, 96).toFixed(1)}%`,
    aria: processCopy.phase + ph.n + ": " + ph.title + processCopy.details,
    open: () => setOverlay({ type: "phase", index }),
  }));
  return {
    ...visitor,
    openLocation: () => setOverlay({ type: "location" }),
    openCookies: () => setOverlay({ type: "cookies" }),
    useDefaultLocation: () => {
      visitor.dismissLocation(true);
      closeOverlay();
    },
    overlay,
    close,
    progress,
    clock,
    hdrCls: menu ? "menu" : heroOut ? "solid" : "",
    hdrCtaTab: heroOut && !menu ? 0 : -1,
    hdrCtaHidden: !heroOut || menu,
    nav: navigation.map((n, i) => ({
      href: "#" + n.id,
      label: n.label,
      i: String(i + 1).padStart(2, "0"),
      cls: active === n.id ? "on" : "",
      current: active === n.id ? ("location" as const) : (false as const),
    })),
    heroCls: heroExp && !heroOut ? "hx" : "",
    heroExpanded: heroExp && !heroOut,
    mediaHidden: !heroExp || heroOut,
    ctlTab: heroExp && !heroOut ? 0 : -1,
    expandHero: () => setHeroExp(true),
    collapseHero: () => setHeroExp(false),
    word: hero.word.split("").map((ch, i) => ({
      ch,
      delay: `${(0.9 + i * 0.12).toFixed(2)}s`,
      dur: `${(1.1 + i * 0.06).toFixed(2)}s`,
    })),
    services,
    svCls: sv < 0 ? "" : "v1",
    sv0Hidden: sv >= 0,
    sv1Hidden: sv < 0,
    sv0Tab: sv < 0 ? 0 : -1,
    svHint:
      sv < 0
        ? servicesCopy.overview
        : sv < 4
          ? servicesCopy.next + serviceData[sv + 1].title
          : servicesCopy.last,
    svLeft: () => setSv(-1),
    svRight: () => setSv((i) => Math.min(i + 1, 4)),
    svLeftDis: sv < 0,
    svRightDis: sv === 4,
    svRightLabel: sv < 0 ? servicesCopy.firstService : servicesCopy.nextService,
    svpCls: serviceSwipe.offset ? "drag" : "",
    svTrackStyle: (serviceSwipe.offset
      ? {
          transform: `translateX(calc(${sv < 0 ? "0%" : "-50%"} + ${Math.round(serviceSwipe.offset * 0.7)}px))`,
          transition: "none",
        }
      : {}) as CSSProperties,
    pDown: serviceSwipe.onPointerDown,
    pMove: serviceSwipe.onPointerMove,
    pUp: serviceSwipe.onPointerUp,
    pCancel: serviceSwipe.onPointerCancel,
    segCls: segDrag ? "drag" : "",
    thumbLeft: `${Math.max(0, sv) * 20}%`,
    segDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button > 0) return;
      e.stopPropagation();
      segment.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setSegDrag(true);
      segmentAt(e);
    },
    segMove: (e: PointerEvent<HTMLElement>) => {
      if (segment.current) {
        e.stopPropagation();
        segmentAt(e);
      }
    },
    segUp: () => {
      segment.current = false;
      setSegDrag(false);
    },
    segKey: (e: KeyboardEvent<HTMLElement>) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const index =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? 4
            : Math.max(0, Math.min(4, sv + (e.key === "ArrowLeft" ? -1 : 1)));
      setSv(index);
      e.currentTarget
        .querySelectorAll<HTMLButtonElement>('[role="tab"]')
        [index]?.focus();
    },
    cases,
    caseNum: String(caseIdx + 1).padStart(2, "0"),
    caseTotal: String(caseData.length).padStart(2, "0"),
    prevCase: () => changeCase(-1),
    nextCase: () => changeCase(1),
    tStart: (e: TouchEvent<HTMLElement>) => {
      caseTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    tEnd: (e: TouchEvent<HTMLElement>) => {
      const t = caseTouch.current;
      caseTouch.current = null;
      if (!t) return;
      const dx = e.changedTouches[0].clientX - t.x;
      const dy = e.changedTouches[0].clientY - t.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
        changeCase(dx < 0 ? 1 : -1);
    },
    m: {
      ...caseData[modalIndex],
      numbers: caseData[modalIndex].numbers.map(([l, v]) => ({ l, v })),
    },
    similar,
    caseModalCls: closing ? "" : "show",
    caseModalHidden: false,
    caseModalTab: 0,
    closeModal: close,
    modalKey: keyClose,
    ticks: [0, 4, 8, 12, 16, 20, 24].map((w) => ({
      left: `${(w / 26) * 100}%`,
      label: w ? String(w) : processCopy.week,
    })),
    phases,
    ph: phaseData[phaseIndex],
    phPos: `${phaseIndex + 1} / ${phaseData.length}`,
    phModalCls: closing ? "" : "show",
    phModalHidden: false,
    phModalTab: 0,
    closePhase: close,
    prevPhase: () => stepPhase(-1),
    nextPhase: () => stepPhase(1),
    phaseToBrief: openBrief,
    phaseKey: (e: KeyboardEvent<HTMLElement>) => {
      keyClose(e);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepPhase(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepPhase(-1);
      }
    },
    menuCls: menu && !closing ? "open" : "",
    menuExp: menu,
    menuHidden: !menu,
    menuTab: menu ? 0 : -1,
    menuLabel: menu ? ui.menuClose : ui.menuOpen,
    toggleMenu: () => (menu ? close() : setOverlay({ type: "menu" })),
    closeMenu: close,
    openBrief,
    closeBrief: close,
    bfKey: keyClose,
    bfCls: closing ? "" : "show",
    bfOx: origin.x,
    bfOy: origin.y,
    bfHidden: !briefOpen,
    bfTab: 0,
    ...values,
    nameShown: values.name.trim(),
    contactShown: values.contact.trim(),
    ctxTitle: values.ctx,
    hasCtx: !!values.ctx,
    onName: field("name"),
    onContact: field("contact"),
    onCompany: field("company"),
    onComment: field("comment"),
    onScale: field("scale"),
    onWebsite: field("website"),
    onConsent: (e: ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, consent: e.target.checked })),
    clearCtx: () => setValues((v) => ({ ...v, ctx: "" })),
    formats: lead.formats.map((label) => ({
      label,
      on: values.formats.includes(label),
      cls: values.formats.includes(label) ? "on" : "",
      pick: () =>
        setValues((v) => ({
          ...v,
          formats: v.formats.includes(label)
            ? v.formats.filter((f) => f !== label)
            : [...v.formats, label],
        })),
    })),
    scales: lead.scales,
    nameErrCls: nameErr ? "err" : "",
    contactErrCls: contactErr ? "err" : "",
    nameInvalid: nameErr,
    contactInvalid: contactErr,
    hintRole: fphase === "error" ? "alert" : "note",
    hintColor: fphase === "error" ? "#FFB4B4" : "rgba(255,255,255,.58)",
    hintText: nameErr
      ? lead.nameError
      : contactErr
        ? lead.contactError
        : consentErr ||
            (!values.consent && values.name.trim() && values.contact.trim())
          ? lead.consentError
          : lead.hint,
    // Keep the original disabled-until-ready interaction; submit still validates independently.
    cantSubmit:
      sending ||
      !values.name.trim() ||
      !values.contact.trim() ||
      !values.consent,
    isSending: sending,
    notSending: !sending,
    submitLabel: sending ? lead.sending : lead.submit,
    submit,
    isNetwork: fphase === "network",
    isSuccess: fphase === "success",
    showForm: fphase !== "success",
    resetForm: () => {
      if (!inFlight.current) {
        setValues(emptyForm());
        setFormPhase("idle");
      }
    },
  };
}

type PatronController = ReturnType<typeof usePatronController>;
const PatronContext = createContext<PatronController | null>(null);
export function PatronProvider({ children }: { children: ReactNode }) {
  const controller = usePatronController();
  return (
    <PatronContext.Provider value={controller}>
      {children}
    </PatronContext.Provider>
  );
}
export function usePatron() {
  const value = useContext(PatronContext);
  if (!value) throw new Error("PatronProvider missing");
  return value;
}
