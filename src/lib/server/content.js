// src/lib/server/content.js
//
// Reads markdown files from /content at REQUEST time (not build time),
// which is the whole point of running under adapter-node: drop a new
// .md file on the server and it shows up without a rebuild.
//
// This intentionally does NOT use mdsvex. mdsvex compiles .svx -> Svelte
// components during the Vite build, so it can't pick up files that
// appear after the server is already running. Trade-off: you lose
// mdsvex's "drop a live Svelte component into your markdown" trick.
// What you get back is content that updates without a redeploy.
//
// If you outgrow this (want an editor UI, tags, multiple authors),
// swap the fs.readdir/readFile calls below for PocketBase API calls —
// the load functions that call these stay the same shape either way.

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

/**
 * Minimal frontmatter parser: flat `key: value` pairs between `---`
 * fences. No nested objects/arrays — if frontmatter ever needs those,
 * swap this for a real YAML parser (e.g. `js-yaml`).
 */
function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: raw };

	const [, block, body] = match;
	const frontmatter = {};

	for (const line of block.split(/\r?\n/)) {
		const i = line.indexOf(':');
		if (i === -1) continue;
		const key = line.slice(0, i).trim();
		const value = line
			.slice(i + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
		frontmatter[key] = value;
	}

	return { frontmatter, body };
}

/** List every markdown file in a content subfolder, newest first, with
 *  frontmatter only (no rendered HTML — cheap, for index/listing pages). */
export function listEntries(subfolder) {
	const dir = path.join(process.cwd(), 'content', subfolder);
	if (!fs.existsSync(dir)) return [];

	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
			const { frontmatter } = parseFrontmatter(raw);
			return { slug: file.replace(/\.md$/, ''), ...frontmatter };
		})
		.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

/** Read + render a single entry to HTML, or return null if it doesn't exist. */
export function readEntry(subfolder, slug) {
	const filePath = path.join(process.cwd(), 'content', subfolder, `${slug}.md`);
	if (!fs.existsSync(filePath)) return null;

	const raw = fs.readFileSync(filePath, 'utf-8');
	const { frontmatter, body } = parseFrontmatter(raw);
	return { slug, ...frontmatter, html: marked.parse(body) };
}
