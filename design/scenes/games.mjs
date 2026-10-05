// Games: a playable-looking 2D platformer running in a Unity-style game window.
// A blob hero runs and jumps across brand-blue platforms collecting the logo's orange petals.
// Loop: the world scrolls exactly one pattern period (1440 px) in 8 s (far/mid/foreground
// layers scroll whole periods of their own), so t=8 matches t=0.
// Frame 0 is the running game; the "clear" is an iris wipe onto the hero (restart in play
// mode, score rolls back to 0, GO!), the "rebuild" is the iris opening on a fresh run that
// collects nine petals (each pops, bursts, shows +1 and flies into the score badge) and lands
// back on the frame-0 score.
import { ico, gooFilter } from '../motion/ui.mjs';
import { stack } from '../fonts.mjs';

// Game viewport geometry (px, inside the window).
const VW = 796;
const VH = 530;
const GA = 412; // ground top
const XC = 246; // hero centre x (in world-scroll direction)
const HZ = 1.15; // hero drawn 15% larger than its 88×80 rig (scaled from its feet)
const PX = 60; // a petal is collected when its back edge touches the hero's front (44·HZ + ~9)
const SPEED = 180; // world px per second
const P = 1440; // pattern period = SPEED * 8
const HY = GA - 44; // hero body centre y when grounded

// Jumps: [takeoff, rise time, fall time, start y, apex y, landing y] (y = offset above GA).
const JUMPS = [
  [1.95, 0.37, 0.37, 0, -125, 0],
  [3.45, 0.40, 0.274, 0, -170, -90],
  [4.85, 0.36, 0.485, -90, -200, 0],
  [5.97, 0.36, 0.36, 0, -115, 0],
];
// Pickup times (the hero reaches a petal).
const PICKS = [2.11, 2.31, 2.51, 3.1, 3.85, 4.5, 5.21, 6.28, 7.0];

const yAt = (t) => {
  let g = 0;
  for (const [t0, tr, tf, y0, ya, y1] of JUMPS) {
    if (t < t0) return g;
    if (t <= t0 + tr) { const u = (t - t0) / tr; return y0 + (ya - y0) * (1 - (1 - u) ** 2); }
    if (t <= t0 + tr + tf) { const v = (t - t0 - tr) / tf; return ya + (y1 - ya) * v * v; }
    g = y1;
  }
  return g;
};

// Islands in pattern coordinates: [x0, x1, floating?]
const ISLANDS = [[-24, 636], [694, 906], [941, 1146, true], [1196, 1346]];
// Little blob bushes on the islands: [x, scale]
const BUSHES = [[42, 1], [466, 0.85], [846, 0.9], [1286, 0.8]];

// Deterministic pseudo-random for decor.
const rand = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

const petalPath = 'M20 2C29 10 37 23 37 35C37 46 29 52 20 52C11 52 3 46 3 35C3 23 11 10 20 2Z';
const petalSvg = (cls = '') => `<svg class="${cls}" viewBox="0 0 40 54"><path d="${petalPath}" fill="url(#gpet)"/><path d="M13 22C15 16 18 11 21 8C20 15 18 21 15 27Z" fill="#fff" opacity=".55"/></svg>`;

function farLayer() {
  // Distant skyline: rounded towers with a few lit windows. Period 360, drawn for copies -1..3.
  const towers = [[0, 50, 150], [56, 36, 215], [98, 62, 120], [168, 42, 250], [216, 58, 180], [282, 34, 140], [322, 32, 200]];
  const r = rand(7);
  const win = towers.map(([x, w, h]) => {
    const cells = [];
    for (let yy = GA - h + 18; yy < GA - 10; yy += 18) {
      for (let xx = x + 8; xx < x + w - 8; xx += 12) {
        const v = r();
        if (v > 0.8) cells.push([xx, yy, '#F4B310', 0.55]);
        else if (v > 0.62) cells.push([xx, yy, '#5AB4D9', 0.35]);
      }
    }
    return cells;
  });
  let out = '';
  for (let c = -1; c <= 3; c++) {
    const o = c * 360;
    towers.forEach(([x, w, h], i) => {
      out += `<rect x="${x + o}" y="${GA - h}" width="${w}" height="${h + 140}" rx="9" fill="url(#gfar)"/>`;
      out += win[i].map(([xx, yy, col, op]) => `<rect x="${xx + o}" y="${yy}" width="5" height="7" rx="1.5" fill="${col}" opacity="${op}"/>`).join('');
    });
  }
  return `<svg width="1440" height="${VH}" viewBox="0 0 1440 ${VH}">${out}</svg>`;
}

function midLayer() {
  // Rolling hills with round blob trees (echoing the logo's nodes). Period 720.
  const hills = [[90, 520, 200, 150], [360, 540, 190, 175], [600, 515, 220, 140]];
  const trees = [[150, 382, 30], [205, 395, 22], [400, 372, 34], [560, 384, 26], [640, 382, 30]];
  let out = '';
  for (let c = -1; c <= 2; c++) {
    const o = c * 720;
    hills.forEach(([cx, cy, rx, ry]) => { out += `<ellipse cx="${cx + o}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ghill)"/>`; });
    trees.forEach(([x, y, rr]) => {
      out += `<rect x="${x + o - 3}" y="${y}" width="6" height="${GA - y + 10}" rx="3" fill="#1D3E6B"/>`;
      out += `<circle cx="${x + o}" cy="${y}" r="${rr}" fill="url(#gtree)"/>`;
    });
  }
  return `<svg width="2160" height="${VH}" viewBox="0 0 2160 ${VH}">${out}</svg>`;
}

const FGP = 1080; // foreground period: scrolls 2 periods (1.5× world speed) per loop
function fgLayer() {
  // Glowing light motes drifting past in front of everything: the nearest parallax plane.
  // They float in mid-air (never over the ground) so they read as light, not as smudges.
  const motes = [[40, 300, 9, 's'], [190, 168, 6, 's'], [318, 248, 7, 'a'], [452, 132, 6, 's'], [585, 330, 10, 's'], [720, 196, 7, 's'], [850, 286, 6, 'a'], [985, 150, 8, 's']];
  let out = '';
  for (let c = 0; c < 3; c++) {
    motes.forEach(([x, y, d, col]) => {
      out += `<i class="mo ${col}" style="left:${x + c * FGP - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px"></i>`;
    });
  }
  return out;
}

function world() {
  let out = '';
  for (let c = 0; c < 2; c++) {
    const o = c * P;
    ISLANDS.forEach(([x0, x1, fl]) => { out += `<div class="isl${fl ? ' fl' : ''}" style="left:${x0 + o}px;width:${x1 - x0}px"></div>`; });
    BUSHES.forEach(([x, s]) => { out += `<div class="bush" style="left:${x + o}px;transform:scale(${s})"><i></i><i></i><i></i></div>`; });
  }
  // Petals: the one the hero collects in this loop ("live") and its twin one period away.
  // A twin behind the hero at t=0 starts collected; a twin ahead stays for the next loop.
  PICKS.forEach((t, k) => {
    const x = XC + PX + SPEED * t;
    const y = HY + yAt(t);
    const twin = x < P ? x + P : x - P;
    const rot = [-18, 0, 18, -10, 12, -14, 16, -8, 10][k];
    const el = (xx, cls) => `<div class="spk k${k} ${cls}" style="left:${(xx - 18).toFixed(1)}px;top:${(y - 24).toFixed(1)}px"><div class="pet" style="transform:rotate(${rot}deg)">${petalSvg()}</div></div>`;
    out += el(x, 'live') + el(twin, x < P ? '' : 'got');
  });
  return out;
}

function fx() {
  return PICKS.map((t, k) => {
    const y = HY + yAt(t);
    const pts = Array.from({ length: 6 }, () => '<i class="pt"></i>').join('');
    return `<div class="pk pk${k}" style="left:${XC + PX}px;top:${y.toFixed(1)}px"><i class="rg"></i>${pts}</div>`;
  }).join('');
}

// "+1" labels sit in their own layer above the hero (the bursts stay behind it).
function plusOnes() {
  return PICKS.map((t, k) => `<div class="pk" style="left:${XC + PX}px;top:${(HY + yAt(t)).toFixed(1)}px"><span class="pl pl${k}"><b>+1</b></span></div>`).join('');
}

function stars() {
  const r = rand(21);
  return Array.from({ length: 16 }, (_, i) => {
    const x = Math.round(20 + r() * 750); const y = Math.round(16 + r() * 230); const s = 2 + Math.round(r() * 2);
    return `<i class="st" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px"></i>`;
  }).join('');
}

export default {
  meta: {
    title: "2D platformer",
    description: "A blob hero runs and jumps across platforms collecting orange petals in a Unity-style game window.",
    bestFor: "Games, Unity projects, playful launches",
  },
  duration: 8,

  copy: {
    en: { title: 'Game · Play mode', score: 'Score', go: 'GO!', unity: 'Built in Unity', fps: '60 FPS' },
    ar: { title: 'اللعبة · وضع اللعب', score: 'النقاط', go: 'انطلق!', unity: 'مبنية بمحرّك Unity', fps: '60 FPS' },
  },

  css: (ctx) => `
.net{position:absolute;inset:0}
.net .n{position:absolute;border-radius:50%;background:var(--brand)}
.fsp{position:absolute;width:30px;height:42px;filter:drop-shadow(0 0 12px rgba(242,141,25,.55))}
.fsp svg{width:100%;height:100%;display:block}
.gw{position:absolute;inset-inline-start:52px;top:62px;width:800px}
.gw::before{content:'';position:absolute;inset:80px 30px -20px;border-radius:60px;background:var(--brand);filter:blur(70px);opacity:.42}
.gw .tilt{position:relative;transform:perspective(1900px) rotateY(${ctx.rtl ? 5 : -5}deg) rotateX(3deg);box-shadow:0 50px 100px rgba(2,6,14,.6),0 0 0 1px rgba(90,180,217,.12)}
.gw .win-bar{position:relative;background:linear-gradient(180deg,#172A47,#13233D)}
.gw .win-bar .t{white-space:nowrap${ctx.rtl ? ';font:600 22px ' + stack.arabic : ''}}
.tools{flex:1;min-width:0;display:flex;justify-content:center}
.tg{display:flex;gap:8px;direction:ltr}
.tb{width:44px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--soft);color:var(--ui-sub);position:relative}
.tb svg{fill:currentColor}
.tb.on{background:var(--blue);color:#fff;box-shadow:0 0 0 2px rgba(90,180,217,.35),0 6px 18px rgba(66,150,209,.5)}
.ping{position:absolute;inset:-2px;border-radius:12px;border:3px solid var(--sky);opacity:0}
.fps{display:flex;align-items:center;gap:9px;padding:5px 14px;border-radius:999px;background:rgba(34,197,94,.12);color:#7BE3A4;font:700 20px ${stack.mono};direction:ltr}
.fps i{width:10px;height:10px;border-radius:50%;background:#22C55E;box-shadow:0 0 10px #22C55E}
.vp{position:relative;height:${VH}px;overflow:hidden;--ir:1100px;background:radial-gradient(circle at ${ctx.rtl ? VW - XC : XC}px ${HY}px,#1D4274 0%,#122B4F 26%,#0A1830 58%,#060E1C 100%)}
.vp::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(90,180,217,.22) 1.6px,transparent 2px);background-size:28px 28px;-webkit-mask-image:radial-gradient(circle at ${ctx.rtl ? VW - XC : XC}px ${HY}px,#000 0,transparent 70%);mask-image:radial-gradient(circle at ${ctx.rtl ? VW - XC : XC}px ${HY}px,#000 0,transparent 70%)}
.scn,.ovl{position:absolute;inset:0${ctx.rtl ? ';transform:scaleX(-1)' : ''}}
.scn{clip-path:circle(var(--ir) at ${XC}px ${HY}px)}
.sky{position:absolute;inset:0;background:radial-gradient(ellipse 62% 30% at 60% 80%,rgba(244,179,16,.42),rgba(236,108,28,.16) 48%,transparent 76%),radial-gradient(ellipse 46% 36% at 12% 72%,rgba(90,180,217,.30),transparent 72%),linear-gradient(180deg,#0B1B36 0%,#11305A 32%,#1E4B86 60%,#3474B6 80%,#4590CC 100%)}
.moon{position:absolute;left:500px;top:44px;width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#F4FBFF 0%,#CDEBF8 38%,#7CC6E6 100%);box-shadow:0 0 60px rgba(90,180,217,.55),0 0 140px rgba(90,180,217,.3)}
.moon::after{content:'';position:absolute;left:52px;top:52px;width:18px;height:18px;border-radius:50%;background:rgba(66,150,209,.25);box-shadow:-30px -16px 0 -3px rgba(66,150,209,.2)}
.st{position:absolute;border-radius:50%;background:#D7EEFF;box-shadow:0 0 6px rgba(215,238,255,.8)}
.far,.mid,.world{position:absolute;left:0;top:0;height:${VH}px}
.far{width:1440px}
.mid{width:2160px}
.far svg,.mid svg{display:block}
.fg{position:absolute;left:0;top:0;width:${FGP * 3}px;height:${VH}px}
.mo{position:absolute;border-radius:50%;background:#E8F8FF;box-shadow:0 0 10px 3px rgba(150,215,245,.75),0 0 26px 6px rgba(90,180,217,.35)}
.mo.a{background:#FFE7A8;box-shadow:0 0 10px 3px rgba(244,179,16,.8),0 0 26px 6px rgba(242,141,25,.35)}
.fog{position:absolute;left:0;right:0;bottom:0;height:210px;background:linear-gradient(180deg,rgba(8,20,40,0),rgba(8,20,40,.88))}
.world{width:${P * 2}px}
.isl{position:absolute;top:${GA}px;height:150px;border-radius:26px 26px 10px 10px;background:linear-gradient(180deg,#24508A 0%,#1A3B69 30%,#112848 100%);box-shadow:inset 0 0 0 2px rgba(90,180,217,.14),0 -8px 28px rgba(66,150,209,.22)}
.isl::before{content:'';position:absolute;left:0;right:0;top:0;height:22px;border-radius:26px 26px 12px 12px;background:var(--brand);box-shadow:inset 0 3px 0 rgba(255,255,255,.38),0 4px 0 rgba(8,18,34,.35)}
.isl::after{content:'';position:absolute;left:12px;right:12px;top:34px;bottom:0;border-radius:10px;background-image:linear-gradient(90deg,rgba(8,18,34,.42) 2px,transparent 2px),linear-gradient(180deg,rgba(8,18,34,.42) 2px,transparent 2px);background-size:52px 40px;opacity:.9}
.isl.fl{top:${GA - 90}px;height:44px;border-radius:22px;background:linear-gradient(180deg,#2A5EA0,#163463);box-shadow:inset 0 0 0 2px rgba(90,180,217,.18),0 22px 44px rgba(66,150,209,.35)}
.isl.fl::before{height:20px;border-radius:22px 22px 10px 10px}
.isl.fl::after{display:none}
.bush{position:absolute;top:${GA - 34}px;width:80px;height:40px;transform-origin:50% 100%}
.bush i{position:absolute;bottom:0;border-radius:50%;background:radial-gradient(circle at 40% 30%,#4E9BD6,#2B5C9A 80%)}
.bush i:nth-child(1){left:0;width:38px;height:34px}
.bush i:nth-child(2){left:20px;width:46px;height:44px}
.bush i:nth-child(3){left:48px;width:32px;height:28px}
.spk{position:absolute;width:36px;height:48px}
.spk.got{opacity:0}
.spk .pet{width:100%;height:100%;filter:drop-shadow(0 0 10px rgba(242,141,25,.75))}
.spk svg,.pk svg{width:100%;height:100%;display:block}
.hero{position:absolute;left:${XC - 44}px;top:${GA - 80}px;width:88px;height:80px}
.hj,.hb,.hs{position:absolute;inset:0}
.hz{position:absolute;inset:0;transform:scale(${HZ});transform-origin:50% 100%}
.shd{position:absolute;left:-2px;top:68px;width:92px;height:22px;border-radius:50%;background:radial-gradient(closest-side,rgba(3,8,18,.6),rgba(3,8,18,0))}
.hs{transform-origin:50% 100%}
.hbody{position:absolute;inset:0;border-radius:50% 50% 44% 44%/62% 62% 38% 38%;background:radial-gradient(circle at 34% 26%,#E9F8FF 0%,#A3DDF5 16%,#5AB4D9 46%,#4296D1 76%,#376BB1 100%);box-shadow:inset -8px -10px 0 rgba(39,84,150,.35),0 0 36px rgba(90,180,217,.6)}
.hbody::after{content:'';position:absolute;left:16px;top:12px;width:20px;height:11px;border-radius:50%;background:rgba(255,255,255,.8);transform:rotate(-28deg)}
.eye{position:absolute;top:24px;width:17px;height:22px;border-radius:50%;background:#fff}
.eye.a{left:42px}.eye.b{left:62px}
.eye b{position:absolute;left:7px;top:6px;width:9px;height:12px;border-radius:50%;background:#0B1628}
.eye b::after{content:'';position:absolute;left:2px;top:2px;width:3px;height:3px;border-radius:50%;background:#fff}
.ck{position:absolute;top:50px;width:13px;height:7px;border-radius:50%;background:var(--ember);opacity:.55}
.ck.a{left:34px}.ck.b{left:74px}
.mouth{position:absolute;left:55px;top:48px;width:14px;height:8px;border-bottom:3px solid #0B1628;border-radius:0 0 50% 50%}
.ft{position:absolute;bottom:-7px;width:26px;height:14px;border-radius:50%;background:linear-gradient(180deg,#3A78BE,#25508C)}
.ft.a{left:10px}.ft.b{left:52px}
.sprout{position:absolute;left:28px;top:-26px;width:22px;height:30px;transform-origin:50% 100%;transform:rotate(-16deg);filter:drop-shadow(0 0 6px rgba(242,141,25,.6))}
.sl{position:absolute;height:5px;border-radius:3px;background:linear-gradient(90deg,rgba(207,240,255,0),rgba(207,240,255,.8));opacity:0}
.puffs{position:absolute;left:${XC}px;top:${GA}px}
.pf{position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;background:rgba(215,238,255,.85);opacity:0}
.pk{position:absolute;width:0;height:0}
.pk .rg{position:absolute;left:-34px;top:-34px;width:68px;height:68px;border-radius:50%;border:4px solid var(--amber);box-shadow:0 0 18px rgba(244,179,16,.7);opacity:0}
.pk .pt{position:absolute;left:-6px;top:-9px;width:12px;height:18px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);opacity:0}
.pls{position:absolute;inset:0}
.pl{position:absolute;left:-40px;top:-78px;width:80px;text-align:center${ctx.rtl ? ';transform:scaleX(-1)' : ''}}
.pl b{display:inline-block;font:800 32px ${stack.display};color:#FFD27A;text-shadow:0 0 14px rgba(242,141,25,.9),0 2px 0 rgba(120,50,0,.5);direction:ltr;unicode-bidi:isolate;opacity:0}
.fly{position:absolute;left:-14px;top:-19px;width:28px;height:38px;opacity:0;filter:drop-shadow(0 0 10px rgba(244,179,16,.9))}
.fly svg{width:100%;height:100%;display:block}
.ring{position:absolute;left:0;top:0;width:${VW}px;height:${VH}px;opacity:0;overflow:visible}
.ring circle{fill:none}
.ring .r1{r:var(--ir);stroke:var(--sky);stroke-width:5;filter:drop-shadow(0 0 14px rgba(90,180,217,.95))}
.ring .r2{r:calc(var(--ir) + 16px);stroke:var(--amber);stroke-width:4;stroke-dasharray:3 15;stroke-linecap:round}
.hud{position:absolute;top:18px;inset-inline:18px;display:flex;justify-content:space-between;align-items:flex-start}
.sc{display:flex;align-items:center;gap:12px;padding-block:7px;padding-inline:7px 20px;border-radius:999px;background:rgba(8,18,34,.62);border:2px solid rgba(147,169,198,.22);box-shadow:0 10px 26px rgba(2,6,14,.4)}
.sc .sb{position:relative;width:46px;height:46px;border-radius:50%;background:var(--sparkg);display:grid;place-items:center;color:#fff;box-shadow:0 0 18px rgba(242,141,25,.55)}
.sc .sb svg{fill:#fff}
.sc .gl{position:absolute;inset:-4px;border-radius:50%;border:3px solid var(--amber);opacity:0}
.sc .lb{font:600 ${ctx.rtl ? 23 : 22}px ${ctx.rtl ? stack.arabic : stack.mono};color:var(--ui-sub);letter-spacing:${ctx.rtl ? 0 : '.06em'};text-transform:uppercase}
.dgw{height:42px;overflow:hidden;min-width:24px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 24%,#000 76%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 24%,#000 76%,transparent 100%)}
.dg{display:flex;flex-direction:column;transform:translateY(-378px)}
.dg span{display:block;height:42px;line-height:42px;font:800 36px ${stack.display};color:#fff;text-align:center}
.lives{display:flex;gap:8px;padding:12px 16px;border-radius:999px;background:rgba(8,18,34,.62);border:2px solid rgba(147,169,198,.22)}
.lives svg{fill:url(#gpet);stroke:none}
.go{position:absolute;left:0;right:0;top:104px;text-align:center;font:800 ${ctx.rtl ? 86 : 96}px ${ctx.rtl ? stack.arabic : stack.display};letter-spacing:${ctx.rtl ? 0 : '-.02em'};opacity:0}
.go span{position:relative;display:inline-block;background:var(--sparkg);-webkit-background-clip:text;background-clip:text;color:transparent}
.go b{position:absolute;left:0;right:0;top:0;color:var(--spark);filter:blur(22px);opacity:.55}
.vig{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 90px rgba(2,6,14,.55)}
.pad{position:absolute;inset-inline-end:6px;top:560px;width:124px;height:124px}
.pad .pi{position:absolute;inset:0;border-radius:34px;background:var(--brand);display:grid;place-items:center;color:#fff;transform:rotate(${ctx.rtl ? 10 : -10}deg);box-shadow:0 26px 60px rgba(20,50,100,.6),inset 0 2px 0 rgba(255,255,255,.35)}
.pad .bt{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--amber);box-shadow:0 0 16px 4px rgba(244,179,16,.85);opacity:0}
.uchip{position:absolute;inset-inline-start:10px;top:626px}
.uchip .chip{padding:10px 22px 10px 10px;padding-inline:10px 22px;gap:14px;font-size:${ctx.rtl ? 23 : 22}px;background:var(--card);box-shadow:0 20px 44px rgba(2,6,14,.55);font-family:${ctx.rtl ? stack.arabic : stack.display};font-weight:700}
.uchip .ub{width:42px;height:42px;border-radius:13px;background:var(--brand);display:grid;place-items:center;color:#fff}
`,

  html: ({ copy }) => `${gooFilter}
<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="gpet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset=".55" stop-color="#F28D19"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
<linearGradient id="ghill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22457A"/><stop offset=".5" stop-color="#173360"/><stop offset="1" stop-color="#0E2343"/></linearGradient>
<linearGradient id="gfar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21497F"/><stop offset=".35" stop-color="#1A3C6B"/><stop offset="1" stop-color="#122B4E"/></linearGradient>
<radialGradient id="gtree" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#3C7DC4"/><stop offset="1" stop-color="#1F4479"/></radialGradient>
</defs></svg>
<div class="net goo">
  <div class="n" style="width:150px;height:150px;inset-inline-start:-4px;top:40px"></div>
  <div class="n" style="width:86px;height:86px;inset-inline-start:110px;top:4px"></div>
  <div class="n" style="width:70px;height:70px;inset-inline-start:2px;top:200px"></div>
  <div class="n" style="width:160px;height:160px;inset-inline-start:744px;top:420px"></div>
  <div class="n" style="width:92px;height:92px;inset-inline-start:806px;top:330px"></div>
  <div class="n" style="width:74px;height:74px;inset-inline-start:700px;top:560px"></div>
</div>
<div class="fsp" style="inset-inline-start:860px;top:10px;transform:rotate(30deg)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:14px;top:330px;transform:rotate(-140deg) scale(.8)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:330px;top:0px;transform:rotate(70deg) scale(.7)">${petalSvg()}</div>
<div class="gw"><div class="tilt win">
  <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="t">${copy.title}</span>
    <div class="tools"><div class="tg"><span class="tb on">${ico('play', { size: 18 })}<i class="ping"></i></span><span class="tb">${ico('pause', { size: 18 })}</span><span class="tb">${ico('step-forward', { size: 18 })}</span></div></div>
    <span class="fps"><i></i>${copy.fps}</span>
  </div>
  <div class="vp">
    <div class="scn">
      <div class="sky"></div><div class="moon"></div>${stars()}
      <div class="far">${farLayer()}</div>
      <div class="mid">${midLayer()}</div>
      <div class="fog"></div>
      <div class="world">${world()}</div>
      ${fx()}
      <div class="puffs">${[0, 1, 2, 3].map(() => '<i class="pf l"></i>').join('')}${[0, 1, 2].map(() => '<i class="pf t"></i>').join('')}</div>
      <div class="hero"><i class="shd"></i><div class="hj">
        <i class="sl" style="left:-58px;top:20px;width:46px"></i><i class="sl" style="left:-78px;top:40px;width:62px"></i><i class="sl" style="left:-54px;top:60px;width:40px"></i>
        <div class="hb"><div class="hs"><div class="hz">
          <i class="ft a"></i><i class="ft b"></i>
          <div class="sprout">${petalSvg()}</div>
          <div class="hbody"></div>
          <i class="eye a"><b></b></i><i class="eye b"><b></b></i><i class="ck a"></i><i class="ck b"></i><i class="mouth"></i>
        </div></div></div>
      </div></div>
      <div class="pls">${plusOnes()}</div>
      <div class="fg">${fgLayer()}</div>
    </div>
    <div class="ovl"><svg class="ring" viewBox="0 0 ${VW} ${VH}"><circle class="r1" cx="${XC}" cy="${HY}"/><circle class="r2" cx="${XC}" cy="${HY}"/></svg></div>
    <div class="hud">
      <div class="sc"><span class="sb">${ico('star', { size: 24, stroke: 1.5 })}<i class="gl"></i></span><span class="lb">${copy.score}</span><span class="dgw"><span class="dg">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<span>${d}</span>`).join('')}</span></span></div>
      <div class="lives">${[0, 1, 2].map(() => ico('heart', { size: 26 })).join('')}</div>
    </div>
    <div class="ovl fl">${PICKS.map((_, k) => `<div class="fly fly${k}">${petalSvg()}</div>`).join('')}</div>
    <div class="go"><b>${copy.go}</b><span>${copy.go}</span></div>
    <div class="vig"></div>
  </div>
</div></div>
<div class="uchip"><span class="chip"><span class="ub">${ico('box', { size: 24 })}</span>${copy.unity}</span></div>
<div class="pad"><div class="pi">${ico('gamepad-2', { size: 72, stroke: 1.8 })}<i class="bt" style="left:${62 + (15 - 12) * 3}px;top:${62 + (12 - 12) * 3}px"></i></div></div>`,

  animate(tl, gsap, ctx) {
    const D = 8;
    // Mirrors the module constants (animate() runs in the page, without closures).
    const XC = 246; const PX = 60; const HY = 368; const HUD = 50; const DIGIT = 42;
    const JUMPS = [
      [1.95, 0.37, 0.37, 0, -125, 0],
      [3.45, 0.40, 0.274, 0, -170, -90],
      [4.85, 0.36, 0.485, -90, -200, 0],
      [5.97, 0.36, 0.36, 0, -115, 0],
    ];
    const PICKS = [2.11, 2.31, 2.51, 3.1, 3.85, 4.5, 5.21, 6.28, 7.0];
    const yAt = (t) => {
      let g = 0;
      for (const [t0, tr, tf, y0, ya, y1] of JUMPS) {
        if (t < t0) return g;
        if (t <= t0 + tr) { const u = (t - t0) / tr; return y0 + (ya - y0) * (1 - (1 - u) ** 2); }
        if (t <= t0 + tr + tf) { const v = (t - t0 - tr) / tf; return ya + (y1 - ya) * v * v; }
        g = y1;
      }
      return g;
    };
    const sine = 'sine.inOut';

    // ---- Ambient loops (whole cycles) ----
    gsap.utils.toArray('.net .n').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -14), y: (i % 3 ? -14 : 18), scale: 1 + (i % 3) * 0.07, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    });
    tl.to('.fsp', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.gw', { y: -7, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.pad', { y: -14, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.pad .pi', { rotation: ctx.rtl ? 4 : -4, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.uchip', { y: 9, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.moon', { scale: 1.05, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    gsap.utils.toArray('.st').forEach((s, i) => {
      const n = 1 + (i % 4);
      tl.to(s, { opacity: 0.25, duration: D / (2 * n), ease: sine, repeat: 2 * n - 1, yoyo: true }, 0);
    });
    // Motes bob gently while they drift past (whole cycles).
    gsap.utils.toArray('.mo').forEach((m, i) => {
      tl.to(m, { y: i % 2 ? -12 : 12, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    });
    gsap.utils.toArray('.spk .pet').forEach((p, i) => {
      tl.to(p, { y: i % 2 ? -7 : 7, duration: 1, ease: sine, repeat: 7, yoyo: true }, 0);
    });

    // ---- Parallax (each layer scrolls a whole number of its periods) ----
    tl.fromTo('.world', { x: 0 }, { x: -1440, duration: D, ease: 'none' }, 0);
    tl.fromTo('.mid', { x: 0 }, { x: -720, duration: D, ease: 'none' }, 0);
    tl.fromTo('.far', { x: 0 }, { x: -360, duration: D, ease: 'none' }, 0);
    tl.fromTo('.fg', { x: 0 }, { x: -2160, duration: D, ease: 'none' }, 0);

    // ---- Hero: secondary motion ----
    tl.to('.sprout', { rotation: 10, duration: 0.25, ease: sine, repeat: 31, yoyo: true }, 0);
    tl.to('.ft.a', { x: 30, y: -3, duration: 0.2, ease: sine, repeat: 39, yoyo: true }, 0);
    tl.to('.ft.b', { x: -30, duration: 0.2, ease: sine, repeat: 39, yoyo: true }, 0);
    gsap.utils.toArray('.sl').forEach((s, i) => {
      const d = [0.4, 0.5, 0.8][i];
      const n = Math.round(D / d);
      tl.fromTo(s, { x: 24 }, { x: -40, duration: d, ease: 'none', repeat: n - 1 }, 0);
      tl.to(s, { opacity: 0.85, duration: d / 2, ease: sine, repeat: 2 * n - 1, yoyo: true }, 0);
    });
    [0.5, 3.25, 7.45].forEach((t) => tl.to('.eye', { scaleY: 0.1, duration: 0.07, ease: 'power1.inOut', repeat: 1, yoyo: true }, t));

    // ---- Hero: runs (hops) and jumps, with a contact shadow ----
    const run = (t0, t1) => {
      const n = Math.max(1, Math.round((t1 - t0) / 0.3));
      const d = (t1 - t0) / n;
      tl.fromTo('.hb', { y: 0 }, { y: -9, duration: d / 2, ease: 'sine.out', repeat: 2 * n - 1, yoyo: true }, t0);
      tl.fromTo('.hs', { scaleX: 1, scaleY: 1 }, { scaleX: 0.96, scaleY: 1.05, duration: d / 2, ease: 'sine.out', repeat: 2 * n - 1, yoyo: true }, t0);
      tl.fromTo('.shd', { scale: 1 }, { scale: 0.86, duration: d / 2, ease: 'sine.out', repeat: 2 * n - 1, yoyo: true }, t0);
    };
    run(0, 1.85);
    JUMPS.forEach(([t0, tr, tf, y0, ya, y1], i) => {
      const land = t0 + tr + tf;
      tl.to('.hs', { scaleX: 1.15, scaleY: 0.83, duration: 0.08, ease: 'power2.out' }, t0 - 0.08);
      tl.fromTo('.hj', { y: y0 }, { y: ya, duration: tr, ease: 'power2.out' }, t0);
      tl.to('.hs', { scaleX: 0.86, scaleY: 1.16, rotation: 7, duration: 0.16, ease: 'power2.out' }, t0);
      tl.to('.hs', { scaleX: 1, scaleY: 1, rotation: 0, duration: tr - 0.12, ease: sine }, t0 + 0.16);
      tl.to('.hj', { y: y1, duration: tf, ease: 'power2.in' }, t0 + tr);
      tl.to('.hs', { scaleX: 0.94, scaleY: 1.07, duration: tf * 0.8, ease: 'sine.in' }, t0 + tr + 0.04);
      tl.to('.hs', { scaleX: 1.24, scaleY: 0.74, duration: 0.07, ease: 'power2.out' }, land);
      tl.to('.hs', { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1,0.45)' }, land + 0.07);
      // The shadow stays on the ground: it shrinks away on takeoff and grows back under the landing spot.
      tl.to('.shd', { scale: 0.45, opacity: 0, duration: tr * 0.6, ease: 'power1.out' }, t0);
      tl.fromTo('.shd', { y: y1, scale: 0.45, opacity: 0 }, { y: y1, scale: 1, opacity: 1, duration: tf * 0.55, ease: 'power1.in' }, land - tf * 0.55);
      tl.to('.shd', { scaleX: 1.25, duration: 0.07, ease: 'power2.out' }, land);
      tl.to('.shd', { scaleX: 1, duration: 0.4, ease: 'elastic.out(1,0.45)' }, land + 0.07);
      // Dust: a kick at takeoff, a splash at landing.
      gsap.utils.toArray('.pf.t').forEach((p, j) => {
        tl.fromTo(p, { x: -10, y: y0, scale: 0.35, opacity: 0.85 }, { x: -46 - j * 18, y: y0 - 8 - j * 5, scale: 1 - j * 0.15, opacity: 0, duration: 0.45, ease: 'power2.out' }, t0);
      });
      gsap.utils.toArray('.pf.l').forEach((p, j) => {
        const dx = [-48, -20, 16, 40][j];
        tl.fromTo(p, { x: 0, y: y1, scale: 0.35, opacity: 0.9 }, { x: dx - 26, y: y1 - 10 - (j % 2) * 8, scale: 1.15, opacity: 0, duration: 0.5, ease: 'power2.out' }, land);
      });
      // The controller's button lights up on every jump.
      tl.fromTo('.pad .bt', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.25, duration: 0.12, ease: 'power2.out', repeat: 1, yoyo: true }, t0 - 0.1);
      tl.fromTo('.pad .pi', { scale: 1 }, { scale: 0.94, duration: 0.1, ease: 'power2.out', repeat: 1, yoyo: true }, t0 - 0.1);
      if (i < 3) {
        const next = JUMPS[i + 1][0];
        if (next - 0.1 - (land + 0.47) > 0.15) run(land + 0.47, next - 0.1);
      }
    });
    run(6.69 + 0.47, D);

    // ---- Clear: restart in play mode. The iris closes onto the hero, the score rolls back ----
    tl.fromTo('.tb.on', { scale: 1 }, { scale: 0.86, duration: 0.12, ease: 'power2.out', repeat: 1, yoyo: true }, 0.72);
    tl.fromTo('.ping', { scale: 0.8, opacity: 1 }, { scale: 1.9, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.75);
    tl.to('.ring', { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.85);
    tl.to('.vp', { '--ir': '96px', duration: 0.5, ease: 'power3.inOut' }, 0.85);
    tl.fromTo('.ring .r2', { rotation: 0 }, { rotation: 120, svgOrigin: `${XC} ${HY}`, duration: 1.2, ease: 'none' }, 0.85);
    tl.to('.dg', { y: 0, duration: 0.6, ease: 'power3.inOut' }, 1.1);
    tl.fromTo('.go', { opacity: 0, scale: 0.4, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.36, ease: 'back.out(2.2)' }, 1.04);
    // ...rebuild: the iris opens on a fresh run.
    tl.to('.vp', { '--ir': '1100px', duration: 0.6, ease: 'power2.in' }, 1.45);
    tl.to('.ring', { opacity: 0, duration: 0.3, ease: 'power1.in' }, 1.75);
    // GO! leaves by shrinking away (a fade would turn orange-over-blue muddy).
    tl.to('.go', { scale: 0, y: 30, duration: 0.28, ease: 'back.in(1.6)' }, 1.42);
    tl.to('.go', { opacity: 0, duration: 0.04, ease: 'none' }, 1.68);
    tl.fromTo(['.sc', '.lives'], { y: 0 }, { y: -6, duration: 0.18, ease: 'power2.out', repeat: 1, yoyo: true, stagger: 0.08 }, 1.9);

    // ---- Pickups: pop + burst + "+1", then the petal flies into the score badge ----
    PICKS.forEach((t, k) => {
      const x0 = XC + PX; const y0 = HY + yAt(t); const ta = t + 0.55;
      tl.to(`.spk.k${k}.live`, { scale: 1.6, opacity: 0, duration: 0.18, ease: 'power2.out' }, t);
      tl.fromTo(`.pk${k} .rg`, { scale: 0.3, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power2.out' }, t);
      gsap.utils.toArray(`.pk${k} .pt`).forEach((p, j) => {
        const a = (j * 60 + 30 + k * 13) * Math.PI / 180;
        const r = 58 + (j % 3) * 14;
        tl.fromTo(p, { x: 0, y: 0, rotation: j * 60 + 120, scale: 1, opacity: 1 },
          { x: Math.cos(a) * r - 40, y: Math.sin(a) * r, scale: 0.3, opacity: 0, duration: 0.6, ease: 'power3.out' }, t);
      });
      tl.fromTo(`.pl${k} b`, { y: 10, scale: 0.5, opacity: 0 }, { y: -16, scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2.4)' }, t);
      tl.to(`.pl${k} b`, { y: -46, opacity: 0, duration: 0.35, ease: 'power2.in' }, t + 0.32);
      // Fly: pop up, then swoop into the HUD badge.
      const fly = `.fly${k}`;
      tl.fromTo(fly, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.1, ease: 'none' }, t);
      tl.to(fly, { motionPath: { path: [{ x: x0, y: y0 }, { x: x0 - 26, y: y0 - 96 }, { x: HUD, y: HUD }], curviness: 1.1, fromCurrent: false }, duration: 0.55, ease: 'power2.in' }, t);
      tl.to(fly, { scale: 0.6, rotation: -40, duration: 0.45, ease: 'power1.in' }, t + 0.1);
      tl.to(fly, { opacity: 0, duration: 0.08, ease: 'none' }, ta - 0.05);
      // The HUD counts it on arrival.
      tl.fromTo('.dg', { y: -DIGIT * k }, { y: -DIGIT * (k + 1), duration: 0.22, ease: 'back.out(2)' }, ta);
      tl.fromTo('.sc', { scale: 1 }, { scale: 1.1, duration: 0.09, ease: 'power2.out', repeat: 1, yoyo: true }, ta);
      // The star turns one point per petal; the last one spins a full turn, so it ends exactly at 0°.
      const last = k === PICKS.length - 1;
      tl.fromTo('.sc .sb svg', { rotation: 0 }, { rotation: last ? 360 : 72, duration: last ? 0.4 : 0.3, ease: last ? 'power2.out' : 'back.out(2)' }, ta);
      tl.fromTo('.sc .gl', { scale: 0.7, opacity: 1 }, { scale: 1.7, opacity: 0, duration: 0.45, ease: 'power2.out' }, ta);
    });
  },
};
