"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { useLocale } from "next-intl";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { testimonials } from "@/data/testimonials";
import { treatments } from "@/data/treatments";
import type { LocalizedText, Testimonial } from "@/data/types";

const AUTO_SCROLL_PX_PER_SEC = 28;
// How long after any scroll movement NOT caused by the auto-scroll loop
// itself (native touch scroll, mouse-drag, keyboard) to keep the idle loop
// paused before resuming. A cooldown window rather than an exact "did the
// interaction end" signal, because that signal is the part that's fragile —
// see the comment on the scroll listener below.
const EXTERNAL_SCROLL_COOLDOWN_MS = 150;

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
 * visitor can take over any time (mouse-drag, or native touch scroll on
 * mobile). Auto-scroll and manual scrolling both operate on the element's
 * real `scrollLeft` (not a CSS transform), and the track is duplicated at
 * every size so the idle loop always has a seamless seam to wrap on.
 *
 * Touch deliberately does NOT go through a JS pointer-drag path — this
 * element is a genuine native scroll container (`overflow-x-auto`), and
 * layering `setPointerCapture` on top of that turned out to be the wrong
 * call: on a real phone, a captured touch pointer on a scrollable element
 * can be released by the browser (handing the gesture to native scrolling)
 * without ever firing `pointercancel`/`pointerup`, which left this
 * component's old drag-tracking flag stuck "dragging" forever and froze
 * the idle loop permanently. Touch scrolling is left entirely to the
 * browser; the idle loop instead watches the element's native `scroll`
 * event to know when *anything* — touch, mouse-drag, keyboard — is moving
 * it externally, and pauses for a short cooldown around that, which works
 * the same way regardless of what caused the scroll.
 */
export function TestimonialMarquee() {
  const lang = useLocale() as keyof LocalizedText;
  const rtl = lang === "ar";
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const autoScroll = !reducedMotion;

  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const autoWritingRef = useRef(false);
  const lastExternalScrollRef = useRef(0);

  useEffect(() => {
    if (!autoScroll) return;
    const el = wrapRef.current;
    if (!el) return;

    function onScroll() {
      // Ignore the scroll events the loop's own writes below generate —
      // only a write from something else (touch, drag, keyboard) counts as
      // "the visitor is interacting," and should pause the idle loop.
      if (!autoWritingRef.current) lastExternalScrollRef.current = performance.now();
    }
    el.addEventListener("scroll", onScroll, { passive: true });

    const sign = rtl ? -1 : 1;
    let last = performance.now();
    let raf = requestAnimationFrame(step);

    function step(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const node = wrapRef.current;
      const recentlyExternal = now - lastExternalScrollRef.current < EXTERNAL_SCROLL_COOLDOWN_MS;
      if (node && !pausedRef.current && !recentlyExternal) {
        autoWritingRef.current = true;
        node.scrollLeft += sign * AUTO_SCROLL_PX_PER_SEC * dt;
        const half = node.scrollWidth / 2;
        while (Math.abs(node.scrollLeft) >= half) {
          node.scrollLeft += node.scrollLeft > 0 ? -half : half;
        }
        autoWritingRef.current = false;
      }
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [autoScroll, rtl]);

  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // Mouse only — see the component doc comment for why touch stays native.
    if (e.pointerType === "touch") return;
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
