// The post schema: what a post JSON file (content/posts/<slug>.json) may contain, with the
// checks the workspace and Claude Code run before saving. Errors block a save; warnings don't.
import fs from 'node:fs';
import path from 'node:path';
import { root } from '../../design/posts.mjs';

export const LANGS = ['en', 'ar'];
export const THEMES = ['dark', 'blue', 'light'];
export const STATUSES = ['draft', 'ready', 'published'];
export const SLIDE_TYPES = {
  cards: { label: 'Icon cards', hint: 'Up to 4 short items with icons, in a 2 × 2 grid.' },
  steps: { label: 'Numbered steps', hint: 'Up to 4 steps, each a short title and one line.' },
  statement: { label: 'Statement', hint: 'One big sentence with a small kicker above it.' },
  services: { label: 'Our services', hint: 'The 8 Crapto Studio services grid. Only a title.' },
  image: { label: 'Screenshot / image', hint: 'A screenshot or photo with an optional title and caption.' },
  cta: { label: 'Call to action', hint: 'The last slide. Headline and body are optional (defaults: “Got an idea? Let’s compile it.”).' },
};
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp'];

const iconDir = path.join(root, 'node_modules/lucide-static/icons');
// Icons that read as crypto or hype, which the brand avoids.
export const AVOID_ICONS = ['rocket', 'zap', 'bitcoin', 'coins', 'trending-up', 'chart-candlestick', 'candlestick-chart', 'circle-dollar-sign', 'badge-dollar-sign', 'gem', 'flame'];
export const iconExists = (name) => typeof name === 'string' && /^[a-z0-9-]+$/.test(name) && fs.existsSync(path.join(iconDir, `${name}.svg`));

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '') || 'post';

const bi = (en = '', ar = '') => ({ en, ar });
export const emptySlide = (type) => ({
  cards: { type, title: bi('What we built', 'ماذا بنينا'), items: [
    { icon: 'sparkles', text: bi('First feature', 'الميزة الأولى') },
    { icon: 'layers', text: bi('Second feature', 'الميزة الثانية') },
  ] },
  steps: { type, title: bi('How it works', 'كيف يعمل'), items: [
    { title: bi('Step one', 'الخطوة الأولى'), text: bi('One short line.', 'سطر واحد قصير.') },
    { title: bi('Step two', 'الخطوة الثانية'), text: bi('One short line.', 'سطر واحد قصير.') },
  ] },
  statement: { type, kicker: bi('// the idea', '// الفكرة'), text: bi('One *big* sentence.', 'جملة *واحدة* كبيرة.') },
  services: { type, title: bi('What we do', 'ماذا نقدّم') },
  image: { type, src: '', title: bi('', ''), caption: bi('', ''), fit: 'contain' },
  cta: { type },
}[type]);

export function newPost({ slug, order, theme = 'dark', scene = 'showcase-stack', icon = 'sparkles' }) {
  return {
    slug, order, status: 'draft', theme, scene, icon,
    tag: bi('New project', 'مشروع جديد'),
    headline: bi('Your idea, *shipped.*', 'فكرتك، *أصبحت واقعاً.*'),
    sub: bi('What it is · Who it’s for', 'ما هو · ولمن'),
    sceneCopy: {}, sceneData: {},
    slides: [emptySlide('cards'), { type: 'cta' }],
    caption: bi('', ''), alt: bi('', ''),
  };
}

// Text length guides (characters, without * markers). Beyond them text still renders, but gets
// small or wraps awkwardly, so they are warnings.
const LIMITS = { tag: 24, headline: 44, sub: 64, title: 28, cardText: 34, stepTitle: 22, stepText: 46, statement: 90, kicker: 24, alt: 100, caption: 2200 };
const plain = (s) => String(s ?? '').replace(/\*/g, '');

// `sceneCopy`: the default copy of the post's scene ({ en, ar }), to flag demo text left in a
// project showcase (its defaults are an example project, with example numbers).
export function validatePost(post, { scenes = [], sceneCopy = null } = {}) {
  const errors = []; const warnings = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
  const text = (v, where, { required = true, max } = {}) => {
    if (v === undefined || v === null) { if (required) err(where, 'missing (needs { "en": "...", "ar": "..." })'); return; }
    if (typeof v !== 'object' || Array.isArray(v)) { err(where, 'must be { "en": "...", "ar": "..." }'); return; }
    for (const lang of LANGS) {
      const s = v[lang];
      if (typeof s !== 'string') { err(`${where}.${lang}`, 'must be a string'); continue; }
      if (required && !s.trim()) err(`${where}.${lang}`, 'is empty');
      if ((s.match(/\*/g) || []).length % 2) err(`${where}.${lang}`, 'has an unmatched * (wrap accents as *word*)');
      if (max && plain(s).length > max) warn(`${where}.${lang}`, `${plain(s).length} characters; keep it under ${max} so it stays big and readable`);
    }
    if (typeof v.ar === 'string' && /[0-9]/.test(v.en ?? '') && /[٠-٩]/.test(v.ar)) warn(`${where}.ar`, 'uses Arabic-Indic digits; the brand uses Western digits (0–9) in both languages');
  };
  const icon = (v, where) => {
    if (!iconExists(v)) err(where, `"${v}" is not a Lucide icon name (see https://lucide.dev/icons or the search_icons tool)`);
    else if (AVOID_ICONS.includes(v)) warn(where, `"${v}" reads as crypto/hype; the brand avoids it`);
  };
  const image = (v, where) => {
    if (typeof v !== 'string' || !v) { err(where, 'needs an image path (e.g. content/assets/<slug>/shot.png)'); return; }
    const file = path.resolve(root, v);
    if (!file.startsWith(root + path.sep)) { err(where, 'must be a path inside the studio repo'); return; }
    if (!IMAGE_EXT.includes(path.extname(v).slice(1).toLowerCase())) err(where, `use ${IMAGE_EXT.join('/')}`);
    else if (!fs.existsSync(file)) err(where, `file not found: ${v}`);
  };

  if (!post || typeof post !== 'object') return { errors: ['post: must be an object'], warnings };
  if (!SLUG_RE.test(post.slug ?? '') || post.slug.length > 40) err('slug', 'lowercase letters, digits and dashes only (max 40), e.g. "tasky-app"');
  if (!Number.isInteger(post.order) || post.order < 1 || post.order > 99) err('order', 'a whole number from 1 to 99 (posting order; decides the NN- export folder)');
  if (!STATUSES.includes(post.status)) err('status', `one of ${STATUSES.join(', ')}`);
  if (!THEMES.includes(post.theme)) err('theme', `one of ${THEMES.join(', ')}`);
  if (scenes.length && !scenes.includes(post.scene)) err('scene', `unknown scene "${post.scene}"; available: ${scenes.join(', ')}`);
  if (post.icon !== null && post.icon !== undefined) icon(post.icon, 'icon');
  text(post.tag, 'tag', { max: LIMITS.tag });
  text(post.headline, 'headline', { max: LIMITS.headline });
  text(post.sub, 'sub', { max: LIMITS.sub });

  if (post.sceneCopy !== undefined && (typeof post.sceneCopy !== 'object' || Array.isArray(post.sceneCopy))) err('sceneCopy', 'must be { "en": {...}, "ar": {...} }');
  else if (post.sceneCopy && Object.keys(post.sceneCopy).some((k) => !LANGS.includes(k))) err('sceneCopy', 'only "en" and "ar" keys (each mirrors the scene’s copy fields)');
  if (post.sceneData !== undefined && (typeof post.sceneData !== 'object' || Array.isArray(post.sceneData))) err('sceneData', 'must be an object');
  if (sceneCopy && String(post.scene).startsWith('showcase-')) {
    for (const lang of LANGS) {
      for (const key of Object.keys(sceneCopy[lang] ?? {})) {
        if (!(key in (post.sceneCopy?.[lang] ?? {}))) warn(`sceneCopy.${lang}.${key}`, `not set, so the animation shows the scene's demo text (${JSON.stringify(sceneCopy[lang][key]).slice(0, 60)}). Write this project's own${key === 'stats' ? ' (or [] when there are no real numbers)' : ''}`);
      }
    }
  }
  for (const [k, v] of Object.entries(post.sceneData ?? {})) {
    if (/^(screens|images|logo|image|screenshot)s?$/.test(k)) for (const [i, p] of [].concat(v).entries()) if (p) image(p, `sceneData.${k}${Array.isArray(v) ? `[${i}]` : ''}`);
    if (k === 'icon' && v) icon(v, 'sceneData.icon');
  }

  if (!Array.isArray(post.slides)) err('slides', 'must be an array (use [] for a single video/image post)');
  else {
    if (post.slides.length > 9) warn('slides', `${post.slides.length + 1} slides in total; 4–6 is the sweet spot`);
    post.slides.forEach((s, i) => {
      const w = `slides[${i}] (${s?.type ?? '?'})`;
      if (!s || !SLIDE_TYPES[s.type]) { err(`slides[${i}]`, `type must be one of ${Object.keys(SLIDE_TYPES).join(', ')}`); return; }
      if (s.type === 'cards') {
        text(s.title, `${w}.title`, { max: LIMITS.title });
        if (!Array.isArray(s.items) || !s.items.length || s.items.length > 4) err(`${w}.items`, '1 to 4 items');
        else s.items.forEach((it, j) => { icon(it.icon, `${w}.items[${j}].icon`); text(it.text, `${w}.items[${j}].text`, { max: LIMITS.cardText }); });
      } else if (s.type === 'steps') {
        text(s.title, `${w}.title`, { max: LIMITS.title });
        if (!Array.isArray(s.items) || !s.items.length || s.items.length > 4) err(`${w}.items`, '1 to 4 steps');
        else s.items.forEach((it, j) => { text(it.title, `${w}.items[${j}].title`, { max: LIMITS.stepTitle }); text(it.text, `${w}.items[${j}].text`, { max: LIMITS.stepText }); });
      } else if (s.type === 'statement') {
        text(s.kicker, `${w}.kicker`, { max: LIMITS.kicker }); text(s.text, `${w}.text`, { max: LIMITS.statement });
      } else if (s.type === 'services') {
        text(s.title, `${w}.title`, { max: LIMITS.title });
      } else if (s.type === 'image') {
        image(s.src, `${w}.src`);
        text(s.title, `${w}.title`, { required: false, max: LIMITS.title });
        text(s.caption, `${w}.caption`, { required: false, max: 90 });
        if (s.fit && !['contain', 'cover'].includes(s.fit)) err(`${w}.fit`, '"contain" or "cover"');
      } else if (s.type === 'cta') {
        text(s.headline, `${w}.headline`, { required: false, max: 40 });
        text(s.body, `${w}.body`, { required: false, max: 90 });
      }
    });
    if (post.slides.length && post.slides.at(-1)?.type !== 'cta') warn('slides', 'the last slide is usually a "cta" slide');
  }

  text(post.caption, 'caption', { required: post.status !== 'draft', max: LIMITS.caption });
  text(post.alt, 'alt', { required: post.status !== 'draft', max: LIMITS.alt });
  for (const lang of LANGS) {
    const tags = (post.caption?.[lang] ?? '').match(/#[\p{L}\p{N}_]+/gu) ?? [];
    if (tags.length > 5) warn(`caption.${lang}`, `${tags.length} hashtags; the brand uses at most 5`);
  }
  return { errors, warnings };
}

// Fills in fields an older or hand-written post may lack, so the editor and renderers can rely on them.
export function normalizePost(post) {
  return {
    status: 'draft', icon: null, sceneCopy: {}, sceneData: {}, slides: [],
    caption: bi(), alt: bi(),
    ...post,
  };
}
