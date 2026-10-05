// The bridge to your Claude Code: lists the projects and chats on this computer (from
// ~/.claude/projects), and runs Claude Code headlessly (`claude -p`) inside a project so it can
// read the code, optionally continue one of your chats about it, and build a carousel with the
// crapto-studio MCP tools. Uses your own Claude Code install, login and settings.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { root, studioDir } from './store.mjs';

export const claudeHome = () => process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const runsDir = path.join(studioDir, 'runs');
export const playbookFile = path.join(root, 'studio/claude/playbook.md');

// When the studio itself was started from inside a Claude Code session (e.g. by Claude's Bash
// tool), these variables identify that session. A child `claude` must not inherit them, or it
// would write into the parent's conversation instead of starting its own.
const SESSION_VARS = ['CLAUDE_CODE_SESSION_ID', 'CLAUDECODE', 'CLAUDE_CODE_CHILD_SESSION', 'CLAUDE_PID', 'CLAUDE_CODE_MESSAGING_SOCKET',
  'CLAUDE_CODE_MESSAGING_TOKEN', 'CLAUDE_AFTER_LAST_COMPACT', 'CLAUDE_CODE_SESSION_ATTENDED', 'CLAUDE_CODE_DIAGNOSTICS_FILE', 'CLAUDE_CODE_REMOTE_SESSION_ID'];
export function childEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  for (const k of SESSION_VARS) delete env[k];
  return env;
}

// ---------- Is Claude Code installed? ----------

let cliInfo = null;
export function claudeCli({ refresh = false } = {}) {
  if (cliInfo && !refresh) return cliInfo;
  const bin = process.env.CLAUDE_BIN || 'claude';
  const r = spawnSync(bin, ['--version'], { encoding: 'utf8', shell: process.platform === 'win32', timeout: 15_000, env: childEnv() });
  cliInfo = r.status === 0 ? { ok: true, bin, version: r.stdout.trim() } : { ok: false, bin, error: (r.error?.message || r.stderr || 'not found').trim() };
  return cliInfo;
}

// Is the crapto-studio MCP server registered with Claude Code, and is /crapto-post installed?
export function connectionStatus() {
  const home = claudeHome();
  let mcp = false;
  for (const file of [path.join(os.homedir(), '.claude.json'), path.join(home, '.claude.json'), path.join(home, 'settings.json')]) {
    try { if (JSON.parse(fs.readFileSync(file, 'utf8')).mcpServers?.['crapto-studio']) mcp = true; } catch { /* not there */ }
  }
  const skill = fs.existsSync(path.join(home, 'skills/crapto-post/SKILL.md'));
  return { mcp, skill, cli: claudeCli() };
}

// ---------- Projects and chats ----------

const readSlice = (file, start, length) => {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(length);
    const n = fs.readSync(fd, buf, 0, length, start);
    return buf.subarray(0, n).toString('utf8');
  } finally { fs.closeSync(fd); }
};
const lines = (text) => text.split('\n').map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const promptText = (m) => {
  const c = m?.message?.content;
  const s = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b.type === 'text').map((b) => b.text).join(' ') : '';
  return s.startsWith('<') || s.startsWith('Caveat:') ? '' : s.trim();
};

const sessionCache = new Map();
function readSession(file) {
  const st = fs.statSync(file);
  const hit = sessionCache.get(file);
  if (hit && hit.mtime === st.mtimeMs) return hit.info;
  const head = lines(readSlice(file, 0, Math.min(st.size, 512 * 1024)));
  const tail = st.size > 512 * 1024 ? lines(readSlice(file, Math.max(0, st.size - 128 * 1024), 128 * 1024)) : head;
  const all = [...head, ...tail];
  const cwd = all.find((o) => o.cwd)?.cwd ?? null;
  const first = head.filter((o) => o.type === 'user' && !o.isSidechain).map(promptText).find(Boolean) ?? '';
  const named = [...all].reverse().find((o) => ['summary', 'custom-title', 'ai-title'].includes(o.type));
  const last = [...tail].reverse().find((o) => o.type === 'last-prompt')?.lastPrompt ?? '';
  const info = {
    id: path.basename(file, '.jsonl'),
    cwd,
    title: (named?.customTitle || named?.title || named?.aiTitle || named?.summary || first || '(untitled chat)').replace(/\s+/g, ' ').slice(0, 140),
    firstPrompt: first.slice(0, 400),
    lastPrompt: typeof last === 'string' ? last.slice(0, 200) : '',
    updatedAt: st.mtimeMs,
    size: st.size,
    branch: all.find((o) => o.gitBranch)?.gitBranch ?? null,
  };
  sessionCache.set(file, { mtime: st.mtimeMs, info });
  return info;
}

// Every project folder Claude Code has worked in, newest activity first, with its chats.
export function listProjects() {
  const dir = path.join(claudeHome(), 'projects');
  if (!fs.existsSync(dir)) return [];
  const byCwd = new Map();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pdir = path.join(dir, entry.name);
    for (const f of fs.readdirSync(pdir)) {
      if (!f.endsWith('.jsonl')) continue;
      let s;
      try { s = readSession(path.join(pdir, f)); } catch { continue; }
      if (s.size < 200) continue;
      const cwd = s.cwd ?? entry.name;
      if (!byCwd.has(cwd)) byCwd.set(cwd, { cwd, name: path.basename(cwd), exists: fs.existsSync(cwd), isStudio: path.resolve(cwd) === root, sessions: [] });
      byCwd.get(cwd).sessions.push(s);
    }
  }
  const projects = [...byCwd.values()];
  for (const p of projects) {
    p.sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    p.updatedAt = p.sessions[0]?.updatedAt ?? 0;
    p.readme = ['README.md', 'readme.md', 'README'].map((f) => path.join(p.cwd, f)).find((f) => p.exists && fs.existsSync(f)) ? true : false;
  }
  return projects.sort((a, b) => b.updatedAt - a.updatedAt);
}

// ---------- Headless runs ----------

export const runs = new Map(); // id -> run
export const runEvents = new EventEmitter();
runEvents.setMaxListeners(100);

const brief = (s, n = 120) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };
function describeTool(name, input = {}) {
  const short = name.replace(/^mcp__crapto-studio__/, 'studio: ');
  if (input.file_path) return `${short} ${input.file_path.split(/[\\/]/).slice(-2).join('/')}`;
  if (input.pattern) return `${short} ${input.pattern}`;
  if (input.post?.slug) return `${short} “${input.post.slug}”`;
  if (input.slug) return `${short} “${input.slug}”`;
  if (input.query) return `${short} “${input.query}”`;
  if (input.source_path) return `${short} ${path.basename(input.source_path)}`;
  return short;
}

function pushEvent(run, ev) {
  ev.at = Date.now();
  run.events.push(ev);
  runEvents.emit('event', run.id, ev);
}

function persist(run) {
  fs.mkdirSync(runsDir, { recursive: true });
  const { child, ...data } = run;
  fs.writeFileSync(path.join(runsDir, `${run.id}.json`), JSON.stringify(data, null, 2));
}

export function getRun(id) {
  if (runs.has(id)) { const { child, ...r } = runs.get(id); return r; }
  try { return JSON.parse(fs.readFileSync(path.join(runsDir, `${id}.json`), 'utf8')); } catch { return null; }
}

export function listRuns({ limit = 20 } = {}) {
  const saved = fs.existsSync(runsDir) ? fs.readdirSync(runsDir).filter((f) => f.endsWith('.json')).map((f) => { try { return JSON.parse(fs.readFileSync(path.join(runsDir, f), 'utf8')); } catch { return null; } }).filter(Boolean) : [];
  const live = [...runs.values()].map(({ child, ...r }) => r);
  const merged = new Map([...saved, ...live].map((r) => [r.id, r]));
  return [...merged.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
    .map(({ events, ...r }) => ({ ...r, eventCount: events?.length ?? 0 }));
}

function buildPrompt({ cwd, sessionId, request, followUp, editSlug }) {
  if (followUp) return followUp;
  if (editSlug) {
    return `You are editing an existing post in the Crapto Studio workspace through the crapto-studio tools.

1. Call get_brand_kit and get_post("${editSlug}").
2. Make this change: ${request.trim()}
3. Keep everything else as it is. Both languages stay in sync: if you change the English, write the Arabic (Modern Standard Arabic, written, not translated) and the other way round, unless the request is about one language only.
4. Save with save_post (same slug), call preview_post and fix anything that looks wrong, then render_post (stills only).
5. Don't touch other posts${cwd === root ? '' : ' or any project files'}. Reply with a short summary of what you changed.`;
  }
  const playbook = fs.readFileSync(playbookFile, 'utf8');
  return `${playbook}

---

## This request (from the Crapto Studio workspace)

- Project folder: ${cwd}
- ${sessionId ? 'You are continuing the Claude Code chat in which this project was built. Use what was built and decided in this conversation as your main source, and check the code where you need details.' : 'Explore the project folder to understand what it is (README, package files, main source files, screenshots or images in the repo).'}
- Do not modify any files in the project folder. Everything you make goes into the studio through the crapto-studio tools.
- Brief from Crapto Studio: ${request?.trim() ? request.trim() : '(none: make the strongest project-showcase carousel you can)'}

Start now: call get_brand_kit first, then follow the playbook to the end (save, preview and fix, then render the stills). Finish with a short summary: the post slug, what each slide shows, and anything you want me to check.`;
}

// Starts Claude Code in `cwd`. With `sessionId`, it continues (a fork of) that chat, so Claude has
// the whole history of how the project was built. `followUpOf` continues an earlier run.
export function startRun({ cwd, sessionId = null, request = '', followUpOf = null, message = '', model = '', editSlug = null }) {
  const cli = claudeCli({ refresh: true });
  if (!cli.ok) throw new Error(`Claude Code CLI not found (${cli.error}). Install Claude Code, or set CLAUDE_BIN to its path.`);
  const parent = followUpOf ? getRun(followUpOf) : null;
  if (followUpOf && !parent?.claudeSessionId) throw new Error('That run has no Claude session to continue yet.');
  const workdir = parent?.cwd ?? cwd;
  if (!workdir || !fs.existsSync(workdir)) throw new Error(`project folder not found: ${workdir}`);

  const id = `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
  fs.mkdirSync(runsDir, { recursive: true });
  const mcpConfig = path.join(runsDir, `${id}-mcp.json`);
  fs.writeFileSync(mcpConfig, JSON.stringify({
    mcpServers: { 'crapto-studio': { command: process.execPath, args: [path.join(root, 'studio/mcp.mjs')], env: { CRAPTO_STUDIO_SOURCE: 'workspace', CRAPTO_STUDIO_RUN: id } } },
  }, null, 2));

  const args = ['-p', '--output-format', 'stream-json', '--verbose',
    '--mcp-config', mcpConfig, '--strict-mcp-config',
    // Read the project, use the studio tools; never edit the project or run commands in it.
    '--allowedTools', 'Read,Glob,Grep,LS,TodoWrite,mcp__crapto-studio',
    '--disallowedTools', 'Bash,Edit,Write,MultiEdit,NotebookEdit,WebFetch,WebSearch'];
  if (model) args.push('--model', model);
  if (parent) args.push('--resume', parent.claudeSessionId);
  else if (sessionId) args.push('--resume', sessionId, '--fork-session');

  const run = {
    id, cwd: workdir, project: path.basename(workdir), sessionId: parent?.sessionId ?? sessionId, followUpOf, editSlug: parent?.editSlug ?? editSlug, request: followUpOf ? message : request,
    status: 'running', createdAt: Date.now(), events: [], posts: [...(parent?.posts ?? [])], claudeSessionId: parent?.claudeSessionId ?? null,
  };
  const prompt = buildPrompt({ cwd: workdir, sessionId, request, followUp: followUpOf ? message : null, editSlug });
  const win = process.platform === 'win32'; // `claude` is a .cmd shim there: needs a shell, and quoting
  const child = spawn(cli.bin, win ? args.map((a) => (/\s/.test(a) ? `"${a}"` : a)) : args, { cwd: workdir, shell: win, env: childEnv({ CRAPTO_STUDIO_RUN: id }), windowsHide: true });
  run.child = child;
  runs.set(id, run);
  pushEvent(run, { kind: 'status', text: parent ? 'Continuing the conversation…' : editSlug ? `Asking Claude to edit “${editSlug}”…` : sessionId ? 'Opening your chat in Claude Code…' : 'Starting Claude Code in the project…' });
  child.stdin.end(prompt);

  const toolNames = new Map();
  let buf = '';
  child.stdout.on('data', (chunk) => {
    buf += chunk;
    const parts = buf.split('\n'); buf = parts.pop();
    for (const line of parts) {
      let m; try { m = JSON.parse(line); } catch { continue; }
      if (m.type === 'system' && m.subtype === 'init') {
        run.claudeSessionId = m.session_id; run.model = m.model;
        const studio = (m.mcp_servers ?? []).find((s) => s.name === 'crapto-studio');
        pushEvent(run, { kind: 'init', text: `Claude Code ${m.claude_code_version ?? ''} · ${m.model ?? ''}`.trim(), mcp: studio?.status ?? 'unknown' });
      } else if (m.type === 'assistant') {
        for (const b of m.message?.content ?? []) {
          if (b.type === 'text' && b.text.trim()) pushEvent(run, { kind: 'text', text: b.text.trim() });
          if (b.type === 'tool_use') {
            toolNames.set(b.id, b.name);
            // ToolSearch only loads tool definitions; it isn't a step worth showing.
            if (b.name !== 'ToolSearch') pushEvent(run, { kind: 'tool', name: b.name, text: describeTool(b.name, b.input) });
            if (/save_post$/.test(b.name) && b.input?.post?.slug) run.pendingSlug = b.input.post.slug;
          }
        }
      } else if (m.type === 'user') {
        for (const b of Array.isArray(m.message?.content) ? m.message.content : []) {
          if (b.type !== 'tool_result') continue;
          const name = toolNames.get(b.tool_use_id) ?? '';
          const text = Array.isArray(b.content) ? b.content.filter((c) => c.type === 'text').map((c) => c.text).join(' ') : String(b.content ?? '');
          if (/save_post$/.test(name) && !b.is_error && run.pendingSlug) {
            const slug = (text.match(/"slug":\s*"([a-z0-9-]+)"/) ?? [])[1] ?? run.pendingSlug;
            if (!run.posts.includes(slug)) run.posts.push(slug);
            pushEvent(run, { kind: 'post', slug, text: `Saved post “${slug}”` });
          }
          if (b.is_error) pushEvent(run, { kind: 'tool_error', name, text: brief(text, 300) });
        }
      } else if (m.type === 'result') {
        run.result = { ok: !m.is_error && m.subtype === 'success', text: m.result ?? '', cost: m.total_cost_usd, turns: m.num_turns, durationMs: m.duration_ms };
        if (m.session_id) run.claudeSessionId = m.session_id;
      }
    }
  });
  let stderr = '';
  child.stderr.on('data', (c) => { stderr = (stderr + c).slice(-4000); });
  child.on('error', (e) => { stderr += e.message; });
  child.on('close', (code) => {
    run.status = run.cancelled ? 'cancelled' : run.result?.ok ? 'done' : 'failed';
    if (run.status === 'failed') run.error = run.result?.text || stderr.trim().split('\n').slice(-5).join('\n') || `Claude Code exited with code ${code}`;
    run.endedAt = Date.now();
    // The final answer is already in the feed as Claude's last message; don't repeat it.
    const lastText = [...run.events].reverse().find((e) => e.kind === 'text')?.text ?? '';
    const finalText = run.result?.text?.trim() ?? '';
    pushEvent(run, { kind: 'end', status: run.status, text: run.status === 'done' ? (finalText && finalText !== lastText ? finalText : 'Finished.') : run.error ?? 'Stopped.' });
    persist(run);
    fs.rmSync(mcpConfig, { force: true });
  });
  persist(run);
  const { child: _c, ...pub } = run;
  return pub;
}

export function stopRun(id) {
  const run = runs.get(id);
  if (!run || run.status !== 'running') return getRun(id);
  run.cancelled = true;
  run.child?.kill('SIGTERM');
  return getRun(id);
}

// The command that opens the same conversation in a terminal, to keep going by hand.
export function resumeCommand(run) {
  if (!run?.claudeSessionId) return null;
  const q = (s) => (/^[\w./-]+$/.test(s) ? s : `"${s.replace(/"/g, '\\"')}"`);
  return `cd ${q(run.cwd)} && claude --resume ${run.claudeSessionId}`;
}
