#!/usr/bin/env node
/**
 * Generates the Hero background video via LTX's async image-to-video API
 * (LTX-2.3), animating the existing hero still so the loop matches its
 * framing exactly instead of letting the model reframe a square source
 * into a widescreen shot.
 *
 * Requires LTX_API_KEY in .env.local (console.ltx.io) and `ffmpeg` on PATH
 * (used to faststart-remux the downloaded video).
 * Run: node scripts/generate-video.mjs
 *
 * API notes (docs.ltx.io):
 * - Base URL for the async flow is https://api.ltx.io/v2/image-to-video.
 * - Auth: `Authorization: Bearer <key>`.
 * - Submitting returns 202 + `{ id }`; poll GET .../image-to-video/{id}
 *   every ~5s until status is "completed" (result.video_url) or "failed".
 * - image_uri accepts a public HTTPS URL, an ltx:// URI, or a base64 data
 *   URI — a data URI is simplest here since there's nothing to host.
 * - resolution is one of a fixed set of "WxH" strings, not arbitrary
 *   values (1280x720, 1920x1080, 2560x1440, 3840x2160, and their portrait
 *   flips) — 1920x1080 matches the Hero's landscape crop.
 */
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const KEY = (() => {
  const match = fs.readFileSync(".env.local", "utf8").match(/LTX_API_KEY=(.*)/);
  if (!match) throw new Error("LTX_API_KEY not found in .env.local");
  return match[1].trim();
})();

const BASE = "https://api.ltx.io/v2";
const SOURCE_IMAGE = "public/images/hero/hero-main-v3.jpg";
const OUT_VIDEO = "public/videos/hero-loop.mp4";
const TARGET_W = 1920;
const TARGET_H = 1080;
// Must match Hero.tsx's <Image style={{ objectPosition: "50% 17%" }} /> so
// the video's first frame lines up with the still it replaces.
const OBJECT_POSITION_Y = 0.17;

const PROMPT =
  "A woman stands in gentle profile against a seamless bone-white backdrop, eyes closed, her expression calm and serene, one bare shoulder catching a soft diffused studio light. The camera holds a still, static frame throughout, observing rather than moving. A few loose strands of her dark hair drift almost imperceptibly as if in a faint breeze, and her chest rises and falls in slow, natural breathing. Warm glowing light breathes gently across her skin, brightening and softening in a slow, hypnotic pulse, like sunlight filtering through moving clouds. A strip of deep burgundy silk fabric at her shoulder shifts subtly with her breath. The mood is meditative, luxurious, and unhurried — an editorial beauty film in soft focus with minimal visible texture and a dreamy, glowing atmosphere. No text, no other people, no sudden movement.";

// Reproduces the CSS object-cover crop so the conditioning frame matches
// what the site actually displays, instead of asking the model to guess
// how to extend a square source into 16:9.
async function buildConditioningFrame() {
  const meta = await sharp(SOURCE_IMAGE).metadata();
  const scale = Math.max(TARGET_W / meta.width, TARGET_H / meta.height);
  const scaledW = Math.round(meta.width * scale);
  const scaledH = Math.round(meta.height * scale);
  const top = Math.round((scaledH - TARGET_H) * OBJECT_POSITION_Y);
  const left = Math.round((scaledW - TARGET_W) / 2);

  const buffer = await sharp(SOURCE_IMAGE)
    .resize(scaledW, scaledH)
    .extract({ left: Math.max(0, left), top: Math.max(0, top), width: TARGET_W, height: TARGET_H })
    .jpeg({ quality: 92 })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function submit(imageUri) {
  const res = await fetch(`${BASE}/image-to-video`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      image_uri: imageUri,
      prompt: PROMPT,
      model: "ltx-2-3-pro",
      duration: 6,
      resolution: `${TARGET_W}x${TARGET_H}`,
      fps: 24,
      generate_audio: false,
      camera_motion: "static",
    }),
  });
  if (!res.ok) throw new Error(`submit failed: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  console.log(`Job submitted: ${data.id}`);
  return data.id;
}

async function poll(id) {
  for (;;) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`${BASE}/image-to-video/${id}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) throw new Error(`poll failed: HTTP ${res.status} ${await res.text()}`);
    const data = await res.json();
    console.log(`  status: ${data.status}`);
    if (data.status === "completed") return data.result.video_url;
    if (data.status === "failed") throw new Error(`generation failed: ${JSON.stringify(data)}`);
  }
}

async function main() {
  console.log("Building conditioning frame from the current hero still...");
  const imageUri = await buildConditioningFrame();

  console.log("Submitting to LTX-2.3-pro image-to-video...");
  const id = await submit(imageUri);

  console.log("Polling for completion (this can take a few minutes)...");
  const videoUrl = await poll(id);

  console.log(`Downloading ${videoUrl}`);
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.mkdirSync(path.dirname(OUT_VIDEO), { recursive: true });
  const rawPath = `${OUT_VIDEO}.raw.mp4`;
  const remuxedPath = `${OUT_VIDEO}.tmp.mp4`;
  fs.writeFileSync(rawPath, buffer);

  try {
    // LTX's own output has the moov atom (the index a player needs before it
    // can decode anything) written at the very end of the file, after all the
    // video data — a browser can end up needing most of the file downloaded
    // just to start playing it. `-movflags +faststart` moves moov to the
    // front; `-c copy` stream-copies rather than re-encoding, so this is a
    // lossless remux, not a quality tradeoff. Remuxing into a temp path and
    // renaming over OUT_VIDEO only on success keeps the previous good video
    // in place if ffmpeg is interrupted or fails.
    console.log("Remuxing with faststart...");
    await execFileAsync("ffmpeg", ["-y", "-i", rawPath, "-c", "copy", "-movflags", "+faststart", remuxedPath]);
    fs.renameSync(remuxedPath, OUT_VIDEO);
  } finally {
    fs.rmSync(rawPath, { force: true });
    fs.rmSync(remuxedPath, { force: true });
  }

  const { size } = fs.statSync(OUT_VIDEO);
  console.log(`OK  ${OUT_VIDEO} (${(size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
