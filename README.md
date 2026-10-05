# Crapto Studio: brand & Instagram kit

Everything needed to launch the **@craptostudio** Instagram account in **English and Arabic**: brand rules, profile copy, a content plan, and upload-ready animated posts built from the Crapto Studio logo.

> **Ideas, compiled.** · **أفكارك، جاهزة للتشغيل.**
> Games · Apps · Software · AI

![Profile preview](exports/preview/profile-mockup.png)

## Start here

| Step | Read | Upload |
|---|---|---|
| 1. Set up the profile | [instagram/01-profile-setup.md](instagram/01-profile-setup.md) | `exports/profile/profile-picture.png`, `exports/highlights/*.png` |
| 2. Publish the 18 launch posts (9 English + 9 Arabic) | [instagram/03-launch-posts.md](instagram/03-launch-posts.md) | `exports/posts/NN-<slug>/en/` then `…/ar/`, pairs 01 → 09 |
| 3. Publish the Reels and keep posting | [instagram/02-content-strategy.md](instagram/02-content-strategy.md), [instagram/04-idea-bank.md](instagram/04-idea-bank.md) | `exports/reels/*.mp4` |
| Brand rules (colours, fonts, logo, voice, Arabic, motion) | [brand/brand-guide.md](brand/brand-guide.md) | `exports/brand/brand-board.png` to share with designers |
| Edit posts and make new ones (also from your Claude Code projects) | [studio/README.md](studio/README.md) | `npm run studio` |

## The workspace

`npm run studio` opens a web workspace on your computer (http://localhost:4600): your grid, an editor with a live animated preview in both languages, and one-click rendering of images and videos.

It is connected to **Claude Code**. Pick any project you built with Claude Code (or one of its chats) and Claude turns it into a finished carousel in the brand's style, in English and Arabic. Or run `npm run connect` once and type **`/crapto-post`** inside Claude Code in any project. See [studio/README.md](studio/README.md).

## How a post works

Every post is published twice, once in English and once in Arabic (Modern Standard Arabic, right to left). Each one is a carousel:

1. **`01-hero.mp4`**: an 8-second animated hero that loops seamlessly (1080×1350, H.264). Its first frame is the finished composition, so the grid thumbnail is never blank. **`01-cover.png`** is that same frame as a still, if you'd rather post an image.
2. **`02.png`, `03.png` …**: short, visual slides (icon cards, steps) ending with a call to action.

Each hero also exists as a 9:16 **Reel** in `exports/reels/`, with a `-cover.jpg` for the Reel cover.

![Launch grid](exports/preview/grid.png)

## What's in the repo

```
brand/
  brand-guide.md            brand rules: positioning, voice (EN + AR), logo, colour, type, motion
  logo/source/              the original logo files (untouched)
instagram/
  01-profile-setup.md       name, bilingual bio, highlights, DM replies in both languages, checklist
  02-content-strategy.md    bilingual publishing, pillars, cadence, hashtags (EN + AR), first 30 days
  03-launch-posts.md        the 18 launch posts with captions, hashtags and alt text in both languages
  04-idea-bank.md           post ideas with English and Arabic hooks, motion ideas, Reel scripts
exports/                    upload-ready files (generated, see below)
  posts/NN-<slug>/en|ar/    01-hero.mp4, 01-cover.png, 02.png …   (1080×1350)
  reels/                    NN-<slug>-en|ar.mp4 + -cover.jpg      (1080×1920)
  profile/                  profile picture (white and dark versions), 1080×1080
  highlights/               10 story highlight covers (icons, shared by both languages), 1080×1920
  logo/                     trimmed logo, symbol and wordmark PNGs (colour/white/black)
  logo/parts/               the symbol split into body + petals (used by the animations)
  preview/                  profile mockup and grid preview
  brand/brand-board.png     one-page brand overview
content/
  posts/<slug>.json         every post: text (EN + AR), animation, slides, captions, alt text
  assets/<slug>/            screenshots and images used by a post
design/                     the code that generates exports/
  content.mjs               shared text: services, profile, highlights, default call to action
  scenes/                   the animated heroes: 9 service demos + 4 project showcases
  motion/                   the animation stage, UI kit and video renderer
studio/                     the workspace (npm run studio) and its Claude Code connection
```

## Editing and regenerating

Everything is generated from code, so text changes don't need a design tool.

- **Change a post (either language):** open it in the workspace (`npm run studio`), or edit `content/posts/<slug>.json`. Wrap a word in `*asterisks*` to accent it; `\n` forces a line break. Shared text (services, profile, highlights) is in `design/content.mjs`.
- **Change an animation:** edit its scene in `design/scenes/`. Scenes follow a loop contract (frame 0 is the finished composition; the last frame returns to it); see [design/scenes/README.md](design/scenes/README.md) and the motion rules in the [brand guide](brand/brand-guide.md).
- **Change colours or fonts:** edit `design/tokens.mjs` / `design/fonts.mjs`.

```bash
npm install
npx playwright install chromium   # first time only (ffmpeg comes from the ffmpeg-static package)
npm run build                     # logo crops + every still (covers, slides, highlights, previews)
npm run motion                    # every hero video and Reel (slow: about a minute per video)
npm run check                     # text contrast on every cover and slide, both languages
npm run studio                    # the workspace: edit, preview, render, generate with Claude Code
```

Useful while working on one post:

```bash
npm run motion -- ai --preview            # contact sheet of 8 frames per variant → .preview/
npm run motion -- ai --frame 5.5 --lang ar --format reel
npm run motion -- ai --loopcheck          # proves the loop is seamless
npm run motion -- ai --lang en --format feed
```

Every script takes post slugs too: `npm run render -- ai`, `npm run check -- ai games`.

To add a post, use **New post** in the workspace, ask Claude Code (`/crapto-post`), or add a `content/posts/<slug>.json` file. Slide types are `cards`, `steps`, `statement`, `services`, `image` (a screenshot or photo) and `cta`. A post with `slides: []` is a single video/image and its cover drops the "Swipe" hint.

## Credits

- Fonts: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [Alexandria](https://fonts.google.com/specimen/Alexandria) (Arabic) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), all SIL Open Font License.
- Icons: [Lucide](https://lucide.dev), ISC License.
- Animation: [GSAP](https://gsap.com) (free "Standard no-charge" license); video encoding with ffmpeg via [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static).
