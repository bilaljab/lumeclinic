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
    <figure className="flex w-[82vw] shrink-0 snap-start flex-col sm:w-[420px] lg:w-[440px]">
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
 * In Their Words — a horizontal strip the visitor can move themselves
 * (mouse-drag on desktop, native touch panning on mobile) in addition to a
 * gentle idle auto-scroll on desktop. Auto-scroll and manual drag both
 * operate on the element's real `scrollLeft` (not a CSS transform), which
 * is what lets them coexist without fighting each other. Desktop loops
 * seamlessly via a duplicated track; mobile has no auto-motion and no
 * duplicate — plain native scroll-snap. Reduced motion drops the idle
 * auto-scroll only; manual scrolling still works either way.
 */
export function TestimonialMarquee() {
  const lang = useLocale() as keyof LocalizedText;
  const rtl = lang === "ar";
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const autoScroll = isDesktop && !reducedMotion;

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
    if (e.pointerType === "touch") return; // native touch panning already handles this
    const el = wrapRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    draggingRef.current = true;
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
      className="rail relative mt-10 -mx-page-x-sm cursor-grab overflow-x-auto select-none active:cursor-grabbing lg:mx-0"
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
      <div className="testimonial-track flex w-max gap-8 px-page-x-sm snap-x snap-mandatory lg:snap-none lg:px-0">
        <div className="flex shrink-0 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} lang={lang} />
          ))}
        </div>
        <div aria-hidden className="testimonial-track-dup hidden shrink-0 gap-8 lg:flex">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={`dup-${testimonial.id}`} testimonial={testimonial} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
