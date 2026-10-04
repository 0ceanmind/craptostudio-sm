// Renders the animated hero videos: every post × language × format, frame by frame.
// The GSAP timeline is seeked to each frame time, so output is identical on every run.
//
//   node design/motion/render-video.mjs                     all posts, en+ar, feed+reel
//   node design/motion/render-video.mjs ai games            only these post slugs
//   node design/motion/render-video.mjs ai --lang ar --format reel
//   node design/motion/render-video.mjs ai --preview        contact sheet of 8 frames → .preview/
//   node design/motion/render-video.mjs ai --preview 0,2.5,4,7.9
//   node design/motion/render-video.mjs ai --frame 5.5     one full-size frame → .preview/
//   node design/motion/render-video.mjs ai --loopcheck     how far the last frame is from frame 0
//
// Output: exports/motion/NN-<slug>/<lang>-<format>.mp4 plus <lang>-<format>.jpg (frame 0, the
// same complete composition Instagram shows as the thumbnail).
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { posts } from '../content.mjs';
import { stage, FORMATS } from './stage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FPS = 30;

let ffmpegPath = 'ffmpeg';
try { ffmpegPath = (await import('ffmpeg-static')).default || 'ffmpeg'; } catch { /* fall back to system ffmpeg */ }

const args = process.argv.slice(2);
// --lang/--format/--frame take a value; --preview takes an optional list of times.
const takesValue = (flag, next) => next !== undefined && !next.startsWith('--')
  && (['--lang', '--format', '--frame'].includes(flag) || (flag === '--preview' && /^[0-9.,]+$/.test(next)));
const flags = {};
const slugs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    flags[args[i].slice(2)] = takesValue(args[i], args[i + 1]) ? args[++i] : true;
  } else {
    slugs.push(args[i]);
  }
}
const opt = (name) => flags[name] ?? null;
const langs = opt('lang') ? [opt('lang')] : ['en', 'ar'];
const formats = opt('format') ? [opt('format')] : ['feed', 'reel'];
const preview = opt('preview');
const frameAt = opt('frame');
const loopcheck = opt('loopcheck');

const pad = (n) => String(n).padStart(2, '0');
const selected = posts.filter((p) => p.scene && (!slugs.length || slugs.includes(p.slug)));
if (!selected.length) { console.error('no matching posts with a scene'); process.exit(1); }

function encode(file, width, height) {
  const ff = spawn(ffmpegPath, [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-vf', `scale=${width}:${height}:flags=lanczos`, '-r', String(FPS), '-movflags', '+faststart', file,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (code) => (code ? rej(new Error(`ffmpeg exited ${code}`)) : res())));
  return { write: (buf) => new Promise((res) => (ff.stdin.write(buf) ? res() : ff.stdin.once('drain', res))), end: () => { ff.stdin.end(); return done; } };
}

const browser = await chromium.launch();
let videos = 0;

for (const post of selected) {
  const scene = (await import(path.join(root, 'design/scenes', `${post.scene}.mjs`))).default;
  for (const lang of langs) {
    for (const format of formats) {
      const { width, height } = FORMATS[format];
      const page = await browser.newPage({ viewport: { width, height } });
      await page.setContent(stage({ scene, post, lang, format }), { waitUntil: 'load' });
      await page.waitForFunction(() => window.__ready === true);
      const duration = await page.evaluate(() => window.__duration);
      const name = `${lang}-${format}`;

      if (frameAt !== null && frameAt !== true) {
        await page.evaluate((tt) => window.__seek(tt), Number(frameAt));
        const out = path.join(root, '.preview', `${post.slug}-${name}-${frameAt}s.png`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        await page.screenshot({ path: out });
        console.log(`frame: ${path.relative(root, out)}`);
      } else if (loopcheck) {
        // Seamless = (1) the state at t=duration equals frame 0, and (2) the jump across the seam
        // (last frame -> frame 0) is no bigger than an ordinary frame-to-frame step elsewhere.
        const grab = async (tt) => { await page.evaluate((x) => window.__seek(x), tt); return sharp(await page.screenshot()).removeAlpha().raw().toBuffer(); };
        const diff = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]); return d / a.length; };
        const first = await grab(0);
        const end = diff(first, await grab(duration));
        const seam = diff(await grab(duration - 1 / FPS), first);
        const steps = [];
        for (const f of [0.2, 0.45, 0.7, 0.9]) steps.push(diff(await grab(duration * f), await grab(duration * f + 1 / FPS)));
        const typical = Math.max(...steps);
        const ok = end < 0.5 && seam <= Math.max(typical * 1.5, 0.6);
        console.log(`loopcheck ${post.slug} ${name}: end-vs-start ${end.toFixed(2)}, seam step ${seam.toFixed(2)}, typical step ≤ ${typical.toFixed(2)} (mean abs diff /255) ${ok ? 'OK' : 'NOT SEAMLESS'}`);
      } else if (preview) {
        const times = preview === true ? [0, 1, 2, 3, 4, 5, 6, 7].map((t) => t * duration / 8) : String(preview).split(',').map(Number);
        const tiles = [];
        for (const t of times) {
          await page.evaluate((tt) => window.__seek(tt), t);
          tiles.push(await sharp(await page.screenshot()).resize(Math.round(width / 3)).png().toBuffer());
        }
        const tw = Math.round(width / 3); const th = Math.round(height / 3);
        const cols = Math.min(4, tiles.length); const rows = Math.ceil(tiles.length / cols);
        const out = path.join(root, '.preview', `${post.slug}-${name}.png`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        await sharp({ create: { width: cols * tw + (cols - 1) * 6, height: rows * th + (rows - 1) * 6, channels: 3, background: '#7a7f88' } })
          .composite(tiles.map((input, i) => ({ input, left: (i % cols) * (tw + 6), top: Math.floor(i / cols) * (th + 6) })))
          .png().toFile(out);
        console.log(`preview: ${path.relative(root, out)} (t = ${times.map((t) => t.toFixed(2)).join(', ')})`);
      } else {
        const dir = path.join(root, 'exports/motion', `${pad(post.order)}-${post.slug}`);
        fs.mkdirSync(dir, { recursive: true });
        const enc = encode(path.join(dir, `${name}.mp4`), width, height);
        const frames = Math.round(duration * FPS);
        const t0 = Date.now();
        for (let i = 0; i < frames; i++) {
          await page.evaluate((tt) => window.__seek(tt), i / FPS);
          const buf = await page.screenshot({ type: 'jpeg', quality: 96 });
          if (i === 0) await sharp(buf).jpeg({ quality: 92 }).toFile(path.join(dir, `${name}.jpg`));
          await enc.write(buf);
        }
        await enc.end();
        videos++;
        console.log(`video: ${path.relative(root, path.join(dir, `${name}.mp4`))} ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      }
      await page.close();
    }
  }
}

await browser.close();
if (videos) console.log(`motion: wrote ${videos} videos to exports/motion/`);
