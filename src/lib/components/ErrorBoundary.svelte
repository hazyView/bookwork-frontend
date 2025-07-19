<!-- Error Boundary Component for Svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { createServerError, type AppError } from '$lib/errors';
	
	export let fallback: string = '';
	export let showErrorDetails: boolean = dev;
	export let logErrors: boolean = true;
	export let errorId: string = '';
	
	let error: AppError | null = null;
	let hasError = false;
	let errorDetails = '';
	
	const dispatch = createEventDispatcher<{
		error: AppError;
		recover: void;
	}>();
	
	// Handle JavaScript errors in component tree
	function handleError(e: Error | Event) {
		const errorObj = e instanceof Error ? e : new Error('Unknown error occurred');
		
		const appError = createServerError(
			errorObj.message,
			errorObj,
			{
				userAgent: navigator?.userAgent,
				url: window?.location?.href
			}
		);
		
		error = appError;
		hasError = true;
		errorDetails = dev && errorObj.stack ? errorObj.stack : '';
		
		if (logErrors) {
			console.error('[ErrorBoundary]', appError);
		}
		
		// Dispatch error event for parent components
		dispatch('error', appError);
		
		return true; // Prevent default error handling
	}
	
	// Reset error state
	function recover() {
		error = null;
		hasError = false;
		errorDetails = '';
		dispatch('recover');
	}
	
	// Global error listener
	onMount(() => {
		function globalErrorHandler(event: ErrorEvent) {
			handleError(event.error || new Error(event.message));
			event.preventDefault();
		}
		
		function unhandledRejectionHandler(event: PromiseRejectionEvent) {
			handleError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
			event.preventDefault();
		}
		
		// Only add global handlers if this is the root error boundary
		if (!errorId || errorId === 'root') {
			window.addEventListener('error', globalErrorHandler);
			window.addEventListener('unhandledrejection', unhandledRejectionHandler);
			
			return () => {
				window.removeEventListener('error', globalErrorHandler);
				window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
			};
		}
	});
	
	// Expose error state for testing
	export { error, hasError };
</script>

{#if hasError && error}
	<div class="error-boundary" role="alert" aria-live="assertive">
		<div class="error-container">
			<div class="error-icon">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
					<line x1="12" y1="8" x2="12" y2="12"/>
					<line x1="12" y1="16" x2="12.01" y2="16"/>
				</svg>
			</div>
			
			<div class="error-content">
				<h2>Something went wrong</h2>
				<p class="error-message">{error.message}</p>
				
				{#if showErrorDetails && errorDetails}
					<details class="error-details">
						<summary>Technical Details</summary>
						<pre><code>{errorDetails}</code></pre>
					</details>
				{/if}
				
				<div class="error-actions">
					<button type="button" class="btn btn-primary" on:click={recover}>
						Try Again
					</button>
					<button 
						type="button" 
						class="btn btn-secondary" 
						on:click={() => window.location.reload()}
					>
						Reload Page
					</button>
				</div>
				
				{#if dev}
					<div class="error-metadata">
						<small>
							Error ID: {error.id}<br>
							Type: {error.type}<br>
							Timestamp: {error.timestamp.toLocaleString()}
						</small>
					</div>
				{/if}
			</div>
		</div>
		
		{#if fallback}
			<div class="fallback-content">
				{@html fallback}
			</div>
		{/if}
	</div>
{:else}
	<slot {handleError} />
{/if}

<style>
	.error-boundary {
		width: 100%;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background-color: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		text-align: center;
	}
	
	.error-container {
		max-width: 600px;
		width: 100%;
	}
	
	.error-icon {
		color: #dc3545;
		margin-bottom: 1rem;
	}
	
	.error-content h2 {
		color: #343a40;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
	}
	
	.error-message {
		color: #6c757d;
		margin-bottom: 1.5rem;
		font-size: 1rem;
		line-height: 1.5;
	}
	
	.error-details {
		margin-bottom: 1.5rem;
		text-align: left;
	}
	
	.error-details summary {
		cursor: pointer;
		padding: 0.5rem 0;
		font-weight: 500;
		color: #495057;
	}
	
	.error-details pre {
		background-color: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		padding: 1rem;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.4;
		margin-top: 0.5rem;
	}
	
	.error-details code {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		color: #e83e8c;
	}
	
	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
	}
	
	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s ease-in-out;
	}
	
	.btn:focus {
		outline: 2px solid #0066cc;
		outline-offset: 2px;
	}
	
	.btn-primary {
		background-color: #007bff;
		color: white;
	}
	
	.btn-primary:hover {
		background-color: #0056b3;
	}
	
	.btn-secondary {
		background-color: #6c757d;
		color: white;
	}
	
	.btn-secondary:hover {
		background-color: #545b62;
	}
	
	.error-metadata {
		padding-top: 1rem;
		border-top: 1px solid #dee2e6;
		color: #6c757d;
		font-size: 0.75rem;
	}
	
	.fallback-content {
		margin-top: 2rem;
		padding: 1rem;
		background-color: white;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		width: 100%;
	}
	
	/* Responsive design */
	@media (max-width: 768px) {
		.error-boundary {
			padding: 1rem;
			min-height: 150px;
		}
		
		.error-actions {
			flex-direction: column;
			align-items: center;
		}
		
		.btn {
			width: 100%;
			max-width: 200px;
		}
	}
	
	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.error-boundary {
			background-color: #212529;
			border-color: #495057;
			color: #f8f9fa;
		}
		
		.error-content h2 {
			color: #f8f9fa;
		}
		
		.error-message {
			color: #adb5bd;
		}
		
		.error-details pre {
			background-color: #343a40;
			border-color: #495057;
			color: #f8f9fa;
		}
		
		.error-metadata {
			border-color: #495057;
			color: #adb5bd;
		}
		
		.fallback-content {
			background-color: #343a40;
			border-color: #495057;
		}
	}
</style>
