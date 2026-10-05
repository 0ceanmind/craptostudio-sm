// The scene catalog: every animated hero in design/scenes/, with its description, editable text
// (copy) and settings (data). Files are re-imported when they change on disk.
import fs from 'node:fs';
import path from 'node:path';
import { loadScene, scenesDir } from '../../design/motion/stage.mjs';

export async function sceneNames() {
  return fs.readdirSync(scenesDir).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4)).sort();
}

export const getScene = (name) => loadScene(name, { fresh: true });

export async function listScenes() {
  const out = [];
  for (const name of await sceneNames()) {
    try {
      const s = await getScene(name);
      out.push({
        name,
        kind: name.startsWith('showcase-') ? 'showcase' : 'service',
        title: s.meta?.title ?? name,
        description: s.meta?.description ?? '',
        bestFor: s.meta?.bestFor ?? '',
        fields: s.meta?.fields ?? {},
        duration: s.duration,
        copy: s.copy ?? {},
        data: s.data ?? {},
      });
    } catch (e) {
      out.push({ name, kind: 'broken', title: name, description: `Failed to load: ${e.message}`, error: e.message, fields: {}, copy: {}, data: {} });
    }
  }
  return out;
}

export const sceneFile = (name) => path.join(scenesDir, `${name}.mjs`);
