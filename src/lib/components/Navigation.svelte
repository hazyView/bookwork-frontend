<script>
	import { page } from '$app/stores';
	import { user, isAuthenticated, chatOpen } from '$lib/stores.js';
	import { Menu, X, BookOpen, MessageCircle } from 'lucide-svelte';

	let mobileMenuOpen = false;

	const navigation = [
		{ name: 'Home', href: '/', public: true },
		{ name: 'For Clubs', href: '/clubs', public: false, children: [
			{ name: 'Club Roster', href: '/clubs/roster' },
			{ name: 'Schedule', href: '/clubs/schedule' },
			{ name: 'Availability', href: '/clubs/availability' },
			{ name: 'Tracking', href: '/clubs/tracking' }
		]},
		{ name: 'For Business', href: '/business', public: true, children: [
			{ name: 'Services', href: '/business/services' },
			{ name: 'Community', href: '/business/community' },
			{ name: 'Company', href: '/business/company' },
			{ name: 'About Us', href: '/business/about' },
			{ name: 'Website Builder', href: '/business/website-builder' }
		]},
		{ name: 'Support', href: '/support', public: true },
		{ name: 'Blog', href: '/blog', public: true }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function toggleChat() {
		chatOpen.update(n => !n);
	}
</script>

<nav class="navigation">
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/" class="brand-link">
				<BookOpen size={24} />
				<span class="brand-text">BookWorm</span>
			</a>
		</div>

		<!-- Desktop Navigation -->
		<div class="nav-menu">
			{#each navigation as item}
				{#if item.public || $isAuthenticated}
					<div class="nav-item-wrapper">
						<a 
							href={item.href} 
							class="nav-item"
							class:active={$page.url.pathname.startsWith(item.href) && item.href !== '/'}
						>
							{item.name}
						</a>
						{#if item.children}
							<div class="dropdown">
								{#each item.children as child}
									<a href={child.href} class="dropdown-item">
										{child.name}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>

		<!-- Mobile menu button -->
		<button class="mobile-menu-btn" on:click={toggleMobileMenu}>
			{#if mobileMenuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>

		<!-- Chat toggle button -->
		<button class="chat-btn" on:click={toggleChat} title="Open Chat Support">
			<MessageCircle size={20} />
		</button>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="mobile-menu">
			{#each navigation as item}
				{#if item.public || $isAuthenticated}
					<a 
						href={item.href} 
						class="mobile-nav-item"
						on:click={closeMobileMenu}
					>
						{item.name}
					</a>
					{#if item.children}
						{#each item.children as child}
							<a 
								href={child.href} 
								class="mobile-nav-subitem"
								on:click={closeMobileMenu}
							>
								{child.name}
							</a>
						{/each}
					{/if}
				{/if}
			{/each}
		</div>
	{/if}
</nav>

<style>
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: white;
		border-bottom: 1px solid #e5e7eb;
		z-index: 50;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 4rem;
	}

	.nav-brand {
		display: flex;
		align-items: center;
	}

	.brand-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: #3b82f6;
		text-decoration: none;
	}

	.brand-link:hover {
		color: #1d4ed8;
		text-decoration: none;
	}

	.brand-text {
		color: #1f2937;
	}

	.nav-menu {
		display: none;
		align-items: center;
		gap: 2rem;
	}

	.nav-item-wrapper {
		position: relative;
	}

	.nav-item {
		display: block;
		padding: 0.5rem 0;
		color: #4b5563;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.nav-item:hover,
	.nav-item.active {
		color: #3b82f6;
		text-decoration: none;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		min-width: 200px;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-10px);
		transition: all 0.2s ease;
		z-index: 60;
	}

	.nav-item-wrapper:hover .dropdown {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	.dropdown-item {
		display: block;
		padding: 0.75rem 1rem;
		color: #4b5563;
		text-decoration: none;
		font-size: 0.875rem;
		transition: background-color 0.2s ease;
	}

	.dropdown-item:hover {
		background-color: #f3f4f6;
		text-decoration: none;
	}

	.mobile-menu-btn,
	.chat-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: #4b5563;
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.2s ease;
	}

	.mobile-menu-btn:hover,
	.chat-btn:hover {
		background-color: #f3f4f6;
		color: #3b82f6;
	}

	.chat-btn {
		margin-left: 0.5rem;
	}

	.mobile-menu {
		display: block;
		padding: 1rem;
		background: white;
		border-top: 1px solid #e5e7eb;
	}

	.mobile-nav-item,
	.mobile-nav-subitem {
		display: block;
		padding: 0.75rem 0;
		color: #4b5563;
		text-decoration: none;
		font-weight: 500;
		border-bottom: 1px solid #f3f4f6;
	}

	.mobile-nav-subitem {
		padding-left: 1rem;
		font-size: 0.875rem;
		font-weight: 400;
	}

	.mobile-nav-item:hover,
	.mobile-nav-subitem:hover {
		color: #3b82f6;
		text-decoration: none;
	}

	@media (min-width: 768px) {
		.nav-menu {
			display: flex;
		}

		.mobile-menu-btn {
			display: none;
		}

		.mobile-menu {
			display: none;
		}
	}
</style>
