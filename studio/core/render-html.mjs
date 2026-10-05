// HTML for previews: the animated hero (stage + scene) and the static slides, built from a post
// object that may not be saved yet (the workspace previews edits live).
import { stage } from '../../design/motion/stage.mjs';
import { slideHtml } from '../../design/templates.mjs';
import { getScene } from './scenes.mjs';
import { normalizePost } from './schema.mjs';

// Missing text would crash the templates mid-edit; show a visible placeholder instead.
const fill = (v, fallback = '…') => ({ en: v?.en || fallback, ar: v?.ar || fallback });

export async function heroHtml(input, { lang = 'en', format = 'feed' } = {}) {
  const post = normalizePost(input);
  const scene = await getScene(post.scene);
  const safe = { ...post, tag: fill(post.tag), headline: fill(post.headline), sub: fill(post.sub, ' ') };
  return stage({ scene, post: safe, lang, format, swipe: (post.slides ?? []).length > 0 });
}

export function slidePreviewHtml(input, index, { lang = 'en' } = {}) {
  const post = normalizePost(input);
  const slides = post.slides ?? [];
  const slide = slides[index];
  if (!slide) throw new Error(`no slide ${index + 2}`);
  return slideHtml(slide, index + 2, slides.length + 1, lang);
}

// A page shown in place of a preview that failed to build (e.g. a typo in a scene).
export const errorHtml = (message, { width = 1080, height = 1350 } = {}) => `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${width}px;height:${height}px;background:#0B1628;color:#F4B310;font:500 34px/1.5 ui-monospace,monospace}
div{padding:96px}b{display:block;color:#fff;font:800 56px/1.2 system-ui,sans-serif;margin-bottom:32px}</style></head>
<body><div><b>Preview failed</b>${String(message).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div></body></html>`;
