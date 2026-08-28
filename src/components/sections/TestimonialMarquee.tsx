"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import type { LocalizedText, Testimonial } from "@/data/types";

const AUTO_SCROLL_PX_PER_SEC = 28;
const KEYBOARD_STEP_PX = 320;

function TestimonialCard({ testimonial, lang }: { testimonial: Testimonial; lang: keyof LocalizedText }) {
  const treatment = testimonial.treatmentSlug
    ? treatments.find((tr) => tr.slug === testimonial.treatmentSlug)
    : undefined;

  return (
    <figure className="flex w-[82vw] shrink-0 flex-col sm:w-[420px] lg:w-[440px]">
      <div className="relative flex h-full flex-col rounded-sm border border-border bg-canvas p-8">
        <span aria-hidden className="select-none font-display text-[5rem] leading-none text-accent/10">
          &ldquo;
        </span>
        <blockquote className="mt-2 font-display text-display-m leading-snug">
          &ldquo;{testimonial.quote[lang]}&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-label uppercase tracking-label text-neutral">
          {testimonial.authorInitial}
          {treatment ? ` · ${treatment.name[lang]}` : ""}
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * In Their Words — moves by itself at rest, at every viewport size, and the
 * visitor can take over any time (mouse-drag, touch, or keyboard).
 *
 * Rebuilt after three straight failures trying to make this coexist with a
 * genuine native scroll container (`overflow-x-auto` + `scrollLeft`):
 * native touch scroll fighting the idle rAF loop, then a pointer-capture
 * "fix" that a real phone silently released without pointercancel/pointerup
 * (freezing the loop forever), then a scroll-event-based pause that still
 * left idle motion depending on `scrollLeft` writes a real mobile browser
 * doesn't reliably animate the same way desktop/headless testing does
 * (compounded by `html { scroll-behavior: smooth }` in scrollcraft.css,
 * which per spec shouldn't reach a nested scroll container but is exactly
 * the kind of cross-browser inconsistency native scrolling exposed here).
 *
 * Every other draggable gallery in this codebase (SpatialShowcase,
 * ProgramsCarousel) sidesteps all of that by never touching native
 * scrolling at all: `overflow-hidden` + a single `transform: translateX()`
 * driven entirely by JS, for both idle motion and drag. That pattern is
 * proven working on real mobile elsewhere in this project, so this rebuild
 * adopts it instead of a fourth patch on the scrollLeft approach.
 */
export function TestimonialMarquee() {
  const lang = useLocale() as keyof LocalizedText;
  const rtl = lang === "ar";
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const autoScroll = !reducedMotion;

  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const visibleRef = useRef(false);

  function applyOffset() {
    const track = trackRef.current;
    if (!track) return;
    // The track is two identical copies back to back; wrapping into that
    // ±half window (rather than ever letting it grow unbounded) is what
    // makes the loop and free dragging both land on a seamless repeat.
    const half = track.scrollWidth / 2;
    if (half > 0) {
      while (offsetRef.current <= -half) offsetRef.current += half;
      while (offsetRef.current >= half) offsetRef.current -= half;
    }
    track.style.transform = `translateX(${offsetRef.current}px)`;
  }

  // Stop ticking entirely while the strip is scrolled off-screen — otherwise
  // this rAF loop runs for the whole page lifetime regardless of where the
  // visitor is (every other continuous-motion device in this codebase, e.g.
  // SpatialStageWebGL's frameloop="demand", already gates on visibility).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    // RTL reads forward toward the left edge, so idle drift moves the
    // opposite way from LTR instead of reusing a raw browser scrollLeft
    // sign convention that differs across engines in RTL anyway.
    const direction = rtl ? 1 : -1;
    let last = performance.now();
    let raf = requestAnimationFrame(step);

    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && !draggingRef.current && visibleRef.current) {
        offsetRef.current += direction * AUTO_SCROLL_PX_PER_SEC * dt;
        applyOffset();
      }
      raf = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(raf);
  }, [autoScroll, rtl]);

  const dragState = useRef<{ startX: number; startOffset: number } | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    dragState.current = { startX: e.clientX, startOffset: offsetRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    if (!state) return;
    offsetRef.current = state.startOffset + (e.clientX - state.startX);
    applyOffset();
  }

  function endDrag() {
    dragState.current = null;
    draggingRef.current = false;
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const forward = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    offsetRef.current += (forward ? -1 : 1) * KEYBOARD_STEP_PX;
    applyOffset();
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      tabIndex={0}
      className="relative mt-10 -mx-page-x-sm cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing lg:mx-0 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div ref={trackRef} className="testimonial-track flex w-max gap-8 px-page-x-sm lg:px-0">
        <div className="flex shrink-0 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} lang={lang} />
          ))}
        </div>
        <div aria-hidden className="testimonial-track-dup flex shrink-0 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
