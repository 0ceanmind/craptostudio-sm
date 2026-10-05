#!/usr/bin/env node
// Connects this studio to Claude Code, once per computer:
//   1. registers the crapto-studio MCP server for all your projects (user scope), and
//   2. installs the /crapto-post skill in ~/.claude/skills/.
// After that, in any project, open Claude Code and type /crapto-post (or ask for a carousel).
//
//   npm run connect              connect
//   npm run connect -- --print   only show what it would run
//   npm run connect -- --remove  disconnect
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const bin = process.env.CLAUDE_BIN || 'claude';
const printOnly = process.argv.includes('--print');
const remove = process.argv.includes('--remove');
const mcpScript = path.join(root, 'studio/mcp.mjs');
const skillDir = path.join(home, 'skills/crapto-post');
const port = process.env.STUDIO_PORT;

const run = (args) => spawnSync(bin, args, { encoding: 'utf8', shell: process.platform === 'win32' });
const quote = (s) => (/^[\w./:@=-]+$/.test(s) ? s : `"${s}"`);
const addArgs = ['mcp', 'add', '--scope', 'user', ...(port ? ['-e', `STUDIO_PORT=${port}`] : []), 'crapto-studio', '--', process.execPath, mcpScript];

const skill = `---
name: crapto-post
description: Turn the current project into a Crapto Studio Instagram carousel post (English + Arabic) in the studio's brand style, using the crapto-studio MCP tools. Use when the user asks for an Instagram post, carousel, case study or social media post about this project.
argument-hint: "[optional brief, e.g. focus on the offline mode]"
---

# Make a Crapto Studio carousel for this project

Brief from the user (may be empty): $ARGUMENTS

1. Call the \`crapto-studio\` MCP tool \`get_playbook\` and follow it exactly, from \`get_brand_kit\` to \`render_post\`.
2. The project is the current working directory. If this conversation built or changed the project, use what we did and decided here as the main source, and read the code for details.
3. Don't modify the project's files. Everything goes into the studio through the crapto-studio tools.
4. End with the summary the playbook asks for and the workspace link, so the user can fine-tune the post in the Crapto Studio workspace.

If the crapto-studio tools are not available, tell the user to run \`npm run connect\` in the studio folder (${root}) and restart Claude Code.
`;

console.log('Crapto Studio → Claude Code\n');

if (printOnly) {
  console.log('Would run:\n');
  console.log(`  ${bin} mcp remove --scope user crapto-studio`);
  console.log(`  ${[bin, ...addArgs].map(quote).join(' ')}`);
  console.log(`\nand write ${path.join(skillDir, 'SKILL.md')}:\n\n${skill}`);
  process.exit(0);
}

const version = run(['--version']);
if (version.status !== 0) {
  console.log(`✗ Claude Code CLI not found ("${bin}"). Install Claude Code first: https://code.claude.com/docs\n  (or set CLAUDE_BIN to the path of the claude executable)`);
  process.exit(1);
}
console.log(`✓ Claude Code ${version.stdout.trim()}`);

run(['mcp', 'remove', '--scope', 'user', 'crapto-studio']);
if (remove) {
  fs.rmSync(skillDir, { recursive: true, force: true });
  console.log('✓ Removed the crapto-studio MCP server and the /crapto-post skill.');
  process.exit(0);
}

const added = run(addArgs);
if (added.status !== 0) {
  console.log(`✗ Could not register the MCP server:\n${added.stderr || added.stdout}\n  Run it yourself:\n  ${[bin, ...addArgs].map(quote).join(' ')}`);
  process.exit(1);
}
console.log('✓ MCP server "crapto-studio" registered for all your projects');

fs.mkdirSync(skillDir, { recursive: true });
fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skill);
console.log(`✓ Skill /crapto-post installed (${path.join(skillDir, 'SKILL.md')})`);

console.log(`
Done. In any project:
  1. open Claude Code there (restart it if it was already running)
  2. type  /crapto-post            or  /crapto-post focus on the multiplayer mode
     or just ask: "make a Crapto Studio carousel about this project"
  3. watch the post appear in the workspace: npm run studio → http://localhost:${port || 4600}
`);
