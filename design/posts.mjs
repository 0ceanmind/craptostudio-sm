// Posts live as one JSON file each in content/posts/<slug>.json, so the workspace (npm run studio)
// and Claude Code (through the studio's MCP server) can edit them safely. Every text field is
// { en, ar }. The schema is described in studio/core/schema.mjs and in the brand kit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const postsDir = path.join(root, 'content/posts');

export function loadPost(slug) {
  return JSON.parse(fs.readFileSync(path.join(postsDir, `${slug}.json`), 'utf8'));
}

// All posts in posting order. `order` decides the export folder name (NN-slug) and the grid.
export function loadPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => loadPost(f.slice(0, -5)))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export const pad = (n) => String(n).padStart(2, '0');
export const postFolder = (post) => `${pad(post.order)}-${post.slug}`;
