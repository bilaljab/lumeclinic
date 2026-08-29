"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { SpatialStageCSS } from "./SpatialStageCSS";
import { optimizedTextureSrc } from "./textureSrc";
import type { SpatialShowcaseItem } from "./types";

const SpatialStageWebGL = dynamic(
  () => import("./SpatialStageWebGL").then((mod) => mod.SpatialStageWebGL),
  { ssr: false, loading: () => null },
);

export type SpatialShowcaseLabels = {
  previous: string;
  next: string;
  gallery: string;
};

export type SpatialShowcaseProps = {
  items: SpatialShowcaseItem[];
  mode: "treatment" | "doctor";
  labels: SpatialShowcaseLabels;
  neighborWindow?: number;
  className?: string;
};

function getServerFalse() {
  return false;
}

let cachedWebglSupport: boolean | null = null;
function detectWebglSupport() {
  if (cachedWebglSupport !== null) return cachedWebglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cachedWebglSupport = Boolean(gl);
  } catch {
    cachedWebglSupport = false;
  }
  return cachedWebglSupport;
}

function noopSubscribe() {
  return () => {};
}

function useWebglSupported() {
  return useSyncExternalStore(noopSubscribe, detectWebglSupport, getServerFalse);
}

/**
 * One spatial/3D showcase reused for both the Explore-by-Concern treatment
 * gallery and the Trained to Listen doctor showcase (see plan: "don't build
 * two galleries"). Each item's text/metadata/CTA is pre-rendered into
 * `item.overlay` by the caller (server or client) — never baked into the
 * canvas — so i18n, RTL, accessibility, and SEO all work exactly as they
 * would for any other section. The canvas is a decorative, `aria-hidden`
 * visual layer; every piece of navigation has a real, keyboard/
 * screen-reader-reachable control.
 */
export function SpatialShowcase({
  items,
  mode,
  labels,
  neighborWindow = 2,
  className,
}: SpatialShowcaseProps) {
  const locale = useLocale();
  const rtl = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  // Sticky once true, not a live in/out toggle: real-browser testing showed
  // repeatedly destroying and recreating the WebGL context as this section
  // scrolls in and out (mount → unmount → remount) is unreliable — a
  // remounted canvas sometimes rendered blank after a prior context loss.
  // Two showcases on this page is nowhere near a browser's WebGL context
  // limit, so the reliability win outweighs freeing the context on scroll-
  // away; `frameloop="demand"` already keeps it idle when off-screen.
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const webglSupported = useWebglSupported();
  const useWebGL = isDesktop && !reducedMotion && webglSupported;

  useEffect(() => {
    const el = stageWrapRef.current;
    if (!el || hasBeenInView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasBeenInView(true);
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBeenInView]);

  // Mounting SpatialStageWebGL is (rightly) gated behind scroll visibility —
  // no wasted WebGL contexts for a section the visitor hasn't reached. But
  // gating the *download* behind that same trigger means scrolling into view
  // kicks off a serial waterfall — fetch the three.js/@react-three/fiber
  // chunk, parse it, mount <Canvas>, then only *then* start fetching the
  // texture — with the canvas fully transparent for the whole chain. That
  // waterfall, not image weight (already routed through the optimizer, see
  // textureSrc.ts), is what actually reads as "the box sits empty." Warming
  // both the chunk and the first texture during idle time — well before the
  // visitor scrolls this far, decoupled from the mount gate — means the real
  // fetches are usually already cache-hits by the time IntersectionObserver
  // fires. Desktop/WebGL-only: the CSS fallback stage's plain <Image> has its
  // own lazy-loading heuristics and this shouldn't spend mobile data early.
  useEffect(() => {
    if (!useWebGL || hasBeenInView) return;
    const src = items[activeIndex]?.image.src;
    if (!src) return;
    const warm = () => {
      import("./SpatialStageWebGL");
      new window.Image().src = optimizedTextureSrc(src);
    };
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(warm, 200);
    return () => window.clearTimeout(timer);
  }, [useWebGL, hasBeenInView, items, activeIndex]);

  // R3F's <Canvas> mounting on this later, IntersectionObserver-triggered
  // render (rather than on initial page load) can measure its container
  // before that container's real box is settled, leaving the actual
  // <canvas> element stuck at the browser's unstyled 300x150 default. A
  // window `resize` event is what makes it re-measure and pick up the
  // correct size — nudge one once the stage has actually mounted.
  useEffect(() => {
    if (!hasBeenInView || !useWebGL) return;
    const nudge = () => window.dispatchEvent(new Event("resize"));
    // A single rAF wasn't reliably enough slack for the container's layout
    // to have settled — two more delayed nudges cover that without cost
    // (dispatching once the size is already correct is a harmless no-op).
    const raf = window.requestAnimationFrame(nudge);
    const t1 = window.setTimeout(nudge, 60);
    const t2 = window.setTimeout(nudge, 300);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hasBeenInView, useWebGL]);

  const lastIndex = items.length - 1;

  function goTo(index: number) {
    setActiveIndex((current) => {
      const clamped = Math.max(0, Math.min(lastIndex, index));
      return clamped === current ? current : clamped;
    });
  }

  function step(direction: 1 | -1) {
    const physical = rtl ? ((-direction) as 1 | -1) : direction;
    goTo(activeIndex + physical);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      step(rtl ? -1 : 1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      step(rtl ? 1 : -1);
      e.preventDefault();
    }
  }

  // Tracks the last-seen X on every move so a swipe still resolves correctly
  // even when the browser ends the gesture with `pointercancel` instead of
  // `pointerup` — which happens often on touch, since a finger swipe across
  // the gallery is rarely perfectly horizontal and the browser can hand the
  // gesture to native vertical scrolling mid-drag. Relying on the up/cancel
  // event's own (possibly stale or absent) coordinates dropped swipes.
  const dragRef = useRef<{ startX: number; lastX: number } | null>(null);
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // The overlay prev/next buttons live inside this same drag-handling
    // element. Without this check, setPointerCapture below (called on
    // every pointerdown, including ones that start on a button) hijacks
    // the mouseup/click that a real click depends on, so a real mouse
    // click on the overlay arrows silently did nothing — even though a
    // purely synthetic `.click()` call bypassed the whole pointer
    // pipeline and looked fine in isolation.
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { startX: e.clientX, lastX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (dragRef.current) dragRef.current.lastX = e.clientX;
  }
  function finishDrag() {
    const state = dragRef.current;
    dragRef.current = null;
    if (!state) return;
    const dx = state.lastX - state.startX;
    const THRESHOLD = 40;
    if (Math.abs(dx) < THRESHOLD) return;
    step(dx < 0 ? 1 : -1);
  }

  const activeItem = items[activeIndex];
  if (!activeItem) return null;

  const atStart = rtl ? activeIndex === lastIndex : activeIndex === 0;
  const atEnd = rtl ? activeIndex === 0 : activeIndex === lastIndex;
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <div className={cn("flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14", className)}>
      <div
        ref={stageWrapRef}
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-xs lg:aspect-[16/12] lg:flex-[1.1]"
        role="group"
        aria-roledescription="carousel"
        aria-label={labels.gallery}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label={labels.previous}
              className="absolute start-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas/90 text-ink backdrop-blur-sm transition-[color,border-color,background-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <PrevIcon aria-hidden size={24} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label={labels.next}
              className="absolute end-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas/90 text-ink backdrop-blur-sm transition-[color,border-color,background-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <NextIcon aria-hidden size={24} />
            </button>
          </>
        ) : null}
        {hasBeenInView ? (
          useWebGL ? (
            <SpatialStageWebGL
              items={items}
              activeIndex={activeIndex}
              mode={mode}
              rtl={rtl}
              neighborWindow={neighborWindow}
            />
          ) : (
            <SpatialStageCSS items={items} activeIndex={activeIndex} rtl={rtl} neighborWindow={1} />
          )
        ) : null}
      </div>

      <div className="flex flex-col gap-6 lg:flex-[0.9]">
        {activeItem.overlay}

        {items.length > 1 ? (
          <div className="flex items-center gap-4">
            <div role="tablist" aria-label={labels.gallery} className="flex items-center">
              {items.map((item, i) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-current={i === activeIndex}
                  aria-label={item.image.alt}
                  onClick={() => goTo(i)}
                  className="group flex h-6 w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-editorial",
                      i === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-border group-hover:bg-neutral",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
