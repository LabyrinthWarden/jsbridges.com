<script>
	import { PLAYER_COLORS, TRIVIA_BANK } from './game-data.js';

	let {
		playerNames = $bindable(),
		usedQuestionCount,
		highScores,
		onAddPlayer,
		onRemovePlayer,
		onResetQuestions,
		onStart
	} = $props();
</script>

<div class="panel setup-panel">
	<h2>Who's playing?</h2>
	{#each playerNames as name, i}
		<div class="name-row">
			<input
				type="text"
				placeholder={`Player ${i + 1} name`}
				bind:value={playerNames[i]}
				style={`--pcolor: ${PLAYER_COLORS[i]}`}
			/>
			{#if playerNames.length > 2}
				<button class="mini-btn" onclick={() => onRemovePlayer(i)}>x</button>
			{/if}
		</div>
	{/each}
	{#if playerNames.length < 3}
		<button class="mini-btn" onclick={onAddPlayer}>+ Add player</button>
	{/if}

	<div class="mode-hint host-hint">
		You'll run the trivia rounds yourself: read each question aloud, record who buzzed in
		first, then mark who got the multiple-choice part right.
	</div>

	<div class="trivia-status">
		<span>{TRIVIA_BANK.length - usedQuestionCount} of {TRIVIA_BANK.length} trivia questions unused</span>
		<button class="mini-btn" onclick={onResetQuestions}>Reset question history</button>
	</div>

	<button class="start-btn" onclick={onStart}>START GAME</button>

	{#if highScores.length}
		<div class="highscores">
			<h3>High Scores</h3>
			<ol>
				{#each highScores.slice(0, 5) as hs}
					<li>{hs.name} — ${hs.score.toLocaleString()} <span class="hs-date">{hs.date}</span></li>
				{/each}
			</ol>
		</div>
	{/if}
</div>

<style>
	.name-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}
	.name-row input {
		flex: 1;
		background: #0b0b14;
		border: 2px solid var(--pcolor, #00e5ff);
		border-radius: 6px;
		padding: 0.6rem 0.8rem;
		color: #fff;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1rem;
	}

	.host-hint {
		margin-top: 1rem;
		border-top: 1px dashed #ff2e9a55;
		padding-top: 1rem;
	}

	.trivia-status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.8rem;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.75rem;
		color: #6b6b7a;
	}

	.highscores {
		margin-top: 1.5rem;
		border-top: 1px dashed #ff2e9a55;
		padding-top: 1rem;
	}
	.highscores ol {
		padding-left: 1.2rem;
		font-family: 'IBM Plex Mono', monospace;
	}
	.hs-date {
		color: #6b6b7a;
		font-size: 0.8em;
	}
</style>