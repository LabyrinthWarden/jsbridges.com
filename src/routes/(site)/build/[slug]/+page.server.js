import { error } from '@sveltejs/kit';
import { readEntry } from '$lib/server/content.js';

export function load({ params }) {
	const entry = readEntry('build', params.slug);
	if (!entry) throw error(404, 'Entry not found');
	return entry;
}
