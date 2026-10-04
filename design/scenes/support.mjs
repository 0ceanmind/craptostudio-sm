// Support / mentoring: "You code. We guide."
// A dark code editor (game_loop.py) with a bug: the while-loop never ends. The mentor never
// touches the code: a comment bubble pops beside the bug and asks a guiding question. The
// student's own caret (name tag "You") glides to the right line and types the fix, the wavy
// underline melts away, the test card fills to "12 tests passed" and a "Hackathon ready"
// badge pops. Frame 0 is the solved state (fix in place, tests green, mentor praising).
// Loop: hold → rewind to the buggy state → question → student types the fix → pass → hold.
//
// Code is always LTR (even in Arabic); the composition mirrors around it: in Arabic the editor
// sits on the right and the mentor's bubble points into its gutter from the left.
import { ico, gooFilter, symbolPng } from '../motion/ui.mjs';
import { stack } from '../fonts.mjs';

// Editor geometry (px, inside the code body, always LTR).
const FS = 25; // code font size
const CW = 15; // JetBrains Mono advance (600/1000 em): a whole pixel, so layout never rounds it
const LH = 48; // line height
const PADT = 18; // body top padding
const X0 = 84; // code start (after the gutter)
const BODY_H = PADT + 7 * LH + 22;
const ED_TOP = 92;
const lineTop = (k) => PADT + (k - 1) * LH; // k is 1-based
// Scene y of a line centre (editor top + border + bar + body offset).
const lineMid = (k) => ED_TOP + 2 + 58 + lineTop(k) + LH / 2;

// The mentor's pointer (a multiplayer cursor, never a caret): its tip rests by the student's
// "You" tag (frame 0: "Nice, you found it!"), and points at the bug while the mentor asks.
// Body coordinates, always LTR like the code. The animation offsets mirror these numbers.
const PTR_REST = { x: 444, y: 306 };

const petalPath = 'M20 2C29 10 37 23 37 35C37 46 29 52 20 52C11 52 3 46 3 35C3 23 11 10 20 2Z';
const petalSvg = () => `<svg viewBox="0 0 40 54"><path d="${petalPath}" fill="url(#spet)"/><path d="M13 22C15 16 18 11 21 8C20 15 18 21 15 27Z" fill="#fff" opacity=".55"/></svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const words = (s) => s.split(' ').map((w) => `<span class="w">${esc(w)}</span>`).join(' ');

// Syntax-coloured tokens per line: [class, text]. Line 6 is the student's fix.
const CODE = [
  [['v', 'lives'], ['o', ' = '], ['n', '3']],
  [['k', 'while'], ['v', ' lives '], ['o', '>'], ['n', ' 0'], ['o', ':']],
  [['', '    '], ['f', 'draw'], ['o', '()']],
  [['', '    '], ['k', 'if'], ['', ' '], ['f', 'hit'], ['o', '():']],
  [['', '        '], ['f', 'flash'], ['o', '()']],
  [['', '        '], ['v', 'lives'], ['', ' '], ['o', '-='], ['', ' '], ['n', '1']],
  [['f', 'print'], ['o', '('], ['s', '"Game over"'], ['o', ')']],
];
const FIX_LINE = 6;
const FIX_COL = 8; // the fix starts after 8 spaces of indentation
const FIX_LEN = 10; // "lives -= 1"
const BUG_LINE = 2;
const BUG_LEN = 15; // "while lives > 0"

function codeRows() {
  return CODE.map((toks, i) => {
    const k = i + 1;
    let inner;
    if (k === FIX_LINE) {
      // Typed by the student, one character at a time.
      inner = toks.map(([c, t]) => (c === '' && /^ +$/.test(t) && t.length > 1
        ? t
        : [...t].map((ch) => `<span class="ch ${c}">${ch === ' ' ? ' ' : esc(ch)}</span>`).join(''))).join('');
    } else {
      inner = toks.map(([c, t]) => (c ? `<span class="${c}">${esc(t)}</span>` : t)).join('');
    }
    return `<div class="row r${k}" style="top:${lineTop(k)}px"><span class="no">${k}</span><span class="cd">${inner}</span></div>`;
  }).join('');
}

// Wavy underline under "while lives > 0".
function squiggle() {
  const w = BUG_LEN * CW;
  let d = 'M 2 5';
  for (let x = 2, up = true; x < w; x += 6, up = !up) d += ` Q ${x + 3} ${up ? 0 : 10} ${x + 6} 5`;
  return `<svg class="sq" style="left:${X0}px;top:${lineTop(BUG_LINE) + 38}px" width="${w + 8}" height="10" viewBox="0 0 ${w + 8} 10"><path d="${d}"/></svg>`;
}

// Minimap bars (one per code line), purely decorative.
function minimap() {
  return CODE.map((toks, i) => {
    const text = toks.map(([, t]) => t).join('');
    const lead = text.length - text.trimStart().length;
    const len = text.trim().length;
    const col = ['#F28D19', '#5AB4D9', '#93A9C6', '#F4B310'][i % 4];
    return `<i style="top:${i * 9}px;left:${lead * 2}px;width:${len * 2.4}px;background:${col}"></i>`;
  }).join('');
}

export default {
  duration: 8,

  copy: {
    en: {
      file: 'game_loop.py',
      file2: 'player.py',
      mentor: 'Mentor',
      ask: 'Why does this loop never stop?',
      praise: 'Nice, you found it!',
      you: 'You',
      cmd: '$ pytest',
      tests: '12 tests passed',
      badge: 'Hackathon ready',
    },
    ar: {
      file: 'game_loop.py',
      file2: 'player.py',
      mentor: 'المرشد',
      ask: 'لماذا لا تتوقف هذه الحلقة؟',
      praise: 'أحسنت، وجدتها!',
      you: 'أنت',
      cmd: '$ pytest',
      tests: 'نجح 12 اختبارًا',
      badge: 'جاهز للهاكاثون',
    },
  },

  css: (ctx) => {
    const r = ctx.rtl;
    const ui = r ? stack.arabic : stack.display;
    return `
.sp{position:absolute;inset:0}
.sp-halo{position:absolute;inset-inline-start:-40px;top:40px;width:720px;height:640px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(90,180,217,.42),rgba(90,180,217,.14) 55%,rgba(90,180,217,0))}
.net{position:absolute;inset:0}
.net .n{position:absolute;border-radius:50%;background:var(--brand)}
.fsp{position:absolute;width:30px;height:42px;filter:drop-shadow(0 0 12px rgba(242,141,25,.55))}
.fsp svg{width:100%;height:100%;display:block}

/* floating icon tiles */
.tile{position:absolute;width:78px;height:78px}
.tile .ti{width:100%;height:100%;border-radius:24px;display:grid;place-items:center;color:#fff;
  box-shadow:0 22px 44px rgba(3,8,18,.38),inset 0 2px 0 rgba(255,255,255,.35)}
.tile.bulb{inset-inline-start:808px;top:58px}
.tile.bulb .ti{background:var(--sparkg);transform:rotate(${r ? -12 : 12}deg)}
.tile.cap{inset-inline-start:0;top:34px}
.tile .gl{position:absolute;left:50%;top:50%;width:170px;height:170px;margin:-85px 0 0 -85px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(244,179,16,.75),rgba(242,141,25,.28) 50%,rgba(242,141,25,0));opacity:0}
.tile.cap .ti{background:linear-gradient(135deg,#5AB4D9,#4296D1 55%,#2C5C9E);transform:rotate(${r ? 10 : -10}deg)}

/* editor */
.ed-w{position:absolute;inset-inline-start:30px;top:${ED_TOP}px;width:556px}
.ed-w::before{content:'';position:absolute;inset:60px 20px -24px;border-radius:50px;background:var(--brand);filter:blur(60px);opacity:.55}
.ed,.beam{transform:perspective(1800px) rotateY(${r ? -5 : 5}deg) rotateX(4deg)}
.beam{position:absolute;inset:0;border-radius:26px;padding:3px;z-index:2;--a:0deg;
  background:conic-gradient(from var(--a),rgba(90,180,217,0) 0deg 230deg,rgba(90,180,217,.9) 300deg,#F4B310 345deg,rgba(244,179,16,0) 360deg);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;filter:drop-shadow(0 0 6px rgba(90,180,217,.8))}
.ed{position:relative;background:#0C1830;
  border-color:rgba(90,180,217,.28);box-shadow:0 50px 90px rgba(3,8,18,.6),0 0 0 1px rgba(90,180,217,.10)}
.ed .win-bar{background:linear-gradient(180deg,#152846,#11203A);gap:9px}
.tab{display:flex;align-items:center;gap:8px;height:58px;padding-inline:14px;font:600 20px ${stack.mono};color:var(--ui-sub);position:relative;white-space:nowrap}
.tab .ico{color:var(--sky)}
.tab.on{margin-inline-start:12px;color:#fff;background:rgba(90,180,217,.10)}
.tab.on .ico{color:var(--amber)}
.tab.on::after{content:'';position:absolute;inset-inline:10px;bottom:0;height:3px;border-radius:2px;background:var(--sparkg)}
.tab.off{opacity:.7}
.pres{margin-inline-start:auto;display:flex;align-items:center}
.pres i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;box-shadow:0 0 0 3px #13233D}
.pres .pm{background:#fff}
.pres .pm img{width:24px;display:block}
.pres .pu{background:var(--sparkg);color:#0E1A2B;margin-inline-start:-8px}
.eb{position:relative;height:${BODY_H}px;direction:ltr;overflow:hidden;background:linear-gradient(180deg,#0E1C34,#0A1527)}
.row{position:absolute;left:0;right:0;height:${LH}px;line-height:${LH}px;white-space:pre;font:500 ${FS}px ${stack.mono};color:#E6EEF8}
.row .no{position:absolute;left:0;width:52px;text-align:right;font-size:22px;color:rgba(147,169,198,.5)}
.row .cd{position:absolute;left:${X0}px}
.row .k{color:#F28D19;font-weight:700}
.row .f{color:#5AB4D9}
.row .s,.row .n{color:#F4B310}
.row .o{color:#93A9C6}
.row .v{color:#E6EEF8}
.ch{display:inline-block}
.band{position:absolute;left:0;right:0;height:${LH}px}
.band.act{top:${lineTop(FIX_LINE)}px;background:rgba(90,180,217,.08);box-shadow:inset 3px 0 0 rgba(90,180,217,.5)}
.band.err{top:${lineTop(BUG_LINE)}px;background:linear-gradient(90deg,rgba(236,108,28,.28),rgba(236,108,28,.05) 70%,rgba(236,108,28,0));opacity:0}
.band.ok{top:${lineTop(FIX_LINE)}px;background:linear-gradient(90deg,rgba(34,197,94,.30),rgba(34,197,94,.06) 70%,rgba(34,197,94,0));opacity:0}
.gdot{position:absolute;left:61px;top:${lineTop(BUG_LINE) + LH / 2 - 7}px;width:14px;height:14px;border-radius:50%;background:#EC6C1C;box-shadow:0 0 12px 2px rgba(236,108,28,.8);transform:scale(0)}
.gping{position:absolute;left:54px;top:${lineTop(BUG_LINE) + LH / 2 - 14}px;width:28px;height:28px;border-radius:50%;border:3px solid #F28D19;opacity:0}
.gbar{position:absolute;left:66px;top:${lineTop(FIX_LINE) + 8}px;width:5px;height:${LH - 16}px;border-radius:3px;background:#22C55E;box-shadow:0 0 10px rgba(34,197,94,.7);transform-origin:50% 50%}
.sq{position:absolute;overflow:visible;opacity:0}
.sq path{fill:none;stroke:#F28D19;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 4px rgba(236,108,28,.9))}
.cur{position:absolute;left:${X0 + (FIX_COL + FIX_LEN) * CW}px;top:${lineTop(FIX_LINE) + 8}px;height:${LH - 16}px;width:0}
.cur .cb{position:absolute;left:2px;top:0;width:3px;height:100%;border-radius:2px;background:#F4B310;box-shadow:0 0 10px rgba(244,179,16,.9)}
.cur .fl{position:absolute;left:13px;top:-3px;height:38px;padding:0 13px;border-radius:11px 11px 11px 3px;background:var(--sparkg);color:#0E1A2B;
  font:800 22px ${ui};line-height:${r ? 35 : 38}px;white-space:nowrap;box-shadow:0 6px 16px rgba(236,108,28,.35)}
/* mentor pointer */
.mp{position:absolute;left:${PTR_REST.x - 3}px;top:${PTR_REST.y - 2}px;width:30px;height:38px;z-index:3}
.mp .mpi{position:absolute;inset:0}
.mp .pa{position:absolute;left:0;top:0;width:30px;height:38px;overflow:visible;filter:drop-shadow(0 6px 10px rgba(3,8,18,.55))}
.mp .pa path{fill:url(#mpg);stroke:#fff;stroke-width:2.4;stroke-linejoin:round}
.mp .ma{position:absolute;left:24px;top:22px;width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center;
  box-shadow:0 0 0 3px var(--sky),0 10px 18px rgba(3,8,18,.5)}
.mp .ma img{width:25px;display:block}
.mp .pr{position:absolute;left:-13px;top:-14px;width:32px;height:32px;border-radius:50%;border:3px solid var(--sky);opacity:0}
.shine{position:absolute;top:-30px;bottom:-30px;left:0;width:160px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(207,240,255,.16),rgba(255,255,255,0));transform:translateX(-260px) skewX(-18deg)}
.fx{position:absolute;left:${X0 + (FIX_COL + FIX_LEN) * CW + 2}px;top:${lineTop(FIX_LINE) + LH / 2}px;width:0;height:0}
.fx .mp{position:absolute;left:-7px;top:-10px;width:14px;height:20px;opacity:0}
.fx .mp svg{width:100%;height:100%;display:block}
.mm{position:absolute;right:16px;top:${PADT}px;width:72px;height:80px;padding:8px 6px;border-radius:8px;background:rgba(147,169,198,.07);box-shadow:inset 0 0 0 1px rgba(147,169,198,.12);opacity:.55}
.mm i{position:absolute;height:5px;border-radius:3px;margin:8px 0 0 8px}

/* mentor bubble */
.mb-w{position:absolute;inset-inline-end:16px;top:146px;width:300px}
.mb{position:relative;background:#fff;color:#0E1A2B;border-radius:26px;padding:18px 22px 22px;
  box-shadow:0 30px 60px rgba(3,8,18,.42),0 0 0 6px rgba(255,255,255,.12);transform-origin:${r ? '100%' : '0'} ${lineMid(BUG_LINE) - 146}px}
.mb::before{content:'';position:absolute;inset-inline-start:-10px;top:${lineMid(BUG_LINE) - 146 - 13}px;width:26px;height:26px;border-radius:5px;background:#fff;transform:rotate(45deg)}
.mb .hd{display:flex;align-items:center;gap:12px;position:relative}
.mb .av{width:52px;height:52px;border-radius:50%;background:#fff;display:grid;place-items:center;flex:none;
  box-shadow:0 0 0 3px rgba(90,180,217,.55),0 8px 18px rgba(14,26,43,.18)}
.mb .av{position:relative}
.mb .av img{width:36px;display:block}
.mb .av .sr{position:absolute;inset:-5px;border-radius:50%;border:3px solid var(--sky);opacity:0}
.mb .nm{font:800 ${r ? 23 : 22}px ${ui};color:var(--cobalt);letter-spacing:${r ? 0 : '.01em'}}
.mb .tx{margin-top:12px;font:700 ${r ? 26 : 27}px ${ui};line-height:${r ? 39 : 35}px;position:relative;height:${r ? 39 : 35}px}
.mb .tx>*{position:absolute;top:0;inset-inline:0}
.mb .q{opacity:0}
.mb .dots{display:flex;gap:8px;top:12px;opacity:0}
.mb .dots i{width:12px;height:12px;border-radius:50%;background:#93A9C6}
.mb .w{display:inline-block}
.rx{position:absolute;inset-inline-end:-14px;bottom:-18px;width:54px;height:54px;border-radius:50%;background:var(--sparkg);color:#fff;display:grid;place-items:center;
  box-shadow:0 10px 24px rgba(236,108,28,.45),0 0 0 4px #fff}

/* tests card */
.ts-w{position:absolute;inset-inline-start:0;top:520px;width:372px}
.tg{position:absolute;inset:14px 24px;border-radius:30px;background:rgba(34,197,94,.75);filter:blur(34px);opacity:0}
.ts{position:relative;padding:16px 22px 18px;border-radius:24px;background:#13233D;border-color:rgba(147,169,198,.24)}
.ts .hd{display:flex;align-items:center;gap:16px}
.ring{position:relative;width:58px;height:58px;flex:none}
.ring svg{position:absolute;inset:0;overflow:visible}
.ring circle{fill:none;stroke-width:5}
.ring .tk{stroke:rgba(147,169,198,.2)}
.ring .ar{stroke:#22C55E;stroke-linecap:round;filter:drop-shadow(0 0 5px rgba(34,197,94,.7))}
.ring .wv{position:absolute;inset:4px;border-radius:50%;border:3px solid #22C55E;opacity:0}
.ring .ok{position:absolute;left:11px;top:11px;width:36px;height:36px;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center}
.ts .cmd{font:500 20px ${stack.mono};color:var(--ui-sub);direction:ltr;unicode-bidi:isolate;display:block;text-align:${r ? 'right' : 'left'}}
.tt{position:relative}
.sk{position:absolute;inset-inline-start:0;bottom:7px;width:170px;height:18px;border-radius:9px;background:rgba(147,169,198,.16);overflow:hidden;opacity:0}
.sk i{position:absolute;top:0;bottom:0;left:0;width:70px;background:linear-gradient(90deg,rgba(207,240,255,0),rgba(207,240,255,.35),rgba(207,240,255,0));transform:translateX(-80px)}
.ts .lb{display:block;font:800 ${r ? 25 : 25}px ${ui};color:#fff;margin-top:${r ? 0 : 2}px;white-space:nowrap}
.segs{display:flex;gap:6px;margin-top:14px}
.segs span{flex:1;height:10px;border-radius:5px;background:rgba(147,169,198,.18);position:relative;overflow:hidden}
.segs span i{position:absolute;inset:0;border-radius:5px;background:#22C55E;box-shadow:0 0 8px rgba(34,197,94,.6)}

/* badge */
.bd-w{position:absolute;inset-inline-end:26px;top:584px;transform:rotate(${r ? 3 : -3}deg)}
.bd{position:relative;display:flex;align-items:center;gap:16px;padding-block:12px;padding-inline:12px 28px;border-radius:999px;background:var(--sparkg);
  color:#0E1A2B;font:800 ${r ? 25 : 26}px ${ui};white-space:nowrap;box-shadow:0 26px 50px rgba(120,45,0,.35),inset 0 2px 0 rgba(255,255,255,.4)}
.bd{overflow:hidden}
.bd .bs{position:absolute;top:-10px;bottom:-10px;inset-inline-start:0;width:70px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.6),rgba(255,255,255,0));transform:translateX(${r ? 140 : -140}px) skewX(-20deg)}
.bd .tr{width:60px;height:60px;border-radius:50%;background:#fff;color:#EC6C1C;display:grid;place-items:center;flex:none;box-shadow:0 4px 12px rgba(120,45,0,.25)}
.rays{position:absolute;inset-inline-start:-48px;top:-48px;width:180px;height:180px;border-radius:50%;
  background:repeating-conic-gradient(from 0deg,rgba(255,236,190,.55) 0deg 7deg,rgba(255,236,190,0) 7deg 30deg);
  -webkit-mask-image:radial-gradient(closest-side,#000 30%,transparent 100%)}
.burst{position:absolute;inset-inline-start:42px;top:42px;width:0;height:0}
.burst .bp{position:absolute;left:-9px;top:-13px;width:18px;height:26px;opacity:0}
.burst .bp svg{width:100%;height:100%;display:block}
`;
  },

  html: ({ copy, rtl }) => `${gooFilter}
<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="spet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset=".55" stop-color="#F28D19"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
<linearGradient id="mpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5AB4D9"/><stop offset="1" stop-color="#376BB1"/></linearGradient>
</defs></svg>
<div class="sp">
<div class="sp-halo"></div>
<div class="net goo">
  <div class="n" style="width:150px;height:150px;inset-inline-start:704px;top:6px"></div>
  <div class="n" style="width:84px;height:84px;inset-inline-start:806px;top:122px"></div>
  <div class="n" style="width:62px;height:62px;inset-inline-start:690px;top:150px"></div>
  <div class="n" style="width:132px;height:132px;inset-inline-start:744px;top:430px"></div>
  <div class="n" style="width:70px;height:70px;inset-inline-start:836px;top:372px"></div>
  <div class="n" style="width:64px;height:64px;inset-inline-start:690px;top:528px"></div>
</div>
<div class="fsp" style="inset-inline-start:610px;top:22px;transform:rotate(${rtl ? -30 : 30}deg)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:160px;top:16px;transform:rotate(${rtl ? 140 : -140}deg) scale(.8)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:866px;top:330px;transform:rotate(${rtl ? -80 : 80}deg) scale(.8)">${petalSvg()}</div>
<div class="fsp" style="inset-inline-start:478px;top:654px;transform:rotate(${rtl ? -160 : 160}deg) scale(.7)">${petalSvg()}</div>
<div class="tile cap"><div class="ti">${ico('graduation-cap', { size: 40, stroke: 2 })}</div></div>
<div class="tile bulb"><i class="gl"></i><div class="ti">${ico('lightbulb', { size: 38, stroke: 2.2 })}</div></div>

<div class="ed-w"><div class="beam"></div><div class="ed win">
  <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span>
    <span class="tab on">${ico('file-code', { size: 22 })}${copy.file}</span>
    <span class="tab off">${ico('file-code', { size: 22 })}${copy.file2}</span>
    <span class="pres"><i class="pm"><img src="${symbolPng()}" alt=""></i><i class="pu">${ico('user-round', { size: 20, stroke: 2.4 })}</i></span>
  </div>
  <div class="eb">
    <div class="band act"></div><div class="band err"></div><div class="band ok"></div>
    <div class="mm">${minimap()}</div>
    ${codeRows()}
    <i class="gping"></i><i class="gdot"></i><i class="gbar"></i>
    ${squiggle()}
    <div class="fx">${Array.from({ length: 6 }, () => `<i class="mp">${petalSvg()}</i>`).join('')}</div>
    <div class="cur"><i class="cb"></i><span class="fl">${copy.you}</span></div>
    <div class="mp"><div class="mpi"><i class="pr"></i>
      <svg class="pa" viewBox="0 0 30 38"><path d="M3 2 L3 30.5 L10.2 24 L15 34.6 L20.2 32.3 L15.6 22 L25.2 22 Z"/></svg>
      <span class="ma"><img src="${symbolPng()}" alt=""></span></div></div>
    <div class="shine"></div>
  </div>
</div></div>

<div class="ts-w"><i class="tg"></i><div class="ts card">
  <div class="hd">
    <div class="ring"><svg viewBox="0 0 58 58"><circle class="tk" cx="29" cy="29" r="26"/><g class="rg"><circle class="ar" cx="29" cy="29" r="26" transform="rotate(-90 29 29)"/></g></svg>
      <i class="wv"></i><span class="ok">${ico('check', { size: 24, stroke: 3.2 })}</span></div>
    <div class="tt"><span class="cmd">${copy.cmd}</span><span class="lb">${copy.tests}</span><span class="sk"><i></i></span></div>
  </div>
  <div class="segs">${Array.from({ length: 12 }, () => '<span><i></i></span>').join('')}</div>
</div></div>

<div class="mb-w"><div class="mb">
  <div class="hd"><span class="av"><img src="${symbolPng()}" alt=""><i class="sr"></i></span><span class="nm">${copy.mentor}</span></div>
  <div class="tx">
    <span class="q">${words(copy.ask)}</span>
    <span class="p">${words(copy.praise)}</span>
    <span class="dots"><i></i><i></i><i></i></span>
  </div>
  <span class="rx">${ico('thumbs-up', { size: 26, stroke: 2.4 })}</span>
</div></div>

<div class="bd-w"><div class="bd-in">
  <div class="rays"></div>
  <div class="burst">${Array.from({ length: 8 }, () => `<i class="bp">${petalSvg()}</i>`).join('')}</div>
  <div class="bd"><i class="bs"></i><span class="tr">${ico('trophy', { size: 32, stroke: 2.4 })}</span>${copy.badge}</div>
</div></div>
</div>`,

  animate(tl, gsap, ctx) {
    const D = 8;
    const CW = 15;
    const LH = 48;
    const sine = 'sine.inOut';
    const dir = ctx.rtl ? -1 : 1;
    // Caret offsets from its natural spot (line 6, column 18).
    const cx = (col) => (col - 18) * CW;
    const cy = (line) => (line - 6) * LH;

    // ---- Ambient loops (whole cycles) ----
    gsap.utils.toArray('.net .n').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -14), y: (i % 3 ? -14 : 18), scale: 1 + (i % 3) * 0.06, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    });
    tl.to('.fsp', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.sp-halo', { scale: 1.06, opacity: 0.8, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.ed-w', { y: -8, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.mb-w', { y: 8, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.ts-w', { y: -7, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.bd-w', { y: 7, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.tile.bulb', { y: -12, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.tile.cap', { y: 12, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.mp .mpi', { y: -4, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.tile.bulb .ti', { rotation: `+=${8 * dir}`, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.tile.cap .ti', { rotation: `-=${8 * dir}`, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.rays', { rotation: 60, duration: D, ease: 'none' }, 0); // 30° symmetry: two periods
    tl.fromTo('.beam', { '--a': '0deg' }, { '--a': `${720 * dir}deg`, duration: D, ease: 'none' }, 0);
    const blink = (t) => tl.fromTo('.cur .cb', { opacity: 1 }, { opacity: 0.12, duration: 0.28, ease: 'power1.inOut', repeat: 1, yoyo: true }, t);
    [0.2, 2.75, 6.8, 7.4].forEach(blink);
    tl.fromTo('.cur .fl', { y: 0 }, { y: -3, duration: 0.5, ease: sine, repeat: 1, yoyo: true }, 6.9);

    // ---- Clear the solved state ----
    tl.to('.bd-in', { scale: 0.6, opacity: 0, rotation: -10 * dir, duration: 0.38, ease: 'power2.in' }, 0.9);
    tl.to('.mb', { scale: 0.9, opacity: 0, duration: 0.36, ease: 'power2.in' }, 0.95);
    tl.to('.mb .p .w', { opacity: 0, duration: 0.01 }, 1.35);
    tl.to('.rx', { scale: 0, duration: 0.01 }, 1.35);
    tl.to('.ts .lb', { opacity: 0, x: -12 * dir, duration: 0.3, ease: 'power2.in' }, 1.0);
    tl.to('.ring .ok', { scale: 0, duration: 0.28, ease: 'back.in(2)' }, 1.0);
    tl.to('.segs i', { opacity: 0, duration: 0.14, stagger: { each: 0.025, from: 'end' } }, 1.0);
    tl.to('.ring .ar', { drawSVG: '0% 24%', stroke: '#F4B310', duration: 0.35, ease: 'power2.inOut' }, 1.0);
    tl.fromTo('.sk', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2);
    tl.fromTo('.sk i', { x: -80 }, { x: 200, duration: 0.9, ease: 'power1.inOut', repeat: 3 }, 1.3);
    // The spinner keeps turning while the bug is in: the tests never finish.
    tl.fromTo('.ring .rg', { rotation: 0 }, { rotation: 720, svgOrigin: '29 29', duration: 3.75, ease: 'none' }, 1.1);
    // Rewind the student's fix: backspace, character by character.
    const chars = gsap.utils.toArray('.ch');
    chars.slice().reverse().forEach((c, j) => {
      const t = 1.0 + j * 0.045;
      tl.to(c, { opacity: 0, duration: 0.04, ease: 'none' }, t);
      tl.to('.cur', { x: cx(18 - j - 1), duration: 0.04, ease: 'power1.out' }, t);
    });
    tl.to('.gbar', { scaleY: 0, duration: 0.25, ease: 'power2.in' }, 1.0);
    // The caret wanders up to the loop; the bug lights up.
    tl.to('.cur', { x: cx(16), y: cy(2), duration: 0.6 }, 1.5);
    tl.to('.band.act', { y: cy(2), duration: 0.6 }, 1.5);
    tl.fromTo('.band.err', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.7);
    tl.fromTo('.sq', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 1.7);
    tl.fromTo('.sq path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.55, ease: 'power2.out' }, 1.7);
    tl.fromTo('.gdot', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 1.75);

    // ---- The mentor points at the bug (a pointer, never a caret) and asks ----
    // Pointer offsets from its resting tip (by the "You" tag) to the end of the squiggle.
    const PB = { x: 300 - 444, y: 118 - 306 };
    tl.to('.mp', { x: PB.x, duration: 0.55, ease: 'power2.inOut' }, 1.55);
    tl.to('.mp', { y: PB.y, duration: 0.55, ease: 'power3.inOut' }, 1.55);
    const click = (t) => {
      tl.fromTo('.mp .mpi', { scale: 1 }, { scale: 0.86, transformOrigin: '3px 2px', duration: 0.1, ease: 'power2.out', repeat: 1, yoyo: true }, t);
      tl.fromTo('.mp .pr', { scale: 0.4, opacity: 1 }, { scale: 2.1, opacity: 0, duration: 0.6, ease: 'power2.out' }, t + 0.04);
    };
    click(2.08);
    const ask = 2.15;
    tl.fromTo('.mb', { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }, ask);
    tl.to(['.r1', '.r3', '.r4', '.r5', '.r7'], { opacity: 0.3, duration: 0.5, ease: 'power2.out' }, ask + 0.05);
    tl.to('.mm', { opacity: 0.2, duration: 0.5, ease: 'power2.out' }, ask + 0.05);
    tl.fromTo('.gping', { scale: 0.6, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.7, ease: 'power2.out' }, ask);
    const speak = (t) => tl.fromTo('.mb .av .sr', { scale: 1, opacity: 0.9 }, { scale: 1.55, opacity: 0, duration: 0.7, ease: 'power2.out' }, t);
    speak(ask + 0.15);
    tl.fromTo('.mb .dots', { opacity: 0 }, { opacity: 1, duration: 0.2 }, ask + 0.1);
    gsap.utils.toArray('.mb .dots i').forEach((d, i) => {
      tl.fromTo(d, { y: 0 }, { y: -9, duration: 0.18, ease: sine, repeat: 1, yoyo: true }, ask + 0.15 + i * 0.09);
    });
    // The bubble grows from one line (praise) to fit the question, and back later.
    const tx = document.querySelector('.mb .tx');
    const oneLine = tx.offsetHeight;
    const askH = document.querySelector('.mb .q').offsetHeight;
    tl.to('.mb .tx', { height: askH, duration: 0.4, ease: 'power2.inOut' }, ask + 0.42);
    tl.to('.mb .dots', { opacity: 0, duration: 0.15 }, ask + 0.5);
    tl.fromTo('.mb .q', { opacity: 0 }, { opacity: 1, duration: 0.01 }, ask + 0.55);
    tl.fromTo('.mb .q .w', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.065, ease: 'power2.out' }, ask + 0.55);

    // ---- The student moves to the right line and types the fix ----
    tl.to('.cur', { x: cx(8), y: cy(6), duration: 0.55 }, 3.38);
    tl.to('.band.act', { y: 0, duration: 0.55 }, 3.38);
    tl.fromTo('.gbar', { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power2.out' }, 3.9);
    chars.forEach((c, j) => {
      const t = 3.96 + j * 0.08;
      tl.fromTo(c, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.09, ease: 'power2.out' }, t);
      tl.to('.cur', { x: cx(8 + j + 1), duration: 0.06, ease: 'power2.out' }, t);
    });

    // ---- Fixed: underline melts, line flashes green, a shine sweeps the editor ----
    const fix = 4.85;
    tl.to('.sq path', { drawSVG: '100% 100%', duration: 0.35, ease: 'power2.in' }, fix);
    tl.to('.sq', { opacity: 0, duration: 0.15 }, fix + 0.3);
    tl.to('.band.err', { opacity: 0, duration: 0.4 }, fix);
    tl.to('.gdot', { scale: 0, duration: 0.25, ease: 'back.in(2)' }, fix);
    tl.fromTo('.band.ok', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' }, fix);
    tl.to('.band.ok', { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, fix + 0.5);
    tl.fromTo('.shine', { x: -260 }, { x: 680, duration: 0.8, ease: 'power2.inOut' }, fix);
    tl.to(['.r1', '.r3', '.r4', '.r5', '.r7'], { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, fix + 0.1);
    tl.to('.mm', { opacity: 0.55, duration: 0.6, ease: 'power2.inOut' }, fix + 0.1);
    gsap.utils.toArray('.fx .mp').forEach((p, j) => {
      const a = (-150 + j * 60) * Math.PI / 180;
      const rr = 34 + (j % 2) * 16;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.5, opacity: 1, rotation: j * 60 + 90 },
        { x: Math.cos(a) * rr, y: Math.sin(a) * rr, scale: 1, opacity: 0, rotation: j * 60 + 180, duration: 0.6, ease: 'power3.out' }, fix);
    });
    // The idea lands: the lightbulb lights up.
    tl.fromTo('.tile.bulb .gl', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.1, duration: 0.35, ease: 'power2.out' }, fix + 0.1);
    tl.to('.tile.bulb .gl', { opacity: 0, scale: 1.3, duration: 0.9, ease: 'power2.inOut' }, fix + 0.5);
    tl.fromTo('.tile.bulb .ti', { scale: 1 }, { scale: 1.16, duration: 0.18, ease: 'power2.out', repeat: 1, yoyo: true }, fix + 0.1);

    // ---- Tests run and pass ----
    const run = fix + 0.15;
    tl.to('.ring .ar', { drawSVG: '0% 100%', stroke: '#22C55E', duration: 0.75, ease: 'power2.inOut' }, run);
    tl.to('.sk', { opacity: 0, duration: 0.2 }, run + 0.5);
    tl.fromTo('.segs i', { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: 0.05 }, run);
    tl.fromTo('.ring .ok', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, run + 0.65);
    tl.fromTo('.ring .wv', { scale: 1, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 0.7, ease: 'power2.out' }, run + 0.7);
    tl.fromTo('.ts .lb', { opacity: 0, x: 14 * dir }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, run + 0.7);
    tl.fromTo('.ts', { scale: 1 }, { scale: 1.04, duration: 0.14, ease: 'power2.out', repeat: 1, yoyo: true }, run + 0.68);
    tl.fromTo('.tg', { opacity: 0 }, { opacity: 0.8, duration: 0.25, ease: 'power2.out' }, run + 0.66);
    tl.to('.tg', { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, run + 0.95);

    // ---- The mentor reacts ----
    const praise = 5.75;
    // The pointer glides back to the student's "You" tag: "Nice, you found it!"
    tl.to('.mp', { x: 0, duration: 0.6, ease: 'power3.inOut' }, praise - 0.2);
    tl.to('.mp', { y: 0, duration: 0.6, ease: 'power2.inOut' }, praise - 0.2);
    click(praise + 0.4);
    tl.to('.mb .q .w', { opacity: 0, y: -10, duration: 0.18, stagger: 0.02, ease: 'power2.in' }, praise);
    tl.to('.mb .q', { opacity: 0, duration: 0.01 }, praise + 0.32);
    tl.to('.mb .tx', { height: oneLine, duration: 0.36, ease: 'power2.inOut' }, praise + 0.1);
    tl.fromTo('.mb .p .w', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, praise + 0.34);
    tl.fromTo('.mb .av', { scale: 1 }, { scale: 1.12, duration: 0.16, ease: 'power2.out', repeat: 1, yoyo: true }, praise + 0.34);
    speak(praise + 0.34);
    tl.fromTo('.rx', { scale: 0, rotation: -40 * dir }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.6)' }, praise + 0.55);

    // ---- Badge pops ----
    const pop = 6.35;
    tl.fromTo('.bd-in', { scale: 0.4, opacity: 0, rotation: -14 * dir }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.8)' }, pop);
    const bw = document.querySelector('.bd').offsetWidth;
    tl.fromTo('.bd .bs', { x: -140 * dir }, { x: (bw + 40) * dir, duration: 0.75, ease: 'power2.inOut' }, pop + 0.45);
    tl.fromTo('.tile.cap .ti', { scale: 1 }, { scale: 1.14, duration: 0.18, ease: 'power2.out', repeat: 1, yoyo: true }, pop + 0.2);
    tl.fromTo('.bd .tr', { rotation: 0 }, { rotation: 14 * dir, duration: 0.12, ease: sine, repeat: 3, yoyo: true }, pop + 0.45);
    gsap.utils.toArray('.burst .bp').forEach((p, j) => {
      const a = (j * 45 + 20) * Math.PI / 180;
      const rr = 78 + (j % 2) * 22;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: j * 45 + 90 },
        { x: Math.cos(a) * rr, y: Math.sin(a) * rr, scale: 1, opacity: 0, rotation: j * 45 + 200, duration: 0.8, ease: 'power3.out' }, pop + 0.1);
    });
  },
};
