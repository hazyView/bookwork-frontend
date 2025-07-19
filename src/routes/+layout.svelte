<script>
	import { onMount, onDestroy } from 'svelte';
	import { user, currentClub, isAuthenticated } from '$lib/stores.js';
	import { validateAuthToken } from '$lib/api.js';
	import { mockUserClubs } from '$lib/mockData.js';
	import Navigation from '$lib/components/Navigation.svelte';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
	import '../app.css';

	let appError = null;
	let loading = true;

	onMount(async () => {
		// Set up global error handlers
		const handleError = (event) => {
			console.error('Global error:', event.error || event.reason);
			appError = 'Something went wrong. Please refresh the page.';
		};

		const handleUnhandledRejection = (event) => {
			console.error('Unhandled promise rejection:', event.reason);
			appError = 'A network error occurred. Please try again.';
		};

		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		// Attempt to authenticate user
		try {
			const token = localStorage.getItem('authToken');
			if (token) {
				try {
					const userData = await validateAuthToken(token);
					user.set(userData);
					
					// Load user's clubs after authentication
					if (userData && mockUserClubs.length > 0) {
						currentClub.set(mockUserClubs[0]);
					}
				} catch (error) {
					console.warn('Token validation failed:', error);
					localStorage.removeItem('authToken');
					user.set(null);
					currentClub.set(null);
				}
			} else {
				// For development: simulate auto-login with demo token
				if (import.meta.env.MODE === 'development') {
					localStorage.setItem('authToken', 'demo-token');
					const userData = await validateAuthToken('demo-token');
					user.set(userData);
					
					if (userData && mockUserClubs.length > 0) {
						currentClub.set(mockUserClubs[0]);
					}
				}
			}
		} catch (error) {
			console.error('Authentication error:', error);
			appError = 'Authentication failed. Please try logging in again.';
		} finally {
			loading = false;
		}

		// Cleanup function
		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	});

	function refreshPage() {
		window.location.reload();
	}

	function clearError() {
		appError = null;
	}
</script>

{#if loading}
	<div class="loading-screen">
		<div class="spinner"></div>
		<p>Loading BookWorm...</p>
	</div>
{:else if appError}
	<div class="error-boundary">
		<div class="error-content">
			<h2>Oops! Something went wrong</h2>
			<p>{appError}</p>
			<div class="error-actions">
				<button class="btn btn-primary" on:click={refreshPage}>
					Refresh Page
				</button>
				<button class="btn btn-secondary" on:click={clearError}>
					Try Again
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="app">
		<Navigation />
		<main class="main-content">
			<slot />
		</main>
		<ChatWidget />
	</div>
{/if}

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-content {
		flex: 1;
		padding-top: 4rem; /* Account for fixed navigation */
	}

	.loading-screen {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
	}

	.loading-screen p {
		margin-top: 1rem;
		color: var(--text-secondary);
	}

	.error-boundary {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
		padding: 2rem;
	}

	.error-content {
		max-width: 500px;
		text-align: center;
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: var(--shadow-lg);
	}

	.error-content h2 {
		color: var(--error-color);
		margin-bottom: 1rem;
	}

	.error-content p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--border-color);
		border-top: 4px solid var(--primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
