// HTML templates for the static assets: carousel slides (after the animated hero), the
// profile picture and highlight covers. Every slide renders in English or Arabic (RTL).
// render.mjs screenshots them at the exact pixel sizes Instagram expects.
// The cover of each post is frame 0 of its hero video (design/motion/stage.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { color, gradient, handle } from './tokens.mjs';
import { fontCss, stack } from './fonts.mjs';
import { services, ctaDefault } from './content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;

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

// The bundled font subsets have no arrows, so arrows are drawn as icons.
const glyph = (name) => `<span class="gl">${icon(name, { size: 24, stroke: 2.5 })}</span>`;

// *accent*, **bold**, \n line breaks; hyphenated words and “DM START” never break.
function rich(text, { display = false } = {}) {
  let s = text
    .replace(/\b([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)\b/g, '<span class="nw">$1</span>')
    .replace(/DM “/g, 'DM&nbsp;“');
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*([.,!?؟،]*)/g, '<em>$1$2</em>').replace(/\n/g, '<br>');
  if (display) s = s.replace(/’/g, '<span class="ap">’</span>');
  return s.replace(/→/g, glyph('arrow-right'));
}

const tr = (v, lang) => (v && typeof v === 'object' && 'en' in v ? v[lang] : v);

function page({ width, height, lang = 'en', css = '', body }) {
  const rtl = lang === 'ar';
  return `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${width}px;height:${height}px;overflow:hidden}
body{font-family:${rtl ? stack.arabic : stack.display};-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
${css}
</style></head><body>${body}</body></html>`;
}

// ---------- Carousel slides (1080 × 1350, 4:5), always on the dark theme ----------

export const POST_W = 1080;
export const POST_H = 1350;
const PAD = 88;

function slideCss(rtl) {
  return `
body{background:radial-gradient(ellipse 70% 45% at ${rtl ? '8%' : '92%'} 0%, rgba(66,150,209,.32), transparent 70%), ${color.midnight};color:${color.white};position:relative}
.grid{position:absolute;inset:0;opacity:.7;
  background-image:linear-gradient(rgba(147,169,198,0.07) 2px,transparent 2px),linear-gradient(90deg,rgba(147,169,198,0.07) 2px,transparent 2px);
  background-size:72px 72px;background-position:-1px -1px;
  -webkit-mask-image:radial-gradient(ellipse 85% 70% at ${rtl ? '25%' : '75%'} 90%,#000 15%,transparent 72%)}
.frame{position:absolute;inset:${PAD}px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;height:56px}
.brand{display:flex;align-items:center;gap:18px;font-family:${stack.mono};font-size:23px;font-weight:700;letter-spacing:.18em;direction:ltr}
.brand img{height:50px;display:block}
.tag{font-family:${stack.mono};font-size:23px;font-weight:500;letter-spacing:.1em;color:${color.slate};border:2px solid ${color.line};border-radius:999px;padding:8px 22px;direction:ltr}
.tag b{color:${color.white};font-weight:700}
em{font-style:normal;white-space:nowrap;background:${gradient.spark};-webkit-background-clip:text;background-clip:text;color:transparent}
.nw{white-space:nowrap}
.ap{margin:0 -.04em}
.gl{display:inline-flex;vertical-align:-.12em}
.gl svg{width:.9em;height:.9em}
${rtl ? '.gl svg{transform:scaleX(-1)}' : ''}
h1,h2,p,li,.cap,.card{text-wrap:pretty}
h2{margin-top:96px;font-size:${rtl ? 70 : 76}px;line-height:${rtl ? 1.3 : 1};letter-spacing:${rtl ? 0 : '-.025em'};word-spacing:${rtl ? 0 : '.04em'};font-weight:800}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;font-family:${rtl ? stack.arabic : stack.mono};font-size:24px;font-weight:500;letter-spacing:${rtl ? 0 : '.05em'};color:${color.slate}}
.foot .h{font-family:${stack.mono};direction:ltr}
.foot .sw{display:inline-flex;align-items:center;gap:10px}
.foot svg{width:22px;height:22px}
`;
}

const brandRow = (right) => `<div class="top"><div class="brand"><img src="${logo('symbol-color')}"><span>CRAPTO STUDIO</span></div>${right}</div>`;

function slideFrame(lang, n, total, content, css, last = false) {
  const rtl = lang === 'ar';
  const arrow = icon('arrow-right', { size: 22, stroke: 2.5 }).replace('<svg', `<svg style="${rtl ? 'transform:scaleX(-1)' : ''}"`);
  const next = last
    ? `<span class="sw">${rtl ? 'احفظه لوقت لاحق' : 'Save for later'} ${icon('bookmark', { size: 22, stroke: 2.5 })}</span>`
    : `<span class="sw">${rtl ? 'اسحب' : 'Swipe'} ${arrow}</span>`;
  return page({
    width: POST_W, height: POST_H, lang,
    css: slideCss(rtl) + css,
    body: `<div class="grid"></div><div class="frame">
${brandRow(`<div class="tag"><b>${String(n).padStart(2, '0')}</b> / ${String(total).padStart(2, '0')}</div>`)}
${content}
<div class="foot"><span class="h">${handle}</span>${next}</div>
</div>`,
  });
}

// 2×2 grid of big icon cards with a few words each: the visual-first replacement for lists.
export function cardsSlide(slide, n, total, lang) {
  const rtl = lang === 'ar';
  const css = `
.cards{margin:64px 0 56px;flex:1;max-height:820px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:22px}
.card{position:relative;overflow:hidden;background:${color.navy};border:2px solid ${color.line};border-radius:34px;padding:38px 34px;display:flex;flex-direction:column;justify-content:space-between}
.card::after{content:'';position:absolute;width:260px;height:260px;border-radius:50%;inset-inline-end:-90px;top:-90px;background:radial-gradient(circle,rgba(66,150,209,.28),transparent 70%)}
.card .i{width:112px;height:112px;border-radius:32px;background:${gradient.brand};color:#fff;display:grid;place-items:center;box-shadow:0 20px 40px rgba(3,8,18,.35)}
.card .n{position:absolute;top:34px;inset-inline-end:34px;font-family:${stack.mono};font-size:26px;font-weight:700;color:${color.spark}}
.card .x{font-size:${rtl ? 38 : 40}px;line-height:${rtl ? 1.45 : 1.18};font-weight:800;letter-spacing:${rtl ? 0 : '-.015em'}}
`;
  const items = slide.items.map((it, i) =>
    `<div class="card"><div class="i">${icon(it.icon, { size: 58, stroke: 1.9 })}</div><span class="n">${String(i + 1).padStart(2, '0')}</span><div class="x">${rich(tr(it.text, lang))}</div></div>`).join('');
  return slideFrame(lang, n, total, `<h2>${rich(tr(slide.title, lang), { display: true })}</h2><div class="cards">${items}</div>`, css);
}

export function stepsSlide(slide, n, total, lang) {
  const rtl = lang === 'ar';
  const css = `
ol{list-style:none;margin:56px 0 48px;flex:1;display:flex;flex-direction:column;gap:18px}
li{flex:1;display:grid;grid-template-columns:96px 1fr;column-gap:30px;align-content:center;padding:26px 34px;background:${color.navy};border:2px solid ${color.line};border-radius:30px}
li .n{grid-row:span 2;align-self:center;font-family:${stack.mono};font-size:30px;font-weight:700;color:${color.white};background:${color.cobalt};height:76px;border-radius:22px;display:grid;place-items:center}
li .h{font-size:${rtl ? 40 : 44}px;font-weight:800;letter-spacing:${rtl ? 0 : '-.015em'};line-height:${rtl ? 1.4 : 1.1}}
li .d{margin-top:6px;font-size:${rtl ? 29 : 31}px;font-weight:500;line-height:1.4;color:${color.slate}}
`;
  const items = slide.items.map((it, i) =>
    `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="h">${rich(tr(it.title, lang))}</span><span class="d">${rich(tr(it.text, lang))}</span></li>`).join('');
  return slideFrame(lang, n, total, `<h2>${rich(tr(slide.title, lang), { display: true })}</h2><ol>${items}</ol>`, css);
}

export function statementSlide(slide, n, total, lang) {
  const rtl = lang === 'ar';
  const css = `
.k{margin-top:180px;font-family:${stack.mono};font-size:30px;font-weight:700;color:${color.sky};direction:${rtl ? 'rtl' : 'ltr'}}
p{margin-top:40px;font-size:${rtl ? 70 : 80}px;line-height:${rtl ? 1.45 : 1.12};letter-spacing:${rtl ? 0 : '-.025em'};word-spacing:${rtl ? 0 : '.04em'};font-weight:800}
.mark{position:absolute;bottom:${PAD + 70}px;inset-inline-end:${PAD}px;height:150px;opacity:.95}
`;
  return slideFrame(lang, n, total, `<div class="k">${tr(slide.kicker, lang)}</div><p>${rich(tr(slide.text, lang), { display: true })}</p><img class="mark" src="${logo('symbol-color')}">`, css);
}

export function servicesSlide(slide, n, total, lang) {
  const rtl = lang === 'ar';
  const css = `
.cards{margin:56px 0 48px;flex:1;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:20px}
.card{background:${color.navy};border:2px solid ${color.line};border-radius:28px;padding:26px;display:flex;align-items:center;gap:22px}
.card .i{flex:none;width:88px;height:88px;border-radius:26px;background:${gradient.brand};color:${color.white};display:grid;place-items:center}
.card .h{color:${color.white};font-size:${rtl ? 32 : 36}px;font-weight:800;letter-spacing:${rtl ? 0 : '-.015em'};line-height:${rtl ? 1.35 : 1.1}}
.card .s{margin-top:6px;color:${color.slate};font-family:${rtl ? stack.arabic : stack.mono};font-size:${rtl ? 22 : 21}px;font-weight:500;line-height:1.4}
`;
  const cards = services.map((s) =>
    `<div class="card"><div class="i">${icon(s.icon, { size: 46, stroke: 1.9 })}</div><div><div class="h">${rich(s.title[lang])}</div><div class="s">${rich(s.sub[lang])}</div></div></div>`).join('');
  return slideFrame(lang, n, total, `<h2>${rich(tr(slide.title, lang), { display: true })}</h2><div class="cards">${cards}</div>`, css);
}

// A screenshot or photo, e.g. for case studies. `src` is relative to the repo root.
export function imageSlide(slide, n, total, lang) {
  const ext = path.extname(slide.src).slice(1).toLowerCase();
  const type = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext];
  if (!type) throw new Error(`image slide: unsupported file type .${ext} (${slide.src})`);
  const src = dataUri(path.join(root, slide.src), type);
  const title = tr(slide.title, lang); const caption = tr(slide.caption, lang);
  const css = `
h2{margin-top:72px}
.shot{flex:1;min-height:0;margin:${title ? 44 : 64}px 0 ${caption ? 0 : 40}px;border-radius:28px;border:2px solid ${color.line};background:${color.navy} url(${src}) center/${slide.fit === 'cover' ? 'cover' : 'contain'} no-repeat}
.cap{margin:28px 0 40px;font-size:32px;font-weight:500;line-height:1.4;color:${color.slate}}
`;
  const content = `${title ? `<h2>${rich(title, { display: true })}</h2>` : ''}<div class="shot"></div>${caption ? `<div class="cap">${rich(caption)}</div>` : ''}`;
  return slideFrame(lang, n, total, content, css);
}

// Last slide of every carousel. A post can override the headline/body.
export function ctaSlide(slide, n, total, lang) {
  const rtl = lang === 'ar';
  const headline = tr(slide.headline ?? ctaDefault.headline, lang);
  const body = tr(slide.body ?? ctaDefault.body, lang);
  const css = `
.m{margin-top:120px;height:200px;align-self:flex-start}
h2{margin-top:70px;font-size:${rtl ? 96 : 112}px;line-height:${rtl ? 1.35 : 1.04};letter-spacing:${rtl ? 0 : '-.028em'};word-spacing:${rtl ? 0 : '.04em'};font-weight:800}
p{margin-top:44px;font-size:${rtl ? 36 : 40}px;font-weight:500;line-height:1.45;color:${color.slate};max-width:860px}
p b{color:${color.white};font-weight:800}
.pills{margin-top:56px;display:flex;gap:16px}
.pill{font-family:${stack.mono};font-size:26px;font-weight:700;padding:20px 32px;border-radius:999px;color:${color.white};background:${color.cobalt}}
.pill .ar{font-family:${stack.arabic};font-size:28px}
`;
  const content = `<img class="m" src="${logo('symbol-color')}">
<h2>${rich(headline, { display: true })}</h2>
<p>${rich(body)}</p>
<div class="pills"><span class="pill">${rtl ? `<span class="ar">تابِع</span> <bdi>${handle}</bdi>` : `Follow ${handle}`}</span></div>`;
  return slideFrame(lang, n, total, content, css, true);
}

export function slideHtml(slide, n, total, lang) {
  switch (slide.type) {
    case 'cards': return cardsSlide(slide, n, total, lang);
    case 'steps': return stepsSlide(slide, n, total, lang);
    case 'statement': return statementSlide(slide, n, total, lang);
    case 'services': return servicesSlide(slide, n, total, lang);
    case 'image': return imageSlide(slide, n, total, lang);
    case 'cta': return ctaSlide(slide, n, total, lang);
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
// Instagram shows only the center circle, so the icon stays centered. Icons only: one set
// works for both languages.

export function highlightCover(h) {
  return page({
    width: 1080, height: 1920,
    css: `body{background:${gradient.brand};display:grid;place-items:center;color:${color.white}}`,
    body: icon(h.icon, { size: 360, stroke: 2.1 }),
  });
}
