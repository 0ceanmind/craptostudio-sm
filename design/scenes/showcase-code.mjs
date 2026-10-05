// Project showcase: "Code to result". A dark editor (the post's file and snippet, syntax
// highlighted by a small tokenizer below) types itself in token by token; a terminal runs the
// post's command and prints its output, the run bar fills, a result card slides out from under the
// editor and a status pill pops. Frame 0 is the finished state (code typed, output printed, result
// and status shown).
// Loop: hold → select-all + delete, outputs clear, result slides back in → type → run → print →
// result → status → hold.
//
// Code, file names and the command are always LTR (even in Arabic); the composition mirrors around
// them: in Arabic the editor and terminal sit on the right, the result card and status on the left.
import { ico } from '../motion/ui.mjs';
import { stack } from '../fonts.mjs';

const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Word spans for animation (never letters: Arabic joins must stay intact). An inline-block is an
// atomic object in bidi ordering, so a run of words in the other script (e.g. a Latin project
// name inside Arabic text) is kept together in one span with its own direction; otherwise
// "Skyline Run" would come out as "Run Skyline".
function wordSpans(text, rtl) {
  const parts = String(text ?? '').split(/(\s+)/).filter((p) => p !== '');
  const isSpace = (p) => /^\s+$/.test(p);
  const other = (w) => (rtl ? !ARABIC.test(w) && /[A-Za-z]/.test(w) : ARABIC.test(w));
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (isSpace(p)) { out.push(p); continue; }
    if (!other(p)) { out.push(`<span class="w">${esc(p)}</span>`); continue; }
    let j = i;
    while (j + 2 < parts.length && isSpace(parts[j + 1]) && other(parts[j + 2])) j += 2;
    out.push(`<span class="w" dir="${rtl ? 'ltr' : 'rtl'}">${esc(parts.slice(i, j + 1).join(''))}</span>`);
    i = j;
  }
  return out.join('');
}

// ---------------------------------------------------------------------------------------------
// A tiny syntax highlighter. Classes: k keyword, n number/constant, s string, c comment,
// f function, t type/class, d decorator/directive, o operator/punctuation, v identifier.
// ---------------------------------------------------------------------------------------------
const set = (s) => new Set(s.split(/\s+/).filter(Boolean));
const JS_KW = 'async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return static super switch throw try typeof var void while with yield get set as';
const TS_KW = `${JS_KW} interface type enum implements private public protected readonly declare namespace keyof abstract is satisfies`;
const C_LIKE = { line: '//', block: true };
const LANGS = {
  python: { label: 'Py', line: '#', dec: true, py: true,
    kw: set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case'),
    con: set('True False None self cls') },
  javascript: { label: 'JS', ...C_LIKE, dec: true, kw: set(JS_KW), con: set('true false null undefined this NaN Infinity') },
  typescript: { label: 'TS', ...C_LIKE, dec: true, kw: set(TS_KW), con: set('true false null undefined this') },
  csharp: { label: 'C#', ...C_LIKE, pre: true, cs: true, capCalls: true,
    kw: set('abstract as async await base break case catch class const continue default delegate do else enum event explicit extern finally fixed for foreach get goto if implicit in interface internal is lock namespace new operator out override params private protected public readonly record ref return sealed set sizeof static struct switch throw try typeof unchecked unsafe using var virtual void volatile when where while yield bool byte char decimal double float int long object short string uint ulong dynamic init required'),
    con: set('true false null this') },
  java: { label: 'Java', ...C_LIKE, dec: true,
    kw: set('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static super switch synchronized throw throws transient try var void volatile while record'),
    con: set('true false null this') },
  kotlin: { label: 'Kt', ...C_LIKE, dec: true,
    kw: set('as break class companion continue data do else enum for fun if import in interface internal is lateinit object open override package private protected public return sealed suspend throw try val var when while by'),
    con: set('true false null this it') },
  swift: { label: 'Swift', ...C_LIKE, dec: true,
    kw: set('actor as async await break case catch class continue defer do else enum extension fileprivate for func guard if import in init inout internal let mutating private protocol public return some any static struct switch throw throws try var where while'),
    con: set('true false nil self Self') },
  dart: { label: 'Dart', ...C_LIKE, dec: true,
    kw: set('abstract as async await break case catch class const continue default do else enum extends final finally for if implements import in is late library new required return static super switch throw try var void while with yield'),
    con: set('true false null this') },
  go: { label: 'Go', ...C_LIKE,
    kw: set('break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var'),
    con: set('true false nil iota') },
  rust: { label: 'Rs', ...C_LIKE,
    kw: set('as async await break const continue crate dyn else enum extern fn for if impl in let loop match mod move mut pub ref return static struct super trait type unsafe use where while'),
    con: set('true false self Self None Some Ok Err') },
  cpp: { label: 'C++', ...C_LIKE, pre: true,
    kw: set('auto bool break case catch char class const constexpr continue default delete do double else enum explicit extern float for friend if inline int long namespace new operator private protected public return short signed sizeof static struct switch template throw try typedef typename union unsigned using virtual void volatile while'),
    con: set('true false nullptr NULL this') },
  bash: { label: '$_', line: '#', sh: true,
    kw: set('if then else elif fi for while until do done case esac function in return export local select'),
    con: set('true false') },
  sql: { label: 'SQL', line: '--', block: true, ci: true,
    kw: set('select from where insert into values update set delete create table index view join left right inner outer full on group by order having limit offset as and or not null is in like between distinct union all case when then else end primary key references default returning with'),
    con: set('true false null count sum avg min max now') },
  gdscript: { label: 'GD', line: '#', dec: true, py: true,
    kw: set('and as await break class class_name const continue elif else enum export extends for func if in is match not onready or pass preload return signal static var while yield'),
    con: set('true false null self') },
  ruby: { label: 'Rb', line: '#',
    kw: set('alias and begin break case class def do else elsif end ensure for if in module next not or redo rescue retry return then unless until when while yield require attr_accessor'),
    con: set('true false nil self') },
  php: { label: 'PHP', ...C_LIKE,
    kw: set('abstract as break case catch class const continue declare default do echo else elseif extends final finally fn for foreach function if implements interface match namespace new private protected public readonly require return static switch throw trait try use var while'),
    con: set('true false null this') },
  generic: { label: '</>', ...C_LIKE, dec: true,
    kw: set('if else elif for foreach while do return function func fn def class struct const let var val import from export new try catch except finally async await public private static void int string bool in of'),
    con: set('true false null nil None True False this self') },
};
const ALIASES = {
  py: 'python', js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript', node: 'javascript', nodejs: 'javascript',
  ts: 'typescript', tsx: 'typescript', cs: 'csharp', 'c#': 'csharp', unity: 'csharp', kt: 'kotlin', kts: 'kotlin',
  rs: 'rust', 'c++': 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', c: 'cpp', h: 'cpp', sh: 'bash', shell: 'bash', zsh: 'bash',
  gd: 'gdscript', godot: 'gdscript', rb: 'ruby', golang: 'go', postgres: 'sql', postgresql: 'sql', mysql: 'sql', sqlite: 'sql',
};
const norm = (s) => String(s ?? '').trim().toLowerCase();
const langKey = (k) => (LANGS[k] ? k : LANGS[ALIASES[k]] ? ALIASES[k] : null);
// The file's extension says the language best (the `language` field may be the scene default).
function resolveLang(file, language) {
  const ext = /\.([a-z0-9+#]+)$/i.exec(String(file ?? ''))?.[1];
  return langKey(norm(ext)) ?? langKey(norm(language)) ?? 'generic';
}

const DEF = set('def function fn func fun void');
const TYPEDEF = set('class struct interface enum new extends implements trait type record object protocol extension impl namespace');

// Splits each line into [class, text] tokens. Whitespace tokens have class ''.
function tokenize(lines, L) {
  let block = false; // inside /* … */
  let triple = null; // inside a Python ''' / """ string
  return lines.map((line) => {
    const out = [];
    let i = 0;
    let prev = ''; // previous identifier/keyword (for "def name", "class Name")
    let first = true; // first word on a shell line is the command
    const push = (c, t) => { out.push([c, t]); i += t.length; };
    while (i < line.length) {
      const rest = line.slice(i);
      let m;
      if (block) {
        const e = rest.indexOf('*/');
        const t = e < 0 ? rest : rest.slice(0, e + 2);
        if (e >= 0) block = false;
        push('c', t); continue;
      }
      if (triple) {
        const e = rest.indexOf(triple);
        const t = e < 0 ? rest : rest.slice(0, e + 3);
        if (e >= 0) triple = null;
        push('s', t); continue;
      }
      if ((m = /^\s+/.exec(rest))) { push('', m[0]); continue; }
      if (L.block && rest.startsWith('/*')) {
        const e = rest.indexOf('*/', 2);
        if (e < 0) block = true;
        push('c', e < 0 ? rest : rest.slice(0, e + 2)); continue;
      }
      if (L.line && rest.startsWith(L.line) && !(L.sh && /^#!/.test(rest) && i)) {
        // Comments are typed word by word (an Arabic comment stays whole: as separate inline
        // blocks its words would be laid out left to right).
        if (ARABIC.test(rest)) push('c', rest);
        else rest.split(/(\s+)/).filter(Boolean).forEach((w) => push(/^\s+$/.test(w) ? '' : 'c', w));
        break;
      }
      if (L.pre && !line.slice(0, i).trim() && (m = /^#\s*[a-z]+/.exec(rest))) { push('d', m[0]); prev = ''; continue; }
      if (L.py && (m = /^([rRbBuUfF]{0,2})("""|''')/.exec(rest))) {
        const e = rest.indexOf(m[2], m[0].length);
        if (e < 0) triple = m[2];
        push('s', e < 0 ? rest : rest.slice(0, e + 3)); prev = ''; continue;
      }
      const pfx = (L.py && /^[rRbBuUfF]{1,2}(?=["'])/.exec(rest)?.[0]) || (L.cs && /^[$@]{1,2}(?=")/.exec(rest)?.[0]) || '';
      const q = rest[pfx.length];
      if (q === '"' || q === "'" || (q === '`' && !L.py)) {
        let j = pfx.length + 1;
        while (j < rest.length && rest[j] !== q) j += rest[j] === '\\' ? 2 : 1;
        push('s', rest.slice(0, Math.min(j + 1, rest.length))); prev = ''; first = false; continue;
      }
      if ((m = /^(0[xXbBoO][\da-fA-F_]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)[a-zA-Z]{0,2}/.exec(rest))) { push('n', m[0]); prev = ''; first = false; continue; }
      if (L.dec && (m = /^@[A-Za-z_][\w.]*/.exec(rest))) { push('d', m[0]); prev = ''; continue; }
      if (L.sh && (m = /^\$\{?[\w@#?]+\}?/.exec(rest))) { push('n', m[0]); prev = ''; first = false; continue; }
      if (L.sh && (m = /^--?[A-Za-z][\w-]*/.exec(rest))) { push('t', m[0]); prev = ''; continue; }
      if ((m = /^[\p{L}_$][\p{L}\p{N}_$]*/u.exec(rest))) {
        const w = m[0];
        const key = L.ci ? w.toLowerCase() : w;
        const after = line.slice(i + w.length);
        const call = /^\s*\(/.test(after);
        const member = /\.\s*$/.test(line.slice(0, i));
        let c;
        if (L.kw.has(key) && !member) c = 'k';
        else if (L.con.has(key) && !member) c = 'n';
        else if (L.sh && first) c = 'f';
        else if (DEF.has(prev)) c = 'f';
        else if (TYPEDEF.has(prev)) c = 't';
        else if (call) c = (/^[A-Z]/.test(w) && !member && !L.capCalls) ? 't' : 'f';
        else if (/^[A-Z][A-Z0-9_]{2,}$/.test(w)) c = 'n';
        else if (/^[A-Z]/.test(w)) c = 't';
        else c = 'v';
        prev = key; first = false;
        push(c, w); continue;
      }
      m = /^[+\-*/%=<>!&|^~?:]+/.exec(rest);
      push('o', m ? m[0] : rest[0]);
      prev = ''; first = false;
    }
    return out;
  });
}

// Output lines may start with a status mark; it becomes a coloured icon.
const MARKS = [
  [/^(✓|✔|√|\[ok\]|ok\b:?)\s*/i, 'check', 'ok'],
  [/^(✗|✘|×|\[x\]|error\b:?)\s*/i, 'x', 'er'],
  [/^(→|->|=>|›|»|>)\s*/, 'chevron-right', 'ar'],
  [/^(!|⚠️?|warn(ing)?\b:?)\s*/i, 'triangle-alert', 'wa'],
  [/^(•|·|\*|-)\s+/, 'dot', 'dt'],
];
function outLine(text) {
  const s = String(text ?? '');
  for (const [re, icon, cls] of MARKS) {
    const m = re.exec(s);
    if (m) return { icon, cls, text: s.slice(m[0].length) };
  }
  return { icon: null, cls: '', text: s };
}

// Geometry (LTR px inside the 904×740 box; Arabic mirrors every x).
const ED_X = 24; // editor inline-start
const ED_W = 696;
const BAR = 58;
const X0 = 70; // code starts after the gutter
const PADR = 26;
const CLIP = ED_W - 4 - X0 - PADR; // visible code width
const PADT = 16;
const PADB = 22;
const T_W = 446; // terminal width
const T_FS = 21;
const T_ROW = 34;
const R_W = 384; // result card width
const LIMIT = 706; // lowest y any card may reach (the headline sits right below the box)

function layout({ copy, data }) {
  const key = resolveLang(data.file, data.language);
  const L = LANGS[key];
  const src = String(data.code ?? '').replace(/\r\n?/g, '\n').replace(/\t/g, '    ').replace(/\s+$/, '');
  let lines = src.split('\n');
  while (lines.length > 1 && !lines[0].trim()) lines.shift();
  const outputs = (Array.isArray(copy.output) ? copy.output : [copy.output]).filter((x) => x !== undefined && x !== null && String(x).trim()).slice(0, 3);
  const termH = 46 + 14 + 38 + outputs.length * T_ROW + 16 + 4;
  // The result card grows with its text; estimate its height from the copy (≈ chars per line).
  const title = String(copy.result?.title ?? '');
  const text = String(copy.result?.text ?? '');
  const tLines = Math.min(2, Math.max(1, Math.ceil(title.length / 17)));
  const pLines = text ? Math.min(3, Math.max(1, Math.ceil(text.length / 31))) : 0;
  const resH = 32 + Math.max(62, tLines * 32) + (pLines ? 12 + pLines * 30 : 0) + 26 + 4;
  const bottomH = Math.max(termH, resH);
  // Font size: as large as the longest visible line allows (lines past the edge fade out).
  const fsFor = (n) => Math.max(20, Math.min(24, Math.floor(CLIP / (Math.max(1, n) * 0.6))));
  let fs = 24; let lh = 40; let rows = 0;
  // Editor top 44 + chrome 100 + rows, minus the 20px the cards tuck under it, plus the cards.
  for (let pass = 0; pass < 3; pass++) {
    const maxRows = Math.max(3, Math.floor((LIMIT - 124 - bottomH) / lh));
    rows = Math.min(lines.length, maxRows);
    const longest = Math.max(...lines.slice(0, rows).map((l) => l.length));
    fs = fsFor(longest);
    lh = Math.round(fs * 1.66);
  }
  lines = lines.slice(0, rows);
  const shown = Math.max(rows, 5); // the editor is never shorter than 5 rows
  const edH = 2 + BAR + PADT + shown * lh + PADB + 2;
  // Centre the composition vertically in the box when it is short.
  const bottom = 44 + edH - 20 + bottomH;
  const oy = Math.max(0, Math.min(36, Math.round((LIMIT - bottom) / 2)));
  const edTop = 44 + oy;
  return { key, L, lines, toks: tokenize(lines, L), fs, lh, cw: fs * 0.6, outputs, edTop, edH, cardsTop: edTop + edH - 20, termH, resH, oy };
}

// A spark petal (the logo's orange drop) as inline SVG.
const petal = () => '<svg viewBox="0 0 40 54"><path d="M20 2C29 10 37 23 37 35C37 46 29 52 20 52C11 52 3 46 3 35C3 23 11 10 20 2Z" fill="url(#scpet)"/><path d="M13 22C15 16 18 11 21 8C20 15 18 21 15 27Z" fill="#fff" opacity=".55"/></svg>';

export default {
  meta: {
    title: 'Code to result',
    description: 'A dark editor types the project’s code token by token, a terminal runs the command and prints its output, then a result card slides out of the editor and a status pill pops.',
    bestFor: 'Libraries, APIs, backends, CLIs, bots, AI pipelines, automation scripts',
    fields: {
      copy: {
        status: 'Status pill, up to 18 characters (e.g. “Build passing”, “Bot online”)',
        output: 'Terminal output: 1–3 short lines, up to 28 characters each. Start a line with ✓, ✗, → or ! for a coloured mark',
        result: '{ title, text }: what the code achieves. Title up to 28 characters, text up to 80',
      },
      data: {
        file: { type: 'text', description: 'File name in the editor tab, e.g. bot.ts. Its extension picks the highlighting' },
        language: { type: 'text', description: 'Used when the file name has no known extension: python, javascript, typescript, csharp, java, kotlin, swift, dart, go, rust, cpp, bash, sql, gdscript, ruby, php' },
        code: { type: 'code', description: 'A short snippet, ideally 5–8 lines of up to 40 characters. Longer lines fade out at the edge; extra lines are cut' },
        command: { type: 'text', description: 'The command the terminal runs, up to 30 characters, e.g. npm test' },
        icon: { type: 'icon', description: 'Icon on the result card' },
      },
    },
  },
  duration: 8,

  copy: {
    en: {
      status: 'Build passing',
      output: ['✓ Loaded 1,204 orders', '✓ Model trained in 2.1s', '→ Saved report.csv'],
      result: { title: 'Forecast ready', text: 'Next week’s orders, predicted and saved every morning.' },
    },
    ar: {
      status: 'البناء ناجح',
      output: ['✓ تم تحميل 1,204 طلبات', '✓ اكتمل التدريب في 2.1 ثانية', '→ حُفظ في report.csv'],
      result: { title: 'التوقّع جاهز', text: 'طلبات الأسبوع القادم، متوقَّعة ومحفوظة كل صباح.' },
    },
  },

  data: {
    file: 'app.py',
    language: 'python',
    code: [
      'from shop import Orders, Forecast',
      '',
      'orders = Orders.load("orders.csv")',
      'model = Forecast(window=28)',
      'model.fit(orders)',
      '',
      'week = model.predict(days=7)',
      'week.save("report.csv")',
    ].join('\n'),
    command: 'python app.py',
    icon: 'terminal',
  },

  css: (ctx) => {
    const r = ctx.rtl;
    const ui = r ? stack.arabic : stack.display;
    const light = ctx.theme === 'light';
    const edShadow = light ? '0 40px 80px rgba(14,26,43,.30)' : '0 50px 90px rgba(3,8,18,.6)';
    return `
.sc{position:absolute;inset:0}
.sc-halo{position:absolute;inset-inline-start:40px;top:20px;width:720px;height:620px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(90,180,217,${light ? '.5' : '.40'}),rgba(90,180,217,.12) 55%,rgba(90,180,217,0))}
.sc-net{position:absolute;inset:0;filter:url(#scgoo)}
.sc-net i{position:absolute;border-radius:50%;background:var(--brand)}
.sc-pet{position:absolute;width:30px;height:42px;filter:drop-shadow(0 0 10px rgba(242,141,25,.5))}
.sc-pet svg,.sc-bp svg{width:100%;height:100%;display:block}

/* language tile */
.sc-lt{position:absolute;inset-inline-end:40px;width:92px;height:92px;z-index:1}
.sc-lt .in{width:100%;height:100%;border-radius:28px;background:var(--sparkg);display:grid;place-items:center;transform:rotate(${r ? -10 : 10}deg);
  box-shadow:0 22px 44px rgba(120,45,0,.32),inset 0 2px 0 rgba(255,255,255,.4)}
.sc-lt b{font:700 var(--lfs) ${stack.mono};color:#0E1A2B;letter-spacing:-.02em;direction:ltr}

/* editor */
.sc-ed-w{position:absolute;inset-inline-start:${ED_X}px;width:${ED_W}px;z-index:3}
.sc-glow{position:absolute;inset-inline-start:${ED_X + 40}px;width:${ED_W - 80}px;border-radius:50px;background:var(--brand);filter:blur(60px);opacity:${light ? '.35' : '.5'}}
.sc-ed{position:relative;direction:ltr;background:#0C1830;border-color:rgba(90,180,217,.28);color:#E6EEF8;
  box-shadow:${edShadow},0 0 0 1px rgba(90,180,217,.10);transform:perspective(1800px) rotateY(${r ? -4 : 4}deg) rotateX(3deg)}
.sc-ed .win-bar{background:linear-gradient(180deg,#152846,#11203A);border-color:rgba(147,169,198,.18);color:#93A9C6;gap:9px;direction:${r ? 'rtl' : 'ltr'}}
.sc-tab .fn{direction:ltr;unicode-bidi:isolate}
.sc-tab{position:relative;display:flex;align-items:center;gap:10px;height:58px;margin-inline-start:12px;padding-inline:16px 18px;background:rgba(90,180,217,.10);
  font:600 20px ${stack.mono};color:#fff;white-space:nowrap;max-width:420px}
.sc-tab .ico{color:var(--amber)}
.sc-tab .fn{overflow:hidden;text-overflow:ellipsis}
.sc-tab::after{content:'';position:absolute;inset-inline:10px;bottom:0;height:3px;border-radius:2px;background:var(--sparkg)}
.sc-tab .md{width:10px;height:10px;border-radius:50%;background:#C9D6E8;opacity:0;flex:none}
.sc-prog{position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#376BB1,#5AB4D9 60%,#22C55E);transform-origin:0 50%;z-index:2}
.sc-eb{position:relative;overflow:hidden;background:linear-gradient(180deg,#0E1C34,#0A1527)}
.sc-band{position:absolute;left:0;right:0;background:rgba(90,180,217,.08);box-shadow:inset 3px 0 0 rgba(90,180,217,.55)}
.sc-row{position:absolute;left:0;right:0;white-space:pre;color:#E6EEF8}
.sc-row .no{position:absolute;left:0;width:50px;text-align:right;font-size:.9em;color:#768BA9}
.sc-row .cl{position:absolute;left:${X0}px;width:${CLIP}px;overflow:hidden}
.sc-row .cl.ov{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 70px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 70px),transparent)}
.tk{display:inline-block;white-space:pre}
.tk.k{color:#F28D19;font-weight:700}
.tk.f{color:#5AB4D9}
.tk.t{color:#A9CCFF}
.tk.s{color:#F4B310}
.tk.n{color:#F7A072}
.tk.d{color:#F4B310}
.tk.c{color:#8A9FBE;font-style:italic}
.tk.ar{font-style:normal}
.tk.o{color:#93A9C6}
.tk.v{color:#E6EEF8}
.sc-mm{position:absolute;right:18px;width:78px;padding:8px 8px;border-radius:9px;background:rgba(147,169,198,.06);box-shadow:inset 0 0 0 1px rgba(147,169,198,.12)}
.sc-mm i{display:block;height:5px;border-radius:3px;margin-bottom:4px;transform-origin:0 50%;opacity:.75}
.sc-mm .vp{position:absolute;display:block;inset:4px;border-radius:7px;background:rgba(90,180,217,.10);box-shadow:inset 0 0 0 1px rgba(90,180,217,.25)}
.sc-sel{position:absolute;left:${X0 - 4}px;background:rgba(90,180,217,.30);border-radius:6px;transform-origin:0 50%;opacity:0}
.sc-caret{position:absolute;left:0;top:0;width:3px;border-radius:2px;background:#F4B310;box-shadow:0 0 10px rgba(244,179,16,.9);z-index:2}
.sc-shine{position:absolute;top:-40px;bottom:-40px;left:0;width:170px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(207,240,255,.14),rgba(255,255,255,0));transform:translateX(-300px) skewX(-18deg);pointer-events:none}

/* terminal */
.sc-tm-w{position:absolute;inset-inline-start:0;width:${T_W}px;z-index:4}
.sc-tm{position:relative;direction:ltr;border-radius:24px;background:#081222;border:2px solid rgba(90,180,217,.26);overflow:hidden;
  box-shadow:0 34px 70px rgba(3,8,18,${light ? '.34' : '.55'}),0 0 0 1px rgba(90,180,217,.08);transform:perspective(1600px) rotateY(${r ? -5 : 5}deg) rotateX(2deg)}
.sc-tb{direction:${r ? 'rtl' : 'ltr'};height:46px;display:flex;align-items:center;gap:10px;padding-inline:18px 14px;background:rgba(147,169,198,.07);border-bottom:2px solid rgba(147,169,198,.14);color:#5AB4D9}
.sc-tb .tl{display:flex;gap:7px}
.sc-tb .tl i{width:11px;height:11px;border-radius:50%;background:rgba(147,169,198,.35)}
.sc-tb .tt{position:relative;display:grid;place-items:center;height:46px;padding-inline:10px;margin-inline-start:6px}
.sc-tb .tt::after{content:'';position:absolute;inset-inline:6px;bottom:0;height:3px;border-radius:2px;background:var(--sparkg)}
.sc-st{position:relative;margin-inline-start:auto;width:30px;height:30px}
.sc-st .sp{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(90,180,217,.25);border-top-color:#5AB4D9;opacity:0}
.sc-st .ok{position:absolute;inset:0;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center;box-shadow:0 0 12px rgba(34,197,94,.6)}
.sc-tbd{padding:14px 22px 16px;font:500 ${T_FS}px/${T_ROW}px ${stack.mono};color:#C9D6E8;white-space:nowrap}
.sc-cmd{height:38px;line-height:38px;display:flex;align-items:center;gap:12px}
.sc-cmd .pr{color:#F28D19;font-weight:700}
.sc-cmd .cx{position:relative;overflow:hidden;display:flex;align-items:center;max-width:${T_W - 80}px}
.sc-cmd .cx.ov{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 50px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 50px),transparent)}
.sc-cmd .ch{display:inline-block;white-space:pre;color:#F1F5FB}
.sc-bc{width:12px;height:24px;margin-inline-start:2px;background:#C9D6E8;opacity:0;flex:none}
.sc-ol{display:flex;align-items:center;gap:10px;height:${T_ROW}px;overflow:hidden}
.sc-ol .oi{width:22px;height:22px;flex:none;display:grid;place-items:center}
.sc-ol .oi.ok{color:#22C55E}.sc-ol .oi.er{color:#F28D19}.sc-ol .oi.ar{color:#5AB4D9}.sc-ol .oi.wa{color:#F4B310}.sc-ol .oi.dt{color:#93A9C6}
.sc-ol .ot{overflow:hidden;white-space:nowrap;min-width:0;flex:1}
.sc-ol .ot.ov{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 50px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 50px),transparent)}
.sc-ol .ot bdi{font-family:${stack.mono}}
.sc-ol .ot.rtl{flex:0 1 auto;direction:rtl}
.sc-ol .ot.rtl.ov{-webkit-mask-image:linear-gradient(270deg,#000 calc(100% - 50px),transparent);mask-image:linear-gradient(270deg,#000 calc(100% - 50px),transparent)}

/* result card (tucked under the editor's bottom edge) */
.sc-rs-w{position:absolute;inset-inline-end:16px;width:${R_W}px;z-index:5}
.sc-rs-p{clip-path:inset(0px -200px -200px -200px)}
.sc-rs{position:relative;padding:32px 26px 26px;border-radius:28px;transform:perspective(1600px) rotateY(${r ? 6 : -6}deg) rotateX(2deg);overflow:hidden}
.sc-rs::before{content:'';position:absolute;inset-inline:0;bottom:0;height:5px;background:var(--sparkg)}
.sc-rs .hd{display:flex;align-items:center;gap:18px}
.sc-rs .ti{position:relative;width:62px;height:62px;border-radius:20px;background:var(--brand);color:#fff;display:grid;place-items:center;flex:none;
  box-shadow:0 12px 24px rgba(55,107,177,.35),inset 0 2px 0 rgba(255,255,255,.3)}
.sc-rs .tc{position:absolute;inset-inline-end:-7px;bottom:-7px;width:26px;height:26px;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center;box-shadow:0 0 0 3px var(--card)}
.sc-rs h3{font:800 ${r ? 25 : 26}px/${r ? 1.45 : 1.2} ${ui};color:var(--ui-text);letter-spacing:${r ? 0 : '-.01em'};display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
.sc-rs p{margin-top:12px;font:500 ${r ? 20 : 21}px/${r ? 1.55 : 1.42} ${ui};color:var(--ui-sub);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
.sc-rs .w{display:inline-block}

/* status pill */
.sc-pl-w{position:absolute;inset-inline-end:4px;z-index:6}
.sc-pl{position:relative;display:flex;align-items:center;gap:14px;padding-block:10px;padding-inline:10px 26px;border-radius:999px;background:#fff;color:#0E1A2B;
  font:800 ${r ? 23 : 24}px ${ui};white-space:nowrap;max-width:330px;box-shadow:0 24px 48px rgba(3,8,18,.32),0 0 0 5px rgba(255,255,255,.14);transform:rotate(${r ? -3 : 3}deg);overflow:hidden}
.sc-pl .tx{overflow:hidden;text-overflow:ellipsis;padding-bottom:${r ? 4 : 0}px}
.sc-pl .led{position:relative;width:44px;height:44px;border-radius:50%;background:#22C55E;color:#fff;display:grid;place-items:center;flex:none;box-shadow:0 6px 14px rgba(34,197,94,.45)}
.sc-pl .rg{position:absolute;inset:0;border-radius:50%;border:3px solid #22C55E;opacity:0}
.sc-pl .sh{position:absolute;top:-12px;bottom:-12px;inset-inline-start:0;width:60px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(214,236,255,.9),rgba(255,255,255,0));transform:translateX(${r ? 120 : -120}px) skewX(-20deg)}
.sc-bst{position:absolute;width:0;height:0;z-index:1}
.sc-bp{position:absolute;left:-9px;top:-13px;width:18px;height:26px;opacity:0}
`;
  },

  html: (ctx) => {
    const { copy, data, rtl } = ctx;
    const g = layout(ctx);
    const L = g.L;
    // Language tile label: short monogram, scaled to fit the tile.
    const label = L.label;
    const lfs = label.length <= 2 ? 34 : label.length === 3 ? 28 : label.length === 4 ? 23 : 19;
    const rowTop = (k) => PADT + k * g.lh;
    const rows = g.toks.map((toks, k) => {
      const chars = toks.reduce((n, [, t]) => n + t.length, 0);
      const inner = toks.map(([c, t]) => (c ? `<span class="tk ${c}${ARABIC.test(t) ? ' ar' : ''}">${esc(t)}</span>` : esc(t))).join('');
      return `<div class="sc-row" style="top:${rowTop(k)}px;height:${g.lh}px;line-height:${g.lh}px">`
        + `<span class="no">${k + 1}</span><span class="cl${chars * g.cw > CLIP ? ' ov' : ''}">${inner}</span></div>`;
    }).join('');
    const sels = g.toks.map((toks, k) => {
      const chars = toks.reduce((n, [, t]) => n + t.length, 0);
      const lead = (toks[0]?.[0] === '' ? toks[0][1].length : 0);
      if (!chars || chars === lead) return '';
      return `<i class="sc-sel" style="top:${rowTop(k) + 4}px;height:${g.lh - 8}px;width:${Math.min(CLIP, (chars) * g.cw) + 8}px"></i>`;
    }).join('');
    const last = g.toks.length - 1;
    // Minimap (decorative), only when the code leaves room for it on the right.
    const longest = Math.max(0, ...g.lines.map((l) => l.length));
    const MMC = { k: '#F28D19', f: '#5AB4D9', s: '#F4B310', c: '#8A9FBE', t: '#A9CCFF', d: '#F4B310', n: '#F7A072' };
    const minimap = X0 + longest * g.cw + 130 < ED_W - 4
      ? `<div class="sc-mm" style="top:${PADT + 4}px"><b class="vp"></b>${g.toks.map((toks) => {
        const text = toks.map(([, t]) => t).join('');
        const lead = text.length - text.trimStart().length;
        const len = text.trim().length;
        const main = toks.find(([c]) => c)?.[0];
        return `<i style="width:${Math.min(60 - lead * 1.5, len * 1.6).toFixed(1)}px;margin-left:${(lead * 1.5).toFixed(1)}px;background:${MMC[main] ?? '#93A9C6'}"></i>`;
      }).join('')}</div>`
      : '';
    // Over-long command and output lines are cut just past the faded edge, so no hidden text
    // spills outside the terminal.
    const cmdFull = String(data.command ?? '');
    const cmd = [...cmdFull].slice(0, 33).join('');
    const arabicCmd = ARABIC.test(cmd);
    const cmdHtml = (arabicCmd ? cmd.split(/(\s+)/).filter(Boolean) : [...cmd]).map((ch) => `<span class="ch">${esc(ch)}</span>`).join('');
    const outs = g.outputs.map((o) => {
      const { icon, cls, text } = outLine(o);
      const ar = ARABIC.test(text);
      const chars = [...text];
      const max = ar ? 34 : 31;
      const ov = chars.length > max - 2;
      let shown = chars.length > max ? chars.slice(0, max).join('') : text;
      // Arabic is cut between words, so the last visible letters keep their joined forms.
      if (ar && shown !== text && shown.lastIndexOf(' ') > max / 2) shown = shown.slice(0, shown.lastIndexOf(' '));
      return `<div class="sc-ol"><span class="oi ${cls}">${icon ? ico(icon, { size: 20, stroke: 3 }) : ''}</span><span class="ot${ov ? ' ov' : ''}${ar ? ' rtl' : ''}"><bdi>${esc(shown)}</bdi></span></div>`;
    }).join('');
    const words = (s) => wordSpans(s, rtl);
    const iconName = /^[a-z0-9-]+$/.test(String(data.icon ?? '')) ? data.icon : 'terminal';
    const icon = (() => { try { return ico(iconName, { size: 32, stroke: 2.2 }); } catch { return ico('terminal', { size: 32, stroke: 2.2 }); } })();
    const top = g.cardsTop;
    return `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="scgoo" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="0 0 0 0 0.26  0 0 0 0 0.59  0 0 0 0 0.82  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>
<linearGradient id="scpet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4B310"/><stop offset=".55" stop-color="#F28D19"/><stop offset="1" stop-color="#EC6C1C"/></linearGradient>
</defs></svg>
<div class="sc" data-lh="${g.lh}" data-cw="${g.cw}" data-x0="${X0}" data-padt="${PADT}">
<div class="sc-halo"></div>
<div class="sc-glow" style="top:${g.edTop + 90}px;height:${Math.max(120, g.edH - 140)}px"></div>
<div class="sc-net">
  <i style="width:140px;height:140px;inset-inline-start:744px;top:${250 + g.oy}px"></i>
  <i style="width:84px;height:84px;inset-inline-start:820px;top:${360 + g.oy}px"></i>
  <i style="width:64px;height:64px;inset-inline-start:726px;top:${372 + g.oy}px"></i>
  <i style="width:54px;height:54px;inset-inline-start:836px;top:${212 + g.oy}px"></i>
  <i style="width:92px;height:92px;inset-inline-start:-18px;top:${top + 120}px"></i>
  <i style="width:58px;height:58px;inset-inline-start:40px;top:${top + 190}px"></i>
</div>
<div class="sc-pet" style="inset-inline-start:2px;top:${10 + g.oy}px;transform:rotate(${rtl ? 30 : -30}deg) scale(.85)">${petal()}</div>
<div class="sc-pet" style="inset-inline-start:858px;top:${120 + g.oy}px;transform:rotate(${rtl ? -70 : 70}deg) scale(.8)">${petal()}</div>
<div class="sc-pet" style="inset-inline-start:466px;top:${Math.min(690, top + g.termH - 30)}px;transform:rotate(${rtl ? -160 : 160}deg) scale(.75)">${petal()}</div>
<div class="sc-lt" style="top:${150 + g.oy}px;--lfs:${lfs}px"><div class="in"><b>${esc(label)}</b></div></div>

<div class="sc-rs-w" style="top:${top - 4}px"><div class="sc-rs-p"><div class="sc-rs card">
  <div class="hd"><span class="ti">${icon}<span class="tc">${ico('check', { size: 16, stroke: 3.4 })}</span></span><h3>${words(copy.result?.title ?? '')}</h3></div>
  ${copy.result?.text ? `<p>${words(copy.result.text)}</p>` : ''}
</div></div></div>

<div class="sc-ed-w" style="top:${g.edTop}px"><div class="sc-ed win">
  <div class="win-bar"><span class="d"></span><span class="d"></span><span class="d"></span>
    <span class="sc-tab">${ico('file-code', { size: 22 })}<span class="fn">${esc(data.file)}</span><i class="md"></i></span>
  </div>
  <div class="sc-eb" style="height:${g.edH - BAR - 4}px;font:500 ${g.fs}px ${stack.mono}">
    <i class="sc-prog"></i>
    <div class="sc-band" style="top:${rowTop(last)}px;height:${g.lh}px"></div>
    ${minimap}
    ${sels}
    ${rows}
    <i class="sc-caret" style="height:${g.lh - 14}px"></i>
    <div class="sc-shine"></div>
  </div>
</div></div>

<div class="sc-tm-w" style="top:${top}px"><div class="sc-tm">
  <div class="sc-tb"><span class="tl"><i></i><i></i><i></i></span><span class="tt">${ico('square-terminal', { size: 22 })}</span>
    <span class="sc-st"><i class="sp"></i><span class="ok">${ico('check', { size: 18, stroke: 3.4 })}</span></span></div>
  <div class="sc-tbd">
    <div class="sc-cmd"><span class="pr">$</span><span class="cx${cmdFull.length * T_FS * 0.6 > T_W - 90 ? ' ov' : ''}">${cmdHtml}<i class="sc-bc"></i></span></div>
    ${outs}
  </div>
</div></div>

<div class="sc-pl-w" style="top:${14 + g.oy}px"><div class="sc-pl-p">
  <div class="sc-bst" style="inset-inline-start:32px;top:32px">${Array.from({ length: 6 }, () => `<i class="sc-bp">${petal()}</i>`).join('')}</div>
  <div class="sc-pl"><span class="led"><i class="rg"></i>${ico('check', { size: 26, stroke: 3.2 })}</span><span class="tx">${esc(copy.status ?? '')}</span><i class="sh"></i></div>
</div></div>
</div>`;
  },

  animate(tl, gsap, ctx) {
    const D = 8;
    const sine = 'sine.inOut';
    const dir = ctx.rtl ? -1 : 1;
    const q = (s) => document.querySelector(s);
    const qa = (s) => gsap.utils.toArray(s);
    const root = q('.sc');
    const LH = +root.dataset.lh;
    const X0 = +root.dataset.x0;
    const PADT = +root.dataset.padt;
    // Elements hidden at frame 0 whose first tween is a fromTo get an early .to() back to their
    // resting value, so scrubbing backwards also lands on the real frame 0.
    const anchor = (targets, vars, t) => tl.to(targets, { ...vars, duration: 0.01 }, t);

    // ---- Measure the code: every visible token is one typing step; the caret follows ----
    const rows = qa('.sc-row');
    const steps = [];
    rows.forEach((row, r) => {
      const cl = row.querySelector('.cl');
      const clip = cl.clientWidth;
      if (cl.scrollWidth > clip + 1) cl.classList.add('ov');
      row.querySelectorAll('.tk').forEach((el) => {
        const x0 = el.offsetLeft;
        const x1 = Math.min(x0 + el.offsetWidth, clip - 6);
        // Tokens past the faded edge are typed together with the last visible one.
        if (x0 >= clip - 30 && steps.length && steps[steps.length - 1].r === r) { steps[steps.length - 1].els.push(el); return; }
        steps.push({ els: [el], r, x: X0 + x1 + 2 });
      });
    });
    const rowY = (r) => PADT + r * LH + 7;
    const lastRow = rows.length - 1;
    const endX = steps.length ? steps[steps.length - 1].x : X0 + 2;
    const endR = steps.length ? steps[steps.length - 1].r : 0;
    // The caret rests at the end of the code (frame 0).
    gsap.set('.sc-caret', { x: endX, y: rowY(endR) });
    gsap.set('.sc-band', { y: (endR - lastRow) * LH });

    // ---- Ambient loops (whole cycles) ----
    tl.to('.sc-halo', { scale: 1.06, opacity: 0.82, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    qa('.sc-net i').forEach((n, i) => {
      tl.to(n, { x: (i % 2 ? 14 : -12) * dir, y: i % 3 ? -14 : 16, scale: 1 + (i % 3) * 0.06, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    });
    tl.to('.sc-pet', { rotation: '+=360', duration: D, ease: 'none' }, 0);
    // The result card floats with the editor: during its reveal its clipped top edge has to stay
    // on the editor's bottom edge.
    tl.to(['.sc-ed-w', '.sc-rs-w'], { y: -8, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    tl.to('.sc-tm-w', { y: -6, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.sc-pl-w', { y: 6, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.sc-lt', { y: -12, duration: D / 4, ease: sine, repeat: 3, yoyo: true }, 0);
    tl.to('.sc-lt .in', { rotation: `+=${8 * dir}`, duration: D / 2, ease: sine, repeat: 1, yoyo: true }, 0);
    const blink = (t) => tl.fromTo('.sc-caret', { opacity: 1 }, { opacity: 0.1, duration: 0.26, ease: 'power1.inOut', repeat: 1, yoyo: true }, t);
    [0.15, 6.75, 7.35].forEach(blink);

    // ---- Clear: status and result go, output clears, the code is selected and deleted ----
    const c0 = 0.8;
    tl.to('.sc-pl-p', { scale: 0.5, opacity: 0, rotation: -12 * dir, duration: 0.36, ease: 'back.in(1.6)' }, c0);
    // The result card slides back up under the editor; the clip keeps its top edge on the
    // editor's bottom edge, so nothing shows beside the editor while it moves.
    // It rests in front of the editor's bottom edge; it tucks under it (clip the 24px overlap),
    // then slides up and away with the clip growing in step, so its top edge stays on the edge.
    const clip = (top) => `inset(${top}px -200px -200px -200px)`;
    const TUCK = 24;
    tl.to('.sc-rs-p', { clipPath: clip(TUCK), duration: 0.14, ease: 'power1.in' }, c0);
    tl.to('.sc-rs-p', { y: -200, clipPath: clip(TUCK + 200), duration: 0.5, ease: 'power2.in' }, c0 + 0.14);
    anchor('.sc-rs .w', { opacity: 0 }, c0 + 0.6);
    anchor('.sc-rs .tc', { scale: 0 }, c0 + 0.6);
    anchor('.sc-pl .rg', { opacity: 0 }, c0 + 0.4);
    anchor('.sc-bp', { opacity: 0 }, c0 + 0.4);
    tl.to('.sc-ol', { opacity: 0, x: -10, duration: 0.22, stagger: { each: 0.05, from: 'end' }, ease: 'power2.in' }, c0 + 0.05);
    tl.to('.sc-cmd .ch', { opacity: 0, duration: 0.02, stagger: { each: 0.012, from: 'end' } }, c0 + 0.15);
    tl.to('.sc-st .ok', { scale: 0, duration: 0.25, ease: 'back.in(2)' }, c0 + 0.05);
    tl.to('.sc-prog', { scaleX: 0, duration: 0.35, ease: 'power2.in' }, c0 + 0.05);
    const sels = qa('.sc-sel');
    const del = c0 + 0.5;
    if (sels.length) {
      tl.fromTo(sels, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.2, stagger: 0.022, ease: 'power2.out' }, c0 + 0.12);
      tl.to(sels, { opacity: 0, duration: 0.06 }, del);
    }
    tl.to('.sc-row .tk', { opacity: 0, duration: 0.06, ease: 'none' }, del);
    const bars = qa('.sc-mm i');
    if (bars.length) tl.to(bars, { scaleX: 0, duration: 0.06 }, del);
    tl.to(qa('.sc-row .no').slice(1), { opacity: 0, duration: 0.06 }, del);
    tl.to('.sc-caret', { x: X0 + 2, y: rowY(0), duration: 0.12, ease: 'power2.out' }, del);
    tl.to('.sc-band', { y: -(lastRow * LH), duration: 0.12, ease: 'power2.out' }, del);

    // ---- Type the code, token by token ----
    const T0 = 1.5; const T1 = 3.5;
    const breaks = steps.reduce((n, s, i) => n + (i && s.r !== steps[i - 1].r ? 1 : 0), 0);
    const unit = Math.min(0.085, (T1 - T0) / Math.max(1, steps.length + breaks * 1.6));
    let t = T0;
    let cur = 0;
    const nos = qa('.sc-row .no');
    tl.fromTo('.sc-tab .md', { opacity: 0 }, { opacity: 1, duration: 0.15 }, T0); // unsaved changes
    tl.fromTo('.sc-lt .in', { scale: 1 }, { scale: 1.12, duration: 0.16, ease: 'power2.out', repeat: 1, yoyo: true }, T0);
    steps.forEach((s, i) => {
      if (bars[s.r] && (i === 0 || s.r !== steps[i - 1].r)) {
        tl.fromTo(bars[s.r], { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, t + (s.r !== cur ? unit * 1.6 : 0));
      }
      if (s.r !== cur) {
        // Enter: the caret drops to the next line; line numbers appear as lines are made.
        t += unit * 1.6;
        for (let r = cur + 1; r <= s.r; r++) tl.fromTo(nos[r], { opacity: 0 }, { opacity: 1, duration: 0.12 }, t - unit);
        tl.to('.sc-band', { y: -((lastRow - s.r) * LH), duration: Math.min(0.1, unit * 1.5), ease: 'power2.out' }, t - unit);
        cur = s.r;
      }
      tl.fromTo(s.els, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, t);
      tl.to('.sc-caret', { x: s.x, y: rowY(s.r), duration: Math.min(0.07, unit), ease: 'power2.out' }, t);
      t += unit;
    });
    // Trailing empty rows (if any) get their numbers too.
    for (let r = cur + 1; r <= lastRow; r++) tl.fromTo(nos[r], { opacity: 0 }, { opacity: 1, duration: 0.12 }, t);
    const typed = Math.max(t, T0 + 0.4);

    // ---- Run: the command is typed into the terminal ----
    const run0 = typed + 0.1;
    tl.to('.sc-tab .md', { opacity: 0, duration: 0.15 }, run0); // saved
    const chars = qa('.sc-cmd .ch');
    const bc = q('.sc-bc');
    const left0 = chars.length ? chars[0].offsetLeft : 0;
    const cmdW = chars.length ? chars[chars.length - 1].offsetLeft + chars[chars.length - 1].offsetWidth - left0 : 0;
    const cdt = Math.min(0.035, 0.45 / Math.max(1, chars.length));
    tl.fromTo(bc, { opacity: 0, x: -cmdW }, { opacity: 1, x: -cmdW, duration: 0.01 }, run0);
    chars.forEach((c, i) => {
      const tt = run0 + 0.08 + i * cdt;
      tl.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.02, ease: 'none' }, tt);
      tl.to(bc, { x: -(cmdW - (c.offsetLeft + c.offsetWidth - left0)), duration: 0.02, ease: 'none' }, tt);
    });
    const enter = run0 + 0.08 + chars.length * cdt + 0.14;
    tl.to(bc, { opacity: 0, duration: 0.05 }, enter);
    // ...the spinner turns and the run bar fills...
    tl.fromTo('.sc-st .sp', { opacity: 0 }, { opacity: 1, duration: 0.12 }, enter);
    tl.fromTo('.sc-st .sp', { rotation: 0 }, { rotation: 720, duration: 0.85, ease: 'none' }, enter);
    tl.fromTo('.sc-prog', { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: 'power1.inOut' }, enter);
    // ...the output prints line by line...
    tl.fromTo('.sc-ol', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.17, ease: 'power2.out' }, enter + 0.2);
    const done = enter + 0.8;
    tl.to('.sc-st .sp', { opacity: 0, duration: 0.12 }, done - 0.05);
    tl.fromTo('.sc-st .ok', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, done);
    tl.fromTo('.sc-shine', { x: -300 }, { x: 800, duration: 0.8, ease: 'power2.inOut' }, done - 0.1);

    // ---- The result slides out from under the editor ----
    const res = done + 0.1;
    tl.fromTo('.sc-rs-p', { y: -200, clipPath: clip(TUCK + 200) }, { y: 0, clipPath: clip(TUCK), duration: 0.7, ease: 'power3.out' }, res);
    // ...and pops out in front of it.
    tl.to('.sc-rs-p', { clipPath: clip(0), duration: 0.2, ease: 'power2.out' }, res + 0.62);
    tl.fromTo('.sc-rs-p', { scale: 1 }, { scale: 1.035, duration: 0.15, ease: 'power2.out', repeat: 1, yoyo: true }, res + 0.62);
    tl.fromTo('.sc-rs .w', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }, res + 0.3);
    tl.fromTo('.sc-rs .ti', { scale: 1, rotation: 0 }, { scale: 1.12, rotation: -8 * dir, duration: 0.18, ease: 'power2.out', repeat: 1, yoyo: true }, res + 0.6);
    tl.fromTo('.sc-rs .tc', { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, res + 0.65);

    // ---- The status pill pops, with a little burst of spark petals ----
    const pop = res + 0.45;
    tl.fromTo('.sc-pl-p', { scale: 0.4, opacity: 0, rotation: -14 * dir }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.9)' }, pop);
    const pw = q('.sc-pl').offsetWidth;
    tl.fromTo('.sc-pl .sh', { x: -120 * dir }, { x: (pw + 60) * dir, duration: 0.7, ease: 'power2.inOut' }, pop + 0.4);
    const ping = (tt) => tl.fromTo('.sc-pl .rg', { scale: 1, opacity: 0.9 }, { scale: 1.8, opacity: 0, duration: 0.7, ease: 'power2.out' }, tt);
    ping(pop + 0.35);
    ping(7.0);
    qa('.sc-bp').forEach((p, j) => {
      const a = (100 + j * 25) * Math.PI / 180; // a fan to the side and below, away from the brand row
      const rr = 66 + (j % 2) * 24;
      tl.fromTo(p, { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: j * 50 + 90 },
        { x: Math.cos(a) * rr * dir, y: Math.sin(a) * rr, scale: 1, opacity: 0, rotation: j * 50 + 220, duration: 0.75, ease: 'power3.out' }, pop + 0.12);
    });
  },
};
