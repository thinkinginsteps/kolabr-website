// Brings design assets into the build. Run with `npm run assets` whenever design/ changes.
//
// 1. Fonts: copies the official Switzer WOFF2 files from design/assets/fonts/ into app/fonts/
//    (loaded by next/font/local). Nothing is converted and nothing comes from a CDN.
// 2. OG fonts: the same Switzer weights decompressed to OTF in assets/fonts-og/. Satori (behind
//    next/og, which draws the social images) cannot read WOFF2, and this is a build-time
//    decompression of the official files, not a conversion of the OTF originals.
// 3. Images: every PNG/JPG that a site page in design/ references is converted to WebP in
//    assets/images/, keeping the same relative path. Pages import them statically, so
//    next/image gets width and height for free. Originals stay in design/ and never reach
//    the build. Assets no page references are skipped.
//
// Skips files whose output is newer than the source; pass --force to redo everything.

import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { decompress } from "wawoff2";

const root = path.resolve(import.meta.dirname, "..");
const design = path.join(root, "design");
const force = process.argv.includes("--force");

const FONTS = ["Switzer-Regular.woff2", "Switzer-Semibold.woff2", "Switzer-Extrabold.woff2"];
// Weights the social images use.
const OG_FONTS = ["Switzer-Semibold.woff2", "Switzer-Extrabold.woff2"];
// Screens no design page references: the Construction use case shipped with clinic screenshots,
// so its own mockups (design/screens/Con - *.dc.html) were captured separately. See docs/build-report.md.
const EXTRA_IMAGES = [
  "assets/screens/con-chat.png",
  "assets/screens/con-requests.png",
  "assets/screens/con-dashboard.png",
  "assets/screens/con-events.png",
  "assets/screens/con-wiki.png",
];
// Screenshots of the real app, replacing the design's mockups page by page. They are dropped in
// this folder as they are captured and renamed on the way in: the numbers in the source names are
// the order of the Home hero's stack, which is no business of the other pages that use them.
const SCREEN_DIR = "Homepage Screenshots";
const SCREEN_SHOTS = [
  ["Screenshot - 01 - Dashboard.png", "screen-dashboard.webp"],
  ["Screenshot - 02 - Group Chat.png", "screen-chat.webp"],
  ["Screenshot - 03 - Event Scheduler.png", "screen-events.webp"],
  ["Screenshot - 04 - Video Call.png", "screen-call.webp"],
  ["Screenshot - 05 - Wiki.png", "screen-wiki.webp"],
  ["Screenshot - Requests.png", "screen-requests.webp"],
  ["Screenshot - Channels.png", "screen-channels.webp"],
];
// Pieces of those screenshots, for the places a page shows one panel rather than a whole screen.
// Cropping here rather than keeping a separate file means a recapture carries through: drop the
// new screenshot in, run this, and the crop follows it.
const SCREEN_CROPS = [
  {
    from: "Screenshot - 03 - Event Scheduler.png",
    to: "screen-events-day.webp",
    // The day's list on the left of the scheduled events screen, framed as the old crop was.
    rect: { left: 265, top: 78, width: 485, height: 618 },
  },
];
const WEBP = { quality: 85, effort: 6, smartSubsample: true };

async function isFresh(src, dest) {
  if (force) return false;
  try {
    const [s, d] = await Promise.all([stat(src), stat(dest)]);
    return d.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

async function syncFonts() {
  const from = path.join(design, "assets", "fonts");
  const to = path.join(root, "app", "fonts");
  await mkdir(to, { recursive: true });
  const missing = [];
  for (const name of FONTS) {
    try {
      await copyFile(path.join(from, name), path.join(to, name));
    } catch {
      missing.push(name);
    }
  }
  if (missing.length) {
    console.warn(`fonts: missing in design/assets/fonts/: ${missing.join(", ")}. The build needs all three.`);
  } else {
    console.log(`fonts: ${FONTS.length} copied`);
  }
}

async function syncOgFonts() {
  const from = path.join(design, "assets", "fonts");
  const to = path.join(root, "assets", "fonts-og");
  await mkdir(to, { recursive: true });
  let done = 0;
  for (const name of OG_FONTS) {
    const src = path.join(from, name);
    const dest = path.join(to, name.replace(/\.woff2$/, ".otf"));
    if (await isFresh(src, dest)) continue;
    try {
      await writeFile(dest, await decompress(await readFile(src)));
      done++;
    } catch {
      console.warn(`og fonts: could not decompress ${name}; social images will fall back to a system font.`);
    }
  }
  console.log(`og fonts: ${done} written, ${OG_FONTS.length - done} up to date`);
}

async function referencedImages() {
  const pages = (await readdir(design)).filter((f) => f.endsWith(".dc.html") && !f.startsWith("Screen - "));
  const refs = new Set();
  for (const page of pages) {
    const html = await readFile(path.join(design, page), "utf8");
    for (const m of html.matchAll(/["'(]((?:\.\/)?assets\/[^"'()]+?\.(?:png|jpe?g))["')]/gi)) {
      refs.add(m[1].replace(/^\.\//, ""));
    }
  }
  for (const extra of EXTRA_IMAGES) refs.add(extra);
  return [...refs].sort();
}

async function imageJobs() {
  const images = path.join(root, "assets", "images");
  const refs = await referencedImages();
  const jobs = refs.map((rel) => ({
    src: path.join(design, rel),
    dest: path.join(images, rel.replace(/^assets\//, "").replace(/\.(png|jpe?g)$/i, ".webp")),
  }));
  for (const [file, name] of SCREEN_SHOTS) {
    jobs.push({ src: path.join(design, SCREEN_DIR, file), dest: path.join(images, name) });
  }
  for (const { from, to, rect } of SCREEN_CROPS) {
    jobs.push({ src: path.join(design, SCREEN_DIR, from), dest: path.join(images, to), rect });
  }
  return jobs;
}

async function convertImages() {
  const jobs = await imageJobs();
  let converted = 0;
  let skipped = 0;
  for (const { src, dest, rect } of jobs) {
    if (await isFresh(src, dest)) {
      skipped++;
      continue;
    }
    await mkdir(path.dirname(dest), { recursive: true });
    const image = sharp(src);
    await (rect ? image.extract(rect) : image).webp(WEBP).toFile(dest);
    converted++;
  }
  console.log(`images: ${jobs.length} to keep, ${converted} converted, ${skipped} up to date`);
}

await syncFonts();
await syncOgFonts();
await convertImages();
