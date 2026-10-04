// Renders every still asset to exports/ by screenshotting the HTML templates.
// Usage: npm run render   (run `npm run logo` first if the logo crops are missing)
//
// Per post and language (exports/posts/NN-<slug>/<lang>/):
//   01-cover.png   frame 0 of the hero animation (the video itself is made by `npm run motion`)
//   02.png …       the static carousel slides
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { color } from './tokens.mjs';
import { posts, highlights } from './content.mjs';
import { slideHtml, profilePicture, highlightCover } from './templates.mjs';
import { stage } from './motion/stage.mjs';
import { profileMockup, gridPreview, brandBoard } from './previews.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => path.join(root, 'exports', ...p);
const pad = (n) => String(n).padStart(2, '0');
export const LANGS = ['en', 'ar'];

const browser = await chromium.launch();
const page = await browser.newPage();
let count = 0;

async function shot(html, file, { width, height, scale = 1, fullPage = false, ready = 'fonts' }) {
  const target = scale === 1 ? page : await (await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale })).newPage();
  if (scale === 1 && (page.viewportSize()?.width !== width || page.viewportSize()?.height !== height)) {
    await page.setViewportSize({ width, height });
  }
  await target.setContent(html, { waitUntil: 'load' });
  if (ready === 'stage') await target.waitForFunction(() => window.__ready === true);
  else await target.evaluate(() => document.fonts.ready);
  // Layout guard for slides: warn when content runs into (or nearly touches) the footer row.
  const crowded = await target.evaluate(() => {
    const foot = document.querySelector('.frame > .foot');
    const prev = foot?.previousElementSibling;
    if (!foot || !prev) return null;
    const gap = foot.getBoundingClientRect().top - prev.getBoundingClientRect().bottom;
    return gap < 40 ? Math.round(gap) : null;
  });
  if (crowded !== null) console.warn(`warning: ${path.relative(root, file)}: content ends ${crowded}px above the footer (want ≥ 40px)`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await target.screenshot({ path: file, fullPage });
  if (scale !== 1) await target.context().close();
  count++;
}

// Profile picture
await shot(profilePicture(), out('profile/profile-picture.png'), { width: 1080, height: 1080 });
await shot(profilePicture({ bg: color.midnight }), out('profile/profile-picture-dark.png'), { width: 1080, height: 1080 });

// Highlight covers (icons only, shared by both languages)
for (const [i, h] of highlights.entries()) {
  await shot(highlightCover(h), out('highlights', `${pad(i + 1)}-${h.slug}.png`), { width: 1080, height: 1920 });
}

// Launch posts: one folder per post, one sub-folder per language
for (const post of posts) {
  const scene = (await import(path.join(root, 'design/scenes', `${post.scene}.mjs`))).default;
  const slides = post.slides ?? [];
  const total = slides.length + 1;
  for (const lang of LANGS) {
    const dir = out('posts', `${pad(post.order)}-${post.slug}`, lang);
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) if (f.endsWith('.png')) fs.rmSync(path.join(dir, f));
    await shot(stage({ scene, post, lang, format: 'feed', swipe: slides.length > 0 }), path.join(dir, '01-cover.png'), { width: 1080, height: 1350, ready: 'stage' });
    for (const [i, slide] of slides.entries()) {
      await shot(slideHtml(slide, i + 2, total, lang), path.join(dir, `${pad(i + 2)}.png`), { width: 1080, height: 1350 });
    }
  }
}

// Previews built from the files rendered above; both grow with the number of posts.
const rows = Math.ceil((posts.length * LANGS.length) / 3);
await shot(profileMockup(), out('preview/profile-mockup.png'), { width: 430, height: 800, scale: 2, fullPage: true });
await shot(gridPreview(), out('preview/grid.png'), { width: 1080, height: rows * 480 });
await shot(brandBoard(), out('brand/brand-board.png'), { width: 1600, height: 1000, scale: 2 });

await browser.close();
console.log(`render: wrote ${count} images to exports/`);
