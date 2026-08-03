import { listEntries } from '$lib/server/content.js';

export function load() {
	return {
		essays: listEntries('method/essays')
	};
}
