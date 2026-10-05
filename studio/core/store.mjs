// Reading and writing posts, their uploaded images and their rendered exports. Shared by the
// workspace server (studio/server.mjs) and the Claude Code MCP server (studio/mcp.mjs).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { root, postsDir, loadPosts, loadPost, postFolder } from '../../design/posts.mjs';
import { validatePost, normalizePost, SLUG_RE, slugify } from './schema.mjs';
import { validationContext } from './scenes.mjs';

export { root, postsDir };
export const assetsDir = path.join(root, 'content/assets');
export const exportsDir = path.join(root, 'exports');
export const studioDir = path.join(root, '.studio');
const trashDir = path.join(studioDir, 'trash');

export class ValidationError extends Error {
  constructor(errors, warnings = []) {
    super(`The post has ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`);
    this.errors = errors; this.warnings = warnings;
  }
}

const postFile = (slug) => {
  if (!SLUG_RE.test(slug ?? '')) throw new Error(`invalid post slug "${slug}"`);
  return path.join(postsDir, `${slug}.json`);
};
export const postExists = (slug) => SLUG_RE.test(slug ?? '') && fs.existsSync(postFile(slug));

export function getPost(slug) {
  if (!postExists(slug)) throw new Error(`no post named "${slug}"`);
  return normalizePost(loadPost(slug));
}

export const listPosts = () => loadPosts().map(normalizePost);

export const nextOrder = () => Math.max(0, ...loadPosts().map((p) => p.order)) + 1;

export function uniqueSlug(base) {
  let slug = slugify(base); let n = 2;
  while (postExists(slug)) slug = `${slugify(base).slice(0, 36)}-${n++}`;
  return slug;
}

// Rendered files for a post: exports/posts/NN-slug/<lang>/… and exports/reels/NN-slug-<lang>….
export function exportsOf(post) {
  const folder = postFolder(post);
  const files = [];
  for (const lang of ['en', 'ar']) {
    const dir = path.join(exportsDir, 'posts', folder, lang);
    if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).sort()) files.push(`exports/posts/${folder}/${lang}/${f}`);
  }
  const reels = path.join(exportsDir, 'reels');
  if (fs.existsSync(reels)) for (const f of fs.readdirSync(reels).sort()) if (f.startsWith(`${folder}-`)) files.push(`exports/reels/${f}`);
  return files.map((rel) => ({ path: rel, size: fs.statSync(path.join(root, rel)).size, mtime: fs.statSync(path.join(root, rel)).mtimeMs }));
}

// Keeps rendered files with their post when its slug or posting order changes.
function moveExports(from, to) {
  const a = postFolder(from); const b = postFolder(to);
  if (a === b) return;
  const src = path.join(exportsDir, 'posts', a); const dst = path.join(exportsDir, 'posts', b);
  if (fs.existsSync(src) && !fs.existsSync(dst)) fs.renameSync(src, dst);
  const reels = path.join(exportsDir, 'reels');
  if (fs.existsSync(reels)) {
    for (const f of fs.readdirSync(reels)) {
      if (f.startsWith(`${a}-`) && !fs.existsSync(path.join(reels, b + f.slice(a.length)))) fs.renameSync(path.join(reels, f), path.join(reels, b + f.slice(a.length)));
    }
  }
}

const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
};

// Field order in the saved file, so diffs stay readable.
const KEY_ORDER = ['slug', 'order', 'status', 'theme', 'scene', 'icon', 'tag', 'headline', 'sub', 'sceneCopy', 'sceneData', 'slides', 'caption', 'alt', 'source'];
const ordered = (post) => Object.fromEntries([...KEY_ORDER.filter((k) => k in post), ...Object.keys(post).filter((k) => !KEY_ORDER.includes(k))].map((k) => [k, post[k]]));

// Saves a post (new or existing). `previousSlug` renames an existing post. Throws ValidationError
// when the post has errors; returns { post, warnings } otherwise.
export async function savePost(input, { previousSlug } = {}) {
  const post = normalizePost(input);
  for (const k of ['sceneCopy', 'sceneData']) if (post[k] && !Object.keys(post[k]).length) delete post[k];
  const { errors, warnings } = validatePost(post, await validationContext(post));
  if (errors.length) throw new ValidationError(errors, warnings);
  const old = previousSlug && previousSlug !== post.slug ? previousSlug : post.slug;
  if (old !== post.slug && postExists(post.slug)) throw new ValidationError([`slug: a post named "${post.slug}" already exists`]);
  if (postExists(old)) {
    const before = loadPost(old);
    moveExports(before, post);
    if (old !== post.slug) {
      const a = path.join(assetsDir, old); const b = path.join(assetsDir, post.slug);
      if (fs.existsSync(a) && !fs.existsSync(b)) {
        fs.renameSync(a, b);
        // Image paths inside the post follow the folder.
        const fixed = JSON.parse(JSON.stringify(post).replaceAll(`content/assets/${old}/`, `content/assets/${post.slug}/`));
        Object.assign(post, fixed);
      }
      fs.rmSync(postFile(old));
    }
  }
  writeJson(postFile(post.slug), ordered(post));
  return { post, warnings };
}

export function deletePost(slug) {
  const post = getPost(slug);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const bin = path.join(trashDir, `${slug}-${stamp}`);
  fs.mkdirSync(bin, { recursive: true });
  fs.renameSync(postFile(slug), path.join(bin, `${slug}.json`));
  const dir = path.join(exportsDir, 'posts', postFolder(post));
  if (fs.existsSync(dir)) fs.renameSync(dir, path.join(bin, 'exports'));
  const reels = path.join(exportsDir, 'reels');
  if (fs.existsSync(reels)) {
    for (const f of fs.readdirSync(reels).filter((x) => x.startsWith(`${postFolder(post)}-`))) {
      fs.mkdirSync(path.join(bin, 'reels'), { recursive: true });
      fs.renameSync(path.join(reels, f), path.join(bin, 'reels', f));
    }
  }
  const assets = path.join(assetsDir, slug);
  if (fs.existsSync(assets)) fs.renameSync(assets, path.join(bin, 'assets'));
  return { trashed: path.relative(root, bin) };
}

export async function duplicatePost(slug) {
  const post = getPost(slug);
  const copy = { ...JSON.parse(JSON.stringify(post)), slug: uniqueSlug(`${slug}-copy`), order: nextOrder(), status: 'draft' };
  return savePost(copy);
}

// ---------- Images ----------

const IMAGE_TYPES = { '.png': 'png', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp', '.gif': 'png', '.avif': 'png', '.svg': 'png' };
const MAX_SIDE = 2400;

// Stores an image for a post in content/assets/<slug>/ (re-encoded, at most 2400px on its long
// side) and returns its repo-relative path, ready for an image slide or a scene's screens.
export async function saveAsset(slug, filename, buffer) {
  if (!SLUG_RE.test(slug)) throw new Error(`invalid post slug "${slug}"`);
  const ext = path.extname(filename).toLowerCase();
  const kind = IMAGE_TYPES[ext];
  if (!kind) throw new Error(`unsupported image type ${ext || '(none)'}; use png, jpg, webp, gif, avif or svg`);
  const base = slugify(path.basename(filename, ext)) || 'image';
  const outExt = kind === 'jpeg' ? '.jpg' : `.${kind}`;
  const dir = path.join(assetsDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  let name = `${base}${outExt}`; let n = 2;
  while (fs.existsSync(path.join(dir, name))) name = `${base}-${n++}${outExt}`;
  let img = sharp(buffer, { animated: false, density: ext === '.svg' ? 300 : undefined }).rotate();
  const meta = await img.metadata();
  if (Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_SIDE) img = img.resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside' });
  img = kind === 'jpeg' ? img.jpeg({ quality: 90 }) : kind === 'webp' ? img.webp({ quality: 90 }) : img.png();
  const out = path.join(dir, name);
  await img.toFile(out);
  const { width, height } = await sharp(out).metadata();
  return { path: path.relative(root, out).split(path.sep).join('/'), width, height };
}

export async function importAsset(slug, sourcePath) {
  const file = path.resolve(sourcePath);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`file not found: ${sourcePath}`);
  if (fs.statSync(file).size > 40 * 1024 * 1024) throw new Error('image is larger than 40 MB');
  return saveAsset(slug, path.basename(file), fs.readFileSync(file));
}

export function listAssets(slug) {
  const dir = path.join(assetsDir, slug);
  if (!SLUG_RE.test(slug) || !fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort().map((f) => `content/assets/${slug}/${f}`);
}

// Resolves a repo-relative path for serving, refusing anything outside the allowed folders.
export function safeRepoPath(rel, allowed = ['exports', 'content/assets']) {
  const file = path.resolve(root, decodeURIComponent(rel).replace(/^\/+/, ''));
  if (!allowed.some((dir) => file.startsWith(path.join(root, dir) + path.sep))) return null;
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}
