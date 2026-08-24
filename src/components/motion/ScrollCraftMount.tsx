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
 */
function adaptMobilePins() {
  if (window.innerWidth >= 768) return;
  document.querySelectorAll("[data-sc-mobile-flow]").forEach((el) => {
    el.setAttribute("data-sc-act", "flow");
    el.removeAttribute("data-sc-span");
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
      }}
    />
  );
}
