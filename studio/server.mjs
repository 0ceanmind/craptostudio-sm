#!/usr/bin/env node
// Crapto Studio workspace: a local web app to edit posts, preview the animations live, render
// images and videos, and generate new posts from your Claude Code projects.
//
//   npm run studio            → http://localhost:4600
//   STUDIO_PORT=5000 npm run studio
//
// It only listens on this computer (127.0.0.1).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  root, postsDir, getPost, listPosts, savePost, deletePost, duplicatePost, exportsOf, saveAsset, listAssets,
  safeRepoPath, uniqueSlug, nextOrder, ValidationError,
} from './core/store.mjs';
import { newPost, validatePost, emptySlide, SLIDE_TYPES, THEMES, STATUSES, iconExists } from './core/schema.mjs';
import { listScenes, sceneNames } from './core/scenes.mjs';
import { heroHtml, slidePreviewHtml, errorHtml } from './core/render-html.mjs';
import { startJob, listJobs, cancelJob, jobsDir, KINDS } from './core/jobs.mjs';
import { listProjects, startRun, stopRun, getRun, listRuns, runEvents, connectionStatus, resumeCommand } from './core/claude.mjs';
import { searchIcons } from './core/kit.mjs';

const PORT = Number(process.env.STUDIO_PORT || 4600);
const HOST = '127.0.0.1';
const pub = path.join(root, 'studio/public');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8',
};

// ---------- helpers ----------

const send = (res, status, body, type = 'application/json') => {
  const data = type === 'application/json' ? JSON.stringify(body) : body;
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(data);
};
const ok = (res, body) => send(res, 200, body);
const bad = (res, status, error, extra = {}) => send(res, status, { error, ...extra });

function sendFile(req, res, file, { cache = false } = {}) {
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  const headers = { 'content-type': type, 'cache-control': cache ? 'max-age=3600' : 'no-cache', 'last-modified': stat.mtime.toUTCString(), 'accept-ranges': 'bytes' };
  // Range requests let the browser seek in rendered videos.
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${stat.size}`, 'content-length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { ...headers, 'content-length': stat.size });
  fs.createReadStream(file).pipe(res);
}

async function body(req, { limit = 2 * 1024 * 1024, raw = false } = {}) {
  const chunks = []; let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw Object.assign(new Error('request too large'), { status: 413 });
    chunks.push(c);
  }
  const buf = Buffer.concat(chunks);
  if (raw) return buf;
  try { return buf.length ? JSON.parse(buf.toString('utf8')) : {}; } catch { throw Object.assign(new Error('invalid JSON'), { status: 400 }); }
}

const summary = (p) => {
  const files = exportsOf(p);
  const has = (rel) => files.find((f) => f.path.endsWith(rel));
  const cover = has('/en/01-cover.png');
  return {
    slug: p.slug, order: p.order, status: p.status, theme: p.theme, scene: p.scene, icon: p.icon,
    headline: p.headline, tag: p.tag, slides: p.slides.length + 1, source: p.source ?? null,
    cover: cover ? `/${cover.path}?v=${Math.round(cover.mtime)}` : null,
    rendered: { stills: !!cover, video: !!has('/en/01-hero.mp4') },
    updatedAt: fs.statSync(path.join(postsDir, `${p.slug}.json`)).mtimeMs,
  };
};

// ---------- live updates (Server-Sent Events) ----------

const clients = new Set();
const broadcast = (type, data = {}) => {
  const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) res.write(msg);
};

// Posts changed on disk (saved here, by Claude Code through the MCP server, or by hand).
let postsTimer = null;
fs.mkdirSync(postsDir, { recursive: true });
fs.watch(postsDir, () => { clearTimeout(postsTimer); postsTimer = setTimeout(() => broadcast('posts'), 150); });
// Render jobs (any process) — poll their files and push changes.
let jobsSig = '';
setInterval(() => {
  const jobs = listJobs({ limit: 30 });
  const sig = jobs.map((j) => `${j.id}:${j.status}:${Math.round(j.progress * 200)}:${j.message}`).join('|');
  if (sig !== jobsSig) { jobsSig = sig; broadcast('jobs', jobs); }
}, 700).unref();
// Scenes edited on disk (new showcase scenes, fixes) — the editor reloads the catalog.
let scenesTimer = null;
fs.watch(path.join(root, 'design/scenes'), () => { clearTimeout(scenesTimer); scenesTimer = setTimeout(() => broadcast('scenes'), 300); });
runEvents.on('event', (id, ev) => broadcast('run', { id, event: ev }));

// ---------- API ----------

const routes = [];
const route = (method, pattern, handler) => routes.push({ method, re: new RegExp(`^${pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)')}$`), handler });

route('GET', '/api/meta', async (req, res) => ok(res, {
  themes: THEMES, statuses: STATUSES, slideTypes: SLIDE_TYPES, jobKinds: KINDS, nextOrder: nextOrder(),
  port: PORT, root, claude: connectionStatus(),
}));
route('GET', '/api/posts', async (req, res) => ok(res, listPosts().map(summary)));
route('GET', '/api/posts/:slug', async (req, res, { slug }) => {
  const post = getPost(slug);
  ok(res, { post, exports: exportsOf(post), assets: listAssets(slug), validation: validatePost(post, { scenes: await sceneNames() }) });
});
route('POST', '/api/posts', async (req, res) => {
  const b = await body(req);
  const slug = uniqueSlug(b.slug || b.name || 'new-post');
  const post = b.post ? { ...b.post, slug, order: b.post.order ?? nextOrder() } : newPost({ slug, order: nextOrder(), theme: b.theme, scene: b.scene });
  ok(res, await savePost(post));
});
route('PUT', '/api/posts/:slug', async (req, res, { slug }) => {
  const b = await body(req);
  ok(res, await savePost(b.post, { previousSlug: slug }));
});
route('POST', '/api/posts/:slug/validate', async (req, res) => {
  const b = await body(req);
  ok(res, validatePost(b.post, { scenes: await sceneNames() }));
});
route('POST', '/api/posts/:slug/duplicate', async (req, res, { slug }) => ok(res, await duplicatePost(slug)));
route('DELETE', '/api/posts/:slug', async (req, res, { slug }) => ok(res, deletePost(slug)));
route('POST', '/api/posts/:slug/assets', async (req, res, { slug }) => {
  const name = decodeURIComponent(req.headers['x-filename'] ?? 'image.png');
  const buf = await body(req, { raw: true, limit: 40 * 1024 * 1024 });
  ok(res, await saveAsset(slug, name, buf));
});

route('GET', '/api/scenes', async (req, res) => ok(res, await listScenes()));
route('GET', '/api/icons', async (req, res, p, url) => {
  const q = url.searchParams.get('q') ?? '';
  ok(res, q ? searchIcons(q, 60) : []);
});
route('GET', '/api/slide-template/:type', async (req, res, { type }) => ok(res, emptySlide(type) ?? null));

// Previews take the (possibly unsaved) post in the body and return HTML for an iframe.
route('POST', '/api/preview/hero', async (req, res) => {
  const { post, lang = 'en', format = 'feed' } = await body(req);
  try { send(res, 200, await heroHtml(post, { lang, format }), 'text/html; charset=utf-8'); } catch (e) {
    send(res, 200, errorHtml(e.message, { height: format === 'reel' ? 1920 : 1350 }), 'text/html; charset=utf-8');
  }
});
route('POST', '/api/preview/slide', async (req, res) => {
  const { post, index, lang = 'en' } = await body(req);
  try { send(res, 200, slidePreviewHtml(post, index, { lang }), 'text/html; charset=utf-8'); } catch (e) {
    const msg = /unsupported file type \.(\s|\)|$)|ENOENT/.test(e.message) ? 'Add an image: drop a screenshot on this slide, or pick one from the post’s images.' : e.message;
    send(res, 200, errorHtml(msg), 'text/html; charset=utf-8');
  }
});

route('GET', '/api/jobs', async (req, res) => ok(res, listJobs({ limit: 40 })));
route('POST', '/api/jobs', async (req, res) => {
  const b = await body(req);
  getPost(b.slug);
  ok(res, startJob({ kind: b.kind, slug: b.slug, langs: b.langs, formats: b.formats, source: 'workspace' }));
});
route('POST', '/api/jobs/:id/cancel', async (req, res, { id }) => ok(res, cancelJob(id)));
route('GET', '/api/jobs/:id/log', async (req, res, { id }) => {
  const file = path.join(jobsDir, `${id}.log`);
  send(res, 200, /^[a-z0-9-]+$/.test(id) && fs.existsSync(file) ? fs.readFileSync(file, 'utf8').slice(-20000) : '', 'text/plain; charset=utf-8');
});

route('GET', '/api/claude/status', async (req, res) => ok(res, connectionStatus()));
route('GET', '/api/claude/projects', async (req, res) => ok(res, listProjects()));
route('GET', '/api/claude/runs', async (req, res) => ok(res, listRuns()));
route('GET', '/api/claude/runs/:id', async (req, res, { id }) => {
  const run = getRun(id);
  if (!run) return bad(res, 404, 'no such run');
  ok(res, { ...run, resume: resumeCommand(run) });
});
route('POST', '/api/claude/runs', async (req, res) => {
  const b = await body(req);
  ok(res, startRun({ cwd: b.cwd, sessionId: b.sessionId || null, request: b.request ?? '', model: b.model ?? '' }));
});
route('POST', '/api/claude/runs/:id/message', async (req, res, { id }) => {
  const b = await body(req);
  if (!b.message?.trim()) return bad(res, 400, 'empty message');
  ok(res, startRun({ followUpOf: id, message: b.message }));
});
route('POST', '/api/claude/runs/:id/stop', async (req, res, { id }) => ok(res, stopRun(id)));
route('POST', '/api/connect', async (req, res) => {
  // Runs `npm run connect` (registers the MCP server and installs /crapto-post).
  const child = spawn(process.execPath, [path.join(root, 'studio/connect.mjs')], { cwd: root });
  let out = '';
  child.stdout.on('data', (c) => { out += c; });
  child.stderr.on('data', (c) => { out += c; });
  child.on('close', (code) => ok(res, { ok: code === 0, output: out, status: connectionStatus() }));
});

route('POST', '/api/open-folder', async (req, res) => {
  const { rel } = await body(req);
  const dir = path.resolve(root, rel ?? '');
  if (!dir.startsWith(root) || !fs.existsSync(dir)) return bad(res, 404, 'folder not found');
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'explorer' : 'xdg-open';
  spawn(cmd, [dir], { detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
  ok(res, { opened: dir });
});

// ---------- server ----------

const allowedHosts = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`]);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  // Only this computer's browser may talk to the workspace: the Host check blocks DNS-rebinding
  // pages, and the custom header on changes blocks cross-site form posts.
  if (!allowedHosts.has(req.headers.host)) return bad(res, 403, 'forbidden host');
  if (req.method !== 'GET' && req.headers['x-studio'] !== '1') return bad(res, 403, 'missing x-studio header');

  try {
    if (url.pathname === '/api/events') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
      res.write('retry: 1500\n\n');
      clients.add(res);
      const ping = setInterval(() => res.write(': ping\n\n'), 20_000);
      req.on('close', () => { clearInterval(ping); clients.delete(res); });
      return;
    }
    if (url.pathname.startsWith('/api/')) {
      for (const r of routes) {
        const m = r.method === req.method && url.pathname.match(r.re);
        if (m) return await r.handler(req, res, Object.fromEntries(Object.entries(m.groups ?? {}).map(([k, v]) => [k, decodeURIComponent(v)])), url);
      }
      return bad(res, 404, 'unknown endpoint');
    }
    // Rendered files and uploaded images.
    if (url.pathname.startsWith('/exports/') || url.pathname.startsWith('/content/assets/')) {
      const file = safeRepoPath(url.pathname);
      return file ? sendFile(req, res, file) : bad(res, 404, 'not found');
    }
    if (url.pathname.startsWith('/icons/')) {
      const name = url.pathname.slice(7).replace(/\.svg$/, '');
      if (!iconExists(name)) return bad(res, 404, 'no such icon');
      return sendFile(req, res, path.join(root, 'node_modules/lucide-static/icons', `${name}.svg`), { cache: true });
    }
    if (url.pathname.startsWith('/fonts/')) {
      const m = url.pathname.match(/^\/fonts\/([a-z-]+)\/([a-z0-9-]+\.woff2)$/);
      const file = m && path.join(root, 'node_modules/@fontsource', m[1], 'files', m[2]);
      return file && fs.existsSync(file) ? sendFile(req, res, file, { cache: true }) : bad(res, 404, 'not found');
    }
    if (url.pathname === '/brand/logo.png') return sendFile(req, res, path.join(root, 'exports/logo/symbol-color.png'), { cache: true });
    if (url.pathname === '/brand/logo-white.png') return sendFile(req, res, path.join(root, 'exports/logo/symbol-white.png'), { cache: true });
    // The app itself.
    const rel = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const file = path.resolve(pub, rel);
    if (file.startsWith(pub + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return sendFile(req, res, file);
    return bad(res, 404, 'not found');
  } catch (e) {
    if (e instanceof ValidationError) return bad(res, 422, e.message, { errors: e.errors, warnings: e.warnings });
    if (!res.headersSent) bad(res, e.status ?? 500, e.message);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Crapto Studio workspace → http://localhost:${PORT}\n`);
  console.log(`  ${listPosts().length} posts in content/posts · renders in exports/ · Ctrl+C to stop`);
  const c = connectionStatus();
  console.log(`  Claude Code: ${c.cli.ok ? c.cli.version : 'CLI not found (generation from projects is off)'}${c.mcp ? ' · MCP connected' : ' · run `npm run connect` to use /crapto-post in Claude Code'}\n`);
  if (process.argv.includes('--open')) {
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(cmd, [`http://localhost:${PORT}`], { shell: process.platform === 'win32', detached: true, stdio: 'ignore' }).on('error', () => {}).unref();
  }
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`Port ${PORT} is busy. Is the studio already running? Or start it on another port: STUDIO_PORT=4601 npm run studio`);
  else console.error(e);
  process.exit(1);
});
