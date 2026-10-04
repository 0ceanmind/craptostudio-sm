// Software: "from spreadsheet to system". A cramped, error-flagged spreadsheet lifts off its
// grid cell by cell; the cells fly and reassemble into a clean custom dashboard (sidebar, KPI
// cards that roll up, a bar chart that grows, a table of orders with status pills).
// Frame 0 is the finished dashboard, with a ghost of the old sheet peeking out behind it.
import { ico, gooFilter } from '../motion/ui.mjs';

// Window body (below the title bar) in LTR px. Arabic mirrors every x: the sheet's column A and
// the dashboard's sidebar sit on the right.
const BW = 820;
// Spreadsheet: a row-number column, then 6 columns × 9 rows (row 0 holds the column titles).
const GX = 52;
const GY = 122;
const CW = 128;
const RH = 44;
const NR = 9;
const NC = 6;
const cell = (r, c) => [GX + c * CW, GY + r * RH, CW, RH];
const range = (r0, c0, r1, c1) => [GX + c0 * CW, GY + r0 * RH, (c1 - c0 + 1) * CW, (r1 - r0 + 1) * RH];

// Dashboard layout.
const SIDE = [10, 10, 80, 504];
const KPI = [0, 1, 2].map((i) => [106 + i * 238, 16, 222, 130]);
const CHART = [106, 162, 390, 346];
const TABLE = [512, 162, 292, 346];
const TRACK_Y = 84;
const TRACK_H = 238;
const BARS = [0.55, 0.66, 0.42, 0.6, 0.72, 0.88, 0.47]; // share of the track; #5 is the peak
const PEAK = 5;
const LH = 52; // odometer digit height

// Every dashboard piece is a "tile" that starts life as a spreadsheet cell (or a range).
// d = dashboard rect, s = source cell/range, r = corner radius, src = [row, col] of its text.
const TILES = [
  { k: 'side', d: SIDE, s: range(1, 0, 8, 0), r: 22, big: true },
  { k: 'logo', d: [24, 26, 52, 52], s: cell(0, 0), r: 16, src: [0, 0] },
  ...[0, 1, 2, 3].map((i) => ({ k: 'nav', i, d: [24, 110 + i * 66, 52, 52], s: cell(1 + i, 0), r: 16, src: [1 + i, 0] })),
  ...[[2, 1], [1, 2], [2, 4]].map(([r, c], i) => ({ k: 'kpi', i, d: KPI[i], s: cell(r, c), r: 22, src: [r, c] })),
  { k: 'chart', d: CHART, s: range(4, 1, 8, 3), r: 24, big: true },
  ...BARS.map((v, i) => ({ k: 'bar', i, d: [CHART[0] + 22 + i * 52, CHART[1] + TRACK_Y, 34, TRACK_H], s: cell(i + 1, 3), r: 12, src: [i + 1, 3] })),
  { k: 'table', d: TABLE, s: range(4, 4, 8, 5), r: 24, big: true },
  ...[[1, 5], [2, 5], [4, 5]].map(([r, c], i) => ({ k: 'row', i, d: [TABLE[0] + 14, TABLE[1] + 68 + i * 88, 264, 76], s: cell(r, c), r: 18, src: [r, c] })),
];
const FLAGS = { '2,2': 'err', '2,3': 'err', '5,3': 'err', '4,5': 'hi', '7,0': 'hi' };

// Selection box keyframes (the user hunting through the sheet) and the cursor tip for each.
const SEL = [cell(1, 3), cell(2, 3), cell(5, 3), range(1, 3, 7, 3)];
const CUR = [[0.62, 0.62], [0.62, 0.62], [0.62, 0.62], [0.62, 0.97]];

const isNum = (t) => /^[-#0-9.,/!A-Z]+$/.test(t) && /[0-9#]/.test(t);
const val = (t) => (isNum(t) ? `<bdi dir="ltr">${t}</bdi>` : t);

export default {
  duration: 8,

  copy: {
    en: {
      file: 'orders_FINAL_v7.xlsx',
      path: 'app/overview',
      errors: '3 errors',
      live: 'Live',
      formula: '=IFERROR(VLOOKUP(B4,Sheet3!A:F,6,0),"??")',
      head: ['Order', 'Date', 'Status', 'Total', 'Ticket', 'Notes'],
      rows: [
        ['1042', '03/10', 'shipped', '240', '', 'ok'],
        ['1043', '3/10', 'late??', '#REF!', 'open', 'call!!'],
        ['1044', '#####', 'shipped', '95', '', ''],
        ['1045', '04/10', 'pending', '180', 'open', '???'],
        ['1046', '4-10', 'shipped', '#VALUE!', '', 'dup?'],
        ['1047', '', 'paid', '310', 'closed', ''],
        ['1043', '3/10', 'late', '0', 'open', 'copy'],
        ['1048', '05/10', '', '125', '', ''],
      ],
      kpi: ['Orders', 'On time', 'Open tickets'],
      kpiVal: ['1,284', '98%', '7'],
      chart: 'Orders this week',
      table: 'Latest orders',
      orders: [['#1048', 'Shipped', 'ok'], ['#1047', 'Paid', 'paid'], ['#1046', 'Pending', 'pend']],
      peak: '310',
      from: 'Spreadsheet',
      to: 'System',
      toast: 'All synced',
      toastSub: 'just now',
    },
    ar: {
      file: 'طلبات_نهائي_v7.xlsx',
      path: 'app/overview',
      errors: '3 أخطاء',
      live: 'مباشر',
      formula: '=IFERROR(VLOOKUP(B4,Sheet3!A:F,6,0),"??")',
      head: ['الطلب', 'التاريخ', 'الحالة', 'المبلغ', 'التذكرة', 'ملاحظات'],
      rows: [
        ['1042', '03/10', 'شُحن', '240', '', 'تمام'],
        ['1043', '3/10', 'متأخر؟؟', '#REF!', 'مفتوحة', 'اتصل!!'],
        ['1044', '#####', 'شُحن', '95', '', ''],
        ['1045', '04/10', 'معلّق', '180', 'مفتوحة', '؟؟؟'],
        ['1046', '4-10', 'شُحن', '#VALUE!', '', 'مكرر؟'],
        ['1047', '', 'مدفوع', '310', 'مغلقة', ''],
        ['1043', '3/10', 'متأخر', '0', 'مفتوحة', 'نسخة'],
        ['1048', '05/10', '', '125', '', ''],
      ],
      kpi: ['الطلبات', 'في الموعد', 'تذاكر مفتوحة'],
      kpiVal: ['1,284', '98%', '7'],
      chart: 'طلبات هذا الأسبوع',
      table: 'أحدث الطلبات',
      orders: [['#1048', 'تم الشحن', 'ok'], ['#1047', 'مدفوع', 'paid'], ['#1046', 'معلّق', 'pend']],
      peak: '310',
      from: 'جدول بيانات',
      to: 'نظام',
      toast: 'تمت المزامنة',
      toastSub: 'الآن',
    },
  },

  css: (ctx) => {
    const r = ctx.rtl;
    const s = r ? -1 : 1;
    const mono = "'JetBrains Mono','Alexandria',monospace";
    const disp = r ? "'Alexandria','Plus Jakarta Sans',sans-serif" : "'Plus Jakarta Sans','Alexandria',sans-serif";
    return `
.sfw{position:absolute;inset:0}
.sw-halo{position:absolute;left:92px;top:30px;width:720px;height:720px;border-radius:50%;
  background:radial-gradient(circle,rgba(90,180,217,.34) 0%,rgba(66,150,209,.14) 40%,rgba(66,150,209,0) 68%)}
.sw-net{position:absolute;inset:0}
.sw-net i{position:absolute;border-radius:50%;background:var(--brand)}
.sfw .spark{inset-inline-start:var(--x);top:var(--y);transform:rotate(var(--r)) scale(var(--k,1))}

/* the old spreadsheet, peeking out behind the app */
.sw-ghostf{position:absolute;inset-inline-start:2px;top:14px;width:520px;height:330px}
.sw-ghost{position:absolute;inset:0;border-radius:22px;background:#101E35;border:2px solid rgba(147,169,198,.22);opacity:.6;overflow:hidden;
  transform:rotate(${-6 * s}deg);box-shadow:0 30px 60px rgba(2,6,14,.4)}
.sw-ghost .gb{position:absolute;inset-inline:0;top:0;height:38px;background:rgba(147,169,198,.10);border-bottom:2px solid rgba(147,169,198,.2);display:flex;align-items:center;gap:8px;padding-inline:16px}
.sw-ghost .gb i{width:11px;height:11px;border-radius:50%;background:rgba(147,169,198,.4)}
.sw-ghost .gh{position:absolute;inset-inline:0;top:38px;height:30px;display:flex;padding-inline-start:40px;background:rgba(147,169,198,.06);border-bottom:2px solid rgba(147,169,198,.18);font:700 20px ${mono};color:rgba(147,169,198,.75)}
.sw-ghost .gh span{width:96px;text-align:center;line-height:30px;border-inline-start:2px solid rgba(147,169,198,.16)}
.sw-ghost .gg{position:absolute;inset:68px 0 0 0;background-image:linear-gradient(rgba(147,169,198,.16) 2px,transparent 2px),linear-gradient(90deg,rgba(147,169,198,.16) 2px,transparent 2px);background-size:96px 32px;background-position:${r ? 'right -16px top -2px' : '38px -2px'}}
.sw-ghost .gc{position:absolute;height:10px;border-radius:5px;background:rgba(147,169,198,.28)}
.sw-ghost .gc.e{background:rgba(236,108,28,.55)}

/* the app window */
.sw-float{position:absolute;left:40px;top:58px;width:824px;height:586px}
.sw-tilt{position:absolute;inset:0}
.sw-win{position:absolute;inset:0;border-radius:28px;
  background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(255,255,255,0) 38%),var(--card);
  box-shadow:0 50px 100px rgba(2,6,14,.62),0 0 0 1px rgba(255,255,255,.03) inset}
.sw-win .win-bar{position:relative;gap:10px}
.sw-tslot{position:relative;flex:1;height:34px;margin-inline-start:8px}
.t-sheet,.t-app{position:absolute;inset-inline-start:0;top:0;height:34px;display:flex;align-items:center;gap:10px;white-space:nowrap;font-size:20px}
.t-sheet{opacity:0;color:var(--ui-text)}
.t-sheet .ico{color:#4ADE80}
.t-app{padding-inline:14px 18px;border-radius:999px;background:rgba(147,169,198,.09);color:var(--ui-text)}
.t-app .ico{color:var(--ui-sub)}
.sw-pslot{position:relative;width:190px;height:38px;flex:none}
.p-err,.p-live{position:absolute;inset-inline-end:0;top:0;height:38px;display:flex;align-items:center;gap:8px;padding-inline:14px 16px;border-radius:999px;white-space:nowrap;
  font:700 20px ${disp}}
.p-err{opacity:0;background:rgba(236,108,28,.16);color:var(--spark);border:2px solid rgba(236,108,28,.4)}
.p-live{background:rgba(34,197,94,.12);color:var(--ui-text);border:2px solid rgba(34,197,94,.32)}
.p-live .ld{position:relative;width:12px;height:12px;border-radius:50%;background:#22C55E;flex:none}
.p-live .lr{position:absolute;inset:0;border-radius:50%;border:2px solid #22C55E;opacity:0}
.sw-body{position:absolute;left:0;top:58px;width:${BW}px;height:524px}

/* spreadsheet layer */
.sw-sheet{position:absolute;inset:0;opacity:0;font:500 20px ${mono};color:#C2D0E2}
.sh-tb{position:absolute;inset-inline:0;top:0;height:46px;display:flex;align-items:center;gap:12px;padding-inline:16px;background:rgba(147,169,198,.06);border-bottom:2px solid rgba(147,169,198,.12);color:var(--ui-sub)}
.sh-tb .sep{width:2px;height:24px;background:rgba(147,169,198,.24);flex:none}
.sh-dd{display:inline-flex;align-items:center;gap:4px;height:30px;padding-inline:8px;border:2px solid rgba(147,169,198,.24);border-radius:7px;color:var(--ui-text);font-size:20px}
.sh-fx{position:absolute;inset-inline:0;top:46px;height:42px;display:flex;align-items:center;gap:12px;padding-inline:14px;border-bottom:2px solid rgba(147,169,198,.12)}
.sh-fx .fx{display:flex;padding-inline-end:12px;border-inline-end:2px solid rgba(147,169,198,.2);color:var(--ui-sub)}
.sh-fx .fm{direction:ltr;unicode-bidi:isolate;white-space:nowrap;color:var(--ui-text)}
.sh-h{position:absolute;display:grid;place-items:center;background:rgba(147,169,198,.07);color:var(--ui-sub);font-size:20px;
  border-inline-end:2px solid rgba(147,169,198,.12);border-bottom:2px solid rgba(147,169,198,.12)}
.sh-c{position:absolute;border-inline-end:2px solid rgba(147,169,198,.11);border-bottom:2px solid rgba(147,169,198,.11);padding-inline:9px;line-height:42px;white-space:nowrap;overflow:hidden}
.sh-c span{display:block;position:relative}
.sh-c .n{text-align:end}
.sh-c.hd{font-weight:700;color:var(--ui-text);background:rgba(147,169,198,.05)}
.sh-c.err{background:rgba(236,108,28,.16);color:var(--spark)}
.sh-c.hi{background:rgba(244,179,16,.15)}
.sh-c .tri{position:absolute;top:0;inset-inline-start:0;border-top:13px solid var(--ember);border-inline-end:13px solid transparent}
.sh-c .pz{position:absolute;inset:0;border:3px solid var(--ember);background:rgba(236,108,28,.18);box-shadow:inset 0 0 14px rgba(236,108,28,.5);opacity:0}

/* tiles: each is a cell in the sheet and a piece of the dashboard */
.tile{position:absolute;z-index:2}
.tile.big{z-index:1}
.tile .cs,.tile .sk{position:absolute;inset:0;border-radius:inherit}
.tile .cs{opacity:0;background:#213A5E;border:2px solid rgba(90,180,217,.6);box-shadow:0 18px 32px rgba(2,6,14,.5)}
.tile.big .cs{background:linear-gradient(160deg,rgba(90,180,217,.16),rgba(90,180,217,.05) 60%);border:2px solid rgba(90,180,217,.45);box-shadow:0 0 30px rgba(90,180,217,.12) inset}
.t-bar .cs{background:linear-gradient(180deg,#5AB4D9,#376BB1);border-color:rgba(255,255,255,.35)}
.t-bar.hl .cs{background:linear-gradient(180deg,#F4B310,#EC6C1C)}
.t-logo .cs{background:var(--brand)}
.tile .cv{position:absolute;inset:0;padding-inline:9px;white-space:nowrap;overflow:hidden;font:500 20px/44px ${mono};color:#C2D0E2;opacity:0}
.tile .cv.n{text-align:end}
.tile .cv.hd{font-weight:700;color:var(--ui-text)}
.tile .cv.err{color:var(--spark)}
.tile .ct{position:absolute;inset:0}

.t-side .sk{background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,0) 60%),rgba(6,12,24,.5);border:2px solid rgba(147,169,198,.12)}
.t-side .me{position:absolute;bottom:18px;left:50%;width:46px;height:46px;margin-left:-23px;border-radius:50%;background:var(--sparkg);color:#0E1A2B;display:grid;place-items:center;
  box-shadow:0 0 0 3px rgba(6,12,24,.9),0 0 0 5px rgba(242,141,25,.45)}
.t-logo .sk{background:var(--brand);box-shadow:0 10px 24px rgba(66,150,209,.45)}
.t-logo .ct,.t-nav .ct{display:grid;place-items:center;color:var(--ui-sub)}
.t-logo .ct{color:#fff}
.t-nav .sk{background:rgba(147,169,198,.06)}
.t-nav.on .sk{background:rgba(66,150,209,.26);border:2px solid rgba(90,180,217,.5)}
.t-nav.on .ct{color:var(--sky)}

.t-kpi .sk,.t-chart .sk,.t-table .sk{background:linear-gradient(160deg,rgba(255,255,255,.065),rgba(255,255,255,0) 50%),#182C4A;border:2px solid rgba(147,169,198,.15);box-shadow:0 16px 30px rgba(2,6,14,.3)}
.t-kpi .kl{position:absolute;top:20px;inset-inline-start:20px;font:700 ${r ? 20 : 20}px ${disp};color:var(--ui-sub);white-space:nowrap}
.t-kpi .kb{position:absolute;top:16px;inset-inline-end:16px;width:50px;height:50px;border-radius:16px;display:grid;place-items:center}
.kb.b0{background:var(--brand);color:#fff;box-shadow:0 8px 18px rgba(66,150,209,.35)}
.kb.b2{background:var(--sparkg);color:#0E1A2B;box-shadow:0 8px 18px rgba(242,141,25,.35)}
.kb.b1{border-radius:50%;color:var(--sky)}
.kb.b1 svg.rg{position:absolute;inset:0;transform:rotate(-90deg)}
.t-kpi .num{position:absolute;bottom:16px;inset-inline-start:20px;height:${LH}px}
.t-kpi .nr{display:flex;direction:ltr;height:${LH}px;
  font:800 46px 'Plus Jakarta Sans',sans-serif;letter-spacing:-.01em;font-variant-numeric:tabular-nums;color:var(--ui-text)}
.od{display:block;height:${LH}px;overflow:hidden}
.od .st{display:block}
.od i{display:block;height:${LH}px;line-height:${LH}px;font-style:normal;text-align:center}
.num .sym{line-height:${LH}px}

.t-chart .ttl,.t-table .ttl{position:absolute;top:20px;inset-inline-start:22px;font:800 ${r ? 21 : 22}px ${disp};white-space:nowrap;line-height:30px}
.t-chart .dots,.t-table .dots{position:absolute;top:22px;inset-inline-end:20px;color:var(--ui-sub)}
.t-chart .gl{position:absolute;inset-inline:22px;border-top:2px dashed rgba(147,169,198,.12)}
.t-bar .sk{background:rgba(147,169,198,.07)}
.t-bar.hl .sk{background:rgba(242,141,25,.10)}
.bf{position:absolute;left:0;right:0;bottom:0;border-radius:12px;transform-origin:50% 100%;
  background:linear-gradient(180deg,#5AB4D9 0%,#4296D1 45%,#376BB1 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.25)}
.t-bar.hl .bf{background:linear-gradient(180deg,#F4B310 0%,#F28D19 45%,#EC6C1C 100%);box-shadow:0 0 30px rgba(242,141,25,.55),inset 0 2px 0 rgba(255,255,255,.35)}

.t-row .sk{background:rgba(255,255,255,.035);border:2px solid rgba(147,169,198,.10)}
.t-row .av{position:absolute;top:18px;inset-inline-start:14px;width:40px;height:40px;border-radius:50%}
.av.a0{background:var(--brand)}
.av.a1{background:var(--sparkg)}
.av.a2{background:linear-gradient(135deg,#5AB4D9,#22457E)}
.t-row .oid{position:absolute;top:11px;inset-inline-start:66px;font:700 21px ${mono};line-height:30px;color:var(--ui-text)}
.t-row .ln{position:absolute;top:47px;inset-inline-start:66px;width:58px;height:9px;border-radius:5px;background:rgba(147,169,198,.22)}
.t-row .pl{position:absolute;top:19px;inset-inline-end:12px;height:38px;padding-inline:13px;border-radius:999px;display:flex;align-items:center;white-space:nowrap;font:700 20px ${disp}}
.pl.ok{background:rgba(34,197,94,.15);color:#22C55E}
.pl.paid{background:rgba(90,180,217,.16);color:var(--sky)}
.pl.pend{background:rgba(242,141,25,.16);color:var(--amber)}

/* overlay inside the window */
.sw-ov{position:absolute;inset:0;z-index:3}
.sel{position:absolute;opacity:0;border:3px solid var(--sky);background:rgba(90,180,217,.12);box-shadow:0 0 22px rgba(90,180,217,.45)}
.sel::after{content:'';position:absolute;bottom:-7px;inset-inline-end:-7px;width:12px;height:12px;background:var(--sky);border:2px solid var(--card)}
.cur{position:absolute;opacity:0;color:#0E1A2B;filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}
.cur svg{fill:#fff}
.sw-scan{position:absolute;top:-4px;bottom:-4px;left:0;width:180px;opacity:0;${r ? 'transform:scaleX(-1);' : ''}}
.sw-scan i{position:absolute;inset:0;background:linear-gradient(90deg,rgba(90,180,217,0) 0%,rgba(90,180,217,.16) 60%,rgba(90,180,217,.42) 92%,rgba(214,240,252,.95) 98%,rgba(90,180,217,0) 100%)}
.sw-peak{position:absolute;width:78px;height:40px}
.pk{position:absolute;inset:0;border-radius:13px;background:#fff;color:#0E1A2B;font:800 23px 'Plus Jakarta Sans',sans-serif;display:grid;place-items:center;box-shadow:0 12px 26px rgba(2,6,14,.45)}
.pk::after{content:'';position:absolute;left:50%;bottom:-6px;width:13px;height:13px;margin-left:-6.5px;background:#fff;transform:rotate(45deg);border-radius:2px}
.pk b{position:relative;z-index:1;font-weight:800}
.pp{position:absolute;width:14px;height:22px;margin:-11px 0 0 -7px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg);opacity:0}
.sw-glare{position:absolute;top:-30%;height:160%;left:0;width:150px;z-index:8;pointer-events:none;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.10),rgba(255,255,255,0));transform:translateX(${r ? 1000 : -260}px) rotate(18deg)}

/* floating label + toast */
.sw-label{position:absolute;left:0;right:0;top:612px;display:flex;justify-content:center;z-index:7}
.sw-label .lb{display:inline-flex;align-items:center;gap:12px;padding:9px;border-radius:999px;opacity:0;
  background:rgba(19,35,61,.94);border:2px solid var(--card-line);box-shadow:0 30px 60px rgba(2,6,14,.55)}
.sw-label .chip{font-size:${r ? 24 : 23}px;padding:11px 22px;gap:10px}
.sw-label .chip .ico{color:#4ADE80}
.sw-label .chip.hot .ico{color:#0E1A2B}
.sw-label .ar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:var(--sky);background:rgba(90,180,217,.14)}
.sw-toast{position:absolute;inset-inline-end:4px;top:600px;z-index:7}
.sw-toast .tt{transform:perspective(900px) rotateY(${-12 * s}deg) rotate(${-2 * s}deg)}
.sw-toast .tc{display:flex;align-items:center;gap:14px;padding-block:14px;padding-inline:14px 26px;border-radius:26px;
  background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,0) 55%),var(--card)}
.sw-toast .okb{width:50px;height:50px;border-radius:50%;background:#22C55E;display:grid;place-items:center;flex:none;box-shadow:0 0 0 6px rgba(34,197,94,.16)}
.sw-toast .okb svg{width:28px;height:28px;overflow:visible}
.sw-toast b{display:block;font:800 ${r ? 23 : 24}px ${disp};line-height:32px;white-space:nowrap}
.sw-toast small{display:block;font:500 20px ${disp};line-height:26px;color:var(--ui-sub);white-space:nowrap}
`;
  },

  html: ({ copy, rtl }) => {
    const s = rtl ? -1 : 1;
    const mx = ([x, y, w, h]) => [rtl ? BW - x - w : x, y, w, h];
    const box = (rc) => { const [x, y, w, h] = mx(rc); return `left:${x}px;top:${y}px;width:${w}px;height:${h}px`; };
    const txt = (r, c) => (r === 0 ? copy.head[c] : copy.rows[r - 1][c]);
    const srcs = new Set(TILES.filter((t) => t.src).map((t) => t.src.join(',')));

    // spreadsheet grid
    // In Arabic the toolbar runs right to left: undo/redo point the other way, text aligns right.
    const tb = ['undo-2', 'redo-2', 'printer', 'paintbrush', '|', 'bold', 'italic', 'underline', 'strikethrough', 'baseline', '|',
      rtl ? 'align-right' : 'align-left', 'align-center', '|', 'percent', 'sigma', 'filter', 'arrow-up-down', 'table-2']
      .map((n) => (n === '|' ? '<i class="sep"></i>' : ico(n, { size: 20, cls: rtl && /^(undo|redo)/.test(n) ? 'flip' : '' }))).join('');
    const heads = [`<div class="sh-h" style="${box([0, 88, GX, 34])}"></div>`,
      ...Array.from({ length: NC }, (_, c) => `<div class="sh-h" style="${box([GX + c * CW, 88, CW, 34])}">${'ABCDEF'[c]}</div>`),
      ...Array.from({ length: NR }, (_, r) => `<div class="sh-h" style="${box([0, GY + r * RH, GX, RH])}">${r + 1}</div>`)].join('');
    let cells = '';
    for (let r = 0; r < NR; r++) {
      for (let c = 0; c < NC; c++) {
        const t = txt(r, c);
        const f = FLAGS[`${r},${c}`] ?? '';
        const own = !srcs.has(`${r},${c}`) && t;
        const span = own ? `<span class="${isNum(t) ? 'n' : ''}">${val(t)}</span>` : '';
        const extra = f === 'err' ? `<i class="pz"></i><i class="tri"></i>` : '';
        cells += `<div class="sh-c ${r ? '' : 'hd'} ${f} ${f === 'err' && c === 3 ? (r === 2 ? 'f-a' : 'f-b') : ''}" data-r="${r}" data-c="${c}" data-l="${(cell(r, c)[0] / BW).toFixed(3)}" style="${box(cell(r, c))}">${extra}${span}</div>`;
      }
    }
    const sheet = `<div class="sw-sheet">
      <div class="sh-tb">${tb}<span class="sh-dd">11${ico('chevron-down', { size: 16 })}</span></div>
      <div class="sh-fx"><span class="fx">${ico('square-function', { size: 22 })}</span><span class="fm">${copy.formula}</span></div>
      ${heads}${cells}</div>`;

    // odometer number: every digit rolls up once from 0 to its value (calm, readable count-up)
    const odo = (val) => {
      const chars = [...val];
      return `<span class="num"><span class="nr">${chars.map((ch) => {
        if (!/\d/.test(ch)) return `<span class="sym">${ch}</span>`;
        const idx = +ch;
        const strip = Array.from({ length: 10 }, (_, k) => `<i>${k}</i>`).join('');
        return `<span class="od"><span class="st" data-i="${idx}" style="transform:translateY(${-idx * LH}px)">${strip}</span></span>`;
      }).join('')}</span></span>`;
    };
    const ring = `<svg class="rg" viewBox="0 0 50 50" width="50" height="50"><defs><linearGradient id="swrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5AB4D9"/><stop offset="1" stop-color="#376BB1"/></linearGradient></defs>
      <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(90,180,217,.18)" stroke-width="6"/>
      <circle class="ring-p" cx="25" cy="25" r="20" fill="none" stroke="url(#swrg)" stroke-width="6" stroke-linecap="round" style="stroke-dasharray:125.66;stroke-dashoffset:2.51"/></svg>`;

    const content = (t) => {
      switch (t.k) {
        case 'side': return `<span class="me">${ico('user-round', { size: 24, stroke: 2.4 })}</span>`;
        case 'logo': return ico('layers', { size: 28, stroke: 2.2 });
        case 'nav': return ico(['layout-dashboard', 'package', 'users', 'settings'][t.i], { size: 26 });
        case 'kpi': return `<span class="kl">${copy.kpi[t.i]}</span>
          <span class="kb b${t.i}">${t.i === 1 ? `${ring}${ico('check', { size: 22, stroke: 3 })}` : ico(t.i ? 'ticket' : 'package', { size: 26, stroke: 2.2 })}</span>
          ${odo(copy.kpiVal[t.i])}`;
        case 'chart': return `<span class="ttl">${copy.chart}</span><span class="dots">${ico('ellipsis', { size: 26 })}</span>
          ${[0.25, 0.5, 0.75].map((f) => `<i class="gl" style="top:${TRACK_Y + TRACK_H * f}px"></i>`).join('')}`;
        case 'bar': return `<i class="bf" style="height:${(BARS[t.i] * TRACK_H).toFixed(1)}px"></i>`;
        case 'table': return `<span class="ttl">${copy.table}</span><span class="dots">${ico('ellipsis', { size: 26 })}</span>`;
        case 'row': {
          const [id, label, cls] = copy.orders[t.i];
          return `<i class="av a${t.i}"></i><span class="oid"><bdi dir="ltr">${id}</bdi></span><i class="ln"></i><span class="pl ${cls}">${label}</span>`;
        }
        default: return '';
      }
    };
    const tiles = TILES.map((t, n) => {
      const cls = `tile t-${t.k}${t.big ? ' big' : ''}${t.k === 'nav' && t.i === 0 ? ' on' : ''}${t.k === 'bar' && t.i === PEAK ? ' hl' : ''}`;
      let cv = '';
      if (t.src) {
        const v = txt(...t.src);
        const f = FLAGS[t.src.join(',')] ?? '';
        cv = `<span class="cv ${isNum(v) ? 'n' : ''} ${t.src[0] ? '' : 'hd'} ${f}">${val(v)}</span>`;
      }
      const fillH = t.k === 'bar' ? ` data-h="${(BARS[t.i] * TRACK_H).toFixed(1)}"` : '';
      return `<div class="${cls}" data-n="${n}"${fillH} data-l="${(t.s[0] / BW).toFixed(3)}" data-c="${JSON.stringify(mx(t.s))}" data-d="${JSON.stringify(mx(t.d))}" data-r="${t.r}" style="${box(t.d)};border-radius:${t.r}px">
        <i class="cs"></i><i class="sk"></i>${cv}<div class="ct">${content(t)}</div></div>`;
    }).join('');

    // selection + cursor keyframes, peak bubble, petals
    const selK = SEL.map((k) => mx(k));
    const curK = SEL.map((k, i) => {
      const [x, y, w, h] = k;
      const tx = x + w * CUR[i][0];
      const ty = y + h * CUR[i][1];
      return [(rtl ? BW - tx : tx) - 6, ty - 6];
    });
    const bar = TILES.find((t) => t.k === 'bar' && t.i === PEAK).d;
    const fillTop = bar[1] + TRACK_H * (1 - BARS[PEAK]);
    const peak = mx([bar[0] + bar[2] / 2 - 39, fillTop - 54, 78, 40]);
    const pcx = peak[0] + 39;
    const pcy = peak[1] + 20;
    const pets = [-150, -112, -68, -30, 8].map((a) => {
      const rad = 62;
      const dx = Math.cos((a * Math.PI) / 180) * rad;
      const dy = Math.sin((a * Math.PI) / 180) * rad;
      return `<i class="pp" data-dx="${dx.toFixed(1)}" data-dy="${dy.toFixed(1)}" style="left:${pcx}px;top:${pcy}px;transform:rotate(${a + 90}deg)"></i>`;
    }).join('');
    const last = selK[selK.length - 1];
    const lastC = curK[curK.length - 1];

    const blobs = [[756, 2, 118], [846, 76, 56], [700, 22, 52], [862, 150, 38], [4, 556, 122], [100, 636, 74], [10, 468, 56], [168, 680, 40]];
    const sparks = [[330, 14, 30, 0.9], [884, 318, 80, 1], [10, 300, -140, 0.9], [600, 704, 40, 0.8], [224, 24, -40, 0.7]];
    const ghostCells = [[52, 86, 60], [150, 86, 40], [250, 118, 70, 'e'], [52, 150, 50], [350, 150, 60], [150, 182, 70], [250, 214, 50, 'e'], [52, 246, 64], [350, 246, 40]];

    return `${gooFilter}
<div class="sfw">
  <div class="sw-halo"></div>
  <div class="sw-net goo">${blobs.map(([x, y, d]) => `<i style="inset-inline-start:${x}px;top:${y}px;width:${d}px;height:${d}px"></i>`).join('')}</div>
  ${sparks.map(([x, y, rot, k]) => `<div class="spark" style="--x:${x}px;--y:${y}px;--r:${rot * s}deg;--k:${k}"></div>`).join('')}
  <div class="sw-ghostf"><div class="sw-ghost">
    <div class="gb"><i></i><i></i><i></i></div>
    <div class="gh">${'ABCDE'.split('').map((l) => `<span>${l}</span>`).join('')}</div>
    <div class="gg"></div>
    ${ghostCells.map(([x, y, w, e]) => `<i class="gc ${e ?? ''}" style="inset-inline-start:${x}px;top:${y}px;width:${w}px"></i>`).join('')}
  </div></div>
  <div class="sw-float"><div class="sw-tilt"><div class="sw-win win">
    <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span>
      <span class="sw-tslot">
        <span class="t-sheet">${ico('sheet', { size: 22 })}<span>${copy.file}</span></span>
        <span class="t-app">${ico('lock', { size: 18, stroke: 2.4 })}<bdi dir="ltr">${copy.path}</bdi></span>
      </span>
      <span class="sw-pslot">
        <span class="p-err">${ico('triangle-alert', { size: 20, stroke: 2.4 })}${copy.errors}</span>
        <span class="p-live"><i class="ld"><i class="lr"></i></i>${copy.live}</span>
      </span>
    </div>
    <div class="sw-body">
      ${sheet}
      ${tiles}
      <div class="sw-ov">
        <div class="sel" data-k="${JSON.stringify(selK)}" style="left:${last[0]}px;top:${last[1]}px;width:${last[2]}px;height:${last[3]}px"></div>
        <div class="cur" data-k="${JSON.stringify(curK)}" style="left:${lastC[0]}px;top:${lastC[1]}px">${ico('mouse-pointer-2', { size: 34, stroke: 1.8 })}</div>
        <div class="sw-scan"><i></i></div>
        ${pets}
        <div class="sw-peak" style="left:${peak[0]}px;top:${peak[1]}px"><div class="pk"><b>${copy.peak}</b></div></div>
      </div>
    </div>
    <div class="sw-glare"></div>
  </div></div></div>
  <div class="sw-label"><div class="lb">
    <span class="chip">${ico('sheet', { size: 24 })}${copy.from}</span>
    <span class="ar">${ico(rtl ? 'arrow-left' : 'arrow-right', { size: 24, stroke: 2.6 })}</span>
    <span class="chip hot">${ico('layout-dashboard', { size: 24, stroke: 2.2 })}${copy.to}</span>
  </div></div>
  <div class="sw-toast"><div class="tt"><div class="tc card">
    <span class="okb"><svg viewBox="0 0 28 28"><path class="okp" d="M6 14.5 L11.5 20 L22 8.5" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <div><b>${copy.toast}</b><small>${copy.toastSub}</small></div>
  </div></div></div>
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const s = ctx.rtl ? -1 : 1;
    const LH = 52;
    const BWs = 820;
    const RING = 125.66;
    const GHOST = 0.6;
    const amb = { duration: D / 2, ease: 'sine.inOut', repeat: 1, yoyo: true };
    const q = (sel) => gsap.utils.toArray(sel);
    const num = (el, key, n) => JSON.parse(el.getAttribute(key))[n];
    const rect = (key) => ({ left: (i, el) => num(el, key, 0), top: (i, el) => num(el, key, 1), width: (i, el) => num(el, key, 2), height: (i, el) => num(el, key, 3) });
    const tileN = (el) => +el.closest('.tile').dataset.n;
    const nonBarCt = '.tile:not(.t-bar) .ct';

    // ---- Ambient loops (whole cycles, so the last frame matches the first) ----
    gsap.set('.sw-tilt', { transformPerspective: 1800, rotationY: -7 * s, rotationX: 6 });
    tl.to('.sw-float', { y: -10, ...amb }, 0);
    tl.to('.sw-halo', { scale: 1.08, opacity: 0.78, ...amb }, 0);
    q('.sw-net i').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 16 : -12) * s, y: i % 3 ? -14 : 16, scale: 1 + (i % 3) * 0.07, ...amb }, 0);
    });
    tl.to('.sfw .spark', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    tl.to('.sfw .spark', { y: (i) => (i % 2 ? 12 : -12), ...amb }, 0);
    tl.to('.sw-ghostf', { y: 10, rotation: -1.5 * s, ...amb }, 0);
    tl.to('.sw-toast', { y: -10, ...amb }, 0);
    tl.to('.sw-peak', { y: -5, ...amb }, 0);
    tl.fromTo('.p-live .lr', { scale: 1, opacity: 0.8 }, { scale: 2.8, opacity: 0, duration: 1, repeat: 7, ease: 'power1.out' }, 0);

    // ---- 0.9s: the dashboard dissolves back into spreadsheet cells ----
    const T = 0.9;
    const back = (i, el) => ((tileN(el) * 7) % 21) * 0.012;
    tl.to('.sw-toast .tc', { opacity: 0, y: 26, scale: 0.94, duration: 0.4, ease: 'power2.in' }, T);
    tl.to('.sw-peak .pk', { opacity: 0, y: 12, scale: 0.7, duration: 0.3, ease: 'power2.in' }, T);
    tl.to(nonBarCt, { opacity: 0, duration: 0.3, ease: 'power2.in' }, T + 0.02);
    tl.to('.bf', { scaleY: 0, duration: 0.35, ease: 'power2.in', stagger: 0.02 }, T + 0.02);
    tl.set('.od .st', { y: 0 }, T + 0.4);
    tl.set('.ring-p', { strokeDashoffset: RING }, T + 0.4);
    tl.set(['.t-kpi .kl', '.t-kpi .kb', '.t-row .pl'], { opacity: 0 }, T + 0.4);
    tl.to('.sw-ghost', { opacity: 0, duration: 0.5, ease: 'power2.in' }, T);
    tl.to('.sw-tilt', { rotationY: 0, rotationX: 0, duration: 1, ease: 'power2.inOut' }, T + 0.1);
    tl.to('.tile', { ...rect('data-c'), borderRadius: 0, duration: 0.7, ease: 'power3.inOut', stagger: back }, T + 0.2);
    tl.to('.tile .sk', { opacity: 0, duration: 0.5, ease: 'power2.inOut', stagger: back }, T + 0.3);
    tl.fromTo('.tile .cv', { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: back }, T + 0.62);
    tl.set('.sh-c span', { opacity: 0 }, T + 0.3);
    tl.fromTo('.sw-sheet', { opacity: 0 }, { opacity: 1, duration: 0.5 }, T + 0.35);
    tl.to('.sh-c span', { opacity: 1, duration: 0.3, stagger: (i, el) => (+el.parentNode.dataset.r + +el.parentNode.dataset.c) * 0.025 }, T + 0.45);
    tl.to('.t-app', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, T + 0.15);
    tl.fromTo('.t-sheet', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, T + 0.42);
    tl.to('.p-live', { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' }, T + 0.15);
    tl.fromTo('.p-err', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, T + 0.55);

    // ---- 1.65s: the spreadsheet. Someone hunts through the cells; errors flash ----
    const selK = JSON.parse(document.querySelector('.sel').dataset.k);
    const curK = JSON.parse(document.querySelector('.cur').dataset.k);
    const kr = (k) => ({ left: k[0], top: k[1], width: k[2], height: k[3] });
    const kc = (k) => ({ left: k[0], top: k[1] });
    tl.fromTo('.sel', { opacity: 0, scale: 1.3, ...kr(selK[0]) }, { opacity: 1, scale: 1, ...kr(selK[0]), duration: 0.3, ease: 'power2.out' }, 1.7);
    tl.fromTo('.cur', { opacity: 0, x: 40 * s, y: 40, ...kc(curK[0]) }, { opacity: 1, x: 0, y: 0, ...kc(curK[0]), duration: 0.45, ease: 'power2.out' }, 1.6);
    tl.to('.sel', { ...kr(selK[1]), duration: 0.32, ease: 'power3.inOut' }, 1.95);
    tl.to('.cur', { ...kc(curK[1]), duration: 0.32, ease: 'power3.inOut' }, 1.93);
    tl.fromTo('.f-a .pz', { opacity: 0 }, { opacity: 1, duration: 0.14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.22);
    tl.fromTo('.p-err', { x: 0 }, { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 2.24);
    tl.to('.sel', { ...kr(selK[2]), duration: 0.34, ease: 'power3.inOut' }, 2.4);
    tl.to('.cur', { ...kc(curK[2]), duration: 0.34, ease: 'power3.inOut' }, 2.38);
    tl.fromTo('.f-b .pz', { opacity: 0 }, { opacity: 1, duration: 0.14, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.66);
    tl.to('.sel', { ...kr(selK[3]), duration: 0.38, ease: 'power3.inOut' }, 2.8);
    tl.to('.cur', { ...kc(curK[3]), duration: 0.38, ease: 'power3.inOut' }, 2.8);

    // ---- 3.15s: Spreadsheet -> System. Cells lift off the grid... ----
    const TF = 3.15;
    tl.set(['.sw-label .chip', '.sw-label .ar'], { opacity: 0 }, TF - 0.2);
    tl.fromTo('.sw-label .lb', { opacity: 0, y: 26, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, TF - 0.12);
    tl.fromTo(['.sw-label .chip', '.sw-label .ar'], { x: -22 * s }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.12 }, TF - 0.05);
    tl.fromTo('.sw-label .ar svg', { x: -5 * s }, { x: 5 * s, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, TF + 0.3);
    tl.to(['.sel', '.cur'], { opacity: 0, duration: 0.25, ease: 'power2.in' }, TF);
    tl.fromTo('.sw-scan', { opacity: 0, x: ctx.rtl ? BWs : -180 }, { opacity: 1, x: ctx.rtl ? BWs - 140 : -40, duration: 0.12, ease: 'none' }, TF - 0.05);
    tl.to('.sw-scan', { x: ctx.rtl ? -180 : BWs, duration: 0.6, ease: 'power1.inOut' }, TF + 0.07);
    tl.to('.sw-scan', { opacity: 0, duration: 0.15, ease: 'none' }, TF + 0.55);
    tl.to('.sh-c span', { opacity: 0, duration: 0.25, stagger: (i, el) => +el.parentNode.dataset.l * 0.55 }, TF + 0.05);
    tl.to('.sw-sheet', { opacity: 0, duration: 0.45, ease: 'power2.in' }, TF + 0.25);
    const lift = (i, el) => +el.closest('.tile').dataset.l * 0.55;
    tl.fromTo('.tile .cs', { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: lift }, TF + 0.05);
    tl.fromTo('.tile', { scale: 1, rotation: 0, y: 0 }, { scale: 1.07, rotation: (i) => (((i * 37) % 7) - 3) * 1.2, y: -8, duration: 0.3, ease: 'power2.out', stagger: lift }, TF + 0.05);

    // ...fly across the window and snap into the dashboard...
    const TY = TF + 0.45;
    const fly = (i, el) => tileN(el) * 0.028;
    tl.fromTo('.tile', { ...rect('data-c'), borderRadius: 0 }, { ...rect('data-d'), borderRadius: (i, el) => +el.dataset.r, duration: 0.9, ease: 'power3.inOut', stagger: fly }, TY);
    tl.to('.tile', { scale: 1, rotation: 0, y: 0, duration: 0.9, ease: 'power3.inOut', stagger: fly }, TY);
    tl.to('.tile .cv', { opacity: 0, duration: 0.25, stagger: fly }, TY);
    tl.to('.tile:not(.t-bar) .cs', { opacity: 0, duration: 0.35, ease: 'power1.in', stagger: fly }, TY + 0.62);
    // the bar rods land and settle into their values: the fill rises while the rod dims
    tl.to('.t-bar .cs', { opacity: 0, duration: 0.7, ease: 'power1.inOut', stagger: fly }, TY + 0.8);
    tl.fromTo('.tile .sk', { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: fly }, TY + 0.45);
    tl.fromTo('.sw-tilt', { rotationY: 0, rotationX: 0 }, { rotationY: -7 * s, rotationX: 6, duration: 1.6, ease: 'power2.inOut' }, TY - 0.1);
    tl.to('.t-sheet', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, TY);
    tl.fromTo('.t-app', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, TY + 0.3);
    tl.to('.p-err', { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' }, TY);
    tl.fromTo('.p-live', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, TY + 0.35);

    // ---- ...and each piece comes alive as it lands ----
    const land = (n) => TY + 0.9 + n * 0.028 - 0.1;
    tl.fromTo('.t-side .ct', { opacity: 0 }, { opacity: 1, duration: 0.4 }, land(0));
    tl.fromTo(['.t-logo .ct', '.t-nav .ct'], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.028 }, land(1));
    tl.fromTo('.t-kpi .ct', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.028 }, land(6));
    tl.fromTo('.t-kpi .kl', { opacity: 0, x: -14 * s }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 }, land(6));
    tl.fromTo('.t-kpi .kb', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.07 }, land(6) + 0.1);
    tl.fromTo('.od .st', { y: 0 }, { y: (i, el) => -el.dataset.i * LH, duration: 1.4, ease: 'power3.out', stagger: 0.05 }, land(6));
    tl.fromTo('.ring-p', { strokeDashoffset: RING }, { strokeDashoffset: 2.51, duration: 1.2, ease: 'power3.out' }, land(7) + 0.15);
    tl.fromTo('.t-chart .ct', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, land(9));
    tl.fromTo('.bf', { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.028 }, land(10) - 0.05);
    tl.fromTo('.t-table .ct', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, land(17));
    tl.fromTo('.t-row .ct', { opacity: 0, x: -26 * s }, { opacity: 1, x: 0, duration: 0.55, stagger: 0.1 }, land(18));
    tl.fromTo('.t-row .pl', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.1 }, land(18) + 0.25);
    // the peak bar gets its value, with a little burst of spark petals
    const TP = land(15) + 0.75;
    tl.fromTo('.sw-peak .pk', { opacity: 0, y: 14, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(2)' }, TP);
    tl.fromTo('.pp', { opacity: 0, x: 0, y: 0, scale: 0.3 }, { opacity: 1, x: (i, el) => +el.dataset.dx, y: (i, el) => +el.dataset.dy, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.02 }, TP + 0.05);
    tl.to('.pp', { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' }, TP + 0.55);

    // ---- 5.5s: the label bows out, everything is synced, the old sheet settles behind ----
    tl.to('.sw-label .lb', { opacity: 0, y: -14, scale: 0.95, duration: 0.4, ease: 'power2.in' }, 5.5);
    tl.fromTo('.sw-toast .tc', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.6)' }, 5.75);
    tl.fromTo('.okp', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, 6.05);
    tl.fromTo('.sw-ghost', { opacity: 0 }, { opacity: GHOST, duration: 0.8 }, 5.6);
    tl.fromTo('.sw-glare', { x: ctx.rtl ? 1000 : -260, rotation: 18 }, { x: ctx.rtl ? -260 : 1000, rotation: 18, duration: 1.1, ease: 'power2.inOut' }, 5.85);
  },
};
