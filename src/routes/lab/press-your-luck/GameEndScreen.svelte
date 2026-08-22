<script>
	import { ELIMINATION_WHAMMIES } from './game-data.js';

	let { players, noChampion, onPlayAgain } = $props();

	let ranked = $derived([...players].sort((a, b) => b.score - a.score));
</script>

<div class="panel end-panel">
	{#if noChampion}
		<h2>No Champion</h2>
		<div class="mode-hint">All three players Whammied out — nobody takes the title today.</div>
	{:else}
		<h2>Final Scores</h2>
	{/if}
	{#each ranked as p, i}
		<div class="final-row" class:winner={!noChampion && i === 0} style={`--pcolor:${p.color}`}>
			{!noChampion && i === 0 ? 'WINNER — ' : ''}{p.name}: ${p.score.toLocaleString()}
			{#if p.eliminated}<span class="final-eliminated">(eliminated)</span>{/if}
		</div>
		<div class="stat-row" style={`--pcolor:${p.color}`}>
			whammies {p.whammyCount} / {ELIMINATION_WHAMMIES}
		</div>
	{/each}
	<button class="start-btn" onclick={onPlayAgain}>Play Again</button>
</div>

<style>
	.final-row {
		padding: 0.6rem;
		font-family: 'IBM Plex Mono', monospace;
		color: var(--pcolor);
		font-size: 1.1rem;
	}
	.final-row.winner {
		color: #ffd447;
		font-weight: 700;
		font-size: 1.3rem;
	}
	.final-eliminated {
		font-size: 0.7rem;
		color: #ff3b3b;
		margin-left: 0.4rem;
		font-weight: 400;
	}
</style>