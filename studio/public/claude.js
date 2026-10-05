// "From Claude Code": pick one of your Claude Code projects (and optionally one of its chats),
// and Claude turns it into a branded carousel, live. Plus the one-time connection that adds
// /crapto-post to Claude Code itself.
import { h, icon, get, post as apiPost, toast, toastError, ago, copyText, debounce } from './dom.js';
import { state, on, loadPosts } from './state.js';

const size = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

const SUGGESTIONS = [
  'Focus on the main feature and who it helps',
  'Make it a case study: problem → what we built → result',
  'Show the tech stack, for developers',
  'Playful tone, aimed at students',
];

export function claudeView(params) {
  let projects = []; let filter = ''; let selected = null; let chat = null; let runs = []; let activeRun = null; let status = null;
  const disposers = [];
  const list = h('div.items');
  const main = h('div.cmain');
  const search = h('input.in', { placeholder: 'Search projects…', oninput: debounce(() => { filter = search.value.toLowerCase(); renderList(); }, 120) });
  const el = h('div.view.claude', {}, h('aside.plist', {}, h('div.head', {}, h('h2', {}, 'Your Claude Code projects'), h('p.muted', { style: { margin: '0 0 10px', fontSize: '12.5px' } }, 'Every folder you’ve worked in with Claude Code on this computer.'), search), list), main);

  async function load() {
    [projects, status, runs] = await Promise.all([get('/api/claude/projects'), get('/api/claude/status'), get('/api/claude/runs')]);
    const want = params.get('cwd');
    selected = (want && projects.find((p) => p.cwd === want)) || selected || projects.find((p) => !p.isStudio && p.exists) || projects[0] || null;
    const runId = params.get('run');
    if (runId) activeRun = await get(`/api/claude/runs/${runId}`).catch(() => null);
    else if (selected) { const r = runs.find((x) => x.cwd === selected.cwd); if (r) activeRun = await get(`/api/claude/runs/${r.id}`).catch(() => null); }
    renderList(); renderMain();
  }

  function renderList() {
    const items = projects.filter((p) => !filter || p.name.toLowerCase().includes(filter) || p.cwd.toLowerCase().includes(filter));
    list.replaceChildren(...items.map((p) => h(`div.pitem${p === selected ? '.on' : ''}`, { onclick: () => { selected = p; chat = null; const r = runs.find((x) => x.cwd === p.cwd); activeRun = null; renderList(); renderMain(); if (r) get(`/api/claude/runs/${r.id}`).then((x) => { activeRun = x; renderMain(); }); } },
      h('b', {}, icon(p.isStudio ? 'palette' : 'folder-git-2', { size: 15 }), p.name, p.isStudio ? h('span.pill', { style: { padding: '1px 7px', fontSize: '10px' } }, 'this studio') : null, !p.exists ? h('span.pill.err', { style: { padding: '1px 7px', fontSize: '10px' } }, 'missing') : null),
      h('div.path', {}, p.cwd),
      h('div.info', {}, `${p.sessions.length} chat${p.sessions.length === 1 ? '' : 's'} · ${ago(p.updatedAt)}`))));
    if (!items.length) list.append(h('p.dim', { style: { padding: '12px' } }, projects.length ? 'No match.' : 'No Claude Code projects found in ~/.claude/projects yet.'));
  }

  function connectCard() {
    const s = status ?? {};
    const step = (done, n, title, body) => h(`div.stepc${done ? '.done' : ''}`, {}, h('span.n', {}, done ? '✓' : n), h('div', { style: { flex: 1, minWidth: 0 } }, h('b', {}, title), body));
    return h('div.card2', {},
      h('h3', {}, 'Use it from inside Claude Code'),
      h('p.muted', { style: { margin: '0 0 14px', fontSize: '13px' } }, 'Connect once, then in any project just type /crapto-post in Claude Code. The post appears here live.'),
      h('div.connect', {},
        step(s.cli?.ok, 1, s.cli?.ok ? `Claude Code ${s.cli.version.replace(/\s*\(Claude Code\)/, '')}` : 'Install Claude Code', s.cli?.ok ? null : h('p.dim', { style: { margin: '4px 0 0', fontSize: '12.5px' } }, 'The studio uses your own Claude Code install and login.')),
        step(s.mcp && s.skill, 2, s.mcp && s.skill ? 'Connected: MCP server + /crapto-post' : 'Connect the studio to Claude Code',
          s.mcp && s.skill ? null : h('div', {}, h('code.cmd', {}, 'npm run connect'), h('button.btn.sm.primary', { style: { marginTop: '8px' }, disabled: !s.cli?.ok, onclick: async (e) => {
            e.currentTarget.disabled = true;
            try { const r = await apiPost('/api/connect'); status = r.status; toast(r.ok ? 'Connected to Claude Code' : 'Could not connect: see the details', { kind: r.ok ? 'ok' : 'error' }); if (!r.ok) console.log(r.output); renderMain(); } catch (err) { toastError(err); }
          } }, icon('plug', { size: 14 }), 'Connect now'))),
        step(false, 3, 'In any project, ask Claude', h('code.cmd', {}, '/crapto-post focus on the offline mode'))));
  }

  function renderMain() {
    main.replaceChildren();
    if (!selected) { main.append(h('div.cgrid', {}, h('div.empty', {}, h('div', {}, h('div.big', {}, icon('sparkles', { size: 28 })), h('h2', {}, 'No projects yet'), h('p', {}, 'Once you build something with Claude Code, it shows up here.'))), connectCard())); return; }
    const p = selected;
    const brief = h('textarea.in', { rows: 3, placeholder: 'Optional brief: what to focus on, who it’s for, tone…' });
    const chips = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 14px' } }, SUGGESTIONS.map((s) => h('button.pill', { style: { cursor: 'pointer', background: 'transparent' }, onclick: () => { brief.value = s; } }, s)));
    const chatList = h('div.chats', {},
      h(`div.chat${chat === null ? '.on' : ''}`, { onclick: () => { chat = null; renderMain(); } }, icon('scan-search', { size: 16 }), h('div', {}, h('b', {}, 'Fresh look at the code'), h('span', {}, 'Claude reads the project from scratch'))),
      p.sessions.slice(0, 30).map((s) => h(`div.chat${chat === s.id ? '.on' : ''}`, { onclick: () => { chat = s.id; renderMain(); } }, icon('messages-square', { size: 16 }),
        h('div', { style: { minWidth: 0 } }, h('b', {}, s.title), h('span', {}, `${ago(s.updatedAt)}${s.branch ? ` · ${s.branch}` : ''} · ${size(s.size)}`)))));
    const model = h('select.in', { onchange: () => localStorage.setItem('studio.model', model.value) },
      [['', 'Your Claude Code default model'], ['opus', 'Opus: best writing and design judgement'], ['sonnet', 'Sonnet: faster']].map(([v, l]) => h('option', { value: v, selected: (localStorage.getItem('studio.model') ?? '') === v }, l)));
    const go = h('button.btn.spark', { style: { width: '100%', height: '44px', fontSize: '15px' }, disabled: !p.exists || !status?.cli?.ok, onclick: async () => {
      go.disabled = true;
      try {
        const r = await apiPost('/api/claude/runs', { cwd: p.cwd, sessionId: chat, request: brief.value, model: model.value });
        activeRun = r; runs = await get('/api/claude/runs'); renderMain();
      } catch (e) { toastError(e); go.disabled = false; }
    } }, icon('wand-sparkles', { size: 18 }), 'Generate carousel');

    const left = h('div', {},
      h('div.card2', {},
        h('h3', {}, p.name), h('div.mono.dim', { style: { fontSize: '11.5px', wordBreak: 'break-all' } }, p.cwd),
        h('div.flabel', { style: { marginTop: '16px' } }, 'Context', h('span.hint', {}, 'continue a chat = Claude remembers how it was built')),
        chatList,
        h('div.flabel', {}, 'Brief'), brief, chips,
        h('div.flabel', {}, 'Model'), h('div', { style: { marginBottom: '14px' } }, model),
        go,
        !status?.cli?.ok ? h('p.dim', { style: { fontSize: '12px' } }, 'Claude Code CLI not found on this computer.') : null,
        h('p.dim', { style: { fontSize: '12px', margin: '10px 0 0' } }, 'Claude can read the project and use the studio’s tools; it can’t change your project files or run commands. Chats are forked, so your original chat stays untouched.')),
      h('div', { style: { marginTop: '18px' } }, connectCard()));
    main.append(h('div', { style: { marginBottom: '18px' } }, h('h1', { style: { margin: '0', fontSize: '26px' } }, 'Make a post from a project'), h('p.muted', { style: { margin: '4px 0 0' } }, 'Claude reads what you built, writes the carousel in English and Arabic in the brand style, checks it and renders it.')),
      h('div.cgrid', {}, left, runPanel()));
  }

  // ---------- the live run ----------
  const feedEls = new Map();
  function runPanel() {
    const projectRuns = runs.filter((r) => r.cwd === selected?.cwd);
    if (!activeRun) {
      return h('div.card2', {}, h('div.empty', { style: { padding: '40px 10px' } }, h('div', {},
        h('div.big', {}, icon('wand-sparkles', { size: 28 })), h('h3', {}, 'Ready when you are'),
        h('p.muted', {}, 'Pick a chat (or a fresh look), add a brief if you like, and press Generate. You’ll watch Claude work here.'))),
      projectRuns.length ? h('div.runs', {}, h('div.flabel', {}, 'Earlier runs'), projectRuns.map(runRow)) : null);
    }
    const r = activeRun;
    const feed = h('div.feed');
    feedEls.set(r.id, feed);
    for (const ev of r.events ?? []) feed.append(evEl(ev));
    const running = r.status === 'running';
    const msg = h('textarea.in', { rows: 2, placeholder: running ? 'Claude is working…' : 'Ask for changes: “make the headline punchier”, “use the blue theme”, “add a slide about the API”…', disabled: running });
    const send = async () => {
      if (!msg.value.trim()) return;
      try { activeRun = await apiPost(`/api/claude/runs/${r.id}/message`, { message: msg.value }); runs = await get('/api/claude/runs'); renderMain(); } catch (e) { toastError(e); }
    };
    msg.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); });
    return h('div.card2', {},
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        h('h3', { style: { flex: 1 } }, r.followUpOf ? 'Follow-up' : 'Generating a carousel'),
        h(`span.pill.${r.status === 'done' ? 'ok' : r.status === 'failed' ? 'err' : 'warn'}`, {}, h('span.dot'), r.status),
        running ? h('button.btn.sm.danger', { onclick: () => apiPost(`/api/claude/runs/${r.id}/stop`).catch(toastError) }, icon('square', { size: 13 }), 'Stop') : null),
      r.request ? h('p.muted', { style: { margin: '6px 0 0', fontSize: '13px' } }, `“${r.request}”`) : null,
      feed,
      running ? h('div.ev', { 'data-typing': '1' }, h('span.typing-dots', {}, h('i'), h('i'), h('i'))) : null,
      r.result?.cost ? h('p.dim', { style: { fontSize: '11.5px', margin: '10px 0 0' } }, `${r.result.turns} turns · ${(r.result.durationMs / 1000).toFixed(0)} s${r.result.cost ? ` · $${r.result.cost.toFixed(2)} (API-equivalent)` : ''}`) : null,
      r.claudeSessionId ? h('div.runbar', {}, msg, h('button.btn.primary', { disabled: running, onclick: send }, icon('send', { size: 15 }))) : null,
      r.resume ? h('div', { style: { marginTop: '12px' } }, h('div.flabel', {}, 'Continue in your terminal'), h('div.copybox', {}, h('code.cmd', {}, r.resume), h('button.btn.sm', { onclick: () => copyText(r.resume) }, icon('copy', { size: 13 })))) : null,
      runs.filter((x) => x.cwd === r.cwd && x.id !== r.id).length ? h('div.runs', {}, h('div.flabel', { style: { marginTop: '14px' } }, 'Other runs for this project'), runs.filter((x) => x.cwd === r.cwd && x.id !== r.id).slice(0, 6).map(runRow)) : null);
  }

  const runRow = (r) => h(`div.runrow${activeRun?.id === r.id ? '.on' : ''}`, { onclick: async () => { activeRun = await get(`/api/claude/runs/${r.id}`); renderMain(); } },
    icon(r.status === 'done' ? 'circle-check' : r.status === 'failed' ? 'circle-x' : 'loader', { size: 15 }),
    h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, r.request || (r.sessionId ? 'From a chat' : 'Fresh look')),
    r.posts?.length ? h('span.pill', {}, r.posts.join(', ')) : null, h('span.dim', {}, ago(r.createdAt)));

  function evEl(ev) {
    if (ev.kind === 'tool') return h('div.ev.tool', {}, icon(/studio:/.test(ev.text) ? 'palette' : /^(Read|Glob|Grep|LS)/.test(ev.text) ? 'file-search' : 'wrench', { size: 14 }), ev.text);
    if (ev.kind === 'text') return h('div.ev.text', {}, icon('sparkles', { size: 16 }), h('div.bubble', {}, ev.text));
    if (ev.kind === 'post') {
      const s = state.posts.find((x) => x.slug === ev.slug);
      return h('div.ev.post', {}, icon('image', { size: 16 }), h('div.pc', {}, s?.cover ? h('img', { src: s.cover }) : null, h('div', { style: { flex: 1 } }, h('b', {}, ev.text), h('div.dim', { style: { fontSize: '12px' } }, 'Live in the workspace')), h('a.btn.sm', { href: `#/post/${ev.slug}` }, 'Open', icon('arrow-right', { size: 14 }))));
    }
    if (ev.kind === 'tool_error') return h('div.ev.err', {}, icon('triangle-alert', { size: 14 }), `${ev.name?.replace('mcp__crapto-studio__', '') ?? 'tool'}: ${ev.text}`);
    if (ev.kind === 'end') return h(`div.ev.text${ev.status === 'done' ? '.end' : ''}`, {}, icon(ev.status === 'done' ? 'circle-check' : 'circle-x', { size: 16 }), h('div.bubble', {}, ev.text));
    return h('div.ev.tool', {}, icon(ev.kind === 'init' ? 'terminal' : 'info', { size: 14 }), ev.text);
  }

  disposers.push(on('run', async ({ id, event }) => {
    const i = runs.findIndex((r) => r.id === id);
    if (activeRun?.id === id) {
      activeRun.events = [...(activeRun.events ?? []), event];
      const feed = feedEls.get(id);
      if (event.kind === 'end' || event.kind === 'init') { activeRun = await get(`/api/claude/runs/${id}`); runs = await get('/api/claude/runs'); renderMain(); if (event.kind === 'end') { loadPosts(); toast(event.status === 'done' ? 'Claude finished the post' : 'Claude stopped', { kind: event.status === 'done' ? 'ok' : 'error' }); } return; }
      if (feed) { feed.append(evEl(event)); main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' }); }
    } else if (i < 0) runs = await get('/api/claude/runs');
  }));

  load().catch(toastError);
  return { el, destroy() { disposers.forEach((d) => d()); } };
}
