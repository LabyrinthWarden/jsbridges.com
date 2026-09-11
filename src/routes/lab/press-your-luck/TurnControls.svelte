<script>
	let {
		currentPlayer,
		lastResult,
		spinning,
		showPassChooser,
		passCandidates,
		onBeginSpin,
		onStopSpin,
		onInitiatePass,
		onPassTo,
		onCancelPassChooser
	} = $props();

	let totalSpinsLeft = $derived((currentPlayer?.earnedSpins ?? 0) + (currentPlayer?.receivedSpins ?? 0));
</script>

<div class="turn-controls">
	<div class={`result-line ${lastResult?.kind ?? ''}`} class:visible={!!lastResult}>
		{lastResult?.text ?? ''}
	</div>

	<div class="board-controls">
		{#if showPassChooser}
			<div class="pass-chooser">
				<div class="mode-hint">Tied for the target spot — pass {totalSpinsLeft} spin(s) to:</div>
				<div class="buzzers">
					{#each passCandidates as c}
						<button class="buzzer-btn" style={`--pcolor:${c.p.color}`} onclick={() => onPassTo(c.i)}>
							{c.p.name}
						</button>
					{/each}
				</div>
				<button class="mini-btn" onclick={onCancelPassChooser}>Cancel</button>
			</div>
		{:else if !spinning}
			{#if !lastResult}
				<button class="stop-btn spin-btn" onclick={onBeginSpin}>START SPIN</button>
			{:else if totalSpinsLeft > 0}
				<button class="stop-btn spin-btn" onclick={onBeginSpin}>SPIN AGAIN</button>
				{#if !(currentPlayer?.receivedSpins > 0)}
					<button class="pass-btn" onclick={onInitiatePass}>PASS SPINS</button>
				{/if}
			{/if}
		{:else}
			<button class="stop-btn" onclick={onStopSpin}>STOP</button>
		{/if}
	</div>
</div>

<style>
	.turn-controls {
		text-align: center;
		width: 100%;
		margin-top: 0.7rem;
	}

	/* Always occupies space so a result appearing/disappearing never changes
	   the height of anything below it. */
	.result-line {
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.3;
		min-height: 1.3em;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.15s ease;
	}
	.result-line.visible {
		opacity: 1;
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

	/* The pass chooser replaces the button row's content in place (rather than
	   appending below it). Reserved height matches the chooser's own size (its
	   tallest state) so switching between the two never grows the panel. */
	.board-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.4rem;
		min-height: 6.4rem;
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
		width: 100%;
		text-align: center;
	}
	.pass-chooser .mode-hint {
		margin-top: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #e4e6f0;
	}
	.pass-chooser .buzzers {
		margin: 0.4rem 0;
	}
	.pass-chooser .buzzer-btn {
		padding: 0.5rem 0.5rem;
		font-size: 0.85rem;
	}
	.pass-chooser .mini-btn {
		padding: 0.3rem 0.6rem;
		font-size: 0.8rem;
	}
</style>