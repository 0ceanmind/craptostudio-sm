// Preview images built from the rendered exports: how the profile and grid will look,
// plus a one-page brand board to share with designers and collaborators.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { color, gradient, font, handle, tagline } from './tokens.mjs';
import { posts, highlights } from './content.mjs';
import { icon, logo } from './templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pad = (n) => String(n).padStart(2, '0');
const img = (rel) => `data:image/png;base64,${fs.readFileSync(path.join(root, 'exports', rel)).toString('base64')}`;
const fontFile = (dir, w) => `data:font/woff2;base64,${fs.readFileSync(path.join(root, 'node_modules/@fontsource', dir, 'files', `${dir}-latin-${w}-normal.woff2`)).toString('base64')}`;
const fonts = `
@font-face{font-family:'Plus Jakarta Sans';font-weight:500;src:url(${fontFile('plus-jakarta-sans', 500)})}
@font-face{font-family:'Plus Jakarta Sans';font-weight:700;src:url(${fontFile('plus-jakarta-sans', 700)})}
@font-face{font-family:'Plus Jakarta Sans';font-weight:800;src:url(${fontFile('plus-jakarta-sans', 800)})}
@font-face{font-family:'JetBrains Mono';font-weight:500;src:url(${fontFile('jetbrains-mono', 500)})}
@font-face{font-family:'JetBrains Mono';font-weight:700;src:url(${fontFile('jetbrains-mono', 700)})}`;

const doc = (css, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:${font.display};-webkit-font-smoothing:antialiased}${css}</style></head><body>${body}</body></html>`;

// Newest first: the grid shows post 9 top-left and post 1 bottom-right.
const gridOrder = () => [...posts].sort((a, b) => b.order - a.order);
const coverOf = (p) => img(`posts/${pad(p.order)}-${p.slug}/01.png`);

export const profileBio = [
  'Ideas, compiled. ⚡',
  'Unity games · iOS &amp; Android apps · Software · Custom AI',
  'Interactive content &amp; project upgrades',
  '👇 DM "START" to begin',
];

export function profileMockup() {
  const tiles = gridOrder().map((p) => `<div class="t" style="background-image:url(${coverOf(p)})"></div>`).join('');
  const hl = highlights.slice(0, 5).map((h, i) =>
    `<div class="h"><div class="ring"><img src="${img(`highlights/${pad(i + 1)}-${h.slug}.png`)}"></div><span>${h.label}</span></div>`).join('');
  const css = `
body{width:430px;background:#fff;color:#0f1419;font-size:14px}
.bar{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px}
.bar b{font-size:20px;font-weight:800;letter-spacing:-.01em}
.bar .ic{display:flex;gap:18px;color:#0f1419}
.head{display:flex;align-items:center;gap:22px;padding:8px 16px 0}
.av{width:86px;height:86px;border-radius:50%;overflow:hidden;border:1px solid #e3e6ea;flex:none}
.av img{width:100%;height:100%;display:block}
.stats{display:flex;flex:1;justify-content:space-around;text-align:center}
.stats b{display:block;font-size:17px;font-weight:800}
.stats span{font-size:13px;color:#333}
.bio{padding:12px 16px 0;line-height:1.38}
.bio .n{font-weight:800}
.bio .c{color:#737b86}
.bio .l{color:#00376b;font-weight:700;margin-top:2px}
.btns{display:flex;gap:6px;padding:14px 16px 0}
.btns div{flex:1;text-align:center;padding:8px 0;border-radius:8px;background:#eef0f3;font-weight:700}
.btns .f{background:${color.blue};color:#fff}
.hl{display:flex;gap:16px;padding:18px 16px 6px;overflow:hidden}
.h{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px}
.ring{width:66px;height:66px;border-radius:50%;border:1px solid #d9dde3;padding:3px}
.ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.tabs{display:flex;justify-content:space-around;border-top:1px solid #eceef1;margin-top:10px;padding:10px 0;color:#9aa1ab}
.tabs .on{color:#0f1419}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.t{aspect-ratio:3/4;background-size:cover;background-position:center}
`;
  const body = `
<div class="bar"><b>${handle.slice(1)}</b><div class="ic">${icon('square-plus', { size: 24 })}${icon('menu', { size: 24 })}</div></div>
<div class="head"><div class="av"><img src="${img('profile/profile-picture.png')}"></div>
<div class="stats"><div><b>9</b><span>posts</span></div><div><b>–</b><span>followers</span></div><div><b>–</b><span>following</span></div></div></div>
<div class="bio"><div class="n">Crapto Studio | Games·Apps·AI</div><div class="c">Software Company</div>
${profileBio.map((l) => `<div>${l}</div>`).join('')}
<div class="l">🔗 your-website.com and 2 more</div></div>
<div class="btns"><div class="f">Follow</div><div>Message</div><div>Contact</div></div>
<div class="hl">${hl}</div>
<div class="tabs"><span class="on">${icon('grid-3x3', { size: 22 })}</span><span>${icon('clapperboard', { size: 22 })}</span><span>${icon('square-user', { size: 22 })}</span></div>
<div class="grid">${tiles}</div>`;
  return doc(css, body);
}

export function gridPreview() {
  const tiles = gridOrder().map((p) => `<div class="t" style="background-image:url(${coverOf(p)})"></div>`).join('');
  return doc(`
body{width:1080px;height:1440px;background:#fff;display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
.t{background-size:cover;background-position:center}`, tiles);
}

export function brandBoard() {
  const sw = (name, hex, dark = false) =>
    `<div class="sw"><div class="chip" style="background:${hex}${hex === color.white ? ';border:1px solid #d5dde8' : ''}"></div><b>${name}</b><span>${hex}</span></div>`;
  const covers = [posts.find((p) => p.slug === 'intro'), posts.find((p) => p.slug === 'games'), posts.find((p) => p.slug === 'start')]
    .map((p) => `<img src="${coverOf(p)}">`).join('');
  const hl = highlights.map((h, i) => `<img src="${img(`highlights/${pad(i + 1)}-${h.slug}.png`)}">`).join('');
  const css = `
body{width:1600px;height:1000px;background:#F6F9FC;color:${color.ink};display:grid;grid-template-columns:600px 1fr}
.left{background:${color.midnight};color:#fff;padding:56px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.left::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 100% 0%, rgba(66,150,209,.35), transparent 70%)}
.left>*{position:relative}
.kick{font-family:${font.mono};font-size:15px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${color.slate}}
.logo{margin:auto 0;width:100%;}
.tl{font-size:54px;font-weight:800;letter-spacing:-.035em}
.tl em{font-style:normal;background:${gradient.spark};-webkit-background-clip:text;background-clip:text;color:transparent}
.tls{margin-top:10px;font-family:${font.mono};font-size:16px;color:${color.slate}}
.right{padding:48px 56px;display:flex;flex-direction:column;gap:30px}
h3{font-family:${font.mono};font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#5A6F8C;margin-bottom:14px}
.row{display:flex;gap:14px}
.sw{width:118px;font-size:13px}.sw b{display:block;margin-top:8px;font-weight:800;font-size:14px}.sw span{font-family:${font.mono};color:#5A6F8C;font-size:12px}
.chip{height:64px;border-radius:14px}
.grads{display:flex;gap:14px;margin-top:14px}.grads div{flex:1;height:40px;border-radius:12px;color:#fff;font-family:${font.mono};font-size:12px;font-weight:700;display:flex;align-items:center;padding:0 16px}
.type{display:flex;gap:40px;align-items:flex-end}
.big{font-size:84px;font-weight:800;letter-spacing:-.04em;line-height:.9}
.tmeta{font-size:14px;color:#5A6F8C;line-height:1.5}.tmeta b{color:${color.ink}}
.mono{font-family:${font.mono};font-size:26px;font-weight:500}
.posts{display:flex;gap:18px}
.posts img{width:200px;border-radius:12px;box-shadow:0 10px 24px rgba(14,26,43,.15)}
.hls{display:flex;gap:12px;margin-top:22px}
.hls img{width:60px;height:60px;border-radius:50%;object-fit:cover}
`;
  const body = `
<div class="left"><div class="kick">Brand board · v1</div><img class="logo" src="${logo('logo-color')}">
<div class="tl">Ideas, <em>compiled.</em></div><div class="tls">Games · Apps · Software · AI · ${handle}</div></div>
<div class="right">
<div><h3>Colour</h3>
<div class="row">${sw('Cobalt', color.cobalt)}${sw('Crapto Blue', color.blue)}${sw('Sky', color.sky)}${sw('Ember', color.ember)}${sw('Spark', color.spark)}${sw('Amber', color.amber)}</div>
<div class="row" style="margin-top:14px">${sw('Midnight', color.midnight)}${sw('Navy', color.navy)}${sw('Line', color.line)}${sw('Slate', color.slate)}${sw('Mist', color.mist)}${sw('Ink', color.ink)}${sw('White', color.white)}</div>
<div class="grads"><div style="background:${gradient.brand}">Brand gradient · Cobalt → Sky</div><div style="background:${gradient.spark}">Spark gradient · Ember → Amber</div></div></div>
<div><h3>Type</h3><div class="type"><div class="big">Aa</div><div class="tmeta"><b>Plus Jakarta Sans</b><br>ExtraBold 800 headlines · Bold 700 · Medium 500 body</div>
<div><div class="mono">[ 01 / GAMES ]</div><div class="tmeta"><b>JetBrains Mono</b> · labels, tags, numbers</div></div></div></div>
<div><h3>Instagram</h3><div class="posts">${covers}</div><div class="hls">${hl}</div></div>
</div>`;
  return doc(css, body);
}

export { tagline };
