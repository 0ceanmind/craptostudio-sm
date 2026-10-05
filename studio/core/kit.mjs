// The brand kit Claude reads before making a post: the voice and rules (studio/claude/brand-kit.md)
// plus a live catalog generated from the repo: scenes, slide types, the post schema and the
// existing posts. Served by the MCP tool get_brand_kit.
import fs from 'node:fs';
import path from 'node:path';
import { root } from '../../design/posts.mjs';
import { listScenes } from './scenes.mjs';
import { listPosts, nextOrder } from './store.mjs';
import { SLIDE_TYPES, THEMES } from './schema.mjs';

const json = (v) => JSON.stringify(v, null, 2);

const SLIDE_EXAMPLES = {
  cards: { type: 'cards', title: { en: 'What it does', ar: 'ماذا يقدّم' }, items: [
    { icon: 'list-checks', text: { en: 'Tasks in one tap', ar: 'مهامك بلمسة واحدة' } },
    { icon: 'bell', text: { en: 'Smart reminders', ar: 'تذكيرات ذكية' } },
    { icon: 'users', text: { en: 'Shared family lists', ar: 'قوائم مشتركة للعائلة' } },
    { icon: 'cloud', text: { en: 'Synced everywhere', ar: 'متزامن على كل أجهزتك' } },
  ] },
  steps: { type: 'steps', title: { en: 'How we built it', ar: 'كيف بنيناه' }, items: [
    { title: { en: 'Prototype', ar: 'نموذج أولي' }, text: { en: 'Clickable flow in week one.', ar: 'تجربة قابلة للنقر في الأسبوع الأول.' } },
    { title: { en: 'Build', ar: 'البناء' }, text: { en: 'Flutter app + Firebase backend.', ar: 'تطبيق Flutter مع Firebase.' } },
  ] },
  statement: { type: 'statement', kicker: { en: '// the problem', ar: '// المشكلة' }, text: { en: 'Family chores lived in *five group chats.*', ar: 'كانت مهام العائلة موزّعة على *خمس مجموعات دردشة.*' } },
  services: { type: 'services', title: { en: 'What we do', ar: 'ماذا نقدّم' } },
  image: { type: 'image', src: 'content/assets/tasky-app/home.png', title: { en: 'Today, at a glance', ar: 'يومك في لمحة' }, caption: { en: '', ar: '' }, fit: 'contain' },
  cta: { type: 'cta', headline: { en: 'Want an app like this?\n*Let’s build yours.*', ar: 'تريد تطبيقاً مثله؟\n*لنبنِ تطبيقك.*' } },
};

export async function brandKit() {
  const scenes = await listScenes();
  const posts = listPosts();
  const recent = [...posts].sort((a, b) => b.order - a.order).slice(0, 4);
  const out = [fs.readFileSync(path.join(root, 'studio/claude/brand-kit.md'), 'utf8').trim()];

  out.push(`## Scenes (the animated hero, slide 1)

Pick one with \`scene\`. Override its default text per language with \`sceneCopy: { "en": {…}, "ar": {…} }\` (same keys as its default copy; objects merge, arrays replace) and its settings with \`sceneData: {…}\`. Image fields take repo paths returned by \`add_asset\`.`);
  for (const s of scenes.filter((x) => x.kind !== 'broken').sort((a, b) => (a.kind === 'showcase' ? -1 : 1) - (b.kind === 'showcase' ? -1 : 1))) {
    out.push(`### \`${s.name}\`${s.kind === 'showcase' ? ' (project showcase)' : ' (service demo)'}: ${s.title}

${s.description}${s.bestFor ? ` Best for: ${s.bestFor}.` : ''}
${Object.keys(s.fields?.copy ?? {}).length || Object.keys(s.fields?.data ?? {}).length ? `\nField notes: ${json(s.fields)}\n` : ''}
Default copy (en): ${json(s.copy?.en ?? {})}
${s.kind === 'showcase' ? `Default copy (ar): ${json(s.copy?.ar ?? {})}\n` : ''}Default data: ${json(s.data ?? {})}`);
  }

  out.push(`## Slide types (slides 2…n, all on the dark theme)

${Object.entries(SLIDE_TYPES).map(([k, v]) => `- \`${k}\`: ${v.label}. ${v.hint}\n\n\`\`\`json\n${json(SLIDE_EXAMPLES[k])}\n\`\`\``).join('\n\n')}`);

  out.push(`## Post schema

\`\`\`json
${json({
    slug: 'tasky-app', order: nextOrder(), status: 'draft', theme: 'light', scene: 'showcase-phone', icon: 'list-checks',
    tag: { en: 'Case study · Tasky', ar: 'دراسة حالة · Tasky' },
    headline: { en: 'Family chores, *finally sorted.*', ar: 'مهام العائلة، *مرتّبة أخيراً.*' },
    sub: { en: 'iOS & Android app · Flutter · Firebase', ar: 'تطبيق iOS و Android · Flutter · Firebase' },
    sceneCopy: { en: { name: 'Tasky', tagline: 'Chores for the whole family' }, ar: { name: 'Tasky', tagline: 'مهام البيت للعائلة كلها' } },
    sceneData: { screens: ['content/assets/tasky-app/home.png'], icon: 'list-checks' },
    slides: [SLIDE_EXAMPLES.statement, SLIDE_EXAMPLES.image, SLIDE_EXAMPLES.cards, SLIDE_EXAMPLES.cta],
    caption: { en: 'Hook line…\n\nParagraphs…\n\nDM us "START"…\n\n#craptostudio #appdevelopment #flutter', ar: 'سطر جذّاب…\n\n…\n\nراسلنا بكلمة «ابدأ»…\n\n#تطوير_التطبيقات #برمجة #flutter #craptostudio' },
    alt: { en: 'Light cover: phone showing the Tasky app. "Family chores, finally sorted."', ar: 'غلاف فاتح: هاتف يعرض تطبيق Tasky، وعبارة «مهام العائلة، مرتّبة أخيراً.»' },
    source: { project: 'tasky', path: '/path/to/tasky' },
  })}
\`\`\`

- \`theme\`: ${THEMES.join(' | ')}. \`status\`: draft | ready | published (new posts are drafts).
- \`icon\`: the post's Lucide icon (used in lists), or null.
- \`order\`: posting order; the next free one is **${nextOrder()}**.`);

  out.push(`## Existing posts (newest first)

| order | slug | theme | scene | headline (en) | status |
|---|---|---|---|---|---|
${[...posts].sort((a, b) => b.order - a.order).map((p) => `| ${p.order} | ${p.slug} | ${p.theme} | ${p.scene} | ${String(p.headline?.en ?? '').replace(/\n/g, ' ').replace(/\|/g, '/')} | ${p.status} |`).join('\n')}

Most recent themes: ${recent.map((p) => p.theme).join(', ') || 'none'}. Pick a different one for the next post.`);

  return out.join('\n\n');
}

// Lucide icon search over names and tags.
let tags = null;
export function searchIcons(query, limit = 24) {
  tags ??= JSON.parse(fs.readFileSync(path.join(root, 'node_modules/lucide-static/tags.json'), 'utf8'));
  const words = String(query).toLowerCase().split(/[\s,]+/).filter(Boolean);
  const scored = [];
  for (const [name, t] of Object.entries(tags)) {
    let score = 0;
    for (const w of words) {
      if (name === w) score += 10;
      else if (name.split('-').includes(w)) score += 6;
      else if (name.includes(w)) score += 3;
      if (t.some((x) => x === w)) score += 4;
      else if (t.some((x) => x.includes(w))) score += 1;
    }
    if (score) scored.push([score, name]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].length - b[1].length).slice(0, limit).map(([, n]) => n);
}
