// Shared UI kit for the motion scenes: app windows, chat bubbles, chips, a phone frame and
// Lucide icons. Scenes compose these so every visual reads as one product family.
// All spacing uses logical properties (inline-start/end) so Arabic scenes mirror correctly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { color, gradient } from '../tokens.mjs';
import { stack } from '../fonts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function ico(name, { size = 28, stroke = 2, cls = '' } = {}) {
  const file = path.join(root, 'node_modules/lucide-static/icons', `${name}.svg`);
  return fs.readFileSync(file, 'utf8')
    .replace(/<!--.*?-->/s, '')
    .replace(/class="[^"]*"/, `class="ico ${cls}"`)
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`)
    .replace(/stroke-width="2"/, `stroke-width="${stroke}"`)
    .trim();
}

export const symbolPng = (name = 'symbol-color') =>
  `data:image/png;base64,${fs.readFileSync(path.join(root, 'exports/logo', `${name}.png`)).toString('base64')}`;

export function uiCss(ctx) {
  const light = ctx.theme === 'light';
  const v = light
    ? { card: '#FFFFFF', cardLine: '#D3E1EE', text: color.ink, sub: '#3B5170', soft: '#EEF4FA', shadow: '0 30px 60px rgba(14,26,43,.14)' }
    : { card: color.navy, cardLine: 'rgba(147,169,198,.22)', text: color.white, sub: color.slate, soft: '#1A2D4C', shadow: '0 40px 80px rgba(3,8,18,.45)' };
  return `
:root{--card:${v.card};--card-line:${v.cardLine};--ui-text:${v.text};--ui-sub:${v.sub};--soft:${v.soft};--shadow:${v.shadow};
  --cobalt:${color.cobalt};--blue:${color.blue};--sky:${color.sky};--spark:${color.spark};--ember:${color.ember};--amber:${color.amber};
  --brand:${gradient.brand};--sparkg:${gradient.spark};--midnight:${color.midnight}}
.ico{display:block;flex:none}
.card{background:var(--card);border:2px solid var(--card-line);border-radius:28px;box-shadow:var(--shadow);color:var(--ui-text)}
.win{background:var(--card);border:2px solid var(--card-line);border-radius:26px;box-shadow:var(--shadow);overflow:hidden;color:var(--ui-text)}
.win-bar{height:58px;display:flex;align-items:center;gap:10px;padding-inline:22px;border-bottom:2px solid var(--card-line);font:600 20px ${stack.mono};color:var(--ui-sub)}
.win-bar .d{width:14px;height:14px;border-radius:50%;background:var(--card-line)}
.win-bar .d:nth-child(1){background:#FF6159}.win-bar .d:nth-child(2){background:#FFBD2E}.win-bar .d:nth-child(3){background:#28C941}
.win-bar .t{margin-inline-start:12px}
.bubble{max-width:78%;padding:20px 26px;border-radius:28px;font-size:${ctx.rtl ? 27 : 28}px;line-height:${ctx.rtl ? 1.6 : 1.4};font-weight:500}
.bubble.me{align-self:flex-end;background:linear-gradient(135deg,${color.cobalt},#3A74B7);color:#fff;border-end-end-radius:8px}
.bubble.ai{align-self:flex-start;background:var(--soft);color:var(--ui-text);border-end-start-radius:8px}
.chip{display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;background:var(--soft);border:2px solid var(--card-line);font:600 ${ctx.rtl ? 22 : 21}px ${ctx.rtl ? stack.arabic : stack.mono};color:var(--ui-text);white-space:nowrap}
.chip.hot{background:var(--sparkg);border-color:transparent;color:${color.ink}}
.chip.ok{background:var(--cobalt);border-color:transparent;color:#fff}
.avatar{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;flex:none}
.avatar.brand{background:var(--brand);color:#fff}
.typing{display:inline-flex;gap:8px;padding:22px 26px;border-radius:28px;background:var(--soft)}
.typing i{width:12px;height:12px;border-radius:50%;background:var(--ui-sub)}
.phone{width:330px;height:680px;border-radius:58px;background:#05090F;padding:14px;box-shadow:var(--shadow),inset 0 0 0 2px rgba(255,255,255,.08)}
.phone .screen{width:100%;height:100%;border-radius:46px;overflow:hidden;position:relative;background:var(--card)}
.phone .island{position:absolute;top:14px;left:50%;width:104px;height:30px;margin-left:-52px;border-radius:20px;background:#05090F;z-index:5}
.spark{position:absolute;width:22px;height:34px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:var(--sparkg)}
.goo{filter:url(#goo)}
`;
}

// SVG "gooey" filter: overlapping circles melt together like the blobs in the logo.
export const gooFilter = `<svg width="0" height="0" style="position:absolute"><defs><filter id="goo">
<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b"/>
<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g"/>
<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs></svg>`;
