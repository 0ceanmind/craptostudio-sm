// Shared state and a small event bus for the workspace views.
import { get } from './dom.js';

export const state = {
  meta: null,
  posts: [],
  scenes: [],
  jobs: [],
};

const listeners = new Map();
export const on = (type, fn) => { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); return () => listeners.get(type).delete(fn); };
export const emit = (type, data) => { for (const fn of listeners.get(type) ?? []) fn(data); };

export async function loadPosts() { state.posts = await get('/api/posts'); emit('posts', state.posts); return state.posts; }
export async function loadScenes() { state.scenes = await get('/api/scenes'); emit('scenes', state.scenes); return state.scenes; }
export async function loadMeta() { state.meta = await get('/api/meta'); return state.meta; }
export const sceneOf = (name) => state.scenes.find((s) => s.name === name);

// Server-Sent Events: posts saved anywhere (here, Claude Code, by hand), render progress, Claude runs.
export function connectEvents() {
  const es = new EventSource('/api/events');
  es.addEventListener('posts', () => loadPosts().then(() => emit('posts-changed')));
  es.addEventListener('scenes', () => loadScenes());
  es.addEventListener('jobs', (e) => { state.jobs = JSON.parse(e.data); emit('jobs', state.jobs); });
  es.addEventListener('run', (e) => emit('run', JSON.parse(e.data)));
  es.onerror = () => emit('offline');
  es.onopen = () => emit('online');
  return es;
}
