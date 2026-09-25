// Kolabr mockup screenshot capture (reproduces design/assets/screens/*.png).
// Usage (from the project root, after `npm i -D playwright && npx playwright install chromium`):
//   node scripts/screenshots/capture.mjs scripts/screenshots/jobs.json
// Overwrites the PNGs in design/assets/screens/; then run `npm run assets` to refresh the WebP copies.
// Paths in jobs.json are relative to the project root. Needs network: the mockups load React from unpkg.
// jobs.json: [{ "src": "<abs path to .dc.html>", "out": "<abs png path>", "mode": "viewport"|"wikicard", "w": 1604, "h": 912 }]
// Settings reverse-engineered from the originals (pixel-diffed to <0.01%):
//  - Chromium (Playwright), deviceScaleFactor 2, viewport 1604x912 (desktop, 3208x1824 PNG) or 520x912 (mobile, 1040x1824 PNG)
//  - scrollbars shown (Playwright's default --hide-scrollbars removed) and the thumb restyled to what the
//    originals show: rgba(0,0,0,.5), 7px wide, inset 1px left / 2px right
//  - every scroll container reset to scrollTop 0 (the chat views auto-scroll to the bottom on load; the originals are at the top)
//  - "wikicard": element screenshot of the white wiki card (nav + article) at its full height, transparent outside
//    the 20px rounded corners. Laid out as at 1604x912 (main keeps its scrollbar gutter, nav max-height 912-150=762px)
//    but in a tall viewport so the whole card is painted.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const root = path.resolve(import.meta.dirname, '..', '..');
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).map(j => ({ ...j, src: path.resolve(root, j.src), out: path.resolve(root, j.out) }));
const THUMB_CSS = `::-webkit-scrollbar-thumb{background:rgba(0,0,0,.5)!important;border:0!important;border-left:1px solid transparent!important;border-right:2px solid transparent!important;background-clip:content-box!important;border-radius:4px!important}`;
const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
for (const j of jobs) {
  const W = j.w || 1604, H = j.h || 912;
  const wiki = j.mode === 'wikicard';
  const page = await browser.newPage({ viewport: { width: W, height: wiki ? 2600 : H }, deviceScaleFactor: 2 });
  for (let t = 1; ; t++) { try { await page.goto('file://' + j.src, { waitUntil: 'networkidle', timeout: 60000 }); break; } catch (e) { if (t >= 3) throw e; console.log('retry', t, j.src); } }
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.waitForTimeout(j.delay || 1500);
  await page.evaluate(([css, wiki, H, tweak, minH]) => {
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    if (wiki) {
      const inp = [...document.querySelectorAll('input')].find(i => /wiki/i.test(i.placeholder || ''));
      let e = inp; while (getComputedStyle(e).borderRadius !== '20px') e = e.parentElement;
      e.id = '__wikicard';
      if (minH) e.style.minHeight = minH + 'px'; // keep the original PNG height when edited copy reflows shorter
      e.parentElement.style.overflowY = 'scroll';
      e.children[0].style.maxHeight = (H - 150) + 'px';
      let a = e.parentElement; while (a) { a.style.setProperty('background', 'transparent', 'important'); a = a.parentElement; }
      document.documentElement.style.setProperty('background', 'transparent', 'important');
      document.body.style.setProperty('background', 'transparent', 'important');
    }
    if (tweak) eval(tweak);
    [...document.querySelectorAll('*')].filter(e => /auto|scroll/.test(getComputedStyle(e).overflowY)).forEach(e => {
      const o = e.style.overflowY; e.style.overflowY = 'hidden'; e.offsetHeight; e.style.overflowY = o; e.scrollTop = 0;
    });
  }, [THUMB_CSS, wiki, H, j.tweak || '', j.minHeight || 0]);
  await page.waitForTimeout(300);
  await page.evaluate(async () => { await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')));
  if (broken.length) console.log('BROKEN IMAGES', j.out, broken);
  if (wiki) {
    // originals use the card height rounded to the nearest CSS px
    const r = await page.evaluate(() => { const b = document.getElementById('__wikicard').getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: Math.round(b.height) }; });
    await page.screenshot({ path: j.out, omitBackground: true, clip: r });
  }
  else await page.screenshot({ path: j.out });
  await page.close();
  console.log('captured', j.out);
}
await browser.close();
