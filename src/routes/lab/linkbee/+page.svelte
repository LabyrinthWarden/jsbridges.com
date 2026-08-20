<script>
	// Linkbee — placeholder profile data.
	// Swap this out for real content (or a backend fetch) later.
	let profile = $state({
		name: '@JohnDoe',
		bio: 'Digital Creator | Developer | Tech Enthusiast. Sharing tools and tips for the modern web.',
		avatar: '/images/lab/linkbee/avatar.png'
	});

	let links = $state([
		{
			label: 'Personal Website',
			href: 'https://yourwebsite.com',
			icon: 'globe'
		},
		{
			label: 'Latest Blog Post',
			href: '#',
			icon: 'article'
		},
		{
			label: 'My Store',
			href: '#',
			icon: 'bag'
		},
		{
			label: 'YouTube Channel',
			href: '#',
			icon: 'video'
		}
	]);

	let socials = $state([
		{ label: 'Twitter', href: '#', icon: 'twitter' },
		{ label: 'GitHub', href: '#', icon: 'github' },
		{ label: 'LinkedIn', href: '#', icon: 'linkedin' },
		{ label: 'Instagram', href: '#', icon: 'instagram' }
	]);

	let year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Linkbee — {profile.name}</title>
	<meta name="description" content="Connect with me across the web." />
</svelte:head>

<div class="page-bg">
<main class="container">
	<header>
		<img src={profile.avatar} alt="Profile picture" class="profile-img" />
		<h1 class="username">{profile.name}</h1>
		<p class="bio">{profile.bio}</p>
	</header>

	<nav class="links">
		{#each links as link}
			<a href={link.href} class="link-card" target="_blank" rel="noopener">
				<svg class="icon" viewBox="0 0 24 24">
					{#if link.icon === 'globe'}
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
						/>
					{:else if link.icon === 'article'}
						<path
							d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
						/>
					{:else if link.icon === 'bag'}
						<path
							d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h12v10z"
						/>
					{:else if link.icon === 'video'}
						<path
							d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
						/>
					{/if}
				</svg>
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="socials">
		{#each socials as social}
			<a href={social.href} class="social-link" aria-label={social.label} target="_blank" rel="noopener">
				<svg viewBox="0 0 24 24">
					{#if social.icon === 'twitter'}
						<path
							d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
						/>
					{:else if social.icon === 'github'}
						<path
							d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-1.02-.01-1.85-2.78.61-3.37-1.19-3.37-1.19-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"
						/>
					{:else if social.icon === 'linkedin'}
						<path
							d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8.34 18.34H5.67V9.75h2.67v8.59zM7 8.6a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm11.34 9.74h-2.67v-4.18c0-1-.02-2.28-1.39-2.28-1.4 0-1.61 1.09-1.61 2.21v4.25H10V9.75h2.56v1.17h.04c.36-.68 1.23-1.39 2.53-1.39 2.71 0 3.21 1.78 3.21 4.1v4.71z"
						/>
					{:else if social.icon === 'instagram'}
						<path
							d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47a4.9 4.9 0 0 0-1.77 1.15A4.9 4.9 0 0 0 2.53 5.45c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43a4.9 4.9 0 0 0 1.15 1.77 4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77A4.9 4.9 0 0 0 18.55 2.53c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.86.35.47.18.8.4 1.15.75s.57.68.75 1.15c.14.36.31.88.35 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.21 1.5-.35 1.86a3.1 3.1 0 0 1-.75 1.15 3.1 3.1 0 0 1-1.15.75c-.36.14-.88.31-1.86.35-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.21-1.86-.35a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.31-.88-.35-1.86C3.81 14.99 3.8 14.67 3.8 12s.01-2.99.06-4.04c.04-.98.21-1.5.35-1.86.18-.47.4-.8.75-1.15s.68-.57 1.15-.75c.36-.14.88-.31 1.86-.35C8.01 3.81 8.33 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7zm5.35-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
						/>
					{/if}
				</svg>
			</a>
		{/each}
	</div>

	<footer>
		<p>&copy; {year} {profile.name.replace('@', '')} · Powered by Linkbee</p>
	</footer>
</main>
</div>

<style>
	:root {
		--bg-color: #f4f6f8;
		--container-bg: #ffffff;
		--text-primary: #1a202c;
		--text-secondary: #718096;
		--accent-color: #3182ce;
		--accent-hover: #2b6cb0;
		--btn-bg: #ffffff;
		--btn-text: #1a202c;
		--btn-border: #e2e8f0;
		--btn-hover-bg: #f7fafc;
		--btn-hover-border: #cbd5e0;
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--radius: 12px;
		--font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			'Helvetica Neue', Arial, sans-serif;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--bg-color: #1a202c;
			--container-bg: #2d3748;
			--text-primary: #f7fafc;
			--text-secondary: #a0aec0;
			--accent-color: #63b3ed;
			--accent-hover: #4299e1;
			--btn-bg: #2d3748;
			--btn-text: #f7fafc;
			--btn-border: #4a5568;
			--btn-hover-bg: #4a5568;
			--btn-hover-border: #718096;
		}
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: var(--bg-color);
	}

	.page-bg {
		background-color: var(--bg-color);
		min-height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
	}

	main.container {
		font-family: var(--font-family);
		color: var(--text-primary);
		line-height: 1.5;
		width: 100%;
		max-width: 680px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	header {
		margin-bottom: 2rem;
	}

	.profile-img {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid var(--container-bg);
		box-shadow: var(--shadow-md);
		margin-bottom: 1rem;
	}

	.username {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.bio {
		color: var(--text-secondary);
		font-size: 1rem;
		max-width: 480px;
		margin: 0 auto;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2.5rem;
	}

	.link-card {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		background-color: var(--btn-bg);
		color: var(--btn-text);
		padding: 1rem 1.5rem;
		border: 1px solid var(--btn-border);
		border-radius: var(--radius);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-sm);
	}

	.link-card:hover {
		transform: translateY(-2px);
		background-color: var(--btn-hover-bg);
		border-color: var(--btn-hover-border);
		box-shadow: var(--shadow-md);
	}

	.link-card:focus-visible,
	.social-link:focus-visible {
		outline: 2px solid var(--accent-color);
		outline-offset: 2px;
	}

	.link-card .icon {
		position: absolute;
		left: 1.5rem;
		width: 24px;
		height: 24px;
		fill: currentColor;
	}

	.socials {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.social-link {
		color: var(--text-secondary);
		transition: color 0.2s ease;
	}

	.social-link:hover {
		color: var(--accent-color);
	}

	.social-link svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
	}

	footer {
		margin-top: 3rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.link-card {
			transition: none;
		}
		.link-card:hover {
			transform: none;
		}
	}
</style>