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
design/                     the code that generates exports/
  content.mjs               ALL text, English and Arabic
  scenes/                   one animated hero scene per post
  motion/                   the animation stage, UI kit and video renderer
```

## Editing and regenerating

Everything is generated from code, so text changes don't need a design tool.

- **Change text (either language):** edit `design/content.mjs`. Wrap a word in `*asterisks*` to accent it; `\n` forces a line break.
- **Change an animation:** edit its scene in `design/scenes/`. Scenes follow a loop contract (frame 0 is the finished composition; the last frame returns to it). The [brand guide](brand/brand-guide.md) explains the motion rules.
- **Change colours or fonts:** edit `design/tokens.mjs` / `design/fonts.mjs`.

```bash
npm install
npx playwright install chromium   # first time only (ffmpeg comes from the ffmpeg-static package)
npm run build                     # logo crops + every still (covers, slides, highlights, previews)
npm run motion                    # every hero video and Reel (slow: about a minute per video)
npm run check                     # text contrast on every cover and slide, both languages
```

Useful while working on one post:

```bash
npm run motion -- ai --preview            # contact sheet of 8 frames per variant → .preview/
npm run motion -- ai --frame 5.5 --lang ar --format reel
npm run motion -- ai --loopcheck          # proves the loop is seamless
npm run motion -- ai --lang en --format feed
```

To add a post, add an entry to `posts` in `design/content.mjs` and a scene in `design/scenes/`. Slide types are `cards`, `steps`, `statement`, `services`, `image` (a screenshot or photo) and `cta`. A post with `slides: []` is a single video/image and its cover drops the "Swipe" hint.

## Credits

- Fonts: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [Alexandria](https://fonts.google.com/specimen/Alexandria) (Arabic) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), all SIL Open Font License.
- Icons: [Lucide](https://lucide.dev), ISC License.
- Animation: [GSAP](https://gsap.com) (free "Standard no-charge" license); video encoding with ffmpeg via [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static).
