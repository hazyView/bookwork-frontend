<script lang="ts">
	import { onMount } from 'svelte';
	import { lazyLoad, LazyLoadMetrics } from '$lib/lazyLoading.ts';
	import type { ComponentType } from 'svelte';

	let ChatWidgetComponent: ComponentType | null = null;
	let loading = true;
	let error: Error | null = null;
	let mounted = false;

	onMount(async () => {
		mounted = true;
		
		// Add a small delay to ensure critical components load first
		await new Promise(resolve => setTimeout(resolve, 500));

		const startTime = performance.now();
		
		try {
			const result = await lazyLoad(() => import('./ChatWidget.svelte'));
			
			if (result.error) {
				error = result.error;
				LazyLoadMetrics.recordError('ChatWidget');
			} else {
				ChatWidgetComponent = result.component;
				const loadTime = performance.now() - startTime;
				LazyLoadMetrics.recordLoad('ChatWidget', loadTime);
			}
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load ChatWidget');
			LazyLoadMetrics.recordError('ChatWidget');
		} finally {
			loading = false;
		}
	});

	// Handle retry logic
	async function retryLoad() {
		if (!mounted) return;
		
		loading = true;
		error = null;
		LazyLoadMetrics.recordRetry('ChatWidget');
		
		const startTime = performance.now();
		
		try {
			const result = await lazyLoad(() => import('./ChatWidget.svelte'));
			
			if (result.error) {
				error = result.error;
				LazyLoadMetrics.recordError('ChatWidget');
			} else {
				ChatWidgetComponent = result.component;
				const loadTime = performance.now() - startTime;
				LazyLoadMetrics.recordLoad('ChatWidget', loadTime);
			}
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load ChatWidget');
			LazyLoadMetrics.recordError('ChatWidget');
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<div class="chat-widget-loading" aria-label="Loading chat widget">
		<div class="loading-placeholder">
			<div class="loading-icon">💬</div>
			<div class="loading-text">Loading chat...</div>
		</div>
	</div>
{:else if error}
	<div class="chat-widget-error" role="alert">
		<div class="error-content">
			<div class="error-icon">⚠️</div>
			<div class="error-message">
				<p>Chat unavailable</p>
				<button 
					class="retry-button" 
					on:click={retryLoad}
					aria-label="Retry loading chat widget"
				>
					Try again
				</button>
			</div>
		</div>
	</div>
{:else if ChatWidgetComponent}
	<svelte:component this={ChatWidgetComponent} />
{/if}

<style>
	.chat-widget-loading,
	.chat-widget-error {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border: 1px solid #e2e8f0;
		z-index: 1000;
	}

	.loading-placeholder,
	.error-content {
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 200px;
	}

	.loading-icon,
	.error-icon {
		font-size: 20px;
		flex-shrink: 0;
	}

	.loading-text {
		color: #64748b;
		font-size: 14px;
		font-weight: 500;
	}

	.error-message {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.error-message p {
		margin: 0;
		color: #ef4444;
		font-size: 14px;
		font-weight: 500;
	}

	.retry-button {
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.retry-button:hover {
		background: #2563eb;
	}

	.retry-button:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.chat-widget-loading,
		.chat-widget-error {
			bottom: 16px;
			right: 16px;
			left: 16px;
			max-width: none;
		}
		
		.loading-placeholder,
		.error-content {
			min-width: auto;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.retry-button {
			transition: none;
		}
	}
</style>
