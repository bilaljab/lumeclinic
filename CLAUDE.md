# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LUMÉ — fictional premium aesthetic-clinic landing page. Portfolio/template piece, not a real clinic system. Riyadh market reference, EN/AR bilingual.

**Source of truth:** [LUME_PRD.md](LUME_PRD.md) (product) and [LUME_TECH_STACK.md](LUME_TECH_STACK.md) (tech). Read both before any implementation work. When this file conflicts with either, PRD/Tech Stack win — fix this file, don't silently override them.

## Principles

**Frontend-first.** No backend, no DB, no auth, no CMS, no payments. Mock content lives in TypeScript data files (`src/data/`), booking flow ends in a fake confirmation state. See Tech Stack §18 for the explicit no-build list.

**Reusable template.** Content, theme, and components stay separated. A new clinic = swap brand config, content data, and images — not rebuild components. Never hardcode clinic-specific copy/colors inside a component; it belongs in `src/config/` or `src/data/`.

**Visual quality bar.** Premium, editorial, clinical-but-not-sterile. Explicitly avoid: generic hospital aesthetics, heavy blue medical UI, cheap gradients, generic stock imagery, dashboard-style cards, excessive rounded containers, flashy-for-its-own-sake animation. If a section looks like a generic SaaS template, it's wrong.

**Motion.** GSAP + ScrollTrigger is the core animation system, reusable across future clinic templates. Motion should feel expensive and controlled — earn its place (hero entrance, scroll storytelling, reveals, micro-interactions), never decorative filler. Always respect `prefers-reduced-motion`.

**Conversion.** Booking CTA stays visible everywhere: persistent navbar CTA on desktop, sticky bottom CTA on mobile, WhatsApp always reachable with contextual prefilled messages. Every section should nudge toward Book Consultation without feeling pushy.

**Arabic/English.** Arabic is a first-class layout, not mirrored/translated LTR. RTL affects navigation, typography, spacing, alignment, motion direction, and component layout — design it, don't auto-flip it. Routing via `next-intl` under `/en` and `/ar`.

## Engineering rules

- Next.js + React + TypeScript + Tailwind. No new dependency unless Tech Stack §2 lists it or the task genuinely can't be done without one.
- Lenis (smooth scroll) and React Three Fiber (3D) are optional — add only if the design benefits, not because they're available.
- Design tokens (colors, type, spacing, radii, motion) belong in the Tailwind config / theme file, not scattered inline styles.
- Server Components by default; reach for client components only where interaction/motion requires it.
- No speculative abstraction: don't build config layers, admin tooling, or backend scaffolding "for when this becomes a real client site" (see Tech Stack §18, §20 Future Extensions).

## Required skill workflow

Mandatory skills for build phases — invoke the actual installed skill, don't approximate from memory:

| Skill | When |
|---|---|
| `scroll-craft` | Scroll-driven storytelling sections |
| `frontend-design` | Aesthetic direction, typography, layout decisions |
| `gsap-skills` | Any GSAP/ScrollTrigger animation work |
| `arabic-design` | Any Arabic text, RTL layout |
| `cro` | Conversion-critical sections (CTAs, booking, hero) |
| `impeccable` | UI polish/critique passes |

QA skills (verification phase): `performance`, `core-web-vitals`, `accessibility`, `chrome-devtools-mcp`, `web-quality-audit`.

**A skill being conceptually understood does not count as using it.** Recognizing what a skill would say is not the same as invoking it. Never imitate or approximate a mandatory skill from memory when the real one is available, and never hand-reproduce a skill's style/output and claim the skill was used. If a mandatory skill for the current phase fails to load or invoke, **stop that phase** — do not proceed with an approximation.

## Phase workflow

Work proceeds in phases, tracked in [.claude/project-state.md](.claude/project-state.md) (current phase, completed/pending work, decisions, known issues). Each phase has an explicit scope — do not pull work forward from a later phase or declare the overall project complete from inside one phase. At the end of a phase, update project-state.md with what was done and the exact next phase before stopping.

## Verification

Before calling any UI work done: run it in a real browser (`chrome-devtools-mcp` or equivalent), check both `/en` and `/ar`, check mobile viewport, check `prefers-reduced-motion`. Passing TypeScript/lint is not the same as the feature working — say so explicitly if visual verification wasn't possible.

## Anti-overengineering

This is a demo template, not a production platform. Do not add: auth, real booking backend, database, CMS, payment processing, admin dashboard, CRM, microservices (Tech Stack §18). Do not build abstractions for hypothetical future clients beyond the content/theme/component separation already required. Three similar sections is fine — don't build a generic "SectionRenderer" for it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
