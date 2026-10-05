# Scenes: the animated heroes

Every post opens with an 8-second animated hero. The **stage** (`../motion/stage.mjs`) draws the background, the brand row, the tag, the headline and the footer. The **scene** (one file in this folder) draws the animated picture in a 904 × 740 box above the headline. The stage scales that box for the feed (4:5) and the Reel (9:16).

There are two kinds of scene:

| Kind | Scenes | Content |
|---|---|---|
| Service demos | `ai`, `apps`, `games`, `interactive`, `intro`, `software`, `start`, `support`, `upgrades` | A fixed little story per service. A post can still change their on-screen text. |
| Project showcases | `showcase-phone`, `showcase-browser`, `showcase-code`, `showcase-stack` | Built to show **any** project: its name, features, screenshots, code or tech stack come from the post. These are the scenes the workspace and Claude Code use for project carousels. |

## The scene file

```js
import { ico, asset, gooFilter } from '../motion/ui.mjs';

export default {
  meta: {
    title: 'App on a phone',                       // shown in the workspace's scene picker
    description: 'What happens in the animation.',
    bestFor: 'Mobile apps, booking flows',
    // Optional notes per field, shown next to the inputs (and to Claude):
    fields: {
      copy: { name: 'App name, up to 18 characters' },
      data: { screens: { type: 'images', max: 3, description: 'Portrait screenshots' } },
    },
  },
  duration: 8,
  // Default on-screen text, in both languages. Same structure in en and ar.
  copy: { en: { name: 'Bookly' }, ar: { name: 'Bookly' } },
  // Default language-neutral settings: images, icons, code, numbers.
  data: { screens: [], icon: 'calendar' },
  css: (ctx) => `...`,                             // scoped by the scene's own class names
  html: ({ copy, data, rtl, theme, format }) => `...`,
  animate(tl, gsap, ctx) { /* add tweens to the paused GSAP timeline */ },
};
```

A post overrides the defaults with `sceneCopy` (per language, merged key by key; arrays are replaced whole) and `sceneData` (merged over `data`):

```json
{ "scene": "showcase-phone",
  "sceneCopy": { "en": { "name": "Tasky" }, "ar": { "name": "Tasky" } },
  "sceneData": { "screens": ["content/assets/tasky/home.png"], "icon": "list-checks" } }
```

Data field types used by `meta.fields.data` (the workspace picks its editor from them): `image`, `images`, `icon` (a [Lucide](https://lucide.dev/icons) name), `text`, `code`, `list` (a list of short strings), `number`.

### What `ctx` holds

`html()` and `css()` receive `{ lang, rtl, format ('feed' | 'reel'), theme ('dark' | 'blue' | 'light'), width, height, data }`; `html()` also gets the merged `copy`. `animate()` gets the same object without `copy` (read the DOM instead).

### Helpers (`../motion/ui.mjs`)

- `ico(name, { size, stroke, cls })`: a Lucide icon as inline SVG.
- `asset('content/assets/…/x.png')`: a project image as a data URI. Images uploaded in the workspace or added by Claude Code live in `content/assets/<post-slug>/`.
- UI kit classes that follow the theme: `.card`, `.win` + `.win-bar` (app window with traffic lights), `.bubble.me` / `.bubble.ai`, `.chip` (`.hot`, `.ok`), `.avatar.brand`, `.typing`, `.phone > .screen` + `.island`, `.spark` (an orange logo petal), `.goo` with `gooFilter` (gooey blobs like the logo).
- CSS variables: `--card`, `--card-line`, `--ui-text`, `--ui-sub`, `--soft`, `--shadow`, `--cobalt`, `--blue`, `--sky`, `--spark`, `--ember`, `--amber`, `--brand` (brand gradient), `--sparkg` (orange gradient), `--midnight`.

## The rules every scene follows

1. **Frame 0 is the finished picture.** The markup's natural CSS state is the complete composition, so the grid thumbnail and the still cover (`01-cover.png`) are never blank.
2. **Hold → clear → rebuild → hold.** Clear with `.to()`, rebuild with `.fromTo()`. The timeline defaults are `ease: 'silk'` (`cubic-bezier(.22, 1, .36, 1)`), `duration: 0.7` and `immediateRender: false`, so nothing jumps at frame 0.
3. **Seamless loop.** At `t = duration` everything is back in its frame-0 state. Ambient motion (floating, drifting, rotating) completes whole cycles: `repeat: 1, yoyo: true` over half the duration, or `rotation: '+=360'` over the full duration.
4. **Right to left.** Arabic mirrors the layout: use logical properties (`inset-inline-start`, `margin-inline-end`, `padding-inline`) and check `ctx.rtl` for anything absolute. Code, URLs and numbers stay left to right. Never split Arabic into letters to animate it (it breaks the joins): animate words or whole lines. Western digits (0–9) in both languages.
5. **Readable on every theme.** Text sits on cards (`--card`) or high-contrast fills. `npm run check -- <slug>` must pass (4.5:1 for normal text, 3:1 for large text).
6. **No crypto look.** No rockets, coins, candlestick or rising-price charts, or ⚡.
7. **Animate transforms and opacity** (`x`, `y`, `scale`, `rotation`, `opacity`, `clipPath`), not layout properties, so playback is smooth. Don't tween `boxShadow` on elements whose resting shadow matters (it breaks the loop): pulse an `outline` instead.

## Checking a scene

```bash
node design/motion/render-video.mjs <post-slug> --preview      # 8-frame contact sheet → .preview/
node design/motion/render-video.mjs <post-slug> --frame 3.5    # one full frame → .preview/
node design/motion/render-video.mjs <post-slug> --loopcheck    # is the loop seamless?
npm run check -- <post-slug>                                   # text contrast
```

Or open the post in the workspace (`npm run studio`) and scrub the timeline.
