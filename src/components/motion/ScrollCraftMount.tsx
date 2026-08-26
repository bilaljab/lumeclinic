"use client";

import Script from "next/script";
import { useRef } from "react";

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: Document | Element) => unknown;
      reduce: boolean;
      instances: unknown[];
    };
    __scrollCraftMounted?: boolean;
  }
}

/**
 * A pinned act's stage is a fixed-height sticky frame (overflow: clip) — fine
 * for content that fits one viewport, but a multi-item section stacked in a
 * single mobile column (e.g. Brand Statement's 3 beats, Treatment Journey's
 * 5 steps) can genuinely be taller than one small-phone viewport, and
 * anything past the fold is then unreachable: the stage never scrolls
 * internally, only the page around it does. Rather than a fixed span number
 * that's wrong for one device or the other, sections that hit this opt in
 * via data-sc-mobile-flow; on a narrow viewport this rewrites them to a
 * plain (non-pinned) flow act *before* mount() reads the DOM, so mobile
 * gets a genuinely different, unpinned sequential reveal instead of a
 * pin scaled down to a size it doesn't fit.
 *
 * A `flow` act's progress spans its own natural height plus one viewport
 * (`p = (scrollY + vh - top) / (height + vh)`), which is a different curve
 * than the pinned hold its `data-sc-cue`/`data-sc-pan` fractions were
 * authored against — a pinned act holds every cued element on the same
 * screen position for its whole span, so "reveal at p=0.6" means "60% of
 * the way through a dedicated, unmoving hold." Under `flow` the same 0.6
 * instead means "60% of the way through this block's entire scroll-through,"
 * which on a short block can land well after the *next* section has already
 * entered the viewport — the still-fading element and the next section's
 * content then share the screen at once. Two independent fixes, applied to
 * every `data-sc-mobile-flow` element uniformly rather than hand-tuned per
 * section, since both mismatches recur for any current or future section
 * that opts into mobile flow:
 *
 * 1. A horizontal pan rail (`data-sc-pan`) is driven the same way regardless
 *    of the act's device — translated by raw progress independent of
 *    `data-sc-act` — so under `flow` it still runs, sweeping its full width
 *    across a much shorter effective scroll distance and snapping the rail
 *    off-screen almost immediately. The rail's own `overflow-x-auto` is
 *    already the intended mobile fallback (native touch scroll), so the
 *    device is simply removed on mobile rather than fighting it.
 * 2. Every `data-sc-cue`'s `from` within the block is scaled down by one
 *    shared factor (keeping `to` and the ramp fraction) so the *latest* one
 *    finishes while at most OVERLAP_TOLERANCE of the next viewport-full is
 *    the next section — computed from this block's real `offsetHeight`
 *    rather than guessed, since that boundary depends on content length and
 *    device viewport height, neither known when the cue values were
 *    authored. A single shared factor is deliberate: solving each cue's
 *    `from` independently would collapse a whole sequence (e.g. five
 *    staggered steps) onto the same instant the moment more than one of
 *    them overshoots, since the target completion point doesn't depend on
 *    where a cue started. Scaling every `from` in the block by the same
 *    ratio keeps their relative order and spacing — the stagger just plays
 *    out faster — instead of erasing it.
 *
 *    The tolerance is deliberately not zero: requiring the reveal to finish
 *    before the next section's very first pixel is visible is the tightest
 *    possible reading of "no overlap," but on a block barely taller than one
 *    viewport it leaves almost no scroll distance for the reveal to play
 *    out in, which is what made every cue collapse to nearly the same early
 *    instant and read as static rather than animated. Finishing while the
 *    next section is still only a sliver at the very bottom keeps the
 *    overlap the original bug report meant (the next section clearly
 *    sharing the screen while this one is still fading in) fixed, while
 *    giving the reveal roughly its full authored pacing back on a block
 *    that already had enough height for it — which is exactly why this
 *    barely touches Treatment Journey's already-tuned values below.
 */
const OVERLAP_TOLERANCE = 0.35;

function adaptMobilePins() {
  if (window.innerWidth >= 768) return;
  const vh = window.innerHeight;
  document.querySelectorAll("[data-sc-mobile-flow]").forEach((el) => {
    el.setAttribute("data-sc-act", "flow");
    el.removeAttribute("data-sc-span");
    el.querySelectorAll("[data-sc-pan]").forEach((rail) => rail.removeAttribute("data-sc-pan"));

    const height = (el as HTMLElement).offsetHeight;
    const safeEnd = (height + vh * OVERLAP_TOLERANCE) / (height + vh);

    const cues = [...el.querySelectorAll("[data-sc-cue]")]
      .map((cueEl) => {
        const [from = 0, to = 1, rIn = 0, rOut = 0] = (cueEl.getAttribute("data-sc-cue") || "")
          .trim()
          .split(/\s+/)
          .map(Number);
        return { cueEl, from, to, rIn, rOut };
      })
      // unbounded hold + a real "from" only: to<1 cues are self-contained
      // (already bounded, not this block's overlap concern) and from===0
      // cues are already always-visible — neither needs or can be scaled.
      .filter((c) => c.to >= 1 && c.from > 0);
    if (cues.length === 0) return;

    const last = cues.reduce((a, b) => (b.from > a.from ? b : a));
    const lastInEnd = last.from + last.rIn * (last.to - last.from);
    if (lastInEnd <= safeEnd) return; // whole sequence already finishes in time

    const cap = (safeEnd - last.rIn * last.to) / (1 - last.rIn);
    const scale = Math.max(0, cap / last.from);
    cues.forEach((c) => {
      c.cueEl.setAttribute("data-sc-cue", [c.from * scale, c.to, c.rIn, c.rOut].join(" "));
    });
  });
}

/**
 * Loads and mounts the ScrollCraft engine once for the whole page — the
 * primary scroll-motion runtime (see LUME_CREATIVE_DIRECTION.md + Phase 05
 * plan). Every section authors plain data-sc-* attributes; this is the only
 * client wiring most of them need.
 *
 * The engine exposes no destroy()/teardown (it attaches page-lifetime window
 * listeners), so guard against calling mount() twice — React Strict Mode's
 * dev double-invoke would otherwise double every scroll/resize/pointermove
 * listener on the page.
 */
export function ScrollCraftMount() {
  const mounted = useRef(false);

  return (
    <Script
      src="/scrollcraft.js"
      strategy="afterInteractive"
      onReady={() => {
        if (mounted.current || !window.ScrollCraft) return;
        mounted.current = true;
        adaptMobilePins();
        window.ScrollCraft.mount(document.body);
        // ScrollCraft's own pinned sections (Brand Statement, Before/After
        // peak, Treatment Journey) insert their pin-spacing here, shifting
        // everything below by thousands of px. Anything else on the page
        // that measured its own scroll-trigger positions before this line
        // ran (e.g. GSAP ScrollTrigger in SpatialStackScroll) is now stale
        // — this flag/event lets that code know when it's safe to refresh.
        window.__scrollCraftMounted = true;
        window.dispatchEvent(new Event("scrollcraft:mounted"));
      }}
    />
  );
}
