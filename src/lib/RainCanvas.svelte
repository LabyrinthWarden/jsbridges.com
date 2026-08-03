<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let rafId;
	let cleanupResize;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let drops = [];

		// Neon-tinted streak colors: mostly cool white/blue rain, occasional
		// violet or pink catching the light, like reflections off signage.
		const colors = [
			'rgba(210, 220, 255, 0.55)',
			'rgba(210, 220, 255, 0.35)',
			'rgba(178, 140, 255, 0.4)', // violet
			'rgba(130, 195, 255, 0.35)', // blue
			'rgba(255, 150, 195, 0.3)' // pink
		];

		function makeDrop() {
			return {
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				len: 10 + Math.random() * 18,
				speed: 6 + Math.random() * 9,
				drift: -0.5 + Math.random() * 0.3,
				color: colors[Math.floor(Math.random() * colors.length)]
			};
		}

		function resize() {
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function seed() {
			// Roughly one drop per ~9000px^2 of viewport.
			const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
			drops = [];
			for (let i = 0; i < count; i++) drops.push(makeDrop());
		}

		function drawFrame() {
			ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			ctx.lineWidth = 1;
			for (const d of drops) {
				ctx.strokeStyle = d.color;
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x + d.drift * d.len * 0.4, d.y + d.len);
				ctx.stroke();
			}
		}

		function tick() {
			drawFrame();
			for (const d of drops) {
				d.y += d.speed;
				d.x += d.drift;
				if (d.y > window.innerHeight) {
					d.y = -d.len;
					d.x = Math.random() * window.innerWidth;
				}
			}
			rafId = requestAnimationFrame(tick);
		}

		function start() {
			resize();
			seed();
			if (reduceMotion) {
				drawFrame();
			} else {
				if (rafId) cancelAnimationFrame(rafId);
				tick();
			}
		}

		window.addEventListener('resize', start);
		cleanupResize = () => window.removeEventListener('resize', start);
		start();
	});

	onDestroy(() => {
		if (rafId) cancelAnimationFrame(rafId);
		if (cleanupResize) cleanupResize();
	});
</script>

<canvas bind:this={canvas} class="rain-canvas" aria-hidden="true"></canvas>

<style>
	.rain-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>