// Interactive: a presentation that responds. A 3D product turns on a turntable inside a
// 16:9 slide; a hand cursor taps a pulsing hotspot (ripple) and an info card pops out, then a
// quiz card rises out of the screen, the right answer is tapped and the card flips to
// "Correct!" with a burst of the logo's orange spark petals while the slide dots advance.
// Frame 0 (and the end) is the finished state: info card open, quiz card showing "Correct!".
import { ico, gooFilter } from '../motion/ui.mjs';
import { stack } from '../fonts.mjs';

// Slide (inside the window) and product geometry, in LTR slide px. Logical properties and
// mirror() flip everything for Arabic.
const SW = 796;
const SH = 448;
const PX = 258; // product centre x
const PCY = 232; // product centre y
// The product is an octagonal prism: 4 broad faces (W) joined by 4 chamfers (C).
const W = 118;
const C = 36;
const H = 184;
const F = W + Math.SQRT2 * C; // width across the flats
const DM = F / 2; // centre to broad face
const DC = (W / 2 + C / (2 * Math.SQRT2)) * Math.SQRT2; // centre to chamfer
const CUT = ((C / Math.SQRT2) / F) * 100; // top-face octagon corner cut, %
// Hotspots (slide px): A on the top ring light, B on the turntable, C on the body's
// always-visible middle (the octagon's silhouette never gets narrower than F).
const HOTS = [[PX, 140], [PX - 104, 352], [PX + 38, 198]];
const INFO = { x: 466, y: 112 };

const petalPath = 'M20 2C29 10 37 23 37 35C37 46 29 52 20 52C11 52 3 46 3 35C3 23 11 10 20 2Z';
const petalSvg = () => `<svg viewBox="0 0 40 54"><path d="${petalPath}" fill="url(#ipet)"/><path d="M13 22C15 16 18 11 21 8C20 15 18 21 15 27Z" fill="#fff" opacity=".5"/></svg>`;
const hand = `<svg class="hand" viewBox="0 0 36 44"><path d="M11 5a3 3 0 0 1 6 0v11.2a2.6 2.6 0 0 1 5.2 0v1.4a2.6 2.6 0 0 1 5.2 0v2a2.5 2.5 0 0 1 5 0V30c0 7-5.2 12-12 12h-2.6c-3.6 0-5.8-1.3-8.2-3.8l-6-6.6a3 3 0 0 1 4.3-4.2L11 30.2Z" fill="#fff" stroke="#0B1628" stroke-width="1.7" stroke-linejoin="round"/><path d="M17 16.2V24M22.2 17.6V24.5M27.4 19.6V25" fill="none" stroke="#0B1628" stroke-width="1.5" stroke-linecap="round" opacity=".55"/></svg>`;

// Deterministic decor.
const rand = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
const particles = () => {
  const r = rand(11);
  return Array.from({ length: 14 }, (_, i) => {
    const x = Math.round(440 + r() * 330); const y = Math.round(40 + r() * 330); const s = 3 + Math.round(r() * 3);
    return `<i class="pt${i % 4 ? '' : ' w'}" style="inset-inline-start:${x}px;top:${y}px;width:${s}px;height:${s}px"></i>`;
  }).join('');
};

export default {
  duration: 8,

  copy: {
    en: {
      title: 'Product tour',
      d3: '3D',
      hint: 'Tap to explore',
      stat: '48h',
      statLabel: 'Battery life',
      quiz: 'Quick quiz',
      q: 'Battery life?',
      opts: ['12h', '48h'],
      correct: 'Correct!',
      pts: '+10',
      ptsLabel: 'points',
    },
    ar: {
      title: 'جولة في المنتج',
      d3: '3D',
      hint: 'المس للاستكشاف',
      stat: '48 ساعة',
      statLabel: 'عمر البطارية',
      quiz: 'اختبار سريع',
      q: 'كم تدوم البطارية؟',
      opts: ['12 ساعة', '48 ساعة'],
      correct: 'إجابة صحيحة!',
      pts: '+10',
      ptsLabel: 'نقاط',
    },
  },

  css: (ctx) => {
    const r = ctx.rtl;
    const s = r ? -1 : 1;
    const ui = r ? stack.arabic : stack.display;
    const px = r ? SW - PX : PX;
    return `
.net{position:absolute;inset:0}
.net .n{position:absolute;border-radius:50%;background:var(--brand)}
.fsp{position:absolute;width:28px;height:38px;filter:drop-shadow(0 0 12px rgba(242,141,25,.55))}
.fsp svg,.burst svg{width:100%;height:100%;display:block}

/* display window */
.dsp{position:absolute;inset-inline-start:34px;top:26px;width:800px}
.dsp::before{content:'';position:absolute;inset:90px 50px -24px;border-radius:60px;background:var(--brand);filter:blur(72px);opacity:.45}
.dsp .tilt{position:relative;transform:perspective(2000px) rotateY(${-5 * s}deg) rotateX(3deg);box-shadow:0 50px 100px rgba(2,6,14,.6),0 0 0 1px rgba(90,180,217,.12)}
.dsp .win-bar{background:linear-gradient(180deg,#172A47,#13233D)}
.dsp .win-bar .t{font-family:${r ? stack.arabic : stack.mono}}
.b3d{margin-inline-start:auto;display:flex;align-items:center;gap:8px;padding:5px 14px;border-radius:999px;background:rgba(90,180,217,.14);color:var(--sky);font:700 20px ${stack.mono};direction:ltr}
.sl{position:relative;width:${SW}px;height:${SH}px;overflow:hidden;background:#0A1830}
.sl::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(${r ? 245 : 115}deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,0) 38%)}
.sbg{position:absolute;inset:0;background:radial-gradient(ellipse 52% 70% at ${r ? 100 - 32 : 32}% 52%,#22528D 0%,#163462 42%,#0C1B35 78%,#0A1628 100%)}
.beam{position:absolute;inset-inline-start:${PX - 180}px;top:-30px;width:360px;height:420px;background:linear-gradient(180deg,rgba(120,200,235,.30),rgba(90,180,217,0) 88%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);filter:blur(8px)}
.floor{position:absolute;left:-320px;right:-320px;top:300px;height:400px;
  background-image:linear-gradient(rgba(90,180,217,.22) 2px,transparent 2px),linear-gradient(90deg,rgba(90,180,217,.22) 2px,transparent 2px);background-size:60px 60px;background-position:${r ? SW - PX + 320 : PX + 320}px 0;
  transform:perspective(380px) rotateX(66deg);transform-origin:50% 0;-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 22%,#000 45%,transparent 80%);opacity:.6}
.pt{position:absolute;border-radius:50%;background:var(--sky);opacity:.55;box-shadow:0 0 8px rgba(90,180,217,.8)}
.pt.w{background:var(--amber);box-shadow:0 0 8px rgba(244,179,16,.8)}
.glare{position:absolute;top:-30%;bottom:-30%;inset-inline-start:-300px;width:200px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.16),rgba(255,255,255,0));transform:skewX(${-18 * s}deg)}

/* 3D product on a turntable */
.p3d{position:absolute;inset:0;perspective:1000px;perspective-origin:${px}px ${PCY - 120}px}
.pop{position:absolute;inset-inline-start:${PX}px;top:${PCY}px;width:0;height:0;transform-style:preserve-3d}
.tx{position:absolute;left:0;top:0;transform-style:preserve-3d;transform:rotateX(-20deg)}
.cube{--a:${-25 * s}deg;position:absolute;left:0;top:0;transform-style:preserve-3d;transform:rotateY(var(--a))}
.fc{position:absolute;left:0;top:0;height:${H}px;margin-top:${-H / 2}px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
.fc::after{content:'';position:absolute;inset:0;background:#050E1E;opacity:calc(.46 - .4 * cos(var(--a) + var(--o) + ${35 * s}deg))}
.fc::before{content:'';position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55) 50%,rgba(255,255,255,0));opacity:clamp(0, calc(cos(var(--a) + var(--o) + ${12 * s}deg) * 2.2 - 1.75), .6)}
.fm{width:${W}px;margin-left:${-W / 2}px;transform:rotateY(var(--o)) translateZ(${DM.toFixed(2)}px);background:linear-gradient(180deg,#67C0E3 0%,#4296D1 36%,#3266AC 78%,#2A5592 100%)}
.fk{width:${C}px;margin-left:${-C / 2}px;transform:rotateY(var(--o)) translateZ(${DC.toFixed(2)}px);background:linear-gradient(180deg,#9AD9F2 0%,#57A6DB 40%,#3870B5 100%)}
.emb{position:absolute;left:50%;top:70px;width:56px;height:56px;margin-left:-28px;border-radius:50%;border:5px solid transparent;
  background:linear-gradient(#173560,#173560) padding-box,var(--sparkg) border-box;box-shadow:0 0 18px rgba(242,141,25,.55)}
.emb::after{content:'';position:absolute;left:50%;top:50%;width:14px;height:20px;margin:-11px 0 0 -7px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg)}
.leds{position:absolute;left:26px;right:26px;top:148px;display:flex;flex-direction:column;gap:7px}
.leds i{height:5px;border-radius:3px;background:rgba(255,255,255,.42)}
.leds i:nth-child(2){margin-inline:8px;opacity:.7}.leds i:nth-child(3){margin-inline:16px;opacity:.45}
.grl{position:absolute;left:14px;right:14px;top:22px;bottom:22px;border-radius:16px;background:radial-gradient(circle,rgba(9,22,44,.55) 2.4px,transparent 3px) 0 0/12px 12px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.12)}
.ftop{position:absolute;left:0;top:0;width:${F.toFixed(2)}px;height:${F.toFixed(2)}px;margin:${(-F / 2).toFixed(2)}px 0 0 ${(-F / 2).toFixed(2)}px;
  transform:translateY(${-H / 2}px) rotateX(90deg);clip-path:polygon(${CUT}% 0,${100 - CUT}% 0,100% ${CUT}%,100% ${100 - CUT}%,${100 - CUT}% 100%,${CUT}% 100%,0 ${100 - CUT}%,0 ${CUT}%);
  background:radial-gradient(circle at 42% 40%,#B6E6F8 0%,#7CC8EA 30%,#4C9BD6 70%,#3C7CC0 100%)}
.rl{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;border:7px solid transparent;
  background:radial-gradient(circle,#fff7e0 0%,#ffd38a 30%,rgba(255,211,138,0) 70%) padding-box,var(--sparkg) border-box;box-shadow:0 0 22px rgba(242,141,25,.85)}
.dk{position:absolute;left:0;top:0;width:384px;height:384px;margin:-192px 0 0 -192px;border-radius:50%;transform:translateY(${H / 2 + 1}px) rotateX(90deg);
  background:radial-gradient(circle,rgba(3,8,18,.85) 0%,rgba(3,8,18,.6) 20%,rgba(66,150,209,.34) 25%,rgba(37,82,142,.30) 50%,rgba(37,82,142,.12) 64%,rgba(37,82,142,0) 71%)}
.dk::before{content:'';position:absolute;inset:44px;border-radius:50%;border:3px dashed rgba(120,200,235,.6)}
.dk::after{content:'';position:absolute;inset:26px;border-radius:50%;background:conic-gradient(from 0deg,rgba(242,141,25,0) 0deg,var(--spark) 70deg,rgba(242,141,25,0) 72deg,rgba(242,141,25,0) 180deg,rgba(90,180,217,.0) 180deg,var(--sky) 250deg,rgba(90,180,217,0) 252deg);
  -webkit-mask-image:radial-gradient(circle,transparent 63%,#000 64%,#000 67%,transparent 68%)}
.dk .fl{position:absolute;inset:20px;border-radius:50%;box-shadow:0 0 0 5px rgba(244,179,16,.85),0 0 40px rgba(242,141,25,.8);opacity:0}

/* hotspots + info card */
.hot{position:absolute;width:0;height:0}
.hot i{position:absolute;left:-17px;top:-17px;width:34px;height:34px;border-radius:50%}
.hot .pr{border:3px solid rgba(255,255,255,.9);opacity:0}
.hot .core{background:#fff;display:grid;place-items:center;color:var(--cobalt);box-shadow:0 0 0 5px rgba(255,255,255,.22),0 0 24px rgba(90,180,217,.95)}
.hot .core svg{display:block}
.hot .on{background:var(--sparkg);display:grid;place-items:center;color:#fff;box-shadow:0 0 0 5px rgba(242,141,25,.3),0 0 26px rgba(242,141,25,.95)}
.hot .rp{border:3px solid var(--amber);opacity:0}
.lead{position:absolute;left:0;top:0;width:${SW}px;height:${SH}px;overflow:visible}
.lead path{fill:none;stroke:var(--amber);stroke-width:3;stroke-linecap:round}
.lead circle{fill:var(--amber)}
.info{position:absolute;inset-inline-start:${INFO.x}px;top:${INFO.y}px;display:flex;align-items:center;gap:16px;padding-block:14px;padding-inline:14px 26px;border-radius:26px;
  background:linear-gradient(160deg,rgba(29,55,94,.96),rgba(19,35,61,.96));border:2px solid rgba(90,180,217,.45);box-shadow:0 26px 50px rgba(2,6,14,.6),0 0 0 6px rgba(90,180,217,.07);
  transform-origin:${r ? '100%' : '0%'} 50%;color:var(--ui-text);font-family:${ui}}
.info .ib{width:64px;height:64px;border-radius:20px;background:var(--sparkg);display:grid;place-items:center;color:#0E1A2B;flex:none;box-shadow:0 8px 22px rgba(242,141,25,.45)}
.info b{display:block;font-size:${r ? 34 : 42}px;line-height:1.1;font-weight:800;white-space:nowrap}
.info small{display:block;margin-top:${r ? 2 : 4}px;font-size:${r ? 21 : 21}px;font-weight:${r ? 500 : 600};color:var(--ui-sub);white-space:nowrap}
.lvl{display:flex;gap:5px;margin-top:10px;height:8px}
.lvl i{width:24px;height:8px;border-radius:4px;background:var(--sky);transform-origin:${r ? '100%' : '0%'} 50%}
.lvl i:nth-child(n+4){background:var(--amber)}
.hint{position:absolute;top:22px;inset-inline-start:22px}
.hint .chip{background:rgba(10,22,40,.6);font-family:${ui};font-weight:700;font-size:${r ? 21 : 21}px;padding-block:9px;padding-inline:12px 20px}
.hint .chip .hi{width:32px;height:32px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center}
.dots{position:absolute;inset-inline-start:30px;bottom:26px;height:14px;display:flex;gap:20px;align-items:center}
.dots i{position:relative;width:12px;height:12px;border-radius:50%;background:rgba(147,169,198,.3)}
.dots i b{position:absolute;inset:0;border-radius:50%;background:var(--sky)}
.dots i:nth-child(n+3) b{opacity:0}
.dots .act{position:absolute;top:-1px;inset-inline-start:-12px;width:36px;height:14px;border-radius:7px;background:var(--sparkg);box-shadow:0 0 14px rgba(242,141,25,.7);transform:translateX(${64 * s}px)}

/* quiz card: pops out of the screen and flips */
.qwrap{position:absolute;inset-inline-end:14px;top:458px;width:360px;height:228px;perspective:1200px}
.qin{position:absolute;inset:0;transform-origin:50% 100%}
.qtilt{position:absolute;inset:0;transform-style:preserve-3d;transform:perspective(1400px) rotateY(${-9 * s}deg) rotateX(5deg)}
.flip{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateY(180deg)}
.face{position:absolute;inset:0;border-radius:28px;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:var(--card);border:2px solid var(--card-line);box-shadow:0 40px 80px rgba(2,6,14,.6);color:var(--ui-text);font-family:${ui}}
.front{padding:20px 22px}
.qtag{display:inline-flex;align-items:center;gap:8px;height:36px;padding-inline:12px 16px;border-radius:999px;background:rgba(242,141,25,.16);color:var(--amber);font-size:${r ? 20 : 20}px;font-weight:700}
.qq{display:block;margin-top:${r ? 8 : 12}px;font-size:${r ? 29 : 31}px;line-height:${r ? 1.45 : 1.25};font-weight:800;white-space:nowrap}
.opts{position:absolute;inset-inline:18px;bottom:20px;display:flex;gap:10px}
.opt{position:relative;flex:1 1 0;min-width:0;height:66px;border-radius:18px;background:var(--soft);border:2px solid var(--card-line);display:flex;align-items:center;gap:${r ? 10 : 12}px;padding-inline:${r ? 14 : 16}px;font-size:${r ? 22 : 26}px;font-weight:${r ? 700 : 800};white-space:nowrap}
.opt .rd{width:${r ? 22 : 24}px;height:${r ? 22 : 24}px;border-radius:50%;border:3px solid var(--ui-sub);flex:none}
.opt .ohv{position:absolute;inset:-2px;border-radius:18px;border:3px solid var(--sky);box-shadow:0 0 18px rgba(90,180,217,.5);opacity:0}
.opt .osel{position:absolute;inset:-2px;border-radius:18px;background:var(--sparkg);color:#0E1A2B;display:flex;align-items:center;gap:${r ? 10 : 12}px;padding-inline:${r ? 14 : 16}px;box-shadow:0 10px 26px rgba(242,141,25,.45)}
.opt .osel .ok{width:${r ? 24 : 26}px;height:${r ? 24 : 26}px;border-radius:50%;background:#0E1A2B;color:var(--amber);display:grid;place-items:center;flex:none}
.opt .orip{position:absolute;inset-inline-start:calc(74% - 22px);top:calc(50% - 12px);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.55);opacity:0}
.back{transform:rotateY(180deg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${r ? 2 : 6}px;
  background:radial-gradient(ellipse 80% 70% at 50% 18%,rgba(34,197,94,.20),rgba(34,197,94,0) 70%),linear-gradient(170deg,#1A3358,#13233D)}
.back .clip{position:absolute;inset:0;border-radius:26px;overflow:hidden}
.back .shine{position:absolute;top:-20%;bottom:-20%;inset-inline-start:-150px;width:100px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.2),rgba(255,255,255,0));transform:skewX(${-20 * s}deg)}
.back .gl{position:absolute;inset:-2px;border-radius:28px;box-shadow:0 0 0 3px rgba(34,197,94,.7),0 0 46px rgba(34,197,94,.45);opacity:.55}
.ck{width:78px;height:78px;overflow:visible}
.ck .cc{fill:#22C55E;filter:drop-shadow(0 0 12px rgba(34,197,94,.7))}
.ck .cp{fill:none;stroke:#fff;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.back .cr{font-size:${r ? 32 : 38}px;line-height:${r ? 1.4 : 1.15};font-weight:800;white-space:nowrap}
.back .pts{display:inline-flex;align-items:center;gap:8px;height:40px;padding-inline:16px;border-radius:999px;background:var(--sparkg);color:#0E1A2B;font-size:${r ? 20 : 21}px;font-weight:800;white-space:nowrap}
.back .pts bdi{direction:ltr;unicode-bidi:isolate;font-family:${stack.display}}
.burst{position:absolute;left:180px;top:62px;width:0;height:0}
.burst .cf{position:absolute;left:-9px;top:-12px;width:18px;height:24px;opacity:0;filter:drop-shadow(0 0 6px rgba(242,141,25,.6))}
.burst .bd{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:var(--sky);opacity:0;box-shadow:0 0 10px rgba(90,180,217,.8)}

/* floating tile + cursor */
.tile{position:absolute;inset-inline-start:48px;top:572px;width:118px;height:118px}
.tile .ti{width:118px;height:118px;border-radius:34px;background:var(--brand);display:grid;place-items:center;color:#fff;transform:rotate(${-10 * s}deg);box-shadow:0 26px 60px rgba(20,50,100,.6),inset 0 2px 0 rgba(255,255,255,.35)}
.cur{position:absolute;left:0;top:0;width:52px;height:64px;margin:-3px 0 0 -20px;z-index:20}
.cur .hm{width:52px;height:64px;transform-origin:20px 3px${r ? ';transform:scaleX(-1)' : ''}}
.cur .hand{width:52px;height:64px;display:block;transform-origin:20px 3px;filter:drop-shadow(0 12px 16px rgba(2,6,14,.55))}
.cur .tg{position:absolute;left:-8px;top:-17px;width:56px;height:56px;margin:0;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(90,180,217,.5) 45%,rgba(90,180,217,0) 70%);opacity:0}
`;
  },

  html: ({ copy, rtl }) => {
    const mx = (x) => (rtl ? SW - x : x);
    const [hcx, hcy] = HOTS[2];
    const ex = INFO.x - 4;
    const ey = INFO.y + 54;
    const lead = `M ${mx(hcx + 20)} ${hcy} C ${mx(hcx + 110)} ${hcy}, ${mx(ex - 90)} ${ey}, ${mx(ex)} ${ey}`;
    const faces = Array.from({ length: 8 }, (_, i) => {
      const o = i * 45;
      if (i % 2) return `<div class="fc fk" style="--o:${o}deg"></div>`;
      const deco = i % 4 === 0 ? '<i class="emb"></i><span class="leds"><i></i><i></i><i></i></span>' : '<i class="grl"></i>';
      return `<div class="fc fm" style="--o:${o}deg">${deco}</div>`;
    }).join('');
    const burst = Array.from({ length: 18 }, (_, i) => (i % 3 === 2 ? '<i class="bd"></i>' : `<i class="cf">${petalSvg()}</i>`)).join('');
    return `${gooFilter}
<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="ipet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset=".55" stop-color="#F28D19"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
</defs></svg>
<div class="net goo">
  <div class="n" style="width:150px;height:150px;inset-inline-start:748px;top:40px"></div>
  <div class="n" style="width:92px;height:92px;inset-inline-start:796px;top:176px"></div>
  <div class="n" style="width:64px;height:64px;inset-inline-start:704px;top:24px"></div>
  <div class="n" style="width:160px;height:160px;inset-inline-start:0;top:520px"></div>
  <div class="n" style="width:96px;height:96px;inset-inline-start:130px;top:612px"></div>
  <div class="n" style="width:74px;height:74px;inset-inline-start:10px;top:440px"></div>
</div>
<div class="fsp" style="inset-inline-start:866px;top:250px;transform:rotate(30deg)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:6px;top:150px;transform:rotate(-140deg) scale(.8)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:360px;top:600px;transform:rotate(70deg) scale(.75)">${petalSvg()}</div>
<div class="tile"><div class="ti">${ico('presentation', { size: 60, stroke: 1.8 })}</div></div>
<div class="dsp"><div class="tilt win">
  <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span><span class="t">${copy.title}</span><span class="b3d">${ico('rotate-3d', { size: 20 })}${copy.d3}</span></div>
  <div class="sl">
    <div class="sbg"></div>
    <div class="beam"></div>
    <div class="floor"></div>
    ${particles()}
    <div class="p3d"><div class="pop"><div class="tx"><div class="cube">
      <div class="dk"><i class="fl"></i></div>
      ${faces}
      <div class="ftop"><i class="rl"></i></div>
    </div></div></div></div>
    <svg class="lead" viewBox="0 0 ${SW} ${SH}"><path d="${lead}"/><circle cx="${mx(ex)}" cy="${ey}" r="6"/></svg>
    ${HOTS.map(([x, y], i) => `<div class="hot h${i}" style="inset-inline-start:${x}px;top:${y}px"><i class="pr"></i>${i === 2 ? '<i class="rp"></i><i class="rp"></i>' : ''}<i class="core">${ico('plus', { size: 20, stroke: 3.2 })}</i>${i === 2 ? `<i class="on">${ico('battery-full', { size: 18, stroke: 2.6 })}</i>` : ''}</div>`).join('')}
    <div class="info"><span class="ib">${ico('battery-full', { size: 34, stroke: 2.2 })}</span><div><b>${copy.stat}</b><small>${copy.statLabel}</small><span class="lvl"><i></i><i></i><i></i><i></i><i></i></span></div></div>
    <div class="hint"><span class="chip"><span class="hi">${ico('pointer', { size: 18, stroke: 2.4 })}</span>${copy.hint}</span></div>
    <div class="dots"><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i><span class="act"></span></div>
    <div class="glare"></div>
  </div>
</div></div>
<div class="qwrap"><div class="qin"><div class="qtilt"><div class="flip">
  <div class="face front">
    <span class="qtag">${ico('sparkles', { size: 20, stroke: 2.4 })}${copy.quiz}</span>
    <b class="qq">${copy.q}</b>
    <div class="opts">
      <span class="opt"><i class="rd"></i>${copy.opts[0]}</span>
      <span class="opt ok"><i class="rd"></i>${copy.opts[1]}<i class="ohv"></i><span class="osel"><i class="ok">${ico('check', { size: 18, stroke: 3.5 })}</i>${copy.opts[1]}</span><i class="orip"></i></span>
    </div>
  </div>
  <div class="face back">
    <i class="gl"></i><span class="clip"><i class="shine"></i></span>
    <svg class="ck" viewBox="0 0 80 80"><circle class="cc" cx="40" cy="40" r="36"/><path class="cp" d="M24 41.5 L35 52.5 L57 29.5"/></svg>
    <b class="cr">${copy.correct}</b>
    <span class="pts"><bdi>${copy.pts}</bdi>${copy.ptsLabel}</span>
  </div>
</div></div></div><div class="burst">${burst}</div></div>
<div class="cur"><i class="tg"></i><div class="hm">${hand}</div></div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const S = ctx.rtl ? -1 : 1;
    const sine = 'sine.inOut';
    const q = (sel) => document.querySelector(sel);
    const all = (sel) => gsap.utils.toArray(sel);

    // ---- Geometry, measured from the rendered layout (scene px) ----
    const box = q('.scene').getBoundingClientRect();
    const k = box.width / 904;
    const at = (sel) => {
      const r = q(sel).getBoundingClientRect();
      return { x: (r.left + r.width / 2 - box.left) / k, y: (r.top + r.height / 2 - box.top) / k, w: r.width / k };
    };
    const flipEl = q('.flip');
    flipEl.style.transform = 'none';
    const OPT = at('.opt.ok');
    flipEl.style.transform = '';
    const HOT = at('.h2 .core');
    // Floats are added back in so the taps land exactly.
    const inOut = (p) => -(Math.cos(Math.PI * p) - 1) / 2;
    const bob = (t, amp, half) => { const c = t % (2 * half); return amp * (c < half ? inOut(c / half) : inOut(2 - c / half)); };
    const T1 = 2.3; // tap the hotspot
    const T2 = 4.45; // tap the answer
    const P_HOT = { x: HOT.x, y: HOT.y + bob(T1, -6, D / 2) };
    // Tap the answer near its end edge so the hand never hides the label.
    const P_OPT = { x: OPT.x + OPT.w * 0.24 * S, y: OPT.y + 10 + bob(T2, 8, D / 4) };
    const P_REST = { x: OPT.x + (OPT.w * 0.24 + 18) * S, y: OPT.y + 30 };
    gsap.set('.cur', { x: P_REST.x, y: P_REST.y });
    gsap.set('.flip', { rotationY: 180 });
    gsap.set('.ck .cc', { transformOrigin: '50% 50%' });
    gsap.set('.lead circle', { transformOrigin: '50% 50%' });

    // ---- Ambient loops (whole cycles) ----
    tl.fromTo('.cube', { '--a': `${-25 * S}deg` }, { '--a': `${335 * S}deg`, duration: D, ease: 'none' }, 0);
    gsap.utils.toArray('.net .n').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -14), y: (i % 3 ? -14 : 18), scale: 1 + (i % 3) * 0.07, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    });
    tl.to('.fsp', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.dsp', { y: -6, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.qwrap', { y: 8, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.tile', { y: -12, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.tile .ti', { rotation: -4 * S, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.beam', { opacity: 0.65, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.rl', { opacity: 0.75, duration: D / 8, ease: sine, repeat: 7, yoyo: true }, 0);
    all('.pt').forEach((p, i) => {
      tl.to(p, { y: -(14 + (i % 4) * 8), x: (i % 2 ? 8 : -8), duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
      const n = 1 + (i % 3);
      tl.to(p, { opacity: 0.15, duration: D / (2 * n), ease: sine, repeat: 2 * n - 1, yoyo: true }, 0);
    });
    // Hotspot sonar rings: periodic eases give each ring its own phase and still close the loop.
    const saw = (n, ph) => (p) => (p * n + ph) % 1;
    const bump = (n, ph) => (p) => { const u = (p * n + ph) % 1; return u < 0.2 ? u / 0.2 : (1 - u) / 0.8; };
    all('.hot').forEach((h, i) => {
      const ph = [0.15, 0.5, 0.85][i];
      const ring = h.querySelector('.pr');
      gsap.set(ring, { scale: 0.8 + 1.8 * saw(5, ph)(0), opacity: 0.9 * bump(5, ph)(0) });
      tl.fromTo(ring, { scale: 0.8 }, { scale: 2.6, duration: D, ease: saw(5, ph) }, 0);
      tl.fromTo(ring, { opacity: 0 }, { opacity: 0.9, duration: D, ease: bump(5, ph) }, 0);
    });

    // ---- Clear (0.9 s): cards close, the slide resets ----
    tl.to('.info', { opacity: 0, scale: 0.55, x: -20 * S, duration: 0.38, ease: 'power2.in' }, 0.92);
    tl.to('.lead path', { drawSVG: '0%', duration: 0.32, ease: 'power2.in' }, 0.98);
    tl.to('.lead circle', { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.92);
    tl.to('.h2 .on', { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power2.in' }, 1.05);
    tl.to('.qin', { opacity: 0, y: 70, rotationX: -32, scale: 0.9, duration: 0.45, ease: 'power2.in' }, 0.95);
    tl.to('.glare', { x: 1300 * S, duration: 1.0, ease: 'power2.inOut' }, 1.0);
    tl.fromTo('.dots .act', { x: 64 * S }, { x: 0, duration: 0.65, ease: 'power3.inOut' }, 1.05);
    tl.fromTo('.dots .act', { scaleX: 1 }, { scaleX: 1.5, duration: 0.32, ease: 'power2.out', repeat: 1, yoyo: true }, 1.05);
    tl.to(['.dots i:nth-child(2) b', '.dots i:nth-child(1) b'], { opacity: 0, duration: 0.3, stagger: 0.12 }, 1.05);
    // Reset the (hidden) quiz card to its question side.
    tl.set('.flip', { rotationY: 0 }, 1.5);
    tl.set('.osel', { opacity: 0 }, 1.5);
    tl.set('.ck .cp', { drawSVG: '0%' }, 1.5);
    tl.set(['.ck .cc', '.back .cr', '.back .pts'], { opacity: 0, scale: 0.5 }, 1.5);
    tl.set('.back .gl', { opacity: 0 }, 1.5);
    tl.fromTo('.hint .chip', { scale: 1 }, { scale: 1.07, duration: 0.25, ease: 'power2.out', repeat: 1, yoyo: true }, 1.55);
    tl.fromTo('.hint .hi', { rotation: 0 }, { rotation: -14 * S, duration: 0.18, ease: sine, repeat: 3, yoyo: true }, 1.55);

    // ---- Demo: the cursor glides in and taps the hotspot ----
    const mid = (a, b, dx, dy) => ({ x: (a.x + b.x) / 2 + dx, y: (a.y + b.y) / 2 + dy });
    tl.to('.cur', { motionPath: { path: [mid(P_REST, P_HOT, 30 * S, 70), P_HOT], curviness: 1.2 }, duration: 1.15, ease: 'power2.inOut' }, T1 - 1.18);
    const tap = (t) => {
      tl.fromTo('.cur .hand', { scale: 1 }, { scale: 0.84, duration: 0.11, ease: 'power2.out', repeat: 1, yoyo: true }, t - 0.06);
      tl.fromTo('.cur .tg', { scale: 0.3, opacity: 0.95 }, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.out' }, t);
    };
    tap(T1);
    tl.fromTo('.h2 .rp', { scale: 0.5, opacity: 0.95 }, { scale: 3.2, opacity: 0, duration: 0.75, stagger: 0.14, ease: 'power2.out' }, T1);
    tl.fromTo('.h2 .on', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, T1 + 0.02);
    tl.fromTo('.pop', { scale: 1 }, { scale: 1.05, duration: 0.22, ease: 'power2.out', repeat: 1, yoyo: true }, T1);
    // ...the info card pops out along its leader line...
    tl.fromTo('.lead path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, T1 + 0.1);
    tl.fromTo('.lead circle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, T1 + 0.42);
    tl.fromTo('.info', { opacity: 0, scale: 0.55, x: -20 * S }, { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'back.out(1.6)' }, T1 + 0.3);
    tl.fromTo('.info .ib', { scale: 0.5, rotation: -25 * S }, { scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(2.2)' }, T1 + 0.4);
    tl.fromTo('.lvl i', { scaleX: 0 }, { scaleX: 1, duration: 0.3, stagger: 0.07, ease: 'power2.out' }, T1 + 0.55);
    // ...and the slide dots advance.
    tl.fromTo('.dots .act', { x: 0 }, { x: 32 * S, duration: 0.6, ease: 'power3.inOut' }, T1 + 0.4);
    tl.fromTo('.dots .act', { scaleX: 1 }, { scaleX: 1.5, duration: 0.3, ease: 'power2.out', repeat: 1, yoyo: true }, T1 + 0.4);
    tl.fromTo('.dots i:nth-child(1) b', { opacity: 0 }, { opacity: 1, duration: 0.3 }, T1 + 0.5);

    // ---- The quiz card rises out of the screen; the right answer is tapped ----
    tl.fromTo('.qin', { opacity: 0, y: 70, rotationX: -32, scale: 0.9 }, { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.75, ease: 'back.out(1.3)' }, T1 + 0.72);
    tl.to('.cur', { motionPath: { path: [mid(P_HOT, P_OPT, 60 * S, -30), P_OPT], curviness: 1.1 }, duration: 1.15, ease: 'power2.inOut' }, T2 - 1.25);
    tl.fromTo('.ohv', { opacity: 0 }, { opacity: 1, duration: 0.2 }, T2 - 0.25);
    tap(T2);
    tl.fromTo('.orip', { scale: 0.3, opacity: 0.9 }, { scale: 4, opacity: 0, duration: 0.55, ease: 'power2.out' }, T2);
    tl.fromTo('.osel', { opacity: 0 }, { opacity: 1, duration: 0.22 }, T2 + 0.04);
    tl.fromTo('.osel .ok', { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, T2 + 0.08);
    tl.to('.ohv', { opacity: 0, duration: 0.3 }, T2 + 0.3);
    // ...flip to "Correct!"...
    const TF = T2 + 0.3;
    tl.fromTo('.flip', { rotationY: 0 }, { rotationY: 180, duration: 0.8, ease: 'power3.inOut' }, TF);
    tl.fromTo('.qin', { scale: 1 }, { scale: 1.06, duration: 0.4, ease: 'power2.out', repeat: 1, yoyo: true }, TF);
    const TB = TF + 0.42; // back face turns towards the viewer
    tl.fromTo('.back .gl', { opacity: 0 }, { opacity: 1, duration: 0.25 }, TB);
    tl.to('.back .gl', { opacity: 0.55, duration: 0.9, ease: sine }, TB + 0.5);
    tl.fromTo('.back .shine', { x: 0 }, { x: 620 * S, duration: 0.9, ease: 'power2.inOut' }, TB + 0.3);
    tl.fromTo('.ck .cc', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' }, TB);
    tl.fromTo('.ck .cp', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, ease: 'power2.out' }, TB + 0.2);
    tl.fromTo('.back .cr', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, TB + 0.12);
    tl.fromTo('.back .pts', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.6)' }, TB + 0.28);
    // ...with a burst of spark petals...
    const ANG = [-176, -158, -140, -124, -110, -96, -82, -68, -54, -40, -26, -166, -132, -104, -88, -60, -148, -116];
    all('.burst i').forEach((p, i) => {
      const a = (ANG[i] * Math.PI) / 180;
      const rad = 120 + ((i * 37) % 80);
      const X = Math.cos(a) * rad * S - 20 * S;
      const Y = Math.sin(a) * rad * 0.9;
      const r0 = (i * 53) % 360;
      const t0 = TB + 0.05 + (i % 4) * 0.02;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.2, rotation: r0, opacity: 1 }, { x: X, y: Y, scale: 0.85 + (i % 3) * 0.2, rotation: r0 + 160 * S, duration: 0.6, ease: 'power3.out' }, t0);
      tl.to(p, { x: X * 1.1, y: Y + 60, rotation: r0 + 250 * S, duration: 0.75, ease: 'power1.in' }, t0 + 0.6);
      tl.to(p, { opacity: 0, duration: 0.4, ease: 'power1.in' }, t0 + 0.95);
    });
    tl.fromTo('.pop', { scale: 1 }, { scale: 1.06, duration: 0.25, ease: 'power2.out', repeat: 1, yoyo: true }, TB);
    tl.fromTo('.dk .fl', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out', repeat: 1, yoyo: true, repeatDelay: 0.2 }, TB);
    // ...the dots advance again and the cursor settles.
    tl.fromTo('.dots .act', { x: 32 * S }, { x: 64 * S, duration: 0.6, ease: 'power3.inOut' }, TB + 0.15);
    tl.fromTo('.dots .act', { scaleX: 1 }, { scaleX: 1.5, duration: 0.3, ease: 'power2.out', repeat: 1, yoyo: true }, TB + 0.15);
    tl.fromTo('.dots i:nth-child(2) b', { opacity: 0 }, { opacity: 1, duration: 0.3 }, TB + 0.25);
    tl.to('.cur', { x: P_REST.x, y: P_REST.y, duration: 0.8, ease: 'power2.inOut' }, TB + 0.2);
  },
};
