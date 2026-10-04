// Cuts trimmed, ready-to-use logo PNGs out of the original logo files in brand/logo/source.
// The originals are 4168×4167 canvases with lots of empty space; templates need tight crops.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => path.join(root, 'brand/logo/source', f);
const outDir = path.join(root, 'exports/logo');
fs.mkdirSync(outDir, { recursive: true });

// In the full-logo files the symbol and the wordmark are separated by an empty band;
// find it from the alpha channel instead of hard-coding pixel rows.
async function splitRows(file) {
  const { data, info } = await sharp(file).ensureAlpha().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
  const filled = [];
  for (let y = 0; y < info.height; y++) {
    let any = false;
    for (let x = 0; x < info.width; x += 2) {
      if (data[y * info.width + x] > 8) { any = true; break; }
    }
    filled.push(any);
  }
  const runs = [];
  let start = null;
  filled.forEach((f, y) => {
    if (f && start === null) start = y;
    if (!f && start !== null) { runs.push([start, y]); start = null; }
  });
  if (start !== null) runs.push([start, info.height]);
  if (runs.length !== 2) throw new Error(`${path.basename(file)}: expected symbol + wordmark, found ${runs.length} bands`);
  return { width: info.width, symbol: runs[0], wordmark: runs[1] };
}

async function cut(file, [top, bottom], width, out) {
  const buf = await sharp(file).extract({ left: 0, top, width, height: bottom - top }).png().toBuffer();
  await sharp(buf).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(path.join(outDir, out));
}

const variants = [
  ['Crapto Studio-08.png', 'color'],
  ['Crapto Studio-10.png', 'white'],
  ['Crapto Studio-11.png', 'black'],
];

for (const [file, name] of variants) {
  const rows = await splitRows(src(file));
  await sharp(src(file)).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(path.join(outDir, `logo-${name}.png`));
  await cut(src(file), rows.symbol, rows.width, `symbol-${name}.png`);
  await cut(src(file), rows.wordmark, rows.width, `wordmark-${name}.png`);
}

// Symbol parts for animation: the body (network shape) and each orange petal on its own,
// so petals can fly in separately and the body can be shown white with orange petals.
const partsDir = path.join(outDir, 'parts');
fs.mkdirSync(partsDir, { recursive: true });
const colorSym = await sharp(path.join(outDir, 'symbol-color.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const whiteSym = await sharp(path.join(outDir, 'symbol-white.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = colorSym.info;
if (whiteSym.info.width !== W || whiteSym.info.height !== H) throw new Error('colour and white symbol crops differ in size');

const isOrange = (d, i) => d[i + 3] > 40 && d[i] > 180 && d[i] - d[i + 2] > 90;
const orange = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) orange[p] = isOrange(colorSym.data, p * 4) ? 1 : 0;

// Connected components on the orange mask = the petals.
const label = new Int32Array(W * H);
const petals = [];
for (let p = 0; p < W * H; p++) {
  if (!orange[p] || label[p]) continue;
  const id = petals.length + 1;
  const box = { x0: W, y0: H, x1: 0, y1: 0, n: 0 };
  const stack = [p];
  label[p] = id;
  while (stack.length) {
    const q = stack.pop();
    const x = q % W; const y = (q - x) / W;
    box.x0 = Math.min(box.x0, x); box.y0 = Math.min(box.y0, y); box.x1 = Math.max(box.x1, x); box.y1 = Math.max(box.y1, y); box.n++;
    for (const r of [q - 1, q + 1, q - W, q + W]) {
      if (r >= 0 && r < W * H && orange[r] && !label[r] && Math.abs((r % W) - x) <= 1) { label[r] = id; stack.push(r); }
    }
  }
  petals.push({ id, ...box });
}
const real = petals.filter((b) => b.n > 2000).sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));
if (real.length !== 4) throw new Error(`expected 4 petals, found ${real.length}`);

const meta = { width: W, height: H, petals: [] };
for (const [i, b] of real.entries()) {
  const pad = 6;
  const x0 = Math.max(0, b.x0 - pad); const y0 = Math.max(0, b.y0 - pad);
  const w = Math.min(W, b.x1 + pad + 1) - x0; const h = Math.min(H, b.y1 + pad + 1) - y0;
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * W + (x0 + x)) * 4; const d = (y * w + x) * 4;
      const keep = label[(y0 + y) * W + (x0 + x)] === b.id || (isOrange(colorSym.data, s) && !label[(y0 + y) * W + (x0 + x)]);
      // Anti-aliased edge pixels next to the petal keep their colour too.
      const edge = !keep && colorSym.data[s] > colorSym.data[s + 2] && colorSym.data[s + 3] > 0;
      if (keep || edge) colorSym.data.copy(buf, d, s, s + 4);
    }
  }
  const file = `petal-${i + 1}.png`;
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join(partsDir, file));
  meta.petals.push({ file, x: x0, y: y0, w, h });
}

// Bodies: the symbol with the petal areas removed (petal boxes cleared of warm pixels).
for (const [sym, name] of [[colorSym, 'body-color.png'], [whiteSym, 'body-white.png']]) {
  const buf = Buffer.from(sym.data);
  for (const pt of meta.petals) {
    for (let y = pt.y; y < pt.y + pt.h; y++) {
      for (let x = pt.x; x < pt.x + pt.w; x++) {
        const i = (y * W + x) * 4;
        const warm = colorSym.data[i + 3] > 0 && colorSym.data[i] > colorSym.data[i + 2];
        if (warm) buf[i + 3] = 0;
      }
    }
  }
  await sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join(partsDir, name));
}
// Droplets for the "liquid logo" animation: points well inside the body, on a grid. Drawn as
// overlapping circles under a gooey filter they form a blobby copy of the symbol.
const alphaAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : whiteSym.data[(Math.round(y) * W + Math.round(x)) * 4 + 3]);
const STEP = 120; const INSET = 70; const R = 118;
meta.droplets = [];
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    if (alphaAt(x, y) < 200) continue;
    let inside = true;
    for (let k = 0; k < 8 && inside; k++) {
      const a = (k / 8) * Math.PI * 2;
      if (alphaAt(x + Math.cos(a) * INSET, y + Math.sin(a) * INSET) < 200) inside = false;
    }
    if (inside) meta.droplets.push([x, y, R]);
  }
}
fs.writeFileSync(path.join(partsDir, 'parts.json'), JSON.stringify({ ...meta, droplets: meta.droplets }, null, 1).replace(/\[\n\s+(\d+),\n\s+(\d+),\n\s+(\d+)\n\s+\]/g, '[$1, $2, $3]') + '\n');

console.log('logo: wrote', fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).length, 'PNGs to exports/logo, plus symbol parts in exports/logo/parts');
