<script>
	import '../../app.css';
	import { page } from '$app/stores';
	import RainCanvas from '$lib/RainCanvas.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/method', label: 'The Method' },
		{ href: '/build', label: 'The Build' },
		{ href: '/work', label: 'The Work' },
		{ href: '/lab', label: 'The Lab' }
	];

	// Individual puddle reflections, each traveling independently from a
	// horizon point toward the viewer — like passing puddles while driving.
	// Fixed (not randomized on every render) so the scene doesn't reshuffle
	// itself on navigation. Vary x/size/duration/delay so they don't all
	// arrive in lockstep.
	const puddles = [
		{ x: '4%', size: '20vw', color: 'primary', duration: '7s', delay: '0s' },
		{ x: '20%', size: '14vw', color: 'blue', duration: '6s', delay: '2.2s' },
		{ x: '37%', size: '24vw', color: 'pink', duration: '8s', delay: '4.5s' },
		{ x: '52%', size: '16vw', color: 'primary', duration: '6.5s', delay: '1.2s' },
		{ x: '68%', size: '22vw', color: 'blue', duration: '7.5s', delay: '5.5s' },
		{ x: '84%', size: '18vw', color: 'pink', duration: '7s', delay: '3.2s' },
		{ x: '96%', size: '15vw', color: 'primary', duration: '6s', delay: '0.6s' }
	];
</script>

<div class="scene-backdrop" aria-hidden="true">
	<div class="wet-reflection">
		{#each puddles as p}
			<div
				class="puddle puddle-{p.color}"
				style="--x: {p.x}; --size: {p.size}; --duration: {p.duration}; --delay: {p.delay};"
			></div>
		{/each}
	</div>
	<RainCanvas />
</div>

<div class="site-shell relative z-10 flex min-h-screen flex-col">
	<header class="flex flex-wrap items-baseline gap-x-10 gap-y-2 px-6 pt-8 pb-6 md:px-12">
		<a href="/" class="neon-violet reflect font-mono text-lg tracking-wide" data-text="JSB">JSB</a>

		<!-- Quiet nav: links only, no buttons, no CTAs. The writing does the work. -->
		<nav class="flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm tracking-wide uppercase">
			{#each links as link}
				<a
					href={link.href}
					class="pb-1 text-ink/55 transition-colors hover:text-ink
						{$page.url.pathname === link.href
						? 'neon-blue border-b-2 border-accent-blue'
						: 'border-b-2 border-transparent'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="flex-1 px-6 md:px-12">
		<slot />
	</main>

	<footer
		class="border-t border-accent-blue/20 px-6 py-10 font-mono text-xs tracking-wide text-ink/45 md:px-12"
	>
		<p>Jeremiah Bridges — jsbridges.com</p>
	</footer>
</div>