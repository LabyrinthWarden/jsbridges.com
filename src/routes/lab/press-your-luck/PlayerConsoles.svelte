<script>
	import { ELIMINATION_WHAMMIES } from './game-data.js';

	let { players, currentPlayerIndex } = $props();
</script>

<div class="consoles">
	{#each players as p, i}
		<div
			class="console"
			class:active={i === currentPlayerIndex && !p.eliminated}
			class:eliminated={p.eliminated}
			style={`--pcolor:${p.color}`}
		>
			<div class="console-name">{p.name}</div>
			<div class="console-money">
				${(p.score + (i === currentPlayerIndex ? p.roundBank : 0)).toLocaleString()}
			</div>
			<div class="console-whammies">
				{#each Array(ELIMINATION_WHAMMIES) as _, w}
					<span class="whammy-dot" class:hit={w < p.whammyCount}></span>
				{/each}
			</div>
			<div class="console-spins">
				<span>Earned <strong>{p.earnedSpins}</strong></span>
				<span>Passed <strong>{p.receivedSpins}</strong></span>
			</div>
			{#if p.eliminated}
				<div class="console-eliminated">ELIMINATED</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.consoles {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.8rem;
		flex-wrap: wrap;
		width: 100%;
		max-width: 720px;
	}
	.console {
		flex: 1;
		min-width: 140px;
		background: #1a1030;
		border: 2px solid var(--pcolor);
		border-radius: 10px;
		padding: 0.7rem;
		text-align: center;
		opacity: 0.7;
		transition: opacity 0.2s, box-shadow 0.2s;
	}
	.console.active {
		opacity: 1;
		box-shadow: 0 0 18px var(--pcolor);
	}
	.console.eliminated {
		opacity: 0.35;
		filter: grayscale(0.6);
	}
	.console-name {
		font-weight: 700;
		color: var(--pcolor);
		margin-bottom: 0.2rem;
	}
	.console-money {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 1.3rem;
		color: #ffd447;
	}
	.console-whammies {
		display: flex;
		justify-content: center;
		gap: 4px;
		margin: 0.4rem 0;
	}
	.whammy-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid #ff3b3b88;
		background: transparent;
		display: inline-block;
	}
	.whammy-dot.hit {
		background: #ff3b3b;
		box-shadow: 0 0 6px #ff3b3b;
	}
	.console-spins {
		display: flex;
		justify-content: space-between;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.75rem;
		color: #c9cdd6;
	}
	.console-eliminated {
		margin-top: 0.4rem;
		font-size: 0.7rem;
		font-weight: 700;
		color: #ff3b3b;
		letter-spacing: 0.05em;
	}
</style>