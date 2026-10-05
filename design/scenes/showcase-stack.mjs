// Project showcase: "Project + tech stack". A project card (logo or icon tile, name, tagline)
// stands at the centre while the project's tech stack orbits it as chips on a tilted ring: front
// chips pass over the card, back chips behind it, smaller. Feature cards fan out below and up to
// two stat pills count up above. Frame 0 is the finished picture.
// Loop: hold → features gather and vanish, chips are pulled into the card, stats go, the card
// resets → card pops, logo drops in, name rises → chips burst back out into orbit → features fan
// in → stats count up → hold. The orbit turns one full revolution per loop.
//
// Arabic mirrors the whole layout (logo on the right, ring turning the other way, features in
// reading order from the right); tech names and numbers stay LTR.
import { ico, asset } from '../motion/ui.mjs';
import { stack } from '../fonts.mjs';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeIco = (name, opts, fallback = 'sparkles') => {
  try { return ico(String(name || fallback), opts); } catch { return ico(fallback, opts); }
};

// A small icon for common tech names; anything else gets a generic one.
const TECH = [
  [/\b(unity|unreal|godot|game ?maker|phaser|pygame)\b/i, 'gamepad-2'],
  [/\b(react native|flutter|swiftui|swift|kotlin|android|ios|expo|jetpack)\b/i, 'smartphone'],
  [/\breact\b/i, 'atom'],
  [/\b(vue|nuxt|angular|svelte|next\.?js|astro|html|css|tailwind|bootstrap|web)\b/i, 'layout-template'],
  [/\b(firebase|supabase|appwrite|pocketbase)\b/i, 'database-zap'],
  [/\b(sql|postgres(ql)?|mysql|sqlite|mongo(db)?|redis|prisma|dynamo(db)?|database)\b/i, 'database'],
  [/\b(aws|gcp|google cloud|azure|cloud|vercel|netlify|heroku|cloudflare|render)\b/i, 'cloud'],
  [/\b(docker|kubernetes|k8s)\b/i, 'container'],
  [/\b(openai|gpt|claude|llm|ai|ml|tensorflow|pytorch|langchain|gemini|hugging ?face)\b/i, 'sparkles'],
  [/\b(figma|sketch|adobe|photoshop|illustrator|blender|design)\b/i, 'pen-tool'],
  [/\b(node(\.?js)?|express|nest(js)?|deno|bun|django|flask|fastapi|laravel|rails|spring|\.net|asp\.net|graphql|api)\b/i, 'server'],
  [/\b(git|github|gitlab)\b/i, 'git-branch'],
  [/\b(stripe|paypal|payments?)\b/i, 'credit-card'],
  [/\b(arduino|raspberry|esp32|iot)\b/i, 'cpu'],
  [/\b(discord|telegram|slack|whatsapp|twilio)\b/i, 'message-circle'],
  [/(c#|c\+\+|\bpython\b|\bjava(script)?\b|\btypescript\b|\bts\b|\bjs\b|\bgo(lang)?\b|\brust\b|\bphp\b|\bruby\b|\bdart\b|\blua\b|\bgdscript\b)/i, 'code-xml'],
];
const techIcon = (name) => TECH.find(([re]) => re.test(name))?.[1] ?? 'layers';

// Chip geometry: JetBrains Mono has a fixed 0.6em advance, so widths are known before layout.
const CHIP_FS = 20;
const CHIP_MAX = 14; // characters
const chipW = (label) => 78 + Math.min(CHIP_MAX, [...label].length) * CHIP_FS * 0.6;

// Splits a stat value like "4.8★", "50K+" or "1,200" into static text and rolling digits.
function odometer(value, H) {
  return [...String(value ?? '')].map((ch) => {
    if (!/[0-9]/.test(ch)) return `<span class="sx">${esc(ch)}</span>`;
    const d = +ch;
    const strip = Array.from({ length: 20 }, (_, k) => k % 10).join('\n');
    return `<span class="od"><span class="odh">${d}</span><span class="ods" data-d="${d}" style="transform:translateY(-${(10 + d) * H}px)">${strip}</span></span>`;
  }).join('');
}

const petal = () => '<svg viewBox="0 0 40 54"><path d="M20 2C29 10 37 23 37 35C37 46 29 52 20 52C11 52 3 46 3 35C3 23 11 10 20 2Z" fill="url(#sspet)"/><path d="M13 22C15 16 18 11 21 8C20 15 18 21 15 27Z" fill="#fff" opacity=".55"/></svg>';

const STAT_H = 44; // odometer digit height

function layout({ copy, data, rtl }) {
  const techs = (Array.isArray(data.stack) ? data.stack : String(data.stack ?? '').split(','))
    .map((t) => (typeof t === 'object' && t ? t : { name: String(t ?? '').trim() }))
    .filter((t) => t.name).slice(0, 8);
  const maxW = Math.max(150, ...techs.map((t) => chipW(t.name)));
  // Ring radius from the widest chip (it must stay in the box), card width from the ring (a chip
  // switches between behind and in front of the card at the ring's sides, clear of the card).
  const rx = Math.round(Math.min(392, 444 - 0.445 * maxW));
  const ry = 138; // the back of the ring clears the card's top edge; its front passes below it
  const cardW = Math.round(Math.max(400, Math.min(530, 2 * (rx - 0.445 * maxW - 12))));
  const cardH = 200;
  const features = (copy.features ?? []).filter((f) => f && (f.text ?? '').trim()).slice(0, 4);
  const stats = (copy.stats ?? []).filter((s) => s && String(s.value ?? '').trim()).slice(0, 2);
  const cy = stats.length ? 290 : 262;
  const fy = cy + 206;
  return { techs, maxW, rx, ry, cardW, cardH, features, stats, cy, oy: cy + 14, fy };
}

export default {
  meta: {
    title: 'Project + tech stack',
    description: 'A project card (logo, name, tagline) with its tech stack orbiting it on a tilted ring; feature cards fan in below and stat pills count up above.',
    bestFor: 'Any project: games, apps, websites, tools, AI, hardware',
    fields: {
      copy: {
        name: 'Project name, up to 18 characters',
        tagline: 'One line about it, up to 56 characters (2 lines)',
        features: '2–4 items { icon, text }: icon is a Lucide name, text up to 28 characters',
        stats: '0–2 items { value, label }: value like "4.8★", "50K+", "99.9%" (digits count up), label up to 22 characters',
      },
      data: {
        logo: { type: 'image', description: 'Project logo or app icon (square works best). Empty: the icon tile is used' },
        icon: { type: 'icon', description: 'Icon on the brand tile when there is no logo' },
        stack: { type: 'list', max: 8, description: '3–8 technologies, up to 14 characters each, e.g. Unity, C#, Firebase' },
      },
    },
  },
  duration: 8,

  copy: {
    en: {
      name: 'Skyline Run',
      tagline: 'An endless runner over a city that rebuilds itself',
      features: [
        { icon: 'gamepad-2', text: 'Smooth 60 fps on any phone' },
        { icon: 'users', text: 'Live leaderboards' },
        { icon: 'cloud', text: 'Cloud saves across devices' },
      ],
      stats: [
        { value: '4.8★', label: 'Average rating' },
        { value: '50K+', label: 'Players' },
      ],
    },
    ar: {
      name: 'Skyline Run',
      tagline: 'لعبة جري لا تنتهي فوق مدينة تعيد بناء نفسها',
      features: [
        { icon: 'gamepad-2', text: '60 إطاراً سلساً على أي هاتف' },
        { icon: 'users', text: 'لوحات صدارة مباشرة' },
        { icon: 'cloud', text: 'حفظ سحابي بين الأجهزة' },
      ],
      stats: [
        { value: '4.8★', label: 'متوسط التقييم' },
        { value: '50K+', label: 'لاعب' },
      ],
    },
  },

  data: { icon: 'boxes', logo: '', stack: ['Unity', 'C#', 'Firebase', 'Figma'] },

  css: (ctx) => {
    const r = ctx.rtl;
    const ui = r ? stack.arabic : stack.display;
    const light = ctx.theme === 'light';
    return `
.ss{position:absolute;inset:0}
.ss-halo{position:absolute;left:92px;width:720px;height:560px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(90,180,217,${light ? '.55' : '.42'}),rgba(90,180,217,.14) 55%,rgba(90,180,217,0))}
.ss-net{position:absolute;inset:0;filter:url(#ssgoo)}
.ss-net i{position:absolute;border-radius:50%;background:var(--brand)}
.ss-pet{position:absolute;width:30px;height:42px;filter:drop-shadow(0 0 10px rgba(242,141,25,.5))}
.ss-pet svg,.ss-bp svg{width:100%;height:100%;display:block}
.ss-ring{position:absolute;left:0;top:0;overflow:visible;z-index:1}
.ss-ring .r1{fill:none;stroke:url(#ssring);stroke-width:3.5;stroke-dasharray:3 13;stroke-linecap:round}
.ss-ring .r0{fill:none;stroke:url(#ssring);stroke-width:2;opacity:${light ? '.35' : '.3'}}
.ss-ring .r2{fill:none;stroke:${light ? 'rgba(55,107,177,.18)' : 'rgba(90,180,217,.2)'};stroke-width:2}

/* project card */
.ss-card-w{position:absolute;left:50%;z-index:5}
.ss-card-p{position:relative}
.ss-card{position:relative;display:flex;align-items:center;gap:24px;padding:0 30px;border-radius:38px;overflow:hidden;
  background:linear-gradient(160deg,rgba(255,255,255,${light ? '0' : '.06'}),rgba(255,255,255,0) 45%),var(--card);
  transform:perspective(1400px) rotateX(6deg);box-shadow:0 40px 80px rgba(3,8,18,${light ? '.20' : '.5'}),0 0 0 1px rgba(255,255,255,.04) inset}
.ss-card::before{content:'';position:absolute;inset:0 0 auto;height:6px;background:var(--brand)}
.ss-card .sh{position:absolute;top:-40px;bottom:-40px;left:0;width:140px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(207,240,255,${light ? '.5' : '.12'}),rgba(255,255,255,0));transform:translateX(-200px) skewX(-18deg)}
.ss-glow{position:absolute;inset:40px 10px -36px;border-radius:60px;background:var(--brand);filter:blur(60px);opacity:${light ? '.45' : '.6'}}
.ss-dot{position:absolute;left:0;top:0;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%}
.ss-dot.a{background:#F4B310;box-shadow:0 0 14px 3px rgba(244,179,16,.75)}
.ss-dot.b{background:#5AB4D9;box-shadow:0 0 14px 3px rgba(90,180,217,.8)}
.ss-logo{position:relative;width:116px;height:116px;flex:none}
.ss-logo-p{width:100%;height:100%}
.ss-logo .lt{width:100%;height:100%;border-radius:32px;display:grid;place-items:center;overflow:hidden}
.ss-logo .lt.ic{background:var(--brand);color:#fff;box-shadow:0 16px 32px rgba(55,107,177,.4),inset 0 2px 0 rgba(255,255,255,.35)}
.ss-logo .lt.im{background:#fff;box-shadow:0 16px 32px rgba(3,8,18,.22),0 0 0 2px var(--card-line)}
.ss-logo .lt img{width:100%;height:100%;object-fit:contain;padding:10px;display:block}
.ss-logo .bp0{position:absolute;left:50%;top:50%;width:0;height:0}
.ss-bp{position:absolute;left:-9px;top:-13px;width:18px;height:26px;opacity:0}
.ss-tx{min-width:0;flex:1}
.ss-name{font:800 var(--nfs) ${ui};line-height:${r ? 1.5 : 1.15};color:var(--ui-text);letter-spacing:${r ? 0 : '-.02em'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-bottom:${r ? 2 : 4}px}
.ss-tag{margin-top:${r ? 4 : 8}px;font:500 ${r ? 21 : 22}px/${r ? 1.6 : 1.38} ${ui};color:var(--ui-sub);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
.ss .w{display:inline-block}

/* orbiting tech chips */
.ss-orb{position:absolute;left:0;top:0}
.ss-chip{display:flex;align-items:center;gap:10px;height:58px;padding-inline:8px 18px;border-radius:999px;background:var(--card);border:2px solid var(--card-line);
  color:var(--ui-text);font:700 ${CHIP_FS}px ${stack.mono};white-space:nowrap;direction:ltr;box-shadow:0 18px 36px rgba(3,8,18,${light ? '.16' : '.38'})}
.ss-chip .ib{width:38px;height:38px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;flex:none}
.ss-chip .lb{max-width:${CHIP_MAX * CHIP_FS * 0.6}px;overflow:hidden;text-overflow:ellipsis}

/* feature cards */
.ss-ft-w{position:absolute;z-index:3}
.ss-ft{position:relative;height:100%;padding:20px 20px 18px;border-radius:26px;overflow:hidden}
.ss-ft::after{content:'';position:absolute;inset-inline-start:20px;bottom:0;width:46px;height:4px;border-radius:4px 4px 0 0;background:var(--sparkg)}
.ss-ft .fi{width:52px;height:52px;border-radius:17px;background:var(--brand);color:#fff;display:grid;place-items:center;
  box-shadow:0 10px 20px rgba(55,107,177,.32),inset 0 2px 0 rgba(255,255,255,.3)}
.ss-ft .ftx{margin-top:14px;font:700 ${r ? 21 : 22}px/${r ? 1.55 : 1.3} ${ui};color:var(--ui-text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}

/* stat pills */
.ss-st-w{position:absolute;top:18px;z-index:6}
.ss-st{display:flex;align-items:center;gap:16px;padding-block:12px;padding-inline:22px 24px;border-radius:26px;position:relative;overflow:hidden}
.ss-st::before{content:'';position:absolute;inset-inline-start:0;top:14px;bottom:14px;width:5px;border-radius:0 4px 4px 0;background:var(--sparkg)}
${r ? '.ss-st::before{border-radius:4px 0 0 4px}' : ''}
.ss-sv{display:flex;align-items:center;font:800 38px ${stack.display};line-height:${STAT_H}px;height:${STAT_H}px;color:var(--ui-text);direction:ltr;letter-spacing:-.01em}
.ss-sv .od{position:relative;display:inline-block;height:${STAT_H}px;overflow:hidden}
.ss-sv .odh{visibility:hidden}
.ss-sv .ods{position:absolute;left:0;right:0;top:0;text-align:center;white-space:pre;line-height:${STAT_H}px}
.ss-sv .sx{display:inline-block}
.ss-sl{max-width:190px;font:600 ${r ? 18 : 19}px/${r ? 1.5 : 1.3} ${ui};color:var(--ui-sub);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
.ss-st .dv{width:2px;align-self:stretch;margin-block:4px;background:var(--card-line);flex:none}
`;
  },

  html: (ctx) => {
    const { copy, data, rtl } = ctx;
    const g = layout(ctx);
    const x = (v) => (rtl ? 904 - v : v); // mirror an LTR x for Arabic
    const words = (s) => esc(s).split(/(\s+)/).map((w) => (/^\s+$/.test(w) || !w ? w : `<span class="w">${w}</span>`)).join('');
    // Logo: the post's image on a white tile, or the brand tile with an icon.
    let logo = '';
    if (data.logo) {
      try { logo = `<div class="lt im"><img src="${asset(data.logo)}" alt=""></div>`; } catch { logo = ''; }
    }
    if (!logo) logo = `<div class="lt ic">${safeIco(data.icon || 'boxes', { size: 56, stroke: 2 }, 'boxes')}</div>`;
    // Name size: as large as fits the card's text column.
    const name = String(copy.name ?? '');
    const col = g.cardW - 60 - 116 - 24;
    const nfs = Math.max(26, Math.min(46, Math.floor(col / (Math.max(4, [...name].length) * (rtl ? 0.62 : 0.6)))));
    // Feature cards: one row, fanned like a hand of cards.
    const n = g.features.length;
    const fw = n ? Math.min(n <= 2 ? 320 : 272, Math.floor((872 - (n - 1) * 18) / n)) : 0;
    const fh = 164;
    const rowW = n * fw + (n - 1) * 18;
    const feats = g.features.map((f, i) => {
      const k = i - (n - 1) / 2;
      const left = (904 - rowW) / 2 + i * (fw + 18);
      const rot = k * 3.2 * (rtl ? -1 : 1);
      const dy = Math.abs(k) * Math.abs(k) * 8;
      return `<div class="ss-ft-w" data-k="${k}" style="left:${x(left + (rtl ? fw : 0))}px;top:${g.fy + dy}px;width:${fw}px;height:${fh}px">
  <div class="ss-ft-p" style="transform:rotate(${rot}deg)"><div class="ss-ft card"><span class="fi">${safeIco(f.icon, { size: 28, stroke: 2.2 })}</span><div class="ftx">${words(f.text)}</div></div></div></div>`;
    }).join('');
    // Stats: pills in the top corners.
    const stats = g.stats.map((s, i) => {
      const side = g.stats.length === 1 ? 'inset-inline-end' : (i === 0 ? 'inset-inline-start' : 'inset-inline-end');
      return `<div class="ss-st-w" style="${side}:6px"><div class="ss-st-p"><div class="ss-st card"><span class="ss-sv">${odometer(s.value, STAT_H)}</span><i class="dv"></i><span class="ss-sl">${words(s.label ?? '')}</span></div></div></div>`;
    }).join('');
    const chips = g.techs.map((t) => {
      const label = [...t.name].length > CHIP_MAX + 1 ? [...t.name].slice(0, CHIP_MAX).join('') + '…' : t.name;
      return `<div class="ss-orb"><div class="ss-chip-p"><div class="ss-chip"><span class="ib">${safeIco(t.icon || techIcon(t.name), { size: 21, stroke: 2.2 }, 'layers')}</span><span class="lb">${esc(label)}</span></div></div></div>`;
    }).join('');
    // Brand blobs (gooey) peeking out behind the card and the features; spark petals. LTR coords.
    const blobs = [[-26, g.fy - 128, 118], [70, g.fy - 150, 68], [-10, g.fy - 30, 54], [790, g.cy - 196, 112], [748, g.cy - 214, 62], [830, g.cy - 96, 50]];
    const pets = [[16, g.cy - 150, -30, 0.85], [852, g.cy + 66, 110, 0.8], [436, Math.min(704, g.fy + 180), 160, 0.7]];
    const cl = 452 - g.cardW / 2;
    const ct = g.cy - g.cardH / 2;
    return `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="ssgoo" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="0 0 0 0 0.26  0 0 0 0 0.59  0 0 0 0 0.82  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>
<linearGradient id="ssring" x1="${rtl ? 1 : 0}" y1="0" x2="${rtl ? 0 : 1}" y2="0"><stop offset="0" stop-color="${ctx.theme === 'light' ? '#376BB1' : '#5AB4D9'}"/><stop offset=".55" stop-color="${ctx.theme === 'light' ? '#4296D1' : '#5AB4D9'}" stop-opacity=".7"/><stop offset="1" stop-color="#F28D19"/></linearGradient>
<linearGradient id="sspet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset=".55" stop-color="#F28D19"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
</defs></svg>
<div class="ss" data-cx="452" data-oy="${g.oy}" data-rx="${g.rx}" data-ry="${g.ry}" data-cy="${g.cy}" data-fy="${g.fy}">
<div class="ss-halo" style="top:${g.cy - 280}px"></div>
<div class="ss-net">${blobs.map(([l, t, d]) => `<i style="width:${d}px;height:${d}px;left:${x(l + (rtl ? d : 0))}px;top:${t}px"></i>`).join('')}</div>
${pets.map(([l, t, rot, k]) => `<div class="ss-pet" style="left:${x(l + (rtl ? 30 : 0))}px;top:${t}px;transform:rotate(${rtl ? -rot : rot}deg) scale(${k})">${petal()}</div>`).join('')}
<svg class="ss-ring" width="904" height="740" viewBox="0 0 904 740">
  <ellipse class="r2" cx="452" cy="${g.oy}" rx="${g.rx + 44}" ry="${g.ry + 22}"/>
  <ellipse class="r0" cx="452" cy="${g.oy}" rx="${g.rx}" ry="${g.ry}"/>
  <ellipse class="r1" cx="452" cy="${g.oy}" rx="${g.rx}" ry="${g.ry}"/>
</svg>
<i class="ss-dot a"></i><i class="ss-dot b"></i>
<div class="ss-card-w" style="left:${cl}px;top:${ct}px;width:${g.cardW}px;height:${g.cardH}px"><div class="ss-glow"></div><div class="ss-card-p" style="height:100%">
  <div class="ss-card card" style="height:100%">
    <div class="ss-logo"><div class="ss-logo-p">${logo}</div><div class="bp0">${Array.from({ length: 8 }, () => `<i class="ss-bp">${petal()}</i>`).join('')}</div></div>
    <div class="ss-tx"><div class="ss-name" style="--nfs:${nfs}px">${words(name)}</div><div class="ss-tag">${words(copy.tagline ?? '')}</div></div>
    <i class="sh"></i>
  </div>
</div></div>
<div class="ss-orbit">${chips}</div>
${feats}
${stats}
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const sine = 'sine.inOut';
    const dir = ctx.rtl ? -1 : 1;
    const q = (s) => document.querySelector(s);
    const qa = (s) => gsap.utils.toArray(s);
    const root = q('.ss');
    const cx = +root.dataset.cx; const oy = +root.dataset.oy;
    const rx = +root.dataset.rx; const ry = +root.dataset.ry; const cy = +root.dataset.cy;
    const anchor = (targets, vars, t) => tl.to(targets, { ...vars, duration: 0.01 }, t);

    // Shrink the name if the font estimate was too generous.
    const nm = q('.ss-name');
    let nfs = parseFloat(getComputedStyle(nm).fontSize);
    while (nm.scrollWidth > nm.clientWidth + 1 && nfs > 24) { nfs -= 1; nm.style.fontSize = `${nfs}px`; }

    // ---- Orbit: one full turn per loop; depth decides size, opacity and front/back ----
    const orbs = qa('.ss-orb');
    const n = orbs.length;
    const sizes = orbs.map((el) => [el.offsetWidth, el.offsetHeight]);
    const TAU = Math.PI * 2;
    let phase = Math.PI / 2 + 0.35;
    const angle = (i, s) => {
      const th = phase + (i / n) * TAU + s; // LTR angle
      const a = ctx.rtl ? Math.PI - th : th; // mirrored for Arabic (and turning the other way)
      return ((a % TAU) + TAU) % TAU;
    };
    const pos = (i, s) => {
      const a = angle(i, s);
      const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
      const [w, h] = sizes[i];
      return { x: cx + Math.cos(a) * rx - w / 2, y: oy + Math.sin(a) * ry - h / 2, depth };
    };
    // Starting phase: the frame-0 still should not bury a back chip behind the card. Try phases
    // across one chip slot and keep the one that hides the least (ties: nearest the default).
    const card = q('.ss-card-w');
    const cR = { l: card.offsetLeft, t: card.offsetTop, r: card.offsetLeft + card.offsetWidth, b: card.offsetTop + card.offsetHeight };
    const hidden = () => orbs.reduce((sum, el, i) => {
      const p = pos(i, 0);
      if (p.depth >= 0.5) return sum;
      const k = 0.78 + p.depth * 0.32;
      const [w, h] = sizes[i];
      const cxp = p.x + w / 2; const cyp = p.y + h / 2;
      const l = cxp - (w * k) / 2; const r = cxp + (w * k) / 2; const t = cyp - (h * k) / 2; const b = cyp + (h * k) / 2;
      const ov = Math.max(0, Math.min(r, cR.r) - Math.max(l, cR.l)) * Math.max(0, Math.min(b, cR.b) - Math.max(t, cR.t));
      return sum + ov / (w * k * h * k);
    }, 0);
    if (n) {
      const base = phase;
      let best = { score: Infinity, ph: base };
      for (let k = 0; k < 24; k++) {
        for (const sgn of [1, -1]) {
          phase = base + sgn * (k / 24) * (TAU / n) / 2;
          const sc = hidden() + k * 0.002;
          if (sc < best.score - 1e-9) best = { score: sc, ph: phase };
        }
      }
      phase = best.ph;
    }
    const place = (s) => orbs.forEach((el, i) => {
      const p = pos(i, s);
      gsap.set(el, { x: p.x, y: p.y, scale: 0.78 + p.depth * 0.32, opacity: 0.74 + p.depth * 0.26, zIndex: p.depth > 0.5 ? 8 : 2 });
    });
    // Two small sparks ride the ring between the chips.
    const dots = qa('.ss-dot');
    const placeDots = (s) => dots.forEach((d, j) => {
      const th = phase + ((j ? 0.5 : 0) + 0.5 / Math.max(1, n)) * TAU + s;
      const a = ctx.rtl ? Math.PI - th : th;
      const depth = (Math.sin(a) + 1) / 2;
      gsap.set(d, { x: cx + Math.cos(a) * rx, y: oy + Math.sin(a) * ry, scale: 0.6 + depth * 0.6, opacity: 0.55 + depth * 0.45, zIndex: depth > 0.5 ? 7 : 1 });
    });
    const place2 = (s) => { place(s); placeDots(s); };
    const spin = { s: 0 };
    place2(0);
    tl.to(spin, { s: TAU, duration: D, ease: 'none', onUpdate: () => place2(spin.s) }, 0);
    const sAt = (t) => (t / D) * TAU;

    // ---- Ambient loops (whole cycles) ----
    tl.to('.ss-halo', { scale: 1.06, opacity: 0.85, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    qa('.ss-net i').forEach((b, i) => {
      tl.to(b, { x: (i % 2 ? 14 : -12) * dir, y: i % 3 ? -12 : 14, scale: 1 + (i % 3) * 0.07, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    });
    tl.to('.ss-pet', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.fromTo('.ss-ring .r1', { strokeDashoffset: 0 }, { strokeDashoffset: -16 * 12 * dir, duration: D, ease: 'none' }, 0);
    tl.to('.ss-card-w', { y: -8, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    qa('.ss-ft-w').forEach((f, i) => {
      tl.to(f, { y: i % 2 ? 6 : -6, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    });
    qa('.ss-st-w').forEach((s, i) => {
      tl.to(s, { y: i % 2 ? -6 : 6, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    });

    // ---- Clear ----
    const c0 = 0.85;
    const feats = qa('.ss-ft-p');
    const fws = qa('.ss-ft-w');
    // Features gather into a stack under the card and fade.
    const toCentre = (i) => {
      const w = fws[i];
      return 452 - (w.offsetLeft + w.offsetWidth / 2);
    };
    feats.forEach((f, i) => {
      tl.to(f, { x: toCentre(i) * 0.85, y: -46, rotation: (i % 2 ? 8 : -8) * dir, scale: 0.84, opacity: 0, duration: 0.5, ease: 'power2.in' }, c0 + Math.abs(i - (feats.length - 1) / 2) * 0.06);
    });
    tl.to('.ss-st-p', { scale: 0.6, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'back.in(1.7)' }, c0);
    // Chips are pulled into the card.
    const cardC = { x: cx, y: cy };
    const chipsIn = (t) => orbs.map((el, i) => {
      const p = pos(i, sAt(t));
      const [w, h] = sizes[i];
      const k = 0.78 + p.depth * 0.32;
      return { x: (cardC.x - (p.x + w / 2)) / k, y: (cardC.y - (p.y + h / 2)) / k };
    });
    const pull = chipsIn(c0 + 0.45);
    qa('.ss-chip-p').forEach((c, i) => {
      tl.to(c, { x: pull[i].x, y: pull[i].y, scale: 0.3, opacity: 0, duration: 0.5, ease: 'power3.in' }, c0 + 0.1 + i * 0.035);
    });
    // The card empties and dips.
    tl.to(['.ss-name .w', '.ss-tag .w'], { opacity: 0, y: 10, duration: 0.25, stagger: 0.012, ease: 'power2.in' }, c0 + 0.1);
    tl.to('.ss-logo-p', { scale: 0, rotation: -30 * dir, duration: 0.35, ease: 'back.in(1.8)' }, c0 + 0.2);
    tl.to('.ss-card-p', { scale: 0.94, duration: 0.4, ease: 'power2.inOut' }, c0 + 0.35);
    anchor('.ss-bp', { opacity: 0 }, c0);

    // ---- Rebuild: the card pops back, logo drops in, name rises ----
    const r0 = 1.55;
    tl.to('.ss-card-p', { scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, r0);
    tl.fromTo('.ss-logo-p', { scale: 0, rotation: -40 * dir }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, r0 + 0.25);
    qa('.ss-bp').forEach((p, j) => {
      const a = (j * 45 + 20) * Math.PI / 180;
      const rr = 84 + (j % 2) * 20;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: j * 45 + 90 },
        { x: Math.cos(a) * rr, y: Math.sin(a) * rr, scale: 1, opacity: 0, rotation: j * 45 + 220, duration: 0.8, ease: 'power3.out' }, r0 + 0.4);
    });
    tl.fromTo('.ss-name .w', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, r0 + 0.45);
    tl.fromTo('.ss-tag .w', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }, r0 + 0.6);

    // ---- The stack bursts back out of the card into orbit ----
    const b0 = 2.5;
    qa('.ss-chip-p').forEach((c, i) => {
      const t = b0 + i * 0.09;
      const from = chipsIn(t)[i];
      tl.fromTo(c, { x: from.x, y: from.y, scale: 0.3, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, t);
    });

    // ---- Features fan in from a stack under the card ----
    const f0 = 3.35;
    feats.forEach((f, i) => {
      const rot = gsap.getProperty(f, 'rotation');
      tl.fromTo(f, { x: toCentre(i), y: -60, rotation: 0, scale: 0.8, opacity: 0 },
        { x: 0, y: 0, rotation: rot, scale: 1, opacity: 1, duration: 0.75, ease: 'back.out(1.3)' }, f0 + i * 0.13);
      tl.fromTo(f.querySelector('.fi'), { scale: 1 }, { scale: 1.16, duration: 0.16, ease: 'power2.out', repeat: 1, yoyo: true }, f0 + i * 0.13 + 0.5);
    });

    // ---- Stats pop and count up ----
    const s0 = 4.25 + Math.max(0, feats.length - 3) * 0.13;
    tl.fromTo('.ss-st-p', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(1.8)' }, s0);
    const H = parseFloat(getComputedStyle(q('.ss-sv') ?? document.body).lineHeight) || 44;
    qa('.ss-st').forEach((st, si) => {
      st.querySelectorAll('.ods').forEach((strip) => {
        const d = +strip.dataset.d;
        tl.to(strip, { y: 0, duration: 0.01 }, c0 + 0.5);
        tl.fromTo(strip, { y: 0 }, { y: -(10 + d) * H, duration: 1.3, ease: 'power3.out' }, s0 + 0.15 + si * 0.12);
      });
    });

    // ---- A last shine across the card ----
    const cw = q('.ss-card').offsetWidth;
    // (the shine rests off the card's left edge; in Arabic it sweeps right to left)
    tl.fromTo('.ss-card .sh', { x: ctx.rtl ? cw + 80 : -200 }, { x: ctx.rtl ? -200 : cw + 80, duration: 0.9, ease: 'power2.inOut' }, 5.2);
    if (ctx.rtl) anchor('.ss-card .sh', { x: -200 }, 0.5);
  },
};
