<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	
	const dispatch = createEventDispatcher();
	
	interface NavigationLink {
		href: string;
		label: string;
		description: string;
	}
	
	const navigationLinks: NavigationLink[] = [
		{ href: '/business', label: '🏢 Business', description: 'Manage business operations' },
		{ href: '/clubs', label: '🏟️ Clubs', description: 'Club management dashboard' },
		{ href: '/clubs/schedule', label: '📅 Schedule', description: 'View and manage schedules' },
		{ href: '/clubs/roster', label: '👥 Roster', description: 'Team member management' }
	];

	function closeDrawer() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeDrawer();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeDrawer();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div 
		class="drawer-backdrop" 
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="button"
		tabindex="-1"
		aria-label="Close navigation"
		transition:fly={{ x: -100, duration: 300 }}
	>
		<!-- Drawer -->
		<nav 
			class="drawer" 
			transition:fly={{ x: -300, duration: 300 }}
		>
			<div class="drawer-header">
				<h2 class="drawer-title">📚 BookWork Navigation</h2>
				<button 
					class="close-button"
					on:click={closeDrawer}
					aria-label="Close navigation"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			
			<div class="drawer-content">
				<ul class="nav-list">
					{#each navigationLinks as link}
						<li class="nav-item">
							<a 
								href={link.href} 
								class="nav-link"
								on:click={closeDrawer}
							>
								<span class="nav-label">{link.label}</span>
								<span class="nav-description">{link.description}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			
			<div class="drawer-footer">
				<p class="footer-text">BookWork Platform</p>
				<p class="footer-version">v1.0.0</p>
			</div>
		</nav>
	</div>
{/if}

<style>
	.drawer-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--bg-overlay);
		z-index: 1000;
		display: flex;
		align-items: flex-start;
	}

	.drawer {
		width: 320px;
		height: 100vh;
		background: var(--bg-card);
		box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		border-right: 1px solid var(--border-card);
	}

	.drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-card);
		background: var(--bg-tertiary);
		color: var(--text-primary);
	}

	.drawer-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0;
	}

	.close-button {
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		background: var(--bg-primary);
	}

	.drawer-content {
		flex: 1;
		padding: 1rem 0;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		margin: 0;
	}

	.nav-link {
		display: block;
		padding: 1rem 1.5rem;
		text-decoration: none;
		color: var(--text-primary);
		transition: background-color 0.2s;
		border-left: 3px solid transparent;
	}

	.nav-link:hover {
		background: var(--bg-tertiary);
		border-left-color: var(--primary-color);
	}

	.nav-label {
		display: block;
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.nav-description {
		display: block;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.drawer-footer {
		padding: 1.5rem;
		border-top: 1px solid var(--border-card);
		background: var(--bg-tertiary);
		text-align: center;
	}

	.footer-text {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
		color: var(--text-primary);
		font-size: 0.875rem;
	}

	.footer-version {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.drawer {
			width: 280px;
		}
		
		.drawer-header {
			padding: 1rem;
		}
		
		.drawer-title {
			font-size: 1.1rem;
		}
	}
</style>
