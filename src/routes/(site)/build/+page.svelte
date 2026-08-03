<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>The Build — Jeremiah Bridges</title>
</svelte:head>

<section class="mx-auto max-w-prose py-16 md:py-24">
	<h1 class="neon-pink reflect font-display text-3xl md:text-4xl" data-text="The Build">The Build</h1>

	<div class="mt-8 space-y-5 font-body text-lg leading-relaxed text-ink/90">
		<p class="font-display text-xl italic text-ink/80">This is where I document the process.</p>
		<p>
			Not the finished version. Not the cleaned-up retrospective. The actual process — the wrong
			turns, the slow progress, the moments where something I thought I understood finally proves
			itself true in practice.
		</p>
		<p>
			I build a lot of things at once: software, tabletop games, disc golf communities, myself.
			This is where all of it gets documented, in whatever order it actually happens. There is no
			editorial calendar. There is no theme. There is just the work and what it teaches.
		</p>
		<p>
			One thing worth naming: scattered throughout are entries I call <span class="neon-pink font-mono">The Click</span>
			— moments when something I was taught, or tried to teach, finally landed through lived
			experience rather than explanation. They are some of the most honest things I write.
		</p>
	</div>

	<div class="mt-14 border-t border-accent-blue/15 pt-10">
		<h2 class="font-mono text-xs uppercase tracking-widest text-ink/50">Entry types</h2>
		<dl class="mt-5 space-y-5">
			<div>
				<dt class="font-mono text-sm text-ink/70">General</dt>
				<dd class="mt-1 font-body text-ink/70">
					Dev logs, design process notes, disc golf community progress, personal growth.
				</dd>
			</div>
			<div>
				<dt class="neon-pink font-mono text-sm">// THE CLICK</dt>
				<dd class="mt-1 font-body text-ink/70">
					A recurring marker for the moments when something taught or attempted finally lands
					through direct experience.
				</dd>
			</div>
		</dl>
	</div>

	<!-- Entries are read from /content/build at request time — see
	     src/routes/build/+page.server.js. Drop a new .md file on the
	     server and it shows up here without a rebuild. -->
	<div class="mt-14 border-t border-accent-blue/15 pt-10">
		{#if data.entries.length === 0}
			<p class="font-mono text-sm text-ink/40">No entries yet. This page fills in as the work happens.</p>
		{:else}
			<ul class="space-y-6">
				{#each data.entries as entry}
					<li>
						<a
							href="/build/{entry.slug}"
							class="font-display text-xl text-ink hover:text-primary"
						>
							{entry.title}
						</a>
						<p class="mt-1 font-mono text-xs uppercase tracking-widest {entry.type === 'click' ? 'neon-pink' : 'text-ink/40'}">
							{entry.type === 'click' ? '// The Click' : 'General'} · {entry.date}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>