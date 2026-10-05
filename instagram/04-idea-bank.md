# Idea bank: Crapto Studio

A long list of post and Reel ideas, so you never stare at an empty calendar. Every idea can be made by a small studio with screen recordings, phone video, the slide templates and the animated scene system in this repo, and every idea goes out in **English and Arabic**: an English post and a separate Arabic post.

> **Handle:** this file assumes **@craptostudio**. If your handle is different, swap it wherever you see it.

**Related files**

| File | What it covers |
|---|---|
| [`02-content-strategy.md`](02-content-strategy.md) | Bilingual publishing, pillars, weekly rhythm, Reel covers, hashtag sets (English and Arabic), the first 30 days |
| [`03-launch-posts.md`](03-launch-posts.md) | The 18 launch posts (9 English + Arabic pairs). Post these first |
| [`../design/content.mjs`](../design/content.mjs) | All post text, English and Arabic. Add new posts here, then run `npm run render`, `npm run motion -- <slug>` and `npm run check` |
| [`../design/scenes/`](../design/scenes/) | The animated hero of each launch post, one file per scene. Reuse one as the hero of a new carousel, or copy one to make a [motion idea](#29-six-motion-ideas-the-scene-system) |
| [`../design/motion/`](../design/motion/) | The stage and loop contract (`stage.mjs`), the shared UI kit (`ui.mjs`) and the video renderer (`render-video.mjs`, run with `npm run motion`) |
| [`../brand/brand-guide.md`](../brand/brand-guide.md#51-logo-files) | Your logo files and which one to use on which background (for Reel watermarks and end cards); the Arabic voice and terms ([section 9](../brand/brand-guide.md#9-bilingual-identity-english-and-arabic)); the motion rules ([section 10](../brand/brand-guide.md#10-motion)) |

**Contents**

1. [How to use this bank](#1-how-to-use-this-bank)
2. [48 post and Reel ideas, plus 6 motion ideas](#2-48-post-and-reel-ideas-plus-6-motion-ideas)
3. [Three Reel scripts](#3-three-reel-scripts)
4. [15 recurring story formats](#4-15-recurring-story-formats)
5. [Six carousel formulas](#5-six-carousel-formulas)
6. [Ten caption hook formulas](#6-ten-caption-hook-formulas)

---

## 1) How to use this bank

Use it after the 30-day plan in the [content strategy](02-content-strategy.md), or any week you need a fresh idea.

### The four pillars

Every idea belongs to one pillar. Same pillars and mix as the strategy file.

| Pillar | The question it answers | Share of feed posts |
|---|---|---|
| **SHOW** (proof) | "Can they really build this?" | ~35% |
| **BUILD** (behind the scenes) | "What is it like to work with them?" | ~25% |
| **TEACH** (value) | "Do they know what they're talking about?" | ~25% |
| **OFFER** (conversion) | "How do I start?" | ~15% |

### Pick an idea in 3 steps

1. **Check the slot.** The [weekly rhythm](02-content-strategy.md#4-weekly-rhythm) gives the format: Tuesday = a Reel pair (new real footage), Thursday = a carousel pair (animated hero + slides). Its 4-week pillar cycle gives the pillar. Saturday's hero Reel pair is ready-made in `../exports/reels/`, so it doesn't need an idea.
2. **Pick the next service.** Go round all 8 services in turn (see the rotation below).
3. **Pick a row.** In that service's table, choose an idea with the right pillar and format: a **Screen Reel** for Tuesday, a **Carousel** (or a [motion idea](#29-six-motion-ideas-the-scene-system)) for Thursday. Write its ID (for example `GM1`) in your calendar. Every ID goes out as a pair: the English post first, then the Arabic one.

### Rotate the services

- Never post the same service twice in a row.
- Cover all 8 services every 4 weeks (2 new pairs a week = 8 slots).
- If one service brings more DMs (in either language), give it an extra slot. Don't drop the others completely.
- Motion ideas (`MO1`–`MO6`) count as the service they show.

**Example: one round of 4 weeks, all 8 services** (pillars from the strategy's cycle; none of these IDs are used in the strategy's 30-day plan)

| Week | Tue: Reel pair | Thu: carousel pair |
|---|---|---|
| 1 | `UP1` Before / after: new look (SHOW) | `GM5` What a prototype should prove (TEACH) |
| 2 | `SW4` What a clean handover looks like (BUILD) | `SP6` How mentoring works (OFFER) |
| 3 | `AI3` Email in, draft out (SHOW) | `IX3` 4 ways to make a presentation interactive (TEACH) |
| 4 | `AP5` Small details that make an app feel finished (SHOW) | `CS2` The questions we ask before we quote (BUILD) |

Then start the next round with new IDs. At 2 new pairs a week, most of the bank lasts 5 months or more. Two kinds run out first:

- **SHOW Reels** (15, plus `MO1`) at 3 a month: about 5 months. Add real project footage as you get it.
- **BUILD carousels:** only `CS2` and `MO5`. For the other BUILD carousel slots, turn a BUILD Reel idea into a carousel, for example `SW4` (handover screenshots on `image` slides, then a `cards` checklist) or `UP3` (what we open first, as `cards`). Add BUILD ideas from your real work, and repeat the topics that worked best.

`SP5` (TEACH) and `CS6` (OFFER) are Reels in pillars the Tuesday cycle doesn't use: post them as an extra Reel pair, or in place of a Thursday slot with the same pillar.

### One idea, two languages

Every feed post is a pair, as the strategy's [bilingual publishing](02-content-strategy.md#0-bilingual-publishing) rules explain: an English post, then a separate Arabic post (Modern Standard Arabic, right to left) a few minutes later. On the grid the Arabic post then sits just before (left of) its English twin. What that means for the ideas below:

- **Film once, edit twice.** The footage is shared. Only the on-screen text, subtitles, voiceover, end card and caption change.
- **Rendered posts come in both languages.** The text in [`../design/content.mjs`](../design/content.mjs) and in each scene's `copy` is written as English + Arabic, and `npm run render` / `npm run motion` export an English and an Arabic version of everything: `en/` and `ar/` folders for each post, `-en.mp4` and `-ar.mp4` for each Reel.
- **Every hook has an Arabic version.** It makes the same promise in natural Arabic, not a word-for-word translation ([adapt, don't translate](02-content-strategy.md#adapt-dont-translate)). The slide text in the tables is English: write the Arabic next to it in `content.mjs` as `t('English', 'العربية')`, with the shared terms below.
- **Keep these in Latin letters:** the name **Crapto Studio** (never translated or transliterated) and tech names such as Unity, iOS, Android, API, UI/UX.
- **The DM keyword is START in English and «ابدأ» in Arabic.** The Arabic call to action is `راسلنا بكلمة «ابدأ»‏`.
- **Show Arabic screens only if they're real.** If the app or demo you film has no Arabic version, keep the English footage and put the Arabic in the on-screen text, subtitles and caption.
- **Start every Arabic line with an Arabic word**, not with a Latin word, a number, an emoji or a hashtag, or the line may be laid out left to right ([mixed-script tips](../brand/brand-guide.md#94-mixed-script-latin-digits-punctuation-and-direction)). The Arabic hooks below already do.
- **Arrows:** in Arabic text you type in other apps (captions, video editors) they point left: `قبل ← بعد`. In the slide text in `content.mjs`, type `→` in both languages: the Arabic slide mirrors it. Keep arrows out of the hero's `tag`, `headline` and `sub`: the hero doesn't convert them, so an Arabic hero would show them pointing the wrong way.

**Terms used in this bank** (from the posts; service names and the full list are in the brand guide's [terminology table](../brand/brand-guide.md#93-terminology-english--arabic))

| English | Arabic |
|---|---|
| Upgrades · Support (mentoring) · Integrations | <span dir="rtl">ترقية · إرشاد · ربط</span> |
| Prototype · game feel | <span dir="rtl">نموذج أولي · متعة اللعب</span> |
| AI assistant · chatbot · automation | <span dir="rtl">مساعد ذكي · روبوت محادثة · أتمتة</span> |
| Spreadsheet · dashboard | <span dir="rtl">جدول بيانات · لوحة تحكم</span> |
| Code health check · debugging · clean handover | <span dir="rtl">فحص شامل للكود · تصحيح الأخطاء · تسليم منظّم</span> |
| Quote · timeline | <span dir="rtl">عرض سعر · جدول زمني</span> |
| Leaderboard | <span dir="rtl">لوحة الصدارة</span> |
| Demo · test data | <span dir="rtl">نموذج تجريبي · بيانات اختبار</span> |
| Concept · internal project | <span dir="rtl">تصوّر مبدئي · مشروع داخلي</span> |
| Client project (shared with permission) | <span dir="rtl">مشروع لعميل (يُنشر بإذنه)</span> |

> **Reading this file:** some Markdown viewers lay out Arabic inside tables, `code` and code blocks left to right, so a full stop, a question mark or an English word can look out of place. Arabic in tables is wrapped in `<span dir="rtl">` to help, and Arabic quoted inside English sentences ends with an invisible right-to-left mark where it ends in punctuation (as in the brand guide). The text itself is stored in the right order: copy it and it pastes correctly.

### Rules for every idea

- **Real footage, or the kit's own animation.** Screen recordings, phone video, the slide templates and the scene system. No stock videos.
- **Scenes are illustrations, not proof.** The names, ratings, load times, scores and order counts inside the animated scenes are sample data. Never quote them in a caption as real results.
- **Label honestly**, in both languages: "Demo" (`نموذج تجريبي`), "Concept" (`تصوّر مبدئي`), "Internal project" (`مشروع داخلي`), or "Client project (shared with permission)" (`مشروع لعميل (يُنشر بإذنه)‏`). Never present a demo as client work.
- **Fill every `[bracket]` with a real detail, or skip the idea.** Never invent numbers, clients, results or quotes.
- **Ideas that say "we" assume you have that thing** (a demo, a project, a test). If you don't have it yet, build a small demo first or pick another idea.
- **The hook must match the video.** If the video doesn't deliver what the first line promises, change the hook, in both languages.
- **Test data only** in AI and software demos. Blur names, emails, prices and anything private.
- **Say the topic in the first line**: Unity game, iOS app, software, custom AI (in Arabic: <span dir="rtl">لعبة، تطبيق، برمجيات، ذكاء اصطناعي</span>). The name can be misread, so the first line should make it obvious what Crapto Studio does. Never use crypto, NFT, trading or blockchain words or hashtags, in either language.
- **One action at the end**: DM "START" (Arabic: «ابدأ»), save, or share. A short question for the comments is fine too.

### Get more from each idea

- **One idea = 3 pieces, in both languages.** A Reel pair, a carousel pair on the same topic a few weeks later, and 2–3 stories.
- **A carousel brings its own Reel.** Its animated hero also renders as a 9:16 Reel (`../exports/reels/NN-<slug>-en.mp4` and `-ar.mp4`, each with a `-cover.jpg`), ready for a Saturday hero Reel slot ([where Reels fit](02-content-strategy.md#where-reels-fit)). If the carousel reused a launch scene, its hero Reel looks almost the same as that launch Reel (only the tag, headline and sub-line change), so the strategy suggests an extra Reel pair from real footage (a BUILD idea) in that slot instead. A [motion idea](#29-six-motion-ideas-the-scene-system) brings a new animation, so its hero Reel is worth posting.
- **Repeat winners.** If a post brings saves, shares or DMs, do the same topic again after 2–3 months with a new example and a new hook.
- **Keep a simple log.** Copy the ID, language, date and result (reach, saves, DMs) into your tracker. It shows which pillar, service and language work best.

### How to read the tables

| Column | Meaning |
|---|---|
| **ID** | Service letters + number: `GM` Games, `AP` Apps, `SW` Software, `AI` Custom AI, `IX` Interactive, `UP` Upgrades, `SP` Support, `CS` Custom solutions, `MO` [motion ideas](#29-six-motion-ideas-the-scene-system). (The strategy file uses S1, B1, T1, O1; these codes don't clash with them.) |
| **Format** | How to make it. **Screen Reel** = a 1080 × 1920 video from real footage: a screen recording, phone video or a Unity capture. **Carousel** = an animated hero (slide 1) followed by icon cards and other static slides, 1080 × 1350; carousels can mix the hero video with images. **Story** = 1080 × 1920, disappears after 24 hours unless saved to a highlight. **alt** = the same idea also works as an animated scene: a motion idea, or a launch scene that already tells that story. |
| **Hook (EN)** · **Hook (AR)** | The first words said or shown on screen, in each language. Every hook below, English and Arabic, is under 60 characters as written (counted with `[...text].length`). Count again after you fill in a `[bracket]`. |
| **What to show** | The footage or the slides. For carousels, the arrows show the slide order, starting with the launch scene to reuse as the hero: `hero (games) → cards → cta`. This is the shortest version. For TEACH carousels, add a slide or two (an example, a second `cards`, a `statement` with the takeaway) to reach the 4–8 slides the strategy recommends. Card lists stop at 4 short items: split longer ones over two `cards` slides. |

---

## 2) 48 post and Reel ideas, plus 6 motion ideas

Six ideas for each of the 8 services, then six motion ideas built with the scene system. Captions follow the structure in the strategy file: hook line, 2–4 short lines, one action, up to 5 hashtags from the set for that language ([hashtag sets](02-content-strategy.md#hashtags-max-5-per-post)).

### 2.1 Games (Unity)

**For:** founders, creators and brands who want a game, prototype or advergame. **Hero tag:** `01 / Games` · `01 / ألعاب`. **Launch scene to reuse:** [`games`](../design/scenes/games.mjs) (a blob hero runs and jumps through a Unity-style platformer).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| GM1 | Screen Reel · alt `MO5` | BUILD | Game feel: before / after | "Same jump. One feels flat, one feels alive." | <span dir="rtl">القفزة نفسها: واحدة باهتة، والأخرى تنبض بالحياة</span> | Screen recording in Unity Play mode. The plain jump first, then add one layer at a time: squash & stretch, dust, sound, a small camera shake, coyote time. Label each layer on screen. Full script: [Reel 1](#reel-1-games-same-jump-two-versions). |
| GM2 | Screen Reel | SHOW | 15 seconds of gameplay | "A [genre] game made in Unity. Best 15 seconds." | <span dir="rtl">لعبة [النوع] بمحرّك Unity: أفضل 15 ثانية فيها</span> | Start on the best moment, not the menu. Clean capture from the editor or a build. On screen: "Made in Unity · [platforms]". Label it honestly: "Demo", "Concept", or "Client project (shared with permission)". |
| GM3 | Screen Reel | SHOW | One project, three screens | "One Unity project. Phone, PC and browser." | <span dir="rtl">مشروع Unity واحد يعمل على الجوال والكمبيوتر والمتصفح</span> | Phone video of the same level running on a phone, then a PC, then a browser tab (WebGL build). Only show platforms you really built for. |
| GM4 | Screen Reel or Story | BUILD | Bug of the week: game blooper | "Bug of the week: [what went wrong, in a few words]." | <span dir="rtl">خلل الأسبوع: [ما الذي حدث، في كلمات قليلة]</span> | The funny bug clip (a character falling through the floor, physics going wild), then one line on the cause and a quick shot of the fix in the code or Inspector. Use a real bug from your own project. |
| GM5 | Carousel | TEACH | What a prototype should prove | "Before you build the full game, prove these 4 things." | <span dir="rtl">قبل أن تبني لعبتك كاملة، اختبر هذه الأمور الأربعة</span> | `hero (games) → cards → statement → cta`. Cards, "Prove these first": fun in 30 seconds · controls feel right · one level, whole idea · runs on the weakest device. Statement: "Prove the fun first. Then build the rest." In the caption: testers asking for "one more try" is the best sign. |
| GM6 | Carousel | OFFER | Games for brands (advergames) | "A game with your brand in it. Here's how it works." | <span dir="rtl">لعبة تحمل علامتك التجارية، وإليك كيف تعمل</span> | `hero (games) → statement → cards → steps → cta`. Statement: who it's for (brands, events, campaigns). Cards, "What you get": playable web or mobile build · your brand in the game · [leaderboard or prizes, only if you offer them] · full handover. Steps: Talk · Prototype · Build · Launch. |

### 2.2 Apps (iOS / Android)

**For:** startups and small businesses that need an app. **Hero tag:** `02 / Apps` · `02 / تطبيقات`. **Launch scene to reuse:** [`apps`](../design/scenes/apps.mjs) (a booking app on a floating phone: pick a time, book, confirmed).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| AP1 | Carousel | TEACH | How much does an app cost? It depends on… | "How much does an app cost? It depends on 8 things." | <span dir="rtl">كم تكلفة التطبيق؟ الجواب يعتمد على 8 أمور</span> | `hero (apps) → statement → cards → cards → statement → cta`. Statement: "Honest answer: it depends." Cards 1, "What it does": screens & features · logins & user data · payments or maps · notifications. Cards 2, "How it's built": backend & admin panel · iOS, Android or both · custom design · updates after launch. Statement: "We don't guess prices in comments. Send us the idea and we'll scope it." No price numbers. Formula: [It depends on…](#formula-4-it-depends-on). |
| AP2 | Screen Reel | SHOW | One full flow, no cuts | "Open the app, sign up, [main feature]. No cuts." | <span dir="rtl">من فتح التطبيق إلى [الميزة الرئيسية]، في لقطة واحدة</span> | Phone in hand (phone video) or a clean screen recording. One flow from start to finish without edits, so people see it really works. Test account only. |
| AP3 | Screen Reel · alt `MO3` | BUILD | Sketch to screen | "Paper sketch → design → working screen." | <span dir="rtl">رسم على الورق ← تصميم ← شاشة تعمل فعلاً</span> | Three shots, about 5 seconds each: phone video of the paper sketch, the design file, then a screen recording of the same screen on a real phone. |
| AP4 | Carousel | TEACH | App or website? | "Before you pay for an app, ask these 4 questions." | <span dir="rtl">قبل أن تطلب تطبيقاً، اسأل نفسك هذه الأسئلة الأربعة</span> | `hero (apps) → cards → statement → cta`. Cards, "Ask these first": used every week? · needs camera, GPS or offline? · would a website do? · who updates it after launch? Statement: "If a website does the job, we'll tell you." |
| AP5 | Screen Reel | SHOW | Small details that make an app feel finished | "5 small details that make an app feel finished." | <span dir="rtl">تفاصيل صغيرة تجعل التطبيق يبدو مكتملاً، إليك 5 منها</span> | Quick screen-recording cuts, one label each: a loading state, an empty state ("No orders yet"), a clear error message, pull to refresh, dark mode. |
| AP6 | Carousel | OFFER | From idea to the app stores | "Your app idea, on people's phones. In 4 steps." | <span dir="rtl">فكرة تطبيقك على هواتف الناس، في 4 خطوات</span> | `hero (apps) → steps → cards → cta`. Steps: Talk · Plan · Build (a test build on your own phone every week) · Launch & support (App Store and Google Play publishing, updates). Cards, "Send us this first": the same 4 cards as launch post `07-start` (your idea, in one line · who it's for · your deadline · your budget range). |

### 2.3 Software

**For:** small businesses and teams that run on spreadsheets, paperwork or tools that don't talk to each other. **Hero tag:** `04 / Software` · `04 / برمجيات`. **Launch scene to reuse:** [`software`](../design/scenes/software.mjs) (a messy spreadsheet rebuilds itself as a clean dashboard).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| SW1 | Screen Reel · alt: launch scene `software` | SHOW | Spreadsheet → system | "This used to be a spreadsheet. Now it's a real system." | <span dir="rtl">كان جدول بيانات، وأصبح نظاماً متكاملاً</span> | Screen recording. Shot 1: a messy spreadsheet (test data). Shot 2: the same job in the new tool: a form, a dashboard, a one-click report. End on the dashboard. |
| SW2 | Screen Reel · alt `MO4` | SHOW | Two tools, connected | "New order → sheet updated → team notified." | <span dir="rtl">طلب جديد ← تحديث الجدول ← تنبيه للفريق</span> | Screen recording in three parts: an order placed in [tool A], a new row in [tool B], a message in [tool C]. Test data. Show the real timing; if it takes a minute, say so. |
| SW3 | Carousel | TEACH | Tech words in plain English | "MVP, API, backend: tech words in plain English." | <span dir="rtl">مصطلحات تقنية بلغة بسيطة: MVP و API والواجهة الخلفية</span> | `hero (software) → steps → steps → cta`. Use `steps` as a glossary: the step title is the word, the text is its plain meaning. Slide 1: MVP = the smallest useful version · API = how two programs talk to each other · Backend = the part you don't see, where data is stored · Frontend = the part you see and tap. Slide 2: Bug = the program does something it wasn't planned to do, plus 3 more words people ask you about. |
| SW4 | Screen Reel | BUILD | What a clean handover looks like | "A clean handover: here's what it should look like." | <span dir="rtl">هكذا يبدو التسليم المنظّم والموثّق لمشروعك</span> | Screen recording of a handover from your own project: a README with setup steps, clear folder names, the docs page, the repository access screen. End with a question on screen: "Does your project have this?" |
| SW5 | Carousel | TEACH | Ready-made tool or custom software? | "Don't build custom software if this already exists." | <span dir="rtl">لا تطلب برمجيات مخصّصة إن وُجدت أداة جاهزة تكفيك</span> | `hero (software) → cards → cards → statement → cta`. Cards 1, "A ready-made tool is enough when…": fits most of your process · small team · standard process · needed next week. Cards 2, "Custom makes sense when…": tools that don't talk · data copied by hand daily · your process is your edge · spreadsheets can't keep up. Statement: "If a ready-made tool fits, we'll say so." Formula: [This or that](#formula-6-this-or-that). |
| SW6 | Carousel | OFFER | Need an internal tool? | "Need an internal tool? Send us these 4 things." | <span dir="rtl">تحتاج إلى أداة داخلية لفريقك؟ أرسل لنا هذه النقاط الأربع</span> | `hero (software) → cards → cta`. Cards: how it's done today · who uses it, how often · tools to connect · deadline & budget range. In the caption: a screenshot of how you do it today is enough (no private data). |

### 2.4 Custom AI

**For:** businesses that repeat the same text-heavy tasks, and teams that want AI features inside their app or website. **Hero tag:** `03 / Custom AI` · `03 / ذكاء اصطناعي`. **Launch scene to reuse:** [`ai`](../design/scenes/ai.mjs) (a store assistant answers a customer, using the store's data).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| AI1 | Carousel | TEACH | You might not need AI (myth-busting) | "You might not need AI. 4 myths, honest answers." | <span dir="rtl">قد لا تحتاج إلى الذكاء الاصطناعي: 4 خرافات وإجابات صادقة</span> | `hero (ai) → statement ×4 → statement → cta`. One myth per slide: "AI will fix messy data" → clean the data first · "Every app needs a chatbot" → often a good search or FAQ is enough · "AI is always right" → it can be wrong, so plan who checks · "Use AI for everything" → if a simple rule works, use the rule. Last statement: "If you don't need AI, we'll tell you." Ready-made text in both languages: [Formula 3](#formula-3-myth-vs-fact). |
| AI2 | Screen Reel · alt `MO2` | SHOW | An assistant that answers from your documents | "This AI assistant answers from your own documents." | <span dir="rtl">مساعد ذكي يجيب من مستنداتك أنت</span> | Screen recording of a demo assistant using test documents. It shows its source and says "I don't know" when the answer isn't there. Full script: [Reel 2](#reel-2-custom-ai-answers-from-your-documents). |
| AI3 | Screen Reel | SHOW | Email in, draft out | "An email comes in. The summary and draft reply are ready." | <span dir="rtl">تصل رسالة بريد، والملخّص ومسودة الرد جاهزان</span> | Screen recording: a test email arrives → the AI pulls the key details into a sheet → a draft reply waits for a person. Show the "approve" click, so it's clear a human stays in control. |
| AI4 | Screen Reel | BUILD | We tried to break our own AI | "We tried to break our own AI assistant." | <span dir="rtl">حاولنا إيقاع مساعدنا الذكي في الخطأ، عمداً</span> | Screen recording: off-topic questions, trick questions, questions with no answer in the documents. Show what it did and what you changed when it failed. Only post what really happened. |
| AI5 | Screen Reel | SHOW | An AI feature inside an app | "Take a photo. The app [does the job for you]." | <span dir="rtl">التقط صورة، والتطبيق [يُنجز المهمة عنك]</span> | Phone video: someone takes a photo of [a receipt / a product / a form] and the app fills in the details. One feature, one clear result. Demo data. |
| AI6 | Carousel | OFFER | Bring us one boring task | "Tell us one task you repeat every week." | <span dir="rtl">أخبرنا بمهمة واحدة تكرّرها كل أسبوع</span> | `hero (ai) → steps → cta`. Steps: Send us the task · We check honestly if AI helps (or if a simple rule is enough) · We test it on sample data · If it works, we build it into your tools. |

### 2.5 Interactive content & presentations

**For:** brands, marketers, educators, trainers and event teams. **Hero tag:** `06 / Interactive` · `06 / محتوى تفاعلي`. **Launch scene to reuse:** [`interactive`](../design/scenes/interactive.mjs) (a 3D product turns in a slide; a tap opens an info card, then a quick quiz is answered).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| IX1 | Screen Reel | SHOW | Normal slides vs. interactive presentation | "Normal slides vs. an interactive presentation." | <span dir="rtl">شرائح عادية أم عرض تقديمي تفاعلي؟</span> | Screen recording, back to back: a flat slide deck, then the same content as an interactive version (a clickable map, a 3D model you can rotate, a live question for the room). Label "Demo". |
| IX2 | Screen Reel | SHOW | Touchscreen demo | "Tap to start. This is what visitors see." | <span dir="rtl">اضغط للبدء: هذا ما يراه زوّارك</span> | Phone video of a hand tapping through a kiosk or tablet experience: start screen → quiz or product explorer → result screen. If it wasn't filmed at a real event, film it on a desk and label it "Demo". |
| IX3 | Carousel | TEACH | 4 ways to make a presentation interactive | "4 ways to make your next presentation interactive." | <span dir="rtl">اجعل عرضك التقديمي القادم تفاعلياً بهذه الطرق الأربع</span> | `hero (interactive) → cards → cta`. Cards: a live poll · a 3D product to rotate · a map or timeline to explore · a quiz with a leaderboard. A fifth idea for the caption: a "choose what's next" menu instead of a fixed order. |
| IX4 | Screen Reel | BUILD | Worksheet → quiz game | "This worksheet is now a quiz game." | <span dir="rtl">ورقة العمل هذه أصبحت لعبة أسئلة تفاعلية</span> | Screen recording: the paper or PDF worksheet → adding the questions → someone playing the quiz on a tablet. Good for teachers and trainers. |
| IX5 | Screen Reel | BUILD | Same quiz, more fun | "Same quiz. Now add a timer, sound and a leaderboard." | <span dir="rtl">الاختبار نفسه، مع مؤقّت وصوت ولوحة صدارة</span> | The game-feel idea for interactive content. A plain quiz first, then add one layer at a time: a timer, a "correct" sound, a streak counter, a leaderboard. Label each layer on screen. |
| IX6 | Carousel | OFFER | Event, lesson or pitch coming up? | "Event, lesson or pitch coming up? Send us this." | <span dir="rtl">فعالية أو درس أو عرض تقديمي قريباً؟ أرسل لنا هذا</span> | `hero (interactive) → cards → cta`. Cards: date & venue · screen or device · your audience · the one thing to remember. In the caption: the device options (touchscreen, tablet, projector, laptop) and "plus your brand files". |

### 2.6 Upgrades (improving existing projects)

**For:** owners of apps, games and software that need fixing, speeding up or new features. **Hero tag:** `05 / Upgrades` · `05 / ترقية`. **Launch scene to reuse:** [`upgrades`](../design/scenes/upgrades.mjs) (an app flips from Before to After: code diff, bug fixed, speed gauge climbs). Its gauge shows sample numbers, so never pair it with real results without saying which numbers are real.

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| UP1 | Screen Reel · alt `MO1` | SHOW | Before / after: new look | "Same features. New look. No rebuild." | <span dir="rtl">الميزات نفسها، بمظهر جديد، ودون إعادة بناء</span> | Screen recording: the old screen, a swipe transition, the new screen. Repeat for 2–3 screens. Only with the owner's permission, or use one of your own older projects. |
| UP2 | Screen Reel | SHOW | Before / after: speed | "Same app. Before and after our upgrade." | <span dir="rtl">التطبيق نفسه، قبل الترقية وبعدها</span> | Two recordings of the same flow, same device, same network, with a timer on screen. Real numbers only. Full script: [Reel 3](#reel-3-upgrades-before-and-after). |
| UP3 | Screen Reel | BUILD | Health check: what we open first | "You send us your project. This is what we open first." | <span dir="rtl">ترسل لنا مشروعك، وهذا أول ما نفتحه</span> | Quick screen-recording cuts, one label each: the README, the list of outdated packages, the error logs, the profiler. Use your own project, or a client's with permission and private parts blurred. |
| UP4 | Carousel | TEACH | Fix it or rebuild it? | "Don't rebuild your app before you check these 4 things." | <span dir="rtl">لا تُعِد بناء تطبيقك قبل أن تتحقّق من هذه النقاط الأربع</span> | `hero (upgrades) → cards → statement → cta`. Cards, "Check these first": is the code readable? · bugs in one place, or everywhere? · can the libraries be updated? · is fixing cheaper than starting again? Statement: "Often fixing is enough. Sometimes it isn't, and we'll say so." |
| UP5 | Screen Reel | BUILD | Updating an old project | "We updated an old Unity project. Here's what broke." | <span dir="rtl">حدّثنا مشروع Unity قديماً، وهذا ما تعطّل</span> | Screen recording: the version update, the errors that appear, 2–3 quick fixes, the project running again. Works for an app SDK update too. Use a real project and real errors. |
| UP6 | Carousel | OFFER | Project stuck? | "Project stuck? Send us these 3 things." | <span dir="rtl">مشروعك متعثّر؟ أرسل لنا هذه الأمور الثلاثة</span> | `hero (upgrades) → cards → statement → cta`. Cards (3): a link, screenshots or repo access · what's wrong or missing · what "fixed" looks like for you. Statement: "We'll reply with what we'd look at first." |

### 2.7 Support (programming projects & competitions)

**For:** students, competition and hackathon teams who need mentoring and guidance. **Hero tag:** `07 / Support` · `07 / إرشاد`. **Launch scene to reuse:** [`support`](../design/scenes/support.mjs) (the mentor asks a question about a bug; the student types the fix and the tests pass).

> **Fair play:** Support means mentoring and guidance, never doing someone's assignment or competition entry. The work stays the student's or team's: «أنت تبرمج، ونحن نرشدك.‏» Every school and competition has its own rules about outside help and code written before the event. Say this clearly in Support posts, in both languages, and check the rules before you mentor anyone.

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| SP1 | Carousel | TEACH | Competition prep checklist | "Competition coming up? Check these 8 things first." | <span dir="rtl">مسابقتك تقترب؟ تحقّق من هذه النقاط الثماني أولاً</span> | `hero (support) → cards → cards → statement → cta`. Cards 1, "Before the event": read rules & judging · agree who does what · laptops & accounts ready · check what you may prepare. Cards 2, "On the day": plan the demo first · commit often · record a backup video · freeze features in time. Statement: "Practise the pitch out loud. Twice." Ready-made cards in both languages: [Formula 1](#formula-1-the-checklist). |
| SP2 | Carousel | TEACH | Plan the demo first | "At a hackathon, plan the demo before you code." | <span dir="rtl">في الهاكاثون، خطّط للعرض قبل أن تكتب سطراً واحداً</span> | `hero (support) → steps → statement → cta`. Steps: Write the problem in one sentence · Plan a 60-second demo path · Build only what that path needs · Record a backup video. Statement: "In a short demo, people only see what works." |
| SP3 | Screen Reel | BUILD | A code review, sped up | "A code review session, in 30 seconds." | <span dir="rtl">جلسة مراجعة كود في 30 ثانية: نحن نسأل، وأنت تُصلح</span> | Screen recording, sped up, with on-screen notes of the questions you asked and what the student changed. The student makes the fixes; you point and ask. Use your own sample project, or a student's with permission (blur names). |
| SP4 | Screen Reel | SHOW | Team spotlight (with permission) | "Meet [team name]. They built [project] for [event]." | <span dir="rtl">تعرّفوا إلى فريق [اسم الفريق]: بنوا [المشروع] لـ[الفعالية]</span> | Their demo clip, a team photo, and 2–3 lines on how you helped. Make it clear the work is theirs. Only with the team's permission. |
| SP5 | Screen Reel (talking head) | TEACH | 3 questions to be ready for | "3 questions every project team should be ready for." | <span dir="rtl">على كل فريق مشروع أن يستعد لهذه الأسئلة الثلاثة</span> | Talking-head phone video with text on screen: "Why did you choose this tech?" · "What was the hardest problem?" · "What would you do with more time?" 5–8 seconds each, with one short tip per question. |
| SP6 | Carousel | OFFER | How mentoring works | "Stuck on a project or getting ready for a competition?" | <span dir="rtl">عالق في مشروعك أو تستعد لمسابقة؟</span> | `hero (support) → steps → cta`. Steps: Send us your project and deadline · We look at the code together · You build, we guide (the work stays yours) · A practice run before the deadline. |

### 2.8 Custom solutions

**For:** anyone with a problem that doesn't fit one box. **Hero tag:** `08 / Custom` · `08 / حلول مخصّصة` (suggested; the launch posts use 01–07). **Launch scenes to reuse:** [`start`](../design/scenes/start.mjs) (the 4-step journey) or [`intro`](../design/scenes/intro.mjs) (the logo with the 8 services orbiting it).

| ID | Format | Pillar | Working title | Hook (EN) | Hook (AR) | What to show |
|---|---|---|---|---|---|---|
| CS1 | Screen Reel | SHOW | One problem, one small tool | "The problem: [one line]. The tool we built:" | <span dir="rtl">المشكلة: [في سطر واحد]، وهذه الأداة التي بنيناها</span> | Screen recording: the problem in one line of text, then the tool doing the job. 15–20 seconds. Label "Demo", "Internal project" or "Client project (shared with permission)". |
| CS2 | Carousel | BUILD | The questions we ask before we quote | "The 4 questions we ask before we quote anything." | <span dir="rtl">الأسئلة الأربعة التي نطرحها قبل أي عرض سعر</span> | `hero (start) → cards → statement → cta`. Cards: what problem are we solving? · who uses it, how often? · what does "done" look like? · deadline & budget range? Statement: "Clear questions first. Clear quote after." Change the questions to the ones you really ask. |
| CS3 | Screen Reel or Story | BUILD | Weekly build | "Week [N] of a project: this is what the client saw." | <span dir="rtl">الأسبوع [N] من المشروع: هذا ما رآه العميل</span> | Screen recording of a weekly update: a working build, a short list of changes, what's next. Your own project, or a client's with permission. |
| CS4 | Carousel | TEACH | Your first version should do one thing well | "Your first version should do one thing well." | <span dir="rtl">يكفي نسختك الأولى أن تُتقن مهمة واحدة</span> | `hero (start) → cards → statement → cta`. Cards: pick the one key task · park the nice-to-haves · do some steps by hand · watch real use, then add. Statement: "Small first version. Real feedback. Then grow." |
| CS5 | Carousel | TEACH | Game, app, software or AI? | "Game, app, software or AI? Start with your problem." | <span dir="rtl">لعبة أم تطبيق أم برمجيات أم ذكاء اصطناعي؟ ابدأ بمشكلتك</span> | `hero (intro) → cards → services → cta`. Cards (type `→` in both languages; the Arabic slide mirrors it): to be played → a game · used daily on phones → an app · a tool for your team → software · text-heavy busywork → maybe AI. In the caption: "Already have something that needs work? That's an upgrade." Then the `services` slide with all 8 services. |
| CS6 | Screen Reel (talking head) · alt `MO3` | OFFER | Your idea in one sentence | "Tell us your idea in one sentence. That's enough." | <span dir="rtl">أخبرنا بفكرتك في جملة واحدة، وهذا يكفي</span> | Talking-head phone video. Three example sentences on screen: "An app that helps [who] do [what]." · "A tool so our team stops [boring task]." · "A game where players [action]." End: DM "START" (Arabic edit: «ابدأ»). |

### 2.9 Six motion ideas (the scene system)

Six ideas built with the same scene system as the launch heroes. Each one is a **new scene file**: an 8-second seamless loop that becomes slide 1 of a carousel pair (`../exports/posts/NN-<slug>/<lang>/01-hero.mp4`, with its frame 0 as `01-cover.png`) and, at no extra cost, a 9:16 Reel pair (`../exports/reels/NN-<slug>-<lang>.mp4` + `-cover.jpg`). Post the carousel pair in a Thursday slot, and its hero Reel pair in a Saturday slot at least a week later ([where Reels fit](02-content-strategy.md#where-reels-fit)). A Reel shows in your profile grid like any post; some app versions offer an option to keep a Reel off the grid, so use that only if your app has it.

Before you write one, check whether a launch scene already tells the story (the nine are described in the brand guide's [hero scenes table](../brand/brand-guide.md#104-the-nine-hero-scenes)). A new scene is a coding task in its own right, so plan it outside the weekly batch.

**How to build one** (the full steps and commands: the strategy's [Making a new animated post](02-content-strategy.md#making-a-new-animated-post) and the brand guide's [motion rules](../brand/brand-guide.md#10-motion))

1. **Start from the closest scene** (named in the table), copied to a new file in [`../design/scenes/`](../design/scenes/). Add a post to `posts` in [`../design/content.mjs`](../design/content.mjs) with `scene: '<the file name, without .mjs>'`, its `tag`, `headline` and `sub` as `t('English', 'العربية')`, and the slides suggested below.
2. **Keep the house style.** Frame 0 is the finished picture (it's the cover and the grid thumbnail). The timeline goes hold → clear (`.to()`) → rebuild the demo (`.fromTo()`) → hold, and ends exactly on frame 0 at 8 seconds. `silk` easing (`cubic-bezier(.22, 1, .36, 1)`), staggered entrances, and ambient loops (glows, floats, spins) that complete whole cycles. The headline never moves. Animate position, scale, rotation and opacity (plus line drawing), not sizes or margins; no flashing; Arabic text appears word by word or line by line, never letter by letter; and any randomness is seeded, never `Math.random()`, so every render is the same.
3. **Build from the UI kit** in [`../design/motion/ui.mjs`](../design/motion/ui.mjs): app windows, chat bubbles, chips, typing dots, a phone frame, Lucide icons, the gooey filter that echoes the logo, spark petals. Put every on-screen word in the scene's `copy.en` and `copy.ar`, and use logical properties (inline-start / inline-end) so the Arabic version mirrors. Code stays left to right.
4. **Check, then render:** `npm run motion -- <slug> --preview` (contact sheets in `../.preview/`), `--frame 4` for a full-size frame, `--loopcheck` (must say OK); then `npm run motion -- <slug>` (4 videos, about a minute each), `npm run render` and `npm run check`.

| ID | Service | Pillar | Working title | Hook (EN) | Hook (AR) | The 8-second loop, and the slides after it | Start from |
|---|---|---|---|---|---|---|---|
| MO1 | Upgrades | SHOW | Before / after, side by side | "Same screen. Before and after, side by side." | <span dir="rtl">الشاشة نفسها، قبل وبعد، جنباً إلى جنب</span> | **Frame 0:** the new screen, a divider handle resting at one edge, an "After" chip. **Loop:** hold → the handle glides across and uncovers the old screen ("Before"; reveal it with a moving clip, not by changing widths) → hold → it glides back while the new screen's parts settle in one after another (header, cards, button) → hold. Built from real screenshots (the owner's permission, or one of your older projects). **Slides:** `cards` "What changed" (up to 4 real changes) → `cta`. Fits a Tuesday SHOW slot as a Reel pair too. | [`upgrades.mjs`](../design/scenes/upgrades.mjs) (Before/After switch); [`intro.mjs`](../design/scenes/intro.mjs) shows how a scene loads image files |
| MO2 | Custom AI | TEACH | The assistant that says "I don't know" | "An AI assistant that admits when it doesn't know." | <span dir="rtl">مساعد ذكي يعترف حين لا يعرف الإجابة</span> | **Frame 0:** a chat with two finished answers: one with a source chip under it, one saying the answer isn't in your documents, with a "talk to a person" chip. **Loop:** hold → the bubbles clear → question 1 arrives, typing dots, the answer appears word by word, the source chip pops → question 2, typing dots, the honest answer and the handover chip → hold. Label it "Demo". **Slides:** `cards` "A good assistant…": shows its source · says "I don't know" · hands over to a person · uses your documents only → `cta`. | [`ai.mjs`](../design/scenes/ai.mjs) (chat window, word-by-word answer, chips) |
| MO3 | Apps · Custom | OFFER | From a one-line idea to a first screen | "From a one-line idea to a first screen." | <span dir="rtl">من فكرة في سطر واحد إلى أول شاشة</span> | **Frame 0:** a chat bubble with a one-line idea ("An app that helps [who] [do what]") beside a phone showing a finished first screen. **Loop:** hold → the screen's parts lift away, leaving a dashed wireframe → the wireframe lines draw themselves → each box fills in turn (header, cards, icons, button) → the button pulses once → hold. Label it "Concept" unless the screen is real. **Slides:** `cards` "Send us this first" (as in `07-start`) → `cta`. | [`start.mjs`](../design/scenes/start.mjs) (chat bubble), [`apps.mjs`](../design/scenes/apps.mjs) (phone), [`software.mjs`](../design/scenes/software.mjs) (pieces flying into place) |
| MO4 | Software | TEACH | Three tools, one flow (integrations, ربط) | "Three tools, one flow. No copy and paste." | <span dir="rtl">ثلاث أدوات في مسار عمل واحد، بلا نسخ ولصق</span> | **Frame 0:** three tool cards (shop, sheet, team chat) joined by drawn wires; the new order is in the sheet, the team message has a check, a "synced" toast. **Loop:** hold → the wires undraw and the row and message clear → a "new order" chip pops on the shop card and travels along the first wire → a highlighted row slides into the sheet → the chip travels on → a message pops in the team chat → toast → hold. Generic Lucide icons, not other companies' logos. **Slides:** `cards` with the tools you really connect → `statement` "If a ready-made connector does the job, we'll say so." → `cta`. | [`apps.mjs`](../design/scenes/apps.mjs) (wires between elements), [`software.mjs`](../design/scenes/software.mjs) (rows, the "synced" toast) |
| MO5 | Games | BUILD | Switch on the game feel | "Same jump. Now switch on the game feel." | <span dir="rtl">القفزة نفسها، مع لمسات تصنع متعة اللعب</span> | **Frame 0:** the hero mid-jump with every effect on, and a small panel of switches, all on: squash & stretch, dust, camera shake, sound. **Loop:** hold → the switches flip off one by one and the jump goes flat → they flip back on one at a time, each effect appearing as it switches on (a squash on landing, dust puffs, a tiny shake, a pulsing sound icon) → hold. The videos are silent, so sound is shown as an icon. **Slides:** `cards` "4 layers of game feel" → `cta`. The motion version of `GM1`. | [`games.mjs`](../design/scenes/games.mjs) (hero, platforms, petals) |
| MO6 | Support | OFFER | Demo-day checklist, ticked by you | "Demo day checklist: you tick it, we guide." | <span dir="rtl">قائمة يوم العرض: أنت تنجزها، ونحن نرشدك</span> | **Frame 0:** a checklist card with every item ticked (rules read, demo path planned, backup video recorded, pitch practised), the student's "You" tag by the last tick, a mentor comment bubble and a "ready" badge. **Loop:** hold → the ticks clear and the badge drops away → for each item the mentor's bubble asks a question, then the student's cursor ticks it → the badge pops with a small burst of spark petals → hold. The mentor only asks; the student does the work. **Slides:** `steps` as in `SP6` → `cta`. | [`support.mjs`](../design/scenes/support.mjs) (mentor bubble, "You" tag, badge, petals) |

### The bank at a glance

| Pillar | Service ideas (2.1–2.8) | Motion ideas (2.9) | Total | Share (rounded) | Target (strategy) |
|---|---|---|---|---|---|
| SHOW | 15 | 1 | 16 | 30% | ~35% |
| BUILD | 12 | 1 | 13 | 24% | ~25% |
| TEACH | 13 | 2 | 15 | 28% | ~25% |
| OFFER | 8 | 2 | 10 | 19% | ~15% |
| **Total** | **48** | **6** | **54** | | |

Formats: 28 Screen Reels (2 of them also work as stories; 7 also list an animated alternative) and 20 carousels, plus 6 motion ideas that each make a carousel hero and a hero Reel. Every one goes out as an English + Arabic pair.

---

## 3) Three Reel scripts

Each script is 40–42 seconds. Before you film, read the Reel tips and cover rules in the [format playbook](02-content-strategy.md#3-format-playbook).

**For all three:**

- **Two edits per script.** Film once, then make an English edit and an Arabic edit. The shots and timing stay the same; the on-screen text, subtitles, voiceover, end card and caption change. The Arabic lines are in the second table under each script. In the Arabic edit, swap the two sides of a split screen, so "before" sits on the right and "after" on the left and they read right to left (the footage itself is never mirrored). Record the Arabic voiceover in Modern Standard Arabic, or skip the voice and rely on on-screen text and subtitles.
- **Size:** 1080 × 1920, vertical. If your recording is landscape, place it in the middle of a vertical frame on a Midnight `#0B1628` background.
- **Text on screen:** Plus Jakarta Sans ExtraBold for English headlines, Alexandria for Arabic (the kit's Arabic typeface, made to sit with Plus Jakarta Sans), and JetBrains Mono for small labels (like "Demo · test data"), if your editing app has them. Arabic text is aligned right. Instagram covers roughly the top 270 px, the bottom 420 px and a column of buttons at the side, so keep text in the middle and away from both side edges.
- **Subtitles:** turn them on, or add them in your editor: English on the English edit, Arabic on the Arabic one. Many people watch without sound. If your editor's automatic captions get the Arabic wrong, type them yourself.
- **Your logo files:** use the trimmed PNGs in `../exports/logo/`. They are cut from your original files in `../brand/logo/source/` (the white versions come from `Crapto Studio-10.png`). Use them as they are: don't redraw, recolour or fade them.
- **Watermark (optional):** the white symbol [`../exports/logo/symbol-white.png`](../exports/logo/symbol-white.png), small (at least 32 px wide), near the top but below the first 270 px (where the hero Reels start their header), with some empty space around it ([clear space rules](../brand/brand-guide.md#53-clear-space)). Check in the preview that the app's buttons don't cover it.
- **End card (last 3–4 s):** your white logo [`../exports/logo/logo-white.png`](../exports/logo/logo-white.png) in the middle of a Cobalt `#376BB1` background, the blue post background (not the brand gradient: white text is too faint on its lighter blues), with the script's end line below it. Make one per language and reuse them. **Shortcut:** use a launch post's last slide in the middle of a 1080 × 1920 Midnight `#0B1628` canvas, for example [`../exports/posts/03-upgrades/en/03.png`](../exports/posts/03-upgrades/en/03.png) ("Got an idea? Let’s compile it.") and [`../exports/posts/03-upgrades/ar/03.png`](../exports/posts/03-upgrades/ar/03.png) (`لديك فكرة؟ لنبنِها معاً.‏`), made by `npm run render`. (The Support post's last slide has its own headline, "Stuck on a project? Let’s work it out.") The slide's small `03 / 03` page number sits inside a blue corner glow (top-right on the English slide, top-left on the Arabic one; about `#17324D` there, not Midnight), so a Midnight box over it would show as a patch: fill the box with the colour sampled right next to the number, or crop or blur that corner. The glow also reaches the slide's top edge, so soften any join line there.
- **Cover:** 1080 × 1920, and the profile grid shows its centred 3:4 crop. Pick a frame where the result and the headline are both visible, or make a cover in the hero style ([Reel covers](02-content-strategy.md#reel-covers)). **Kit shortcut** for a hero-style cover: add a post to [`../design/content.mjs`](../design/content.mjs) with the cover's `tag`, `headline` and `sub`, `slides: []` and a fitting launch scene, then run `npm run motion -- <slug> --frame 0`. It saves frame 0 (the finished composition) for both languages and both formats in `../.preview/`; `<slug>-en-reel-0s.png` and `<slug>-ar-reel-0s.png` are your covers, already laid out for the grid crop. Take the post out again if you won't publish its animation. Don't use a scene whose sample numbers could be read as this Reel's result. Suggested cover text is given for each Reel.

### Reel 1: Games (same jump, two versions)

| | |
|---|---|
| **Idea** | `GM1` · BUILD · Games (motion version: `MO5`) |
| **Goal** | Show you understand game feel. Reach people planning a game (founders, creators, brands). Unity developers may share it too. |
| **You need** | A Unity scene with a simple character and a jump. Six versions of it (plain, then the 5 layers added one at a time), or one version with a toggle for each layer. A screen recorder: Unity's Recorder package, OBS, or your computer's built-in recorder. |
| **Audio** | Your voice with the game sound underneath. Turn the game sound up for the "sound" step. |

| Time | Shot | On-screen text | Voiceover / subtitle |
|---|---|---|---|
| 0:00–0:03 | Split screen: plain jump on the left, finished jump on the right, both looping | **Same jump. Which one feels better?** | "Same jump. One feels flat, one feels alive." |
| 0:03–0:08 | Plain version, full screen: 2–3 jumps and landings | 1. No game feel | "Here's the plain version. It works. It just feels flat." |
| 0:08–0:13 | Add squash & stretch | + squash & stretch | "Step one: squash on landing, stretch in the air." |
| 0:13–0:18 | Add dust particles on jump and landing | + dust on landing | "Step two: a little dust when you land." |
| 0:18–0:23 | Add jump and landing sounds | + sound (turn it on) | "Step three: sound. Short, punchy, not too loud." |
| 0:23–0:28 | Add a small camera shake on hard landings | + a tiny camera shake | "Step four: a camera shake. A tiny one." |
| 0:28–0:33 | Add coyote time: the character runs off a ledge and can still jump for a moment | + coyote time | "Step five: coyote time. You can still jump just after the edge." |
| 0:33–0:38 | Split screen again: before and after | **Same jump. Very different feel.** | "None of this changes the level. It changes how the game feels." |
| 0:38–0:42 | End card | **Got a game idea? DM "START"** | "Building a game in Unity? DM us START." |

**Arabic edit** (same shots and timing)

<div dir="rtl" lang="ar">

| Time | On-screen text | Voiceover / subtitle |
|---|---|---|
| 0:00–0:03 | **القفزة نفسها. أيّهما أمتع؟** | القفزة نفسها: واحدة باهتة، والأخرى تنبض بالحياة. |
| 0:03–0:08 | النسخة الأساسية، بلا أي لمسات | هذه هي النسخة الأساسية. تعمل، لكنها باهتة. |
| 0:08–0:13 | + انضغاط وتمدّد | الخطوة الأولى: انضغاط عند الهبوط، وتمدّد في الهواء. |
| 0:13–0:18 | + غبار عند الهبوط | الخطوة الثانية: قليل من الغبار عند الهبوط. |
| 0:18–0:23 | + صوت (شغّل الصوت) | الخطوة الثالثة: الصوت. قصير وواضح، ودون صخب. |
| 0:23–0:28 | + اهتزاز خفيف للكاميرا | الخطوة الرابعة: اهتزاز للكاميرا، خفيف جداً. |
| 0:28–0:33 | + وقت السماح عند الحافة | الخطوة الخامسة: وقت السماح؛ يمكنك القفز بعد تجاوز الحافة بلحظة. |
| 0:33–0:38 | **القفزة نفسها. إحساس مختلف تماماً.** | لم يتغيّر شيء في المرحلة، لكن إحساس اللعب تغيّر كلياً. |
| 0:38–0:42 | **لديك فكرة لعبة؟ راسلنا «ابدأ»** | تعمل على لعبة بمحرّك Unity؟ راسلنا بكلمة «ابدأ». |

</div>

**Cover:** tag `01 / Games` · `01 / ألعاب`, headline "Same jump. Two *versions*." · <span dir="rtl">`القفزة نفسها، *بنسختين.*`</span>, dark theme (the `games` scene works for the kit shortcut).

**Caption (English)**

```
Same jump, two versions: game feel in Unity, step by step.

Squash & stretch, dust, sound, a tiny camera shake and coyote time.
None of them change the level. All of them change how it feels.

Which version would you play? Comment 1 or 2.
Building a game in Unity? DM "START" and tell us about it.

#craptostudio #unity3d #gamedev #indiedev #madewithunity
```

**Caption (Arabic)**

<div dir="rtl" lang="ar">

```
القفزة نفسها بنسختين: متعة اللعب في Unity، خطوة بخطوة.

انضغاط وتمدّد، وغبار، وصوت، واهتزاز خفيف للكاميرا، ووقت سماح عند الحافة.
لا شيء من ذلك يغيّر المرحلة، لكنه يغيّر إحساس اللعب كله.

أي النسختين تفضّل؟ اكتب 1 أو 2 في التعليقات.
تعمل على لعبة بمحرّك Unity؟ راسلنا بكلمة «ابدأ» وأخبرنا عنها.

#تطوير_الألعاب #ألعاب_فيديو #صناعة_الألعاب #unity3d #craptostudio
```

</div>

### Reel 2: Custom AI (answers from your documents)

| | |
|---|---|
| **Idea** | `AI2` · SHOW · Custom AI (motion version: `MO2`) |
| **Goal** | Show a useful, honest AI demo: it shows sources and admits when it doesn't know. |
| **You need** | A demo assistant that really works this way, built on **test documents only** (for example, a returns policy you wrote for a made-up shop). A screen recorder. Your phone for one talking-head shot (optional). |
| **Label** | Keep a small "Demo · test data" label on screen the whole time (Arabic edit: `نموذج تجريبي · بيانات اختبار`). |
| **Important** | Only post this if your assistant really shows its sources, says when it can't find the answer, and offers to pass the question to a person. If it doesn't do one of these, fix it first, or cut that part of the script. |
| **Arabic edit** | Film the Arabic questions only if your assistant really answers them (Arabic questions, and Arabic documents or translated answers). If it doesn't, keep the English recording and carry the Arabic in the on-screen text, subtitles and voiceover. |

| Time | Shot | On-screen text | Voiceover / subtitle |
|---|---|---|---|
| 0:00–0:03 | Screen recording: a question is typed and the answer appears, with a source link under it | **An AI assistant that answers from your documents** | "This AI assistant answers from your own documents." |
| 0:03–0:08 | Scroll through the sample document | Step 1: give it your documents | "First, it gets your documents. Here: a sample returns policy." |
| 0:08–0:15 | Type a normal question, for example "Can I return something after 30 days?" The answer appears | Step 2: ask in normal words | "Then anyone can ask in normal words…" |
| 0:15–0:21 | Zoom in on the source under the answer (for example "Returns policy, section 2") | It shows where the answer came from | "…and it shows where the answer came from, so your team can check it." |
| 0:21–0:29 | Type a question that isn't in the documents. It replies that it can't find it and offers to pass you to a person | **Not in the documents? It says so.** | "If the answer isn't in your documents, it doesn't guess. It says so, and hands over to a person." |
| 0:29–0:36 | Talking head (phone video), or text on Cobalt `#376BB1` | Need one? Only if your team answers the same questions every day. | "Need one? Only if your team answers the same questions every day. If not, an FAQ page may be enough." |
| 0:36–0:40 | End card | **AI that fits your business. DM "START"** | "Want to know if AI fits your business? DM us START." |

**Arabic edit** (same shots and timing; the Arabic sample question: «هل يمكنني إرجاع منتج بعد 30 يوماً؟‏»)

<div dir="rtl" lang="ar">

| Time | On-screen text | Voiceover / subtitle |
|---|---|---|
| 0:00–0:03 | **مساعد ذكي يجيب من مستنداتك** | هذا المساعد الذكي يجيب من مستنداتك أنت. |
| 0:03–0:08 | الخطوة 1: زوّده بمستنداتك | أولاً، نزوّده بمستنداتك، وهذه مثلاً سياسة إرجاع تجريبية. |
| 0:08–0:15 | الخطوة 2: اسأل بكلماتك المعتادة | بعدها يستطيع أي شخص أن يسأل بأسلوبه المعتاد… |
| 0:15–0:21 | يوضّح مصدر كل إجابة | …ويُظهر مصدر الإجابة، ليتحقّق منها فريقك. |
| 0:21–0:29 | **ليست في المستندات؟ سيخبرك بذلك.** | وإن لم تكن الإجابة في مستنداتك، فلن يخمّن، بل يخبرك بذلك ويحيل السؤال إلى أحد أفراد فريقك. |
| 0:29–0:36 | هل تحتاج إليه؟ فقط إن كان فريقك يجيب عن الأسئلة نفسها كل يوم. | هل تحتاج إليه؟ فقط إن كان فريقك يجيب عن الأسئلة نفسها كل يوم. وإلا فقد تكفيك صفحة أسئلة شائعة. |
| 0:36–0:40 | **ذكاء اصطناعي يفهم عملك. راسلنا «ابدأ»** | تريد أن تعرف إن كان الذكاء الاصطناعي يناسب عملك؟ راسلنا بكلمة «ابدأ». |

</div>

**Cover:** tag `03 / Custom AI` · `03 / ذكاء اصطناعي`, headline "AI that says *I don't know*." · <span dir="rtl">`مساعد ذكي يقول: *لا أعرف.*`</span>, blue theme. A frame from your own recording (the honest "not in the documents" answer) works best.

**Caption (English)**

```
Custom AI demo: it answers from your own documents.

It shows where each answer came from, so your team can check it.
When the answer isn't there, it says so and hands over to a person.
Demo built on test data only.

Does your team answer the same questions every day?
DM "START". If you don't need AI, we'll tell you.

#craptostudio #artificialintelligence #aiautomation #aiforbusiness #chatbot
```

**Caption (Arabic)**

<div dir="rtl" lang="ar">

```
مساعد ذكي يجيب من مستنداتك أنت: نموذج تجريبي لذكاء اصطناعي مخصّص.

يُظهر مصدر كل إجابة، ليتحقّق منها فريقك.
وإن لم يجد الإجابة في مستنداتك، فإنه يخبرك بذلك ويحيل السؤال إلى أحد أفراد فريقك.
بنيناه على بيانات اختبار فقط.

هل يجيب فريقك عن الأسئلة نفسها كل يوم؟
راسلنا بكلمة «ابدأ». وإن لم تكن بحاجة إلى الذكاء الاصطناعي، فسنخبرك بذلك.

#الذكاء_الاصطناعي #التحول_الرقمي #ريادة_الأعمال #تقنية #craptostudio
```

</div>

### Reel 3: Upgrades (before and after)

| | |
|---|---|
| **Idea** | `UP2` · SHOW · Upgrades |
| **Goal** | Prove you can improve an existing project, with real before/after numbers. |
| **You need** | Written permission from the owner, or one of your own older projects. Two recordings of the same flow: same device, same network, same steps. Real load times, measured the same way both times (a timer on the screen recording, or the profiler). Private data blurred. |
| **Rules** | Real numbers only. Don't speed up the "after" video. If the result is small, show it anyway, or pick another project. Don't mix in the Upgrades scene: its gauge shows sample numbers. |

| Time | Shot | On-screen text | Voiceover / subtitle |
|---|---|---|---|
| 0:00–0:03 | Split screen: old version still loading (left), new version already open (right) | **Before → after. Same app.** | "Same app. Before and after our upgrade." |
| 0:03–0:09 | Before: open the app, the loading spinner. Timer visible. Add a second problem only if it was real (for example a laggy scroll) | Before: [X] s to open | "This is the app before. [X] seconds to open[, and one more real problem, for example: the scroll stutters]." |
| 0:09–0:16 | Health-check cuts: profiler graph, list of large files, outdated packages | What we found: [problem 1] · [problem 2] · [problem 3] | "We ran a health check. Here's what we found: [problem 1], [problem 2] and [problem 3]." |
| 0:16–0:26 | Quick fix montage, one cut per real fix (for example a code change, or image sizes before and after) | Fix 1 · Fix 2 · Fix 3 (one per cut) | "So we fixed them one by one: [fix 1], [fix 2] and [fix 3]." |
| 0:26–0:33 | After: the same flow, same device. Timer visible | After: [Y] s to open | "After: [Y] seconds to open. Same phone, same steps[, and the second problem is gone, if it really is]." |
| 0:33–0:38 | Split screen again, both timers visible | **No rebuild. Same app, made better.** | "No rebuild from scratch. Same app, made better." |
| 0:38–0:42 | End card | **Already built? Let's make it better. DM "START"** | "Got an app or game that needs help? DM us START." |

**Arabic edit** (same shots and timing, with the split screen swapped: "before" on the right, "after" on the left)

<div dir="rtl" lang="ar">

| Time | On-screen text | Voiceover / subtitle |
|---|---|---|
| 0:00–0:03 | **قبل ← بعد. التطبيق نفسه.** | التطبيق نفسه، قبل الترقية وبعدها. |
| 0:03–0:09 | قبل: [X] ث حتى يفتح | هكذا كان التطبيق قبل الترقية: [X] ثانية حتى يفتح[، ومشكلة حقيقية أخرى، مثلاً: التمرير يتقطّع]. |
| 0:09–0:16 | ما وجدناه: [مشكلة 1] · [مشكلة 2] · [مشكلة 3] | أجرينا فحصاً شاملاً، ووجدنا: [مشكلة 1] و[مشكلة 2] و[مشكلة 3]. |
| 0:16–0:26 | إصلاح 1 · إصلاح 2 · إصلاح 3 (واحد في كل لقطة) | فأصلحناها واحدة تلو الأخرى: [إصلاح 1] و[إصلاح 2] و[إصلاح 3]. |
| 0:26–0:33 | بعد: [Y] ث حتى يفتح | بعد الترقية: [Y] ثانية. الهاتف نفسه، والخطوات نفسها[، واختفت المشكلة الثانية أيضاً، إن كان ذلك صحيحاً]. |
| 0:33–0:38 | **دون إعادة بناء. التطبيق نفسه، بأداء أفضل.** | لم نُعِد بناءه من الصفر: إنه التطبيق نفسه، وقد أصبح أفضل. |
| 0:38–0:42 | **مشروعك جاهز؟ لنجعله أفضل. راسلنا «ابدأ»** | لديك تطبيق أو لعبة تحتاج إلى تحسين؟ راسلنا بكلمة «ابدأ». |

</div>

In the Arabic voiceover and caption, match the word for "seconds" to the real number: 1 and 2 are written as words without a digit (ثانية واحدة, ثانيتان, or ثانيتين after من or إلى), 3–10 take ثوانٍ, 11 and up (and decimals such as 1.5) take ثانية. The on-screen abbreviation ث (as in the Upgrades scene) works for any number.

Typical problems to look for (use only what you really found): images much larger than needed, too many requests when the app opens, an old library, work done on the main thread.

**Cover:** tag `05 / Upgrades` · `05 / ترقية`, headline "Same app. *Faster.*" · <span dir="rtl">`التطبيق نفسه، *أسرع.*`</span>, light theme. (Change the accent word to match the real result, for example *Cleaner.* · <span dir="rtl">*أوضح.*</span>) Use a frame of your own split screen with both real timers, not the Upgrades scene.

**Caption (English)**

```
Same app, before and after our upgrade: [X] s → [Y] s.

That's the time to open it: same phone, same steps.
What we fixed: [fix 1], [fix 2], [fix 3].
No rebuild from scratch. Same app, made better.
[Shared with permission from the owner / One of our own older projects.]

Got an app or game that needs fixing, speeding up or new features?
DM "START" with a link and what's wrong.

#craptostudio #codereview #refactoring #bugfix #appdevelopment
```

**Caption (Arabic)**

<div dir="rtl" lang="ar">

```
التطبيق نفسه قبل الترقية وبعدها: من [X] إلى [Y] ثانية.

هذا هو زمن فتح التطبيق، على الهاتف نفسه وبالخطوات نفسها.
ما أصلحناه: [إصلاح 1]، [إصلاح 2]، [إصلاح 3].
دون إعادة بناء من الصفر: التطبيق نفسه، بأداء أفضل.
[نُشر بإذن من صاحب المشروع / أحد مشاريعنا السابقة]

لديك تطبيق أو لعبة تحتاج إلى إصلاح أو تسريع أو ميزات جديدة؟
راسلنا بكلمة «ابدأ» مع رابط ووصف لما لا يعمل كما يجب.

#برمجة #تطوير_البرمجيات #تطوير_التطبيقات #تقنية #craptostudio
```

</div>

---

## 4) 15 recurring story formats

Stories are for people who already follow you. Post on 4–5 days a week (see the [weekly rhythm](02-content-strategy.md#4-weekly-rhythm)). Share every new pair to your stories too (one story per pair is enough, as in the strategy's [stories](02-content-strategy.md#stories-daily-trust) table).

Make each story in both languages: two stories, or one card with English on top and Arabic below. For sticker stories (polls, quizzes, questions), one story per language is clearer. Sticker names and options can change in the app. If one is missing, use the closest one.

| # | Format | How | Example for Crapto Studio | Pillar | Good day | Save to highlight |
|---|---|---|---|---|---|---|
| 1 | **This or that** | Poll sticker, 2 options | "Dark mode or light mode?" · "First game: 2D or 3D?" | TEACH | Mon | — |
| 2 | **What should we post next?** | Poll sticker | "Next Reel: game demo or app demo?" Then post the winner. | BUILD | Mon | — |
| 3 | **Which one is faster?** | Quiz sticker over a short clip of two versions side by side, labelled A and B | "Which screen loads faster? A / B". Reveal the answer, with the real times, in the next story. | TEACH | Thu | Upgrades |
| 4 | **Myth or fact** | Quiz sticker | "AI is always right. Myth or fact?" Explain in the next story. | TEACH | Thu | AI |
| 5 | **WIP Wednesday** | 5–10 s video of today's work + one line of text | "WIP Wednesday: new menu for [project]. Thoughts?" | BUILD | Wed | Matching service |
| 6 | **Ask us anything** | Question sticker | "Ask us anything about games, apps, software or AI." Answer 3–5 questions the next day. Good questions become posts. | TEACH | Wed | Start |
| 7 | **Bug of the week** | Funny bug clip, then a "fixed" frame | The bug (5 s) → one line on the cause → the fix running | BUILD | Fri | Games or Upgrades |
| 8 | **Rate it** | Emoji slider | "Rate this new screen" over a screenshot | BUILD | Any | — |
| 9 | **Guess what we're building** | Zoomed-in crop, reveal in the next story | A close-up of a Unity scene or a UI detail. Next story: the full screen | BUILD | Any | Work |
| 10 | **Tool of the week** | Screenshot + one line | "Tool we use every day: [tool]. Why: [one reason]." | TEACH | Any | — |
| 11 | **Desk / setup** | Phone video | Test devices on the desk, the Unity editor open, today's task on a sticky note | BUILD | Any | Work |
| 12 | **Countdown** | Countdown sticker | A launch, an event you attend, or a competition deadline. Real dates only. | OFFER | When true | Matching service |
| 13 | **Finish the sentence** | Question sticker | "The app I wish existed is…" · "The task I'd automate first is…" | TEACH | Wed | — |
| 14 | **Shipped this week** | Text on a brand background (Midnight or Cobalt) | "Shipped this week: [thing 1] · [thing 2] · [thing 3]" | BUILD | Fri | Work |
| 15 | **DM "START" reminder** | Short text + link sticker | "Got an idea? DM START, or fill in the form." Arabic: <span dir="rtl">لديك فكرة؟ راسلنا بكلمة «ابدأ» أو املأ النموذج.</span> Link sticker: `[your project brief form link]` | OFFER | Fri | Start |

**Tips**

- Reply to question-sticker answers and story replies in DMs, in the language the person wrote in. A reply often starts a real conversation.
- Use question-sticker answers as ideas for TEACH posts. Never share someone's question without their permission if it shows their name or private details.
- Don't use the countdown, "open for projects" or "shipped" stories unless they are true right now.

---

## 5) Six carousel formulas

Reusable slide structures. Each one starts with the animated hero (slide 1) and then uses the slide types in [`../design/content.mjs`](../design/content.mjs): `cards`, `steps`, `statement`, `services`, `image` and `cta`. Every text is written as `t('English', 'العربية')`.

**Slide limits (checked against [`../design/templates.mjs`](../design/templates.mjs) and [`../design/motion/stage.mjs`](../design/motion/stage.mjs))**

| Slide | How to write it | Keep it to |
|---|---|---|
| Hero (slide 1) | Not a slide type: set on the post with `scene`, `theme` (`dark`, `blue` or `light`), `tag`, `headline` and `sub`. `npm run motion` renders it as `01-hero.mp4` (the 8-second loop); `npm run render` saves its frame 0 as `01-cover.png`. Reuse a launch scene, or write a new one ([2.9](#29-six-motion-ideas-the-scene-system)) | Headline: one idea, one accent. Up to 20 characters renders largest, then 30 and 40 step down (the `*asterisks*` and `\n` don't count). Wrap one word in `*asterisks*` for the accent; `\n` forces a line break. One short sub-line. Every post needs a scene. The safest theme for a reused scene is the one its launch post uses |
| `cards` | `{ type: 'cards', title: t(…), items: [{ icon: 'bug', text: t(…) }, …] }` | Up to 4 items (4 fill the 2 × 2 grid), a few words each: the launch cards are 11–31 characters. `icon` is a Lucide icon name; it must exist as `node_modules/lucide-static/icons/<name>.svg`, or the render stops with an error |
| `steps` | `{ type: 'steps', title: t(…), items: [{ title: t('Talk', 'نتحدّث'), text: t(…) }, …] }` | 4 steps, each a short title + one short sentence |
| `statement` | `{ type: 'statement', kicker: t('// myth 01', '// خرافة 01'), text: t(…) }` | One or two short sentences (the Formula 3 statements run up to about 95 characters and fit in both languages). Always set a `kicker`: the small mono line above. Without one, the slide shows the word "undefined" |
| `services` | `{ type: 'services', title: t('What we do', 'ماذا نقدّم') }` | Fixed: the 8 service cards |
| `image` | `{ type: 'image', src: 'photos/after.png', title: t('The *after*', '*بعد* الترقية'), caption: t(…), fit: 'contain' }` | One screenshot or photo (PNG, JPG or WebP), the same file in both languages. `src` is relative to the repo root. `title` and `caption` are optional. `fit: 'contain'` (default) shows the whole image; `'cover'` fills the frame and crops the edges |
| `cta` | `{ type: 'cta' }`, or with `headline: t(…)` and/or `body: t(…)` | Always the last slide. Default headline "Got an idea? Let’s compile it." (`لديك فكرة؟ لنبنِها معاً.‏`), the DM "START" / «ابدأ» line, a single Follow pill, and the footer "Save for later" (`احفظه لوقت لاحق`) with a bookmark icon. A post can override the headline, e.g. `{ type: 'cta', headline: t('Stuck on a project?\n*Let’s work it out.*', 'عالق في مشروع؟\n*لنجد الحل معاً.*') }` (as launch post `01-support` does) |

Only the hero uses the post's theme. All the other slides are always dark, in both languages; the Arabic slides are mirrored (right to left). Arrows typed as `→` turn into an icon that points left on the Arabic slides. A post with `slides: []` is a single video: the hero alone, without the "Swipe" hint.

TEACH and case-study carousels work best with 4–8 slides, one idea per slide, few words; OFFER carousels can be shorter (3–4 slides). Make slide 2 strong on its own (Instagram may show the carousel again starting from slide 2). Upload `01-hero.mp4` first, then `02.png`, `03.png` … in the same order for both languages.

### Formula 1: The checklist

**Best for:** saves. People keep checklists. **Examples:** `SP1`, `GM5`, `AP4`, `UP4`

| Slide | Type | Content |
|---|---|---|
| 1 | hero | The situation + number: "Competition coming up?\n*8 checks.*" · <span dir="rtl">`مسابقتك تقترب؟\n*8 نقاط* للتحقق.`</span> |
| 2 | `cards` | Items 1–4 ("Before the event") |
| 3 | `cards` | Items 5–8 ("On the day"). Optional. |
| 4 | `statement` | Kicker `// remember` (`// تذكّر`). The one thing to remember, in one sentence |
| 5 | `cta` | DM "START" / «ابدأ» (the footer already says "Save for later"; ask for saves and shares in the caption) |

**Ready to paste: slide 2 of `SP1`** (inside the post's `slides` in [`../design/content.mjs`](../design/content.mjs))

```js
{ type: 'cards', title: t('Before the event', 'قبل المسابقة'), items: [
  { icon: 'book-open', text: t('Read rules & judging', 'قراءة القواعد ومعايير التحكيم') },
  { icon: 'users', text: t('Agree who does what', 'توزيع المهام بوضوح') },
  { icon: 'laptop', text: t('Laptops & accounts ready', 'تجهيز الأجهزة والحسابات') },
  { icon: 'list-checks', text: t('Check what you may prepare', 'معرفة ما يُسمح بتحضيره مسبقاً') },
] },
```

### Formula 2: The process

**Best for:** showing how working with Crapto Studio feels. **Examples:** `AP6`, `SP6`, `AI6`, `SP2`

| Slide | Type | Content |
|---|---|---|
| 1 | hero | The result in plain words: "Your app idea, on people's *phones*." · <span dir="rtl">`فكرة تطبيقك، على *هواتف الناس.*`</span> |
| 2 | `steps` | 4 steps, each with one sentence |
| 3 | `cards` | "Send us this first" (what you need from them, up to 4) |
| 4 | `cta` | DM "START" / «ابدأ» |

### Formula 3: Myth vs. fact

**Best for:** straight-talking TEACH posts and shares. **Examples:** `AI1`, and later: app myths, game myths

| Slide | Type | Content |
|---|---|---|
| 1 | hero (`ai` scene) | "You might not *need* AI." · <span dir="rtl">`قد لا *تحتاج* إلى الذكاء الاصطناعي.`</span> |
| 2–5 | `statement` ×4 | Kicker `// myth 01` … `// myth 04` (`// خرافة 01` …). Text: the myth in quotes, then the honest answer |
| 6 | `statement` | Kicker `// our honest take` (`// رأينا بصراحة`). The summary line |
| 7 | `cta` | DM "START" / «ابدأ» |

**Ready to paste into `posts` in [`../design/content.mjs`](../design/content.mjs)** (change `order` to the next free number). It reuses the `ai` scene, so its hero is the store-assistant animation under this headline. `npm run render` writes the stills to `../exports/posts/10-ai-myths/en/` and `…/ar/` (`01-cover.png`, then `02.png` … `07.png`); `npm run motion -- ai-myths` adds `01-hero.mp4` to both folders and the Reels `../exports/reels/10-ai-myths-en.mp4` and `10-ai-myths-ar.mp4` (each with a `-cover.jpg`). These are hypothetical paths until you add the post. The post also joins the grid previews in `../exports/preview/`. Then run `npm run check`.

```js
{
  order: 10, slug: 'ai-myths', theme: 'blue', icon: 'sparkles', scene: 'ai',
  tag: t('03 / Custom AI', '03 / ذكاء اصطناعي'),
  headline: t('You might not *need* AI.', 'قد لا *تحتاج* إلى الذكاء الاصطناعي.'),
  sub: t('4 myths · Honest answers', '4 خرافات · إجابات صادقة'),
  slides: [
    { type: 'statement', kicker: t('// myth 01', '// خرافة 01'),
      text: t('“AI will fix messy data.” *Not really.* Clean the data first, or the AI repeats the mess.',
        '«الذكاء الاصطناعي سيُصلح فوضى بياناتك.» *ليس تماماً.* نظّم بياناتك أولاً، وإلا فسيكرّر الفوضى نفسها.') },
    { type: 'statement', kicker: t('// myth 02', '// خرافة 02'),
      text: t('“Every app needs a chatbot.” Often a good *search or FAQ* does the job.',
        '«كل تطبيق يحتاج إلى روبوت محادثة.» غالباً يكفي *بحث جيد* أو صفحة أسئلة شائعة.') },
    { type: 'statement', kicker: t('// myth 03', '// خرافة 03'),
      text: t('“AI is always right.” It can be wrong, so plan *who checks* the answers.',
        '«الذكاء الاصطناعي لا يخطئ.» بل قد يخطئ، لذا حدّد *من يراجع* إجاباته.') },
    { type: 'statement', kicker: t('// myth 04', '// خرافة 04'),
      text: t('“Use AI for everything.” If a *simple rule* works, use the rule.',
        '«استخدم الذكاء الاصطناعي في كل شيء.» إن كانت *قاعدة بسيطة* تكفي، فاعتمدها.') },
    { type: 'statement', kicker: t('// our honest take', '// رأينا بصراحة'),
      text: t('If you don’t need AI, *we’ll tell you.*', 'لا تحتاج إلى الذكاء الاصطناعي؟ *سنخبرك بذلك.*') },
    { type: 'cta' },
  ],
},
```

### Formula 4: It depends on…

**Best for:** the questions everyone asks (price, time) without giving fake numbers. **Examples:** `AP1`, and later: "How long does it take to build a game?"

| Slide | Type | Content |
|---|---|---|
| 1 | hero | The question: "How much does an *app* cost?" · <span dir="rtl">`كم تكلفة *التطبيق؟*`</span> |
| 2 | `statement` | Kicker `// honest answer` (`// بصراحة`). "It depends. Here's what it depends on." |
| 3 | `cards` | What it depends on (up to 4) |
| 4 | `cards` | 4 more factors, or "How to keep it smaller" (start with one platform · cut nice-to-haves · reuse existing tools) |
| 5 | `statement` | Kicker `// next step` (`// الخطوة التالية`). "Send us the idea, and we'll give you a real quote." |
| 6 | `cta` | DM "START" / «ابدأ» |

Never put a price or a time on these slides unless it's your real, current number.

### Formula 5: Before → after

**Best for:** proof (SHOW) for Upgrades and case studies. **Examples:** a carousel version of `UP1`, `UP2` or `SW1`, and case studies (S8 in the strategy)

| Slide | Type | Content |
|---|---|---|
| 1 | hero | "Same app. *Faster.*" · <span dir="rtl">`التطبيق نفسه، *أسرع.*`</span> (only if true). Scene: your own before/after scene (`MO1`), or the `upgrades` scene with real numbers kept to slide 6 |
| 2 | `statement` | Kicker `// before` (`// قبل`). The problem in one sentence |
| 3 | `image` | A real "before" screenshot (optional) |
| 4 | `cards` | What we changed (up to 4, a few words each) |
| 5 | `image` | The "after" screenshot (optional) |
| 6 | `statement` | Kicker `// after` (`// بعد`). The real result, with real numbers |
| 7 | `statement` | Kicker `// client` (`// رأي العميل`). `[add a real client quote]`. Only with permission; otherwise skip this slide |
| 8 | `cta` | DM "START" / «ابدأ» |

Slides 3 and 5 are `image` slides (see the slide limits above), for example `{ type: 'image', src: 'photos/before.png', title: t('The *before*', '*قبل* الترقية') }`. They render inside the normal dark slide frame, so the page numbers (for example `02 / 08`, with the hero as slide 1) stay correct. The same screenshot is used in both languages; only the title and caption change. No screenshots? Skip slides 3 and 5 and show the screens in a Reel (`UP1`, `UP2`) or a scene (`MO1`). Adding screenshots in the Instagram app (exported at 1080 × 1350) is only a fallback: the page numbers count the rendered slides only, so they will be wrong. The `upgrades` scene's gauge shows sample numbers, so the real result goes on slide 6 and in the caption, never "as shown in the animation".

### Formula 6: This or that

**Best for:** helping people choose. Shows you'll recommend the simpler option. **Examples:** `SW5`, `CS5`, `AP4`

| Slide | Type | Content |
|---|---|---|
| 1 | hero | "App or *website*?" · <span dir="rtl">`تطبيق أم *موقع ويب؟*`</span> |
| 2 | `cards` | "Choose A when…" (up to 4) |
| 3 | `cards` | "Choose B when…" (up to 4) |
| 4 | `statement` | Kicker `// our honest take` (`// رأينا بصراحة`). "If the simpler one works, we'll say so." |
| 5 | `services` (optional) | All 8 services, for "not sure? Start here" posts like `CS5` |
| 6 | `cta` | DM "START" / «ابدأ» |

---

## 6) Ten caption hook formulas

The hook is the first line of the caption, the part people see before "… more". Some tips:

- **Put a keyword in it:** Unity game, iOS app, software, custom AI (in Arabic: <span dir="rtl">لعبة، تطبيق، برمجيات، ذكاء اصطناعي</span>; more in the strategy's [Arabic keywords](02-content-strategy.md#keywords-in-captions-and-on-screen-text)). It makes the topic clear, and Instagram search uses the words in your caption.
- **Keep it short.** All examples below, English and Arabic, are under 60 characters (counted), so they stay readable.
- **Be specific.** A number, a real object, a real situation.
- **Deliver it.** The post must give what the hook promises.

**Arabic hooks**

- **Write it, don't translate it.** Same promise, natural Modern Standard Arabic. The Arabic column below follows the same formulas with Arabic word order.
- **Start with an Arabic word.** Not with a number, a Latin word (Unity, iOS) or a hashtag: the line may then be laid out left to right.
- **Use the kit's words** (ترقية for upgrades, إرشاد for mentoring, ربط for integrations) and Arabic punctuation: ، ؟ « ». The DM keyword is «ابدأ».

| # | Formula | Example (EN) | Chars | Example (AR) | Chars | Use with |
|---|---|---|---|---|---|---|
| 1 | The honest question: "Do you actually need [thing]?" | Do you actually need an app? Ask these 4 questions. | 51 | <span dir="rtl">هل تحتاج فعلاً إلى تطبيق؟ اطرح هذه الأسئلة الأربعة</span> | 50 | `AP4`, `AI1` |
| 2 | It depends: "How much does [thing] cost? It depends on…" | How much does an app cost? It depends on 8 things. | 50 | <span dir="rtl">كم تكلفة التطبيق؟ الجواب يعتمد على 8 أمور</span> | 41 | `AP1` |
| 3 | Before / after: "Same [thing]. Before and after [change]." | Same app. Before and after our upgrade. | 39 | <span dir="rtl">التطبيق نفسه، قبل الترقية وبعدها</span> | 32 | `UP1`, `UP2`, `MO1` |
| 4 | Old way → new way: "This used to be [old]. Now it's [new]." | This used to be a spreadsheet. Now it's a real system. | 54 | <span dir="rtl">كان جدول بيانات، وأصبح نظاماً متكاملاً</span> | 38 | `SW1`, `IX4` |
| 5 | The myth: "[Common belief]? Not always." | Every app needs a chatbot? Not always. | 38 | <span dir="rtl">كل تطبيق يحتاج إلى روبوت محادثة؟ ليس دائماً</span> | 43 | `AI1` |
| 6 | The moment: "[Event] coming up? Check these [N] things first." | Competition coming up? Check these 8 things first. | 50 | <span dir="rtl">مسابقتك تقترب؟ تحقّق من هذه النقاط الثماني أولاً</span> | 48 | `SP1`, `IX6` |
| 7 | The stress test: "We tried to break our own [thing]." | We tried to break our own AI assistant. | 39 | <span dir="rtl">حاولنا إيقاع مساعدنا الذكي في الخطأ، عمداً</span> | 42 | `AI4` |
| 8 | Plain English: "[Jargon]: in plain English." | MVP, API, backend: tech words in plain English. | 47 | <span dir="rtl">مصطلحات تقنية بلغة بسيطة: MVP و API والواجهة الخلفية</span> | 52 | `SW3` |
| 9 | Behind the quote: "The [N] questions we ask before we [do X]." | The 4 questions we ask before we quote any project. | 51 | <span dir="rtl">الأسئلة الأربعة التي نطرحها قبل تسعير أي مشروع</span> | 46 | `CS2` |
| 10 | Save this: "[Who / doing what]? Save this [thing]." | Planning a Unity game? Save this prototype checklist. | 53 | <span dir="rtl">تخطّط للعبة بمحرّك Unity؟ احفظ قائمة التحقق هذه</span> | 47 | `GM5`, `SP1` |

**Bad vs. better**

| Avoid | Write instead (EN) | Write instead (AR) |
|---|---|---|
| "This changes everything" · <span dir="rtl">هذا سيغيّر كل شيء</span> | "Same jump, two versions: game feel in Unity." | <span dir="rtl">القفزة نفسها بنسختين: متعة اللعب في Unity</span> |
| "The secret AI tool nobody talks about" · <span dir="rtl">أداة الذكاء الاصطناعي السرّية التي لا يعرفها أحد</span> | "An AI assistant that says when it doesn't know." | <span dir="rtl">مساعد ذكي يعترف حين لا يعرف الإجابة</span> |
| "We're the best app developers" · <span dir="rtl">نحن أفضل مطوّري التطبيقات</span> | "5 small details that make an app feel finished." | <span dir="rtl">تفاصيل صغيرة تجعل التطبيق يبدو مكتملاً، إليك 5 منها</span> |
| "You won't believe this bug" · <span dir="rtl">لن تصدّق هذا الخلل</span> | "Bug of the week: [what really happened]." | <span dir="rtl">خلل الأسبوع: [ما حدث فعلاً]</span> |

After the hook: 2–4 short lines, one action (DM "START" / «ابدأ», save, or share), and up to 5 hashtags from the set for that language ([hashtag sets](02-content-strategy.md#hashtags-max-5-per-post)).
