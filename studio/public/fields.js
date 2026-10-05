// Form fields for the inspector: bilingual text, icons, images, lists, code, and a generic
// editor for a scene's on-screen text (its `copy`, overridden per post in `sceneCopy`).
import { h, icon, get, api, modal, toast, toastError, debounce, clone } from './dom.js';

const plainLen = (s) => String(s ?? '').replace(/\*/g, '').length;

function counter(value, limit) {
  if (!limit) return null;
  const el = h('div.counter');
  const set = (v) => { const n = plainLen(v); el.textContent = `${n} / ${limit}`; el.classList.toggle('over', n > limit); };
  set(value);
  return { el, set };
}

function input({ value = '', onInput, dir = 'ltr', multiline = false, rows = 2, placeholder = '', mono = false }) {
  const el = multiline
    ? h(`textarea.in${mono ? '.code' : ''}`, { rows, dir, placeholder, spellcheck: mono ? 'false' : 'true' })
    : h('input.in', { type: 'text', dir, placeholder });
  el.value = value ?? '';
  el.addEventListener('input', () => onInput(el.value));
  if (mono) el.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); el.setRangeText('  ', el.selectionStart, el.selectionEnd, 'end'); onInput(el.value); } });
  return el;
}

export function field(label, control, { hint } = {}) {
  return h('div.field', {}, label ? h('label', {}, label, hint ? h('span.hint', {}, hint) : null) : null, control);
}

// { en, ar } text with one input per language.
export function biField({ label, value, onChange, limit, multiline = false, rows = 2, hint, placeholder = {} }) {
  const v = { en: value?.en ?? '', ar: value?.ar ?? '' };
  const row = (lang) => {
    const c = counter(v[lang], limit);
    const el = input({ value: v[lang], dir: lang === 'ar' ? 'rtl' : 'ltr', multiline, rows, placeholder: placeholder[lang] ?? '', onInput: (x) => { v[lang] = x; c?.set(x); onChange({ ...v }); } });
    return h('div.row', {}, el, h('span.lang', {}, lang.toUpperCase()), c?.el);
  };
  return field(label, h('div.bi', {}, row('en'), row('ar')), { hint });
}

export function textField({ label, value, onChange, hint, mono = false, multiline = false, rows = 6, placeholder }) {
  return field(label, input({ value, multiline, rows, mono, placeholder, onInput: onChange }), { hint });
}

export function selectField({ label, value, options, onChange, hint }) {
  const el = h('select.in', { onchange: () => onChange(el.value) }, options.map((o) => h('option', { value: o.value ?? o, selected: (o.value ?? o) === value }, o.label ?? o)));
  return field(label, el, { hint });
}

// ---------- icons ----------

const POPULAR = ['sparkles', 'smartphone', 'gamepad-2', 'code-xml', 'bot', 'layout-dashboard', 'users', 'bell', 'calendar', 'shield-check', 'cloud', 'database', 'globe', 'map-pin', 'message-circle', 'credit-card', 'shopping-cart', 'heart', 'star', 'camera', 'image', 'music', 'book-open', 'graduation-cap', 'trophy', 'wrench', 'settings', 'search', 'lock', 'wifi-off', 'timer', 'gauge', 'layers', 'puzzle', 'palette', 'workflow', 'plug', 'terminal', 'cpu', 'box', 'list-checks', 'chart-pie', 'languages', 'mic', 'video', 'store', 'truck', 'stethoscope'];

export function pickIcon(current) {
  return new Promise((resolve) => {
    let picked = false;
    const grid = h('div.icon-grid');
    const show = (names) => grid.replaceChildren(...names.map((n) => h('button', { title: n, onclick: () => { picked = true; resolve(n); m.close(); } }, icon(n, { size: 24 }), n)));
    const search = h('input.in', { placeholder: 'Search icons: “calendar”, “game”, “chat”…', oninput: debounce(async () => {
      const q = search.value.trim();
      show(q ? await get(`/api/icons?q=${encodeURIComponent(q)}`) : POPULAR);
    }, 180) });
    show(POPULAR);
    const m = modal({ title: 'Choose an icon', wide: true, body: h('div', {}, search, grid, h('p.dim', { style: { marginTop: '10px', fontSize: '12px' } }, 'Lucide icons. The brand avoids rockets, lightning, coins and rising charts.')), onClose: () => { if (!picked) resolve(current); } });
    setTimeout(() => search.focus(), 50);
  });
}

export function iconField({ label, value, onChange, hint }) {
  const btn = h('button.iconbtn', { title: 'Choose icon', onclick: async () => { const n = await pickIcon(value); if (n && n !== value) { value = n; btn.replaceChildren(icon(n, { size: 20 })); name.value = n; onChange(n); } } }, icon(value, { size: 20 }));
  const name = h('input.in.mono', { value: value ?? '', placeholder: 'icon name', onchange: () => { value = name.value.trim(); btn.replaceChildren(icon(value, { size: 20 })); onChange(value); } });
  return field(label, h('div.iconfield', {}, btn, name), { hint });
}

// ---------- images ----------

export async function uploadFiles(slug, files) {
  const out = [];
  for (const f of files) {
    if (!/^image\//.test(f.type) && !/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(f.name)) { toast(`${f.name}: not an image`, { kind: 'error' }); continue; }
    try { out.push(await api('POST', `/api/posts/${slug}/assets`, f, { headers: { 'x-filename': encodeURIComponent(f.name) } })); } catch (e) { toastError(e); }
  }
  if (out.length) toast(`Added ${out.length} image${out.length > 1 ? 's' : ''}`, { kind: 'ok' });
  return out;
}

function chooseFile(multiple = false) {
  return new Promise((resolve) => {
    const inp = h('input', { type: 'file', accept: 'image/*', multiple });
    inp.onchange = () => resolve([...inp.files]);
    inp.click();
  });
}

// Pick from the post's uploaded images, or upload new ones.
export function pickImage(ctx, { multiple = false } = {}) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { done = true; resolve(v); m.close(); };
    const grid = h('div.assets');
    const render = (assets) => grid.replaceChildren(...assets.map((p) => h('div.a', { style: { backgroundImage: `url(/${p})` }, title: p, onclick: () => finish(multiple ? [p] : p) }, h('span', {}, p.split('/').pop()))));
    render(ctx.assets());
    const drop = h('div.drop', { onclick: async () => { const added = await uploadFiles(ctx.slug(), await chooseFile(multiple)); if (added.length) { ctx.addAssets(added.map((a) => a.path)); finish(multiple ? added.map((a) => a.path) : added[0].path); } } },
      icon('upload', { size: 22 }), h('div', { style: { marginTop: '6px', fontWeight: 700 } }, 'Upload from your computer'), h('div.dim', { style: { fontSize: '12px' } }, 'PNG, JPG, WebP… or drop files here'));
    dropTarget(drop, async (files) => { const added = await uploadFiles(ctx.slug(), files); if (added.length) { ctx.addAssets(added.map((a) => a.path)); finish(multiple ? added.map((a) => a.path) : added[0].path); } });
    const m = modal({ title: 'Choose an image', wide: true, body: h('div', {}, drop, ctx.assets().length ? h('div.flabel', { style: { marginTop: '16px' } }, 'This post’s images') : null, grid), onClose: () => { if (!done) resolve(null); } });
  });
}

export function dropTarget(el, onFiles) {
  el.addEventListener('dragover', (e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); el.classList.add('over'); } });
  el.addEventListener('dragleave', () => el.classList.remove('over'));
  el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('over'); if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]); });
}

export function imageField({ label, value, onChange, ctx, hint }) {
  const cell = h('div.imgcell', { style: { aspectRatio: '16/10', backgroundImage: value ? `url(/${value})` : 'none', cursor: 'pointer' }, onclick: async () => { const p = await pickImage(ctx); if (p) { value = p; cell.style.backgroundImage = `url(/${p})`; onChange(p); } } },
    value ? h('button.x', { title: 'Remove', onclick: (e) => { e.stopPropagation(); value = ''; cell.style.backgroundImage = 'none'; onChange(''); } }, icon('x', { size: 13 })) : h('div', { style: { display: 'grid', placeItems: 'center', height: '100%', color: 'var(--sub)' } }, icon('image-plus', { size: 22 })));
  dropTarget(cell, async (files) => { const [a] = await uploadFiles(ctx.slug(), files.slice(0, 1)); if (a) { ctx.addAssets([a.path]); value = a.path; cell.style.backgroundImage = `url(/${a.path})`; onChange(a.path); } });
  return field(label, cell, { hint });
}

export function imagesField({ label, value = [], max = 3, onChange, ctx, hint }) {
  const list = [...(value ?? [])];
  const wrap = h('div.images');
  const render = () => {
    wrap.replaceChildren(
      ...list.map((p, i) => h('div.imgcell', { style: { backgroundImage: `url(/${p})` }, title: p },
        h('button.x', { title: 'Remove', onclick: () => { list.splice(i, 1); render(); onChange([...list]); } }, icon('x', { size: 13 })))),
      list.length < max ? h('div.imgcell.add', { onclick: async () => { const ps = await pickImage(ctx, { multiple: true }); if (ps?.length) { list.push(...ps.slice(0, max - list.length)); render(); onChange([...list]); } } }, icon('plus', { size: 22 })) : null,
    );
  };
  render();
  dropTarget(wrap, async (files) => { const added = await uploadFiles(ctx.slug(), files.slice(0, max - list.length)); if (added.length) { ctx.addAssets(added.map((a) => a.path)); list.push(...added.map((a) => a.path)); render(); onChange([...list]); } });
  return field(label, wrap, { hint: hint ?? `up to ${max} · drop files` });
}

export function listField({ label, value = [], onChange, hint, placeholder = 'Add…' }) {
  const list = [...(value ?? [])];
  const wrap = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } });
  const render = () => {
    wrap.replaceChildren(
      ...list.map((item, i) => h('div', { style: { display: 'flex', gap: '6px' } },
        input({ value: item, onInput: (x) => { list[i] = x; onChange([...list]); } }),
        h('button.icon-btn', { title: 'Remove', onclick: () => { list.splice(i, 1); render(); onChange([...list]); } }, icon('x', { size: 16 })))),
      h('button.btn.sm.ghost', { style: { alignSelf: 'flex-start' }, onclick: () => { list.push(''); render(); onChange([...list]); wrap.querySelectorAll('input')[list.length - 1]?.focus(); } }, icon('plus', { size: 14 }), placeholder),
    );
  };
  render();
  return field(label, wrap, { hint });
}

// ---------- scene copy (bilingual, mirrors the scene's default copy) ----------

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const titleCase = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

// Edits a value that exists in both languages with the same shape: { en: X, ar: X }.
function pairEditor({ label, en, ar, onChange, note, depth = 0 }) {
  if (typeof en === 'string' || typeof ar === 'string' || en === undefined) {
    return biField({ label, value: { en: en ?? '', ar: ar ?? '' }, onChange: (v) => onChange(v.en, v.ar), hint: note, multiline: (en ?? '').length > 40 });
  }
  if (typeof en === 'number') return biField({ label, value: { en: String(en), ar: String(ar ?? en) }, onChange: (v) => onChange(v.en, v.ar), hint: note });
  if (Array.isArray(en)) {
    const a = clone(en); const b = clone(Array.isArray(ar) ? ar : en);
    const template = a[0] ?? b[0] ?? '';
    const box = h('div.group');
    const render = () => {
      const n = Math.max(a.length, b.length);
      box.replaceChildren(h('div.group-head', {}, h('b', {}, label), note ? h('span.dim', { style: { fontSize: '11px' } }, note) : null,
        h('button.icon-btn', { title: 'Add', onclick: () => { a.push(clone(template)); b.push(clone(template)); render(); onChange(clone(a), clone(b)); } }, icon('plus', { size: 16 }))),
      ...Array.from({ length: n }, (_, i) => {
        const item = pairEditor({ label: `${i + 1}`, en: a[i], ar: b[i], depth: depth + 1, onChange: (x, y) => { a[i] = x; b[i] = y; onChange(clone(a), clone(b)); } });
        return h('div', { style: { position: 'relative' } }, item,
          n > 1 ? h('button.icon-btn', { title: 'Remove', style: { position: 'absolute', right: '0', top: '-4px', width: '24px', height: '24px' }, onclick: () => { a.splice(i, 1); b.splice(i, 1); render(); onChange(clone(a), clone(b)); } }, icon('x', { size: 13 })) : null);
      }));
    };
    render();
    return box;
  }
  if (isObj(en)) {
    const a = clone(en); const b = clone(isObj(ar) ? ar : en);
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
    const kids = keys.map((k) => {
      // Icons are the same in both languages: one picker writes both.
      if (k === 'icon' || k.endsWith('Icon')) return iconField({ label: titleCase(k), value: a[k] ?? b[k], onChange: (v) => { a[k] = v; b[k] = v; onChange(clone(a), clone(b)); } });
      return pairEditor({ label: titleCase(k), en: a[k], ar: b[k], depth: depth + 1, onChange: (x, y) => { a[k] = x; b[k] = y; onChange(clone(a), clone(b)); } });
    });
    return depth ? h('div.group', {}, h('div.group-head', {}, h('b', {}, label)), kids) : h('div', {}, kids);
  }
  return biField({ label, value: { en: String(en), ar: String(ar ?? '') }, onChange: (v) => onChange(v.en, v.ar) });
}

// base: the scene's default copy { en, ar }; override: post.sceneCopy; notes: meta.fields.copy.
export function copyEditor({ base = {}, override = {}, notes = {}, onChange }) {
  const cur = { en: { ...(base.en ?? {}), ...(override.en ?? {}) }, ar: { ...(base.ar ?? {}), ...(override.ar ?? {}) } };
  const out = { en: clone(override.en ?? {}), ar: clone(override.ar ?? {}) };
  const keys = [...new Set([...Object.keys(base.en ?? {}), ...Object.keys(base.ar ?? {})])];
  if (!keys.length) return h('p.dim', {}, 'This scene has no editable text.');
  return h('div', {}, keys.map((k) => {
    const edited = k in (override.en ?? {}) || k in (override.ar ?? {});
    const wrap = h('div', { style: { position: 'relative' } });
    const reset = h('button.link', { style: { position: 'absolute', right: '0', top: '0', fontSize: '11px', zIndex: 2 }, hidden: !edited, onclick: () => { delete out.en[k]; delete out.ar[k]; onChange(clone(out)); wrap.replaceWith(copyEditor({ base, override: out, notes, onChange })); } }, 'Reset');
    const note = typeof notes[k] === 'string' ? notes[k] : notes[k]?.description;
    wrap.append(reset, (k === 'icon' || k.endsWith('Icon'))
      ? iconField({ label: titleCase(k), value: cur.en[k], onChange: (v) => { out.en[k] = v; out.ar[k] = v; reset.hidden = false; onChange(clone(out)); } })
      : pairEditor({ label: titleCase(k), en: cur.en[k], ar: cur.ar[k], note, onChange: (x, y) => { out.en[k] = x; out.ar[k] = y; reset.hidden = false; onChange(clone(out)); } }));
    return wrap;
  }));
}

// sceneData fields, typed by meta.fields.data (image, images, icon, text, code, list, number).
export function dataEditor({ base = {}, override = {}, notes = {}, onChange, ctx }) {
  const out = clone(override ?? {});
  const keys = [...new Set([...Object.keys(base), ...Object.keys(notes)])];
  if (!keys.length) return h('p.dim', {}, 'This scene has no settings.');
  const set = (k, v) => { out[k] = v; onChange(clone(out)); };
  return h('div', {}, keys.map((k) => {
    const spec = typeof notes[k] === 'object' ? notes[k] : { description: notes[k] };
    const value = k in out ? out[k] : base[k];
    const type = spec.type ?? (Array.isArray(value) ? (/screen|image|shot/i.test(k) ? 'images' : 'list') : /^(icon|.*Icon)$/.test(k) ? 'icon' : /logo|image/i.test(k) ? 'image' : /code|snippet/i.test(k) ? 'code' : typeof value === 'number' ? 'number' : 'text');
    const label = titleCase(k); const hint = spec.description;
    if (type === 'images') return imagesField({ label, value, max: spec.max ?? 3, ctx, hint, onChange: (v) => set(k, v) });
    if (type === 'image') return imageField({ label, value, ctx, hint, onChange: (v) => set(k, v) });
    if (type === 'icon') return iconField({ label, value, hint, onChange: (v) => set(k, v) });
    if (type === 'list') return listField({ label, value, hint, onChange: (v) => set(k, v) });
    if (type === 'code') return textField({ label, value, hint, mono: true, multiline: true, rows: 9, onChange: (v) => set(k, v) });
    if (type === 'number') return textField({ label, value: String(value ?? ''), hint, onChange: (v) => set(k, v === '' ? undefined : Number(v)) });
    return textField({ label, value, hint, onChange: (v) => set(k, v) });
  }));
}
