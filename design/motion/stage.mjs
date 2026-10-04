// The animated "stage" every hero video is rendered on: background, brand chrome, the
// headline block and a fixed-size box where the post's scene (design/scenes/*.mjs) lives.
//
// Loop contract (so the grid thumbnail and the loop both look right):
//   - The markup's natural CSS state IS the finished composition: frame 0 looks complete.
//   - A scene's timeline holds that state, clears it, replays its demo and ends back on the
//     same state. Use .to() for clearing and .fromTo() for rebuilding (immediateRender is off
//     by default here, so nothing jumps at frame 0).
//   - The headline never animates out; it stays readable for the whole video.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { color, gradient, handle } from '../tokens.mjs';
import { fontCss, stack } from '../fonts.mjs';
import { uiCss } from './ui.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gsapDir = path.join(root, 'node_modules/gsap/dist');
const gsapJs = ['gsap.min.js', 'CustomEase.min.js', 'MotionPathPlugin.min.js', 'DrawSVGPlugin.min.js']
  .map((f) => fs.readFileSync(path.join(gsapDir, f), 'utf8')).join('\n');

const dataUri = (rel) => `data:image/png;base64,${fs.readFileSync(path.join(root, rel)).toString('base64')}`;
const logoCache = {};
const logo = (name) => (logoCache[name] ??= dataUri(`exports/logo/${name}.png`));

// The scene box is designed at 904×700 and scaled per format.
export const SCENE = { width: 904, height: 740 };

export const FORMATS = {
  // 4:5 feed video (first slide of a carousel). Grid shows a centred 3:4 crop.
  feed: { width: 1080, height: 1350, sceneTop: 160, sceneScale: 1, copy: 'bottom' },
  // 9:16 Reel. Instagram's UI covers ~270px at the top, ~420px at the bottom and a column of
  // buttons on the right; the grid shows the centred 3:4 crop (y 240–1680). Copy is centred.
  reel: { width: 1080, height: 1920, sceneTop: 360, sceneScale: 1.1, copy: 'centre' },
};

export const THEMES = {
  dark: {
    bg: color.midnight, text: color.white, sub: color.slate, line: color.line, symbol: 'symbol-color',
    glowA: 'rgba(66,150,209,.38)', glowB: 'rgba(55,107,177,.30)', grid: 'rgba(147,169,198,0.06)',
  },
  blue: {
    bg: `linear-gradient(160deg, rgba(255,255,255,.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.2) 100%), ${color.cobalt}`,
    text: color.white, sub: color.white, line: 'rgba(255,255,255,0.28)', symbol: 'symbol-white',
    glowA: 'rgba(90,180,217,.30)', glowB: 'rgba(11,22,40,.35)', grid: 'rgba(255,255,255,0.05)',
  },
  light: {
    bg: color.mist, text: color.ink, sub: '#3E5470', line: '#B9CDE0', symbol: 'symbol-color',
    glowA: 'rgba(255,255,255,.85)', glowB: 'rgba(90,180,217,.28)', grid: 'rgba(55,107,177,0.07)',
  },
};

// Scenes may write animate() as a method; turn that into a function expression for the page.
const fnSource = (fn) => {
  const src = fn.toString();
  return /^(async\s+)?function\b|^\(|^[\w$]+\s*=>/.test(src) ? src : `function ${src}`;
};

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Headline markup: *accent* groups become <em>, hyphenated words never break.
function headlineHtml(text) {
  const parts = text.split(/(\*[^*]+\*[.,!?؟،]*)/).filter(Boolean);
  return parts.map((part) => {
    const m = part.match(/^\*([^*]+)\*([.,!?؟،]*)$/);
    if (m) return `<em>${escape(m[1] + m[2])}<i class="ul"></i></em>`;
    return escape(part).replace(/(\S+-\S+)/g, '<span class="nw">$1</span>');
  }).join('').replace(/\n/g, '<br>');
}

function headlineSize(text, format) {
  const len = text.replace(/[*\n]/g, '').length;
  const base = len <= 20 ? 100 : len <= 30 ? 88 : len <= 40 ? 78 : 70;
  return format === 'reel' ? Math.round(base * 1.06) : base;
}

export function stage({ scene, post, lang, format, swipe = true }) {
  const f = FORMATS[format];
  const t = THEMES[post.theme];
  const copy = { tag: post.tag[lang], headline: post.headline[lang], sub: post.sub[lang] };
  const rtl = lang === 'ar';
  const size = headlineSize(copy.headline, format);
  const ctx = { lang, rtl, format, theme: post.theme, width: f.width, height: f.height };
  const sceneCopy = scene.copy?.[lang] ?? {};
  const sceneLeft = (f.width - SCENE.width * f.sceneScale) / 2;

  const accent = post.theme === 'dark'
    ? `em{background:${gradient.spark};-webkit-background-clip:text;background-clip:text;color:transparent}em .ul{display:none}`
    : `em .ul{position:absolute;inset-inline:0;bottom:${rtl ? '-.1em' : '-.02em'};height:.085em;border-radius:.04em;background:${post.theme === 'blue' ? color.amber : color.spark}}
       ${post.theme === 'light' ? `em{color:${color.cobalt}}` : ''}`;

  const copyCss = f.copy === 'bottom'
    ? `.copy{position:absolute;inset-inline:88px;bottom:${swipe ? 150 : 120}px}`
    : `.copy{position:absolute;left:150px;right:150px;top:1220px;text-align:center}.copy h1{margin-inline:auto}`;

  const css = `
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${f.width}px;height:${f.height}px;overflow:hidden}
body{background:${t.bg};color:${t.text};font-family:${rtl ? stack.arabic : stack.display};-webkit-font-smoothing:antialiased;position:relative}
.bg{position:absolute;inset:0;overflow:hidden}
.glow{position:absolute;border-radius:50%;filter:blur(90px)}
.g1{width:760px;height:760px;background:${t.glowA};top:-260px;inset-inline-end:-220px}
.g2{width:640px;height:640px;background:${t.glowB};bottom:-240px;inset-inline-start:-220px}
.grid{position:absolute;inset:0;background-image:linear-gradient(${t.grid} 2px,transparent 2px),linear-gradient(90deg,${t.grid} 2px,transparent 2px);background-size:72px 72px;-webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,#000 20%,transparent 75%)}
.scene{position:absolute;top:${f.sceneTop}px;left:${sceneLeft}px;width:${SCENE.width}px;height:${SCENE.height}px;transform:scale(${f.sceneScale});transform-origin:top left}
.top{position:absolute;top:${format === 'reel' ? 270 : 88}px;inset-inline:88px;height:56px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:18px;font-family:${stack.mono};font-size:23px;font-weight:700;letter-spacing:.18em;direction:ltr}
.brand img{height:50px;display:block}
.tag{font-family:${rtl ? stack.arabic : stack.mono};font-size:${rtl ? 26 : 23}px;font-weight:${rtl ? 600 : 500};letter-spacing:${rtl ? 0 : '.1em'};text-transform:uppercase;color:${t.sub};border:2px solid ${t.line};border-radius:999px;padding:${rtl ? '6px 22px 10px' : '8px 22px'}}
${copyCss}
h1{font-size:${size}px;line-height:${rtl ? 1.32 : 1.04};letter-spacing:${rtl ? 0 : '-.028em'};word-spacing:${rtl ? 0 : '.04em'};font-weight:800;max-width:${f.copy === 'bottom' ? 904 : 780}px;text-wrap:balance}
em{font-style:normal;white-space:nowrap;position:relative;display:inline-block}
${accent}
.nw{white-space:nowrap}
.sub{margin-top:${rtl ? 22 : 30}px;font-family:${rtl ? stack.arabic : stack.mono};font-size:${rtl ? 30 : 27}px;font-weight:500;color:${t.sub};line-height:1.5}
.foot{position:absolute;bottom:88px;inset-inline:88px;display:flex;justify-content:space-between;font-family:${stack.mono};font-size:24px;font-weight:500;color:${t.sub};direction:ltr}
.foot .sw{display:inline-flex;align-items:center;gap:10px;font-family:${rtl ? stack.arabic : stack.mono}}
.foot svg{width:22px;height:22px}
${rtl ? '.foot{flex-direction:row-reverse}.foot .sw svg{transform:scaleX(-1)}' : ''}
${uiCss(ctx)}
${scene.css?.(ctx) ?? ''}`;

  const swipeLabel = rtl ? 'اسحب' : 'Swipe';
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  const foot = format === 'feed'
    ? `<div class="foot"><span>${handle}</span>${swipe ? `<span class="sw">${swipeLabel}${arrow}</span>` : '<span></span>'}</div>`
    : '';

  const body = `
<div class="bg"><div class="glow g1"></div><div class="glow g2"></div><div class="grid"></div></div>
<div class="scene">${scene.html({ ...ctx, copy: sceneCopy })}</div>
<div class="top"><div class="brand"><img src="${logo(t.symbol)}"><span>CRAPTO STUDIO</span></div><div class="tag">${escape(copy.tag)}</div></div>
<div class="copy"><h1>${headlineHtml(copy.headline)}</h1><div class="sub">${escape(copy.sub)}</div></div>
${foot}`;

  const script = `
${gsapJs}
gsap.registerPlugin(CustomEase, MotionPathPlugin, DrawSVGPlugin);
CustomEase.create('silk', '0.22, 1, 0.36, 1');
const ctx = ${JSON.stringify(ctx)};
const DURATION = ${scene.duration};
window.__duration = DURATION;
// Build the timeline only once the web fonts are in: scenes measure text (chip widths etc.).
document.fonts.ready.then(() => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'silk', duration: 0.7, immediateRender: false } });
  // Ambient motion: glows drift and return, so the loop closes seamlessly.
  tl.to('.g1', { x: ctx.rtl ? 60 : -60, y: 50, scale: 1.08, duration: DURATION / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
  tl.to('.g2', { x: ctx.rtl ? -50 : 50, y: -40, scale: 1.1, duration: DURATION / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
  (${fnSource(scene.animate)})(tl, gsap, ctx);
  tl.set({}, {}, DURATION);
  window.__seek = (time) => { tl.seek(time, false); };
  window.__seek(0);
  window.__ready = true;
});`;

  return `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${css}</style></head>
<body class="fmt-${format} theme-${post.theme}">${body}<script>${script}</script></body></html>`;
}
