// Visual diff: design page vs built page, full-page screenshots with motion off.
// Usage (dev server on :3000, `npx http-server design -p 3200` on :3200, and
// `npm i -D playwright pngjs pixelmatch@5 && npx playwright install chromium`):
//   node scripts/visual-diff.mjs <width> "<Design file.dc.html>" <route> [...pairs]
// Writes design/mine/diff PNGs to .visual-diff/ and prints 100px bands that differ by >0.5%.
import { chromium } from "playwright";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const OUT = new URL("../.visual-diff/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const [width, ...pairs] = process.argv.slice(2);
const W = Number(width);

const browser = await chromium.launch();
async function shot(url, file, isDesign) {
  const ctx = await browser.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(isDesign ? 2500 : 1200);
  // Hide the fixed nav (it overlays differently in full-page captures) and the dev badge.
  await page.addStyleTag({
    content: `nav[aria-label=Main], [data-nextjs-toast], nextjs-portal { visibility: hidden !important; } html{scroll-behavior:auto!important}`,
  });
  // Scroll through so lazy images load, then back to top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  // Stitch viewport-sized captures instead of fullPage: a fullPage capture resizes the
  // viewport and reflows viewport-unit layouts, which is not what a visitor sees.
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight), parts = [];
  for (let y = 0; y < H; y += vh) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
    const realY = await page.evaluate(() => window.scrollY);
    parts.push({ buf: await page.screenshot(), top: realY });
  }
  const sharp = (await import("sharp")).default;
  await sharp({ create: { width: W, height: H, channels: 4, background: "#ffffff" } })
    .composite(parts.map((p) => ({ input: p.buf, left: 0, top: p.top })))
    .png()
    .toFile(file);
  await ctx.close();
}

for (let i = 0; i < pairs.length; i += 2) {
  const design = pairs[i], route = pairs[i + 1];
  const name = route.replace(/\//g, "_") || "_home";
  const a = `${OUT}${name}-${W}-design.png`, b = `${OUT}${name}-${W}-mine.png`;
  await shot(`http://localhost:3200/${encodeURI(design)}`, a, true);
  await shot(`http://localhost:3000${route}`, b, false);
  const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  const crop = (img) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
  const ca = crop(A), cb = crop(B), diff = new PNG({ width: w, height: h });
  pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.12 });
  fs.writeFileSync(`${OUT}${name}-${W}-diff.png`, PNG.sync.write(diff));
  // Per-band diff share (100px bands) to point at problem areas.
  const bands = [];
  for (let y0 = 0; y0 < h; y0 += 100) {
    let n = 0, tot = 0;
    for (let y = y0; y < Math.min(y0 + 100, h); y++) for (let x = 0; x < w; x++) {
      const k = (y * w + x) * 4; tot++;
      if (diff.data[k] === 255 && diff.data[k + 1] === 0 && diff.data[k + 2] === 0) n++;
    }
    const pct = (100 * n) / tot;
    if (pct > 0.5) bands.push(`${y0}:${pct.toFixed(1)}%`);
  }
  console.log(`${route} @${W}: design ${A.width}x${A.height}, mine ${B.width}x${B.height}; bands>0.5%: ${bands.join(" ") || "none"}`);
}
await browser.close();
