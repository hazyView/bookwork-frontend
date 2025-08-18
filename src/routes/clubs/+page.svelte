<script>
	import { currentClub, user, scheduleEvents, clubMembers } from '$lib/stores';
	import { Users, Calendar, CheckCircle, Package, BookOpen, Clock, MapPin } from 'lucide-svelte';
	import { formatDate, formatTime } from '$lib/utils';
	import DrawerNavigation from '$lib/components/DrawerNavigation.svelte';

	let isDrawerOpen = false;

	function openDrawer() {
		isDrawerOpen = true;
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	// Get next upcoming event
	function getNextEvent() {
		const now = new Date();
		const upcoming = $scheduleEvents
			.filter(event => new Date(event.date) >= now)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
		return upcoming[0] || null;
	}

	// Get recent activity
	function getRecentActivity() {
		const activities = [
			{
				type: 'member_joined',
				message: 'Sarah Wilson joined the club',
				time: '2 days ago',
				icon: Users
			},
			{
				type: 'event_scheduled',
				message: 'Monthly Book Discussion scheduled',
				time: '3 days ago',
				icon: Calendar
			},
			{
				type: 'item_added',
				message: 'Jane added "Coffee and tea" to bring',
				time: '1 day ago',
				icon: Package
			},
			{
				type: 'book_selected',
				message: 'New book selection: "The Seven Husbands of Evelyn Hugo"',
				time: '1 week ago',
				icon: BookOpen
			}
		];
		return activities;
	}
</script>

<svelte:head>
	<title>Club Dashboard - BookWorm</title>
</svelte:head>

<div class="container">
	<div class="dashboard-header">
		<div class="header-controls">
			<button class="drawer-toggle" onclick={openDrawer} aria-label="Open navigation menu">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
				Menu
			</button>
		</div>
		<div class="welcome-section">
			<h1 class="welcome-title">Welcome back, {$user?.name || 'Member'}!</h1>
			{#if $currentClub}
				<p class="club-name">{$currentClub.name}</p>
				<p class="club-description">{$currentClub.description}</p>
			{/if}
		</div>
	</div>

	<div class="dashboard-grid">
		<!-- Quick Stats -->
		<div class="stats-section">
			<h2 class="section-title">Club Overview</h2>
			<div class="stats-grid">
				<div class="stat-card card">
					<div class="card-body">
						<div class="stat-content">
							<div class="stat-icon">
								<Users size={24} />
							</div>
							<div class="stat-info">
								<span class="stat-number">{$clubMembers.length}</span>
								<span class="stat-label">Members</span>
							</div>
						</div>
						<a href="/clubs/roster" class="stat-link">View Roster</a>
					</div>
				</div>

				<div class="stat-card card">
					<div class="card-body">
						<div class="stat-content">
							<div class="stat-icon">
								<Calendar size={24} />
							</div>
							<div class="stat-info">
								<span class="stat-number">{$scheduleEvents.length}</span>
								<span class="stat-label">Scheduled Events</span>
							</div>
						</div>
						<a href="/clubs/schedule" class="stat-link">View Schedule</a>
					</div>
				</div>

				<div class="stat-card card">
					<div class="card-body">
						<div class="stat-content">
							<div class="stat-icon">
								<CheckCircle size={24} />
							</div>
							<div class="stat-info">
								<span class="stat-number">85%</span>
								<span class="stat-label">Attendance Rate</span>
							</div>
						</div>
						<a href="/clubs/availability" class="stat-link">Check Availability</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Next Event -->
		<div class="next-event-section">
			<h2 class="section-title">Next Event</h2>
			{#if getNextEvent()}
				{@const nextEvent = getNextEvent()}
				<div class="event-card card">
					<div class="card-body">
						<h3 class="event-title">{nextEvent.title}</h3>
						<div class="event-details">
							<div class="event-detail">
								<Calendar size={16} />
								<span>{formatDate(nextEvent.date)}</span>
							</div>
							<div class="event-detail">
								<Clock size={16} />
								<span>{formatTime(new Date(`${nextEvent.date}T${nextEvent.time}`))}</span>
							</div>
							{#if nextEvent.location}
								<div class="event-detail">
									<MapPin size={16} />
									<span>{nextEvent.location}</span>
								</div>
							{/if}
							{#if nextEvent.book}
								<div class="event-detail">
									<BookOpen size={16} />
									<span>{nextEvent.book}</span>
								</div>
							{/if}
						</div>
						{#if nextEvent.description}
							<p class="event-description">{nextEvent.description}</p>
						{/if}
						<div class="event-actions">
							<a href="/clubs/availability" class="btn btn-primary btn-sm">
								Set Availability
							</a>
							<a href="/clubs/tracking" class="btn btn-outline btn-sm">
								<Package size={14} />
								Add Items
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="no-event card">
					<div class="card-body text-center">
						<Calendar size={48} />
						<h3>No Upcoming Events</h3>
						<p>No events are currently scheduled.</p>
						<a href="/clubs/schedule" class="btn btn-primary">
							View Schedule
						</a>
					</div>
				</div>
			{/if}
		</div>

		<!-- Recent Activity -->
		<div class="activity-section">
			<h2 class="section-title">Recent Activity</h2>
			<div class="activity-list card">
				<div class="card-body">
					{#each getRecentActivity() as activity}
						<div class="activity-item">
							<div class="activity-icon">
								<svelte:component this={activity.icon} size={16} />
							</div>
							<div class="activity-content">
								<p class="activity-message">{activity.message}</p>
								<span class="activity-time">{activity.time}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="actions-section">
			<h2 class="section-title">Quick Actions</h2>
			<div class="actions-grid">
				<a href="/clubs/roster" class="action-card card">
					<div class="card-body">
						<Users size={24} />
						<span>View Members</span>
					</div>
				</a>
				<a href="/clubs/schedule" class="action-card card">
					<div class="card-body">
						<Calendar size={24} />
						<span>Schedule</span>
					</div>
				</a>
				<a href="/clubs/availability" class="action-card card">
					<div class="card-body">
						<CheckCircle size={24} />
						<span>Availability</span>
					</div>
				</a>
				<a href="/clubs/tracking" class="action-card card">
					<div class="card-body">
						<Package size={24} />
						<span>Item Tracking</span>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.dashboard-header {
		margin-bottom: 2rem;
		text-align: center;
		position: relative;
	}

	.header-controls {
		position: absolute;
		top: 0;
		left: 0;
	}

	.drawer-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--primary-color, #3b82f6);
		color: white;
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.9rem;
		box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
	}

	.drawer-toggle:hover {
		background: #2563eb;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.drawer-toggle svg {
		width: 20px;
		height: 20px;
	}

	.welcome-title {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.club-name {
		font-size: 1.5rem;
		font-weight: 600;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.club-description {
		font-size: 1.125rem;
		color: #6b7280;
		max-width: 600px;
		margin: 0 auto;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	/* Stats Section */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
	}

	.stat-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 0.75rem;
	}

	.stat-info {
		flex: 1;
	}

	.stat-number {
		display: block;
		font-size: 1.75rem;
		font-weight: 700;
		color: #1f2937;
		line-height: 1;
	}

	.stat-label {
		display: block;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.stat-link {
		color: #3b82f6;
		font-size: 0.875rem;
		text-decoration: none;
		font-weight: 500;
	}

	.stat-link:hover {
		text-decoration: underline;
	}

	/* Next Event Section */
	.event-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.event-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
	}

	.event-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.event-details {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.event-detail {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.event-description {
		color: #4b5563;
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.event-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.no-event {
		text-align: center;
		padding: 2rem;
	}

	.no-event h3 {
		margin: 1rem 0 0.5rem;
		color: #6b7280;
	}

	/* Activity Section */
	.activity-list {
		max-height: 400px;
		overflow-y: auto;
	}

	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 0.5rem;
		flex-shrink: 0;
	}

	.activity-content {
		flex: 1;
	}

	.activity-message {
		margin: 0 0 0.25rem;
		color: #1f2937;
		font-size: 0.875rem;
	}

	.activity-time {
		font-size: 0.75rem;
		color: #6b7280;
	}

	/* Quick Actions */
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
	}

	.action-card {
		text-decoration: none;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.action-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
		text-decoration: none;
	}

	.action-card .card-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		color: #4b5563;
		padding: 1.5rem 1rem;
	}

	.action-card:hover .card-body {
		color: #3b82f6;
	}

	.action-card span {
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (min-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 2fr 1fr;
			grid-template-areas: 
				"stats actions"
				"event activity";
		}

		.stats-section {
			grid-area: stats;
		}

		.next-event-section {
			grid-area: event;
		}

		.activity-section {
			grid-area: activity;
		}

		.actions-section {
			grid-area: actions;
		}
	}

	@media (min-width: 1024px) {
		.dashboard-grid {
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-areas: 
				"stats stats actions"
				"event activity activity";
		}
	}

	@media (max-width: 768px) {
		.header-controls {
			position: static;
			text-align: left;
			margin-bottom: 1rem;
		}
		
		.drawer-toggle {
			align-self: flex-start;
		}

		.event-details {
			flex-direction: column;
			gap: 0.5rem;
		}

		.event-actions {
			flex-direction: column;
		}

		.actions-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>

<!-- Drawer Navigation -->
<DrawerNavigation isOpen={isDrawerOpen} on:close={closeDrawer} />
