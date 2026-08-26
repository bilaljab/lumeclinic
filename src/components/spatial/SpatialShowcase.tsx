"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { SpatialStageCSS } from "./SpatialStageCSS";
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

  const dragRef = useRef<{ startX: number } | null>(null);
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    dragRef.current = { startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = dragRef.current;
    dragRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.startX;
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
        onPointerUp={onPointerUp}
      >
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
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label={labels.previous}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink transition-[color,border-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <PrevIcon aria-hidden size={16} />
            </button>

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

            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label={labels.next}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink transition-[color,border-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <NextIcon aria-hidden size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
