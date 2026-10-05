// Project showcase, "Web app in a browser": any client web app in a large, gently tilted browser
// window (address bar with the project's URL). Several screenshots switch like page navigation
// (a loading bar runs, the next page rises in); a single tall one scrolls down and back, a single
// short one zooms in gently; with none, a generated web app in brand colours builds itself. Then
// a cursor glides in and clicks a hotspot: a ripple, a beacon, and a callout card pops out of the
// page towards the viewer. Two chips float beside the window. Everything comes from the post's
// sceneCopy / sceneData.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ico, asset } from '../motion/ui.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Window and page (body) geometry, LTR scene px. The page area is 16:10.
const WIN = { x: 40, y: 92, w: 800, h: 566 };
const BAR = 62;
const BW = WIN.w - 4;
const BH = WIN.h - 4 - BAR;
// Generated app layout (page px, LTR; mirrored in Arabic).
const SIDE = 84;
const BTN = { w: 132, h: 48, top: 24, end: 26 };
const CALLOUT_W = 320;

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const len = (v) => [...String(v ?? '')].length;
// Shortens text to `max` characters with an ellipsis (for one-line labels).
const clip = (v, max) => {
  const c = [...String(v ?? '')];
  if (c.length <= max) return c.join('');
  let cut = c.slice(0, max - 1).join('');
  const space = cut.lastIndexOf(' ');
  if (space > max * 0.7) cut = cut.slice(0, space); // end on a whole word when one is close
  return `${cut.replace(/[\s,.;:،\-–]+$/u, '')}…`;
};
// A Lucide icon, falling back to a safe one when the name is unknown (typos shouldn't break a render).
const icon = (name, opts, fallback = 'sparkles') => {
  try { return ico(String(name || fallback), opts); } catch { return ico(fallback, opts); }
};
const num = (v, d) => (Number.isFinite(+v) && v !== '' && v !== null ? +v : d);

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

// Cover-fit a screenshot into the page area, anchored to the top: tall pages overflow downwards
// (`pan` px to scroll), wide ones are cropped evenly on both sides.
function fitShot(rel) {
  const size = imageSize(rel);
  if (!size || !size.w || !size.h) return { style: 'left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 0', pan: 0 };
  const r = size.h / size.w;
  if (r >= BH / BW) {
    const h = Math.round(BW * r);
    return { style: `left:0;top:0;width:${BW}px;height:${h}px`, pan: Math.min(h - BH, BH * 2.2) };
  }
  const w = Math.round(BH / r);
  return { style: `left:${Math.round((BW - w) / 2)}px;top:0;width:${w}px;height:${BH}px`, pan: 0 };
}

const GOO = `<svg width="0" height="0" style="position:absolute"><defs><filter id="sbgoo" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="0 0 0 0 0.26  0 0 0 0 0.59  0 0 0 0 0.82  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs></svg>`;

const CURSOR = `<svg viewBox="0 0 28 34" width="34" height="41"><path d="M3 2.5 L3 26 L9 20.4 L13.2 30 L17.4 28.2 L13.3 18.9 L21.4 18.9 Z" fill="#0E1A2B" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;

export default {
  meta: {
    title: 'Web app in a browser',
    description: 'A tilted browser window shows the web app’s screenshots like page navigation (or builds a generated web app); a cursor clicks a hotspot and a callout card pops out of the page, with two chips floating beside the window.',
    bestFor: 'Web apps, dashboards, SaaS, websites, admin panels',
    fields: {
      copy: {
        title: 'Page heading of the generated web app (used when there are no screenshots), up to 32 characters',
        callout: '{ icon: Lucide name, title: up to 24 characters, text: up to 60 characters } — the card that pops out at the click',
        chips: '2 items { icon: Lucide name, text: up to 22 characters } floating beside the window',
      },
      data: {
        screens: { type: 'images', max: 3, description: 'Desktop screenshots, landscape or full-page (tall). 2–3 switch like page navigation, 1 tall one scrolls down and back, 1 short one zooms gently, none shows a generated web app' },
        url: { type: 'text', description: 'Address bar text, e.g. app.yourclient.com (always left to right)' },
        icon: { type: 'icon', description: 'Product icon (Lucide name) for the generated web app’s logo' },
        spotX: { type: 'number', description: 'Where the cursor clicks on the first screenshot, % of the page width from the left (0–100)' },
        spotY: { type: 'number', description: 'Where the cursor clicks on the first screenshot, % of the visible page height from the top (0–100)' },
      },
    },
  },
  duration: 8,

  copy: {
    en: {
      title: 'All your orders in one place',
      callout: { icon: 'bell-ring', title: 'Live updates', text: 'New orders appear the moment they arrive.' },
      chips: [
        { icon: 'monitor-smartphone', text: 'Works on any device' },
        { icon: 'shield-check', text: 'Secure sign-in' },
      ],
    },
    ar: {
      title: 'كل طلباتك في مكان واحد',
      callout: { icon: 'bell-ring', title: 'تحديثات فورية', text: 'تظهر الطلبات الجديدة لحظة وصولها.' },
      chips: [
        { icon: 'monitor-smartphone', text: 'يعمل على كل الأجهزة' },
        { icon: 'shield-check', text: 'تسجيل دخول آمن' },
      ],
    },
  },

  data: { screens: [], url: 'yourapp.com', icon: 'layout-dashboard', spotX: 70, spotY: 34 },

  css: (ctx) => {
    const r = ctx.rtl;
    const s = r ? -1 : 1;
    const light = ctx.theme === 'light';
    const disp = r ? "'Alexandria','Plus Jakarta Sans',sans-serif" : "'Plus Jakarta Sans','Alexandria',sans-serif";
    const bar = light ? 'rgba(59,81,112,.16)' : 'rgba(147,169,198,.22)';
    const barHi = light ? 'rgba(59,81,112,.32)' : 'rgba(147,169,198,.42)';
    const panel = light ? '#F4F8FC' : '#182C4A';
    const lift = light ? '0 24px 48px rgba(14,26,43,.16),0 4px 12px rgba(14,26,43,.06)' : '0 30px 60px rgba(2,6,14,.5),0 4px 14px rgba(2,6,14,.3)';
    return `
.sb{position:absolute;inset:0}
.sb-halo{position:absolute;left:92px;top:40px;width:720px;height:720px;border-radius:50%;
  background:radial-gradient(circle,rgba(90,180,217,${light ? '.42' : '.34'}) 0%,rgba(66,150,209,.14) 40%,rgba(66,150,209,0) 68%)}
.sb-net{position:absolute;inset:0;filter:url(#sbgoo)}
.sb-net i{position:absolute;border-radius:50%;background:var(--brand)}
.sb .spark{inset-inline-start:var(--x);top:var(--y);transform:rotate(var(--r)) scale(var(--k,1))}

/* window */
.sb-wrap{position:absolute;inset-inline-start:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;perspective:2400px;z-index:2}
.sb-tilt{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateY(${-9 * s}deg) rotateX(7deg) rotateZ(${0.6 * s}deg)}
.sb-back{position:absolute;inset:0;border-radius:26px;background:${light ? '#F4F8FC' : '#182C4A'};border:2px solid var(--card-line);opacity:.7;
  transform:translate3d(${-50 * s}px,-56px,-20px) scale(.95);box-shadow:${lift}}
.sb .win{position:absolute;inset:0;border-radius:26px;
  background:linear-gradient(160deg,rgba(255,255,255,${light ? 0 : 0.05}),rgba(255,255,255,0) 38%),var(--card);
  box-shadow:${light ? '0 50px 90px rgba(14,26,43,.22)' : '0 50px 100px rgba(2,6,14,.62)'},0 0 0 1px rgba(255,255,255,.03) inset}
.sb .win-bar{height:${BAR}px;gap:10px;padding-inline:22px 18px}
.sb-nav{display:flex;gap:6px;margin-inline-start:10px;color:var(--ui-sub)}
.sb-url{flex:1;max-width:430px;margin-inline:auto;height:40px;border-radius:12px;background:var(--soft);display:flex;align-items:center;justify-content:center;gap:10px;
  padding-inline:16px;direction:ltr;font:500 20px 'JetBrains Mono',monospace;color:var(--ui-text);position:relative;overflow:hidden}
.sb-url .lk{color:#22C55E;flex:none}
.sb-url span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-load{position:absolute;inset-inline:0;bottom:0;height:3px;background:var(--sparkg);transform-origin:${r ? '100%' : '0'} 50%;transform:scaleX(0);border-radius:2px}
.sb-tools{display:flex;gap:12px;color:var(--ui-sub)}
.sb-body{position:absolute;left:0;top:${BAR}px;width:${BW}px;height:${BH}px;overflow:hidden;border-radius:0 0 24px 24px;isolation:isolate}
.sb-page{position:absolute;inset:0;overflow:hidden;background:#fff}
.sb-page + .sb-page{opacity:0}
.sb-page img{position:absolute;display:block;max-width:none}
.sb-dim{position:absolute;inset:0;background:#05090F;opacity:0}
.sb-sheen{position:absolute;inset:0;border-radius:26px;pointer-events:none;background:linear-gradient(${r ? 225 : 135}deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,0) 26%)}
.sb-glare{position:absolute;top:-40%;height:180%;left:0;width:160px;z-index:8;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0));transform:translateX(-460px) rotate(16deg)}

/* generated web app (no screenshots) */
.ga{position:absolute;inset:0;background:var(--card);color:var(--ui-text);font-family:${disp}}
.ga-side{position:absolute;inset-block:0;inset-inline-start:0;width:${SIDE}px;background:${light ? '#F1F6FB' : 'rgba(6,12,24,.38)'};border-inline-end:2px solid var(--card-line);
  display:flex;flex-direction:column;align-items:center;padding-top:18px;gap:12px}
.ga-logo{width:48px;height:48px;border-radius:15px;background:var(--brand);color:#fff;display:grid;place-items:center;box-shadow:0 8px 18px rgba(55,107,177,.35);margin-bottom:12px}
.ga-nav{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:var(--ui-sub)}
.ga-nav.on{background:rgba(66,150,209,.18);color:var(--blue);box-shadow:inset 0 0 0 2px rgba(90,180,217,.4)}
.ga-me{position:absolute;bottom:18px;width:40px;height:40px;border-radius:50%;background:var(--sparkg);box-shadow:0 0 0 3px var(--card),0 0 0 5px rgba(242,141,25,.35)}
.ga-main{position:absolute;inset-block:0;inset-inline-start:${SIDE}px;inset-inline-end:0}
.ga-h{position:absolute;top:22px;inset-inline-start:28px;inset-inline-end:${BTN.w + BTN.end + 20}px}
.ga-h b{display:block;font-weight:800;line-height:1.25;letter-spacing:${r ? 0 : '-.015em'};white-space:nowrap}
.ga-h b .w{display:inline-block}
.ga-h .bar{width:230px;margin-top:10px}
.bar{display:block;height:10px;border-radius:5px;background:${bar};transform-origin:${r ? '100%' : '0'} 50%}
.bar.hi{background:${barHi}}
.ga-btn{position:absolute;top:${BTN.top}px;inset-inline-end:${BTN.end}px;width:${BTN.w}px;height:${BTN.h}px;border-radius:999px;background:var(--sparkg);color:#0E1A2B;
  display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 12px 26px rgba(236,108,28,.35);outline:0 solid rgba(242,141,25,.35)}
.ga-btn .bar{width:52px;height:9px;background:rgba(14,26,43,.5)}
.ga-kpis{position:absolute;top:104px;inset-inline:28px 26px;height:112px;display:flex;gap:16px}
.ga-kpi{flex:1;position:relative;border-radius:20px;background:${panel};border:2px solid var(--card-line);padding:18px}
.ga-ki{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;color:#fff;background:var(--brand)}
.ga-kpi.k1 .ga-ki{background:var(--sparkg);color:#0E1A2B}
.ga-kpi.k2 .ga-ki{background:linear-gradient(135deg,#5AB4D9,#376BB1)}
.ga-kpi .bar{position:absolute;inset-inline-start:18px}
.ga-kpi .b1{top:20px;inset-inline-start:70px;width:70px;height:9px}
.ga-kpi .b0{top:36px;inset-inline-start:70px;width:44px;height:8px}
.ga-kpi .b2{top:62px;height:16px;border-radius:8px;background:${light ? 'rgba(14,26,43,.62)' : 'rgba(255,255,255,.78)'}}
.ga-kpi .tr{position:absolute;inset-inline:18px;bottom:16px;height:8px;border-radius:4px;background:${bar}}
.ga-kpi .tr i{position:absolute;inset-block:0;inset-inline-start:0;border-radius:4px;background:var(--brand);transform-origin:${r ? '100%' : '0'} 50%}
.ga-kpi.k1 .tr i{background:var(--sparkg)}
.ga-kpi.k2 .tr i{background:linear-gradient(90deg,#376BB1,#5AB4D9)}
.ga-tbl{position:absolute;top:234px;inset-inline-start:28px;width:418px;height:240px;border-radius:22px;background:${panel};border:2px solid var(--card-line);padding:18px 18px 0}
.ga-tbl .hd{display:flex;align-items:center;justify-content:space-between;height:26px;margin-bottom:8px}
.ga-row{display:flex;align-items:center;gap:12px;height:44px;border-top:2px solid var(--card-line)}
.ga-row .av{width:28px;height:28px;border-radius:50%;flex:none;background:var(--brand)}
.ga-row.k1 .av{background:var(--sparkg)}
.ga-row.k2 .av{background:linear-gradient(135deg,#5AB4D9,#376BB1)}
.ga-row.k3 .av{background:linear-gradient(135deg,#F4B310,#F28D19)}
.ga-row .bars{flex:1;display:flex;gap:16px;align-items:center}
.ga-st{width:66px;height:26px;border-radius:999px;flex:none;display:flex;align-items:center;justify-content:center}
.ga-st i{width:10px;height:10px;border-radius:50%}
.ga-st.ok{background:rgba(34,197,94,.16)}.ga-st.ok i{background:#22C55E}
.ga-st.bl{background:rgba(66,150,209,.18)}.ga-st.bl i{background:var(--blue)}
.ga-st.or{background:rgba(242,141,25,.18)}.ga-st.or i{background:var(--spark)}
.ga-pie{position:absolute;top:234px;inset-inline-end:26px;width:212px;height:240px;border-radius:22px;background:${panel};border:2px solid var(--card-line);padding:18px}
.ga-pie svg{display:block;width:118px;height:118px;margin:16px auto 0;transform:rotate(-90deg)}
.ga-pie circle{fill:none;stroke-width:16}
.ga-pie .lg{display:flex;justify-content:center;gap:10px;margin-top:20px}
.ga-pie .lg i{width:30px;height:8px;border-radius:4px}

/* overlay in the window's 3D space: hotspot, cursor, callout */
.sb-ov{position:absolute;left:2px;top:${BAR + 2}px;width:${BW}px;height:${BH}px;transform-style:preserve-3d;pointer-events:none}
.sb-spot{position:absolute;width:0;height:0;transform-style:preserve-3d}
.sb-bc{position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:var(--sparkg);box-shadow:0 0 0 4px #fff,0 6px 16px rgba(11,22,40,.45)}
.sb-bc i{position:absolute;inset:-4px;border-radius:50%;border:3px solid var(--spark);opacity:0}
.sb-spot b{position:absolute;left:-6px;top:-9px;width:12px;height:18px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);opacity:0}
.sb-rip{position:absolute;left:-40px;top:-40px;width:80px;height:80px;border-radius:50%;border:4px solid var(--sky);background:rgba(90,180,217,.18);opacity:0}
.sb-cur{position:absolute;left:-3px;top:-2px;filter:drop-shadow(0 8px 10px rgba(2,6,14,.4))}
.sb-co{position:absolute;width:${CALLOUT_W}px;border-radius:24px;padding:18px 20px 20px;display:flex;gap:14px;align-items:flex-start;
  background:linear-gradient(160deg,rgba(255,255,255,${light ? 0 : 0.07}),rgba(255,255,255,0) 55%),var(--card);border:2px solid var(--card-line);color:var(--ui-text);
  box-shadow:${light ? '0 30px 60px rgba(14,26,43,.24),0 6px 16px rgba(14,26,43,.08)' : '0 36px 70px rgba(2,6,14,.62),0 6px 16px rgba(2,6,14,.35)'}}
.sb-co .ci{width:50px;height:50px;border-radius:16px;flex:none;display:grid;place-items:center;background:var(--sparkg);color:#0E1A2B;box-shadow:0 10px 20px rgba(236,108,28,.32)}
.sb-co .ct{flex:1;min-width:0}
.sb-co b{display:block;font-size:${r ? 22 : 23}px;line-height:${r ? 1.45 : 1.25};font-weight:800;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.sb-co p{margin-top:6px;font-size:${r ? 20 : 20}px;line-height:${r ? 1.6 : 1.42};font-weight:500;color:var(--ui-sub);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}

/* chips beside the window */
.sb-chip{position:absolute;z-index:4}
.sb-chip.c0{inset-inline-end:4px;top:30px}
.sb-chip.c1{inset-inline-start:0;top:614px}
.sb-cc{display:flex;align-items:center;gap:14px;padding-block:10px;padding-inline:10px 22px;border-radius:24px;max-width:400px;
  background:linear-gradient(160deg,rgba(255,255,255,${light ? 0 : 0.07}),rgba(255,255,255,0) 55%),var(--card);border:2px solid var(--card-line);color:var(--ui-text);box-shadow:${lift}}
.sb-chip.c0 .sb-cc{transform:perspective(900px) rotateY(${-12 * s}deg) rotate(${2 * s}deg)}
.sb-chip.c1 .sb-cc{transform:perspective(900px) rotateY(${12 * s}deg) rotate(${-2 * s}deg)}
.sb-cc .ib{width:48px;height:48px;border-radius:15px;flex:none;display:grid;place-items:center;background:var(--brand);color:#fff;outline:0 solid rgba(90,180,217,.4)}
.sb-chip.c1 .ib{background:var(--sparkg);color:#0E1A2B;outline-color:rgba(242,141,25,.4)}
.sb-cc b{font-size:${r ? 21 : 22}px;line-height:1.3;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;
  },

  html: ({ copy, data, rtl }) => {
    const s = rtl ? -1 : 1;
    const shots = (Array.isArray(data.screens) ? data.screens : [data.screens]).filter(Boolean).slice(0, 3);
    const chips = (Array.isArray(copy.chips) ? copy.chips : []).filter((c) => c && c.text).slice(0, 2);
    const callout = copy.callout ?? {};
    const appIcon = data.icon || 'layout-dashboard';
    const mx = (x) => (rtl ? BW - x : x); // mirror a page x for the generated (mirrored) layout

    let mode = 'gen';
    let page;
    let hx;
    let hy;
    if (shots.length) {
      const fits = shots.map((rel) => ({ src: asset(rel), ...fitShot(rel) }));
      mode = fits.length === 1 ? 'one' : 'multi';
      page = fits.map((f, i) => `<div class="sb-page p${i}"><img src="${f.src}" style="${f.style}" data-pan="${Math.round(f.pan)}" alt=""><i class="sb-dim"></i></div>`).join('');
      // Screenshots are never mirrored, so the hotspot is in physical page px in both languages.
      hx = Math.round((Math.max(4, Math.min(96, num(data.spotX, 70))) / 100) * BW);
      hy = Math.round((Math.max(6, Math.min(94, num(data.spotY, 34))) / 100) * BH);
    } else {
      const words = esc(clip(copy.title, 40)).split(/\s+/).filter(Boolean).map((w) => `<span class="w">${w}</span>`).join(' ');
      const tlen = len(copy.title);
      const titleSize = tlen <= 22 ? 32 : tlen <= 28 ? 28 : tlen <= 34 ? 24 : 21;
      const navIcons = ['house', 'inbox', 'users', 'chart-pie'];
      const rows = [[120, 64, 'ok'], [96, 80, 'bl'], [132, 52, 'or'], [104, 70, 'ok']];
      page = `<div class="ga">
        <div class="ga-side"><span class="ga-logo">${icon(appIcon, { size: 26, stroke: 2.2 }, 'layout-dashboard')}</span>
          ${navIcons.map((n, i) => `<span class="ga-nav ${i ? '' : 'on'}">${ico(n, { size: 24, stroke: 2.1 })}</span>`).join('')}<span class="ga-me"></span></div>
        <div class="ga-main">
          <div class="ga-h"><b style="font-size:${titleSize}px">${words}</b><i class="bar"></i></div>
          <div class="ga-btn">${ico('plus', { size: 22, stroke: 3 })}<i class="bar"></i></div>
          <div class="ga-kpis">${[0, 1, 2].map((i) => `<div class="ga-kpi k${i}"><span class="ga-ki">${ico(['users', 'circle-check', 'clock'][i], { size: 22, stroke: 2.2 })}</span><i class="bar hi b1"></i><i class="bar b0"></i><i class="bar b2" style="width:${[96, 78, 108][i]}px"></i><span class="tr"><i style="width:${[72, 54, 86][i]}%"></i></span></div>`).join('')}</div>
          <div class="ga-tbl"><div class="hd"><i class="bar hi" style="width:120px;height:12px"></i><i class="bar" style="width:46px"></i></div>
            ${rows.map(([a, b, st], i) => `<div class="ga-row k${i}"><span class="av"></span><span class="bars"><i class="bar hi" style="width:${a}px"></i><i class="bar" style="width:${b}px"></i></span><span class="ga-st ${st}"><i></i></span></div>`).join('')}</div>
          <div class="ga-pie"><i class="bar hi" style="width:96px;height:12px"></i>
            <svg viewBox="0 0 118 118" style="${rtl ? 'transform:rotate(-90deg) scaleY(-1)' : ''}"><circle cx="59" cy="59" r="46" style="stroke:var(--soft)"/>
              <circle class="sg" cx="59" cy="59" r="46" stroke="#376BB1" stroke-dasharray="137 289"/>
              <circle class="sg" cx="59" cy="59" r="46" stroke="#5AB4D9" stroke-dasharray="87 289" stroke-dashoffset="-141"/>
              <circle class="sg" cx="59" cy="59" r="46" stroke="#F28D19" stroke-dasharray="53 289" stroke-dashoffset="-232"/></svg>
            <div class="lg"><i style="background:#376BB1"></i><i style="background:#5AB4D9"></i><i style="background:#F28D19"></i></div></div>
        </div>
      </div>`;
      // The click lands on the "+" button (top inline-end corner of the main area).
      hx = mx(BW - BTN.end - BTN.w / 2);
      hy = BTN.top + BTN.h / 2 + 4;
    }

    // Callout beside the hotspot, on whichever side has room; it grows away from the hotspot.
    const right = hx + 26 + CALLOUT_W <= BW - 12;
    const below = hy <= BH * 0.56;
    const cx = right ? hx + 26 : Math.max(12, hx - 26 - CALLOUT_W);
    const coPos = `left:${cx}px;${below ? `top:${hy + 30}px` : `bottom:${BH - hy + 30}px`};transform-origin:${right ? 0 : '100%'} ${below ? 0 : '100%'}`;
    // The cursor rests just off the hotspot, on the side away from the callout.
    const rest = { x: right ? -42 : 22, y: below ? 8 : 16 };

    const blobs = [[-28, 40, 126], [70, 0, 70], [10, 168, 56], [770, 560, 140], [860, 520, 70], [700, 676, 60], [640, -20, 46]];
    const sparks = [[876, 140, 40, 0.85], [24, 300, -120, 0.9], [440, 2, 70, 0.75], [880, 470, 150, 0.8], [250, 700, -30, 0.8], [600, 712, 110, 0.7]];
    const chip = (c, i) => `<div class="sb-chip c${i}"><div class="sb-ci"><div class="sb-cc"><span class="ib">${icon(c.icon, { size: 26, stroke: 2.2 })}</span><b>${esc(clip(c.text, 26))}</b></div></div></div>`;

    return `${GOO}
<div class="sb" data-mode="${mode}" data-hx="${hx}" data-hy="${hy}" data-rx="${rest.x}" data-ry="${rest.y}" data-bw="${BW}" data-bh="${BH}">
  <div class="sb-halo"></div>
  <div class="sb-net">${blobs.map(([x, y, d]) => `<i style="inset-inline-start:${x}px;top:${y}px;width:${d}px;height:${d}px"></i>`).join('')}</div>
  ${sparks.map(([x, y, rot, k]) => `<div class="spark" style="--x:${x}px;--y:${y}px;--r:${rot * s}deg;--k:${k}"></div>`).join('')}
  <div class="sb-wrap"><div class="sb-tilt">
    <div class="sb-back"></div>
    <div class="win">
      <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span>
        <span class="sb-nav">${ico(rtl ? 'chevron-right' : 'chevron-left', { size: 24, stroke: 2.4 })}${ico(rtl ? 'chevron-left' : 'chevron-right', { size: 24, stroke: 2.4 })}${ico('rotate-cw', { size: 20, stroke: 2.4 })}</span>
        <span class="sb-url">${ico('lock', { size: 18, stroke: 2.6, cls: 'lk' })}<span>${esc(clip(String(data.url || 'yourapp.com').replace(/^https?:\/\//, ''), 32))}</span><i class="sb-load"></i></span>
        <span class="sb-tools">${ico('share', { size: 22, stroke: 2.2 })}${ico('plus', { size: 22, stroke: 2.4 })}</span></div>
      <div class="sb-body">${page}<i class="sb-glare"></i></div>
      <div class="sb-sheen"></div>
    </div>
    <div class="sb-ov">
      <div class="sb-spot" style="left:${hx}px;top:${hy}px"><span class="sb-rip"></span>${'<b></b>'.repeat(7)}<span class="sb-bc"><i></i></span></div>
      ${callout.title || callout.text ? `<div class="sb-co" style="${coPos}"><span class="ci">${icon(callout.icon, { size: 26, stroke: 2.2 })}</span><div class="ct">${callout.title ? `<b>${esc(callout.title)}</b>` : ''}${callout.text ? `<p>${esc(callout.text)}</p>` : ''}</div></div>` : ''}
      <div class="sb-spot sb-cw" style="left:${hx}px;top:${hy}px"><span class="sb-cur">${CURSOR}</span></div>
    </div>
  </div></div>
  ${chips.map(chip).join('')}
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const s = ctx.rtl ? -1 : 1;
    const amb = { duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true };
    const $ = (sel) => gsap.utils.toArray(sel);
    const sb = document.querySelector('.sb');
    const mode = sb.dataset.mode;
    const hx = +sb.dataset.hx;
    const hy = +sb.dataset.hy;
    const bw = +sb.dataset.bw;
    const bh = +sb.dataset.bh;
    const rest = { x: +sb.dataset.rx, y: +sb.dataset.ry };

    // ---- Set-up: 3D depth for the overlay, resting cursor (frame 0 = after the click) ----
    gsap.set('.sb-tilt', { rotationY: -9 * s, rotationX: 7, rotationZ: 0.6 * s });
    gsap.set('.sb-spot', { z: 24 });
    gsap.set('.sb-co', { z: 70 });
    gsap.set('.sb-cw', { z: 110 });
    gsap.set('.sb-cur', { x: rest.x, y: rest.y, transformOrigin: '3px 2px' });
    // Everything that moves gets its GSAP transform up front (same rasterisation at both ends).
    gsap.set(['.sb-chip', '.sb-ci', '.sb-bc', '.sb-page', '.sb-page img', '.ga-h .w', '.ga-btn', '.ga-kpi', '.ga-tbl', '.ga-pie', '.ga-row'], { x: 0, y: 0 });

    // ---- Ambient loops (whole cycles) ----
    tl.to('.sb-wrap', { y: -10, ...amb }, 0);
    tl.to('.sb-tilt', { rotationY: -4 * s, rotationX: 4, rotationZ: 0.2 * s, ...amb }, 0);
    tl.to('.sb-halo', { scale: 1.08, opacity: 0.82, ...amb }, 0);
    tl.to('.sb-chip.c0', { y: -10, x: 4 * s, ...amb }, 0);
    tl.to('.sb-chip.c1', { y: 9, x: -4 * s, ...amb }, 0);
    $('.sb-net i').forEach((n, i) => tl.to(n, { x: (i % 2 ? 16 : -12) * s, y: i % 3 ? -14 : 16, scale: 1 + (i % 3) * 0.07, ...amb }, 0));
    tl.to('.sb .spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.sb .spark', { y: (i) => (i % 2 ? 14 : -14), ...amb }, 0);
    // A soft ring keeps leaving the beacon while the callout is shown.
    const beat = (t) => {
      tl.fromTo('.sb-bc i', { scale: 1 }, { scale: 2.6, duration: 1.1, ease: 'power2.out' }, t);
      tl.fromTo('.sb-bc i', { opacity: 0 }, { opacity: 0.85, duration: 0.15, ease: 'none' }, t);
      tl.to('.sb-bc i', { opacity: 0, duration: 0.95, ease: 'power1.out' }, t + 0.15);
    };
    beat(0.05);
    beat(6.75);
    // Light sweeps across the page (starting and ending far enough out that the rotated band's
    // corners never show).
    const glare = (t) => tl.fromTo('.sb-glare', { x: -460, rotation: 16 }, { x: bw + 300, rotation: 16, duration: 1.2, ease: 'power2.inOut' }, t);

    // ---- 0.95s: clear: callout folds back into the hotspot, cursor leaves, chips drop ----
    tl.to('.sb-co', { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power2.in' }, 0.95);
    tl.to('.sb-bc', { scale: 0, duration: 0.35, ease: 'back.in(2)' }, 1.1);
    const away = { x: bw - hx + 70, y: bh - hy + 50 };
    tl.to('.sb-cur', { x: away.x, duration: 0.85, ease: 'power2.in' }, 1.0);
    tl.to('.sb-cur', { y: away.y, duration: 0.85, ease: 'power3.in' }, 1.0);
    tl.to('.sb-cur', { opacity: 0, duration: 0.25, ease: 'none' }, 1.6);
    tl.to('.sb-ci', { opacity: 0, scale: 0.8, y: 18, duration: 0.4, stagger: 0.08, ease: 'power2.in' }, 1.05);

    // ---- the page ----
    // Navigation: the loading bar runs, the next page rises in, the old one sinks back.
    const load = (t) => {
      tl.fromTo('.sb-load', { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, t);
      tl.to('.sb-load', { opacity: 0, duration: 0.25, ease: 'none' }, t + 0.55);
      tl.fromTo('.sb-nav svg:last-child', { rotation: 0 }, { rotation: 360, duration: 0.7, ease: 'power2.inOut' }, t);
    };
    if (mode === 'multi') {
      const pages = $('.sb-page');
      const order = [...pages.keys(), 0].slice(1);
      const times = pages.length === 2 ? [1.55, 3.5] : [1.45, 2.75, 4.05];
      let prev = 0;
      order.forEach((k, j) => {
        const t = times[j];
        const inc = pages[k];
        const out = pages[prev];
        load(t);
        if (k === 0) tl.set(inc, { zIndex: 5 }, t + 0.35);
        tl.set(inc.querySelector('.sb-dim'), { opacity: 0 }, t + 0.35);
        tl.set(inc.querySelector('img'), { y: 0 }, t + 0.35);
        tl.fromTo(inc, { y: 46, scale: 1.015 }, { y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }, t + 0.35);
        tl.fromTo(inc, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, t + 0.35);
        tl.fromTo(out, { y: 0, scale: 1 }, { y: -18, scale: 0.98, duration: 0.6, ease: 'power2.in' }, t + 0.3);
        tl.fromTo(out.querySelector('.sb-dim'), { opacity: 0 }, { opacity: 0.45, duration: 0.5, ease: 'power2.in' }, t + 0.3);
        // A tall page that isn't the cover drifts down while it is shown.
        const img = inc.querySelector('img');
        const pan = +img.dataset.pan;
        const next = times[j + 1] ?? D;
        if (k !== 0 && pan > 40) tl.fromTo(img, { y: 0 }, { y: -Math.min(pan, 260), duration: next - t - 0.6, ease: 'sine.inOut' }, t + 0.9);
        prev = k;
      });
      glare(5.1);
    } else if (mode === 'one') {
      const img = document.querySelector('.sb-page img');
      const pan = +img.dataset.pan;
      if (pan > 40) {
        // Scroll down the whole page and back up to the top before the click.
        tl.fromTo(img, { y: 0 }, { y: -pan, duration: 2.3, ease: 'power2.inOut' }, 1.45);
        tl.to(img, { y: 0, duration: 1.15, ease: 'power3.inOut' }, 3.95);
      } else {
        gsap.set(img, { transformOrigin: `${hx}px ${hy}px` });
        tl.fromTo(img, { scale: 1 }, { scale: 1.1, duration: 1.8, ease: 'sine.inOut' }, 1.45);
        tl.to(img, { scale: 1, duration: 1.4, ease: 'sine.inOut' }, 3.6);
      }
      glare(5.1);
    } else {
      // Generated web app: clears, then builds back: heading, button, KPIs, table, donut.
      tl.to(['.ga-pie', '.ga-tbl', '.ga-kpi'], { opacity: 0, y: 24, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, 1.0);
      tl.to('.ga-btn', { opacity: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' }, 1.1);
      tl.to('.ga-h .w', { opacity: 0, y: -16, duration: 0.35, stagger: 0.04, ease: 'power2.in' }, 1.12);
      tl.to('.ga-h .bar', { scaleX: 0, duration: 0.35, ease: 'power2.in' }, 1.15);
      tl.fromTo('.ga-h .w', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, 1.65);
      tl.fromTo('.ga-h .bar', { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 1.85);
      tl.fromTo('.ga-btn', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 1.9);
      tl.fromTo('.ga-kpi', { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.1 }, 2.05);
      tl.fromTo('.ga-ki', { scale: 0.3, rotation: -40 * s }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2.2)' }, 2.2);
      tl.fromTo('.ga-kpi .bar', { scaleX: 0 }, { scaleX: 1, duration: 0.55, stagger: 0.05 }, 2.3);
      tl.fromTo('.ga-kpi .tr i', { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'power2.inOut' }, 2.55);
      tl.fromTo(['.ga-tbl', '.ga-pie'], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 2.5);
      tl.fromTo('.ga-row', { opacity: 0, x: 26 * s }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.09 }, 2.75);
      tl.fromTo('.ga-tbl .bar', { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.03 }, 2.8);
      tl.fromTo('.ga-st', { scale: 0 }, { scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(2.4)' }, 3.1);
      // Donut segments draw one after another from where each one starts.
      const seg = [[0, 47.4], [48.8, 78.9], [80.3, 98.6]];
      tl.fromTo('.ga-pie .sg', { drawSVG: (i) => `${seg[i][0]}% ${seg[i][0]}%` }, { drawSVG: (i) => `${seg[i][0]}% ${seg[i][1]}%`, duration: 0.7, stagger: 0.22, ease: 'power2.inOut' }, 2.85);
      tl.fromTo('.ga-pie .lg i', { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.08 }, 3.3);
      glare(3.6);
    }

    // ---- chips pop in during the rebuild ----
    $('.sb-ci').forEach((c, i) => {
      const t = 2.3 + i * 0.45;
      tl.fromTo(c, { opacity: 0, scale: 0.8, y: 18 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }, t);
      tl.fromTo(c.querySelector('.ib'), { outlineWidth: 0 }, { outlineWidth: 8, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + 0.3);
    });

    // ---- 4.6s: the cursor glides in (x and y on different eases, so it arcs), hovers, clicks ----
    tl.fromTo('.sb-cur', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, 4.6);
    tl.fromTo('.sb-cur', { x: away.x }, { x: 0, duration: 0.9, ease: 'power3.inOut' }, 4.6);
    tl.fromTo('.sb-cur', { y: away.y }, { y: 0, duration: 0.9, ease: 'power2.inOut' }, 4.6);
    tl.fromTo('.sb-cur', { scale: 1 }, { scale: 0.82, duration: 0.11, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 5.68);
    if (mode === 'gen') tl.fromTo('.ga-btn', { scale: 1 }, { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 5.68);
    if (mode === 'gen') tl.fromTo('.ga-btn', { outlineWidth: 0 }, { outlineWidth: 9, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 5.75);
    tl.fromTo('.sb-rip', { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.2, duration: 0.75, ease: 'power2.out' }, 5.78);
    tl.fromTo('.sb-bc', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, 5.8);
    // Spark petals burst out of the click.
    $('.sb-spot b').forEach((p, i, all) => {
      const a = ((360 * i) / all.length - 75) * (Math.PI / 180);
      const r0 = (a * 180) / Math.PI + 90;
      const t = 5.8 + (i % 2) * 0.04;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.3, rotation: r0 }, { x: Math.cos(a) * 58, y: Math.sin(a) * 58, scale: 1, rotation: r0 + 50 * s, duration: 0.85, ease: 'power3.out' }, t);
      tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none' }, t);
      tl.to(p, { opacity: 0, duration: 0.4, ease: 'power1.in' }, t + 0.45);
    });
    tl.fromTo('.sb-co', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 5.92);
    // ...and drifts aside so the callout is clear.
    tl.fromTo('.sb-cur', { x: 0, y: 0 }, { x: rest.x, y: rest.y, duration: 0.8, ease: 'power2.inOut' }, 6.2);
  },
};
