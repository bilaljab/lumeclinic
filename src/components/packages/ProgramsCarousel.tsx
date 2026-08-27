"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWrapper } from "@/components/ui/ImageWrapper";
import { cn } from "@/lib/cn";
import type { SpatialShowcaseItem } from "@/components/spatial/types";

export type ProgramsCarouselLabels = { previous: string; next: string; gallery: string };

/**
 * Treatment Programs carousel — one program dominant at a time, image and
 * overlay content side by side. Shares its shell (controls, dot strip,
 * keyboard/drag navigation, RTL step direction) with SpatialShowcase's
 * proven pattern, but the stage itself is a plain crossfade instead of a
 * spatial fan: the depth cue here is `ImageWrapper`'s existing `tilt` prop
 * (the site's one shared pointer-tilt device, already used across
 * Explorer/Doctors/Packages imagery) rather than a bespoke effect, so this
 * doesn't introduce a fourth motion system alongside ScrollCraft/GSAP/R3F.
 */
export function ProgramsCarousel({
  items,
  labels,
  className,
}: {
  items: SpatialShowcaseItem[];
  labels: ProgramsCarouselLabels;
  className?: string;
}) {
  const locale = useLocale();
  const rtl = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
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

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      step(rtl ? -1 : 1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      step(rtl ? 1 : -1);
      e.preventDefault();
    }
  }

  // Same last-seen-X tracking as SpatialShowcase: a touch swipe can end in
  // pointercancel (native scroll takes over mid-gesture) rather than
  // pointerup, so relying on the up/cancel event's own coordinates drops
  // swipes intermittently.
  const dragRef = useRef<{ startX: number; lastX: number } | null>(null);
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
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
    if (Math.abs(dx) < 40) return;
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
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={item.key}
              aria-hidden={!isActive}
              inert={!isActive}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-300 ease-editorial",
                isActive ? "z-10 scale-100 opacity-100" : "pointer-events-none z-0 scale-[1.04] opacity-0",
              )}
            >
              <ImageWrapper
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                wrapperClassName="h-full w-full"
                className="rounded-none"
                tilt={5}
              />
            </div>
          );
        })}

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label={labels.previous}
              className="absolute start-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas/90 text-ink backdrop-blur-sm transition-[color,border-color,background-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <PrevIcon aria-hidden size={24} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label={labels.next}
              className="absolute end-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas/90 text-ink backdrop-blur-sm transition-[color,border-color,background-color] duration-200 ease-editorial hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <NextIcon aria-hidden size={24} />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 lg:flex-[0.9]">
        {activeItem.overlay}

        {items.length > 1 ? (
          <div role="tablist" aria-label={labels.gallery} className="flex items-center gap-4">
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
        ) : null}
      </div>
    </div>
  );
}
