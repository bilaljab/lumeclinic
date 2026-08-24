/**
 * JS-side access to the Tailwind color tokens defined in globals.css.
 * Values live only in one place (globals.css) — this just reads them back
 * at runtime, for later GSAP color tweens (Phase 04+) that can't consume a
 * CSS custom property directly.
 */
export const colorTokens = {
  canvas: "--color-canvas",
  ink: "--color-ink",
  neutral: "--color-neutral",
  border: "--color-border",
  accent: "--color-accent",
  accentHover: "--color-accent-hover",
  groundDeep: "--color-ground-deep",
} as const;

export type ColorToken = keyof typeof colorTokens;

export function getColor(token: ColorToken): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(colorTokens[token])
    .trim();
}
