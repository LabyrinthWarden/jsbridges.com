<script>
	import { gridArea } from './game-data.js';
	import ConsoleCard from './ConsoleCard.svelte';
	import TurnControls from './TurnControls.svelte';

	let {
		boardValues,
		highlightIndex,
		round,
		players,
		currentPlayerIndex,
		lastResult,
		spinning,
		whammyFlash,
		showPassChooser,
		passCandidates,
		onBeginSpin,
		onStopSpin,
		onInitiatePass,
		onPassTo,
		onCancelPassChooser
	} = $props();

	let currentPlayer = $derived(players[currentPlayerIndex]);
</script>

<div class="board-wrap" class:flash={whammyFlash}>
	<div class="board-grid">
		{#each boardValues as square, i}
			<div class="cell" class:lit={highlightIndex === i} style={`grid-area: ${gridArea(i)}`}>
				<span class="cell-face">
					{#if square.type === 'whammy'}WHAMMY
					{:else if square.type === 'bigbucks'}${square.amount}
					{:else if square.type === 'cash'}${square.amount}
					{:else}{square.label}{/if}
				</span>
			</div>
		{/each}

		<div class="center-panel">
			<div class="round-label">Round {round}</div>
			{#if currentPlayer}
				<ConsoleCard player={currentPlayer} isActive={true} spotlight={true} />
				<TurnControls
					{currentPlayer}
					{lastResult}
					{spinning}
					{showPassChooser}
					{passCandidates}
					{onBeginSpin}
					{onStopSpin}
					{onInitiatePass}
					{onPassTo}
					{onCancelPassChooser}
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.board-wrap {
		width: 100%;
		max-width: 1000px;
		transition: background 0.15s;
	}
	.board-wrap.flash {
		animation: flashred 0.5s ease-in-out;
	}
	@keyframes flashred {
		0%, 100% { background: transparent; }
		50% { background: #ff3b3b33; }
	}

	.board-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(5, minmax(56px, auto));
		gap: 6px;
	}

	/* Lock the board to a fixed shape once there's room for it, so nothing
	   about the center panel's content can ever resize the ring cells. On
	   very small screens it stays flexible so the center content has room. */
	@media (min-width: 600px) {
		.board-wrap {
			/* Whichever is smallest: the usual cap, the available width, or
			   the width that keeps the board's height within the viewport
			   (reserving space for the title and page padding). */
			width: min(1000px, 100%, calc((100vh - 90px) * 6 / 5));
			container-type: inline-size;
		}
		.board-grid {
			grid-template-rows: repeat(5, 1fr);
			aspect-ratio: 6 / 5;
			gap: 8px;
		}
	}

	.cell {
		background: #1a1030;
		border: 2px solid #c9cdd633;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-family: 'IBM Plex Mono', monospace;
		font-size: clamp(0.8rem, 1.7vw, 1.25rem);
		font-weight: 600;
		line-height: 1.2;
		color: #e4e6f0;
		padding: 4px 6px;
		overflow: hidden;
	}

	@media (min-width: 600px) {
		.cell {
			/* Scaled against the board's own rendered width (via container
			   query units) rather than the viewport, since the board's width
			   may now be capped by available height, not just the viewport. */
			font-size: clamp(0.75rem, 3.1cqw, 1.15rem);
		}
	}
	.cell.lit {
		border-color: #ffd447;
		box-shadow: 0 0 12px #ffd447, 0 0 26px #ff2e9a88, inset 0 0 14px #ffd447aa;
		color: #ffd447;
		font-weight: 800;
	}

	.center-panel {
		grid-area: 2 / 2 / 5 / 6;
		background: #0b0b14;
		border: 2px solid #00e5ff55;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 0.8rem;
		gap: 0.3rem;
		overflow-y: auto;
	}

	.center-panel .round-label {
		font-size: 1.35rem;
		font-weight: 700;
		margin-bottom: 0.1rem;
	}

	@media (max-width: 480px) {
		.board-grid {
			gap: 5px;
		}
		.cell {
			font-size: clamp(0.6rem, 3.2vw, 0.85rem);
			padding: 2px 3px;
		}
	}
</style>