<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>The Method — Jeremiah Bridges</title>
</svelte:head>

<section class="mx-auto max-w-prose py-16 md:py-24">
	<h1 class="neon-blue reflect font-display text-3xl md:text-4xl" data-text="The Method">The Method</h1>

	<div class="mt-8 space-y-5 font-body text-lg leading-relaxed text-ink/90">
		<p class="font-display text-xl italic text-ink/80">
			Most people separate what they believe from how they work. I don't think that's possible —
			or honest.
		</p>
		<p>
			This is where I document the connective tissue: the convictions that govern how I build,
			how I lead, how I show up, and what I refuse to do. It starts with the Personal Canon — the
			fullest account I have of what I believe and why — and extends into a growing collection of
			essays, each one taking a single conviction and tracing it into practice.
		</p>
		<p>Nothing here is finished. A person who stops revising what they believe has stopped paying attention.</p>
	</div>

	<!-- Essays are read from /content/method/essays at request time — see
	     src/routes/method/+page.server.js. Drop a new .md file on the
	     server and it shows up here without a rebuild. -->
	<div class="mt-14 border-t border-accent-blue/15 pt-10">
		<h2 class="font-mono text-xs uppercase tracking-widest text-ink/50">Essays — a living collection</h2>
		{#if data.essays.length === 0}
			<p class="mt-4 font-mono text-xs text-ink/40">None yet. Grows over time.</p>
		{:else}
			<ul class="mt-4 space-y-2 font-body text-lg text-ink/70">
				{#each data.essays as essay}
					<li class="flex items-baseline gap-3">
						<span class="text-accent-pink">·</span>
						<a href="/method/{essay.slug}" class="hover:text-ink">{essay.title}</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<!-- The Personal Canon — full text, required at launch -->
<section class="mx-auto max-w-prose border-t border-accent-blue/15 py-16 md:py-24">
	<p class="neon-blue font-mono text-xs uppercase tracking-widest">The Personal Canon · v1.1</p>
	<h1 class="neon-violet reflect mt-3 font-display text-3xl md:text-4xl" data-text="Personal Canon">
		Personal Canon
	</h1>
	<p class="mt-2 font-body text-ink/50">Jeremiah Bridges</p>

	<div class="prose-canon mt-12 space-y-6 font-body text-lg leading-relaxed text-ink/90">
		<h2 class="font-display text-2xl text-ink">Why I Do Any of This</h2>
		<p class="neon-violet font-display text-xl italic">
			"To help people find responsible freedom so that they can discover who they really are and
			present that authenticity to the world."
		</p>
		<p>
			That is not a tagline. It is not a brand positioning. It is the answer to the only question
			worth asking: <em>why are you here?</em>
		</p>
		<p>
			Everything I build, everything I make, everything I pour time and care into — it is
			downstream of that statement. If it cannot be traced back to it, it does not deserve my
			energy. If it contradicts it, it does not belong in my life.
		</p>

		<h2 class="font-display text-2xl text-ink">What I Am Building Toward</h2>
		<p>
			When people think back on knowing me, I want them to think of how much better their life was
			because I was in it.
		</p>
		<p>I want people to feel more capable and more autonomous because I helped them see how to be so.</p>
		<p>
			Not because I did things for them. Not because I made things easy. Because I equipped them —
			with knowledge, with frameworks, with honest challenge, with the quiet confidence that they
			were capable of more than they thought — and then stepped back and let them own it.
		</p>
		<p>
			That is the measure of a life well lived. Not what was built, but what was left behind in the
			people who were there while it was being built.
		</p>

		<h2 class="font-display text-2xl text-ink">What I Believe</h2>
		<p>
			<strong>I am one person.</strong> Not a professional version and a personal version. Not a
			public face and a private one. The disc golf founder, the tabletop designer, the IT
			administrator, the father making comics with his daughter, the builder who is always working
			on something — these are not separate identities to be managed. They are one person who
			refuses to be flattened into something more convenient.
		</p>
		<p>
			Authenticity is not self-indulgence. It is the refusal to perform a version of yourself that
			serves someone else's comfort at the expense of your own truth.
		</p>
		<p>
			<strong>I own my outcomes.</strong> Fully. Without reservation. The decisions I make, the
			risks I take, the consequences I cause — these belong to me. I do not outsource
			accountability. I do not look for somewhere else to place the blame when things go wrong.
		</p>
		<p>
			And I extend that outward: I do not build things that take responsibility away from other
			people. I build things that give it back to them. Dependency is not generosity. Equipping
			someone and stepping back is.
		</p>
		<p>
			<strong>The world is endlessly interesting and I intend to treat it that way.</strong>
			Curiosity is not a hobby. It is a practice — the active refusal to stop asking why, to stop
			pulling at threads, to stop wondering what is on the other side of the door.
		</p>
		<p>
			Curiosity is also how I stay honest. The moment I stop wondering whether I am right, I have
			stopped being someone worth listening to.
		</p>
		<p>
			<strong>I do not need your permission.</strong> I do not build for approval. I do not make
			decisions by committee. I am informed by the people around me, shaped by the communities I
			belong to, and ultimately accountable to my own judgment.
		</p>
		<p>
			That is not arrogance. It is the refusal to let someone else's opinion of my choices carry
			more weight than my own considered reasoning. I listen carefully. And then I decide for
			myself.
		</p>
		<p>
			<strong>I give without keeping score.</strong> With time, with knowledge, with care, with
			honest feedback even when it is uncomfortable to deliver. Generosity is not performance — it
			is the quiet, consistent choice to contribute more than you extract from every room you
			enter.
		</p>
		<p>I give freely and I expect people to own what they do with what I give them. That is the complete transaction.</p>
		<p>
			<strong>Community is the reason, not the audience.</strong> The communities I belong to — the
			disc golf club, the players at the table, the people who will eventually hold the things I
			make — are not audiences. They are the reason. A community that is genuinely equipped,
			genuinely capable, and genuinely taking ownership of itself is the most beautiful thing I know
			how to help build.
		</p>
		<p>
			<strong>The social contract is real and it deserves to be honored.</strong> The systems we agree
			to participate in only work if everyone participates in good faith. Social contracts — the
			painted arrows in the parking lot, the merge lane on the highway, the rules of the game, the
			norms of the community — exist because someone designed a flow that serves everyone. I honor
			that design even when no one is watching and there is no enforcement.
		</p>
		<p>
			This is not rule-following for its own sake. It is the recognition that collective trust is
			fragile, that it depends on people who take it seriously, and that I intend to be one of
			those people. When someone breaks the contract, what is violated is not a rule. It is the
			agreement that makes shared life possible.
		</p>
		<p>I build systems worth respecting. And I respect the systems worth honoring.</p>

		<h2 class="font-display text-2xl text-ink">How I Work</h2>
		<p>
			<strong>I build things that outlast me.</strong> If it only works because I am personally
			maintaining it, it is not built well enough. Knowledge, systems, communities, and creative
			work should be able to stand without their creator propping them up.
		</p>
		<p>
			<strong>I equip, then step back.</strong> My job is to give people what they need to do the
			thing themselves — not to do the thing for them. The moment I become the dependency, I have
			failed the person I was trying to help.
		</p>
		<p>
			<strong>I listen to resistance.</strong> When something feels wrong — when a project creates
			friction, when a direction pulls against something fundamental — that is not procrastination.
			That is alignment feedback. I listen to it before pushing through it.
		</p>
		<p>
			<strong>I do fewer things with full commitment.</strong> Spreading energy across too many
			fronts produces nothing worth having. The things that deserve to exist deserve the full weight
			of attention and craft.
		</p>
		<p>
			<strong>I choose honest over comfortable.</strong> I will tell the truth when it is hard to
			hear. I will receive the truth when it is hard to accept. Comfort that comes at the cost of
			honesty is not kindness — it is a slow erosion of trust.
		</p>
		<p>
			<strong>The whole person shows up.</strong> I do not leave parts of myself at the door to make
			professional contexts more comfortable. My curiosity, my creative life, my values, my humor,
			my history — these are not liabilities to be managed. They are what I bring.
		</p>
		<p>
			<strong>Craft is a form of respect.</strong> Doing something well — really well, with care and
			attention and pride — is a way of honoring the people who will encounter it. Sloppy work says
			something about what you think of the person on the receiving end.
		</p>

		<p class="pt-6 text-ink/60">
			This document will change as I change. Not because the core is unstable — but because a
			person who stops growing stops being honest with themselves.
		</p>
		<p class="font-display italic text-ink/70">— Jeremiah Bridges</p>
	</div>
</section>