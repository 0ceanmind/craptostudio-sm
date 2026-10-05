// Tiny DOM helpers, API client, icons, toasts and modals for the workspace UI.

export function h(tag, props = {}, ...children) {
  const [name, ...classes] = tag.split('.');
  const el = name === 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(name || 'div');
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = [el.className, v].filter(Boolean).join(' ');
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked' || k === 'disabled' || k === 'selected') el[k] = !!v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}
export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
export const clear = (el) => { el.replaceChildren(); return el; };
export const $ = (sel, root = document) => root.querySelector(sel);

// ---------- API ----------

export async function api(method, url, data, { raw = false, headers = {} } = {}) {
  const opts = { method, headers: { 'x-studio': '1', ...headers } };
  if (data !== undefined) {
    if (data instanceof Blob || data instanceof ArrayBuffer) opts.body = data;
    else { opts.body = JSON.stringify(data); opts.headers['content-type'] = 'application/json'; }
  }
  const res = await fetch(url, opts);
  if (raw) return res;
  const type = res.headers.get('content-type') ?? '';
  const out = type.includes('json') ? await res.json() : await res.text();
  if (!res.ok) {
    const err = new Error(out?.error ?? `HTTP ${res.status}`);
    Object.assign(err, out, { status: res.status });
    throw err;
  }
  return out;
}
export const get = (url) => api('GET', url);
export const post = (url, data = {}) => api('POST', url, data);
export const put = (url, data) => api('PUT', url, data);
export const del = (url) => api('DELETE', url);

// ---------- Lucide icons (inline, so they take the text colour) ----------

const iconCache = new Map();
export function icon(name, { size = 18, cls = '' } = {}) {
  const span = h(`span.ico${cls ? `.${cls}` : ''}`, { style: { width: `${size}px`, height: `${size}px` }, 'aria-hidden': 'true' });
  if (!name) return span;
  if (!iconCache.has(name)) iconCache.set(name, fetch(`/icons/${name}.svg`).then((r) => (r.ok ? r.text() : '')).catch(() => ''));
  iconCache.get(name).then((svg) => { span.innerHTML = svg.replace(/<!--.*?-->/s, ''); });
  return span;
}

// ---------- Toasts ----------

let toastBox;
export function toast(message, { kind = 'info', timeout = 3800, action } = {}) {
  toastBox ??= document.body.appendChild(h('div.toasts'));
  const el = h(`div.toast.${kind}`, {}, icon(kind === 'error' ? 'circle-alert' : kind === 'ok' ? 'circle-check' : 'info', { size: 18 }), h('span', {}, message),
    action ? h('button.link', { onclick: () => { action.run(); el.remove(); } }, action.label) : null);
  toastBox.append(el);
  if (timeout) setTimeout(() => el.classList.add('out'), timeout);
  if (timeout) setTimeout(() => el.remove(), timeout + 400);
  return el;
}
export const toastError = (e) => toast(e.errors ? `${e.errors.length} problem${e.errors.length > 1 ? 's' : ''}: ${e.errors[0]}` : e.message, { kind: 'error', timeout: 7000 });

// ---------- Modal ----------

export function modal({ title, body, actions = [], wide = false, onClose }) {
  const close = () => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 180); document.removeEventListener('keydown', esc); onClose?.(); };
  const esc = (e) => { if (e.key === 'Escape') close(); };
  const wrap = h('div.modal-wrap', { onmousedown: (e) => { if (e.target === wrap) close(); } },
    h(`div.modal${wide ? '.wide' : ''}`, {},
      h('div.modal-head', {}, h('h3', {}, title), h('button.icon-btn', { onclick: close, title: 'Close' }, icon('x'))),
      h('div.modal-body', {}, body),
      actions.length ? h('div.modal-foot', {}, actions.map((a) => h(`button.btn${a.primary ? '.primary' : ''}${a.danger ? '.danger' : ''}`, { onclick: async () => { if ((await a.run?.()) !== false) close(); } }, a.label))) : null));
  document.addEventListener('keydown', esc);
  document.body.append(wrap);
  return { close, el: wrap };
}

export function confirmBox(title, text, { label = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    let answered = false;
    modal({ title, body: h('p.muted', {}, text), onClose: () => { if (!answered) resolve(false); },
      actions: [{ label: 'Cancel', run: () => { answered = true; resolve(false); } }, { label, primary: !danger, danger, run: () => { answered = true; resolve(true); } }] });
  });
}

// ---------- Misc ----------

export const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const clone = (v) => JSON.parse(JSON.stringify(v));
export function ago(ms) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)} d ago`;
  return new Date(ms).toLocaleDateString();
}
export const plain = (s) => String(s ?? '').replace(/\*/g, '').replace(/\n/g, ' ');
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied', { kind: 'ok', timeout: 1500 }); } catch { toast('Copy failed: select and copy by hand', { kind: 'error' }); }
}
