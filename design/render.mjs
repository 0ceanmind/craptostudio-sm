// Renders every Instagram asset to exports/ by screenshotting the HTML templates.
// Usage: npm run render   (run `npm run logo` first if the logo crops are missing)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { color } from './tokens.mjs';
import { posts, highlights } from './content.mjs';
import { cover, slideHtml, profilePicture, highlightCover } from './templates.mjs';
import { profileMockup, gridPreview, brandBoard } from './previews.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => path.join(root, 'exports', ...p);
const pad = (n) => String(n).padStart(2, '0');

const browser = await chromium.launch();
const page = await browser.newPage();
let count = 0;

async function shot(html, file, { width, height, scale = 1, fullPage = false }) {
  if (page.viewportSize()?.width !== width || page.viewportSize()?.height !== height) {
    await page.setViewportSize({ width, height });
  }
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (scale === 1) {
    await page.screenshot({ path: file });
  } else {
    // Previews render at 2× for crisp text; a fresh context carries the device scale.
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
    const p = await ctx.newPage();
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: file, fullPage });
    await ctx.close();
  }
  count++;
}

// Profile picture
await shot(profilePicture(), out('profile/profile-picture.png'), { width: 1080, height: 1080 });
await shot(profilePicture({ bg: color.midnight }), out('profile/profile-picture-dark.png'), { width: 1080, height: 1080 });

// Highlight covers
for (const [i, h] of highlights.entries()) {
  await shot(highlightCover(h), out('highlights', `${pad(i + 1)}-${h.slug}.png`), { width: 1080, height: 1920 });
}

// Launch posts: folder per post in posting order, 01.png = cover
for (const post of posts) {
  const dir = out('posts', `${pad(post.order)}-${post.slug}`);
  fs.rmSync(dir, { recursive: true, force: true });
  const total = post.slides.length + 1;
  await shot(cover(post), path.join(dir, '01.png'), { width: 1080, height: 1350 });
  for (const [i, slide] of post.slides.entries()) {
    await shot(slideHtml(slide, i + 2, total), path.join(dir, `${pad(i + 2)}.png`), { width: 1080, height: 1350 });
  }
}

// Previews built from the files rendered above; both grow with the number of posts.
await shot(profileMockup(), out('preview/profile-mockup.png'), { width: 430, height: 800, scale: 2, fullPage: true });
await shot(gridPreview(), out('preview/grid.png'), { width: 1080, height: Math.ceil(posts.length / 3) * 480 });
await shot(brandBoard(), out('brand/brand-board.png'), { width: 1600, height: 1000, scale: 2 });

await browser.close();
console.log(`render: wrote ${count} images to exports/`);
