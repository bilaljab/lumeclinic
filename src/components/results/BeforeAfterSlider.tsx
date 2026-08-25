"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  ariaLabel: string;
  isRtl: boolean;
};

/**
 * The signature comparison device (PRD §6.6) — a real drag/keyboard slider,
 * not a static image swap. Backed by a native `<input type="range">` (full
 * keyboard + screen-reader support for free) driving a clip-path reveal.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt,
  beforeLabel,
  afterLabel,
  ariaLabel,
  isRtl,
}: Props) {
  const [value, setValue] = useState(50);
  const id = useId();
  const linePos = isRtl ? 100 - value : value;
  const afterClip = isRtl ? `inset(0 0 0 ${100 - value}%)` : `inset(0 ${100 - value}% 0 0)`;

  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-xs border border-border focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2 md:aspect-[4/5]">
      <Image src={beforeSrc} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: afterClip }}>
        <Image src={afterSrc} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>

      {/* Captions sit outside the clipped "after" layer, on a solid chip, so both stay
          legible at every slider position regardless of what's underneath — not just
          once dragged past ~90% against a matching-tone background (impeccable critique). */}
      <span className="pointer-events-none absolute bottom-3 end-3 rounded-xs bg-ink/80 px-2 py-1 text-label uppercase tracking-label text-canvas">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute bottom-3 start-3 rounded-xs bg-ink/80 px-2 py-1 text-label uppercase tracking-label text-canvas">
        {afterLabel}
      </span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-canvas"
        style={{ left: `${linePos}%` }}
      >
        <span className="absolute top-1/2 start-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-canvas bg-ink text-canvas">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
          </svg>
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
