<script>
	import { ELIMINATION_WHAMMIES } from './game-data.js';

	let { player, isActive = false, spotlight = false } = $props();

	let displayMoney = $derived(player.score + (isActive ? player.roundBank : 0));
</script>

<div
	class="console"
	class:active={isActive && !player.eliminated}
	class:eliminated={player.eliminated}
	class:spotlight
	style={`--pcolor:${player.color}`}
>
	<div class="console-name">{player.name}</div>
	<div class="console-money">${displayMoney.toLocaleString()}</div>
	<div class="console-whammies">
		{#each Array(ELIMINATION_WHAMMIES) as _, w}
			<span class="whammy-dot" class:hit={w < player.whammyCount}></span>
		{/each}
	</div>
	<div class="console-spins">
		<span>Earned <strong>{player.earnedSpins}</strong></span>
		<span>Passed <strong>{player.receivedSpins}</strong></span>
	</div>
	{#if player.eliminated}
		<div class="console-eliminated">ELIMINATED</div>
	{/if}
</div>

<style>
	.console {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #1a1030;
		border: 2px solid var(--pcolor);
		border-radius: 10px;
		padding: 0.7rem;
		text-align: center;
		opacity: 0.7;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		font-size: 1.05rem;
		color: var(--pcolor);
		margin-bottom: 0.2rem;
	}
	.console-money {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 1.4rem;
		color: #ffd447;
	}
	.console-whammies {
		display: flex;
		justify-content: center;
		gap: 4px;
		margin: 0.4rem 0;
	}
	.whammy-dot {
		width: 11px;
		height: 11px;
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
		font-size: 0.8rem;
		color: #c9cdd6;
	}
	.console-eliminated {
		margin-top: 0.4rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: #ff3b3b;
		letter-spacing: 0.05em;
	}

	/* Spotlight: the enlarged copy shown in the board's center */
	.console.spotlight {
		opacity: 1;
		padding: 1.2rem;
		box-shadow: 0 0 16px var(--pcolor);
	}
	.console.spotlight .console-name {
		font-size: clamp(1.3rem, 2.4vw, 1.8rem);
	}
	.console.spotlight .console-money {
		font-size: clamp(2rem, 4vw, 2.8rem);
	}
	.console.spotlight .console-whammies {
		gap: 7px;
		margin: 0.6rem 0;
	}
	.console.spotlight .whammy-dot {
		width: 16px;
		height: 16px;
	}
	.console.spotlight .console-spins {
		font-size: clamp(0.9rem, 1.6vw, 1.1rem);
	}

	/* Side consoles get a size bump once there's enough room for it. */
	@media (min-width: 1200px) {
		.console:not(.spotlight) {
			padding: 1rem;
		}
		.console:not(.spotlight) .console-name {
			font-size: 1.3rem;
		}
		.console:not(.spotlight) .console-money {
			font-size: 1.8rem;
		}
		.console:not(.spotlight) .console-whammies {
			gap: 6px;
			margin: 0.6rem 0;
		}
		.console:not(.spotlight) .whammy-dot {
			width: 14px;
			height: 14px;
		}
		.console:not(.spotlight) .console-spins {
			font-size: 0.95rem;
		}
	}
</style>