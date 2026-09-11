<script>
	// Press Your Luck -- lab build
	// Local pass-and-play, 2-3 players, trivia buzz-in + big board chase.
	// This file owns all game state and rules; UI is split into child components,
	// and pure data/helpers live in game-data.js.

	import './game-theme.css';
	import {
		PLAYER_COLORS,
		TRIVIA_BANK,
		TOTAL_ROUNDS,
		ELIMINATION_WHAMMIES,
		shuffle,
		shuffledBoard,
		totalSpins,
		randomInt,
		triviaQuestionCountForPlayers,
		TEST_NAME_POOL
	} from './game-data.js';

	import SetupPanel from './SetupPanel.svelte';
	import TriviaPanel from './TriviaPanel.svelte';
	import BigBoard from './BigBoard.svelte';
	import PlayerConsoles from './PlayerConsoles.svelte';
	import GameEndScreen from './GameEndScreen.svelte';

	// ---------- Game state ----------
	let phase = $state('setup'); // setup | trivia | board | gameEnd
	let playerNames = $state(['', '']);
	let players = $state([]); // {name, color, score, roundBank, earnedSpins, receivedSpins, whammyCount, eliminated}

	// Alternating split so consoles sit left/right like seats around a table --
	// only used once the wide side-by-side board layout is active.
	let leftIndices = $derived(players.map((_, i) => i).filter((i) => i % 2 === 0));
	let rightIndices = $derived(players.map((_, i) => i).filter((i) => i % 2 === 1));
	let allIndices = $derived(players.map((_, i) => i));

	// Tracks whether the wide side-by-side board layout is active, so the
	// stacked layout can render one unified console grid instead of two
	// separate halves (which caused misordering and gaps).
	let isWideBoard = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(min-width: 1100px)');
		const update = () => (isWideBoard = mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});
	let round = $state(1);
	let testMode = $state(false);

	let triviaQueue = $state([]);
	let triviaIndex = $state(0);
	let triviaStep = $state('buzz'); // buzz | buzzResult | multipleChoice
	let buzzedPlayerIdx = $state(null); // null = nobody buzzed in
	let eligibleForMC = $state([]); // player indices who get a multiple-choice shot
	let mcCorrect = $state([]); // player indices marked correct in multiple choice
	let triviaMessage = $state('');

	let boardValues = $state(shuffledBoard());
	let highlightIndex = $state(0);
	let spinning = $state(false);
	let currentPlayerIndex = $state(0);
	let turnOrder = $state([]); // player indices in play order for the current board round
	let turnPointer = $state(0); // index into turnOrder for the current player
	let lastResult = $state(null);
	let whammyFlash = $state(false);
	let noChampion = $state(false);
	let showPassChooser = $state(false);
	let passCandidates = $state([]);
	let spinTimer = null;

	let highScores = $state([]);
	let usedQuestionIds = $state([]);

	$effect(() => {
		try {
			const raw = localStorage.getItem('pyl-high-scores');
			if (raw) highScores = JSON.parse(raw);
		} catch (e) {
			highScores = [];
		}
		try {
			const rawUsed = localStorage.getItem('pyl-used-questions');
			if (rawUsed) usedQuestionIds = JSON.parse(rawUsed);
		} catch (e) {
			usedQuestionIds = [];
		}
	});

	function saveHighScores() {
		try {
			localStorage.setItem('pyl-high-scores', JSON.stringify(highScores));
		} catch (e) {
			// storage unavailable, skip silently
		}
	}

	function saveUsedQuestions() {
		try {
			localStorage.setItem('pyl-used-questions', JSON.stringify(usedQuestionIds));
		} catch (e) {
			// storage unavailable, skip silently
		}
	}

	function resetUsedQuestions() {
		usedQuestionIds = [];
		saveUsedQuestions();
	}

	// Picks `count` questions never asked before (across all games), cycling back to the
	// full bank only once there aren't enough unused ones left to fill the request.
	function pickTriviaQuestions(count) {
		let unused = shuffle(TRIVIA_BANK.filter((q) => !usedQuestionIds.includes(q.id)));

		if (unused.length < count) {
			const carryOver = unused;
			const carryOverIds = carryOver.map((q) => q.id);
			const freshPool = shuffle(TRIVIA_BANK.filter((q) => !carryOverIds.includes(q.id)));
			unused = [...carryOver, ...freshPool];
			usedQuestionIds = []; // pool has cycled
		}

		const picked = unused.slice(0, count);
		usedQuestionIds = [...usedQuestionIds, ...picked.map((q) => q.id)];
		saveUsedQuestions();
		return picked;
	}

	// ---------- Setup ----------
	function addPlayerSlot() {
		if (playerNames.length < 6) playerNames = [...playerNames, ''];
	}
	function removePlayerSlot(i) {
		if (playerNames.length > 2) playerNames = playerNames.filter((_, idx) => idx !== i);
	}

	function startGame() {
		const names = playerNames.map((n) => n.trim()).filter(Boolean);
		if (names.length < 2) return;
		testMode = false;
		players = names.map((name, i) => ({
			name,
			color: PLAYER_COLORS[i],
			score: 0,
			roundBank: 0,
			earnedSpins: 0,
			receivedSpins: 0,
			whammyCount: 0,
			eliminated: false
		}));
		round = 1;
		startTriviaRound();
	}

	// ---------- Test mode ----------
	// Skips trivia entirely -- random names, random starting spins -- so the
	// board mechanics can be playtested without running through questions first.
	function startTestGame(count) {
		testMode = true;
		const names = shuffle(TEST_NAME_POOL).slice(0, count);
		players = names.map((name, i) => ({
			name,
			color: PLAYER_COLORS[i],
			score: 0,
			roundBank: 0,
			earnedSpins: randomInt(2, 8),
			receivedSpins: 0,
			whammyCount: 0,
			eliminated: false
		}));
		round = 1;
		startBoardRound();
	}

	function assignTestSpins() {
		players.forEach((p) => {
			if (!p.eliminated) p.earnedSpins = randomInt(2, 8);
		});
	}

	// ---------- Trivia ----------
	// Host reads each question aloud. First buzz-in gets a direct shot for 3 spins;
	// their answer (right or wrong) becomes one of the multiple-choice options for
	// whichever players didn't buzz in, who can each earn 1 spin. If nobody buzzes
	// before time's up, all three players get the multiple-choice shot instead.
	function startTriviaRound() {
		phase = 'trivia';
		triviaQueue = pickTriviaQuestions(triviaQuestionCountForPlayers(players.length));
		triviaIndex = 0;
		resetQuestionState();
	}

	function resetQuestionState() {
		triviaStep = 'buzz';
		buzzedPlayerIdx = null;
		eligibleForMC = [];
		mcCorrect = [];
		triviaMessage = '';
	}

	function recordBuzz(idx) {
		if (idx === null) {
			buzzedPlayerIdx = null;
			eligibleForMC = players.map((p, i) => (!p.eliminated ? i : null)).filter((i) => i !== null);
			mcCorrect = [];
			triviaMessage = 'Nobody buzzed in time — remaining players play multiple choice.';
			triviaStep = 'multipleChoice';
		} else {
			buzzedPlayerIdx = idx;
			triviaStep = 'buzzResult';
		}
	}

	function recordBuzzResult(result) {
		const buzzer = players[buzzedPlayerIdx];
		if (result === 'correct') {
			buzzer.earnedSpins += 3;
			triviaMessage = `${buzzer.name} answered correctly! +3 spins.`;
		} else if (result === 'timeout') {
			triviaMessage = `${buzzer.name} ran out of time.`;
		} else {
			triviaMessage = `${buzzer.name} answered incorrectly.`;
		}
		eligibleForMC = players.map((p, i) => (i !== buzzedPlayerIdx && !p.eliminated ? i : null)).filter((i) => i !== null);
		mcCorrect = [];
		triviaStep = 'multipleChoice';
	}

	function toggleMcCorrect(idx) {
		mcCorrect = mcCorrect.includes(idx) ? mcCorrect.filter((i) => i !== idx) : [...mcCorrect, idx];
	}

	function finishMultipleChoice() {
		mcCorrect.forEach((idx) => {
			players[idx].earnedSpins += 1;
		});
		if (mcCorrect.length) {
			const names = mcCorrect.map((idx) => players[idx].name).join(', ');
			triviaMessage = `${names} also got it right (+1 spin each).`;
		}
		advanceTrivia();
	}

	function advanceTrivia() {
		setTimeout(() => {
			if (triviaIndex + 1 < triviaQueue.length) {
				triviaIndex += 1;
				resetQuestionState();
			} else {
				startBoardRound();
			}
		}, 1400);
	}

	// ---------- Board ----------
	// Round 1: fewest trivia spins goes first; tie -> leftmost (lower seat index) first.
	function computeRound1Order() {
		return players
			.map((p, i) => ({ p, i }))
			.sort((a, b) => (a.p.earnedSpins !== b.p.earnedSpins ? a.p.earnedSpins - b.p.earnedSpins : a.i - b.i))
			.map((o) => o.i);
	}

	// Round 2: ordered by end-of-round-1 money, least first, most last.
	// Tie for the lead (last slot) -> rightmost (higher seat index) goes last.
	// Tie for last place (first slot) -> fewest round-2 trivia spins goes first, then leftmost.
	// If every player has identical money, order is decided entirely by round-2 trivia spins
	// (fewest first, most last), ties broken leftmost-first.
	function computeRound2Order() {
		const entries = players.map((p, i) => ({ p, i }));
		const moneys = entries.map((o) => o.p.score);
		const allTiedMoney = moneys.every((m) => m === moneys[0]);
		const minMoney = Math.min(...moneys);

		return entries
			.sort((a, b) => {
				if (allTiedMoney) {
					return a.p.earnedSpins !== b.p.earnedSpins ? a.p.earnedSpins - b.p.earnedSpins : a.i - b.i;
				}
				if (a.p.score !== b.p.score) return a.p.score - b.p.score;
				// tied with each other -- if that tied value is the round's lowest, break by fewest round-2 spins then seat order
				if (a.p.score === minMoney) {
					return a.p.earnedSpins !== b.p.earnedSpins ? a.p.earnedSpins - b.p.earnedSpins : a.i - b.i;
				}
				// otherwise (tie for the lead, or a middle tie) -- leftmost first, so rightmost lands last
				return a.i - b.i;
			})
			.map((o) => o.i);
	}

	function startBoardRound() {
		phase = 'board';
		players.forEach((p) => (p.roundBank = 0));
		turnOrder = round === 1 ? computeRound1Order() : computeRound2Order();
		turnPointer = turnOrder.findIndex((idx) => !players[idx].eliminated && totalSpins(players[idx]) > 0);
		if (turnPointer === -1) {
			endBoardRound();
			return;
		}
		currentPlayerIndex = turnOrder[turnPointer];
		lastResult = null;
	}

	function beginSpin() {
		if (spinning) return;
		boardValues = shuffledBoard();
		spinning = true;
		lastResult = null;
		showPassChooser = false;
		function tick() {
			let next = highlightIndex;
			while (next === highlightIndex) {
				next = Math.floor(Math.random() * 18);
			}
			highlightIndex = next;
			spinTimer = setTimeout(tick, 80 + Math.random() * 60);
		}
		tick();
	}

	function stopSpin() {
		if (!spinning) return;
		clearTimeout(spinTimer);
		spinning = false;
		resolveSquare(boardValues[highlightIndex]);
	}

	// Spacebar controls the board so a player can run it themselves from a keyboard.
	function handleBoardKey(e) {
		if (phase !== 'board') return;
		if (e.code !== 'Space' && e.key !== ' ') return;
		e.preventDefault();

		if (spinning) {
			stopSpin();
			return;
		}
		if (showPassChooser) return;

		const player = players[currentPlayerIndex];
		if (!lastResult || (player && totalSpins(player) > 0)) {
			beginSpin();
		}
	}

	$effect(() => {
		window.addEventListener('keydown', handleBoardKey);
		return () => window.removeEventListener('keydown', handleBoardKey);
	});

	function consumeSpin(player) {
		if (player.receivedSpins > 0) {
			player.receivedSpins -= 1;
		} else {
			player.earnedSpins -= 1;
		}
	}

	function resolveSquare(square) {
		const player = players[currentPlayerIndex];
		const wasReceivedSpin = player.receivedSpins > 0;
		consumeSpin(player);

		if (square.type === 'whammy') {
			// A whammy wipes everything the player has accumulated in the game so far,
			// not just this turn's bank -- matching the real show's rule.
			player.score = 0;
			player.roundBank = 0;
			player.whammyCount += 1;
			// A whammy converts any leftover passed spins into ordinary earned spins.
			if (wasReceivedSpin && player.receivedSpins > 0) {
				player.earnedSpins += player.receivedSpins;
				player.receivedSpins = 0;
			}

			whammyFlash = true;
			setTimeout(() => (whammyFlash = false), 700);

			if (player.whammyCount >= ELIMINATION_WHAMMIES) {
				player.eliminated = true;
				player.earnedSpins = 0;
				player.receivedSpins = 0;
				lastResult = {
					kind: 'whammy',
					text: `WHAMMY! ${player.name} ${square.flavor}. That's ${ELIMINATION_WHAMMIES} -- ${player.name} is eliminated!`
				};
				const stillIn = players.filter((p) => !p.eliminated);
				if (stillIn.length === 0) {
					setTimeout(() => finalizeGame(true), 1400);
					return;
				}
			} else {
				lastResult = { kind: 'whammy', text: `WHAMMY! ${player.name} ${square.flavor}.` };
			}

			// Same as any other result: if spins remain, the player still chooses spin-again or pass.
			if (totalSpins(player) <= 0) {
				setTimeout(nextTurnOrPlayer, 1200);
			}
			return;
		}

		if (square.extraSpin) player.earnedSpins += 1;

		if (square.type === 'cash') {
			player.roundBank += square.amount;
			lastResult = { kind: 'cash', text: `${player.name} banks $${square.amount.toLocaleString()}${square.extraSpin ? ' + an extra spin!' : ''}` };
		} else if (square.type === 'prize') {
			player.roundBank += square.amount;
			lastResult = { kind: 'prize', text: `${player.name} wins the ${square.label} ($${square.amount.toLocaleString()})${square.extraSpin ? ' + an extra spin!' : ''}` };
		} else if (square.type === 'bigbucks') {
			player.roundBank += square.amount;
			lastResult = { kind: 'bigbucks', text: `BIG BUCKS! ${player.name} banks $${square.amount.toLocaleString()}!` };
		}

		if (totalSpins(player) <= 0) {
			setTimeout(nextTurnOrPlayer, 1200);
		}
	}

	// Determine who spins must be passed to, per the show's rule:
	// if you're not in the lead, they go to whoever is; if you're in the lead
	// (outright or tied), they go to second place. Ties at the target position
	// are the only case the passer gets to choose. Eliminated players are never targets.
	function computePassCandidates(passerIdx) {
		const passer = players[passerIdx];
		const others = players
			.map((p, i) => ({ p, i }))
			.filter((o) => o.i !== passerIdx && !o.p.eliminated);
		const activeScores = players.filter((p) => !p.eliminated).map((p) => p.score);
		const maxScore = Math.max(...activeScores);
		const passerIsLeading = passer.score === maxScore;

		if (passerIsLeading) {
			const maxOthers = Math.max(...others.map((o) => o.p.score));
			return others.filter((o) => o.p.score === maxOthers);
		}
		return others.filter((o) => o.p.score === maxScore);
	}

	function initiatePass() {
		const candidates = computePassCandidates(currentPlayerIndex);
		if (candidates.length === 1) {
			passSpinsTo(candidates[0].i);
		} else {
			passCandidates = candidates;
			showPassChooser = true;
		}
	}

	function passSpinsTo(recipientIdx) {
		const giver = players[currentPlayerIndex];
		const spinsToGive = totalSpins(giver);
		giver.score += giver.roundBank;
		giver.roundBank = 0;
		giver.earnedSpins = 0;
		giver.receivedSpins = 0;

		players[recipientIdx].receivedSpins += spinsToGive;

		showPassChooser = false;
		passCandidates = [];
		lastResult = null;
		currentPlayerIndex = recipientIdx;
		// Play continues from the recipient's seat in the turn order.
		const posInOrder = turnOrder.indexOf(recipientIdx);
		if (posInOrder !== -1) turnPointer = posInOrder;
	}

	function advanceTurnOrder() {
		const n = turnOrder.length;
		for (let step = 1; step <= n; step++) {
			const idx = (turnPointer + step) % n;
			const pIdx = turnOrder[idx];
			if (!players[pIdx].eliminated && totalSpins(players[pIdx]) > 0) {
				turnPointer = idx;
				currentPlayerIndex = pIdx;
				return true;
			}
		}
		return false;
	}

	function nextTurnOrPlayer() {
		const player = players[currentPlayerIndex];
		if (player && totalSpins(player) <= 0) {
			player.score += player.roundBank;
			player.roundBank = 0;
		}
		if (player && !player.eliminated && totalSpins(player) > 0) {
			lastResult = null;
			return;
		}
		if (advanceTurnOrder()) {
			lastResult = null;
		} else {
			endBoardRound();
		}
	}

	function finalizeGame(eliminatedAll = false) {
		phase = 'gameEnd';
		noChampion = eliminatedAll;
		if (!eliminatedAll) {
			const winner = [...players].sort((a, b) => b.score - a.score)[0];
			highScores = [...highScores, { name: winner.name, score: winner.score, date: new Date().toISOString().slice(0, 10) }]
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			saveHighScores();
		}
	}

	function endBoardRound() {
		if (round < TOTAL_ROUNDS) {
			round += 1;
			if (testMode) {
				assignTestSpins();
				startBoardRound();
			} else {
				startTriviaRound();
			}
		} else {
			finalizeGame(false);
		}
	}

	function playAgain() {
		phase = 'setup';
		playerNames = ['', ''];
		players = [];
		round = 1;
		lastResult = null;
		noChampion = false;
		testMode = false;
	}
</script>

<div class="stage">
	<div class="marquee-title">PRESS YOUR LUCK</div>

	{#if phase === 'setup'}
		<SetupPanel
			bind:playerNames
			usedQuestionCount={usedQuestionIds.length}
			{highScores}
			onAddPlayer={addPlayerSlot}
			onRemovePlayer={removePlayerSlot}
			onResetQuestions={resetUsedQuestions}
			onStart={startGame}
			onStartTest={startTestGame}
		/>
	{/if}

	{#if phase === 'trivia'}
		<TriviaPanel
			{round}
			{triviaIndex}
			{triviaQueue}
			{triviaStep}
			{buzzedPlayerIdx}
			{eligibleForMC}
			{mcCorrect}
			{triviaMessage}
			{players}
			onBuzz={recordBuzz}
			onBuzzResult={recordBuzzResult}
			onToggleMc={toggleMcCorrect}
			onFinishMc={finishMultipleChoice}
		/>
	{/if}

	{#if phase === 'board'}
		<div class="board-layout">
			{#if isWideBoard}
				<div class="console-slot left">
					<PlayerConsoles {players} indices={leftIndices} {currentPlayerIndex} />
				</div>
			{/if}
			<div class="board-slot">
				<BigBoard
					{boardValues}
					{highlightIndex}
					{round}
					{players}
					{currentPlayerIndex}
					{lastResult}
					{spinning}
					{whammyFlash}
					{showPassChooser}
					{passCandidates}
					onBeginSpin={beginSpin}
					onStopSpin={stopSpin}
					onInitiatePass={initiatePass}
					onPassTo={passSpinsTo}
					onCancelPassChooser={() => (showPassChooser = false)}
				/>
			</div>
			{#if isWideBoard}
				<div class="console-slot right">
					<PlayerConsoles {players} indices={rightIndices} {currentPlayerIndex} />
				</div>
			{:else}
				<div class="console-slot all">
					<PlayerConsoles {players} indices={allIndices} {currentPlayerIndex} />
				</div>
			{/if}
		</div>
	{/if}

	{#if phase === 'gameEnd'}
		<GameEndScreen {players} {noChampion} onPlayAgain={playAgain} />
	{/if}
</div>

<style>
	.board-layout {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-areas:
			'board'
			'consoles';
		gap: 1rem;
		width: 100%;
		max-width: 1400px;
	}
	.console-slot.all {
		grid-area: consoles;
	}
	.console-slot.left {
		grid-area: left;
	}
	.console-slot.right {
		grid-area: right;
	}
	.console-slot {
		display: flex;
	}
	.board-slot {
		grid-area: board;
		display: flex;
		justify-content: center;
	}

	@media (min-width: 1100px) {
		.board-layout {
			grid-template-columns: minmax(150px, 210px) minmax(0, 1fr) minmax(150px, 210px);
			grid-template-areas: 'left board right';
			align-items: stretch;
		}
	}
</style>