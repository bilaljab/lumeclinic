# LUMÉ

A premium aesthetic-clinic website concept — fictional brand, imagined for the Riyadh market, in both English and Arabic.

## What this is

LUMÉ isn't a real clinic. It's a portfolio piece: a complete, polished website design for a high-end aesthetic clinic, built to show what that kind of site can look and feel like when it's done at a premium, editorial level instead of a generic template. It includes a treatment browser, doctor profiles, a before/after results gallery, patient testimonials, and a full booking flow that ends in a confirmation screen (no real appointments are ever booked — there's no backend behind it).

The whole site is bilingual, with Arabic built as its own proper layout — right-to-left, its own typography and spacing — rather than a mirror-flipped translation of the English version.

It also doubles as a reusable template: the design, content, and code are kept separate on purpose, so a real clinic (or agency) could reskin this into their own brand by swapping the text, colors, and images, without touching the underlying components.

Full product spec: [LUME_PRD.md](LUME_PRD.md). Full tech spec: [LUME_TECH_STACK.md](LUME_TECH_STACK.md). Build history and decisions: [.claude/project-state.md](.claude/project-state.md).

---

## For developers

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Motion runs on two systems: **ScrollCraft** (`public/scrollcraft.js`, a vanilla-JS `data-sc-*` markup engine — pins, scroll-scrub, staggered reveals; see `scrollcraft/FINGERPRINTS.md`) drives every scroll-linked device on the page, and **React Three Fiber** renders the one 3D moment (the Brand Statement "Science" beat), lazy-loaded and excluded from mobile/reduced-motion bundles entirely. i18n via `next-intl` (`/en`, `/ar`). Forms via React Hook Form + Zod. No backend, database, or auth — content lives in local TypeScript data files, and the booking flow ends in a mock confirmation state. Deployed on Vercel.

## Running the project

```
npm install
npm run dev      # dev server, http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

Generating the demo photography requires an NVIDIA API key (`black-forest-labs/flux.2-klein-4b`):

```
NVIDIA_API_KEY=... npm run generate:images
```

This is only needed if you're replacing the imagery — see [Adapting the template](#adapting-the-template-for-another-clinic) below. The existing generated images already live under `public/images/`.

## Architecture

```
src/
├── app/[locale]/         # routes — layout.tsx (fonts, providers, navbar/footer), page.tsx (section assembly)
├── components/           # by domain, not file type: hero, treatments, doctors, results, booking, doctors, packages, sections, layout, motion, ui
├── data/                 # treatments.ts, doctors.ts, packages.ts, results.ts, testimonials.ts, journey.ts, brandStatement.ts, concerns.ts, types.ts
├── config/                # site.ts (brand identity), theme.ts (JS-side color-token reader)
├── i18n/                  # next-intl routing/navigation/request config
├── lib/                   # cn, whatsapp link builders, formResolver (RHF↔Zod), webgl capability check, scrollcraft.css
├── fonts/                 # self-hosted General Sans (Fontshare)
└── proxy.ts               # next-intl middleware (Next.js 16 naming)
messages/{en,ar}.json      # UI chrome strings only (nav, buttons, form labels, a11y) — never clinic content
public/images/             # generated demo photography (hero, doctors, treatments, packages, before/after)
public/scrollcraft.js      # the ScrollCraft engine — copied verbatim, never hand-edited
scripts/generate-images.mjs
```

Server Components by default; a component only becomes a client component where interaction, form state, or motion state genuinely requires it (booking flow, filters, the 3D scene, mobile menu).

## Data locations

Every piece of clinic content lives in a typed `LocalizedText` (`{ en, ar }`) shape in `src/data/*.ts`:

| File | Content |
|---|---|
| `treatments.ts` | The 7 treatments (name, description, duration, recovery, category, image) |
| `doctors.ts` | The 3 doctor profiles (name, specialty, bio, focus areas, languages, portrait) |
| `packages.ts` | The 3 treatment programs (name, description, included treatments, image) |
| `results.ts` | Before/after entries (treatment, doctor, sessions, timeframe, images) — plus `peakResult`, the featured scroll-scrubbed pair |
| `testimonials.ts` | The 4 testimonial quotes |
| `journey.ts` | The 5-step Treatment Journey copy |
| `brandStatement.ts` | The Skin → Science → Results 3-beat narrative |
| `concerns.ts` | Concern/category/language label lookup tables (for the Treatment Explorer filter and Arabic label translation) |

`messages/en.json` / `messages/ar.json` hold only UI chrome (nav labels, button text, form labels, error messages, accessibility strings) — never brand or clinic copy. That separation is what lets a locale's UI vocabulary change without touching content, and content change without touching either locale's chrome.

## Brand configuration

`src/config/site.ts` is the single source of brand identity: brand name, logo wordmark, tagline/positioning/meta description (EN/AR), WhatsApp number, phone, email, location, social links, final-CTA copy, and the fictional-content disclaimer. Every component reads from `siteConfig` rather than hardcoding any of this — if a component ever needs a literal brand string, that's a bug (see `.claude/project-state.md`'s Phase 08 notes for the two such bugs fixed there).

Design tokens (colors, type scale, spacing, radii, motion durations) live in `src/app/globals.css` under Tailwind v4's `@theme` — no `tailwind.config.js`, no scattered inline hex values. `src/config/theme.ts` exposes a `getColor()` helper that reads a token's live computed value at runtime, for the one place (the R3F 3D scene) that can't consume a CSS custom property directly.

## Customization workflow

To re-skin the template for a new clinic, in order:

1. **Brand identity** — edit `src/config/site.ts`: name, logo wordmark, tagline, contact details, location, socials, disclaimer.
2. **Color & type tokens** — edit the `@theme` block in `src/app/globals.css`: swap the color tokens (canvas/ink/neutral/border/accent/accent-hover/ground-deep) and, if needed, the font families in `src/lib/fonts.ts`.
3. **Content** — edit `src/data/*.ts`: treatments, doctors, packages, results, testimonials, journey steps, brand-statement beats. Keep the existing `LocalizedText` shape (`{ en, ar }`) for every field.
4. **Imagery** — replace files under `public/images/**`, keeping the same paths/filenames the data files reference, or regenerate via `npm run generate:images` after editing the prompts in `scripts/generate-images.mjs`.
5. **Arabic voice** — if the new brand wants a different address register (feminine/masculine/neutral imperatives), update `messages/ar.json`'s CTA strings and any imperative copy in `src/data/*.ts` consistently; see the `arabic-design` conventions in `.claude/rules/`.

Components, layout, motion, and interaction patterns (booking flow, WhatsApp deep links, Treatment Explorer filtering, the Before/After scroll-scrub) should not need to change for a re-skin — if a customization forces a component edit, that's a sign brand-specific content leaked into the component and should move to `config`/`data` instead.

## Standing up a second clinic variation

The fastest path to a second variant is a fresh checkout plus the five steps above, in order — each step is independently testable (`npm run dev` after step 1 confirms the brand name/contact links updated everywhere; after step 2, the whole palette; after step 3, real content; after step 4, real photography). Budget for step 5 last, since voice/register is a content decision, not a mechanical swap.

What you get for free without touching components: RTL layout for Arabic, the booking flow (Treatment → Doctor → Date → Details → Confirmation), contextual WhatsApp deep links, the ScrollCraft-driven scroll storytelling, and the responsive/accessible baseline (keyboard focus, reduced-motion fallback, WCAG AA contrast).
