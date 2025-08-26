<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user, isAuthenticated } from '$lib/stores';
	import CardWithList from '$lib/components/CardWithList.svelte';
	import DrawerNavigation from '$lib/components/DrawerNavigation.svelte';
	import QuickActionsCard from '$lib/components/QuickActionsCard.svelte';

	let currentUser;
	let authenticated = false;
	let showGithubCard = false;
	let showQuickActionsCard = false;
	let isDrawerOpen = false;

	// Subscribe to stores
	$: currentUser = $user;
	$: authenticated = $isAuthenticated;

	onMount(() => {
		// Component initialization
	});

	// Navigation functions
	function navigateTo(path: string) {
		goto(path);
	}

	function handleButtonClick(action: string) {
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

	function toggleGithubCard() {
		showGithubCard = !showGithubCard;
	}

	function toggleQuickActionsCard() {
		showQuickActionsCard = !showQuickActionsCard;
	}

	function openDrawer() {
		isDrawerOpen = true;
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}
</script>

<svelte:head>
	<title>Dashboard - BookWork</title>
</svelte:head>

<!-- Left Side Hover Trigger -->
<div 
	class="nav-trigger" 
	onmouseenter={openDrawer} 
	role="button" 
	tabindex="0"
	aria-label="Hover to open navigation menu"
	onkeydown={(e) => e.key === 'Enter' && openDrawer()}
></div>

<div class="page-container">
	<div class="hero-section">
		<h1 class="hero-title">📚 Welcome to BookWork</h1>
		<p class="hero-subtitle">Your comprehensive business management platform</p>
		{#if currentUser}
			<p class="welcome-message">Hello, {currentUser?.name}! Ready to get started?</p>
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


		<!-- Github Repos Section -->
		<div class="github-repos-section">
			<h2 class="status-title">GitHub Repos & Quick Actions</h2>
			<div class="cards-container">
				<div class="card-wrapper">
					<button class="github-repos-btn" onclick={toggleGithubCard}>View Repos</button>
					{#if showGithubCard}
						<CardWithList />
					{/if}
				</div>
				<div class="card-wrapper">
					<button class="quick-actions-btn" onclick={toggleQuickActionsCard}>Observability</button>
					{#if showQuickActionsCard}
						<QuickActionsCard />
					{/if}
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

<!-- Drawer Navigation -->
<DrawerNavigation isOpen={isDrawerOpen} on:close={closeDrawer} />

<style>
	/* Left Side Hover Trigger */
	.nav-trigger {
		position: fixed;
		top: 0;
		left: 0;
		width: 20px;
		height: 100vh;
		background: transparent;
		z-index: 40;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-trigger:hover {
		background: linear-gradient(to right, rgba(255, 107, 53, 0.1) 0%, transparent 100%);
		width: 40px;
	}

	.nav-trigger::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 60px;
		background: rgba(255, 107, 53, 0.3);
		border-radius: 0 3px 3px 0;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.nav-trigger:hover::before {
		opacity: 1;
		background: rgba(255, 107, 53, 0.6);
	}

	.page-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		margin-left: 20px; /* Account for hover trigger */
		color: var(--text-primary);
	}

	.hero-section {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem 0;
		position: relative;
	}

	.hero-title {
		font-size: 2.5rem;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.hero-subtitle {
		font-size: 1.2rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.welcome-message {
		font-size: 1.1rem;
		color: var(--success-color);
		font-weight: 600;
		background: var(--bg-card);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		display: inline-block;
		border: 1px solid var(--border-card);
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.dashboard-card {
		background: var(--bg-card);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--border-card);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.dashboard-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
	}

	.card-icon {
		font-size: 2rem;
		margin-bottom: 1rem;
		display: block;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.card-description {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.card-button {
		background: var(--primary-color);
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
		background: var(--primary-hover);
	}	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.nav-link {
		background: var(--primary-color);
		color: white;
		text-decoration: none;
		padding: 0.75rem 1.25rem;
		border-radius: 6px;
		font-weight: 600;
		transition: all 0.2s;
		display: inline-block;
	}

	.nav-link:hover {
		background: var(--primary-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
	}

	.status-section {
		background: var(--bg-card);
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		border: 1px solid var(--border-card);
	}

	.status-title {
		font-size: 1.5rem;
		color: var(--text-primary);
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
		background: var(--bg-tertiary);
		border-radius: 6px;
		border: 1px solid var(--border-secondary);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-dot.green {
		background: var(--success-color);
	}

	.status-label {
		color: var(--text-secondary);
		font-weight: 500;
		flex: 1;
	}

	.status-value {
		color: var(--text-primary);
		font-weight: 600;
		font-size: 0.9rem;
	}

	.debug-section {
		background: var(--bg-card);
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid var(--primary-color);
	}

	.debug-title {
		color: var(--text-primary);
		margin-bottom: 1rem;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.debug-info {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.debug-info p {
		margin-bottom: 0.25rem;
	}

	.debug-info strong {
		color: var(--text-primary);
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.nav-trigger {
			width: 15px;
		}

		.nav-trigger:hover {
			width: 30px;
		}

		.page-container {
			padding: 1rem;
			margin-left: 15px;
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
/* Github Repos Section Styling */
.github-repos-section {
	background: var(--bg-card);
	border-radius: 12px;
	border: 1px solid var(--border-card);
	margin-top: 2rem;
	margin-bottom: 2rem;
	padding: 1.5rem;
	box-shadow: var(--shadow-lg);
}

.cards-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	gap: 2rem;
	margin-top: 1rem;
}

.card-wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.github-repos-btn,
.quick-actions-btn {
	background: var(--primary-color);
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s, box-shadow 0.2s;
	margin-bottom: 1rem;
	box-shadow: 0 2px 6px rgba(255, 107, 53, 0.2);
	font-size: 1rem;
}

.github-repos-btn:hover,
.quick-actions-btn:hover {
	background: var(--primary-hover);
	box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.quick-actions-btn {
	background: var(--success-color);
	box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
}

.quick-actions-btn:hover {
	background: #059669;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.cards-container {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
}
</style>
