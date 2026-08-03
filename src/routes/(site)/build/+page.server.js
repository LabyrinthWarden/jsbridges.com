import { listEntries } from '$lib/server/content.js';

export function load() {
	return {
		entries: listEntries('build')
	};
}
