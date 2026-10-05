// Screenshots of a post for quick review: a contact sheet of the hero (two moments of the
// animation) and every slide, plus layout warnings (text crowding the footer, overflowing boxes).
// Used by the MCP server so Claude can look at what it made, and by the workspace.
import sharp from 'sharp';
import { chromium } from 'playwright';
import { heroHtml, slidePreviewHtml } from './render-html.mjs';
import { normalizePost } from './schema.mjs';

let browserPromise = null;
let idleTimer = null;
async function browser() {
  clearTimeout(idleTimer);
  browserPromise ??= chromium.launch();
  return browserPromise;
}
// Close Chromium after a minute without use, so idle servers don't hold it open.
function release() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(async () => { const b = await browserPromise; browserPromise = null; await b?.close(); }, 60_000);
  idleTimer.unref?.();
}

// Layout problems a human would spot: content running into the footer, text clipped by its box.
const LAYOUT_PROBE = () => {
  const issues = [];
  const foot = document.querySelector('.frame > .foot') ?? document.querySelector('body > .foot');
  const copy = document.querySelector('.copy');
  if (foot && copy && copy.getBoundingClientRect().bottom > foot.getBoundingClientRect().top - 12) issues.push('headline block runs into the footer');
  const prev = document.querySelector('.frame > .foot')?.previousElementSibling;
  if (prev && foot && foot.getBoundingClientRect().top - prev.getBoundingClientRect().bottom < 40) issues.push('content ends less than 40px above the footer');
  const h1 = document.querySelector('.copy h1');
  if (h1) {
    const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    if (lines > 3) issues.push(`headline wraps to ${lines} lines (keep it to 2–3)`);
  }
  for (const el of document.querySelectorAll('.card .x, li .h, li .d, h2, .copy h1, .copy .sub')) {
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible' && el.clientWidth > 0) issues.push(`text clipped: "${el.textContent.trim().slice(0, 40)}"`);
  }
  const scene = document.querySelector('.scene');
  if (scene && copy) {
    const s = scene.getBoundingClientRect(); const c = copy.getBoundingClientRect();
    if (c.top < s.bottom - 40 && document.body.classList.contains('fmt-feed')) issues.push('headline block overlaps the animation');
  }
  return [...new Set(issues)];
};

async function shoot(page, html, { stageReady = false, seek = null, width = 1080, height = 1350 }) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: 'load' });
  if (stageReady) {
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 15_000 });
    if (seek !== null) await page.evaluate((t) => window.__seek(t), seek);
  } else {
    await page.evaluate(() => document.fonts.ready);
  }
  const issues = await page.evaluate(LAYOUT_PROBE);
  return { png: await page.screenshot({ type: 'png' }), issues };
}

// Returns { image: PNG buffer, warnings: string[] }. One row per language: hero at frame 0 (the
// cover), hero mid-animation, then each slide.
export async function contactSheet(input, { langs = ['en', 'ar'], tile = 300, midFrame = 3.6, format = 'feed' } = {}) {
  const post = normalizePost(input);
  const b = await browser();
  const page = await b.newPage();
  const rows = []; const warnings = [];
  try {
    for (const lang of langs) {
      const tiles = [];
      const height = format === 'reel' ? 1920 : 1350;
      const hero = await heroHtml(post, { lang, format });
      const cover = await shoot(page, hero, { stageReady: true, seek: 0, height });
      cover.issues.forEach((i) => warnings.push(`${lang} hero: ${i}`));
      tiles.push(cover.png);
      tiles.push((await shoot(page, hero, { stageReady: true, seek: midFrame, height })).png);
      if (format === 'feed') {
        for (let i = 0; i < post.slides.length; i++) {
          try {
            const s = await shoot(page, slidePreviewHtml(post, i, { lang }), {});
            s.issues.forEach((x) => warnings.push(`${lang} slide ${i + 2}: ${x}`));
            tiles.push(s.png);
          } catch (e) { warnings.push(`${lang} slide ${i + 2}: ${e.message}`); }
        }
      }
      rows.push(await Promise.all(tiles.map((t) => sharp(t).resize({ width: tile }).png().toBuffer())));
    }
  } finally {
    await page.close();
    release();
  }
  const th = Math.round(tile * (format === 'reel' ? 1920 : 1350) / 1080);
  const gap = 10;
  const cols = Math.max(...rows.map((r) => r.length));
  const image = await sharp({ create: { width: cols * tile + (cols + 1) * gap, height: rows.length * th + (rows.length + 1) * gap, channels: 3, background: '#2A3446' } })
    .composite(rows.flatMap((r, y) => r.map((input, x) => ({ input, left: gap + x * (tile + gap), top: gap + y * (th + gap) }))))
    .png().toBuffer();
  return { image, warnings };
}

// One full-size frame of the hero (for thumbnails or a closer look).
export async function heroFrame(input, { lang = 'en', format = 'feed', t = 0 } = {}) {
  const b = await browser();
  const page = await b.newPage();
  try {
    const { png } = await shoot(page, await heroHtml(input, { lang, format }), { stageReady: true, seek: t, height: format === 'reel' ? 1920 : 1350 });
    return png;
  } finally { await page.close(); release(); }
}
