<script>
	import { Dice } from '$lib/js/dice';
	let developmentFactor = 0;
	let popDensity = 0;
	let realmArea = 0;
	let realmAreaString = '';
	let realmPopulation = 0;
	let realmPopulationString = '';
	let agricultureSqMiles = 0;
	let agricultureSqMilesString = '';
	let agricultureSqMilesPercent = 0;
	let realmAge = 0;
	let ruinsCount = 0;
	let ruinsCountString = '';
	let castlesCount = 0;
	let castlesCountString = '';
	let castlesCountCivilized = 0;
	let castlesCountCivilizedString = '';
	let castlesCountWilderness = 0;
	let castlesCountWildernessString = '';
	let cityPopArray = [];
	let townPopArray = [];
	let largestCityPop = 0;
	let secondLargestCityPop = 0;
	let cityPopulation = 0;
	let cityPopulationTotal = 0;
	let cityCount = 0;
	let townCount = 0;
	let townPopulation = 0;
	let townPopulationTotal = 0;

	function weightedRandom(max, numRolls) {
		let num = 0;
		for (let i = 0; i < numRolls; i++) {
			num += Math.random() * (max / numRolls);
		}
		return num;
	}

	function realmGenerator() {
		// Clear City Populations Array
		while (cityPopArray.length > 0) {
			cityPopArray.pop();
		}

		// Clear Town Populations Array
		while (townPopArray.length > 0) {
			townPopArray.pop();
		}

		// Calculate Population Density
		let popDensityRoll = Dice.multipleDice(6, 4, 0);
		popDensity = popDensityRoll * developmentFactor;

		// Calculate Realm Population
		realmPopulation = popDensity * realmArea;

		// Calculate Realm's Agricultural Area
		agricultureSqMilesPercent = popDensity / 180;
		agricultureSqMiles = Math.floor(agricultureSqMilesPercent * realmArea);
		agricultureSqMilesPercent = Math.floor(agricultureSqMilesPercent * 100);
		agricultureSqMilesString = agricultureSqMiles.toLocaleString();

		// Calculate number of ruins and castles
		ruinsCount = Math.floor((realmPopulation / 5000000) * Math.sqrt(realmAge));

		// Calculate Largest City's Population
		let p = Math.sqrt(realmPopulation);
		let m = Dice.multipleDice(2, 4, 10);
		largestCityPop = Math.floor(p * m);

		// Calculate Second Largest City's Population
		let secondCityRoll = Dice.multipleDice(2, 4, 0);
		secondLargestCityPop = Math.floor(largestCityPop * (secondCityRoll * 0.1));

		// Calculate Remaining City Populations
		// Only settlements larger than a population of 8000 qualify as cities
		cityPopulation = secondLargestCityPop; //used to establish new starting point for smaller cities, the math is different for the largest and second largest than the rest
		cityPopArray.push(largestCityPop);
		cityPopArray.push(secondLargestCityPop);

		while (cityPopulation > 8000) {
			let randomRoll = Dice.multipleDice(2, 4, 0);
			cityPopulation = Math.floor(cityPopArray[cityPopArray.length - 1] * (1 - randomRoll * 0.05));
			cityPopArray.push(cityPopulation);
		}

		// Remove Last Array Element, which is a city that is under 8000 population and doesn't qualify as a city according to this generator
		cityPopArray.pop();

		// Required for City Population array to become reactive to more than one generator action per refresh
		cityPopArray = cityPopArray;

		// Get the # of Cities in Realm
		cityCount = cityPopArray.length;

		// Calculate total population living in cities
		cityPopulationTotal = cityPopArray.reduce((a, b) => a + b, 0);

		// Generate Town Populations
		townCount = cityCount * Dice.multipleDice(2, 8, 0);

		for (let i = 0; i < townCount; i++) {
			let randomRoll = Math.random();
			if (randomRoll > 0.8) {
				townPopulation = Math.floor(weightedRandom(8000, 2));
			} else {
				townPopulation = Math.floor(weightedRandom(5000, 5));
			}
			if (townPopulation < 1000) {
				townPopulation = townPopulation + 1000;
			}
			townPopArray.push(townPopulation);
		}

		// Sort the Town Population array from largest to smallest
		townPopArray = townPopArray.sort();
		townPopArray = townPopArray.reverse();

		//Get the total poulation living in towns
		townPopulationTotal = townPopArray.reduce((a, b) => a + b, 0);

		// Converting some numeric variables to strings to display in the page better for readability
		realmAreaString = realmArea.toLocaleString();
		realmPopulationString = realmPopulation.toLocaleString();

		// Show Results Section when realm is generated
		document.getElementById('realmGenResults').classList.remove('hidden');
		document.getElementById('generationForm').classList.add('hidden');
	}
	function resetForm() {
		developmentFactor = '';
		realmAge = 0;
		realmArea = 0;
		// reset back to empty form
		document.getElementById('realmGenResults').classList.add('hidden');
		document.getElementById('generationForm').classList.remove('hidden');
	}
</script>

<h1 class="my-6 text-center text-3xl">Realm Generator</h1>

<div id="generationForm" class="grid w-full justify-center">
	<form on:submit|preventDefault={realmGenerator}>
		<label for="devFactor" class="form-control w-full max-w-lg pt-4">
			<div class="label">
				<span class="label-text">Select Development Factor</span>
			</div>
			<select
				bind:value={developmentFactor}
				name="devFactor"
				id="devFactor"
				class="select select-bordered select-primary w-full"
			>
				<option disabled selected>Pick one</option>
				<option value=1>1</option>
				<option value=2>2</option>
				<option value=3>3</option>
				<option value=4>4</option>
				<option value=5>5</option>
			</select>
			<div class="label">
				<span class="label-text-alt"
					>5 is for very developed land, 1 is for minimally develpoed lands or for lands ravaged by
					invasions or calamities.</span
				>
			</div>
		</label>

		<label for="realmAge" class="form-control w-full max-w-lg pt-4">
			<div class="label">
				<span class="label-text">What is the age of the realm, in years?</span>
			</div>
			<input
				type="number"
				name="realmAge"
				id="realmAge"
				bind:value={realmAge}
				class="input input-bordered input-primary w-full"
			/>
		</label>

		<label for="realmArea" class="form-control w-full max-w-lg pt-4">
			<div class="label">
				<span class="label-text">What is the realm's area, in square miles?</span>
			</div>
			<input
				type="number"
				name="realmArea"
				id="realmArea"
				bind:value={realmArea}
				class="input input-bordered input-primary w-full"
			/>
		</label>
		{#if developmentFactor === 0 || realmAge === 0 || realmArea === 0 }
			<div class="w-full pt-4">
				<button type="submit" class="btn btn-disabled mx-auto w-full">Generate Realm</button
				>
			</div>
		{:else}
			<div class="w-full pt-4">
				<button type="submit" class="btn btn-primary mx-auto w-full">Generate Realm</button>
			</div>
		{/if}
	</form>
</div>

<div class="grid hidden grid-cols-2" id="realmGenResults">
	<h2 class="col-span-full py-4 text-center text-3xl">Results:</h2>
	<div class="pl-4">
		<h3 class="mb-4 text-center text-2xl">Realm Information:</h3>
		<h3>Development Factor = {developmentFactor}</h3>
		<h3>Population Density = {popDensity} people per square mile.</h3>
		<h3>Realm's Area = {realmAreaString} square miles.</h3>
		<h3>
			Realm's Total Population = {realmPopulationString} people.
		</h3>
		<h3>Realm's Agriculture Area = {agricultureSqMilesString} square miles.</h3>
		<p>Roughly {agricultureSqMilesPercent}% of total land area of realm.</p>
		<h3>Number of Ruins in Realm = {ruinsCount}</h3>
		<h3>Total Population in Cities = {cityPopulationTotal.toLocaleString()}</h3>
		<h3>Total Population in Towns = {townPopulationTotal.toLocaleString()}</h3>
		<h3>
			Total Population Elsewhere = {(
				realmPopulation -
				cityPopulationTotal -
				townPopulationTotal
			).toLocaleString()}
		</h3>
	</div>
	<div class="grid grid-cols-1 gap-4">
		<div class="my-3 grid grid-cols-3 text-center">
			<h3 class="col-span-full text-center text-2xl">City Populations List:</h3>
			<p class="col-span-full mb-4 text-center text-xs">
				Cities are settlements with populations of 10,000 or more.
			</p>
			{#each cityPopArray as city}
				<p>{city.toLocaleString()}</p>
			{/each}
		</div>
		<div class="my-3 grid grid-cols-3 text-center">
			<h3 class="col-span-full text-2xl">Town Populations List:</h3>
			<p class="col-span-full mb-4 text-center text-xs">
				Towns are settlements with populations of 1,000 to 10,000.
			</p>
			{#each townPopArray as town}
				<p>{town.toLocaleString()}</p>
			{/each}
		</div>
	</div>

	<div class="col-span-full mx-auto max-w-2xl justify-center">
		<form on:submit|preventDefault={resetForm}>
			<div class="pt-4">
				<button type="submit" class="btn btn-primary mx-auto w-full">Reset Form</button>
			</div>
		</form>
	</div>
</div>
