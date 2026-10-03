// Content for every rendered asset. Edit text here and run `npm run render`.
// In headlines, wrap a word or phrase in *asterisks* to give it the accent treatment.
//
// Slide types: list, steps, statement, services, cta, and image for screenshots/photos.
// cta takes an optional headline/body override: { type: 'cta', headline: 'Line one\n*Accent line.*' }
//   { type: 'image', src: 'photos/dashboard.png', title: 'The *after*', caption: 'Load time: 9s → 1.2s', fit: 'contain' }
// `src` is relative to the repo root (png, jpg or webp); fit is 'contain' (default) or 'cover'.
// A post with `slides: []` is a single image: its cover drops the "Swipe →" hint.

export const services = [
  { icon: 'gamepad-2', title: 'Games', sub: 'Unity, 2D & 3D' },
  { icon: 'smartphone', title: 'Apps', sub: 'iOS & Android' },
  { icon: 'code-xml', title: 'Software', sub: 'Web, desktop & tools' },
  { icon: 'sparkles', title: 'Custom AI', sub: 'Chatbots & automation' },
  { icon: 'presentation', title: 'Interactive', sub: 'Presentations & demos' },
  { icon: 'wrench', title: 'Upgrades', sub: 'Fix, speed up, extend' },
  { icon: 'trophy', title: 'Support', sub: 'Project mentoring' },
  { icon: 'puzzle', title: 'Custom', sub: 'Tell us the problem' },
];

// Story highlights, in the order they should appear on the profile (left to right).
export const highlights = [
  { slug: 'start', label: 'Start', icon: 'send' },
  { slug: 'work', label: 'Work', icon: 'layout-grid' },
  { slug: 'games', label: 'Games', icon: 'gamepad-2' },
  { slug: 'apps', label: 'Apps', icon: 'smartphone' },
  { slug: 'ai', label: 'AI', icon: 'sparkles' },
  { slug: 'software', label: 'Software', icon: 'code-xml' },
  { slug: 'interactive', label: 'Interactive', icon: 'presentation' },
  { slug: 'upgrades', label: 'Upgrades', icon: 'wrench' },
  { slug: 'support', label: 'Support', icon: 'trophy' },
  { slug: 'reviews', label: 'Reviews', icon: 'message-square-quote' },
];

const cta = { type: 'cta' };

// Launch grid. `order` is the posting order (1 = post first). Instagram shows the newest
// post top-left, so post 1 lands bottom-right and post 9 lands top-left.
// Theme pattern on the finished grid: blue on the diagonal, light in the corners → an X.
export const posts = [
  {
    order: 1, slug: 'support', theme: 'blue', icon: 'trophy',
    tag: '07 / Support',
    headline: 'Your project. Your win. *Our backup.*',
    sub: 'Mentoring for projects, competitions & hackathons',
    slides: [
      { type: 'list', title: 'How we help', items: [
        'Mentoring for programming projects',
        'Debugging & code review sessions',
        'Prep before competitions & hackathons',
        'Architecture & tech-stack guidance',
        'You do the work. We explain the why.',
      ] },
      { type: 'cta', headline: 'Stuck on a project?\n*Let’s work it out.*' },
    ],
  },
  {
    order: 2, slug: 'interactive', theme: 'dark', icon: 'presentation',
    tag: '06 / Interactive',
    headline: 'Presentations people *remember*.',
    sub: 'Interactive content · Presentations · Demos',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'Interactive presentations & pitch decks',
        'Touchscreen & kiosk apps for events',
        'Interactive lessons, quizzes & training',
        '3D product showcases & demos',
        'Gamified campaigns for brands',
      ] },
      cta,
    ],
  },
  {
    order: 3, slug: 'upgrades', theme: 'light', icon: 'wrench',
    tag: '05 / Upgrades',
    headline: 'Already built? Let’s make it *better*.',
    sub: 'Fix · Optimise · Extend · Modernise',
    slides: [
      { type: 'list', title: 'What we do', items: [
        'Code review & project health check',
        'Bug fixing & performance tuning',
        'New features for your existing app or game',
        'UI/UX refresh without starting over',
        'Updates for new OS, engine & SDK versions',
      ] },
      cta,
    ],
  },
  {
    order: 4, slug: 'software', theme: 'dark', icon: 'code-xml',
    tag: '04 / Software',
    headline: 'Software built around how you *work*.',
    sub: 'Web · Desktop · Dashboards · Custom tools',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'Custom business software & internal tools',
        'Web platforms, portals & dashboards',
        'Spreadsheets & paperwork → real systems',
        'APIs & integrations between your tools',
        'Documented code, handed over to you',
      ] },
      cta,
    ],
  },
  {
    order: 5, slug: 'ai', theme: 'blue', icon: 'sparkles',
    tag: '03 / Custom AI',
    headline: 'AI that fits *your* business.',
    sub: 'Assistants · Automation · Integrations',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'AI assistants that know your business data',
        'Automations for docs, emails & reports',
        'AI features inside your app or website',
        'Image, voice & data-analysis tools',
        'Honest advice, including when you don’t need AI',
      ] },
      cta,
    ],
  },
  {
    order: 6, slug: 'apps', theme: 'dark', icon: 'smartphone',
    tag: '02 / Apps',
    headline: 'Apps that earn a spot on the *home screen*.',
    sub: 'iOS · Android · Cross-platform',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'iOS & Android apps, native or cross-platform',
        'UI/UX design that’s easy from the first tap',
        'Accounts, payments, maps & notifications',
        'Backends, admin panels & APIs',
        'Store submission, updates & maintenance',
      ] },
      cta,
    ],
  },
  {
    order: 7, slug: 'start', theme: 'light', icon: 'send',
    tag: 'Start here',
    headline: 'New project? Here’s how we *build it*.',
    sub: '4 steps · No jargon · No surprises',
    slides: [
      { type: 'steps', title: 'How we work', items: [
        ['Talk', 'Tell us your idea, goal and deadline. DM “START” or tap the link in bio.'],
        ['Plan', 'We scope it, pick the right tech, then send a clear quote and timeline.'],
        ['Build', 'You see real progress every week, not just slides.'],
        ['Launch & support', 'We ship it, hand it over and offer support for updates.'],
      ] },
      { type: 'list', title: 'Send us this first', items: [
        'What you want to build (one sentence is fine)',
        'Who it’s for',
        'Your deadline',
        'Your budget range',
        'Links or apps you like',
      ] },
      cta,
    ],
  },
  {
    order: 8, slug: 'games', theme: 'dark', icon: 'gamepad-2',
    tag: '01 / Games',
    headline: 'Games people want to *replay*.',
    sub: 'Unity · 2D & 3D · Mobile, PC & web',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'Full Unity games, from concept to launch',
        'Playable prototypes & vertical slices',
        'Advergames & gamified experiences for brands',
        'Gameplay systems, UI & game feel',
        'Builds for mobile, PC & WebGL',
      ] },
      cta,
    ],
  },
  {
    order: 9, slug: 'intro', theme: 'blue', icon: null,
    tag: 'Hello, world',
    headline: 'Ideas, *compiled.*',
    sub: 'Games · Apps · Software · AI',
    slides: [
      { type: 'statement', kicker: '// who we are',
        text: 'Crapto Studio is a tech studio. We *design and build* games, apps, software and custom AI, and we level up projects that already exist.' },
      { type: 'services', title: 'What we do' },
      { type: 'steps', title: 'Why work with us', items: [
        ['Honest scoping', 'Clear quote, clear timeline. If you don’t need something, we’ll say so.'],
        ['Weekly progress', 'Working builds you can try, not just status reports.'],
        ['Clean handover', 'Clean, documented code and your project files, handed over.'],
        ['We stick around', 'Ongoing support for updates, fixes & new features.'],
      ] },
      cta,
    ],
  },
];
