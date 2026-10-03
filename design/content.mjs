// Content for every rendered asset. Edit text here and run `npm run render`.
// In headlines, wrap a word in *asterisks* to give it the accent treatment.

export const services = [
  { icon: 'gamepad-2', title: 'Games', sub: 'Unity · 2D & 3D' },
  { icon: 'smartphone', title: 'Apps', sub: 'iOS & Android' },
  { icon: 'code-xml', title: 'Software', sub: 'Web, desktop, tools' },
  { icon: 'sparkles', title: 'Custom AI', sub: 'Assistants & automation' },
  { icon: 'presentation', title: 'Interactive', sub: 'Content & presentations' },
  { icon: 'trending-up', title: 'Upgrades', sub: 'Fix, optimize, extend' },
  { icon: 'trophy', title: 'Support', sub: 'Projects & competitions' },
  { icon: 'puzzle', title: 'Custom', sub: 'Whatever you need built' },
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
  { slug: 'upgrades', label: 'Upgrades', icon: 'trending-up' },
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
    sub: 'Programming projects · Competitions · Hackathons',
    slides: [
      { type: 'list', title: 'How we help', items: [
        'Mentoring for programming projects',
        'Debugging & code review sessions',
        'Competition & hackathon preparation',
        'Architecture & tech-stack guidance',
        'We explain the why, so you can present it with confidence',
      ] },
      cta,
    ],
  },
  {
    order: 2, slug: 'interactive', theme: 'dark', icon: 'presentation',
    tag: '06 / Interactive',
    headline: 'Presentations people *remember*.',
    sub: 'Interactive content · Presentations · Experiences',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'Interactive presentations & pitch decks',
        'Touchscreen & kiosk experiences for events',
        'Interactive lessons, quizzes & training',
        '3D product showcases & demos',
        'Gamified campaigns for brands',
      ] },
      cta,
    ],
  },
  {
    order: 3, slug: 'upgrades', theme: 'light', icon: 'trending-up',
    tag: '05 / Upgrades',
    headline: 'Already built? Let’s make it *better*.',
    sub: 'Fix · Optimize · Extend · Modernize',
    slides: [
      { type: 'list', title: 'What we do', items: [
        'Code review & project health check',
        'Bug fixing and performance tuning',
        'New features on your existing codebase',
        'UI/UX refresh without starting over',
        'Updates to new versions, SDKs & platforms',
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
        'APIs and integrations between your tools',
        'Documented code that you fully own',
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
        'Vision, voice & data-analysis tools',
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
        'UI/UX design that feels obvious to use',
        'Accounts, payments, maps & notifications',
        'Backends, admin panels & APIs',
        'Store publishing, updates & maintenance',
      ] },
      cta,
    ],
  },
  {
    order: 7, slug: 'start', theme: 'light', icon: 'send',
    tag: 'Start here',
    headline: 'Got an idea? Here’s how we *build it*.',
    sub: '4 steps · no jargon · no surprises',
    slides: [
      { type: 'steps', title: 'How we work', items: [
        ['Talk', 'Tell us the idea, the goal and your timeline. DM “START” or use the link in bio.'],
        ['Plan', 'We scope it, pick the right tech and send a clear quote and timeline.'],
        ['Build', 'You see real progress every week, not just slides.'],
        ['Launch & support', 'We ship it, hand it over, and stay around for updates.'],
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
    sub: 'Unity · 2D & 3D · Mobile, PC & Web',
    slides: [
      { type: 'list', title: 'What we build', items: [
        'Full games in Unity, from concept to release',
        'Playable prototypes & vertical slices',
        'Advergames & gamified experiences for brands',
        'Gameplay systems, UI and game feel',
        'Builds for mobile, PC and WebGL',
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
      { type: 'services', title: 'What we build' },
      { type: 'steps', title: 'Why work with us', items: [
        ['Honest scoping', 'Clear quote, clear timeline. If you don’t need it, we’ll say so.'],
        ['Weekly progress', 'Working builds you can try, not status reports.'],
        ['You own it', 'Clean, documented code and every asset, handed over.'],
        ['We stick around', 'Updates, fixes and new features after launch.'],
      ] },
      cta,
    ],
  },
];
