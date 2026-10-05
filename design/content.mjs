// Shared content in English and Arabic (Modern Standard Arabic): services, profile, highlights
// and the default call to action. Any text field is { en, ar }. The posts themselves are JSON
// files in content/posts/ (see the end of this file). After editing, run `npm run render`
// (images) and `npm run motion` (videos), or use the workspace (`npm run studio`).
//
// Headlines: wrap a word or phrase in *asterisks* for the accent treatment; \n forces a line break.
// The company name always stays in Latin letters: Crapto Studio.
//
// Slide types (static carousel slides after the animated hero):
//   cards     { title, items: [{ icon, text }] }  – up to 4 short items with icons
//   steps     { title, items: [{ title, text }] } – numbered steps
//   statement { kicker, text }
//   services  { title }                           – the 8 services grid
//   image     { src, title?, caption?, fit }      – screenshot/photo, src relative to repo root
//   cta       { headline?, body? }                – last slide; both optional
// A post with `slides: []` is a single image/video, and drops the "Swipe" hint.

import { loadPosts } from './posts.mjs';

const t = (en, ar) => ({ en, ar });

export const services = [
  { icon: 'gamepad-2', title: t('Games', 'ألعاب'), sub: t('Unity, 2D & 3D', 'Unity، ثنائية وثلاثية الأبعاد') },
  { icon: 'smartphone', title: t('Apps', 'تطبيقات'), sub: t('iOS & Android', 'iOS و Android') },
  { icon: 'code-xml', title: t('Software', 'برمجيات'), sub: t('Web, desktop & tools', 'ويب وسطح المكتب وأدوات') },
  { icon: 'sparkles', title: t('Custom AI', 'ذكاء اصطناعي'), sub: t('Chatbots & automation', 'مساعدات ذكية وأتمتة') },
  { icon: 'presentation', title: t('Interactive', 'محتوى تفاعلي'), sub: t('Presentations & demos', 'عروض تقديمية وتوضيحية') },
  { icon: 'wrench', title: t('Upgrades', 'ترقية'), sub: t('Fix, speed up, extend', 'إصلاح وتسريع وتوسيع') },
  { icon: 'trophy', title: t('Support', 'إرشاد'), sub: t('Project mentoring', 'للمشاريع والمسابقات') },
  { icon: 'puzzle', title: t('Custom', 'حلول مخصّصة'), sub: t('Tell us the problem', 'أخبرنا بمشكلتك') },
];

// Profile header. The bio holds both languages and must stay ≤150 characters (this one is 140
// code points); 01-profile-setup.md quotes it, and the profile mockup shows it.
// The invisible ‏ (right-to-left mark) after «ابدأ» keeps the closing » next to the word:
// that line starts in English, so without it the » jumps to the far end of the line.
export const profile = {
  name: 'Crapto Studio | Games·Apps·AI',
  category: 'Software Company',
  bio: [
    'Ideas, compiled. 💻 أفكارك، جاهزة للتشغيل',
    'Games · Apps · Software · AI',
    'ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي',
    '👇 DM "START" · راسلنا «ابدأ»‏',
  ],
};

// Story highlights, in the order they should appear on the profile (left to right).
export const highlights = [
  { slug: 'start', icon: 'send', label: t('Start', 'ابدأ') },
  { slug: 'work', icon: 'layout-grid', label: t('Work', 'أعمالنا') },
  { slug: 'games', icon: 'gamepad-2', label: t('Games', 'ألعاب') },
  { slug: 'apps', icon: 'smartphone', label: t('Apps', 'تطبيقات') },
  { slug: 'ai', icon: 'sparkles', label: t('AI', 'ذكاء اصطناعي') },
  { slug: 'software', icon: 'code-xml', label: t('Software', 'برمجيات') },
  { slug: 'interactive', icon: 'presentation', label: t('Interactive', 'تفاعلي') },
  { slug: 'upgrades', icon: 'wrench', label: t('Upgrades', 'ترقية') },
  { slug: 'support', icon: 'trophy', label: t('Support', 'إرشاد') },
  { slug: 'reviews', icon: 'message-square-quote', label: t('Reviews', 'آراء العملاء') },
];

// The default last slide. The DM keyword is START in English and «ابدأ» in Arabic.
export const ctaDefault = {
  headline: t('Got an idea?\n*Let’s compile it.*', 'لديك فكرة؟\n*لنبنِها معاً.*'),
  body: t('DM us **“START”** or tap the link in bio.', 'راسلنا بكلمة **«ابدأ»**\nأو اضغط على الرابط في الملف الشخصي.'),
};

// Posts (the launch posts and every post made since) live in content/posts/<slug>.json.
// Edit them in the workspace (`npm run studio`) or ask Claude Code (`/crapto-post`).
// `order` is the posting order of the pair (1 = first); within a pair the English post goes
// up first, then the Arabic one. Instagram shows the newest post top-left.
// `scene` is the animated hero in design/scenes/<scene>.mjs.
export const posts = loadPosts();
