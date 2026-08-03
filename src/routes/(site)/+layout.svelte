<script>
	import { page } from '$app/stores';
	import RainCanvas from '$lib/RainCanvas.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/method', label: 'The Method' },
		{ href: '/build', label: 'The Build' },
		{ href: '/work', label: 'The Work' },
		{ href: '/lab', label: 'The Lab' }
	];
</script>

<div class="scene-backdrop" aria-hidden="true">
	<div class="glow glow-violet"></div>
	<div class="glow glow-blue"></div>
	<div class="glow glow-pink"></div>
	<div class="wet-reflection"></div>
	<RainCanvas />
</div>

<div class="relative z-10 flex min-h-screen flex-col">
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