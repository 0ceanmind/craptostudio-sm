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

console.log('logo: wrote', fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).length, 'PNGs to exports/logo');
