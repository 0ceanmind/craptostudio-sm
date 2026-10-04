// Intro / brand: the logo comes alive. The symbol melts into gooey droplets that scatter and
// re-merge, the orange petals spin back into place, and the eight services orbit the mark.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ico, gooFilter } from '../motion/ui.mjs';
import { services } from '../content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const partsDir = path.join(root, 'exports/logo/parts');
const parts = JSON.parse(fs.readFileSync(path.join(partsDir, 'parts.json'), 'utf8'));
const png = (f) => `data:image/png;base64,${fs.readFileSync(path.join(partsDir, f)).toString('base64')}`;

const MARK_W = 600;
const S = MARK_W / parts.width;
const MARK_H = Math.round(parts.height * S);
const MARK_X = (904 - MARK_W) / 2;
const MARK_Y = 150;

// Droplets sampled inside the symbol (prepare-logo.mjs); under the gooey filter they melt
// into a liquid copy of the mark.
const DROPS = parts.droplets;

export default {
  duration: 8,

  copy: { en: {}, ar: {} },

  css: () => `
.halo{position:absolute;left:${452 - 330}px;top:${MARK_Y + MARK_H / 2 - 330}px;width:660px;height:660px;border-radius:50%;background:radial-gradient(circle,rgba(90,180,217,.55) 0%,rgba(90,180,217,.18) 40%,transparent 70%)}
.mark{position:absolute;left:${MARK_X}px;top:${MARK_Y}px;width:${MARK_W}px;height:${MARK_H}px;z-index:5}
.mark .body{position:absolute;inset:0;width:100%;height:100%}
.mark .petal{position:absolute}
.blobs{position:absolute;left:${MARK_X}px;top:${MARK_Y}px;width:${MARK_W}px;height:${MARK_H}px;opacity:0;z-index:5}
.blobs i{position:absolute;border-radius:50%;background:#fff}
.orbit{position:absolute;inset:0}
.orb{position:absolute;left:0;top:0;display:flex;align-items:center;gap:12px;padding:14px 24px 14px 16px;border-radius:999px;background:rgba(11,22,40,.74);border:2px solid rgba(255,255,255,.2);color:#fff;font-size:27px;font-weight:700;white-space:nowrap;box-shadow:0 20px 40px rgba(3,8,18,.35)}
.orb .ib{width:48px;height:48px;border-radius:50%;background:var(--brand);display:grid;place-items:center}
`,

  html: ({ lang }) => `${gooFilter}
<div class="halo"></div>
<div class="orbit">${services.map((s) => `<div class="orb"><span class="ib">${ico(s.icon, { size: 24 })}</span>${s.title[lang]}</div>`).join('')}</div>
<div class="blobs goo">${DROPS.map(([x, y, r]) => `<i style="left:${(x - r) * S}px;top:${(y - r) * S}px;width:${2 * r * S}px;height:${2 * r * S}px"></i>`).join('')}</div>
<div class="mark"><img class="body" src="${png('body-white.png')}">${parts.petals.map((p) => `<img class="petal" src="${png(p.file)}" style="left:${p.x * S}px;top:${p.y * S}px;width:${p.w * S}px;height:${p.h * S}px">`).join('')}</div>`,

  animate(tl, gsap, ctx) {
    const D = 8;
    const cx = 452; const cy = 150 + 222;
    // Orbit: the eight services circle the mark on a tilted ellipse, one full turn per loop.
    const orbs = gsap.utils.toArray('.orb');
    const dir = ctx.rtl ? -1 : 1;
    // Radius from the widest chip, so long (Arabic) labels never leave the frame.
    const maxW = Math.max(...orbs.map((el) => el.offsetWidth));
    const rx = Math.min(380, 452 - maxW * 0.56 - 6);
    const place = (a0) => {
      orbs.forEach((el, i) => {
        // Half-slot offset + normalised angle: no chip sits exactly on the front/back switch.
        const a = (((a0 + ((i + 0.5) / orbs.length) * Math.PI * 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
        const w = el.offsetWidth; const h = el.offsetHeight;
        gsap.set(el, {
          x: cx + Math.cos(a) * rx - w / 2,
          y: cy + Math.sin(a) * 250 - h / 2 + 20,
          scale: 0.7 + depth * 0.38,
          opacity: 0.45 + depth * 0.55,
          zIndex: depth > 0.5 ? 8 : 2,
        });
      });
    };
    const spin = { a: 0 };
    place(0);
    tl.to(spin, { a: dir * Math.PI * 2, duration: D, ease: 'none', onUpdate: () => place(spin.a) }, 0);

    // Gentle float and a breathing halo (whole cycles).
    tl.to(['.mark', '.blobs'], { y: -10, duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
    tl.to('.halo', { scale: 1.08, opacity: 0.85, duration: D / 4, ease: 'sine.inOut', repeat: 3, yoyo: true }, 0);

    // 1. Petals spin away.
    const petals = gsap.utils.toArray('.petal');
    const out = petals.map((p) => {
      const r = p.getBoundingClientRect(); const m = document.querySelector('.mark').getBoundingClientRect();
      const dx = r.left + r.width / 2 - (m.left + m.width / 2); const dy = r.top + r.height / 2 - (m.top + m.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      return { x: (dx / len) * 150, y: (dy / len) * 150 };
    });
    petals.forEach((p, i) => {
      tl.to(p, { x: out[i].x, y: out[i].y, rotation: i % 2 ? 140 : -140, opacity: 0, scale: 0.6, duration: 0.55, ease: 'power2.in' }, 0.9 + i * 0.05);
    });
    // 2. The body melts into droplets (crossfade to the gooey blobs)...
    tl.to('.mark .body', { opacity: 0, scale: 0.94, duration: 0.45, ease: 'power2.in', transformOrigin: '50% 50%' }, 1.05);
    tl.fromTo('.blobs', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 1.05);
    // ...which scatter...
    const drops = gsap.utils.toArray('.blobs i');
    const box = document.querySelector('.blobs');
    const bw = box.offsetWidth; const bh = box.offsetHeight;
    // Burst outward from the centre (further for outer droplets), with a little deterministic wobble.
    const scatter = drops.map((d, i) => {
      const dx = d.offsetLeft + d.offsetWidth / 2 - bw / 2; const dy = d.offsetTop + d.offsetHeight / 2 - bh / 2;
      const wob = Math.sin(i * 12.9898) * 18;
      return [dx * 0.42 + wob, dy * 0.42 - wob * 0.6];
    });
    tl.fromTo('.blobs', { rotation: 0 }, { rotation: ctx.rtl ? -22 : 22, duration: 1.3, ease: 'power2.out' }, 1.45);
    tl.to('.blobs', { rotation: 0, duration: 1.1, ease: 'power3.inOut' }, 2.85);
    drops.forEach((d, i) => {
      tl.fromTo(d, { x: 0, y: 0, scale: 1 }, { x: scatter[i][0], y: scatter[i][1], scale: 0.62 + (i % 3) * 0.1, duration: 1.25, ease: 'power3.out' }, 1.45 + (i % 6) * 0.025);
      // ...and flow back together.
      tl.to(d, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power3.inOut' }, 2.85 + (i % 6) * 0.02);
    });
    // 3. The logo condenses out of the droplets.
    tl.fromTo('.mark .body', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 4.0);
    tl.to('.blobs', { opacity: 0, duration: 0.45, ease: 'power1.in' }, 4.1);
    // 4. Petals spin back in, one by one.
    petals.forEach((p, i) => {
      tl.fromTo(p, { x: out[i].x * 1.4, y: out[i].y * 1.4, rotation: i % 2 ? -200 : 200, opacity: 0, scale: 0.4 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.7)' }, 4.45 + i * 0.12);
    });
    // 5. A soft flash as the mark completes.
    tl.fromTo('.halo', { scale: 1 }, { scale: 1.22, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 }, 5.0);
  },
};
