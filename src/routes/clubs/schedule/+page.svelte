<script>
	import { onMount } from 'svelte';
	import { scheduleEvents, scheduleLoading, scheduleError, currentClub, user } from '$lib/stores.js';
	import { fetchScheduleEvents } from '$lib/api.js';
	import { formatDate, formatTime } from '$lib/utils.js';
	import { Calendar, Clock, MapPin, BookOpen, Plus, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let currentDate = new Date();
	let selectedDate = null;
	let showEventModal = false;
	let showAddEventModal = false;
	let selectedEvent = null;
	let loading = false;
	let formErrors = {};

	let newEvent = {
		title: '',
		date: '',
		time: '',
		location: '',
		book: '',
		description: ''
	};

	onMount(async () => {
		if ($currentClub) {
			scheduleLoading.set(true);
			scheduleError.set(null);
			
			try {
				const events = await fetchScheduleEvents($currentClub.id);
				scheduleEvents.set(events);
			} catch (error) {
				scheduleError.set(error.message);
			} finally {
				scheduleLoading.set(false);
			}
		}
	});

	function validateEventForm(event) {
		const errors = {};
		
		if (!event.title?.trim()) {
			errors.title = 'Event title is required';
		} else if (event.title.length > 100) {
			errors.title = 'Event title must be less than 100 characters';
		}
		
		if (!event.date) {
			errors.date = 'Event date is required';
		} else if (new Date(event.date) < new Date().setHours(0,0,0,0)) {
			errors.date = 'Event date cannot be in the past';
		}
		
		if (!event.time) {
			errors.time = 'Event time is required';
		}

		if (!event.location?.trim()) {
			errors.location = 'Event location is required';
		}
		
		return errors;
	}

	function getCalendarDays() {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());
		
		const days = [];
		const current = new Date(startDate);
		
		for (let i = 0; i < 42; i++) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		
		return days;
	}

	function isCurrentMonth(date) {
		return date.getMonth() === currentDate.getMonth();
	}

	function isToday(date) {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	}

	function hasEvent(date) {
		const dateStr = date.toISOString().split('T')[0];
		return $scheduleEvents.some(event => event.date === dateStr);
	}

	function getEventsForDate(date) {
		const dateStr = date.toISOString().split('T')[0];
		return $scheduleEvents.filter(event => event.date === dateStr);
	}

	function previousMonth() {
		currentDate.setMonth(currentDate.getMonth() - 1);
		currentDate = new Date(currentDate);
	}

	function nextMonth() {
		currentDate.setMonth(currentDate.getMonth() + 1);
		currentDate = new Date(currentDate);
	}

	function selectDate(date) {
		selectedDate = date;
		const events = getEventsForDate(date);
		if (events.length > 0) {
			selectedEvent = events[0];
			showEventModal = true;
		}
	}

	function openAddEventModal() {
		showAddEventModal = true;
		newEvent = {
			title: '',
			date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
			time: '',
			location: '',
			book: '',
			description: ''
		};
	}

	function closeModals() {
		showEventModal = false;
		showAddEventModal = false;
		selectedEvent = null;
		formErrors = {};
		newEvent = {
			title: '',
			date: '',
			time: '',
			location: '',
			book: '',
			description: ''
		};
	}

	function addEvent() {
		formErrors = validateEventForm(newEvent);
		
		if (Object.keys(formErrors).length === 0) {
			loading = true;
			
			const event = {
				id: `event-${Date.now()}`,
				...newEvent,
				attendees: [$user.id]
			};
			
			// Simulate API call
			setTimeout(() => {
				scheduleEvents.update(events => [...events, event]);
				loading = false;
				closeModals();
			}, 500);
		}
	}

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<svelte:head>
	<title>Club Schedule - BookWorm</title>
</svelte:head>

<div class="container">
	<div class="page-header">
		<h1 class="page-title">Club Schedule</h1>
		{#if $currentClub}
			<p class="page-subtitle">{$currentClub.name}</p>
		{/if}
		{#if $user?.role === 'Club Lead' || $user?.role === 'Co-Lead'}
			<button class="btn btn-primary" on:click={openAddEventModal}>
				<Plus size={16} />
				Add Event
			</button>
		{/if}
	</div>

	{#if $scheduleLoading}
		<div class="loading-container">
			<div class="spinner"></div>
			<p>Loading schedule...</p>
		</div>
	{:else if $scheduleError}
		<div class="alert alert-error">
			<p>Error loading schedule: {$scheduleError}</p>
		</div>
	{:else}
		<div class="calendar-container card">
			<div class="calendar-header">
				<button class="nav-btn" on:click={previousMonth}>
					<ChevronLeft size={20} />
				</button>
				<h2 class="calendar-title">
					{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
				</h2>
				<button class="nav-btn" on:click={nextMonth}>
					<ChevronRight size={20} />
				</button>
			</div>

			<div class="calendar">
				<div class="calendar-grid">
					{#each dayNames as day}
						<div class="day-header">{day}</div>
					{/each}
					
					{#each getCalendarDays() as date}
						<button 
							class="calendar-day"
							class:other-month={!isCurrentMonth(date)}
							class:today={isToday(date)}
							class:has-event={hasEvent(date)}
							on:click={() => selectDate(date)}
						>
							<span class="day-number">{date.getDate()}</span>
							{#if hasEvent(date)}
								<div class="event-indicator"></div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="upcoming-events">
			<h2 class="section-title">Upcoming Events</h2>
			{#if $scheduleEvents.length === 0}
				<div class="empty-state card">
					<div class="card-body text-center">
						<Calendar size={48} />
						<h3>No Events Scheduled</h3>
						<p>No events are currently scheduled for this club.</p>
					</div>
				</div>
			{:else}
				<div class="events-list">
					{#each $scheduleEvents as event (event.id)}
						<div class="event-card card">
							<div class="card-body">
								<div class="event-header">
									<h3 class="event-title">{event.title}</h3>
									<div class="event-date">
										<Calendar size={16} />
										{formatDate(event.date)}
									</div>
								</div>
								
								<div class="event-details">
									<div class="event-detail">
										<Clock size={16} />
										<span>{formatTime(new Date(`${event.date}T${event.time}`))}</span>
									</div>
									{#if event.location}
										<div class="event-detail">
											<MapPin size={16} />
											<span>{event.location}</span>
										</div>
									{/if}
									{#if event.book}
										<div class="event-detail">
											<BookOpen size={16} />
											<span>{event.book}</span>
										</div>
									{/if}
								</div>

								{#if event.description}
									<p class="event-description">{event.description}</p>
								{/if}

								<div class="event-footer">
									<span class="attendee-count">
										{event.attendees.length} attending
									</span>
									<button 
										class="btn btn-outline btn-sm"
										on:click={() => { selectedEvent = event; showEventModal = true; }}
									>
										View Details
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Event Details Modal -->
{#if showEventModal && selectedEvent}
	<div 
		class="modal-overlay" 
		role="dialog"
		aria-modal="true"
		aria-label="Event details"
		on:click={closeModals}
		on:keydown={(e) => e.key === 'Escape' && closeModals()}
	>
		<div 
			class="modal" 
			role="document"
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Enter' && e.stopPropagation()}
		>
			<div class="modal-header">
				<h2>{selectedEvent.title}</h2>
				<button class="close-btn" on:click={closeModals}>×</button>
			</div>
			<div class="modal-body">
				<div class="event-details-full">
					<div class="detail-row">
						<Calendar size={20} />
						<span>{formatDate(selectedEvent.date)} at {formatTime(new Date(`${selectedEvent.date}T${selectedEvent.time}`))}</span>
					</div>
					{#if selectedEvent.location}
						<div class="detail-row">
							<MapPin size={20} />
							<span>{selectedEvent.location}</span>
						</div>
					{/if}
					{#if selectedEvent.book}
						<div class="detail-row">
							<BookOpen size={20} />
							<span>{selectedEvent.book}</span>
						</div>
					{/if}
				</div>
				{#if selectedEvent.description}
					<p class="event-description-full">{selectedEvent.description}</p>
				{/if}
				<div class="attendees-section">
					<h3>Attendees ({selectedEvent.attendees.length})</h3>
					<p>Members who will be attending this event.</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Add Event Modal -->
{#if showAddEventModal}
	<div 
		class="modal-overlay" 
		role="dialog"
		aria-modal="true"
		aria-label="Add new event"
		on:click={closeModals}
		on:keydown={(e) => e.key === 'Escape' && closeModals()}
	>
		<div 
			class="modal" 
			role="document"
			on:click|stopPropagation
			on:keydown={(e) => e.key === 'Enter' && e.stopPropagation()}
		>
			<div class="modal-header">
				<h2>Add New Event</h2>
				<button class="close-btn" on:click={closeModals}>×</button>
			</div>
			<div class="modal-body">
				<form on:submit|preventDefault={addEvent} class="event-form">
					<div class="form-group">
						<label class="form-label" for="title">Event Title *</label>
						<input 
							type="text" 
							id="title"
							class="form-input" 
							class:error={formErrors.title}
							bind:value={newEvent.title}
							required
						>
						{#if formErrors.title}
							<span class="form-error">{formErrors.title}</span>
						{/if}
					</div>
					
					<div class="form-row">
						<div class="form-group">
							<label class="form-label" for="date">Date *</label>
							<input 
								type="date" 
								id="date"
								class="form-input" 
								class:error={formErrors.date}
								bind:value={newEvent.date}
								required
							>
							{#if formErrors.date}
								<span class="form-error">{formErrors.date}</span>
							{/if}
						</div>
						<div class="form-group">
							<label class="form-label" for="time">Time *</label>
							<input 
								type="time" 
								id="time"
								class="form-input" 
								class:error={formErrors.time}
								bind:value={newEvent.time}
								required
							>
							{#if formErrors.time}
								<span class="form-error">{formErrors.time}</span>
							{/if}
						</div>
					</div>

					<div class="form-group">
						<label class="form-label" for="location">Location *</label>
						<input 
							type="text" 
							id="location"
							class="form-input" 
							class:error={formErrors.location}
							bind:value={newEvent.location}
							placeholder="Where will this event take place?"
							required
						>
						{#if formErrors.location}
							<span class="form-error">{formErrors.location}</span>
						{/if}
					</div>

					<div class="form-group">
						<label class="form-label" for="book">Book</label>
						<input 
							type="text" 
							id="book"
							class="form-input" 
							bind:value={newEvent.book}
							placeholder="Book being discussed (if any)"
						>
					</div>

					<div class="form-group">
						<label class="form-label" for="description">Description</label>
						<textarea 
							id="description"
							class="form-input" 
							bind:value={newEvent.description}
							rows="3"
							placeholder="Additional details about the event..."
						></textarea>
					</div>

					<div class="form-actions">
						<button type="button" class="btn btn-secondary" on:click={closeModals}>
							Cancel
						</button>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{#if loading}
								<div class="spinner-sm"></div>
								Adding Event...
							{:else}
								Add Event
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.page-title {
		font-size: 2.5rem;
		color: #1f2937;
		margin: 0;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: #6b7280;
		margin: 0;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;
	}

	.calendar-container {
		margin-bottom: 2rem;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.calendar-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.nav-btn:hover {
		background-color: #f3f4f6;
	}

	.calendar {
		padding: 1.5rem;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background-color: #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.day-header {
		background: #f9fafb;
		padding: 0.75rem;
		text-align: center;
		font-weight: 600;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.calendar-day {
		position: relative;
		background: white;
		border: none;
		padding: 0.75rem;
		height: 3rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.calendar-day:hover {
		background-color: #f3f4f6;
	}

	.calendar-day.other-month {
		color: #9ca3af;
		background-color: #f9fafb;
	}

	.calendar-day.today {
		background-color: #eff6ff;
		color: #2563eb;
		font-weight: 600;
	}

	.calendar-day.has-event {
		background-color: #fef3c7;
	}

	.calendar-day.has-event:hover {
		background-color: #fde68a;
	}

	.day-number {
		font-size: 0.875rem;
	}

	.event-indicator {
		position: absolute;
		bottom: 0.25rem;
		right: 0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		background-color: #3b82f6;
		border-radius: 50%;
	}

	.upcoming-events {
		margin-top: 2rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
	}

	.empty-state h3 {
		margin: 1rem 0 0.5rem;
		color: #6b7280;
	}

	.events-list {
		display: grid;
		gap: 1rem;
	}

	.event-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.event-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		gap: 1rem;
	}

	.event-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.event-date {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: #6b7280;
		font-size: 0.875rem;
		white-space: nowrap;
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
		gap: 0.5rem;
		color: #6b7280;
		font-size: 0.875rem;
	}

	.event-description {
		margin-bottom: 1rem;
		color: #4b5563;
		line-height: 1.5;
	}

	.event-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.attendee-count {
		font-size: 0.875rem;
		color: #6b7280;
	}

	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 1rem;
	}

	.modal {
		background: white;
		border-radius: 0.5rem;
		max-width: 500px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #1f2937;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #6b7280;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
	}

	.close-btn:hover {
		background-color: #f3f4f6;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.event-details-full {
		margin-bottom: 1.5rem;
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		color: #4b5563;
	}

	.event-description-full {
		margin-bottom: 1.5rem;
		line-height: 1.6;
		color: #4b5563;
	}

	.attendees-section h3 {
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.event-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.calendar-header {
			padding: 1rem;
		}

		.calendar {
			padding: 1rem;
		}

		.calendar-day {
			height: 2.5rem;
			padding: 0.5rem;
		}

		.event-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.event-details {
			flex-direction: column;
			gap: 0.5rem;
		}

		.event-footer {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}
	}

	.spinner-sm {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
	}

	.form-error {
		color: var(--error-color);
		font-size: 0.875rem;
		margin-top: 0.25rem;
		display: block;
	}

	.form-input.error {
		border-color: var(--error-color);
		box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
