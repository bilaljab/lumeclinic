# LUMÉ — Creative Direction & Experience Architecture

Phase 02 deliverable. Source of truth for creative/visual/motion decisions, alongside [LUME_PRD.md](LUME_PRD.md) (product) and [LUME_TECH_STACK.md](LUME_TECH_STACK.md) (tech). When Phase 03+ implementation needs a design decision not covered here, extend this file rather than deciding ad hoc in a component.

Produced using the `frontend-design` and `scroll-craft` (installed as `nateherk-design:scrollcraft`) skills per the CLAUDE.md hard skill gate — both were invoked and read in full (frontend-design's SKILL.md; scrollcraft's SKILL.md plus `devices.md`, `uniqueness.md`, `worlds.md`, `feel.md`) before drafting the direction below, not approximated from memory.

Three genuinely-undecided creative calls (visual world balance, scroll structure, signature move) were put to the user directly. One answer — "try one continuous world, fall back to distinct scenes if it fails" — is addressed with reasoning rather than taken literally; see Motion Direction below for why.

---

## Brand & Positioning

**Personality:** premium aesthetic-medicine brand that reads as *editorial beauty publication* crossed with *quiet clinical confidence* — never a hospital, never a spa-with-candles, never a SaaS dashboard wearing a medical skin.

**Positioning statement:** LUMÉ is where Riyadh's most discerning clients go to be *understood* before they're treated — science stated plainly, results shown honestly, never oversold.

**Emotional tone:** confident, unhurried, warm-clinical. The visitor should feel like they're reading a beautifully art-directed magazine profile of a clinic, not filling out an intake form.

**Editorial influence:** high. Treat every section like a magazine spread — asymmetric composition, real captions, restrained typography-as-hierarchy — over "SaaS landing page" conventions (centered hero, icon-grid features, testimonial carousel).

**Riyadh/Saudi context:** premium hospitality cues (materials, light, restraint) rather than literal iconography (no mosque silhouettes, no flag colors, no generic "Arabian" ornament). Arabic is a first-class layout, designed not mirrored (per CLAUDE.md) — full typographic/RTL detail is `arabic-design` skill work in a later phase; this document only sets the direction that work inherits.

**Explicitly avoided** (per PRD §9 and design.md): generic hospital aesthetics, heavy blue medical UI, cheap gradients, generic stock imagery, dashboard-style cards, excessive rounded containers, flashy-for-its-own-sake animation. Also avoided per the frontend-design and scrollcraft skills' own anti-default lists: the cream-and-brass "artisan" palette, violet-to-blue AI gradients, and low-poly clay-diorama 3D.

---

## Typography

Display and body faces are deliberately *not* the templated Playfair+Inter or Fraunces+Inter pairing that's become its own default — picked for what they do at LUMÉ's specific sizes (huge hero display, dense doctor/treatment copy) and for real Arabic companions, not for name recognition.

- **Display:** **Fraunces** (variable, optical-size axis). Soft, warm-contrast serif with enough personality to carry a 7–8rem hero headline without going cold-luxury or trendy-Didone. Used at low optical size ("soft") for big display, higher optical size for smaller headings so it doesn't get spindly.
- **Body/UI:** **General Sans** (Fontshare, self-hosted via `next/font/local`). Clean, warm-neutral grotesk — pairs with Fraunces' warmth better than a mechanical grotesk like Inter (also the single most-seen default; explicitly avoided here for that reason).
- **Arabic display:** **Noto Kufi Arabic** — geometric confidence that echoes Fraunces' contrast and picks up the "scientific / soft technology" keyword without going calligraphic-traditional.
- **Arabic body/UI:** **IBM Plex Sans Arabic** — clean companion to General Sans, wide weight range, strong screen legibility.

  *(These four are a directional pick for this phase. Finalizing Arabic pairing, kerning, and line-height against real Arabic copy is `arabic-design` skill work — see Unresolved Decisions.)*

**Type scale** (fluid, `clamp()`-based; finalized as Tailwind theme tokens in Phase 03):

| Role | Size | Weight/notes |
|---|---|---|
| Display XL (hero) | `clamp(3.5rem, 8vw, 8rem)` | Fraunces, optical "soft", tracking −0.02em, leading 0.95 |
| Display L (section headline) | `clamp(2.5rem, 5vw, 4.5rem)` | Fraunces |
| Display M (subsection/card headline) | `clamp(1.75rem, 3vw, 2.5rem)` | Fraunces |
| Body L (lede/intro) | 1.25rem | General Sans, leading 1.6 |
| Body (default) | 1rem | General Sans, leading 1.6 |
| Label/eyebrow/caption | 0.8125rem | General Sans, uppercase, tracking +0.08em |

**Hierarchy & spacing philosophy:** editorial contrast, not a smooth 8-step ramp — the jump from Body to Display M to Display XL should feel deliberate, not linear. Eyebrows/labels are load-bearing punctuation, not decoration: **at most one eyebrow per three sections** (scrollcraft hard rule), never one above every heading. No numbered section markers (`01/02/03`) anywhere — LUMÉ's sections are not a sequence the visitor needs to track, except the Treatment Journey, which is genuinely a process and earns numbering.

---

## Color

Six named tokens, one accent, deliberately not the cream+brass "artisan" default (explicitly banned by the scrollcraft skill as an overused non-choice) and not medical blue.

| Token | Value | Role |
|---|---|---|
| `canvas` | `#F6F2ED` | Primary background — warm bone, not stark white |
| `ink` | `#201B18` | Primary foreground — warm near-black, not pure black |
| `neutral` | `#A79C91` | Secondary text, muted labels, disabled states |
| `border` | `#E2DAD0` | Hairlines, dividers, low-contrast rules |
| `accent` | `#5C2333` | Deep wine/bordeaux — CTAs, links, active states, the one accent color |
| `ground-deep` | `#15110E` | Dark drift-stop for hero/scrub/close moments; pairs with `ink` |

**Why bordeaux, not the "expected" beauty-industry terracotta/blush:** terracotta+cream is close enough to the banned artisan cliché to read as a non-choice. Deep wine is still warm and still reads "premium beauty" without tripping either the medical-blue or artisan-cream traps.

**Interactive states:** default accent full-strength; hover/press darkens ~10% (`#451A26`); focus-visible uses accent as a real ring with offset (never suppressed, per accessibility rules); disabled uses `neutral` at reduced opacity. No glass/blur effects as a default surface treatment — used, if at all, only as a rare accent on the nav bar at scroll, never as a card material.

---

## Layout

- **Grid:** 12-column desktop, but content is rarely centered across all 12 — editorial asymmetric spans (e.g., a 7-col headline against a 4-col offset image) are the default rhythm, not the exception.
- **Section width:** two modes, chosen per section, not one global container. Contained (`max-w-[1400px]`) for copy-dense sections (Doctors bios, Packages, Trust); full-bleed (100vw) for scrub/hero/gallery/before-after sections, where the image *is* the section.
- **Whitespace:** generous macro spacing — section padding roughly 96–160px desktop, 56–80px mobile — with asymmetric margins rather than symmetric centered padding.
- **Image treatment:** high-key editorial photography (see Motion Direction below) with deliberate negative space built into the shot, not cropped in after. Minimal or no rounded corners on imagery (0–4px) — explicitly avoiding the "excessive rounded containers" default.
- **Asymmetry:** copy-block anchor alternates section to section — lead, trail, center, split — never centered in every section (scrollcraft hard rule; also avoids the generic-template tell).
- **Mobile composition:** sections stack; pan-rails (Featured Treatments, Packages) become native horizontal scroll-snap regions rather than transformed rails; pinned scroll-storytelling acts get shortened spans/simplified motion to protect performance (Tech Stack §14) and are the first thing checked under `prefers-reduced-motion`.

---

## Motion Direction (via the `scroll-craft` skill)

### World (art direction / style preamble)

**High-key editorial** (world #2 of the 8 in scrollcraft's `worlds.md`): bright, airy, shadowless still-life/portrait photography — the direct match for "wellness, skincare, healthcare that wants to feel calm," and the opposite of the moody low-key-cinematic look that would read as spirits/tech-product rather than clinic.

> Style preamble (reused verbatim across every generated asset in Phase 03+): *Editorial still-life and portrait photography on a seamless bone-white cyclorama. Large soft overhead source, huge white bounce, near-shadowless with one soft contact shadow. High key, gentle contrast, colour grade of warm white and pale neutrals matching the LUMÉ canvas token. Medium-format sharpness, fine grain. Photographic realism. NOT 3D render, NOT clay, NOT illustration, NOT CGI, no digital glow, no plastic sheen, no glossy stock-photo medical styling.*

A secondary **macro texture** treatment (world #5) is permitted only inside the Skin→Science→Results narrative, for genuine skin-texture close-ups — graded to the same warm-neutral family, not used as its own separate mood.

### Grammar

**Filmic one-shot** — continuous, no seams, each section handing off before the last has left; fixed minimal nav bar with wordmark + persistent CTA; full-bleed scrub hero with corner-anchored kinetic headline; pinned close with spotlight + magnetic CTA. This is the grammar the *hard* PRD requirements (persistent booking CTA in nav, corner-anchored hero claim, magnetic final CTA) already assume.

**On "one continuous world vs. distinct scenes":** the literal answer given was "try one continuous world, fall back to distinct scenes if it fails." scrollcraft has a specific grammar for exactly that ask — **Continuous world** (§2.4) — and this document recommends against it rather than attempting and discovering the failure mid-build: that grammar *requires* worldflight mode and explicitly **forbids** section boundaries, forbids acts entirely, and only permits a waypoint-map nav. LUMÉ has hard, non-negotiable requirements incompatible with those bans: a persistent booking CTA in a real nav (PRD §6.1, conversion.md), an interactive Treatment Explorer, a multi-step booking form, structured doctor/package cards, and an accessible real footer with real links (PRD §6.12, Tech Stack §16 accessibility). Those can't exist inside "no `sc-section` blocks, no acts at all."

Filmic one-shot is the closest sanctioned grammar that still delivers the *feeling* of one unbroken world — via continuous ground-color `drift` across acts and un-seamed handoffs (no chapter breaks, no `01/06` counters, no visible navigation-as-index) — while still allowing the real, structured sections LUMÉ actually needs. This is the honest version of "attempt continuous, fall back where it doesn't hold": the fallback is decided here, at the direction stage, instead of after a failed build.

### Signature move

**Scroll-scrubbed transformation reveal**, on the hero Before/After result. Not a stock `reveal` (which fires once at a fixed cue point) — the `clip-path` boundary between "before" and "after" is bound directly and continuously to `--sc-p` for the act's entire pinned span, in both scroll directions, so the visitor's hand *is* the transformation, not a mouse-dragged widget scrubbing underneath a scroll-driven page. This is the peak of the page (see feeling curve below) and gets the largest span and an authored quiet beat immediately before it. Additional curated before/after results (PRD wants several, each with treatment/doctor/sessions/timeframe) are **not** repeats of this device — they run afterward as a conventional pointer-drag `pan` gallery, so the signature moment stays singular.

Tell-someone sentence: *"It's the site where scrolling down is what turns someone's skin from before to after."*

### Feeling curve & score

One line per beat: the feeling, then the device that causes it. Only the storytelling beats below are literal scrollcraft "acts" (pinned/scrub); the structured sections (Explorer, Featured Treatments, Doctors, Packages, Trust, Footer) sit on the same token floor and motion vocabulary but are built as ordinary `flow`+`in`/`pan`/pointer-device sections in Phase 03 via `gsap-skills`, not additional scrollcraft acts — keeping the "act" budget spent only where it earns its cost.

| # | Section | Feeling | Device | Notes |
|---|---|---|---|---|
| — | Navbar | Quiet authority | fixed bar, wordmark + CTA | persistent, not a "beat" |
| 1 | Hero | Curiosity → awe | `scrub`, span ~2.6, dwell 0.4, greet-form kinetic headline | "YOUR SKIN. REIMAGINED." lands already visible (greet cue), never fades in from nothing |
| 2 | Brand Statement (Skin→Science→Results) | Clarity / confidence | `pin`, span 3, one restrained R3F liquid/organic moment on the "Science" beat | the one 3D signature moment on the page |
| 3 | Treatment Explorer | Agency / curiosity | interactive `flow`+pointer devices (GSAP, Phase 03) | concern-driven, not a pinned act — reward exploring, don't force a scroll-lock on a filter UI |
| 4 | Featured Treatments | Desire | `pan` rail, real labels (duration/recovery) | ends deliberately quiet — sets up the peak |
| — | *(authored silence)* | — | ground-only beat, no cue | required run-up to the peak per feel.md — without it, awe has nothing to arrive from |
| 5 | Before / After | **Peak — awe / trust** | `pin` + bespoke `--sc-p`-bound clip-path (signature move) | largest span on the page, most asset budget |
| 6 | Doctors | Trust / intimacy | `flow`+`in`, asymmetric portrait-led | editorial profile, not a CV card |
| 7 | Treatment Journey | Confidence / understanding | `pin`, kinetic lines per step | the one section that legitimately earns numbered markers (01–05) |
| 8 | Packages | Desire / consideration | `pan` or `flow`+`in`, museum-label-style facts | "program," not discount card (conversion.md) |
| 9 | Trust / Testimonials | Calm / reassurance | `flow`+`in`, quiet register | **no `count` device** — LUMÉ is fictional, has no verified statistics; any numbers shown are static, not animated counters |
| 10 | Final CTA | Resolve | pinned close, `spotlight` + `magnet` on CTA | "READY TO REIMAGINE YOUR SKIN?" |
| 11 | Footer | Calm / complete | `flow`+`in` | must resolve and hold — no fade-to-nothing |

Checks against scrollcraft's own rules: 4+ distinct device families used (`scrub`, `pin`, `pan`, `flow`+`in`, plus pointer devices), no family repeats back-to-back, at most one `iris`-style reveal, exactly one 3D moment (not a showcase), no invented stats, ending resolves rather than trailing off.

**Aesthetic range:** Editorial, leaning Premium-minimal (one accent, real air, quiet chrome) — not stark premium-minimal, since LUMÉ's content (doctors, real treatment facts, packages) is substantive enough to want editorial warmth rather than pure minimal austerity.

**Fingerprint gate:** this project's `FINGERPRINTS.md` registry is empty (first scrollcraft-driven build in this workspace), so the gate is trivially clear this phase. Whoever runs the actual Step 0 interview / asset generation / build (Phase 03 or later) should still run it formally and append this build's row on completion.

---

## 3D Direction

Exactly **one** signature 3D moment: an abstract liquid/organic form (a soft metaball-style material, no complex textures) inside the Brand Statement section's "Science" beat, lazy-loaded React Three Fiber, lightweight geometry only. Static poster/gradient fallback for reduced-motion, low-end mobile, and no-WebGL — per motion.md, 3D is never load-bearing for comprehension. No other 3D on the page; this is deliberately not a WebGL showcase.

---

## Component Strategy

Confirms and extends the existing Tech Stack §10 domain structure — no new architectural layer introduced this phase:

- `components/hero/`, `components/sections/` (Brand Statement, Trust, Final CTA), `components/treatments/` (Explorer, Featured), `components/doctors/`, `components/results/` (Before/After), `components/booking/`, `components/motion/` (scrollcraft engine files, GSAP utilities, the 3D scene — themed via tokens, never edited per-project).
- Reusability contract unchanged from PRD §14/Tech Stack §19: swapping brand name, logo, the six color tokens, the four typefaces, and `data/*.ts` content should be enough to re-skin the template for a new clinic. Nothing in this direction hardcodes LUMÉ-specific copy or values into a component — it defines *tokens and patterns* that `src/config/theme.ts` and `src/data/*.ts` will hold in Phase 03.
- The scrollcraft engine (`scrollcraft.js`/`scrollcraft.css`) is themed via CSS custom properties (`--sc-canvas`, `--sc-accent`, etc. mapped to the tokens above) exactly as its own skill instructs — never hand-edited per project.

---

## Unresolved Decisions (carried to later phases)

- Final Arabic typography pairing, kerning, and RTL-specific layout/motion mirroring — needs the `arabic-design` skill against real Arabic copy.
- Formal scrollcraft Step 0 interview → `BRIEF.md`, asset generation, actual page build, and Step 5 verification — all implementation work for the phase that builds the homepage.
- Exact doctor/treatment/package mock content and photography direction (beyond the world/style preamble above) — `src/data/*.ts` content authoring.
- Whether the Treatment Explorer's "regrade the whole page" interaction pattern (noted in scrollcraft's signature-move examples) is worth a second bespoke moment later, or whether GSAP-driven filtering is sufficient — left as a build-time call so it doesn't compete with the Before/After peak.
