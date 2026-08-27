"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";

export type StackItem = { key: string; content: ReactNode };

const RECEDE_SCALE = 0.08;
const RECEDE_Y = 3;
const RECEDE_OPACITY = 0.35;
const ENTER_SCALE = 0.06;
const ENTER_Y = 6;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/**
 * Sticky-progression stack for Treatment Programs — one program pinned and
 * focused at a time, prior ones receding as thin depth cues behind it,
 * scrubbed to scroll.
 *
 * Both the pinned-stack markup and the plain mobile/reduced-motion flow are
 * ALWAYS in the DOM; only CSS (`hidden lg:motion-safe:block` /
 * `block lg:motion-safe:hidden`) decides which one is visible, and
 * `gsap.matchMedia()` — not a React conditional return — decides whether
 * the ScrollTrigger pin exists. Real-browser testing found a genuine bug
 * with the previous approach (a React-driven `if (!stacked) return
 * <different JSX>`): GSAP's `pin` wraps the pinned element in a pin-spacer
 * <div> it inserts directly into the DOM, outside React's knowledge. A live
 * window resize crossing the breakpoint (no page reload) could fire
 * React's own DOM patch for the conditional swap *before* the effect
 * cleanup (`trigger.kill()`) had a chance to un-wrap that pin-spacer,
 * leaving the new static content trapped inside a leftover wrapper still
 * carrying the pinned layout's inline height/padding — the exact "container
 * gone, cards stacked on top of each other" bug. Keeping the DOM shape
 * constant and letting GSAP's own matchMedia (which reverts everything it
 * created, via its own resize listener, independent of React's render
 * cycle) own the pin's existence removes that race entirely.
 */
export function SpatialStackScroll({
  items,
  staticContent,
  className,
}: {
  items: StackItem[];
  staticContent: ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (!stageRef.current || cards.length === 0) return;
      const n = cards.length;

      const applyFrame = (progress: number) => {
        cards.forEach((card, i) => {
          const enter = i === 0 ? 1 : clamp01(progress - (i - 1));
          // The last card has no successor to hand off to, so it must not
          // recede once it arrives — it holds fully visible/interactive
          // for the rest of the pin's range instead of fading to nothing.
          const recede = i === n - 1 ? 0 : clamp01(progress - i);
          const scale = 1 - ENTER_SCALE * (1 - enter) - RECEDE_SCALE * recede;
          const y = ENTER_Y * (1 - enter) - RECEDE_Y * recede;
          const baseOpacity = i === 0 ? 1 : enter;
          const opacity = baseOpacity * (1 - RECEDE_OPACITY * recede);
          gsap.set(card, { scale, yPercent: y, autoAlpha: opacity });
          const isForeground = opacity > 0.85;
          card.style.pointerEvents = isForeground ? "auto" : "none";
          card.inert = !isForeground;
        });
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reducedMotion } = context.conditions as {
            isDesktop: boolean;
            reducedMotion: boolean;
          };

          if (!isDesktop || reducedMotion) {
            // The static flow is what's actually visible here (CSS-driven);
            // just make sure no leftover pointer-events/inert state from a
            // previous desktop match lingers on the (hidden) stacked cards.
            cards.forEach((card) => {
              card.style.pointerEvents = "";
              card.inert = false;
            });
            return;
          }

          applyFrame(0);

          // Not manually killed: created inside this gsap.matchMedia()
          // callback, so `mm.revert()` (fired automatically the moment
          // this condition stops matching, via GSAP's own resize
          // listener) kills it — no React-render-timing race involved.
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80px",
            end: () => "+=" + n * 0.62 * window.innerHeight,
            pin: stageRef.current,
            scrub: 0.4,
            onUpdate: (self) => applyFrame(self.progress * n),
          });

          // This pin can be created before ScrollCraft's own pinned
          // sections above it have finished inserting their pin-spacing,
          // which shifts this section down by thousands of px — see
          // ScrollCraftMount's `scrollcraft:mounted` dispatch.
          const refresh = () => ScrollTrigger.refresh();
          if (window.__scrollCraftMounted) {
            refresh();
          } else {
            window.addEventListener("scrollcraft:mounted", refresh, { once: true });
          }

          return () => {
            window.removeEventListener("scrollcraft:mounted", refresh);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      <div className="hidden lg:motion-safe:block">
        <div ref={stageRef} className="relative h-[68vh] lg:h-[72vh]">
          {items.map((item, i) => (
            <div
              key={item.key}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ zIndex: i + 1 }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:motion-safe:hidden">{staticContent}</div>
    </div>
  );
}
