import type { ReactNode } from "react";

/**
 * A single slide for SpatialShowcase. Overlay content is pre-rendered
 * (server or client, whichever the caller is) rather than passed as a
 * render-prop function — functions aren't serializable across the
 * Server/Client Component boundary, and a server-rendered `Doctors` section
 * needs to hand a client showcase its per-doctor JSX the same way any
 * Server Component hands a Client Component its `children`.
 */
export type SpatialShowcaseItem = {
  key: string;
  image: { src: string; alt: string };
  overlay: ReactNode;
};
