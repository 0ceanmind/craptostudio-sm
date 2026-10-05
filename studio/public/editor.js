// The post editor: live animated preview with a timeline, a filmstrip of all slides, and an
// inspector to edit the hero, every slide, the post settings, captions and rendered files.
import { h, icon, get, post as apiPost, put, del, api, toast, toastError, modal, confirmBox, debounce, clone, plain, copyText, ago, md } from './dom.js';
import { state, on, sceneOf, loadPosts } from './state.js';
import { biField, textField, selectField, iconField, imageField, copyEditor, dataEditor, uploadFiles, dropTarget, field } from './fields.js';

const W = 1080;
const H = { feed: 1350, reel: 1920 };
const SLIDE_ICONS = { cards: 'layout-grid', steps: 'list-ordered', statement: 'quote', services: 'grid-3x3', image: 'image', cta: 'megaphone' };
const THEME_LABEL = { dark: 'Dark', blue: 'Blue', light: 'Light' };

const waitFor = async (test, ms = 8000) => { const t0 = performance.now(); while (!test()) { if (performance.now() - t0 > ms) return false; await new Promise((r) => setTimeout(r, 30)); } return true; };

export function editorView(slug) {
  let original = slug;      // slug on disk (changes after a rename is saved)
  let p = null;             // working copy of the post
  let savedJson = '';
  let lang = localStorage.getItem('studio.lang') ?? 'en';
  let format = 'feed';
  let sel = 0;              // 0 = animated hero, n = slide n+1
  let tab = 'design';
  let assets = []; let exportsList = []; let validation = { errors: [], warnings: [] };
  let playing = true; let t = 0; let duration = 8; let lastTick = 0; let raf = 0;
  const stash = {};         // scene text/data per scene, so switching scenes back and forth loses nothing
  const disposers = [];

  // ---------- layout ----------
  const rail = h('aside.rail');
  const titleEl = h('div.title');
  const dirtyEl = h('span.dirty', { hidden: true }, '● unsaved');
  const valBtn = h('button.pill', { onclick: () => showValidation() });
  const langSeg = h('div.seg');
  const fmtSeg = h('div.seg');
  const saveBtn = h('button.btn.primary', { onclick: () => save() }, icon('save', { size: 16 }), 'Save');
  const renderBtn = h('button.btn', { onclick: (e) => renderMenu(e.currentTarget) }, icon('clapperboard', { size: 16 }), 'Render', icon('chevron-down', { size: 14 }));
  const askBtn = h('button.btn', { title: 'Describe a change; Claude edits the post in the brand style', onclick: () => askClaude() }, icon('wand-sparkles', { size: 16 }), 'Ask Claude');
  const dock = h('div.dock', { hidden: true });
  const banner = h('div.banner', { hidden: true });
  const frame = h('div.frame', {}, h('div.busy'));
  const iframes = [h('iframe', { title: 'preview' }), h('iframe.back', { title: 'preview' })];
  frame.prepend(...iframes);
  let front = 0;
  const canvas = h('div.canvas', {}, frame);
  const playBtn = h('button.playbtn', { title: 'Play / pause (space)', onclick: () => setPlaying(!playing) });
  const scrub = h('input', { type: 'range', min: 0, max: 8, step: 0.01, value: 0 });
  const timeEl = h('span.t');
  const player = h('div.player', {}, playBtn, scrub, timeEl);
  const film = h('div.film');
  const tabsEl = h('div.itabs');
  const ibody = h('div.ibody');
  const inspector = h('aside.inspector', {}, tabsEl, ibody);
  const stageCol = h('section.stagecol', {}, banner,
    h('div.etool', {}, titleEl, dirtyEl, valBtn, langSeg, fmtSeg, askBtn, renderBtn, saveBtn),
    canvas, player, film, dock);
  const el = h('div.view.editor', {}, rail, stageCol, inspector);

  // ---------- data ----------
  const dirty = () => p && JSON.stringify(p) !== savedJson;
  const markDirty = () => { dirtyEl.hidden = !dirty(); };

  async function load() {
    const data = await get(`/api/posts/${encodeURIComponent(original)}`);
    p = data.post; savedJson = JSON.stringify(p); assets = data.assets; exportsList = data.exports; validation = data.validation;
    sel = Math.min(sel, p.slides.length);
    renderAll();
  }

  const changed = debounce(() => { refreshPreview(); refreshThumbs(); validate(); }, 220);
  function edit(fn, { inspector: re = false } = {}) {
    fn(p);
    markDirty();
    renderTitle();
    if (re) renderInspector();
    changed();
  }

  const validate = debounce(async () => {
    try { validation = await apiPost(`/api/posts/${encodeURIComponent(original)}/validate`, { post: p }); } catch { return; }
    renderValidation();
  }, 450);

  async function save() {
    try {
      const res = await put(`/api/posts/${encodeURIComponent(original)}`, { post: p });
      p = res.post; savedJson = JSON.stringify(p);
      validation = { errors: [], warnings: res.warnings };
      renderValidation(); markDirty();
      if (p.slug !== original) { original = p.slug; history.replaceState(null, '', `#/post/${p.slug}`); }
      toast(res.warnings.length ? `Saved (${res.warnings.length} warning${res.warnings.length > 1 ? 's' : ''})` : 'Saved', { kind: 'ok', timeout: 2000 });
      loadPosts();
      return true;
    } catch (e) {
      if (e.errors) { validation = { errors: e.errors, warnings: e.warnings ?? [] }; renderValidation(); showValidation(); } else toastError(e);
      return false;
    }
  }

  // Someone else (Claude Code, the MCP server, a text editor) changed this post on disk.
  disposers.push(on('posts-changed', async () => {
    if (!p) return;
    let fresh;
    try { fresh = (await get(`/api/posts/${encodeURIComponent(original)}`)); } catch { return; }
    exportsList = fresh.exports; assets = fresh.assets;
    if (JSON.stringify(fresh.post) === savedJson) { if (tab === 'files') renderInspector(); return; }
    if (!dirty()) {
      p = fresh.post; savedJson = JSON.stringify(p); validation = fresh.validation;
      sel = Math.min(sel, p.slides.length);
      renderAll();
      toast('Post updated from outside the workspace (Claude Code?)', { kind: 'info' });
    } else {
      banner.replaceChildren(icon('git-compare', { size: 16 }), 'This post was changed outside the workspace (by Claude Code?) while you have unsaved edits.',
        h('button.btn.sm', { onclick: () => { p = fresh.post; savedJson = JSON.stringify(p); banner.hidden = true; renderAll(); } }, 'Load their version'),
        h('button.btn.sm.ghost', { onclick: () => { savedJson = JSON.stringify(fresh.post); banner.hidden = true; markDirty(); } }, 'Keep mine'));
      banner.hidden = false;
    }
  }));
  disposers.push(on('posts', () => renderRail()));
  disposers.push(on('scenes', () => { lastKey = ''; refreshPreview(); if (sel === 0 && tab === 'design') renderInspector(); }));
  disposers.push(on('jobs', () => { if (tab === 'files') renderJobsBox(); }));

  // ---------- rendering ----------
  function renderAll() {
    renderRail(); renderTitle(); renderSegs(); renderValidation(); renderFilm(); renderTabs(); renderInspector(); markDirty();
    lastKey = ''; refreshPreview(); refreshThumbs(true);
  }

  function renderRail() {
    rail.replaceChildren(
      h('div.rail-head', {}, h('a.btn.sm.ghost', { href: '#/' }, icon('layout-grid', { size: 15 }), 'All posts'), h('button.btn.sm', { style: { marginLeft: 'auto' }, onclick: () => window.studio.newPost() }, icon('plus', { size: 15 }), 'New')),
      h('div.rail-list', {}, [...state.posts].sort((a, b) => b.order - a.order).map((s) => h(`a.ritem${s.slug === original ? '.on' : ''}`, { href: `#/post/${s.slug}` },
        h(`div.th.${s.theme}`, {}, s.cover ? h('img', { src: s.cover, loading: 'lazy' }) : icon(s.icon ?? 'image', { size: 16 })),
        h('div.tx', {}, h('b', {}, plain(s.headline?.en)), h('span', {}, `#${String(s.order).padStart(2, '0')} · ${s.status}${s.source ? ' · ✦ Claude' : ''}`))))),
    );
  }

  function renderTitle() {
    titleEl.replaceChildren(h('b', { title: `${plain(p.headline?.en)} · #${p.order} · ${p.status}` }, plain(p.headline?.en) || p.slug), h(`span.pill${p.status === 'draft' ? '.warn' : ''}`, { title: `Posting order ${p.order} · ${p.status}` }, `#${String(p.order).padStart(2, '0')} ${p.status}`));
  }

  function renderSegs() {
    langSeg.replaceChildren(...['en', 'ar'].map((l) => h(`button${l === lang ? '.on' : ''}`, { onclick: () => { lang = l; localStorage.setItem('studio.lang', l); renderSegs(); refreshPreview(); refreshThumbs(true); } }, l === 'en' ? 'EN' : 'AR')));
    fmtSeg.replaceChildren(...['feed', 'reel'].map((f) => h(`button${f === format ? '.on' : ''}`, { disabled: sel !== 0, title: sel !== 0 ? 'Only the animated hero has a Reel version' : '', onclick: () => { format = f; renderSegs(); refreshPreview(); } }, f === 'feed' ? 'Feed' : 'Reel')));
    fmtSeg.style.opacity = sel === 0 ? 1 : 0.4;
  }

  function renderValidation() {
    const e = validation.errors?.length ?? 0; const w = validation.warnings?.length ?? 0;
    valBtn.className = `pill ${e ? 'err' : w ? 'warn' : 'ok'}`;
    valBtn.replaceChildren(h('span.dot'), e ? `${e} error${e > 1 ? 's' : ''}` : w ? `${w} warning${w > 1 ? 's' : ''}` : 'Looks good');
    valBtn.title = 'Show checks';
  }
  function showValidation() {
    const items = [...(validation.errors ?? []).map((x) => ['e', x]), ...(validation.warnings ?? []).map((x) => ['w', x])];
    modal({ title: 'Checks', body: items.length ? h('div.vlist', {}, items.map(([k, x]) => h(`div.v.${k}`, {}, icon(k === 'e' ? 'circle-x' : 'triangle-alert', { size: 15 }), x))) : h('p.muted', {}, 'No problems found. Text lengths, icons, images and captions all look fine.') });
  }

  // ---------- preview ----------
  let lastKey = ''; let loadSeq = 0;
  const heroPart = () => { const { caption, alt, status, order, ...rest } = p; return { ...rest, slides: rest.slides.length }; };
  const previewKey = () => JSON.stringify(sel === 0 ? { hero: heroPart(), lang, format } : { slide: p.slides[sel - 1], n: sel, total: p.slides.length, lang });

  async function fetchHtml(kind, index, l = lang, f = format) {
    const swipePost = { ...p };
    return kind === 'hero'
      ? api('POST', '/api/preview/hero', { post: swipePost, lang: l, format: f })
      : api('POST', '/api/preview/slide', { post: p, index, lang: l });
  }

  async function refreshPreview() {
    if (!p) return;
    const key = previewKey();
    if (key === lastKey) return;
    lastKey = key;
    const seq = ++loadSeq;
    frame.classList.add('loading');
    const isHero = sel === 0;
    let html;
    try { html = await fetchHtml(isHero ? 'hero' : 'slide', sel - 1); } catch (e) { toastError(e); return; }
    if (seq !== loadSeq) return;
    const back = iframes[1 - front];
    const loaded = new Promise((r) => { back.onload = r; });
    back.srcdoc = html;
    await loaded;
    if (isHero) await waitFor(() => back.contentWindow?.__ready === true, 8000);
    else await back.contentWindow?.document.fonts?.ready;
    if (seq !== loadSeq) return;
    sizeFrame();
    if (isHero) {
      duration = back.contentWindow.__duration ?? 8;
      scrub.max = duration;
      t = Math.min(t, duration);
      back.contentWindow.__seek?.(t);
    }
    back.classList.remove('back'); iframes[front].classList.add('back');
    front = 1 - front;
    frame.classList.remove('loading');
    player.style.visibility = isHero ? 'visible' : 'hidden';
    updateTime();
  }

  function sizeFrame() {
    const height = sel === 0 ? H[format] : H.feed;
    const box = canvas.getBoundingClientRect();
    const s = Math.max(0.1, Math.min((box.width - 36) / W, (box.height - 36) / height));
    frame.style.width = `${W * s}px`; frame.style.height = `${height * s}px`;
    for (const f of iframes) { f.style.width = `${W}px`; f.style.height = `${height}px`; f.style.transform = `scale(${s})`; }
  }
  const ro = new ResizeObserver(() => sizeFrame());
  ro.observe(canvas);

  function updateTime() {
    scrub.value = t;
    timeEl.textContent = `${t.toFixed(2)}s / ${duration}s`;
    playBtn.replaceChildren(icon(playing ? 'pause' : 'play', { size: 17 }));
  }
  function setPlaying(v) { playing = v; lastTick = performance.now(); updateTime(); }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (!playing || sel !== 0) { lastTick = now; return; }
    t = (t + (now - (lastTick || now)) / 1000) % duration;
    lastTick = now;
    const win = iframes[front].contentWindow;
    if (win?.__seek) win.__seek(t);
    scrub.value = t; timeEl.textContent = `${t.toFixed(2)}s / ${duration}s`;
  }
  raf = requestAnimationFrame(tick);
  scrub.addEventListener('input', () => { setPlaying(false); t = Number(scrub.value); iframes[front].contentWindow?.__seek?.(t); updateTime(); });

  // ---------- filmstrip ----------
  const thumbKeys = new Map();
  function renderFilm() {
    film.replaceChildren();
    const thumbs = [{ kind: 'hero' }, ...p.slides.map((s, i) => ({ kind: 'slide', i, s }))];
    thumbs.forEach((th, n) => {
      const frameEl = h('iframe', { tabindex: '-1' });
      const node = h(`div.thumb${n === sel ? '.on' : ''}`, { title: n === 0 ? 'Animated hero (slide 1)' : `Slide ${n + 1}: ${state.meta?.slideTypes?.[th.s.type]?.label ?? th.s.type}`, onclick: () => select(n), dataset: { n } },
        frameEl, h('span.n', {}, n + 1), n === 0 ? h('span.play', {}, icon('play', { size: 10 })) : null);
      if (n > 0) {
        node.draggable = true;
        node.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/slide', String(n)); node.classList.add('dragging'); });
        node.addEventListener('dragend', () => node.classList.remove('dragging'));
        node.addEventListener('dragover', (e) => { if ([...e.dataTransfer.types].includes('text/slide')) { e.preventDefault(); node.classList.add('drop-before'); } });
        node.addEventListener('dragleave', () => node.classList.remove('drop-before'));
        node.addEventListener('drop', (e) => {
          e.preventDefault(); node.classList.remove('drop-before');
          const from = Number(e.dataTransfer.getData('text/slide')); const to = n;
          if (!from || from === to) return;
          edit((x) => { const [s] = x.slides.splice(from - 1, 1); x.slides.splice(to > from ? to - 2 : to - 1, 0, s); });
          sel = to > from ? to - 1 : to; renderFilm(); refreshThumbs(true); renderInspector();
        });
      }
      film.append(node);
    });
    film.append(h('button.addslide', { onclick: (e) => addSlideMenu(e.currentTarget) }, icon('plus', { size: 20 }), 'SLIDE'));
  }

  async function refreshThumbs(force = false) {
    const nodes = [...film.querySelectorAll('.thumb')];
    for (const [n, node] of nodes.entries()) {
      const key = JSON.stringify(n === 0 ? { hero: heroPart(), lang } : { s: p.slides[n - 1], n, total: p.slides.length, lang });
      const fr = node.querySelector('iframe');
      if (!force && thumbKeys.get(n) === key && fr.srcdoc) continue;
      thumbKeys.set(n, key);
      try { fr.srcdoc = await fetchHtml(n === 0 ? 'hero' : 'slide', n - 1, lang, 'feed'); } catch { /* shown in main preview */ }
    }
  }

  function select(n) {
    sel = n;
    if (n !== 0) format = 'feed';
    for (const node of film.querySelectorAll('.thumb')) node.classList.toggle('on', Number(node.dataset.n) === n);
    if (tab !== 'design') tab = 'design';
    renderSegs(); renderTabs(); renderInspector(); refreshPreview();
  }

  function addSlideMenu(anchor) {
    const types = state.meta.slideTypes;
    popMenu(anchor, Object.entries(types).map(([type, info]) => ({
      icon: SLIDE_ICONS[type], label: info.label, hint: info.hint,
      run: async () => {
        const tpl = await get(`/api/slide-template/${type}`);
        // New slides go after the selected one, but before a final call-to-action slide.
        let at = sel === 0 ? 0 : sel;
        if (p.slides.at(-1)?.type === 'cta' && at >= p.slides.length && type !== 'cta') at = p.slides.length - 1;
        edit((x) => x.slides.splice(at, 0, tpl));
        sel = at + 1; renderFilm(); refreshThumbs(true); select(sel);
      },
    })));
  }

  // ---------- inspector ----------
  function renderTabs() {
    const tabs = [['design', sel === 0 ? 'Hero' : `Slide ${sel + 1}`, sel === 0 ? 'clapperboard' : SLIDE_ICONS[p.slides[sel - 1]?.type] ?? 'square'], ['post', 'Post', 'settings-2'], ['caption', 'Caption', 'text'], ['files', 'Files', 'folder-open']];
    tabsEl.replaceChildren(...tabs.map(([k, label, ic]) => h(`button${k === tab ? '.on' : ''}`, { onclick: () => { tab = k; renderTabs(); renderInspector(); } }, icon(ic, { size: 15 }), label)));
  }

  function section(title, ...kids) {
    return h('div.section', {}, h('h4', {}, title, h('span.line')), ...kids);
  }

  // Data context for image fields.
  const imgCtx = { slug: () => p.slug, assets: () => assets, addAssets: (list) => { assets = [...new Set([...assets, ...list])]; } };

  function renderInspector() {
    const scrollTop = ibody.scrollTop;
    ibody.replaceChildren();
    if (tab === 'design') ibody.append(sel === 0 ? heroInspector() : slideInspector(sel - 1));
    if (tab === 'post') ibody.append(postInspector());
    if (tab === 'caption') ibody.append(captionInspector());
    if (tab === 'files') ibody.append(filesInspector());
    ibody.scrollTop = scrollTop;
  }

  function heroInspector() {
    const scene = sceneOf(p.scene);
    return h('div', {},
      section('Theme', h('div.swatches', {}, state.meta.themes.map((th) => h(`div.swatch.${th}${p.theme === th ? '.on' : ''}`, { onclick: () => edit((x) => { x.theme = th; }, { inspector: true }) }, THEME_LABEL[th])))),
      section('Animation',
        h(`div.scene-pick${scene?.kind === 'showcase' ? '.showcase' : ''}`, { onclick: () => pickScene() },
          h('div.si', {}, icon(scene?.kind === 'showcase' ? 'sparkles' : 'clapperboard', { size: 20 })),
          h('div', { style: { flex: 1, minWidth: 0 } }, h('b', {}, scene?.title ?? p.scene), h('span', {}, scene?.description ?? '')),
          icon('chevrons-up-down', { size: 16 }))),
      section('Headline',
        biField({ label: 'Tag', value: p.tag, limit: 24, onChange: (v) => edit((x) => { x.tag = v; }) }),
        biField({ label: 'Headline', value: p.headline, limit: 44, multiline: true, hint: '*accent* · Enter = new line', onChange: (v) => edit((x) => { x.headline = v; }) }),
        biField({ label: 'Sub-line', value: p.sub, limit: 64, onChange: (v) => edit((x) => { x.sub = v; }) })),
      scene ? section('Text in the animation', copyEditor({ base: scene.copy, override: p.sceneCopy ?? {}, notes: scene.fields?.copy ?? {}, onChange: (v) => edit((x) => { x.sceneCopy = (Object.keys(v.en).length || Object.keys(v.ar).length) ? v : {}; }) })) : null,
      scene && (Object.keys(scene.data ?? {}).length || Object.keys(scene.fields?.data ?? {}).length) ? section('Animation settings', dataEditor({ base: scene.data, override: p.sceneData ?? {}, notes: scene.fields?.data ?? {}, ctx: imgCtx, onChange: (v) => edit((x) => { x.sceneData = v; }) })) : null,
    );
  }

  function pickScene() {
    const grid = h('div.scenes-grid', {}, [...state.scenes].sort((a, b) => (a.kind === 'showcase' ? 0 : 1) - (b.kind === 'showcase' ? 0 : 1)).map((s) => h(`div.scard${s.name === p.scene ? '.on' : ''}`, {
      onclick: () => {
        if (s.name !== p.scene) {
          edit((x) => {
            stash[x.scene] = { sceneCopy: x.sceneCopy, sceneData: x.sceneData };
            x.scene = s.name;
            x.sceneCopy = stash[s.name]?.sceneCopy ?? {}; x.sceneData = stash[s.name]?.sceneData ?? {};
          }, { inspector: true });
          t = 0;
        }
        m.close();
      },
    }, h(`span.k${s.kind === 'showcase' ? '' : '.service'}`, {}, s.kind === 'showcase' ? '✦ Project showcase' : s.kind === 'broken' ? '⚠ Failed to load' : 'Service demo'), h('b', {}, s.title), h('p', {}, s.description), s.bestFor ? h('span.best', {}, `Best for: ${s.bestFor}`) : null)));
    const m = modal({ title: 'Choose the animation', wide: true, body: grid });
  }

  function slideInspector(i) {
    const s = p.slides[i];
    const types = state.meta.slideTypes;
    const set = (fn, opts) => edit((x) => fn(x.slides[i]), opts);
    const head = h('div.slide-actions', {},
      h('div.kind', {}, icon(SLIDE_ICONS[s.type], { size: 18 }), types[s.type]?.label ?? s.type),
      h('button.icon-btn', { title: 'Move left', disabled: i === 0, onclick: () => move(i, -1) }, icon('arrow-left', { size: 16 })),
      h('button.icon-btn', { title: 'Move right', disabled: i === p.slides.length - 1, onclick: () => move(i, 1) }, icon('arrow-right', { size: 16 })),
      h('button.icon-btn', { title: 'Duplicate', onclick: () => { edit((x) => x.slides.splice(i + 1, 0, clone(s))); renderFilm(); refreshThumbs(true); select(i + 2); } }, icon('copy', { size: 16 })),
      h('button.icon-btn', { title: 'Delete slide', onclick: () => { edit((x) => x.slides.splice(i, 1)); renderFilm(); refreshThumbs(true); select(Math.min(i + 1, p.slides.length)); } }, icon('trash-2', { size: 16 })));
    const hint = h('p.dim', { style: { margin: '-6px 0 16px', fontSize: '12.5px' } }, types[s.type]?.hint);
    const body = [];
    const optional = (key) => (v) => set((x) => { if (!v.en && !v.ar) delete x[key]; else x[key] = v; });
    if (s.type === 'cards' || s.type === 'steps') {
      body.push(biField({ label: 'Title', value: s.title, limit: 28, onChange: (v) => set((x) => { x.title = v; }) }));
      const items = h('div');
      const renderItems = () => items.replaceChildren(...s.items.map((it, j) => h('div.group', {},
        h('div.group-head', {}, h('b', {}, `${s.type === 'steps' ? 'Step' : 'Card'} ${j + 1}`),
          h('button.icon-btn', { title: 'Move up', disabled: j === 0, onclick: () => { set((x) => { const [a] = x.items.splice(j, 1); x.items.splice(j - 1, 0, a); }); renderItems(); } }, icon('arrow-up', { size: 14 })),
          h('button.icon-btn', { title: 'Remove', disabled: s.items.length <= 1, onclick: () => { set((x) => x.items.splice(j, 1)); renderItems(); } }, icon('x', { size: 14 }))),
        s.type === 'cards'
          ? [iconField({ label: 'Icon', value: it.icon, onChange: (v) => set((x) => { x.items[j].icon = v; }) }), biField({ label: 'Text', value: it.text, limit: 34, onChange: (v) => set((x) => { x.items[j].text = v; }) })]
          : [biField({ label: 'Title', value: it.title, limit: 22, onChange: (v) => set((x) => { x.items[j].title = v; }) }), biField({ label: 'Text', value: it.text, limit: 46, onChange: (v) => set((x) => { x.items[j].text = v; }) })])),
      s.items.length < 4 ? h('button.btn.sm', { onclick: () => { set((x) => x.items.push(s.type === 'cards' ? { icon: 'sparkles', text: { en: '', ar: '' } } : { title: { en: '', ar: '' }, text: { en: '', ar: '' } })); renderItems(); } }, icon('plus', { size: 14 }), `Add ${s.type === 'steps' ? 'step' : 'card'}`) : null);
      renderItems();
      body.push(items);
    }
    if (s.type === 'statement') {
      body.push(biField({ label: 'Kicker', value: s.kicker, limit: 24, onChange: (v) => set((x) => { x.kicker = v; }) }));
      body.push(biField({ label: 'Statement', value: s.text, limit: 90, multiline: true, rows: 3, hint: '*accent*', onChange: (v) => set((x) => { x.text = v; }) }));
    }
    if (s.type === 'services') body.push(biField({ label: 'Title', value: s.title, limit: 28, onChange: (v) => set((x) => { x.title = v; }) }));
    if (s.type === 'image') {
      body.push(imageField({ label: 'Image', value: s.src, ctx: imgCtx, hint: 'click or drop a file', onChange: (v) => set((x) => { x.src = v; }) }));
      body.push(selectField({ label: 'Fit', value: s.fit ?? 'contain', options: [{ value: 'contain', label: 'Show the whole image' }, { value: 'cover', label: 'Fill the frame (crops)' }], onChange: (v) => set((x) => { x.fit = v; }) }));
      body.push(biField({ label: 'Title', value: s.title, limit: 28, hint: 'optional', onChange: optional('title') }));
      body.push(biField({ label: 'Caption', value: s.caption, limit: 90, hint: 'optional', onChange: optional('caption') }));
    }
    if (s.type === 'cta') {
      body.push(biField({ label: 'Headline', value: s.headline, limit: 40, multiline: true, hint: 'empty = “Got an idea? Let’s compile it.”', placeholder: { en: 'Got an idea?\n*Let’s compile it.*', ar: 'لديك فكرة؟\n*لنبنِها معاً.*' }, onChange: optional('headline') }));
      body.push(biField({ label: 'Body', value: s.body, limit: 90, multiline: true, hint: 'empty = DM “START” line', onChange: optional('body') }));
    }
    const typeSwitch = selectField({ label: 'Slide type', value: s.type, options: Object.entries(types).map(([k, v]) => ({ value: k, label: v.label })), onChange: async (v) => {
      const tpl = await get(`/api/slide-template/${v}`);
      edit((x) => { x.slides[i] = { ...tpl, ...(x.slides[i].title && 'title' in tpl ? { title: x.slides[i].title } : {}) }; }, { inspector: true });
      renderFilm(); refreshThumbs(true);
    } });
    return h('div', {}, head, hint, ...body, h('div', { style: { marginTop: '18px' } }, typeSwitch));
  }

  function move(i, d) {
    edit((x) => { const [s] = x.slides.splice(i, 1); x.slides.splice(i + d, 0, s); });
    renderFilm(); refreshThumbs(true); select(i + 1 + d);
  }

  function postInspector() {
    return h('div', {},
      section('Post',
        textField({ label: 'Slug', value: p.slug, hint: 'file name and folder', onChange: (v) => edit((x) => { x.slug = v.trim(); }) }),
        textField({ label: 'Posting order', value: String(p.order), hint: `decides the NN- folder · next free: ${state.meta.nextOrder}`, onChange: (v) => edit((x) => { x.order = Number(v) || v; }) }),
        selectField({ label: 'Status', value: p.status, options: state.meta.statuses, onChange: (v) => edit((x) => { x.status = v; }) }),
        iconField({ label: 'Post icon', value: p.icon ?? 'image', hint: 'shown in lists', onChange: (v) => edit((x) => { x.icon = v; }) })),
      p.source ? section('Made from a Claude Code project', h('div.card2', { style: { padding: '12px' } },
        h('b', {}, p.source.project ?? ''), h('div.mono.dim', { style: { fontSize: '11.5px', wordBreak: 'break-all', marginTop: '4px' } }, p.source.path ?? ''),
        h('a.btn.sm', { style: { marginTop: '10px' }, href: `#/claude?cwd=${encodeURIComponent(p.source.path ?? '')}` }, icon('sparkles', { size: 14 }), 'Ask Claude to change it'))) : null,
      section('Danger zone', h('div', { style: { display: 'flex', gap: '8px' } },
        h('button.btn.sm', { onclick: async () => { try { const r = await apiPost(`/api/posts/${original}/duplicate`); await loadPosts(); location.hash = `#/post/${r.post.slug}`; } catch (e) { toastError(e); } } }, icon('copy', { size: 14 }), 'Duplicate'),
        h('button.btn.sm.danger', { onclick: async () => {
          if (!(await confirmBox('Delete this post?', `“${plain(p.headline.en)}”, its images and its rendered files move to .studio/trash/. You can restore them from there.`, { label: 'Delete', danger: true }))) return;
          try { await del(`/api/posts/${original}`); savedJson = JSON.stringify(p); await loadPosts(); location.hash = '#/'; toast('Post moved to the trash', { kind: 'ok' }); } catch (e) { toastError(e); }
        } }, icon('trash-2', { size: 14 }), 'Delete'))),
    );
  }

  function captionInspector() {
    const tags = (s) => (String(s ?? '').match(/#[\p{L}\p{N}_]+/gu) ?? []).length;
    const info = h('div.dim', { style: { fontSize: '12px', marginBottom: '12px' } });
    const setInfo = () => { info.textContent = `Hook (first line): EN ${String(p.caption?.en ?? '').split('\n')[0].length}/125 · AR ${String(p.caption?.ar ?? '').split('\n')[0].length}/125 · hashtags EN ${tags(p.caption?.en)} AR ${tags(p.caption?.ar)} (max 5)`; };
    setInfo();
    return h('div', {},
      section('Caption', info,
        biField({ label: 'Caption', value: p.caption, limit: 2200, multiline: true, rows: 11, onChange: (v) => { edit((x) => { x.caption = v; }); setInfo(); } }),
        h('div', { style: { display: 'flex', gap: '8px' } }, h('button.btn.sm', { onclick: () => copyText(p.caption.en) }, icon('copy', { size: 14 }), 'Copy EN'), h('button.btn.sm', { onclick: () => copyText(p.caption.ar) }, icon('copy', { size: 14 }), 'Copy AR'))),
      section('Alt text (cover)',
        biField({ label: 'Alt text', value: p.alt, limit: 100, multiline: true, onChange: (v) => edit((x) => { x.alt = v; }) }),
        h('div', { style: { display: 'flex', gap: '8px' } }, h('button.btn.sm', { onclick: () => copyText(p.alt.en) }, icon('copy', { size: 14 }), 'Copy EN'), h('button.btn.sm', { onclick: () => copyText(p.alt.ar) }, icon('copy', { size: 14 }), 'Copy AR'))));
  }

  const jobsBox = h('div');
  function renderJobsBox() {
    const jobs = state.jobs.filter((j) => j.slug === original).slice(0, 4);
    jobsBox.replaceChildren(...jobs.map((j) => h('div.jobline', {},
      h('div.top', {}, icon(j.status === 'done' ? 'circle-check' : j.status === 'failed' ? 'circle-x' : 'loader', { size: 15 }), state.meta.jobKinds[j.kind], h('span.dim', { style: { marginLeft: 'auto', fontWeight: 500, fontSize: '11.5px' } }, ago(j.createdAt))),
      h('div.msg', {}, j.error ?? j.message),
      ['running', 'queued'].includes(j.status) ? h('div.bar', {}, h('i', { style: { width: `${Math.round(j.progress * 100)}%` } })) : null)));
    if (jobs.some((j) => j.status === 'done' && Date.now() - (j.endedAt ?? 0) < 4000)) refreshFiles();
  }
  const refreshFiles = debounce(async () => { const d = await get(`/api/posts/${encodeURIComponent(original)}`); exportsList = d.exports; assets = d.assets; if (tab === 'files') renderInspector(); }, 600);

  function filesInspector() {
    renderJobsBox();
    const v = (rel) => exportsList.find((f) => f.path.endsWith(rel));
    const vids = [['EN feed', '/en/01-hero.mp4'], ['AR feed', '/ar/01-hero.mp4'], ['EN Reel', '-en.mp4'], ['AR Reel', '-ar.mp4']].map(([label, rel]) => [label, v(rel)]).filter(([, f]) => f);
    const pngs = exportsList.filter((f) => f.path.endsWith('.png') && f.path.includes(`/${lang}/`));
    const drop = h('div.drop', {}, icon('upload', { size: 20 }), h('div', { style: { fontWeight: 700, marginTop: '4px' } }, 'Drop screenshots here'), h('div.dim', { style: { fontSize: '12px' } }, 'They are saved to content/assets/' + p.slug + '/'));
    dropTarget(drop, async (files) => { const added = await uploadFiles(p.slug, files); assets = [...new Set([...assets, ...added.map((a) => a.path)])]; renderInspector(); });
    return h('div', {},
      section('Render',
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          h('button.btn.sm.primary', { onclick: () => startJob('stills') }, icon('images', { size: 14 }), 'Images'),
          h('button.btn.sm', { onclick: () => startJob('video') }, icon('film', { size: 14 }), 'Videos'),
          h('button.btn.sm', { onclick: () => startJob('check') }, icon('contrast', { size: 14 }), 'Contrast')),
        h('div', { style: { marginTop: '10px' } }, jobsBox)),
      section('Videos', vids.length ? h('div.vids', {}, vids.map(([label, f]) => h('figure', {}, h('video', { src: `/${f.path}?v=${Math.round(f.mtime)}`, muted: true, loop: true, playsinline: true, controls: true, preload: 'metadata' }), h('figcaption', {}, label)))) : h('p.dim', {}, 'No videos yet. Render videos (≈ 1 min each, 4 per post).')),
      section(`Images (${lang.toUpperCase()})`, pngs.length ? h('div.exports', {}, pngs.map((f) => h('a', { href: `/${f.path}?v=${Math.round(f.mtime)}`, target: '_blank', style: { backgroundImage: `url(/${f.path}?v=${Math.round(f.mtime)})` } }, h('span', {}, f.path.split('/').pop())))) : h('p.dim', {}, 'Not rendered yet.'),
        exportsList.length ? h('button.btn.sm.ghost', { style: { marginTop: '8px' }, onclick: () => apiPost('/api/open-folder', { rel: exportsList[0].path.split('/').slice(0, 3).join('/') }).catch(toastError) }, icon('folder-open', { size: 14 }), 'Open folder') : null),
      section('Uploaded images', drop, assets.length ? h('div.assets', {}, assets.map((a) => h('a.a', { href: `/${a}`, target: '_blank', title: a, style: { backgroundImage: `url(/${a})` } }, h('span', {}, a.split('/').pop())))) : null),
    );
  }

  async function startJob(kind) {
    if (dirty() && !(await save())) return;
    try { await apiPost('/api/jobs', { kind, slug: p.slug }); toast(`${state.meta.jobKinds[kind]} queued`, { kind: 'ok', timeout: 2000 }); tab = 'files'; renderTabs(); renderInspector(); } catch (e) { toastError(e); }
  }

  function renderMenu(anchor) {
    popMenu(anchor, [
      { icon: 'images', label: 'Render images', hint: 'Cover + slides, EN & AR · ~10 s', run: () => startJob('stills') },
      { icon: 'film', label: 'Render videos', hint: 'Hero + Reel, EN & AR · ~4–6 min', run: () => startJob('video') },
      { icon: 'contrast', label: 'Check contrast', hint: 'Every text against its background', run: () => startJob('check') },
    ]);
  }

  // ---------- Ask Claude ----------
  const ASK_IDEAS = ['Make the headline punchier, in both languages', 'Rewrite the captions: shorter hook, warmer tone', 'Add a slide with the 4 main features', 'Make the Arabic sound more natural', 'Switch to the light theme and tighten all text'];
  let askRun = null;
  async function askClaude() {
    if (dirty() && !(await save())) return;
    const text = h('textarea.in', { rows: 4, placeholder: 'What should change? e.g. “Make the headline about saving time”, “add a screenshot slide”, “shorter captions”' });
    const model = h('select.in', {}, [['', 'Your Claude Code default model'], ['opus', 'Opus: best writing'], ['sonnet', 'Sonnet: faster']].map(([v, l]) => h('option', { value: v, selected: (localStorage.getItem('studio.model') ?? '') === v }, l)));
    modal({
      title: 'Ask Claude to change this post',
      body: h('div', {}, text,
        h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0 14px' } }, ASK_IDEAS.map((x) => h('button.pill', { style: { cursor: 'pointer', background: 'transparent' }, onclick: () => { text.value = x; } }, x))),
        h('div.flabel', {}, 'Model'), model,
        h('p.dim', { style: { fontSize: '12px', margin: '12px 0 0' } }, p.source?.path ? `Claude works in ${p.source.project} so it can check the project, but it can’t change the project’s files.` : 'Claude edits only this post, following the brand kit.')),
      actions: [{ label: 'Cancel' }, { label: 'Ask Claude', primary: true, run: async () => {
        if (!text.value.trim()) return false;
        try {
          askRun = await apiPost('/api/claude/edit', { slug: p.slug, instruction: text.value, model: model.value });
          dockEvents.length = 0; dock.hidden = false; renderDock([]);
        } catch (e) { toastError(e); return false; }
      } }],
    });
    setTimeout(() => text.focus(), 50);
  }
  const dockEvents = [];
  function renderDock(evs) {
    const running = !evs.some((e) => e.kind === 'end');
    const end = evs.find((e) => e.kind === 'end');
    dock.replaceChildren(
      h('div.dock-head', {}, icon('wand-sparkles', { size: 16 }), h('b', {}, running ? 'Claude is editing…' : end?.status === 'done' ? 'Claude is done' : 'Claude stopped'),
        h('a.link', { href: `#/claude?run=${askRun.id}&cwd=${encodeURIComponent(askRun.cwd)}` }, 'Details'),
        h('button.icon-btn', { title: running ? 'Stop' : 'Close', onclick: () => { if (running) apiPost(`/api/claude/runs/${askRun.id}/stop`).catch(toastError); else dock.hidden = true; } }, icon(running ? 'square' : 'x', { size: 14 }))),
      h('div.dock-body', {}, evs.filter((e) => ['tool', 'text', 'end', 'tool_error'].includes(e.kind)).slice(-5).map((e) => (e.kind === 'tool'
        ? h('div.dock-ev.tool', {}, icon('dot', { size: 14 }), e.text)
        : h(`div.dock-ev.${e.kind}`, { html: md(e.text.length > 600 ? `${e.text.slice(0, 600)}…` : e.text) }))),
        running ? h('span.typing-dots', {}, h('i'), h('i'), h('i')) : null));
  }
  disposers.push(on('run', ({ id, event }) => {
    if (!askRun || id !== askRun.id) return;
    dockEvents.push(event);
    renderDock(dockEvents);
    if (event.kind === 'end' && event.status === 'done') toast('Claude updated the post', { kind: 'ok' });
  }));

  // ---------- keyboard ----------
  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(); }
    if (e.key === ' ' && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement?.tagName) && sel === 0) { e.preventDefault(); setPlaying(!playing); }
  };
  document.addEventListener('keydown', onKey);

  load().catch((e) => { el.replaceChildren(h('div.empty', {}, h('div', {}, h('div.big', {}, icon('file-question', { size: 28 })), h('h2', {}, 'Post not found'), h('p', {}, e.message), h('a.btn', { href: '#/' }, 'Back to posts')))); });

  return {
    el,
    canLeave: () => !dirty(),
    save,
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('keydown', onKey); disposers.forEach((d) => d()); },
  };
}

// A small dropdown menu anchored to a button.
export function popMenu(anchor, items) {
  document.querySelector('.menu')?.remove();
  const r = anchor.getBoundingClientRect();
  const menu = h('div.menu', {}, items.map((it) => it === '-' ? h('hr') : h('button', { onclick: () => { menu.remove(); it.run(); } }, icon(it.icon, { size: 17 }), h('div', {}, it.label, it.hint ? h('small', {}, it.hint) : null))));
  document.body.append(menu);
  const mw = menu.offsetWidth; const mh = menu.offsetHeight;
  menu.style.left = `${Math.max(8, Math.min(r.left, innerWidth - mw - 8))}px`;
  menu.style.top = `${r.bottom + mh + 8 > innerHeight ? r.top - mh - 6 : r.bottom + 6}px`;
  setTimeout(() => document.addEventListener('mousedown', function close(e) { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('mousedown', close); } }), 0);
}
