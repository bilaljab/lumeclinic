# Motion rules

Source: LUME_PRD.md §11, LUME_TECH_STACK.md §5.

- GSAP + ScrollTrigger is the core animation system. Must use the `gsap-skills` skill when writing any GSAP/ScrollTrigger code — don't hand-write timeline/scroll logic from memory.
- Motion should feel expensive and controlled, not decorative. Every animation needs a purpose: hero entrance, typography reveal, image reveal, scroll storytelling, hover feedback, before/after interaction, CTA micro-interaction.
- Always respect `prefers-reduced-motion` — provide a reduced/static fallback, don't just disable scroll.
- Scroll-driven storytelling sections (brand narrative, treatment journey) use the `scroll-craft` skill.
- Lenis smooth scroll is optional — add only if it measurably improves the design, and integrate carefully with ScrollTrigger (don't let them fight over scroll position).
- 3D (React Three Fiber) is optional, lazy-loaded, lightweight geometry/materials, with a non-WebGL fallback for mobile/reduced-motion.
