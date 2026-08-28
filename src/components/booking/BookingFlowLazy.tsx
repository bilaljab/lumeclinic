"use client";

import dynamic from "next/dynamic";

/**
 * react-hook-form + zod (BookingFlow's dependencies) shipped in every page's
 * initial JS even though the form is below-fold and interaction-only.
 * ssr:false defers the fetch to client mount, matching the same pattern
 * SpatialShowcase.tsx already uses for its WebGL chunk. The skeleton mirrors
 * the real form's shape (progress rail + treatment grid) so there's no blank
 * flash on a conversion-critical section.
 */
export const BookingFlowLazy = dynamic(() => import("./BookingFlow").then((mod) => mod.BookingFlow), {
  ssr: false,
  loading: () => (
    <div className="flex animate-pulse flex-col gap-8" aria-hidden="true">
      <div className="h-1 w-full bg-border" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 border border-border bg-border/40" />
        ))}
      </div>
    </div>
  ),
});
