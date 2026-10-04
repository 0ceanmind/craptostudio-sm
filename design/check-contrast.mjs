// Checks text contrast on every post template against the real rendered background
// (gradients, glows and the watermark included), not just the palette values.
// Usage: npm run check        Exits non-zero if any text falls below its threshold.
//
// Posts are viewed at about 1/3 scale on a phone, so "large text" (allowed 3:1) means
// 56px+ bold or 72px+ regular on the 1080px canvas; everything else needs 4.5:1.
// Gradient-filled accent text is measured against each of its gradient's colour stops.
import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts } from './content.mjs';
import { slideHtml } from './templates.mjs';
import { stage } from './motion/stage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = (fg, a, bg) => fg.map((v, i) => v * a + bg[i] * (1 - a));

// Every hero cover (frame 0 of the animation, feed and Reel) and every text slide, in both languages.
const pages = [];
for (const post of posts) {
  const scene = (await import(path.join(root, 'design/scenes', `${post.scene}.mjs`))).default;
  const slides = post.slides ?? [];
  const total = slides.length + 1;
  for (const lang of ['en', 'ar']) {
    for (const format of ['feed', 'reel']) {
      pages.push([`${post.slug} ${lang} ${format} cover`, stage({ scene, post, lang, format, swipe: slides.length > 0 }), format === 'reel' ? 1920 : 1350]);
    }
    slides.forEach((s, i) => {
      if (s.type !== 'image') pages.push([`${post.slug} ${lang} slide ${i + 2}`, slideHtml(s, i + 2, total, lang), 1350]);
    });
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
let failures = 0;
let checked = 0;
const seen = new Set();

for (const [name, html, height] of pages) {
  await page.setViewportSize({ width: 1080, height });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (html.includes('window.__ready')) await page.waitForFunction(() => window.__ready === true);

  // Tight boxes around each run of visible text, with its colour and size.
  const runs = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;
      const el = node.parentElement;
      const cs = getComputedStyle(el);
      // Gradient-filled text (background-clip:text) has a transparent colour; use its gradient stops.
      const colors = cs.color === 'rgba(0, 0, 0, 0)'
        ? (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || [])
        : [cs.color];
      if (!colors.length) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 2 || r.height < 2) continue;
        out.push({ text: node.textContent.trim().slice(0, 40), colors, size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10),
          x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), w: Math.ceil(r.width), h: Math.ceil(r.height) });
      }
    }
    return out;
  });

  // Same page with all text hidden = the background behind the text.
  await page.addStyleTag({ content: '*{color:transparent!important;text-decoration-color:transparent!important}em{background-image:none!important}.gl,em .ul{visibility:hidden!important}' });
  const { data, info } = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  for (const run of runs) {
    let worst = Infinity;
    for (const c of run.colors) {
      const m = c.match(/rgba?\(([^)]+)\)/)[1].split(',').map((v) => parseFloat(v));
      const fg = m.slice(0, 3);
      const alpha = m[3] ?? 1;
      for (let y = run.y; y < Math.min(run.y + run.h, info.height); y += 2) {
        for (let x = run.x; x < Math.min(run.x + run.w, info.width); x += 2) {
          const i = (y * info.width + x) * 3;
          const bg = [data[i], data[i + 1], data[i + 2]];
          worst = Math.min(worst, ratio(blend(fg, alpha, bg), bg));
        }
      }
    }
    const large = (run.size >= 56 && run.weight >= 700) || run.size >= 72;
    const min = large ? 3 : 4.5;
    checked++;
    if (worst < min) {
      const key = `${name}|${run.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      failures++;
      console.log(`FAIL ${worst.toFixed(2)}:1 (needs ${min}) ${name}: "${run.text}" ${run.size}px`);
    }
  }
}

await browser.close();
console.log(`contrast: checked ${checked} text runs on ${pages.length} pages, ${failures} below threshold`);
process.exit(failures ? 1 : 0);
