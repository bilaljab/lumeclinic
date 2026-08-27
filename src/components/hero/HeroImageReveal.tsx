"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, gsap } from "@/components/motion/gsap";

/**
 * Cinematic settle on load: the frame scales down from a slight overshoot
 * while fading in. Wraps the parallax planes rather than animating them
 * directly — ScrollCraft's data-sc-parallax writes its own transform to
 * those inner elements every scroll frame, so this scale/opacity lives on an
 * outer wrapper node instead of colliding with it.
 */
export function HeroImageReveal({ children }: { children: ReactNode }) {
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

          if (reduced) {
            gsap.set(scope.current, { clearProps: "all" });
            return;
          }

          gsap.set(scope.current, { transformOrigin: "50% 50%" });
          const tween = gsap.fromTo(
            scope.current,
            { scale: 1.1, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.4, ease: "power3.out" },
          );

          return () => {
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="absolute inset-0 overflow-hidden">
      {children}
    </div>
  );
}
