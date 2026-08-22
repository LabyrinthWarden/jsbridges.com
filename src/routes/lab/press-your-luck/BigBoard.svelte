<script>
	import { gridArea, totalSpins } from './game-data.js';

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
			<div class="turn-label" style={`color:${currentPlayer?.color}`}>
				{currentPlayer?.name}'s turn
			</div>
			<div class="bank-readout">${currentPlayer?.roundBank.toLocaleString()}</div>
			<div class="spins-label">{totalSpins(currentPlayer ?? { earnedSpins: 0, receivedSpins: 0 })} spin(s) left</div>

			{#if lastResult}
				<div class={`result-line ${lastResult.kind}`}>{lastResult.text}</div>
			{/if}

			<div class="board-controls">
				{#if !spinning && !showPassChooser}
					{#if !lastResult}
						<button class="stop-btn spin-btn" onclick={onBeginSpin}>START SPIN</button>
					{:else if totalSpins(currentPlayer) > 0}
						<button class="stop-btn spin-btn" onclick={onBeginSpin}>SPIN AGAIN</button>
						{#if !(currentPlayer?.receivedSpins > 0)}
							<button class="pass-btn" onclick={onInitiatePass}>PASS SPINS</button>
						{/if}
					{/if}
				{:else if spinning}
					<button class="stop-btn" onclick={onStopSpin}>STOP</button>
				{/if}
			</div>

			{#if showPassChooser}
				<div class="pass-chooser">
					<div class="mode-hint">Tied for the target spot — pass {totalSpins(currentPlayer)} spin(s) to:</div>
					<div class="buzzers">
						{#each passCandidates as c}
							<button class="buzzer-btn" style={`--pcolor:${c.p.color}`} onclick={() => onPassTo(c.i)}>
								{c.p.name}
							</button>
						{/each}
					</div>
					<button class="mini-btn" onclick={onCancelPassChooser}>Cancel</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.board-wrap {
		width: 100%;
		max-width: 720px;
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
		grid-template-rows: repeat(5, minmax(70px, 1fr));
		gap: 6px;
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
		font-size: 0.68rem;
		line-height: 1.15;
		color: #c9cdd6;
		padding: 2px 4px;
		overflow: hidden;
	}
	.cell.lit {
		border-color: #ffd447;
		box-shadow: 0 0 10px #ffd447, 0 0 22px #ff2e9a88, inset 0 0 12px #ffd447aa;
		color: #ffd447;
		font-weight: 700;
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
		padding: 0.8rem;
		gap: 0.35rem;
		text-align: center;
	}

	.turn-label {
		font-weight: 700;
		font-size: 1.1rem;
	}
	.bank-readout {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 1.6rem;
		color: #ffd447;
	}
	.spins-label {
		font-size: 0.8rem;
		color: #c9cdd6;
	}
	.result-line {
		font-size: 0.85rem;
		font-weight: 600;
		margin-top: 0.3rem;
	}
	.result-line.whammy {
		color: #ff3b3b;
	}
	.result-line.cash, .result-line.prize {
		color: #00e5ff;
	}
	.result-line.bigbucks {
		color: #ffd447;
	}

	.board-controls {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.stop-btn {
		background: linear-gradient(180deg, #ff2e9a, #b8005f);
		border: none;
		border-radius: 50px;
		padding: 0.7rem 1.4rem;
		color: #fff;
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 0 4px 0 #7a0040;
	}
	.stop-btn:active {
		transform: translateY(2px);
		box-shadow: 0 2px 0 #7a0040;
	}
	.spin-btn {
		background: linear-gradient(180deg, #00e5ff, #0088a3);
		box-shadow: 0 4px 0 #005a6b;
	}

	.pass-btn {
		background: none;
		border: 2px solid #c9cdd6;
		border-radius: 50px;
		padding: 0.6rem 1.2rem;
		color: #c9cdd6;
		cursor: pointer;
	}

	.pass-chooser {
		margin-top: 0.8rem;
		width: 100%;
		text-align: center;
	}
	.pass-chooser .buzzers {
		margin-bottom: 0.5rem;
	}
</style>