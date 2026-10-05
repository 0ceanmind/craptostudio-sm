// Project showcase, "App on a phone": any client app on a floating, tilted phone. The screen
// cycles through the post's screenshots with an iOS-style push (the old screen slides back and
// dims while the new one glides over it); one screenshot scrolls or zooms gently instead, and
// with none a generated app screen in brand colours builds itself row by row. Beside the phone:
// the app's tile (icon, name, tagline), its features as floating cards that pop in one by one,
// and a status pill such as "Live on iOS & Android". Gooey brand blobs and spark petals drift
// behind. Everything comes from the post's sceneCopy / sceneData.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ico, asset } from '../motion/ui.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Screen (inside the 14px bezel of the 330×680 kit phone).
const SW = 302;
const SH = 652;

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const len = (v) => [...String(v ?? '')].length;
// Shortens text to `max` characters with an ellipsis (for one-line labels inside the phone).
const clip = (v, max) => { const c = [...String(v ?? '')]; return c.length <= max ? c.join('') : `${c.slice(0, max - 1).join('').trimEnd()}…`; };
// A Lucide icon, falling back to a safe one when the name is unknown (typos shouldn't break a render).
const icon = (name, opts, fallback = 'sparkles') => {
  try { return ico(String(name || fallback), opts); } catch { return ico(fallback, opts); }
};

// Pixel size of a PNG/JPEG/WebP/GIF/SVG from its header, or null.
function imageSize(rel) {
  try {
    const b = fs.readFileSync(path.resolve(root, rel));
    if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
        if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
        i += 2 + b.readUInt16BE(i + 2);
      }
      return null;
    }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const k = b.toString('ascii', 12, 16);
      if (k === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      if (k === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
      if (k === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    }
    if (b.toString('ascii', 0, 3) === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
    const svg = b.toString('utf8', 0, 2000);
    const vb = svg.match(/viewBox="[\d.\s-]*?([\d.]+)[\s,]+([\d.]+)"/);
    if (vb) return { w: +vb[1], h: +vb[2] };
  } catch { /* fall through */ }
  return null;
}

// Cover-fit an image into the screen, anchored to the top: tall screenshots overflow downwards
// (`pan` px that a single screen can scroll), wide ones are cropped evenly on both sides.
function fitShot(rel) {
  const size = imageSize(rel);
  if (!size || !size.w || !size.h) return { style: 'left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 0', pan: 0 };
  const r = size.h / size.w;
  if (r >= SH / SW) {
    const h = Math.round(SW * r);
    return { style: `left:0;top:0;width:${SW}px;height:${h}px`, pan: Math.min(h - SH, SH * 1.6) };
  }
  const w = Math.round(SH / r);
  return { style: `left:${Math.round((SW - w) / 2)}px;top:0;width:${w}px;height:${SH}px`, pan: 0 };
}

// Gooey filter whose melted bridges are a flat brand blue (no dark slivers where blobs meet).
const GOO = `<svg width="0" height="0" style="position:absolute"><defs><filter id="spgoo" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="0 0 0 0 0.26  0 0 0 0 0.59  0 0 0 0 0.82  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs></svg>`;

export default {
  meta: {
    title: 'App on a phone',
    description: 'A floating, tilted phone cycles through the app’s screenshots (or builds a generated app screen), beside an app tile with name and tagline, feature cards that pop in one by one and a status pill.',
    bestFor: 'Mobile apps: launches, case studies, new features',
    fields: {
      copy: {
        name: 'App name, up to 18 characters (stays in Latin letters in Arabic)',
        tagline: 'What the app does, one sentence up to 60 characters',
        badge: 'Short status pill, up to 26 characters, e.g. “Live on iOS & Android”',
        features: '2 to 4 items { icon: Lucide name, text: up to 24 characters }',
      },
      data: {
        screens: { type: 'images', max: 3, description: 'Portrait phone screenshots, shown top-aligned. 2–3 swap with a push transition, 1 scrolls (tall) or zooms gently, none shows a generated app screen' },
        icon: { type: 'icon', description: 'App icon (Lucide name) for the app tile and the generated screen' },
        logo: { type: 'image', description: 'Optional: the real app icon as an image; replaces the Lucide icon on the tile' },
      },
    },
  },
  duration: 8,

  copy: {
    en: {
      name: 'Tasky',
      tagline: 'Plan your team’s week in one calm place.',
      badge: 'Live on iOS & Android',
      features: [
        { icon: 'list-checks', text: 'Shared task lists' },
        { icon: 'bell-ring', text: 'Smart reminders' },
        { icon: 'wifi-off', text: 'Works offline' },
      ],
    },
    ar: {
      name: 'Tasky',
      tagline: 'نظّم أسبوع فريقك في مكان واحد هادئ.',
      badge: 'متاح على iOS و Android',
      features: [
        { icon: 'list-checks', text: 'قوائم مهام مشتركة' },
        { icon: 'bell-ring', text: 'تذكيرات ذكية' },
        { icon: 'wifi-off', text: 'يعمل دون إنترنت' },
      ],
    },
  },

  data: { screens: [], icon: 'smartphone', logo: '' },

  css: (ctx) => {
    const r = ctx.rtl;
    const s = r ? -1 : 1;
    const light = ctx.theme === 'light';
    const disp = r ? "'Alexandria','Plus Jakarta Sans',sans-serif" : "'Plus Jakarta Sans','Alexandria',sans-serif";
    const bar = light ? 'rgba(59,81,112,.16)' : 'rgba(147,169,198,.24)';
    const barHi = light ? 'rgba(59,81,112,.32)' : 'rgba(147,169,198,.42)';
    const lift = light ? '0 24px 48px rgba(14,26,43,.16),0 4px 12px rgba(14,26,43,.06)' : '0 30px 60px rgba(2,6,14,.5),0 4px 14px rgba(2,6,14,.3)';
    return `
.sp{position:absolute;inset:0}
.sp-halo{position:absolute;inset-inline-start:-87px;top:60px;width:620px;height:620px;border-radius:50%;
  background:radial-gradient(circle,rgba(90,180,217,${light ? '.42' : '.38'}) 0%,rgba(66,150,209,.15) 40%,rgba(66,150,209,0) 68%)}
.sp-net{position:absolute;inset:0;filter:url(#spgoo)}
.sp-net i{position:absolute;border-radius:50%;background:var(--brand)}
.sp .spark{inset-inline-start:var(--x);top:var(--y);transform:rotate(var(--r)) scale(var(--k,1))}

/* phone */
.sp-wrap{position:absolute;inset-inline-start:52px;top:30px;width:330px;height:680px;perspective:1800px;z-index:2}
.sp-tilt{width:330px;height:680px;transform-style:preserve-3d;transform:rotateY(${-12 * s}deg) rotateX(4deg) rotateZ(${1.5 * s}deg)}
.sp .phone{position:relative;
  box-shadow:${light ? '0 50px 90px rgba(14,26,43,.32)' : '0 60px 100px rgba(2,6,14,.65)'},0 0 0 3px #1F3456,0 0 0 4px rgba(147,169,198,.22),inset 0 0 0 2px rgba(255,255,255,.07)}
.sp .screen{background:#05090F}
.sp-btn{position:absolute;width:5px;border-radius:3px;background:linear-gradient(90deg,#2A4166,#16273F);inset-inline-start:-5px}
.sp-btn.b1{top:150px;height:34px}.sp-btn.b2{top:204px;height:58px}.sp-btn.b3{top:276px;height:58px}
.sp-btn.b4{inset-inline-start:auto;inset-inline-end:-5px;top:214px;height:92px}
.sp .island{z-index:9}
.sp-scr{position:absolute;inset:0;overflow:hidden;background:#0B1220;box-shadow:${-22 * s}px 0 44px rgba(0,0,0,.45)}
.sp-scr + .sp-scr{opacity:0}
.sp-scr img{position:absolute;display:block;max-width:none}
.sp-dim{position:absolute;inset:0;background:#05090F;opacity:0}
.sp-glare{position:absolute;top:-30%;height:160%;left:0;width:110px;z-index:7;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.2),rgba(255,255,255,0));transform:translateX(${r ? 600 : -330}px) rotate(18deg)}
.sp-sheen{position:absolute;inset:0;z-index:7;border-radius:46px;background:linear-gradient(${r ? 225 : 135}deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 30%)}
.sp-hi{position:absolute;bottom:9px;left:50%;width:118px;height:5px;margin-left:-59px;border-radius:3px;background:rgba(255,255,255,.55);z-index:8;mix-blend-mode:difference}

/* generated app screen (no screenshots) */
.sk{position:absolute;inset:0;background:var(--card);color:var(--ui-text);font-family:${disp}}
.sk-sb{position:absolute;top:15px;inset-inline:28px;height:30px;display:flex;align-items:center;justify-content:space-between;font:700 20px 'Plus Jakarta Sans',sans-serif;direction:ltr}
.sk-sb .ic{display:flex;gap:5px}
.sk-hd{position:absolute;top:62px;inset-inline:20px;height:52px;display:flex;align-items:center;gap:12px}
.sk-logo{width:50px;height:50px;border-radius:16px;background:var(--brand);color:#fff;display:grid;place-items:center;flex:none;box-shadow:0 8px 18px rgba(55,107,177,.35)}
.sk-ht{flex:1;min-width:0}
.sk-ht b{display:block;text-align:${r ? 'right' : 'left'};line-height:30px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sk-av{width:42px;height:42px;border-radius:50%;background:var(--sparkg);flex:none;box-shadow:0 0 0 3px var(--card),0 0 0 5px rgba(242,141,25,.35)}
.bar{display:block;height:10px;border-radius:5px;background:${bar};transform-origin:${r ? '100%' : '0'} 50%}
.bar.hi{background:${barHi}}
.sk-ht .bar{width:96px;margin-top:6px;height:9px}
.sk-hero{position:absolute;top:130px;inset-inline:20px;height:136px;border-radius:26px;overflow:hidden;
  background:linear-gradient(135deg,#2C5C9E 0%,#4296D1 60%,#5AB4D9 100%);box-shadow:0 18px 34px rgba(44,92,158,.35)}
.sk-hero .o1{position:absolute;width:190px;height:190px;border-radius:50%;inset-inline-end:-60px;bottom:-110px;background:rgba(255,255,255,.12)}
.sk-hero .o2{position:absolute;width:90px;height:90px;border-radius:50%;inset-inline-start:-30px;top:-44px;background:rgba(11,22,40,.16)}
.sk-hero .pt{position:absolute;width:16px;height:25px;inset-inline-start:150px;top:22px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);transform:rotate(${32 * s}deg)}
.sk-hero .l1,.sk-hero .l2{position:absolute;inset-inline-start:22px;background:rgba(255,255,255,.92)}
.sk-hero .l1{top:28px;width:112px;height:13px;border-radius:7px}
.sk-hero .l2{top:52px;width:72px;height:10px;background:rgba(255,255,255,.6)}
.sk-ring{position:absolute;inset-inline-end:18px;top:20px;width:74px;height:74px}
.sk-ring circle{fill:none;stroke-width:9}
.sk-ring .tr{stroke:rgba(255,255,255,.26)}
.sk-ring .ar{stroke:#fff;stroke-linecap:round}
.sk-prog{position:absolute;inset-inline:22px 112px;bottom:24px;height:10px;border-radius:5px;background:rgba(255,255,255,.26)}
.sk-prog i{position:absolute;inset-block:0;inset-inline-start:0;width:68%;border-radius:5px;background:#fff;transform-origin:${r ? '100%' : '0'} 50%}
.sk-pills{position:absolute;top:282px;inset-inline:20px;height:40px;display:flex;gap:8px}
.sk-pill{height:40px;border-radius:999px;background:var(--soft);display:flex;align-items:center;gap:8px;padding-inline:12px 16px;color:var(--ui-sub)}
.sk-pill .bar{width:34px;height:8px}
.sk-pill.on{background:var(--sparkg);color:#0E1A2B}
.sk-pill.on .bar{background:rgba(14,26,43,.45)}
.sk-row{position:absolute;inset-inline:20px;height:64px;border-radius:20px;background:var(--soft);display:flex;align-items:center;gap:12px;padding-inline:11px 14px}
.sk-ri{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;color:#fff;background:var(--brand)}
.sk-row.k1 .sk-ri{background:var(--sparkg);color:#0E1A2B}
.sk-row.k2 .sk-ri{background:linear-gradient(135deg,#5AB4D9,#376BB1)}
.sk-rt{flex:1;min-width:0}
.sk-rt .bar + .bar{margin-top:8px;height:8px}
.sk-ck{position:relative;width:30px;height:30px;border-radius:50%;flex:none;border:3px solid ${barHi}}
.sk-ck i{position:absolute;inset:-3px;border-radius:50%;background:#22C55E;display:grid;place-items:center;color:#fff}
.sk-tap{position:absolute;inset-inline-start:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;opacity:0;
  background:rgba(66,150,209,.22);border:3px solid rgba(66,150,209,.85)}
.sk-tabs{position:absolute;bottom:18px;inset-inline:16px;height:62px;border-radius:24px;display:flex;align-items:center;justify-content:space-around;
  background:${light ? '#0E1A2B' : 'rgba(6,12,22,.82)'};border:2px solid rgba(147,169,198,.16);color:#93A9C6;box-shadow:0 16px 30px rgba(0,0,0,.3)}
.sk-tabs .on{color:var(--spark);position:relative}
.sk-tabs .on::after{content:'';position:absolute;left:50%;bottom:-10px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--spark)}

/* the column beside the phone: app tile, features, status pill */
.sp-col{position:absolute;inset-inline-start:420px;inset-inline-end:14px;top:18px;bottom:18px;display:flex;flex-direction:column;justify-content:center;gap:24px;z-index:3}
.sp-card{background:linear-gradient(160deg,rgba(255,255,255,${light ? '.0' : '.06'}),rgba(255,255,255,0) 55%),var(--card);border:2px solid var(--card-line);color:var(--ui-text);box-shadow:${lift}}
.sp-app{position:relative;display:flex;align-items:center;gap:20px;padding-block:20px;padding-inline:20px 24px;border-radius:32px}
.sp-ai{position:relative;width:100px;height:100px;border-radius:30px;flex:none;display:grid;place-items:center;color:#fff;overflow:hidden;
  background:var(--brand);box-shadow:0 14px 28px rgba(55,107,177,.42),inset 0 2px 0 rgba(255,255,255,.25)}
.sp-ai img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sp-ai .o{position:absolute;width:84px;height:84px;border-radius:50%;inset-inline-end:-30px;bottom:-34px;background:rgba(255,255,255,.14)}
.sp-ai svg{position:relative;filter:drop-shadow(0 6px 10px rgba(11,22,40,.3))}
.sp-ai .shine{position:absolute;top:-20%;height:140%;width:40px;left:0;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.5),rgba(255,255,255,0));transform:translateX(-80px) rotate(20deg)}
.sp-ap{position:absolute;width:20px;height:31px;inset-inline-start:106px;top:4px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);transform:rotate(${38 * s}deg);box-shadow:0 6px 14px rgba(236,108,28,.4)}
.sp-at{flex:1;min-width:0}
.sp-name{text-align:${r ? 'right' : 'left'};font-weight:800;letter-spacing:${r ? 0 : '-.02em'};line-height:1.08;overflow-wrap:anywhere;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;padding-bottom:.06em}
.sp-tag{margin-top:8px;font-size:${r ? 20 : 21}px;line-height:${r ? 1.6 : 1.42};font-weight:500;color:var(--ui-sub);
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.sp-feats{display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.sp-f{position:relative;max-width:100%}
.sp-fi{transform-origin:${r ? '100%' : '0'} 50%}
.sp-f.k1,.sp-f.k3{margin-inline-start:38px;max-width:calc(100% - 38px)}
.sp-fc{display:flex;align-items:center;gap:16px;padding-block:12px;padding-inline:12px 22px;border-radius:24px;
  transform:perspective(900px) rotateY(${-10 * s}deg)}
.sp-fic{width:52px;height:52px;border-radius:16px;flex:none;display:grid;place-items:center;background:var(--brand);color:#fff;outline:0 solid rgba(90,180,217,.4)}
.sp-f.k1 .sp-fic{background:var(--sparkg);color:#0E1A2B;outline-color:rgba(242,141,25,.4)}
.sp-f.k2 .sp-fic{background:linear-gradient(135deg,#5AB4D9,#376BB1)}
.sp-ft{font-size:${r ? 21 : 22}px;line-height:${r ? 1.5 : 1.3};font-weight:700;min-width:0;overflow-wrap:anywhere;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.sp-badge{align-self:flex-start;display:inline-flex;align-items:center;gap:12px;height:54px;padding-inline:18px 22px;border-radius:999px;max-width:100%;
  font:700 20px ${disp};white-space:nowrap}
.sp-badge span{overflow:hidden;text-overflow:ellipsis}
.sp-dot{position:relative;width:14px;height:14px;border-radius:50%;background:#22C55E;flex:none;box-shadow:0 0 0 4px rgba(34,197,94,.2)}
.sp-dot i{position:absolute;inset:0;border-radius:50%;border:2px solid #22C55E;opacity:0}
`;
  },

  html: ({ copy, data, rtl }) => {
    const s = rtl ? -1 : 1;
    const shots = (Array.isArray(data.screens) ? data.screens : [data.screens]).filter(Boolean).slice(0, 3);
    const feats = (Array.isArray(copy.features) ? copy.features : []).filter((f) => f && f.text).slice(0, 4);
    const appIcon = data.icon || 'smartphone';
    const nameSize = Math.max(28, Math.min(48, Math.round(470 / Math.max(1, len(copy.name)))));

    let mode = 'skel';
    let screen;
    if (shots.length) {
      const fits = shots.map((rel) => ({ src: asset(rel), ...fitShot(rel) }));
      mode = fits.length === 1 ? 'one' : 'multi';
      screen = fits.map((f, i) => `<div class="sp-scr s${i}"><img src="${f.src}" style="${f.style}" data-pan="${Math.round(f.pan)}" alt=""><i class="sp-dim"></i></div>`).join('');
    } else {
      // Generated app screen: header with the app's icon and name, a hero card, filter pills,
      // rows that reuse the feature icons, and a tab bar.
      const rowIcons = [0, 1, 2].map((i) => feats[i]?.icon || ['layout-grid', 'star', 'bell'][i]);
      const rows = rowIcons.map((ic, i) => `<div class="sk-row k${i}" style="top:${338 + i * 74}px"><span class="sk-ri">${icon(ic, { size: 22, stroke: 2.2 })}</span>
        <div class="sk-rt"><i class="bar hi" style="width:${[112, 92, 124][i]}px"></i><i class="bar" style="width:${[70, 84, 58][i]}px"></i></div>
        <span class="sk-ck"><i>${ico('check', { size: 18, stroke: 3.4 })}</i></span>${i === 2 ? '<span class="sk-tap"></span>' : ''}</div>`).join('');
      screen = `<div class="sk">
        <div class="sk-sb"><span>9:41</span><span class="ic">${ico('signal', { size: 18, stroke: 2.6 })}${ico('wifi', { size: 18, stroke: 2.6 })}${ico('battery-full', { size: 22, stroke: 2.2 })}</span></div>
        <div class="sk-hd"><span class="sk-logo">${icon(appIcon, { size: 26, stroke: 2.2 }, 'smartphone')}</span><div class="sk-ht"><b dir="auto" style="font-size:${len(copy.name) <= 9 ? 23 : 20}px">${esc(clip(copy.name, len(copy.name) <= 9 ? 9 : 11))}</b><i class="bar"></i></div><span class="sk-av"></span></div>
        <div class="sk-hero"><i class="o1"></i><i class="o2"></i><i class="pt"></i><i class="bar l1"></i><i class="bar l2"></i>
          <svg class="sk-ring" viewBox="0 0 74 74" style="${rtl ? 'transform:scaleX(-1)' : ''}"><circle class="tr" cx="37" cy="37" r="30"/><circle class="ar" cx="37" cy="37" r="30" transform="rotate(-90 37 37)" stroke-dasharray="135.72 188.5"/></svg>
          <div class="sk-prog"><i></i></div></div>
        <div class="sk-pills"><span class="sk-pill on">${icon(appIcon, { size: 18, stroke: 2.4 }, 'smartphone')}<i class="bar"></i></span><span class="sk-pill">${ico('clock', { size: 18, stroke: 2.4 })}<i class="bar"></i></span><span class="sk-pill">${ico('star', { size: 18, stroke: 2.4 })}<i class="bar" style="width:24px"></i></span></div>
        ${rows}
        <div class="sk-tabs"><span class="on">${ico('house', { size: 26 })}</span>${ico('layout-grid', { size: 26 })}${ico('bell', { size: 26 })}${ico('user', { size: 26 })}</div>
      </div>`;
    }

    const logo = data.logo ? `<img src="${asset(data.logo)}" alt="">` : `<i class="o"></i>${icon(appIcon, { size: 50, stroke: 1.9 }, 'smartphone')}`;
    const blobs = [[-26, 92, 120], [64, 34, 66], [6, 214, 58], [300, 560, 136], [404, 628, 74], [262, 672, 58], [846, 0, 70], [814, 66, 38]];
    const sparks = [[18, 26, 30, 0.9], [372, 34, -60, 0.8], [8, 640, -140, 0.85], [400, 520, 120, 0.75], [868, 690, 40, 0.8], [600, 4, 160, 0.65]];

    return `${GOO}
<div class="sp" data-mode="${mode}">
  <div class="sp-halo"></div>
  <div class="sp-net">${blobs.map(([x, y, d]) => `<i style="inset-inline-start:${x}px;top:${y}px;width:${d}px;height:${d}px"></i>`).join('')}</div>
  ${sparks.map(([x, y, rot, k]) => `<div class="spark" style="--x:${x}px;--y:${y}px;--r:${rot * s}deg;--k:${k}"></div>`).join('')}
  <div class="sp-wrap"><div class="sp-tilt"><div class="phone"><i class="sp-btn b1"></i><i class="sp-btn b2"></i><i class="sp-btn b3"></i><i class="sp-btn b4"></i><div class="screen">
    ${screen}
    <div class="island"></div>
    <div class="sp-glare"></div><div class="sp-sheen"></div><div class="sp-hi"></div>
  </div></div></div></div>
  <div class="sp-col">
    <div class="sp-appw"><div class="sp-app sp-card">
      <div class="sp-aiw"><div class="sp-ai">${logo}<i class="shine"></i></div></div>
      <span class="sp-ap"></span>
      <div class="sp-at"><div class="sp-name" dir="auto" style="font-size:${nameSize}px">${esc(copy.name)}</div>${copy.tagline ? `<div class="sp-tag">${esc(copy.tagline)}</div>` : ''}</div>
    </div></div>
    ${feats.length ? `<div class="sp-feats">${feats.map((f, i) => `<div class="sp-f k${i}"><div class="sp-fi"><div class="sp-fc sp-card"><span class="sp-fic">${icon(f.icon, { size: 26, stroke: 2.2 })}</span><span class="sp-ft">${esc(f.text)}</span></div></div></div>`).join('')}</div>` : ''}
    ${copy.badge ? `<div class="sp-bw" style="align-self:flex-start;max-width:100%"><div class="sp-badge sp-card"><span class="sp-dot"><i></i></span><span>${esc(clip(copy.badge, 40))}</span></div></div>` : ''}
  </div>
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const s = ctx.rtl ? -1 : 1;
    const amb = { duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true };
    const $ = (sel) => gsap.utils.toArray(sel);
    const mode = document.querySelector('.sp').dataset.mode;

    // ---- Ambient loops (whole cycles, so the last frame matches the first) ----
    gsap.set('.sp-tilt', { rotationY: -12 * s, rotationX: 4, rotationZ: 1.5 * s });
    // Give everything that moves its GSAP transform up front, so frame 0 and the last frame are
    // rasterised the same way (an untouched element and one at translate(0,0) anti-alias differently).
    gsap.set(['.sp-appw', '.sp-app', '.sp-aiw', '.sp-ap', '.sp-name', '.sp-tag', '.sp-f', '.sp-fi', '.sp-bw', '.sp-badge', '.sp-scr', '.sp-scr img', '.sk-hero', '.sk-hero .pt', '.sk-pill', '.sk-row'], { x: 0, y: 0 });
    tl.to('.sp-wrap', { y: -12, ...amb }, 0);
    tl.to('.sp-tilt', { rotationY: -5 * s, rotationX: 1.5, rotationZ: 0.5 * s, ...amb }, 0);
    tl.to('.sp-halo', { scale: 1.08, opacity: 0.8, ...amb }, 0);
    tl.to('.sp-appw', { y: -8, ...amb }, 0);
    // The column drifts as one (different depths, same direction), so cards never close up on each other.
    $('.sp-f').forEach((f, i) => tl.to(f, { y: i % 2 ? -12 : -8, x: (i % 2 ? -5 : 5) * s, ...amb }, 0));
    tl.to('.sp-bw', { y: -6, ...amb }, 0);
    $('.sp-net i').forEach((n, i) => tl.to(n, { x: (i % 2 ? 16 : -12) * s, y: i % 3 ? -14 : 16, scale: 1 + (i % 3) * 0.07, ...amb }, 0));
    tl.to('.sp .spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.sp .spark', { y: (i) => (i % 2 ? 14 : -14), ...amb }, 0);

    // A soft ring leaves the status dot (fades in from and out to nothing, so seams stay invisible).
    const beat = (t) => {
      tl.fromTo('.sp-dot i', { scale: 1 }, { scale: 2.8, duration: 1.1, ease: 'power2.out' }, t);
      tl.fromTo('.sp-dot i', { opacity: 0 }, { opacity: 0.8, duration: 0.15, ease: 'none' }, t);
      tl.to('.sp-dot i', { opacity: 0, duration: 0.95, ease: 'power1.out' }, t + 0.15);
    };
    beat(0.05);
    beat(6.4);
    // The light sweeps across the glass (starting and ending far enough out that the rotated
    // band's corners never show).
    const glare = (t) => tl.fromTo('.sp-glare', { x: ctx.rtl ? 600 : -330, rotation: 18 }, { x: ctx.rtl ? -330 : 600, rotation: 18, duration: 1.05, ease: 'power2.inOut' }, t);

    // ---- 1.0s: clear the column ----
    tl.to('.sp-bw .sp-badge', { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }, 0.95);
    tl.to($('.sp-fi').reverse(), { opacity: 0, x: -36 * s, scale: 0.88, duration: 0.4, stagger: 0.06, ease: 'power2.in' }, 1.0);
    tl.to(['.sp-name', '.sp-tag'], { opacity: 0, y: -12, duration: 0.35, stagger: 0.05, ease: 'power2.in' }, 1.1);
    tl.to('.sp-aiw', { opacity: 0, scale: 0.6, rotation: -16 * s, duration: 0.4, ease: 'power2.in' }, 1.15);
    tl.to('.sp-ap', { opacity: 0, scale: 0.3, duration: 0.3, ease: 'power2.in' }, 1.1);
    tl.to('.sp-app', { opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.in' }, 1.3);

    // ---- 1.6s: rebuild: app tile, name, tagline ----
    tl.fromTo('.sp-app', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5 }, 1.6);
    tl.fromTo('.sp-aiw', { opacity: 0, scale: 0.4, rotation: -24 * s }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.8)' }, 1.68);
    tl.fromTo('.sp-ai .shine', { x: -80, rotation: 20 }, { x: 150, rotation: 20, duration: 0.8, ease: 'power2.inOut' }, 2.15);
    tl.fromTo('.sp-ap', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, 2.05);
    tl.fromTo('.sp-name', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.85);
    tl.fromTo('.sp-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.97);

    // ---- features pop in one by one, the badge last ----
    const feats = $('.sp-fi');
    const gap = feats.length > 3 ? 0.42 : 0.5;
    feats.forEach((f, i) => {
      const t = 2.45 + i * gap;
      // Each feature slides out of the phone's edge into its place.
      tl.fromTo(f, { opacity: 0, x: -64 * s, scale: 0.82 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, t);
      tl.fromTo(f.querySelector('.sp-fic'), { outlineWidth: 0 }, { outlineWidth: 8, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + 0.3);
      tl.fromTo(f.querySelector('.sp-fic svg'), { scale: 0.4, rotation: -30 * s }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.2)' }, t + 0.12);
    });
    const tb = 2.45 + feats.length * gap + 0.1;
    tl.fromTo('.sp-bw .sp-badge', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, tb);
    beat(tb + 0.25);

    // ---- the phone screen ----
    if (mode === 'multi') {
      // iOS-style push: the new screen glides in from the inline end, the old one slides back and dims.
      const scr = $('.sp-scr');
      const order = [...scr.keys(), 0].slice(1); // 1, 2, …, 0
      const times = scr.length === 2 ? [1.7, 4.6] : [1.35, 3.25, 5.15];
      let prev = 0;
      order.forEach((k, j) => {
        const t = times[j];
        const inc = scr[k];
        const out = scr[prev];
        if (k === 0) tl.set(inc, { zIndex: 5 }, t);
        tl.set(inc, { opacity: 1 }, t);
        tl.set(inc.querySelector('.sp-dim'), { opacity: 0 }, t);
        tl.fromTo(inc, { xPercent: 100 * s, scale: 1 }, { xPercent: 0, scale: 1, duration: 0.95, ease: 'power3.inOut' }, t);
        tl.fromTo(out, { xPercent: 0, scale: 1 }, { xPercent: -28 * s, scale: 0.94, duration: 0.95, ease: 'power3.inOut', immediateRender: false }, t);
        tl.fromTo(out.querySelector('.sp-dim'), { opacity: 0 }, { opacity: 0.55, duration: 0.95, ease: 'power2.inOut' }, t);
        glare(t + 0.1);
        prev = k;
      });
    } else if (mode === 'one') {
      // One screenshot: a slow scroll down the page and back (tall), or a gentle zoom.
      const img = document.querySelector('.sp-scr img');
      const pan = +img.dataset.pan;
      if (pan > 30) {
        tl.fromTo(img, { y: 0 }, { y: -pan, duration: 2.5, ease: 'power2.inOut' }, 1.4);
        tl.to(img, { y: 0, duration: 1.5, ease: 'power3.inOut' }, 4.5);
      } else {
        gsap.set(img, { transformOrigin: '50% 30%' });
        tl.fromTo(img, { scale: 1 }, { scale: 1.12, duration: 2.4, ease: 'sine.inOut' }, 1.4);
        tl.to(img, { scale: 1, duration: 1.8, ease: 'sine.inOut' }, 4.2);
      }
      glare(1.5);
      glare(6.0);
    } else {
      // Generated screen: the content clears, then builds back row by row.
      tl.to(['.sk-row', '.sk-pill', '.sk-hero'], { opacity: 0, y: 26, duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in' }, 1.0);
      tl.to('.sk-row.k2 .sk-ck i', { scale: 0, duration: 0.3, ease: 'power2.in' }, 1.0);
      tl.fromTo('.sk-hero', { opacity: 0, y: 30, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, 1.6);
      tl.fromTo('.sk-hero .ar', { drawSVG: '0%' }, { drawSVG: '0% 72%', duration: 1.1, ease: 'power2.inOut' }, 1.9);
      tl.fromTo('.sk-prog i', { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 1.95);
      tl.fromTo('.sk-hero .l1, .sk-hero .l2', { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.1 }, 1.85);
      tl.fromTo('.sk-hero .pt', { scale: 0, rotation: -40 * s }, { scale: 1, rotation: 32 * s, duration: 0.6, ease: 'back.out(2.4)' }, 2.2);
      tl.fromTo('.sk-pill', { opacity: 0, y: 14, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.8)' }, 2.1);
      tl.fromTo('.sk-row', { opacity: 0, y: 0, x: 40 * s }, { opacity: 1, y: 0, x: 0, duration: 0.65, stagger: 0.13 }, 2.35);
      tl.fromTo('.sk-row .bar', { scaleX: 0 }, { scaleX: 1, duration: 0.55, stagger: 0.07 }, 2.5);
      tl.fromTo('.sk-row.k0 .sk-ck i, .sk-row.k1 .sk-ck i', { scale: 0 }, { scale: 1, duration: 0.45, stagger: 0.15, ease: 'back.out(2.6)' }, 3.0);
      // A tap ticks off the last row.
      tl.fromTo('.sk-tap', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' }, 4.15);
      tl.to('.sk-tap', { scale: 0.8, duration: 0.12, ease: 'power2.in' }, 4.4);
      tl.fromTo('.sk-row.k2', { scale: 1 }, { scale: 0.97, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 4.4);
      tl.to('.sk-tap', { opacity: 0, scale: 2, duration: 0.45, ease: 'power2.out' }, 4.52);
      tl.fromTo('.sk-row.k2 .sk-ck i', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, 4.5);
      glare(4.6);
    }
  },
};
