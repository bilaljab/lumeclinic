// A plane on the WebGL stage never displays anywhere near full source
// resolution, so texture loads route through Next's image optimizer at this
// width (one of its fixed allowed sizes) instead of fetching the original
// file. Shared with SpatialShowcase's early prefetch so both requests hit the
// exact same URL — required for the prefetch to actually warm the browser's
// HTTP cache for the loader that runs later.
export const TEXTURE_WIDTH = 828;

export function optimizedTextureSrc(src: string, width: number = TEXTURE_WIDTH) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
