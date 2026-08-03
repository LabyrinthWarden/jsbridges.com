<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} — The Method — Jeremiah Bridges</title>
</svelte:head>

<article class="mx-auto max-w-prose py-16 md:py-24">
	<a href="/method" class="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
		>← The Method</a
	>

	{#if data.date}
		<p class="mt-6 font-mono text-xs uppercase tracking-widest text-ink/50">{data.date}</p>
	{/if}

	<h1 class="mt-3 font-display text-3xl md:text-4xl">{data.title}</h1>

	<div class="prose-entry mt-8 font-body text-lg leading-relaxed text-ink/90">
		{@html data.html}
	</div>
</article>

<style>
	.prose-entry :global(p) {
		margin: 0 0 1.25rem;
	}
	.prose-entry :global(h2) {
		font-family: var(--font-display);
		font-size: 1.375rem;
		margin: 2rem 0 1rem;
	}
	.prose-entry :global(ul),
	.prose-entry :global(ol) {
		margin: 0 0 1.25rem 1.25rem;
	}
	.prose-entry :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
