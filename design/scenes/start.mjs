// Start here: the four-step journey. An orange spark travels a curved path from Talk to
// Launch, lighting each step as it arrives; a chat bubble opens the story, a badge closes it.
import { ico } from '../motion/ui.mjs';

const W = 904;
// Node centres (LTR). Arabic mirrors them horizontally so the journey reads right to left.
const NODES = [[132, 500], [342, 300], [562, 500], [772, 300]];
const ICONS = ['message-circle', 'clipboard-list', 'code-xml', 'flag'];

const pts = (rtl) => NODES.map(([x, y]) => [rtl ? W - x : x, y]);
// Smooth path through the nodes (horizontal tangents at each node).
function pathD(rtl) {
  const p = pts(rtl);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1]; const [x1, y1] = p[i];
    const k = (x1 - x0) * 0.5;
    d += ` C ${x0 + k} ${y0}, ${x1 - k} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export default {
  duration: 8,

  copy: {
    en: {
      steps: ['Talk', 'Plan', 'Build', 'Launch'],
      notes: ['Your idea, in a DM', 'Scope, quote, timeline', 'Builds every week', 'Live and supported'],
      hello: 'Hi! I have an idea for an app',
      live: 'Launched',
    },
    ar: {
      steps: ['نتحدّث', 'نخطّط', 'نبني', 'نُطلق'],
      notes: ['فكرتك في رسالة', 'النطاق والسعر والمدة', 'نسخة جديدة كل أسبوع', 'متاح، مع دعم مستمر'],
      hello: 'مرحباً! لديّ فكرة لتطبيق',
      live: 'تم الإطلاق',
    },
  },

  css: (ctx) => `
.track{position:absolute;inset:0;overflow:visible}
.node{position:absolute;width:128px;height:128px;margin:-64px 0 0 -64px}
.node .off,.node .on{position:absolute;inset:0;border-radius:50%;display:grid;place-items:center}
.node .off{background:var(--card);border:3px solid var(--card-line);color:var(--ui-sub);box-shadow:var(--shadow)}
.node .on{background:var(--brand);color:#fff;box-shadow:0 22px 44px rgba(55,107,177,.35)}
.node .ring{position:absolute;inset:-14px;border-radius:50%;border:3px solid var(--sky);opacity:0}
.node .num{position:absolute;top:-6px;inset-inline-end:-6px;width:44px;height:44px;border-radius:50%;background:var(--sparkg);color:${'#0E1A2B'};display:grid;place-items:center;font:700 20px 'JetBrains Mono',monospace;box-shadow:0 8px 18px rgba(236,108,28,.35)}
.label{position:absolute;width:250px;margin-left:-125px;text-align:center}
.label b{display:block;font-size:${ctx.rtl ? 32 : 34}px;font-weight:800;letter-spacing:${ctx.rtl ? 0 : '-.02em'};color:var(--ui-text)}
.label span{display:block;margin-top:4px;font-size:${ctx.rtl ? 22 : 22}px;font-weight:500;color:var(--ui-sub)}
.traveler{position:absolute;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:var(--sparkg);box-shadow:0 0 0 8px rgba(242,141,25,.18),0 0 30px rgba(242,141,25,.7);opacity:0}
.hello{position:absolute;top:10px;inset-inline-start:10px;max-width:none;white-space:nowrap}
.live{position:absolute;top:18px;inset-inline-end:10px;font-size:${ctx.rtl ? 26 : 26}px;padding:16px 26px}
.live .ib{width:34px;height:34px;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center}
.confetti{position:absolute;top:44px;inset-inline-end:110px;width:0;height:0}
.confetti .spark{opacity:0}
`,

  html: ({ copy, rtl }) => {
    const p = pts(rtl);
    const labelPos = (i) => (i % 2 === 0 ? p[i][1] + 80 : p[i][1] - 176);
    return `
<svg class="track" viewBox="0 0 ${W} 740">
  <defs><linearGradient id="trk" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#376BB1"/><stop offset="1" stop-color="#5AB4D9"/></linearGradient></defs>
  <path d="${pathD(rtl)}" fill="none" stroke="var(--card-line)" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 20"/>
  <path id="trail" d="${pathD(rtl)}" fill="none" stroke="url(#trk)" stroke-width="10" stroke-linecap="round"/>
</svg>
${p.map(([x, y], i) => `<div class="node n${i}" style="left:${x}px;top:${y}px"><div class="off">${ico(ICONS[i], { size: 50, stroke: 2 })}</div><div class="on">${ico(ICONS[i], { size: 50, stroke: 2 })}</div><div class="ring"></div><div class="num">${i + 1}</div></div>`).join('')}
${p.map(([x], i) => `<div class="label l${i}" style="left:${x}px;top:${labelPos(i)}px"><b>${copy.steps[i]}</b><span>${copy.notes[i]}</span></div>`).join('')}
<div class="bubble me hello">${copy.hello}</div>
<div class="confetti">${[0, 1, 2, 3, 4, 5].map(() => '<i class="spark"></i>').join('')}</div>
<div class="chip live"><span class="ib">${ico('check', { size: 20, stroke: 3 })}</span>${copy.live}</div>
<div class="traveler"></div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    // Ambient: everything floats a touch; the live badge breathes (whole cycles).
    tl.to('.node', { y: -6, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true, stagger: { each: 0.0 } }, 0);
    tl.to('.live', { y: 6, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);

    // Reset the journey: trail undraws, steps switch off, the bubble and badge leave.
    tl.to('#trail', { drawSVG: '0%', duration: 0.5, ease: 'power2.inOut' }, 0.9);
    tl.to('.node .on', { opacity: 0, scale: 0.8, duration: 0.4, stagger: { each: 0.05, from: 'end' } }, 0.9);
    tl.to('.label', { opacity: 0.45, duration: 0.4 }, 0.9);
    tl.to(['.hello', '.live'], { opacity: 0, y: -12, scale: 0.94, duration: 0.35, ease: 'power2.in' }, 0.9);

    // The idea arrives as a chat bubble...
    tl.fromTo('.hello', { opacity: 0, y: 20, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 1.45);

    // ...and a spark travels the path, lighting each step as it reaches it.
    const T0 = 1.85; const TRAVEL = 3.9;
    tl.fromTo('.traveler', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25 }, T0 - 0.1);
    tl.to('.traveler', { motionPath: { path: '#trail', align: '#trail', alignOrigin: [0.5, 0.5] }, duration: TRAVEL, ease: 'none' }, T0);
    tl.fromTo('#trail', { drawSVG: '0%' }, { drawSVG: '100%', duration: TRAVEL, ease: 'none' }, T0);
    tl.to('.traveler', { opacity: 0, scale: 2, duration: 0.3 }, T0 + TRAVEL);

    // Arrival times follow each node's position along the path length.
    const path = document.querySelector('#trail');
    const total = path.getTotalLength();
    const nodes = gsap.utils.toArray('.node');
    const at = nodes.map((n) => {
      const nx = parseFloat(n.style.left); const ny = parseFloat(n.style.top);
      let best = 0; let bestD = Infinity;
      for (let l = 0; l <= total; l += 4) { const q = path.getPointAtLength(l); const d = Math.hypot(q.x - nx, q.y - ny); if (d < bestD) { bestD = d; best = l; } }
      return T0 + (best / total) * TRAVEL;
    });
    nodes.forEach((n, i) => {
      tl.fromTo(n.querySelector('.on'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at[i] - 0.05);
      tl.fromTo(n.querySelector('.ring'), { opacity: 0.9, scale: 0.85 }, { opacity: 0, scale: 1.35, duration: 0.7, ease: 'power2.out' }, at[i]);
      tl.fromTo(`.l${i}`, { opacity: 0.45, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, at[i]);
    });

    // Launch: the badge pops and sparks burst.
    tl.fromTo('.live', { opacity: 0, y: 18, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' }, at[3] + 0.15);
    gsap.utils.toArray('.confetti .spark').forEach((s, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.4;
      tl.fromTo(s, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 0.6 },
        { x: Math.cos(a) * 110, y: Math.sin(a) * 80, rotation: (i % 2 ? 1 : -1) * 220, opacity: 0, scale: 1, duration: 1.0, ease: 'power3.out' }, at[3] + 0.2);
    });
  },
};
