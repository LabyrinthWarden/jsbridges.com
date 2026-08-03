import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter-node: a long-running Node process on the Linode VPS
		// (kept alive with pm2/systemd), not static output. Required
		// because /build and /method read markdown from disk at request
		// time — see src/lib/server/content.js — rather than at build
		// time, so new posts show up without a rebuild.
		adapter: adapter()
	}
};

export default config;
