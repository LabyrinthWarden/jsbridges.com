<script>
	import { Dice, weightedRandom, preventDefault } from '$lib/utils';

	// --- Constants ---
	const CITY_POPULATION_THRESHOLD = 8000; // Min population to be considered a city
	const MIN_TOWN_POPULATION_BASE = 1000; // Minimum population for a town before adjustment
	const AGRICULTURE_DENSITY_FACTOR = 180; // Divisor for calculating agriculture percentage
	const RUINS_POPULATION_FACTOR = 5000000; // Factor for ruins calculation
	const LARGEST_CITY_DICE_SIDES = 4;
	const LARGEST_CITY_DICE_COUNT = 2;
	const LARGEST_CITY_MODIFIER = 10;
	const SECOND_LARGEST_CITY_DICE_SIDES = 4;
	const SECOND_LARGEST_CITY_DICE_COUNT = 2;
	const NEXT_CITY_DICE_SIDES = 4;
	const NEXT_CITY_DICE_COUNT = 2;
	const NEXT_CITY_REDUCTION_FACTOR = 0.05;
	const TOWN_COUNT_DICE_SIDES = 8;
	const TOWN_COUNT_DICE_COUNT = 2;
	const TOWN_POP_HIGH_ROLL_THRESHOLD = 0.8;
	const TOWN_POP_HIGH_WEIGHT_MAX = 8000;
	const TOWN_POP_HIGH_WEIGHT_FACTOR = 2;
	const TOWN_POP_LOW_WEIGHT_MAX = 5000;
	const TOWN_POP_LOW_WEIGHT_FACTOR = 5;

	// --- State ---
	let inputs = $state({
		developmentFactor: 0,
		realmAge: 0,
		realmArea: 0
	});

	// Use a single object for results, initialized empty or with defaults
	let results = $state({
		popDensity: 0,
		realmPopulation: 0,
		agricultureSqMiles: 0,
		agricultureSqMilesPercent: 0,
		ruinsCount: 0,
		cityPopArray: [],
		townPopArray: [],
		cityCount: 0,
		townCount: 0,
		cityPopulationTotal: 0,
		townPopulationTotal: 0,
		largestCityPop: 0, // Keep if needed for display/logic, otherwise remove
		secondLargestCityPop: 0 // Keep if needed for display/logic, otherwise remove
	});

	let showForm = $state(true);

	// --- Derived State ---
	// Automatically calculates and updates when underlying state changes
	const realmStats = $derived({
		areaString: results.realmPopulation > 0 ? inputs.realmArea.toLocaleString() : '', // Only format if generated
		populationString: results.realmPopulation.toLocaleString(),
		agricultureSqMilesString: results.agricultureSqMiles.toLocaleString(),
		cityPopulationTotalString: results.cityPopulationTotal.toLocaleString(),
		townPopulationTotalString: results.townPopulationTotal.toLocaleString(),
		otherPopulationString: (results.realmPopulation - results.cityPopulationTotal - results.townPopulationTotal).toLocaleString()
	});

	const isFormIncomplete = $derived(inputs.developmentFactor <= 0 || inputs.realmAge <= 0 || inputs.realmArea <= 0);

	// --- Helper Functions ---

	function calculateBaseStats() {
		// Calculate Population Density
		const popDensityRoll = Dice.multipleDice(6, 4, 0); // Assuming 4d6
		results.popDensity = popDensityRoll * inputs.developmentFactor;

		// Calculate Realm Population
		results.realmPopulation = results.popDensity * inputs.realmArea;

		// Calculate Realm's Agricultural Area
		// Avoid division by zero if factor is 0; default percentage might be needed
		const rawAgriPercent = AGRICULTURE_DENSITY_FACTOR > 0 ? results.popDensity / AGRICULTURE_DENSITY_FACTOR : 0;
		results.agricultureSqMilesPercent = Math.floor(rawAgriPercent * 100);
		results.agricultureSqMiles = Math.floor(rawAgriPercent * inputs.realmArea);

		// Calculate number of ruins
		// Avoid NaN/Infinity if age/pop is 0 or negative
		const ageSqrt = inputs.realmAge > 0 ? Math.sqrt(inputs.realmAge) : 0;
		results.ruinsCount = results.realmPopulation > 0 && RUINS_POPULATION_FACTOR > 0 ? Math.floor((results.realmPopulation / RUINS_POPULATION_FACTOR) * ageSqrt) : 0;
	}

	function generateCityData() {
		results.cityPopArray.length = 0; // Clear array

		if (results.realmPopulation <= 0) {
			results.cityCount = 0;
			results.cityPopulationTotal = 0;
			results.largestCityPop = 0;
			results.secondLargestCityPop = 0;
			return; // No population, no cities
		}

		// Calculate Largest City's Population
		const p = Math.sqrt(results.realmPopulation);
		const m = Dice.multipleDice(LARGEST_CITY_DICE_COUNT, LARGEST_CITY_DICE_SIDES, LARGEST_CITY_MODIFIER); // e.g., 2d4+10
		results.largestCityPop = Math.max(0, Math.floor(p * m)); // Ensure non-negative

		// Calculate Second Largest City's Population
		const secondCityRoll = Dice.multipleDice(SECOND_LARGEST_CITY_DICE_COUNT, SECOND_LARGEST_CITY_DICE_SIDES, 0); // e.g., 2d4
		results.secondLargestCityPop = Math.max(0, Math.floor(results.largestCityPop * (secondCityRoll * 0.1))); // Ensure non-negative

		// Add initial cities if they meet the threshold
		if (results.largestCityPop >= CITY_POPULATION_THRESHOLD) {
			results.cityPopArray.push(results.largestCityPop);
		}
		if (results.secondLargestCityPop >= CITY_POPULATION_THRESHOLD) {
			results.cityPopArray.push(results.secondLargestCityPop);
		}

		// Calculate Remaining City Populations
		let currentCityPop = results.secondLargestCityPop;
		while (currentCityPop >= CITY_POPULATION_THRESHOLD) {
			const randomRoll = Dice.multipleDice(NEXT_CITY_DICE_COUNT, NEXT_CITY_DICE_SIDES, 0); // e.g., 2d4
			// Ensure the last valid city population is used for calculation if array isn't empty
			const lastPop = results.cityPopArray.length > 0 ? results.cityPopArray[results.cityPopArray.length - 1] : 0;
			currentCityPop = Math.max(0, Math.floor(lastPop * (1 - randomRoll * NEXT_CITY_REDUCTION_FACTOR))); // Ensure non-negative

			if (currentCityPop >= CITY_POPULATION_THRESHOLD) {
				results.cityPopArray.push(currentCityPop);
			} else {
				break; // Stop when population drops below threshold
			}
		}

		// Get the # of Cities in Realm
		results.cityCount = results.cityPopArray.length;

		// Calculate total population living in cities
		results.cityPopulationTotal = results.cityPopArray.reduce((a, b) => a + b, 0);
	}

	function generateTownData() {
		results.townPopArray.length = 0; // Clear array

		if (results.cityCount <= 0 && results.realmPopulation <= 0) {
			results.townCount = 0;
			results.townPopulationTotal = 0;
			return; // No cities/pop means no towns in this model
		}

		// Generate Town Count (dependent on city count or maybe base pop?)
		// If cityCount can be 0, have a fallback logic. Maybe base it on realmPopulation?
		// Let's stick to the original logic for now:
		results.townCount =
			results.cityCount > 0
				? results.cityCount * Dice.multipleDice(TOWN_COUNT_DICE_COUNT, TOWN_COUNT_DICE_SIDES, 0) // e.g., 2d8
				: Math.max(1, Math.floor(Math.sqrt(results.realmPopulation) / 100)); // Example fallback if no cities

		for (let i = 0; i < results.townCount; i++) {
			let townPopulation;
			const randomRoll = Math.random();
			if (randomRoll > TOWN_POP_HIGH_ROLL_THRESHOLD) {
				// e.g., > 0.8
				townPopulation = Math.floor(weightedRandom(TOWN_POP_HIGH_WEIGHT_MAX, TOWN_POP_HIGH_WEIGHT_FACTOR)); // e.g., (8000, 2)
			} else {
				townPopulation = Math.floor(weightedRandom(TOWN_POP_LOW_WEIGHT_MAX, TOWN_POP_LOW_WEIGHT_FACTOR)); // e.g., (5000, 5)
			}

			// Ensure minimum population
			if (townPopulation < MIN_TOWN_POPULATION_BASE) {
				townPopulation += MIN_TOWN_POPULATION_BASE;
			}
			// Ensure town pop doesn't exceed city threshold (optional rule)
			if (townPopulation >= CITY_POPULATION_THRESHOLD) {
				townPopulation = CITY_POPULATION_THRESHOLD - Dice.multipleDice(1, 100, 1); // Make slightly smaller than a city
			}

			results.townPopArray.push(Math.max(MIN_TOWN_POPULATION_BASE, townPopulation)); // Ensure minimum
		}

		// Sort the Town Population array from largest to smallest
		results.townPopArray.sort((a, b) => b - a); // Sort descending directly

		// Get the total population living in towns
		results.townPopulationTotal = results.townPopArray.reduce((a, b) => a + b, 0);
	}

	// --- Main Generator Function ---
	function realmGenerator() {
		calculateBaseStats();
		generateCityData();
		generateTownData();

		// Show Results Section
		showForm = false;
	}

	// --- Reset Function ---
	function resetForm() {
		// Reset inputs
		inputs.developmentFactor = 0;
		inputs.realmAge = 0;
		inputs.realmArea = 0;

		// Reset results explicitly (important as they are in an object)
		results.popDensity = 0;
		results.realmPopulation = 0;
		results.agricultureSqMiles = 0;
		results.agricultureSqMilesPercent = 0;
		results.ruinsCount = 0;
		results.cityPopArray = []; // Reassign to new empty array
		results.townPopArray = []; // Reassign to new empty array
		results.cityCount = 0;
		results.townCount = 0;
		results.cityPopulationTotal = 0;
		results.townPopulationTotal = 0;
		results.largestCityPop = 0;
		results.secondLargestCityPop = 0;

		// Return UI to original state
		showForm = true;
	}
</script>

<h1 class="page-title">Realm Generator</h1>

{#if showForm}
	<div id="generationForm" class="form-wrap">
		<form onsubmit={preventDefault(realmGenerator)}>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Select Development Factor</span>
				</div>
				<select bind:value={inputs.developmentFactor} class="select" required>
					<option disabled value={0}>Pick one</option>
					<!-- Use value=0 for default/disabled -->
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
				<div class="label">
					<span class="label-text-alt">5 is very developed, 1 is minimally developed/ravaged.</span>
				</div>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">What is the age of the realm, in years?</span>
				</div>
				<input type="number" min="1" bind:value={inputs.realmAge} class="input" required />
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">What is the realm's area, in square miles?</span>
				</div>
				<input type="number" min="1" bind:value={inputs.realmArea} class="input" required />
			</label>

			<div class="submit-row">
				<button type="submit" class="btn btn-primary" disabled={isFormIncomplete}>Generate Realm</button>
			</div>
		</form>
	</div>
{/if}

{#if !showForm}
	<div class="results-grid" id="realmGenResults">
		<h2 class="results-title">Results:</h2>

		<div class="realm-info">
			<h3 class="section-title">Realm Information:</h3>
			<dl class="stat-list">
				<dt>Development Factor:</dt>
				<!-- Using Definition List for Semantics -->
				<dd>{inputs.developmentFactor}</dd>

				<dt>Population Density:</dt>
				<dd>{results.popDensity.toFixed(2)} people per square mile.</dd>
				<!-- Added toFixed for density -->

				<dt>Realm's Area:</dt>
				<dd>{realmStats.areaString} square miles.</dd>

				<dt>Realm's Total Population:</dt>
				<dd>{realmStats.populationString} people.</dd>

				<dt>Realm's Agriculture Area:</dt>
				<dd>{realmStats.agricultureSqMilesString} square miles (Roughly {results.agricultureSqMilesPercent}% of total area).</dd>

				<dt>Number of Ruins in Realm:</dt>
				<dd>{results.ruinsCount}</dd>

				<dt>Total Population in Cities:</dt>
				<dd>{realmStats.cityPopulationTotalString} ({results.cityCount} cities)</dd>

				<dt>Total Population in Towns:</dt>
				<dd>{realmStats.townPopulationTotalString} ({results.townCount} towns)</dd>

				<dt>Total Population Elsewhere:</dt>
				<dd>{realmStats.otherPopulationString}</dd>
			</dl>
		</div>

		<div class="settlements">
			<div class="settlement-block">
				<h3 class="settlement-title">City Populations ({results.cityCount})</h3>
				<p class="settlement-caption">(Settlements with {CITY_POPULATION_THRESHOLD.toLocaleString()} or more people)</p>
				{#if results.cityPopArray.length > 0}
					<div class="settlement-values">
						{#each results.cityPopArray as city}
							<p>{city.toLocaleString()}</p>
						{/each}
					</div>
				{:else}
					<p class="settlement-empty">No cities generated.</p>
				{/if}
			</div>
			<div class="settlement-block">
				<h3 class="settlement-title">Town Populations ({results.townCount})</h3>
				<p class="settlement-caption">(Settlements with {MIN_TOWN_POPULATION_BASE.toLocaleString()} to {(CITY_POPULATION_THRESHOLD - 1).toLocaleString()} people)</p>
				{#if results.townPopArray.length > 0}
					<div class="settlement-values">
						{#each results.townPopArray as town}
							<p>{town.toLocaleString()}</p>
						{/each}
					</div>
				{:else}
					<p class="settlement-empty">No towns generated.</p>
				{/if}
			</div>
		</div>

		<div class="reset-row">
			<form onsubmit={preventDefault(resetForm)} class="reset-form">
				<button type="submit" class="btn btn-secondary">Generate New Realm</button>
			</form>
		</div>
	</div>
{/if}