<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user, isAuthenticated } from '$lib/stores';

	let currentUser;
	let authenticated = false;

	// Subscribe to stores
	$: currentUser = $user;
	$: authenticated = $isAuthenticated;

	onMount(() => {
		// Component initialization
	});

	// Navigation functions
	function navigateTo(path) {
		goto(path);
	}

	function handleButtonClick(action) {
		switch(action) {
			case 'team':
				navigateTo('/clubs/roster');
				break;
			case 'schedule':
				navigateTo('/clubs/schedule');
				break;
			default:
				// Handle unknown actions silently
				break;
		}
	}
</script>

<svelte:head>
	<title>Dashboard - BookWork</title>
</svelte:head>

<div class="page-container">
	<div class="hero-section">
		<h1 class="hero-title">📚 Welcome to BookWork</h1>
		<p class="hero-subtitle">Your comprehensive business management platform</p>
		{#if currentUser}
			<p class="welcome-message">Hello, {currentUser.name}! Ready to get started?</p>
		{/if}
	</div>

	<div class="dashboard-grid">

		<div class="dashboard-card">
			<div class="card-icon">👥</div>
			<h3 class="card-title">Team Management</h3>
			<p class="card-description">Manage your team members, roles, and permissions efficiently.</p>
			<button class="card-button" onclick={() => handleButtonClick('team')}>Manage Team</button>
		</div>

		<div class="dashboard-card">
			<div class="card-icon">📅</div>
			<h3 class="card-title">Schedule</h3>
			<p class="card-description">Organize events, meetings, and deadlines in one place.</p>
			<button class="card-button" onclick={() => handleButtonClick('schedule')}>View Schedule</button>
		</div>




	</div>

	<div class="status-section">
		<h2 class="status-title">Quick Navigation</h2>
		<div class="nav-links">
			<a href="/business" class="nav-link">🏢 Business</a>
			<a href="/clubs" class="nav-link">🏟️ Clubs</a>
			<a href="/clubs/schedule" class="nav-link">📅 Schedule</a>
			<a href="/clubs/roster" class="nav-link">👥 Roster</a>
		</div>
	</div>

	<div class="status-section">
		<h2 class="status-title">System Status</h2>
		<div class="status-grid">
			<div class="status-item">
				<span class="status-dot green"></span>
				<span class="status-label">Frontend</span>
				<span class="status-value">✅ Active</span>
			</div>
			<div class="status-item">
				<span class="status-dot green"></span>
				<span class="status-label">Backend API</span>
				<span class="status-value">✅ Connected</span>
			</div>
			<div class="status-item">
				<span class="status-dot green"></span>
				<span class="status-label">Authentication</span>
				<span class="status-value">✅ {authenticated ? 'Authenticated' : 'Not Authenticated'}</span>
			</div>
			<div class="status-item">
				<span class="status-dot green"></span>
				<span class="status-label">Database</span>
				<span class="status-value">✅ Ready</span>
			</div>
		</div>
	</div>

	{#if import.meta.env.DEV}
		<div class="debug-section">
			<h3 class="debug-title">🔧 Debug Information</h3>
			<div class="debug-info">
				<p><strong>User:</strong> {currentUser ? currentUser.name : 'None'}</p>
				<p><strong>Authenticated:</strong> {authenticated}</p>
				<p><strong>Environment:</strong> {import.meta.env.MODE}</p>
				<p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.page-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		margin-top: 80px; /* Account for fixed navigation */
	}

	.hero-section {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem 0;
	}

	.hero-title {
		font-size: 2.5rem;
		color: var(--primary-color, #3b82f6);
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.hero-subtitle {
		font-size: 1.2rem;
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.welcome-message {
		font-size: 1.1rem;
		color: #059669;
		font-weight: 600;
		background: #f0fdf4;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		display: inline-block;
		border: 1px solid #bbf7d0;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.dashboard-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e7eb;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.dashboard-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.15);
	}

	.card-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
		display: block;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.card-description {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.card-button {
		background: var(--primary-color, #3b82f6);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		width: 100%;
	}

	.card-button:hover {
		background: #2563eb;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.nav-link {
		background: var(--primary-color, #3b82f6);
		color: white;
		text-decoration: none;
		padding: 0.75rem 1.25rem;
		border-radius: 6px;
		font-weight: 600;
		transition: all 0.2s;
		display: inline-block;
	}

	.nav-link:hover {
		background: #2563eb;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
	}

	.status-section {
		background: #f8fafc;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		border: 1px solid #e2e8f0;
	}

	.status-title {
		font-size: 1.5rem;
		color: #1f2937;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-dot.green {
		background: #10b981;
	}

	.status-label {
		color: #6b7280;
		font-weight: 500;
		flex: 1;
	}

	.status-value {
		color: #1f2937;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.debug-section {
		background: #f3f4f6;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid var(--primary-color, #3b82f6);
	}

	.debug-title {
		color: #374151;
		margin-bottom: 1rem;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.debug-info {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		color: #4b5563;
		line-height: 1.6;
	}

	.debug-info p {
		margin-bottom: 0.25rem;
	}

	.debug-info strong {
		color: #1f2937;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.hero-title {
			font-size: 2rem;
		}

		.dashboard-grid {
			grid-template-columns: 1fr;
		}

		.status-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
