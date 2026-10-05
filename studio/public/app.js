// Crapto Studio workspace: app shell, routing, the posts overview, the new-post flow and the
// render queue.
import { h, icon, get, post as apiPost, toast, toastError, modal, confirmBox, plain, ago, $ } from './dom.js';
import { state, on, loadPosts, loadScenes, loadMeta, connectEvents } from './state.js';
import { editorView } from './editor.js';
import { claudeView } from './claude.js';

const app = $('#app');
let current = null;

// ---------- routing ----------
async function route() {
  const [path, query = ''] = location.hash.slice(1).split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(query);
  current?.destroy?.();
  let view;
  if (parts[0] === 'post' && parts[1]) view = editorView(decodeURIComponent(parts[1]));
  else if (parts[0] === 'claude') view = claudeView(params);
  else if (parts[0] === 'renders') view = rendersView();
  else view = homeView();
  current = view;
  app.replaceChildren(view.el);
  const name = parts[0] === 'post' ? 'home' : parts[0] || 'home';
  for (const a of document.querySelectorAll('#nav a')) a.classList.toggle('on', a.dataset.view === name);
}

// Leaving an editor with unsaved changes asks first.
let lastHash = location.hash;
window.addEventListener('hashchange', async () => {
  if (current?.canLeave && !current.canLeave()) {
    const target = location.hash;
    history.replaceState(null, '', lastHash);
    if (!(await confirmBox('Leave without saving?', 'This post has unsaved changes.', { label: 'Leave', danger: true }))) return;
    current.canLeave = () => true;
    location.hash = target;
    return;
  }
  lastHash = location.hash;
  route();
});
window.addEventListener('beforeunload', (e) => { if (current?.canLeave && !current.canLeave()) { e.preventDefault(); e.returnValue = ''; } });

// ---------- home: the grid ----------
function homeView() {
  let langView = localStorage.getItem('studio.gridLang') ?? 'en';
  const grid = h('div.ig');
  const seg = h('div.seg');
  const render = () => {
    seg.replaceChildren(...['en', 'ar'].map((l) => h(`button${l === langView ? '.on' : ''}`, { onclick: () => { langView = l; localStorage.setItem('studio.gridLang', l); render(); } }, l.toUpperCase())));
    const posts = [...state.posts].sort((a, b) => b.order - a.order);
    grid.replaceChildren(
      h('div.tile.new', { onclick: () => newPost() }, h('div', {}, icon('plus', { size: 28 }), 'New post')),
      ...posts.map((p) => {
        const cover = p.cover?.replace('/en/', `/${langView}/`);
        return h('a.tile', { href: `#/post/${p.slug}` },
          cover ? h('img', { src: cover, loading: 'lazy', onerror: (e) => e.target.replaceWith(h(`div.ph.${p.theme}`, {}, plain(p.headline?.[langView]))) }) : h(`div.ph.${p.theme}`, { dir: langView === 'ar' ? 'rtl' : 'ltr' }, plain(p.headline?.[langView])),
          h('div.meta', {}, h('span.num', {}, `#${String(p.order).padStart(2, '0')}`), h(`span.st.${p.status}`, {}, p.status), p.source ? h('span.src', { title: `Made with Claude Code from ${p.source.project}` }, '✦ Claude') : null),
          h('div.cap', {}, `${p.slides} slide${p.slides > 1 ? 's' : ''} · ${p.scene}${p.rendered.video ? ' · video ✓' : ''}`));
      }));
  };
  render();
  const off = on('posts', render);
  const el = h('div.view', {}, h('div.home', {},
    h('div.home-head', {}, h('div', {}, h('h1', {}, 'Posts'), h('p', {}, `${state.posts.length} posts · English + Arabic · newest first, like your grid`)),
      h('div.actions', {}, h('a.btn', { href: '#/claude' }, icon('sparkles', { size: 16 }), 'From Claude Code'), h('button.btn.primary', { onclick: () => newPost() }, icon('plus', { size: 16 }), 'New post'))),
    h('div.hero-cards', {},
      h('div.hcard.spark', { onclick: () => { location.hash = '#/claude'; } }, h('div.hi', {}, icon('wand-sparkles', { size: 22 })), h('div', {}, h('b', {}, 'Turn a project into a carousel'), h('span', {}, 'Pick a Claude Code project or chat. Claude writes it in both languages, in the brand style.'))),
      h('div.hcard', { onclick: () => newPost() }, h('div.hi', {}, icon('layout-template', { size: 22 })), h('div', {}, h('b', {}, 'Start from an animation'), h('span', {}, 'Choose a showcase scene, drop in screenshots, write the slides.'))),
      h('div.hcard', { onclick: () => { location.hash = '#/renders'; } }, h('div.hi', {}, icon('clapperboard', { size: 22 })), h('div', {}, h('b', {}, 'Renders'), h('span', {}, 'Images and 8-second videos for feed and Reels, queued in the background.')))),
    h('div.grid-head', {}, h('h2', {}, 'Grid'), seg), grid));
  return { el, destroy: off };
}

// ---------- new post ----------
export function newPost() {
  let scene = (state.scenes.find((s) => s.name === 'showcase-stack') ?? state.scenes.find((s) => s.kind === 'showcase') ?? state.scenes[0])?.name;
  let theme = 'dark';
  const name = h('input.in', { placeholder: 'Project or post name, e.g. Tasky app' });
  const scenes = h('div.scenes-grid');
  const themes = h('div.swatches');
  const render = () => {
    scenes.replaceChildren(...[...state.scenes].filter((s) => s.kind !== 'broken').sort((a, b) => (a.kind === 'showcase' ? 0 : 1) - (b.kind === 'showcase' ? 0 : 1)).map((s) => h(`div.scard${s.name === scene ? '.on' : ''}`, { onclick: () => { scene = s.name; render(); } },
      h(`span.k${s.kind === 'showcase' ? '' : '.service'}`, {}, s.kind === 'showcase' ? '✦ Project showcase' : 'Service demo'), h('b', {}, s.title), h('p', {}, s.description))));
    themes.replaceChildren(...['dark', 'blue', 'light'].map((t) => h(`div.swatch.${t}${t === theme ? '.on' : ''}`, { onclick: () => { theme = t; render(); } }, t[0].toUpperCase() + t.slice(1))));
  };
  render();
  modal({
    title: 'New post', wide: true,
    body: h('div', {}, h('div.field', {}, h('label', {}, 'Name'), name), h('div.field', {}, h('label', {}, 'Theme of the animated cover'), themes), h('div.field', {}, h('label', {}, 'Animation'), scenes)),
    actions: [{ label: 'Cancel' }, { label: 'Create post', primary: true, run: async () => {
      try {
        const r = await apiPost('/api/posts', { name: name.value || 'new-post', scene, theme });
        await loadPosts();
        location.hash = `#/post/${r.post.slug}`;
      } catch (e) { toastError(e); return false; }
    } }],
  });
  setTimeout(() => name.focus(), 50);
}
window.studio = { newPost };

// ---------- renders ----------
function rendersView() {
  const list = h('div');
  const render = () => {
    list.replaceChildren(...(state.jobs.length ? state.jobs.map((j) => h(`div.jobrow.${j.status}`, {},
      h('div.ji', {}, icon(j.status === 'done' ? (j.kind === 'check' && !j.ok ? 'triangle-alert' : 'circle-check') : j.status === 'failed' ? 'circle-x' : j.status === 'cancelled' ? 'ban' : j.kind === 'video' ? 'film' : 'images', { size: 19 })),
      h('div', { style: { minWidth: 0 } },
        h('b', {}, `${state.meta.jobKinds[j.kind]} · `, h('a', { href: `#/post/${j.slug}` }, j.slug), j.source === 'claude' ? h('span.pill', { style: { marginLeft: '8px' } }, '✦ from Claude Code') : null),
        h('div.muted', { style: { fontSize: '12.5px', marginTop: '2px' } }, j.error ?? j.message, ' · ', ago(j.createdAt)),
        ['running', 'queued'].includes(j.status) ? h('div.bar', {}, h('i', { style: { width: `${Math.round(j.progress * 100)}%` } })) : null,
        j.issues?.length ? h('div.vlist', {}, j.issues.slice(0, 5).map((x) => h('div.v.w', {}, x))) : null,
        j.outputs?.length ? h('div.outs', {}, j.outputs.filter((o) => /\.(mp4|png)$/.test(o)).slice(0, 14).map((o) => h('a', { href: `/${o}`, target: '_blank' }, o.split('/').slice(-2).join('/')))) : null),
      ['running', 'queued'].includes(j.status) ? h('button.btn.sm.danger', { onclick: () => apiPost(`/api/jobs/${j.id}/cancel`).catch(toastError) }, 'Cancel') : h('button.btn.sm.ghost', { onclick: async () => modal({ title: 'Log', wide: true, body: h('pre.mono', { style: { whiteSpace: 'pre-wrap', fontSize: '12px', color: 'var(--sub)' } }, await get(`/api/jobs/${j.id}/log`) || '(empty)') }) }, 'Log')))
      : [h('div.empty', {}, h('div', {}, h('div.big', {}, icon('clapperboard', { size: 28 })), h('h3', {}, 'Nothing rendered yet'), h('p', {}, 'Open a post and press Render.')))]));
  };
  render();
  const off = on('jobs', render);
  return { el: h('div.view', {}, h('div.renders', {}, h('h1', {}, 'Renders'), h('p.muted', { style: { margin: '0 0 8px' } }, 'Jobs run one at a time in the background, also when they come from Claude Code. Files land in exports/.'), list)), destroy: off };
}

// ---------- boot ----------
function topRight() {
  const box = $('#top-right');
  const c = state.meta.claude;
  box.replaceChildren(
    h('a.pill', { href: '#/claude', class: c.mcp && c.skill ? 'ok' : c.cli.ok ? 'warn' : '', title: c.mcp ? 'Claude Code is connected: /crapto-post works in any project' : 'Connect Claude Code to use /crapto-post' },
      h('span.dot'), c.mcp && c.skill ? 'Claude Code connected' : c.cli.ok ? 'Connect Claude Code' : 'Claude Code not found'),
  );
}
function jobsCount() {
  const n = state.jobs.filter((j) => j.status === 'running' || j.status === 'queued').length;
  const el = $('#jobs-count'); el.hidden = !n; el.textContent = n;
}

on('jobs', (jobs) => {
  jobsCount();
  // Announce finished renders once.
  for (const j of jobs) {
    if (j.status === 'done' && j.endedAt && Date.now() - j.endedAt < 2500 && !announced.has(j.id)) {
      announced.add(j.id);
      toast(`${state.meta.jobKinds[j.kind]} ready: ${j.slug}${j.kind === 'check' ? ` (${j.ok ? 'all good' : `${j.issues.length} issue${j.issues.length > 1 ? 's' : ''}`})` : ''}`, { kind: j.kind === 'check' && !j.ok ? 'error' : 'ok' });
    }
  }
});
const announced = new Set();
let offlineToast = null;
on('offline', () => { offlineToast ??= toast('Lost connection to the studio server. Is `npm run studio` still running?', { kind: 'error', timeout: 0 }); });
on('online', () => { offlineToast?.remove(); offlineToast = null; });

await Promise.all([loadMeta(), loadPosts(), loadScenes()]);
state.jobs = await get('/api/jobs');
jobsCount();
topRight();
connectEvents();
route();
