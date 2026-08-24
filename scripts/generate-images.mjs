#!/usr/bin/env node
/**
 * Regenerates every photo under public/images/** via NVIDIA's hosted
 * black-forest-labs/flux.2-klein-4b endpoint. Requires NVIDIA_API_KEY in
 * .env.local (get one at build.nvidia.com — free tier).
 *
 * Run: node scripts/generate-images.mjs [asset-key ...]
 *   no args        -> regenerate everything
 *   one or more     -> regenerate only matching `out` paths (substring match)
 *
 * API notes learned the hard way (klein-4b is a 4-step distilled "turbo"
 * model, not a full-size Flux):
 * - Endpoint: POST https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b
 * - prompt max 800 chars.
 * - negative_prompt is NOT supported by this model (422 if sent).
 * - cfg_scale must be exactly 1; steps must be <= 4; samples must be <= 1.
 * - aspect_ratio is an enum, not free width/height — see ASPECTS below.
 * - Long, adjective-stacked prompts get ignored in favor of a generic
 *   abstract blob. Short, concrete, subject-first prompts render
 *   recognizably. Demographic descriptors (ethnicity/gender/age) are
 *   unreliable at 4 steps — treat portraits as "plausible professional",
 *   not a guaranteed match to a written bio.
 * - The safety filter (finishReason: "CONTENT_FILTERED") can false-positive
 *   on totally benign prompts for no obvious reason; if it fires, reword
 *   the prompt rather than retrying the same one.
 */
import fs from "node:fs";
import path from "node:path";

const KEY = (() => {
  const match = fs.readFileSync(".env.local", "utf8").match(/NVIDIA_API_KEY=(.*)/);
  if (!match) throw new Error("NVIDIA_API_KEY not found in .env.local");
  return match[1].trim();
})();

const ENDPOINT = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b";

const assets = [
  {
    out: "public/images/hero/hero-main.jpg",
    ratio: "2:1",
    prompt:
      "Editorial still-life and portrait photography on a seamless bone-white cyclorama background. Large soft overhead light source, huge white bounce fill, near-shadowless with one soft contact shadow. High key, gentle contrast, warm white and pale neutral colour grade. Medium-format sharpness, fine film grain. Photographic realism, shot on a medium-format camera. A macro close-up of a single clear water droplet resting on bare skin, catching soft light, a faint warm-wine (deep burgundy) accent reflected in the droplet's highlight. Extreme shallow depth of field, skin texture rendered with quiet realism, not airbrushed. Shot at 100mm macro, f/2.8.",
  },
  {
    out: "public/images/brand/science.jpg",
    ratio: "3:2",
    prompt:
      "Photograph of a translucent glass sculptural form with soft internal light and a warm burgundy glow inside, bone-white background, editorial studio photography.",
  },
  {
    out: "public/images/doctors/layla-al-faisal.jpg",
    ratio: "3:4",
    prompt:
      "Portrait photograph of a Middle Eastern woman in her late 30s, neat dark hair, wearing an ivory blazer, calm confident expression, headshot, soft studio light, bone-white background.",
  },
  {
    out: "public/images/doctors/noor-al-sabhan.jpg",
    ratio: "3:4",
    prompt:
      "Portrait photograph of a Middle Eastern woman in her early 30s, dark hair in a low bun, wearing a charcoal blazer, warm gentle smile, headshot, soft studio light, bone-white background.",
  },
  {
    out: "public/images/doctors/omar-al-harbi.jpg",
    ratio: "3:4",
    prompt:
      "Portrait photograph of a Middle Eastern man in his early 40s, short beard, wearing a charcoal blazer, calm confident expression, headshot, soft studio light, bone-white background.",
  },
  {
    out: "public/images/treatments/hydraglow-facial.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a glass dropper bottle with one water droplet on the tip, standing upright on a bone-white surface, soft daylight, minimal composition.",
  },
  {
    out: "public/images/treatments/radiant-peel.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a small glass vial of pale golden liquid next to a folded white cloth, on a bone-white surface, soft daylight, minimal composition.",
  },
  {
    out: "public/images/treatments/clarity-acne-protocol.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a white LED light panel device resting on a bone-white surface, soft blue glow, minimal composition, soft daylight.",
  },
  {
    out: "public/images/treatments/luminous-pigmentation-correction.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a matte white handheld laser device lying on a bone-white surface, soft daylight, minimal composition.",
  },
  {
    out: "public/images/treatments/contour-sculpt.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a smooth curved white sculptural form on a bone-white surface, warm side light, minimal composition.",
  },
  {
    out: "public/images/treatments/line-relax.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a fine glass syringe lying diagonally on a bone-white surface next to a folded cotton pad, soft daylight, minimal composition.",
  },
  {
    out: "public/images/treatments/renewal-rejuvenation-therapy.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of an open amber glass jar of thick cream with a palette knife swipe, on a bone-white surface, soft daylight, minimal composition.",
  },
  {
    out: "public/images/packages/the-lume-glow.jpg",
    ratio: "3:2",
    prompt:
      "A minimal product photograph of a glass dropper bottle and a folded white cotton cloth on a plain bone-white table, soft overhead daylight, high-key, clean editorial composition, medium format sharpness.",
  },
  {
    out: "public/images/packages/the-lume-renewal.jpg",
    ratio: "3:2",
    prompt:
      "A minimal product photograph of an amber glass jar with its lid removed beside it, and a folded linen cloth, on a plain bone-white table, soft overhead daylight, high-key, clean editorial composition, medium format sharpness.",
  },
  {
    out: "public/images/packages/the-lume-contour.jpg",
    ratio: "3:2",
    prompt:
      "Editorial still-life photography on a seamless bone-white cyclorama background. Large soft overhead light, near-shadowless, high key, warm neutral colour grade, medium-format sharpness. Still life: a smooth sculptural plaster form beside a folded charcoal-grey cloth, warm raking side light emphasizing sculptural curves, generous negative space. Shot at 50mm, f/5.6.",
  },
  // Before/after — abstract textural metaphor (crumpled/flat vs smooth/lit),
  // not literal skin macro. Independent generations can't hold a consistent
  // face across two calls, and the model's demographic fidelity is weak
  // anyway at 4 steps — this reads as an intentional editorial device
  // instead of a broken "same person" comparison.
  {
    out: "public/images/results/radiant-peel-before.jpg",
    ratio: "3:4",
    prompt:
      "Extreme close-up macro photograph of a folded white cotton pad texture, slightly uneven surface, soft flat light, bone-white background.",
  },
  {
    out: "public/images/results/radiant-peel-after.jpg",
    ratio: "3:4",
    prompt:
      "Extreme close-up macro photograph of a smooth glossy white ceramic sphere surface, soft glowing highlight, bone-white background.",
  },
  {
    out: "public/images/results/line-relax-before.jpg",
    ratio: "3:4",
    prompt:
      "Close-up macro photograph of crumpled white paper texture with fine creases, soft flat light, bone-white background.",
  },
  {
    out: "public/images/results/line-relax-after.jpg",
    ratio: "3:4",
    prompt: "Close-up macro photograph of smooth white silk fabric texture, soft even light, bone-white background.",
  },
  {
    out: "public/images/results/contour-sculpt-before.jpg",
    ratio: "3:4",
    prompt: "Photograph of a soft rounded white fabric-draped form, flat even light, bone-white background.",
  },
  {
    out: "public/images/results/contour-sculpt-after.jpg",
    ratio: "3:4",
    prompt:
      "Photograph of a sharply defined smooth white sculptural form, warm raking side light emphasizing its contour, bone-white background.",
  },
  // Renewal Rejuvenation Therapy — the Phase 05 scroll-scrubbed peak result
  // (src/data/results.ts peakResult). Same abstract textural-metaphor
  // approach as the pairs above: dry/depleted texture vs. dense/plush
  // texture, standing in for "restores density and bounce."
  {
    out: "public/images/results/renewal-rejuvenation-before.jpg",
    ratio: "3:4",
    prompt:
      "Close-up macro photograph of a dry, matte, cracked clay-like surface texture, flat even light, bone-white background.",
  },
  {
    out: "public/images/results/renewal-rejuvenation-after.jpg",
    ratio: "3:4",
    prompt:
      "Close-up macro photograph of dense, plush white velvet fabric texture with soft directional light, bone-white background.",
  },
];

async function generate(asset) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ prompt: asset.prompt, aspect_ratio: asset.ratio, samples: 1, steps: 4, cfg_scale: 1 }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const artifact = data.artifacts?.[0];
  if (!artifact?.base64) throw new Error(artifact?.finishReason ?? JSON.stringify(data).slice(0, 200));

  fs.mkdirSync(path.dirname(asset.out), { recursive: true });
  fs.writeFileSync(asset.out, Buffer.from(artifact.base64, "base64"));
  console.log(`OK  ${asset.out}`);
}

async function main() {
  const filters = process.argv.slice(2);
  const targets = filters.length ? assets.filter((a) => filters.some((f) => a.out.includes(f))) : assets;

  if (targets.length === 0) {
    console.error("No assets matched:", filters.join(", "));
    process.exit(1);
  }

  for (const asset of targets) {
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        await generate(asset);
        ok = true;
      } catch (err) {
        console.error(`FAIL ${asset.out} (attempt ${attempt}): ${err.message}`);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
}

main();
