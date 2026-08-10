<svelte:head>
  <title>The Lab — Jeremiah Bridges</title>
</svelte:head>

<!--
	Deliberately rougher than the rest of the site per Design System:
	looser spacing, exposed fragment feel, mono-first. Don't apply the
	same polish pass here that the other pages get.
-->
<section class="mx-auto max-w-2xl py-16 font-mono md:py-24">
  <h1 class="neon-pink text-3xl">The Lab</h1>

  <div class="mt-10 space-y-8 text-base leading-loose text-ink/80">
    <p class="italic">This is where things get messy.</p>
    <p>
      The Lab is a public workbench — HTML, CSS, and JavaScript experiments that
      may or may not work, ideas that are half-baked by design, and interfaces
      built to try something rather than ship something. Nothing here is
      finished. Most of it probably never will be.
    </p>
    <p>If something breaks, that is the point.</p>
  </div>

  <!-- placeholder fragment: deliberately unstyled, stands in for future experiments -->
  <div
    class="mt-16 border border-dashed border-accent-pink/35 p-6 text-sm text-ink/70">
    <a href="/lab/keytime">
      KeyTime - A hotkey-driven time tracking app that captures only the "key
      sessions".
    </a>
  </div>

  <div
    class="mt-16 border border-dashed border-accent-pink/35 p-6 text-sm text-ink/70">
    <a href="/lab/gens">Generators for use in TTRPGs</a>
  </div>

  <div
    class="mt-16 border border-dashed border-accent-pink/35 p-6 text-sm text-ink/70">
    <a href="/lab/jeopardy/dnd/round-1">D&D 5e Jeopardy (Round 1)</a>
    <br />
    <a href="/lab/jeopardy/dnd/round-2">D&D 5e Jeopardy (Round 2)</a>
  </div>

  <p class="mt-16 text-ink/80">
    If something sparks a thought, my inbox is open.
  </p>
</section>
