<script>
	let { children } = $props();
</script>

<div class="realm-gen">
	{@render children()}
</div>

<style>
	/* Recreated DaisyUI "night" theme palette, scoped to this route tree only. */
	.realm-gen {
		--color-primary: oklch(75.35% 0.138 232.66);
		--color-primary-content: oklch(15.07% 0.027 232.66);
		--color-secondary: oklch(68.01% 0.158 276.93);
		--color-secondary-content: oklch(13.6% 0.031 276.93);
		--color-base-100: oklch(20.77% 0.039 265.75);
		--color-base-200: oklch(19.31% 0.037 265.75);
		--color-base-300: oklch(17.86% 0.034 265.75);
		--color-base-content: oklch(84.15% 0.007 265.75);
		--color-neutral: oklch(27.95% 0.036 260.03);
		--color-neutral-content: oklch(85.59% 0.007 260.03);

		background: var(--color-base-100);
		color: var(--color-base-content);
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			Helvetica,
			Arial,
			sans-serif;
		line-height: 1.5;
		padding: 1.5rem 1rem 3rem;
		border-radius: 0.5rem;
	}

	/* Everything below targets markup rendered by child +page.svelte files,
	   so each selector must be :global() — layout <style> blocks are scoped
	   only to markup written directly in the layout itself. */

	:global(.realm-gen .page-title) {
		margin: 1.5rem 0;
		text-align: center;
		font-size: 1.875rem;
		font-weight: 600;
		line-height: 1.2;
	}

	/* --- Form --- */
	:global(.realm-gen .form-wrap) {
		display: grid;
		width: 100%;
		justify-content: center;
	}

	:global(.realm-gen .form-wrap form) {
		width: 100%;
		max-width: 32rem;
	}

	:global(.realm-gen .form-control) {
		display: block;
		width: 100%;
		padding-top: 1rem;
	}

	:global(.realm-gen .label) {
		display: flex;
		padding: 0.5rem 0.25rem;
	}

	:global(.realm-gen .label-text) {
		font-size: 0.9375rem;
	}

	:global(.realm-gen .label-text-alt) {
		font-size: 0.75rem;
		opacity: 0.6;
	}

	:global(.realm-gen .select),
	:global(.realm-gen .input) {
		width: 100%;
		background: var(--color-base-100);
		color: var(--color-base-content);
		border: 1px solid var(--color-primary);
		border-radius: 0.5rem;
		padding: 0.55rem 0.75rem;
		font-size: 0.9375rem;
		height: 2.75rem;
		outline: none;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		appearance: none;
	}

	:global(.realm-gen .select) {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='1.5'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		background-size: 1rem;
		padding-right: 2.25rem;
	}

	:global(.realm-gen .select:focus),
	:global(.realm-gen .input:focus) {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-primary) 35%, transparent);
	}

	:global(.realm-gen .submit-row) {
		width: 100%;
		padding-top: 1rem;
	}

	/* --- Buttons --- */
	:global(.realm-gen .btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		border: 1px solid transparent;
		border-radius: 0.5rem;
		padding: 0.6rem 1.25rem;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		text-transform: none;
		transition:
			background-color 0.15s ease,
			opacity 0.15s ease,
			transform 0.05s ease;
	}

	:global(.realm-gen .btn:active) {
		transform: scale(0.99);
	}

	:global(.realm-gen .btn:disabled) {
		cursor: not-allowed;
		opacity: 0.4;
	}

	:global(.realm-gen .btn-primary) {
		background: var(--color-primary);
		color: var(--color-primary-content);
	}

	:global(.realm-gen .btn-primary:not(:disabled):hover) {
		background: color-mix(in oklch, var(--color-primary) 88%, black);
	}

	:global(.realm-gen .btn-secondary) {
		background: var(--color-secondary);
		color: var(--color-secondary-content);
	}

	:global(.realm-gen .btn-secondary:not(:disabled):hover) {
		background: color-mix(in oklch, var(--color-secondary) 88%, black);
	}

	/* --- Results --- */
	:global(.realm-gen .results-grid) {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 768px) {
		:global(.realm-gen .results-grid) {
			grid-template-columns: 1fr 1fr;
		}
	}

	:global(.realm-gen .results-title) {
		grid-column: 1 / -1;
		padding: 1rem 0;
		text-align: center;
		font-size: 1.875rem;
		font-weight: 600;
	}

	:global(.realm-gen .realm-info) {
		padding-right: 1rem;
	}

	:global(.realm-gen .section-title) {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 1.5rem;
		font-weight: 600;
	}

	:global(.realm-gen .stat-list) {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(.realm-gen .stat-list dt) {
		font-weight: 600;
		margin-top: 0.5rem;
	}

	:global(.realm-gen .stat-list dd) {
		margin: 0 0 0.25rem;
	}

	:global(.realm-gen .settlements) {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	:global(.realm-gen .settlement-block) {
		text-align: center;
	}

	:global(.realm-gen .settlement-title) {
		font-size: 1.5rem;
		font-weight: 600;
	}

	:global(.realm-gen .settlement-caption) {
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		opacity: 0.7;
	}

	:global(.realm-gen .settlement-values) {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.25rem 0.5rem;
		font-size: 0.875rem;
	}

	:global(.realm-gen .settlement-values p) {
		margin: 0;
	}

	:global(.realm-gen .settlement-empty) {
		font-size: 0.875rem;
		font-style: italic;
		opacity: 0.7;
	}

	:global(.realm-gen .reset-row) {
		grid-column: 1 / -1;
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	:global(.realm-gen .reset-form) {
		width: 100%;
		max-width: 20rem;
	}
</style>