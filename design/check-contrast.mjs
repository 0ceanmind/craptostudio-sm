// Checks text contrast on every post template against the real rendered background
// (gradients, glows and the watermark included), not just the palette values.
// Usage: npm run check              every post; exits non-zero if any text falls below its threshold.
//        npm run check -- ai games  only these posts
//
// Posts are viewed at about 1/3 scale on a phone, so "large text" (allowed 3:1) means
// 56px+ bold or 72px+ regular on the 1080px canvas; everything else needs 4.5:1.
// Gradient-filled accent text is measured against each of its gradient's colour stops.
// Hero covers are checked at frame 0 of the animation. Text that is not actually visible there
// (opacity 0, covered by another layer, the back face of a flipped card) is skipped.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { posts } from './content.mjs';
import { slideHtml } from './templates.mjs';
import { stage, loadScene } from './motion/stage.mjs';

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
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const pages = [];
for (const post of posts.filter((p) => !only.length || only.includes(p.slug))) {
  const scene = await loadScene(post.scene);
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

  // Tight boxes around each run of visible text, with its colour and size. Pointer events are
  // forced on so elementFromPoint also sees overlays that ignore the mouse (pointer-events:none).
  await page.addStyleTag({ content: '*{pointer-events:auto!important}' });
  const runs = await page.evaluate(() => {
    const out = [];
    let nextId = 0;
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
      // Effective opacity: text that is invisible at this frame (opacity 0 up the tree) is skipped,
      // partly transparent text is measured with its real alpha.
      let opacity = 1;
      for (let e = el; e; e = e.parentElement) opacity *= parseFloat(getComputedStyle(e).opacity);
      if (opacity < 0.05 || cs.visibility === 'hidden') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width < 2 || r.height < 2) continue;
        // Skip text that something else covers (e.g. a chip passing behind the logo).
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (top && top !== el && !el.contains(top) && !top.contains(el)) continue;
        if (!el.dataset.ccid) el.dataset.ccid = String(nextId++);
        out.push({ id: el.dataset.ccid, text: node.textContent.trim().slice(0, 40), colors, opacity, size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10),
          x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), w: Math.ceil(r.width), h: Math.ceil(r.height) });
      }
    }
    return out;
  });

  // Normal frame first: text whose pixels don't change when text is hidden was never visible
  // (back faces of flipped cards, text under overlays) and is skipped.
  const shown = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer();
  // Same page with all text hidden = the background behind the text.
  const hideAll = await page.addStyleTag({ content: '*{color:transparent!important;text-decoration-color:transparent!important}em{background-image:none!important}.gl,em .ul{visibility:hidden!important}' });
  const { data, info } = await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  for (const run of runs) {
    let visible = 0; let n = 0;
    for (let y = run.y; y < Math.min(run.y + run.h, info.height); y += 2) {
      for (let x = run.x; x < Math.min(run.x + run.w, info.width); x += 2) {
        const i = (y * info.width + x) * 3;
        visible += Math.abs(shown[i] - data[i]) + Math.abs(shown[i + 1] - data[i + 1]) + Math.abs(shown[i + 2] - data[i + 2]);
        n++;
      }
    }
    if (!n || visible / n < 1.5) continue;
    // Score = the 10th-percentile contrast over the text's box (strict, but a small overlap such as
    // a chip passing behind the logo doesn't decide the result on its own).
    const samples = [];
    for (const c of run.colors) {
      const m = c.match(/rgba?\(([^)]+)\)/)[1].split(',').map((v) => parseFloat(v));
      const fg = m.slice(0, 3);
      const alpha = (m[3] ?? 1) * run.opacity;
      for (let y = run.y; y < Math.min(run.y + run.h, info.height); y += 2) {
        for (let x = run.x; x < Math.min(run.x + run.w, info.width); x += 2) {
          const i = (y * info.width + x) * 3;
          const bg = [data[i], data[i + 1], data[i + 2]];
          samples.push(ratio(blend(fg, alpha, bg), bg));
        }
      }
    }
    samples.sort((x, y) => x - y);
    const worst = samples.length ? samples[Math.floor(samples.length * 0.1)] : Infinity;
    const large = (run.size >= 56 && run.weight >= 700) || run.size >= 72;
    const min = large ? 3 : 4.5;
    if (worst < min) {
      // Definitive visibility test for failures: hide only this text. If no pixel in its box
      // changes, something covers it (an overlay, a 3D layer) and it is not really visible.
      if (hideAll) { await hideAll.evaluate((el) => el.remove()); }
      const solo = await page.addStyleTag({ content: `[data-ccid="${run.id}"]{color:transparent!important;-webkit-text-fill-color:transparent!important;background-image:none!important}` });
      const clip = { x: run.x, y: run.y, width: Math.max(1, Math.min(run.w, info.width - run.x)), height: Math.max(1, Math.min(run.h, info.height - run.y)) };
      const soloShot = await sharp(await page.screenshot({ clip })).removeAlpha().raw().toBuffer();
      await solo.evaluate((el) => el.remove());
      let changed = 0; let k = 0;
      for (let y = 0; y < clip.height; y++) {
        for (let x = 0; x < clip.width; x++) {
          const i = ((run.y + y) * info.width + run.x + x) * 3; const j = (y * clip.width + x) * 3;
          changed += Math.abs(shown[i] - soloShot[j]) + Math.abs(shown[i + 1] - soloShot[j + 1]) + Math.abs(shown[i + 2] - soloShot[j + 2]); k++;
        }
      }
      if (changed / k < 1.5) continue;
    }
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
