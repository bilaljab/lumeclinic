"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { canUseWebGL } from "@/lib/webgl";
import { cn } from "@/lib/cn";

const BrandScene = dynamic(() => import("@/components/motion/BrandScene").then((m) => m.BrandScene), {
  ssr: false,
});

// The capability check never changes after mount, so there's nothing to
// subscribe to — but useSyncExternalStore is still the right tool here: its
// getServerSnapshot gives a hydration-safe "false" on the server/first paint
// without a setState-in-effect render cascade, unlike a plain useEffect.
function subscribe() {
  return () => {};
}
function getReadySnapshot() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  return !reduced && desktop && canUseWebGL();
}
function getServerSnapshot() {
  return false;
}

/**
 * Gates the R3F "Science" beat scene behind desktop + !prefers-reduced-motion
 * + a real WebGL capability check, so the `three`/`@react-three/fiber` bundle
 * is never even requested on mobile or under reduced motion — the static
 * ImageWrapper underneath (rendered by the server-component parent) stays
 * the permanent fallback for all three cases plus SSR.
 */
export function BrandSceneGate({ sectionId }: { sectionId: string }) {
  const ready = useSyncExternalStore(subscribe, getReadySnapshot, getServerSnapshot);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <BrandScene sectionId={sectionId} />
    </div>
  );
}
