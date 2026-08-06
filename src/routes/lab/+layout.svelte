<!-- src/routes/lab/+layout.svelte
     Applies ONLY to routes under the literal lab/ folder (i.e.
     /lab/<experiment>), not to (site)/lab (the Lab intro page), since
     those are separate physical directories. Deliberately minimal —
     just a way back, not the full site nav/rain/backdrop. -->

<script>
	let { children } = $props();
</script>

<div style="min-height: 100vh; padding: 1.5rem;">
	<a
		href="/lab"
		style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;
			letter-spacing: 0.05em; color: color-mix(in oklch, var(--color-ink) 55%);
			text-decoration: none;"
	>
		← The Lab
	</a>

	<div style="margin-top: 2rem;">
		{@render children()}
	</div>
</div>