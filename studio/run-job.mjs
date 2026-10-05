// Runs one render job (see studio/core/jobs.mjs): waits for its turn in the queue, then runs the
// renderer scripts for one post and records progress in .studio/jobs/<id>.json.
import path from 'node:path';
import { spawn } from 'node:child_process';
import { getJob, writeJob, listJobs } from './core/jobs.mjs';
import { root, exportsOf, getPost } from './core/store.mjs';

const id = process.argv[2];
let job = getJob(id);
if (!job) process.exit(1);
// This process owns the job's state; it only re-reads the file to notice a cancellation.
const save = (patch) => {
  if (getJob(id)?.status === 'cancelled') process.exit(0);
  Object.assign(job, patch);
  writeJob(job);
};
const log = (line) => { job.log = [...(job.log ?? []), line].slice(-40); };

// Queue: wait while an older job is still queued or running.
for (;;) {
  const ahead = listJobs({ limit: 1000 }).filter((j) => j.id !== id && j.createdAt < job.createdAt && (j.status === 'queued' || j.status === 'running'));
  if (!ahead.length) break;
  save({ message: `Waiting for ${ahead.length} job${ahead.length > 1 ? 's' : ''} ahead` });
  await new Promise((r) => setTimeout(r, 1000));
  if (getJob(id)?.status === 'cancelled') process.exit(0);
}

const node = (script, args) => [process.execPath, [path.join(root, script), ...args]];
const steps = [];
if (job.kind === 'stills') steps.push({ cmd: node('design/render.mjs', [job.slug]), units: 2 }); // always both languages
if (job.kind === 'check') steps.push({ cmd: node('design/check-contrast.mjs', [job.slug]), units: 1 });
if (job.kind === 'video') {
  for (const lang of job.langs) for (const format of job.formats) {
    steps.push({ cmd: node('design/motion/render-video.mjs', [job.slug, '--lang', lang, '--format', format]), units: 1, label: `${lang.toUpperCase()} ${format}` });
  }
}

save({ status: 'running', startedAt: Date.now(), message: 'Starting', progress: 0 });
let done = 0; const total = steps.reduce((n, s) => n + s.units, 0);
const failures = [];
let lastWrite = 0;

for (const step of steps) {
  const [bin, args] = step.cmd;
  const code = await new Promise((resolve) => {
    const child = spawn(bin, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    save({ childPid: child.pid });
    let buf = '';
    const onData = (chunk) => {
      buf += chunk;
      const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines.filter(Boolean)) {
        const video = line.match(/^progress \S+ (\S+) (\d+)\/(\d+)/);
        const still = line.match(/^progress \S+ (\S+) stills done/);
        if (video) {
          job.progress = (done + Number(video[2]) / Number(video[3])) / total;
          job.message = `Rendering ${step.label ?? video[1]} video: frame ${video[2]} of ${video[3]}`;
        } else if (still) {
          done += 1; job.progress = done / total; job.message = `Rendered ${still[1].toUpperCase()} cover and slides`;
        } else {
          log(line);
          if (/^FAIL /.test(line)) failures.push(line);
          if (/^warning: /.test(line)) failures.push(line);
        }
        if (Date.now() - lastWrite > 400) { lastWrite = Date.now(); writeJob(job); }
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('close', resolve);
  });
  if (job.kind === 'video') done += 1;
  if (code !== 0 && job.kind !== 'check') {
    save({ status: 'failed', endedAt: Date.now(), error: job.log.slice(-6).join('\n') || `exit code ${code}`, message: 'Failed' });
    process.exit(1);
  }
  if (job.kind === 'check') {
    const summary = job.log.find((l) => l.startsWith('contrast:')) ?? '';
    save({ status: 'done', endedAt: Date.now(), progress: 1, ok: code === 0, issues: failures, message: code === 0 ? `Contrast OK. ${summary.replace('contrast: ', '')}` : `${failures.length} text run${failures.length === 1 ? '' : 's'} below the contrast threshold` });
    process.exit(0);
  }
}

let outputs = [];
try { outputs = exportsOf(getPost(job.slug)).map((f) => f.path); } catch { /* post deleted meanwhile */ }
save({ status: 'done', endedAt: Date.now(), progress: 1, outputs, issues: failures, message: job.kind === 'video' ? `Rendered ${steps.length} video${steps.length > 1 ? 's' : ''}` : 'Rendered cover and slides' });
