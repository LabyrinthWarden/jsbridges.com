<script>
	// Category marker colors are the only place accent-blue/accent-pink are
	// used as recurring UI signal, per Design System guidance ("category
	// markers on /work"). Alternates rather than assigning meaning to color.
	const categories = [
		{
			name: 'Disc Golf',
			accent: 'accent-blue',
			items: [
				{
					name: 'Plumas Disc Golf',
					// Known domain from Tech & Build Notes.
					href: 'https://plumasdiscgolf.com',
					description:
						'A grassroots disc golf community in Plumas County, California. The living proof that a sport can build genuine belonging when the people in it take ownership of it.'
				},
				{
					name: 'Build the Game',
					// TODO: confirm live domain before launch.
					href: '#',
					description:
						'A disc golf university equipping club leaders, tournament directors, and course builders with permanent, transferable knowledge. The business and operations of the sport, taught properly.'
				}
			]
		},
		{
			name: 'Games',
			accent: 'accent-pink',
			items: [
				{
					name: 'Resolve',
					href: '#',
					description:
						"A gritty fantasy TTRPG built around resilience. Your hero's ability to withstand conflict — physically, mentally, socially, metaphysically — is a finite resource. Push too hard and you trigger a Cascade. Not about whether you get hit, but how you handle the break."
				},
				{
					name: 'Soul Tithe',
					href: '#',
					description:
						'An industrial magitech campaign setting where survival depends on a morally complex system of soul harvesting. The city runs. The cost is real. You decide where you stand — and own it.'
				},
				{
					name: 'Starview High',
					href: '#',
					description:
						'A YA dramedy set in the fictional town of Apex Heights, following a sprawling cast of students and faculty through rivalries, romance, and the particular chaos of senior year.'
				},
				{
					name: 'Under The Rose',
					href: '#',
					description:
						"A sheltered prince flees into the lawless borderlands after his father's execution, driven by a vow of vengeance — until he discovers the enemy faction is led by the mother he thought was dead."
				}
			]
		},
		{
			name: 'Tools',
			accent: 'accent-blue',
			items: [
				{
					name: 'KeyTime',
					tag: 'a JBT project',
					href: '#',
					description:
						'A minimalist time tracker built for creators. Tracks deep work and key creative sessions — not billable hours.'
				},
				{
					name: 'The Double Dash Method',
					href: '#',
					description:
						'A file naming convention and organizational protocol for people who think in systems. Structure your chaos.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>The Work — Jeremiah Bridges</title>
</svelte:head>

<section class="mx-auto max-w-prose py-16 md:py-24">
	<h1 class="neon-blue reflect font-display text-3xl md:text-4xl" data-text="The Work">The Work</h1>
	<p class="mt-6 font-display text-xl italic text-ink/80">
		Just an honest list of what exists, what it does, and where to find it.
	</p>

	<div class="mt-14 space-y-16">
		{#each categories as category}
			<div>
				<h2 class="font-mono text-xs uppercase tracking-widest text-ink/50">{category.name}</h2>
				<ul class="mt-6 space-y-8">
					{#each category.items as item}
						<li class="flex gap-4">
							<span
								class="mt-2 h-1.5 w-1.5 flex-none rounded-full"
								class:bg-accent-blue={category.accent === 'accent-blue'}
								class:bg-accent-pink={category.accent === 'accent-pink'}
								class:marker-glow-blue={category.accent === 'accent-blue'}
								class:marker-glow-pink={category.accent === 'accent-pink'}
							></span>
							<div>
								<a
									href={item.href}
									class="font-display text-xl text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-primary"
								>
									{item.name}
								</a>
								{#if item.tag}
									<span class="ml-2 font-mono text-xs uppercase tracking-wide text-ink/40"
										>{item.tag}</span
									>
								{/if}
								<p class="mt-2 font-body leading-relaxed text-ink/70">{item.description}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>