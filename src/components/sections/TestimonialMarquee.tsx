"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import type { LocalizedText, Testimonial } from "@/data/types";

const AUTO_SCROLL_PX_PER_SEC = 28;

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
 * visitor can take over any time (mouse-drag, or touch on mobile). Auto-
 * scroll and manual drag both operate on the element's real `scrollLeft`
 * (not a CSS transform), which is what lets them coexist without fighting
 * each other, and the track is duplicated at every size so the idle loop
 * always has a seamless seam to wrap on. Reduced motion drops only the idle
 * auto-scroll; manual scrolling still works either way.
 */
export function TestimonialMarquee() {
  const lang = useLocale() as keyof LocalizedText;
  const rtl = lang === "ar";
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const autoScroll = !reducedMotion;

  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!autoScroll) return;
    const el = wrapRef.current;
    if (!el) return;

    const sign = rtl ? -1 : 1;
    let last = performance.now();
    let raf = requestAnimationFrame(step);

    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const node = wrapRef.current;
      if (node && !pausedRef.current && !draggingRef.current) {
        node.scrollLeft += sign * AUTO_SCROLL_PX_PER_SEC * dt;
        const half = node.scrollWidth / 2;
        while (Math.abs(node.scrollLeft) >= half) {
          node.scrollLeft += node.scrollLeft > 0 ? -half : half;
        }
      }
      raf = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(raf);
  }, [autoScroll, rtl]);

  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // Touch used to fall through to native scrolling instead of this handler,
    // relying on the browser to move `scrollLeft` on its own. That raced the
    // idle auto-scroll rAF loop below: if `draggingRef` ever read false for
    // even one frame while a native touch-scroll gesture was still in
    // progress, the loop's own `scrollLeft` write would fight the finger's
    // position on every subsequent frame, reading as the strip freezing or
    // refusing to move. Driving touch through the exact same manual
    // scrollLeft path as mouse (paired with `touch-pan-y` on the element so
    // the browser never also tries to scroll it natively) removes that race
    // entirely — same approach already used for drag in SpatialShowcase and
    // ProgramsCarousel.
    draggingRef.current = true;
    const el = wrapRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const state = dragState.current;
    const el = wrapRef.current;
    if (!state || !el) return;
    el.scrollLeft = state.startScrollLeft - (e.clientX - state.startX);
  }

  function endDrag() {
    dragState.current = null;
    draggingRef.current = false;
  }

  return (
    <div
      ref={wrapRef}
      className="rail relative mt-10 -mx-page-x-sm cursor-grab touch-pan-y overflow-x-auto select-none active:cursor-grabbing lg:mx-0"
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
    >
      <div className="testimonial-track flex w-max gap-8 px-page-x-sm lg:px-0">
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
