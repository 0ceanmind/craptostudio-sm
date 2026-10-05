# Instagram profile setup — Crapto Studio

A step-by-step guide to set up the Crapto Studio Instagram profile before the launch posts go live.
Work through it top to bottom, then tick off the [launch checklist](#11-launch-checklist) at the end.

The account speaks **two languages**. Every launch post is published twice: once in English and once in Arabic (Modern Standard Arabic, right to left). So the profile has to work for both: the bio, the link titles, the highlights and the DM replies below all cover English and Arabic. The brand name always stays in Latin letters: **Crapto Studio**. The DM keyword is **START** in English and **«ابدأ»** in Arabic.

> **Handle:** this guide assumes the handle **@craptostudio**. If yours is different, swap it everywhere you see it.

**What the finished profile should look like:** [`../exports/preview/profile-mockup.png`](../exports/preview/profile-mockup.png)

In the mockup:

- The post count is the number of posts in [`../design/content.mjs`](../design/content.mjs) times two languages (9 × 2 = **18** at launch).
- The bio is the recommended bilingual bio from [section 4](#4-bio).
- The highlight row shows the first 5 highlights with their English labels (see [section 8](#8-story-highlights) for the Arabic option).
- The link line "🔗 your-project-form-link and 4 more" is a placeholder: your profile shows your own first link there, plus the other links from [section 6](#6-links-up-to-5).

**Note on menus:** Instagram moves and renames menus between app versions. The menu paths below are a guide. If you can't find an item, use the search bar in Settings.

---

## Before you start

### Files you will upload

| What | File |
|---|---|
| Profile picture | [`../exports/profile/profile-picture.png`](../exports/profile/profile-picture.png) |
| Profile picture (dark version, backup) | [`../exports/profile/profile-picture-dark.png`](../exports/profile/profile-picture-dark.png) |
| Highlight covers (10, icons only, shared by both languages) | `../exports/highlights/01-start.png` … `10-reviews.png` |
| Launch posts (9 pairs = 18 posts) | `../exports/posts/01-support/en/` and `…/ar/` … `../exports/posts/09-intro/en/` and `…/ar/` |
| Reels (optional, one per post and language) | `../exports/reels/01-support-en.mp4` … `09-intro-ar.mp4`, each with a `-cover.jpg` |

Each post folder (`NN-slug/en/` or `NN-slug/ar/`) holds one carousel:

- `01-hero.mp4`: the first slide, an 8-second animated hero that loops seamlessly (1080×1350, H.264, no sound).
- `01-cover.png`: the video's first frame as a still image (identical to frame 0). That frame is the finished design, so the grid thumbnail is never blank, and you can post the still instead of the video if you prefer.
- `02.png`, `03.png` …: the static slides that follow (icon cards, steps, the call to action).

How to post them, with captions and alt text in both languages, is in [`03-launch-posts.md`](03-launch-posts.md).

All of these are made from your own logo files in [`../brand/logo/source/`](../brand/logo/source/). The profile picture shows the colour symbol only (the same symbol as [`Crapto Studio-09.png`](../brand/logo/source/Crapto%20Studio-09.png)). The build cuts it from your main logo file, [`Crapto Studio-08.png`](../brand/logo/source/Crapto%20Studio-08.png).

**A file is missing?** Everything in `exports/` is generated. `npm run build` makes the logo crops and every still (profile picture, highlight covers, post covers and slides, previews). `npm run motion` makes the hero videos and Reels; it is slow (about a minute per video, 36 videos). `npm run check` checks the text contrast on every hero cover (feed and Reel) and every text slide, in both languages. `npm run render` alone remakes the stills after a text change in `content.mjs`.

### Information to prepare

These are placeholders in this guide. Fill them in with real details. Leave out anything you don't have yet.

| Placeholder | What to put there |
|---|---|
| `[your business email]` | The email you want clients to use |
| `[your website link]` | Your website home page |
| `[your portfolio link]` | A page with your real projects |
| `[your project brief form link]` | A short form where people describe their project |
| `[your booking link]` | A calendar link for calls (optional) |
| `[your mentoring request form link]` | A form for students and teams (optional) |

The same placeholders appear inside the Arabic replies, so one search-and-replace fills both languages. Ideally the forms and pages work in Arabic too (see [section 6](#6-links-up-to-5)).

**Copy Arabic, don't retype it.** Copy Arabic text from this page (or from [`../design/content.mjs`](../design/content.mjs)). That keeps the exact spelling, the Arabic quotation marks « » and the invisible direction marks explained in [section 4](#4-bio). A few Arabic lines on this page end with the same kind of invisible mark, so they display in the right order here; it does no harm when pasted. Some Markdown viewers still show mixed Arabic/English lines in code blocks in a slightly odd order (for example a full stop on the wrong side). The text itself pastes correctly, so judge the result on your phone.

---

## 1) Account type: Professional → Business

**Do this:** Profile → menu (☰) → **Account type and tools** → **Switch to professional account** → pick a category (see [section 3](#3-category)) → choose **Business**.

**Why Business:**

| You get | Why it matters for Crapto Studio |
|---|---|
| Contact buttons (Email, Call, and others) | Clients can reach you in one tap |
| A category label under your name | Makes clear right away that you are a tech studio |
| Insights (reach, profile visits, link taps, followers) | You can see which posts bring real enquiries, and which language your audience uses |
| Saved replies and FAQ questions in DMs | Faster, consistent answers in both languages (see [section 9](#9-dm-setup)) |
| Works with scheduling and automation tools | Most of these tools need a professional account |

Good to know:

- A Business account is always public. You can't set it to private.
- Business accounts may get a smaller music library for Reels (mostly royalty-free tracks). For a studio this is fine: the hero videos are silent, so use your own audio or the free library if you want sound.

**Facebook Page (optional):** during setup, Instagram may ask you to connect a Facebook Page. You can skip this. Connect one later if you want to:

- manage messages and schedule posts from Meta Business Suite on a computer (some features work best with a linked Page),
- run ads later,
- use a third-party tool that asks for a linked Page.

If you create a Page, use the same name ("Crapto Studio"), the same profile picture and the same bio wording.

---

## 2) Username and Name

Instagram has two different fields:

- **Username** = your @handle and profile link (instagram.com/craptostudio).
- **Name** = the bold text on your profile. It is **searchable**, so it should include keywords people actually search for.

All lengths in this guide are counted with Node (Unicode code points, spaces, line breaks and invisible marks included).

### Username options (max 30 characters)

| Option | Length | Notes |
|---|---|---|
| **craptostudio** | 12 | **Recommended.** Matches the company name, easy to say and type, no dots. |
| crapto.studio | 13 | Reads well, but people often forget the dot. |
| crapto_studio | 13 | Underscores are hard to say out loud. |
| craptostudio.dev | 16 | Good backup if the first is taken. "dev" signals software. |
| craptostudio.tech | 17 | Another backup. |

Usernames can use letters, numbers, full stops (periods) and underscores only, so the username is the same for both languages.

### Name field options (keep it max 30 characters)

| Option | Length | Notes |
|---|---|---|
| **Crapto Studio \| Games·Apps·AI** | 29 | **Recommended.** Name + three top search words. This is `profile.name` in [`content.mjs`](../design/content.mjs), shown in the mockup. |
| Crapto Studio \| Games & Apps | 28 | Simpler, no AI keyword. |
| Crapto Studio \| Software & AI | 29 | For a more business/B2B focus. |
| Crapto Studio \| Unity·Apps·AI | 29 | "Unity" helps game-dev searches. |
| Crapto Studio \| ألعاب وتطبيقات | 30 | Arabic keywords ("games and apps"), if most of your audience searches in Arabic. Exactly at the limit. |

The "·" is a middle dot, not a full stop. Copy the recommended Name from here:

```
Crapto Studio | Games·Apps·AI
```

Why keywords in the Name: they help people find you in search, and they show in one glance that Crapto Studio builds games, apps and AI. The Name has no room for both languages, so the Arabic keywords live in the bio instead ([section 4](#4-bio)). Whatever you pick, "Crapto Studio" stays in Latin letters.

> **Pick once.** Instagram limits how often you can change the Name field (at the time of writing: 2 changes within 14 days). Choose carefully before you save.

---

## 3) Category

| | Category | Why |
|---|---|---|
| **Recommended** | **Software Company** | Covers apps, software and AI, and reads as a tech business. This is `profile.category` in [`content.mjs`](../design/content.mjs). |
| Alternative | Information Technology Company | Use it if "Software Company" isn't offered in your app. |

Type "software" in the category search to find it. The category list changes from time to time. You pick one category for the whole account; Instagram may show its label in each visitor's app language.

**Show it on the profile:** Edit profile → **Profile display** → turn on **Category label**.

---

## 4) Bio

Bios can be up to 150 characters. The recommended bio holds both languages. Below it are two alternatives, for an account that leans English or leans Arabic. Lengths are counted with Node (Unicode code points, line breaks and invisible marks included).

### Recommended: bilingual (140 characters)

```
Ideas, compiled. 💻 أفكارك، جاهزة للتشغيل
Games · Apps · Software · AI
ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي
👇 DM "START" · راسلنا «ابدأ»‏
```

This is `profile.bio` in [`../design/content.mjs`](../design/content.mjs) (its four lines joined with line breaks), and it is what the profile mockup shows. If you change the wording, change it there too and run `npm run render`, so the mockup matches.

| Line | What it does |
|---|---|
| `Ideas, compiled. 💻 أفكارك، جاهزة للتشغيل` | The brand line in both languages, the same words as the headline of the `09-intro` post. 💻 says "tech" at a glance. |
| `Games · Apps · Software · AI` | The four main services in plain English words. |
| `ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي` | The same four services in Arabic, with the same words as the posts. |
| `👇 DM "START" · راسلنا «ابدأ»‏` | One action, with each language's keyword. The 👇 points to your link. Ends with an invisible mark (below). |

### The invisible mark after «ابدأ»

The last line ends with an invisible **right-to-left mark** (Unicode U+200F, "RLM") straight after «ابدأ». It is there on purpose:

- That line starts in English, so phones lay it out left to right. Without the mark, the closing **»** drifts to the wrong side of the Arabic, away from the word, and the keyword looks broken.
- The mark tells the phone the » belongs to the Arabic, so «ابدأ» looks exactly like it does on the posts.
- It counts as 1 character: 139 visible characters + 1 mark = 140.

Copying the code block above (or the line in `content.mjs`) keeps the mark. Some notes apps and messengers strip invisible characters, so after pasting, check the last line on your phone. If the » has jumped, paste again from a computer (instagram.com → **Edit profile**), or copy the bio straight from this file.

### Alternative: English-first (143 characters)

For an account where most followers read English. It keeps the full English service list and the Arabic keyword, so Arabic speakers still know how to reach you. The last line is the same as in the recommended bio, invisible mark included.

```
Ideas, compiled. 💻
Unity games · iOS & Android apps · Software · Custom AI
Interactive content & project upgrades
👇 DM "START" · راسلنا «ابدأ»‏
```

### Alternative: Arabic-first (123 characters)

For an account where most followers read Arabic. Arabic leads; the English services and keyword follow.

```
أفكارك، جاهزة للتشغيل 💻
ألعاب · تطبيقات · برمجيات · ذكاء اصطناعي
Games · Apps · Software · AI
👇 راسلنا «ابدأ» · DM "START"‎
```

Here the last line starts in Arabic, so it runs right to left. It ends with the mirror-image mark, an invisible **left-to-right mark** (U+200E, "LRM") after `"START"`. Without it, the closing quotation mark of "START" jumps to the wrong side.

### Why the bilingual bio is recommended

- **Both audiences understand it at a glance.** English and Arabic visitors both see the brand line, the services and the keyword in their own language, matching the two versions of every post.
- **Tagline first.** "Ideas, compiled." / «أفكارك، جاهزة للتشغيل» is the brand line. It is also the headline of the intro post, so people remember it.
- **Every main service in plain words.** Games, apps, software and AI are written as words, not emoji, in both languages. Nobody mistakes what Crapto Studio does (see the [brand guide](../brand/brand-guide.md#how-not-to-be-mistaken-for-a-crypto-account)).
- **One clear action.** "START" and «ابدأ» are the same keywords used on the posts' last slides and in your DM replies ([section 9](#9-dm-setup)).
- **Room to spare.** 140 of 150 characters.

### Character count note

Instagram's own counter may count each emoji as 2 characters. So the app may show about 142 for the recommended bio, about 145 for English-first and about 125 for Arabic-first. All are under 150, but check the counter before you save.

**Line breaks:** paste the bio in the app (or on instagram.com). If the line breaks disappear, add them by hand.

**Alignment:** depending on the phone, the Arabic line may sit on the right or on the left. Both are fine. What matters is that each line reads in the right order: check the keyword line on a phone.

---

## 5) Profile picture

**Upload:** [`../exports/profile/profile-picture.png`](../exports/profile/profile-picture.png)
**Backup (dark version):** [`../exports/profile/profile-picture-dark.png`](../exports/profile/profile-picture-dark.png)

**Why symbol only (no wordmark):**

- On phones the profile picture shows at about 110 px wide. Next to stories and comments it is even smaller.
- At that size the "Crapto Studio" wordmark is too small to read. The symbol stays clear.
- Your name is already written in bold right next to the picture.
- The symbol has no words, so it works for both languages.

**Check it in the circle:**

1. Upload it, then look at your profile on a phone.
2. The whole symbol should sit inside the circle, with the orange sparks not cut off.
3. Look at a comment you posted and a story you shared. The symbol should still be clear at that small size.
4. If it looks too busy on light or dark mode, try the dark version.

Use the same picture on your other channels (Facebook Page, WhatsApp Business, etc.) so people recognise you.

---

## 6) Links (up to 5)

Edit profile → **Links** → **Add external link**. Each link can have a short title.

The **first link** shows on your profile; the others are one tap away. Put the most important one first.

| # | Title | Bilingual title (optional) | Points to | Why |
|---|---|---|---|---|
| 1 | Start a project | `Start a project · ابدأ مشروعك` (29) | `[your project brief form link]` | Main goal of the profile: new projects |
| 2 | Portfolio | `Portfolio · أعمالنا` (19) | `[your portfolio link]` | Proof of real work |
| 3 | Website | `Website · موقعنا` (16) | `[your website link]` | Full info about Crapto Studio |
| 4 | Book a call | `Book a call · احجز مكالمة` (25) | `[your booking link]` | For people who prefer to talk |
| 5 | Students & teams | `Students & teams · للطلاب والفرق` (32) | `[your mentoring request form link]` | Keeps mentoring requests separate from client projects |

**For Arabic-speaking visitors:**

- **Link titles can be bilingual.** Use the "Bilingual title" column if you went with the bilingual bio. Put the English first and the Arabic last, and add no punctuation after the Arabic (punctuation at the end of a mixed line can jump to the wrong side). Keep titles short: if the app cuts a title off, use one language, the same one as your highlight labels ([section 8](#8-story-highlights)).
- **The pages behind the links matter more than the titles.** An Arabic speaker who taps "ابدأ مشروعك" should land on a form they can fill in. Best: one form in both languages, or one form with a language switch. You only have 5 links, so avoid separate English and Arabic links for the same thing.
- If your forms are English-only for now, that's fine at launch. Arabic speakers can still DM «ابدأ» and get the Arabic reply ([section 9](#9-dm-setup)).

Tips:

- If you don't have a brief form yet, link 1 can point to the contact page on your website. Update it later. (People can still email you with the Email button, see [section 7](#7-contact-options-and-action-buttons).)
- If you have no portfolio yet, skip link 2. Don't link to an empty page.
- After saving, tap each link from a different phone to check it opens the right page.

---

## 7) Contact options and action buttons

Edit profile → **Contact options**:

| Option | Recommendation |
|---|---|
| Email | **Yes.** `[your business email]`. Adds an Email button. |
| Phone | Only if you want calls or texts from strangers. |
| Address | Skip, unless you have a real office where clients can visit. |
| WhatsApp | If your app offers it and you use WhatsApp Business, you can connect it. |

Edit profile → **Profile display** → turn on **Contact info** so the buttons show.

**Action buttons** (for example "Book now") work through partner booking services. If you already use a booking tool that Instagram supports, add "Book now" for calls. If not, skip it. The **Message** and **Email** buttons are enough. Instagram labels these buttons itself, in each visitor's app language.

---

## 8) Story highlights

Highlights sit under your bio and work like a menu. There are 10 covers. They are **icons only**, with no text, so the same 10 covers serve both languages. Use them in this order (left to right):

| Position | Highlight | Cover file | English label | Arabic label | Create in this order |
|---|---|---|---|---|---|
| 1 | Start | `../exports/highlights/01-start.png` | Start | ابدأ | 10th (last) |
| 2 | Work | `../exports/highlights/02-work.png` | Work | أعمالنا | 9th |
| 3 | Games | `../exports/highlights/03-games.png` | Games | ألعاب | 8th |
| 4 | Apps | `../exports/highlights/04-apps.png` | Apps | تطبيقات | 7th |
| 5 | AI | `../exports/highlights/05-ai.png` | AI | ذكاء اصطناعي | 6th |
| 6 | Software | `../exports/highlights/06-software.png` | Software | برمجيات | 5th |
| 7 | Interactive | `../exports/highlights/07-interactive.png` | Interactive | تفاعلي | 4th |
| 8 | Upgrades | `../exports/highlights/08-upgrades.png` | Upgrades | ترقية | 3rd |
| 9 | Support | `../exports/highlights/09-support.png` | Support | إرشاد | 2nd |
| 10 | Reviews | `../exports/highlights/10-reviews.png` | Reviews | آراء العملاء | 1st (or skip for now, see [No reviews yet?](#what-to-put-in-each-highlight)) |

Both label columns come from `highlights` in [`../design/content.mjs`](../design/content.mjs) (`label.en` and `label.ar`).

### Which label language?

A highlight has one name, so pick **one language for all 10 labels**. Don't mix languages in the row.

- **Default: English labels.** They are short, they match the profile mockup, and they match the English-first order of the Name field. The longest is "Interactive" (11 characters).
- **Arabic labels** if most of your audience reads Arabic (check Insights after the first weeks), or if you chose the Arabic-first bio.
- **Length:** under the circle, only about the first 10–12 characters show, depending on the phone and the letters. Two Arabic labels are 12 characters: «ذكاء اصطناعي» and «آراء العملاء». Check them on your phone. If one is cut off, use "AI" for the AI highlight (widely understood in Arabic too) and «آراء» for Reviews.

You can rename a highlight later without changing its stories or its position.

### Important: create them in reverse order

New highlights appear at the **front** (left). So create **Reviews first** (or **Support** first if you skip Reviews) and **Start last**. Then Start ends up first in the row.

Adding a new story to an existing highlight usually moves it to the front too. After each update, check the order. If one has moved, add a new story to the highlights in reverse order again, or accept the new order.

### When to create them

Create the highlights **after all 18 launch posts are live** and shared to your story. Don't create each highlight on the day you share its post: the posting order is different from the highlight order, so the row would end up mixed.

Your stories stay in your story archive after 24 hours, so you can add them to highlights later.

### How to create each highlight

1. Make sure Story archive is on (Settings → **Archiving and downloading**). It is on by default.
2. Save the 10 cover images from `../exports/highlights/` to your phone.
3. Post the stories (for example, share each launch post to your story, in both languages).
4. On your profile, tap **New** (the + circle under the bio) → pick the stories from your archive (the English and the Arabic one) → type the label.
5. Tap **Edit cover** → choose the cover image from your camera roll → zoom so the icon sits in the middle of the circle.
6. Repeat in the "Create in this order" column order, then check the row on your profile.

### What to put in each highlight

At launch, share each launch post to your story (paper plane icon → **Add to story**) on the day you publish it. That's 18 stories: every post in English and in Arabic. When all 18 are live, add **both versions** to their highlight (see [When to create them](#when-to-create-them)). Add the English story first, then the Arabic one, the same order you posted them. Add real stories over time, in either language or both.

For stories with text, the lines below are ready in both languages. Use one story per language, or both on one story (English on top, Arabic below).

**1. Start** — how to work with Crapto Studio.
- Share launch post `07-start` (the 4 steps), English and Arabic.
- A story with the "Send us this first" list and the keyword:
  - EN: Send us this first: your idea in one line · who it's for · your deadline · your budget range. DM "START".
  - AR: أرسل لنا هذه أولاً: فكرتك في سطر واحد · جمهورك المستهدف · موعدك النهائي · ميزانيتك التقريبية. راسلنا بكلمة «ابدأ».‏
- A link sticker to `[your project brief form link]`, with the text "Start a project" or «ابدأ مشروعك».

**2. Work** — real finished projects.
- At launch, before you have project posts: share launch post `09-intro` (who we are and what we build), English and Arabic. Replace it once you have real work.
- Screen recordings or screenshots of real projects (with the client's permission).
- A link sticker to `[your portfolio link]` ("Portfolio" / «أعمالنا»).

**3. Games** — Unity games and game projects.
- Share launch post `08-games`, English and Arabic.
- A short gameplay clip from a real project.
- A work-in-progress clip: "Today we built the jump mechanic." / «اليوم بنينا آلية القفز»

**4. Apps** — iOS and Android apps.
- Share launch post `06-apps`, English and Arabic.
- A screen recording of an app you built.
- A before/after of a screen design.

**5. AI** — custom AI solutions.
- Share launch post `05-ai`, English and Arabic.
- A short demo of an AI assistant or automation (use test data, not client data).
- A tip story: "When you don't need AI." / «متى لا تحتاج إلى الذكاء الاصطناعي؟»

**6. Software** — custom software and tools.
- Share launch post `04-software`, English and Arabic.
- A dashboard or tool walkthrough (blur any private data).
- "Spreadsheet → real system" / «من جدول بيانات إلى نظام حقيقي»: a before/after from a real project.

**7. Interactive** — interactive content and presentations.
- Share launch post `02-interactive`, English and Arabic.
- A clip of an interactive presentation, quiz or kiosk in use.
- Behind the scenes of building one.

**8. Upgrades** — improving existing projects.
- Share launch post `03-upgrades`, English and Arabic.
- A before/after of a fix or redesign (use only real numbers if you show speed or size).
- A short list of what changed in an update.

**9. Support** — mentoring for students, projects and competitions. The student does the work; you guide.
- Share launch post `01-support`, English and Arabic.
- A story:
  - EN: Students & teams: send us your project, your deadline and where you're stuck.
  - AR: للطلاب والفرق: أرسلوا لنا مشروعكم وموعدكم النهائي والنقطة التي تعثّرتم عندها.‏
- A question sticker: "What are you building for your next competition?" / «ماذا تبني لمسابقتك القادمة؟»

**10. Reviews** — real client feedback only.
- A screenshot of a real message from a client (ask permission first, hide private details).
- A short quote on a branded background: `[add a real client quote]`.
- A video from a client about their project (if they agree).
- Show each review in the language the client wrote it in. If you add a translation, mark it as a translation and ask the client to approve it.

> **No reviews yet?** Don't fake one. Two honest options:
>
> 1. **Recommended:** skip Reviews at launch. Create it when you get the first real review. It will appear at the **front**. To move it to the end, add one new story (a short update or a re-shared post) to each of the other highlights in reverse order: Support first, Start last.
> 2. Create it at launch with one honest story in both languages, for example:
>    - EN: First projects in progress. Real client reviews will appear here.
>    - AR: مشاريعنا الأولى قيد التنفيذ. ستظهر هنا آراء عملائنا الحقيقية.‏
>
>    This keeps the order right from day one.

---

## 9) DM setup

### Reply in the language they write in

Messages will arrive in English and in Arabic. Answer in the language the person used. If they mix both, follow the language of most of their message. Each saved reply below comes in both languages.

### Saved replies

Find **Saved replies** (Settings → **Business tools and controls** → Saved replies, or search "saved replies" in Settings). Each reply has a short **shortcut** word. When you type the shortcut in a chat, Instagram suggests the full reply.

Saved replies don't send by themselves. When someone DMs "START", open the chat, type `start` and tap the suggested reply. When someone DMs «ابدأ», type `arstart`. (To answer automatically, see [comment-to-DM automation](#optional-comment-to-dm-automation) below.)

**Shortcuts:** the English replies use `start`, `price`, `time`, `mentor`, `scope`. The Arabic ones use the same words with `ar` in front: `arstart`, `arprice`, `artime`, `armentor`, `arscope`. Latin shortcuts are easy to type and sort together in the list. If your app accepts Arabic shortcuts and you usually type with an Arabic keyboard, you can use Arabic words instead (for example `ابدأ`).

Edit the replies to sound like you. Don't promise response times or prices you can't keep. Keep "Crapto Studio" in Latin letters in both languages.

**1. START / «ابدأ» keyword** — shortcuts: `start` and `arstart`

```
Hi! Thanks for reaching out to Crapto Studio 👋
To get started, send us:
1. What you want to build (one sentence is fine)
2. Who it's for
3. Your deadline
4. Your budget range
5. Links or apps you like

We'll read it and come back to you with questions or next steps.
Prefer a form? [your project brief form link]
```

```
أهلاً بك، وشكراً لتواصلك مع Crapto Studio 👋
لنبدأ، أرسل لنا:
1. فكرتك في سطر واحد: ماذا تريد أن تبني؟
2. جمهورك المستهدف: لمن هذا المشروع؟
3. موعدك النهائي
4. ميزانيتك التقريبية
5. روابط أو تطبيقات تعجبك

سنقرأ رسالتك ونعود إليك بأسئلتنا أو بالخطوات التالية.
إن كنت تفضّل النموذج، فهذا رابطه:
[your project brief form link]
```

**2. Pricing question** — shortcuts: `price` and `arprice`

```
Good question! Every project is different, so we don't have one fixed price.
After a short chat about what you need, we send a clear quote and timeline before any work starts.
To get a quote, tell us:
• what you want to build
• your deadline
• your budget range
If something isn't worth building, we'll tell you.
```

```
سؤال مهم! كل مشروع يختلف عن غيره، لذلك ليس لدينا سعر ثابت واحد.
بعد محادثة قصيرة نفهم فيها ما تحتاجه، نرسل لك عرض سعر واضحاً وجدولاً زمنياً قبل أن يبدأ أي عمل.
لتحصل على عرض سعر، أخبرنا بما يلي:
• ما الذي تريد أن تبنيه
• موعدك النهائي
• ميزانيتك التقريبية
وإن وجدنا جزءاً لا يستحق البناء، فسنخبرك بذلك بصراحة.
```

**3. Timeline question** — shortcuts: `time` and `artime`

```
It depends on the size of the project.
Once we understand what you need, we send a clear timeline with milestones.
During the build you see real progress every week, not just status updates.
What's your deadline? Tell us and we'll say honestly if it's realistic.
```

```
يعتمد ذلك على حجم المشروع.
بعد أن نفهم ما تحتاجه، نرسل لك جدولاً زمنياً واضحاً بمراحل محدّدة.
وخلال البناء ترى تقدّماً حقيقياً كل أسبوع، لا مجرد تقارير عن سير العمل.
ما موعدك النهائي؟ أخبرنا به، وسنقول لك بصراحة إن كان واقعياً.
```

**4. Student / competition support** — shortcuts: `mentor` and `armentor`

```
Happy to help with your project or competition!
We offer mentoring, debugging and code review sessions, and competition/hackathon prep.
You write the code. We guide you and explain the "why", so you can present the work with confidence.
We don't do the work for you: it stays yours and follows your school or competition rules.
Send us:
• the project or competition
• your deadline
• the language/tools you use
• where you're stuck
[your mentoring request form link]
```

```
يسعدنا أن نساعدك في مشروعك أو مسابقتك!
نقدّم جلسات إرشاد، وجلسات لتصحيح الأخطاء ومراجعة الكود، والتحضير للمسابقات والهاكاثونات.
أنت تبرمج، ونحن نرشدك ونشرح لك السبب وراء كل خطوة، لتعرض عملك بثقة.
لا ننجز العمل نيابةً عنك: يبقى المشروع مشروعك، ويلتزم بقواعد مدرستك أو جامعتك أو المسابقة.
أرسل لنا:
• المشروع أو المسابقة
• موعدك النهائي
• لغة البرمجة والأدوات التي تستخدمها
• النقطة التي تعثّرت عندها
[your mentoring request form link]
```

**5. "Do you do X?" (not offered)** — shortcuts: `scope` and `arscope`

```
Thanks for asking! [the thing they asked about] isn't something we do at Crapto Studio.
What we do: Unity games, iOS & Android apps, software, custom AI, interactive content and presentations, upgrades to existing projects, and mentoring for programming projects and competitions.
If your idea touches any of these, we'd be happy to talk.
```

```
شكراً على سؤالك! [الخدمة المطلوبة] ليست من الخدمات التي نقدّمها في Crapto Studio.
ما نقدّمه: ألعاب Unity، وتطبيقات iOS و Android، وبرمجيات مخصّصة، وحلول ذكاء اصطناعي، ومحتوى تفاعلي وعروض تقديمية، وترقية المشاريع القائمة، وإرشاد في المشاريع البرمجية والمسابقات.
إن كانت فكرتك قريبة من أيٍّ من هذه، يسعدنا أن نتحدّث معك.
```

In the Arabic version, replace `[الخدمة المطلوبة]` with the name of what they asked about, in Arabic.

**Someone thinks the name means crypto?** Don't use reply 5 for this. Use the short ready reply from the [brand guide](../brand/brand-guide.md#how-not-to-be-mistaken-for-a-crypto-account), so every answer is the same. You can save it too (for example as `nocrypto` and `arnocrypto`):

```
Fair question! No crypto here 🙂 Crapto Studio is a tech studio: we build games, apps, software and custom AI.
```

```
سؤال في محلّه! لا علاقة لنا بالعملات الرقمية 🙂 Crapto Studio استوديو تقني: نبني الألعاب والتطبيقات والبرمجيات وحلول الذكاء الاصطناعي المخصّصة.
```

If the brand guide has its own Arabic wording for this reply, use that one, so both places say the same thing.

### Keyword replies: START and «ابدأ»

Every launch post ends with the keyword: **"START"** on the English posts, **«ابدأ»** on the Arabic ones. Treat both as the same request:

| They send | Reply with |
|---|---|
| START, Start, start | Saved reply 1 in English (`start`) |
| The Arabic keyword «ابدأ», or a common spelling of it: ابدا، إبدأ، ابدء | Saved reply 1 in Arabic (`arstart`) |
| "START" inside an otherwise Arabic message | The Arabic reply (`arstart`): follow their language |

Before launch, test both from a second account: send "START", reply with `start`; send «ابدأ», reply with `arstart`. Check that the Arabic reply reads right to left and the numbered list looks right.

### FAQ questions (ice breakers)

Professional accounts can show a few questions (up to 4 at the time of writing) when someone opens a new chat with you. People tap a question instead of typing. Find **Frequently asked questions** in the same business tools area.

If your app lets you add an automatic answer to each question, paste the reply text there. If not, answer by hand with the saved reply shortcut.

All four questions, in both languages:

| # | English question | Arabic question | Answer with |
|---|---|---|---|
| 1 | I have an idea. How do I start? | لديّ فكرة. كيف أبدأ؟ | Saved reply 1 (`start` / `arstart`) |
| 2 | How much does a project cost? | كم تبلغ تكلفة المشروع؟ | Saved reply 2 (`price` / `arprice`) |
| 3 | Can you improve an app or game I already have? | هل يمكنكم ترقية تطبيقي أو لعبتي الحالية؟ | Short answer below + ask for a link and what's wrong |
| 4 | Do you help students and competition teams? | هل ترشدون الطلاب وفرق المسابقات؟ | Saved reply 4 (`mentor` / `armentor`) |

**With 4 slots and two languages,** use questions 1 and 4 in both languages: `I have an idea. How do I start?`, `لديّ فكرة. كيف أبدأ؟`, `Do you help students and competition teams?` and `هل ترشدون الطلاب وفرق المسابقات؟`. That covers both audiences (clients and students) in both languages, and the question someone taps tells you which language to answer in. Price and upgrade questions still come in as normal messages; answer them with the saved replies. If you get mostly client enquiries and few students, swap the two mentoring questions for the two price questions.

For question 3, a suggested answer:

```
Yes! We fix bugs, improve speed, add new features and refresh the design of existing apps, games and software.
Send us a link or a short description, what's not working, and what you'd like to add.
```

```
نعم، وهذا ما نسمّيه «ترقية»: نصلح الأخطاء، ونحسّن السرعة، ونضيف ميزات جديدة، ونجدّد تصميم التطبيقات والألعاب والبرمجيات القائمة.
أرسل لنا رابطاً أو وصفاً قصيراً، وأخبرنا بما لا يعمل كما ينبغي، وبما تودّ إضافته.
```

### Optional: comment-to-DM automation

The posts end with the keyword: "DM us START" on the English posts, «راسلنا بكلمة ابدأ» on the Arabic ones. You can also invite people to **comment** the keyword and send them the reply automatically. Third-party tools that connect to Instagram can do this. Meta's own tools may also offer some automations: check what your account has before you pay for a tool.

If you use one:

- Choose a tool that connects through the official Instagram/Meta login. Never give a tool your password.
- Some tools need a Business account and a linked Facebook Page.
- Set up **two keywords**: START (English reply) and ابدأ (Arabic reply). If the tool matches exact words, add the common spellings too (Start, start; ابدا، إبدأ، ابدء).
- Send one useful message (saved reply 1 in the matching language), not a series of messages.
- Reply to the comment publicly too, in the commenter's language ("Sent you a DM!" / «أرسلنا لك رسالة») so others see it works.
- Test both keywords from a second account before you announce it.

---

## 10) Pinned posts

You can pin up to 3 posts to the top of your grid.

### Pinning reorders the grid

Pinned posts always sit in the top row, in front of everything else. A pinned post leaves its normal spot, and the posts after it move up to fill the gap. So **pinning anything that isn't already in the top row changes the launch grid** (compare with [`../exports/preview/grid.png`](../exports/preview/grid.png): 18 tiles, 6 rows).

- **Pin only after all 18 posts are live.**
- **Unpin any old pinned posts first**, or they will sit on top of the launch grid.
- The most recently pinned post usually shows first (top-left). So pin the right-hand post first and the left-hand post last.
- After pinning, check the top row. If the order looks wrong, unpin and pin again in a different order.
- Reels appear in the grid too, unless your app offers an option to keep a Reel off the profile grid. During launch, post the Reels only if you can keep them off the grid, or wait until all 18 posts are live.

Without pins, the top two rows of the launch grid are (newest first, so each Arabic post sits just before its English twin):

| Row | Left | Middle | Right |
|---|---|---|---|
| 1 | `09-intro/ar` | `09-intro/en` | `08-games/ar` |
| 2 | `08-games/en` | `07-start/ar` | `07-start/en` |

### At launch: two good options

**Option 1: keep the grid exactly as designed (safest on launch day).** Pin the top row as it already is: `09-intro/ar`, `09-intro/en`, `08-games/ar`. Nothing moves.

- Pin order: `08-games/ar` first, then `09-intro/en`, then `09-intro/ar` last.

**Option 2: intro in both languages + how to start (recommended once the launch is complete).** Pin `09-intro/ar`, `09-intro/en` and **one** `07-start`: the one in the language most of your enquiries arrive in. Not sure yet? Pin `07-start/en` (it matches the English labels and the English-first Name); switch to `07-start/ar` if you chose Arabic labels or the Arabic-first bio, or once Insights shows most of your audience reads Arabic.

- Pin order: the `07-start` post first, then `09-intro/en`, then `09-intro/ar` last.
- What changes: only rows 1 and 2. Row 1 becomes `09-intro/ar`, `09-intro/en`, `07-start/…`. Row 2 becomes `08-games/ar`, `08-games/en`, and the other `07-start`. Rows 3 to 6 stay as designed.

| Pin | Why |
|---|---|
| `09-intro/ar` — «أفكارك، جاهزة للتشغيل» | Who Crapto Studio is, for Arabic speakers. Top-left: the first post visitors see. |
| `09-intro/en` — "Ideas, compiled." | The same for English speakers. |
| `07-start` — "New project? Here’s the plan." / «مشروع جديد؟ هكذا نبنيه» | How to start and what to send. |

You can't pin every post in both languages, and you don't need to: the other language is one row down, and you can re-share it to stories any time.

### When to swap for real work

Long term, the three pins should be: one "who we are" post, one "how to start" post, and your best real work.

| When | Pins (left to right) |
|---|---|
| Launch, option 1 | `09-intro/ar` · `09-intro/en` · `08-games/ar` |
| Launch, option 2 | `09-intro/ar` · `09-intro/en` · `07-start` (main language) |
| You post your **first real project** (case study, demo, before/after) | Project post · `09-intro` (main language) · `07-start` (main language) |
| You have **2 or more real project posts** | Best project · second-best project · `07-start` (main language) |

Keep `07-start` pinned the longest. It explains how to begin. Replace it only with a better "how to work with us" post. If a project post exists in both languages, pin the one in your main language.

Every new post after launch moves the unpinned posts one square along, so the English/Arabic pairs shift across rows. That's normal; don't hold back new content to protect the pattern.

Review your pins about every 3 months, or each time you publish a project you're proud of.

---

## 11) Launch checklist

### Account

- [ ] Switched to Professional → **Business**
- [ ] Facebook Page connected (optional) or skipped on purpose
- [ ] Username set: **@craptostudio** (or your chosen handle)
- [ ] Name set: **Crapto Studio | Games·Apps·AI** (or your chosen option, max 30 characters)
- [ ] Category set: **Software Company**, category label shown

### Profile

- [ ] Bio pasted (recommended bilingual bio, or one of the alternatives), counter checked: under 150 characters, line breaks correct
- [ ] Keyword line checked on a phone: «ابدأ» and "START" look like they do on the posts, no quotation mark has jumped to the wrong side (the invisible mark survived the paste)
- [ ] Profile picture uploaded: `../exports/profile/profile-picture.png`
- [ ] Profile picture checked in the circle, in comments and in stories
- [ ] Links added in order (English or bilingual titles), all tested from another phone
- [ ] Linked forms checked: Arabic speakers can fill them in, or you rely on the «ابدأ» DM for now
- [ ] All placeholders replaced with real links and details (or removed), in the English and the Arabic replies
- [ ] Email contact button on, contact info shown on profile

### DMs

- [ ] 10 saved replies added: `start`, `price`, `time`, `mentor`, `scope` (English) and `arstart`, `arprice`, `artime`, `armentor`, `arscope` (Arabic)
- [ ] Crypto ready reply saved in both languages (optional)
- [ ] 4 FAQ questions added (recommended: "How do I start?" and the students question, each in English and Arabic)
- [ ] Tested from a second account: sent "START" and replied with `start`; sent «ابدأ» and replied with `arstart`; both messages look right (the Arabic reads right to left)
- [ ] Comment-to-DM automation set up with both keywords and tested (optional)

### Posts and highlights

- [ ] Old pinned posts unpinned (if the account had any)
- [ ] 18 launch posts published, pair by pair: `01-support` English, then `01-support` Arabic … `09-intro` English, then `09-intro` Arabic last
- [ ] Every post starts with its hero video (`01-hero.mp4`, or the still `01-cover.png` if you post an image instead), then the slides `02.png` …; the grid thumbnails show the finished design, not a blank frame
- [ ] Reels held back until all 18 posts are live, or posted with the "keep off the grid" option (only if your app offers it)
- [ ] All 18 launch posts shared to stories (English and Arabic)
- [ ] Highlight label language chosen: all English or all Arabic
- [ ] Reviews highlight: skipped until a real review exists, or created first with an honest placeholder story in both languages
- [ ] Highlights created after all 18 posts are live, in reverse order (Reviews if used → Support → … → Start last), each with its cover from `../exports/highlights/` and both language versions of its launch post
- [ ] Highlight order checked on the profile: Start, Work, Games, Apps, AI, Software, Interactive, Upgrades, Support, then Reviews (if created); no label cut off
- [ ] Pins set: option 1 (`08-games/ar`, then `09-intro/en`, then `09-intro/ar`) or option 2 (`07-start` in your main language, then `09-intro/en`, then `09-intro/ar`); top row checked

### Final check

- [ ] Looked at the full profile on a phone and compared it with `../exports/preview/profile-mockup.png`
- [ ] Checked the grid against `../exports/preview/grid.png` (18 tiles, 6 rows, each Arabic post just before its English twin)
- [ ] Asked a friend who reads English and a friend who reads Arabic to open the profile and say in one sentence what Crapto Studio does
