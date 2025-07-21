<!-- Lazy loaded business services page -->
<script>
	import { onMount } from 'svelte';
	import { preloadComponent } from '$lib/lazyLoading.ts';
	import { enhancedPerfMonitor } from '$lib/performance.js';

	let ServicesComponent = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		enhancedPerfMonitor.mark('business-services-load');
		
		try {
			// Lazy load the actual services component
			const module = await import('./services/+page.svelte');
			ServicesComponent = module.default;
			
			enhancedPerfMonitor.measure('business-services-load');
			enhancedPerfMonitor.trackLazyComponentLoad('BusinessServices', 
				enhancedPerfMonitor.measures.get('business-services-load'), true);
		} catch (e) {
			error = e;
			enhancedPerfMonitor.trackLazyComponentLoad('BusinessServices', 0, false);
		} finally {
			loading = false;
		}

		// Preload other business routes for better navigation
		preloadComponent(() => import('./community/+page.svelte'));
		preloadComponent(() => import('./website-builder/+page.svelte'));
	});
</script>

<svelte:head>
	<title>Business Services - BookWorm</title>
	<meta name="description" content="Professional services for growing your literary business through BookWorm's platform" />
</svelte:head>

{#if loading}
	<div class="loading-container">
		<div class="loading-content">
			<div class="loading-spinner"></div>
			<h1>Business Services</h1>
			<p>Loading our comprehensive business solutions...</p>
		</div>
	</div>
{:else if error}
	<div class="error-container">
		<div class="error-content">
			<h1>Business Services</h1>
			<p>We're having trouble loading our services. Please try refreshing the page.</p>
			<button on:click={() => window.location.reload()} class="btn btn-primary">
				Refresh Page
			</button>
		</div>
	</div>
{:else if ServicesComponent}
	<svelte:component this={ServicesComponent} />
{/if}

<style>
	.loading-container,
	.error-container {
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.loading-content,
	.error-content {
		text-align: center;
		max-width: 500px;
	}

	.loading-content h1,
	.error-content h1 {
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.loading-content p,
	.error-content p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.loading-spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--border-color);
		border-top: 4px solid var(--primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 2rem auto;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary {
		background: var(--primary-color);
		color: white;
	}

	.btn-primary:hover {
		background: var(--primary-hover);
	}

	/* Skeleton loading states for better perceived performance */
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.loading-content {
		animation: pulse 2s ease-in-out infinite;
	}
</style>
