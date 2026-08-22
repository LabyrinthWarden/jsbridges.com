<script>
	// Internal "invisible tabs" navigation — no routing, just state
	let activeTab = $state('home');

	// Subtle parallax on the Home hero background — image moves slower than scroll
	let scrollY = $state(0);
	let reduceMotion = $state(false);
	const parallaxFactor = 0.25;

	$effect(() => {
		if (typeof window === 'undefined') return;

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = motionQuery.matches;
		const handleMotionChange = () => (reduceMotion = motionQuery.matches);
		motionQuery.addEventListener('change', handleMotionChange);

		function handleScroll() {
			scrollY = window.scrollY;
		}
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			motionQuery.removeEventListener('change', handleMotionChange);
		};
	});

	const heroOffset = $derived(reduceMotion ? 0 : scrollY * parallaxFactor);

	const tabs = [
		{ id: 'home', label: 'Home' },
		{ id: 'about', label: 'About' },
		{ id: 'services', label: 'Services' },
		{ id: 'contact', label: 'Contact' }
	];

	function setTab(id) {
		activeTab = id;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	const services = [
		{ name: 'Electrical Services', note: 'Residential, commercial & light industry wiring and repair' },
		{ name: 'Fire Alarm Systems', note: 'Code-compliant systems for homes and businesses' },
		{ name: 'Security Systems', note: 'Intrusion alarms with 24-hour monitoring' },
		{ name: 'Video / Audio Monitoring', note: 'Surveillance systems for property and access oversight' },
		{ name: 'Card Access', note: 'Controlled entry for commercial and multi-tenant sites' },
		{ name: 'Gate Control', note: 'Automated gate systems for home and business' },
		{ name: 'Intercom Systems', note: 'Entry communication for homes and offices' },
		{ name: 'High & Low Voltage', note: 'Full-spectrum electrical work, from panels to data lines' },
		{ name: 'Generators', note: 'Backup power sizing, install, and service' }
	];

	const fundraisers = [
		'White Sulphur Springs Ranch',
		'Mohawk Valley Stewardship Council',
		'Portola School District',
		'Plumas County Sheriff Search & Rescue'
	];
</script>

<div class="site">
	<header class="site-header">
		<div class="header-inner">
			<div class="brand">
				<span class="brand-mark" aria-hidden="true">
					<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M20 3 L8 21 H18 L15 37 L33 16 H22 L20 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
					</svg>
				</span>
				<div class="brand-text">
					<span class="brand-name">Current Electric &amp; Alarm, Inc.</span>
					<span class="brand-tagline">Installing Quality the First Time</span>
				</div>
			</div>
			<a class="header-phone" href="tel:5308320190">
				<span class="phone-label">Call now</span>
				<span class="phone-number">530-832-0190</span>
			</a>
		</div>

		<nav class="tabs" aria-label="Site sections">
			<div class="tabs-track">
				{#each tabs as tab (tab.id)}
					<button
						type="button"
						class="tab"
						class:active={activeTab === tab.id}
						aria-current={activeTab === tab.id ? 'page' : undefined}
						onclick={() => setTab(tab.id)}
					>
						{tab.label}
					</button>
				{/each}
			</div>
		</nav>
	</header>

	<main>
		{#if activeTab === 'home'}
			<section class="hero">
				<div class="hero-bg" aria-hidden="true">
					<img
						src="/images/lab/current/current-electric--hero-river-sunset.png"
						alt=""
						class="hero-bg-img"
						loading="eager"
						fetchpriority="high"
						style="transform: translateY({heroOffset}px);"
					/>
					<div class="hero-bg-overlay"></div>
				</div>

				<div class="hero-content">
				<div class="hero-copy">
					<p class="eyebrow">Serving Plumas, Sierra &amp; Lassen Counties Since 2002</p>
					<h1>Quality you can trust.<br />Support you can count on.</h1>
					<p class="lede">
						Licensed electrical, fire alarm, and security work for homes and businesses
						in the Sierra Nevada — installed right the first time.
					</p>
					<div class="hero-actions">
						<button type="button" class="btn btn-primary" onclick={() => setTab('contact')}>
							Get a quote
						</button>
						<button type="button" class="btn btn-ghost" onclick={() => setTab('services')}>
							See services
						</button>
					</div>
				</div>

				<div class="hero-panel" aria-hidden="true">
					<svg viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg" class="panel-svg">
						<!-- house -->
						<path d="M120 170 L170 130 L220 170 V240 H120 Z" fill="none" stroke="var(--panel-yellow)" stroke-width="2.5" stroke-linejoin="round"/>
						<rect x="140" y="195" width="24" height="45" fill="none" stroke="var(--panel-yellow)" stroke-width="2"/>
						<rect x="180" y="195" width="22" height="22" fill="none" stroke="var(--panel-yellow)" stroke-width="2"/>

						<!-- circuit traces -->
						<path d="M220 200 H280" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="280" cy="200" r="4" fill="var(--copper)"/>
						<path d="M280 200 H340" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="340" cy="200" r="4" fill="var(--copper)"/>

						<path d="M170 130 V90" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="170" cy="90" r="4" fill="var(--copper)"/>
						<path d="M170 90 H340" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="340" cy="90" r="4" fill="var(--copper)"/>

						<path d="M140 240 V280" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="140" cy="280" r="4" fill="var(--copper)"/>
						<path d="M140 280 H340" stroke="var(--copper)" stroke-width="2"/>
						<circle cx="340" cy="280" r="4" fill="var(--copper)"/>

						<!-- labels -->
						<text x="345" y="94" class="panel-label">Fire Alarm</text>
						<text x="345" y="204" class="panel-label">Security</text>
						<text x="345" y="284" class="panel-label">Electrical</text>
					</svg>
				</div>
				</div>
			</section>

			<section class="strip">
				<div class="strip-inner">
					{#each ['Video Surveillance', 'Card Access', 'Gate Control', 'Generators'] as item}
						<span class="strip-item">{item}</span>
					{/each}
				</div>
			</section>

			<section class="trust-row">
				<div class="trust-inner">
					<div class="trust-item">
						<span class="trust-figure">23+</span>
						<span class="trust-label">Years in Plumas County</span>
					</div>
					<div class="trust-item">
						<span class="trust-figure">3</span>
						<span class="trust-label">Counties served — Plumas, Sierra &amp; Lassen</span>
					</div>
					<div class="trust-item">
						<span class="trust-figure">24/7</span>
						<span class="trust-label">Emergency service, on-call</span>
					</div>
					<div class="trust-item">
						<span class="trust-figure">#815151</span>
						<span class="trust-label">CA licensed, bonded &amp; insured</span>
					</div>
					<div class="trust-item">
						<span class="trust-figure">#5867</span>
						<span class="trust-label">Licensed Alarm Company Operator</span>
					</div>
				</div>
			</section>

			<section class="special-row">
				<div class="special-row-inner">
					<div class="special-row-image">
						<img
							src="/images/lab/current/current-electric--service-van--cutout.png"
							alt="Current Electric &amp; Alarm service van"
						/>
					</div>

					<div class="special-row-card">
						<p class="eyebrow">Limited-Time Offer</p>
						<h2>New Customer Special</h2>

						<div class="special-card">
							<div class="special-price">
								<span class="price-amount">$899</span>
								<span class="price-note">initial cost</span>
							</div>
							<ul class="special-list">
								<li>3 door contacts</li>
								<li>1 motion sensor</li>
								<li>Main panel</li>
								<li>Keypad</li>
								<li>Cell radio</li>
								<li>Battery back-up</li>
								<li>Installation &amp; tax included</li>
							</ul>
							<div class="special-monthly">$45<span>/month monitoring</span></div>
							<button type="button" class="btn btn-primary" onclick={() => setTab('contact')}>
								Claim this special
							</button>
						</div>
					</div>
				</div>
			</section>

			<section class="intro-section">
				<div class="intro-inner">
					<div class="intro-copy-block">
						<p class="eyebrow">Why Current Electric &amp; Alarm</p>
						<h2>Local hands. Honest work.</h2>
						<p class="body-copy">
							We're a locally owned and operated business, based right here in
							the Sierra Nevada, not a call center routing you to whoever's
							available. When you call, you're talking to the people who will
							actually be on the job.
						</p>
						<p class="body-copy">
							Mountain properties come with their own quirks — older wiring,
							long driveways, unpredictable weather, homes and businesses that
							are hard to reach fast if something goes wrong. We've worked in
							Plumas, Sierra, and Lassen counties long enough to know the
							terrain, the buildings, and what actually holds up out here.
						</p>
						<p class="body-copy">
							Every job, from a single panel upgrade to a full fire alarm
							install, gets the same standard: done right, done once, and
							priced fairly from the start.
						</p>
					</div>

					<div class="process-block">
						<p class="eyebrow">How It Works</p>
						<h2>Three steps, no surprises</h2>
						<ol class="process-list">
							<li>
								<span class="process-num">01</span>
								<div>
									<h3>Call or send a request</h3>
									<p>Tell us what's going on — a quote, a repair, or a new install.</p>
								</div>
							</li>
							<li>
								<span class="process-num">02</span>
								<div>
									<h3>We come out and quote it</h3>
									<p>A straight, competitive price before any work begins.</p>
								</div>
							</li>
							<li>
								<span class="process-num">03</span>
								<div>
									<h3>We install it right</h3>
									<p>Installing quality the first time, so you're not calling us back for the same problem.</p>
								</div>
							</li>
						</ol>
					</div>
				</div>
			</section>
		{/if}

		{#if activeTab === 'about'}
			<section class="alt-page">
				<div class="alt-page-bg" style="background-image: url('/images/lab/current/current-electric--hero-mountain-lake.png');"></div>
				<div class="alt-page-overlay"></div>

				<div class="alt-page-content">
					<p class="eyebrow eyebrow--light">About Us</p>
					<h1 class="alt-page-heading">25 years in the Sierra Nevada</h1>
					<p class="lede alt-page-lede">
						Current Electric &amp; Alarm has served Plumas County and the surrounding
						areas since 2002 — licensed, bonded, and insured, working across
						Plumas, Sierra, and Lassen counties.
					</p>
					<p class="lede alt-page-lede">
						Whether it's a residential remodel, new home construction, or commercial
						electrical work, you get the same exceptional service every time —
						reliable, honest, and competitively priced. We also design and install
						fire alarm and security systems, including video and audio monitoring
						with 24-hour intrusion alerts.
					</p>

					<div class="info-grid info-grid--glass">
						<div class="info-card info-card--glass">
							<h2>Hours of Operation</h2>
							<dl>
								<dt>Monday – Friday</dt>
								<dd>8:00 AM – 5:00 PM</dd>
								<dt>Weekends</dt>
								<dd>Closed</dd>
								<dt>Emergency Service</dt>
								<dd>24 hours on-call</dd>
							</dl>
						</div>

						<div class="info-card info-card--glass">
							<h2>Licensing</h2>
							<dl>
								<dt>CA Contractor License</dt>
								<dd>#815151</dd>
								<dt>Alarm Company Operator</dt>
								<dd>#5867</dd>
							</dl>
						</div>

						<div class="info-card info-card--glass">
							<h2>Fundraisers We Support</h2>
							<ul class="plain-list">
								{#each fundraisers as org}
									<li>{org}</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</section>
		{/if}

		{#if activeTab === 'services'}
			<section class="alt-page">
				<div class="alt-page-bg" style="background-image: url('/images/lab/current/current-electric--generator-install.jpg');"></div>
				<div class="alt-page-overlay"></div>

				<div class="alt-page-content">
					<p class="eyebrow eyebrow--light">What We Do</p>
					<h1 class="alt-page-heading">Services</h1>
					<p class="lede alt-page-lede">
						Full-spectrum electrical, fire alarm, and security work for
						residential, commercial, and light-industry properties.
					</p>

					<div class="service-grid service-grid--glass">
						{#each services as svc}
							<div class="service-card service-card--glass">
								<span class="service-node" aria-hidden="true"></span>
								<h2>{svc.name}</h2>
								<p>{svc.note}</p>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}



		{#if activeTab === 'contact'}
			<section class="page-section">
				<p class="eyebrow">Get In Touch</p>
				<h1>How can we help?</h1>

				<div class="contact-layout">
					<div class="contact-details">
						<div class="detail-block">
							<h2>Call or Email</h2>
							<a class="detail-link" href="tel:5308320190">530-832-0190</a>
							<a class="detail-link" href="mailto:info@getcurrentelectric.com">info@getcurrentelectric.com</a>
						</div>
						<div class="detail-block">
							<h2>Address</h2>
							<p>325 W. Sierra Ave<br />Portola, CA 96122</p>
						</div>
						<div class="detail-block">
							<h2>Hours</h2>
							<p>Monday – Friday, 8 AM – 5 PM<br />Emergency service 24 hours on-call</p>
						</div>
					</div>

					<form class="contact-form" onsubmit={(e) => e.preventDefault()}>
						<div class="form-row">
							<label for="first-name">First name</label>
							<input id="first-name" type="text" name="first-name" autocomplete="given-name" />
						</div>
						<div class="form-row">
							<label for="last-name">Last name</label>
							<input id="last-name" type="text" name="last-name" autocomplete="family-name" />
						</div>
						<div class="form-row">
							<label for="email">Email *</label>
							<input id="email" type="email" name="email" required autocomplete="email" />
						</div>
						<div class="form-row">
							<label for="phone">Phone</label>
							<input id="phone" type="tel" name="phone" autocomplete="tel" />
						</div>
						<div class="form-row">
							<label for="message">How can we help?</label>
							<textarea id="message" name="message" rows="4" placeholder="I'd like a quote on a fire alarm."></textarea>
						</div>
						<button type="submit" class="btn btn-primary form-submit">Send</button>
					</form>
				</div>
			</section>
		{/if}
	</main>

	<footer class="site-footer">
		<p>Current Electric &amp; Alarm, Inc. &middot; CA Lic #815151 &middot; ACO Lic #5867</p>
		<p>530-832-0190 &middot; info@getcurrentelectric.com</p>
	</footer>
</div>

<style>
	.site {
		--navy: #0e2a47;
		--navy-deep: #081c30;
		--panel-yellow: #e8d400;
		--copper: #b5651d;
		--spark-white: #faf9f5;
		--ink: #1b222c;
		--ink-soft: #4a5568;
		--border-soft: rgba(14, 42, 71, 0.12);

		--font-display: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif;
		--font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;
		--font-mono: 'IBM Plex Mono', ui-monospace, monospace;

		background: var(--spark-white);
		color: var(--ink);
		font-family: var(--font-body);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	h1, h2 {
		font-family: var(--font-display);
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--copper);
		margin: 0 0 0.6rem;
	}

	/* Header */
	.site-header {
		background: var(--navy);
		color: var(--spark-white);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1.25rem 1.5rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.brand-mark {
		width: 34px;
		height: 34px;
		color: var(--panel-yellow);
		flex-shrink: 0;
	}

	.brand-mark svg {
		width: 100%;
		height: 100%;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.15rem;
		line-height: 1.2;
	}

	.brand-tagline {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		color: var(--panel-yellow);
		text-transform: uppercase;
	}

	.header-phone {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		text-decoration: none;
		color: var(--spark-white);
		border: 1px solid rgba(250, 249, 245, 0.25);
		border-radius: 8px;
		padding: 0.5rem 1rem;
		transition: border-color 0.15s ease, background 0.15s ease;
	}

	.header-phone:hover,
	.header-phone:focus-visible {
		border-color: var(--panel-yellow);
		background: rgba(232, 212, 0, 0.08);
	}

	.phone-label {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(250, 249, 245, 0.65);
	}

	.phone-number {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 1rem;
		color: var(--panel-yellow);
	}

	.tabs {
		border-top: 1px solid rgba(250, 249, 245, 0.12);
		overflow-x: auto;
	}

	.tabs-track {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		padding: 0 1.5rem;
	}

	.tab {
		font-family: var(--font-body);
		font-weight: 500;
		font-size: 0.92rem;
		color: rgba(250, 249, 245, 0.75);
		background: transparent;
		border: none;
		border-bottom: 3px solid transparent;
		padding: 0.85rem 1.1rem;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.tab:hover {
		color: var(--spark-white);
	}

	.tab.active {
		color: var(--panel-yellow);
		border-bottom-color: var(--panel-yellow);
	}

	.tab:focus-visible {
		outline: 2px solid var(--panel-yellow);
		outline-offset: -2px;
	}

	/* Main / shared section styles */
	main {
		flex: 1;
	}

	.page-section {
		max-width: 900px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 4.5rem;
	}

	.page-section h1 {
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		margin: 0 0 1.25rem;
		color: var(--navy);
	}

	.body-copy {
		font-size: 1.02rem;
		line-height: 1.65;
		color: var(--ink-soft);
		max-width: 62ch;
		margin: 0 0 1rem;
	}

	/* Hero */
	.hero {
		position: relative;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: -100px 0;
		z-index: 0;
		overflow: hidden;
	}

	.hero-bg-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		will-change: transform;
	}

	.hero-bg-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(8, 28, 48, 0.7) 0%,
			rgba(8, 28, 48, 0.54) 45%,
			rgba(8, 28, 48, 0.74) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 1100px;
		margin: 0 auto;
		padding: 5rem 1.5rem 4rem;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 2.5rem;
		align-items: center;
	}

	.hero-content--single {
		display: block;
		max-width: 700px;
		padding: 4.5rem 1.5rem;
	}

	.hero-content--single .lede {
		max-width: 60ch;
		margin-bottom: 0;
	}

	.hero--about .hero-bg {
		inset: -60px 0;
	}

	.hero h1 {
		font-size: clamp(2rem, 4.2vw, 2.9rem);
		line-height: 1.15;
		color: var(--spark-white);
		margin: 0 0 1rem;
	}

	.hero .eyebrow {
		color: var(--panel-yellow);
	}

	.lede {
		font-size: 1.08rem;
		line-height: 1.6;
		color: rgba(250, 249, 245, 0.95);
		max-width: 46ch;
		margin: 0 0 1.75rem;
	}

	.hero-actions {
		display: flex;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.hero .btn-ghost {
		border-color: rgba(250, 249, 245, 0.55);
		color: var(--spark-white);
	}

	.hero .btn-ghost:hover {
		background: rgba(250, 249, 245, 0.1);
		border-color: var(--spark-white);
	}

	.hero-panel {
		background: rgba(8, 28, 48, 0.75);
		border: 1px solid rgba(250, 249, 245, 0.15);
		border-radius: 14px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(2px);
	}

	.panel-svg {
		width: 100%;
		height: auto;
	}

	.panel-svg text.panel-label {
		font-family: var(--font-mono);
		font-size: 12px;
		fill: var(--spark-white);
	}

	.strip {
		background: var(--panel-yellow);
	}

	.strip-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0.9rem 1.5rem;
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.strip-item {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--navy-deep);
	}

	.strip-item::before {
		content: '\25CF ';
		color: var(--copper);
	}

	/* Trust row */
	.trust-row {
		background: var(--spark-white);
		border-bottom: 1px solid var(--border-soft);
	}

	.trust-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.25rem 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1.5rem;
	}

	.trust-item {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.trust-figure {
		font-family: var(--font-mono);
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--navy);
	}

	.trust-label {
		font-size: 0.85rem;
		color: var(--ink-soft);
		line-height: 1.35;
	}

	/* Intro / process */
	.intro-section {
		background: var(--spark-white);
	}

	.intro-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 4rem;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 3rem;
	}

	.intro-copy-block h2,
	.process-block h2 {
		font-size: 1.5rem;
		color: var(--navy);
		margin: 0 0 1.25rem;
	}

	.process-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.process-list li {
		display: flex;
		gap: 1rem;
	}

	.process-num {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--copper);
		padding-top: 0.15rem;
		flex-shrink: 0;
	}

	.process-list h3 {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--navy);
		margin: 0 0 0.3rem;
	}

	.process-list p {
		font-size: 0.9rem;
		color: var(--ink-soft);
		line-height: 1.5;
		margin: 0;
	}

	/* Buttons */
	.btn {
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.95rem;
		border-radius: 8px;
		padding: 0.75rem 1.4rem;
		cursor: pointer;
		border: 2px solid transparent;
		transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;
	}

	.btn:focus-visible {
		outline: 2px solid var(--copper);
		outline-offset: 2px;
	}

	.btn-primary {
		background: var(--copper);
		color: var(--spark-white);
	}

	.btn-primary:hover {
		background: #9a5419;
	}

	.btn-ghost {
		background: transparent;
		border-color: var(--navy);
		color: var(--navy);
	}

	.btn-ghost:hover {
		background: rgba(14, 42, 71, 0.06);
	}

	/* About */
	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
		margin-top: 2rem;
	}

	.info-card {
		background: var(--spark-white);
		border: 1px solid var(--border-soft);
		border-radius: 10px;
		padding: 1.4rem;
	}

	.info-card h2 {
		font-size: 1rem;
		color: var(--navy);
		margin: 0 0 0.85rem;
	}

	.info-card dl {
		margin: 0;
	}

	.info-card dt {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--copper);
		margin-top: 0.6rem;
	}

	.info-card dt:first-child {
		margin-top: 0;
	}

	.info-card dd {
		margin: 0.15rem 0 0;
		color: var(--ink-soft);
	}

	.plain-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.plain-list li {
		color: var(--ink-soft);
		font-size: 0.92rem;
		padding-left: 0.9rem;
		position: relative;
	}

	.plain-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 6px;
		height: 6px;
		background: var(--copper);
		border-radius: 50%;
	}

	/* Services */
	.service-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.1rem;
		margin-top: 2rem;
	}

	.service-card {
		background: var(--spark-white);
		border: 1px solid var(--border-soft);
		border-left: 3px solid var(--panel-yellow);
		border-radius: 8px;
		padding: 1.25rem 1.4rem;
		position: relative;
	}

	.service-node {
		position: absolute;
		top: 1.3rem;
		right: 1.2rem;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--copper);
	}

	.service-card h2 {
		font-size: 1.02rem;
		color: var(--navy);
		margin: 0 0 0.4rem;
		padding-right: 1.2rem;
	}

	.service-card p {
		font-size: 0.9rem;
		color: var(--ink-soft);
		margin: 0;
		line-height: 1.5;
	}

	/* Alt pages — full-page fixed background behind glass cards */
	.alt-page {
		position: relative;
		min-height: 100vh;
	}

	.alt-page-bg {
		position: absolute;
		inset: 0;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		background-attachment: fixed;
		z-index: 0;
	}

	.alt-page-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(8, 28, 48, 0.92) 0%,
			rgba(8, 28, 48, 0.78) 40%,
			rgba(8, 28, 48, 0.96) 100%
		);
		z-index: 0;
	}

	.alt-page-content {
		position: relative;
		z-index: 1;
		max-width: 1100px;
		margin: 0 auto;
		padding: 4.5rem 1.5rem 5rem;
	}

	.eyebrow--light {
		color: var(--panel-yellow);
	}

	.alt-page-heading {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 600;
		color: var(--spark-white);
		margin: 0 0 1.25rem;
	}

	.alt-page-lede {
		max-width: 60ch;
		margin-bottom: 1.25rem;
	}

	.alt-page-lede:last-of-type {
		margin-bottom: 2.5rem;
	}

	.service-grid--glass {
		margin-top: 0;
	}

	.service-card--glass {
		background: rgba(250, 249, 245, 0.1);
		border: 1px solid rgba(250, 249, 245, 0.22);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.service-card--glass h2 {
		color: var(--spark-white);
	}

	.service-card--glass p {
		color: rgba(250, 249, 245, 0.78);
	}

	.service-card--glass .service-node {
		background: var(--panel-yellow);
	}

	.info-grid--glass {
		margin-top: 0.5rem;
	}

	.info-card--glass {
		background: rgba(250, 249, 245, 0.1);
		border: 1px solid rgba(250, 249, 245, 0.22);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.info-card--glass h2 {
		color: var(--spark-white);
	}

	.info-card--glass dt {
		color: var(--panel-yellow);
	}

	.info-card--glass dd {
		color: rgba(250, 249, 245, 0.78);
	}

	.info-card--glass .plain-list li {
		color: rgba(250, 249, 245, 0.78);
	}

	.info-card--glass .plain-list li::before {
		background: var(--panel-yellow);
	}

	/* Special + Van row (Home) */
	.special-row {
		background: var(--spark-white);
		border-bottom: 1px solid var(--border-soft);
	}

	.special-row-inner {
		max-width: 1150px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem;
		display: grid;
		grid-template-columns: 1.2fr 0.9fr;
		gap: 2.5rem;
		align-items: center;
	}

	.special-row-card h2 {
		font-size: 1.5rem;
		color: var(--navy);
		margin: 0 0 0.25rem;
	}

	.special-row-card .special-card {
		max-width: none;
	}

	.special-row-image {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.special-row-image img {
		width: 100%;
		height: auto;
	}

	/* Specials */
	.special-card {
		background: var(--navy);
		color: var(--spark-white);
		border-radius: 14px;
		padding: 2.25rem 2rem;
		max-width: 480px;
		margin-top: 1.5rem;
	}

	.special-price {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 1.5rem;
	}

	.price-amount {
		font-family: var(--font-display);
		font-size: 2.6rem;
		font-weight: 700;
		color: var(--panel-yellow);
	}

	.price-note {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: rgba(250, 249, 245, 0.7);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.special-list {
		list-style: none;
		margin: 0 0 1.5rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.special-list li {
		font-size: 0.95rem;
		padding-left: 1.1rem;
		position: relative;
	}

	.special-list li::before {
		content: '\2713';
		position: absolute;
		left: 0;
		color: var(--panel-yellow);
		font-weight: 700;
	}

	.special-monthly {
		font-family: var(--font-mono);
		font-size: 1.5rem;
		color: var(--panel-yellow);
		margin-bottom: 1.5rem;
	}

	.special-monthly span {
		font-size: 0.8rem;
		color: rgba(250, 249, 245, 0.7);
		margin-left: 0.3rem;
	}

	/* Contact */
	.contact-layout {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: 2.5rem;
		margin-top: 2rem;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.detail-block h2 {
		font-size: 0.95rem;
		color: var(--navy);
		margin: 0 0 0.5rem;
	}

	.detail-link {
		display: block;
		font-family: var(--font-mono);
		color: var(--copper);
		text-decoration: none;
		font-size: 0.95rem;
		margin-bottom: 0.2rem;
	}

	.detail-link:hover {
		text-decoration: underline;
	}

	.detail-block p {
		color: var(--ink-soft);
		margin: 0;
		line-height: 1.5;
		font-size: 0.92rem;
	}

	.contact-form {
		background: var(--spark-white);
		border: 1px solid var(--border-soft);
		border-radius: 10px;
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.form-row label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--navy);
	}

	.form-row input,
	.form-row textarea {
		font-family: var(--font-body);
		font-size: 0.95rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border-soft);
		border-radius: 6px;
		background: var(--spark-white);
		color: var(--ink);
	}

	.form-row input:focus-visible,
	.form-row textarea:focus-visible {
		outline: 2px solid var(--copper);
		outline-offset: 1px;
	}

	.form-submit {
		align-self: flex-start;
		margin-top: 0.25rem;
	}

	/* Footer */
	.site-footer {
		background: var(--navy-deep);
		color: rgba(250, 249, 245, 0.65);
		text-align: center;
		padding: 1.75rem 1.5rem;
		font-size: 0.82rem;
	}

	.site-footer p {
		margin: 0.2rem 0;
	}

	.site-footer p:first-child {
		font-family: var(--font-mono);
	}

	/* Responsive */
	@media (max-width: 820px) {
		.hero-content {
			grid-template-columns: 1fr;
		}

		.contact-layout {
			grid-template-columns: 1fr;
		}

		.intro-inner {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.special-row-inner {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.trust-inner {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 520px) {
		.header-inner {
			padding: 1rem 1.25rem 0.85rem;
		}

		.header-phone {
			align-items: flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
	}
</style>