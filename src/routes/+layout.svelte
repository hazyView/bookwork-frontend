<script>
	import { onMount } from 'svelte';
	import { AuthService, user, isAuthenticated } from '$lib/auth.ts';
	import { currentClub } from '$lib/stores.js';
	import { mockUserClubs } from '$lib/mockData.js';
	import Navigation from '$lib/components/Navigation.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import '../app.css';

	let loading = true;
	let ChatWidgetComponent = null;
	let chatWidgetLoading = true;

	onMount(async () => {
		// Authentication check - user must authenticate manually
		const unsubscribe = user.subscribe((userData) => {
			if (userData && mockUserClubs.length > 0) {
				currentClub.set(mockUserClubs[0]);
			} else if (!userData) {
				currentClub.set(null);
			}
		});

		// Validate existing authentication token if present
		const isValid = await AuthService.validateToken();
		if (!isValid) {
			// Clear any invalid session data
			await AuthService.logout();
		}

		loading = false;

		// Lazy load ChatWidget after main app loads
		setTimeout(async () => {
			try {
				const module = await import('$lib/components/ChatWidget.svelte');
				ChatWidgetComponent = module.default;
			} catch (error) {
				console.warn('Failed to load ChatWidget:', error);
			} finally {
				chatWidgetLoading = false;
			}
		}, 100);

		// Cleanup function
		return () => {
			unsubscribe();
		};
	});

	// Handle logout
	async function handleLogout() {
		await AuthService.logout();
	}
</script>

<svelte:head>
	<title>BookWork - Business Management Platform</title>
	<meta name="description" content="Comprehensive business management platform for modern organizations" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<ErrorBoundary errorId="root">
	{#if loading}
		<div class="loading-screen">
			<div class="spinner"></div>
			<p>Loading BookWork...</p>
		</div>
	{:else if !$isAuthenticated}
		<div class="auth-screen">
			<div class="auth-container">
				<h1>BookWork</h1>
				<p>Please sign in to continue</p>
				{#if import.meta.env.MODE === 'development'}
					<p class="text-sm text-gray-600 mt-2">
						Development mode: Authentication will be handled automatically
					</p>
				{/if}
			</div>
		</div>
	{:else}
		<div class="app">
			<Navigation on:logout={handleLogout} />
			<main class="main-content">
				<ErrorBoundary errorId="main-content">
					<slot />
				</ErrorBoundary>
			</main>
			<ErrorBoundary errorId="chat-widget">
				{#if !chatWidgetLoading && ChatWidgetComponent}
					<svelte:component this={ChatWidgetComponent} />
				{:else if chatWidgetLoading}
					<div class="chat-placeholder">
						<div class="chat-loading">💬</div>
					</div>
				{/if}
			</ErrorBoundary>
		</div>
	{/if}
</ErrorBoundary>

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

	.auth-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.auth-container {
		text-align: center;
		padding: 2rem;
	}

	.auth-container h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
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

	/* Responsive design */
	@media (max-width: 768px) {
		.auth-container h1 {
			font-size: 2rem;
		}
	}

	/* Chat placeholder styles */
	.chat-placeholder {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
	}

	.chat-loading {
		width: 56px;
		height: 56px;
		background: var(--primary-color);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		animation: pulse 2s ease-in-out infinite;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.7; }
	}

	@media (max-width: 640px) {
		.chat-placeholder {
			bottom: 16px;
			right: 16px;
		}
	}
</style>
