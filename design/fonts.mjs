// Embedded @font-face rules shared by the static templates and the motion scenes.
// Latin text uses Plus Jakarta Sans / JetBrains Mono; Arabic glyphs fall through to Alexandria,
// so one font stack ("Plus Jakarta Sans", "Alexandria") handles mixed Arabic/English text.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const face = (family, dir, subset, weight) => {
  const file = path.join(root, 'node_modules/@fontsource', dir, 'files', `${dir}-${subset}-${weight}-normal.woff2`);
  const data = fs.readFileSync(file).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};

export const fontCss = [
  ...[500, 700, 800].map((w) => face('Plus Jakarta Sans', 'plus-jakarta-sans', 'latin', w)),
  ...[500, 700].map((w) => face('JetBrains Mono', 'jetbrains-mono', 'latin', w)),
  ...[400, 500, 700, 800].map((w) => face('Alexandria', 'alexandria', 'arabic', w)),
].join('\n');

export const stack = {
  display: "'Plus Jakarta Sans', 'Alexandria', sans-serif",
  mono: "'JetBrains Mono', 'Alexandria', monospace",
  arabic: "'Alexandria', 'Plus Jakarta Sans', sans-serif",
};
