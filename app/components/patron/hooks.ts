"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function useSectionObserver() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(entry.target.getAttribute("data-sec") || "");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document
      .querySelectorAll("[data-sec]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function useScrollProgress(onHeroExit: () => void) {
  const heroExit = useEffectEvent(onHeroExit);
  const [scroll, setScroll] = useState({ progress: 0, heroOut: false });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > 560) heroExit();
      setScroll({
        progress: max > 0 ? Math.min(1, window.scrollY / max) : 0,
        heroOut: window.scrollY > 560,
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return scroll;
}

export function useMoscowClock(timeZone = "Europe/Moscow") {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setTimestamp(Date.now());
    update();
    const timer = setInterval(update, 20000);
    return () => clearInterval(timer);
  }, []);
  return timestamp === null ? '00:00' : new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit', minute: '2-digit', timeZone,
  });
}

// Pointer capture begins only after horizontal intent; vertical touch scrolling remains native.
export function useSwipe(onSwipe: (direction: number) => void, threshold = 70) {
  const gesture = useRef<{
    x: number;
    y: number;
    dx: number;
    drag: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    },
    [],
  );
  const [offset, setOffset] = useState(0);
  return {
    offset,
    suppressClick,
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      if (
        e.button > 0 ||
        (e.target as HTMLElement).closest("input, select, textarea, .seg5")
      )
        return;
      suppressClick.current = false;
      gesture.current = { x: e.clientX, y: e.clientY, dx: 0, drag: false };
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      const g = gesture.current;
      if (!g) return;
      g.dx = e.clientX - g.x;
      if (
        !g.drag &&
        Math.abs(g.dx) > 8 &&
        Math.abs(g.dx) > Math.abs(e.clientY - g.y)
      ) {
        g.drag = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (g.drag) setOffset(g.dx);
    },
    onPointerUp: () => {
      const g = gesture.current;
      gesture.current = null;
      setOffset(0);
      if (!g?.drag) return;
      suppressClick.current = true;
      clickTimer.current = setTimeout(() => {
        suppressClick.current = false;
      }, 60);
      if (Math.abs(g.dx) > threshold) onSwipe(g.dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      gesture.current = null;
      setOffset(0);
    },
  };
}

export function useOverlayState<T>() {
  const [overlay, setOverlay] = useState<T | null>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const open = (value: T | null) => {
    if (timer.current) clearTimeout(timer.current);
    setClosing(false);
    setOverlay(value);
  };
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOverlay(null);
      setClosing(false);
      return;
    }
    setClosing(true);
    timer.current = setTimeout(() => {
      setOverlay(null);
      setClosing(false);
    }, 800);
  };
  return { overlay, open, close, closing };
}

export function useDialogFocus(active: string | null, close: () => void) {
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  }, [close]);
  const origin = useRef<HTMLElement | null>(null);
  const open = !!active;
  useEffect(() => {
    if (!open) return;
    origin.current = document.activeElement as HTMLElement;
    const bodyOverflow = document.body.style.overflow;
    const bodyPadding = document.body.style.paddingRight;
    const page = document.getElementById("patron-page");
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap) document.body.style.paddingRight = `${gap}px`;
    if (page) page.inert = true;
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.body.style.paddingRight = bodyPadding;
      if (page) page.inert = false;
      if (origin.current?.isConnected)
        origin.current.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => {
    if (!active) return;
    const root = document.querySelector<HTMLElement>("[data-overlay-root]");
    if (!root) return;
    const focusables = () =>
      [
        ...root.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ),
      ].filter(
        (el) =>
          !el.closest("[inert]") &&
          el.getClientRects().length &&
          getComputedStyle(el).visibility !== "hidden",
      );
    const frame = requestAnimationFrame(() => {
      (
        root.querySelector<HTMLElement>('input[name="name"]') ||
        focusables()[0] ||
        root
      ).focus({ preventScroll: true });
    });
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
      }
      if (e.key !== "Tab") return;
      const nodes = focusables();
      const first = nodes[0],
        last = nodes.at(-1);
      if (!first) {
        e.preventDefault();
        root.focus();
        return;
      }
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !root.contains(document.activeElement))
      ) {
        e.preventDefault();
        last?.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !root.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", key);
    };
  }, [active]);
}
