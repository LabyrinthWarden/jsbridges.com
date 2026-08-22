// Press Your Luck -- lab build
// Pure data & helpers. No Svelte runes here -- this is just a plain module so it
// can be imported from +page.svelte and any child component without restriction.

export const PLAYER_COLORS = ['#FFD447', '#00E5FF', '#FF2E9A'];

export const TOTAL_ROUNDS = 2;
export const ELIMINATION_WHAMMIES = 4;

// ---------- Trivia bank ----------
// Exactly 3 choices per question: the correct answer plus two distractors,
// matching the show's "buzzer's answer + host's two additions" format.
// Each question has a stable id so used-question tracking survives future edits/additions.
export const TRIVIA_BANK = [
	{ id: 1, q: 'Which planet is closest to the sun?', choices: ['Venus', 'Mercury', 'Mars'], a: 1 },
	{ id: 2, q: 'How many strings does a standard guitar have?', choices: ['4', '5', '6'], a: 2 },
	{ id: 3, q: 'What is the largest ocean on Earth?', choices: ['Atlantic', 'Indian', 'Pacific'], a: 2 },
	{ id: 4, q: 'Who wrote "Romeo and Juliet"?', choices: ['Dickens', 'Shakespeare', 'Austen'], a: 1 },
	{ id: 5, q: 'What gas do plants absorb from the air?', choices: ['Oxygen', 'Nitrogen', 'Carbon Dioxide'], a: 2 },
	{ id: 6, q: 'How many sides does a hexagon have?', choices: ['5', '6', '7'], a: 1 },
	{ id: 7, q: 'What is the capital of Australia?', choices: ['Sydney', 'Melbourne', 'Canberra'], a: 2 },
	{ id: 8, q: 'Which element has the chemical symbol "Fe"?', choices: ['Fluorine', 'Iron', 'Lead'], a: 1 },
	{ id: 9, q: 'What year did the Berlin Wall fall?', choices: ['1987', '1989', '1991'], a: 1 },
	{ id: 10, q: 'How many continents are there?', choices: ['5', '6', '7'], a: 2 },
	{ id: 11, q: 'What is the smallest prime number?', choices: ['0', '1', '2'], a: 2 },
	{ id: 12, q: 'Which body organ produces insulin?', choices: ['Liver', 'Kidney', 'Pancreas'], a: 2 },
	{ id: 13, q: 'What is the tallest mountain in the world?', choices: ['K2', 'Kilimanjaro', 'Everest'], a: 2 },
	{ id: 14, q: 'Who painted the Mona Lisa?', choices: ['Michelangelo', 'Raphael', 'da Vinci'], a: 2 },
	{ id: 15, q: 'What is the freezing point of water in Celsius?', choices: ['0', '32', '100'], a: 0 },
	{ id: 16, q: 'Which country gifted the Statue of Liberty to the US?', choices: ['England', 'France', 'Spain'], a: 1 },
	{ id: 17, q: 'How many legs does a spider have?', choices: ['6', '8', '10'], a: 1 },
	{ id: 18, q: 'What is the largest planet in our solar system?', choices: ['Saturn', 'Neptune', 'Jupiter'], a: 2 }
];

// ---------- Board value pools (grow these to any size you like) ----------
// Every spin draws a random number of whammies from WHAMMY_POOL and fills the
// rest of the 18 squares with random picks from PRIZE_POOL.
export const WHAMMY_MIN = 3;
export const WHAMMY_MAX = 6;

export const WHAMMY_POOL = [
	{ type: 'whammy', flavor: 'raided the vault and left confetti' },
	{ type: 'whammy', flavor: 'tripped the alarm on the way out' },
	{ type: 'whammy', flavor: 'spent it all on a novelty hat' },
	{ type: 'whammy', flavor: 'fed your winnings to a vending machine' },
	{ type: 'whammy', flavor: 'took the money and ran off stage' }
];

export const PRIZE_POOL = [
	{ type: 'cash', amount: 500 },
	{ type: 'cash', amount: 750 },
	{ type: 'cash', amount: 1000 },
	{ type: 'cash', amount: 1250, extraSpin: true },
	{ type: 'cash', amount: 1500 },
	{ type: 'cash', amount: 2000, extraSpin: true },
	{ type: 'cash', amount: 2500 },
	{ type: 'cash', amount: 3000 },
	{ type: 'prize', label: 'Mystery Prize', amount: 1800 },
	{ type: 'prize', label: 'Weekend Getaway', amount: 2200, extraSpin: true },
	{ type: 'bigbucks', amount: 7500 },
	{ type: 'cash', amount: 900, extraSpin: true },
	{ type: 'cash', amount: 1100 }
];

export function shuffle(arr) {
	const out = [...arr];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

// Picks n entries from pool without repeats where possible; if the pool is
// smaller than n, it pads with random repeats so the count is always met.
export function sampleEntries(pool, n) {
	const shuffled = shuffle(pool);
	if (shuffled.length >= n) return shuffled.slice(0, n);
	const result = [...shuffled];
	while (result.length < n) {
		result.push(pool[Math.floor(Math.random() * pool.length)]);
	}
	return result;
}

export function shuffledBoard() {
	const whammyCount = WHAMMY_MIN + Math.floor(Math.random() * (WHAMMY_MAX - WHAMMY_MIN + 1));
	const whammies = sampleEntries(WHAMMY_POOL, whammyCount);
	const prizes = sampleEntries(PRIZE_POOL, 18 - whammyCount);
	return shuffle([...whammies, ...prizes]);
}

// ---------- Ring layout: 18 cells around a 6x5 grid perimeter ----------
export const RING_POSITIONS = [
	[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
	[2, 6], [3, 6], [4, 6],
	[5, 6], [5, 5], [5, 4], [5, 3], [5, 2], [5, 1],
	[4, 1], [3, 1], [2, 1]
];

export function gridArea(idx) {
	const [r, c] = RING_POSITIONS[idx];
	return `${r} / ${c} / ${r + 1} / ${c + 1}`;
}

export function totalSpins(p) {
	return p.earnedSpins + p.receivedSpins;
}