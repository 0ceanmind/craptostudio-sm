// Content for every rendered asset, in English and Arabic (Modern Standard Arabic).
// Any text field is { en, ar }. Edit text here, then run `npm run render` (images) and
// `npm run motion` (videos).
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

const t = (en, ar) => ({ en, ar });

export const services = [
  { icon: 'gamepad-2', title: t('Games', 'الألعاب'), sub: t('Unity, 2D & 3D', 'Unity، ثنائية وثلاثية الأبعاد') },
  { icon: 'smartphone', title: t('Apps', 'التطبيقات'), sub: t('iOS & Android', 'iOS و Android') },
  { icon: 'code-xml', title: t('Software', 'البرمجيات'), sub: t('Web, desktop & tools', 'ويب وسطح مكتب وأدوات') },
  { icon: 'sparkles', title: t('Custom AI', 'الذكاء الاصطناعي'), sub: t('Chatbots & automation', 'مساعدات ذكية وأتمتة') },
  { icon: 'presentation', title: t('Interactive', 'المحتوى التفاعلي'), sub: t('Presentations & demos', 'عروض تقديمية وتوضيحية') },
  { icon: 'wrench', title: t('Upgrades', 'التطوير'), sub: t('Fix, speed up, extend', 'إصلاح وتسريع وتوسيع') },
  { icon: 'trophy', title: t('Support', 'الإرشاد'), sub: t('Project mentoring', 'إرشاد في المشاريع') },
  { icon: 'puzzle', title: t('Custom', 'حلول مخصّصة'), sub: t('Tell us the problem', 'أخبرنا بالمشكلة') },
];

// Profile header. The bio holds both languages and must stay ≤150 characters (this one is 139
// code points); 01-profile-setup.md quotes it, and the profile mockup shows it.
export const profile = {
  name: 'Crapto Studio | Games·Apps·AI',
  category: 'Software Company',
  bio: [
    'Ideas, compiled. 💻 أفكارك، جاهزة للتشغيل',
    'Games · Apps · Software · AI',
    'ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي',
    '👇 DM "START" · راسلنا «ابدأ»',
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
  { slug: 'upgrades', icon: 'wrench', label: t('Upgrades', 'تطوير') },
  { slug: 'support', icon: 'trophy', label: t('Support', 'إرشاد') },
  { slug: 'reviews', icon: 'message-square-quote', label: t('Reviews', 'آراء العملاء') },
];

// The default last slide. The DM keyword is START in English and «ابدأ» in Arabic.
export const ctaDefault = {
  headline: t('Got an idea?\n*Let’s compile it.*', 'لديك فكرة؟\n*لنحوّلها إلى واقع.*'),
  body: t('DM us **“START”** or tap the link in bio.', 'راسلنا بكلمة **«ابدأ»** أو اضغط على الرابط في الملف الشخصي.'),
};

// Launch posts. Every post is published twice, once in English and once in Arabic.
// `order` is the posting order of the pair (1 = first); within a pair the English post goes
// up first, then the Arabic one. Instagram shows the newest post top-left.
// `scene` is the animated hero in design/scenes/<scene>.mjs.
export const posts = [
  {
    order: 1, slug: 'support', theme: 'blue', icon: 'trophy', scene: 'support',
    tag: t('07 / Support', '07 / الإرشاد'),
    headline: t('You code.\n*We guide.*', 'أنت تبرمج،\n*ونحن نرشدك.*'),
    sub: t('Mentoring for projects, competitions & hackathons', 'إرشاد في المشاريع البرمجية والمسابقات والهاكاثونات'),
    slides: [
      { type: 'cards', title: t('How we help', 'كيف نساعدك'), items: [
        { icon: 'graduation-cap', text: t('Project mentoring', 'إرشاد في المشاريع') },
        { icon: 'bug', text: t('Debugging sessions', 'جلسات لتصحيح الأخطاء') },
        { icon: 'trophy', text: t('Competition prep', 'التحضير للمسابقات') },
        { icon: 'lightbulb', text: t('You build. We explain.', 'أنت تبني، ونحن نشرح.') },
      ] },
      { type: 'cta', headline: t('Stuck on a project?\n*Let’s work it out.*', 'عالق في مشروع؟\n*لنحلّها معاً.*') },
    ],
  },
  {
    order: 2, slug: 'interactive', theme: 'dark', icon: 'presentation', scene: 'interactive',
    tag: t('06 / Interactive', '06 / المحتوى التفاعلي'),
    headline: t('Presentations people *remember*.', 'عروض تقديمية *لا تُنسى*.'),
    sub: t('Interactive content · Presentations · Demos', 'محتوى تفاعلي · عروض تقديمية · عروض توضيحية'),
    slides: [
      { type: 'cards', title: t('What we build', 'ماذا نصمّم'), items: [
        { icon: 'presentation', text: t('Interactive pitch decks', 'عروض تقديمية تفاعلية') },
        { icon: 'mouse-pointer-click', text: t('Touchscreen & kiosk apps', 'تطبيقات الشاشات اللمسية') },
        { icon: 'graduation-cap', text: t('Lessons & quizzes', 'دروس واختبارات تفاعلية') },
        { icon: 'box', text: t('3D product demos', 'عروض منتجات ثلاثية الأبعاد') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 3, slug: 'upgrades', theme: 'light', icon: 'wrench', scene: 'upgrades',
    tag: t('05 / Upgrades', '05 / التطوير'),
    headline: t('Already built?\nLet’s make it *better*.', 'مشروعك جاهز؟\n*لنجعله أفضل.*'),
    sub: t('Fix · Speed up · Extend · Modernise', 'إصلاح · تسريع · توسيع · تحديث'),
    slides: [
      { type: 'cards', title: t('What we do', 'ماذا نفعل'), items: [
        { icon: 'search-check', text: t('Code health check', 'فحص شامل للكود') },
        { icon: 'gauge', text: t('Speed & bug fixes', 'تسريع وإصلاح الأخطاء') },
        { icon: 'square-plus', text: t('New features', 'ميزات جديدة') },
        { icon: 'refresh-cw', text: t('Updates & redesigns', 'تحديثات وإعادة تصميم') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 4, slug: 'software', theme: 'dark', icon: 'code-xml', scene: 'software',
    tag: t('04 / Software', '04 / البرمجيات'),
    headline: t('Software built around how you *work*.', 'برمجيات مصمَّمة *حول طريقة عملك*.'),
    sub: t('Web · Desktop · Dashboards · Custom tools', 'ويب · سطح المكتب · لوحات تحكم · أدوات مخصّصة'),
    slides: [
      { type: 'cards', title: t('What we build', 'ماذا نبني'), items: [
        { icon: 'layout-dashboard', text: t('Dashboards & portals', 'لوحات تحكم وبوابات') },
        { icon: 'sheet', text: t('Spreadsheets → systems', 'من الجداول إلى أنظمة') },
        { icon: 'plug', text: t('APIs & integrations', 'ربط الأنظمة والتكامل') },
        { icon: 'file-code', text: t('Clean handover', 'تسليم كود موثّق') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 5, slug: 'ai', theme: 'blue', icon: 'sparkles', scene: 'ai',
    tag: t('03 / Custom AI', '03 / الذكاء الاصطناعي'),
    headline: t('AI that fits *your* business.', 'ذكاء اصطناعي *يفهم* عملك.'),
    sub: t('Assistants · Automation · Integrations', 'مساعدات ذكية · أتمتة · تكامل مع أدواتك'),
    slides: [
      { type: 'cards', title: t('What we build', 'ماذا نبني'), items: [
        { icon: 'bot', text: t('AI assistants', 'مساعدات ذكية') },
        { icon: 'workflow', text: t('Automations', 'أتمتة المهام') },
        { icon: 'puzzle', text: t('AI inside your app', 'ذكاء داخل تطبيقك') },
        { icon: 'lightbulb', text: t('Honest advice', 'استشارة صادقة') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 6, slug: 'apps', theme: 'dark', icon: 'smartphone', scene: 'apps',
    tag: t('02 / Apps', '02 / التطبيقات'),
    headline: t('Apps that earn a spot on the *home screen*.', 'تطبيقات تستحق مكانها *على شاشتك*.'),
    sub: t('iOS · Android · Cross-platform', 'iOS · Android · متعددة المنصات'),
    slides: [
      { type: 'cards', title: t('What we build', 'ماذا نبني'), items: [
        { icon: 'smartphone', text: t('iOS & Android apps', 'تطبيقات iOS و Android') },
        { icon: 'palette', text: t('UI/UX design', 'تصميم الواجهات والتجربة') },
        { icon: 'credit-card', text: t('Payments & accounts', 'الدفع والحسابات') },
        { icon: 'store', text: t('Store launch & updates', 'النشر في المتاجر والتحديثات') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 7, slug: 'start', theme: 'light', icon: 'send', scene: 'start',
    tag: t('Start here', 'ابدأ من هنا'),
    headline: t('New project?\nHere’s how we *build it*.', 'مشروع جديد؟\n*هكذا نبنيه.*'),
    sub: t('4 steps · No jargon · No surprises', '4 خطوات · بلا تعقيد · بلا مفاجآت'),
    slides: [
      { type: 'steps', title: t('How we work', 'كيف نعمل'), items: [
        { title: t('Talk', 'تحدّث معنا'), text: t('Tell us your idea. DM “START”.', 'أخبرنا بفكرتك. راسلنا بكلمة «ابدأ».') },
        { title: t('Plan', 'نخطّط'), text: t('Clear scope, quote & timeline.', 'نطاق واضح وعرض سعر وجدول زمني.') },
        { title: t('Build', 'نبني'), text: t('Real progress every week.', 'تقدّم حقيقي تراه كل أسبوع.') },
        { title: t('Launch & support', 'نُطلق وندعم'), text: t('We ship it and stay around.', 'نُطلق مشروعك ونبقى معك.') },
      ] },
      { type: 'cards', title: t('Send us this first', 'أرسل لنا أولاً'), items: [
        { icon: 'lightbulb', text: t('Your idea, in one line', 'فكرتك في سطر واحد') },
        { icon: 'users', text: t('Who it’s for', 'لمن هذا المشروع') },
        { icon: 'calendar', text: t('Your deadline', 'الموعد النهائي') },
        { icon: 'wallet', text: t('Your budget range', 'الميزانية التقريبية') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 8, slug: 'games', theme: 'dark', icon: 'gamepad-2', scene: 'games',
    tag: t('01 / Games', '01 / الألعاب'),
    headline: t('Games people want to *replay*.', 'ألعاب تُلعب *مرة بعد مرة*.'),
    sub: t('Unity · 2D & 3D · Mobile, PC & web', 'Unity · ثنائية وثلاثية الأبعاد · للجوال والكمبيوتر والويب'),
    slides: [
      { type: 'cards', title: t('What we build', 'ماذا نبني'), items: [
        { icon: 'gamepad-2', text: t('Full Unity games', 'ألعاب Unity متكاملة') },
        { icon: 'flask-conical', text: t('Playable prototypes', 'نماذج أولية قابلة للعب') },
        { icon: 'megaphone', text: t('Advergames for brands', 'ألعاب تسويقية للعلامات التجارية') },
        { icon: 'sparkles', text: t('Game feel & polish', 'متعة اللعب واللمسات الأخيرة') },
      ] },
      { type: 'cta' },
    ],
  },
  {
    order: 9, slug: 'intro', theme: 'blue', icon: null, scene: 'intro',
    tag: t('Hello, world', 'مرحباً بالعالم'),
    headline: t('Ideas, *compiled.*', 'أفكارك، *جاهزة للتشغيل.*'),
    sub: t('Games · Apps · Software · AI', 'ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي'),
    slides: [
      { type: 'statement', kicker: t('// who we are', '// من نحن'),
        text: t('We *design and build* games, apps, software and AI.', 'نصمّم *ونبني* الألعاب والتطبيقات والبرمجيات وحلول الذكاء الاصطناعي.') },
      { type: 'services', title: t('What we do', 'ماذا نقدّم') },
      { type: 'steps', title: t('Why work with us', 'لماذا تعمل معنا'), items: [
        { title: t('Honest scoping', 'تقدير صادق'), text: t('If you don’t need it, we say so.', 'إن لم تكن بحاجة إليه، نخبرك بصراحة.') },
        { title: t('Weekly progress', 'تقدّم أسبوعي'), text: t('Builds you can try, every week.', 'نسخ تجريبية تراها كل أسبوع.') },
        { title: t('Clean handover', 'تسليم منظّم'), text: t('Documented code and project files.', 'كود موثّق وملفات المشروع كاملة.') },
        { title: t('We stick around', 'نبقى معك'), text: t('Support after launch.', 'دعم مستمر بعد الإطلاق.') },
      ] },
      { type: 'cta' },
    ],
  },
];
