import { error } from '@sveltejs/kit';
import { readEntry } from '$lib/server/content.js';

export function load({ params }) {
	const essay = readEntry('method/essays', params.slug);
	if (!essay) throw error(404, 'Essay not found');
	return essay;
}
