<script>
	import { onMount } from 'svelte';
	import { writable, get } from 'svelte/store';
	import '../app.css';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { handleStoreError } from '$lib/components/StandardErrorHandler';
	import { TIME_CONSTANTS } from '$lib/constants';
	import { isDevelopment, isMockDataEnabled } from '$lib/env';

	// Simple reactive stores to avoid import issues
	let user = writable(null);
	let isAuthenticated = writable(false);

	let loading = true;

	// Force loading to false after a timeout as a failsafe
	setTimeout(() => {
		if (loading) {
			loading = false;
		}
	}, TIME_CONSTANTS.LAYOUT_UPDATE_INTERVAL);

	// Handles the real authentication flow by validating the token
	// and setting the user state accordingly. This is used for production
	// and for development when mock data is disabled.
	async function initializeRealSession() {
		try {
			const { AuthService, authStore } = await import('$lib/auth');
			const isValid = await AuthService.validateToken();

			if (isValid) {
				// Use get() for a one-time read of the store state after validation.
				const state = get(authStore);
				if (state.user) {
					user.set(state.user);
					isAuthenticated.set(true);
				} else {
					// Token is valid but no user in store; treat as unauthenticated.
					user.set(null);
					isAuthenticated.set(false);
				}
			} else {
				user.set(null);
				isAuthenticated.set(false);
			}
		} catch (authError) {
			console.warn('Authentication validation failed:', authError);
			user.set(null);
			isAuthenticated.set(false);
		}
	}

	// Sets up a mock user and club for development and testing purposes.
	async function setupMockState() {
		console.log('Using mock authentication and data');
		const mockUser = {
			id: 'user-1',
			name: 'Demo User',
			email: 'demo@bookwork.com',
			role: 'Club Lead',
			isActive: true,
			createdAt: new Date().toISOString()
		};
		user.set(mockUser);
		isAuthenticated.set(true);

		// Set a default club for development/mock mode
		try {
			const { currentClub } = await import('$lib/stores');
			currentClub.set({
				id: 'club-1',
				name: 'Test Book Club',
				description: 'A test club for development'
			});
		} catch (storeError) {
			console.warn('Could not set default club for mock user:', storeError);
		}
	}

	onMount(async () => {
		loading = true;
		try {
			console.log('Environment check:', {
				isDev: isDevelopment(),
				mockEnabled: isMockDataEnabled()
			});

			// This is the single, clear decision point for how the app should initialize.
			if (isMockDataEnabled()) {
				await setupMockState();
			} else {
				await initializeRealSession();
			}
		} catch (error) {
			// Handle authentication initialization errors
			handleStoreError(error, 'authentication initialization');
			user.set(null);
			isAuthenticated.set(false);
		} finally {
			// This ensures the loading screen is always removed, even if errors occur.
			loading = false;
		}
	});

	// Handle logout
	async function handleLogout() {
		try {
			const { AuthService } = await import('$lib/auth');
			await AuthService.logout();
			user.set(null);
			isAuthenticated.set(false);
		} catch (error) {
			handleStoreError(error, 'logout', undefined, false);
			// Force logout even if API call fails
			user.set(null);
			isAuthenticated.set(false);
		}
	}
</script>

<svelte:head>
	<title>BookWork - Business Management Platform</title>
	<meta name="description" content="Comprehensive business management platform for modern organizations" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

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
			<button class="btn btn-primary mt-4" onclick={() => window.location.href = '/login'}>
				Sign In
			</button>
			<div class="demo-credentials">
				<p><strong>Demo Credentials:</strong></p>
				<p>Email: demo@bookwork.com</p>
				<p>Password: password</p>
			</div>
		</div>
	</div>
{:else}
	<div class="app">
		<nav class="nav">
			<div class="nav-content">
				<h1>BookWork</h1>
				<div class="nav-actions">
					<span class="user-name">Welcome, {$user?.name}</span>
					<button class="btn btn-outline" onclick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</nav>
		<main class="main-content">
			<slot />
		</main>
	</div>
{/if}

<ToastContainer />

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.nav {
		background: var(--primary-color, #3b82f6);
		color: white;
		padding: 0;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.nav-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-name {
		font-size: 0.875rem;
		opacity: 0.9;
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
		background-color: var(--bg-color, #ffffff);
	}

	.loading-screen p {
		margin-top: 1rem;
		color: var(--text-secondary, #666);
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
		border: 4px solid var(--border-color, #e0e0e0);
		border-top: 4px solid var(--primary-color, #3b82f6);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background-color: var(--primary-color, #3b82f6);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--primary-hover, #2563eb);
	}

	.btn-outline {
		background-color: transparent;
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.btn-outline:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.mt-4 {
		margin-top: 1rem;
	}

	.demo-credentials {
		margin-top: 2rem;
		padding: 1rem;
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 0.375rem;
	}

	.demo-credentials p {
		margin: 0.25rem 0;
		font-size: 0.875rem;
		color: #0369a1;
	}

	.demo-credentials p:first-child {
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	@media (max-width: 768px) {
		.nav-content {
			padding: 1rem;
		}
		
		.auth-container h1 {
			font-size: 2rem;
		}

		.nav-actions {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-end;
		}

		.user-name {
			font-size: 0.75rem;
		}
	}
</style>
