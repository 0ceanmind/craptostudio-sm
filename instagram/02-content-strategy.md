# Instagram content strategy: Crapto Studio

<!-- Editors: some Arabic quotes inside English sentences end with an invisible right-to-left mark (U+200F), so their punctuation and « » display on the correct side. Keep them when you edit those lines. -->

This is the plan for what to post after launch, how often, in which language, and how to turn views into real projects.
It is built for a small team. Steady posting every week matters more than doing a lot at once.

> **Handle:** this guide assumes **@craptostudio**. If your handle is different, swap it everywhere you see it.

**Related files**

| File | What it covers |
|---|---|
| [`01-profile-setup.md`](01-profile-setup.md) | Profile, bilingual bio, links, highlights, saved replies in both languages, pinned posts |
| [`03-launch-posts.md`](03-launch-posts.md) | The 18 launch posts (9 pairs: English + Arabic), captions, hashtags, alt text, posting order, the launch Reels |
| [`04-idea-bank.md`](04-idea-bank.md) | Post and Reel ideas (IDs like `GM1`), Reel scripts, story formats, hook formulas |
| [`../brand/brand-guide.md`](../brand/brand-guide.md) | Voice in English and Arabic, colours, fonts, logo rules, motion rules, how not to look like a crypto account |
| [`../studio/README.md`](../studio/README.md) | The workspace (`npm run studio`): edit any post in both languages with a live preview, make new posts, turn a Claude Code project into a carousel, render images and videos |
| [`../content/posts/`](../content/posts/) | One file per post (`<slug>.json`): all its text in English and Arabic, slides, captions and alt text. Edit it in the workspace (or by hand), then render |
| [`../design/content.mjs`](../design/content.mjs) | Shared text: the services, the profile and bio, the highlights, the default call to action |
| [`../design/scenes/`](../design/scenes/) | The animated heroes: 9 service demos and 4 project showcases. Posts can share a scene and change the text inside it |
| [`../exports/reels/`](../exports/reels/) | Every hero as a 9:16 Reel, in English and Arabic, each with a cover image |

**Quick summary**

- **Goal:** more profile visits, then more DMs and form enquiries. Followers are a side effect, not the goal.
- **Two languages, one brand:** every post goes out twice, once in English and once in Arabic (Modern Standard Arabic, right to left). English first, Arabic right after. The name always stays **Crapto Studio**, in Latin letters.
- **Motion first:** every carousel opens with an 8-second animated hero that loops seamlessly. The slides after it are short and visual.
- **Mix:** SHOW 35% · BUILD 25% · TEACH 25% · OFFER 15%.
- **Rhythm:** 2 new pairs a week (a Reel pair and a carousel pair), plus 1 ready-made hero Reel pair. Stories 4–5 days a week, 15–20 minutes of engagement a day.
- **One action everywhere:** DM "START" (English) or «ابدأ» (Arabic), or tap the link in bio.

---

## Contents

0. [Bilingual publishing](#0-bilingual-publishing)
1. [Goals for the first 90 days](#1-goals-for-the-first-90-days)
2. [Content pillars and starter ideas](#2-content-pillars-and-starter-ideas)
3. [Format playbook](#3-format-playbook): motion-first rules, Reels, carousels, making a new animated post, stories
4. [Weekly rhythm](#4-weekly-rhythm)
5. [Discoverability](#5-discoverability): keywords and hashtags in English and Arabic
6. [Daily engagement routine](#6-daily-engagement-routine)
7. [Turning followers into clients](#7-turning-followers-into-clients)
8. [Measuring what works](#8-measuring-what-works)
9. [The first 30 days](#9-the-first-30-days)

---

## 0) Bilingual publishing

Crapto Studio talks to two audiences: people who read and search in English, and people who read and search in Arabic. One brand, two languages, so **every piece of content goes out as two posts**: one in English and one in Arabic (Modern Standard Arabic, right to left). Every other section of this guide assumes it. The Arabic voice, terminology and mixed-script rules are in [section 9 of the brand guide](../brand/brand-guide.md#9-bilingual-identity-english-and-arabic).

### Why two posts, not one bilingual post

- **Each reader gets a whole post in their own language.** One reading direction, one caption, nothing half understood.
- **Search works per language.** Instagram search uses the words in your caption, so an Arabic caption can be found by Arabic searches and an English caption by English ones.
- **Each language gets its own numbers.** Every post has its own Insights, so each pair shows how the same idea did in English and in Arabic.
- **The designs are built for it.** Every post renders in both languages from its file in [`../content/posts/`](../content/posts/): English in Plus Jakarta Sans, Arabic in Alexandria, with the layout mirrored for right to left.

### How a pair works

| Rule | Detail |
|---|---|
| One idea, two posts | Same idea, same animation, same slides in the same order. Only the language changes. Files: `../exports/posts/NN-slug/en/` and `…/ar/`; Reels: `../exports/reels/NN-slug-en.mp4` and `…-ar.mp4` |
| English first, Arabic right after | Publish the English post, then the Arabic one a few minutes later, with nothing in between. Instagram shows the newest post first, so on the grid the Arabic post sits just before (left of) its English twin. A pair at the end of a row wraps to the start of the next one. That's normal |
| Every feed post is a pair | Reels, carousels and single posts all go out in both languages. Short on time? Post fewer pairs, never half a pair |
| Same slide order | Don't reverse the slides for Arabic: `01-hero.mp4`, then `02.png`, `03.png` … in both languages. The page numbers count the same way |
| The name stays Latin | Always "Crapto Studio" in Latin letters, in Arabic text too. Tech names stay Latin as well: Unity, iOS, Android, API |
| Two keywords, one flow | The call to action is DM "START" in English and «ابدأ» in Arabic. Both lead to the same saved-reply flow, in the person's language ([`01-profile-setup.md` section 9](01-profile-setup.md#9-dm-setup)) |
| Digits | Use the same Western digits as the designs (0–9) in Arabic captions too, as in «‏4 خطوات» or «‏07 / إرشاد». Don't mix in Eastern Arabic digits (٠١٢٣) |

### Adapt, don't translate

Write the Arabic post the way an Arabic copywriter would write it from scratch: same idea, same promise, natural Arabic. A word-for-word translation of an English hook usually sounds flat.

- **Use the terms from the posts.** The Arabic in the launch posts ([`../content/posts/`](../content/posts/)) sets the vocabulary (table below). Use the same words in captions, hooks and replies.
- **Modern Standard Arabic**, friendly and plain. Short sentences, no heavy formal phrases.
- **Arabic punctuation:** ، ؛ ؟ and «» for quotes, as in: راسلنا بكلمة «ابدأ»‏.
- **Topic first.** The first words of an Arabic hook name the topic (لعبة، تطبيق، نظام، ذكاء اصطناعي), just like in English.
- **Mentoring stays mentoring.** In both languages the student or team does the work: «أنت تبرمج، ونحن نرشدك.‏» Never use words that suggest doing someone's assignment or project for them (for example «حل واجبات» or «مشاريع تخرج جاهزة»).
- **Start every Arabic line with an Arabic word** (or an Arabic hashtag), not with a Latin word, the @handle, an emoji or a number. A line that starts with "Unity" or "Crapto Studio" is laid out left to right, and its punctuation can jump to the wrong end. Put the Arabic words first and the Latin name after them (the [Arabic caption example](#keywords-in-captions-and-on-screen-text) starts with نموذج أولي, not with Unity), and check the caption preview on a phone before you share ([mixed-script tips](../brand/brand-guide.md#94-mixed-script-latin-digits-punctuation-and-direction)).
- **Same honesty labels:** "Demo" = «نموذج تجريبي», "Concept" = «تصوّر مبدئي», "Internal project" = «مشروع داخلي», "Client project (shared with permission)" = «مشروع لعميل (يُنشر بإذنه)».

**Shared terms** (from the posts; the full list is in the brand guide's [terminology table](../brand/brand-guide.md#93-terminology-english--arabic)):

| English | Arabic |
|---|---|
| Games | ألعاب |
| Apps | تطبيقات |
| Software | برمجيات |
| Custom AI | ذكاء اصطناعي |
| Interactive content | محتوى تفاعلي |
| Upgrades | ترقية |
| Support (mentoring) | إرشاد |
| Custom solutions | حلول مخصّصة |
| Integrations (connecting tools) | ربط |
| DM keyword "START" | «ابدأ» |

**Example hooks** (counted without the quote marks; all under 60 characters, so they work as on-screen text). Use a hook only if the video really shows it:

| English | Characters | Arabic (adapted, not translated) | Characters |
|---|---|---|---|
| "This used to be a spreadsheet. Now it's a real system." | 54 | «كان جدول بيانات، وأصبح اليوم نظاماً متكاملاً.» | 45 |
| "Do you actually need AI? 3 honest signs." | 40 | «هل يحتاج عملك فعلاً إلى الذكاء الاصطناعي؟ إليك 3 علامات.» | 56 |
| "Same jump. Before and after game feel." | 38 | «القفزة نفسها، لكن الإحساس مختلف تماماً.» | 39 |
| "Your app feels slow? Check these 5 things first." | 48 | «تطبيقك بطيء؟ افحص هذه النقاط الخمس أولاً.» | 41 |
| "We built this login screen today. Here's how." | 45 | «شاشة تسجيل دخول بنيناها اليوم، خطوة بخطوة.» | 42 |

More hooks: the [hook formulas](04-idea-bank.md#6-ten-caption-hook-formulas) in the idea bank.

### Reply in the commenter's language

- Reply in the language the person wrote in, whichever post they commented on. An English comment on the Arabic post gets an English reply.
- DMs too: "START" gets the English saved reply, «ابدأ» gets the Arabic one.
- A message that mixes both? Answer in the language most of it is written in.
- Same tone in both languages: warm, plain, no jargon. Don't promise prices or response times in either language.

### Insights per language

Every post has its own Insights, so each pair gives you an English and an Arabic result for the same idea. Account-level numbers (reach, profile visits, followers) mix both audiences. Note the language of every DM and enquiry yourself (the [lead tracker](#simple-lead-tracker) has a column for it) and compare the two languages in the [monthly review](#monthly-review-template).

Followers who read both languages will see both posts of a pair. That's expected: keep the pair close together, so it reads as one piece.

---

## 1) Goals for the first 90 days

Instagram is a way to get **conversations about real projects**. Every goal follows that path:

```
People reached  →  Profile visits  →  DMs + link taps  →  Real enquiries  →  Calls / quotes  →  Projects
```

### Three phases

| Days | Phase | Focus |
|---|---|---|
| 1–30 | Launch and habit | Publish the 18 launch posts, start the weekly rhythm in both languages, record your starting numbers per language |
| 31–60 | Find what works | Try different hooks and topics, see which pillar, service and language gets the most shares, saves and DMs |
| 61–90 | Do more of what works | Post more of the best topics, publish real project posts, make the START / «ابدأ» path easy to follow |

### Goals and example targets

> ⚠️ **The numbers below are starting assumptions, not promises or industry facts.** You have no history yet, so nobody knows the right numbers. Use month 1 as your baseline, then adjust the targets at the first monthly review ([section 8](#8-measuring-what-works)).

| # | Goal | What to measure | Example target by day 90 (starting assumption) |
|---|---|---|---|
| 1 | Post consistently | Pairs published, days with stories | 2 new pairs a week (English + Arabic) in at least 10 of 12 weeks; stories on 4+ days a week |
| 2 | Reach new people | Accounts reached, % of reach from non-followers, English vs Arabic posts | Month 3 reach about 2× month 1 |
| 3 | Get people to the profile | Profile visits | Month 3 profile visits about 2× month 1 |
| 4 | Start conversations | DMs started ("START" and «ابدأ») + link taps | At least 1 new project conversation a week by month 3 |
| 5 | Get real enquiries | Enquiries with a real project and a deadline | 3–5 in the first 90 days |
| 6 | Build proof | Posts that show real work | At least 3 (client work shared with permission, or your own demos labelled "Demo" / «نموذج تجريبي»); Reviews highlight started once a client agrees |
| 7 | Win work | Projects that started from Instagram | 1 is a good result; treat it as a bonus in the first 90 days |

**What we do not set:** a follower target, or a target per language. Let the numbers show where each audience is. Never buy followers, likes or views, and don't use follow/unfollow tricks. Fake numbers break your Insights and you can't learn from them.

---

## 2) Content pillars and starter ideas

Every post belongs to one of four pillars. The pillars keep the feed balanced: proof, process, value and a clear offer. Each idea becomes one pair (an English post and an Arabic post); the counts below are pairs. The ready-made hero Reels ([section 4](#where-reels-fit)) repeat posts you already made, so they don't count toward the mix.

| Pillar | Share | Purpose | Main formats | Per month (8 new pairs) |
|---|---|---|---|---|
| **SHOW** (proof) | ~35% | Prove you build real things that work | Reels (demos, gameplay), case-study carousels, before/after | 3 |
| **BUILD** (behind the scenes) | ~25% | Show how you work, build trust, show the people behind Crapto Studio | Reels, stories | 2 |
| **TEACH** (value) | ~25% | Give useful, honest advice people save and share | Carousels, short talking Reels | 2 |
| **OFFER** (conversion) | ~15% | Tell people exactly how to start | Carousels, stories | 1 |

Below is a short list of ideas per pillar (codes S1, B1, T1, O1…). Every idea is linked to one or more of the 8 services. The full list, with hooks and Reel scripts, is in the [idea bank](04-idea-bank.md). The **Idea bank** column shows the matching IDs there (for example `GM1`). The [30-day calendar](#9-the-first-30-days) uses those IDs. Write the English hook first, then adapt the Arabic one ([section 0](#adapt-dont-translate)).

> **No client work to show yet?** Use your own demos, prototypes and past personal projects. Label them honestly in both languages: "Demo" / «نموذج تجريبي», "Concept" / «تصوّر مبدئي», "Internal project" / «مشروع داخلي». Never present a demo as client work. If you don't have the footage an idea needs, pick another idea from the same pillar.

### SHOW (proof) — ~35%

**Purpose:** "Can they actually build this?" Answer with real screens, real gameplay and real results.

| Code | Idea | Service | Format | Idea bank |
|---|---|---|---|---|
| S1 | **What we build in 15 seconds**: quick cuts of a Unity scene, an app on a phone, a dashboard and an AI chat. On-screen text: "Games · Apps · Software · AI" / «ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي». Only show what you really have footage of | All | Reel | — |
| S2 | **Gameplay clip**: 10–20 seconds of a real Unity game or prototype, best moment first | Games | Reel | `GM2`, `GM3` |
| S3 | **App walkthrough**: one flow on a real phone (sign up → main feature) | Apps | Reel | `AP2`, `AP5` |
| S4 | **AI assistant demo**: type a real question, show the answer (test data only). The Arabic version asks in Arabic, if the demo really handles it | Custom AI | Reel | `AI2`, `AI3`, `AI5` |
| S5 | **Before / after upgrade**: old screen vs new screen, or speed before vs after (real numbers only) | Upgrades | Reel or carousel | `UP1`, `UP2` |
| S6 | **Spreadsheet → system**: the old way of working vs the new tool | Software, Custom solutions | Reel | `SW1`, `SW2`, `CS1` |
| S7 | **Interactive demo in use**: someone tapping through an interactive presentation, quiz or kiosk | Interactive | Reel | `IX1`, `IX2` |
| S8 | **Case study**: problem → what we built → result → a real client quote (with permission). Claude Code can draft it from the finished project ([how](#case-study-posts)) | Any | Carousel | [Formula 5](04-idea-bank.md#formula-5-before--after) |
| S9 | **Team spotlight**: a student or competition team you mentored (with their permission). The work is theirs; show how you guided them | Support | Carousel or Reel | `SP4` |

### BUILD (behind the scenes) — ~25%

**Purpose:** show the process, so clients trust the weekly progress and the people behind it.

| Code | Idea | Service | Format | Idea bank |
|---|---|---|---|---|
| B1 | **Today we built…**: one small feature from start to finish in 10–20 seconds (a jump mechanic, a login screen) | Games, Apps | Reel | — |
| B2 | **Bug of the week**: the bug, why it happened, the fix | Games, Upgrades, Software | Reel or carousel | `GM4` |
| B3 | **Our setup**: tools, test devices, the Unity editor, what a work day looks like | All | Reel | — |
| B4 | **Sketch to screen**: a paper sketch or wireframe → the finished UI | Apps, Interactive | Reel | `AP3`, `IX4` |
| B5 | **Weekly build**: what a client sees each week (your own project, or a client's with permission) | Custom solutions, all | Reel or stories | `CS3` |
| B6 | **Game feel: before / after polish**: the same mechanic without and with effects, sound and camera shake | Games | Reel | `GM1` (full script), `IX5` |
| B7 | **How we scope a project**: the questions we ask on the first call | Custom solutions | Carousel | `CS2` |
| B8 | **Code review, sped up**: what you looked at and why, with on-screen notes | Support | Reel | `SP3` |

### TEACH (value) — ~25%

**Purpose:** be useful. Straight-talking advice gets saved and shared, and it shows how you think.

| Code | Idea | Service | Format | Idea bank |
|---|---|---|---|---|
| T1 | **Do you actually need an app?** When a website or a simple tool is enough | Apps, Software | Carousel or talking Reel | `AP4` |
| T2 | **Do you actually need AI?** When it helps, and when a simple rule is enough | Custom AI | Carousel | `AI1` (slide text ready to adapt) |
| T3 | **Your app feels slow? 5 things to check first** | Upgrades | Carousel | Close: `UP4` |
| T4 | **Hackathon prep checklist** | Support | Carousel | `SP1`, `SP2` |
| T5 | **Unity tip in 30 seconds** | Games | Reel | — |
| T6 | **Tech words in plain language**: MVP, API, backend, prototype. In Arabic, explain the term and keep the English word next to it, the way people meet it at work | Software, all | Carousel | `SW3` |
| T7 | **When interactive beats slides**: events, lessons, pitches | Interactive | Carousel | `IX3` |
| T8 | **What a game prototype should prove** before you build the full game | Games | Carousel | `GM5` |

### OFFER (conversion) — ~15%

**Purpose:** make the next step obvious. Keep it short and friendly, never pushy.

| Code | Idea | Service | Format | Idea bank |
|---|---|---|---|---|
| O1 | **What happens after you DM the keyword**: a screen recording from a test account (send "START" → get the reply → open the form), and the same with «ابدأ» for the Arabic version. Don't just repeat launch post `07-start` | All | Reel or carousel | — |
| O2 | **Service spotlight**: one service, who it's for, what you get, DM "START" / «ابدأ». Rotate through the 8 services | Each | Carousel or Reel | `GM6`, `AP6`, `SW6`, `AI6`, `IX6`, `CS6` |
| O3 | **Got a project that needs help?** Send a link and what's wrong; we reply with what we'd look at first | Upgrades | Reel or carousel | `UP6` |
| O4 | **Competition season**: mentoring for teams before [competition name / date]. The work stays the team's | Support | Carousel + stories | `SP6` |
| O5 | **Honest FAQ**: price, timeline, who owns the code (use the saved replies from [`01-profile-setup.md`](01-profile-setup.md#9-dm-setup), in each language). No price numbers unless they are your real, current prices | All | Carousel | Close: `AP1` |
| O6 | **Open for new projects in [month]**: only when it's true | All | Single post or story | — |

Stories carry most of the OFFER work (a short DM "START" / «ابدأ» reminder once a week). This keeps the feed at about 15% offer.

> **Support posts = mentoring.** Always frame Support (إرشاد) as guidance: reviewing code, helping debug, explaining the "why", practising the pitch. The work stays the student's or team's and follows their school or competition rules. Never offer to do someone's assignment or competition entry, in either language.

---

## 3) Format playbook

| Format | Main job | How often |
|---|---|---|
| Reels (real footage) | Reach new people (non-followers) | 1 pair a week |
| Hero Reels (ready-made 9:16 versions of the animated posts) | Extra reach for almost no extra work | 1 pair a week |
| Carousels (animated hero + short slides) | Saves and shares; explain things | 1 pair a week |
| Stories | Daily trust with people who already follow | 4–5 days a week |
| Single posts | Announcements only | Only when needed |

### Motion first: rules for every post

The launch posts set the style: each one opens with an animated hero, then a few short, visual slides. Every new post follows the same rules, whether its first slide is an animated hero from the code or a real screen recording. The full motion rules are in [section 10 of the brand guide](../brand/brand-guide.md#10-motion).

| Rule | What it means |
|---|---|
| Lead with motion | Slide 1 is the 8-second animated hero (`01-hero.mp4`, 1080 × 1350, silent). The static slides follow. Carousels can mix video and images |
| Finished from the first frame | Frame 0 already shows the complete picture: headline, scene, everything. It's also the grid thumbnail (`01-cover.png` is the same frame), so the grid is never blank, and someone who stops after one second has seen the whole message |
| Few words | Headline: one idea, a few words, one accent word. Slides: icon cards with a few words each (up to 4 cards), short numbered steps or one statement. If it needs a paragraph, it belongs in the caption |
| The headline stays | The tag, headline and sub-line never animate out. They stay readable for the whole video |
| A seamless loop | The hero holds the finished picture, clears it, rebuilds its little demo and lands back on exactly the frame it started with: hold → clear → rebuild → hold. Background motion (glows, blobs, spinning petals) completes whole cycles, so there's no jump when the video repeats |
| Silk motion | Smooth "silk" easing (`cubic-bezier(.22, 1, .36, 1)`), staggered entrances, nothing jerky or flashy |
| Silent by default | The hero videos have no sound and must work muted. Music on a Reel is optional; if you add a track, the video must still make sense without it |
| Mirrored for Arabic | The Arabic hero is its own render: right to left, with Arabic interface text (code stays left to right). Check the Arabic preview, not only the English one |
| Sample data is not a result | Numbers inside the animations (ratings, load times, order counts) are made-up demo data. Never quote them as results |

### Reels: the main reach driver

There are two kinds of Reels on this account:

1. **Hero Reels (ready-made).** Every animated post also exists as a 9:16 Reel in each language: `../exports/reels/NN-slug-en.mp4` and `NN-slug-ar.mp4`, each with a `-cover.jpg` (frame 0) for the cover. They are 8 seconds long, silent, loop seamlessly, and keep the headline clear of Instagram's buttons. Post them as pairs like everything else ([where they fit](#where-reels-fit), and how to post them in [`03-launch-posts.md`](03-launch-posts.md#4-the-reels)).
2. **Real-footage Reels** (screen recordings, gameplay, phone video) from the idea bank. One recording, two versions: English on-screen text and caption, then Arabic on-screen text and caption.

**Hook in the first 1–2 seconds.** Start with the result, not the intro. This is the same rule as frame 0 of the heroes.

| Do | Don't |
|---|---|
| Start on the best moment: the finished game scene, the working app screen | Start with a logo animation or "Hi everyone" |
| Put a short headline on screen in the first frame | Leave the first seconds silent with no text |
| One idea per Reel | Explain three services in one video |
| Keep demos short (about 7–30 seconds). Step-by-step Reels, like the scripts in the idea bank, can run about 40 seconds | Add slow intros to fill time |

Example hooks in both languages, with character counts: [section 0](#adapt-dont-translate).

**On-screen text**

- Many people watch without sound. Put the key message on screen, not only in the voiceover.
- Short lines, large text, high contrast. Use the brand fonts if your editing app allows it: Plus Jakarta Sans for English headlines, Alexandria for Arabic (the two are designed to sit together).
- The Arabic version gets Arabic on-screen text, aligned to the right, with the same timing.
- Add captions or subtitles when you speak (Arabic subtitles on the Arabic Reel).
- Instagram covers roughly the top 270 px and the bottom 420 px of a 1080 × 1920 Reel, plus a column of buttons at the side. Keep text in the middle and away from both side edges. The hero Reels are already laid out this way.

**Real footage beats stock footage**

- Screen recordings: the phone's built-in screen recorder, or a desktop screen recorder.
- Unity gameplay: record in the editor's Play mode or from a real build.
- App demos: a real phone in hand, or a clean screen recording.
- AI demos: test data only. Never show a client's private data.
- Blur names, emails, prices and anything private in client work. Ask the client before you show it.

**Other Reel tips**

- Post original videos. Instagram has said it favours original content, so reposts and videos with another app's watermark may reach fewer people.
- Use your own voice or the free audio library. Business accounts may have a smaller music library.
- End real-footage Reels with a short end card (about 2–4 seconds): your white logo [`../exports/logo/logo-white.png`](../exports/logo/logo-white.png) on Cobalt `#376BB1`, the blue post background (not the brand gradient: white text is too faint on its lighter blues), plus "DM START" on the English Reel and راسلنا بكلمة «ابدأ»‏ on the Arabic one. Make each once and reuse it (details in the idea bank's [Reel scripts](04-idea-bank.md#3-three-reel-scripts)).
- If your app offers **Trial reels** (shows a Reel to non-followers first), use it to test two hooks for the same video, one language at a time.

### Reel covers

The cover is what people see on your profile grid, so it keeps the grid looking designed. The Arabic Reel always gets the Arabic cover.

| Reel | Cover |
|---|---|
| Hero Reels | Use the `-cover.jpg` next to the video in [`../exports/reels/`](../exports/reels/). It is frame 0 of that Reel and is already laid out for the grid crop. Pick it under **Edit cover** → add from camera roll |
| Real-footage Reels | Pick a strong frame where the result and the headline are both visible, or make a cover in the hero style (rules below) |

Rules for a cover you make yourself:

| Rule | Detail |
|---|---|
| Size | 1080 × 1920 (9:16) |
| Grid crop | The profile grid shows a 3:4 crop from the centre (1080 × 1440). About 240 px is cut from the top and from the bottom |
| Safe area | Put the headline and the key image inside the middle **1080 × 1350**, with 88 px side padding, the same as the feed posts |
| Style | Same look as the heroes: theme background (Midnight `#0B1628`, Cobalt `#376BB1` or Mist `#D4E5F2`), ExtraBold headline with one accent word (Plus Jakarta Sans, or Alexandria for Arabic), the small tag pill (for example `01 / Games`, Arabic `01 / ألعاب`) |
| Logo | Use your own logo files: the trimmed PNGs in `../exports/logo/` (cut from your originals in `../brand/logo/source/`), for example `symbol-white.png` as a small watermark. Don't redraw or recolour the logo |

After uploading, open **Edit cover** and check how the cover looks in the profile grid before you publish.

### Carousels: saves and shares

- **Slide 1** = the animated hero: the hook. If you'd rather post an image, `01-cover.png` is the same frame as a still.
- **Middle slides** = one idea each, few words. **Last slide** = the CTA slide.
- The launch posts are short (2–4 slides after the hero). For TEACH carousels and case studies, 4–8 slides is enough: one idea per slide, few words.
- Instagram may show a carousel again starting from slide 2, so make slide 2 strong on its own.
- End with a reason to save or share: a checklist, a list of steps, "send this to your co-founder".
- Leading with real footage instead? Upload your own 1080 × 1350 video as slide 1, then the rendered `02.png`, `03.png` and so on. The page numbers still match, because the hero counts as slide 1.

**Slide types** (from [`../design/templates.mjs`](../design/templates.mjs)). Every text has an English and an Arabic version: two boxes in the workspace, `{ "en": "…", "ar": "…" }` in the post's file:

| Slide | Type | Use it for |
|---|---|---|
| 1 | The animated hero, built from the post's `tag`, `headline`, `sub`, `theme` and `scene` | The hook. Wrap one word in `*asterisks*` for the accent; `\n` forces a line break |
| 2 … | `cards`: `{ title, items: [{ icon, text }] }` | Up to 4 short items, each with a Lucide icon: what we build, checklists, tips |
| | `steps`: `{ title, items: [{ title, text }] }` | Numbered steps: how we work, how to prepare |
| | `statement`: `{ kicker, text }` | One strong sentence |
| | `services`: `{ title }` | The 8 services grid |
| | `image`: `{ src, title?, caption?, fit }` | A screenshot or photo: case studies, demos, before/after ([details](#case-study-posts)) |
| Last | `cta`: `{ headline?, body? }` | One call to action (the DM keyword or the link in bio) and a single Follow button; the footer reads "Save for later" / «احفظه لوقت لاحق» with a bookmark icon. Default headline: "Got an idea? Let’s compile it." / «لديك فكرة؟ لنبنِها معاً.‏» Override it per post, e.g. `{ "type": "cta", "headline": { "en": "Stuck on a project?\n*Let’s work it out.*", "ar": "عالق في مشروع؟\n*لنجد الحل معاً.*" } }` |

Rotate the three hero themes (`dark`, `blue`, `light`) so the grid stays balanced. The slides after the hero are always dark, so every carousel reads the same after the first swipe.

After the hero, these six types (`cards`, `steps`, `statement`, `services`, `image`, `cta`) are the only ones the templates render: any other type stops `npm run render` with an "unknown slide type" error. If an older idea or note asks for a `cover` slide, use the animated hero; if it asks for a `list`, use `cards` (up to 4 short items) or `steps`.

### Making a new animated post

Every feed post is one file in [`../content/posts/`](../content/posts/) plus an animated scene from [`../design/scenes/`](../design/scenes/). You make and edit both in the workspace: run `npm run studio` and open http://localhost:4600 (setup is in the [README](../README.md), the workspace in [`../studio/README.md`](../studio/README.md), the motion rules in the brand guide's [motion section](../brand/brand-guide.md#10-motion)).

1. **Start the post.** Pick one way:
   - **New post** in the workspace: give it a name, an animation and a theme (`dark`, `blue` or `light`; rotate them). It gets the next posting order (10, 11, …) and starts as a draft.
   - **From Claude Code** in the workspace: pick a project you built with Claude Code (or one of its chats), add a short brief and press **Generate carousel**. Claude writes both languages, adds real screenshots and saves a draft.
   - **`/crapto-post` inside Claude Code**, in the project's own chat (run `npm run connect` once first). Same result; the post appears in the workspace.
2. **Pick the animation.** For a project or case study, use a project showcase: `showcase-phone` (mobile apps), `showcase-browser` (websites and web apps), `showcase-code` (libraries, APIs, backends) or `showcase-stack` (anything: tech stack and features). Add the screenshots (or icon, code, tech stack) under **Animation settings**, and the project's name and features under **Text in the animation**. For a service or TEACH post, reuse the service scene that fits, for example `ai`. Don't reuse the same scene too often, or the grid starts to repeat.
3. **Write the text.** Fill in the tag, the headline (one `*accent*`), the sub-line and the slides, each in English and Arabic. Adapt the Arabic, don't translate it ([section 0](#adapt-dont-translate)). To change the words inside the animation (the chat, the app screen), edit **Text in the animation**: it changes this post only, not the scene. Then write the captions and alt text in the **Caption** panel. A post with no slides after the hero is a single video/image post without the "Swipe" hint.
4. **Check.** Watch the hero in both languages (**EN / AR**) and both formats (**Feed / Reel**). The **checks** pill flags text that's too long and missing captions. Then use **Render images** and **Check contrast** (in the **Render** menu, or `npm run render -- <slug>` and `npm run check -- <slug>`). The check fails if any text is too faint to read, in either language.
5. **Render the videos.** **Render videos** in the workspace, or `npm run motion -- <slug>`: 4 videos (feed and Reel, English and Arabic), at about a minute each. Then set the status to **ready**.
6. **Upload** from `../exports/posts/NN-<slug>/en/`, then `…/ar/`. The Reels and their covers are in `../exports/reels/`.

**Editing by hand?** A post is a JSON file, `content/posts/<slug>.json`, and every text in it is `{ "en": "…", "ar": "…" }`. The idea bank's [Formula 3](04-idea-bank.md#formula-3-myth-vs-fact) has a complete one to copy. The workspace picks up the change when you save the file.

**A new animation?** Write a new scene file only when no existing scene can tell the story, even with its text changed. It's a coding task of its own: follow the rules in [`../design/scenes/README.md`](../design/scenes/README.md) (frame 0 is the finished picture, a seamless 8-second loop, mirrored for Arabic), then check it with `npm run motion -- <slug> --preview` and `--loopcheck`.

The idea bank's [Formula 3](04-idea-bank.md#formula-3-myth-vs-fact) is a good first one to build: save it as post 10 (it reuses the `ai` scene), render it, and its cover is `../exports/posts/10-ai-myths/en/01-cover.png` (hypothetical until then: the folder only appears after you add the post).

Note: the grid preview and profile mockup in `../exports/preview/` show every post in `content/posts/` (drafts too), in both languages, newest first, and grow taller with each post you add. A full `npm run render` refreshes them. After you add posts they no longer show only the launch grid, so keep a copy of the launch versions if you still need them.

### Stories: daily trust

Stories are for people who already follow you. They show you're active and easy to talk to.

**Two languages in stories:** a short line can sit on one frame in both languages (the English line, with the Arabic line under it). Polls, quizzes and question stickers hold one question each, so post one per language, English first.

| Story type | Example (English) | Example (Arabic) | Pillar |
|---|---|---|---|
| Poll | "What should we show next? Game / App" | «ماذا نعرض لكم في المرة القادمة؟ لعبة / تطبيق» | TEACH, BUILD |
| Question sticker | "What are you building this month?" | «ماذا تبني هذا الشهر؟» | TEACH (answers become future posts) |
| Quiz | "Which one loads faster? A / B" | «أيّهما أسرع في التحميل؟ أ / ب» | TEACH |
| Work in progress | 5–10 s clip of today's build | The same clip, a line in each language | BUILD |
| Reshare | Share every new pair to your story (one story per pair is enough) | | All |
| Reshare others | When a client, partner or student team tags you | | SHOW |
| Link sticker | `[your project brief form link]` | The same link | OFFER |
| DM reminder | Once a week: DM "START" | راسلنا بكلمة «ابدأ» | OFFER |

Save good stories to the matching highlight (Games, Apps, AI…; the highlight labels are bilingual, see [`01-profile-setup.md` section 8](01-profile-setup.md#8-story-highlights)). Adding a story can move that highlight to the front of the row, so check the order afterwards. More ideas: the [story formats](04-idea-bank.md#4-15-recurring-story-formats) in the idea bank.

### Single posts: announcements only

Use a single post only for news: a project launch, a new service, an event you're at, a holiday break.
For a branded one, make a post with no slides after the hero (in the workspace, delete its slides; in the post's file, `"slides": []`): it renders the hero alone (video, or its still), and the footer shows just the handle, without "Swipe". A real photo or screenshot with a short text overlay works too. Either way, post it in both languages.

---

## 4) Weekly rhythm

Built for a small team: **2 new pairs a week, plus 1 ready-made hero Reel pair**. Every feed entry below is a pair: the English post, then the Arabic post right after. The days are an example; move them to fit your week.

| Day | Feed | Stories | Engagement |
|---|---|---|---|
| Mon | — (plan and batch-produce the week, both languages) | Poll (*This or that*, or *What should we post next?*) | 15–20 min |
| Tue | **Reel pair** (new real footage). Pillar from the cycle below | Share the pair | 15–20 min |
| Wed | — | *WIP Wednesday* clip, or a question sticker | 15–20 min |
| Thu | **Carousel pair** (animated hero + slides). Pillar from the cycle below | Share the pair + quiz | 15–20 min |
| Fri | — | Behind the scenes / DM reminder ("START" · «ابدأ») | 15–20 min |
| Sat | **Hero Reel pair** (ready-made, see [Where Reels fit](#where-reels-fit)) | Optional | Reply to comments and DMs only |
| Sun | Rest | Rest | Check DMs only |

**Pillar cycle** (4 weeks, then start again):

| Week | Tue: Reel pair | Thu: carousel pair |
|---|---|---|
| 1 | SHOW | TEACH |
| 2 | BUILD | OFFER |
| 3 | SHOW | TEACH |
| 4 | SHOW | BUILD |

**Monthly result:** 8 new pairs (16 posts): 3 SHOW, 2 BUILD, 2 TEACH and 1 OFFER, which matches the pillar mix (stories carry the rest of OFFER). Plus 4 hero Reel pairs (8 Reels).

**Filling a slot:** the cycle gives you the pillar. Then take the next service in the rotation (never the same service twice in a row) and pick an idea ID from that service's table in the [idea bank](04-idea-bank.md#pick-an-idea-in-3-steps).

**Busy week? Minimum version:** 1 new pair + the hero Reel pair + stories on 3 days. Post fewer pairs, never half a pair. Don't skip the daily replies.

### Where Reels fit

| Reel | When | Notes |
|---|---|---|
| Real-footage Reel pair | Tuesday | The main reach driver. One recording, two language versions |
| Hero Reel pair | Saturday | Ready-made in [`../exports/reels/`](../exports/reels/). Weeks 2–4: the launch heroes of Games, Apps and Custom AI (the order in the [30-day plan](#9-the-first-30-days)); then the other six launch heroes, one pair a week. After that, the hero Reels of your newer animated posts, at least a week after their carousel |
| Extra Reel pair | Any week with time to spare | A BUILD Reel pair instead of the hero Reel. Also the better choice when a carousel reused a launch scene, since its hero Reel would look like the launch one |

A hero Reel shows the same animation as a carousel cover already on your grid. If your app offers an option to keep a Reel off the profile grid (it only shows in the Reels tab and to non-followers), you can use it for hero Reels. If it doesn't, the Reel appears in the grid like any post, which is fine after launch. Hero Reel captions are short: the post's hook, one CTA line and the same hashtag set, in each language (examples in [`03-launch-posts.md`](03-launch-posts.md#reel-captions)).

**Rough weekly time** (an estimate; adjust to your team):

| Task | Time |
|---|---|
| One batch session: record and edit 1 Reel in two language versions, make the carousel pair in the workspace, render and check it, write and adapt 3 caption pairs, schedule | 3–4 hours |
| Video rendering | About a minute per video, 4 videos per new post. It runs on its own |
| A new animated scene (only when you write one) | Plan it as a separate coding task, not part of the weekly batch |
| Stories | About 5–10 minutes on story days (both languages) |
| Engagement and replies | 15–20 minutes a day |

**Schedule ahead.** Professional accounts can usually schedule posts in the Instagram app or in Meta Business Suite, if the tool supports carousels that start with a video. Schedule the English post first and the Arabic one a few minutes later, so the pair stays together and in the right order.

### Best times to post

Ignore generic "best time to post" charts. Use your own data:

- Insights → your followers → **Most active times** (it appears once you have enough followers). It covers all your followers, in both languages.
- Until then, post when your audiences are likely free: for example, outside school or work hours for students, during the workday for business owners.
- A pair goes out together, so choose a time that suits both audiences. If your Arabic-speaking and English-speaking followers are mostly in different time zones (Insights shows top cities and countries), try different times over 4–6 weeks and compare the reach of each language.
- After 4–6 weeks, compare the reach of posts published at different times and keep what works.

---

## 5) Discoverability

People find accounts through search, Reels and shares. Make it easy for Instagram (and people) to understand, in both languages, that Crapto Studio builds **games, apps, software and AI**.

> **About the name:** "Crapto" can be misread. Every caption and on-screen text should make the topic obvious: Unity games, iOS and Android apps, software, custom AI. Always write the name in full as **Crapto Studio**, in Latin letters. Never use crypto, NFT, trading or blockchain words or hashtags, in English or in Arabic (no «عملات رقمية»، «كريبتو»، «تداول»، «بلوكتشين»).

### Keywords in captions and on-screen text

Instagram search uses the words in your caption. Clear on-screen text helps people watching without sound, and Instagram may read it too. Write the words people actually type into search, in each language.

| Instead of… | Write… |
|---|---|
| "Our latest drop 🔥" | "Unity game prototype: [2D platformer], built for [mobile]" |
| "New project!" | "iOS & Android app for [what it does], built with [tech]" |
| "AI magic" | "Custom AI assistant that answers questions from your own documents" |
| «أحدث أعمالنا 🔥» | «نموذج أولي للعبة [النوع] على Unity، تعمل على [الجوال]» |
| «مشروع جديد!» | «تطبيق iOS و Android يساعد [من] على [ماذا]، طوّرناه باستخدام [التقنية]» |
| «سحر الذكاء الاصطناعي» | «مساعد ذكي يجيب عن الأسئلة من مستندات شركتك» |

**Arabic keywords per service.** These follow the terms in the posts. Use one or two of them in the first lines of the Arabic caption:

| Service | Arabic keywords |
|---|---|
| Games | تطوير ألعاب، صناعة الألعاب، ألعاب الجوال، ألعاب Unity، ألعاب تسويقية، نموذج أولي قابل للعب |
| Apps | تطبيق جوال، تطوير تطبيقات، برمجة تطبيقات، تطبيق iOS و Android، تصميم واجهات |
| Software | لوحة تحكم، نظام إدارة، برمجيات مخصصة، من جداول البيانات إلى نظام، ربط الأنظمة |
| Custom AI | ذكاء اصطناعي للأعمال، مساعد ذكي، أتمتة المهام، ذكاء اصطناعي داخل تطبيقك |
| Interactive | عرض تقديمي تفاعلي، تطبيق شاشة لمس، اختبار تفاعلي، عرض منتج ثلاثي الأبعاد |
| Upgrades | ترقية تطبيق، تسريع تطبيق أو موقع، إصلاح الأخطاء، تحديث مشروع قديم، فحص الكود |
| Support | إرشاد برمجي، التحضير للمسابقات، هاكاثون، مراجعة الكود، تصحيح الأخطاء |
| Custom solutions | حل برمجي مخصص، أداة مخصصة لفريقك، أتمتة عمل يدوي |

- People type search words without diacritics (tashkeel), so keep keywords plain.
- Some words change from country to country (جوال or موبايل for a mobile phone). The posts use جوال; if your audience says موبايل, use their word in captions.
- Keep tech names in Latin letters next to the Arabic (Unity, iOS, API): that's how people search for them.

**Caption structure** (the same in both languages; write the Arabic caption from the idea, not from the English sentences)

1. **Hook line** with a keyword (this shows before "… more"). Keep it under 125 characters, like the launch captions, with the keyword in the first few words.
2. **2–4 short lines** of value or context.
3. **One action**: DM "START" / «ابدأ», save it, or share it with someone.
4. **Hashtags** (max 5) at the end, from the set for that language.

**Example caption** (SHOW, Games), English:

```
Unity game prototype: [genre], built to test the core idea.

We built this to answer one question: [the question it tests].
Made in Unity, playable on [platforms].
[add 1 real detail about the project]
[Demo / Concept / Client project, shared with permission]

Got a game idea? DM "START" and tell us about it.

#craptostudio #gamedev #unity3d #indiedev #madewithunity
```

The same post in Arabic (adapted, not translated):

```
نموذج أولي للعبة [النوع] على Unity، بنيناه لنختبر الفكرة الأساسية.

أردنا أن نجيب عن سؤال واحد: [السؤال الذي يختبره].
يعمل على [المنصات].
[أضف تفصيلاً حقيقياً واحداً عن المشروع]
[نموذج تجريبي / تصوّر مبدئي / مشروع لعميل يُنشر بإذنه]

لديك فكرة لعبة؟ راسلنا بكلمة «ابدأ» وأخبرنا عنها.

#تطوير_الألعاب #ألعاب_فيديو #صناعة_الألعاب #unity3d #craptostudio
```

### Alt text

Add alt text in the post's language (Advanced settings → Accessibility → **Write alt text**; the place can change between app versions). Describe what is on the slide and repeat the headline, in **100 characters or fewer**. Some app versions don't offer alt text for a video slide; then write it for the image slides, and let the caption's first line and the on-screen headline carry the video's message. The alt text for every launch post is in [`03-launch-posts.md`](03-launch-posts.md).

Example: slide 2 of launch post `08-games` (the icon cards, titled "What we build" / «ماذا نبني»):

| Post | Alt text | Characters |
|---|---|---|
| English | What we build: full Unity games, playable prototypes, advergames for brands, game feel and polish. | 98 |
| Arabic | ماذا نبني: ألعاب Unity متكاملة، نماذج أولية قابلة للعب، ألعاب تسويقية، ومتعة اللعب واللمسات الأخيرة. | 100 |

### Hashtags: max 5 per post

Instagram limits posts to 5 hashtags. Hashtags help a little; keywords in the caption matter more. Each set below has 5 tags, always including `#craptostudio`. English posts use the English set, Arabic posts the Arabic set. The Arabic sets match the launch posts in [`03-launch-posts.md`](03-launch-posts.md).

| Service | English posts | Arabic posts |
|---|---|---|
| Games (Unity) | #craptostudio #unity3d #gamedev #indiedev #madewithunity | #تطوير_الألعاب #ألعاب_فيديو #صناعة_الألعاب #unity3d #craptostudio |
| Interactive content & presentations | #craptostudio #interactivecontent #presentationdesign #eventtech #gamification | #عروض_تقديمية #محتوى_تفاعلي #التسويق_الرقمي #فعاليات #craptostudio |
| Apps (iOS / Android) | #craptostudio #appdevelopment #iosdev #androiddev #mobileapp | #تطبيقات_الجوال #تطوير_التطبيقات #برمجة_تطبيقات #تجربة_المستخدم #craptostudio |
| Software | #craptostudio #softwaredevelopment #webdevelopment #webapp #businesssoftware | #تطوير_البرمجيات #برمجيات #التحول_الرقمي #ريادة_الأعمال #craptostudio |
| Support (mentoring, competitions) | #craptostudio #hackathon #programming #learntocode #computerscience | #برمجة #تعلم_البرمجة #هاكاثون #علوم_الحاسب #craptostudio |
| Upgrades (existing projects) | #craptostudio #codereview #refactoring #bugfix #appdevelopment | #برمجة #تطوير_البرمجيات #تطوير_التطبيقات #تقنية #craptostudio |
| Custom AI | #craptostudio #artificialintelligence #aiautomation #aiforbusiness #chatbot | #الذكاء_الاصطناعي #التحول_الرقمي #ريادة_الأعمال #تقنية #craptostudio |
| Custom solutions | #craptostudio #customsoftware #startups #smallbusiness #productdevelopment | #حلول_برمجية #ريادة_الأعمال #الشركات_الناشئة #مشاريع_صغيرة #craptostudio |
| Start / planning a project | #craptostudio #startup #smallbusiness #productdevelopment #appdevelopment | #ريادة_الأعمال #الشركات_الناشئة #مشاريع_صغيرة #برمجة #craptostudio |
| Studio / general | #craptostudio #softwaredevelopment #gamedev #appdevelopment #artificialintelligence | #برمجة #تطوير_الألعاب #تطبيقات_الجوال #الذكاء_الاصطناعي #craptostudio |

- **Arabic sets end with #craptostudio**, so the line starts with an Arabic tag and reads right to left. One Latin tag is fine where the tool's name is what people search for (#unity3d).
- **Many Arabic tags exist with and without the article «ال»**, for example ‏#الذكاء_الاصطناعي and ‏#ذكاء_اصطناعي. Pick the one with more relevant posts; don't use both.
- **Before you use a tag for the first time**, tap it and look at the top posts. If they don't match your audience or look spammy, swap it for another one.
- **Never** use crypto or trading tags in either language (‏#كريبتو، #عملات_رقمية، #بيتكوين، #تداول), or tags that sell ready-made student work (‏#حل_واجبات، #مشاريع_تخرج): Support is mentoring.

### Location tags

- If you work with clients in a specific city or region, add `[your city]` as the location on posts about local work, events or workshops (both posts of the pair).
- Tag the venue when you post from an event, hackathon or school.
- Don't tag places you don't actually serve.

### Collabs

A **Collab** post appears on both profiles once the other account accepts your invite, so it reaches their followers too. An invite is per post: invite the partner to the post in their language, or to both posts of the pair if they're happy to appear twice.

| Who | Example |
|---|---|
| Clients | Case study (S8) posted together with the client |
| Partners | Designers, agencies or event teams you built something with |
| Event / hackathon organisers | Recap of a workshop or mentoring session |
| Student teams | Team spotlight (S9), with their permission |

Only invite people who agreed to it. Tag clients and partners in photos when they're happy to be shown.

### Search engines

Public posts from professional accounts may also appear in search engines like Google (look in your privacy settings if you want to control this). One more reason to use clear keywords in captions, in both languages.

---

## 6) Daily engagement routine

**15–20 minutes, 5–6 days a week.** Same time each day if possible.

| ✓ | Step | Time |
|---|---|---|
| ☐ | Reply to **every** comment on your posts, in the commenter's language (more than "thanks!": add a detail or a question) | 3–5 min |
| ☐ | Reply to **every** DM in the person's language. Use the saved replies in English or Arabic ([`01-profile-setup.md` section 9](01-profile-setup.md#9-dm-setup)). Aim for the same day (an internal habit, not a public promise) | 5 min |
| ☐ | Check the **message requests** folder. New contacts often land there | 1 min |
| ☐ | Engage with **10 accounts** in your target niches (see below): leave a real comment in their language, not an emoji | 5–8 min |
| ☐ | Reply to story replies and poll answers that ask something | 2 min |
| ☐ | Note new leads, with their language, in your lead tracker ([section 7](#7-turning-followers-into-clients)) | 1 min |

**Where to find the 10 accounts** (look in both languages: Arabic-speaking founders, developers, coding clubs and event pages as well as English-speaking ones)

| Niche | Who | Matches service |
|---|---|---|
| Indie devs | Unity and indie game developers, game jams | Games, Upgrades |
| Startups | Founders, early-stage startups, startup communities | Apps, Software, Custom AI, Upgrades |
| Local businesses | Shops, gyms, schools, clinics in `[your city]` | Software, Apps, Custom AI |
| Students & hackathons | Coding clubs, university tech societies, hackathon pages | Support |
| Brands, educators & events | Marketers, small brands, teachers, trainers, event organisers | Interactive, Games (advergames) |

**Good comments** add something: a question, a tip, a real reaction.

- ✅ "Nice camera feel on the dash. Are you using a spring for the follow?"
- ✅ "Good point on scoping first. Did the client cut any features after that?"
- ✅ «نقطة مهمة عن تحديد النطاق قبل البدء. هل استغنى العميل عن أي ميزة بعدها؟»
- ❌ "Great post! 🔥" / "Check out our page!" / «منشور رائع! 🔥» / «زوروا صفحتنا!‏»

**Don't:** use bots for likes, comments or follows, join engagement groups, or follow/unfollow in bulk. They break your Insights and can get the account restricted.

**Crypto spam:** because of the name, crypto accounts may comment or follow. Delete crypto spam, don't engage with crypto accounts, and add common spam words in both languages to Hidden Words in the app's settings (for example "crypto", "trading", «عملات رقمية», «تداول», «أرباح يومية»). If someone honestly asks "Is this a crypto thing?", use the ready reply in the [brand guide](../brand/brand-guide.md#how-not-to-be-mistaken-for-a-crypto-account), in their language.

---

## 7) Turning followers into clients

### The DM "START" / «ابدأ» flow

Every post, story and CTA slide points to the same action. Make that path smooth in both languages.

| Step | What happens | Who / tool |
|---|---|---|
| 1. Trigger | A post, story or CTA slide says: DM "START" (English) or «ابدأ» (Arabic), or tap the link in bio | Content |
| 2. First reply | Send the START saved reply in the person's language (`start` in English, `arstart` in Arabic: the 5 questions + form link) | You, saved replies ([`01-profile-setup.md` section 9](01-profile-setup.md#9-dm-setup)) |
| 3. They answer | What, who for, deadline, budget range, links they like | Client |
| 4. Follow-up | Ask 1–3 short questions, or offer a call (`[your booking link]`) | You |
| 5. Scope | Short call or written scope; say honestly if they don't need something | You |
| 6. Quote | Clear quote and timeline, before any work starts | You |
| 7. Log it | Add the lead to your tracker, with its language | You |

**Not a fit?** Reply kindly anyway with the "not offered" saved reply, in their language. A friendly "no" often brings referrals later.

**Optional:** comment-to-DM automation ("comment START and we'll DM you") through a third-party tool. If you use it, set up both keywords, check that the tool matches the Arabic word «ابدأ» and its common variant spellings (such as «ابدا» or «إبدأ»), and test both from a second account. Setup notes are in [`01-profile-setup.md` section 9](01-profile-setup.md#9-dm-setup).

### Link-in-bio form

Link 1 in your bio is `[your project brief form link]`. Keep the form under 2 minutes to fill in, and offer it in both languages (one bilingual form, or one form per language).

| Field | Type |
|---|---|
| Name and how to contact you | Text |
| Preferred language | English / العربية |
| What do you want to build? (one sentence is fine) | Text |
| Which service? | Checkboxes: the 8 services + "Not sure" |
| Who is it for? | Text |
| Deadline | Date or "No fixed date" |
| Budget range | Ranges you choose + "Not sure yet" |
| Links or apps you like | Text (optional) |
| How did you find us? | Instagram post / Reel / story / DM / other |

The last two questions tell you which content, and which language, brings enquiries.

### Simple lead tracker

A spreadsheet is enough.

| Date | Name / @handle | Language | Source (idea ID, launch post or "bio link") | Service | Deadline? | Budget? | Status | Next step |
|---|---|---|---|---|---|---|---|---|
| | | EN / AR | e.g. `GM2`, `07-start` or bio link | | Y / N | Y / N | New / Talking / Quoted / Won / Lost | |

### Case-study posts

Your strongest SHOW content (idea S8). Post one as soon as you finish a project and the client agrees, in both languages.

**Straight from Claude Code.** If you built the project with Claude Code, it can become a carousel without starting from a blank page. In the workspace, open **From Claude Code**, pick the project (or the chat you built it in), add a short brief and press **Generate carousel**. Or type `/crapto-post` inside Claude Code in that project (run `npm run connect` once first). Claude picks a project showcase scene, copies real screenshots, writes both languages and saves a draft. It follows the studio's [playbook](../studio/claude/playbook.md): it never invents users, ratings, revenue, clients, quotes or speed-ups, uses a number only if the project or the chat states it, and keeps keys, private data and client data out of screenshots, code and text (and the client's name too, unless your brief says it's public). The draft is a starting point: check every claim and screenshot yourself, and get the client's OK before you post.

| Slide | Type | Content |
|---|---|---|
| 1. Hero | Animated hero: a project showcase scene (`showcase-phone`, `showcase-browser`, `showcase-code` or `showcase-stack`) with the project's own name and screenshots, another new or reused scene, or a real screen recording as a 1080 × 1350 video | "How we [result] for [type of client]" |
| 2. The problem | `statement` | What wasn't working, in the client's words if possible |
| 3. What we built | `cards` or `image` | 3–4 short cards, or a real screenshot with a one-line caption |
| 4. How | `steps` | Tech and process, in plain language |
| 5. Result | `statement` | Only real, measured results. No numbers? Describe what changed |
| 6. Client quote | `statement` | `[add a real client quote]`, only with permission. Keep the quote in the client's own words; if you translate it for the other language, say it's translated and get the client's OK on the translation. No quote? Skip this slide |
| 7. CTA | `cta` | DM "START" / «ابدأ» |

For real screenshots or photos, use an `image` slide (**Screenshot / image** in the workspace). Drop the file into the post's **Files** panel; it is saved in `content/assets/<slug>/`. In the post's file it looks like `{ "type": "image", "src": "content/assets/<slug>/after.png", "title": { "en": "The *after*", "ar": "*بعد* التحديث" }, "caption": { "en": "[what changed, in one line]", "ar": "[ما الذي تغيّر، في سطر واحد]" } }`. `src` is relative to the repo root (PNG, JPG or WebP), `title` and `caption` are optional, and `fit` is `"contain"` (default, shows the whole image) or `"cover"` (fills the frame, crops the edges). The same screenshot is used in both languages; only the title and caption change. It renders inside the normal slide frame, so the page numbers (for example `02 / 07`) stay correct. Adding screenshots (1080 × 1350) in the Instagram app is only a fallback: the page numbers count the rendered slides only, so they would be wrong. More options under [Formula 5](04-idea-bank.md#formula-5-before--after) in the idea bank. Also post a short Reel pair (screen recording + 3 lines of on-screen text in each language) and invite the client as a Collab if they agree.

### Social proof, once you have it

- **Ask for feedback after every delivery**, in the client's language. For example:
  ```
  Thanks again for working with Crapto Studio!
  Would you write 2–3 sentences about the project and how it went?
  With your OK, we'd like to share it on our Instagram (with your name or handle, or anonymous if you prefer).
  ```
  ```
  شكراً مجدداً لأنك اخترت Crapto Studio!
  هل يمكنك أن تكتب لنا جملتين أو ثلاثاً عن المشروع وعن تجربتك معنا؟
  ونودّ، بموافقتك، أن ننشر كلماتك على حسابنا في إنستغرام (باسمك أو باسم حسابك، أو دون ذكر اسمك إن كنت تفضّل ذلك).
  ```
- Turn real quotes into story frames and save them to the **Reviews** highlight.
- Pin your best project post (see [`01-profile-setup.md` section 10](01-profile-setup.md#10-pinned-posts)).
- Never write or "improve" a review yourself. Only share real words, with permission.

---

## 8) Measuring what works

### Metrics that matter

Instagram renames metrics from time to time (newer versions lead with **Views**). If a name below doesn't match your app, look for the closest one. Post-level metrics are per post, so they are per language; account-level metrics mix both audiences.

| Metric | Where (usually) | Why it matters |
|---|---|---|
| **Reach from non-followers** | Post insights → views / accounts reached, split into followers and non-followers | Are new people finding you? |
| **Shares (sends)** | Post insights | Strongest sign that content is useful; it brings new viewers |
| **Saves** | Post insights | People want to come back to it (TEACH content) |
| **Profile visits** | Post insights → profile activity, and Insights → profile activity | People want to know who made the post |
| **External link taps** | Insights → profile activity | Interest in the form / portfolio |
| **DMs started** | Count it yourself, by keyword: "START" or «ابدأ» (lead tracker) | Real conversations: the main goal |
| **Qualified enquiries** | Lead tracker | Real project + deadline + budget range |
| Followers | Insights | For information only, not a goal |

Likes are nice, but they don't tell you much. Shares, saves, profile visits and DMs do.

### English vs Arabic

- **Compare within a pair first.** The two posts of a pair share the idea, the design and the day, so the difference between them is mostly the language, the caption and the hashtags.
- **Look for trends, not single posts.** One pair can swing either way. Decide only on what holds over 4 or more pairs.
- **Followers see both.** Someone who reads both languages may react to only one post of the pair. That's why DMs and enquiries per language (from your tracker) matter more than likes per language.
- **Keep both languages for the full 90 days** before you change the plan. A language that starts slower may simply need more posts to be found.

### Weekly check (10 minutes)

- Which pair of the week had the most **shares + saves** (both posts together)?
- Within each pair, which language did better? Note it.
- Which post brought **profile visits** or DMs ("START" or «ابدأ»)?
- Write one line: "Next week, more of ___."

### What to fix when numbers are low

| If… | Then try… |
|---|---|
| Reach is low | Stronger first 1–2 seconds, clearer on-screen headline, more Reels |
| Reach is OK but profile visits are low | Show more of the people and process (BUILD); tell viewers what else is on the profile |
| Profile visits are OK but DMs/link taps are low | Check bio, pinned posts and link 1; make the DM "START" / «ابدأ» step clearer |
| DMs come but few are real projects | Say more clearly who you help and what you build (O2 service spotlights) |
| Saves are low on carousels | More checklists and steps people want to keep (TEACH) |
| One language is far behind the other | Check that the hook was adapted, not translated; use that language's keywords and hashtag set; try a posting time that suits that audience |
| Hero Reels get far less reach than real-footage Reels | Give the hero Reel slot to an extra real-footage Reel pair |

### Monthly review template

Copy these tables each month.

**Account, month by month**

| Metric | Month 1 (baseline) | Month 2 | Month 3 | Notes |
|---|---|---|---|---|
| Feed posts published | | | | Target, month 1: 18 launch posts + 22 (8 new pairs + 3 hero Reel pairs). Later months: about 24 (8 new pairs + 4 hero Reel pairs) |
| Days with stories | | | | Target: 17–21 |
| Views | | | | |
| Accounts reached | | | | |
| % reach from non-followers | | | | |
| Shares | | | | |
| Saves | | | | |
| Profile visits | | | | |
| External link taps | | | | |
| DMs started (own count) | | | | |
| Qualified enquiries | | | | |
| Calls / quotes sent | | | | |
| Projects won | | | | |
| Followers (info only) | | | | |

**This month, English vs Arabic** (add up the post insights of each language's posts)

| Metric | English posts | Arabic posts | Notes |
|---|---|---|---|
| Posts published | | | Should be equal: every post is a pair |
| Views | | | |
| Accounts reached (sum of posts) | | | Someone who saw both posts is counted in both |
| % reach from non-followers (average) | | | |
| Shares | | | |
| Saves | | | |
| Profile visits from posts | | | |
| DMs started | "START": | «ابدأ»: | Own count |
| Qualified enquiries | | | From the tracker's Language column |
| Projects won | | | |

**Then answer:**

| Question | Answer |
|---|---|
| Top 3 pairs by shares + saves: what do they have in common? | |
| Which pillar and service worked best? | |
| Which language brought more shares, saves and DMs? Is that the same for every pillar and service? | |
| Was there a pair where only one language did well? What was different (hook, caption, hashtags)? | |
| Which post brought the most DMs or form enquiries? | |
| One thing to **stop**: | |
| One thing to **start**: | |
| One thing to **keep**: | |
| Targets for next month (adjust the starting assumptions from [section 1](#1-goals-for-the-first-90-days)) | |

---

## 9) The first 30 days

**Day 1 = your launch day.** Before Day 1:

- Finish the profile setup in [`01-profile-setup.md`](01-profile-setup.md) (everything except the posts and highlights), including tested saved replies for "START" and «ابدأ».
- Make sure every launch file is rendered: `npm run build` (logo crops and stills), `npm run motion` (36 videos at about a minute each, so start it early) and `npm run check`. Look at [`../exports/preview/grid.png`](../exports/preview/grid.png) (18 tiles, 6 rows) and [`../exports/preview/profile-mockup.png`](../exports/preview/profile-mockup.png).
- Record footage for the first 2–3 Reels and plan their English and Arabic on-screen text, so week 2 doesn't start from zero.

**How to read the calendar**

- It counts days from launch, not weekdays. Keep the spacing (a new pair every 2–3 days, a hero Reel pair once a week, one rest day a week) and fit it to your real week.
- Every feed entry is a pair: the English post, then the Arabic post right after. Every story idea runs in both languages ([stories](#stories-daily-trust)).
- IDs like `GM2` are from the [idea bank](04-idea-bank.md). `S1` is from [section 2](#2-content-pillars-and-starter-ideas). Story names in *italics* are from the idea bank's [story formats](04-idea-bank.md#4-15-recurring-story-formats).
- Carousel pairs are new posts (posts 10, 11 and 12 this month), made in the workspace. Build each one in the batch session before its day ([how](#making-a-new-animated-post)).
- No real footage for an idea yet? Swap in another idea with the same pillar. Never fake a demo.
- Every day except rest days: the 15–20 minute [engagement routine](#6-daily-engagement-routine).

### Week 1: Launch (Days 1–7)

Publish the 18 launch posts from [`03-launch-posts.md`](03-launch-posts.md) **in posting order**: pairs 01 to 09, and in each pair the English post first, then the Arabic one. Use the captions, hashtags and alt text from that file. Instagram shows the newest post top-left, so this order builds the designed grid, with each Arabic post just before its English twin. Post nothing else to the feed until the Arabic Intro post (upload 18) is live.

| Day | Feed | Stories / profile | Engagement |
|---|---|---|---|
| 1 | Pairs **01 Support**, **02 Interactive**, **03 Upgrades** (6 posts: EN, AR, EN, AR, EN, AR) | Share each pair to your story right after you publish it | Reply to comments. Don't share the profile link or run ads yet: the grid isn't finished ([why](03-launch-posts.md#publish-all-18-before-you-promote-the-account)). Following a few accounts in your niche is fine |
| 2 | Pairs **04 Software**, **05 Custom AI**, **06 Apps** | Share each pair to your story | Reply to comments and DMs, in the commenter's language |
| 3 | Pairs **07 Start here**, **08 Games**, **09 Intro** | Share each pair. After upload 18 is live: pin (up to 3 posts; see [Pinning reorders the grid](03-launch-posts.md#pinning-reorders-the-grid) and [`01-profile-setup.md` section 10](01-profile-setup.md#10-pinned-posts)), create the highlights in reverse order ([section 8](01-profile-setup.md#8-story-highlights); skip Reviews until you have a real review), and check the grid against [`../exports/preview/grid.png`](../exports/preview/grid.png) | Start the daily routine. Follow 10–20 accounts in your target niches, in both languages |
| 4 | — | "We're live" / «انطلقنا!‏» story + link sticker. Tell your own network: personal profiles, WhatsApp, LinkedIn, email signature | Routine |
| 5 | **Reel pair: S1** What we build in 15 seconds. No footage for all four yet? Post the **09 Intro hero Reel pair** instead (`../exports/reels/09-intro-en.mp4`, then `09-intro-ar.mp4`) | Share the pair | Routine |
| 6 | — | Poll, one per language: "What should we show next? Game or app?" / «ماذا نعرض لكم في المرة القادمة؟ لعبة أم تطبيق؟» | Routine |
| 7 | Rest | — | Optional: first weekly check (10 min) |

You can also publish all 18 launch posts in one sitting if you prefer. The posting order is what matters. From Day 5, every new pair shifts the launch grid by two squares (a hero Reel kept off the grid doesn't). That's normal (see [`03-launch-posts.md`](03-launch-posts.md#5-after-launch)).

### Week 2 (Days 8–14) · cycle week 1: SHOW + TEACH

| Day | Feed | Pillar · service | Stories |
|---|---|---|---|
| 8 | **Reel pair: `GM2`** 15 seconds of gameplay, or **`AP2`** One full flow, no cuts (whichever won the Day 6 poll) | SHOW · Games or Apps | Share the pair |
| 9 | — | | WIP clip + question sticker: "What are you building this month?" / «ماذا تبني هذا الشهر؟» |
| 10 | **Carousel pair: `AI1`** You might not need AI. Post 10, English and Arabic (the idea bank's [Formula 3](04-idea-bank.md#formula-3-myth-vs-fact) has the whole post ready to paste); for the hero, reuse the `ai` scene or write a new one | TEACH · Custom AI | Share + *Myth or fact* quiz |
| 11 | — | | *Desk / setup* clip |
| 12 | **Hero Reel pair: 08 Games** (`../exports/reels/08-games-en.mp4`, then `08-games-ar.mp4`) | Hero Reel · Games | Share the pair |
| 13 | — | | *DM reminder* ("START" · «ابدأ») + link sticker |
| 14 | Rest | | [Weekly check](#weekly-check-10-minutes) (10 min) |

### Week 3 (Days 15–21) · cycle week 2: BUILD + OFFER

| Day | Feed | Pillar · service | Stories |
|---|---|---|---|
| 15 | **Reel pair: `SP3`** A code review session, in 30 seconds (your own sample project, or a student's with permission). The mentor explains; the student does the work | BUILD · Support | Share + question sticker for students: "What's your next competition?" / «ما مسابقتك القادمة؟» |
| 16 | — | | *This or that* poll, or a poll on a question people asked in DMs |
| 17 | **Carousel pair: `UP6`** Project stuck? Post 11 (reuse the `upgrades` scene or write a new one) | OFFER · Upgrades | Share + link sticker |
| 18 | — | | WIP clip |
| 19 | **Hero Reel pair: 06 Apps** | Hero Reel · Apps | Share the pair |
| 20 | — | | *Ask us anything* question sticker, one per language («اسألنا ما تشاء») |
| 21 | Rest | | Weekly check (10 min) |

### Week 4 (Days 22–28) · cycle week 3: SHOW + TEACH

| Day | Feed | Pillar · service | Stories |
|---|---|---|---|
| 22 | **Reel pair: `SW1`** Spreadsheet → system, or **`SW2`** Two tools, connected | SHOW · Software | Share the pair |
| 23 | — | | Answer 3–5 *Ask us anything* questions from Day 20, each in the language it was asked in |
| 24 | **Carousel pair: `CS4`** Your first version should do one thing well. Post 12 (for example, reuse the `start` scene) | TEACH · Custom solutions | Share + quiz or poll |
| 25 | — | | *Guess what we're building* («خمّن ماذا نبني») |
| 26 | **Hero Reel pair: 05 Custom AI** | Hero Reel · Custom AI | Share the pair |
| 27 | — | | *DM reminder* |
| 28 | Rest | | Weekly check (10 min) |

### Days 29–30: start week 5, review month 1

| Day | Do |
|---|---|
| 29 | **Reel pair: `IX1`** Normal slides vs. interactive presentation, or **`IX2`** Touchscreen demo. SHOW · Interactive: the first post of week 5 (cycle week 4: SHOW + BUILD) |
| 30 | Fill in the [monthly review](#monthly-review-template), with English and Arabic side by side. Pick next month's IDs from the idea bank, with more of what got shares, saves and DMs (`GM1` Game feel, with its full script, makes a good first BUILD Reel). Plan the other launch hero Reel pairs (Software, Upgrades, Interactive, Support, Start here, and Intro unless you posted it on Day 5) for the next Saturdays. Swap a pinned post if you published real project work ([`01-profile-setup.md` section 10](01-profile-setup.md#10-pinned-posts)) |

**Month 1 after launch:** 8 new pairs (16 posts) and 3 hero Reel pairs (6 Reels) on top of the 18 launch posts. The new pairs are 4 SHOW, 2 TEACH, 1 BUILD and 1 OFFER, and with the hero Reels every service gets a post. That leans on proof and is light on offers on purpose: the launch posts already explain each service and all end with DM "START" / «ابدأ». From month 2, the [pillar cycle](#4-weekly-rhythm) gives the full mix.

**Got a real project finished in month 1?** Swap that week's SHOW Reel pair for an **S8** case study (with the client's permission). If you built it with Claude Code, Claude can draft the carousel ([case-study posts](#case-study-posts)). Real work always comes first.
