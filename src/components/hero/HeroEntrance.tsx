"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, gsap } from "@/components/motion/gsap";

/**
 * Layered entrance for the hero's text column — eyebrow, then each headline
 * line (perspective rotate-up, hero-23-inspired), then the CTAs one after the
 * other. Owns these elements exclusively: ScrollCraft's data-sc-cue was
 * removed from them (see Hero.tsx) so the two engines never fight over the
 * same transform/opacity — ScrollCraft keeps the background parallax planes.
 */
export function HeroEntrance({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          if (!scope.current) return;

          const eyebrow = scope.current.querySelector<HTMLElement>("[data-hero-eyebrow]");
          const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", scope.current);
          const ctaItems = gsap.utils.toArray<HTMLElement>("[data-hero-cta] > *", scope.current);

          if (reduced) {
            gsap.set([eyebrow, ...lines, ...ctaItems].filter((el): el is HTMLElement => el !== null), {
              clearProps: "all",
            });
            return;
          }

          if (!eyebrow) return;

          gsap.set(lines, { transformPerspective: 900, transformOrigin: "0% 100%" });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from(eyebrow, { autoAlpha: 0, y: 10, duration: 0.5 })
            .from(lines, { autoAlpha: 0, rotationX: -75, y: 24, duration: 0.9, stagger: 0.14 }, "-=0.2")
            .from(ctaItems, { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.12 }, "-=0.4");

          return () => {
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
