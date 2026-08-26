"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";
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
 * scrubbed to scroll. Desktop/no-reduced-motion only (gsap.matchMedia);
 * mobile and prefers-reduced-motion render the plain vertical flow passed
 * as `staticContent` instead — a different DOM shape, not just different
 * inline styles, since a pinned/absolute layout has no readable un-animated
 * resting state of its own.
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stacked = isDesktop && !reducedMotion;

  useGSAP(
    () => {
      if (!stacked || !stageRef.current) return;
      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (cards.length === 0) return;

      const n = cards.length;

      const applyFrame = (progress: number) => {
        cards.forEach((card, i) => {
          const enter = i === 0 ? 1 : clamp01(progress - (i - 1));
          const recede = clamp01(progress - i);
          const scale = 1 - ENTER_SCALE * (1 - enter) - RECEDE_SCALE * recede;
          const y = ENTER_Y * (1 - enter) - RECEDE_Y * recede;
          const baseOpacity = i === 0 ? 1 : enter;
          const opacity = baseOpacity * (1 - RECEDE_OPACITY * recede);
          gsap.set(card, { scale, yPercent: y, autoAlpha: opacity });
          const isForeground = opacity > 0.85;
          card.style.pointerEvents = isForeground ? "auto" : "none";
          // pointer-events alone doesn't remove a receded/not-yet-revealed
          // card's links from Tab order or the a11y tree — `inert` does both,
          // so keyboard/screen-reader users only ever reach the one card
          // that's actually in focus.
          card.inert = !isForeground;
        });
      };

      applyFrame(0);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80px",
        end: () => "+=" + n * 0.62 * window.innerHeight,
        pin: stageRef.current,
        scrub: 0.4,
        onUpdate: (self) => applyFrame(self.progress * n),
      });

      return () => {
        trigger.kill();
        gsap.set(cards, { clearProps: "all" });
      };
    },
    { scope: sectionRef, dependencies: [stacked, items.length] },
  );

  if (!stacked) {
    return <div className={className}>{staticContent}</div>;
  }

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
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
  );
}
