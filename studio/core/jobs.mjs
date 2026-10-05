// Render queue. A job renders a post's stills, its videos, or checks its contrast. Each job is a
// detached process (studio/run-job.mjs) that records its state in .studio/jobs/<id>.json, so
// renders keep going if the workspace closes, and jobs started by Claude Code (MCP server) show
// up in the workspace too. Jobs run one at a time, oldest first.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { root, studioDir } from './store.mjs';

export const jobsDir = path.join(studioDir, 'jobs');
export const KINDS = { stills: 'Images (cover + slides)', video: 'Videos (feed + Reel)', check: 'Contrast check' };
const KEEP = 60;

const jobFile = (id) => path.join(jobsDir, `${id}.json`);
const read = (file) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };

export function getJob(id) {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  return read(jobFile(id));
}

export function writeJob(job) {
  fs.mkdirSync(jobsDir, { recursive: true });
  const tmp = `${jobFile(job.id)}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(job, null, 2));
  fs.renameSync(tmp, jobFile(job.id));
}

const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

export function listJobs({ limit = 30 } = {}) {
  if (!fs.existsSync(jobsDir)) return [];
  const jobs = fs.readdirSync(jobsDir).filter((f) => f.endsWith('.json')).map((f) => read(path.join(jobsDir, f))).filter(Boolean);
  for (const j of jobs) {
    // A runner that died (machine restart, killed) leaves its job "running" forever; mark it.
    if ((j.status === 'running' || j.status === 'queued') && j.pid && !alive(j.pid)) {
      j.status = 'failed'; j.error = 'the render process stopped unexpectedly'; j.endedAt ??= Date.now(); writeJob(j);
    }
  }
  return jobs.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
}

// spec: { kind: 'stills' | 'video' | 'check', slug, langs?: ['en','ar'], formats?: ['feed','reel'], source?: 'workspace' | 'claude' }
export function startJob({ kind, slug, langs = ['en', 'ar'], formats = ['feed', 'reel'], source = 'workspace' }) {
  if (!KINDS[kind]) throw new Error(`unknown job kind "${kind}"`);
  const id = `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
  const job = { id, kind, slug, langs, formats, source, status: 'queued', progress: 0, message: 'Waiting in the queue', log: [], outputs: [], createdAt: Date.now() };
  writeJob(job);
  const logFile = fs.openSync(path.join(jobsDir, `${id}.log`), 'a');
  const child = spawn(process.execPath, [path.join(root, 'studio/run-job.mjs'), id], { cwd: root, detached: true, stdio: ['ignore', logFile, logFile], windowsHide: true });
  child.unref();
  job.pid = child.pid; writeJob(job);
  prune();
  return job;
}

export function cancelJob(id) {
  const job = getJob(id);
  if (!job) throw new Error(`no job ${id}`);
  if (job.status === 'queued' || job.status === 'running') {
    for (const pid of [job.childPid, job.pid].filter(Boolean)) {
      try { process.kill(process.platform === 'win32' ? pid : -pid, 'SIGTERM'); } catch { try { process.kill(pid, 'SIGTERM'); } catch { /* already gone */ } }
    }
    Object.assign(job, { status: 'cancelled', message: 'Cancelled', endedAt: Date.now() });
    writeJob(job);
  }
  return job;
}

function prune() {
  const jobs = listJobs({ limit: 1000 });
  for (const j of jobs.slice(KEEP)) {
    if (j.status === 'running' || j.status === 'queued') continue;
    fs.rmSync(jobFile(j.id), { force: true });
    fs.rmSync(path.join(jobsDir, `${j.id}.log`), { force: true });
  }
}

// Resolves when the job ends (polling its file); used by the MCP server for stills and checks.
export async function waitForJob(id, { timeoutMs = 10 * 60_000, onUpdate } = {}) {
  const start = Date.now();
  for (;;) {
    const job = getJob(id);
    onUpdate?.(job);
    if (!job || ['done', 'failed', 'cancelled'].includes(job.status)) return job;
    if (Date.now() - start > timeoutMs) return job;
    await new Promise((r) => setTimeout(r, 700));
  }
}
