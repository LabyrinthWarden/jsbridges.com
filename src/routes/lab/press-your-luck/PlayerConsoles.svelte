<script>
	import ConsoleCard from './ConsoleCard.svelte';

	// `indices` lets the same component render just a subset of players (e.g. the
	// left-side group) while still comparing against the true global player index.
	let { players, indices, currentPlayerIndex } = $props();
</script>

<div class="console-column">
	{#each indices as idx (idx)}
		<ConsoleCard player={players[idx]} isActive={idx === currentPlayerIndex} />
	{/each}
</div>

<style>
	/* Below 500px: single column, content-sized cards. */
	.console-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem;
		width: 100%;
	}

	/* 500px-1099px: board is stacked above, consoles flow in two columns. */
	@media (min-width: 500px) and (max-width: 1099.98px) {
		.console-column {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* 1100px+: consoles sit beside the board, one column, each card exactly
	   one third of the board's height (up to 3 players per side). */
	@media (min-width: 1100px) {
		.console-column {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(3, 1fr);
			height: 100%;
		}
	}
</style>