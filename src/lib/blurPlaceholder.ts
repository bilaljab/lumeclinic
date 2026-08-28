/**
 * Shared blur-up placeholder for `next/image`. Sources are referenced by
 * string path (not static `import`), so Next can't auto-generate a
 * per-image blurDataURL — this single flat tint (the site's --color-border
 * token) stands in for one, so images fade in instead of popping in blank
 * once they scroll into view and lazy-load. Precomputed (not built with
 * `Buffer`) so it's safe to import from client components too.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlMmRhZDAiLz48L3N2Zz4=";
