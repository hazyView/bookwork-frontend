<script>
	import { onMount } from 'svelte';
	import { scheduleEvents, meetingAvailability, user, currentClub } from '$lib/stores';
	import { updateAvailability } from '$lib/api';
	import { formatDate, formatTime } from '$lib/utils';
	import { Calendar, Clock, MapPin, Users, Check, X, User } from 'lucide-svelte';
	import DrawerNavigation from '$lib/components/DrawerNavigation.svelte';

	let isDrawerOpen = false;

	function openDrawer() {
		isDrawerOpen = true;
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	let loading = false;
	let error = null;

	onMount(async () => {
		// Initialize availability data
		if ($scheduleEvents.length === 0) {
			// Load mock events if not already loaded
			scheduleEvents.set([
				{
					id: 'event-1',
					title: 'Monthly Book Discussion',
					date: '2025-07-25',
					time: '19:00',
					location: 'Central Library - Meeting Room A',
					book: 'The Seven Husbands of Evelyn Hugo',
					description: 'Our monthly discussion of this captivating novel about a reclusive Hollywood icon.',
					attendees: ['1', '2', '3', '4']
				},
				{
					id: 'event-2',
					title: 'Book Selection Meeting',
					date: '2025-08-08',
					time: '18:30',
					location: 'Coffee Corner Café',
					book: '',
					description: 'Choose our next book and discuss reading timeline.',
					attendees: ['1', '2', '5']
				},
				{
					id: 'event-3',
					title: 'Author Meet & Greet',
					date: '2025-08-15',
					time: '15:00',
					location: 'Downtown Bookstore',
					book: 'The Thursday Murder Club',
					description: 'Special event with local author discussing mystery writing.',
					attendees: ['1', '2', '3', '4', '5']
				}
			]);
		}

		// Initialize availability responses
		meetingAvailability.set({
			'event-1': {
				userId: $user.id,
				status: 'yes',
				responses: {
					'1': { name: 'John Doe', status: 'yes' },
					'2': { name: 'Jane Smith', status: 'yes' },
					'3': { name: 'Mike Johnson', status: 'no' },
					'4': { name: 'Sarah Wilson', status: 'yes' },
					'5': { name: 'David Brown', status: 'pending' }
				}
			},
			'event-2': {
				userId: $user.id,
				status: 'pending',
				responses: {
					'1': { name: 'John Doe', status: 'pending' },
					'2': { name: 'Jane Smith', status: 'yes' },
					'3': { name: 'Mike Johnson', status: 'pending' },
					'4': { name: 'Sarah Wilson', status: 'no' },
					'5': { name: 'David Brown', status: 'yes' }
				}
			},
			'event-3': {
				userId: $user.id,
				status: 'yes',
				responses: {
					'1': { name: 'John Doe', status: 'yes' },
					'2': { name: 'Jane Smith', status: 'yes' },
					'3': { name: 'Mike Johnson', status: 'yes' },
					'4': { name: 'Sarah Wilson', status: 'pending' },
					'5': { name: 'David Brown', status: 'yes' }
				}
			}
		});
	});

	async function setAvailability(eventId, status) {
		loading = true;
		error = null;

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 500));
			
			meetingAvailability.update(availability => ({
				...availability,
				[eventId]: {
					...availability[eventId],
					status,
					responses: {
						...availability[eventId]?.responses,
						[$user.id]: { name: $user.name, status }
					}
				}
			}));
		} catch (err) {
			error = `Failed to update availability: ${err.message}`;
		} finally {
			loading = false;
		}
	}

	function getUpcomingEvents() {
		const now = new Date();
		return $scheduleEvents
			.filter(event => new Date(event.date) >= now)
			.sort((a, b) => new Date(a.date) - new Date(b.date));
	}

	function getAvailabilityForEvent(eventId) {
		return $meetingAvailability[eventId] || { status: 'pending', responses: {} };
	}

	function getResponseCounts(responses) {
		const counts = { yes: 0, no: 0, pending: 0 };
		Object.values(responses).forEach(response => {
			counts[response.status]++;
		});
		return counts;
	}

	function getStatusClass(status) {
		switch (status) {
			case 'yes': return 'status-yes';
			case 'no': return 'status-no';
			default: return 'status-pending';
		}
	}

	function getStatusIcon(status) {
		switch (status) {
			case 'yes': return Check;
			case 'no': return X;
			default: return User;
		}
	}
</script>

<svelte:head>
	<title>Meeting Availability - BookWorm</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<div class="header-controls">
			<button 
				class="menu-btn" 
				on:click={toggleDrawer}
				aria-label="Open navigation menu"
				aria-expanded={isDrawerOpen}
			>
				<Menu size={24} />
			</button>
		</div>
		<h1 class="page-title">Meeting Availability</h1>
		{#if $currentClub}
			<p class="page-subtitle">{$currentClub.name}</p>
		{/if}
	</div>

	{#if error}
		<div class="alert alert-error">
			<p>{error}</p>
		</div>
	{/if}

	<div class="availability-section">
		<h2 class="section-title">Upcoming Meetings</h2>
		<p class="section-description">
			Let your club members know if you'll be attending upcoming meetings. 
			Your responses help organizers plan better events.
		</p>

		{#if getUpcomingEvents().length === 0}
			<div class="empty-state card">
				<div class="card-body text-center">
					<Calendar size={48} />
					<h3>No Upcoming Meetings</h3>
					<p>There are no upcoming meetings scheduled. Check the schedule page for more information.</p>
					<a href="/clubs/schedule" class="btn btn-primary">
						View Schedule
					</a>
				</div>
			</div>
		{:else}
			<div class="meetings-list">
				{#each getUpcomingEvents() as event (event.id)}
					{@const availability = getAvailabilityForEvent(event.id)}
					{@const responseCounts = getResponseCounts(availability.responses)}
					
					<div class="meeting-card card">
						<div class="card-body">
							<div class="meeting-header">
								<div class="meeting-info">
									<h3 class="meeting-title">{event.title}</h3>
									<div class="meeting-meta">
										<div class="meta-item">
											<Calendar size={16} />
											<span>{formatDate(event.date)}</span>
										</div>
										<div class="meta-item">
											<Clock size={16} />
											<span>{formatTime(new Date(`${event.date}T${event.time}`))}</span>
										</div>
										{#if event.location}
											<div class="meta-item">
												<MapPin size={16} />
												<span>{event.location}</span>
											</div>
										{/if}
									</div>
								</div>

								<div class="attendance-summary">
									<div class="summary-item summary-yes">
										<Check size={16} />
										<span>{responseCounts.yes}</span>
									</div>
									<div class="summary-item summary-no">
										<X size={16} />
										<span>{responseCounts.no}</span>
									</div>
									<div class="summary-item summary-pending">
										<User size={16} />
										<span>{responseCounts.pending}</span>
									</div>
								</div>
							</div>

							{#if event.description}
								<p class="meeting-description">{event.description}</p>
							{/if}

							<div class="availability-controls">
								<div class="availability-question">
									<span>Will you be attending this meeting?</span>
								</div>
								
								<div class="availability-buttons">
									<button 
										class="availability-btn btn-yes"
										class:active={availability.status === 'yes'}
										disabled={loading}
										on:click={() => setAvailability(event.id, 'yes')}
									>
										<Check size={16} />
										Yes, I'll be there
									</button>
									<button 
										class="availability-btn btn-no"
										class:active={availability.status === 'no'}
										disabled={loading}
										on:click={() => setAvailability(event.id, 'no')}
									>
										<X size={16} />
										Can't make it
									</button>
								</div>

								{#if availability.status !== 'pending'}
									<div class="current-status">
										<span class="status-indicator {getStatusClass(availability.status)}">
											<svelte:component this={getStatusIcon(availability.status)} size={14} />
											{availability.status === 'yes' ? 'You\'re attending' : 'You\'re not attending'}
										</span>
									</div>
								{/if}
							</div>

							<div class="responses-section">
								<h4 class="responses-title">Member Responses</h4>
								<div class="responses-grid">
									{#each Object.entries(availability.responses) as [userId, response] (userId)}
										<div class="response-item">
											<span class="member-name">{response.name}</span>
											<span class="response-status {getStatusClass(response.status)}">
												<svelte:component this={getStatusIcon(response.status)} size={12} />
												{response.status === 'yes' ? 'Attending' : response.status === 'no' ? 'Not attending' : 'Pending'}
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.page-title {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.availability-section {
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.section-description {
		color: #6b7280;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
	}

	.empty-state h3 {
		margin: 1rem 0 0.5rem;
		color: #6b7280;
	}

	.meetings-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.meeting-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.meeting-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
	}

	.meeting-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.meeting-info {
		flex: 1;
	}

	.meeting-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.meeting-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.attendance-summary {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.summary-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.summary-yes {
		color: #059669;
	}

	.summary-no {
		color: #dc2626;
	}

	.summary-pending {
		color: #6b7280;
	}

	.meeting-description {
		margin-bottom: 1.5rem;
		color: #4b5563;
		line-height: 1.5;
	}

	.availability-controls {
		background: #f9fafb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.availability-question {
		margin-bottom: 1rem;
		font-weight: 500;
		color: #1f2937;
	}

	.availability-buttons {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.availability-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		background: white;
		color: #6b7280;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.availability-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.btn-yes.active {
		border-color: #059669;
		background: #ecfdf5;
		color: #059669;
	}

	.btn-no.active {
		border-color: #dc2626;
		background: #fef2f2;
		color: #dc2626;
	}

	.availability-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.current-status {
		text-align: center;
	}

	.status-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.status-yes {
		background: #ecfdf5;
		color: #059669;
	}

	.status-no {
		background: #fef2f2;
		color: #dc2626;
	}

	.status-pending {
		background: #f3f4f6;
		color: #6b7280;
	}

	.responses-section {
		border-top: 1px solid #e5e7eb;
		padding-top: 1.5rem;
	}

	.responses-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.responses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.response-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.75rem;
		background: white;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
	}

	.member-name {
		font-weight: 500;
		color: #1f2937;
	}

	.response-status {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.meeting-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.meeting-meta {
			flex-direction: column;
			gap: 0.5rem;
		}

		.attendance-summary {
			align-self: flex-start;
		}

		.availability-buttons {
			flex-direction: column;
		}

		.responses-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Header controls styles */
	.header-controls {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
	}

	.menu-btn {
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #374151;
		transition: all 0.2s ease;
	}

	.menu-btn:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	.menu-btn:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.header-controls {
			top: 0.5rem;
			left: 0.5rem;
		}
		
		.menu-btn {
			padding: 0.375rem;
		}
	}
</style>

<DrawerNavigation {isDrawerOpen} on:close={closeDrawer} />
