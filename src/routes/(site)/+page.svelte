<script>
	const lines = [
		'I am not interested in being impressive.',
		'I am interested in being useful — in the kind of useful that sticks, that compounds, that leaves the person on the receiving end more capable than they were before I showed up.',
		'When people think back on knowing me, I want it to be because their life was measurably better for it. Not because I did things for them. Not because I made things easy. Because I gave them something they could actually use — a framework, an honest challenge, a way of seeing the problem differently — and then trusted them to own what came next.',
		'That is the through line of everything here.',
		'I am one person. The systems administrator and the game designer, the disc golf founder and the software builder, the father making comics with his daughter — these are not separate modes I switch between. They are the same person, refusing to be flattened into something more convenient. What you find here reflects all of it.',
		'This site exists because I believe the things I have learned are worth sharing, and because the act of sharing them clearly is itself a form of discipline. The frameworks, the methods, the ongoing work — none of it is precious. All of it is meant to be picked up and used.'
	];
</script>

<svelte:head>
	<title>Jeremiah Bridges</title>
</svelte:head>

<section class="mx-auto max-w-prose py-16 md:py-28">
	<!-- The hero IS the foreword — no generic hero pattern, no stock imagery,
	     no CTA. Reveals line by line on load if motion is allowed; otherwise
	     the whole thing is simply present, unanimated. Delay is handled
	     entirely in CSS via :nth-child below — no per-line inline styles,
	     so there's nothing for Svelte's style-scoping to lose track of. -->
	<div class="foreword space-y-6 font-display text-2xl leading-snug md:text-3xl">
		{#each lines as line}
			<p>{line}</p>
		{/each}
	</div>

	<div class="mt-16 border-t border-accent-blue/15 pt-16 md:mt-20 md:pt-20">
		<p class="neon-violet font-display text-xl italic leading-relaxed md:text-2xl">
			To help people find responsible freedom so that they can discover who they really are and
			present that authenticity to the world.
		</p>
		<p class="mt-6 font-mono text-xs uppercase tracking-widest text-ink/50">
			That is why I am here.
		</p>
	</div>
</section>

<style>
	/* Slightly dimmed from full-white — matches the softness of the rest
	   of the site's body copy instead of glaring against the dark bg. */
	.foreword p {
		color: color-mix(in oklch, var(--color-ink) 82%, transparent);
	}

	/* Line-by-line reveal on load — only when the visitor allows motion.
	   Without this media query matching, paragraphs render at opacity 1
	   with no animation, full stop. */
	@media (prefers-reduced-motion: no-preference) {
		.foreword p {
			opacity: 0;
			animation: reveal 0.9s ease forwards;
		}
		.foreword p:nth-child(1) {
			animation-delay: 0s;
		}
		.foreword p:nth-child(2) {
			animation-delay: 0.4s;
		}
		.foreword p:nth-child(3) {
			animation-delay: 0.8s;
		}
		.foreword p:nth-child(4) {
			animation-delay: 1.2s;
		}
		.foreword p:nth-child(5) {
			animation-delay: 1.6s;
		}
		.foreword p:nth-child(6) {
			animation-delay: 2s;
		}
	}

	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>