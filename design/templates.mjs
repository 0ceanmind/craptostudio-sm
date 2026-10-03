// HTML templates for every asset. Each function returns a full HTML document sized
// to the exact pixel dimensions Instagram expects; render.mjs screenshots them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { color, gradient, font, handle } from './tokens.mjs';
import { services } from './content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;

const fontFace = (family, dir, weight) => {
  const file = path.join(root, 'node_modules/@fontsource', dir, 'files', `${dir}-latin-${weight}-normal.woff2`);
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(${dataUri(file, 'font/woff2')}) format('woff2');}`;
};
const fontCss = [
  ...[500, 700, 800].map((w) => fontFace('Plus Jakarta Sans', 'plus-jakarta-sans', w)),
  ...[500, 700].map((w) => fontFace('JetBrains Mono', 'jetbrains-mono', w)),
].join('\n');

// Trimmed logo crops produced by prepare-logo.mjs.
const logoCache = {};
export function logo(name) {
  logoCache[name] ??= dataUri(path.join(root, 'exports/logo', `${name}.png`), 'image/png');
  return logoCache[name];
}

export function icon(name, { size = 48, stroke = 2 } = {}) {
  const file = path.join(root, 'node_modules/lucide-static/icons', `${name}.svg`);
  return fs.readFileSync(file, 'utf8')
    .replace(/<!--.*?-->/s, '')
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`)
    .replace(/stroke-width="2"/, `stroke-width="${stroke}"`)
    .trim();
}

// *word* → accent span; trailing punctuation joins the span so it doesn't drift away from the word
const accent = (text) => text.replace(/\*(.+?)\*([.,!?]*)/g, '<em>$1$2</em>');

// The bundled font subsets have no arrows (U+2192 falls back to a thin system glyph), so
// arrows are drawn with Lucide icons instead.
const glyph = (name) => `<span class="gl">${icon(name, { size: 24, stroke: 2.5 })}</span>`;

// All text from content.mjs goes through here: keeps hyphenated words and “DM START” on one line,
// applies accents, swaps arrows for icons, and (for big display type) tucks in loose apostrophes.
function rich(text, { display = false } = {}) {
  let s = text
    .replace(/\b([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)\b/g, '<span class="nw">$1</span>')
    .replace(/DM “/g, 'DM&nbsp;“');
  s = accent(s).replace(/\n/g, '<br>');
  if (display) s = s.replace(/’/g, '<span class="ap">’</span>');
  return s.replace(/→/g, glyph('arrow-right'));
}

const sparkText = `background:${gradient.spark};-webkit-background-clip:text;background-clip:text;color:transparent;`;
const underline = (c) => `text-decoration:underline;text-decoration-color:${c};text-decoration-thickness:.085em;text-underline-offset:.12em;text-decoration-skip-ink:auto;`;

const themes = {
  dark: {
    bg: `radial-gradient(ellipse 70% 45% at 92% 0%, rgba(66,150,209,.32), transparent 70%), ${color.midnight}`,
    text: color.white, sub: color.slate, line: color.line,
    symbol: 'symbol-color', watermark: 'symbol-white', watermarkOpacity: 0.05,
    grid: 'rgba(147,169,198,0.07)',
    tile: gradient.brand, tileIcon: color.white,
    em: sparkText,
  },
  // Cobalt, only shaded darker, so small white text stays above 4.5:1 everywhere.
  // (White on the lighter blues is too weak: 3.2:1 on Crapto Blue, 2.3:1 on Sky.)
  blue: {
    bg: `linear-gradient(160deg, rgba(255,255,255,.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.2) 100%), ${color.cobalt}`,
    text: color.white, sub: color.white, line: 'rgba(255,255,255,0.28)',
    symbol: 'symbol-white', watermark: 'symbol-white', watermarkOpacity: 0.07,
    grid: 'rgba(255,255,255,0.055)',
    tile: color.white, tileIcon: color.cobalt,
    em: underline(color.amber),
  },
  light: {
    bg: `radial-gradient(ellipse 70% 45% at 92% 0%, rgba(255,255,255,.75), transparent 70%), ${color.mist}`,
    text: color.ink, sub: '#3E5470', line: '#B9CDE0',
    symbol: 'symbol-color', watermark: 'symbol-black', watermarkOpacity: 0.05,
    grid: 'rgba(55,107,177,0.08)',
    tile: gradient.brand, tileIcon: color.white,
    em: `color:${color.cobalt};${underline(color.spark)}`,
  },
};

function page({ width, height, css = '', body }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{font-family:${font.display};-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
${css}
</style></head><body>${body}</body></html>`;
}

// ---------- Feed posts (1080 × 1350, 4:5) ----------
// Instagram's profile grid shows a 3:4 center crop of 4:5 posts (≈34px off each side),
// so all content stays inside the 88px side padding.

export const POST_W = 1080;
export const POST_H = 1350;
const PAD = 88;

function postCss(t) {
  return `
body{background:${t.bg};color:${t.text};position:relative}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(${t.grid} 2px,transparent 2px),linear-gradient(90deg,${t.grid} 2px,transparent 2px);
  background-size:72px 72px;background-position:-1px -1px;
  -webkit-mask-image:radial-gradient(ellipse 85% 70% at 75% 90%,#000 15%,transparent 72%)}
.wm{position:absolute;width:980px;right:-300px;bottom:-170px;opacity:${t.watermarkOpacity};transform:rotate(-8deg)}
.frame{position:absolute;inset:${PAD}px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;height:56px}
.brand{display:flex;align-items:center;gap:18px;font-family:${font.mono};font-size:23px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
.brand img{height:50px;display:block}
.tag{font-family:${font.mono};font-size:23px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:${t.sub}}
.tag b{color:${t.text};font-weight:700}
em{font-style:normal;white-space:nowrap;${t.em}}
.nw{white-space:nowrap}
.ap{margin:0 -.04em}
.gl{display:inline-flex;vertical-align:-.12em}
.gl svg{width:.9em;height:.9em}
h1,h2,p,li,.sub,.cap,.card{text-wrap:pretty}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;font-family:${font.mono};font-size:24px;font-weight:500;letter-spacing:.05em;color:${t.sub}}
`;
}

const brandRow = (t, right) =>
  `<div class="top"><div class="brand"><img src="${logo(t.symbol)}"><span>Crapto Studio</span></div>${right}</div>`;

function headlineSize(text) {
  const len = text.replace(/\*/g, '').length;
  if (len <= 18) return 150;
  if (len <= 30) return 124;
  return 108;
}

export function cover(post) {
  const t = themes[post.theme];
  const size = headlineSize(post.headline);
  // The intro post leads with the full logo instead of a service icon.
  const lead = post.icon
    ? `<div class="tile">${icon(post.icon, { size: 68, stroke: 1.9 })}</div>`
    : `<img class="lead-logo" src="${logo(post.theme === 'blue' ? 'logo-white' : 'logo-color')}">`;
  const css = postCss(t) + `
.tile{margin-top:150px;width:128px;height:128px;border-radius:36px;background:${t.tile};color:${t.tileIcon};display:grid;place-items:center;box-shadow:0 18px 40px rgba(11,22,40,.22)}
.lead-logo{margin-top:120px;height:240px;align-self:flex-start}
h1{margin-top:56px;font-size:${size}px;line-height:1.04;letter-spacing:-.028em;word-spacing:.04em;font-weight:800;max-width:900px}
.sub{margin-top:40px;font-family:${font.mono};font-size:28px;font-weight:500;color:${t.sub};letter-spacing:.01em}
`;
  const body = `<div class="grid"></div><img class="wm" src="${logo(t.watermark)}"><div class="frame">
${brandRow(t, `<div class="tag">[ <b>${post.tag}</b> ]</div>`)}
${lead}
<h1>${rich(post.headline, { display: true })}</h1>
<div class="sub">${rich(post.sub)}</div>
<div class="foot"><span>${handle}</span><span>${post.slides?.length ? rich('Swipe →') : ''}</span></div>
</div>`;
  return page({ width: POST_W, height: POST_H, css, body });
}

// Inner carousel slides always use the dark theme so every post reads the same past the cover.
const inner = themes.dark;

function innerFrame(n, total, content, css, last = false) {
  return page({
    width: POST_W, height: POST_H,
    css: postCss(inner) + css,
    body: `<div class="grid" style="opacity:.7"></div><div class="frame">
${brandRow(inner, `<div class="tag"><b>${String(n).padStart(2, '0')}</b> / ${String(total).padStart(2, '0')}</div>`)}
${content}
<div class="foot"><span>${handle}</span><span>${last ? `Save for later ${glyph('bookmark')}` : rich('Swipe →')}</span></div>
</div>`,
  });
}

const h2Css = `h2{margin-top:104px;font-size:76px;line-height:1;letter-spacing:-.025em;word-spacing:.04em;font-weight:800}`;

export function listSlide(slide, n, total) {
  const css = `${h2Css}
ol{list-style:none;margin:60px 0 48px;border-top:2px solid ${inner.line};flex:1;max-height:840px;display:flex;flex-direction:column}
li{flex:1;display:flex;align-items:center;padding:22px 0;border-bottom:2px solid ${inner.line}}
li .row{display:flex;gap:36px;align-items:baseline}
li .n{font-family:${font.mono};font-size:27px;font-weight:700;color:${color.spark};min-width:44px}
li .x{font-size:43px;line-height:1.22;font-weight:700;letter-spacing:-.01em;word-spacing:.03em}
`;
  // Rows share the space between title and footer: short items spread out, long ones compress.
  const items = slide.items.map((it, i) =>
    `<li><div class="row"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="x">${rich(it)}</span></div></li>`).join('');
  return innerFrame(n, total, `<h2>${rich(slide.title, { display: true })}</h2><ol>${items}</ol>`, css);
}

export function stepsSlide(slide, n, total) {
  const css = `${h2Css}
ol{list-style:none;margin:52px 0 48px;display:flex;flex-direction:column;gap:16px}
li{display:grid;grid-template-columns:84px 1fr;column-gap:30px;padding:28px 34px;background:${color.navy};border:2px solid ${inner.line};border-radius:28px}
li .n{grid-row:span 2;font-family:${font.mono};font-size:28px;font-weight:700;color:${color.white};background:${color.cobalt};height:64px;border-radius:18px;display:grid;place-items:center}
li .h{font-size:42px;font-weight:800;letter-spacing:-.015em;word-spacing:.03em;line-height:1.1}
li .d{margin-top:10px;font-size:30px;font-weight:500;line-height:1.36;color:${inner.sub}}
`;
  const items = slide.items.map(([h, d], i) =>
    `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="h">${rich(h)}</span><span class="d">${rich(d)}</span></li>`).join('');
  return innerFrame(n, total, `<h2>${rich(slide.title, { display: true })}</h2><ol>${items}</ol>`, css);
}

export function statementSlide(slide, n, total) {
  const css = `
.k{margin-top:170px;font-family:${font.mono};font-size:28px;font-weight:700;color:${color.sky}}
p{margin-top:40px;font-size:72px;line-height:1.16;letter-spacing:-.022em;word-spacing:.04em;font-weight:700}
`;
  return innerFrame(n, total, `<div class="k">${slide.kicker}</div><p>${rich(slide.text, { display: true })}</p>`, css);
}

export function servicesSlide(slide, n, total) {
  const css = `${h2Css}
.cards{margin-top:60px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:20px}
.card{background:${color.navy};border:2px solid ${inner.line};border-radius:28px;padding:36px 26px;display:flex;align-items:center;gap:22px}
.card .i{flex:none;width:84px;height:84px;border-radius:24px;background:${gradient.brand};color:${color.white};display:grid;place-items:center}
.card .h{color:${inner.text};font-size:36px;font-weight:800;letter-spacing:-.015em;line-height:1.1}
.card .s{margin-top:8px;color:${inner.sub};font-family:${font.mono};font-size:22px;font-weight:500;line-height:1.3}
`;
  const cards = services.map((s) =>
    `<div class="card"><div class="i">${icon(s.icon, { size: 44, stroke: 1.9 })}</div><div><div class="h">${rich(s.title)}</div><div class="s">${rich(s.sub)}</div></div></div>`).join('');
  return innerFrame(n, total, `<h2>${rich(slide.title, { display: true })}</h2><div class="cards">${cards}</div>`, css);
}

// A screenshot or photo, e.g. for case studies. `src` is relative to the repo root.
export function imageSlide(slide, n, total) {
  const ext = path.extname(slide.src).slice(1).toLowerCase();
  const type = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext];
  if (!type) throw new Error(`image slide: unsupported file type .${ext} (${slide.src})`);
  const src = dataUri(path.join(root, slide.src), type);
  const css = `${h2Css}
h2{margin-top:72px}
.shot{flex:1;min-height:0;margin:${slide.title ? 44 : 64}px 0 ${slide.caption ? 0 : 40}px;border-radius:28px;border:2px solid ${inner.line};background:${color.navy} url(${src}) center/${slide.fit === 'cover' ? 'cover' : 'contain'} no-repeat}
.cap{margin:28px 0 40px;font-size:32px;font-weight:500;line-height:1.35;color:${inner.sub}}
`;
  const content = `${slide.title ? `<h2>${rich(slide.title, { display: true })}</h2>` : ''}<div class="shot"></div>${slide.caption ? `<div class="cap">${rich(slide.caption)}</div>` : ''}`;
  return innerFrame(n, total, content, css);
}

// Last slide of every carousel. A post can override the headline/body, e.g. the mentoring post
// shouldn't promise to "compile" a student's project for them.
export const CTA_DEFAULT = {
  headline: 'Got an idea?\n*Let’s compile it.*',
  body: 'DM us **“START”** or tap the link in bio, and we’ll reply with next steps.',
};

export function ctaSlide(slide, n, total) {
  const headline = slide.headline ?? CTA_DEFAULT.headline;
  const body = (slide.body ?? CTA_DEFAULT.body).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const css = `
.m{margin-top:110px;height:190px;align-self:flex-start}
h2{margin-top:70px;font-size:112px;line-height:1.04;letter-spacing:-.028em;word-spacing:.04em;font-weight:800}
p{margin-top:44px;font-size:38px;font-weight:500;line-height:1.38;color:${inner.sub};max-width:840px}
p b{color:${inner.text};font-weight:800}
.pills{margin-top:56px;display:flex;gap:16px}
.pill{font-family:${font.mono};font-size:24px;font-weight:700;padding:18px 28px;border:2px solid ${inner.line};border-radius:999px;color:${inner.text}}
.pill.on{background:${color.cobalt};border-color:${color.cobalt}}
`;
  const content = `<img class="m" src="${logo('symbol-color')}">
<h2>${rich(headline, { display: true })}</h2>
<p>${rich(body)}</p>
<div class="pills"><span class="pill on">Follow ${handle}</span></div>`;
  return innerFrame(n, total, content, css, true);
}

export function slideHtml(slide, n, total) {
  switch (slide.type) {
    case 'list': return listSlide(slide, n, total);
    case 'steps': return stepsSlide(slide, n, total);
    case 'statement': return statementSlide(slide, n, total);
    case 'services': return servicesSlide(slide, n, total);
    case 'image': return imageSlide(slide, n, total);
    case 'cta': return ctaSlide(slide, n, total);
    default: throw new Error(`unknown slide type ${slide.type}`);
  }
}

// ---------- Profile picture (1080 × 1080, shown as a circle) ----------
// Symbol only: the wordmark is unreadable at the ~110px the circle is shown at.

export function profilePicture({ bg = color.white, symbol = 'symbol-color' } = {}) {
  return page({
    width: 1080, height: 1080,
    css: `body{background:${bg};display:grid;place-items:center}img{width:760px;display:block;transform:translateY(-4px)}`,
    body: `<img src="${logo(symbol)}">`,
  });
}

// ---------- Story highlight covers (1080 × 1920) ----------
// Instagram shows only the center circle, so the icon stays centered and moderate.

export function highlightCover(h) {
  return page({
    width: 1080, height: 1920,
    css: `body{background:${gradient.brand};display:grid;place-items:center;color:${color.white}}`,
    body: icon(h.icon, { size: 360, stroke: 2.1 }),
  });
}
