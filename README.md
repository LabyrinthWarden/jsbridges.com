# jsbridges.com

SvelteKit scaffold for Jeremiah Bridges' personal identity hub, built from
the Project Overview, Design System, Content & Voice Guide, and Tech & Build
Notes.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build & run

```bash
npm run build
npm run start   # runs `node build` — the adapter-node output
```

Uses `@sveltejs/adapter-node`: the build produces a small Node server
(`build/`), not static files. That's a deliberate choice — `/build` and
`/method` read markdown from `/content` **at request time** (see
`src/lib/server/content.js`), so new posts appear on a page refresh with
no rebuild. Keep the process alive on the Linode box with `pm2` or a
`systemd` unit running `node build`. It listens on `PORT` (default 3000)
and needs `ORIGIN` set to `https://jsbridges.com` in production.

## Publishing a post

Drop a markdown file in `content/build/` (or `content/method/essays/`
for essays) with this frontmatter, then it just appears — no rebuild:

```md
---
title: "Post title"
date: "2026-08-01"
type: "general"   # or "click" for a Click entry — /build only
---

Regular markdown body.
```

Naming the file `YYYY-MM-DD-slug.md` keeps things sorted in your editor,
but the `date` frontmatter field (not the filename) is what actually
controls ordering on the site. Delete the two `example-*` files in each
folder once you've written real ones — they're just there to show the
format.

**Why not mdsvex:** mdsvex compiles markdown into Svelte components
during the Vite build, which is great for embedding live components in
your writing, but it can't pick up a file that appears after the server
is already running. This setup trades that away for genuinely dynamic
publishing. If you outgrow hand-editing files on the server — want an
editor UI, tags, multiple authors — swap the two functions in
`src/lib/server/content.js` for PocketBase API calls; the `+page.server.js`
files that call them don't need to change shape.

## What's here

- `/` — Home foreword, line-by-line reveal (respects `prefers-reduced-motion`)
- `/method` — Method intro + full Personal Canon v1.1; essay list reads from `content/method/essays/*.md`
- `/build` — Field journal intro, "The Click" entry type; entries read from `content/build/*.md`
- `/work` — Roster grouped by Disc Golf / Games / Tools, with category-color markers
- `/lab` — Deliberately rougher styling, contrast with the rest of the site

## Fonts & color

- Fraunces (display), Work Sans (body), IBM Plex Mono (utility) — self-hosted
  via `@fontsource-variable/*` / `@fontsource/*`, no external font requests.
- This project uses **Tailwind v4**. There is no `tailwind.config.js` —
  colors and fonts are defined as design tokens directly in `src/app.css`
  inside the `@theme { ... }` block, which auto-generates the matching
  utility classes (`--color-primary` → `bg-primary`/`text-primary`,
  `--font-display` → `font-display`, etc.). Edit tokens there, not in a
  config file.
- `@tailwindcss/vite` in `vite.config.js` handles the CSS build — no
  `postcss.config.js` or `autoprefixer` needed.

## Still open (carried over from Project Overview)

- [ ] `--color-bg` in `src/app.css` is a starting value — test the warm
      off-white against real Fraunces headlines and adjust if needed.
- [ ] `/work` placeholder `href="#"` links need real URLs (Build the Game,
      Resolve, Soul Tithe, Starview High, Under The Rose, KeyTime, The Double
      Dash Method) before launch.
- [ ] `/method` essays (One Person, Radical Responsibility, Equip and Step
      Back, Curiosity as Practice, Craft as Respect) — write these as
      markdown files in `content/method/essays/`, replacing the example.
- [ ] `/build` entries — write these as markdown files in `content/build/`,
      replacing the two examples.
- [ ] Domain `jsbridges.com` pointed at the new Linode instance.
- [ ] Process manager (`pm2` or `systemd`) to keep `node build` running
      and restart it on crash/reboot.
