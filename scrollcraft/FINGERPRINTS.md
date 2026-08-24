# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| LUMÉ (aesthetic clinic, Next.js/React retrofit — see Phase 05 plan) | Filmic one-shot | Fixed bar, wordmark + persistent "Book Consultation" CTA, quiet (not a beat) | `flow` + greet-form cue + background parallax (no video asset existed, so `scrub` fell back to a parallax-only flow act) | flow (Hero) → pin, sequential greet+2 cues, 1 R3F moment (Brand Statement) → flow+in (Explorer) → native pan rail + flow+in (Featured) → **pin + full-span bidirectional clip-path reveal (Before/After peak, the signature move)** → flow+in pointer-drag gallery (Before/After) → flow+in ×3 (Doctors) → pin, 5 sequential greet+cues (Treatment Journey) → flow+in (Packages) → flow+in (Trust) → pin + spotlight + magnet (Final CTA close) → flow+in (Footer) | Pinned spotlight + magnetic-hover CTA, resolves and holds (no fade-to-nothing) | Before/After: `data-sc-reveal` given a full `0 1` window on a `pin` act, making the clip-path wipe track scroll position directly and bidirectionally across the whole pinned span — the visitor's hand is the transformation, not a dragged widget | High-key editorial (bone-white cyclorama photography, one bordeaux accent) | Next.js dev server, no fixed static port (localhost:3000+ per-run) |

*(empty: your first build has nothing to clear, so build whatever the interview
points at. From the second onwards, this table is the constraint.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- Filmic one-shot grammar — claimed by LUMÉ.
- Pinned spotlight + magnetic-CTA close pattern — claimed by LUMÉ.
- Full-span `data-sc-reveal` (bidirectional clip-path bound to the whole pin, not a sub-window) as a before/after transformation signature move — claimed by LUMÉ.
- High-key editorial bone-white-cyclorama world — claimed by LUMÉ.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
