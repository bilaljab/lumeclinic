# Frontend engineering rules

Source: LUME_TECH_STACK.md.

- Next.js + React + TypeScript + Tailwind CSS. No new dependency unless it's in Tech Stack §2 or the task is genuinely impossible without one — check the dependency ladder before installing anything.
- No backend, database, or auth. Content lives in `src/data/*.ts`; brand/theme config lives in `src/config/*.ts`. Booking flow (Treatment → Doctor → Date → Details → Confirmation) ends in a mock success state — no real appointment engine.
- i18n via `next-intl`, routes under `/en` and `/ar`. Arabic layout is designed, not auto-mirrored — use the `arabic-design` skill for any Arabic text or RTL layout work.
- Server Components by default; client components only where interaction or animation state requires it.
- Forms: React Hook Form + Zod.
- Images/video: optimize, lazy-load non-critical media, modern formats where practical.
- Components organized by domain (hero, treatments, doctors, results, booking, motion), not by file type.
- Don't scaffold for the "future extensions" in PRD §18 (real backend, CMS, CRM, payments, admin) — that work starts only when adapting the template for an actual client.
