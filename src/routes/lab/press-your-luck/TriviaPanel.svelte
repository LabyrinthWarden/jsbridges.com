<script>
	let {
		round,
		triviaIndex,
		triviaQueue,
		triviaStep,
		buzzedPlayerIdx,
		eligibleForMC,
		mcCorrect,
		triviaMessage,
		players,
		onBuzz,
		onBuzzResult,
		onToggleMc,
		onFinishMc
	} = $props();

	let question = $derived(triviaQueue[triviaIndex]);
</script>

<div class="panel trivia-panel">
	<div class="round-label">Round {round} • Question {triviaIndex + 1} of {triviaQueue.length}</div>
	<div class="question">{question.q}</div>

	<div class="choices">
		{#each question.choices as choice, ci}
			<div class="choice-ref" class:is-answer={ci === question.a}>
				{choice}
			</div>
		{/each}
	</div>
	<div class="mode-hint">(correct answer highlighted for the host only)</div>

	{#if triviaStep === 'buzz'}
		<div class="host-result-row">
			<div class="mode-hint">Who buzzed in first?</div>
			<div class="buzzers">
				{#each players as p, i}
					{#if !p.eliminated}
						<button class="buzzer-btn" style={`--pcolor:${p.color}`} onclick={() => onBuzz(i)}>
							{p.name}
						</button>
					{/if}
				{/each}
				<button class="buzzer-btn nobody-btn" onclick={() => onBuzz(null)}>Nobody buzzed</button>
			</div>
		</div>
	{:else if triviaStep === 'buzzResult'}
		<div class="host-result-row">
			<div class="mode-hint" style={`color:${players[buzzedPlayerIdx].color}`}>
				{players[buzzedPlayerIdx].name} buzzed in — how'd they do?
			</div>
			<div class="buzz-result-row">
				<button class="buzzer-btn correct-btn" onclick={() => onBuzzResult('correct')}>Correct (+3)</button>
				<button class="buzzer-btn wrong-btn" onclick={() => onBuzzResult('wrong')}>Incorrect</button>
				<button class="buzzer-btn wrong-btn" onclick={() => onBuzzResult('timeout')}>Ran out of time</button>
			</div>
		</div>
	{:else if triviaStep === 'multipleChoice'}
		<div class="host-result-row">
			<div class="mode-hint">Who chose correctly on multiple choice?</div>
			<div class="buzzers">
				{#each eligibleForMC as idx}
					<button
						class="buzzer-btn mc-toggle"
						class:selected={mcCorrect.includes(idx)}
						style={`--pcolor:${players[idx].color}`}
						onclick={() => onToggleMc(idx)}
					>
						{players[idx].name}
					</button>
				{/each}
			</div>
			<button class="start-btn continue-btn" onclick={onFinishMc}>Continue</button>
		</div>
	{/if}

	{#if triviaMessage}
		<div class="trivia-message">{triviaMessage}</div>
	{/if}
</div>

<style>
	.question {
		font-size: 1.3rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 1.5rem;
	}
	.choices {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem;
		margin-bottom: 1rem;
	}
	.choice-ref {
		background: #0b0b14;
		border: 2px solid #c9cdd633;
		color: #c9cdd6;
		border-radius: 8px;
		padding: 0.8rem;
		font-family: 'Space Grotesk', sans-serif;
		text-align: center;
	}
	.choice-ref.is-answer {
		border-color: #00e5ff;
		color: #00e5ff;
		box-shadow: 0 0 10px #00e5ff33;
	}

	.host-result-row {
		margin-top: 1rem;
	}
	.buzz-result-row {
		display: flex;
		gap: 0.6rem;
	}
	.correct-btn {
		--pcolor: #00e5ff;
	}
	.wrong-btn {
		--pcolor: #ff3b3b;
	}
	.mc-toggle {
		opacity: 0.5;
	}
	.mc-toggle.selected {
		opacity: 1;
		background: var(--pcolor);
		color: #0b0b14;
		box-shadow: 0 0 14px var(--pcolor);
	}
	.continue-btn {
		margin-top: 0.8rem;
	}
	.trivia-message {
		margin-top: 1rem;
		text-align: center;
		color: #ffd447;
		font-family: 'IBM Plex Mono', monospace;
	}
</style>