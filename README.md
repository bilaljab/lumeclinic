# LUMÉ

Premium aesthetic-clinic landing page template. Fictional brand, built as a portfolio showcase and a reusable base for real clinic clients — not a production clinic system.

Full product spec: [LUME_PRD.md](LUME_PRD.md). Full tech spec: [LUME_TECH_STACK.md](LUME_TECH_STACK.md).

## Goals

- Demonstrate high-end frontend/motion craft (portfolio piece).
- Convert visitors toward a "Book Consultation" action.
- Bilingual EN/AR, with Arabic treated as a first-class layout, not a mirrored translation.
- Rebuildable for a different clinic by swapping content/theme/images, not components.

## Stack

Next.js, React, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, next-intl (EN/AR), React Hook Form + Zod, Lucide React icons. Optional: Lenis (smooth scroll), React Three Fiber (3D). No backend, database, or auth — content is local TypeScript data, booking ends in a mock confirmation. Deployed on Vercel.

## Running the project

Not yet bootstrapped — this repo currently holds only the PRD, tech stack doc, and Claude Code governance files. Once the Next.js app is scaffolded, this section should document:

```
npm install
npm run dev
```

## Project structure

```
src/
├── app/[locale]/     # routes, per PRD §6 sections
├── components/       # by domain: hero, treatments, doctors, results, booking, motion
├── data/              # treatments, doctors, packages, results, testimonials
├── config/            # site.ts, theme.ts — brand config
└── lib/
```

## Adapting the template for another clinic

Change: brand name, logo, colors, fonts, images, doctors, treatments, packages, contact info — all in `src/config/` and `src/data/`. Components and interaction patterns should not need to change. See Tech Stack §19 for the full content/theme/component split.
