// Upgrades: an existing app gets the Crapto treatment. A Before/After switch flips, the code
// diff swaps the slow lines for fast ones, the bug turns into a check, the speed gauge's needle
// whips from the slow (ember) zone into the fast (sky/green) zone while the load time drops
// (9.2 → 1.1) and the score ring climbs (41 → 98). Frame 0 is the finished "after" state.
import { ico, gooFilter } from '../motion/ui.mjs';

// Gauge geometry, in the gauge card's own coordinates. The gauge is a 240° clockwise dial, so
// it is not mirrored for Arabic (clockwise reads the same in both directions).
const GW = 560;
const GH = 468;
const CX = 280;
const CY = 290;
const R1 = 152; // inner end of the long bars
const R2 = 186; // outer end of every bar
const N = 33;
const SWEEP = 240;
const P_AFTER = 28 / 32; // needle position as a fraction of the sweep
const P_BEFORE = 3 / 32;
const FADE = 0.025; // a bar lights up over this much of the sweep as the needle reaches it
const RS = R1 - 8; // radius of the glowing sector that trails the needle
const RING_R = 84;
const RING_C = 2 * Math.PI * RING_R;
const CFG = {
  cx: CX, cy: CY, sweep: SWEEP, pA: P_AFTER, pB: P_BEFORE, fade: FADE,
  tA: 1.1, tB: 9.2, sA: 98, sB: 41, rc: RING_C, seg: 128, rs: RS,
};
// Filled sector from the start of the dial to the needle (fraction p of the sweep).
function sector(p) {
  const a0 = -SWEEP / 2; const a1 = a0 + p * SWEEP;
  const [x0, y0] = pt(a0, RS); const [x1, y1] = pt(a1, RS);
  return `M ${CX} ${CY} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${RS} ${RS} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a); const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};
// Slow zone ember → spark → amber; fast zone blue → sky → green (crisp switch between zones).
function barColor(f) {
  if (f < 0.32) return mix('#EC6C1C', '#F28D19', f / 0.32);
  if (f < 0.56) return mix('#F28D19', '#F4B310', (f - 0.32) / 0.24);
  if (f < 0.78) return mix('#4296D1', '#5AB4D9', (f - 0.56) / 0.22);
  return mix('#5AB4D9', '#22C55E', (f - 0.78) / 0.22);
}
const rad = (a) => (a * Math.PI) / 180;
const pt = (a, r) => [CX + r * Math.sin(rad(a)), CY - r * Math.cos(rad(a))];
const BARS = Array.from({ length: N }, (_, i) => {
  const f = i / (N - 1);
  const a = -SWEEP / 2 + f * SWEEP;
  const [x1, y1] = pt(a, i % 4 === 0 ? R1 : R1 + 12);
  const [x2, y2] = pt(a, R2);
  return { f, a, x1, y1, x2, y2, c: barColor(f) };
});
const litAt = (p, f) => Math.min(1, Math.max(0, (p - f + FADE) / FADE));
const line = (b, attrs = '') => `<line x1="${b.x1.toFixed(1)}" y1="${b.y1.toFixed(1)}" x2="${b.x2.toFixed(1)}" y2="${b.y2.toFixed(1)}" ${attrs}/>`;
const arc = (r, a0, a1) => {
  const [x0, y0] = pt(a0, r); const [x1, y1] = pt(a1, r);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

// Code lines are Latin in both languages; spans give them light syntax colours. Body lines are
// indented with a margin (not spaces) so the strike-through only covers the code itself.
const CODE = {
  ctx1: '<span class="k">async function</span> <span class="f">loadFeed</span>() {',
  del: ['<span class="k">const</span> all = <span class="k">await</span> api.<span class="f">getAll</span>();', '<span class="k">return</span> all.<span class="f">filter</span>(isNew);'],
  add: ['<span class="k">const</span> feed = <span class="k">await</span> cache.<span class="f">get</span>();', '<span class="k">return</span> feed.<span class="f">latest</span>();'],
  ctx2: '}',
};

export default {
  duration: 8,

  copy: {
    en: {
      before: 'Before', after: 'After',
      load: 'Load time', unit: 's',
      slow: 'Slow', fast: 'Fast',
      score: 'Score',
      bug: 'Bug found', fixed: 'Fixed',
      file: 'feed.js', code: CODE,
    },
    ar: {
      before: 'قبل', after: 'بعد',
      load: 'زمن التحميل', unit: 'ث',
      slow: 'بطيء', fast: 'سريع',
      score: 'التقييم',
      bug: 'خلل برمجي', fixed: 'تم الإصلاح',
      file: 'feed.js', code: CODE,
    },
  },

  css: (ctx) => {
    const r = ctx.rtl;
    return `
.up{position:absolute;inset:0}
.up-halo{position:absolute;inset-inline-start:-60px;top:-40px;width:700px;height:640px;border-radius:50%}
.up-halo.c{background:radial-gradient(closest-side,rgba(90,180,217,.55),rgba(90,180,217,.18) 55%,rgba(90,180,217,0))}
.up-halo.w{background:radial-gradient(closest-side,rgba(242,141,25,.42),rgba(236,108,28,.14) 55%,rgba(236,108,28,0));opacity:0}
.up-net{position:absolute;inset:0}
.up-net i{position:absolute;border-radius:50%;background:var(--brand)}
.up .spark{inset-inline-start:var(--x);top:var(--y);transform:rotate(var(--r)) scale(var(--k,1))}

/* wrappers float; the cards inside them tilt. The diff card ends ~26px above the box bottom
   (the headline starts right below the box), and it floats upwards, never down. */
.up-w{position:absolute}
.up-gw{inset-inline-start:26px;top:18px;width:${GW}px;height:${GH}px;z-index:3}
.up-sw{inset-inline-end:24px;top:34px;width:270px;height:316px;z-index:5}
.up-bw{inset-inline-end:24px;top:376px;width:270px;height:98px;z-index:5}
.up-dw{inset-inline-end:24px;top:500px;width:640px;z-index:4}
.up-w>.card,.up-w>.win{position:relative;width:100%;height:100%}

/* before/after switch */
.up-tg{position:absolute;top:22px;left:50%;margin-left:-${CFG.seg + 6}px;width:${CFG.seg * 2 + 12}px;height:60px;border-radius:999px;background:var(--soft);border:2px solid var(--card-line)}
.up-th{position:absolute;top:4px;inset-inline-start:${CFG.seg + 4}px;width:${CFG.seg}px;height:48px;border-radius:999px}
.up-th.a{background:var(--brand);box-shadow:0 8px 18px rgba(55,107,177,.35)}
.up-th.b{background:var(--sparkg);box-shadow:0 8px 18px rgba(236,108,28,.32);opacity:0}
.up-th.rp{border:3px solid var(--sky);opacity:0;margin:-3px}
.up-o{position:absolute;top:4px;width:${CFG.seg}px;height:48px;display:grid;place-items:center;font-size:22px;font-weight:800;line-height:1;padding-bottom:${r ? 4 : 0}px}
.up-o.b{inset-inline-start:4px;color:var(--ui-sub)}
.up-o.a{inset-inline-start:${CFG.seg + 4}px;color:#fff}

/* gauge */
.up-gsvg{position:absolute;left:0;top:0;overflow:visible}
.up-base line{stroke:var(--soft);stroke-width:12;stroke-linecap:round}
.up-glow{opacity:.7}
.up-sec{opacity:.32}
.up-ghost path{fill:var(--sky)}
.up-ghost{opacity:0}
.up-lit line,.up-glow line{stroke-width:12;stroke-linecap:round}
.up-needle{filter:drop-shadow(0 6px 6px rgba(14,26,43,.22))}
.up-wave{opacity:0}
.up-zone{position:absolute;top:${CY + 104}px;width:120px;margin-left:-60px;text-align:center;font-size:22px;font-weight:700;color:var(--ui-sub)}
.up-zone.s{left:${Math.round(pt(-120, R2)[0])}px}
.up-zone.f{left:${Math.round(pt(120, R2)[0])}px;color:var(--cobalt)}
.up-read{position:absolute;top:${CY + 36}px;inset-inline:0;text-align:center}
.up-num{display:flex;justify-content:center;align-items:baseline;gap:${r ? 12 : 6}px;font-family:'Plus Jakarta Sans',sans-serif;line-height:1}
.up-num b{font-size:84px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--ui-text)}
.up-num small{font-family:${r ? "'Alexandria','Plus Jakarta Sans'" : "'Plus Jakarta Sans'"},sans-serif;font-size:${r ? 36 : 40}px;font-weight:800;color:var(--ui-sub)}
.up-lbl{margin-top:${r ? 4 : 8}px;font-size:24px;font-weight:700;color:var(--ui-sub)}

/* score ring */
.up-score{display:flex;flex-direction:column;align-items:center;padding-top:26px}
.up-ring{position:relative;width:204px;height:204px}
.up-ring svg{position:absolute;inset:0;overflow:visible}
.up-ring .tr{stroke:var(--soft)}
.up-rg{filter:drop-shadow(0 6px 10px rgba(34,197,94,.28))}
.up-snum{position:absolute;inset:0;display:grid;place-items:center;font:800 68px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--ui-text);padding-bottom:4px}
.up-score .up-lbl{margin-top:${r ? 12 : 16}px;font-size:${r ? 25 : 26}px;font-weight:800;color:var(--ui-text)}
.up-delta{position:absolute;top:-18px;inset-inline-end:-14px;padding:8px 16px;border-radius:999px;background:#22C55E;color:#fff;font:800 24px 'Plus Jakarta Sans',sans-serif;direction:ltr;box-shadow:0 10px 20px rgba(34,197,94,.35)}
.up-burst{position:absolute;left:50%;top:128px;width:0;height:0}
.up-burst .spark{opacity:0;left:-11px;top:-17px}

/* bug → fixed */
.up-bug{display:flex;align-items:center;gap:18px;padding-inline:16px}
.up-badge{position:relative;width:66px;height:66px;flex:none}
.up-badge>i{position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;color:#fff}
.up-badge .w{background:var(--sparkg);opacity:0}
.up-badge .g{background:#22C55E;box-shadow:0 10px 20px rgba(34,197,94,.35)}
.up-badge .rp{inset:-4px;border:3px solid #22C55E;opacity:0}
.up-badge .up-pop{position:absolute;left:50%;top:50%;width:0;height:0}
.up-badge .up-pop .spark{opacity:0;left:-11px;top:-17px}
.up-blbl{position:relative;flex:1;height:40px}
.up-blbl span{position:absolute;inset-inline-start:0;top:0;font-size:${r ? 25 : 26}px;font-weight:800;line-height:${r ? 36 : 40}px;white-space:nowrap}
.up-blbl .x{opacity:0;color:var(--ember)}

/* code diff. The +/- count has its own LTR direction, so its auto margin is set physically:
   it must sit at the far (inline) end of the bar in both languages. */
.up-dw .win-bar{height:52px}
.up-stat{${r ? 'margin-right' : 'margin-left'}:auto;display:flex;gap:12px;font:700 21px 'JetBrains Mono',monospace;direction:ltr}
.up-stat .p{color:#16A34A}
.up-stat .m{color:var(--ember)}
.up-code{position:relative;padding:6px 0 10px;direction:ltr;text-align:left;font:500 21px/36px 'JetBrains Mono',monospace;color:var(--ui-text)}
.up-row{position:relative;height:36px;display:flex;align-items:center;white-space:pre}
.up-row b{width:58px;flex:none;text-align:right;padding-right:14px;font-weight:500;color:var(--ui-sub);opacity:.7}
.up-row i{width:26px;flex:none;font-style:normal;font-weight:700;text-align:center}
.up-row code{position:relative;display:inline-block}
.up-row code.in{margin-left:2ch}
.up-row .k{color:var(--cobalt);font-weight:700}
.up-row .f{color:#C2570F}
/* each changed line lives in a clipped slot: old and new lines roll through it like an odometer */
.up-slot{position:relative;height:36px;overflow:hidden}
.up-slot .up-row{position:absolute;inset:0}
.up-row.del{background:rgba(236,108,28,.12);opacity:0}
.up-row.del i{color:var(--ember)}
.up-row.del code::after{content:'';position:absolute;left:-3px;right:-3px;top:calc(50% - 1px);height:3px;border-radius:2px;background:var(--ember);opacity:.8;transform-origin:left center;transform:scaleX(var(--st,0))}
.up-row.add{background:rgba(34,197,94,.13)}
.up-row.add i{color:#16A34A}
.up-row.add::before,.up-row.del::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px}
.up-row.add::before{background:#22C55E}
.up-row.del::before{background:var(--ember)}
.up-row .fl{position:absolute;inset:0;opacity:0}
.up-row.add .fl{background:rgba(34,197,94,.28)}
.up-row.del .fl{background:rgba(236,108,28,.30)}
`;
  },

  html: ({ copy, rtl }) => {
    const s = rtl ? -1 : 1;
    const needleA = -SWEEP / 2 + P_AFTER * SWEEP;
    // One gooey cluster tucked under the gauge and beside the diff (it stays inside the box
    // through its drift); the old top cluster only peeked out above the score card as stray domes.
    const blobs = [
      [16, 558, 128], [104, 628, 84], [44, 482, 62], [170, 546, 54], [24, 668, 58],
    ];
    const sparks = [[206, 676, 30, 0.9], [586, 358, -150, 0.7], [596, 2, 70, 0.75], [870, 482, -40, 0.8], [0, 404, 160, 0.7]];
    const petals = (n) => Array.from({ length: n }, () => '<i class="spark"></i>').join('');
    const code = copy.code;
    const row = (cls, n, mark, html, ind) => `<div class="up-row ${cls}"><span class="fl"></span><b>${n}</b><i>${mark}</i><code${ind ? ' class="in"' : ''}>${html}</code></div>`;
    return `${gooFilter}
<div class="up" data-cfg='${JSON.stringify(CFG)}'>
  <div class="up-halo c"></div><div class="up-halo w"></div>
  <div class="up-net goo">${blobs.map(([x, y, d]) => `<i style="inset-inline-start:${x}px;top:${y}px;width:${d}px;height:${d}px"></i>`).join('')}</div>
  ${sparks.map(([x, y, rot, k]) => `<div class="spark" style="--x:${x}px;--y:${y}px;--r:${rot * s}deg;--k:${k}"></div>`).join('')}

  <div class="up-w up-gw"><div class="card up-gauge">
    <svg class="up-gsvg" width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}">
      <defs><filter id="upblur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
        <linearGradient id="uphub" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EC6C1C"/><stop offset=".5" stop-color="#F28D19"/><stop offset="1" stop-color="#F4B310"/></linearGradient>
        <linearGradient id="upsec" gradientUnits="userSpaceOnUse" x1="${CX - RS}" y1="0" x2="${CX + RS}" y2="0"><stop offset="0" stop-color="#EC6C1C"/><stop offset=".3" stop-color="#F28D19"/><stop offset=".48" stop-color="#F4B310"/><stop offset=".6" stop-color="#4296D1"/><stop offset=".8" stop-color="#5AB4D9"/><stop offset="1" stop-color="#22C55E"/></linearGradient>
        <radialGradient id="upfade" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${RS}"><stop offset=".25" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>
        <mask id="upmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${GW}" height="${GH}"><rect width="${GW}" height="${GH}" fill="url(#upfade)"/></mask></defs>
      <path class="up-sec" d="${sector(P_AFTER)}" fill="url(#upsec)" mask="url(#upmask)"/>
      <path class="up-wave" d="${arc(R2 - 8, -SWEEP / 2, SWEEP / 2)}" fill="none" stroke="var(--sky)" stroke-width="6" stroke-linecap="round"/>
      <path d="${arc(R1 - 22, -SWEEP / 2, SWEEP / 2)}" fill="none" stroke="var(--card-line)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 12"/>
      <g class="up-base">${BARS.map((b) => line(b)).join('')}</g>
      <g class="up-glow" filter="url(#upblur)">${BARS.map((b) => line(b, `stroke="${b.c}" data-f="${b.f}" style="opacity:${litAt(P_AFTER, b.f)}"`)).join('')}</g>
      <g class="up-lit">${BARS.map((b) => line(b, `stroke="${b.c}" data-f="${b.f}" style="opacity:${litAt(P_AFTER, b.f)}"`)).join('')}</g>
      <g class="up-ghost" transform="rotate(${needleA} ${CX} ${CY})"><path d="M ${CX - 9} ${CY} L ${CX - 2.6} ${CY - 124} Q ${CX} ${CY - 131} ${CX + 2.6} ${CY - 124} L ${CX + 9} ${CY} Z"/></g>
      <g class="up-ghost" transform="rotate(${needleA} ${CX} ${CY})"><path d="M ${CX - 9} ${CY} L ${CX - 2.6} ${CY - 124} Q ${CX} ${CY - 131} ${CX + 2.6} ${CY - 124} L ${CX + 9} ${CY} Z"/></g>
      <g class="up-needle" transform="rotate(${needleA} ${CX} ${CY})"><path d="M ${CX - 9} ${CY} L ${CX - 2.6} ${CY - 124} Q ${CX} ${CY - 131} ${CX + 2.6} ${CY - 124} L ${CX + 9} ${CY} Z" fill="var(--ui-text)"/></g>
      <circle cx="${CX}" cy="${CY}" r="21" fill="var(--ui-text)"/>
      <circle cx="${CX}" cy="${CY}" r="9" fill="url(#uphub)"/>
    </svg>
    <div class="up-tg"><i class="up-th b"></i><i class="up-th a"></i><i class="up-th rp"></i><span class="up-o b">${copy.before}</span><span class="up-o a">${copy.after}</span></div>
    <div class="up-zone s">${copy.slow}</div><div class="up-zone f">${copy.fast}</div>
    <div class="up-read"><div class="up-num"><b>${CFG.tA.toFixed(1)}</b><small>${copy.unit}</small></div><div class="up-lbl">${copy.load}</div></div>
  </div></div>

  <div class="up-w up-sw"><div class="card up-score">
    <div class="up-ring">
      <svg width="204" height="204" viewBox="0 0 204 204">
        <defs>
          <linearGradient id="upwarm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
          <linearGradient id="upgood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22C55E"/><stop offset=".55" stop-color="#5AB4D9"/><stop offset="1" stop-color="#4296D1"/></linearGradient>
        </defs>
        <circle class="tr" cx="102" cy="102" r="${RING_R}" fill="none" stroke-width="18"/>
        <g transform="rotate(-90 102 102)">
          <circle class="up-rw" cx="102" cy="102" r="${RING_R}" fill="none" stroke="url(#upwarm)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${RING_C.toFixed(2)}" style="stroke-dashoffset:${(RING_C * (1 - CFG.sA / 100)).toFixed(2)};opacity:0"/>
          <circle class="up-rg" cx="102" cy="102" r="${RING_R}" fill="none" stroke="url(#upgood)" stroke-width="18" stroke-linecap="round" stroke-dasharray="${RING_C.toFixed(2)}" style="stroke-dashoffset:${(RING_C * (1 - CFG.sA / 100)).toFixed(2)}"/>
        </g>
      </svg>
      <div class="up-snum">${CFG.sA}</div>
    </div>
    <div class="up-lbl">${copy.score}</div>
    <div class="up-delta">+${CFG.sA - CFG.sB}</div>
    <div class="up-burst">${petals(8)}</div>
  </div></div>

  <div class="up-w up-bw"><div class="card up-bug">
    <div class="up-badge">
      <i class="rp"></i>
      <i class="w">${ico('bug', { size: 34, stroke: 2.2 })}</i>
      <i class="g">${ico('check', { size: 36, stroke: 3.4 })}</i>
      <span class="up-pop">${petals(6)}</span>
    </div>
    <div class="up-blbl"><span class="x">${copy.bug}</span><span class="o">${copy.fixed}</span></div>
  </div></div>

  <div class="up-w up-dw"><div class="win up-diff">
    <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="t">${copy.file}</span>
      <span class="up-stat"><span class="p">+2</span><span class="m">−2</span></span></div>
    <div class="up-code">
      ${row('ctx', 12, '', code.ctx1)}
      <div class="up-slot">${row('del', 13, '−', code.del[0], 1)}${row('add', 13, '+', code.add[0], 1)}</div>
      <div class="up-slot">${row('del', 14, '−', code.del[1], 1)}${row('add', 14, '+', code.add[1], 1)}</div>
      ${row('ctx', 15, '', code.ctx2)}
    </div>
  </div></div>
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const s = ctx.rtl ? -1 : 1;
    const C = JSON.parse(document.querySelector('.up').dataset.cfg);
    const amb = { duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true };
    const clamp = (v) => Math.min(1, Math.max(0, v));

    // ---- One value drives the whole gauge: lit bars, needle angle and the load-time readout ----
    const bars = gsap.utils.toArray('.up-lit line, .up-glow line');
    const fs = bars.map((b) => +b.dataset.f);
    const needle = document.querySelector('.up-needle');
    const ghosts = gsap.utils.toArray('.up-ghost');
    const sec = document.querySelector('.up-sec');
    const num = document.querySelector('.up-num b');
    const g = { p: C.pA };
    const ang = (p) => -C.sweep / 2 + p * C.sweep;
    const rot = (p) => `rotate(${ang(p).toFixed(2)} ${C.cx} ${C.cy})`;
    const at = (a) => {
      const r = (a * Math.PI) / 180;
      return `${(C.cx + C.rs * Math.sin(r)).toFixed(1)} ${(C.cy - C.rs * Math.cos(r)).toFixed(1)}`;
    };
    const drawGauge = () => {
      const p = g.p;
      bars.forEach((b, i) => { b.style.opacity = clamp((p - fs[i] + C.fade) / C.fade); });
      needle.setAttribute('transform', rot(p));
      ghosts.forEach((gh, i) => gh.setAttribute('transform', rot(p - 0.035 * (i + 1))));
      sec.setAttribute('d', `M ${C.cx} ${C.cy} L ${at(ang(0))} A ${C.rs} ${C.rs} 0 ${p > 0.75 ? 1 : 0} 1 ${at(ang(Math.max(p, 0.001)))} Z`);
      num.textContent = (C.tB + ((p - C.pB) / (C.pA - C.pB)) * (C.tA - C.tB)).toFixed(1);
    };
    // ...and one value drives the score ring.
    const ringW = document.querySelector('.up-rw');
    const ringG = document.querySelector('.up-rg');
    const snum = document.querySelector('.up-snum');
    const sc = { v: C.sA };
    const drawScore = () => {
      const v = sc.v;
      const off = (C.rc * (1 - v / 100)).toFixed(2);
      const k = clamp((v - 60) / 22);
      ringW.style.strokeDashoffset = off; ringG.style.strokeDashoffset = off;
      ringW.style.opacity = 1 - k; ringG.style.opacity = k;
      snum.textContent = Math.round(v);
    };
    drawGauge(); drawScore();
    const gauge = (from, to, dur, ease, at, extra = {}) => tl.fromTo(g, { p: from }, { p: to, duration: dur, ease, onUpdate: drawGauge, ...extra }, at);
    const score = (from, to, dur, ease, at) => tl.fromTo(sc, { v: from }, { v: to, duration: dur, ease, onUpdate: drawScore }, at);

    // Natural colours of the switch labels (frame 0: "After" active).
    const offC = getComputedStyle(document.querySelector('.up-o.b')).color;
    const onC = getComputedStyle(document.querySelector('.up-o.a')).color;
    const inkC = getComputedStyle(document.querySelector('.up-num b')).color;
    const fastC = getComputedStyle(document.querySelector('.up-zone.f')).color;

    // ---- Ambient loops (whole cycles, so the last frame matches the first) ----
    gsap.set('.up-gauge', { transformPerspective: 1600, rotationY: 7 * s, rotationX: 4 });
    gsap.set('.up-score', { transformPerspective: 1200, rotationY: -12 * s, rotationX: 3 });
    gsap.set('.up-bug', { transformPerspective: 1200, rotationY: -10 * s });
    gsap.set('.up-diff', { transformPerspective: 1600, rotationY: -6 * s, rotationX: 6 });
    tl.to('.up-gw', { y: -10, ...amb }, 0);
    tl.to('.up-gauge', { rotationY: 3 * s, rotationX: 2, ...amb }, 0);
    tl.to('.up-sw', { y: 12, x: -4 * s, ...amb }, 0);
    tl.to('.up-score', { rotationY: -7 * s, ...amb }, 0);
    tl.to('.up-bw', { y: -9, ...amb }, 0);
    tl.to('.up-dw', { y: -7, ...amb }, 0);
    tl.to('.up-halo', { scale: 1.08, ...amb }, 0);
    gsap.utils.toArray('.up-net i').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -12) * s, y: i % 3 ? -14 : 16, scale: 1 + (i % 3) * 0.07, ...amb }, 0);
    });
    tl.to('.up > .spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.up > .spark', { y: (i) => (i % 2 ? 12 : -12), ...amb }, 0);

    // ---- 0.95s: snap back to "before" ----
    const R = 0.95;
    tl.to('.up-th', { x: -C.seg * s, duration: 0.55, ease: 'power3.inOut' }, R);
    tl.to('.up-th.a', { opacity: 0, duration: 0.4 }, R + 0.05);
    tl.to('.up-th.b', { opacity: 1, duration: 0.4 }, R + 0.05);
    tl.to('.up-o.a', { color: offC, duration: 0.4 }, R + 0.05);
    tl.to('.up-o.b', { color: inkC, duration: 0.3 }, R + 0.3);
    gauge(C.pA, C.pB, 1.0, 'power3.inOut', R + 0.05);
    score(C.sA, C.sB, 1.0, 'power3.inOut', R + 0.1);
    tl.to('.up-halo.c', { opacity: 0, duration: 0.9 }, R + 0.1);
    tl.to('.up-halo.w', { opacity: 1, duration: 0.9 }, R + 0.1);
    tl.to('.up-zone.f', { color: offC, duration: 0.5 }, R + 0.2);
    tl.to('.up-zone.s', { color: '#EC6C1C', duration: 0.5 }, R + 0.5);
    tl.to('.up-delta', { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' }, R);
    // the load time turns ember while it climbs back to 9.2
    tl.to('.up-num b', { color: '#EC6C1C', duration: 0.6 }, R + 0.35);
    // diff: rewinding rolls the lines downwards: the new lines drop out, the old ones drop in
    tl.to('.up-row.add', { yPercent: 100, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'power3.inOut' }, R + 0.05);
    tl.fromTo('.up-row.del', { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.inOut' }, R + 0.05);
    tl.to('.up-stat', { opacity: 0, duration: 0.3 }, R);
    // the bug is back
    tl.to('.up-badge .g', { opacity: 0, scale: 0.5, duration: 0.35, ease: 'power2.in' }, R + 0.05);
    tl.fromTo('.up-badge .w', { opacity: 0, scale: 0.5, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.2)' }, R + 0.35);
    tl.to('.up-blbl .o', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, R + 0.05);
    tl.fromTo('.up-blbl .x', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, R + 0.35);

    // ---- 1.95s: the "before" app struggles: the needle labours, the bug crawls ----
    gauge(C.pB, C.pB + 0.022, 0.32, 'sine.inOut', 1.95, { yoyo: true, repeat: 5 });
    tl.fromTo('.up-badge .w svg', { rotation: 0 }, { rotation: 16, duration: 0.16, yoyo: true, repeat: 9, ease: 'sine.inOut' }, 2.0);
    tl.fromTo('.up-badge .w', { y: 0 }, { y: -4, duration: 0.16, yoyo: true, repeat: 9, ease: 'sine.inOut' }, 2.0);

    // ---- 2.8s: flip the switch to "After" ----
    const U = 2.8;
    tl.fromTo('.up-tg', { scale: 1 }, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, U - 0.1);
    tl.fromTo('.up-th', { x: -C.seg * s }, { x: 0, duration: 0.6, ease: 'power3.inOut' }, U);
    tl.fromTo('.up-th.a', { opacity: 0 }, { opacity: 1, duration: 0.45 }, U + 0.08);
    tl.fromTo('.up-th.b', { opacity: 1 }, { opacity: 0, duration: 0.45 }, U + 0.08);
    tl.fromTo('.up-o.a', { color: offC }, { color: onC, duration: 0.3 }, U + 0.32);
    tl.fromTo('.up-o.b', { color: inkC }, { color: offC, duration: 0.45 }, U + 0.1);
    tl.fromTo('.up-th.rp', { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.35, duration: 0.6, ease: 'power2.out' }, U + 0.5);

    // ---- 3.0s: the diff applies: a strike draws through the old lines, they flash and roll up
    // out of their slots while the new lines roll up into place (clipped, so they never overlap) ----
    tl.fromTo('.up-row.del code', { '--st': 0 }, { '--st': 1, duration: 0.32, stagger: 0.1, ease: 'power2.inOut' }, 2.98);
    tl.fromTo('.up-row.del .fl', { opacity: 0 }, { opacity: 1, duration: 0.16, yoyo: true, repeat: 1, stagger: 0.1, ease: 'sine.inOut' }, 3.14);
    tl.to('.up-row.del', { yPercent: -100, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power3.inOut' }, 3.42);
    tl.fromTo('.up-row.add', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'power3.inOut' }, 3.42);
    tl.fromTo('.up-row.add .fl', { opacity: 0 }, { opacity: 1, duration: 0.22, yoyo: true, repeat: 1, stagger: 0.09, ease: 'sine.inOut' }, 3.82);
    // the hidden old lines go back to their resting (frame 0) state
    tl.set('.up-row.del', { yPercent: 0 }, 4.3);
    tl.set('.up-row.del code', { '--st': 0 }, 4.3);
    tl.fromTo('.up-stat', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 3.8);
    tl.fromTo('.up-stat span', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2)' }, 3.8);

    // ---- 3.8s: the bug is fixed (bug → check, with a pop) ----
    const F = 3.8;
    tl.to('.up-badge .w', { opacity: 0, scale: 0.2, rotation: 90, duration: 0.3, ease: 'power2.in' }, F);
    tl.fromTo('.up-badge .g', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.6)' }, F + 0.22);
    tl.fromTo('.up-badge .g path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, F + 0.36);
    tl.fromTo('.up-badge .rp', { opacity: 0.9, scale: 0.9 }, { opacity: 0, scale: 1.9, duration: 0.7, ease: 'power2.out' }, F + 0.3);
    gsap.utils.toArray('.up-pop .spark').forEach((p, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      tl.fromTo(p, { x: Math.cos(a) * 30, y: Math.sin(a) * 30, rotation: (a * 180) / Math.PI + 90, scale: 0.4 },
        { x: Math.cos(a) * 70, y: Math.sin(a) * 70, scale: 0.75, duration: 0.7, ease: 'power3.out' }, F + 0.3);
      tl.fromTo(p, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, F + 0.65);
    });
    tl.to('.up-blbl .x', { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' }, F + 0.1);
    tl.fromTo('.up-blbl .o', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, F + 0.3);

    // ---- 4.0s: speed: the needle sweeps into the fast zone, load time drops, score climbs ----
    const S = 4.0;
    gauge(C.pB, C.pA, 1.6, 'power3.inOut', S);
    // Motion-blur ghosts trail the needle, strongest at the sweep's top speed.
    tl.fromTo('.up-ghost', { opacity: 0 }, { opacity: (i) => [0.42, 0.2][i], duration: 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' }, S);
    tl.fromTo('.up-halo.w', { opacity: 1 }, { opacity: 0, duration: 1.2 }, S + 0.2);
    tl.fromTo('.up-halo.c', { opacity: 0 }, { opacity: 1, duration: 1.2 }, S + 0.2);
    tl.fromTo('.up-zone.s', { color: '#EC6C1C' }, { color: offC, duration: 0.6 }, S + 0.3);
    tl.fromTo('.up-zone.f', { color: offC }, { color: fastC, duration: 0.6 }, S + 1.0);
    tl.fromTo('.up-num b', { color: '#EC6C1C' }, { color: inkC, duration: 0.7 }, S + 0.55);
    score(C.sB, C.sA, 1.5, 'power3.inOut', S + 0.1);

    // ---- 5.55s: arrival: the lit arc ripples, the readout pulses, +57 pops, sparks burst ----
    const A = 5.55;
    tl.fromTo('.up-lit line', { attr: { 'stroke-width': 12 } }, { attr: { 'stroke-width': 17 }, duration: 0.2, yoyo: true, repeat: 1, stagger: 0.018, ease: 'sine.inOut' }, A - 0.15);
    tl.fromTo('.up-num b', { scale: 1 }, { scale: 1.08, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.inOut' }, A - 0.1);
    tl.fromTo('.up-delta', { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(2.4)' }, A + 0.05);
    tl.fromTo('.up-snum', { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }, A);
    // A speed "ping": an arc echo of the dial expands past the bars and fades.
    gsap.set('.up-wave', { svgOrigin: `${C.cx} ${C.cy}` });
    tl.fromTo('.up-wave', { scale: 0.62, opacity: 0.85 }, { scale: 1.12, opacity: 0, duration: 0.85, ease: 'power2.out' }, A - 0.12);
    // Petals fan out over the top of the ring only, so none crosses the "Score" label below it.
    gsap.utils.toArray('.up-burst .spark').forEach((p, i) => {
      const a = ((-200 + i * (220 / 7)) * Math.PI) / 180;
      tl.fromTo(p, { x: Math.cos(a) * 98, y: Math.sin(a) * 98, rotation: (a * 180) / Math.PI + 90, scale: 0.5 },
        { x: Math.cos(a) * 138, y: Math.sin(a) * 138, scale: 0.85, duration: 0.8, ease: 'power3.out' }, A + 0.02);
      tl.fromTo(p, { opacity: 1 }, { opacity: 0, duration: 0.35, ease: 'power1.in' }, A + 0.45);
    });
  },
};
