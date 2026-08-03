<script>
	import '../app.css';
</script>

<!-- Deliberately minimal: no nav, no scene-backdrop, no rain. Routes that
     want the full site chrome live under the (site) group instead, which
     has its own +layout.svelte with all of that. Anything outside (site)
     — e.g. src/routes/lab/<experiment>/+page.svelte — only inherits this,
     so it renders as a blank canvas. -->
<slot />