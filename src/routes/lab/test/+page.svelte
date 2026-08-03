<!-- Example: src/routes/lab/some-experiment/+page.svelte
     Lives outside the (site) group, so it only inherits the minimal
     root layout — no nav, no rain, no glow backdrop. Style it however
     the experiment needs; nothing from the rest of the site leaks in
     except the CSS custom properties (--color-primary etc.) and fonts
     imported in app.css, which the root layout still pulls in. -->

<svelte:head>
	<title>Some Experiment — The Lab</title>
</svelte:head>

<div style="margin-top: 2rem;">
	<!-- whatever this experiment actually is -->
</div>