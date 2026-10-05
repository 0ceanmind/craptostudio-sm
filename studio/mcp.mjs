#!/usr/bin/env node
// Crapto Studio MCP server: lets Claude Code (in any project) make and edit posts in this studio.
// Claude reads the brand kit, saves bilingual posts, adds screenshots from the project, looks at
// previews, checks contrast and renders. Everything lands in content/posts/ and exports/, and
// shows up live in the workspace (npm run studio).
//
// Register it once with `npm run connect` (or: claude mcp add --scope user crapto-studio -- node <this file>).
import fs from 'node:fs';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { root, getPost, listPosts, savePost, importAsset, listAssets, exportsOf, postExists, ValidationError, uniqueSlug, nextOrder } from './core/store.mjs';
import { brandKit, searchIcons } from './core/kit.mjs';
import { listScenes } from './core/scenes.mjs';
import { contactSheet } from './core/snapshot.mjs';
import { startJob, waitForJob, getJob } from './core/jobs.mjs';

const PORT = Number(process.env.STUDIO_PORT || 4600);
const workspaceUrl = (slug) => `http://localhost:${PORT}/#/post/${slug}`;
const source = process.env.CRAPTO_STUDIO_SOURCE === 'workspace' ? 'workspace' : 'claude';

const text = (s) => ({ content: [{ type: 'text', text: typeof s === 'string' ? s : JSON.stringify(s, null, 2) }] });
const fail = (s) => ({ content: [{ type: 'text', text: s }], isError: true });
const guard = (fn) => async (args) => {
  try { return await fn(args); } catch (e) {
    if (e instanceof ValidationError) return fail(`${e.message}${e.warnings.length ? `\n\nWarnings:\n- ${e.warnings.join('\n- ')}` : ''}`);
    return fail(`Error: ${e.message}`);
  }
};

const server = new McpServer({ name: 'crapto-studio', version: '1.0.0' }, {
  instructions: 'Crapto Studio\'s Instagram workspace. To make a carousel post about a project: call get_brand_kit first, then follow its rules. '
    + 'Posts are bilingual (English + Modern Standard Arabic). Save with save_post, look at the result with preview_post, fix, check_post, then render_post.',
});

server.registerTool('get_brand_kit', {
  title: 'Get the Crapto Studio brand kit',
  description: 'Read this before making or editing a post. Brand voice in English and Arabic, rules, the animated hero scenes (with their editable text and data fields), slide types, the full post JSON schema with an example, existing posts and the next free posting order.',
  annotations: { readOnlyHint: true },
}, guard(async () => text(await brandKit())));

server.registerTool('get_playbook', {
  title: 'Get the project-to-carousel playbook',
  description: 'Step-by-step instructions for turning a project into a finished carousel post (what to read in the project, how to pick a scene, what slides to write, how to review).',
  annotations: { readOnlyHint: true },
}, guard(async () => text(fs.readFileSync(path.join(root, 'studio/claude/playbook.md'), 'utf8'))));

server.registerTool('list_posts', {
  title: 'List posts',
  description: 'All posts in posting order with slug, order, status, theme, scene, English headline and number of slides.',
  annotations: { readOnlyHint: true },
}, guard(async () => text(listPosts().map((p) => ({ slug: p.slug, order: p.order, status: p.status, theme: p.theme, scene: p.scene, headline: p.headline?.en, slides: p.slides.length + 1, source: p.source?.project })))));

server.registerTool('get_post', {
  title: 'Get a post',
  description: 'The full JSON of one post, its uploaded images and its rendered files.',
  inputSchema: { slug: z.string().describe('Post slug, e.g. "tasky-app"') },
  annotations: { readOnlyHint: true },
}, guard(async ({ slug }) => text({ post: getPost(slug), assets: listAssets(slug), exports: exportsOf(getPost(slug)).map((f) => f.path), workspace: workspaceUrl(slug) })));

server.registerTool('list_scenes', {
  title: 'List hero scenes',
  description: 'The animated hero scenes with their descriptions, field notes, default copy and default data.',
  annotations: { readOnlyHint: true },
}, guard(async () => text((await listScenes()).map(({ name, kind, title, description, bestFor, fields, copy, data }) => ({ name, kind, title, description, bestFor, fields, copy, data })))));

server.registerTool('search_icons', {
  title: 'Search Lucide icons',
  description: 'Find Lucide icon names for cards, steps and scenes, e.g. "calendar booking" or "game controller".',
  inputSchema: { query: z.string() },
  annotations: { readOnlyHint: true },
}, guard(async ({ query }) => text(searchIcons(query))));

server.registerTool('suggest_slug', {
  title: 'Suggest a free slug',
  description: 'Turns a project name into a free post slug and gives the next free posting order.',
  inputSchema: { name: z.string() },
  annotations: { readOnlyHint: true },
}, guard(async ({ name }) => text({ slug: uniqueSlug(name), order: nextOrder() })));

server.registerTool('add_asset', {
  title: 'Add an image from the project',
  description: 'Copies an image (screenshot, logo, photo: png, jpg, webp, gif, avif or svg) from the user\'s project into the studio for a post. Returns the repo path to use in an image slide ("src") or in sceneData (e.g. "screens", "logo"). Large images are resized to 2400px.',
  inputSchema: {
    slug: z.string().describe('The post slug the image belongs to (the post does not need to exist yet)'),
    source_path: z.string().describe('Absolute path of the image file in the project'),
  },
}, guard(async ({ slug, source_path }) => text(await importAsset(slug, source_path))));

server.registerTool('save_post', {
  title: 'Save a post',
  description: 'Creates or replaces a post (the whole post JSON, see get_brand_kit for the schema). Validates it first and returns errors to fix, or the saved post with warnings. To rename a post, pass its old slug as previous_slug.',
  inputSchema: {
    post: z.record(z.string(), z.any()).describe('The full post object'),
    previous_slug: z.string().optional(),
  },
}, guard(async ({ post, previous_slug }) => {
  const isNew = !postExists(previous_slug ?? post.slug);
  if (isNew && !post.source && source === 'claude') post.source = { project: path.basename(process.cwd()), path: process.cwd() };
  const { post: saved, warnings } = await savePost(post, { previousSlug: previous_slug });
  return text({ saved: true, slug: saved.slug, created: isNew, warnings, next: 'Call preview_post to look at it.', workspace: workspaceUrl(saved.slug) });
}));

server.registerTool('preview_post', {
  title: 'Preview a post',
  description: 'Renders a contact sheet of the post so you can see it: per language, the hero at frame 0 (the cover), the hero mid-animation, then every slide. Also returns layout warnings. Use it after every save and fix what looks wrong.',
  inputSchema: {
    slug: z.string(),
    lang: z.enum(['en', 'ar', 'both']).optional().describe('Default: both'),
    format: z.enum(['feed', 'reel']).optional().describe('Default: feed (4:5 carousel). "reel" shows the 9:16 hero only.'),
  },
  annotations: { readOnlyHint: true },
}, guard(async ({ slug, lang = 'both', format = 'feed' }) => {
  const post = getPost(slug);
  const langs = lang === 'both' ? ['en', 'ar'] : [lang];
  const { image, warnings } = await contactSheet(post, { langs, format, tile: langs.length === 2 && post.slides.length > 4 ? 240 : 300 });
  return { content: [
    { type: 'image', data: image.toString('base64'), mimeType: 'image/png' },
    { type: 'text', text: `Rows: ${langs.join(', ')}. Tiles: cover (frame 0), mid-animation${format === 'feed' ? ', then slides 2…' : ''}.\n${warnings.length ? `Layout warnings:\n- ${warnings.join('\n- ')}` : 'No layout warnings.'}` },
  ] };
}));

server.registerTool('check_post', {
  title: 'Check text contrast',
  description: 'Measures the contrast of every piece of text on the post\'s covers (feed and Reel) and slides against the real rendered background. Returns failures to fix.',
  inputSchema: { slug: z.string() },
  annotations: { readOnlyHint: true },
}, guard(async ({ slug }) => {
  getPost(slug);
  const job = await waitForJob(startJob({ kind: 'check', slug, source }).id, { timeoutMs: 5 * 60_000 });
  return text({ ok: job.ok, message: job.message, failures: job.issues ?? [] });
}));

server.registerTool('render_post', {
  title: 'Render a post',
  description: 'Renders the post into exports/: the cover and slide PNGs for both languages (about 10 s). With video: true it also queues the 8-second hero videos and Reels (several minutes; runs in the background, check with get_render_status).',
  inputSchema: {
    slug: z.string(),
    video: z.boolean().optional().describe('Also render the videos (slow). Default false.'),
  },
}, guard(async ({ slug, video = false }) => {
  getPost(slug);
  const stills = await waitForJob(startJob({ kind: 'stills', slug, source }).id, { timeoutMs: 5 * 60_000 });
  if (stills.status !== 'done') return fail(`Rendering failed: ${stills.error ?? stills.message}`);
  const out = { stills: stills.outputs.filter((f) => f.endsWith('.png')), warnings: stills.issues ?? [], workspace: workspaceUrl(slug) };
  if (video) out.videoJob = startJob({ kind: 'video', slug, source }).id;
  return text(out);
}));

server.registerTool('get_render_status', {
  title: 'Get render status',
  description: 'Progress of a render job started by render_post (videos).',
  inputSchema: { job_id: z.string() },
  annotations: { readOnlyHint: true },
}, guard(async ({ job_id }) => {
  const job = getJob(job_id);
  if (!job) return fail(`No job ${job_id}`);
  return text({ status: job.status, progress: Math.round(job.progress * 100) + '%', message: job.message, outputs: job.outputs, error: job.error });
}));

server.registerPrompt('carousel', {
  title: 'Make a carousel for this project',
  description: 'Turn the current project into a Crapto Studio carousel post (English + Arabic).',
  argsSchema: { brief: z.string().optional().describe('Anything to focus on, e.g. "the offline mode" or "for parents"') },
}, ({ brief }) => ({
  messages: [{ role: 'user', content: { type: 'text', text: `${fs.readFileSync(path.join(root, 'studio/claude/playbook.md'), 'utf8')}\n\n---\n\nMake a carousel post about the project in the current folder (${process.cwd()}).${brief ? ` Brief: ${brief}` : ''}` } }],
}));

await server.connect(new StdioServerTransport());
