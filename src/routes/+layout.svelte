<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import '../app.css';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { handleStoreError, safeOperation } from '$lib/components/StandardErrorHandler';
	import { TIME_CONSTANTS } from '$lib/constants';
	import { isDevelopment, isProduction, isMockDataEnabled } from '$lib/env';

	// Simple reactive stores to avoid import issues
	let user = writable(null);
	let isAuthenticated = writable(false);

	let loading = true;
	let currentUser = null;
	let authenticated = false;

	// Force loading to false after a timeout as a failsafe
	setTimeout(() => {
		if (loading) {
			loading = false;
		}
	}, TIME_CONSTANTS.LAYOUT_UPDATE_INTERVAL);

	// Subscribe to stores
	user.subscribe(value => {
		currentUser = value;
	});
	
	isAuthenticated.subscribe(value => {
		authenticated = value;
	});

	onMount(async () => {
		try {
			// Debug: Check environment variables
			const envDebug = {
				isDev: isDevelopment(),
				mockEnabled: isMockDataEnabled(),
				envVars: import.meta.env
			};
			console.log('Environment check:', envDebug);
			
			// Check for production mode - but allow fallback for development
			if (!isDevelopment()) {
				// In production, validate existing token if any
				const { AuthService } = await import('$lib/auth');
				
				try {
					const isValid = await AuthService.validateToken();
					
					if (isValid) {
						// User is authenticated with valid token
						const authState = await import('$lib/auth').then(m => m.authStore);
						authState.subscribe(async (state) => {
							if (state.user) {
								user.set(state.user);
								isAuthenticated.set(true);
								
								// Set a default club for testing
								safeOperation(async () => {
									const { currentClub } = await import('$lib/stores');
									currentClub.set({
										id: '9e1db325-8d5a-4b1b-be9f-d97fe2f59ae5',
										name: 'Test Book Club',
										description: 'A test club for production testing'
									});
								}, undefined, (storeError) => {
									// Fail silently in production - error logged in development by safeOperation
								})();
							}
							// Always set loading to false after auth processing
							loading = false;
						});
					} else {
						// No valid token, user needs to login
						user.set(null);
						isAuthenticated.set(false);
						loading = false;
					}
				} catch (authError) {
					// Authentication validation failed, treat as unauthenticated
					console.warn('Auth validation failed:', authError);
					user.set(null);
					isAuthenticated.set(false);
					loading = false;
				}
			} else {
				// Development mode - prioritize mock data if enabled, otherwise check for valid token
				const mockDataEnabled = isMockDataEnabled();
				console.log('Mock data enabled:', mockDataEnabled); // Debug log
				console.log('Environment vars:', import.meta.env); // Debug log
				
				// Try mock data first if enabled, or if we're in dev mode and no real backend
				const shouldUseMockData = mockDataEnabled || 
					(isDevelopment() && (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || import.meta.env.VITE_ENABLE_MOCK_DATA === true));
				
				if (shouldUseMockData) {
					console.log('Using mock authentication'); // Debug log
					// Use mock authentication when mock data is enabled
					const mockUser = {
						id: 'dev-user-123',
						name: 'Development User',
						email: 'dev@bookwork.com',
						role: 'admin',
						isActive: true,
						createdAt: new Date().toISOString()
					};
					
					user.set(mockUser);
					isAuthenticated.set(true);
					loading = false;
				} else {
					// Try real authentication
					const { AuthService } = await import('$lib/auth');
					
					try {
						const isValid = await AuthService.validateToken();
						
						if (isValid) {
							// Use real authentication if available
							const authState = await import('$lib/auth').then(m => m.authStore);
							authState.subscribe(async (state) => {
								if (state.user) {
									user.set(state.user);
									isAuthenticated.set(true);
								}
								loading = false;
							});
						} else {
							// No authentication available
							user.set(null);
							isAuthenticated.set(false);
							loading = false;
						}
					} catch (authError) {
						// Authentication validation failed, treat as unauthenticated
						console.warn('Auth validation failed:', authError);
						user.set(null);
						isAuthenticated.set(false);
						loading = false;
					}
				}
			}
			
			// Set a default club for development when mock data is enabled
			if (isMockDataEnabled()) {
				try {
					const { currentClub } = await import('$lib/stores');
					currentClub.set({
						id: '9e1db325-8d5a-4b1b-be9f-d97fe2f59ae5',
						name: 'Test Book Club',
						description: 'A test club for development'
					});
				} catch (storeError) {
					// Only log warnings in development
					if (isDevelopment()) {
						console.warn('Could not set default club:', storeError);
					}
				}
			}
		} catch (error) {
			// Handle authentication initialization errors
			handleStoreError(error, 'authentication initialization');
			
			// Ensure loading is false even on error
			loading = false;
			user.set(null);
			isAuthenticated.set(false);
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
{:else if !authenticated}
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
					<span class="user-name">Welcome, {currentUser?.name}</span>
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
